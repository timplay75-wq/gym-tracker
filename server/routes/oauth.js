import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OAuthCode from '../models/OAuthCode.js';
import { asString } from '../utils/sanitize.js';
import { strictLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

// Читаем лениво: ESM-импорты выполняются до dotenv.config() в server.js,
// поэтому на момент загрузки модуля переменных из .env ещё нет.
const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';
const backendUrl = () => process.env.BACKEND_URL || 'http://localhost:5000';

const STATE_COOKIE = 'oauth_state';
const STATE_COOKIE_PATH = '/api/oauth';
const STATE_TTL_MS = 10 * 60 * 1000;

// Одноразовый код живёт ровно столько, сколько нужно фронтенду, чтобы
// обменять его сразу после редиректа.
const CODE_TTL_MS = 2 * 60 * 1000;

// ─── Helpers ──────────────────────────────────────────

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function parseCookies(header) {
  const jar = {};
  if (!header) return jar;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) jar[key] = decodeURIComponent(value);
  }
  return jar;
}

/**
 * Одноразовые коды хранятся в MongoDB, а не в памяти процесса.
 *
 * На serverless выдача кода и его обмен попадают в разные экземпляры функции,
 * и код из локальной Map просто не нашёлся бы. Побочная выгода: findOneAndDelete
 * атомарен, поэтому одноразовость гарантирована даже при гонке запросов.
 */
async function issueAuthCode(userId, nonce) {
  const code = crypto.randomBytes(32).toString('hex');
  await OAuthCode.create({
    code,
    userId,
    nonce,
    expiresAt: new Date(Date.now() + CODE_TTL_MS),
  });
  return code;
}

async function consumeAuthCode(code) {
  // Забираем и удаляем одной операцией — повторный обмен невозможен
  const entry = await OAuthCode.findOneAndDelete({ code });
  if (!entry) return null;
  if (entry.expiresAt.getTime() < Date.now()) return null;
  return { userId: String(entry.userId), nonce: entry.nonce };
}

/** nonce генерирует фронтенд; принимаем только hex, чтобы не ломать разделитель в cookie. */
function normalizeNonce(value) {
  const str = asString(value);
  return str && /^[a-f\d]{16,64}$/i.test(str) ? str.toLowerCase() : null;
}

/**
 * Начинает OAuth-поток.
 *
 * В httpOnly-cookie кладём "state.nonce":
 *  - state сверяется с тем, что вернёт провайдер, — это защита от подсунутого
 *    злоумышленником authorization code;
 *  - nonce генерирует фронтенд и держит у себя в sessionStorage. Он привязывает
 *    выданный одноразовый код к конкретному браузеру, поэтому ссылка вида
 *    /oauth-callback?code=<чужой код> у жертвы не сработает.
 */
function beginOAuth(req, res, buildUrl) {
  const state = crypto.randomBytes(32).toString('hex');
  const nonce = normalizeNonce(req.query?.nonce) || '';
  res.cookie(STATE_COOKIE, `${state}.${nonce}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // переживает возврат по редиректу от провайдера
    maxAge: STATE_TTL_MS,
    path: STATE_COOKIE_PATH,
  });
  res.redirect(buildUrl(state));
}

/**
 * Сверяет state из query с тем, что лежит в cookie.
 * Возвращает { ok, nonce } — nonce нужен, чтобы связать с ним выданный код.
 */
function checkState(req, res) {
  const fromQuery = asString(req.query?.state);
  const cookieValue = parseCookies(req.headers.cookie)[STATE_COOKIE];

  res.clearCookie(STATE_COOKIE, { path: STATE_COOKIE_PATH });

  if (!fromQuery || !cookieValue) return { ok: false };

  const separator = cookieValue.indexOf('.');
  const cookieState = separator === -1 ? cookieValue : cookieValue.slice(0, separator);
  const nonce = separator === -1 ? '' : cookieValue.slice(separator + 1);

  const a = Buffer.from(fromQuery, 'utf8');
  const b = Buffer.from(cookieState, 'utf8');
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  return { ok, nonce };
}

async function sendAuthCode(res, user, nonce) {
  const code = await issueAuthCode(user._id, nonce);
  // В query уходит только одноразовый код. JWT здесь быть не должно:
  // строка URL оседает в истории браузера, в Referer и в логах прокси.
  res.redirect(`${frontendUrl()}/oauth-callback?code=${encodeURIComponent(code)}`);
}

function sendErrorPage(res, message) {
  const params = new URLSearchParams({ error: message });
  res.redirect(`${frontendUrl()}/login?${params.toString()}`);
}

/**
 * Находит или создаёт пользователя под OAuth-провайдера.
 *
 * К уже существующему аккаунту провайдер привязывается ТОЛЬКО если email
 * подтверждён на стороне провайдера. Иначе достаточно было добавить чужой
 * адрес в свой профиль у провайдера, чтобы войти в чужой аккаунт.
 */
async function findOrCreateOAuthUser({ provider, oauthId, email, emailVerified, name, avatar }) {
  // 1. Ищем по oauthProvider + oauthId
  let user = await User.findOne({ oauthProvider: provider, oauthId: String(oauthId) });
  if (user) return { user };

  // 2. Аккаунт с таким email уже есть — привязываем только при верификации
  if (email) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!emailVerified) {
        return {
          error: 'Аккаунт с таким email уже существует. Войдите паролем и привяжите вход в профиле.',
        };
      }
      existing.oauthProvider = provider;
      existing.oauthId = String(oauthId);
      if (avatar && !existing.avatar) existing.avatar = avatar;
      await existing.save();
      return { user: existing };
    }
  }

  // 3. Создаём нового пользователя
  user = await User.create({
    name: name || 'User',
    email: email || `${provider}_${oauthId}@oauth.local`,
    oauthProvider: provider,
    oauthId: String(oauthId),
    avatar: avatar || null,
  });
  return { user };
}

/** Общий хвост колбэка: проверка state → поиск юзера → одноразовый код. */
async function completeOAuth(req, res, profileLoader) {
  const { ok, nonce } = checkState(req, res);
  if (!ok) {
    return sendErrorPage(res, 'Неверный state — попробуйте войти заново');
  }

  const code = asString(req.query?.code);
  if (!code) return sendErrorPage(res, 'No authorization code');

  const result = await profileLoader(code);
  if (result.error) return sendErrorPage(res, result.error);

  const { user, error } = await findOrCreateOAuthUser(result);
  if (error) return sendErrorPage(res, error);

  await sendAuthCode(res, user, nonce);
}

// ═══════════════════════════════════════════════════════
// Обмен одноразового кода на JWT
// ═══════════════════════════════════════════════════════

router.post('/exchange', async (req, res) => {
  try {
    const code = asString(req.body?.code);
    if (!code) return res.status(400).json({ message: 'Код обязателен' });

    const entry = await consumeAuthCode(code);
    if (!entry) return res.status(400).json({ message: 'Код недействителен или истёк' });

    // Код действителен только в том браузере, который начинал вход: иначе
    // достаточно было прислать жертве ссылку со своим кодом, чтобы она
    // молча вошла в чужой аккаунт.
    //
    // Пустой nonce не принимаем с обеих сторон: иначе злоумышленник начинает
    // поток без nonce, получает код, привязанный к '', и он совпадает с пустым
    // sessionStorage жертвы.
    const nonce = normalizeNonce(req.body?.nonce);
    if (!nonce || !entry.nonce || nonce !== entry.nonce) {
      return res.status(400).json({ message: 'Код выдан другому сеансу' });
    }

    const user = await User.findById(entry.userId);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    console.error('OAuth exchange error:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ═══════════════════════════════════════════════════════
// GOOGLE
// ═══════════════════════════════════════════════════════

router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ message: 'Google OAuth not configured' });

  const redirectUri = `${backendUrl()}/api/oauth/google/callback`;
  const scope = encodeURIComponent('openid email profile');
  beginOAuth(req, res, (state) =>
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account&state=${state}`
  );
});

router.get('/google/callback', strictLimiter, async (req, res) => {
  try {
    await completeOAuth(req, res, async (code) => {
      const redirectUri = `${backendUrl()}/api/oauth/google/callback`;

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });
      const tokens = await tokenRes.json();
      if (tokens.error) return { error: tokens.error_description || tokens.error };

      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const profile = await userRes.json();
      if (!profile.id) return { error: 'Не удалось получить профиль Google' };

      return {
        provider: 'google',
        oauthId: profile.id,
        email: profile.email,
        emailVerified: profile.verified_email === true || profile.email_verified === true,
        name: profile.name,
        avatar: profile.picture,
      };
    });
  } catch (err) {
    console.error('Google OAuth error:', err);
    sendErrorPage(res, 'OAuth failed');
  }
});

// ═══════════════════════════════════════════════════════
// GITHUB
// ═══════════════════════════════════════════════════════

router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return res.status(500).json({ message: 'GitHub OAuth not configured' });

  const redirectUri = `${backendUrl()}/api/oauth/github/callback`;
  beginOAuth(req, res, (state) =>
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`
  );
});

router.get('/github/callback', strictLimiter, async (req, res) => {
  try {
    await completeOAuth(req, res, async (code) => {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const tokenData = await tokenRes.json();
      if (tokenData.error) return { error: tokenData.error_description || tokenData.error };

      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'GymTracker' },
      });
      const profile = await userRes.json();
      if (!profile.id) return { error: 'Не удалось получить профиль GitHub' };

      // Берём только подтверждённый основной адрес. Прежний фallback на
      // emails[0] отдавал неподтверждённый адрес, пригодный для захвата чужого
      // аккаунта. profile.email из /user тоже не несёт признака верификации.
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'GymTracker' },
      });
      const emails = await emailsRes.json();
      const verifiedPrimary = Array.isArray(emails)
        ? emails.find(e => e.primary && e.verified)
        : null;

      return {
        provider: 'github',
        oauthId: String(profile.id),
        email: verifiedPrimary?.email || null,
        emailVerified: Boolean(verifiedPrimary),
        name: profile.name || profile.login,
        avatar: profile.avatar_url,
      };
    });
  } catch (err) {
    console.error('GitHub OAuth error:', err);
    sendErrorPage(res, 'OAuth failed');
  }
});

// ═══════════════════════════════════════════════════════
// MICROSOFT
// ═══════════════════════════════════════════════════════

router.get('/microsoft', (req, res) => {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  if (!clientId) return res.status(500).json({ message: 'Microsoft OAuth not configured' });

  const redirectUri = `${backendUrl()}/api/oauth/microsoft/callback`;
  const scope = encodeURIComponent('openid email profile User.Read');
  const tenant = process.env.MICROSOFT_TENANT_ID || 'common';
  beginOAuth(req, res, (state) =>
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&response_mode=query&state=${state}`
  );
});

router.get('/microsoft/callback', strictLimiter, async (req, res) => {
  try {
    await completeOAuth(req, res, async (code) => {
      const redirectUri = `${backendUrl()}/api/oauth/microsoft/callback`;
      const tenant = process.env.MICROSOFT_TENANT_ID || 'common';

      const tokenRes = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.MICROSOFT_CLIENT_ID,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
          scope: 'openid email profile User.Read',
        }),
      });
      const tokens = await tokenRes.json();
      if (tokens.error) return { error: tokens.error_description || tokens.error };

      const userRes = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const profile = await userRes.json();
      if (!profile.id) return { error: 'Не удалось получить профиль Microsoft' };

      return {
        provider: 'microsoft',
        oauthId: profile.id,
        email: profile.mail || profile.userPrincipalName,
        // Microsoft Graph не отдаёт признак подтверждения адреса, поэтому
        // к существующему аккаунту такой вход не привязывается.
        emailVerified: false,
        name: profile.displayName || profile.givenName || 'User',
        avatar: null,
      };
    });
  } catch (err) {
    console.error('Microsoft OAuth error:', err);
    sendErrorPage(res, 'OAuth failed');
  }
});

// GET /api/oauth/providers — какие провайдеры настроены
router.get('/providers', (req, res) => {
  res.json({
    google: !!process.env.GOOGLE_CLIENT_ID,
    github: !!process.env.GITHUB_CLIENT_ID,
    microsoft: !!process.env.MICROSOFT_CLIENT_ID,
  });
});

export default router;

// Экспорт для тестов: защитные инварианты проверяются без поднятия сервера и БД.
export const __internals = {
  parseCookies,
  normalizeNonce,
  beginOAuth,
  checkState,
  issueAuthCode,
  consumeAuthCode,
};

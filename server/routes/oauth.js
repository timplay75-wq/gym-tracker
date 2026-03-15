import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// ─── Helpers ──────────────────────────────────────────

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// Redirect back to frontend with token in URL params
function sendTokenPage(res, token, user) {
  const params = new URLSearchParams({
    token,
    id: String(user._id),
    name: user.name || '',
    email: user.email || '',
  });
  if (user.avatar) params.set('avatar', user.avatar);
  res.redirect(`${FRONTEND_URL}/oauth-callback?${params.toString()}`);
}

function sendErrorPage(res, message) {
  const params = new URLSearchParams({ error: message });
  res.redirect(`${FRONTEND_URL}/login?${params.toString()}`);
}

async function findOrCreateOAuthUser(provider, oauthId, email, name, avatar) {
  // 1. Ищем по oauthProvider + oauthId
  let user = await User.findOne({ oauthProvider: provider, oauthId });
  if (user) return user;

  // 2. Ищем по email — привязываем OAuth если уже есть аккаунт
  if (email) {
    user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      user.oauthProvider = provider;
      user.oauthId = oauthId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
      return user;
    }
  }

  // 3. Создаём нового пользователя
  user = await User.create({
    name: name || 'User',
    email: email || `${provider}_${oauthId}@oauth.local`,
    oauthProvider: provider,
    oauthId,
    avatar: avatar || null,
  });
  return user;
}

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ═══════════════════════════════════════════════════════
// GOOGLE
// ═══════════════════════════════════════════════════════

router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ message: 'Google OAuth not configured' });

  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/oauth/google/callback`;
  const scope = encodeURIComponent('openid email profile');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account`;
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return sendErrorPage(res, 'No authorization code');

    const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/oauth/google/callback`;

    // Exchange code for tokens
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
    if (tokens.error) return sendErrorPage(res, tokens.error_description || tokens.error);

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await userRes.json();

    const user = await findOrCreateOAuthUser('google', profile.id, profile.email, profile.name, profile.picture);
    const token = generateToken(user._id);
    sendTokenPage(res, token, user);
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

  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/oauth/github/callback`;
  const scope = 'user:email';
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  res.redirect(url);
});

router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return sendErrorPage(res, 'No authorization code');

    // Exchange code for access token
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
    if (tokenData.error) return sendErrorPage(res, tokenData.error_description || tokenData.error);

    // Get user profile
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'GymTracker' },
    });
    const profile = await userRes.json();

    // Get primary email (may be private)
    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'GymTracker' },
      });
      const emails = await emailsRes.json();
      const primary = emails.find(e => e.primary && e.verified);
      email = primary?.email || emails[0]?.email;
    }

    const user = await findOrCreateOAuthUser('github', String(profile.id), email, profile.name || profile.login, profile.avatar_url);
    const token = generateToken(user._id);
    sendTokenPage(res, token, user);
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

  const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/oauth/microsoft/callback`;
  const scope = encodeURIComponent('openid email profile User.Read');
  const tenant = process.env.MICROSOFT_TENANT_ID || 'common';
  const url = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&response_mode=query`;
  res.redirect(url);
});

router.get('/microsoft/callback', async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return sendErrorPage(res, 'No authorization code');

    const redirectUri = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/oauth/microsoft/callback`;
    const tenant = process.env.MICROSOFT_TENANT_ID || 'common';

    // Exchange code for tokens
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
    if (tokens.error) return sendErrorPage(res, tokens.error_description || tokens.error);

    // Get user profile from Microsoft Graph
    const userRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await userRes.json();

    const email = profile.mail || profile.userPrincipalName;
    const name = profile.displayName || profile.givenName || 'User';

    const user = await findOrCreateOAuthUser('microsoft', profile.id, email, name, null);
    const token = generateToken(user._id);
    sendTokenPage(res, token, user);
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

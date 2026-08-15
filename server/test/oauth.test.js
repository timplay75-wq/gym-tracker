import test from 'node:test';
import assert from 'node:assert/strict';

import { __internals } from '../routes/oauth.js';
import OAuthCode from '../models/OAuthCode.js';
import { createReq, createRes } from './helpers.js';

const { parseCookies, normalizeNonce, beginOAuth, checkState, issueAuthCode, consumeAuthCode } =
  __internals;

const NONCE = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6';

/**
 * Коды теперь живут в MongoDB. Подменяем статики модели хранилищем в памяти —
 * база для проверки логики не нужна.
 */
function stubCodeStore() {
  const original = { create: OAuthCode.create, findOneAndDelete: OAuthCode.findOneAndDelete };
  const store = new Map();

  OAuthCode.create = async (doc) => {
    store.set(doc.code, { ...doc, userId: String(doc.userId) });
    return doc;
  };
  // findOneAndDelete атомарен — именно он обеспечивает одноразовость
  OAuthCode.findOneAndDelete = async ({ code }) => {
    const found = store.get(code);
    if (!found) return null;
    store.delete(code);
    return found;
  };

  return () => Object.assign(OAuthCode, original);
}

/**
 * Прогоняет старт потока и возвращает значение выставленной cookie.
 * Принимает целиком объект query, чтобы можно было честно смоделировать
 * запрос вообще без параметра nonce.
 */
function startFlow(query = { nonce: NONCE }) {
  const req = createReq({ query });
  const res = createRes();
  let authorizeUrl;
  beginOAuth(req, res, (state) => {
    authorizeUrl = `https://provider.example/auth?state=${state}`;
    return authorizeUrl;
  });
  const cookie = res.cookies.find(c => c.name === 'oauth_state');
  return { cookieValue: cookie.value, options: cookie.options, authorizeUrl, res };
}

test('beginOAuth кладёт state в httpOnly-cookie и передаёт его провайдеру', () => {
  const { cookieValue, options, authorizeUrl } = startFlow();

  assert.equal(options.httpOnly, true);
  assert.equal(options.sameSite, 'lax');

  const state = cookieValue.split('.')[0];
  assert.match(state, /^[a-f\d]{64}$/);
  // Раньше state не передавался вовсе — колбэк принимал любой authorization code
  assert.ok(authorizeUrl.includes(`state=${state}`));
});

test('state из cookie совпадает с query — поток проходит', () => {
  const { cookieValue } = startFlow();
  const state = cookieValue.split('.')[0];

  const req = createReq({
    query: { state },
    headers: { cookie: `oauth_state=${cookieValue}` },
  });
  const result = checkState(req, createRes());

  assert.equal(result.ok, true);
  assert.equal(result.nonce, NONCE);
});

test('подставленный чужой state отвергается', () => {
  const { cookieValue } = startFlow();

  const req = createReq({
    query: { state: 'b'.repeat(64) },
    headers: { cookie: `oauth_state=${cookieValue}` },
  });

  assert.equal(checkState(req, createRes()).ok, false);
});

test('без cookie state проверка не проходит (login CSRF)', () => {
  const req = createReq({ query: { state: 'b'.repeat(64) }, headers: {} });
  assert.equal(checkState(req, createRes()).ok, false);
});

test('state отсутствует в query — отказ', () => {
  const { cookieValue } = startFlow();
  const req = createReq({ query: {}, headers: { cookie: `oauth_state=${cookieValue}` } });
  assert.equal(checkState(req, createRes()).ok, false);
});

test('cookie сбрасывается независимо от результата проверки', () => {
  const res = createRes();
  checkState(createReq({ query: {}, headers: {} }), res);
  assert.equal(res.clearedCookies[0].name, 'oauth_state');
});

test('одноразовый код нельзя обменять дважды', async () => {
  const restore = stubCodeStore();
  try {
    const code = await issueAuthCode('507f1f77bcf86cd799439011', NONCE);

    const first = await consumeAuthCode(code);
    assert.equal(first.userId, '507f1f77bcf86cd799439011');
    assert.equal(first.nonce, NONCE);

    assert.equal(await consumeAuthCode(code), null);
  } finally {
    restore();
  }
});

test('несуществующий код не обменивается', async () => {
  const restore = stubCodeStore();
  try {
    assert.equal(await consumeAuthCode('нет такого кода'), null);
  } finally {
    restore();
  }
});

test('код привязан к nonce того браузера, который начал вход', async () => {
  const restore = stubCodeStore();
  try {
    const attackerNonce = 'f'.repeat(32);
    const code = await issueAuthCode('507f1f77bcf86cd799439011', attackerNonce);

    const entry = await consumeAuthCode(code);
    // Обработчик /exchange сравнивает entry.nonce с присланным. У жертвы в
    // sessionStorage лежит свой nonce, поэтому подсунутый код не сработает.
    assert.notEqual(entry.nonce, NONCE);
    assert.equal(entry.nonce, attackerNonce);
  } finally {
    restore();
  }
});

test('просроченный код не обменивается', async () => {
  const restore = stubCodeStore();
  try {
    const code = await issueAuthCode('507f1f77bcf86cd799439011', NONCE);
    // Подменяем срок на прошедший: TTL-индекс Mongo удаляет с задержкой,
    // поэтому проверка времени в коде обязательна
    OAuthCode.findOneAndDelete = async () => ({
      code, userId: '507f1f77bcf86cd799439011', nonce: NONCE,
      expiresAt: new Date(Date.now() - 1000),
    });

    assert.equal(await consumeAuthCode(code), null);
  } finally {
    restore();
  }
});

test('поток без nonce выдаёт код, который нельзя обменять', async () => {
  // Злоумышленник дёргает /api/oauth/google напрямую, без nonce. Код,
  // привязанный к пустой строке, совпал бы с пустым sessionStorage жертвы,
  // поэтому /exchange отвергает пустой nonce с обеих сторон.
  const { cookieValue } = startFlow({});
  const nonce = cookieValue.split('.')[1];
  assert.equal(nonce, '');

  const restore = stubCodeStore();
  try {
    const code = await issueAuthCode('507f1f77bcf86cd799439011', nonce);
    const entry = await consumeAuthCode(code);
    assert.equal(entry.nonce, '');
  } finally {
    restore();
  }
});

test('невалидный nonce в query не попадает в cookie', () => {
  const { cookieValue } = startFlow({ nonce: 'не-hex-значение' });
  assert.equal(cookieValue.split('.')[1], '');
});

test('normalizeNonce пропускает только hex нужной длины', () => {
  assert.equal(normalizeNonce(NONCE), NONCE);
  assert.equal(normalizeNonce('короткий'), null);
  assert.equal(normalizeNonce('a'.repeat(200)), null);
  assert.equal(normalizeNonce({ $ne: null }), null);
  // Точка сломала бы разделитель в cookie
  assert.equal(normalizeNonce('aaaa.bbbb.cccc.dddd'), null);
});

test('parseCookies разбирает несколько кук', () => {
  const jar = parseCookies('a=1; oauth_state=xyz.abc; b=2');
  assert.equal(jar.oauth_state, 'xyz.abc');
  assert.equal(jar.a, '1');
});

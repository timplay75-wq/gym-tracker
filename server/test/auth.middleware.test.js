import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import { createReq, createRes, createNext } from './helpers.js';

process.env.JWT_SECRET = 'test-secret';

// Ни один из этих кейсов не должен доходить до User.findById, поэтому база не нужна.
// Там, где доходит, статик модели подменяется вручную.

test('заголовок "Bearer" без токена: ровно один ответ 401, без выброса', async () => {
  const req = createReq({ headers: { authorization: 'Bearer' } });
  const res = createRes();
  const next = createNext();

  // Регрессия: раньше token объявлялся внутри try, jwt.verify падал,
  // catch отправлял 401, а внешний if (!token) отправлял 401 второй раз —
  // ERR_HTTP_HEADERS_SENT из async-функции ронял процесс.
  await protect(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.equal(next.calls.length, 0);
});

test('заголовок "Bearer   " из одних пробелов: один ответ 401', async () => {
  const req = createReq({ headers: { authorization: 'Bearer   ' } });
  const res = createRes();
  const next = createNext();

  await protect(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.equal(next.calls.length, 0);
});

test('заголовка Authorization нет вовсе: один ответ 401', async () => {
  const req = createReq();
  const res = createRes();
  const next = createNext();

  await protect(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.match(res.body.message, /отсутствует/);
  assert.equal(next.calls.length, 0);
});

test('мусорный токен: один ответ 401', async () => {
  const req = createReq({ headers: { authorization: 'Bearer not-a-jwt' } });
  const res = createRes();
  const next = createNext();

  await protect(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.match(res.body.message, /недействителен/);
  assert.equal(next.calls.length, 0);
});

test('протухший токен: один ответ 401', async () => {
  const expired = jwt.sign({ id: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET, { expiresIn: -10 });
  const req = createReq({ headers: { authorization: `Bearer ${expired}` } });
  const res = createRes();
  const next = createNext();

  await protect(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.equal(next.calls.length, 0);
});

test('токен подписан чужим секретом: один ответ 401', async () => {
  const foreign = jwt.sign({ id: '507f1f77bcf86cd799439011' }, 'другой-секрет');
  const req = createReq({ headers: { authorization: `Bearer ${foreign}` } });
  const res = createRes();
  const next = createNext();

  await protect(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.equal(next.calls.length, 0);
});

test('валидный токен, но пользователь удалён: 401, а не падение ниже по стеку', async () => {
  const original = User.findById;
  User.findById = () => ({ select: async () => null });
  try {
    const token = jwt.sign({ id: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET);
    const req = createReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createRes();
    const next = createNext();

    await protect(req, res, next);

    assert.equal(res.statusCode, 401);
    assert.equal(next.calls.length, 0);
  } finally {
    User.findById = original;
  }
});

test('валидный токен существующего пользователя: next() вызван один раз, ответ не отправлен', async () => {
  const fakeUser = { _id: '507f1f77bcf86cd799439011', name: 'Тест' };
  const original = User.findById;
  User.findById = () => ({ select: async () => fakeUser });
  try {
    const token = jwt.sign({ id: fakeUser._id }, process.env.JWT_SECRET);
    const req = createReq({ headers: { authorization: `Bearer ${token}` } });
    const res = createRes();
    const next = createNext();

    await protect(req, res, next);

    assert.equal(next.calls.length, 1);
    assert.equal(res.headersSent, false);
    assert.equal(req.user, fakeUser);
  } finally {
    User.findById = original;
  }
});

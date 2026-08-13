import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { forgotPassword } from '../controllers/userController.js';
import User from '../models/User.js';
import { createReq, createRes } from './helpers.js';

function stubUser({ findOne, findByIdAndUpdate }) {
  const original = { findOne: User.findOne, findByIdAndUpdate: User.findByIdAndUpdate };
  User.findOne = findOne || (async () => null);
  User.findByIdAndUpdate = findByIdAndUpdate || (async () => {});
  return () => Object.assign(User, original);
}

const EXISTING_USER = {
  _id: '507f1f77bcf86cd799439011',
  email: 'victim@example.com',
  oauthProvider: null,
};

afterEach(() => {
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
  process.env.NODE_ENV = 'test';
});

test('в production без SMTP ссылка сброса НЕ попадает в ответ', async () => {
  process.env.NODE_ENV = 'production';
  const restore = stubUser({ findOne: async () => EXISTING_USER });

  try {
    const req = createReq({ body: { email: 'victim@example.com' } });
    const res = createRes();

    await forgotPassword(req, res);

    // Регрессия: ветка выбиралась по наличию SMTP, а не по NODE_ENV,
    // и на боевом сервере без почты devResetUrl с живым токеном
    // отдавался любому, кто знает чужой email.
    assert.equal(res.body.devResetUrl, undefined);
    assert.equal(res.statusCode, 500);
  } finally {
    restore();
  }
});

test('без NODE_ENV=development ссылка не отдаётся даже для несуществующего email', async () => {
  process.env.NODE_ENV = 'production';
  const restore = stubUser({ findOne: async () => null });

  try {
    const res = createRes();
    await forgotPassword(createReq({ body: { email: 'nobody@example.com' } }), res);

    assert.equal(res.body.devResetUrl, undefined);
  } finally {
    restore();
  }
});

test('ответ не различает существующий и несуществующий email', async () => {
  process.env.NODE_ENV = 'production';
  process.env.SMTP_HOST = 'smtp.example.com';
  process.env.SMTP_USER = 'user';

  let restore = stubUser({ findOne: async () => null });
  const resMissing = createRes();
  await forgotPassword(createReq({ body: { email: 'nobody@example.com' } }), resMissing);
  restore();

  // Существующий пользователь: nodemailer попытается отправить письмо на
  // несуществующий хост, ошибка уйдёт в catch и вернёт 500 — здесь нас
  // интересует только то, что тело ответа не выдаёт наличие аккаунта.
  restore = stubUser({ findOne: async () => ({ ...EXISTING_USER, oauthProvider: 'google' }) });
  const resOauth = createRes();
  await forgotPassword(createReq({ body: { email: 'victim@example.com' } }), resOauth);
  restore();

  assert.deepEqual(resMissing.body, resOauth.body);
  assert.equal(resMissing.statusCode, resOauth.statusCode);
});

test('email-объект не уходит в запрос Mongo', async () => {
  process.env.NODE_ENV = 'production';
  process.env.SMTP_HOST = 'smtp.example.com';
  process.env.SMTP_USER = 'user';

  let receivedFilter;
  const restore = stubUser({
    findOne: async (filter) => { receivedFilter = filter; return null; },
  });

  try {
    const res = createRes();
    await forgotPassword(createReq({ body: { email: { $ne: null } } }), res);

    assert.equal(receivedFilter, undefined, 'запрос не должен был дойти до базы');
    assert.equal(res.statusCode, 400);
  } finally {
    restore();
  }
});

test('в development ссылка по-прежнему отдаётся для удобства локальной работы', async () => {
  process.env.NODE_ENV = 'development';
  const restore = stubUser({ findOne: async () => EXISTING_USER });

  try {
    const res = createRes();
    await forgotPassword(createReq({ body: { email: 'victim@example.com' } }), res);

    assert.ok(res.body.devResetUrl, 'в dev ссылка нужна, почты локально нет');
    assert.match(res.body.devResetUrl, /\/reset-password\/[a-f\d]{64}/);
  } finally {
    restore();
  }
});

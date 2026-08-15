import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { isMailConfigured, sendMail } from '../utils/mailer.js';

const MAIL_VARS = ['RESEND_API_KEY', 'BREVO_API_KEY', 'SMTP_HOST', 'SMTP_USER', 'MAIL_FROM', 'SMTP_FROM'];

afterEach(() => {
  MAIL_VARS.forEach(v => delete process.env[v]);
  globalThis.fetch = originalFetch;
});

const originalFetch = globalThis.fetch;

/** Перехватывает исходящий HTTP-запрос вместо реальной отправки. */
function captureRequest(status = 200) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    return { ok: status < 400, status, text: async () => 'ошибка' };
  };
  return calls;
}

test('без единого ключа почта считается ненастроенной', () => {
  assert.equal(isMailConfigured(), false);
});

test('любого одного ключа достаточно', () => {
  process.env.RESEND_API_KEY = 'x';
  assert.equal(isMailConfigured(), true);
  delete process.env.RESEND_API_KEY;

  process.env.BREVO_API_KEY = 'x';
  assert.equal(isMailConfigured(), true);
  delete process.env.BREVO_API_KEY;

  process.env.SMTP_HOST = 'smtp.example.com';
  process.env.SMTP_USER = 'user';
  assert.equal(isMailConfigured(), true);
});

test('одного SMTP_HOST без пользователя недостаточно', () => {
  process.env.SMTP_HOST = 'smtp.example.com';
  assert.equal(isMailConfigured(), false);
});

test('Resend вызывается по HTTP, а не по SMTP', async () => {
  process.env.RESEND_API_KEY = 'key';
  process.env.MAIL_FROM = 'Gym Tracker <noreply@tonna.ge>';
  const calls = captureRequest();

  await sendMail({ to: 'user@example.com', subject: 'Тема', html: '<p>Привет</p>' });

  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /^https:\/\/api\.resend\.com/);
  assert.deepEqual(calls[0].body.to, ['user@example.com']);
  assert.equal(calls[0].body.from, 'Gym Tracker <noreply@tonna.ge>');
});

test('Brevo получает отправителя объектом с именем и адресом', async () => {
  process.env.BREVO_API_KEY = 'key';
  process.env.MAIL_FROM = 'Gym Tracker <noreply@tonna.ge>';
  const calls = captureRequest();

  await sendMail({ to: 'user@example.com', subject: 'Тема', html: '<p>Привет</p>' });

  assert.match(calls[0].url, /^https:\/\/api\.brevo\.com/);
  assert.deepEqual(calls[0].body.sender, { name: 'Gym Tracker', email: 'noreply@tonna.ge' });
  assert.deepEqual(calls[0].body.to, [{ email: 'user@example.com' }]);
});

test('адрес без имени тоже разбирается', async () => {
  process.env.BREVO_API_KEY = 'key';
  process.env.MAIL_FROM = 'noreply@tonna.ge';
  const calls = captureRequest();

  await sendMail({ to: 'user@example.com', subject: 'Тема', html: '<p>Привет</p>' });

  assert.deepEqual(calls[0].body.sender, { email: 'noreply@tonna.ge' });
});

test('HTTP-провайдер имеет приоритет над SMTP', async () => {
  // На Vercel SMTP не работает, поэтому при наличии обоих выбираем HTTP
  process.env.RESEND_API_KEY = 'key';
  process.env.SMTP_HOST = 'smtp.example.com';
  process.env.SMTP_USER = 'user';
  const calls = captureRequest();

  await sendMail({ to: 'user@example.com', subject: 'Тема', html: '<p>Привет</p>' });

  assert.match(calls[0].url, /resend/);
});

test('ошибка провайдера пробрасывается, а не глотается', async () => {
  process.env.RESEND_API_KEY = 'key';
  captureRequest(422);

  await assert.rejects(
    () => sendMail({ to: 'user@example.com', subject: 'Тема', html: '<p>x</p>' }),
    /Resend ответил 422/
  );
});

test('без настроек отправка падает с понятным сообщением', async () => {
  await assert.rejects(
    () => sendMail({ to: 'user@example.com', subject: 'Тема', html: '<p>x</p>' }),
    /не настроена/
  );
});

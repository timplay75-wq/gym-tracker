import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

import { verifyWebhookSignature } from '../middleware/webhookSignature.js';
import { createReq, createRes, createNext } from './helpers.js';

const SECRET = 'webhook-test-secret';

function signedReq(payload, secret = SECRET) {
  const rawBody = Buffer.from(JSON.stringify(payload), 'utf8');
  const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return createReq({
    headers: { 'x-webhook-signature': `sha256=${signature}` },
    body: payload,
    rawBody,
  });
}

test('без секрета в окружении вебхук отклоняется, а не пропускается', () => {
  delete process.env.SUBSCRIPTION_WEBHOOK_SECRET;
  const req = signedReq({ status: 'succeeded' });
  const res = createRes();
  const next = createNext();

  verifyWebhookSignature(req, res, next);

  assert.equal(res.statusCode, 503);
  assert.equal(next.calls.length, 0);
});

test('без заголовка подписи — 401', () => {
  process.env.SUBSCRIPTION_WEBHOOK_SECRET = SECRET;
  const req = createReq({ body: { status: 'succeeded' }, rawBody: Buffer.from('{}') });
  const res = createRes();
  const next = createNext();

  verifyWebhookSignature(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.equal(next.calls.length, 0);
});

test('подпись чужим секретом — 401', () => {
  process.env.SUBSCRIPTION_WEBHOOK_SECRET = SECRET;
  const req = signedReq({ status: 'succeeded' }, 'секрет-злоумышленника');
  const res = createRes();
  const next = createNext();

  verifyWebhookSignature(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.equal(next.calls.length, 0);
});

test('подменённое тело при валидной подписи от другого тела — 401', () => {
  process.env.SUBSCRIPTION_WEBHOOK_SECRET = SECRET;
  const req = signedReq({ status: 'expired' });
  req.rawBody = Buffer.from(JSON.stringify({ status: 'succeeded' }), 'utf8');
  const res = createRes();
  const next = createNext();

  verifyWebhookSignature(req, res, next);

  assert.equal(res.statusCode, 401);
  assert.equal(next.calls.length, 0);
});

test('корректная подпись пропускает запрос дальше', () => {
  process.env.SUBSCRIPTION_WEBHOOK_SECRET = SECRET;
  const req = signedReq({ status: 'succeeded', externalId: 'pay_1' });
  const res = createRes();
  const next = createNext();

  verifyWebhookSignature(req, res, next);

  assert.equal(next.calls.length, 1);
  assert.equal(res.headersSent, false);
});

test('подпись без префикса sha256= тоже принимается', () => {
  process.env.SUBSCRIPTION_WEBHOOK_SECRET = SECRET;
  const req = signedReq({ status: 'succeeded' });
  req.headers['x-webhook-signature'] = req.headers['x-webhook-signature'].replace('sha256=', '');
  const res = createRes();
  const next = createNext();

  verifyWebhookSignature(req, res, next);

  assert.equal(next.calls.length, 1);
});

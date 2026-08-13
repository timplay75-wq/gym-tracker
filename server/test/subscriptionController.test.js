import test from 'node:test';
import assert from 'node:assert/strict';

import { createSubscription, handleWebhook } from '../controllers/subscriptionController.js';
import Subscription from '../models/Subscription.js';
import { createReq, createRes } from './helpers.js';

const USER = { _id: '507f1f77bcf86cd799439011' };

/** Подменяет статики модели на время одного теста. */
function stubSubscription({ getActive, create, findOne }) {
  const original = {
    getActive: Subscription.getActive,
    create: Subscription.create,
    findOne: Subscription.findOne,
  };
  if (getActive) Subscription.getActive = getActive;
  if (create) Subscription.create = create;
  if (findOne) Subscription.findOne = findOne;
  return () => Object.assign(Subscription, original);
}

test('externalId из тела запроса не делает подписку активной', async () => {
  let created;
  const restore = stubSubscription({
    getActive: async () => null,
    create: async (doc) => { created = doc; return { ...doc, _id: 'sub1' }; },
  });
  try {
    const req = createReq({
      body: { plan: 'lifetime', externalId: 'что-угодно' },
      user: USER,
    });
    const res = createRes();

    await createSubscription(req, res);

    // Регрессия: было status = externalId ? 'active' : 'pending',
    // то есть пожизненная подписка выдавалась одним запросом без оплаты.
    assert.equal(created.status, 'pending');
    assert.equal(created.externalId, null);
    assert.equal(res.statusCode, 201);
  } finally {
    restore();
  }
});

test('неизвестный paymentProvider обнуляется', async () => {
  let created;
  const restore = stubSubscription({
    getActive: async () => null,
    create: async (doc) => { created = doc; return { ...doc, _id: 'sub1' }; },
  });
  try {
    const req = createReq({
      body: { plan: 'monthly', paymentProvider: 'самопал' },
      user: USER,
    });
    await createSubscription(req, createRes());

    assert.equal(created.paymentProvider, null);
  } finally {
    restore();
  }
});

test('план "constructor" отвергается, а не проходит через прототип', async () => {
  const restore = stubSubscription({
    getActive: async () => null,
    create: async () => { throw new Error('create не должен вызываться'); },
  });
  try {
    const req = createReq({ body: { plan: 'constructor' }, user: USER });
    const res = createRes();

    await createSubscription(req, res);

    assert.equal(res.statusCode, 400);
  } finally {
    restore();
  }
});

test('вебхук: {"externalId":{"$ne":null}} не матчит чужую подписку', async () => {
  let receivedFilter;
  const restore = stubSubscription({
    findOne: async (filter) => { receivedFilter = filter; return null; },
  });
  try {
    const req = createReq({ body: { externalId: { $ne: null }, status: 'cancelled' } });
    const res = createRes();

    await handleWebhook(req, res);

    // Оператор должен быть отброшен ещё до запроса — значит искать нечего.
    assert.equal(receivedFilter, undefined);
    assert.equal(res.statusCode, 400);
  } finally {
    restore();
  }
});

test('вебхук со строковым externalId активирует подписку', async () => {
  const saved = [];
  const subscription = {
    status: 'pending',
    externalId: 'pay_1',
    save: async function () { saved.push(this.status); },
  };
  const restore = stubSubscription({
    findOne: async () => subscription,
  });
  try {
    const req = createReq({ body: { externalId: 'pay_1', status: 'succeeded' } });
    const res = createRes();

    await handleWebhook(req, res);

    assert.equal(subscription.status, 'active');
    assert.deepEqual(saved, ['active']);
    assert.deepEqual(res.body, { received: true });
  } finally {
    restore();
  }
});

test('вебхук с неизвестным событием ничего не меняет', async () => {
  const subscription = {
    status: 'pending',
    save: async () => { throw new Error('save не должен вызываться'); },
  };
  const restore = stubSubscription({ findOne: async () => subscription });
  try {
    const req = createReq({ body: { externalId: 'pay_1', event: 'нечто.странное' } });
    const res = createRes();

    await handleWebhook(req, res);

    assert.equal(res.statusCode, 400);
    assert.equal(subscription.status, 'pending');
  } finally {
    restore();
  }
});

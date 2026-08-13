import test from 'node:test';
import assert from 'node:assert/strict';

import { asString, asObjectId, pick, lookup } from '../utils/sanitize.js';

test('asString отбрасывает операторы Mongo', () => {
  assert.equal(asString('abc'), 'abc');
  assert.equal(asString(42), '42');
  assert.equal(asString({ $ne: null }), null);
  assert.equal(asString(['a']), null);
  assert.equal(asString(undefined), null);
  assert.equal(asString(null), null);
});

test('asObjectId пропускает только 24-символьный hex', () => {
  assert.equal(asObjectId('507f1f77bcf86cd799439011'), '507f1f77bcf86cd799439011');
  assert.equal(asObjectId('слишком-коротко'), null);
  assert.equal(asObjectId({ $ne: null }), null);
});

test('pick оставляет только разрешённые поля и режет операторы верхнего уровня', () => {
  const result = pick(
    { name: 'Ноги', userId: 'чужой-id', $set: { coins: 999 }, exercises: [] },
    ['name', 'exercises']
  );
  assert.deepEqual(result, { name: 'Ноги', exercises: [] });
});

test('pick не падает на не-объектах', () => {
  assert.deepEqual(pick(null, ['a']), {});
  assert.deepEqual(pick('строка', ['a']), {});
  assert.deepEqual(pick([1, 2], ['a']), {});
});

test('lookup не отдаёт унаследованные свойства', () => {
  const PLANS = { monthly: { amount: 1 } };

  assert.deepEqual(lookup(PLANS, 'monthly'), { amount: 1 });
  // Обычный PLANS['constructor'] вернул бы функцию и прошёл проверку на существование
  assert.equal(lookup(PLANS, 'constructor'), undefined);
  assert.equal(lookup(PLANS, '__proto__'), undefined);
  assert.equal(lookup(PLANS, 'toString'), undefined);
  assert.equal(lookup(PLANS, { $ne: null }), undefined);
});

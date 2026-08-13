import test from 'node:test';
import assert from 'node:assert/strict';

import { completeWorkout, updateWorkout } from '../controllers/workoutController.js';
import Workout from '../models/Workout.js';
import User from '../models/User.js';
import { createReq, createRes } from './helpers.js';

const USER = { _id: '507f1f77bcf86cd799439011' };

function stubModels({ findOne, updateOne, incCoins, findOneAndUpdate }) {
  const original = {
    findOne: Workout.findOne,
    updateOne: Workout.updateOne,
    findOneAndUpdate: Workout.findOneAndUpdate,
    findByIdAndUpdate: User.findByIdAndUpdate,
  };
  if (findOne) Workout.findOne = findOne;
  if (updateOne) Workout.updateOne = updateOne;
  if (findOneAndUpdate) Workout.findOneAndUpdate = findOneAndUpdate;
  User.findByIdAndUpdate = incCoins || (async () => {});
  return () => {
    Workout.findOne = original.findOne;
    Workout.updateOne = original.updateOne;
    Workout.findOneAndUpdate = original.findOneAndUpdate;
    User.findByIdAndUpdate = original.findByIdAndUpdate;
  };
}

/** exercises пустой намеренно: updateRecordsFromWorkout тогда не ходит в базу. */
function fakeWorkout(overrides = {}) {
  return {
    _id: '507f191e810c19729de860ea',
    status: 'in-progress',
    exercises: [],
    completedAt: null,
    coinsAwarded: false,
    save: async () => {},
    toObject() { return { ...this }; },
    ...overrides,
  };
}

test('монеты начисляются один раз, повторный /complete их не даёт', async () => {
  const workout = fakeWorkout();
  let claimAttempts = 0;
  let coinGrants = 0;

  const restore = stubModels({
    findOne: async () => workout,
    updateOne: async () => {
      claimAttempts += 1;
      // Атомарная заявка проходит только пока coinsAwarded !== true
      if (workout.coinsAwarded) return { modifiedCount: 0 };
      workout.coinsAwarded = true;
      return { modifiedCount: 1 };
    },
    incCoins: async () => { coinGrants += 1; },
  });

  try {
    // Первый вызов: тренировка переходит в completed
    await completeWorkout(createReq({ params: { id: workout._id }, body: {}, user: USER }), createRes());
    assert.equal(coinGrants, 1);
    assert.equal(workout.status, 'completed');

    // Регрессия: клиент дёргает /complete после каждого упражнения, и раньше
    // каждый такой вызов безусловно делал $inc: { coins: 10 }.
    await completeWorkout(createReq({ params: { id: workout._id }, body: {}, user: USER }), createRes());
    await completeWorkout(createReq({ params: { id: workout._id }, body: {}, user: USER }), createRes());

    assert.equal(coinGrants, 1);
    assert.equal(claimAttempts, 1, 'после первого завершения заявка на монеты больше не подаётся');
  } finally {
    restore();
  }
});

test('гонка двух параллельных /complete начисляет монеты один раз', async () => {
  const workout = fakeWorkout();
  let coinGrants = 0;
  let claimed = false;

  const restore = stubModels({
    findOne: async () => fakeWorkout({ save: workout.save }),
    updateOne: async () => {
      if (claimed) return { modifiedCount: 0 };
      claimed = true;
      return { modifiedCount: 1 };
    },
    incCoins: async () => { coinGrants += 1; },
  });

  try {
    await Promise.all([
      completeWorkout(createReq({ params: { id: workout._id }, body: {}, user: USER }), createRes()),
      completeWorkout(createReq({ params: { id: workout._id }, body: {}, user: USER }), createRes()),
    ]);

    assert.equal(coinGrants, 1);
  } finally {
    restore();
  }
});

test('completedAt не перезаписывается при повторном завершении', async () => {
  const firstDate = new Date('2026-01-01T10:00:00Z');
  const workout = fakeWorkout({ status: 'completed', completedAt: firstDate, coinsAwarded: true });

  const restore = stubModels({
    findOne: async () => workout,
    updateOne: async () => ({ modifiedCount: 0 }),
  });

  try {
    await completeWorkout(createReq({ params: { id: workout._id }, body: {}, user: USER }), createRes());
    assert.equal(workout.completedAt, firstDate);
  } finally {
    restore();
  }
});

test('чужая тренировка: 404 и никаких монет', async () => {
  let coinGrants = 0;
  const restore = stubModels({
    findOne: async () => null,
    incCoins: async () => { coinGrants += 1; },
  });

  try {
    const res = createRes();
    await completeWorkout(createReq({ params: { id: 'x' }, body: {}, user: USER }), res);

    assert.equal(res.statusCode, 404);
    assert.equal(coinGrants, 0);
  } finally {
    restore();
  }
});

test('updateWorkout не даёт переписать userId и служебные поля', async () => {
  let received;
  const restore = stubModels({
    findOneAndUpdate: async (filter, update) => { received = { filter, update }; return fakeWorkout(); },
  });

  try {
    const req = createReq({
      params: { id: '507f191e810c19729de860ea' },
      body: { name: 'Спина', userId: 'чужой-id', totalVolume: 999999, coinsAwarded: false },
      user: USER,
    });
    await updateWorkout(req, createRes());

    assert.equal(received.update.$set.name, 'Спина');
    assert.equal(received.update.$set.userId, undefined, 'userId не должен меняться из тела запроса');
    assert.equal(received.update.$set.coinsAwarded, undefined);
    assert.equal(received.update.$set.totalVolume, undefined, 'без exercises тоталы не трогаем');
    // Владелец всегда в фильтре — чужую тренировку не найдём
    assert.equal(received.filter.userId, USER._id);
  } finally {
    restore();
  }
});

test('updateWorkout пересчитывает тоннаж сам, а не берёт из тела', async () => {
  let received;
  const restore = stubModels({
    findOneAndUpdate: async (filter, update) => { received = update; return fakeWorkout(); },
  });

  try {
    const req = createReq({
      params: { id: '507f191e810c19729de860ea' },
      body: {
        totalVolume: 999999,
        exercises: [{ sets: [
          { weight: 100, reps: 5, completed: true },
          { weight: 50, reps: 10, completed: false },
        ] }],
      },
      user: USER,
    });
    await updateWorkout(req, createRes());

    // Считается только по завершённым подходам: 100 * 5
    assert.equal(received.$set.totalVolume, 500);
    assert.equal(received.$set.totalSets, 1);
    assert.equal(received.$set.totalReps, 5);
  } finally {
    restore();
  }
});

test('expectedUpdatedAt попадает в фильтр — запись условная', async () => {
  const stamp = '2026-02-11T10:00:00.000Z';
  let received;
  const restore = stubModels({
    findOneAndUpdate: async (filter) => { received = filter; return fakeWorkout(); },
  });

  try {
    const req = createReq({
      params: { id: '507f191e810c19729de860ea' },
      body: { exercises: [], expectedUpdatedAt: stamp },
      user: USER,
    });
    await updateWorkout(req, createRes());

    assert.ok(received.updatedAt instanceof Date);
    assert.equal(received.updatedAt.toISOString(), stamp);
  } finally {
    restore();
  }
});

test('устаревший expectedUpdatedAt даёт 409, а не молчаливую перезапись', async () => {
  const current = fakeWorkout({ name: 'Актуальная версия' });
  const restore = stubModels({
    // Условие по updatedAt не совпало
    findOneAndUpdate: async () => null,
    // Но сама тренировка существует
    findOne: async () => current,
  });

  try {
    const res = createRes();
    const req = createReq({
      params: { id: '507f191e810c19729de860ea' },
      body: { exercises: [], expectedUpdatedAt: '2020-01-01T00:00:00.000Z' },
      user: USER,
    });
    await updateWorkout(req, res);

    // Регрессия: раньше правка уходила безусловно и затирала чужие изменения
    assert.equal(res.statusCode, 409);
    assert.equal(res.body.workout, current, 'клиенту возвращается актуальная версия');
  } finally {
    restore();
  }
});

test('несуществующая тренировка — 404, а не 409', async () => {
  const restore = stubModels({
    findOneAndUpdate: async () => null,
    findOne: async () => null,
  });

  try {
    const res = createRes();
    const req = createReq({
      params: { id: '507f191e810c19729de860ea' },
      body: { exercises: [], expectedUpdatedAt: '2020-01-01T00:00:00.000Z' },
      user: USER,
    });
    await updateWorkout(req, res);

    assert.equal(res.statusCode, 404);
  } finally {
    restore();
  }
});

test('без expectedUpdatedAt поведение прежнее: 404 при отсутствии записи', async () => {
  const restore = stubModels({ findOneAndUpdate: async () => null });

  try {
    const res = createRes();
    const req = createReq({
      params: { id: '507f191e810c19729de860ea' },
      body: { name: 'Спина' },
      user: USER,
    });
    await updateWorkout(req, res);

    assert.equal(res.statusCode, 404);
  } finally {
    restore();
  }
});

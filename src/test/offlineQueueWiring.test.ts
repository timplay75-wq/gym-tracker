import { describe, it, expect, beforeEach, vi } from 'vitest';

const complete = vi.fn();

vi.mock('../services/api', () => ({
  workoutsApi: {
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    complete: (...args: unknown[]) => complete(...args),
  },
  exercisesApi: {
    create: vi.fn().mockResolvedValue({}),
  },
}));

import {
  enqueue,
  getQueueLength,
  getFailedLength,
  clearQueue,
  clearFailed,
  processQueue,
} from '../services/offlineQueue';

describe('offlineQueue — подключение к завершению тренировки', () => {
  beforeEach(() => {
    clearQueue();
    clearFailed();
    complete.mockReset();
    complete.mockResolvedValue({});
  });

  it('отправляет завершение тренировки при обработке очереди', async () => {
    enqueue('complete_workout', { id: 'w1', data: { exercises: [{ name: 'Присед' }] } });

    const result = await processQueue();

    expect(complete).toHaveBeenCalledWith('w1', { exercises: [{ name: 'Присед' }] });
    expect(result.processed).toBe(1);
    expect(getQueueLength()).toBe(0);
  });

  it('повторное завершение той же тренировки схлопывается в одно действие', () => {
    const key = 'complete_workout:w1';
    enqueue('complete_workout', { id: 'w1', data: { exercises: [{ name: 'Присед' }] } }, key);
    enqueue('complete_workout', { id: 'w1', data: { exercises: [{ name: 'Присед' }, { name: 'Жим' }] } }, key);

    // Важен только последний снимок упражнений
    expect(getQueueLength()).toBe(1);
  });

  it('дедупликация не задевает другие тренировки', () => {
    enqueue('complete_workout', { id: 'w1', data: {} }, 'complete_workout:w1');
    enqueue('complete_workout', { id: 'w2', data: {} }, 'complete_workout:w2');
    expect(getQueueLength()).toBe(2);
  });

  it('неудачное действие остаётся в очереди и повторяется позже', async () => {
    complete.mockRejectedValueOnce(new Error('нет сети'));
    enqueue('complete_workout', { id: 'w1', data: {} });

    const first = await processQueue();
    expect(first.failed).toBe(1);
    expect(getQueueLength()).toBe(1);

    complete.mockResolvedValueOnce({});
    const second = await processQueue();
    expect(second.processed).toBe(1);
    expect(getQueueLength()).toBe(0);
  });

  it('исчерпав попытки, действие уходит в отдельный список, а не удаляется', async () => {
    complete.mockRejectedValue(new Error('нет сети'));
    enqueue('complete_workout', { id: 'w1', data: { exercises: [{ name: 'Присед' }] } });

    // Регрессия: раньше после трёх неудач действие выбрасывалось молча,
    // и записанная тренировка исчезала без следа.
    for (let i = 0; i < 5; i++) await processQueue();

    expect(getQueueLength()).toBe(0);
    expect(getFailedLength()).toBe(1);
  });

  it('действия, добавленные во время отправки, не затираются', async () => {
    enqueue('complete_workout', { id: 'w1', data: {} });

    complete.mockImplementationOnce(async () => {
      // Пользователь дожал второе упражнение, пока шёл первый запрос
      enqueue('complete_workout', { id: 'w2', data: {} });
      return {};
    });

    await processQueue();

    // Раньше очередь перезаписывалась снимком, сделанным до сетевых вызовов
    expect(getQueueLength()).toBe(1);
  });
});

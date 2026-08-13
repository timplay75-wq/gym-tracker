import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', async () => {
  const actual = await vi.importActual<typeof import('@/services/apiClient')>('@/services/apiClient');
  return {
    ...actual,
    apiFetch: vi.fn(),
    normalizeWorkout: vi.fn((w: unknown) => w),
  };
});

import { apiFetch, ApiError } from '@/services/apiClient';
import { workoutsApi } from '../services/workoutsApi';
import { requestCache } from '../services/requestCache';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

const workoutAt = (updatedAt: string, names: string[]) => ({
  _id: 'w1',
  updatedAt,
  exercises: names.map(name => ({ name })),
});

/** Достаёт тело PUT-запроса из вызова apiFetch. */
const bodyOf = (call: unknown[]) =>
  JSON.parse((call[1] as { body: string }).body);

describe('оптимистическая блокировка при правке упражнений', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requestCache.clear();
  });

  it('отправляет прочитанный updatedAt вместе с изменениями', async () => {
    mockFetch
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:00.000Z', ['Присед']))
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:01.000Z', ['Присед', 'Жим']));

    await workoutsApi.mutateExercises('w1', (exercises) => [...exercises, { name: 'Жим' }]);

    const put = bodyOf(mockFetch.mock.calls[1]);
    expect(put.expectedUpdatedAt).toBe('2026-02-11T10:00:00.000Z');
    expect(put.exercises).toHaveLength(2);
  });

  it('изменение применяется к свежим данным, а не к тем, что были на экране', async () => {
    // На сервере кто-то уже добавил «Тяга», о которой экран не знает
    mockFetch
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:00.000Z', ['Присед', 'Тяга']))
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:01.000Z', []));

    await workoutsApi.mutateExercises('w1', (exercises) => [...exercises, { name: 'Жим' }]);

    const put = bodyOf(mockFetch.mock.calls[1]);
    expect(put.exercises.map((e: { name: string }) => e.name)).toEqual(['Присед', 'Тяга', 'Жим']);
  });

  it('при 409 перечитывает и повторяет, ничего не затирая', async () => {
    mockFetch
      // Попытка 1: читаем старую версию
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:00.000Z', ['Присед']))
      // PUT отклонён — кто-то успел записать раньше
      .mockRejectedValueOnce(new ApiError('Тренировка была изменена', 409))
      // Попытка 2: читаем уже новую версию с чужим упражнением
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:05.000Z', ['Присед', 'Тяга']))
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:06.000Z', []));

    await workoutsApi.mutateExercises('w1', (exercises) => [...exercises, { name: 'Жим' }]);

    const put = bodyOf(mockFetch.mock.calls[3]);
    // Чужая «Тяга» на месте — ради этого всё и делалось
    expect(put.exercises.map((e: { name: string }) => e.name)).toEqual(['Присед', 'Тяга', 'Жим']);
    expect(put.expectedUpdatedAt).toBe('2026-02-11T10:00:05.000Z');
  });

  it('сдаётся после трёх конфликтов подряд и сообщает об этом', async () => {
    mockFetch.mockImplementation(async (path: string, options?: { method?: string }) => {
      if (options?.method === 'PUT') throw new ApiError('Конфликт', 409);
      return workoutAt('2026-02-11T10:00:00.000Z', ['Присед']);
    });

    await expect(
      workoutsApi.mutateExercises('w1', (exercises) => [...exercises, { name: 'Жим' }])
    ).rejects.toThrow();

    const puts = mockFetch.mock.calls.filter(c => (c[1] as { method?: string })?.method === 'PUT');
    expect(puts).toHaveLength(3);
  });

  it('ошибки, не связанные с конфликтом, не повторяются', async () => {
    mockFetch
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:00.000Z', ['Присед']))
      .mockRejectedValueOnce(new ApiError('Сервер прилёг', 500));

    await expect(
      workoutsApi.mutateExercises('w1', (exercises) => [...exercises, { name: 'Жим' }])
    ).rejects.toThrow('Сервер прилёг');

    // Одно чтение и один PUT — повтора быть не должно
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('удаление по совпадению упражнения не задевает соседей', async () => {
    mockFetch
      .mockResolvedValueOnce({
        _id: 'w1',
        updatedAt: '2026-02-11T10:00:00.000Z',
        exercises: [{ id: 'a', name: 'Присед' }, { id: 'b', name: 'Жим' }, { id: 'c', name: 'Тяга' }],
      })
      .mockResolvedValueOnce(workoutAt('2026-02-11T10:00:01.000Z', []));

    await workoutsApi.mutateExercises('w1', (exercises) => {
      const list = exercises as { id: string }[];
      return list.filter(e => e.id !== 'b');
    });

    const put = bodyOf(mockFetch.mock.calls[1]);
    expect(put.exercises.map((e: { name: string }) => e.name)).toEqual(['Присед', 'Тяга']);
  });
});

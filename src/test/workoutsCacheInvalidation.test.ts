import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
  normalizeWorkout: vi.fn((w: unknown) => w),
}));

import { apiFetch } from '@/services/apiClient';
import { workoutsApi } from '../services/workoutsApi';
import { requestCache } from '../services/requestCache';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

/** Список тренировок, как его отдаёт GET /workouts. */
const listWith = (exerciseNames: string[]) => ({
  workouts: [{ _id: 'w1', exercises: exerciseNames.map(name => ({ name })) }],
  total: 1,
  page: 1,
  totalPages: 1,
});

describe('инвалидация кэша тренировок', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requestCache.clear();
  });

  it('complete сбрасывает кэш, и следующий getAll идёт в сеть', async () => {
    mockFetch.mockResolvedValueOnce(listWith(['Жим лёжа']));
    await workoutsApi.getAll({ limit: 50 });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Кэш ещё горячий — повторное чтение сети не касается
    await workoutsApi.getAll({ limit: 50 });
    expect(mockFetch).toHaveBeenCalledTimes(1);

    mockFetch.mockResolvedValueOnce({ _id: 'w1' });
    await workoutsApi.complete('w1', { exercises: [] });

    // Регрессия: complete была единственной мутацией без invalidate, поэтому
    // страница ещё 20 секунд читала список без только что записанных подходов
    // и затирала их следующим PUT.
    mockFetch.mockResolvedValueOnce(listWith(['Жим лёжа', 'Приседания']));
    const after = await workoutsApi.getAll({ limit: 50 });

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(after.workouts[0].exercises).toHaveLength(2);
  });

  it('сценарий «завершил упражнение → добавил из библиотеки» не читает устаревший список', async () => {
    // Экран прогрел кэш списком из одного упражнения
    mockFetch.mockResolvedValueOnce(listWith(['Жим лёжа']));
    await workoutsApi.getAll({ limit: 50 });

    // Пользователь завершил упражнение — на сервере теперь два
    mockFetch.mockResolvedValueOnce({ _id: 'w1' });
    await workoutsApi.complete('w1', { exercises: [{ name: 'Жим лёжа' }, { name: 'Присед' }] });

    // Библиотека читает список, чтобы дописать в него третье упражнение
    mockFetch.mockResolvedValueOnce(listWith(['Жим лёжа', 'Присед']));
    const fresh = await workoutsApi.getAll({ limit: 50 });

    // Если бы кэш не сбросился, здесь был бы список из одного упражнения,
    // и PUT стёр бы результаты только что завершённого подхода.
    expect(fresh.workouts[0].exercises.map((e: { name: string }) => e.name)).toEqual([
      'Жим лёжа',
      'Присед',
    ]);
  });

  it('start тоже сбрасывает кэш', async () => {
    mockFetch.mockResolvedValueOnce(listWith(['Жим лёжа']));
    await workoutsApi.getAll();
    expect(mockFetch).toHaveBeenCalledTimes(1);

    mockFetch.mockResolvedValueOnce({});
    await workoutsApi.start('w1');

    mockFetch.mockResolvedValueOnce(listWith(['Жим лёжа']));
    await workoutsApi.getAll();
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('requestCache.clear отсекает данные предыдущего аккаунта', async () => {
    mockFetch.mockResolvedValueOnce(listWith(['Тренировка аккаунта А']));
    await workoutsApi.getAll();

    // Это делает AuthContext при login/logout/switchAccount
    requestCache.clear();

    mockFetch.mockResolvedValueOnce(listWith(['Тренировка аккаунта Б']));
    const second = await workoutsApi.getAll();

    expect(second.workouts[0].exercises[0].name).toBe('Тренировка аккаунта Б');
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

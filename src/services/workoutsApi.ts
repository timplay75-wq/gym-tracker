import { apiFetch, normalizeWorkout, ApiError } from './apiClient';
import { requestCache } from './requestCache';

const WORKOUTS_CACHE = /^\/workouts/;

/** Сколько раз повторить запись, если тренировку изменили параллельно. */
const CONFLICT_RETRIES = 3;

export const workoutsApi = {
  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    const key = `/workouts${q ? `?${q}` : ''}`;
    const cached = requestCache.get<{ workouts: ReturnType<typeof normalizeWorkout>[]; total: number; page: number; totalPages: number }>(key);
    if (cached) return cached;
    const res = await apiFetch<{ workouts: unknown[]; total: number; page: number; totalPages: number }>(key);
    const result = { ...res, workouts: res.workouts.map(normalizeWorkout) };
    requestCache.set(key, result);
    return result;
  },

  getToday: async () => {
    const w = await apiFetch<unknown | null>('/workouts/today');
    return w ? normalizeWorkout(w) : null;
  },

  getById: async (id: string) => {
    const w = await apiFetch<unknown>(`/workouts/${id}`);
    return normalizeWorkout(w);
  },

  create: async (data: unknown) => {
    requestCache.invalidate(WORKOUTS_CACHE);
    const w = await apiFetch<unknown>('/workouts', { method: 'POST', body: JSON.stringify(data) });
    requestCache.invalidate(WORKOUTS_CACHE);
    return normalizeWorkout(w);
  },

  update: async (id: string, data: unknown) => {
    requestCache.invalidate(WORKOUTS_CACHE);
    const w = await apiFetch<unknown>(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    requestCache.invalidate(WORKOUTS_CACHE);
    return normalizeWorkout(w);
  },

  delete: async (id: string) => {
    requestCache.invalidate(WORKOUTS_CACHE);
    const res = await apiFetch(`/workouts/${id}`, { method: 'DELETE' });
    requestCache.invalidate(WORKOUTS_CACHE);
    return res;
  },

  start: async (id: string) => {
    requestCache.invalidate(WORKOUTS_CACHE);
    const res = await apiFetch(`/workouts/${id}/start`, { method: 'POST' });
    requestCache.invalidate(WORKOUTS_CACHE);
    return res;
  },

  complete: async (id: string, data: { duration?: number; exercises?: unknown[] }) => {
    requestCache.invalidate(WORKOUTS_CACHE);
    const w = await apiFetch<unknown>(`/workouts/${id}/complete`, { method: 'POST', body: JSON.stringify(data) });
    // Повторный сброс уже после ответа: пока запрос был в полёте, параллельное
    // чтение успевало положить в кэш дозаписанный список заново.
    requestCache.invalidate(WORKOUTS_CACHE);
    return normalizeWorkout(w);
  },

  /**
   * Безопасно меняет список упражнений тренировки.
   *
   * Страницы раньше читали массив, правили его локально и отправляли целиком —
   * параллельная правка при этом молча терялась. Здесь читается свежая версия,
   * применяется transform, и запись уходит с проверкой updatedAt. Если сервер
   * ответил 409, значит тренировку успели изменить: повторяем цикл на свежих
   * данных вместо того, чтобы затирать чужие изменения.
   */
  mutateExercises: async (
    id: string,
    transform: (exercises: unknown[]) => unknown[],
  ) => {
    let conflict: unknown = null;

    for (let attempt = 0; attempt < CONFLICT_RETRIES; attempt++) {
      const current = await workoutsApi.getById(id);
      const exercises = transform((current.exercises || []) as unknown[]);

      try {
        return await workoutsApi.update(id, {
          exercises,
          expectedUpdatedAt: (current as { updatedAt?: string }).updatedAt,
        });
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          conflict = err;
          continue;
        }
        throw err;
      }
    }

    throw conflict ?? new Error('Не удалось сохранить: тренировку изменяют параллельно');
  },

  getStats: () => apiFetch<{ totalWorkouts: number; thisMonthWorkouts: number; totalVolume: number }>('/workouts/stats'),

  getCalendar: (year?: number, month?: number) => {
    const params = new URLSearchParams();
    if (year) params.set('year', String(year));
    if (month) params.set('month', String(month));
    const q = params.toString();
    return apiFetch<Array<{ date: string; count: number; status: string; workouts: unknown[] }>>(`/workouts/calendar${q ? `?${q}` : ''}`);
  },
};

import { apiFetch, normalizeWorkout } from './apiClient';

export const workoutsApi = {
  getAll: async (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    const res = await apiFetch<{ workouts: unknown[]; total: number; page: number; totalPages: number }>(`/workouts${q ? `?${q}` : ''}`);
    return { ...res, workouts: res.workouts.map(normalizeWorkout) };
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
    const w = await apiFetch<unknown>('/workouts', { method: 'POST', body: JSON.stringify(data) });
    return normalizeWorkout(w);
  },

  update: async (id: string, data: unknown) => {
    const w = await apiFetch<unknown>(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return normalizeWorkout(w);
  },

  delete: (id: string) => apiFetch(`/workouts/${id}`, { method: 'DELETE' }),

  start: (id: string) => apiFetch(`/workouts/${id}/start`, { method: 'POST' }),

  complete: async (id: string, data: { duration?: number; exercises?: unknown[] }) => {
    const w = await apiFetch<unknown>(`/workouts/${id}/complete`, { method: 'POST', body: JSON.stringify(data) });
    return normalizeWorkout(w);
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

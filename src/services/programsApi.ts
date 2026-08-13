import { apiFetch } from './apiClient';
import { requestCache } from './requestCache';

const CACHE_KEY = '/programs';

/** Упражнение внутри программы: у шаблонов sets — число, с сервера — массив подходов. */
export interface ProgramExerciseDoc {
  name: string;
  category?: string;
  sets?: number | { reps?: number }[];
  reps?: number;
  weight?: number;
  restTime?: number;
}

/** Программа так, как её отдаёт сервер. */
export interface ProgramDoc {
  _id: string;
  id?: string;
  name: string;
  description?: string | null;
  days?: { _id?: string; dayOfWeek: string; name: string; exercises?: ProgramExerciseDoc[] }[];
  /** Плоский список — встречается в данных, созданных из шаблонов. */
  exercises?: ProgramExerciseDoc[];
  isActive?: boolean;
  durationWeeks?: number | null;
  createdAt?: string;
}

export const programsApi = {
  getAll: async () => {
    const cached = requestCache.get<ProgramDoc[]>(CACHE_KEY);
    if (cached) return cached;
    const data = await apiFetch<ProgramDoc[]>(CACHE_KEY);
    requestCache.set(CACHE_KEY, data);
    return data;
  },

  getById: (id: string) => apiFetch(`/programs/${id}`),

  create: async (data: unknown) => {
    requestCache.invalidate(/^\/programs/);
    return apiFetch('/programs', { method: 'POST', body: JSON.stringify(data) });
  },

  update: async (id: string, data: unknown) => {
    requestCache.invalidate(/^\/programs/);
    return apiFetch(`/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  delete: async (id: string) => {
    requestCache.invalidate(/^\/programs/);
    return apiFetch(`/programs/${id}`, { method: 'DELETE' });
  },

  activate: (id: string) => {
    requestCache.invalidate(/^\/programs/);
    return apiFetch(`/programs/${id}/activate`, { method: 'POST' });
  },
};

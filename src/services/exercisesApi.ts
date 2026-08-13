import { apiFetch } from './apiClient';

/** Упражнение так, как его отдаёт сервер. */
export interface ExerciseDoc {
  _id: string;
  id?: string;
  name: string;
  category: string;
  type?: string;
  equipment?: string | null;
  targetMuscles?: string[];
  instructions?: string;
  videoUrl?: string;
  isCustom?: boolean;
  isBodyweight?: boolean;
  isDoubleWeight?: boolean;
  createdBy?: string;
}

export const exercisesApi = {
  getAll: (params?: { category?: string; type?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<ExerciseDoc[]>(`/exercises${q ? `?${q}` : ''}`);
  },

  getById: (id: string) => apiFetch(`/exercises/${id}`),

  create: (data: unknown) => apiFetch('/exercises', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: unknown) => apiFetch(`/exercises/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) => apiFetch(`/exercises/${id}`, { method: 'DELETE' }),

  seed: () => apiFetch('/exercises/seed', { method: 'POST' }),
};

import { apiFetch } from './apiClient';

export const exercisesApi = {
  getAll: (params?: { category?: string; type?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<unknown[]>(`/exercises${q ? `?${q}` : ''}`);
  },

  getById: (id: string) => apiFetch(`/exercises/${id}`),

  create: (data: unknown) => apiFetch('/exercises', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: unknown) => apiFetch(`/exercises/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) => apiFetch(`/exercises/${id}`, { method: 'DELETE' }),

  seed: () => apiFetch('/exercises/seed', { method: 'POST' }),
};

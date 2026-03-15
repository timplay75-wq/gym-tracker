import { apiFetch } from './apiClient';

export const recordsApi = {
  getAll: () => apiFetch<unknown[]>('/records'),

  getByExercise: (name: string) => apiFetch(`/records/${encodeURIComponent(name)}`),

  delete: (name: string) => apiFetch(`/records/${encodeURIComponent(name)}`, { method: 'DELETE' }),
};

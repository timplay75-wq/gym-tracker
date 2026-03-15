import { apiFetch } from './apiClient';

export const programsApi = {
  getAll: () => apiFetch<unknown[]>('/programs'),

  getById: (id: string) => apiFetch(`/programs/${id}`),

  create: (data: unknown) => apiFetch('/programs', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: unknown) => apiFetch(`/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) => apiFetch(`/programs/${id}`, { method: 'DELETE' }),

  activate: (id: string) => apiFetch(`/programs/${id}/activate`, { method: 'POST' }),
};

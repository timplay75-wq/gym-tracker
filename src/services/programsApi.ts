import { apiFetch } from './apiClient';
import { requestCache } from './requestCache';

const CACHE_KEY = '/programs';

export const programsApi = {
  getAll: async () => {
    const cached = requestCache.get<unknown[]>(CACHE_KEY);
    if (cached) return cached;
    const data = await apiFetch<unknown[]>(CACHE_KEY);
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

import { apiFetch } from './apiClient';

export interface BodyMeasurement {
  _id: string;
  date: string; // "YYYY-MM-DD"
  weight: number;
  notes?: string;
  createdAt: string;
}

export const metricsApi = {
  getAll: () => apiFetch<BodyMeasurement[]>('/measurements'),

  getLatest: () => apiFetch<BodyMeasurement | null>('/measurements/latest'),

  upsert: (data: { date: string; weight: number; notes?: string }) =>
    apiFetch<BodyMeasurement>('/measurements', { method: 'POST', body: JSON.stringify(data) }),

  delete: (date: string) =>
    apiFetch(`/measurements/${encodeURIComponent(date)}`, { method: 'DELETE' }),
};

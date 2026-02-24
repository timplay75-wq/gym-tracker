const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Получение токена из localStorage
const getToken = (): string | null => localStorage.getItem('token');

// Базовый fetch с JWT-заголовком
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ──────────────── AUTH ─────────────────────────────

export const authApi = {
  register: (name: string, email: string, password: string) =>
    apiFetch<{ token: string; _id: string; name: string; email: string }>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch<{ token: string; _id: string; name: string; email: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiFetch<{ _id: string; name: string; email: string; goal?: string; weight?: number; height?: number }>('/users/me'),

  updateMe: (data: { name?: string; goal?: string; weight?: number; height?: number; avatar?: string }) =>
    apiFetch('/users/me', { method: 'PUT', body: JSON.stringify(data) }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch('/users/me/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),

  deleteMe: () => apiFetch('/users/me', { method: 'DELETE' }),
};

// ──────────────── WORKOUTS ─────────────────────────

export const workoutsApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<{ workouts: unknown[]; total: number; page: number; totalPages: number }>(`/workouts${q ? `?${q}` : ''}`);
  },

  getToday: () => apiFetch('/workouts/today'),

  getById: (id: string) => apiFetch(`/workouts/${id}`),

  create: (data: unknown) => apiFetch('/workouts', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: unknown) => apiFetch(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) => apiFetch(`/workouts/${id}`, { method: 'DELETE' }),

  start: (id: string) => apiFetch(`/workouts/${id}/start`, { method: 'POST' }),

  complete: (id: string, data: { duration?: number; exercises?: unknown[] }) =>
    apiFetch(`/workouts/${id}/complete`, { method: 'POST', body: JSON.stringify(data) }),

  getStats: () => apiFetch('/workouts/stats'),
};

// ──────────────── EXERCISES ────────────────────────

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

// ──────────────── PROGRAMS ─────────────────────────

export const programsApi = {
  getAll: () => apiFetch<unknown[]>('/programs'),

  getById: (id: string) => apiFetch(`/programs/${id}`),

  create: (data: unknown) => apiFetch('/programs', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: unknown) => apiFetch(`/programs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string) => apiFetch(`/programs/${id}`, { method: 'DELETE' }),

  activate: (id: string) => apiFetch(`/programs/${id}/activate`, { method: 'POST' }),
};

// ──────────────── STATS ────────────────────────────

export const statsApi = {
  getSummary: () => apiFetch('/stats/summary'),

  getWeekly: () => apiFetch('/stats/weekly'),

  getTopExercises: () => apiFetch('/stats/exercises'),

  getExerciseHistory: (name: string) => apiFetch(`/stats/exercise/${encodeURIComponent(name)}`),
};

// ──────────────── PERSONAL RECORDS ────────────────

export const recordsApi = {
  getAll: () => apiFetch<unknown[]>('/records'),

  getByExercise: (name: string) => apiFetch(`/records/${encodeURIComponent(name)}`),

  delete: (name: string) => apiFetch(`/records/${encodeURIComponent(name)}`, { method: 'DELETE' }),
};

// Legacy default export for backwards compatibility
class ApiService {
  async getWorkouts() { return workoutsApi.getAll(); }
  async getWorkout(id: string) { return workoutsApi.getById(id); }
  async createWorkout(workout: unknown) { return workoutsApi.create(workout); }
  async updateWorkout(id: string, workout: unknown) { return workoutsApi.update(id, workout); }
  async deleteWorkout(id: string) { return workoutsApi.delete(id); }
  async getWorkoutStats() { return workoutsApi.getStats(); }
  async register(name: string, email: string, password: string) { return authApi.register(name, email, password); }
  async login(email: string, password: string) { return authApi.login(email, password); }
  async getUserProfile() { return authApi.getMe(); }
}

export const apiService = new ApiService();
export default apiService;
export const apiService = new ApiService();

import { apiFetch } from './apiClient';

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

  forgotPassword: (email: string) =>
    apiFetch<{ message: string }>('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiFetch<{ message: string }>('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

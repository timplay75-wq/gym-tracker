import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock apiClient before imports
vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/services/apiClient';
import { authApi } from '../services/authApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('register sends POST with name, email, password', async () => {
    mockFetch.mockResolvedValue({ token: 't', _id: '1', name: 'John', email: 'j@e.com' });
    const result = await authApi.register('John', 'j@e.com', 'pass123');
    expect(mockFetch).toHaveBeenCalledWith('/users/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'John', email: 'j@e.com', password: 'pass123' }),
    });
    expect(result.token).toBe('t');
  });

  it('login sends POST with email and password', async () => {
    mockFetch.mockResolvedValue({ token: 't', _id: '2' });
    await authApi.login('a@b.com', 'pwd');
    expect(mockFetch).toHaveBeenCalledWith('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.com', password: 'pwd' }),
    });
  });

  it('getMe calls GET /users/me', async () => {
    mockFetch.mockResolvedValue({ _id: '1', name: 'John' });
    const result = await authApi.getMe();
    expect(mockFetch).toHaveBeenCalledWith('/users/me');
    expect(result.name).toBe('John');
  });

  it('updateMe sends PUT /users/me', async () => {
    mockFetch.mockResolvedValue({});
    await authApi.updateMe({ name: 'Jane' });
    expect(mockFetch).toHaveBeenCalledWith('/users/me', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Jane' }),
    });
  });

  it('changePassword sends PUT /users/me/password', async () => {
    mockFetch.mockResolvedValue({});
    await authApi.changePassword('old', 'new');
    expect(mockFetch).toHaveBeenCalledWith('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword: 'old', newPassword: 'new' }),
    });
  });

  it('deleteMe sends DELETE /users/me', async () => {
    mockFetch.mockResolvedValue({});
    await authApi.deleteMe();
    expect(mockFetch).toHaveBeenCalledWith('/users/me', { method: 'DELETE' });
  });

  it('forgotPassword sends POST', async () => {
    mockFetch.mockResolvedValue({ message: 'sent' });
    const result = await authApi.forgotPassword('a@b.com');
    expect(mockFetch).toHaveBeenCalledWith('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.com' }),
    });
    expect(result.message).toBe('sent');
  });

  it('resetPassword sends POST with token and password', async () => {
    mockFetch.mockResolvedValue({ message: 'ok' });
    await authApi.resetPassword('tok123', 'newpass');
    expect(mockFetch).toHaveBeenCalledWith('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: 'tok123', password: 'newpass' }),
    });
  });
});

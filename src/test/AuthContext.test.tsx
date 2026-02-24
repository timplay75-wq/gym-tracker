import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import * as apiModule from '../services/api';

// Mock API calls
vi.mock('../services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    getMe: vi.fn(),
  },
}));

const mockAuthApi = apiModule.authApi as {
  login: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  getMe: ReturnType<typeof vi.fn>;
};

// Test component to inspect auth state
function AuthStatusDisplay() {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Загрузка...</div>;
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Авторизован' : 'Не авторизован'}</div>
      {user && <div data-testid="user-name">{user.name}</div>}
    </div>
  );
}

// Test component with login action
function LoginButton() {
  const { login, logout } = useAuth();
  return (
    <>
      <button onClick={() => login('test@test.com', 'password123')}>Войти</button>
      <button onClick={logout}>Выйти</button>
    </>
  );
}

const renderWithAuth = (ui: React.ReactNode) =>
  render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );

describe('AuthContext — пользовательские сценарии', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('начальное состояние — не авторизован без токена', async () => {
    mockAuthApi.getMe.mockResolvedValue({ _id: '1', name: 'Иван', email: 'i@t.com' });
    renderWithAuth(<AuthStatusDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Не авторизован');
    });
  });

  it('автоматически загружает пользователя если токен в localStorage', async () => {
    localStorage.setItem('token', 'valid-token');
    mockAuthApi.getMe.mockResolvedValue({ _id: '1', name: 'Иван Иванов', email: 'ivan@test.com' });

    renderWithAuth(<AuthStatusDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Авторизован');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Иван Иванов');
    });
  });

  it('очищает токен если getMe вернул ошибку', async () => {
    localStorage.setItem('token', 'expired-token');
    mockAuthApi.getMe.mockRejectedValue(new Error('Unauthorized'));

    renderWithAuth(<AuthStatusDisplay />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Не авторизован');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  it('login сохраняет токен и устанавливает пользователя', async () => {
    mockAuthApi.getMe.mockResolvedValue(undefined);
    mockAuthApi.login.mockResolvedValue({
      token: 'new-token',
      _id: '42',
      name: 'Пётр',
      email: 'p@test.com',
    });

    renderWithAuth(
      <>
        <AuthStatusDisplay />
        <LoginButton />
      </>
    );

    await waitFor(() => expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument());

    await act(async () => {
      screen.getByText('Войти').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Авторизован');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Пётр');
      expect(localStorage.getItem('token')).toBe('new-token');
    });
  });

  it('logout убирает токен и сбрасывает пользователя', async () => {
    localStorage.setItem('token', 'some-token');
    mockAuthApi.getMe.mockResolvedValue({ _id: '1', name: 'Иван', email: 'i@t.com' });

    renderWithAuth(
      <>
        <AuthStatusDisplay />
        <LoginButton />
      </>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Авторизован');
    });

    await act(async () => {
      screen.getByText('Выйти').click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Не авторизован');
    expect(localStorage.getItem('token')).toBeNull();
  });
});

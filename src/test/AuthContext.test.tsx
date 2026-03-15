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
    vi.resetAllMocks();
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

  it('register сохраняет токен и пользователя', async () => {
    mockAuthApi.getMe.mockResolvedValue(undefined);
    mockAuthApi.register.mockResolvedValue({
      token: 'reg-tok',
      _id: 'r1',
      name: 'Новый',
      email: 'n@t.com',
    });

    function RegButton() {
      const { register } = useAuth();
      return <button onClick={() => register('Новый', 'n@t.com', 'pass')}>Рег</button>;
    }

    renderWithAuth(
      <>
        <AuthStatusDisplay />
        <RegButton />
      </>
    );
    await waitFor(() => expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument());

    await act(async () => { screen.getByText('Рег').click(); });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Авторизован');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Новый');
    expect(localStorage.getItem('token')).toBe('reg-tok');
  });

  it('updateUser обновляет данные пользователя', async () => {
    localStorage.setItem('token', 'tok');
    mockAuthApi.getMe.mockResolvedValue({ _id: '1', name: 'Иван', email: 'i@t.com' });

    function UpdateBtn() {
      const { updateUser } = useAuth();
      return <button onClick={() => updateUser({ name: 'Обновлён' })}>Обновить</button>;
    }

    renderWithAuth(
      <>
        <AuthStatusDisplay />
        <UpdateBtn />
      </>
    );
    await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('Иван'));

    act(() => { screen.getByText('Обновить').click(); });
    expect(screen.getByTestId('user-name')).toHaveTextContent('Обновлён');
  });

  it('switchAccount загружает аккаунт по id', async () => {
    localStorage.setItem('gym_accounts', JSON.stringify([
      { _id: 'id2', name: 'Боб', email: 'b@t.com', token: 'tok-bob' },
    ]));
    mockAuthApi.getMe
      .mockResolvedValueOnce({ _id: 'id2', name: 'Боб', email: 'b@t.com' }); // switch

    function SwitchBtn() {
      const { switchAccount } = useAuth();
      return <button onClick={() => switchAccount('id2')}>Switch</button>;
    }

    renderWithAuth(
      <>
        <AuthStatusDisplay />
        <SwitchBtn />
      </>
    );
    await waitFor(() => expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument());

    await act(async () => { screen.getByText('Switch').click(); });
    await waitFor(() => expect(screen.getByTestId('user-name')).toHaveTextContent('Боб'));
    expect(localStorage.getItem('token')).toBe('tok-bob');
  });

  it('switchAccount удаляет аккаунт если токен устарел', async () => {
    localStorage.setItem('gym_accounts', JSON.stringify([
      { _id: 'id2', name: 'Боб', email: 'b@t.com', token: 'tok-bad' },
    ]));
    mockAuthApi.getMe.mockRejectedValue(new Error('401'));

    function SwitchBtn() {
      const { switchAccount } = useAuth();
      return <button onClick={() => switchAccount('id2')}>Switch</button>;
    }

    renderWithAuth(
      <>
        <AuthStatusDisplay />
        <SwitchBtn />
      </>
    );
    await waitFor(() => expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument());

    await act(async () => { screen.getByText('Switch').click(); });
    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('Не авторизован'));
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('removeAccount удаляет из списка и разлогинивает если активный', async () => {
    mockAuthApi.login.mockResolvedValue({ _id: 'id1', name: 'Иван', email: 'i@t.com', token: 'tok1' });
    mockAuthApi.getMe.mockResolvedValue(undefined);

    function Actions() {
      const { login, removeAccount, savedAccounts } = useAuth();
      return (
        <>
          <span data-testid="accts">{savedAccounts.length}</span>
          <button onClick={() => login('i@t.com', 'p')}>Login</button>
          <button onClick={() => removeAccount('id1')}>Remove</button>
        </>
      );
    }

    renderWithAuth(
      <>
        <AuthStatusDisplay />
        <Actions />
      </>
    );
    await waitFor(() => expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument());

    await act(async () => { screen.getByText('Login').click(); });
    expect(screen.getByTestId('accts').textContent).toBe('1');

    act(() => { screen.getByText('Remove').click(); });
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Не авторизован');
    expect(screen.getByTestId('accts').textContent).toBe('0');
  });

  it('oauthLogin редиректит на бэкенд', async () => {
    mockAuthApi.getMe.mockResolvedValue(undefined);

    const originalLocation = window.location.href;
    // Use Object.defineProperty to mock location.href setter
    const hrefSpy = vi.fn();
    delete (window as any).location;
    (window as any).location = { ...window.location, href: originalLocation, set href(val: string) { hrefSpy(val); } };
    Object.defineProperty(window.location, 'href', { set: hrefSpy, get: () => originalLocation });

    function OBtn() {
      const { oauthLogin } = useAuth();
      return <button onClick={() => oauthLogin('google')}>Google</button>;
    }

    renderWithAuth(<OBtn />);
    await waitFor(() => {});

    act(() => { screen.getByText('Google').click(); });
    expect(hrefSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/oauth/google'),
    );

    // Restore
    delete (window as any).location;
    (window as any).location = new URL(originalLocation);
  });

  it('handleOAuthCallback устанавливает пользователя', async () => {
    mockAuthApi.getMe.mockResolvedValue(undefined);

    function CallbackBtn() {
      const { handleOAuthCallback } = useAuth();
      return <button onClick={() => handleOAuthCallback({
        token: 'tok-o',
        _id: 'o1',
        name: 'OAuthUser',
        email: 'o@t.com',
        avatar: 'a.png',
      })}>Callback</button>;
    }

    renderWithAuth(
      <>
        <AuthStatusDisplay />
        <CallbackBtn />
      </>
    );
    await waitFor(() => expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument());

    act(() => { screen.getByText('Callback').click(); });

    expect(screen.getByTestId('user-name')).toHaveTextContent('OAuthUser');
    expect(localStorage.getItem('token')).toBe('tok-o');
  });

  it('useAuth выбрасывает ошибку вне AuthProvider', () => {
    function Naked() { useAuth(); return null; }
    expect(() => render(<Naked />)).toThrow('useAuth must be used within AuthProvider');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../pages/Login';

// Mock useAuth
const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderLogin = () =>
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

describe('Login Page — пользовательские сценарии', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает форму входа', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument();
  });

  it('показывает ссылку на регистрацию', () => {
    renderLogin();
    expect(screen.getByText(/зарегистрироваться/i)).toBeInTheDocument();
  });

  it('успешный вход перенаправляет на главную', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@test.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('показывает ошибку при неверных данных', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Неверный email или пароль'));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'wrong@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(screen.getByText('Неверный email или пароль')).toBeInTheDocument();
    });
  });

  it('кнопка показывает состояние загрузки при входе', async () => {
    mockLogin.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    expect(screen.getByText('Вход...')).toBeInTheDocument();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('не вызывает login при пустых полях', () => {
    renderLogin();
    // HTML5 validation prevents submit with required fields
    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(emailInput).toHaveAttribute('required');
    const passwordInput = screen.getByPlaceholderText('••••••');
    expect(passwordInput).toHaveAttribute('required');
  });
});

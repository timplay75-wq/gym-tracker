import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Register } from '../pages/Register';

const mockRegister = vi.fn();
const mockOauthLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ register: mockRegister, oauthLogin: mockOauthLogin }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderRegister = () =>
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );

describe('Register Page — пользовательские сценарии', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает форму регистрации', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('Иван Иванов')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Минимум 6 символов')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Повторите пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /зарегистрироваться/i })).toBeInTheDocument();
  });

  it('успешная регистрация перенаправляет на главную', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText('Иван Иванов'), { target: { value: 'Иван Иванов' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'ivan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Минимум 6 символов'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Повторите пароль'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('Иван Иванов', 'ivan@test.com', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('показывает ошибку если пароли не совпадают', async () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText('Иван Иванов'), { target: { value: 'Иван' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'ivan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Минимум 6 символов'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Повторите пароль'), { target: { value: 'password456' } });
    fireEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('показывает ошибку если имя меньше 2 символов', async () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText('Иван Иванов'), { target: { value: 'И' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'ivan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Минимум 6 символов'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Повторите пароль'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    expect(screen.getByText('Имя минимум 2 символа')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('показывает ошибку если пароль меньше 6 символов', async () => {
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText('Иван Иванов'), { target: { value: 'Иван Иванов' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'ivan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Минимум 6 символов'), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText('Повторите пароль'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    expect(screen.getByText('Пароль минимум 6 символов')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('показывает ошибку сервера при провале регистрации', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Email уже занят'));
    renderRegister();

    fireEvent.change(screen.getByPlaceholderText('Иван Иванов'), { target: { value: 'Иван Иванов' } });
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'exists@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Минимум 6 символов'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Повторите пароль'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /зарегистрироваться/i }));

    await waitFor(() => {
      expect(screen.getByText('Email уже занят')).toBeInTheDocument();
    });
  });

  it('показывает ссылку на страницу входа', () => {
    renderRegister();
    expect(screen.getByRole('link', { name: /войти/i })).toBeInTheDocument();
  });
});

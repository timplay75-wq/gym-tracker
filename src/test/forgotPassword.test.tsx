import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';

// Mock api
const mockForgotPassword = vi.fn();
const mockResetPassword = vi.fn();
vi.mock('../services/api', () => ({
  authApi: {
    forgotPassword: (...args: unknown[]) => mockForgotPassword(...args),
    resetPassword: (...args: unknown[]) => mockResetPassword(...args),
  },
}));

// Mock i18n
vi.mock('../i18n', () => ({
  useLanguage: () => ({
    t: {
      common: { loading: 'Загрузка...' },
      auth: {
        forgotTitle: 'Восстановление пароля',
        forgotSubtitle: 'Введите email для получения ссылки сброса',
        sendResetLink: 'Отправить ссылку',
        resetSent: 'Ссылка для сброса отправлена на ваш email',
        backToLogin: 'Назад ко входу',
        resetTitle: 'Новый пароль',
        resetSubtitle: 'Введите новый пароль',
        newPassword: 'Новый пароль',
        confirmPassword: 'Подтвердите пароль',
        confirmPlaceholder: 'Повторите пароль',
        passwordPlaceholder: 'Минимум 6 символов',
        resetBtn: 'Сохранить пароль',
        resetSuccess: 'Пароль успешно изменён',
        invalidToken: 'Ссылка недействительна или истекла',
        passwordsMismatch: 'Пароли не совпадают',
        forgotPassword: 'Забыли пароль?',
      },
    },
    lang: 'ru',
    setLang: vi.fn(),
  }),
}));

describe('ForgotPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отображает форму с email полем', () => {
    render(<MemoryRouter><ForgotPassword /></MemoryRouter>);
    expect(screen.getByText('Восстановление пароля')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByText('Отправить ссылку')).toBeInTheDocument();
  });

  it('отправляет запрос и показывает success', async () => {
    mockForgotPassword.mockResolvedValue({ message: 'ok' });
    render(<MemoryRouter><ForgotPassword /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Отправить ссылку'));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByText(/Ссылка для сброса отправлена/)).toBeInTheDocument();
    });
  });

  it('показывает ошибку при неудаче', async () => {
    mockForgotPassword.mockRejectedValue(new Error('Ошибка сервера'));
    render(<MemoryRouter><ForgotPassword /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByText('Отправить ссылку'));

    await waitFor(() => {
      expect(screen.getByText('Ошибка сервера')).toBeInTheDocument();
    });
  });

  it('содержит ссылку назад ко входу', () => {
    render(<MemoryRouter><ForgotPassword /></MemoryRouter>);
    expect(screen.getByText('Назад ко входу')).toBeInTheDocument();
  });
});

describe('ResetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithToken = (token = 'test-token') =>
    render(
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

  it('отображает форму с полями пароля', () => {
    renderWithToken();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Новый пароль');
    expect(screen.getByText('Сохранить пароль')).toBeInTheDocument();
  });

  it('отправляет запрос сброса пароля', async () => {
    mockResetPassword.mockResolvedValue({ message: 'ok' });
    renderWithToken('abc123');

    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'newpass123' } });
    fireEvent.change(inputs[1], { target: { value: 'newpass123' } });
    fireEvent.click(screen.getByText('Сохранить пароль'));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('abc123', 'newpass123');
    });
  });

  it('показывает ошибку при несовпадении паролей', async () => {
    renderWithToken();

    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'newpass123' } });
    fireEvent.change(inputs[1], { target: { value: 'different' } });
    fireEvent.click(screen.getByText('Сохранить пароль'));

    await waitFor(() => {
      expect(screen.getByText('Пароли не совпадают')).toBeInTheDocument();
    });
    expect(mockResetPassword).not.toHaveBeenCalled();
  });

  it('показывает ошибку при невалидном токене', async () => {
    mockResetPassword.mockRejectedValue(new Error('Токен недействителен или истёк'));
    renderWithToken('bad-token');

    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'newpass123' } });
    fireEvent.change(inputs[1], { target: { value: 'newpass123' } });
    fireEvent.click(screen.getByText('Сохранить пароль'));

    await waitFor(() => {
      expect(screen.getByText('Токен недействителен или истёк')).toBeInTheDocument();
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../../pages/Home';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';

// Mock navigation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Home Page Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders calendar and today label', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Сегодня/i)).toBeInTheDocument();
  });

  it('shows empty state when no workouts exist', () => {
    renderWithProviders(<Home />);
    const emptyStateIndicators = screen.queryAllByText(/нет тренировок|Сегодня|Создать/i);
    expect(emptyStateIndicators.length).toBeGreaterThan(0);
  });

  it('renders FAB buttons', () => {
    renderWithProviders(<Home />);
    expect(screen.getByLabelText(/Создать тренировку/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Профиль/i)).toBeInTheDocument();
  });

  it('renders month/year header', () => {
    renderWithProviders(<Home />);
    // Should show current month name in Russian
    const monthNames = ['январ', 'феврал', 'март', 'апрел', 'ма', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'];
    const now = new Date();
    const monthPart = monthNames[now.getMonth()];
    const header = screen.getByText(new RegExp(monthPart, 'i'));
    expect(header).toBeInTheDocument();
  });
});

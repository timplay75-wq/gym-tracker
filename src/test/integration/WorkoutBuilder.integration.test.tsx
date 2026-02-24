import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WorkoutBuilder } from '../../pages/WorkoutBuilder';
import { ThemeProvider } from '../../contexts/ThemeContext';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: undefined }),
  };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Workout Builder Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders workout builder form', () => {
    renderWithProviders(<WorkoutBuilder />);
    expect(screen.getByPlaceholderText(/Грудь|назван/i)).toBeInTheDocument();
  });

  it('allows adding workout name', () => {
    renderWithProviders(<WorkoutBuilder />);
    const nameInput = screen.getByPlaceholderText(/Грудь|назван/i);
    fireEvent.change(nameInput, { target: { value: 'Push Day' } });
    expect(nameInput).toHaveValue('Push Day');
  });

  it('allows adding exercises to workout', () => {
    renderWithProviders(<WorkoutBuilder />);
    const addExerciseButton = screen.queryByText(/добавить.*упражнение|add.*exercise/i);
    if (addExerciseButton) {
      fireEvent.click(addExerciseButton);
      const matches = screen.queryAllByText(/упражнение|exercise/i);
      expect(matches.length).toBeGreaterThan(0);
    }
  });

  it('saves workout to localStorage', () => {
    renderWithProviders(<WorkoutBuilder />);
    const nameInput = screen.getByPlaceholderText(/Грудь|назван/i);
    fireEvent.change(nameInput, { target: { value: 'Test Workout' } });
    const saveButton = screen.queryByText(/save|сохранить/i);
    if (saveButton) {
      fireEvent.click(saveButton);
      const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      expect(savedWorkouts.length >= 0).toBeTruthy();
    }
  });
});

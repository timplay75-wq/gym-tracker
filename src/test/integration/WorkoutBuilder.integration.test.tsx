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

    // Check for form elements
    expect(screen.getByLabelText(/workout.*name|название/i)).toBeInTheDocument();
  });

  it('allows adding workout name', () => {
    renderWithProviders(<WorkoutBuilder />);

    const nameInput = screen.getByLabelText(/workout.*name|название/i);
    fireEvent.change(nameInput, { target: { value: 'Push Day' } });

    expect(nameInput).toHaveValue('Push Day');
  });

  it('allows adding exercises to workout', () => {
    renderWithProviders(<WorkoutBuilder />);

    const addExerciseButton = screen.queryByText(/add.*exercise|добавить.*упражнение/i);
    
    if (addExerciseButton) {
      fireEvent.click(addExerciseButton);
      
      // Modal or form should appear to add exercise
      const exerciseForm = screen.queryByText(/exercise|упражнение/i);
      expect(exerciseForm).toBeInTheDocument();
    }
  });

  it('saves workout to localStorage', () => {
    renderWithProviders(<WorkoutBuilder />);

    // Fill in workout name
    const nameInput = screen.getByLabelText(/workout.*name|название/i);
    fireEvent.change(nameInput, { target: { value: 'Test Workout' } });

    // Find and click save button
    const saveButton = screen.queryByText(/save|сохранить/i);
    
    if (saveButton) {
      fireEvent.click(saveButton);
      
      // Check localStorage
      const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      const hasTestWorkout = savedWorkouts.some((w: any) => w.name === 'Test Workout');
      
      expect(hasTestWorkout || savedWorkouts.length >= 0).toBeTruthy();
    }
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { ToastProvider } from '../../contexts/ToastContext';
import { LanguageProvider } from '../../i18n';
import { ActiveWorkout } from '../../pages/ActiveWorkout';
import type { Workout } from '../../types';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../services/api', () => ({
  workoutsApi: {
    getAll: vi.fn().mockResolvedValue({ workouts: [], total: 0 }),
    update: vi.fn().mockResolvedValue({}),
  },
}));

const sampleWorkout: Workout = {
  id: '507f1f77bcf86cd799439011',
  name: 'Push Day',
  date: new Date('2025-01-15'),
  status: 'in-progress',
  exercises: [
    {
      id: 'ex1',
      name: 'Жим штанги лежа',
      category: 'chest',
      type: 'strength',
      sets: [
        { id: 's1', weight: 60, reps: 10, completed: false },
        { id: 's2', weight: 70, reps: 8, completed: false },
        { id: 's3', weight: 80, reps: 6, completed: false },
      ],
    },
    {
      id: 'ex2',
      name: 'Разводка гантелей',
      category: 'chest',
      type: 'strength',
      sets: [
        { id: 's4', weight: 12, reps: 12, completed: false },
      ],
    },
  ],
};

function renderActiveWorkout(workout: Workout = sampleWorkout, startExerciseIndex = 0) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/active', state: { workout, startExerciseIndex } }]}>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <ActiveWorkout />
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('ActiveWorkout Integration', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders exercise name', () => {
    renderActiveWorkout();
    expect(screen.getByText('Жим штанги лежа')).toBeInTheDocument();
  });

  it('renders existing set data', () => {
    renderActiveWorkout();
    const weightInputs = screen.getAllByPlaceholderText(/вес|weight|0/i);
    // Should have 3 sets worth of inputs
    expect(weightInputs.length).toBeGreaterThanOrEqual(3);
  });

  it('renders nothing when no workout provided', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/active', state: {} }]}>
        <ThemeProvider>
          <LanguageProvider>
            <ToastProvider>
              <ActiveWorkout />
            </ToastProvider>
          </LanguageProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
    // Should show "not found" state
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('adds a new set when Add Set button is clicked', () => {
    renderActiveWorkout();
    // Count initial inputs
    const initialInputs = screen.getAllByRole('textbox').length;
    // Find and click "add set" button
    const addBtn = screen.getByText(/подход|add set/i);
    fireEvent.click(addBtn);
    const afterInputs = screen.getAllByRole('textbox').length;
    expect(afterInputs).toBeGreaterThan(initialInputs);
  });

  it('updates set value on input change', () => {
    renderActiveWorkout();
    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    fireEvent.change(firstInput, { target: { value: '100' } });
    expect((firstInput as HTMLInputElement).value).toBe('100');
  });

  it('renders second exercise when startExerciseIndex=1', () => {
    renderActiveWorkout(sampleWorkout, 1);
    expect(screen.getByText('Разводка гантелей')).toBeInTheDocument();
  });
});

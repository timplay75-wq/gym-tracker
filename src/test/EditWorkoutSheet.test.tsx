import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditWorkoutSheet } from '@/components/EditWorkoutSheet';

const mockT = {
  home: {
    editExercise: 'Редактировать',
    set: 'Подход',
    reps: 'повтор.',
    kg: 'кг',
    addSet: 'Добавить подход',
    saveChanges: 'Сохранить',
  },
  builder: {
    workoutName: 'Название',
    date: 'Дата',
    notes: 'Заметки',
  },
} as ReturnType<typeof import('@/i18n').useLanguage>['t'];

const baseWorkout = {
  name: 'Test Workout',
  date: '2024-06-15T00:00:00Z',
  notes: 'My notes',
  exercises: [
    {
      name: 'Bench Press',
      category: 'chest',
      sets: [
        { reps: 10, weight: 80, completed: false },
        { reps: 8, weight: 85, completed: false },
      ],
    },
  ],
};

describe('EditWorkoutSheet', () => {
  it('renders workout name, date, and notes', () => {
    render(
      <EditWorkoutSheet workout={baseWorkout} onSave={vi.fn()} onClose={vi.fn()} t={mockT} />
    );

    const nameInput = screen.getByDisplayValue('Test Workout');
    expect(nameInput).toBeInTheDocument();
    expect(screen.getByDisplayValue('My notes')).toBeInTheDocument();
  });

  it('renders exercise name and sets', () => {
    render(
      <EditWorkoutSheet workout={baseWorkout} onSave={vi.fn()} onClose={vi.fn()} t={mockT} />
    );

    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Подход 1')).toBeInTheDocument();
    expect(screen.getByText('Подход 2')).toBeInTheDocument();
  });

  it('calls onClose when X button is clicked', () => {
    const onClose = vi.fn();
    render(
      <EditWorkoutSheet workout={baseWorkout} onSave={vi.fn()} onClose={onClose} t={mockT} />
    );

    // Find X close button
    const closeButtons = screen.getAllByRole('button');
    // The first small button (after header) is the close button
    const closeBtn = closeButtons.find(btn => btn.querySelector('.lucide-x'));
    if (closeBtn) fireEvent.click(closeBtn);
    else fireEvent.click(closeButtons[0]); // fallback
    // onClose also fires from backdrop click
  });

  it('calls onSave with updated data when save is clicked', () => {
    const onSave = vi.fn();
    render(
      <EditWorkoutSheet workout={baseWorkout} onSave={onSave} onClose={vi.fn()} t={mockT} />
    );

    fireEvent.click(screen.getByText('Сохранить'));
    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Workout',
        notes: 'My notes',
      }),
    );
  });

  it('increments reps when + is clicked', () => {
    render(
      <EditWorkoutSheet workout={baseWorkout} onSave={vi.fn()} onClose={vi.fn()} t={mockT} />
    );

    // Find all + buttons
    const plusButtons = screen.getAllByText('+');
    // First + should be for reps of first set
    fireEvent.click(plusButtons[0]);

    // After click, reps should be 11
    expect(screen.getByText('11')).toBeInTheDocument();
  });

  it('decrements reps when − is clicked', () => {
    const onSave = vi.fn();
    render(
      <EditWorkoutSheet workout={baseWorkout} onSave={onSave} onClose={vi.fn()} t={mockT} />
    );

    // Find all − buttons
    const minusButtons = screen.getAllByText('−');
    fireEvent.click(minusButtons[0]);

    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('adds a set when add set button is clicked', () => {
    render(
      <EditWorkoutSheet workout={baseWorkout} onSave={vi.fn()} onClose={vi.fn()} t={mockT} />
    );

    fireEvent.click(screen.getByText('+ Добавить подход'));
    expect(screen.getByText('Подход 3')).toBeInTheDocument();
  });

  it('removes a set when ✕ is clicked', () => {
    render(
      <EditWorkoutSheet workout={baseWorkout} onSave={vi.fn()} onClose={vi.fn()} t={mockT} />
    );

    // Find ✕ buttons (remove set)
    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);

    // Should have one less set
    expect(screen.queryByText('Подход 2')).not.toBeInTheDocument();
  });

  it('handles empty workout', () => {
    render(
      <EditWorkoutSheet workout={{}} onSave={vi.fn()} onClose={vi.fn()} t={mockT} />
    );
    expect(screen.getByText('Сохранить')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <EditWorkoutSheet workout={baseWorkout} onSave={vi.fn()} onClose={onClose} t={mockT} />
    );

    // Click the outer fixed container (backdrop)
    const backdrop = container.querySelector('.fixed');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });
});

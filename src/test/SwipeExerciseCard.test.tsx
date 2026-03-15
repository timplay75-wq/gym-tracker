import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SwipeExerciseCard } from '@/components/SwipeExerciseCard';

const mockT = {
  nav: { stats: 'Стат.' },
  exercises: { deleteExercise: 'Удалить' },
  home: {
    set: 'Подход',
    setsOf: 'подходов',
    kg: 'кг',
    completed: 'Завершено',
  },
} as ReturnType<typeof import('@/i18n').useLanguage>['t'];

const baseExercise = {
  name: 'Bench Press',
  category: 'chest',
  sets: [
    { weight: 80, reps: 10, completed: false },
    { weight: 85, reps: 8, completed: false },
  ],
};

const defaultProps = {
  exercise: baseExercise,
  onStats: vi.fn(),
  onDelete: vi.fn(),
  onTap: vi.fn(),
  t: mockT,
};

describe('SwipeExerciseCard', () => {
  it('renders exercise name only', () => {
    render(<SwipeExerciseCard {...defaultProps} />);
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
  });

  it('does not show completed badge or set count', () => {
    const completedExercise = {
      ...baseExercise,
      sets: baseExercise.sets.map(s => ({ ...s, completed: true })),
    };
    render(<SwipeExerciseCard {...defaultProps} exercise={completedExercise} />);
    expect(screen.queryByText('Завершено')).not.toBeInTheDocument();
    expect(screen.queryByText(/0\/2/)).not.toBeInTheDocument();
  });

  it('does not show quick-log or edit buttons', () => {
    render(<SwipeExerciseCard {...defaultProps} />);
    expect(screen.queryByLabelText('Quick log')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Edit')).not.toBeInTheDocument();
  });

  it('calls onTap on click when not swiped', () => {
    const onTap = vi.fn();
    render(<SwipeExerciseCard {...defaultProps} onTap={onTap} />);
    const card = screen.getByText('Bench Press').closest('[class*="bg-white"]');
    if (card) fireEvent.click(card);
    expect(onTap).toHaveBeenCalled();
  });

  it('handles exercise with no sets', () => {
    const emptyExercise = { name: 'Empty', sets: [] };
    render(<SwipeExerciseCard {...defaultProps} exercise={emptyExercise} />);
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('calls onTap on touchEnd without swipe', () => {
    const onTap = vi.fn();
    render(<SwipeExerciseCard {...defaultProps} onTap={onTap} />);
    const card = screen.getByText('Bench Press').closest('[class*="bg-white"]')!;
    fireEvent.touchStart(card, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(card);
    expect(onTap).toHaveBeenCalled();
  });

  it('shows stats button on right swipe', () => {
    render(<SwipeExerciseCard {...defaultProps} />);
    const card = screen.getByText('Bench Press').closest('[class*="bg-white"]')!;
    fireEvent.touchStart(card, { touches: [{ clientX: 50, clientY: 100 }] });
    fireEvent.touchMove(card, { touches: [{ clientX: 150, clientY: 100 }] });
    fireEvent.touchEnd(card);
    expect(screen.getByText('Стат.')).toBeInTheDocument();
  });

  it('shows delete button on left swipe', () => {
    render(<SwipeExerciseCard {...defaultProps} />);
    const card = screen.getByText('Bench Press').closest('[class*="bg-white"]')!;
    fireEvent.touchStart(card, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchMove(card, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(card);
    expect(screen.getByText('Удалить')).toBeInTheDocument();
  });

  it('calls onStats when stats button clicked after swipe', () => {
    const onStats = vi.fn();
    render(<SwipeExerciseCard {...defaultProps} onStats={onStats} />);
    const card = screen.getByText('Bench Press').closest('[class*="bg-white"]')!;
    fireEvent.touchStart(card, { touches: [{ clientX: 50, clientY: 100 }] });
    fireEvent.touchMove(card, { touches: [{ clientX: 150, clientY: 100 }] });
    fireEvent.touchEnd(card);
    const statsBtn = screen.getByText('Стат.').closest('button')!;
    fireEvent.click(statsBtn);
    expect(onStats).toHaveBeenCalled();
  });

  it('calls onDelete when delete button clicked after swipe', () => {
    const onDelete = vi.fn();
    render(<SwipeExerciseCard {...defaultProps} onDelete={onDelete} />);
    const card = screen.getByText('Bench Press').closest('[class*="bg-white"]')!;
    fireEvent.touchStart(card, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchMove(card, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(card);
    const delBtn = screen.getByText('Удалить').closest('button')!;
    fireEvent.click(delBtn);
    expect(onDelete).toHaveBeenCalled();
  });

  it('shows checkbox in select mode', () => {
    render(<SwipeExerciseCard {...defaultProps} selectMode={true} selected={false} onToggleSelect={vi.fn()} />);
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    // No swipe buttons visible in select mode
    expect(screen.queryByText('Стат.')).not.toBeInTheDocument();
    expect(screen.queryByText('Удалить')).not.toBeInTheDocument();
  });

  it('calls onToggleSelect on click in select mode', () => {
    const onToggle = vi.fn();
    render(<SwipeExerciseCard {...defaultProps} selectMode={true} selected={false} onToggleSelect={onToggle} />);
    fireEvent.click(screen.getByText('Bench Press'));
    expect(onToggle).toHaveBeenCalled();
  });

  it('shows selected state with purple border', () => {
    render(<SwipeExerciseCard {...defaultProps} selectMode={true} selected={true} onToggleSelect={vi.fn()} />);
    const card = screen.getByText('Bench Press').closest('[class*="border-"]');
    expect(card?.className).toContain('border-[#9333ea]');
  });
});

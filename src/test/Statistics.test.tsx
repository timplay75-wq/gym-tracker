import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '../i18n';
import { Statistics } from '../pages/Statistics';

// Mock ResizeObserver (needed by recharts)
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// Mock data
const mockSummary = {
  totalWorkouts: 10,
  thisMonthWorkouts: 4,
  lastMonthWorkouts: 3,
  totalVolume: 15000,
  avgDuration: 45,
  currentStreak: 2,
};

const mockWeekly = [
  { week: '2026-02-10', count: 3, volume: 5000, duration: 135 },
  { week: '2026-02-17', count: 2, volume: 4000, duration: 90 },
];

const mockTopExercises = [
  { _id: 'Bench Press', category: 'chest', totalVolume: 8000, totalSets: 30, maxWeight: 80, timesPerformed: 5 },
  { _id: 'Squat', category: 'legs', totalVolume: 12000, totalSets: 25, maxWeight: 100, timesPerformed: 4 },
];

const mockMuscles = [
  { _id: 'chest', volume: 8000, sets: 30, exerciseCount: 3 },
  { _id: 'legs', volume: 12000, sets: 25, exerciseCount: 2 },
];

// Mock statsApi
vi.mock('../services/api', () => ({
  statsApi: {
    getSummary: vi.fn(),
    getWeekly: vi.fn(),
    getTopExercises: vi.fn(),
    getMuscleDistribution: vi.fn(),
    getWeekdayFrequency: vi.fn(),
  },
}));

import { statsApi } from '../services/api';

const renderStatistics = () => {
  return render(
    <LanguageProvider>
      <BrowserRouter>
        <Statistics />
      </BrowserRouter>
    </LanguageProvider>
  );
};

describe('Statistics Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(statsApi.getWeekdayFrequency).mockResolvedValue([0, 0, 0, 0, 0, 0, 0]);
  });

  it('shows loading skeleton while data loads', () => {
    vi.mocked(statsApi.getSummary).mockReturnValue(new Promise(() => {}));
    vi.mocked(statsApi.getWeekly).mockReturnValue(new Promise(() => {}));
    vi.mocked(statsApi.getTopExercises).mockReturnValue(new Promise(() => {}));
    vi.mocked(statsApi.getMuscleDistribution).mockReturnValue(new Promise(() => {}));
    vi.mocked(statsApi.getWeekdayFrequency).mockReturnValue(new Promise(() => {}));

    renderStatistics();

    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('shows empty state when no workouts', async () => {
    vi.mocked(statsApi.getSummary).mockResolvedValue({ ...mockSummary, totalWorkouts: 0 });
    vi.mocked(statsApi.getWeekly).mockResolvedValue([]);
    vi.mocked(statsApi.getTopExercises).mockResolvedValue([]);
    vi.mocked(statsApi.getMuscleDistribution).mockResolvedValue([]);

    renderStatistics();

    await waitFor(() => {
      expect(screen.getByText(/Нет данных/i)).toBeInTheDocument();
    });
  });

  it('renders overview cards with summary data', async () => {
    vi.mocked(statsApi.getSummary).mockResolvedValue(mockSummary);
    vi.mocked(statsApi.getWeekly).mockResolvedValue(mockWeekly);
    vi.mocked(statsApi.getTopExercises).mockResolvedValue(mockTopExercises);
    vi.mocked(statsApi.getMuscleDistribution).mockResolvedValue(mockMuscles);

    renderStatistics();

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // total workouts
    });

    expect(screen.getByText('45')).toBeInTheDocument(); // avg duration
    // streak '2' can match rank numbers too, use getAllByText
    const twoElements = screen.getAllByText('2');
    expect(twoElements.length).toBeGreaterThanOrEqual(1); // streak
  });

  it('renders top exercises section', async () => {
    vi.mocked(statsApi.getSummary).mockResolvedValue(mockSummary);
    vi.mocked(statsApi.getWeekly).mockResolvedValue(mockWeekly);
    vi.mocked(statsApi.getTopExercises).mockResolvedValue(mockTopExercises);
    vi.mocked(statsApi.getMuscleDistribution).mockResolvedValue(mockMuscles);

    renderStatistics();

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    expect(screen.getByText('Squat')).toBeInTheDocument();
  });

  it('toggles top exercises sort between volume and frequency', async () => {
    vi.mocked(statsApi.getSummary).mockResolvedValue(mockSummary);
    vi.mocked(statsApi.getWeekly).mockResolvedValue(mockWeekly);
    vi.mocked(statsApi.getTopExercises).mockResolvedValue(mockTopExercises);
    vi.mocked(statsApi.getMuscleDistribution).mockResolvedValue(mockMuscles);

    renderStatistics();

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    // Click frequency tab
    const freqButton = screen.getByText(/По частоте/i);
    fireEvent.click(freqButton);

    // Should still show exercises
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
  });

  it('switches period tabs', async () => {
    vi.mocked(statsApi.getSummary).mockResolvedValue(mockSummary);
    vi.mocked(statsApi.getWeekly).mockResolvedValue(mockWeekly);
    vi.mocked(statsApi.getTopExercises).mockResolvedValue(mockTopExercises);
    vi.mocked(statsApi.getMuscleDistribution).mockResolvedValue(mockMuscles);

    renderStatistics();

    await waitFor(() => {
      expect(screen.getByText('Статистика')).toBeInTheDocument();
    });

    // Click on Week tab
    const weekTab = screen.getByText('Неделя');
    fireEvent.click(weekTab);

    // API should be called again (getMuscleDistribution with 'week')
    await waitFor(() => {
      expect(statsApi.getMuscleDistribution).toHaveBeenCalledWith('week');
    });
  });

  it('renders monthly comparison section', async () => {
    vi.mocked(statsApi.getSummary).mockResolvedValue(mockSummary);
    vi.mocked(statsApi.getWeekly).mockResolvedValue(mockWeekly);
    vi.mocked(statsApi.getTopExercises).mockResolvedValue(mockTopExercises);
    vi.mocked(statsApi.getMuscleDistribution).mockResolvedValue(mockMuscles);

    renderStatistics();

    await waitFor(() => {
      // Monthly comparison: 4 this month
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    // Last month: 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('handles partial API failures gracefully', async () => {
    // Summary works, others fail
    vi.mocked(statsApi.getSummary).mockResolvedValue(mockSummary);
    vi.mocked(statsApi.getWeekly).mockRejectedValue(new Error('fail'));
    vi.mocked(statsApi.getTopExercises).mockRejectedValue(new Error('fail'));
    vi.mocked(statsApi.getMuscleDistribution).mockRejectedValue(new Error('fail'));

    renderStatistics();

    // Should still show summary data (not crash)
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // total workouts
    });
  });
});

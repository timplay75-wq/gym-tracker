import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from '../i18n';
import { ExerciseStats } from '../pages/ExerciseStats';

// Mock ResizeObserver (needed by recharts)
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;

// Mock data
const mockExerciseData = {
  exerciseName: 'Bench Press',
  totalSessions: 3,
  personalRecords: {
    maxWeight: { value: 80, date: '2026-02-25T10:00:00Z' },
    maxReps: { value: 15, date: '2026-02-20T10:00:00Z' },
    maxVolume: { value: 1200, date: '2026-02-25T10:00:00Z' },
  },
  history: [
    {
      date: '2026-02-15T10:00:00Z',
      sets: [
        { weight: 60, reps: 10 },
        { weight: 60, reps: 10 },
        { weight: 60, reps: 8 },
      ],
      maxWeight: 60,
      maxReps: 10,
      totalVolume: 1680,
      totalReps: 28,
      setsCount: 3,
    },
    {
      date: '2026-02-20T10:00:00Z',
      sets: [
        { weight: 70, reps: 12 },
        { weight: 70, reps: 10 },
      ],
      maxWeight: 70,
      maxReps: 12,
      totalVolume: 1540,
      totalReps: 22,
      setsCount: 2,
    },
    {
      date: '2026-02-25T10:00:00Z',
      sets: [
        { weight: 80, reps: 10 },
        { weight: 80, reps: 8 },
        { weight: 75, reps: 10 },
      ],
      maxWeight: 80,
      maxReps: 10,
      totalVolume: 2190,
      totalReps: 28,
      setsCount: 3,
    },
  ],
};

// Mock statsApi
vi.mock('../services/api', () => ({
  statsApi: {
    getExerciseHistory: vi.fn(),
  },
}));

import { statsApi } from '../services/api';

const renderExerciseStats = (exerciseName = 'Bench%20Press') => {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[`/stats/exercise/${exerciseName}`]}>
        <Routes>
          <Route path="/stats/exercise/:name" element={<ExerciseStats />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  );
};

describe('ExerciseStats Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading skeleton while data is loading', () => {
    // Never resolve the promise — stays in loading state
    vi.mocked(statsApi.getExerciseHistory).mockReturnValue(new Promise(() => {}));

    renderExerciseStats();

    // Skeleton has pulse animation divs
    const pulseElements = document.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('shows data after successful load', async () => {
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue(mockExerciseData);

    renderExerciseStats();

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    // Personal records should show values
    expect(screen.getByText('80')).toBeInTheDocument(); // maxWeight
    expect(screen.getByText('15')).toBeInTheDocument(); // maxReps

    // Session count - use getAllByText since '3' appears in multiple places
    const threeElements = screen.getAllByText(/3/);
    expect(threeElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows empty state when history is empty', async () => {
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue({
      exerciseName: 'Empty Exercise',
      totalSessions: 0,
      personalRecords: {
        maxWeight: { value: 0, date: null },
        maxReps: { value: 0, date: null },
        maxVolume: { value: 0, date: null },
      },
      history: [],
    });

    renderExerciseStats('Empty%20Exercise');

    await waitFor(() => {
      expect(screen.getByText(/Нет данных/i)).toBeInTheDocument();
    });
  });

  it('shows error state when API fails', async () => {
    vi.mocked(statsApi.getExerciseHistory).mockRejectedValue(new Error('Network error'));

    renderExerciseStats();

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('displays history entries with sets', async () => {
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue(mockExerciseData);

    renderExerciseStats();

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    // Check that sets from history are rendered (weight × reps)
    // The most recent entry has 80kg × 10, 80kg × 8, 75kg × 10
    const allWeight80 = screen.getAllByText(/80/);
    expect(allWeight80.length).toBeGreaterThanOrEqual(1); // PR card + history entries

    const allWeight75 = screen.getAllByText(/75/);
    expect(allWeight75.length).toBeGreaterThanOrEqual(1);
  });

  it('calls API with decoded exercise name', async () => {
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue(mockExerciseData);

    renderExerciseStats('Bench%20Press');

    await waitFor(() => {
      expect(statsApi.getExerciseHistory).toHaveBeenCalledWith('Bench Press');
    });
  });

  it('renders personal record cards', async () => {
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue(mockExerciseData);

    renderExerciseStats();

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    // Check PR section heading
    expect(screen.getByText(/Личные рекорды/i)).toBeInTheDocument();

    // Check PR labels exist
    expect(screen.getByText(/Макс. вес/i)).toBeInTheDocument();
    expect(screen.getByText(/Макс. повторения/i)).toBeInTheDocument();
    expect(screen.getByText(/Лучший тоннаж/i)).toBeInTheDocument();
  });

  it('renders chart sections when multiple data points exist', async () => {
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue(mockExerciseData);

    renderExerciseStats();

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    // Chart section headings
    expect(screen.getByText(/Прогресс веса/i)).toBeInTheDocument();
    expect(screen.getByText(/Прогресс тоннажа/i)).toBeInTheDocument();
  });

  it('renders charts even with single data point', async () => {
    const singleEntry = {
      ...mockExerciseData,
      history: [mockExerciseData.history[0]],
    };
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue(singleEntry);

    renderExerciseStats();

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    // Charts should render even with single data point
    expect(screen.getByText(/Прогресс веса/i)).toBeInTheDocument();
    expect(screen.getByText(/Прогресс тоннажа/i)).toBeInTheDocument();
  });

  it('renders workout history section', async () => {
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue(mockExerciseData);

    renderExerciseStats();

    await waitFor(() => {
      expect(screen.getByText('Bench Press')).toBeInTheDocument();
    });

    expect(screen.getByText(/История тренировок/i)).toBeInTheDocument();
  });

  it('shows reps-based charts for bodyweight exercises', async () => {
    const bodyweightData = {
      exerciseName: 'Отжимания',
      totalSessions: 2,
      isBodyweight: true,
      isDoubleWeight: false,
      personalRecords: {
        maxWeight: { value: 0, date: null },
        maxReps: { value: 20, date: '2026-02-25T10:00:00Z' },
        maxVolume: { value: 0, date: null },
      },
      history: [
        {
          date: '2026-02-20T10:00:00Z',
          sets: [{ weight: 0, reps: 15 }, { weight: 0, reps: 12 }],
          maxWeight: 0, maxReps: 15, totalVolume: 0, totalReps: 27, setsCount: 2,
        },
        {
          date: '2026-02-25T10:00:00Z',
          sets: [{ weight: 0, reps: 20 }, { weight: 0, reps: 18 }],
          maxWeight: 0, maxReps: 20, totalVolume: 0, totalReps: 38, setsCount: 2,
        },
      ],
    };
    vi.mocked(statsApi.getExerciseHistory).mockResolvedValue(bodyweightData);

    renderExerciseStats('%D0%9E%D1%82%D0%B6%D0%B8%D0%BC%D0%B0%D0%BD%D0%B8%D1%8F');

    await waitFor(() => {
      expect(screen.getByText('Отжимания')).toBeInTheDocument();
    });

    // Bodyweight chart titles (reps, not weight/volume)
    expect(screen.getByText(/Прогресс повторений/i)).toBeInTheDocument();
    expect(screen.getByText(/Общие повторения/i)).toBeInTheDocument();
    // Should NOT show weight progress title
    expect(screen.queryByText(/Прогресс веса/i)).not.toBeInTheDocument();
  });
});

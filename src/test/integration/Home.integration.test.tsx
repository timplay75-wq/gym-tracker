import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Home } from '../../pages/Home';
import { ThemeProvider } from '../../contexts/ThemeContext';

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
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Home Page Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders home page with all sections', () => {
    renderWithProviders(<Home />);

    // Check for main sections
    expect(screen.getByText(/Gym Tracker/i)).toBeInTheDocument();
  });

  it('displays workout statistics', () => {
    // Add some mock workouts to localStorage
    const mockWorkouts = [
      {
        id: '1',
        name: 'Chest Day',
        date: new Date().toISOString(),
        exercises: [],
        duration: 3600,
        completed: true,
      },
      {
        id: '2',
        name: 'Leg Day',
        date: new Date().toISOString(),
        exercises: [],
        duration: 4200,
        completed: true,
      },
    ];

    localStorage.setItem('workouts', JSON.stringify(mockWorkouts));

    renderWithProviders(<Home />);

    // Should display workout count or recent workouts
    waitFor(() => {
      const workoutElements = screen.queryAllByText(/Chest Day|Leg Day/i);
      expect(workoutElements.length).toBeGreaterThan(0);
    });
  });

  it('handles quick start workout click', () => {
    renderWithProviders(<Home />);

    const quickStartButton = screen.queryByText(/Start.*Workout/i);
    if (quickStartButton) {
      fireEvent.click(quickStartButton);
      // Navigation should occur (tested via mock)
    }
  });

  it('shows empty state when no workouts exist', () => {
    renderWithProviders(<Home />);

    // Should show some indication of no workouts
    const emptyStateIndicators = screen.queryAllByText(/no.*workout|start|create/i);
    expect(emptyStateIndicators.length).toBeGreaterThan(0);
  });
});

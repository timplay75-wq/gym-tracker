import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '../components/StatCard';

describe('StatCard Component', () => {
  it('renders title and value', () => {
    render(<StatCard title="Total Workouts" value="42" />);
    
    expect(screen.getByText('Total Workouts')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <StatCard 
        title="Workouts" 
        value="10" 
        icon={<span data-testid="icon">🏋️</span>} 
      />
    );
    
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatCard title="Tonnage" value="5000kg" subtitle="This month" />);
    
    expect(screen.getByText('This month')).toBeInTheDocument();
  });

  it('renders upward trend correctly', () => {
    render(
      <StatCard 
        title="Progress" 
        value="100" 
        trend={{ direction: 'up', value: '+12%' }}
      />
    );
    
    expect(screen.getByText('+12%')).toBeInTheDocument();
    const trendElement = screen.getByText('+12%').closest('div');
    expect(trendElement).toHaveClass('text-success-600');
  });

  it('renders downward trend correctly', () => {
    render(
      <StatCard 
        title="Rest Days" 
        value="2" 
        trend={{ direction: 'down', value: '-5%' }}
      />
    );
    
    expect(screen.getByText('-5%')).toBeInTheDocument();
    const trendElement = screen.getByText('-5%').closest('div');
    expect(trendElement).toHaveClass('text-error-600');
  });

  it('renders neutral trend correctly', () => {
    render(
      <StatCard 
        title="Average" 
        value="50" 
        trend={{ direction: 'neutral', value: '0%' }}
      />
    );
    
    expect(screen.getByText('0%')).toBeInTheDocument();
    const trendElement = screen.getByText('0%').closest('div');
    expect(trendElement).toHaveClass('text-primary-600');
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatCard title="Test" value="123" className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles numeric values', () => {
    render(<StatCard title="Count" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('handles string values', () => {
    render(<StatCard title="Status" value="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});

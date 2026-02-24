import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '../components/Badge';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default')).toHaveClass('bg-primary-100');
  });

  it('applies primary variant classes', () => {
    render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary-100', 'text-primary-700');
  });

  it('applies success variant classes', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-success-100');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toHaveClass('text-xs');

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText('Medium')).toHaveClass('text-sm');

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toHaveClass('text-base');
  });

  it('renders dot when dot prop is true', () => {
    const { container } = render(<Badge dot>With Dot</Badge>);
    const dot = container.querySelector('.w-1\\.5');
    expect(dot).toBeInTheDocument();
  });

  it('does not render dot when dot prop is false', () => {
    const { container } = render(<Badge>Without Dot</Badge>);
    const dot = container.querySelector('.w-1\\.5');
    expect(dot).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-badge');
  });
});

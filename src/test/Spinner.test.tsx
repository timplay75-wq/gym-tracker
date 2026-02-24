import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../components/Spinner';

describe('Spinner Component', () => {
  it('renders spinner svg', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { container, rerender } = render(<Spinner size="sm" />);
    let svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-4', 'h-4');

    rerender(<Spinner size="md" />);
    svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-8', 'h-8');

    rerender(<Spinner size="lg" />);
    svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-12', 'h-12');

    rerender(<Spinner size="xl" />);
    svg = container.querySelector('svg');
    expect(svg).toHaveClass('w-16', 'h-16');
  });

  it('applies correct variant classes', () => {
    const { container, rerender } = render(<Spinner variant="primary" />);
    let svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-primary-600');

    rerender(<Spinner variant="white" />);
    svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-white');

    rerender(<Spinner variant="gray" />);
    svg = container.querySelector('svg');
    expect(svg).toHaveClass('text-primary-400');
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-spinner" />);
    expect(container.firstChild).toHaveClass('custom-spinner');
  });

  it('has animate-spin class', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('animate-spin');
  });
});

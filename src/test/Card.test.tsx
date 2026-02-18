import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../components/Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Card>Default Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800');
  });

  it('applies elevated variant classes', () => {
    const { container } = render(<Card variant="elevated">Elevated Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-md');
  });

  it('applies glass variant classes', () => {
    const { container } = render(<Card variant="glass">Glass Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('backdrop-blur-lg');
  });

  it('applies interactive variant classes', () => {
    const { container } = render(<Card variant="interactive">Interactive Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('cursor-pointer');
  });

  it('applies correct padding classes', () => {
    const { container, rerender } = render(<Card padding="none">No Padding</Card>);
    let card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass('p-3', 'p-4', 'p-6');

    rerender(<Card padding="sm">Small Padding</Card>);
    card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-3');

    rerender(<Card padding="md">Medium Padding</Card>);
    card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-4');

    rerender(<Card padding="lg">Large Padding</Card>);
    card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('p-6');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Custom Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('applies rounded corners', () => {
    const { container } = render(<Card>Rounded Card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('rounded-2xl');
  });
});

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressRing } from '../components/ProgressRing';

describe('ProgressRing Component', () => {
  it('renders with default props', () => {
    const { container } = render(<ProgressRing progress={50} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('displays percentage by default', () => {
    render(<ProgressRing progress={75} />);
    expect(document.body.textContent).toContain('75%');
  });

  it('hides percentage when showPercentage is false', () => {
    render(<ProgressRing progress={75} showPercentage={false} />);
    expect(document.body.textContent).not.toContain('75%');
  });

  it('displays label when provided', () => {
    const { container } = render(<ProgressRing progress={50} label="Completed" />);
    expect(container.textContent).toContain('Completed');
  });

  it('applies custom size', () => {
    const { container } = render(<ProgressRing progress={50} size={200} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  it('applies custom stroke width', () => {
    const { container } = render(<ProgressRing progress={50} strokeWidth={12} />);
    const circles = container.querySelectorAll('circle');
    circles.forEach(circle => {
      expect(circle).toHaveAttribute('stroke-width', '12');
    });
  });

  it('handles 0% progress', () => {
    render(<ProgressRing progress={0} />);
    expect(document.body.textContent).toContain('0%');
  });

  it('handles 100% progress', () => {
    render(<ProgressRing progress={100} />);
    expect(document.body.textContent).toContain('100%');
  });

  it('rounds decimal progress', () => {
    render(<ProgressRing progress={66.6} />);
    expect(document.body.textContent).toContain('67%');
  });

  it('renders two circles (background and progress)', () => {
    const { container } = render(<ProgressRing progress={50} />);
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });
});

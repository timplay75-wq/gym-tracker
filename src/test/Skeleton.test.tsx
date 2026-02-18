import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton, SkeletonCard, SkeletonAvatar } from '../components/Skeleton';

describe('Skeleton Component', () => {
  it('renders with default text variant', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded', 'h-4');
  });

  it('renders with circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('renders with rectangular variant', () => {
    const { container } = render(<Skeleton variant="rectangular" />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-lg');
  });

  it('applies custom width', () => {
    const { container } = render(<Skeleton width={200} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ width: '200px' });
  });

  it('applies custom height', () => {
    const { container } = render(<Skeleton height={50} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ height: '50px' });
  });

  it('has animate-pulse class', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('animate-pulse');
  });
});

describe('SkeletonCard Component', () => {
  it('renders multiple skeleton elements', () => {
    const { container } = render(<SkeletonCard />);
    const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(1);
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonCard className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('SkeletonAvatar Component', () => {
  it('renders circular skeleton', () => {
    const { container } = render(<SkeletonAvatar />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('applies custom size', () => {
    const { container } = render(<SkeletonAvatar size={60} />);
    const skeleton = container.firstChild as HTMLElement;
    expect(skeleton).toHaveStyle({ width: '60px', height: '60px' });
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../components/Switch';

describe('Switch Component', () => {
  it('renders without label', () => {
    const { container } = render(<Switch />);
    expect(container.querySelector('label')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Switch label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('toggles when clicked (uncontrolled)', () => {
    const { container } = render(<Switch />);
    const switchElement = container.querySelector('[class*="inline-flex h-6"]');
    
    expect(switchElement).toHaveClass('bg-primary-200');
    
    fireEvent.click(switchElement!);
    expect(switchElement).toHaveClass('bg-primary-600');
  });

  it('calls onChange when toggled', () => {
    const handleChange = vi.fn();
    const { container } = render(<Switch onChange={handleChange} />);
    const switchElement = container.querySelector('[class*="inline-flex h-6"]');
    
    fireEvent.click(switchElement!);
    expect(handleChange).toHaveBeenCalledWith(true);
    
    fireEvent.click(switchElement!);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('respects controlled checked prop', () => {
    const { container, rerender } = render(<Switch checked={false} />);
    const switchElement = container.querySelector('[class*="inline-flex h-6"]');
    
    expect(switchElement).toHaveClass('bg-primary-200');
    
    rerender(<Switch checked={true} />);
    expect(switchElement).toHaveClass('bg-primary-600');
  });

  it('does not toggle when disabled', () => {
    const handleChange = vi.fn();
    const { container } = render(<Switch disabled onChange={handleChange} />);
    const switchElement = container.querySelector('[class*="inline-flex h-6"]');
    
    fireEvent.click(switchElement!);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('applies disabled styling', () => {
    const { container } = render(<Switch disabled label="Disabled" />);
    const label = container.querySelector('label');
    expect(label).toHaveClass('opacity-50', 'cursor-not-allowed');
  });
});

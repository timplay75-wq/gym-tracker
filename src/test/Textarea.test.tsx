import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '../components/Textarea';

describe('Textarea Component', () => {
  it('renders with label', () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Textarea placeholder="Enter your notes" />);
    expect(screen.getByPlaceholderText('Enter your notes')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test content' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message', () => {
    render(<Textarea error="Field cannot be empty" />);
    expect(screen.getByText('Field cannot be empty')).toBeInTheDocument();
  });

  it('displays success message', () => {
    render(<Textarea success="Saved successfully" />);
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(<Textarea helperText="Maximum 500 characters" />);
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
  });

  it('applies error border color', () => {
    const { container } = render(<Textarea error="Error" />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('border-error-500');
  });

  it('can be disabled', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('respects rows prop', () => {
    render(<Textarea rows={5} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '5');
  });
});

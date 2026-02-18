import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../components/Select';

describe('Select Component', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders with label', () => {
    render(<Select options={mockOptions} label="Choose option" />);
    expect(screen.getByText('Choose option')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Select options={mockOptions} placeholder="Select..." />);
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<Select options={mockOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('selects option when clicked', () => {
    const handleChange = vi.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    fireEvent.click(screen.getByText('Option 2'));
    
    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('displays selected option', () => {
    render(<Select options={mockOptions} value="option2" />);
    
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Select options={mockOptions} error="Required field" />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Select options={mockOptions} disabled />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renders options with icons', () => {
    const optionsWithIcons = [
      { value: 'opt1', label: 'Option 1', icon: <span data-testid="icon1">🏋️</span> },
      { value: 'opt2', label: 'Option 2', icon: <span data-testid="icon2">🦵</span> },
    ];

    render(<Select options={optionsWithIcons} value="opt1" />);
    
    expect(screen.getByTestId('icon1')).toBeInTheDocument();
  });

  it('closes dropdown when option is selected', async () => {
    const { container } = render(<Select options={mockOptions} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Dropdown should be open
    let dropdown = container.querySelector('.absolute.z-50');
    expect(dropdown).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Option 1'));
    
    // Dropdown should be closed
    dropdown = container.querySelector('.absolute.z-50');
    expect(dropdown).not.toBeInTheDocument();
  });
});

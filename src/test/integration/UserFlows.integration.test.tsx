import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Form Submission Flow', () => {
  it('handles complete form submission with validation', () => {
    const TestForm = () => {
      const [name, setName] = React.useState('');
      const [weight, setWeight] = React.useState('');
      const [error, setError] = React.useState('');
      const [submitted, setSubmitted] = React.useState(false);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !weight) {
          setError('All fields are required');
          return;
        }
        setSubmitted(true);
        setError('');
      };

      return (
        <Card>
          <form onSubmit={handleSubmit}>
            <Input
              label="Exercise Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error && !name ? 'Name required' : ''}
            />
            <Input
              label="Weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              error={error && !weight ? 'Weight required' : ''}
            />
            <Button type="submit">Submit</Button>
            {submitted && <div>Success!</div>}
          </form>
        </Card>
      );
    };

    const { container } = renderWithProviders(<TestForm />);

    // Try to submit empty form
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    // Validation should prevent submission
    expect(screen.queryByText('Success!')).not.toBeInTheDocument();

    // Fill in form
    const nameInput = screen.getByLabelText('Exercise Name');
    const weightInput = screen.getByLabelText('Weight');

    fireEvent.change(nameInput, { target: { value: 'Bench Press' } });
    fireEvent.change(weightInput, { target: { value: '100' } });

    // Submit form
    fireEvent.click(submitButton);

    // Should show success
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });
});

describe('Multi-Component Interaction', () => {
  it('coordinates state between multiple components', () => {
    const TestApp = () => {
      const [count, setCount] = React.useState(0);

      return (
        <div>
          <Card>
            <div>Count: {count}</div>
            <Button onClick={() => setCount(count + 1)}>Increment</Button>
            <Button onClick={() => setCount(count - 1)} variant="secondary">
              Decrement
            </Button>
            <Button onClick={() => setCount(0)} variant="danger">
              Reset
            </Button>
          </Card>
        </div>
      );
    };

    renderWithProviders(<TestApp />);

    expect(screen.getByText('Count: 0')).toBeInTheDocument();

    // Increment
    fireEvent.click(screen.getByText('Increment'));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Increment'));
    fireEvent.click(screen.getByText('Increment'));
    expect(screen.getByText('Count: 3')).toBeInTheDocument();

    // Decrement
    fireEvent.click(screen.getByText('Decrement'));
    expect(screen.getByText('Count: 2')).toBeInTheDocument();

    // Reset
    fireEvent.click(screen.getByText('Reset'));
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});

// Import React at the top
import React from 'react';

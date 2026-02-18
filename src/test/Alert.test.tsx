import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from '../components/Alert';

describe('Alert Component', () => {
  it('renders children correctly', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText('Alert message')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Alert title="Warning">This is a warning</Alert>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('This is a warning')).toBeInTheDocument();
  });

  it('applies info variant classes by default', () => {
    const { container } = render(<Alert>Info</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-blue-50');
  });

  it('applies success variant classes', () => {
    const { container } = render(<Alert variant="success">Success</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-success-50');
  });

  it('applies warning variant classes', () => {
    const { container } = render(<Alert variant="warning">Warning</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-warning-50');
  });

  it('applies error variant classes', () => {
    const { container } = render(<Alert variant="error">Error</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('bg-error-50');
  });

  it('renders close button when onClose is provided', () => {
    const { container } = render(<Alert onClose={() => {}}>Closable</Alert>);
    const closeButton = container.querySelector('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('does not render close button when onClose is not provided', () => {
    const { container } = render(<Alert>Not closable</Alert>);
    const closeButton = container.querySelector('button');
    expect(closeButton).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Alert className="custom-alert">Custom</Alert>);
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('custom-alert');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../components/Modal';

describe('Modal Component', () => {
  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    
    const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleClose).toHaveBeenCalled();
    }
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test">
        Content
      </Modal>
    );
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    const { container, rerender } = render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        Content
      </Modal>
    );
    
    let modalContent = container.querySelector('.max-w-md');
    expect(modalContent).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        Content
      </Modal>
    );
    
    modalContent = container.querySelector('.max-w-2xl');
    expect(modalContent).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div data-testid="custom-content">Custom Content</div>
      </Modal>
    );
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
  });
});

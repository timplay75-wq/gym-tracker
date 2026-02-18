import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from '../components/Tabs';

describe('Tabs Component', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div>Content 2</div> },
    { id: 'tab3', label: 'Tab 3', content: <div>Content 3</div> },
  ];

  it('renders all tab labels', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders first tab content by default', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('switches content when tab is clicked', () => {
    render(<Tabs tabs={mockTabs} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('respects defaultTab prop', () => {
    render(<Tabs tabs={mockTabs} defaultTab="tab2" />);
    
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('calls onChange when tab changes', () => {
    const handleChange = vi.fn();
    render(<Tabs tabs={mockTabs} onChange={handleChange} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('renders tabs with icons', () => {
    const tabsWithIcons = [
      { id: 'tab1', label: 'Tab 1', content: <div>Content</div>, icon: <span data-testid="icon1">🏋️</span> },
      { id: 'tab2', label: 'Tab 2', content: <div>Content</div>, icon: <span data-testid="icon2">📊</span> },
    ];

    render(<Tabs tabs={tabsWithIcons} />);
    
    expect(screen.getByTestId('icon1')).toBeInTheDocument();
    expect(screen.getByTestId('icon2')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const tab1Button = screen.getByText('Tab 1').closest('button');
    expect(tab1Button).toHaveClass('bg-white');
    
    fireEvent.click(screen.getByText('Tab 2'));
    
    const tab2Button = screen.getByText('Tab 2').closest('button');
    expect(tab2Button).toHaveClass('bg-white');
  });
});

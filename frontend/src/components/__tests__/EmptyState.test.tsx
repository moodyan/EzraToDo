import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState - Edge Cases', () => {
  it('renders message correctly', () => {
    render(<EmptyState message="No todos found" />);
    expect(screen.getByText('No todos found')).toBeInTheDocument();
  });

  it('does not render action button when not provided', () => {
    render(<EmptyState message="No todos found" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders action button when actionLabel and onAction provided', () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        message="No todos found"
        actionLabel="Create Todo"
        onAction={onAction}
      />
    );

    expect(screen.getByText('Create Todo')).toBeInTheDocument();
  });

  it('calls onAction when action button is clicked', () => {
    const onAction = vi.fn();
    render(
      <EmptyState
        message="No todos found"
        actionLabel="Create Todo"
        onAction={onAction}
      />
    );

    const button = screen.getByText('Create Todo');
    fireEvent.click(button);

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does not render button when only actionLabel is provided', () => {
    render(<EmptyState message="No todos found" actionLabel="Create Todo" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render button when only onAction is provided', () => {
    const onAction = vi.fn();
    render(<EmptyState message="No todos found" onAction={onAction} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles long messages gracefully', () => {
    const longMessage =
      'This is a very long message that tests how the component handles lengthy text content that might wrap to multiple lines';

    render(<EmptyState message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles special characters in message', () => {
    const specialMessage = 'No todos found! @#$%^&*()';

    render(<EmptyState message={specialMessage} />);
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });
});

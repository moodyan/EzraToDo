import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('displays a spinner animation', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('div > div');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle({
      borderRadius: '50%',
    });
  });
});

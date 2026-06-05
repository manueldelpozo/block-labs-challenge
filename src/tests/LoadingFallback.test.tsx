import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { describe, it, expect } from 'vitest';

describe('LoadingFallback', () => {
  const renderFallback = (message?: string) => {
    return render(
      <MantineProvider>
        <LoadingFallback message={message} />
      </MantineProvider>,
    );
  };

  it('renders the loader spinner', () => {
    const { container } = renderFallback();
    expect(container.querySelector('.mantine-Loader-root')).toBeInTheDocument();
  });

  it('shows the default loading message when no message prop is given', () => {
    renderFallback();
    expect(screen.getByText('Loading page content...')).toBeInTheDocument();
  });

  it('shows a custom message when provided', () => {
    renderFallback('Fetching dashboard data...');
    expect(screen.getByText('Fetching dashboard data...')).toBeInTheDocument();
  });
});

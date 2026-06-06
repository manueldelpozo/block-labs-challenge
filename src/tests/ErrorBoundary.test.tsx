import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { describe, it, expect, vi } from 'vitest';

function Bomb({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test crash');
  }
  return <p>All good</p>;
}

describe('ErrorBoundary', () => {
  const renderWithBoundary = (ui: React.ReactElement) => {
    return render(
      <MantineProvider>
        <ErrorBoundary>{ui}</ErrorBoundary>
      </MantineProvider>,
    );
  };

  beforeEach(() => {
    // Suppress expected React error output for thrown errors
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when no error occurs', () => {
    renderWithBoundary(<p>Hello world</p>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders the default error UI when a child throws', () => {
    renderWithBoundary(<Bomb shouldThrow />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test crash')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('renders custom fallback when provided instead of default error UI', () => {
    render(
      <MantineProvider>
        <ErrorBoundary fallback={<p>Custom fallback</p>}>
          <Bomb shouldThrow />
        </ErrorBoundary>
      </MantineProvider>,
    );
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});

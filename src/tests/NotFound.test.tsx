import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router';
import { NotFound } from '@/pages/NotFound';
import { describe, it, expect } from 'vitest';

describe('NotFound Page', () => {
  const renderNotFound = () => {
    return render(
      <MantineProvider>
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      </MantineProvider>,
    );
  };

  it('renders 404 heading', () => {
    renderNotFound();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders "Page Not Found" title', () => {
    renderNotFound();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('renders a descriptive message about the broken link', () => {
    renderNotFound();
    expect(
      screen.getByText(
        /the link you followed may be broken/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders a "Return to Dashboard" navigation button', () => {
    renderNotFound();
    expect(
      screen.getByRole('button', { name: /return to dashboard/i }),
    ).toBeInTheDocument();
  });
});

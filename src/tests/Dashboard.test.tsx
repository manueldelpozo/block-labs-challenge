import { render, screen, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { TenantProvider, FeatureFlagProvider } from '@/app/providers';
import { Dashboard } from '@/pages/Dashboard';
import { describe, it, expect } from 'vitest';

describe('Dashboard Integration', () => {
  const renderDashboard = () => {
    return render(
      <MantineProvider>
        <TenantProvider>
          <FeatureFlagProvider>
            <Dashboard />
          </FeatureFlagProvider>
        </TenantProvider>
      </MantineProvider>,
    );
  };

  it('initially displays loading loader during async fetch', () => {
    const { container } = renderDashboard();
    expect(container.querySelector('.mantine-Loader-root')).toBeInTheDocument();
  });

  it('renders all 4 stat card categories and values after loading completes', async () => {
    renderDashboard();

    await waitFor(
      () => {
        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(screen.getByText('$128,430')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('8,642')).toBeInTheDocument();
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    expect(screen.getByText('142ms')).toBeInTheDocument();
  });

  it('respects default tenant feature flag to show analytics section', async () => {
    renderDashboard();

    await waitFor(
      () => {
        expect(screen.getByText('Advanced Operations Analytics')).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});

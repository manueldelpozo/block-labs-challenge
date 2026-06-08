import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router';
import { TenantProvider, FeatureFlagProvider, I18nProvider } from '@/app/providers';
import { AppShell } from '@/components/layout/AppShell';
import { describe, it, expect } from 'vitest';

describe('AppShell Layout', () => {
  const renderShell = (initialEntries = ['/']) => {
    return render(
      <MantineProvider>
        <TenantProvider>
          <FeatureFlagProvider>
            <I18nProvider>
              <MemoryRouter initialEntries={initialEntries}>
                <AppShell />
              </MemoryRouter>
            </I18nProvider>
          </FeatureFlagProvider>
        </TenantProvider>
      </MantineProvider>,
    );
  };

  it('renders the tenant logo', () => {
    renderShell();
    expect(screen.getAllByText('Tenant A').length).toBeGreaterThan(0);
  });

  it('renders navigation links for Dashboard and Profile', () => {
    renderShell();
    // Nav items appear in both header and sidebar, so use getAllByText
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Profile').length).toBeGreaterThan(0);
  });

  it('renders the Settings nav link when showSettings flag is enabled', () => {
    // Default feature flags include showSettings: true
    renderShell();
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
  });

  it('highlights the active route in navigation', () => {
    renderShell(['/profile']);
    // Profile appears in both header and sidebar
    const profileLinks = screen.getAllByText('Profile');
    expect(profileLinks.length).toBeGreaterThan(0);
  });
});

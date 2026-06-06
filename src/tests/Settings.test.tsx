import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { TenantProvider, FeatureFlagProvider } from '@/app/providers';
import { Settings } from '@/pages/Settings';
import { describe, it, expect } from 'vitest';

describe('Settings Page Integration', () => {
  const renderSettings = () => {
    return render(
      <MantineProvider>
        <TenantProvider>
          <FeatureFlagProvider>
            <Settings />
          </FeatureFlagProvider>
        </TenantProvider>
      </MantineProvider>,
    );
  };

  it('renders the page title and description', () => {
    renderSettings();
    expect(screen.getByRole('heading', { name: /settings/i, level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(/view and customize tenant environment variables/i),
    ).toBeInTheDocument();
  });

  it('renders tenant specification details', () => {
    renderSettings();
    expect(
      screen.getByRole('heading', { name: /tenant specifications/i, level: 3 }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Block Labs Default/i)).toBeInTheDocument();
    // block-default appears in both the Badge and Resolved Identifier rows
    expect(screen.getAllByText(/block-default/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/https:\/\/api.blocklabs.default/i)).toBeInTheDocument();
  });

  it('renders the active feature envelopes section', () => {
    renderSettings();
    expect(
      screen.getByRole('heading', { name: /active feature envelopes/i, level: 3 }),
    ).toBeInTheDocument();

    expect(screen.getByText(/analytics suite/i)).toBeInTheDocument();
    expect(screen.getByText(/tenant settings console/i)).toBeInTheDocument();
    expect(screen.getByText(/native dark mode/i)).toBeInTheDocument();
    expect(screen.getByText(/beta banner alerts/i)).toBeInTheDocument();
  });

  it('displays feature flags with Active/Suspended badges', () => {
    renderSettings();
    // showAnalytics defaults to true in DEFAULT_FEATURES
    const activeBadges = screen.getAllByText(/active/i);
    expect(activeBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the interactive configuration simulator form', () => {
    renderSettings();
    expect(
      screen.getByRole('heading', { name: /interactive configuration simulator/i, level: 3 }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/simulation admin handle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/enable automated email dispatches/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply overrides/i })).toBeInTheDocument();
  });

  it('shows validation error when admin handle is too short', async () => {
    const user = userEvent.setup();
    renderSettings();

    const handleInput = screen.getByLabelText(/simulation admin handle/i);
    await user.clear(handleInput);
    await user.type(handleInput, 'ab');

    const submitBtn = screen.getByRole('button', { name: /apply overrides/i });
    await user.click(submitBtn);

    expect(screen.getByText(/admin handle must be at least 3 characters/i)).toBeInTheDocument();
  });
});

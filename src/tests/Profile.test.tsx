import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { TenantProvider, FeatureFlagProvider, I18nProvider } from '@/app/providers';
import { Profile } from '@/pages/Profile';
import { describe, it, expect } from 'vitest';

describe('Profile Page Integration', () => {
  const renderProfile = () => {
    return render(
      <MantineProvider>
        <TenantProvider>
          <FeatureFlagProvider>
            <I18nProvider>
              <Profile />
            </I18nProvider>
          </FeatureFlagProvider>
        </TenantProvider>
      </MantineProvider>,
    );
  };

  it('renders the page title and description', () => {
    renderProfile();
    expect(screen.getByRole('heading', { name: /user profile/i, level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(/manage your appearance preferences and personal information/i),
    ).toBeInTheDocument();
  });

  it('renders the Appearance section with color scheme controls', () => {
    renderProfile();
    expect(screen.getByRole('heading', { name: /appearance/i, level: 3 })).toBeInTheDocument();
    // "Color scheme" appears as a label text and appears in the description
    expect(screen.getAllByText(/color scheme/i).length).toBeGreaterThan(0);
    // SegmentedControl for light/dark/auto — text may appear in badge, description, and control
    expect(screen.getAllByText(/light/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/dark/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/auto/i).length).toBeGreaterThan(0);
  });

  it('renders the profile information form with all fields', () => {
    renderProfile();
    expect(
      screen.getByRole('heading', { name: /profile information/i, level: 3 }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('pre-fills the form with default user data', () => {
    renderProfile();
    const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;

    expect(nameInput.value).toBe('Jane Doe');
    expect(emailInput.value).toBe('jane.doe@example.com');
  });

  it('shows validation error when name is too short on submit', async () => {
    const user = userEvent.setup();
    renderProfile();

    const nameInput = screen.getByLabelText(/full name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'A');

    const submitBtn = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitBtn);

    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email on submit', async () => {
    const user = userEvent.setup();
    renderProfile();

    const emailInput = screen.getByLabelText(/email address/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'not-an-email');

    const submitBtn = screen.getByRole('button', { name: /save changes/i });
    await user.click(submitBtn);

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('shows a present badge for the current color scheme', () => {
    renderProfile();
    // Default is light mode
    expect(screen.getByText(/light mode/i)).toBeInTheDocument();
  });
});

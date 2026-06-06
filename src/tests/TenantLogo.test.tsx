import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { TenantLogo } from '@/components/ui/TenantLogo';
import { describe, it, expect } from 'vitest';

describe('TenantLogo', () => {
  it('renders the first letter of the tenant name as an icon', () => {
    render(
      <MantineProvider>
        <TenantLogo name="Test Brand" logo="Test Brand" />
      </MantineProvider>,
    );
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('renders the tenant logo display text', () => {
    render(
      <MantineProvider>
        <TenantLogo name="Test Brand" logo="TEST" />
      </MantineProvider>,
    );
    expect(screen.getByText('TEST')).toBeInTheDocument();
  });

  it('falls back to "B" when name is empty', () => {
    render(
      <MantineProvider>
        <TenantLogo name="" logo="Fallback Inc" />
      </MantineProvider>,
    );
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});

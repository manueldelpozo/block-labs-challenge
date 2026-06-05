import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { TenantLogo } from '@/components/ui/TenantLogo';
import { describe, it, expect } from 'vitest';

describe('TenantLogo', () => {
  it('renders the first letter of the tenant name as an icon', () => {
    render(
      <MantineProvider>
        <TenantLogo name="Acme Corp" logo="Acme Corp" />
      </MantineProvider>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders the tenant logo display text', () => {
    render(
      <MantineProvider>
        <TenantLogo name="Acme Corp" logo="ACME" />
      </MantineProvider>,
    );
    expect(screen.getByText('ACME')).toBeInTheDocument();
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

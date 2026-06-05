import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { TenantLogo } from '@/components/ui/TenantLogo';
import { describe, it, expect } from 'vitest';

describe('TenantLogo', () => {
  const renderLogo = () => {
    return render(
      <MantineProvider>
        <TenantProvider>
          <TenantLogo />
        </TenantProvider>
      </MantineProvider>,
    );
  };

  it('renders the first letter of the tenant name as an icon', () => {
    renderLogo();
    // Default tenant name is 'Block Labs Default' → first letter 'B'
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('renders the tenant logo display text', () => {
    renderLogo();
    // Default tenant logo is 'Block Labs'
    expect(screen.getByText('Block Labs')).toBeInTheDocument();
  });
});

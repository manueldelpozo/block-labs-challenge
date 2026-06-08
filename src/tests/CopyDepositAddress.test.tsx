import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { CopyDepositAddress } from '@/components/ui/CopyDepositAddress';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('CopyDepositAddress', () => {
  const defaultProps = {
    address: 'bc1qabc123xyz',
    brandName: 'Test Tenant',
    primaryColor: 'violet',
    onReset: vi.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(
      <MantineProvider>
        <CopyDepositAddress {...defaultProps} {...props} />
      </MantineProvider>,
    );
  };

  beforeEach(() => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
  });

  it('renders the deposit address', () => {
    renderComponent();
    expect(screen.getByText('bc1qabc123xyz')).toBeInTheDocument();
  });

  it('renders the brand name in the heading', () => {
    renderComponent();
    expect(
      screen.getByRole('heading', { name: /deposit to test tenant/i, level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders a Copy Address button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /copy address/i })).toBeInTheDocument();
  });

  it('renders a Make another deposit button', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /make another deposit/i })).toBeInTheDocument();
  });

  it('calls onReset when Make another deposit is clicked', async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    renderComponent({ onReset });

    await user.click(screen.getByRole('button', { name: /make another deposit/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('copies address to clipboard when Copy Address is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    const copyBtn = screen.getByRole('button', { name: /copy address/i });
    await user.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('bc1qabc123xyz');
  });

  it('shows Copied! text after clicking copy', async () => {
    const user = userEvent.setup();
    renderComponent();

    const copyBtn = screen.getByRole('button', { name: /copy address/i });
    await user.click(copyBtn);

    expect(await screen.findByRole('button', { name: /copied!/i })).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { TenantProvider, FeatureFlagProvider, I18nProvider } from '@/app/providers';
import { Deposit } from '@/pages/Deposit';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/services/deposit', () => ({
  fetchDepositAddress: vi.fn(),
}));

import { fetchDepositAddress } from '@/services/deposit';

describe('Deposit Page Integration', () => {
  const renderDeposit = () => {
    return render(
      <MantineProvider>
        <TenantProvider>
          <FeatureFlagProvider>
            <I18nProvider>
              <Deposit />
            </I18nProvider>
          </FeatureFlagProvider>
        </TenantProvider>
      </MantineProvider>,
    );
  };

  it('renders the page heading title', () => {
    renderDeposit();
    expect(screen.getByRole('heading', { name: /deposit/i, level: 1 })).toBeInTheDocument();
  });

  it('renders the DepositForm with tenant brand name in the card heading', () => {
    renderDeposit();
    expect(
      screen.getByRole('heading', { name: /deposit to tenant a/i, level: 2 }),
    ).toBeInTheDocument();
  });

  it('renders CTA button with tenant ctaCopy text', () => {
    renderDeposit();
    expect(screen.getByRole('button', { name: /deposit now/i })).toBeInTheDocument();
  });

  it('CTA button is initially disabled when form is empty', () => {
    renderDeposit();
    const cta = screen.getByRole('button', { name: /deposit now/i });
    expect(cta).toBeDisabled();
  });

  /* ── Get combobox by its accessible name ───────────────── */

  function getCurrencyCombobox() {
    return screen.getByRole('combobox', { name: /currency/i });
  }

  function getNetworkCombobox() {
    return screen.getByRole('combobox', { name: /network/i });
  }

  it('renders currency selector with tenant supported currencies', async () => {
    const user = userEvent.setup();
    renderDeposit();

    const currencySelect = getCurrencyCombobox();
    expect(currencySelect).toBeInTheDocument();

    await user.click(currencySelect);

    expect(screen.getByText(/bitcoin \(btc\)/i)).toBeInTheDocument();
    expect(screen.getByText(/ethereum \(eth\)/i)).toBeInTheDocument();
    expect(screen.getByText(/usd coin \(usdc\)/i)).toBeInTheDocument();
    expect(screen.getByText(/solana \(sol\)/i)).toBeInTheDocument();
  });

  it('network dropdown is disabled until a currency is selected', () => {
    renderDeposit();
    const networkSelect = getNetworkCombobox();
    expect(networkSelect).toBeDisabled();
    expect(screen.getByPlaceholderText(/select a currency first/i)).toBeInTheDocument();
  });

  it('shows network options after currency selection', async () => {
    const user = userEvent.setup();
    renderDeposit();

    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    const ethOption = screen.getByText(/ethereum \(eth\)/i);
    await user.click(ethOption);

    const networkSelect = getNetworkCombobox();
    expect(networkSelect).not.toBeDisabled();
    await user.click(networkSelect);
    const erc20Elements = screen.getAllByText(/ethereum \(erc-20\)/i);
    expect(erc20Elements.length).toBeGreaterThanOrEqual(1);
    const arbitrumElements = screen.getAllByText(/arbitrum/i);
    expect(arbitrumElements.length).toBeGreaterThanOrEqual(1);
    const optimismElements = screen.getAllByText(/optimism/i);
    expect(optimismElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows min deposit hint when currency is selected', async () => {
    const user = userEvent.setup();
    renderDeposit();

    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    expect(screen.getByText(/minimum deposit: 0.001 btc/i)).toBeInTheDocument();
  });

  it('validates amount field before calling fetchDepositAddress', async () => {
    const user = userEvent.setup();
    renderDeposit();

    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    const networkSelect = getNetworkCombobox();
    await user.click(networkSelect);
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    const cta = screen.getByRole('button', { name: /deposit now/i });
    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.0001');

    await user.click(cta);

    // validation error, not an API error — fetchDepositAddress should NOT have been called
    expect(screen.getByText(/minimum deposit is 0.001 btc/i)).toBeInTheDocument();
    expect(fetchDepositAddress).not.toHaveBeenCalled();
  });

  it('enables CTA button when all fields are filled', async () => {
    const user = userEvent.setup();
    renderDeposit();

    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    const networkSelect = getNetworkCombobox();
    await user.click(networkSelect);
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.5');

    const cta = screen.getByRole('button', { name: /deposit now/i });
    expect(cta).toBeEnabled();
  });

  it('displays CopyDepositAddress below the form on successful submission', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.mocked(fetchDepositAddress);
    mockFetch.mockResolvedValue('bc1qbtcbitcoin9a7f8g9h0jkl');

    renderDeposit();

    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    const networkSelect = getNetworkCombobox();
    await user.click(networkSelect);
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.5');

    const cta = screen.getByRole('button', { name: /deposit now/i });
    await user.click(cta);

    // Should show the deposit address in the CopyDepositAddress section
    const address = await screen.findByText(/bc1qbtcbitcoin9a7f8g9h0jkl/);
    expect(address).toBeInTheDocument();

    // Should show "Copy Address" button
    expect(screen.getByRole('button', { name: /copy address/i })).toBeInTheDocument();

    // Should show "Make another deposit" button
    expect(screen.getByRole('button', { name: /make another deposit/i })).toBeInTheDocument();

    // The form should still be visible (with CTA button still showing)
    expect(screen.getByRole('button', { name: /deposit now/i })).toBeInTheDocument();
  });

  it('copies address to clipboard when Copy Address is clicked', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.mocked(fetchDepositAddress);
    mockFetch.mockResolvedValue('bc1qbtcbitcoin9a7f8g9h0jkl');

    renderDeposit();

    // Fill and submit form
    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    const networkSelect = getNetworkCombobox();
    await user.click(networkSelect);
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.5');

    const cta = screen.getByRole('button', { name: /deposit now/i });
    await user.click(cta);

    // Wait for success view
    await screen.findByText(/bc1qbtcbitcoin9a7f8g9h0jkl/);

    // Click Copy Address
    const copyBtn = screen.getByRole('button', { name: /copy address/i });
    await user.click(copyBtn);

    // Clipboard should have been called with the address
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('bc1qbtcbitcoin9a7f8g9h0jkl');
  });

  it('"Make another deposit" hides CopyDepositAddress and resets the form', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.mocked(fetchDepositAddress);
    mockFetch.mockResolvedValue('bc1qbtcbitcoin9a7f8g9h0jkl');

    renderDeposit();

    // Fill and submit
    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    const networkSelect = getNetworkCombobox();
    await user.click(networkSelect);
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.5');

    const cta = screen.getByRole('button', { name: /deposit now/i });
    await user.click(cta);

    // Wait for success view
    await screen.findByText(/bc1qbtcbitcoin9a7f8g9h0jkl/);

    // Click "Make another deposit"
    const resetBtn = screen.getByRole('button', { name: /make another deposit/i });
    await user.click(resetBtn);

    // The deposit address should no longer be visible
    expect(screen.queryByText(/bc1qbtcbitcoin9a7f8g9h0jkl/)).not.toBeInTheDocument();
    // Copy Address button should be gone
    expect(screen.queryByRole('button', { name: /copy address/i })).not.toBeInTheDocument();
    // "Make another deposit" button should be gone
    expect(screen.queryByRole('button', { name: /make another deposit/i })).not.toBeInTheDocument();

    // The form should still be visible with initial state
    expect(screen.getByText(/choose your currency, network, and amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deposit now/i })).toBeDisabled();
  });
});

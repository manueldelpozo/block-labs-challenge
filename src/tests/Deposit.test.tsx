import { act, render, screen, waitFor } from '@testing-library/react';
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
    // The card inside DepositForm renders "Deposit to {tenant name}" as an H2
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

    // Click to open dropdown
    await user.click(currencySelect);

    // The default tenant supports BTC, ETH, USDC, SOL
    expect(screen.getByText(/bitcoin \(btc\)/i)).toBeInTheDocument();
    expect(screen.getByText(/ethereum \(eth\)/i)).toBeInTheDocument();
    expect(screen.getByText(/usd coin \(usdc\)/i)).toBeInTheDocument();
    expect(screen.getByText(/solana \(sol\)/i)).toBeInTheDocument();
  });

  it('network dropdown is disabled until a currency is selected', () => {
    renderDeposit();
    const networkSelect = getNetworkCombobox();
    expect(networkSelect).toBeDisabled();
    // The placeholder text offers guidance when no currency is selected
    expect(screen.getByPlaceholderText(/select a currency first/i)).toBeInTheDocument();
  });

  it('shows network options after currency selection', async () => {
    const user = userEvent.setup();
    renderDeposit();

    // Open currency dropdown
    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);

    // Select Ethereum
    const ethOption = screen.getByText(/ethereum \(eth\)/i);
    await user.click(ethOption);

    // Network dropdown should now be enabled and show Ethereum networks
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

  it('validates amount field after form submit', async () => {
    const user = userEvent.setup();
    renderDeposit();

    // Select a currency and network first
    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    const networkSelect = getNetworkCombobox();
    await user.click(networkSelect);
    // Use exact match to avoid matching "Bitcoin (BTC)" in the currency dropdown
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    // Submit with empty amount to trigger validation
    const cta = screen.getByRole('button', { name: /deposit now/i });
    // Enter an amount that's too small
    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.0001');

    // Submit the form
    await user.click(cta);

    // Should show validation error about minimum deposit
    expect(screen.getByText(/minimum deposit is 0.001 btc/i)).toBeInTheDocument();
  });

  it('enables CTA button when all fields are filled', async () => {
    const user = userEvent.setup();
    renderDeposit();

    // Select currency
    const currencySelect = getCurrencyCombobox();
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    // Select network
    const networkSelect = getNetworkCombobox();
    await user.click(networkSelect);
    // Use exact match to avoid matching "Bitcoin (BTC)" in the currency dropdown
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    // Enter valid amount
    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.5');

    // CTA button should now be enabled
    const cta = screen.getByRole('button', { name: /deposit now/i });
    expect(cta).toBeEnabled();
  });

  it('shows a loading spinner on the CTA while submitting', async () => {
    const user = userEvent.setup();

    let resolvePromise!: (value: string) => void;
    const mockFetch = vi.mocked(fetchDepositAddress);
    mockFetch.mockImplementation(
      () => new Promise<string>((resolve) => {
        resolvePromise = resolve;
      }),
    );

    renderDeposit();

    const currencySelect = screen.getByRole('combobox', { name: /currency/i });
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    const networkSelect = screen.getByRole('combobox', { name: /network/i });
    await user.click(networkSelect);
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.5');

    const cta = screen.getByRole('button', { name: /deposit now/i });
    await user.click(cta);

    await waitFor(() => {
      expect(cta).toBeDisabled();
    });

    resolvePromise('bc1qbtcbitcoin123');
  });

  it('displays an error message when fetchDepositAddress rejects', async () => {
    const user = userEvent.setup();

    const mockFetch = vi.mocked(fetchDepositAddress);
    mockFetch.mockRejectedValue(
      new Error('Failed to generate deposit address. Please try again.'),
    );

    renderDeposit();

    const currencySelect = screen.getByRole('combobox', { name: /currency/i });
    await user.click(currencySelect);
    await user.click(screen.getByText(/bitcoin \(btc\)/i));

    const networkSelect = screen.getByRole('combobox', { name: /network/i });
    await user.click(networkSelect);
    await user.click(screen.getByText('Bitcoin', { exact: true }));

    const amountInput = screen.getByRole('textbox', { name: /amount/i });
    await user.type(amountInput, '0.5');

    const cta = screen.getByRole('button', { name: /deposit now/i });
    await user.click(cta);

    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent(/failed to generate deposit address/i);

    expect(cta).toBeEnabled();
  });
});

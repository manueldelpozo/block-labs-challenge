import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDepositForm } from '@/hooks/useDepositForm';

describe('useDepositForm', () => {
  it('initializes with empty values', () => {
    const { result } = renderHook(() => useDepositForm());
    const values = result.current.form.getValues();

    expect(values.currency).toBe('');
    expect(values.network).toBe('');
    expect(values.amount).toBe('');
  });

  it('isReady is false when all fields are empty', () => {
    const { result } = renderHook(() => useDepositForm());
    expect(result.current.isReady).toBe(false);
  });

  it('isReady is true when all fields have values', () => {
    const { result } = renderHook(() => useDepositForm());

    act(() => {
      result.current.form.setFieldValue('currency', 'ETH');
      result.current.form.setFieldValue('network', 'erc20');
      result.current.form.setFieldValue('amount', '0.5');
    });

    expect(result.current.isReady).toBe(true);
  });

  it('selectedCurrency is null when no currency selected', () => {
    const { result } = renderHook(() => useDepositForm());
    expect(result.current.selectedCurrency).toBeNull();
  });

  it('selectedCurrency returns the currency entry when selected', () => {
    const { result } = renderHook(() => useDepositForm());

    act(() => {
      result.current.form.setFieldValue('currency', 'ETH');
    });

    expect(result.current.selectedCurrency).not.toBeNull();
    expect(result.current.selectedCurrency?.value).toBe('ETH');
    expect(result.current.selectedCurrency?.minDeposit).toBe(0.01);
  });

  it('availableNetworks returns networks for selected currency', () => {
    const { result } = renderHook(() => useDepositForm());

    act(() => {
      result.current.form.setFieldValue('currency', 'ETH');
    });

    expect(result.current.availableNetworks).toHaveLength(3);
    expect(result.current.availableNetworks[0].value).toBe('erc20');
  });

  it('availableNetworks is empty when no currency selected', () => {
    const { result } = renderHook(() => useDepositForm());
    expect(result.current.availableNetworks).toHaveLength(0);
  });

  it('resets network when currency changes to one that does not support current network', () => {
    const { result } = renderHook(() => useDepositForm());

    act(() => {
      result.current.form.setFieldValue('network', 'solana');
    });

    act(() => {
      result.current.form.setFieldValue('currency', 'ETH');
    });

    const values = result.current.form.getValues();
    expect(values.currency).toBe('ETH');
    // 'solana' is not a valid ETH network, so it should be reset
    expect(values.network).toBe('');
  });

  it('preserves network when it is valid for the new currency', () => {
    const { result } = renderHook(() => useDepositForm());

    act(() => {
      result.current.form.setFieldValue('network', 'erc20');
    });

    act(() => {
      result.current.form.setFieldValue('currency', 'ETH');
    });

    const values = result.current.form.getValues();
    expect(values.currency).toBe('ETH');
    // 'erc20' is a valid ETH network
    expect(values.network).toBe('erc20');
  });

  it('validates amount against minDeposit', () => {
    const { result } = renderHook(() => useDepositForm());

    act(() => {
      result.current.form.setFieldValue('currency', 'BTC');
    });

    act(() => {
      result.current.form.setFieldValue('amount', '0.0001');
    });

    act(() => {
      result.current.form.validate();
    });

    const errors = result.current.form.errors;
    expect(errors.amount).toBe('Minimum deposit is 0.001 BTC');
  });
});

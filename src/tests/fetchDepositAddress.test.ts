import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchDepositAddress } from '@/services/deposit';

describe('fetchDepositAddress', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a promise resolving to a string containing the currency and network', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const promise = fetchDepositAddress('ETH', 'erc20');
    expect(promise).toBeInstanceOf(Promise);

    vi.advanceTimersByTime(1600);

    const result = await promise;
    expect(typeof result).toBe('string');
    expect(result).toContain('eth');
    expect(result).toContain('erc20');
  });

  it('throws an error when Math.random is below 0.25', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);

    const promise = fetchDepositAddress('BTC', 'bitcoin');

    vi.advanceTimersByTime(1600);

    await expect(promise).rejects.toThrow('Failed to generate deposit address. Please try again.');
  });

  it('rejects with an Error instance', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const promise = fetchDepositAddress('SOL', 'solana');
    vi.advanceTimersByTime(1600);

    await expect(promise).rejects.toBeInstanceOf(Error);
  });
});

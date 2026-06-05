import { renderHook, waitFor } from '@testing-library/react';
import { useData } from '@/hooks/useData';
import { describe, it, expect, vi } from 'vitest';

describe('useData Hook', () => {
  it('initially returns isLoading as true and data/error as null', () => {
    const fetcher = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useData(fetcher));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns the resolved data and sets isLoading to false after fetch', async () => {
    const fetcher = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useData(fetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
  });

  it('captures and exposes errors when the fetcher rejects', async () => {
    const testError = new Error('Fetch failed');
    const fetcher = vi.fn().mockRejectedValue(testError);
    const { result } = renderHook(() => useData(fetcher));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(testError);
  });

  it('does not set state after unmount (no memory leak)', async () => {
    const fetcher = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve('too late'), 200);
        }),
    );

    const { result, unmount } = renderHook(() => useData(fetcher));
    unmount();

    // Wait long enough for the promise to resolve, but since we unmounted,
    // isLoading should have remained true
    await new Promise((r) => setTimeout(r, 300));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
  });
});

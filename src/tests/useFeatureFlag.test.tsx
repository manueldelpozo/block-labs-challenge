import { renderHook } from '@testing-library/react';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { FeatureFlagProvider } from '@/app/providers/FeatureFlagProvider';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { describe, it, expect, vi } from 'vitest';

describe('useFeatureFlag Hook', () => {
  it('throws an error if consumed outside of a FeatureFlagProvider wrapper', () => {
    // Suppress console error output for expected react render crashes
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useFeatureFlag('showAnalytics'))).toThrow(
      'useFeatureFlag must be used within a FeatureFlagProvider',
    );

    consoleSpy.mockRestore();
  });

  it('correctly resolves default features within provider stack', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      </TenantProvider>
    );

    const { result } = renderHook(() => useFeatureFlag('showAnalytics'), { wrapper });
    expect(result.current).toBe(true); // default value in config
  });
});

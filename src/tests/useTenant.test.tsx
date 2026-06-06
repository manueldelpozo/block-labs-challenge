import { renderHook } from '@testing-library/react';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { useTenant } from '@/hooks/useTenant';
import { describe, it, expect, vi } from 'vitest';

describe('useTenant Hook', () => {
  it('throws an error if consumed outside of a TenantProvider wrapper', () => {
    // Suppress expected React boundary runtime errors in the test output console
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useTenant())).toThrow(
      'useTenant must be used within a TenantProvider',
    );

    consoleSpy.mockRestore();
  });

  it('returns the default tenant properties when correctly nested', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TenantProvider>{children}</TenantProvider>
    );

    const { result } = renderHook(() => useTenant(), { wrapper });

    expect(result.current.tenantId).toBe('block-default');
    expect(result.current.tenant.name).toBe('Block Labs Default');
    expect(result.current.tenant.apiBase).toBe('https://api.blocklabs.default');
  });
});

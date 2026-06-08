import { renderHook } from '@testing-library/react';
import { TenantProvider } from '@/app/providers/TenantProvider';
import { useTenant } from '@/hooks/useTenant';
import { describe, it, expect, vi } from 'vitest';
import { getTenantConfig } from '@/config/tenant.config';

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

    expect(result.current.tenantId).toBe('tenant-a');
    expect(result.current.tenant.name).toBe('Tenant A');
    expect(result.current.tenant.apiBase).toBe('https://api.tenant-a.com');
  });

  it('resolves tenant-a config correctly', () => {
    const config = getTenantConfig('tenant-a');
    expect(config.name).toBe('Tenant A');
    expect(config.theme.primaryColor).toBe('blue');
    expect(config.apiBase).toBe('https://api.tenant-a.com');
  });

  it('resolves tenant-b config correctly', () => {
    const config = getTenantConfig('tenant-b');
    expect(config.name).toBe('Tenant B');
    expect(config.theme.primaryColor).toBe('green');
    expect(config.apiBase).toBe('https://api.tenant-b.com');
  });
});

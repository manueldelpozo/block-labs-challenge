import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from './mantine-theme';
import { getBlockDefaultTheme } from './tenants/block-default';
import { getTenantATheme } from './tenants/tenant-a';
import { getTenantBTheme } from './tenants/tenant-b';

export * from './tokens';
export * from './mantine-theme';
export * from './color-schemes';
export * from './tenants/block-default';
export * from './tenants/tenant-a';
export * from './tenants/tenant-b';

const THEME_RESOLVERS: Record<string, () => ReturnType<typeof createTenantTheme>> = {
  'block-default': getBlockDefaultTheme,
  'tenant-a': getTenantATheme,
  'tenant-b': getTenantBTheme,
};

export function resolveTenantTheme(tenantId: string) {
  const resolver = THEME_RESOLVERS[tenantId];
  if (resolver) return resolver();

  // Fallback for runtime-registered tenants without a dedicated theme file
  const config = getTenantConfig(tenantId);
  return createTenantTheme(config);
}

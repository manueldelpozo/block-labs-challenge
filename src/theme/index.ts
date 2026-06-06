import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from './mantine-theme';
import { getBlockDefaultTheme } from './tenants/block-default';

export * from './tokens';
export * from './mantine-theme';
export * from './color-schemes';
export * from './tenants/block-default';

const THEME_RESOLVERS: Record<string, () => ReturnType<typeof createTenantTheme>> = {
  'block-default': getBlockDefaultTheme,
};

export function resolveTenantTheme(tenantId: string) {
  const resolver = THEME_RESOLVERS[tenantId];
  if (resolver) return resolver();

  // Fallback for runtime-registered tenants without a dedicated theme file
  const config = getTenantConfig(tenantId);
  return createTenantTheme(config);
}

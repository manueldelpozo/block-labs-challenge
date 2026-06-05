import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from './mantine-theme';
import { getAcmeCorpTheme } from './tenants/acme-corp';
import { getBlockDefaultTheme } from './tenants/block-default';
import { getBlockPartnerTheme } from './tenants/block-partner';

export * from './tokens';
export * from './mantine-theme';
export * from './color-schemes';
export * from './tenants/block-default';
export * from './tenants/block-partner';
export * from './tenants/acme-corp';

const THEME_RESOLVERS: Record<string, () => ReturnType<typeof createTenantTheme>> = {
  'acme-corp': getAcmeCorpTheme,
  'block-default': getBlockDefaultTheme,
  'block-partner': getBlockPartnerTheme,
};

export function resolveTenantTheme(tenantId: string) {
  const resolver = THEME_RESOLVERS[tenantId];
  if (resolver) return resolver();

  // Fallback for runtime-registered tenants without a dedicated theme file
  const config = getTenantConfig(tenantId);
  return createTenantTheme(config);
}

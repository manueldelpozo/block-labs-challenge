import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from './mantine-theme';

export * from './tokens';
export * from './mantine-theme';
export * from './color-schemes';

export function resolveTenantTheme(tenantId: string) {
  const config = getTenantConfig(tenantId);
  return createTenantTheme(config);
}

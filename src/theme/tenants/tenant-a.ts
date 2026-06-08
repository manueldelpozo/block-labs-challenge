import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from '../mantine-theme';

export function getTenantATheme() {
  const config = getTenantConfig('tenant-a');
  return createTenantTheme(config);
}

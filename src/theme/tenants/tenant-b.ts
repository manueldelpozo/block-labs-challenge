import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from '../mantine-theme';

export function getTenantBTheme() {
  const config = getTenantConfig('tenant-b');
  return createTenantTheme(config);
}

import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from '../mantine-theme';

export function getBlockDefaultTheme() {
  const config = getTenantConfig('block-default');
  return createTenantTheme(config);
}

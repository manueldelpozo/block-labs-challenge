import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from '../mantine-theme';

export function getBlockPartnerTheme() {
  const config = getTenantConfig('block-partner');
  return createTenantTheme(config);
}

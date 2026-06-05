import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from '../mantine-theme';

export function getAcmeCorpTheme() {
  const config = getTenantConfig('acme-corp');
  return createTenantTheme(config);
}

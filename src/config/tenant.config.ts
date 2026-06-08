import type { IFeatureFlags } from './features';
import type { ITenantI18nConfig } from './i18n.config';

export interface ITenantThemeConfig {
  primaryColor: string;
  brandColors: string[];
  fontFamily: string;
  borderRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface ITenantConfig {
  id: string;
  name: string;
  theme: ITenantThemeConfig;
  features: IFeatureFlags;
  logo: string;
  apiBase: string;
  i18n: ITenantI18nConfig;
  /** Call-to-action copy for primary deposit button */
  ctaCopy: string;
}

export const TENANT_REGISTRY: Record<string, ITenantConfig> = {
  'block-default': {
    id: 'block-default',
    name: 'Block Labs Default',
    theme: {
      primaryColor: 'indigo',
      brandColors: [
        '#eef2ff', // 0
        '#e0e7ff', // 1
        '#c7d2fe', // 2
        '#a5b4fc', // 3
        '#818cf8', // 4
        '#6366f1', // 5
        '#4f46e5', // 6
        '#4338ca', // 7
        '#3730a3', // 8
        '#1e1b4b', // 9
      ],
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      borderRadius: 'md',
    },
    features: {
      showAnalytics: true,
      showSettings: true,
      enableDarkMode: true,
      showBetaBanner: false,
    },
    logo: 'Block Labs',
    apiBase: 'https://api.blocklabs.default',
    i18n: {
      supportedLocales: ['en-US', 'ja-JP', 'es-ES'],
      defaultLocale: 'en-US',
      currency: 'USD',
      supportedCurrencies: ['BTC', 'ETH', 'USDC', 'SOL'],
    },
    ctaCopy: 'Deposit Now',
  },
};

export function resolveTenantId(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const tenantParam = params.get('tenant');
    if (tenantParam && TENANT_REGISTRY[tenantParam]) {
      return tenantParam;
    }
  }
  return 'block-default';
}

export function getTenantConfig(tenantId: string): ITenantConfig {
  return TENANT_REGISTRY[tenantId] || TENANT_REGISTRY['block-default'];
}

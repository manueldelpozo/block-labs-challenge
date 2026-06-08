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
  'tenant-a': {
    id: 'tenant-a',
    name: 'Tenant A',
    theme: {
      primaryColor: 'blue',
      brandColors: [
        '#e7f5ff', // 0
        '#d0ebff', // 1
        '#a5d8ff', // 2
        '#74c0fc', // 3
        '#4dabf7', // 4
        '#228be6', // 5
        '#1c7ed6', // 6
        '#1971c2', // 7
        '#1864ab', // 8
        '#0b4f8c', // 9
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
    logo: 'Tenant A',
    apiBase: 'https://api.tenant-a.com',
    i18n: {
      supportedLocales: ['en-US'],
      defaultLocale: 'en-US',
      currency: 'USD',
      supportedCurrencies: ['BTC', 'ETH', 'USDC', 'SOL'],
    },
    ctaCopy: 'Deposit Now',
  },
  'tenant-b': {
    id: 'tenant-b',
    name: 'Tenant B',
    theme: {
      primaryColor: 'green',
      brandColors: [
        '#ebfbee', // 0
        '#d3f9d8', // 1
        '#b2f2bb', // 2
        '#8ce99a', // 3
        '#69db7c', // 4
        '#51cf66', // 5
        '#40c057', // 6
        '#37b24d', // 7
        '#2f9e44', // 8
        '#206a36', // 9
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
    logo: 'Tenant B',
    apiBase: 'https://api.tenant-b.com',
    i18n: {
      supportedLocales: ['en-US'],
      defaultLocale: 'en-US',
      currency: 'USD',
      supportedCurrencies: ['ETH', 'USDC'],
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
  return 'tenant-a';
}

export function getTenantConfig(tenantId: string): ITenantConfig {
  return TENANT_REGISTRY[tenantId] || TENANT_REGISTRY['block-default'];
}

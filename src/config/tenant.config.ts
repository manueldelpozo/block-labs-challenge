import type { TenantConfig } from '@/types/tenant';

export const TENANT_REGISTRY: Record<string, TenantConfig> = {
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
  },
  'block-partner': {
    id: 'block-partner',
    name: 'Partner Analytics Inc',
    theme: {
      primaryColor: 'emerald',
      brandColors: [
        '#ecfdf5', // 0
        '#d1fae5', // 1
        '#a7f3d0', // 2
        '#6ee7b7', // 3
        '#34d399', // 4
        '#10b981', // 5
        '#059669', // 6
        '#047857', // 7
        '#065f46', // 8
        '#022c22', // 9
      ],
      fontFamily: 'Outfit, Inter, sans-serif',
      borderRadius: 'lg',
    },
    features: {
      showAnalytics: false,
      showSettings: true,
      enableDarkMode: false,
      showBetaBanner: true,
    },
    logo: 'Partner Analytics',
    apiBase: 'https://api.partneranalytics.com',
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

export function getTenantConfig(tenantId: string): TenantConfig {
  return TENANT_REGISTRY[tenantId] || TENANT_REGISTRY['block-default'];
}

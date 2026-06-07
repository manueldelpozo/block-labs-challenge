import { createContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { TTranslationMap, ITenantI18nConfig, TLocaleCode } from '@/config/i18n.config';
import { mergeTranslations } from '@/config/i18n.config';
import { useTenant } from '@/hooks/useTenant';
import { enUS } from '@/i18n/locales/en-US';
import { jaJP } from '@/i18n/locales/ja-JP';
import { esES } from '@/i18n/locales/es-ES';
import { enUS as blockDefaultEnUS } from '@/i18n/tenants/block-default/en-US';
import { jaJP as blockDefaultJaJP } from '@/i18n/tenants/block-default/ja-JP';
import { esES as blockDefaultEsES } from '@/i18n/tenants/block-default/es-ES';

const BASE_TRANSLATIONS: Record<TLocaleCode, TTranslationMap> = {
  'en-US': enUS,
  'ja-JP': jaJP,
  'es-ES': esES,
};

const TENANT_OVERRIDES: Record<string, Record<TLocaleCode, TTranslationMap>> = {
  'block-default': {
    'en-US': blockDefaultEnUS,
    'ja-JP': blockDefaultJaJP,
    'es-ES': blockDefaultEsES,
  },
};

export interface II18nContextValue {
  /** Translate a key to the current locale's string. Falls back to the key itself if untranslated. */
  t: (key: string) => string;
  /** Format a number as currency using the tenant's currency and user's locale. */
  formatCurrency: (value: number) => string;
  /** Format a number using the user's locale. */
  formatNumber: (value: number) => string;
  /** The currently active locale code (e.g. 'en-US', 'ja-JP'). */
  currentLocale: TLocaleCode;
  /** Switch the current locale. Silently ignored if the locale is not in supportedLocales. */
  setLocale: (locale: TLocaleCode) => void;
  /** The list of locales this tenant supports (from tenant config). */
  supportedLocales: TLocaleCode[];
  /** The tenant's i18n configuration. */
  i18nConfig: ITenantI18nConfig;
}

export const I18nContext = createContext<II18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { tenant, tenantId } = useTenant();
  const [currentLocale, setCurrentLocale] = useState<TLocaleCode>(() => tenant.i18n.defaultLocale);

  // Reset locale if tenant changes and current locale isn't supported
  useEffect(() => {
    if (!tenant.i18n.supportedLocales.includes(currentLocale)) {
      setCurrentLocale(tenant.i18n.defaultLocale);
    }
  }, [tenantId]); // eslint-disable-line react-hooks/exhaustive-deps

  const merged = useMemo(() => {
    const base = BASE_TRANSLATIONS[currentLocale] ?? BASE_TRANSLATIONS['en-US'] ?? {};
    const overrides = TENANT_OVERRIDES[tenantId]?.[currentLocale] ?? {};
    return mergeTranslations(base, overrides);
  }, [currentLocale, tenantId]);

  const t = useCallback((key: string): string => merged[key] ?? key, [merged]);

  const formatCurrency = useCallback(
    (value: number): string => {
      try {
        return new Intl.NumberFormat(currentLocale, {
          style: 'currency',
          currency: tenant.i18n.currency,
        }).format(value);
      } catch {
        return `${tenant.i18n.currency} ${value.toLocaleString(currentLocale)}`;
      }
    },
    [currentLocale, tenant.i18n.currency],
  );

  const formatNumber = useCallback(
    (value: number): string => {
      try {
        return new Intl.NumberFormat(currentLocale).format(value);
      } catch {
        return String(value);
      }
    },
    [currentLocale],
  );

  const setLocale = useCallback(
    (locale: TLocaleCode) => {
      if (tenant.i18n.supportedLocales.includes(locale)) {
        setCurrentLocale(locale);
      }
    },
    [tenant.i18n.supportedLocales],
  );

  const contextValue = useMemo(
    () => ({
      t,
      formatCurrency,
      formatNumber,
      currentLocale,
      setLocale,
      supportedLocales: tenant.i18n.supportedLocales,
      i18nConfig: tenant.i18n,
    }),
    [t, formatCurrency, formatNumber, currentLocale, setLocale, tenant.i18n],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

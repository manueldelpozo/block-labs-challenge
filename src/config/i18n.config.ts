/** Union of known locale codes: `'en-US' | 'ja-JP' | 'es-ES'` */
export type TLocaleCode = keyof typeof LOCALE_LABELS;

/** Union of known locale label values: `'EN' | 'JA' | 'ES'` */
export type TLocaleLabel = (typeof LOCALE_LABELS)[TLocaleCode];

export interface ITenantI18nConfig {
  supportedLocales: TLocaleCode[];
  defaultLocale: TLocaleCode;
  currency: string;
}

export type TTranslationMap = Record<string, string>;

export function mergeTranslations(
  base: TTranslationMap,
  overrides: TTranslationMap,
): TTranslationMap {
  return { ...base, ...overrides };
}

export const LOCALE_LABELS = {
  'en-US': 'EN',
  'ja-JP': 'JA',
  'es-ES': 'ES',
} as const;

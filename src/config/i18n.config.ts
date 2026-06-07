export interface ITenantI18nConfig {
  supportedLocales: string[];
  defaultLocale: string;
  currency: string;
}

export type TTranslationMap = Record<string, string>;

export function mergeTranslations(
  base: TTranslationMap,
  overrides: TTranslationMap,
): TTranslationMap {
  return { ...base, ...overrides };
}

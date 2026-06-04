import type { FeatureFlags } from '@/types/features';

export const DEFAULT_FEATURES: FeatureFlags = {
  showAnalytics: true,
  showSettings: true,
  enableDarkMode: true,
  showBetaBanner: false,
};

export function mergeFeatures(
  defaults: FeatureFlags,
  overrides: Record<string, boolean>,
): FeatureFlags {
  return {
    showAnalytics:
      overrides.showAnalytics !== undefined ? overrides.showAnalytics : defaults.showAnalytics,
    showSettings:
      overrides.showSettings !== undefined ? overrides.showSettings : defaults.showSettings,
    enableDarkMode:
      overrides.enableDarkMode !== undefined ? overrides.enableDarkMode : defaults.enableDarkMode,
    showBetaBanner:
      overrides.showBetaBanner !== undefined ? overrides.showBetaBanner : defaults.showBetaBanner,
  };
}

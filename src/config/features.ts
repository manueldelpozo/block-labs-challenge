export interface IFeatureFlags {
  showAnalytics: boolean;
  showSettings: boolean;
  enableDarkMode: boolean;
  showBetaBanner: boolean;
}

export const DEFAULT_FEATURES: IFeatureFlags = {
  showAnalytics: true,
  showSettings: true,
  enableDarkMode: true,
  showBetaBanner: false,
};

export function mergeFeatures(defaults: IFeatureFlags, overrides: IFeatureFlags): IFeatureFlags {
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

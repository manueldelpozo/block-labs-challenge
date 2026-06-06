import { useContext } from 'react';
import { FeatureFlagContext } from '@/app/providers/FeatureFlagProvider';
import type { IFeatureFlags } from '@/config/features';

export function useFeatureFlag(flag: keyof IFeatureFlags): boolean {
  const flags = useContext(FeatureFlagContext);
  if (!flags) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  }
  return flags[flag];
}

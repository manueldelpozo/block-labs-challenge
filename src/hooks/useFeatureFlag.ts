import { useContext } from 'react';
import { FeatureFlagContext } from '@/app/providers/FeatureFlagProvider';
import type { FeatureFlags } from '@/types/features';

export function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  const flags = useContext(FeatureFlagContext);
  if (!flags) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
  }
  return flags[flag];
}

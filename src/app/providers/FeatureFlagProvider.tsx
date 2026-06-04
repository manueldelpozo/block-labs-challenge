import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { FeatureFlags } from '@/types/features';
import { DEFAULT_FEATURES, mergeFeatures } from '@/config/features';
import { TenantContext } from './TenantProvider';

export const FeatureFlagContext = createContext<FeatureFlags | null>(null);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const tenantContext = useContext(TenantContext);

  const flags = useMemo(() => {
    if (!tenantContext) {
      return DEFAULT_FEATURES;
    }
    return mergeFeatures(DEFAULT_FEATURES, tenantContext.tenant.features);
  }, [tenantContext]);

  return <FeatureFlagContext.Provider value={flags}>{children}</FeatureFlagContext.Provider>;
}

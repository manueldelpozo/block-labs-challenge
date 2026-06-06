import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { DEFAULT_FEATURES, mergeFeatures, type IFeatureFlags } from '@/config/features';
import { TenantContext } from './TenantProvider';

export const FeatureFlagContext = createContext<IFeatureFlags | null>(null);

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

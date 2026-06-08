import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ITenantConfig } from '@/config/tenant.config';
import { resolveTenantId, getTenantConfig } from '@/config/tenant.config';

export interface ITenantContextValue {
  tenant: ITenantConfig;
  tenantId: string;
  isLoading: boolean;
  switchTenant: (newTenantId: string) => void;
}

export const TenantContext = createContext<ITenantContextValue | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantId] = useState<string>('block-default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = resolveTenantId();
    setTenantId(id);
    setIsLoading(false);
  }, []);

  const switchTenant = useCallback((newTenantId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tenant', newTenantId);
    window.history.pushState({}, '', url.toString());
    setTenantId(newTenantId);
  }, []);

  const tenant = getTenantConfig(tenantId);

  return (
    <TenantContext.Provider value={{ tenant, tenantId, isLoading, switchTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

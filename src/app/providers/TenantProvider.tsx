import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { ITenantConfig } from '@/config/tenant.config';
import { resolveTenantId, getTenantConfig } from '@/config/tenant.config';

export interface ITenantContextValue {
  tenant: ITenantConfig;
  tenantId: string;
  isLoading: boolean;
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

  const tenant = getTenantConfig(tenantId);

  return (
    <TenantContext.Provider value={{ tenant, tenantId, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
}

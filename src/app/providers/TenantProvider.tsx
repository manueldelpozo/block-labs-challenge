import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { TenantConfig } from '@/types/tenant';
import { resolveTenantId, getTenantConfig } from '@/config/tenant.config';

export interface TenantContextValue {
  tenant: TenantConfig;
  tenantId: string;
  isLoading: boolean;
}

export const TenantContext = createContext<TenantContextValue | null>(null);

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

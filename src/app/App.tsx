import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router';
import { TenantProvider, FeatureFlagProvider, I18nProvider } from './providers';
import { useTenant } from '@/hooks/useTenant';
import { resolveTenantTheme, cssVariablesResolver } from '@/theme';
import { router } from './router';
import '@mantine/core/styles.css';

function ThemeWrapper() {
  const { tenantId } = useTenant();
  const theme = resolveTenantTheme(tenantId);

  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={cssVariablesResolver}
      defaultColorScheme="light"
    >
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </MantineProvider>
  );
}

export function App() {
  return (
    <TenantProvider>
      <FeatureFlagProvider>
        <ThemeWrapper />
      </FeatureFlagProvider>
    </TenantProvider>
  );
}

import { createTheme, type CSSVariablesResolver } from '@mantine/core';
import { tokens } from './tokens';
import type { ITenantConfig } from '@/config/tenant.config';

export function createBaseTheme() {
  return createTheme({
    fontFamily: tokens.typography.fontFamily.sans,
    fontFamilyMonospace: tokens.typography.fontFamily.mono,
    spacing: tokens.spacing,
    radius: tokens.radii,
    shadows: tokens.shadows,
    breakpoints: tokens.breakpoints,
    components: {
      Button: {
        defaultProps: {
          variant: 'filled',
        },
      },
      Paper: {
        defaultProps: {
          withBorder: true,
          shadow: 'sm',
          p: 'md',
        },
      },
    },
  });
}

export function createTenantTheme(tenantConfig: ITenantConfig) {
  const baseTheme = createBaseTheme();

  // Create a 10-shade tuple format required by Mantine
  const tenantColors: Record<
    string,
    [string, string, string, string, string, string, string, string, string, string]
  > = {};

  const shades = tenantConfig.theme.brandColors;
  if (shades.length === 10) {
    tenantColors[tenantConfig.theme.primaryColor] = [
      shades[0],
      shades[1],
      shades[2],
      shades[3],
      shades[4],
      shades[5],
      shades[6],
      shades[7],
      shades[8],
      shades[9],
    ];
  }

  return createTheme({
    ...baseTheme,
    primaryColor: tenantConfig.theme.primaryColor,
    colors: tenantColors,
    fontFamily: tenantConfig.theme.fontFamily,
    defaultRadius: tenantConfig.theme.borderRadius,
  });
}

export const cssVariablesResolver: CSSVariablesResolver = (_theme) => ({
  variables: {
    '--bl-color-success': tokens.colors.success,
    '--bl-color-warning': tokens.colors.warning,
    '--bl-color-error': tokens.colors.error,
    '--bl-color-info': tokens.colors.info,
    '--bl-font-mono': tokens.typography.fontFamily.mono,
  },
  light: {
    '--bl-color-bg-subtle': '#f8f9fa',
    '--bl-color-border': '#dee2e6',
  },
  dark: {
    '--bl-color-bg-subtle': '#1a1b1e',
    '--bl-color-border': '#373a40',
  },
});

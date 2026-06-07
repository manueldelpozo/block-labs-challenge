---
name: tenant-config
description: Multi-tenant registration, theming, and feature flag configuration
agent: architecture-guardian
---

# Tenant Configuration

**Scope:** `src/config/tenant.config.ts`, `src/config/features.ts`, `src/theme/mantine-theme.ts`, `src/theme/tenants/`, `src/theme/index.ts`, `src/app/providers/TenantProvider.tsx`, `src/hooks/useTenant.ts`

## Responsibility

Manages the multi-tenant architecture: tenant identity, per-tenant theme tokens, feature flag overrides, and URL-based tenant resolution. Every tenant is a single entry in the central registry, from which theme, features, and API configuration are derived.

---

## 1. Architecture Overview

```
src/config/tenant.config.ts    ← Central TENANT_REGISTRY + ITenantConfig / ITenantThemeConfig
src/config/features.ts          ← DEFAULT_FEATURES + IFeatureFlags + mergeFeatures()
src/theme/mantine-theme.ts      ← createTenantTheme() — transforms config → Mantine theme
src/theme/index.ts              ← resolveTenantTheme() — public API
src/app/providers/TenantProvider.tsx  ← React context provider
src/hooks/useTenant.ts          ← useTenant() hook
```

**Data flow:**

```
URL ?tenant=block-custom
       ↓
TenantProvider (reads query param via resolveTenantId)
       ↓
getTenantConfig('block-custom')  →  TenantConfig object
       ↓                       ↓
  createTenantTheme(...)    FeatureFlagProvider.mergeFeatures(...)
       ↓                       ↓
  Mantine theme              Feature flags for the session
```

---

## 2. Tenant Registry Pattern

The registry in `src/config/tenant.config.ts` follows the **POJO as const** ethos (see [pojo-as-const](../pojo-as-const/SKILL.md)) — a single source of truth from which everything else is derived.

```typescript
// src/config/tenant.config.ts — type co-located with its registry
export interface ITenantConfig { /* … */ }

export const TENANT_REGISTRY: Record<string, ITenantConfig> = {
  'block-default': { /* … */ },
  'block-custom': { /* … */ },
};
```

### ITenantConfig shape (defined in `src/config/tenant.config.ts`)

| Field | Type | Purpose |
|:--|:--|:--|
| `id` | `string` | Unique tenant slug (must match registry key) |
| `name` | `string` | Display name |
| `theme.primaryColor` | `string` | Mantine color name (`blue`, `emerald`, `violet`, etc.) |
| `theme.brandColors` | `string[]` | 10-shade array for Mantine color palette |
| `theme.fontFamily` | `string` | CSS font-family stack |
| `theme.borderRadius` | `string` | Mantine radius token (`sm`, `md`, `lg`) |
| `features` | `Record<string, boolean>` | Per-tenant feature flag overrides |
| `logo` | `string` | Brand logo text |
| `apiBase` | `string` | Base API URL for this tenant |

---

## 3. Adding a New Tenant — Step by Step

### Step 1 — Register in the central registry

Add a new entry to `TENANT_REGISTRY` in `src/config/tenant.config.ts`:

```typescript
'block-custom': {
  id: 'block-custom',
  name: 'Custom Corp',
  theme: {
    primaryColor: 'violet',
    brandColors: [
      '#f5f3ff', // 0
      '#ede9fe', // 1
      '#ddd6fe', // 2
      '#c4b5fd', // 3
      '#a78bfa', // 4
      '#8b5cf6', // 5
      '#7c3aed', // 6
      '#6d28d9', // 7
      '#5b21b6', // 8
      '#2e1065', // 9
    ],
    fontFamily: '"Public Sans", Inter, sans-serif',
    borderRadius: 'md',
  },
  features: {
    showAnalytics: true,
    showSettings: true,
    enableDarkMode: false,
    showBetaBanner: true,
  },
  logo: 'Custom Corp',
  apiBase: 'https://api.customcorp.com',
}
```

**Rules for brandColors:**
- Must be exactly 10 hex strings
- Index 0 is the lightest shade, index 9 is the darkest
- Index 5 should be the primary brand color (Mantine uses it as the default button/surface shade)
- Use a color palette generator or extract from the brand style guide

### Step 2 — Add feature flags (if needed)

If your tenant needs new feature flags not in the existing `IFeatureFlags` interface:

1. Add the flag to the interface in `src/config/features.ts`:
   ```typescript
   export interface IFeatureFlags {
     showAnalytics: boolean;
     showSettings: boolean;
     enableDarkMode: boolean;
     showBetaBanner: boolean;
     newFlag: boolean;           // ← added
   }
   ```

2. Set its default in `src/config/features.ts`:
   ```typescript
   export const DEFAULT_FEATURES: IFeatureFlags = {
     showAnalytics: true,
     showSettings: true,
     enableDarkMode: true,
     showBetaBanner: false,
     newFlag: false,             // ← added
   };
   ```

3. Add merge logic in `mergeFeatures()`:
   ```typescript
   newFlag:
     overrides.newFlag !== undefined ? overrides.newFlag : defaults.newFlag,
   ```

4. Set the per-tenant override in the registry entry's `features` object.

### Step 3 — Create the per-tenant theme file

Each tenant **must** have a dedicated theme file in `src/theme/tenants/{tenant-id}.ts`. This file registers the tenant in the `THEME_RESOLVERS` map inside `resolveTenantTheme()` and provides an extension point for tenant-specific theme overrides:

```typescript
// src/theme/tenants/block-custom.ts
import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from '../mantine-theme';

export function getBlockCustomTheme() {
  const config = getTenantConfig('block-custom');
  return createTenantTheme(config);
}
```

Then register it in `src/theme/index.ts`:
1. Import the function
2. Export it via `export * from './tenants/block-custom'`
3. Add it to the `THEME_RESOLVERS` map

### Step 4 — Wire it up (automatic)

Once the registry entry exists, these work automatically:

- **`resolveTenantId()`** reads `?tenant=block-custom` from the URL and returns the matching ID
- **`getTenantConfig('block-custom')`** returns the config object
- **`TenantProvider`** sets the tenant context
- **`createTenantTheme(config)`** generates the Mantine theme
- **`mergeFeatures()`** applies per-tenant flag overrides on top of defaults

---

## 4. URL-Based Tenant Resolution

Tenants are resolved from the URL query string:

```
https://app.example.com/?tenant=block-custom
```

If no tenant parameter is found or the value is not in the registry, the system falls back to `block-default`.

```typescript
// src/config/tenant.config.ts
export function resolveTenantId(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const tenantParam = params.get('tenant');
    if (tenantParam && TENANT_REGISTRY[tenantParam]) {
      return tenantParam;
    }
  }
  return 'block-default';  // fallback
}
```

---

## 5. Component Variants — When Theme Tokens Aren't Enough

Theme tokens handle colors, fonts, and spacing. But some tenants need structurally different components — a different checkout flow, a different nav layout, a different data table.

**Do not** add `if (tenant === 'block-custom')` branching inside shared components. That leaks tenant logic into the UI layer and makes the codebase untestable with every new tenant.

Instead, use a **component variants** pattern:

### Step 1 — Add a `componentVariants` field to the tenant config

```typescript
export interface ITenantConfig {
  id: string;
  name: string;
  theme: ITenantThemeConfig;
  features: IFeatureFlags;
  logo: string;
  apiBase: string;
  componentVariants?: Record<string, string>;  // ← added
}

export const TENANT_REGISTRY: Record<string, ITenantConfig> = {
  'block-default': {
    // ...
    componentVariants: {
      CheckoutButton: 'default',
      NavHeader: 'default',
    },
  },
  'block-custom': {
    // ...
    componentVariants: {
      CheckoutButton: 'block-custom',
    },
  },
};
```

### Step 2 — Register variant implementations

Create a registry that maps component name + variant → the actual component:

```typescript
// src/config/variant-registry.ts
import type { ComponentType } from 'react';

// Default variants
import { CheckoutButton as DefaultCheckoutButton } from '@/components/ui/CheckoutButton';
import { NavHeader as DefaultNavHeader } from '@/components/layout/NavHeader';

// Tenant-specific variants
import { CheckoutButton as CustomCheckoutButton } from '@/components/variants/block-custom/CheckoutButton';
import { NavHeader as CustomNavHeader } from '@/components/variants/block-custom/NavHeader';

type VariantRegistry = Record<string, Record<string, ComponentType>>;

export const VARIANT_REGISTRY: VariantRegistry = {
  CheckoutButton: {
    default: DefaultCheckoutButton,
    'block-custom': CustomCheckoutButton,
  },
  NavHeader: {
    default: DefaultNavHeader,
    'block-custom': CustomNavHeader,
  },
};
```

### Step 3 — Resolve at the call site

```typescript
import { getTenantConfig } from '@/config/tenant.config';
import { VARIANT_REGISTRY } from '@/config/variant-registry';
import { useTenant } from '@/hooks/useTenant';

function resolveComponent<T>(name: string, tenantConfig: ITenantConfig): T {
  const variant = tenantConfig.componentVariants?.[name] ?? 'default';
  return VARIANT_REGISTRY[name]?.[variant] as T;
}

// Usage in a page or layout
function CheckoutPage() {
  const { tenant } = useTenant();
  const CheckoutButton = resolveComponent<ComponentType<ButtonProps>>(
    'CheckoutButton',
    tenant,
  );

  return <CheckoutButton onClick={...} />;
}
```

### When to use this pattern

| ✅ Use component variants | ❌ Theme tokens are enough |
|---------------------------|---------------------------|
| Tenant needs different component structure (multi-step vs single-page checkout) | Tenant needs different colors, fonts, border radius |
| Tenant needs different layout composition (sidebar vs top-nav) | Tenant needs different spacing or breakpoints |
| Tenant adds or removes fields from a form | Tenant toggles feature sections on/off via feature flags |

**Key constraint:** Variant components live in `src/components/variants/{tenant-id}/`, not in `src/components/ui/`. This keeps tenant-specific code physically separate from the shared component library.

### Not implemented yet

This pattern is **documented but not wired** in the current codebase. The single tenant at this scale is fully served by theme tokens + feature flags. Implement this when a tenant needs structural component divergence.

---

## 6. Testing

### When adding a new tenant, update these tests:

| Test file | What to verify |
|:--|:--|
| `src/tests/useTenant.test.tsx` | Add a test that resolves the new tenant ID and asserts its config values |
| `src/tests/theme.test.tsx` (create if absent) | Add a test verifying `resolveTenantTheme()` returns a valid theme for the new tenant |
| `src/tests/Settings.test.tsx` | Optionally verify the new tenant's feature flag defaults render correctly |
| `src/tests/Dashboard.test.tsx` | If the new tenant has different feature flags, verify the correct sections show |

### Existing test patterns:

```typescript
// useTenant.test.tsx — add a block like:
it('resolves the new tenant config correctly', () => {
  const config = getTenantConfig('block-custom');

  expect(config.name).toBe('Custom Corp');
  expect(config.apiBase).toBe('https://api.customcorp.com');
});
```

---

## 7. Quality Checklist

- [ ] New tenant entry added to `TENANT_REGISTRY` with all required fields.
- [ ] Per-tenant theme file created at `src/theme/tenants/{tenant-id}.ts` exporting a `get{Name}Theme()` function.
- [ ] Theme file registered in `src/theme/index.ts` (import, re-export, and `THEME_RESOLVERS` entry).
- [ ] `brandColors` array has exactly 10 hex values.
- [ ] `primaryColor` matches the name of the 10-shade color being defined.
- [ ] If new feature flags were added: they are in `IFeatureFlags` interface, `DEFAULT_FEATURES`, and `mergeFeatures()`.
- [ ] Tenant can be activated via `?tenant={id}` query parameter.
- [ ] Fallback to `block-default` works when no/invalid tenant is specified.
- [ ] Tests updated (`useTenant.test.tsx`, and any page tests affected by flag changes).
- [ ] Interfaces use `I` prefix (`IFeatureFlags`, `ITenantConfig`), types use `T` prefix (`TColorSchemeKey`).
- [ ] `npm run test` passes.

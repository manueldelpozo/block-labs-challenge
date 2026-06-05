---
name: tenant-config
description: Multi-tenant registration, theming, and feature flag configuration
---

# Tenant Configuration

**Scope:** `src/config/tenant.config.ts`, `src/types/tenant.ts`, `src/types/features.ts`, `src/config/features.ts`, `src/theme/mantine-theme.ts`, `src/theme/tenants/`

## Responsibility

Manages the multi-tenant architecture: tenant identity, per-tenant theme tokens, feature flag overrides, and URL-based tenant resolution. Every tenant is a single entry in the central registry, from which theme, features, and API configuration are derived.

---

## 1. Architecture Overview

```
src/config/tenant.config.ts    ← Central TENANT_REGISTRY (single source of truth)
src/types/tenant.ts             ← TenantConfig / TenantThemeConfig interfaces
src/types/features.ts           ← FeatureFlags interface
src/config/features.ts          ← DEFAULT_FEATURES + mergeFeatures()
src/theme/mantine-theme.ts      ← createTenantTheme() — transforms config → Mantine theme
src/theme/index.ts              ← resolveTenantTheme() — public API
src/app/providers/TenantProvider.tsx  ← React context provider
src/hooks/useTenant.ts          ← useTenant() hook
```

**Data flow:**

```
URL ?tenant=block-partner
       ↓
TenantProvider (reads query param via resolveTenantId)
       ↓
getTenantConfig('block-partner')  →  TenantConfig object
       ↓                       ↓
  createTenantTheme(...)    FeatureFlagProvider.mergeFeatures(...)
       ↓                       ↓
  Mantine theme              Feature flags for the session
```

---

## 2. Tenant Registry Pattern

The registry in `src/config/tenant.config.ts` follows the **POJO as const** ethos (see [pojo-as-const](../pojo-as-const/SKILL.md)) — a single source of truth from which everything else is derived.

```typescript
// src/config/tenant.config.ts
export const TENANT_REGISTRY: Record<string, TenantConfig> = {
  'block-default': { /* … */ },
  'block-partner': { /* … */ },
};
```

### TenantConfig shape (`src/types/tenant.ts`)

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

If your tenant needs new feature flags not in the existing `FeatureFlags` interface:

1. Add the flag to `src/types/features.ts`:
   ```typescript
   export interface FeatureFlags {
     showAnalytics: boolean;
     showSettings: boolean;
     enableDarkMode: boolean;
     showBetaBanner: boolean;
     newFlag: boolean;           // ← added
   }
   ```

2. Set its default in `src/config/features.ts`:
   ```typescript
   export const DEFAULT_FEATURES: FeatureFlags = {
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

### Step 3 — Optional: tenant theme file

Each tenant **can** have a dedicated theme file in `src/theme/tenants/{tenant-id}.ts` for cases where you need tenant-specific theme overrides beyond what `createTenantTheme` provides:

```typescript
import { getTenantConfig } from '@/config/tenant.config';
import { createTenantTheme } from '../mantine-theme';

export function getBlockCustomTheme() {
  const config = getTenantConfig('block-custom');
  return createTenantTheme(config);
}
```

> ⚠️ **Note:** These files are currently optional. `resolveTenantTheme()` in `theme/index.ts` calls `getTenantConfig` + `createTenantTheme` directly — it does not use these per-tenant wrappers. The wrapper exists for cases where you later need tenant-specific theme customization (e.g., adding tenant-specific CSS variables, component overrides).

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

## 5. Testing

### When adding a new tenant, update these tests:

| Test file | What to verify |
|:--|:--|
| `src/tests/useTenant.test.tsx` | Add a test that resolves the new tenant ID and asserts its config values |
| `src/tests/Settings.test.tsx` | Optionally verify the new tenant's feature flag defaults render correctly |
| `src/tests/Dashboard.test.tsx` | If the new tenant has different feature flags, verify the correct sections show |

### Existing test patterns:

```typescript
// useTenant.test.tsx — add a block like:
it('resolves the new tenant config correctly', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TenantProvider>{children}</TenantProvider>
  );
  const { result } = renderHook(() => useTenant(), { wrapper });
  expect(result.current.tenant.name).toBe('Custom Corp');
  expect(result.current.tenant.apiBase).toBe('https://api.customcorp.com');
});
```

---

## 6. Quality Checklist

- [ ] New tenant entry added to `TENANT_REGISTRY` with all required fields.
- [ ] `brandColors` array has exactly 10 hex values.
- [ ] `primaryColor` matches the name of the 10-shade color being defined.
- [ ] If new feature flags were added: they are in `FeatureFlags` interface, `DEFAULT_FEATURES`, and `mergeFeatures()`.
- [ ] Tenant can be activated via `?tenant={id}` query parameter.
- [ ] Fallback to `block-default` works when no/invalid tenant is specified.
- [ ] Tests updated (`useTenant.test.tsx`, and any page tests affected by flag changes).
- [ ] `npm run test` passes.

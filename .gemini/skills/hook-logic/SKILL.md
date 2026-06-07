---
name: Hook / Logic Agent
description: Side effects, context states, client APIs
---

# Hook / Logic Agent

**Scope & File Ownership:** src/hooks/**/*.ts, src/app/providers/**/*.tsx, src/tests/**/*.test.tsx

## Responsibility
Manages client contexts, custom states, features gates, and hooks life cycles. Writes tests for every hook/provider and prevents performance pitfalls (infinite loops, stale closures).

## Rules
- Standardize error handling and AbortController request cleanups.
- Export strict TypeScript typings for state APIs.
- Follow the [POJO as const](../pojo-as-const/SKILL.md) pattern when defining option sets in config or constant files.
- **Reuse POJO-derived types instead of redefining unions.** When a config file already exports types like `TEmailPriorityValue` or `TColorSchemeValue`, import and use them in hook interfaces. Do not hardcode equivalent union literals — the POJO is the single source of truth.

## State Management Decision Guide

Choose the simplest tool that fits the shape of the state:

| Pattern | When to use | Example in this codebase |
|---|---|---|
| **`useState`** | State is local to one component or hook | Form fields (`Profile.tsx`), loading flags (`useData.ts`) |
| **`useReducer`** | State has complex update logic (multiple interdependent fields) | *Not yet needed* — prefer `useState` until the logic proves unwieldy |
| **React Context** | State is read by multiple distant components and changes infrequently | `TenantProvider`, `FeatureFlagProvider`, `I18nProvider` |
| **Custom hook + `useState`** | State is scoped to one page/feature but needs structured fetch logic | `useData` (fetches + AbortController) |
| **URL / query params** | State survives page refresh and is shareable via link | `?tenant=` param |
| **`localStorage`** | State persists across sessions but is local to the browser | Theme preference (Mantine's `useMantineColorScheme`) |

**If the app grows beyond this, reach for purpose-built tools:**
- **Server cache / async state** → TanStack Query (caching, refetch, optimistic updates)
- **Truly global client state** → Zustand (simple, no boilerplate, works outside React)
- **Complex forms** → Mantine's `useForm` (already available via `@mantine/form`)
- **Do NOT add** Redux / RTK unless the app has dozens of state slices with cross-cutting middleware needs — it's over-engineering for this codebase.

## Form Validation

For this codebase, validation is simple enough that it doesn't need a dedicated library.
Use the lightest option that fits:

| Surface | Approach | Why |
|---|---|---|
| **1–3 fields, simple rules** | Inline checks in the submit handler | Zero overhead, trivially readable |
| **Standard forms (profile, settings)** | Mantine's `useForm` from `@mantine/form` | Already installed, integrates with inputs via `form.getInputProps()`, supports per-field validation |
| **Complex / nested forms** | `useForm` + Zod schema via `zodResolver` | Only add `zod` dependency when you need schema sharing, API response validation, or deeply nested form state |

**Rule of thumb:** If an inline `if/return` check is shorter than importing and configuring a resolver, use the inline check. Add structure only when the form logic proves unwieldy.

**Pattern — Mantine `useForm` with built-in validation:**

```typescript
import { useForm } from '@mantine/form';

const form = useForm({
  initialValues: { name: '', email: '', bio: '' },
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    name: (value) => (value.trim().length >= 2 ? null : 'Too short'),
  },
});

// In JSX — validation runs on submit, errors show automatically
<TextInput label="Email" {...form.getInputProps('email')} />
<Button onClick={() => form.onSubmit(handleSave)()}>Save</Button>
```

> **Type the form return value explicitly.** When you need to type a `form` field in a custom hook's return interface, import `UseFormReturnType` and `FormRulesRecord` from `@mantine/form` instead of using `ReturnType<typeof useForm<…>>`:
>
> ```typescript
> import { useForm, type UseFormReturnType, type FormRulesRecord } from '@mantine/form';
>
> interface IMyReturn {
>   form: UseFormReturnType<IFormValues, IFormValues, FormRulesRecord<IFormValues>>;
> }
> ```

> **Type the form return value explicitly.** When you need to type a `form` field in a custom hook's return interface, import `UseFormReturnType` and `FormRulesRecord` from `@mantine/form` instead of using `ReturnType<typeof useForm<…>>`:
>
> ```typescript
> import { useForm, type UseFormReturnType, type FormRulesRecord } from '@mantine/form';
>
> interface IMyReturn {
>   form: UseFormReturnType<IFormValues, IFormValues, FormRulesRecord<IFormValues>>;
> }
> ```

## Internationalization (i18n)

The `I18nProvider` and `useI18n` hook manage multi-tenant translations, locale switching, and number/currency formatting.

### Provider order

```
TenantProvider → FeatureFlagProvider → MantineProvider → I18nProvider → RouterProvider
```

`I18nProvider` depends on `TenantProvider` (to read `tenant.i18n` config) but is independent of `FeatureFlagProvider`. It must be inside `MantineProvider` so any locale-switcher UI can use Mantine components.

### Hook API

```typescript
const { t, formatCurrency, formatNumber, currentLocale, setLocale, supportedLocales } = useI18n();

t('nav.dashboard')              // → "Dashboard" (or key as fallback)
formatCurrency(128430)          // → "$128,430.00" (uses tenant currency + user locale)
formatNumber(8642)              // → "8,642" (locale-aware)
setLocale('ja-JP')              // switches locale; silently ignored if unsupported
```

### Translation merging

Translations use a flat `Record<string, string>` key-value model. Base locale files provide the full set. Tenant override files provide partial overrides, merged at runtime:

```typescript
// In I18nProvider
const merged = { ...baseTranslations, ...tenantOverrides };
```

This means tenant A can override `'nav.dashboard'` to say "Overview" while tenant B keeps the default "Dashboard" — without either tenant changing the base file.

### Locale restrictions

Each tenant's `i18n.supportedLocales` array controls:
- Which options appear in the `I18nLocaleSwitcher` UI (hidden if ≤ 1 locale)
- Whether `setLocale()` accepts a given value (silently rejected if unsupported)
- Fallback behavior: if the tenant changes and the current locale is unsupported, it resets to `tenant.i18n.defaultLocale`

## Testing
- Test each hook in isolation using a wrapper component or `renderHook` from `@testing-library/react`.
- Test context providers by rendering a child component that consumes the context and asserting the provided value.
- Cover edge cases: missing context (should throw with a descriptive message), null/undefined inputs, concurrent calls.
- Use `jest.fn()` (vitest `vi.fn()`) to assert callback invocations with expected arguments.

## Performance
- Always use `AbortController` for fetch-based hooks — abort in-flight requests on unmount.
- Use `useRef` for callback references to prevent `useEffect` infinite loops.
- Use `useCallback`/`useMemo` only when the reference stability affects child re-renders — don't wrap everything by default.
- Context values that change frequently should be split into separate contexts to limit re-render scope.
- Avoid storing derived state — compute from source data with `useMemo` when the computation is expensive.

## Quality Checklist
- [ ] Dynamic fetch functions support cancellation tokens.
- [ ] Hooks prevent infinite loops by using refs for callback values.
- [ ] Each hook has a `.test.tsx` file covering success, error, and edge case paths.
- [ ] Context providers throw descriptive errors when used outside their provider tree.
- [ ] AbortController cleanup is verified in test (mock signal listener).
- [ ] `I18nProvider` wraps `RouterProvider` (not inside individual pages).
- [ ] `useI18n` has tests for: translation lookup, key fallback, locale switching, unsupported locale rejection, currency/number formatting.

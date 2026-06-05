---
name: pojo-as-const
description: Reference for the "POJO as const → derived types → derived arrays" pattern
---

# POJO `as const` — Reference Cheatsheet

> A pattern for defining option sets as a single source of truth: a plain object
> marked `as const`, from which types, value arrays, and display helpers are derived.

**Guidelines, not rules.** This is a convention that eliminates magic strings and keeps
options in sync across UI surfaces. Use judgment — if a simple union type or enum is
sufficient, prefer the lighter option.

---

## 1. Canonical Structure

Every POJO `as const` definition lives in its own file under the domain it belongs to
(e.g. `src/theme/color-schemes.ts`, `src/config/sort-options.ts`).

```
src/
└── <domain>/
    └── <name>.ts          ← single source of truth
```

The file exports **five layers** in order:

```typescript
// ──────────────────────────────────────
// Layer 1 — The source object
// ──────────────────────────────────────

export const MY_OPTIONS = {
  foo: { label: 'Foo', value: 'foo' },
  bar: { label: 'Bar', value: 'bar' },
} as const;


// ──────────────────────────────────────
// Layer 2 — Derived types
// ──────────────────────────────────────

/** Union of object keys: `'foo' | 'bar'` */
export type MyKey = keyof typeof MY_OPTIONS;

/** Union of `value` fields: `'foo' | 'bar'` */
export type MyValue = (typeof MY_OPTIONS)[MyKey]['value'];


// ──────────────────────────────────────
// Layer 3 — Reusable data arrays
// ──────────────────────────────────────

/** `{ label, value }[]` for SegmentedControl, Select, Tabs, etc. */
export const MY_OPTIONS_LIST = Object.values(MY_OPTIONS);

/** Flat string array for iteration / validation */
export const MY_VALUES = MY_OPTIONS_LIST.map((o) => o.value);


// ──────────────────────────────────────
// Layer 4 — Display helpers (optional)
// ──────────────────────────────────────

/** Colors / icons keyed by resolved value (light/dark only, not auto) */
export const MY_BADGE_COLORS = {
  foo: 'blue',
  bar: 'orange',
} as const;

/** Human-readable labels for display */
export const MY_DISPLAY_LABELS = {
  foo: 'Foo mode',
  bar: 'Bar mode',
} as const;
```

---

## 2. Naming Conventions

| Export | Pattern | Example |
|---|---|---|
| Source object | `UPPER_CASE` | `COLOR_SCHEME_OPTIONS` |
| Key type | `PascalCase + Key` | `ColorSchemeKey` |
| Value type | `PascalCase + Value` | `ColorSchemeValue` |
| Option list (array) | `SOURCE + _LIST` | `COLOR_SCHEME_OPTIONS_LIST` |
| Value array | `SOURCE + _VALUES` | `COLOR_SCHEME_VALUES` |
| Badge/color map | `SOURCE + _BADGE_COLORS` | `COLOR_SCHEME_BADGE_COLORS` |
| Display labels | `SOURCE + _DISPLAY_LABELS` | `COLOR_SCHEME_DISPLAY_LABELS` |

---

## 3. Consumption Patterns

### Direct value access — no magic strings

```typescript
import { MY_OPTIONS } from '@/path/to/options';

MY_OPTIONS.foo.value;     // → 'foo'
MY_OPTIONS.bar.value;     // → 'bar'
```

### UI data array (Select, SegmentedControl, Tabs, etc.)

```tsx
import { MY_OPTIONS_LIST } from '@/path/to/options';

<SegmentedControl data={MY_OPTIONS_LIST} />
<Select data={MY_OPTIONS_LIST} />
```

### Indexed lookup (using a resolved value as key)

```tsx
import {
  MY_OPTIONS,
  MY_BADGE_COLORS,
  MY_DISPLAY_LABELS,
} from '@/path/to/options';

// The resolved value becomes the index key
const current = computedValue;                // 'foo' | 'bar'

<Badge color={MY_BADGE_COLORS[current]}>      // 'blue' | 'orange'
  {MY_DISPLAY_LABELS[current]}                // 'Foo mode' | 'Bar mode'
</Badge>
```

### Type-safe values

```tsx
import { type MyValue } from '@/path/to/options';

function handleChange(value: MyValue) { … }
// value is 'foo' | 'bar' — autocompleted by TS
```

---

## 4. When to use this pattern

| ✅ Use POJO `as const` | ❌ Use a simpler alternative |
|---|---|
| The same options appear in multiple UI surfaces (Select, badge, logic) | The value is used in only one place |
| You need both the label and value in one place | You only need a flat list of strings |
| Different display properties depend on the selected value (color, label, icon) | The display is static and unrelated to the value |
| You want TS to enforce that all consumers stay in sync when adding/removing options | The set of options never changes |

### Acceptable shortcuts

- **Simple union type** — if you only need type safety and never render a UI list:
  ```typescript
  type SortDir = 'asc' | 'desc';
  ```
- **Enum** — if the values must be numeric or you need reverse mapping (use `const enum` when possible).

---

## 5. Codebase example

**`src/theme/color-schemes.ts`** — the canonical implementation:

```typescript
export const COLOR_SCHEME_OPTIONS = {
  light: { label: '🌞 Light', value: 'light' },
  dark:  { label: '🌙 Dark', value: 'dark' },
  auto:  { label: '🖥️  Auto', value: 'auto' },
} as const;

export type ColorSchemeKey   = keyof typeof COLOR_SCHEME_OPTIONS;
export type ColorSchemeValue = (typeof COLOR_SCHEME_OPTIONS)[ColorSchemeKey]['value'];

export const COLOR_SCHEME_OPTIONS_LIST = Object.values(COLOR_SCHEME_OPTIONS);
export const COLOR_SCHEME_VALUES = COLOR_SCHEME_OPTIONS_LIST.map((o) => o.value);

// Display helpers indexed by the computed (resolved) value
export const COLOR_SCHEME_BADGE_COLORS = {
  light: 'gray',
  dark: 'violet',
} as const;

export const COLOR_SCHEME_DISPLAY_LABELS = {
  light: 'Light mode',
  dark: 'Dark mode',
} as const;
```

Consumed in **`src/pages/Profile/Profile.tsx`**:

```tsx
import {
  COLOR_SCHEME_OPTIONS,
  COLOR_SCHEME_OPTIONS_LIST,
  COLOR_SCHEME_BADGE_COLORS,
  COLOR_SCHEME_DISPLAY_LABELS,
  type ColorSchemeValue,
} from '@/theme/color-schemes';

// UI data array
<SegmentedControl data={COLOR_SCHEME_OPTIONS_LIST} … />

// Indexed lookup against resolved value
<Badge color={COLOR_SCHEME_BADGE_COLORS[computedColorScheme]}>
  {COLOR_SCHEME_DISPLAY_LABELS[computedColorScheme]}
</Badge>

// Type-safe setter
setColorScheme(value as ColorSchemeValue);
```

---

## 6. Adding a new option

1. Add an entry to the source object
2. Types update automatically (derived)
3. Arrays update automatically (derived)
4. **Only manual step** — update display helpers if the new option needs badge colors / labels
5. All consumers get the new option in their dropdowns, selects, and type unions

```typescript
// Before
export const MY_OPTIONS = {
  foo: { label: 'Foo', value: 'foo' },
} as const;
// → MyValue = 'foo'

// After
export const MY_OPTIONS = {
  foo: { label: 'Foo', value: 'foo' },
  bar: { label: 'Bar', value: 'bar' },   // ← added
} as const;
// → MyValue = 'foo' | 'bar'   ← automatic
// → MY_OPTIONS_LIST includes 'bar'  ← automatic
```

---

## 7. Related references

- [`ts-react-patterns`](../ts-react-patterns/SKILL.md) — general React + TS patterns (context, hooks, event types, etc.)
- Use `Object.values()` rather than `Object.keys().map()` to iterate — it preserves the typed value shapes.
- Prefer `as const` over `satisfies` when the primary goal is narrow literal types for derivation.

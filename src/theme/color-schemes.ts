/**
 * Color scheme options defined as a const object.
 *
 * Usage:
 *   - Direct access:  `COLOR_SCHEME_OPTIONS.dark.value`
 *   - Data array:     `COLOR_SCHEME_OPTIONS_LIST` (for SegmentedControl, Select, etc.)
 *   - Derived types:  `ColorSchemeKey` | `ColorSchemeValue`
 *
 * Add or remove entries here and all consumers stay in sync.
 */

export const COLOR_SCHEME_OPTIONS = {
  light: { label: '🌞 Light', value: 'light' },
  dark: { label: '🌙 Dark', value: 'dark' },
  auto: { label: '🖥️  Auto', value: 'auto' },
} as const;

/* ── Derived types ─────────────────────────────────────── */

/** Union of object keys: `'light' | 'dark' | 'auto'` */
export type TColorSchemeKey = keyof typeof COLOR_SCHEME_OPTIONS;

/** Union of the `value` fields — derived, so always in sync */
export type TColorSchemeValue = (typeof COLOR_SCHEME_OPTIONS)[TColorSchemeKey]['value'];

/* ── Reusable data arrays ──────────────────────────────── */

/** Array of `{ label, value }` for SegmentedControl / Select `data` prop */
export const COLOR_SCHEME_OPTIONS_LIST = Object.values(COLOR_SCHEME_OPTIONS);

/** Flat value strings, e.g. for iterating or validation */
export const COLOR_SCHEME_VALUES = COLOR_SCHEME_OPTIONS_LIST.map((o) => o.value);

/* ── Display helpers (keyed by resolved light/dark) ────── */

/** Mantine Badge color to use for each resolved color scheme */
export const COLOR_SCHEME_BADGE_COLORS = {
  light: 'gray',
  dark: 'violet',
} as const;

/** Human-readable label for each resolved color scheme */
export const COLOR_SCHEME_DISPLAY_LABELS = {
  light: 'Light mode',
  dark: 'Dark mode',
} as const;

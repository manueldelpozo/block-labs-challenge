# Block Labs — Multi-Tenant Frontend Ecosystem

**Live demo:** `npm run dev` → `http://localhost:5173/?tenant=block-default`

A React SPA designed for the Block Labs code challenge: same codebase, multiple brands. Every tenant brings its own theme, feature flags, and API configuration — resolved from a URL query parameter with zero component changes.

## Scope Control

This challenge intentionally prioritizes:
- Architecture clarity
- Multi-tenant extensibility
- Performance-aware defaults

It intentionally defers:
- SSR / RSC (documented trade-offs)
- Module Federation runtime wiring
- Real backend integration

The goal is to demonstrate *how* the system scales, not to fully implement every scale concern.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| **Framework** | React 19 + TypeScript 6 | Strict typing, concurrent features, no legacy API surface |
| **Build** | Vite 8 + SWC | Fast HMR, native TypeScript transform, no Babel overhead |
| **UI** | Mantine 9 | Comprehensive component library with built-in theming, dark mode, and responsive primitives. Avoids CSS-in-JS runtime cost |
| **Router** | React Router 7 | Standard SPA routing; lazy loading built-in |
| **Form** | Mantine `useForm` | Declarative validation, minimal boilerplate. Zod deferred until cross-field rules are needed |
| **Styling** | CSS Modules + Mantine CSS Variables | Scoped styles per component, global tokens via `--bl-*` custom properties, no runtime injection |
| **Testing** | Vitest + Testing Library + jsdom | Fast, SWC-native test runner; behavior-based assertions (no snapshots) |
| **Linting** | ESLint 8 + Prettier | Consistent formatting, React hooks rules, import ordering |

---

## Multi-Tenant Architecture

```
URL ?tenant=block-default
       ↓
TenantProvider (reads query param via resolveTenantId)
       ↓
getTenantConfig('block-default')  →  TenantConfig object
       ↓                       ↓
  createTenantTheme(...)    FeatureFlagProvider.mergeFeatures(...)
       ↓                       ↓
  Mantine theme              Feature flags for the session
```

### Tenant registry (`src/config/tenant.config.ts`)

Single source of truth. Each tenant defines:

```typescript
{
  id: string;           // URL slug
  name: string;         // Display name
  theme: {              // Colors, fonts, border radius
    primaryColor: string;
    brandColors: string[];  // 10 shades
    fontFamily: string;
    borderRadius: string;
  };
  features: {           // Per-tenant feature toggles
    showAnalytics: boolean;
    showSettings: boolean;
    enableDarkMode: boolean;
    showBetaBanner: boolean;
  };
  logo: string;         // Brand text
  apiBase: string;      // Backend URL
}
```

**1 registered tenant:**

| Tenant | Slug | Theme | Analytics |
|--------|------|-------|-----------|
| Block Labs Default | `?tenant=block-default` | Indigo | ✅ |

New tenants require: registry entry + theme file + registration in `THEME_RESOLVERS`. No component code changes.

### Theming

- **Design tokens** (`src/theme/tokens.ts`) — centralized colors, spacing, typography, radii, shadows, breakpoints
- **CSS Variables** — Mantine's `CSSVariablesResolver` emits `--bl-color-*` custom properties (no runtime CSS-in-JS)
- **Per-tenant theme files** (`src/theme/tenants/*.ts`) — each tenant has a wrapper registered in `resolveTenantTheme()`
- **Adding a tenant** requires zero component changes — all components consume theme via `useTenant()` hook

---

## Project Structure

```
src/
├── app/
│   ├── App.tsx                   ← Provider tree (Tenant + FeatureFlag)
│   ├── router.tsx                ← All routes, lazy imports, Suspense
│   └── providers/
│       ├── TenantProvider.tsx     ← Resolves tenant from URL, provides context
│       └── FeatureFlagProvider.tsx ← Merges defaults + tenant overrides
├── components/
│   ├── ui/                       ← Pure, stateless, theme-driven
│   │   ├── StatCard/             ← Memoized, ARIA-annotated
│   │   └── TenantLogo/           ← Pure props (name + logo), no hooks
│   ├── layout/                   ← Structure only, bridge layer
│   │   ├── AppShell/             ← Reads useTenant + useFeatureFlag, passes props down
│   │   └── PageContainer/        ← Title + description shell
│   └── common/                   ← Shared infrastructure
│       ├── ErrorBoundary.tsx
│       └── LoadingFallback.tsx
├── config/
│   ├── tenant.config.ts          ← TENANT_REGISTRY + resolvers
│   └── features.ts               ← DEFAULT_FEATURES + mergeFeatures()
├── hooks/                        ← All side effects + context consumers
│   ├── useTenant.ts
│   ├── useFeatureFlag.ts
│   └── useData.ts                ← Fetch + AbortController pattern
├── pages/                        ← Route-level compositions (lazy loaded)
│   ├── Dashboard/
│   ├── Profile/
│   ├── Settings/
│   └── NotFound/
├── theme/
│   ├── tokens.ts                 ← Design tokens (POJO as const)
│   ├── mantine-theme.ts          ← createTenantTheme() builder
│   ├── color-schemes.ts          ← POJO → derived types → derived arrays
│   └── tenants/                  ← Per-tenant theme wrappers
├── types/
│   ├── tenant.ts
│   └── features.ts
├── tests/                        ← 13 files, 49 tests
│   └── setup.ts                  ← Global mocks (matchMedia, ResizeObserver, fonts)
└── main.tsx                      ← Entry point
```

---

## Component Layer Architecture

```
hooks/ (side effects, context)
   ↑
layout/ (reads hooks, passes props)
   ↑
ui/ (pure props in, JSX out — ZERO hooks, ZERO logic)
```

**Boundary rules (enforced by Architecture Guardian):**

| Layer | Can import hooks? | Can import router? | Responsibility |
|-------|-------------------|--------------------|----------------|
| `ui/*` | ❌ Never | ❌ | Pure rendering, props in / JSX out |
| `layout/*` | ✅ Yes | ✅ Yes | Bridge layer: read hooks, pass data as props |
| `pages/*` | ✅ Yes | ✅ Yes | Composition + data wiring |
| `hooks/*` | N/A | N/A | All side effects, API calls, context consumption |

---

## Testing Strategy

**49 tests, 13 files — behavior-based, zero snapshots.**

| Category | Files | Coverage |
|----------|-------|----------|
| **Hook tests** | 3 | `useTenant` (resolves, errors without provider), `useFeatureFlag` (merge logic, missing context), `useData` (loading → data → error → cleanup) |
| **UI component tests** | 2 | `StatCard` (renders values, trend indicators, ARIA), `TenantLogo` (first letter, logo text, empty name fallback) |
| **Layout tests** | 2 | `AppShell` (nav links, active route, feature-flag-driven Settings link), `PageContainer` (title, description, children) |
| **Common tests** | 2 | `ErrorBoundary` (renders children, catches errors, custom fallback), `LoadingFallback` (loader, default/custom message) |
| **Page integration** | 4 | `Dashboard` (loading → data → analytics sections), `Profile` (form render, validation, pre-fill), `Settings` (tenant details, feature flags, validation), `NotFound` (404 text, navigation button) |

**Principle:** Test behavior that protects refactors. Every test asserts what the user sees or does, not how it's implemented internally.

---

## Performance

| Technique | Applied | Evidence |
|-----------|---------|----------|
| Lazy routes | ✅ | Every page uses `React.lazy()` + `<Suspense>` with contextual fallbacks |
| Memoization | ✅ | `React.memo` on `StatCard`, `TenantLogo`, `PageContainer`, `LoadingFallback` |
| Stable callbacks | ✅ | `useCallback` on form handlers (`Profile`, `Settings`) |
| Stable references | ✅ | `useRef` for fetcher callback in `useData` (prevents infinite loops) |
| Vendor chunking | ✅ | `vite.config.ts` splits vendor into `react`, `mantine`, `router`, `misc` |
| CSS variables | ✅ | No CSS-in-JS runtime; tokens resolved at build time |

---

## Agentic AI Ecosystem

The project uses 7 specialized AI agents, each with bounded scope, rules, and a quality checklist:

```
Architecture Guardian (review + enforce boundaries)
  ├── validates → UI Component Agent (stateless presentational)
  ├── validates → Layout Agent (structural shells)
  ├── validates → Page Composition Agent (routing + composition)
  ├── validates → Hook / Logic Agent (side effects + context)
  │
  Performance Agent (audits → all of the above)
  Testing Agent (verifies → all of the above)
```

| Agent | Role | Key constraint |
|-------|------|----------------|
| **UI Component** | Builds pure presentational units | Zero hooks, zero logic, zero router |
| **Layout** | Designs structural shells | Reads hooks, passes props — never fetches |
| **Page Composition** | Wires data → layout → UI | Every route lazy-loaded + Suspense |
| **Hook / Logic** | Side effects, context, API | AbortController cleanup, typed returns |
| **Performance** | Bundle + render optimization | Vendor chunking, memo audits |
| **Testing** | Behavior verification | No snapshots, no implementation details |
| **Architecture Guardian** | Reviews all changes | Blocks Redux, enforces boundaries |

**11 skill files** (`.claude/skills/` + `.gemini/skills/`) provide detailed guidance for each area, including multi-tenant configuration, testing patterns, and the POJO-as-const design pattern.

**Why agentic AI?** AI accelerates scaffolding, refactoring, and testing. Architecture is still a human responsibility — agents are constrained by explicit rules and cannot make cross-boundary decisions.

---

## ChatGPT Senior-Level Checklist Analysis

Evaluated against 12 senior-engineering dimensions for multi-tenant code challenges:

| # | Dimension | Score | Summary |
|---|-----------|-------|---------|
| 1 | **Multi-Tenant Foundations** | 🟢 | Central registry, query-param resolution, `useTenant` hook, 3 tenants |
| 2 | **Theming & White-Label** | 🟢 | Token-based, CSS variables, per-tenant theme files, 0 component changes per tenant |
| 3 | **Component Boundaries** | 🟢 | Pure UI layer (no hooks, no logic), layout as bridge, pages as composition |
| 4 | **Performance by Default** | 🟢 | Lazy routes, 4 memoized components, `useCallback`/`useMemo`/`useRef` patterns, vendor chunking |
| 5 | **Rendering Strategy** | 🟢 | Pure CSR with SSR-awareness (`typeof window` guard); trade-off documented |
| 6 | **Micro-Frontend Readiness** | 🟡 | Clean barrel exports, no global state abuse, but no module federation (intentionally deferred) |
| 7 | **Testing Strategy** | 🟢 | 49 behavior-based tests across hooks, UI, layout, pages — no snapshots |
| 8 | **Configuration over Code** | 🟢 | Feature flag system + tenant-driven navigation/layout toggles |
| 9 | **AI-Assisted Workflow** | 🟢 | 7 agents, 11 skills, Architecture Guardian locked down — AI accelerates, human architects |
| 10 | **Code Challenge Time Awareness** | 🟢 | 8 explicit trade-offs documented, 5 next steps, clear deferral reasoning |
| 11 | **Folder Structure** | 🟢 | Self-explanatory in 30 seconds — `ui/`, `layout/`, `pages/`, `hooks/`, `config/`, `theme/` |
| 12 | **Language & Communication** | 🟢 | Consistent naming, informative (not excessive) comments, descriptive test names |

**10/12 🟢, 2/12 🟡.** The two yellow dimensions (MF readiness, rendering strategy) are intentional deferrals appropriate for the challenge scope — documented in `ARCHITECTURE.md`.

---

## Getting Started

```bash
npm install          # No --legacy-peer-deps needed
npm run dev          # Local dev server
npm run test         # 49 tests, all passing
npm run build        # Production build
npm run typecheck    # TypeScript strict check
npm run lint         # ESLint + Prettier
```

Switch tenants by adding `?tenant=` to the URL:

- `http://localhost:5173/?tenant=block-default`

---

## Design Documents

| Document | Content |
|----------|---------|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Trade-offs, next steps, key decisions |
| [`CLAUDE.md`](./CLAUDE.md) | Agent roles, rules, quality checklists |
| [`AGENTS.md`](./AGENTS.md) | Agent-to-scope mapping |
| [Skills](.claude/skills/) | 11 skill files (tenant-config, testing, performance, etc.) |

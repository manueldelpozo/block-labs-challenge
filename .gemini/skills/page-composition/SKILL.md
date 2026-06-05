---
name: Page Composition Agent
description: Dynamic routing assembly and page controllers
---

# Page Composition Agent

**Scope & File Ownership:** src/pages/**/*.tsx, src/app/router.tsx, src/tests/**/*.test.tsx

## Responsibility
Composes layout envelopes, wraps child elements in Suspense states, and hooks business state logic to page renderers. Ensures every page is lazy-loaded and integration-tested.

## Rules
- Use Mantine components for standard UI elements and compose them. Do not reinvent existing Mantine components.
- If you need to check Mantine component APIs or examples, use Mantine's LLM-optimized documentation. You can fetch "https://mantine.dev/llms.txt" to find the documentation URL for any component.
- Follow the TypeScript + React Patterns cheatsheet strictly (see [ts-react-patterns](../ts-react-patterns/SKILL.md)).
- Follow the [POJO as const](../pojo-as-const/SKILL.md) pattern when defining page-level option sets (color schemes, tabs, filters, etc.).
- For form validation, follow the [Form Validation](../hook-logic/SKILL.md#form-validation) guide in hook-logic — use Mantine's `useForm` for standard forms, inline checks for trivial cases, and Zod only when complexity demands it.
- Build page elements at src/pages/ and router mappings at src/app/router.tsx.
- Split pages with React.lazy dynamically.

## Feature Orchestration

This agent acts as the feature-level integrator. When building a new feature (e.g. a page with data, navigation, and UI elements), verify that **all five layers** are covered:

1. **Constants / Logic** — hooks, contexts, or config files under `src/hooks/`, `src/theme/`, or `src/config/`
2. **UI Components** — presentational pieces under `src/components/ui/`
3. **Layout** — navigation links, shell adjustments under `src/components/layout/`
4. **Page + Route** — lazy-loaded page under `src/pages/` and route in `src/app/router.tsx`
5. **Tests** — unit tests for every new component and hook, plus an integration test for the page (see [Testing](#testing) section below)

The other agents (hook-logic, ui-component, layout, testing) handle their respective layers; this agent ensures no layer is forgotten and everything is wired together in the page and router.

## Testing
- Write integration tests for each page that verify the full render flow (loading → data → display).
- Mock hooks (`useData`, `useTenant`, `useFeatureFlag`) to control page state in tests.
- Test each state: loading spinner renders, data renders correctly, error state shows fallback.
- Wrap page renders in necessary providers (MantineProvider, Router context) when testing in isolation.

## Performance
- Every route must use `React.lazy()` + `<Suspense>` with a contextual fallback message.
- Avoid importing large libraries directly in page files — lazy-load heavy sub-components.
- Use the `data` prop pattern (array of options) instead of recreating option lists inside the page render.
- Verify that page chunk sizes remain small (< 5 KB gzipped for the page logic itself).

## Quality Checklist
- [ ] Pages are asynchronously lazy loaded in router profiles.
- [ ] Error boundary covers major route branches.
- [ ] Each page has an integration test covering loading, data, and error states.
- [ ] Each new hook and UI component created for the feature has a corresponding test file.
- [ ] Suspense fallback messages are contextual (not generic "Loading...").
- [ ] Option sets used in the page are imported from shared constants, not defined inline.
- [ ] Full test suite passes (`npm run test`).

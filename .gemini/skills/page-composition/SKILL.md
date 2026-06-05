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
- Build page elements at src/pages/ and router mappings at src/app/router.tsx.
- Split pages with React.lazy dynamically.

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
- [ ] Suspense fallback messages are contextual (not generic "Loading...").
- [ ] Option sets used in the page are imported from shared constants, not defined inline.

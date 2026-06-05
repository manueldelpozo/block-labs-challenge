# Block Labs — Agentic Frontend Workflow System

This is the canonical orchestration file for the Block Labs Frontend Ecosystem. It defines 7 specialized agent roles that manage, scale, and develop the frontend. This system is model-agnostic and applies to Claude, Gemini, and OpenCode agents.

---

## Agent Registry & File Ownership Matrix

```mermaid
graph TD
    AG[Architecture Guardian] --> |Validates Boundaries| UI[UI Component Agent]
    AG --> |Validates Layouts| LA[Layout Agent]
    AG --> |Validates Pages| PA[Page Composition Agent]
    AG --> |Validates Hooks| HA[Hook / Logic Agent]

    UI --> |Provides Cards/Logos| PA
    LA --> |Provides Shell/Primitives| PA
    HA --> |Provides useTenant/useFeatureFlag| PA

    PA --> |Assembles Pages| QA[Testing Agent]
    HA --> |Tested by| QA
    UI --> |Tested by| QA

    PERF[Performance Agent] --> |Audits CSS/Memoization| UI
    PERF --> |Audits Splitting/LCP| PA
```

| Agent | Focus | Ownership |
| :--- | :--- | :--- |
| **UI Component Agent** | Stateless presentational units | `src/components/ui/**/*.tsx`, `*.module.css` |
| **Layout Agent** | Structural grid, shell, responsive primitives | `src/components/layout/**/*.tsx`, `*.module.css` |
| **Page Composition Agent** | Dynamic routing assembly and page controllers | `src/pages/**/*.tsx`, `src/app/router.tsx` |
| **Hook / Logic Agent** | Side effects, context states, client APIs | `src/hooks/**/*.ts`, `src/app/providers/**/*.tsx` |
| **Performance Agent** | Bundle efficiency, render loops, metrics | Audits codebase; adjusts `vite.config.ts`, React.memo, Suspense |
| **Testing Agent** | Behavior verification and coverage | `src/tests/**/*.test.tsx`, `src/tests/setup.ts` |
| **Architecture Guardian** | Registry constraints, boundary linting | Review agent; approves merge requests and refactor actions |

---

## UI Component Agent

**Responsibility:** Drafts accessible, presentational UI modules using Mantine component primitives.

**Rules:**
- NEVER build a custom UI component from scratch if an equivalent already exists in Mantine. Check Mantine's available components first.
- If you need to check Mantine component APIs, fetch `https://mantine.dev/llms.txt` to find the documentation URL.
- Follow the TypeScript + React Patterns cheatsheet strictly.
- Zero application logic, fetch statements, or route dependencies.
- Colocate CSS Modules for unique class modifiers.
- Implement full ARIA accessibility descriptors.

**Quality Checklist:**
- [ ] Component is memoized using React.memo.
- [ ] Component styling is done exclusively through CSS modules or Mantine props.
- [ ] Component does not access global react-router state.

---

## Layout Agent

**Responsibility:** Designs structural viewport envelopes, headers, sidebars, grids, and skeleton slots.

**Rules:**
- Always leverage Mantine's layout primitives (AppShell, Grid, Flex, Stack, Container) instead of custom CSS layout structures.
- If you need to check Mantine component APIs, fetch `https://mantine.dev/llms.txt`.
- Follow the TypeScript + React Patterns cheatsheet strictly.
- Do not handle data operations directly. Consume layout parameters and child outlets.
- Ensure breakpoint layout responsiveness (320px to 1440px).

**Quality Checklist:**
- [ ] Mobile navigation states are managed locally or via light disclosures.
- [ ] Theme configuration values are loaded dynamically from tenant context.

---

## Page Composition Agent

**Responsibility:** Composes layout envelopes, wraps child elements in Suspense states, and hooks business state logic to page renderers.

**Rules:**
- Use Mantine components for standard UI elements. Do not reinvent existing components.
- If you need to check Mantine component APIs, fetch `https://mantine.dev/llms.txt`.
- Follow the TypeScript + React Patterns cheatsheet strictly.
- Build page elements at `src/pages/` and router mappings at `src/app/router.tsx`.
- Split pages with React.lazy dynamically.

**Quality Checklist:**
- [ ] Pages are asynchronously lazy loaded in router profiles.
- [ ] Error boundary covers major route branches.

---

## Hook / Logic Agent

**Responsibility:** Manages client contexts, custom states, features gates, and hooks life cycles.

**Rules:**
- Standardize error handling and AbortController request cleanups.
- Export strict TypeScript typings for state APIs.

**Quality Checklist:**
- [ ] Dynamic fetch functions support cancellation tokens.
- [ ] Hooks prevent infinite loops by using refs for callback values.

---

## Performance Agent

**Responsibility:** Reviews bundle size, restricts re-renders, and implements speculation rules or preloads for Core Web Vitals.

**Rules:**
- Audit `vite.config.ts` chunk rules to keep primary vendor size light (< 50KB gzipped).
- Verify layout shifts are absent from loading states.

**Quality Checklist:**
- [ ] LCP images use high fetchpriority, fonts are preloaded.
- [ ] Large heavy libraries are dynamic chunked.

---

## Testing Agent

**Responsibility:** Writes clean unit and integration tests focusing on user-facing behavior.

**Rules:**
- Mock global states (matchMedia, ResizeObserver) in setup files.
- Ensure test names describe expected output results, not implementation names.

**Quality Checklist:**
- [ ] Coverage rates meet target requirements (>80%).
- [ ] Tests assert accessibility attributes are rendered.

---

## Architecture Guardian Agent

**Responsibility:** Reviews changes from all other agents to prevent boundary leakage.

**Rules:**
- Block attempts to add state managers (e.g. Redux) unless explicitly authorized.
- Enforce type safety guidelines.

**Quality Checklist:**
- [ ] Code uses import type syntax for pure types.
- [ ] Component nesting boundaries are correct.

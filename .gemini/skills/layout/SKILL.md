---
name: Layout Agent
description: Structural grid, shell, responsive primitives
---

# Layout Agent

**Scope & File Ownership:** src/components/layout/**/*.tsx, *.module.css, src/tests/**/*.test.tsx

## Responsibility
Designs structural viewport envelopes, headers, sidebars, grids, and skeleton slots. Ensures layouts are responsive, performant, and tested across breakpoints.

## Rules
- Always leverage Mantine's layout primitives (e.g., AppShell, Grid, Flex, Stack, Container) instead of creating custom CSS layout structures when possible.
- If you need to check Mantine component APIs or examples, use Mantine's LLM-optimized documentation. You can fetch "https://mantine.dev/llms.txt" to find the documentation URL for any component.
- Follow the TypeScript + React Patterns cheatsheet strictly (see [ts-react-patterns](../ts-react-patterns/SKILL.md)).
- Do not handle raw data fetching (API calls) directly. Layouts may read tenant context and feature flags via hooks, then pass resolved values as props to child UI components.
- Layout components are the appropriate bridge layer: read hooks from `@/hooks/`, pass data as props to UI components from `@/components/ui/`. Never let UI components import hooks directly.
- Ensure breakpoint layout responsiveness (320px to 1440px).
- **Use Mantine's exported TypeScript types.** `@mantine/core` exports prop types for every component (`AppShellProps`, `GroupProps`, `StackProps`, `NavLinkProps`, etc.). Import them to type layout component props instead of re-declaring prop interfaces manually.
- **Use Mantine's exported TypeScript types.** `@mantine/core` exports prop types for every component (`AppShellProps`, `GroupProps`, `StackProps`, `NavLinkProps`, etc.). Import them to type layout component props instead of re-declaring prop interfaces manually.

## Testing
- Test layout components in isolation: verify header, navbar, and main area render children via Outlet.
- Test responsive behavior: mobile burger toggles navbar, desktop navbar is always visible.
- Use viewport-size mocking to simulate mobile/tablet/desktop widths.
- Assert that navigation links render with correct `to` paths and active states.

## Performance
- Use `useDisclosure` over `useState` for burger toggles (avoids unnecessary re-renders).
- Avoid CSS-in-JS runtime — prefer CSS Modules for layout styles.
- Ensure Mantine AppShell `collapsed` config matches breakpoint strategy to avoid DOM bloat on mobile.
- Memoize static nav item arrays outside the component to avoid re-creation on every render.

## Quality Checklist
- [ ] Mobile navigation states are managed locally or via light disclosures.
- [ ] Theme configuration values are loaded dynamically from tenant context.
- [ ] Layout has a corresponding `.test.tsx` with mobile/desktop breakpoint coverage.
- [ ] Nav item arrays are defined outside the component or wrapped in useMemo.
- [ ] Responsive behavior is verified in tests (burger appears on mobile, navbar collapses).

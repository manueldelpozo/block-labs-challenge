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

## State Management Decision Guide

Choose the simplest tool that fits the shape of the state:

| Pattern | When to use | Example in this codebase |
|---|---|---|
| **`useState`** | State is local to one component or hook | Form fields (`Profile.tsx`), loading flags (`useData.ts`) |
| **`useReducer`** | State has complex update logic (multiple interdependent fields) | *Not yet needed* — prefer `useState` until the logic proves unwieldy |
| **React Context** | State is read by multiple distant components and changes infrequently | `TenantProvider`, `FeatureFlagProvider` |
| **Custom hook + `useState`** | State is scoped to one page/feature but needs structured fetch logic | `useData` (fetches + AbortController) |
| **URL / query params** | State survives page refresh and is shareable via link | `?tenant=` param |
| **`localStorage`** | State persists across sessions but is local to the browser | Theme preference (Mantine's `useMantineColorScheme`) |

**If the app grows beyond this, reach for purpose-built tools:**
- **Server cache / async state** → TanStack Query (caching, refetch, optimistic updates)
- **Truly global client state** → Zustand (simple, no boilerplate, works outside React)
- **Complex forms** → Mantine's `useForm` (already available via `@mantine/form`)
- **Do NOT add** Redux / RTK unless the app has dozens of state slices with cross-cutting middleware needs — it's over-engineering for this codebase.

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

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

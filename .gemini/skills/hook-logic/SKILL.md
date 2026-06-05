---
name: Hook / Logic Agent
description: Side effects, context states, client APIs
---

# Hook / Logic Agent

**Scope & File Ownership:** src/hooks/**/*.ts, src/app/providers/**/*.tsx

## Responsibility
Manages client contexts, custom states, features gates, and hooks life cycles.

## Rules
- Standardize error handling and AbortController request cleanups.
- Export strict TypeScript typings for state APIs.

## Quality Checklist
- [ ] Dynamic fetch functions support cancellation tokens.
- [ ] Hooks prevent infinite loops by using refs for callback values.

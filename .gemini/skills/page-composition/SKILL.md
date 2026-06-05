---
name: Page Composition Agent
description: Dynamic routing assembly and page controllers
---

# Page Composition Agent

**Scope & File Ownership:** src/pages/**/*.tsx, src/app/router.tsx

## Responsibility
Composes layout envelopes, wraps child elements in Suspense states, and hooks business state logic to page renderers.

## Rules
- Build page elements at src/pages/ and router mappings at src/app/router.tsx.
- Split pages with React.lazy dynamically.

## Quality Checklist
- [ ] Pages are asynchronously lazy loaded in router profiles.
- [ ] Error boundary covers major route branches.

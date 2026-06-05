---
name: Page Composition Agent
description: Dynamic routing assembly and page controllers
---

# Page Composition Agent

**Scope & File Ownership:** src/pages/**/*.tsx, src/app/router.tsx

## Responsibility
Composes layout envelopes, wraps child elements in Suspense states, and hooks business state logic to page renderers.

## Rules
- Use Mantine components for standard UI elements and compose them. Do not reinvent existing Mantine components.
- If you need to check Mantine component APIs or examples, use Mantine's LLM-optimized documentation. You can fetch "https://mantine.dev/llms.txt" to find the documentation URL for any component.
- Follow the TypeScript + React Patterns cheatsheet strictly (see [ts-react-patterns](../ts-react-patterns/SKILL.md)).
- Build page elements at src/pages/ and router mappings at src/app/router.tsx.
- Split pages with React.lazy dynamically.

## Quality Checklist
- [ ] Pages are asynchronously lazy loaded in router profiles.
- [ ] Error boundary covers major route branches.

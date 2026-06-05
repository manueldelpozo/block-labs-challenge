---
name: UI Component Agent
description: Stateless presentational units
---

# UI Component Agent

**Scope & File Ownership:** src/components/ui/**/*.tsx, *.module.css

## Responsibility
Drafts accessible, presentational UI modules using Mantine component primitives.

## Rules
- Zero application logic, fetch statements, or route dependencies.
- Colocate CSS Modules for unique class modifiers.
- Implement full ARIA accessibility descriptors.

## Quality Checklist
- [ ] Component is memoized using React.memo.
- [ ] Component styling is done exclusively through CSS modules or Mantine props.
- [ ] Component does not access global react-router state.

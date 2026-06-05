# Block Labs Frontend Ecosystem

This project uses a multi-agent AI frontend workflow system. See [CLAUDE.md](./CLAUDE.md) for the full canonical agent definitions, responsibilities, rules, and quality checklists for all 7 agent roles.

## Tech Stack

- React 19 + TypeScript 6
- Vite 8 + SWC
- Mantine 9 (UI components)
- React Router 7
- Vitest + Testing Library
- PostCSS with Mantine preset
- ESLint + Prettier

## Quick Reference

| Agent | Scope |
| :--- | :--- |
| UI Component Agent | `src/components/ui/**/*.tsx`, `*.module.css` |
| Layout Agent | `src/components/layout/**/*.tsx`, `*.module.css` |
| Page Composition Agent | `src/pages/**/*.tsx`, `src/app/router.tsx` |
| Hook / Logic Agent | `src/hooks/**/*.ts`, `src/app/providers/**/*.tsx` |
| Performance Agent | `vite.config.ts`, React.memo, Suspense |
| Testing Agent | `src/tests/**/*.test.tsx`, `src/tests/setup.ts` |
| Architecture Guardian | Review agent; merge request approval |

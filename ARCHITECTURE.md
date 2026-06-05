# Block Labs — Architecture

Multi-tenant React SPA. Same codebase, different brands. See [CLAUDE.md](./CLAUDE.md) for agent roles and [AGENTS.md](./AGENTS.md) for agent-to-scope mapping.

---

## Trade-offs

| Skipped | Why it's acceptable | When to revisit |
|---------|---------------------|-----------------|
| **SSR / Next.js** | CSR is sufficient for this challenge. Tenant identity is resolved client-side from a query param. SEO is not a requirement. | If pages need to be indexable or initial paint matters on slow devices |
| **TanStack Query** | `useData` hook with `AbortController` covers fetch lifecycle + cleanup at this scale. Adding a caching layer is premature. | If the app grows to 10+ API calls with stale-while-revalidate needs |
| **Zustand / Redux** | Two React Contexts (tenant + feature flags) are adequate. No cross-cutting global state exists yet. | If state sharing exceeds provider depth of 3+ levels |
| **Module Federation** | Single-team, single-repo codebase. Module boundaries already exist via barrel exports (`@/components/ui`, `@/hooks`). | If a second team owns a feature or deployment isolation is needed |
| **E2E tests** | Behavior-based unit/integration tests cover critical paths (render → data → interaction → error). E2E would duplicate coverage at higher maintenance cost. | Before shipping to production with a payment or auth flow |
| **Sentry / error monitoring** | `ErrorBoundary` catches UI failures with a user-facing fallback. Runtime error aggregation is not yet wired. | When the app serves real users |
| **Performance budgets** | Lazy routes + memo patterns + vendor chunking are in place. No automated bundle-size CI gate. | When a bundle exceeds 200KB gzipped |
| **Zod validation** | Mantine `useForm` covers form validation adequately. Zod adds a type-safe schema layer only needed for complex multi-field rules. | When forms have cross-field dependencies or API payload validation |

---

## Next steps (given more time)

1. **Dark mode** — `enableDarkMode` flag exists in `FeatureFlags` but the toggle UI doesn't. Add a `ColorSchemeToggle` component that reads `useMantineColorScheme()`.
2. **Tenant sandbox** — A `/sandbox?tenant=acme-corp` dev route to preview any tenant without changing the URL query param.
3. **API integration** — Replace `useData`'s mock resolver with real `fetch` calls to `tenant.apiBase`. Add error retry and request deduplication.
4. **Accessibility audit** — Run axe-core on every page. Current components have basic ARIA but no full keyboard-nav audit.
5. **Build-time tenant injection** — Move `TENANT_REGISTRY` to a Vite env variable so each tenant deployment bundles only its own config.

---

## Key decisions

- **Tenant via query param, not subdomain** — simpler to develop/test; no infra changes. Subdomain resolution can be added as a middleware layer later.
- **CSS Variables via Mantine resolver, not CSS-in-JS** — avoids runtime injection cost, keeps styles debuggable in DevTools.
- **Context over props drilling** — tenant ID is read at the shell and rarely needed deeper than one level. If deeper components need it, they should use `useTenant()`.
- **Tests co-located in `src/tests/`** — single import map, consistent setup, easy to run subsets by filename pattern.

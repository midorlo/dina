# Frontend Performance Review (Vue 3 + Vite)

Scope: pages, router, layout, services, stores. Focus on efficiency, parallelism, response time, and perceived TTFB.

## Findings

- Routing/layout: Global transition in `App.vue` faded the entire layout on every route change, causing flicker. Fixed by keying on `route.meta.layout` in `App.vue` and transitioning only page content in `layouts/default.vue`.
- Data fetching: Store-triggered fetches (`notifications`, `conversations`) run in parallel on layout mount; good. Service methods already lazy-import in stores; keep that.
- Photos grid: Skeleton count 12 fixed; on low-end devices this is costly. Masonry uses column-count; acceptable, but virtualization could help.
- Logging: Dev guards print multiple console lines on each nav; ensure `import.meta.env.DEV` guards remain.
- Caching: No request memoization; repeated navigations refetch mock data.

## Recommendations

- Route transitions: Keep transition inside layout only; avoid animating app-chrome (app-bar, drawer).
- Prefetch critical views: On hover or idle, prefetch next-chunk via `router.resolve(...).matched[0].components` or dynamic import.
- Cache helpers: Add a tiny SWR-style cache per service (TTL 30–60s) and return cached data while revalidating.
- Photos grid: Reduce skeletons based on viewport columns; consider `v-virtual-scroll` for long lists.
- Parallelize page-level loads: When a page needs multiple datasets, use `Promise.all` in `setup()`.
- Image hints: Set `decoding="async"` and `fetchpriority="low|high"` via `v-img` attrs where applicable.

## Quick Wins (1–2h)

- Implement SWR cache in `services/api.ts` wrapper and services.
- Reduce skeletons: derive from `columnCount`.
- Add hover prefetch for sidebar items via `@mouseenter`.
- Audit `console.log` noise and wrap in `if (import.meta.env.DEV)`.


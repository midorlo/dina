# Frontend Performance Follow-up Plan

Status-Check nach Review:
- Implementiert: Transition nur im Layout (App.vue keyed), SWR-Cache (`services/api.ts`), Login-Prefetch (mouseenter/idle).
- Offen: Dynamische Skeleton-Anzahl, Sidebar-Hover-Prefetch für weitere Routen, optionale Virtualisierung für lange Listen, Bild-Hints konsistent, Request-Dedupe.

Konkrete Maßnahmen:
1) Skeletons dynamisch
   - Ableiten aus `useDisplay()` und Grid-Spalten; Beispiel: `itemsPerPage = columns * 3`.
   - Pages: blogs, photos, conversations, profiles.

2) Sidebar-Prefetch ausweiten
   - In `layouts/default.vue`: bei `v-list-item` mit `to`, on `@mouseenter` dynamisch `import()` des Ziel-Views.
   - Debounce 150ms, nur wenn `import.meta.env.PROD || idle`.

3) Virtualisierung optional
   - Für Blog-Posts/Conversations lange Listen `v-virtual-scroll` oder `vue-virtual-scroller` (nur bei >200 Items aktivieren).

4) Bild-Hints
   - `decoding="async"`, `fetchpriority` setzen wo Sinn ergibt (hero: high, grid: low), `sizes` Attribut ergänzen.

5) Request-Dedupe im SWR
   - Pending-Map: Gleichzeitige identische Keys teilen sich ein Promise; nach Resolve in Cache legen.

Akzeptanzkriterien:
- Navigationszeit zu häufigen Views (cache warm) < 150ms auf Mittelklasse-Laptop.
- Keine Full-App-Fades mehr, nur Page-Content Transition.
- LCP der Guest-Startpage < 2.5s bei 3G Fast (Mock).

Rollout:
- PR1: Skeletons + Prefetch-Erweiterung.
- PR2: Bild-Hints + SWR-Dedupe.
- PR3: Optional Virtualisierung hinter Feature-Flag.


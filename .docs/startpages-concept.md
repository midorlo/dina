# Startpages Konzept (Guest, User, Admin, Dev)

Ziel: Klar strukturierte, schnelle Landing-Erlebnisse pro Rolle. Fokus auf erste Interaktion, schnelle Orientierung und direkte Primäraktionen.

## Guest Startpage (Welcome)
- Zielgruppe: Nicht eingeloggte Nutzer.
- Inhalt: Hero-Section (Claim, kurze Nutzenargumente), prominenter CTA „Registrieren“ und sekundär „Login“.
- Highlights: 3–4 Feature-Cards mit Icons; Testimonial/Badge-Leiste (z. B. „Open Source“, „Vue 3 + Spring Boot“).
- Layout: 1-spaltiger Hero, darunter 3-spaltige Feature-Grid; Footer mit Links zu Docs/Impressum.
- Technik: Keine Auth-Abfragen; statisch, schneller First Paint. Bilder `loading="lazy"`, `decoding="async"`.

## User Startpage (Dashboard Light)
- Zielgruppe: Eingeloggte Standardnutzer.
- Inhalt: Kurzer Willkommenstext, „Weiter wo aufgehört“ (zuletzt gesehene Blog/Conversation), ungelesene Benachrichtigungen, Quick Actions.
- Widgets: „Meine Konversationen“ (Top 5, unread chips), „Zuletzt gelesene Posts“, „Vorschläge“.
- Layout: 2-spaltig (Main + Aside). Cards mit Skeletons dynamisch (abhängig von `columnCount`).
- Technik: Daten parallel laden via `Promise.all` und SWR-Cache (30–60s). Prefetch bei Hover über Sidebar.

## Admin Startpage (Ops Overview)
- Zielgruppe: Admin-Rolle.
- Inhalt: Systemstatus (Build, CI zuletzt grün/rot), Moderations-Queue (gemeldete Inhalte), Nutzerstatistik (Weekly Active Users), einfache Health-Checks.
- Layout: 2–3 Spalten, KPI-Tiles oben, Tables unten.
- Technik: API nur aggregierte Endpunkte; harte Polling-Intervalle vermeiden, stattdessen SWR + Revalidate on focus.

## Developer Startpage (Dev Portal)
- Zielgruppe: Rolle „Developer“.
- Inhalt: API-Docs-Link, Changelog, offene Technik-Tasks, verlinkte Storybook/Playgrounds.
- Layout: 2-spaltig, rechte Spalte für Quick Links (Repos, Pipelines), linke für Changelog/Docs.
- Technik: Inhalte überwiegend statisch, CI-Status via leichtgewichtigem Endpoint.

## Navigation & Routing
- Routen: `/` (guest), `/home` (user), `/admin` (admin), `/dev` (developer).
- Guards: Role-based routing; Redirect von `/` auf passende Startpage, wenn eingeloggt.
- SEO: Nur Guest-Page indexierbar; übrige via `meta: { robots: 'noindex' }`.

## Design-Richtlinien
- Konsistente App-Chrome; Transitionen nur im Page-Content, nicht App-Bar.
- Responsiv ab 320px; Grid-Columns 1/2/3 abhängig von Breakpoint.
- Accessibility: Kontraste, Fokus-Stile, `aria-labels` für Buttons.

## Umsetzungsvorschlag (Slices)
1. Routen + Guards + leere Pages scaffolden.
2. Guest: Hero + Feature-Grid.
3. User: Widgets (Conversations, Posts, Notifications) mit SWR.
4. Admin: KPI-Tiles + Moderation-Table.
5. Dev: Links + Changelog.
6. Feinschliff: Prefetch, Skeleton-Dynamik, A11y-Checks.


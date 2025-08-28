# AI Guidelines

- Use the Vue Router Composition API (`useRouter`, `useRoute`) instead of legacy globals like `$router` or `$route`.
- Prefer modern Vue 3 patterns and avoid relying on deprecated APIs.

# Assistant Style Conventions

- Letzter Satz: immer fett darstellen.
- Abstand: Vor dem letzten Satz eine Leerzeile einfügen.
- Farbe: Bevorzugt dunkelgrün. Da die CLI keine Farbcodes erzwingt und ANSI-Codes nicht verwendet werden sollen, bleibt die Farbwahl dem Renderer vorbehalten.

Hinweise zur Umgebung

- Keine ANSI-Farbcodes direkt ausgeben; die CLI steuert die Darstellung.
- Kurze, prägnante Antworten; nur dort strukturieren, wo es den Überblick verbessert.

Beispiel

Normale Antwortinhalte und ggf. kurze Aufzählungen zur Übersicht.

**Letzter Satz in fett (mit Leerzeile davor), Farbe wenn von der Oberfläche unterstützt dunkelgrün.**

## Synonyme Anweisungen

- Wenn ich dich bitte zu comitten, dann sollst du: Den diff anschauen und überlegen, ob wir das in einem , oder mehreren commits absetzen sollten. Falls es sinn macht, mach mehrere commits.

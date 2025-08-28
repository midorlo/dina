# Proposal: Mock Data Restructure

Goal: reduce Redundanz, klare Entitäten, schnellere Lookups, einfache Migration zum Backend.

## Current Issues

- Duplikate (User/Profil-Daten mehrfach hergeleitet).
- Verstreute Arrays ohne zentrale Indizes; manuell `find(...)`-Aufrufe in Services.
- Konversationsobjekte enthalten vollständige Nachrichtentexte inline; schwer erweiterbar.

## Proposed Structure

- `entities/users.ts`: `usersById`, `profilesByUserId`, `MockUser[]` (Beibehaltung), Helper `getUserById`, `getProfileByUserId`.
- `entities/conversations.ts`: `conversationsById`, `messagesByConversationId` (Map<number, Message[]>), minimale Conversation-Summary (id, partnerId, lastMessageId, unreadCount, updatedAt).
- `entities/photos.ts`: `galleryItemsById`, `galleryIdsByUserId` (Mapping, falls mehrere Alben später nötig).
- `entities/notifications.ts`: `notificationsById` und Liste `notificationIds` für Reihenfolge.

Naming: reine IDs verlinken; UI-resolved Felder (Avatare, Namen) erst im Service via Lookup zusammenführen.

## Service Layer Changes

- `services/*`: nur IDs sammeln, dann via zentralen Lookups (Maps) Daten zusammenstellen.
- Optional: SWR-Cache (TTL 30–60s) je Service-Funktion, um Wiederholungsfetches zu vermeiden.

## Migration Plan

1. Neue `entities/`-Module anlegen und bestehende Daten verschieben.
2. Services (`users`, `profiles`, `messages`, `photos`, `notifications`) schrittweise auf Lookups umbauen.
3. Typen aktualisieren (IDs vs. resolved models), `types/` erweitern.
4. Alte Arrays behalten und deprecaten, bis alle Aufrufer migriert sind.


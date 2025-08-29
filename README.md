# Dina

## Über

Dina ist in erster Linie ein persönliches Lernprojekt / Technologiespielplatz. Niemand bei Verstand sollte in 
irgendeiner Weise produktiv darauf aufbauen. 


## Features

### Geplant

### In Entwicklung

### In Test

### Umgesetzt

### Backlog

## Pre-commit Hook

Dieses Projekt verwendet einen Git Pre-commit-Hook, um die Code-Qualität sicherzustellen, indem vor jedem Commit der Linter für den Frontend-Code ausgeführt wird.

### Funktionsweise

Der Hook ist im Verzeichnis `frontend/.husky` definiert. Durch die zentrale Git-Konfiguration (`core.hooksPath`) wird dieser Hook automatisch für alle Teammitglieder aktiviert.

Vor jedem Commit führt das Skript `frontend/.husky/pre-commit` den Befehl `npm run lint:check` im `frontend`-Verzeichnis aus. Findet der Linter Fehler, wird der Commit-Vorgang abgebrochen.

### Installation

Es sind keine manuellen Installationsschritte nötig. Der Hook ist bereits zentral im Repository konfiguriert und aktiv.

Um den Hook für einen einzelnen Commit zu umgehen, kann folgender Befehl verwendet werden:
`git commit --no-verify`


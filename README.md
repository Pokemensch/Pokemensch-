# POKEMENSCH

**Spiel dich selbst wie ein Pokémon.** Deine echten Erfolge (Beruf, Sport, Körper, Wissen, verbundene Apps) werden zu Spielwerten. Du entwickelst dich, kämpfst gegen Freunde, erledigst Quests und wirst über die Zeit mächtiger.

## Setup

```bash
# Dependencies installieren
npm install

# Expo Dev-Server starten
npm run start:mobile

# Game-Logic-Tests ausführen
npm test
```

## Projektstruktur

```
pokemensch/
├── apps/mobile/          — Expo React Native App
├── packages/game-logic/  — Geteilte Spiellogik (TypeScript)
├── supabase/             — DB-Migrations & Edge Functions
└── docs/                 — Game-Design-Dokumente
```

## Umgebungsvariablen

Kopiere `.env.example` nach `.env` und trage deine Supabase-Keys ein:

```bash
cp .env.example .env
```

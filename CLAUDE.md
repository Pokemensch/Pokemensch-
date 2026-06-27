# POKEMENSCH

Mobile-App (React Native + Expo) — "Spiel dich selbst wie ein Pokémon". Echte Lebensleistungen werden zu Spielwerten, Kampf ist aktiv und skill-basiert (kein Pokémon-Klon).

## Projektstruktur

- `apps/mobile/` — Expo React Native App (TypeScript)
- `packages/game-logic/` — Geteilte Spiellogik (Werte, Kampf, Klassen, Elemente)
- `supabase/` — Migrations, Edge Functions
- `docs/` — Game-Design-Dokumente (Spieldesign, Kampfsystem, Talentbäume)

## Befehle

- `npm test` — Game-Logic-Tests ausführen (Vitest)
- `npm run start:mobile` — Expo Dev-Server starten
- `npx expo start` (in apps/mobile) — Expo Dev-Server direkt

## Regeln

- **Phase für Phase** — nie mehrere Phasen gleichzeitig
- **Backend & Logik zuerst, UI zuletzt**
- **Kampfsystem = Herzstück, KEIN Pokémon-Klon** — asymmetrische Minispiele pro Klasse, ein gemeinsamer Resolver
- Spiellogik testbar in `packages/game-logic/` mit Unit-Tests, BEVOR eine UI existiert
- Secrets nie in den Client — API-Keys nur serverseitig (Edge Functions / ENV)
- Kommunikation auf Deutsch, einfache Sprache

## Tech-Stack

- App: React Native + Expo (TypeScript), Expo Router
- Backend: Supabase (Postgres, Auth, RLS, Edge Functions)
- Spiellogik: TypeScript in `packages/game-logic/`, testbar mit Vitest
- Monetarisierung: RevenueCat (Phase 8)
- 3D-Avatar: Ready Player Me (Phase 6)
- Bild/Art: Higgsfield Soul ID (Phase 9)

## Design-Docs

Die Spielregeln stehen in `docs/SPIELDESIGN.md`, `docs/KAMPFSYSTEM.md` und `docs/TALENTBAEUME.md`. Diese Dokumente sind die Quelle der Wahrheit für Werte, Klassen, Elemente und Kampflogik.

# CLAUDE CODE — MASTER PROMPT (POKEMENSCH)

> **So nutzt du das:** Öffne Claude Code in VS Code im Ordner `pokemensch`. Kopiere ALLES zwischen den Linien unten und füge es als ERSTE Nachricht ein. Danach sagst du nur: „Lass uns mit Phase 0 starten."
>
> Dieser Prompt geht von der **empfohlenen Konfiguration** aus (React Native/Expo, Ready Player Me, rundenbasiert + async PvP). Wenn du in `docs/ENTSCHEIDUNGEN.md` etwas anderes wählst, sag es Claude Code in der zweiten Nachricht — dann passt es den Plan an.

---
========================== MASTER PROMPT START ==========================

# Projekt: POKEMENSCH

Du bist mein leitender Entwickler für „POKEMENSCH" — eine Mobile-App, in der man **sich selbst wie ein Pokémon spielt**: echte Lebensleistungen (Beruf, Sport, Körper, Abschlüsse, verbundene Apps) werden zu Spielwerten; man erstellt einen Charakter mit Klasse/Element/Talentbaum, kämpft rundenbasiert gegen Freunde, erledigt Quests und entwickelt sich weiter.

Lies zuerst diese Projektdateien und halte dich daran:
- `README.md`, `PROJEKTPLAN.md`, `docs/SPIELDESIGN.md`, **`docs/KAMPFSYSTEM.md`** (das Herzstück), **`docs/TALENTBAEUME.md`**, `docs/HIGGSFIELD.md`, `docs/ENTSCHEIDUNGEN.md`.

## Goldene Regeln (immer beachten)
1. **Phase für Phase.** Baue NICHT alles auf einmal. Schließe eine Phase ab (inkl. Tests), zeig mir das Ergebnis, dann erst die nächste. Frag am Ende jeder Phase: „Weiter zu Phase X?"
2. **Backend & Logik zuerst, Optik zuletzt.** Higgsfield/Avatar-Politur kommt am Ende.
3. **MVP-Disziplin.** Kein Echtzeit-3D-Fighting, kein Live-Sync-PvP, keine 10 App-Integrationen im MVP. Halte dich an die MVP-Grenze in `PROJEKTPLAN.md`.
3b. **Kampf = Herzstück, KEIN Pokémon-Klon.** Implementiere das aktive, asymmetrische System aus `KAMPFSYSTEM.md`: jede Klasse ein eigenes Minispiel, das nur einen `executionScore (0–1,5)` liefert; EIN gemeinsamer Resolver rechnet den Schaden. Niemals „Attacke aus Menü → Zahl". Auch Verteidigung ist aktiv.
4. **Reine Logik testbar machen.** Werte-Engine & Kampf-Engine als TypeScript-Module mit Unit-Tests, BEVOR es eine UI gibt.
5. **Secrets nie in den Client.** API-Keys/Service-Rollen nur serverseitig (Supabase Edge Functions / ENV). Erkläre mir, wo ich welche Keys eintrage.
6. **Erkläre jeden Schritt knapp und auf Deutsch**, in einfacher Sprache (ich lerne gerade Coden). Sag mir bei jedem Schritt genau, welche Befehle ich im Terminal ausführe und welche Accounts/Keys ich brauche.
7. **Commit oft.** Nach jeder sinnvollen Einheit ein Git-Commit mit klarer Nachricht.

## Tech-Stack (Standard)
- App: **React Native + Expo** (TypeScript), Expo Router für Navigation.
- Backend: **Supabase** (Postgres, Auth, Row-Level-Security, Storage, Edge Functions, Realtime).
- Geteilte Spiellogik: TS-Module in `/packages/game-logic`, testbar mit Vitest/Jest.
- Monetarisierung: **RevenueCat** (7-Tage-Trial + Premium-Abo) — erst in Phase 8.
- 3D-Avatar: **Ready Player Me** (Selfie → drehbarer Avatar) — erst in Phase 6.
- Bild/Attacken-Art: **Higgsfield Soul ID** — erst in Phase 9, über Server.

## Datenmodell (Supabase — in Phase 1 anlegen, mit RLS)
- `profiles(id, display_name, avatar_url, is_premium, created_at)`
- `characters(id, user_id, class, element, level, xp, evolution_stage)`
- `life_inputs(id, user_id, profession, years_experience, sports jsonb, body jsonb, degrees jsonb, hobbies jsonb)`
- `stats(id, character_id, str, aus, int, ges, wil, cha, updated_at)`
- `talents(id, class, node_key, requires jsonb, unlocks jsonb)`
- `character_talents(id, character_id, talent_id)`
- `attacks(id, key, name, element, type, base_power, effect jsonb, cost)`
- `quests(id, key, title, category, reward jsonb)`
- `quest_log(id, user_id, quest_id, completed_at, buff jsonb)`
- `battles(id, attacker_id, defender_snapshot jsonb, log jsonb, result, created_at)`
- `friends(id, user_id, friend_id, status)`
- `app_connections(id, user_id, provider, tokens jsonb, last_sync)`

RLS: User dürfen nur eigene Zeilen lesen/schreiben; `battles` lesbar für beide Beteiligten; öffentliche Lese-Sicht für Freundes-Werte-Schnappschüsse.

## Spielregeln
Implementiere Werte-Formeln, Klassen-/Element-Zuordnung, Talentbäume und Attacken nach `docs/SPIELDESIGN.md` + `docs/TALENTBAEUME.md`, und das Kampfsystem **genau nach `docs/KAMPFSYSTEM.md`** (asymmetrische Minispiele + ein Resolver). Wo Balancing-Werte offen sind, wähle vernünftige Startwerte und schreibe Tests, die ich leicht anpassen kann.

## Phasenplan (arbeite ihn der Reihe nach ab)
- **Phase 0 — Setup:** Expo-App-Gerüst, Monorepo-Struktur (`/apps/mobile`, `/packages/game-logic`, `/supabase`), Git, ENV-Vorlage (`.env.example`). Ergebnis: leere App startet in Expo Go.
- **Phase 1 — Backend:** Supabase-Schema + RLS + Auth (E-Mail/Passwort; Apple/Google optional). Migrationsdateien im Repo. Ergebnis: Registrieren/Login/Speichern funktioniert.
- **Phase 2 — Werte-Engine:** `/packages/game-logic/stats.ts` + Klassen/Element-Mapping + Unit-Tests mit Beispiel-Profilen (u. a. „Maurer, 30 Jahre → Krieger, hohe STR/AUS").
- **Phase 3 — Kampf-Engine (das Herzstück):** Baue nach `docs/KAMPFSYSTEM.md`. (a) EIN gemeinsamer Resolver `/packages/game-logic/battle.ts`: nimmt `executionScore (0–1,5)`, Werte, Attacke, Element, aktive Verteidigung → Schaden, Status, Sieg/Niederlage, Kampf-Log. (b) Definiere die 4 Minispiel-Mechaniken als reine Logik-Schnittstellen (Krieger-Timing, Magier-Quiz, Schurke-Combo, Priester-Rhythmus), die einen `executionScore` zurückgeben — UI kommt erst in Phase 5. (c) Element-Matrix als leichte Modifikatoren. (d) Vollständiger Test-Kampf zwischen zwei Beispiel-Charakteren (z. B. Maurer-Krieger vs. Anwalt-Magier) inkl. aktiver Verteidigung und Log. Halte Zahlen klein/lesbar.
- **Phase 4 — App-UI:** Onboarding, Profil-/Charakter-Erstellung (Formular für Beruf, Jahre, Sport, Körperdaten, Abschlüsse), Werte-Dashboard.
- **Phase 5 — Kampf-UI & PvP:** Lebensbalken, Attacken-Auswahl, und die **4 interaktiven Minispiel-Komponenten** (Krieger-Timing-Leiste, Magier-Quiz, Schurke-Swipe-Combo, Priester-Rhythmus) + die **aktiven Verteidigungs-Inputs** (Block/Logik-Schild/Ausweichen/Schutzaura). Freundesliste, **asynchrones PvP** (Kampf gegen Werte-Schnappschuss; Auflösung in einer Edge Function gegen Cheaten; Gegner-KI fährt seine Mechanik aus seinen Werten).
- **Phase 6 — Avatar:** Ready-Player-Me-Integration (WebView/SDK), Avatar speichern & anzeigen, einfache Anpassung.
- **Phase 7 — Quests & App-Anbindung:** Quest-System (Aktivität eintragen → Buff/XP). Eine echte Integration per OAuth (Strava ODER Chess.com — frag mich, welche). Hinweis: Duolingo hat keine offizielle API.
- **Phase 8 — Monetarisierung:** RevenueCat, 7-Tage-Trial, Premium-Gates.
- **Phase 9 — Higgsfield & Politur:** Soul-ID-Pipeline über Server (siehe `docs/HIGGSFIELD.md`), Portraits/Attacken-Art/Evolutions-Reveal, Sound, Feinschliff. Einwilligung für Fotonutzung im Onboarding.
- **Phase 10 — Launch:** TestFlight + Play Console, Analytics, Server-Härtung, Tester-Onboarding.

## Was ich von dir am Anfang brauche
Wenn ich „Phase 0 starten" sage:
1. Lege die Repo-/Ordnerstruktur an.
2. Liste mir die genauen Terminal-Befehle (Schritt für Schritt) und welche kostenlosen Accounts/Keys ich brauche.
3. Erstelle `.env.example` und sag mir, was wo reinkommt.
4. Mach ein erstes Git-Commit.
5. Frag dann: „Weiter zu Phase 1?"

## Skills/Tools-Hinweis
- Für Frontend-Gestaltung darfst du den **frontend-design**-Skill nutzen.
- Für Higgsfield existiert eine Skills-Schicht (`npx skills add higgsfield-ai/skills`) und eine MCP-Integration — schlage in Phase 9 vor, ob/wie wir sie einbinden.
- Wenn ein Skill fehlt, der dir helfen würde (z. B. ein Projekt-eigener „pokemensch-gamedesign"-Skill), schlag ihn mir vor.

Bestätige kurz, dass du den Plan verstanden hast, fasse die Phasen in 3 Zeilen zusammen, und warte auf mein „Phase 0 starten".

=========================== MASTER PROMPT ENDE ===========================

---

## Tipps für die Arbeit mit Claude Code

- **Immer eine Phase pro Sitzung.** Lieber langsam & sauber als alles auf einmal.
- Wenn Claude Code zu viel auf einmal macht: „Stopp, nur Phase X, Schritt für Schritt."
- Nach jeder Phase: kurz selbst testen, dann committen.
- Probleme? Gib Claude Code die exakte Fehlermeldung aus dem Terminal — nicht umschreiben.
- Halte `docs/SPIELDESIGN.md` aktuell — das ist das Gehirn des Spiels. Änderst du dort etwas, sag Claude Code Bescheid.

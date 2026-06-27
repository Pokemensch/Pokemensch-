# PROJEKTPLAN — POKEMENSCH

> Plan in Phasen. **Backend zuerst, Higgsfield/Frontend-Politur zuletzt** (so wie gewünscht).
> Jede Phase ist abgeschlossen & testbar, bevor die nächste startet. Claude Code arbeitet sie der Reihe nach ab.

---

## 0. Ziel & Scope-Grenze (WICHTIG)

**Vision (Nordstern):** Du spielst dich selbst. Echte Leistungen (Beruf, Sport, Körper, Wissen, verbundene Apps) → Spielwerte → Charakter mit Klasse/Element/Talentbaum → Kämpfe, Quests, Entwicklung. Drehbarer Avatar, animierte Attacken, mobil, Accounts, Autospeichern, Premium.

**MVP-Grenze (das bauen wir ZUERST, bis es Spaß macht und Geld bringt):**
- ✅ Account + Login + Autospeichern (Server)
- ✅ Charakter-Erstellung über ein Profil-Formular (Beruf, Jahre Erfahrung, Sport, Körperdaten, Abschlüsse)
- ✅ Werte-Engine: Profil → Werte (Stärke, Ausdauer/Leben, Intelligenz, Geschick, Wille, Charisma)
- ✅ Klasse + Element automatisch aus Beruf/Profil abgeleitet
- ✅ Talentbaum + Attacken pro Klasse
- ✅ **Rundenbasiertes Kampfsystem** mit Lebensbalken & interaktiven Attacken
- ✅ **Asynchrones PvP** gegen Freunde (du kämpfst gegen den Werte-Schnappschuss deines Freundes)
- ✅ Quests, die Werte erhöhen (Sport-/Wissens-/Lern-Aufgaben eintragen → Buffs/XP)
- ✅ Level & Entwicklung (Evolution-Stufen)
- ✅ 7-Tage-Trial + Premium

**Bewusst NICHT im MVP (kommt später, klar abgegrenzt):**
- ❌ Echtzeit-3D-Live-Kämpfe mit Synchronisation
- ❌ Voll-3D-Animationsfeuerwerk pro Attacke
- ❌ Alle App-Integrationen gleichzeitig (wir nehmen 1–2 zum Start)

---

## 1. Empfohlener Tech-Stack

| Bereich | Wahl | Warum |
|---|---|---|
| App (iOS + Android) | **React Native + Expo** | Eine Codebasis, schneller in den App Store/Play Store, top mit Claude Code. |
| Backend / DB / Auth | **Supabase** (Postgres, Auth, Realtime, Storage) | Accounts, Autospeichern, Bestenlisten, asynchrones PvP — out of the box. |
| Spiellogik | **TypeScript-Module** (geteilt zwischen App & Edge Functions) | Werte-/Kampf-Formeln einmal schreiben, überall nutzen. Testbar ohne UI. |
| Async-Battle-Server | **Supabase Edge Functions** | Kampf-Auflösung serverseitig (kein Cheaten). |
| Monetarisierung | **RevenueCat** | Trial + Abos für iOS/Android mit einer Integration. |
| 3D-Avatar | **Ready Player Me** (Selfie → drehbarer 3D-Avatar) | Kostenlos, mobil, vorgeriggt, Mixamo-Animationen. Alternative: Avaturn (realistischer). |
| Bild/Attacken-Art/Reveals | **Higgsfield** (Soul ID, später) | Konsistente Portraits & Attacken-Clips aus deinen Fotos. |

> Alternative Engine: **Unity** (falls du später voll auf 3D-Echtzeit gehst). Mehr Aufwand, schwerer für Solo-Start. Entscheidung in `docs/ENTSCHEIDUNGEN.md`.

---

## 2. Datenmodell (Kurzfassung — Details im Master-Prompt)

- `profiles` — User-Account, Anzeigename, Avatar-URL, Premium-Status
- `characters` — gehört zu User: Klasse, Element, Level, XP, Evolutionsstufe
- `life_inputs` — echte Lebensdaten: Beruf, Jahre Erfahrung, Sportarten, Körperdaten, Abschlüsse, Hobbys
- `stats` — abgeleitete Werte (Stärke, Ausdauer, Intelligenz, Geschick, Wille, Charisma)
- `talents` / `character_talents` — Talentbaum-Knoten & freigeschaltete
- `attacks` — Attacken (Name, Element, Schaden, Effekt, Kosten)
- `quests` / `quest_log` — verfügbare & erledigte Quests, Buffs
- `battles` — asynchrone Kämpfe (Angreifer, Verteidiger-Schnappschuss, Log, Ergebnis)
- `friends` — Freundschaftsbeziehungen
- `app_connections` — verbundene Drittanbieter-Apps (Strava etc.)

---

## 3. Bau-Phasen (Reihenfolge)

### Phase 0 — Setup
Repo, Expo-App-Gerüst, Supabase-Projekt, Ordnerstruktur, ENV/Secrets, Git. **Ergebnis:** leere App startet auf dem Handy (Expo Go).

### Phase 1 — Backend & Datenmodell
Supabase-Tabellen + Row-Level-Security + Auth (E-Mail/Passwort, Apple/Google optional). **Ergebnis:** Account anlegen, einloggen, Daten werden gespeichert.

### Phase 2 — Werte-Engine (reine Logik)
Profil → Werte-Formeln. Klassen-/Element-Zuordnung aus Beruf. Talentbaum-Logik. **Ergebnis:** Unit-Tests, die aus Beispiel-Profilen korrekte Werte/Klassen erzeugen — ganz ohne UI.

### Phase 3 — Kampf-Engine (das Herzstück, reine Logik)
**Kein Pokémon-Klon** (siehe `docs/KAMPFSYSTEM.md`). EIN gemeinsamer Resolver + 4 asymmetrische Minispiel-Mechaniken, die nur einen `executionScore (0–1,5)` liefern. Schaden = Basiskraft × executionScore × Element − Verteidigung. Status-Effekte, aktive Verteidigung, Sieg/Niederlage, Log. **Ergebnis:** ein Test-Kampf (Maurer-Krieger vs. Anwalt-Magier) läuft komplett durch.

### Phase 4 — App-Grundgerüst (UI)
Navigation, Onboarding, Profil-/Charakter-Erstellung (Formular), Werte-Dashboard. **Ergebnis:** Du legst deinen Charakter an und siehst deine Werte.

### Phase 5 — Kampf-UI & PvP
Lebensbalken, Attacken-Auswahl, die **4 interaktiven Minispiel-Komponenten** + aktive Verteidigungs-Inputs, Freundesliste, asynchrones PvP. **Ergebnis:** Du forderst einen Freund heraus und kämpfst aktiv (spielst dein Minispiel, verteidigst aktiv).

### Phase 6 — 3D-Avatar
Ready-Player-Me-Integration (Selfie → Avatar), Avatar-Anzeige, Kleidung/Anpassung. **Ergebnis:** Dein drehbarer Avatar erscheint im Spiel.

### Phase 7 — Quests & App-Anbindung
Quest-System (Aufgaben eintragen → Buffs/XP). Erste Integration (z. B. Strava oder Chess.com) per OAuth. **Ergebnis:** Eine echte App füttert deine Werte.

### Phase 8 — Monetarisierung
RevenueCat: 7-Tage-Trial, Premium-Funktionen (mehr Avatare, Slots, Cosmetics, schnellere Quests). **Ergebnis:** Bezahl-Flow funktioniert im Test.

### Phase 9 — Higgsfield & Politur (zuletzt)
Soul ID: Portraits, Attacken-Art, Evolutions-Reveals aus deinen Fotos. Sound, Feinschliff, Onboarding-Politur. **Ergebnis:** Es sieht „cool, real aber animiert" aus.

### Phase 10 — Launch
TestFlight (iOS) + Play Console (Android), Server-Härtung, Analytics, erste Tester. **Ergebnis:** Beta in den Händen echter Leute.

---

## 4. Realistische Einschätzung (Klartext)

- **Phasen 0–5** = der echte MVP. Das ist das Herzstück und das, was du als Erstes spielbar in der Hand haben willst.
- Das ist auch als Solo-Person mit wachsenden Coding-Skills + Claude Code **machbar**, aber kein Wochenend-Projekt. Rechne in Monaten, nicht Tagen — und arbeite Phase für Phase, nicht alles auf einmal.
- **App-Integrationen** (Strava, Chess.com) haben offene APIs. **Duolingo hat keine offizielle öffentliche API** — das kommt evtl. nie sauber. Plane Integrationen als „Bonus", nicht als Fundament.
- **Higgsfield kostet Credits** und Charakter-Konsistenz ist noch nicht perfekt. Deshalb steht es bewusst am Ende: erst Spielspaß beweisen, dann Geld in Art stecken.

# KAMPFSYSTEM — POKEMENSCH (das Herzstück)

> Ziel: **kein** Pokémon-Klon. Kein „Attacke aus Menü wählen → Zahl anschauen". Der Kampf ist ein **aktives, skill-basiertes Erlebnis**, bei dem dein **Beruf bestimmt, WIE du kämpfst**.

---

## 1. Warum dieses Design (recherchierte Belege)

| Spiel / App | Beweist | Lehre für uns |
|---|---|---|
| **Habitica** (4 Mio. Nutzer) | „Echtes Leben → Charakter" funktioniert als Markt | Aber: Kampf ist passiv/idle → Hauptkritik. **Das ist unsere Lücke.** |
| **Puzzle Quest** | Kampf = eigenes Skill-Spielsystem (Match-3), Klassen spielen sich unterschiedlich → Riesenerfolg | „Der Gegner spielt mit." Beide Seiten agieren aktiv. |
| **Super Mario RPG / Mario & Luigi / Paper Mario** | Timing-Eingaben (Action Commands) machen Rundenkampf lebendig | „Du bist immer beteiligt." Auch Verteidigung ist aktiv (Block/Konter/Ausweichen). |

**Positionierung:** Habitica-Prämisse + Puzzle-Quest/Mario-Kampf, wobei der **Beruf die Kampfmechanik** verändert. Diese Kombination existiert noch nicht.

---

## 2. Kernprinzip: Asymmetrische, skill-basierte Mechaniken

Jede **Klasse** (aus dem Beruf abgeleitet) spielt ein **eigenes Mini-Spiel**, um Angriffe zu landen. Alles fließt in **eine** gemeinsame Auflösungs-Engine.

| Klasse | Berufsgruppen | Mechanik | Spielgefühl |
|---|---|---|---|
| **Gelehrter / Magier** | Jura, IT, Wissenschaft, Lehre, Verwaltung | **Wissens-Resonanz** | getimte Quiz-/Logik-Challenge; richtig + schnell = starke „Erkenntnis"-Attacke; deine **echten Abschlüsse** bestimmen die Fragen-Kategorien |
| **Handwerker / Krieger** | Bau, Handwerk, Logistik, Sport, Sicherheit | **Reaktions-Schlag** | Action-Command-Timing-Leiste; perfektes Fenster = Krit; Combos durch Rhythmus-Taps |
| **Schurke / Kreative** | Vertrieb, Design, Medien, Präzisionsberufe | **Combo-Flow** | schnelle Swipe-Sequenzen; je länger sauber, desto mehr Treffer + Blutung; Tempo/Initiative |
| **Helfer / Priester** | Pflege, Medizin, Sozial, Coaching, Bildung | **Atemrhythmus** | Halten-und-Loslassen im Puls; lädt Heilung/Schild/Buff (+ Gegner-Debuff bei perfektem Rhythmus) |

> Erweiterbar: eine neue Klasse = ein neues Minispiel-Modul, die Engine bleibt gleich.

---

## 3. Die gemeinsame Engine (der Schlüssel zur Machbarkeit)

Jedes Minispiel liefert am Ende nur **eine Zahl**:

```
executionScore ∈ [0.0 … 1.5]   // wie gut du dein Minispiel diese Runde gespielt hast
```

Die **eine** Kampf-Auflösung rechnet immer gleich:

```
schaden = basisKraft(attacke, werte)
        * executionScore
        * elementModifikator(angreifer, verteidiger)
        - verteidigung(verteidiger, aktiveVerteidigung)
```

- `basisKraft` kommt aus Werten (STR/INT/…) + Attacken-Daten.
- `executionScore` kommt aus deinem Skill im Minispiel.
- `elementModifikator` = leichte Würze (siehe §6), NICHT die ganze Strategie.
- `aktiveVerteidigung` = wie gut du verteidigt hast (siehe §5).

**Für Claude Code heißt das:** EIN Resolver (`battle.ts`) + VIER austauschbare Minispiel-Komponenten, die `executionScore` liefern. Sauber testbar, sauber erweiterbar.

---

## 4. Rundenablauf

1. **Initiative** über GES + Klasse → wer beginnt.
2. **Dein Zug (Angriff):** Du wählst eine Attacke und **spielst dein Minispiel** → `executionScore` → Schaden/Effekt.
3. **Gegner-Zug (du verteidigst aktiv):** Die KI fährt den Angriff des Gegners aus **seinen Werten**; du spielst **aktive Verteidigung** (Block/Ausweichen/Konter je nach deiner Klasse).
4. **Status-Effekte** wirken über Runden (Genauigkeit ↓, Schild, Blutung, betäubt, fokussiert).
5. **Lebensbalken** (AUS) sinkt sichtbar; bei 0 → Niederlage.

---

## 5. Aktive Verteidigung pro Klasse (auch das ist Skill)

| Klasse | Verteidigung | Wie |
|---|---|---|
| Krieger | **Block / Parade** | im richtigen Moment tappen → Schaden stark reduziert; perfekte Parade = Konterschaden (Mario-Superguard) |
| Magier | **Logik-Schild** | richtige Konter-Option in Sekundenbruchteil wählen |
| Schurke | **Ausweich-Roll** | wegswipen → Angriff verfehlt teilweise |
| Priester | **Schutzaura** | vorab geladene Mitigation; Timing entscheidet Stärke |

→ „Der Gegner spielt mit": Beide Seiten sind in jedem Zug aktiv, auch im **asynchronen PvP**.

---

## 6. Elemente (nur Würze, nicht König)

**Wasser · Feuer · Schatten · Licht · Erde · Sturm.** Leichte Modifikatoren (z. B. ×1,2 / ×0,85), damit Vielfalt entsteht — aber die **Skill-Ausführung** (executionScore) und die **Werte** dominieren. So vermeiden wir die „Typ-Tabelle ist alles"-Falle.

---

## 7. Asynchrones PvP („gegen Freunde kämpfen")

- Du kämpfst gegen den **Werte-Schnappschuss** deines Freundes. Eine KI steuert ihn nach seinen Werten/seinem Skill-Rating.
- **Auflösung serverseitig** (Supabase Edge Function) → kein Cheaten.
- Ergebnis + **Kampf-Log** werden gespeichert; beide sehen den Verlauf.
- Kein Live-Sync nötig → trotzdem „richtig gegeneinander".
- (Später optional: echtes Live-PvP. Bewusst NICHT im MVP.)

---

## 8. Anti-Klon-Regeln (fest verdrahtet)

1. **Keine** reine Menü-Attacke ohne Minispiel. Jeder Angriff wird *gespielt*.
2. Element-Matrix bleibt **sekundär**.
3. **Kleine, lesbare Zahlen** (Paper-Mario-Lehre: zweistellig, nicht 9999).
4. Der **Beruf verändert die Mechanik**, nicht nur die Stat-Größe. Das ist der einzigartige Haken.
5. Auch **Verteidigung ist aktiv** — nie nur zugucken.

---

## 9. Balancing-Startwerte (von Claude Code in Tests justierbar)

- HP/AUS: Start ~20–40, Endgame ~80–120 (klein halten).
- Schaden pro Treffer: ~3–12.
- `executionScore`: 0.0 (Patzer) · 1.0 (gut) · 1.5 (perfekt).
- Krit nur bei „perfekt" + GES-Bonus.
- Status-Effekte 1–3 Runden.
- Ziel: ein Kampf dauert ~6–10 Runden, ~60–120 Sekunden.

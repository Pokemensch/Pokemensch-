# SPIELDESIGN — POKEMENSCH (Game Design Bible)

> Die Spielregeln. Das ist die Quelle der Wahrheit für die Werte-, Klassen- und Kampf-Logik.

---

## 1. Die 6 Grundwerte

| Wert | Bedeutung | Wird gespeist aus (Beispiele) |
|---|---|---|
| **Stärke (STR)** | physischer Angriff | körperliche Berufe, Kraftsport, Gewicht/Muskelmasse |
| **Ausdauer (AUS)** | = Leben/HP, Widerstand | Ausdauersport, Jahre körperlicher Arbeit, Bouldern/Calisthenics |
| **Intelligenz (INT)** | magischer/taktischer Angriff | Abschlüsse, Wissensquests, Lern-Apps, Beruf (Wissensarbeit) |
| **Geschick (GES)** | Genauigkeit, Initiative, Krit | Sport mit Feinmotorik, Schach, handwerkliche Präzision |
| **Wille (WIL)** | Verteidigung, Status-Resistenz | Durchhalte-Leistungen, lange Berufserfahrung, Disziplin-Quests |
| **Charisma (CHA)** | Buffs, Team-Effekte, Handel | soziale Berufe, Community, Content-Erstellung |

**Grundprinzip:** Wer alt/erfahren ist, ist von Natur aus stärker (mehr Jahre = mehr Basiswerte).
Wer aktiv ist (Quests, verbundene Apps), wächst weiter.

---

## 2. Werte-Formel (Startpunkt — von Claude Code feinjustierbar)

Jeder Wert = `Basis(Beruf) + Erfahrung + Aktivität + App-Boni`

Beispiel-Logik (Pseudocode):

```
STR = berufsbasis.str
    + jahre_erfahrung * 1.5 (bei körperlichem Beruf)
    + kraftsport_level * 3
    + (koerpergewicht & groesse → BMI-Faktor, moderat)

AUS = berufsbasis.aus
    + jahre_erfahrung * 1.2
    + ausdauersport_level * 3

INT = berufsbasis.int
    + summe(abschluesse_gewichtet)
    + wissensquests * 2
    + lernapp_streak

... (analog für GES, WIL, CHA)
```

**Wichtig:** Werte werden auf eine Kurve gemappt (z. B. logarithmisch), damit ein 30-Jahre-Maurer stark, aber nicht „unbesiegbar" ist. Balancing macht Claude Code in Phase 3 über Tests.

---

## 3. Klassen (aus Beruf abgeleitet)

Beim Anlegen wählt man Berufsgruppe → Spiel ordnet eine **Klasse** zu (mit manueller Override-Option):

**Wichtig: Jede Klasse spielt sich im Kampf wirklich ANDERS** (Details: `KAMPFSYSTEM.md`).

| Klasse | Typische Berufe | Stärkt | **Kampfmechanik** |
|---|---|---|---|
| **Krieger** | Handwerk, Bau, Logistik, Sport | STR, AUS | **Reaktions-Schlag** (Timing-Leiste) |
| **Magier** | Recht, IT, Wissenschaft, Lehre | INT, WIL | **Wissens-Resonanz** (Quiz/Logik) |
| **Schurke** | Vertrieb, Design, Präzision | GES, CHA | **Combo-Flow** (Swipe-Combos) |
| **Priester** | Pflege, Sozial, Medizin, Coaching | WIL, CHA | **Atemrhythmus** (Halten/Loslassen) |

> Beispiel: **Maurer, 30 J. → Krieger**, greift mit Reaktions-Timing an. **Anwalt, Master Jura → Magier**, greift mit Wissens-Quiz an. Volle Berufs-/Abschluss-Zuordnung + Talentbäume: **`TALENTBAEUME.md`**.

---

## 4. Elemente

Zusätzlich zur Klasse hat jeder Charakter ein **Element** (aus Profil/Interessen/Override):
**Wasser · Feuer · Schatten · Licht · Erde · Sturm**

Elemente sind **nur Würze**, nicht die ganze Strategie (leichte Modifikatoren ×1,2 / ×0,85). Skill-Ausführung & Werte dominieren — so vermeiden wir die „Typ-Tabelle ist alles"-Falle. Beispiel:
- Wasser schlägt Feuer, schwach gegen Sturm
- Licht ↔ Schatten (Spiegel-Duell)
- volle Matrix in `KAMPFSYSTEM.md` / Phase 3

---

## 5. Talentbaum & Attacken (Beispiel: Krieger/Maurer)

Jede Klasse hat einen Talentbaum. Knoten schalten Attacken/Passives frei. Erfahrung & Level geben Talentpunkte. **Vier ausgearbeitete Starter-Bäume + Berufs-/Abschluss-Zuordnung: `TALENTBAEUME.md`.**

**Beispiel-Attacken Maurer/Krieger:**
| Attacke | Typ | Effekt |
|---|---|---|
| **Lehmschelle** | physisch | Schaden + Gegner-Genauigkeit ↓ |
| **Verputzen** | defensiv | eigene Verteidigung ↑ (Schild) |
| **Maurerhammer** | physisch, Krit | hoher Schaden, langsam |
| **Trockenbau-Wand** | defensiv | blockt nächste Attacke |

> Das Prinzip: Die **echte Berufs-Realität** wird zur Spielmechanik. Koch → „Stärkungsmahlzeit" (Ausdauer-Buff). Programmierer → „Bugfix" (entfernt Status-Effekt). Genau dieser Witz macht das Spiel besonders.

---

## 6. Buffs aus dem echten Leben

Wenn man eine echte Aktivität einträgt, gibt es temporäre Buffs:
- **Gekocht & eingetragen** → +Ausdauer für X Stunden
- **Workout eingetragen** → +Stärke temporär
- **Lern-Session** → +Intelligenz temporär
- Verbundene Apps (Strava-Lauf, Schach-Sieg) → automatische Buffs/XP

---

## 7. Kampfsystem (das Herzstück) → siehe `KAMPFSYSTEM.md`

**Kein Pokémon-Klon.** Kein „Attacke aus Menü → Zahl anschauen". Stattdessen: **aktives, skill-basiertes Kämpfen, bei dem der Beruf die Mechanik bestimmt.**

- **Asymmetrisch:** Jede Klasse spielt ein eigenes Mini-Spiel (Krieger = Timing, Magier = Quiz, Schurke = Combo, Priester = Rhythmus).
- **Eine Engine:** Jedes Minispiel liefert nur `executionScore (0–1,5)`; der gemeinsame Resolver rechnet `Schaden = Basiskraft × executionScore × Element − Verteidigung`.
- **Gegner spielt mit:** Auch im **asynchronen PvP** verteidigst du aktiv (Block/Ausweichen/Konter); KI fährt den Gegner aus seinen Werten.
- Vorbilder (recherchiert): Puzzle Quest (Kampf = Skill-Minispiel), Mario-RPG Action Commands (Timing), Habitica (Markt da, Kampf tot = unsere Lücke).

> Vollständiges Design inkl. Anti-Klon-Regeln & Balancing: **`KAMPFSYSTEM.md`**.

---

## 8. Level & Entwicklung

- XP aus Quests, Kämpfen, eingetragenen Aktivitäten.
- Level-Ups geben Talentpunkte & Werte.
- **Evolutionsstufen** (z. B. Stufe 1/2/3) verändern Avatar-Look & schalten stärkere Attacken frei → der „Entwicklungs"-Moment wie bei Pokémon.

---

## 9. Avatar-Look — FESTGELEGT ✅

**Gewählt: Stilisiert-3D über Ready Player Me** (drehbarer In-Game-Avatar aus Selfie) + **Higgsfield Soul ID** für Portraits/Attacken-Art/Evolutions-Reveals (Phase 9). Bestes Verhältnis aus „cool, real, aber animiert" und Solo-Machbarkeit.

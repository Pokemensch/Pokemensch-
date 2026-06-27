# TALENTBÄUME, BERUFE & ABSCHLÜSSE — POKEMENSCH

> Wie echte Berufe und Abschlüsse zu Klasse, Element, Werten und Talenten werden. Starter-Set für die gängigsten Gruppen — von Claude Code in Phase 2 erweiterbar.

---

## 1. Berufsgruppen → Klasse / Element / Werte-Bias

| Berufsgruppe (Beispiele) | Klasse | Element | Werte-Bias | Kampfmechanik |
|---|---|---|---|---|
| Bau & Handwerk (Maurer, Schreiner, Elektriker, Mechaniker) | Krieger | Erde/Feuer | STR, AUS | Reaktions-Schlag |
| Logistik & Lager & Transport | Krieger | Erde | AUS, STR, WIL | Reaktions-Schlag |
| Sicherheit, Rettung, Militär, Feuerwehr | Krieger | Erde | STR, AUS, WIL | Reaktions-Schlag |
| Sport, Fitness, Training | Krieger | Sturm | STR, AUS, GES | Reaktions-Schlag |
| Recht, Verwaltung, Beamte (Jurist, Anwalt) | Magier | Licht/Schatten | INT, WIL, CHA | Wissens-Resonanz |
| IT, Technik, Ingenieurwesen | Magier | Sturm | INT, GES | Wissens-Resonanz |
| Wissenschaft, Forschung, Lehre | Magier | Licht | INT, WIL | Wissens-Resonanz |
| Vertrieb, Marketing, Handel | Schurke | Sturm/Feuer | CHA, GES | Combo-Flow |
| Kreativ, Design, Medien, Content | Schurke | Schatten/Wasser | GES, CHA | Combo-Flow |
| Gastronomie, Koch | Schurke/Krieger (Hybrid) | Feuer | AUS, GES | Combo-Flow (+ Koch-Buffs) |
| Pflege, Medizin, Therapie | Priester | Licht | WIL, CHA, INT | Atemrhythmus |
| Sozial, Bildung, Erziehung, Coaching | Priester | Licht | CHA, WIL | Atemrhythmus |

> Override: Spieler darf Klasse/Element manuell anpassen (z. B. ein kreativer Ingenieur).

---

## 2. Abschlüsse → Werte-Boni (und Quiz-Kategorien)

Abschlüsse heben Basiswerte **und** schalten beim Gelehrten Fragen-Kategorien für die Wissens-Resonanz frei.

| Abschluss | Werte-Bonus | Schaltet frei |
|---|---|---|
| Schulabschluss (Haupt/Real/Abitur) | kleines INT-Fundament | Allgemeinwissen-Quizpool |
| Abgeschlossene Ausbildung | + Primärwert der Branche (z. B. STR/AUS handwerklich) | Fach-Quizpool der Branche |
| **Meister** | ++AUS, ++WIL, +CHA (Führung) | Passive „Meisterhand" (Defensiv-Bonus) |
| Bachelor | +INT | Studien-Quizpool |
| Master / Diplom | ++INT, +WIL | erweiterter Fach-Quizpool |
| Staatsexamen (Jura/Medizin/Lehramt) | ++INT, ++WIL | berufsspezifische Ultimate |
| Promotion (Dr.) | +++INT, +WIL, Prestige | „Koryphäe"-Passive |

**Jahre Erfahrung:** skaliert AUS (Seniorität/Durchhalten) + Primärwert der Branche (logarithmisch, damit „erfahren = stark, aber nicht unbesiegbar").

---

## 3. Vier Starter-Talentbäume

Jeder Baum: 3 Äste, Knoten schalten Attacken/Passives frei. Talentpunkte aus Level-Ups & Quests.

### 3.1 Krieger (z. B. Maurer / Logistiker)
- **Ast Kraft:** Lehmschelle (Schaden + Gegner-Genauigkeit ↓) → Maurerhammer (hoher Krit, langsam) → Abrissbirne (Ultimate)
- **Ast Schutz:** Verputzen (eigene Verteidigung ↑) → Trockenbau-Wand (blockt nächste Attacke) → Bollwerk (Team-Schild)
- **Ast Ausdauer:** Maloche (heilt wenig pro Runde) → Zweite Schicht (überlebt 1× mit 1 HP) → Eisenrücken (Status-Resistenz)

### 3.2 Magier (z. B. Jurist / Informatiker)
- **Ast Wissen:** Erkenntnis (Quiz-Treffer = Schaden) → Kreuzverhör (Quiz-Combo, mehrere Fragen) → Beweisführung (Ultimate)
- **Ast Kontrolle:** Logik-Schild (aktive Verteidigung+) → Einspruch! (negiert eine Gegner-Attacke = Konter) → Präzedenzfall (kopiert letzte Gegner-Attacke)
- **Ast Rhetorik:** Plädoyer (CHA-Buff + Gegner-Debuff) → Fachsimpeln (lädt schneller) → Brillanz (perfekte Antwort = Krit)

### 3.3 Schurke (z. B. Vertrieb / Designer)
- **Ast Tempo:** Schnellschnitt (Combo-Start) → Doppelschlag (2 Treffer) → Klingentanz (lange Combo = viele Treffer)
- **Ast List:** Finte (Gegner-Genauigkeit ↓) → Taschendieb (klaut Buff) → Schattenschritt (garantiertes Ausweichen 1 Runde)
- **Ast Charme:** Verhandlung (CHA-Buff) → Blender (verwirrt) → Deal des Lebens (Ultimate, skaliert mit CHA)

### 3.4 Priester (z. B. Pflege / Coach)
- **Ast Heilung:** Verband (heilt) → Atempause (heilt über Zeit) → Genesung (Ultimate-Heal)
- **Ast Schutz:** Schutzaura (aktive Verteidigung+) → Geborgenheit (Status heilen) → Schild des Vertrauens (Team-Schild)
- **Ast Resonanz:** Zuspruch (Buff) → Achtsamkeit (Rhythmus stärker) → Innerer Frieden (Gegner-Debuff bei perfektem Rhythmus)

---

## 4. Durchgerechnetes Beispiel: Anwalt mit Master Jura

| Eingabe | Wirkung |
|---|---|
| Beruf: Anwalt (Recht) | Klasse **Magier**, Element **Licht** (Schatten bei Strafrecht), Mechanik **Wissens-Resonanz** |
| Master Jura | ++INT, +WIL, + Quiz-Kategorie **Recht/Logik**, + erweiterter Fach-Quizpool |
| Staatsexamen | ++INT, ++WIL, schaltet Ultimate **Beweisführung** frei |
| 12 Jahre Erfahrung | +AUS (Durchhalten), +INT (Routine), logarithmisch gedeckelt |
| Hobby Debattieren | +CHA → stärkt Rhetorik-Ast |

**Resultierender Charakter:** hoher INT/WIL, solides CHA, moderate STR.
**Spielgefühl:** greift mit **Quiz-/Logik-Fragen** an (Recht-Kategorie), kontert mit **„Einspruch!"**, bufft sich mit **Plädoyer**. Genau wie gewünscht: *der Gelehrte kämpft mit Wissen, nicht mit Muskeln.*

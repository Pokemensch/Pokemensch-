# POKEMENSCH 🧬⚔️

**Spiel dich selbst wie ein Pokémon.** Deine echten Erfolge (Beruf, Sport, Körper, Wissen, verbundene Apps) werden zu Spielwerten. Du entwickelst dich, kämpfst gegen Freunde, erledigst Quests und wirst über die Zeit mächtiger.

> Dieser Ordner ist dein **Projekt-Cockpit** für Visual Studio Code + Claude Code.
> Du musst hier nichts manuell programmieren — du gibst Claude Code den Master-Prompt und arbeitest die Phasen ab.

---

## 📁 Was liegt hier drin?

| Datei | Wofür |
|---|---|
| `README.md` | Du bist hier. Überblick + Setup. |
| `PROJEKTPLAN.md` | Der komplette Plan in Phasen (Backend zuerst → Higgsfield zuletzt). |
| `CLAUDE_CODE_MASTER_PROMPT.md` | **Das Wichtigste.** Den Inhalt fügst du in Claude Code ein, damit es weiß, was es bauen soll. |
| `docs/SPIELDESIGN.md` | Das „Game Design Bible": Werte, Klassen, Elemente, Buffs, Level. |
| `docs/KAMPFSYSTEM.md` | **Das Herzstück.** Das aktive, skill-basierte Kampfsystem (kein Pokémon-Klon) + Recherche-Belege. |
| `docs/TALENTBAEUME.md` | Berufsgruppen, Abschlüsse (Master/Meister/…), 4 Talentbäume, Jurist-Beispiel. |
| `docs/HIGGSFIELD.md` | Wie Higgsfield (Bilder/Avatar/Attacken-Art) später angebunden wird. |
| `docs/ENTSCHEIDUNGEN.md` | Die offenen Entscheidungen + meine Empfehlung. Hier trägst du deine Wahl ein. |

---

## ⚙️ Setup (einmalig, ~30 Min)

**1. Tools installieren**
- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js LTS](https://nodejs.org/) (für React Native / Expo)
- [Claude Code](https://docs.claude.com/en/docs/claude-code) → in VS Code als Extension oder im Terminal
- [Git](https://git-scm.com/) (hast du wahrscheinlich schon)

**2. Diesen Ordner öffnen**
- Lade diesen `pokemensch`-Ordner herunter und entpacke ihn in deinen lokalen `pokemensch`-Ordner.
- In VS Code: `Datei → Ordner öffnen → pokemensch`.

**3. Accounts anlegen (kostenlos zum Start)**
- [Supabase](https://supabase.com) – Backend, Datenbank, Login, Autospeichern
- [Expo](https://expo.dev) – Mobile-App-Build für iPhone/Android
- [RevenueCat](https://www.revenuecat.com) – Trial + Premium-Abos (kommt erst in Phase 7)
- [Ready Player Me](https://readyplayer.me/developers) – 3D-Avatar aus Selfie (kommt in Phase 5)
- [Higgsfield](https://higgsfield.ai) – Bild/Avatar-Art (kommt in Phase 8)

**4. Claude Code starten**
- Terminal in VS Code öffnen (`Strg+ö` / `Ctrl+ö`).
- Claude Code starten.
- Öffne `CLAUDE_CODE_MASTER_PROMPT.md`, kopiere den Inhalt und füge ihn als erste Nachricht in Claude Code ein.
- Danach sagst du nur noch: **„Lass uns mit Phase 0 starten."** Claude Code arbeitet die Phasen ab.

---

## 🧠 Wichtigste Wahrheit zum Projekt (lies das einmal)

- **Kern = baubar von einer Person.** „Echtes Leben → Werte → Charakter → rundenbasierter Kampf gegen Freunde" ist ein realistischer Solo-MVP.
- **Echtzeit-3D-Fighting ist NICHT der MVP.** Aber der Kampf ist trotzdem das Herzstück und **kein Pokémon-Klon**: jede Berufsgruppe spielt ein eigenes aktives Mini-Spiel (Krieger=Timing, Magier=Quiz, Schurke=Combo, Priester=Rhythmus). Details in `docs/KAMPFSYSTEM.md`.
- **Higgsfield ≠ Avatar-Engine.** Higgsfield macht Bilder/Clips. Der drehbare 3D-Avatar kommt von Ready Player Me/Avaturn. Higgsfield liefert Key-Art, Portraits, Attacken-Animationen und „Entwicklungs"-Reveals.
- **Reihenfolge:** Backend → Spiellogik → App-Grundgerüst → Kampf-UI → Avatar → Quests/App-Anbindung → Monetarisierung → **Higgsfield/Polish zuletzt**.

---

## 🚦 Dein nächster Schritt

1. Lies `docs/ENTSCHEIDUNGEN.md` und trage deine 3 Antworten ein (Art-Stil, Engine, Kampf-Typ).
2. Lies `PROJEKTPLAN.md` einmal komplett.
3. Gib Claude Code den Master-Prompt und starte Phase 0.

Viel Erfolg. Du baust hier etwas, das es so noch nicht gibt.

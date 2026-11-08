# Hinweise für Claude

Verkaufs-/Psychologie-Lern-App (statisch, GitHub Pages, kein Build). Sprache der Inhalte: Deutsch.

## Skills nutzen

Im Ordner `.claude/skills/` liegen Projekt-Skills (Quellen siehe `.claude/skills/README.md`). Semih will, dass sie in jeder Runde direkt und intensiv genutzt werden, gern in mehreren Durchgängen. Vor einer Aufgabe die passenden Skills laden:

- Lerninhalte und Kursaufbau: `anything-to-course`
- Texte, Lektionen, Verkaufspsychologie: `copywriting`, `copy-editing`, `marketing-psychology`, `sales-enablement`, `customer-research`
- Business-Ideen planen und prüfen: `founder-board`, `founder-offer`, `founder-pricing`, `founder-cfo`, `founder-competitors`, `founder-plan`, dazu `pricing`, `offers`, `launch`
- Design und UI: `refactoring-ui`, `frontend-ui-engineering`
- Planung und Umsetzung: `brainstorming`, `writing-plans`, `executing-plans`, `systematic-debugging`, `test-driven-development`
- Prüfen vor dem Abschluss: `verification-before-completion`, `browser-testing-with-devtools`, `performance-optimization`, `security-and-hardening` (KI-Coach mit API-Key im Browser)

## Entwicklung

- Tests: `node tests/alle.js` (oder `node tests/alle.js daten-` ohne Browser). Testdateien nach Inhalt benennen, nicht nach Runde.
- Design: Tokens in `css/style.css` (`:root`). Keine Verläufe, Glows, Emoji-Icons, Pfeile in Knöpfen oder gesperrte Großbuchstaben-Labels. Übersichten als Zeilenlisten statt Kachelraster.
- Texte knapp: eine Zeile Einleitung pro Seite, keine Begründungen oder Studien-Fußnoten in der Oberfläche, nichts doppelt erklären. Keine erklärenden Code-Kommentare.
- Design darf und soll hochwertig wirken (Icons, Tiefe, Gold-Akzente), nur ohne die typischen Generator-Muster.
- Änderungshistorie gehört in PR-Beschreibungen, nicht in README oder Code-Kommentare.

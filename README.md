# Verkaufsakademie

Persönliches Verkaufs-Bootcamp als statische Web-App: 10 Module mit 34 Lektionen, Quiz und Modulprüfungen (mindestens 80 %), Übungsberichte, 8 Rollenspiele, 30-Tage-Ablehnungstraining, Körpersprache-Drills, Checklisten, Kundenanalyse, Milliardärs-Bibliothek mit Quellenstatus, Mythen-Check, Quellenverzeichnis mit über 1.200 geprüften Quellen und ein KI-Coach (eigener Anthropic-API-Schlüssel).

## Nutzen

- **Online:** GitHub Pages (Einstellungen → Pages → Source „GitHub Actions“; der Workflow in `.github/workflows/pages.yml` veröffentlicht bei jedem Push auf `main`).
- **Lokal:** `index.html` im Browser öffnen oder `python3 -m http.server` im Ordner starten.
- **Handy:** Seite öffnen, „Zum Home-Bildschirm“. Die App läuft danach auch offline (Service Worker), nur der Coach braucht Internet.

## KI-Coach

Einstellungen → Anthropic-API-Schlüssel eintragen (console.anthropic.com). Der Schlüssel bleibt im Browser (localStorage) und geht direkt an `api.anthropic.com`. Ohne Schlüssel funktioniert alles außer dem Live-Coach; Übungsberichte prüft dann ein Selbst-Check.

## Struktur

```
index.html            App-Hülle
css/style.css         Design (dunkel, gold)
js/app.js             Router, Fortschritt, Quiz, Prüfungen, Bibliothek, Training, Werkzeuge
js/coach.js           KI-Coach (Streaming), Rollenspiel-Bewertung, Berichtsprüfung, Business-Planer
js/data/kurse/        Ein Modul pro Datei (Lektionen als HTML, Quiz, Quellen, Übung)
js/data/*.js          Milliardäre, Szenarien, Übungen, Checklisten, Drills, Kundenanalyse, Quellen
research/             Recherche-Dokumente und Quellentabellen (research/quellen/*.md)
tools/build-quellen.js  Baut js/data/quellen.js aus den Quellentabellen
```

Fortschritt liegt im localStorage des Browsers. Export und Import gibt es in den Einstellungen.

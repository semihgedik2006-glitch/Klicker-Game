# Verkaufsakademie

Persönliches Verkaufs-Bootcamp als statische Web-App: 10 Module mit 34 Lektionen, Quiz und Modulprüfungen (mindestens 80 %), Übungsberichte, 8 Rollenspiele, 30-Tage-Ablehnungstraining, Körpersprache-Drills, Checklisten, Kundenanalyse, Milliardärs-Bibliothek mit Quellenstatus, Mythen-Check, Quellenverzeichnis mit über 1.200 geprüften Quellen und ein KI-Coach (eigener Anthropic-API-Schlüssel).

## Nutzen

- **Online:** GitHub Pages (Einstellungen → Pages → Source „GitHub Actions“; der Workflow in `.github/workflows/pages.yml` veröffentlicht bei jedem Push auf `main`).
- **Lokal:** `index.html` im Browser öffnen oder `python3 -m http.server` im Ordner starten.
- **Handy:** Seite öffnen, „Zum Home-Bildschirm“. Die App läuft danach auch offline (Service Worker), nur der Coach braucht Internet.

## KI-Coach

Einstellungen → Anthropic-API-Schlüssel eintragen (console.anthropic.com). Der Schlüssel bleibt im Browser (localStorage) und geht direkt an `api.anthropic.com`. Ohne Schlüssel funktioniert alles außer dem Live-Coach; Übungsberichte prüft dann ein Selbst-Check.

## Didaktik

Jede Lektion folgt einer festen Abfolge, die aus der Lernforschung stammt: Lernziele, Vorab-Frage (Pretesting, Richland et al. 2009), Text, freier Abruf aus dem Kopf (Karpicke & Blunt 2011), Kernpunkte zum Vergleich, Quiz mit sofortiger Erklärung, Übungsbericht aus der echten Welt. Fragen abgeschlossener Lektionen wandern in die Abstandswiederholung (`#/wiederholen`, Leitner-Stufen 1/3/7/14/30/60 Tage, gemischt über Module, höchstens 20 pro Tag; Cepeda et al. 2006, Dunlosky et al. 2013).

Jedes Quiz enthält neben Wissensfragen zwei **Anwendungsfragen** mit einer konkreten Situation (Transfer statt Wiedererkennen); Modulprüfungen ziehen ein Drittel davon. Nach allen zehn Modulen folgt die **Abschlussprüfung** (`#/abschluss`, 30 Fragen quer durch alle Module) und ein druckbares **Zertifikat** (`#/zertifikat`). Alle acht Rollenspiele sind offline als Entscheidungsbaum spielbar (`js/data/szenarien-offline-*.js`).

Bewusst weggelassen, weil Nutzer anderer Lern-Apps es am häufigsten kritisieren: Herzen oder Energie, Werbung, Bezahlschranken, Schuld-Benachrichtigungen, Ranglisten, harte Serien (hier ein Ruhetag pro Woche), Rückstau in der Wiederholung.

`node tools/check-kurse.js` prüft, dass jede Lektion alle Pflichtfelder hat (lernziele, vorfrage, kernpunkte, quiz mit mindestens 3 Fragen und 2 Anwendungsfragen, uebung, quellen).

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

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

`node tools/check-kurse.js` prüft, dass jede Lektion alle Pflichtfelder hat (lernziele, vorfrage, kernpunkte, selbsterklaerung, quiz mit mindestens 3 Fragen und 2 Anwendungsfragen, uebung, quellen).

Seit Runde 5 kommen dazu: Nach den Kernpunkten stehen zwei bis drei **Selbsterklärungs-Fragen** („Warum funktioniert X gerade in Situation Y?“, Chi et al. 1994). Jedes Lektionsquiz enthält zwei **Rückblick-Fragen** aus früher abgeschlossenen Lektionen, jede Modulprüfung drei Fragen aus früheren Modulen (verschachteltes Üben, Rohrer & Taylor 2007). Zu jeder Quizfrage kann man „Ich bin mir sicher“ ankreuzen; sicher und falsch wird als **blinder Fleck** markiert, landet sofort in der Wiederholung und fließt in eine Selbsteinschätzungs-Zeile im Wochenrückblick. Jede Lektion hat nach dem Beispiel eine **Gegenprobe** (wann das Prinzip nicht greift). Das **Glossar** (`#/glossar`, `js/data/glossar.js`) erklärt 90 Fachbegriffe mit der Lektion, die sie einführt. Die Berichtsvorlage (Situation, Handlung, Reaktion, Lernpunkt) lässt sich per Knopf einfügen.

Durchgang 2 von Runde 5: Im Quiz sind die Antwortoptionen zunächst verborgen; man formuliert die Antwort erst im Kopf und klappt sie dann auf (**Abruf vor Wiedererkennen**). Zu jeder falschen Option gibt es eine eigene Begründung (`warumFalsch`), die nach der Auswertung, in der Wiederholung und in der Prüfungsauswertung zur gewählten Option erscheint (Roediger & Marsh 2005: unbehandelte Distraktoren fühlen sich später wahr an). Der **Einwand-Drill** (`#/einwaende`, `js/data/einwaende.js`) hält 16 echte Einwände bereit: erst eigene Antwort (mindestens 60 Zeichen), dann Vorgehen nach LAER, Muster, Falle und Beleg, dann ehrliche Selbstbewertung; mit API-Schlüssel spielt der Coach den Kunden (`#/coach?einwand=id`) und bewertet nach festem Raster. Abgeschlossene Lektionen zeigen oben eine **Mitnehmen-Karte** mit dem ersten Kernpunkt und dem nächsten Schritt. Die Coach-Prompts zitieren die Stelle des Schülers, trennen Fehler von vertretbaren Entscheidungen, nennen eine Hauptkorrektur und bekommen die Kernpunkte der Lektion als Quelle; die Berichtsprüfung hat Notenstufen.

Sicherheit: `index.html` setzt eine Content-Security-Policy (Skripte nur aus der App, Verbindungen nur zu api.anthropic.com), es gibt kein Inline-Skript mehr, und Coach-Antworten werden vor dem Rendern escaped.

Tests: `node tests/test.js`, `node tests/flow.js`, `node tests/runde5.js`, `node tests/runde6.js`, `node tests/coachmock.js`, `node tests/rp.js` (Playwright mit dem vorinstallierten Chromium, kein Server nötig).

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

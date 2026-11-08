# Verkaufsakademie

Persönliches Trainingsprogramm für Verkauf, Verkaufspsychologie, Körpersprache, Selbstvermarktung und Kundenanalyse. Statische Web-App ohne Build-Schritt, veröffentlicht über GitHub Pages:
https://semihgedik2006-glitch.github.io/Klicker-Game/

## Inhalt

- 10 Module mit 34 Lektionen, je mit Lernzielen, Vorab-Frage, Text, Abruf aus dem Gedächtnis, Quiz und Praxisbericht
- Modulprüfungen und Abschlussprüfung (Bestehensgrenze 80 %), danach ein druckbares Zertifikat
- Abstandswiederholung über alle abgeschlossenen Lektionen (Leitner-Stufen 1, 3, 7, 14, 30 und 60 Tage, höchstens 20 Karten am Tag)
- Training: tägliche Drills, 30-Tage-Ablehnungstraining, Erfolgsleiter, Einwand-Drill, Konzept-Kontraste, ausgearbeitete Beispiele, Fälle mit Bewertungsraster, acht Rollenspiele
- Nachschlagen: Milliardärs-Bibliothek mit Quellenstatus, Mythen-Check, Glossar, Quellenverzeichnis mit über 1.200 Einträgen
- KI-Coach über die Anthropic-API mit eigenem Schlüssel; ohne Schlüssel funktioniert alles außer dem Live-Coach

Die Didaktik stützt sich auf die Lernforschung, die in `research/quellen/lernforschung.md` belegt ist (unter anderem Roediger & Karpicke 2006, Richland et al. 2009, Cepeda et al. 2006, Dunlosky et al. 2013, Rohrer & Taylor 2007).

## Benutzung

- Online: Die Seite oben öffnen. Auf dem Handy über „Zum Home-Bildschirm“ installieren; danach läuft sie auch offline.
- Lokal: `python3 -m http.server` im Projektordner starten und `http://localhost:8000` öffnen.
- Fortschritt liegt im localStorage des Browsers. Sicherung und Wiederherstellung über Einstellungen → Daten.

### KI-Coach

Unter Einstellungen den Anthropic-API-Schlüssel eintragen. Er bleibt im Browser (wahlweise nur für die Sitzung) und wird ausschließlich an `api.anthropic.com` gesendet. Der Export enthält ihn nicht.

## Aufbau

```
index.html              App-Hülle, Content-Security-Policy
css/style.css           Design-Tokens und Komponenten
js/app.js               Router, Fortschritt, Lektionen, Prüfungen, Training, Nachschlagen
js/coach.js             KI-Coach, Bewertung von Berichten, Rollenspielen und Fällen, Business-Planer
js/data/kurse/          Ein Modul pro Datei
js/data/*.js            Übungs- und Nachschlagedaten (teilweise erst bei Bedarf geladen)
research/               Recherche-Dokumente und Quellentabellen
tools/                  Prüf- und Build-Skripte
tests/                  Browser- und Datentests
```

## Entwicklung

```
node tests/alle.js            alle Tests (Playwright mit Chromium)
node tests/alle.js daten-     nur die Datentests, ohne Browser
node tools/check-kurse.js     Pflichtfelder jeder Lektion
node tools/check-text.js 1 2  Textprüfung einzelner Module
node tools/build-quellen.js   js/data/quellen.js aus research/quellen/*.md neu bauen
```

Jeder Push auf `main` wird über `.github/workflows/pages.yml` veröffentlicht. Die Änderungshistorie steht in den Pull Requests.

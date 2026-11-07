// Praxisprogramm: 30-Tage-Ablehnungstraining, Erfolgsleiter, tägliche Drills.
// Quellen: research/selbstbewusstsein-kompetenzwirkung.md (Bandura, Seligman ABCDE, Exposition), Jiang (2015).
window.ABLEHNUNGSTRAINING = [
  { tag: 1, aufgabe: "Frage in einem Geschäft nach einem Rabatt, ohne Grund. Egal welche Antwort.", stufe: 1 },
  { tag: 2, aufgabe: "Bitte einen Fremden um die Uhrzeit, obwohl du ein Handy hast. Halte Blickkontakt.", stufe: 1 },
  { tag: 3, aufgabe: "Frage im Café, ob du einen Kaffee kostenlos probieren darfst.", stufe: 1 },
  { tag: 4, aufgabe: "Mache drei fremden Menschen ein ehrliches Kompliment.", stufe: 1 },
  { tag: 5, aufgabe: "Bitte jemanden, ein Foto von dir zu machen, und dann um ein zweites „weil das erste nicht gut war“.", stufe: 1 },
  { tag: 6, aufgabe: "Rufe ein Geschäft an und frage nach etwas, das sie wahrscheinlich nicht haben.", stufe: 2 },
  { tag: 7, aufgabe: "Wochenrückblick: Lies dein Ablehnungstagebuch. Wie viele befürchtete Katastrophen sind eingetreten?", stufe: 0 },
  { tag: 8, aufgabe: "Frage einen Fremden, was er beruflich macht, und stelle zwei Nachfragen.", stufe: 2 },
  { tag: 9, aufgabe: "Bitte im Restaurant um etwas, das nicht auf der Karte steht.", stufe: 2 },
  { tag: 10, aufgabe: "Sprich auf der Straße jemanden an und bitte um eine Empfehlung (Restaurant, Friseur).", stufe: 2 },
  { tag: 11, aufgabe: "Bitte einen Bekannten um einen Gefallen, den du sonst nie erbitten würdest.", stufe: 2 },
  { tag: 12, aufgabe: "Verhandle den Preis von etwas, das normalerweise einen Festpreis hat.", stufe: 2 },
  { tag: 13, aufgabe: "Stelle deinen Zwei-Satz-Pitch einem Fremden vor und frage nach ehrlichem Feedback.", stufe: 3 },
  { tag: 14, aufgabe: "Wochenrückblick mit ABCDE-Analyse des schwersten Neins dieser Woche.", stufe: 0 },
  { tag: 15, aufgabe: "Rufe ein Unternehmen an und bitte um ein 10-Minuten-Gespräch mit dem Inhaber.", stufe: 3 },
  { tag: 16, aufgabe: "Bitte jemanden mit mehr Erfahrung um 15 Minuten Rat (schriftlich oder persönlich).", stufe: 3 },
  { tag: 17, aufgabe: "Schlage einem Fremden im Fitnessstudio, Park oder Café vor, etwas gemeinsam zu tun.", stufe: 3 },
  { tag: 18, aufgabe: "Biete einem lokalen Geschäft kostenlos eine kleine Hilfe an (Foto, Text, Idee) und bitte um ein Gespräch.", stufe: 3 },
  { tag: 19, aufgabe: "Bitte drei Menschen um ein Testimonial oder eine Empfehlung für dich.", stufe: 3 },
  { tag: 20, aufgabe: "Sprich in einer Gruppe (Meeting, Kurs) ungefragt eine eigene Meinung aus.", stufe: 3 },
  { tag: 21, aufgabe: "Wochenrückblick: Welche Aufgabe war am schwersten? Wiederhole sie.", stufe: 0 },
  { tag: 22, aufgabe: "Kaltanruf: Rufe einen potenziellen Kunden für dein Produkt oder deine Idee an.", stufe: 4 },
  { tag: 23, aufgabe: "Zweiter Kaltanruf. Diesmal mit Preisnennung, wenn gefragt.", stufe: 4 },
  { tag: 24, aufgabe: "Bitte um ein Treffen mit jemandem, der deutlich erfolgreicher ist als du.", stufe: 4 },
  { tag: 25, aufgabe: "Drei Kaltanrufe hintereinander, ohne Pause dazwischen.", stufe: 4 },
  { tag: 26, aufgabe: "Präsentiere deine Idee oder dein Produkt vor mindestens drei Menschen gleichzeitig.", stufe: 4 },
  { tag: 27, aufgabe: "Frage nach einem Nein: „Was genau hat Sie abgehalten?“ und höre vollständig zu.", stufe: 4 },
  { tag: 28, aufgabe: "Wochenrückblick: Zähle alle Neins der 4 Wochen. Zähle alle Jas. Vergleiche mit Tag 1.", stufe: 0 },
  { tag: 29, aufgabe: "Fünf Kaltanrufe. Ziel: ein Termin.", stufe: 5 },
  { tag: 30, aufgabe: "Abschluss: Führe ein echtes Verkaufsgespräch von Anfang bis Ende. Debrief mit dem Coach.", stufe: 5 }
];
window.ERFOLGSLEITER_VORLAGE = [
  "Skript laut lesen, allein",
  "Skript vor dem Spiegel, mit Blickkontakt",
  "Skript einem Freund vortragen",
  "Pitch einem Bekannten vortragen und Feedback einholen",
  "Einen Fremden um etwas Kleines bitten",
  "Rollenspiel mit dem KI-Coach bestehen",
  "Echter Anruf bei einem Interessenten",
  "Echter Anruf mit Preisnennung",
  "Echtes Gespräch mit Einwandbehandlung",
  "Echtes Gespräch mit Abschlussfrage"
];
window.TAGESDRILLS = [
  { id: "stimme", name: "Stimm-Drill", dauer: 3, text: "Lies einen Absatz laut. Jede Aussage endet nach unten. Null Füllwörter. Nimm dich auf." },
  { id: "blick", name: "Blick-Drill", dauer: 2, text: "Im nächsten Gespräch: 70 % Blickkontakt beim Zuhören. Zähle innerlich." },
  { id: "spiegel", name: "Spiegel-Drill", dauer: 2, text: "Wiederhole in einem Gespräch dreimal die letzten Worte des anderen fragend. Beobachte, was passiert." },
  { id: "label", name: "Label-Drill", dauer: 2, text: "Benenne heute dreimal die Emotion eines Gegenübers: „Es klingt, als…“" },
  { id: "frage", name: "Frage-Drill", dauer: 3, text: "Führe ein Gespräch, in dem du nur Fragen stellst. Mindestens 10 Minuten." },
  { id: "pitch", name: "Pitch-Drill", dauer: 2, text: "Sprich deinen Zwei-Satz-Pitch fünfmal laut. Unter 15 Sekunden, ohne Füllwort." },
  { id: "haltung", name: "Haltungs-Drill", dauer: 1, text: "Vor jedem Raum, den du betrittst: Schultern zurück, Kinn parallel zum Boden, langsam ausatmen, dann rein." },
  { id: "nein", name: "Nein-Drill", dauer: 5, text: "Hole dir heute ein Nein. Dokumentiere es im Ablehnungstagebuch." },
  { id: "debrief", name: "Debrief-Drill", dauer: 3, text: "Nach jedem wichtigen Gespräch: Was lief gut? Was mache ich nächstes Mal anders? Welches Feedback hole ich ein?" },
  { id: "invert", name: "Invertier-Drill", dauer: 2, text: "Vor dem nächsten Gespräch: Wie würde ich es garantiert verlieren? Drei Punkte. Vermeide genau die." }
];

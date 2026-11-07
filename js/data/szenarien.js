// Rollenspiel-Szenarien. Jedes Szenario hat (a) eine Offline-Version mit Entscheidungsbaum und (b) eine Coach-Version mit verdeckten Infos und Pflichtkriterien für die KI.
// Quelle u. a. research/verhandlung-einwaende-abschluss.md, Abschnitt 7.
window.SZENARIEN = [
  {
    id: "preishammer", titel: "Der Preis-Hammer", level: "Einsteiger", modul: "gespraech",
    lage: "Du verkaufst eine Social-Media-Betreuung für ein Café, 890 Euro im Monat. Die Inhaberin sagt nach deiner Präsentation: „Das ist viel zu teuer.“",
    verdeckt: "Die Inhaberin hat 500 Euro budgetiert, verliert aber geschätzt 2.000 Euro Umsatz pro Monat durch leere Nachmittage. Ihr Neffe macht Social Media aktuell nebenbei und schlecht. Sie ist stolz und gibt das nicht sofort zu.",
    ziel: "Echten Einwand von Vorwand trennen, Wert über Auswirkungsfragen aufbauen, kein Rabatt ohne Gegenleistung, Gespräch endet mit konkretem nächsten Schritt.",
    pflicht: ["Mindestens 1 Spiegeln (letzte Worte fragend wiederholen)", "Mindestens 1 Label („Es klingt, als…“)", "Mindestens 2 Auswirkungsfragen", "Kein Preisnachlass in den ersten 3 Antworten", "Gespräch endet mit terminiertem nächsten Schritt"],
    persona: "Sabine Krüger, 48, Inhaberin eines Cafés in einer mittelgroßen Stadt. Direkt, etwas gestresst, misstrauisch gegenüber „Marketingleuten“. Wärmt auf, wenn man sich ehrlich für ihr Geschäft interessiert.",
    offline: {
      start: "s1",
      knoten: {
        s1: { npc: "Das ist viel zu teuer. 890 Euro im Monat, dafür kann ich eine halbe Aushilfe bezahlen.", optionen: [
          { text: "Ich verstehe. Wir könnten auch mit einem kleineren Paket für 590 Euro starten.", next: "s_rabatt", bewertung: "bad", feedback: "Sofortiger Rabatt. Du hast gerade signalisiert, dass 890 nie ernst gemeint war, und du weißt noch nicht einmal, ob der Preis der echte Einwand ist." },
          { text: "Zu teuer?", next: "s2", bewertung: "good", feedback: "Spiegeln. Du wiederholst die letzten Worte fragend und schweigst. Sie wird sich erklären." },
          { text: "Verglichen mit dem, was Sie monatlich durch leere Nachmittage verlieren, ist es günstig.", next: "s_angriff", bewertung: "bad", feedback: "Inhaltlich vielleicht richtig, aber du argumentierst, bevor du zugehört hast. Das wirkt belehrend und erzeugt Abwehr." }
        ]},
        s2: { npc: "Ja, zu teuer. Ich habe für so etwas vielleicht 500 Euro eingeplant. Und ehrlich gesagt macht mein Neffe das gerade nebenbei.", optionen: [
          { text: "Es klingt, als hätten Sie schon eine Lösung und fragen sich, ob sich der Aufpreis überhaupt lohnt.", next: "s3", bewertung: "good", feedback: "Label. Du benennst, was sie vermutlich denkt, ohne zu werten. Das senkt die Abwehr." },
          { text: "Ihr Neffe? Das ist ja keine professionelle Lösung.", next: "s_angriff", bewertung: "bad", feedback: "Du greifst ihre Familie an. Sie wird den Neffen jetzt verteidigen, auch wenn sie insgeheim unzufrieden ist." },
          { text: "500 Euro schaffen wir, wenn wir den Umfang reduzieren.", next: "s_rabatt", bewertung: "bad", feedback: "Rabatt in Antwort zwei. Du hast den Wert noch nicht aufgebaut." }
        ]},
        s3: { npc: "Genau. Er postet halt ab und zu was. Es ist nicht toll, aber es kostet nichts.", optionen: [
          { text: "Darf ich fragen: Wie voll ist das Café werktags zwischen 14 und 17 Uhr?", next: "s4", bewertung: "good", feedback: "Problemfrage, konkret. Du steuerst auf den Schmerz zu, den sie noch nicht ausgesprochen hat." },
          { text: "Wir posten dreimal täglich, mit professionellen Fotos und Werbeanzeigen.", next: "s_feature", bewertung: "ok", feedback: "Features statt Fragen. Nicht falsch, aber zu früh. Sie hat noch keinen Grund, sich dafür zu interessieren." }
        ]},
        s4: { npc: "Ehrlich? Ziemlich leer. Vormittags und am Wochenende brummt es, nachmittags sitzen da drei Leute.", optionen: [
          { text: "Was bedeutet das übers Jahr gerechnet für Sie? Wenn Sie nachmittags nur zehn Gäste mehr hätten?", next: "s5", bewertung: "good", feedback: "Auswirkungsfrage. Sie rechnet jetzt selbst, und ihre Zahl wird größer sein als dein Preis." },
          { text: "Da könnten wir mit gezielten Nachmittagsangeboten auf Instagram ansetzen.", next: "s_feature", bewertung: "ok", feedback: "Lösung zu früh. Lass sie das Problem erst in Zahlen fassen." }
        ]},
        s5: { npc: "Puh. Zehn Gäste mal, sagen wir, acht Euro, mal 20 Tage… das wären 1.600 Euro im Monat. Das hatte ich so noch nie gerechnet.", optionen: [
          { text: "Wenn wir es schaffen würden, die Nachmittage auch nur halb so voll zu machen wie die Vormittage, was wäre das für Sie wert?", next: "s6", bewertung: "good", feedback: "Need-Payoff-Frage. Sie formuliert den Nutzen jetzt selbst." },
          { text: "Sehen Sie, dann sind 890 Euro doch günstig.", next: "s_schnell", bewertung: "ok", feedback: "Richtig in der Sache, aber du nimmst ihr den Schluss weg. Lass sie ihn selbst ziehen." }
        ]},
        s6: { npc: "Das wäre natürlich… das würde die Miete für den Nachmittag reinholen. Aber woher weiß ich, dass das funktioniert?", optionen: [
          { text: "Berechtigte Frage. Vorschlag: Wir starten mit drei Monaten, Sie bekommen jede Woche die Zahlen, und wenn nach drei Monaten die Nachmittage nicht messbar voller sind, beenden wir es ohne weitere Kosten. Sollen wir das so festhalten und nächsten Dienstag die Details durchgehen?", next: "ende_gut", bewertung: "good", feedback: "Risikoumkehr statt Rabatt, dann ein terminierter nächster Schritt. Das ist der Abschluss eines Erstgesprächs." },
          { text: "Ich kann Ihnen das garantieren, wir haben noch nie einen unzufriedenen Kunden gehabt.", next: "s_bluff", bewertung: "bad", feedback: "Eine Behauptung ohne Beleg und eine Garantie, die du nicht halten kannst. Das zerstört die Vertrauens-Skala." }
        ]},
        s_rabatt: { npc: "Hm, 590 wäre schon eher… aber ich überlege es mir noch. Schicken Sie mir mal was zu.", ende: true, fazit: "Du hast 300 Euro verschenkt und trotzdem keinen Abschluss. Der Preis war nie das Problem. Nicht bestanden." },
        s_angriff: { npc: "Wissen Sie was, ich glaube, das passt nicht. Danke für Ihre Zeit.", ende: true, fazit: "Gespräch beendet. Du hast argumentiert, statt zuzuhören. Nicht bestanden." },
        s_feature: { npc: "Klingt nett. Aber wie gesagt, 890 Euro sind mir zu viel. Ich melde mich.", ende: true, fazit: "Features haben kein Problem gelöst, weil du das Problem nicht aufgedeckt hast. Nicht bestanden." },
        s_schnell: { npc: "Na ja, so einfach ist das nicht. Ich muss darüber nachdenken.", ende: true, fazit: "Fast. Du hattest den Schmerz aufgedeckt, aber du hast ihr den Schluss aufgedrängt. Teilweise bestanden. Wiederhole mit einer Need-Payoff-Frage." },
        s_bluff: { npc: "Das sagen alle. Ich melde mich.", ende: true, fazit: "Ein Bluff am Ende hat alles zerstört. Nicht bestanden." },
        ende_gut: { npc: "Dienstag passt. Bringen Sie die Zahlen mit, dann schauen wir.", ende: true, fazit: "Bestanden. Spiegeln, Labeln, Problemfrage, Auswirkungsfrage, Need-Payoff, Risikoumkehr, nächster Schritt. Genau diese Reihenfolge." }
      }
    }
  },
  {
    id: "partner", titel: "„Ich muss das mit meinem Partner besprechen“", level: "Einsteiger", modul: "gespraech",
    lage: "Privatkunde, Photovoltaik-Angebot über 14.870 Euro. Nach der Präsentation: „Das muss ich erst mit meiner Frau besprechen.“",
    verdeckt: "Die Frau ist eigentlich dafür. Der Kunde selbst hat Angst vor einer Fehlentscheidung und schiebt sie vor. Er hat vor zwei Jahren einen teuren Handwerker-Fehlkauf erlebt.",
    ziel: "Vorwand erkennen, die Angst vor der Fehlentscheidung labeln, gemeinsamen Termin mit beiden als nächsten Schritt.",
    pflicht: ["Isolier-Frage („Angenommen, Ihre Frau wäre einverstanden…“)", "Label zur Angst vor Fehlentscheidung", "Konkreter Termin mit beiden Partnern"],
    persona: "Thomas Berger, 55, Hausbesitzer, Ingenieur, vorsichtig, stellt Detailfragen, vermeidet Konflikt. Gibt die eigentliche Sorge erst zu, wenn man sie für ihn ausspricht.",
    offline: null
  },
  {
    id: "anker-b2b", titel: "Ankern im B2B", level: "Fortgeschritten", modul: "verhandlung",
    lage: "Du bist Freelancer und sollst ein Angebot für eine Firmenwebsite nennen. Der Kunde fragt in der ersten Minute: „Was kostet das bei Ihnen?“",
    verdeckt: "Der Kunde hat zwei andere Angebote: 3.000 und 9.000 Euro. Sein Budget reicht bis 8.000 Euro. Entscheidend ist der Launch vor einer Messe in sechs Wochen. Er testet, ob du sofort eine Zahl nennst.",
    ziel: "Erst Fragen stellen (Informationsasymmetrie), dann präzise und begründet ankern, den Termin als Wertfaktor nutzen.",
    pflicht: ["Mindestens 3 Fragen vor der ersten Zahl", "Anker präzise (keine runde Zahl) mit Begründung", "Mindestens 2 weitere Variablen (Zeit, Wartung, Zahlungsziel)"],
    persona: "Markus Lindner, 41, Geschäftsführer eines Maschinenbau-Zulieferers. Zackig, zahlenorientiert, ungeduldig. Respektiert, wer nicht sofort kuscht.",
    offline: null
  },
  {
    id: "einkaeufer", titel: "Der Einkäufer ankert zuerst", level: "Fortgeschritten", modul: "verhandlung",
    lage: "Profi-Einkäufer eines Mittelständlers: „Ihr Wettbewerber macht das für 40 Prozent weniger. Kommen Sie mir entgegen, sonst war's das.“",
    verdeckt: "Der Wettbewerber ist bei der Qualitätsprüfung durchgefallen. Der Einkäufer hat eine Zielvorgabe von 10 Prozent Einsparung. Ein Wechsel würde drei Monate Umstellung kosten. Er blufft.",
    ziel: "Nicht auf den Anker eingehen, Gegenanker mit objektiven Kriterien, die Alternative des Einkäufers realistisch einschätzen, Paketlösung anbieten.",
    pflicht: ["Kein Zugeständnis über 5 Prozent ohne Gegenleistung", "Mindestens 1 kalibrierte Frage („Wie würde der Wechsel konkret ablaufen?“)", "Mindestens 1 objektives Kriterium genannt"],
    persona: "Petra Hofmann, 50, Leiterin Einkauf, 20 Jahre Erfahrung, kennt jede Verkäufertaktik. Freundlich-hart. Bricht ab, wenn du lügst oder dich windest.",
    offline: null
  },
  {
    id: "skeptiker", titel: "Der Skeptiker", level: "Fortgeschritten", modul: "gespraech",
    lage: "Ein Geschäftsführer, der schon mehrfach von Agenturen enttäuscht wurde. Erster Satz: „Ich gebe Ihnen fünf Minuten.“",
    verdeckt: "Er hat 40.000 Euro bei zwei Agenturen verbrannt. Er braucht dringend neue Kunden, würde das aber nie zugeben. Er reagiert positiv, wenn jemand seine Skepsis vorwegnimmt.",
    ziel: "Accusation Audit in den ersten 60 Sekunden, Labeln, hohe Fragequote, am Ende ein kleiner bezahlter Pilot statt Großauftrag.",
    pflicht: ["Accusation Audit in den ersten 60 Sekunden", "Redeanteil unter 50 Prozent", "Nächster Schritt ist ein kleiner, bezahlter Pilot"],
    persona: "Dr. Frank Weber, 58, Geschäftsführer eines Logistikunternehmens. Verschränkte Arme, knappe Antworten, schaut auf die Uhr. Taut auf, wenn man ihn nicht bedrängt.",
    offline: null
  },
  {
    id: "gehalt", titel: "Gehaltsverhandlung", level: "Sich selbst verkaufen", modul: "selbstvermarktung",
    lage: "Du hast ein Jobangebot über 52.000 Euro. Dein recherchierter Marktwert liegt bei 56.000 bis 62.000 Euro.",
    verdeckt: "Die Firma hat ein Band bis 60.000 Euro. Zusätzlich sind Homeoffice, Weiterbildungsbudget und flexibles Startdatum möglich. Die Personalerin will dich, hat aber Anweisung, erst bei Nachfrage zu erhöhen.",
    ziel: "BATNA kennen, Spannen-Angebot mit Begründung, Paket statt nur Gehalt.",
    pflicht: ["Vorbereitungsblatt (BATNA, Ziel, Walk-away) vorher ausgefüllt", "Präzises oder Spannen-Gegenangebot mit Begründung", "Mindestens 2 Zusatzvariablen angesprochen", "Dank und Bestätigung am Ende"],
    persona: "Julia Schneider, 36, HR Business Partnerin. Freundlich, professionell, hält sich an Vorgaben, aber hat Spielraum.",
    offline: null
  },
  {
    id: "grossdeal", titel: "Großdeal-Abschluss", level: "Profi", modul: "gespraech",
    lage: "Software-Lizenz, 85.000 Euro pro Jahr, viertes Gespräch, drei Entscheider. Dein Champion sagt: „Sieht gut aus, wir melden uns.“",
    verdeckt: "Der Finanzchef hat Bedenken wegen der Umstellungskosten, die dein Champion dir nicht gesagt hat. Der Geschäftsführer entscheidet in zwei Wochen über das Budget. Ohne Termin mit allen dreien stirbt der Deal.",
    ziel: "Kein Druck-Close. Die unverbindliche Vertagung in einen konkreten nächsten Schritt mit allen Entscheidern verwandeln.",
    pflicht: ["Nutzen mit den eigenen Worten des Kunden zusammenfassen", "Nach dem Entscheidungsprozess fragen", "Konkreter Termin mit allen drei Entscheidern", "Keine Knappheits-Lüge"],
    persona: "Andreas Kühn, 44, IT-Leiter und dein Champion. Mag dich, will den Deal, aber scheut die interne Konfrontation. Gibt Infos preis, wenn man kalibriert fragt.",
    offline: null
  },
  {
    id: "vorstellung", titel: "Vorstellungsgespräch", level: "Sich selbst verkaufen", modul: "selbstvermarktung",
    lage: "Du bewirbst dich auf eine Stelle deiner Wahl. Der Interviewer beginnt mit: „Erzählen Sie mal etwas über sich.“",
    verdeckt: "Der Interviewer hat heute schon vier Kandidaten gesehen und ist müde. Er sucht jemanden, der das größte Problem des Teams (hohe Fluktuation, verpasste Deadlines) lösen kann, sagt das aber nicht von sich aus.",
    ziel: "Wärme vor Kompetenz, STAR-Antworten mit Zahlen, eigene Fragen stellen, Einwand isolieren, nächsten Schritt klären.",
    pflicht: ["Jede Antwort unter 90 Sekunden", "Mindestens 2 STAR-Antworten mit messbarem Ergebnis", "Mindestens 2 eigene Fragen nach dem größten Problem der Stelle", "Am Ende: Frage, ob etwas gegen dich spricht, und Frage nach dem weiteren Ablauf"],
    persona: "Stefan Maier, 47, Abteilungsleiter. Höflich, etwas abwesend. Wird lebendig, wenn du nach seinen Problemen fragst.",
    offline: null
  }
];
window.BEWERTUNGSRASTER = [
  { id: "vorbereitung", name: "Vorbereitung (Ziel, Alternative, Walk-away)" },
  { id: "fragen", name: "Fragen und Zuhören (Anzahl, Qualität, Redeanteil)" },
  { id: "empathie", name: "Taktische Empathie (Spiegeln, Labeln)" },
  { id: "anker", name: "Anker und Zugeständnisse" },
  { id: "einwand", name: "Einwandbehandlung (Ablauf eingehalten)" },
  { id: "abschluss", name: "Abschluss / nächster Schritt" }
];

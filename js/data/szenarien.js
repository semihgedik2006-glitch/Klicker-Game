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
    offline: {
      start: "a1",
      knoten: {
        a1: { npc: "Das klingt alles gut, aber das muss ich erst mit meiner Frau besprechen.", optionen: [
          { text: "Natürlich. Darf ich fragen: Angenommen, Ihre Frau wäre einverstanden, würden Sie es dann machen?", next: "a2", bewertung: "good", feedback: "Isolier-Frage. Du prüfst, ob der Partner der echte Grund ist oder ein Vorwand." },
          { text: "Verstehe. Dann schicke ich Ihnen alles per Mail, und Sie melden sich.", next: "a_weg", bewertung: "bad", feedback: "Du hast den Vorwand akzeptiert und die Kontrolle abgegeben. „Wir melden uns“ ist in 80 % der Fälle ein Nein." },
          { text: "Wenn Sie heute unterschreiben, bekommen Sie noch 5 % Rabatt. Das Angebot gilt nur heute.", next: "a_druck", bewertung: "bad", feedback: "Erfundene Knappheit und Druck. Genau das löst bei einem vorsichtigen Ingenieur Reaktanz aus. Und es ist unethisch." }
        ]},
        a2: { npc: "Hm… wahrscheinlich schon. Es ist nur viel Geld, und man liest ja so einiges über Pfusch bei Solaranlagen.", optionen: [
          { text: "Es klingt, als hätten Sie weniger Sorge wegen Ihrer Frau als davor, eine Entscheidung zu treffen, die Sie später bereuen.", next: "a3", bewertung: "good", feedback: "Label. Du sprichst die eigentliche Angst aus, ohne zu werten. Jetzt kann er darüber reden." },
          { text: "Pfusch gibt es bei uns nicht, wir haben 300 zufriedene Kunden.", next: "a_feature", bewertung: "ok", feedback: "Eine Behauptung gegen eine Angst. Die Angst gewinnt. Erst die Sorge anerkennen, dann Belege." },
          { text: "Dann lassen Sie uns das Gespräch mit Ihrer Frau zusammen führen.", next: "a_zufrueh", bewertung: "ok", feedback: "Richtige Richtung, aber zu früh. Du hast die eigentliche Sorge noch nicht aufgedeckt." }
        ]},
        a3: { npc: "Ehrlich gesagt ja. Wir hatten vor zwei Jahren einen Handwerker, der hat das Bad verpfuscht, 18.000 Euro, und wir sitzen heute noch auf dem Schaden.", optionen: [
          { text: "Das ist ein schwerer Schlag, und nach so etwas ist Vorsicht die einzig vernünftige Reaktion. Was müsste ein Anbieter tun, damit Sie dieses Mal sicher sein können?", next: "a4", bewertung: "good", feedback: "Anerkennung plus kalibrierte Frage. Er definiert jetzt selbst die Kriterien, die du erfüllen kannst." },
          { text: "Das tut mir leid. Aber wir sind ja keine Badsanierer.", next: "a_feature", bewertung: "bad", feedback: "Du hast seine Erfahrung abgetan. Für ihn ist das dieselbe Kategorie: Handwerker, viel Geld, Risiko." }
        ]},
        a4: { npc: "Referenzen, die ich anrufen kann. Eine Garantie, die etwas wert ist. Und dass nicht alles vorab bezahlt wird.", optionen: [
          { text: "Alle drei Punkte kann ich erfüllen: drei Kunden aus Ihrem Umkreis als Referenz, zehn Jahre Garantie schriftlich, Zahlung in drei Raten nach Baufortschritt. Vorschlag: Ich komme Donnerstagabend vorbei, wenn Ihre Frau da ist, bringe die Referenzen mit, und Sie entscheiden gemeinsam. Passt 19 Uhr?", next: "a_gut", bewertung: "good", feedback: "Seine Kriterien, deine Antworten, dann ein konkreter Termin mit beiden Entscheidern. Das ist der Abschluss dieses Gesprächs." },
          { text: "Die Garantie steht im Angebot, Referenzen schicke ich. Melden Sie sich dann?", next: "a_weg", bewertung: "bad", feedback: "Du hast die Kontrolle wieder abgegeben. Ohne Termin mit beiden stirbt der Deal in der Schublade." }
        ]},
        a_weg: { npc: "Mache ich. Danke erst mal.", ende: true, fazit: "Nicht bestanden. Der Vorwand wurde nie geprüft, die Angst nie angesprochen, kein Termin. Dieser Kunde meldet sich nicht." },
        a_druck: { npc: "So etwas mag ich nicht. Ich glaube, wir lassen das.", ende: true, fazit: "Nicht bestanden und Ethik nicht bestanden. Druck mit erfundener Frist beendet das Gespräch bei vorsichtigen Kunden sofort." },
        a_feature: { npc: "Schon klar. Ich bespreche es trotzdem erst mal zu Hause.", ende: true, fazit: "Nicht bestanden. Argumente gegen eine Angst verlieren immer. Erst anerkennen, dann fragen, dann belegen." },
        a_zufrueh: { npc: "Mal sehen. Ich melde mich.", ende: true, fazit: "Teilweise. Der gemeinsame Termin war die richtige Idee, aber ohne die eigentliche Sorge aufzudecken, hat er keinen Grund, ihn zu vereinbaren." },
        a_gut: { npc: "Donnerstag 19 Uhr passt. Bringen Sie die Referenzen mit, dann schauen wir uns das zusammen an.", ende: true, fazit: "Bestanden. Isolier-Frage, Label, Anerkennung, kalibrierte Frage, seine Kriterien erfüllt, Termin mit beiden Entscheidern." }
      }
    }
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
    offline: {
      start: "h1",
      knoten: {
        h1: { npc: "Wir freuen uns sehr, Ihnen die Stelle anzubieten. Das Jahresgehalt liegt bei 52.000 Euro. Wie klingt das für Sie?", optionen: [
          { text: "Vielen Dank, ich freue mich sehr über das Angebot. Bevor ich zum Gehalt komme: Was gehört sonst noch zum Paket, Homeoffice, Weiterbildung, Startdatum?", next: "h2", bewertung: "good", feedback: "Dank, Begeisterung, und du erweiterst zuerst die Verhandlungsmasse, bevor du über die Zahl sprichst." },
          { text: "Das ist zu wenig. Ich hatte mit 60.000 gerechnet.", next: "h_hart", bewertung: "ok", feedback: "Zahl ist richtig, Ton ist falsch. Ohne Dank und ohne Begründung wirkt es wie eine Forderung, nicht wie ein Gespräch." },
          { text: "Super, das passt. Wann kann ich anfangen?", next: "h_ja", bewertung: "bad", feedback: "Du hast ohne Gegenangebot akzeptiert. Die Firma hatte Spielraum bis 60.000. Das sind 8.000 Euro pro Jahr, die du verschenkt hast." }
        ]},
        h2: { npc: "Zwei Tage Homeoffice sind Standard, Weiterbildung nach Absprache, Start am liebsten zum Ersten des nächsten Monats.", optionen: [
          { text: "Danke, das hilft. Zum Gehalt: Ich habe den Markt für diese Rolle recherchiert, vergleichbare Positionen liegen zwischen 56.000 und 62.000. Mit meiner Erfahrung in X und Y, die genau das Problem löst, das Sie im Gespräch beschrieben haben, halte ich 58.500 bis 61.000 für angemessen. Wie viel Spielraum haben Sie da?", next: "h3", bewertung: "good", feedback: "Marktdaten, Begründung mit ihrem Problem, präzise Spanne mit dem Ziel als Untergrenze, kalibrierte Frage. Lehrbuch." },
          { text: "Okay. Und das Gehalt, geht da noch was?", next: "h_vage", bewertung: "bad", feedback: "Keine Zahl, keine Begründung. Die Antwort wird „leider nein“ sein, weil du nichts geliefert hast, worauf sie Ja sagen könnte." }
        ]},
        h3: { npc: "Das ist über dem, was wir für die Stelle eingeplant hatten. Ich könnte auf 55.000 gehen.", optionen: [
          { text: "Ich verstehe, dass es ein Budget gibt. 55.000 liegt unter dem Marktband. Wenn wir uns bei 58.500 treffen, kann ich sofort zusagen. Falls das Gehalt wirklich nicht geht: Wäre ein drittes Homeoffice-Tag plus ein festes Weiterbildungsbudget von 2.000 Euro möglich, als Ausgleich?", next: "h4", bewertung: "good", feedback: "Du hältst die Zahl, bietest einen klaren Abschluss an und hast Tauschvariablen in der Hinterhand. Keine Drohung, kein Nachgeben." },
          { text: "Okay, 55.000 nehme ich.", next: "h_55", bewertung: "ok", feedback: "Du hast 3.000 mehr geholt, aber beim ersten Gegenangebot aufgegeben. Das Band ging bis 60.000." },
          { text: "Dann muss ich leider absagen.", next: "h_abbruch", bewertung: "bad", feedback: "Ein Ultimatum ohne BATNA-Check. Du hattest noch Spielraum über andere Variablen und ein zweites Gegenangebot." }
        ]},
        h4: { npc: "Lassen Sie mich mit der Fachabteilung sprechen. Ich denke, 58.000 plus das Weiterbildungsbudget bekomme ich durch.", optionen: [
          { text: "Das klingt sehr gut, vielen Dank, dass Sie sich dafür einsetzen. Können wir festhalten, dass ich bei 58.000 plus 2.000 Euro Weiterbildung und zwei Tagen Homeoffice zusage, und Sie mir das bis Freitag schriftlich bestätigen?", next: "h_gut", bewertung: "good", feedback: "Dank, Bestätigung der Punkte, schriftlich, mit Datum. Du hast 6.000 Euro mehr pro Jahr plus Budget geholt, ohne die Beziehung zu belasten." },
          { text: "Und die 61.000? Da geht doch bestimmt noch was.", next: "h_gier", bewertung: "bad", feedback: "Du hast ein gutes Ergebnis und verhandelst weiter nach oben. Das wirkt gierig und gefährdet den Start in die Beziehung." }
        ]},
        h_ja: { npc: "Wunderbar, dann schicke ich Ihnen den Vertrag.", ende: true, fazit: "Nicht bestanden. Kein Gegenangebot. Studien zeigen: Wer verhandelt, bekommt im Schnitt mehrere Tausend Euro mehr, und fast niemand verliert deswegen ein Angebot." },
        h_hart: { npc: "Das übersteigt unser Budget deutlich. Mehr als 54.000 sehe ich nicht.", ende: true, fazit: "Teilweise. Du hast verhandelt, aber ohne Dank, Begründung und Variablen. Das Ergebnis ist entsprechend klein." },
        h_vage: { npc: "Leider nicht, das ist unser Budget für die Stelle.", ende: true, fazit: "Nicht bestanden. Eine vage Frage bekommt ein klares Nein. Nenne Marktdaten und eine präzise Spanne." },
        h_55: { npc: "Schön, dann machen wir das so.", ende: true, fazit: "Teilweise. 55.000 statt 52.000, aber das Band ging bis 60.000 und du hattest Tauschvariablen. Ein zweites Gegenangebot hätte nichts gekostet." },
        h_abbruch: { npc: "Das bedauere ich. Alles Gute.", ende: true, fazit: "Nicht bestanden. Ultimatum ohne Not. Erst alle Variablen ausreizen, dann entscheiden." },
        h_gier: { npc: "Hm. Ich muss das intern noch einmal grundsätzlich besprechen.", ende: true, fazit: "Nicht bestanden. Nach dem Ja weiterzuverhandeln zerstört Vertrauen. Nimm das gute Ergebnis und bedanke dich." },
        h_gut: { npc: "Gerne, Sie bekommen die Bestätigung bis Freitag. Willkommen im Team.", ende: true, fazit: "Bestanden. Dank, Paket erweitert, Marktdaten, präzise Spanne, Variablen getauscht, schriftliche Bestätigung mit Datum. Plus 6.000 Euro im Jahr." }
      }
    }
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

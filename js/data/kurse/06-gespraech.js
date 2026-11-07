KURSE.push({
  id: "gespraech",
  nr: 6,
  titel: "Das Verkaufsgespräch von A bis Z",
  untertitel: "Eröffnung, Challenger-Methode, Einwandbehandlung, Abschluss",
  beschreibung: "Die Struktur eines Verkaufsgesprächs, von der ersten Sekunde bis zur Unterschrift, mit den Methoden, die in großen Datenstudien funktioniert haben.",
  lektionen: [
    {
      id: "v1",
      titel: "Eröffnung und Rahmen setzen",
      dauer: "12 Min",
      inhalt: `
<h2>Die Vorbereitung entscheidet</h2>
<p>Rackham fand, dass die Erfolgsquote stärker mit der Qualität der Vorbereitung korrelierte als mit Gesprächstechnik. Vor jedem Gespräch (Checkliste in der App):</p>
<ul>
<li>Wer ist die Person? (LinkedIn, Website, gemeinsame Kontakte)</li>
<li>Was ist ihr wahrscheinliches Problem? Drei Hypothesen.</li>
<li>Was ist mein Ziel für DIESES Gespräch? (Nicht „verkaufen“, sondern z. B. „Termin mit Entscheider“)</li>
<li>Was ist der nächste Schritt, den ich vorschlagen werde?</li>
</ul>
<h2>Die ersten Sekunden</h2>
<p>Aus Modul 3: Wärme vor Kompetenz. Blickkontakt, Lächeln, Händedruck, Name. Dann ein Rahmen (Frame), der das Gespräch strukturiert und dir Kontrolle gibt:</p>
<blockquote>„Herr Müller, danke für die Zeit. Ich schlage vor: Ich stelle Ihnen in zwei Sätzen vor, was wir machen, dann möchte ich vor allem verstehen, wo Sie gerade stehen, und am Ende entscheiden wir gemeinsam, ob ein nächster Schritt sinnvoll ist. Passt das für Sie?“<cite>Agenda-Frame: Struktur, Zeit, Ziel, Zustimmung (erstes kleines Ja).</cite></blockquote>
<h2>Frame Control nach Oren Klaff</h2>
<p>Oren Klaff (<em>Pitch Anything</em>, 2011) beschreibt, dass in jedem Gespräch ein Rahmen dominiert: der des Verkäufers oder der des Kunden. Wer den Rahmen hält, führt. Klaffs Beobachtungen sind Praxiserfahrung, nicht Forschung, aber nützlich:</p>
<ul>
<li><strong>Power Frame</strong> des Kunden („Ich habe nur 10 Minuten“): Nicht unterwerfen, sondern mit Humor oder einem eigenen Rahmen kontern („Perfekt, dann brauche ich nur 8.“).</li>
<li><strong>Prize Frame:</strong> Du bist der Preis, nicht der Bittsteller. „Ich arbeite nicht mit jedem zusammen, lassen Sie uns prüfen, ob es passt.“ Das ist Knappheit auf dich selbst angewandt.</li>
<li><strong>Time Frame:</strong> Lege selbst fest, wann das Gespräch endet. Wer die Zeit kontrolliert, kontrolliert den Status.</li>
</ul>
<h2>Der Elevator Pitch in zwei Sätzen</h2>
<p>Formel: <strong>Wir helfen [Zielgruppe], [Ergebnis] zu erreichen, ohne [Schmerz]. Zum Beispiel [konkreter Fall mit Zahl].</strong> „Wir helfen Handwerksbetrieben, in 30 Tagen 10 neue Aufträge zu gewinnen, ohne selbst Werbung schalten zu müssen. Ein Dachdecker in Köln hatte nach sechs Wochen 14.“ Dann: sofort zurück zur Frage. Nicht weiterreden.</p>
`,
      quellen: [
        "Rackham, N. (1988). <em>SPIN Selling</em>, Kapitel 7 (Preliminaries).",
        "Klaff, O. (2011). <em>Pitch Anything</em>. McGraw-Hill.",
        "Belfort, J. (2017). <em>Way of the Wolf</em>, Kapitel 3 (The First Four Seconds)."
      ],
      quiz: [
        { frage: "Was ist das Ziel eines Agenda-Frames?", optionen: ["Den Kunden zu beeindrucken", "Struktur, Zeit und Ziel festzulegen und ein erstes Ja zu bekommen", "Das Produkt vorzustellen", "Den Preis zu nennen"], richtig: 1, erklaerung: "Rahmen geben Kontrolle und produzieren das erste Commitment." },
        { frage: "Wie reagierst du auf „Ich habe nur 10 Minuten“?", optionen: ["Entschuldigen und hetzen", "Gespräch absagen", "Mit eigenem Rahmen kontern, ohne dich zu unterwerfen", "Ignorieren"], richtig: 2, erklaerung: "Power Frame nicht annehmen, eigenen Rahmen setzen." },
        { frage: "Was folgt laut Lektion direkt nach dem Zwei-Satz-Pitch?", optionen: ["Produktdetails", "Der Preis", "Sofort eine Frage an den Kunden", "Referenzen"], richtig: 2, erklaerung: "Pitch, dann zurück zum Kunden. Nicht weiterreden." }
      ],
      uebung: "Schreibe deinen Zwei-Satz-Pitch nach der Formel. Sprich ihn 20-mal laut, bis er unter 15 Sekunden dauert und ohne Füllwörter kommt. Nimm die beste Version auf."
    },
    {
      id: "v2",
      titel: "Challenger: Lehren statt gefallen",
      dauer: "12 Min",
      inhalt: `
<p>Die Corporate Executive Board (CEB, heute Gartner) befragte 2009 über 6.000 Vertriebsmitarbeiter in 90 Unternehmen. Matthew Dixon und Brent Adamson veröffentlichten die Ergebnisse 2011 als <em>The Challenger Sale</em>.</p>
<h2>Fünf Verkäufertypen</h2>
<table>
<tr><th>Typ</th><th>Merkmal</th><th>Anteil unter Top-Performern (komplexer Verkauf)</th></tr>
<tr><td>Hard Worker</td><td>Fleißig, ausdauernd, viele Kontakte</td><td>mittel</td></tr>
<tr><td>Relationship Builder</td><td>Baut Beziehungen, vermeidet Konflikt, will gefallen</td><td><strong>7 %</strong> (am schlechtesten)</td></tr>
<tr><td>Lone Wolf</td><td>Selbstbewusst, eigenwillig, schwer zu führen</td><td>hoch, aber selten</td></tr>
<tr><td>Problem Solver</td><td>Detailorientiert, kümmert sich um Umsetzung</td><td>niedrig</td></tr>
<tr><td><strong>Challenger</strong></td><td>Lehrt dem Kunden etwas Neues, passt die Botschaft an, übernimmt Kontrolle</td><td><strong>40 %</strong></td></tr>
</table>
<p>Die Überraschung: Der „nette“ Relationship Builder war der schwächste Typ. Kunden wollen keinen Freund, sie wollen jemanden, der ihnen eine neue Perspektive auf ihr Geschäft gibt.</p>
<h2>Teach, Tailor, Take Control</h2>
<ol>
<li><strong>Teach (Lehren):</strong> Bring dem Kunden eine Einsicht über sein eigenes Geschäft, die er nicht hatte. „Die meisten Betriebe Ihrer Größe verlieren 20 % ihrer Anfragen, weil sie nach 17 Uhr nicht erreichbar sind. Wussten Sie, wie viele es bei Ihnen sind?“ Das ist „Commercial Teaching“: Die Einsicht führt logisch zu deiner Lösung.</li>
<li><strong>Tailor (Anpassen):</strong> Dieselbe Botschaft für den Geschäftsführer (Umsatz), den Betriebsleiter (Zeit), den Einkäufer (Risiko). Jeder hört, was ihn bewegt.</li>
<li><strong>Take Control (Kontrolle übernehmen):</strong> Beim Geld und beim Prozess nicht nachgeben, sondern mit Spannung umgehen. Challenger diskutieren Preise, statt sofort Rabatte zu geben, und sie drängen auf Entscheidungen.</li>
</ol>
<h2>Die Choreografie des Challenger-Pitches</h2>
<ol class="steps">
<li><strong>Warmer:</strong> Zeige, dass du seine Welt verstehst.</li>
<li><strong>Reframe:</strong> Die überraschende Einsicht, die sein Problem neu rahmt.</li>
<li><strong>Rational Drowning:</strong> Daten, die zeigen, wie teuer das Problem wirklich ist.</li>
<li><strong>Emotional Impact:</strong> Eine Geschichte eines ähnlichen Kunden, in der er sich wiedererkennt.</li>
<li><strong>Ein neuer Weg:</strong> Was die Lösung grundsätzlich braucht (noch ohne dein Produkt).</li>
<li><strong>Deine Lösung:</strong> Erst jetzt dein Produkt.</li>
</ol>
<div class="callout warn"><span class="label">Kritik</span>Die CEB-Daten beruhen auf Manager-Einschätzungen, nicht auf Umsatzmessungen, und gelten für komplexe B2B-Verkäufe. Bei einfachen Verkäufen schnitten alle Typen ähnlich ab. Nutze Challenger als Haltung („Ich bringe Einsicht“), nicht als Dogma.</div>
`,
      quellen: [
        "Dixon, M., & Adamson, B. (2011). <em>The Challenger Sale: Taking Control of the Customer Conversation</em>. Portfolio/Penguin.",
        "Adamson, B., Dixon, M., & Toman, N. (2012). The End of Solution Sales. <em>Harvard Business Review</em>, Juli-August 2012.",
        "Corporate Executive Board (2009). Sales Executive Council Research."
      ],
      quiz: [
        { frage: "Welcher Verkäufertyp war bei komplexen Verkäufen am schwächsten?", optionen: ["Challenger", "Lone Wolf", "Relationship Builder", "Hard Worker"], richtig: 2, erklaerung: "Nur 7 % der Top-Performer waren Relationship Builder." },
        { frage: "Was bedeutet „Teach“ im Challenger-Modell?", optionen: ["Produktschulung", "Dem Kunden eine neue Einsicht über sein eigenes Geschäft geben", "Dem Kunden widersprechen", "Den Kunden belehren"], richtig: 1, erklaerung: "Commercial Teaching: eine Einsicht, die logisch zur Lösung führt." },
        { frage: "Wann kommt im Challenger-Pitch dein Produkt?", optionen: ["Ganz am Anfang", "Nach dem Warmer", "Zuletzt, nach Reframe, Daten, Geschichte und Lösungsweg", "Nie"], richtig: 2, erklaerung: "Das Produkt ist Schritt 6 von 6." }
      ],
      uebung: "Formuliere für dein Produkt eine „Reframe“-Einsicht: Eine Tatsache über das Geschäft deines Kunden, die er wahrscheinlich nicht kennt und die sein Problem größer macht. Belege sie mit einer Zahl oder Quelle."
    },
    {
      id: "v3",
      titel: "Einwandbehandlung",
      dauer: "14 Min",
      inhalt: `
<p>Ein Einwand ist kein Nein. Ein Einwand ist eine Frage in Verkleidung: „Überzeuge mich, dass das für mich funktioniert.“ Kunden ohne Einwände sind meist Kunden ohne Interesse.</p>
<h2>Die fünf echten Einwände</h2>
<p>Hinter hunderten Formulierungen stecken fast immer nur fünf Gründe:</p>
<ol>
<li><strong>Kein Bedarf</strong> (oder nicht erkannt): „Brauchen wir nicht.“ → Zurück zu SPIN, Implikationsfragen.</li>
<li><strong>Kein Vertrauen</strong> (in dich, die Firma, das Produkt): „Ich muss das erst prüfen.“ → Referenzen, Garantien, kleiner erster Schritt.</li>
<li><strong>Kein Geld</strong> (oder keine wahrgenommene Wertrelation): „Zu teuer.“ → Wert in Zahlen, Kosten des Nichtstuns, Aufteilung.</li>
<li><strong>Keine Eile:</strong> „Melden Sie sich nächstes Quartal.“ → Kosten der Verzögerung, echte Knappheit.</li>
<li><strong>Keine Entscheidungsbefugnis:</strong> „Ich muss das mit meinem Partner besprechen.“ → Entscheider ins Gespräch holen.</li>
</ol>
<h2>Die Methode: LAER</h2>
<ol class="steps">
<li><strong>Listen:</strong> Ausreden lassen. Vollständig. Nicht unterbrechen, nicht nicken wie ein Roboter.</li>
<li><strong>Acknowledge:</strong> Labeln (Voss): „Es klingt, als wäre das Budget gerade eng.“ Nie „Ja, aber“. Immer „Ja, und“ oder einfach eine Pause.</li>
<li><strong>Explore:</strong> Spiegeln und kalibrierte Fragen: „Zu teuer im Vergleich wozu?“, „Was müsste passieren, damit es sich rechnet?“, „Wenn der Preis kein Thema wäre, würden Sie es dann machen?“ (isoliert den echten Einwand).</li>
<li><strong>Respond:</strong> Erst jetzt antworten, kurz, mit Beleg. Dann eine Frage, die prüft, ob es gelöst ist: „Beantwortet das Ihre Sorge?“</li>
</ol>
<h2>Belforts Looping</h2>
<p>Jordan Belfort beschreibt in <em>Way of the Wolf</em>, dass die meisten Einwände „Nebelwände“ sind: Der Kunde sagt „Ich muss nachdenken“, meint aber „Ich bin noch nicht sicher genug“. Seine Methode: Den Einwand kurz anerkennen, dann zurück in die Präsentation („loopen“) und die Gewissheit auf einer der drei Skalen (Produkt, du, Firma) erhöhen, dann erneut abschließen. Nie denselben Einwand zweimal mit demselben Argument beantworten.</p>
<h2>Preis-Einwände konkret</h2>
<ul>
<li>Nie sofort rabattieren. Ein schneller Rabatt sagt: „Der erste Preis war eine Lüge.“</li>
<li>„Zu teuer“ → „Ich verstehe. Was genau vergleichen Sie?“ (Oft gibt es keinen Vergleich.)</li>
<li>Aufteilen: 3.600 Euro im Jahr sind 10 Euro am Tag. Gegenrechnen: Was kostet das Problem pro Tag?</li>
<li>Wenn Rabatt, dann gegen Gegenleistung: Vorkasse, längere Laufzeit, Referenz, Empfehlung. Nie umsonst.</li>
</ul>
<div class="callout practice"><span class="label">Bootcamp</span>In den Rollenspielen bekommst du jeden dieser fünf Einwände mehrfach in unterschiedlicher Verkleidung. Der Coach prüft, ob du LAER einhältst.</div>
<div class="callout study"><div class="label">Neu aus der Forschung</div><strong>Nenne den Einwand selbst, bevor der Kunde es tut.</strong> O'Keefes Meta-Analyse (1999) über zweiseitige Botschaften: Wer das Gegenargument selbst anspricht UND entkräftet, überzeugt stärker als einseitige Botschaften. Wer es nur erwähnt, ohne es zu entkräften, überzeugt schwächer. Banas und Rains (2010) belegen zusätzlich die Inokulation: Warnst du den Kunden vor, was der Wettbewerber sagen wird, und widerlegst es kurz, wirkt das Argument später schwächer. Und Rains (2013): Druck erzeugt Reaktanz, also Widerstand gegen die Botschaft selbst. Je freier sich der Kunde fühlt, desto eher sagt er Ja.</div>
`,
      quellen: [
        "Belfort, J. (2017). <em>Way of the Wolf</em>, Kapitel 11-12 (Looping, Objections).",
        "Voss, C. (2016). <em>Never Split the Difference</em>, Kapitel 3-4.",
        "Rackham, N. (1988). <em>SPIN Selling</em>, Kapitel 6 (Preventing Objections).",
        "Gong Labs (2019). Analysis of pricing objections in 25,537 sales calls. gong.io.",
        "O'Keefe, D. J. (1999). How to handle opposing arguments in persuasive messages: A meta-analytic review of the effects of one-sided and two-sided messages. <em>Communication Yearbook</em>, 22, 209-249.",
        "Banas, J. A., & Rains, S. A. (2010). A meta-analysis of research on inoculation theory. <em>Communication Monographs</em>, 77(3), 281-311.",
        "Rains, S. A. (2013). The nature of psychological reactance revisited: A meta-analytic review. <em>Human Communication Research</em>, 39(1), 47-73."
      ],
      quiz: [
        { frage: "Was ist ein Einwand in Wahrheit meist?", optionen: ["Ein endgültiges Nein", "Eine Frage in Verkleidung", "Eine Beleidigung", "Ein Zeichen von Desinteresse"], richtig: 1, erklaerung: "Kunden ohne Einwände sind meist Kunden ohne Interesse." },
        { frage: "Was ist der erste Schritt in LAER?", optionen: ["Antworten", "Argumentieren", "Vollständig zuhören", "Rabatt anbieten"], richtig: 2, erklaerung: "Listen: ausreden lassen, nicht unterbrechen." },
        { frage: "Wie isolierst du einen Einwand?", optionen: ["Ignorieren", "„Wenn X kein Thema wäre, würden Sie es dann machen?“", "Sofort Rabatt", "Das Thema wechseln"], richtig: 1, erklaerung: "Die Isolationsfrage zeigt, ob der genannte Einwand der echte ist." },
        { frage: "Was signalisiert ein sofortiger Rabatt?", optionen: ["Großzügigkeit", "Dass der erste Preis nicht ernst gemeint war", "Professionalität", "Vertrauen"], richtig: 1, erklaerung: "Rabatt nur gegen Gegenleistung, nie sofort." },
        {"frage": "Welche Botschaft überzeugt laut O'Keefe (1999) am stärksten?", "optionen": ["Einseitig: nur die eigenen Vorteile", "Zweiseitig, Gegenargument genannt und entkräftet", "Zweiseitig, Gegenargument nur genannt", "Gar keine Argumente, nur Emotionen"], "richtig": 1, "erklaerung": "Refutational two-sided schlägt einseitig; nonrefutational two-sided ist am schwächsten."},
        {"frage": "Was bedeutet Inokulation (Banas & Rains, 2010) im Verkauf?", "optionen": ["Den Kunden mit Argumenten überschütten", "Den Kunden vorab vor Gegenargumenten warnen und sie kurz widerlegen", "Den Wettbewerber schlechtmachen", "Einwände ignorieren"], "richtig": 1, "erklaerung": "Eine abgeschwächte Dosis des Gegenarguments plus Widerlegung macht später resistent dagegen."}
      ],
      uebung: "Schreibe für dein Produkt zu jedem der fünf Einwandtypen eine LAER-Antwort auf. Dann spiele sie im Coach-Rollenspiel durch."
    },
    {
      id: "v4",
      titel: "Der Abschluss",
      dauer: "12 Min",
      inhalt: `
<p>Der Abschluss ist kein Trick am Ende, sondern die logische Folge eines gut geführten Gesprächs. Wenn du abschließen musst wie ein Ringer, hast du vorher Fehler gemacht. Trotzdem: Du musst fragen. Die meisten Verkäufer fragen nie.</p>
<h2>Was die Daten sagen</h2>
<ul>
<li>Rackham: Bei großen Verkäufen schaden aggressive Closing-Techniken. Was funktioniert: ein klarer Vorschlag für den nächsten Schritt.</li>
<li>Gong: Gespräche mit konkretem, terminiertem nächsten Schritt haben ein Vielfaches an Abschlüssen.</li>
<li>Die meisten Abschlüsse erfolgen nicht beim ersten Gespräch, sondern nach 5-8 Kontakten. Der „Abschluss“ eines Erstgesprächs ist der Folgetermin.</li>
</ul>
<h2>Abschlusstechniken, die nicht manipulativ sind</h2>
<ol>
<li><strong>Zusammenfassungs-Abschluss:</strong> „Sie haben gesagt, X kostet Sie monatlich Y. Wir lösen X durch Z. Sollen wir starten?“ Nutzt die eigenen Worte des Kunden (Commitment).</li>
<li><strong>Nächster-Schritt-Abschluss:</strong> „Der logische nächste Schritt wäre ein Testlauf mit zwei Mitarbeitern. Passt Ihnen Montag oder Mittwoch?“</li>
<li><strong>Direkte Frage:</strong> „Wollen wir das machen?“ Dann Stille. Keine Angst vor der Stille.</li>
<li><strong>Bedingter Abschluss:</strong> „Wenn ich Ihnen die Lieferung bis Freitag garantiere, sind wir dann im Geschäft?“ Nur mit echtem Zugeständnis.</li>
<li><strong>Probe-Abschluss (Trial Close):</strong> Früh im Gespräch Temperatur messen: „Wie klingt das bisher für Sie?“ Antwort zeigt, ob du weiter Bedarf aufbauen musst.</li>
</ol>
<h2>Belforts Abschluss-Logik</h2>
<p>Belfort: Du darfst erst abschließen, wenn der Kunde auf allen drei Skalen (Produkt, Verkäufer, Firma) nahe 10 ist UND seine Aktionsschwelle niedrig genug ist (er traut sich, zu entscheiden) UND seine Schmerzschwelle hoch genug (das Problem tut genug weh). Fehlt eines, loopst du zurück. Das ist Belforts Version von SPIN plus Vertrauen.</p>
<h2>Nach dem Ja</h2>
<ul>
<li>Nicht weiterverkaufen. Jeder Satz nach dem Ja kann es rückgängig machen.</li>
<li>Bestätigen, bedanken, nächsten Schritt konkretisieren, gehen.</li>
<li>Kaufreue verhindern: Innerhalb von 24 Stunden eine Bestätigung mit den vom Kunden genannten Gründen senden. Das festigt das Commitment.</li>
</ul>
<h2>Nach dem Nein</h2>
<p>„Darf ich fragen, was den Ausschlag gegeben hat?“ Die Antwort ist wertvoller als der Abschluss, weil sie die nächsten zehn Gespräche verbessert. Und: Tür offen halten. „Darf ich mich in drei Monaten melden?“</p>
`,
      quellen: [
        "Rackham, N. (1988). <em>SPIN Selling</em>, Kapitel 2 (Obtaining Commitment: Closing the Sale).",
        "Belfort, J. (2017). <em>Way of the Wolf</em>, Kapitel 2 (The Three Tens), Kapitel 12.",
        "Gong Labs (2018). Next steps and close rates. gong.io.",
        "Dixon, M., & Adamson, B. (2011). <em>The Challenger Sale</em>, Kapitel 7 (Taking Control)."
      ],
      quiz: [
        { frage: "Was ist laut Rackham der sinnvolle „Abschluss“ eines Erstgesprächs bei komplexen Verkäufen?", optionen: ["Die Unterschrift", "Ein Rabatt", "Ein konkreter, terminierter nächster Schritt", "Eine Visitenkarte"], richtig: 2, erklaerung: "Große Verkäufe brauchen mehrere Kontakte. Der nächste Schritt ist das Ziel." },
        { frage: "Was solltest du direkt nach dem Ja tun?", optionen: ["Weitere Vorteile nennen", "Bestätigen, bedanken, nächsten Schritt klären, gehen", "Rabatt anbieten", "Über die Konkurrenz sprechen"], richtig: 1, erklaerung: "Jeder Satz nach dem Ja kann es rückgängig machen." },
        { frage: "Welche drei Bedingungen nennt Belfort für den Abschluss?", optionen: ["Preis, Zeit, Ort", "Drei Zehnen, niedrige Aktionsschwelle, hohe Schmerzschwelle", "Produkt, Rabatt, Garantie", "Sympathie, Humor, Geschenk"], richtig: 1, erklaerung: "Fehlt eine, wird geloopt." },
        { frage: "Was ist ein Trial Close?", optionen: ["Ein Probeabo", "Eine frühe Temperaturmessung („Wie klingt das bisher?“)", "Ein Gerichtsverfahren", "Der letzte Satz"], richtig: 1, erklaerung: "Zeigt, ob du weiter Bedarf aufbauen musst." }
      ],
      uebung: "Formuliere drei Abschlussfragen für dein Produkt (Zusammenfassung, nächster Schritt, direkt). Übe, jede zu stellen und dann 5 Sekunden zu schweigen. Nimm es auf und prüfe, ob du die Stille hältst."
    }
  ]
});

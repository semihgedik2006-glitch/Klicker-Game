KURSE.push({
  id: "psychologie",
  nr: 2,
  titel: "Überzeugungspsychologie",
  untertitel: "Cialdini, Kahneman, Munger: die wissenschaftlich belegten Hebel menschlicher Entscheidungen",
  beschreibung: "Hier lernst du die Mechanik hinter jeder Kaufentscheidung. Jede Technik ist mit dem Originalexperiment belegt, und bei jeder lernst du auch, sie bei dir selbst zu erkennen.",
  lektionen: [
    {
      id: "p1",
      titel: "Reziprozität und Commitment",
      dauer: "14 Min",
      inhalt: `
<p>Robert Cialdini, Professor für Psychologie an der Arizona State University, verbrachte drei Jahre undercover bei Autoverkäufern, Spendensammlern und Versicherungsvertretern. Sein Buch <em>Influence</em> (1984) ist das meistzitierte Werk zur Überzeugung. Wir gehen seine Prinzipien in drei Lektionen durch.</p>
<h2>1. Reziprozität: Wer gibt, bekommt</h2>
<p>Menschen fühlen sich verpflichtet, Gefälligkeiten zu erwidern. Das Experiment: Dennis Regan (1971) ließ einen Komplizen Probanden eine Cola schenken. Später bat der Komplize, Lose zu kaufen. Beschenkte kauften doppelt so viele wie Unbeschenkte, und zwar unabhängig davon, ob sie den Komplizen sympathisch fanden.</p>
<p><strong>Anwendung:</strong> Gib zuerst. Eine echte Information, ein Tipp, eine Analyse, eine Probe. Nicht als Trick, sondern als Haltung: Du bist derjenige, der Wert liefert, bevor er fragt. Kellner, die mit der Rechnung ein Bonbon bringen, bekommen 3 % mehr Trinkgeld. Mit zwei Bonbons 14 %. Mit einem Bonbon, kurzem Weggehen und dann „für Sie noch eins“: 23 % (Strohmetz et al., 2002).</p>
<p><strong>Variante „Door in the face“:</strong> Erst eine große Bitte, die abgelehnt wird, dann eine kleinere. Die kleinere wirkt wie ein Zugeständnis, das erwidert werden muss. Cialdini (1975): Studenten, die erst gebeten wurden, zwei Jahre ehrenamtlich zu arbeiten (abgelehnt), stimmten zu 50 % einem Zoo-Ausflug zu, gegenüber 17 % bei direkter Frage.</p>
<h2>2. Commitment und Konsistenz: Kleine Ja führen zu großen Ja</h2>
<p>Menschen wollen konsistent mit dem erscheinen, was sie bereits gesagt oder getan haben. Freedman und Fraser (1966): Hausbesitzer, die zuvor ein kleines Schild „Fahr vorsichtig“ ins Fenster gestellt hatten, stimmten zu 76 % einem riesigen hässlichen Schild im Vorgarten zu. Ohne Vorab-Bitte: 17 %. Das ist die „Foot in the door“-Technik.</p>
<p><strong>Anwendung im Verkauf:</strong></p>
<ul>
<li>Lass den Kunden früh kleine Zustimmungen aussprechen („Wäre es für Sie wichtig, dass...?“ „Ja.“).</li>
<li>Lass ihn seine Ziele selbst formulieren. Was er selbst gesagt hat, verteidigt er.</li>
<li>Schriftliche Commitments sind stärker als mündliche. Öffentliche stärker als private.</li>
</ul>
<div class="callout warn"><span class="label">Bei dir selbst erkennen</span>Wenn du merkst, dass du einer Entscheidung zustimmst, nur weil du vorher etwas Ähnliches gesagt hast: Stopp. Frag dich, ob du sie heute, ohne Vorgeschichte, auch treffen würdest.</div>
`,
      quellen: [
        "Cialdini, R. B. (2021). <em>Influence, New and Expanded: The Psychology of Persuasion</em>. Harper Business. (Deutsch: <em>Die Psychologie des Überzeugens</em>, Hogrefe)",
        "Regan, D. T. (1971). Effects of a favor and liking on compliance. <em>Journal of Experimental Social Psychology</em>, 7(6), 627-639.",
        "Freedman, J. L., & Fraser, S. C. (1966). Compliance without pressure: The foot-in-the-door technique. <em>Journal of Personality and Social Psychology</em>, 4(2), 195-202.",
        "Cialdini, R. B. et al. (1975). Reciprocal concessions procedure for inducing compliance: The door-in-the-face technique. <em>JPSP</em>, 31(2), 206-215.",
        "Strohmetz, D. B. et al. (2002). Sweetening the till: The use of candy to increase restaurant tipping. <em>Journal of Applied Social Psychology</em>, 32(2), 300-309."
      ],
      quiz: [
        { frage: "Was zeigte Regans Cola-Experiment (1971)?", optionen: ["Sympathie ist wichtiger als Gefälligkeiten", "Beschenkte kauften doppelt so viele Lose, unabhängig von Sympathie", "Geschenke wirken nur bei Freunden", "Geschenke senken die Kaufbereitschaft"], richtig: 1, erklaerung: "Reziprozität wirkte sogar stärker als Sympathie." },
        { frage: "Wie funktioniert die „Foot in the door“-Technik?", optionen: ["Erst große Bitte, dann kleine", "Erst kleine Bitte, dann große", "Nur eine Bitte, sehr direkt", "Bitte mit Drohung verbinden"], richtig: 1, erklaerung: "Kleine Zustimmung zuerst (Fensterschild), dann die große (Vorgartenschild): 76 % statt 17 %." },
        { frage: "Welche Bonbon-Variante brachte das meiste Trinkgeld?", optionen: ["Ein Bonbon", "Zwei Bonbons", "Ein Bonbon, dann zurückkommen und noch eins geben", "Kein Bonbon, aber ein Lächeln"], richtig: 2, erklaerung: "Die personalisierte, unerwartete Geste wirkte am stärksten: +23 %." },
        { frage: "Welche Art Commitment ist am stärksten?", optionen: ["Privat und mündlich", "Öffentlich und schriftlich", "Anonym", "Durch Dritte ausgesprochen"], richtig: 1, erklaerung: "Öffentlich, schriftlich und selbst gewählt: das verteidigt man am stärksten." }
      ],
      uebung: "Gib heute drei Menschen etwas von Wert, ohne eine Gegenleistung zu erwarten (eine nützliche Info, eine Empfehlung, Hilfe). Beobachte 48 Stunden, was zurückkommt. Notiere es."
    },
    {
      id: "p2",
      titel: "Soziale Bewährtheit, Sympathie, Autorität",
      dauer: "14 Min",
      inhalt: `
<h2>3. Soziale Bewährtheit: Was andere tun, muss richtig sein</h2>
<p>Bei Unsicherheit orientieren wir uns an anderen. Goldstein, Cialdini und Griskevicius (2008) testeten Hotel-Handtuchschilder: „Helfen Sie der Umwelt“ brachte 35 % Wiederverwendung. „Die meisten Gäste verwenden ihre Handtücher wieder“ brachte 44 %. „Die meisten Gäste in diesem Zimmer“ brachte 49 %. Je ähnlicher die Referenzgruppe, desto stärker.</p>
<p><strong>Anwendung:</strong> Referenzen, Testimonials und Zahlen („über 400 Betriebe in Ihrer Region“). Entscheidend ist Ähnlichkeit: Ein Bäcker glaubt einem anderen Bäcker, nicht einem Konzern.</p>
<p><strong>Gefahr:</strong> Negative soziale Bewährtheit. „Leider zahlen viele Kunden zu spät“ erhöht Zahlungsverzug, weil es ihn normalisiert. Formuliere immer das gewünschte Verhalten als Norm.</p>
<h2>4. Sympathie: Wir kaufen von Menschen, die wir mögen</h2>
<p>Fünf Faktoren laut Cialdini: physische Attraktivität, Ähnlichkeit, Komplimente, Kontakt und Kooperation, Assoziation. Die stärksten davon kannst du steuern: <strong>Ähnlichkeit</strong> (gemeinsame Interessen, Herkunft, Sprache) und <strong>ehrliche Komplimente</strong>. Tupperware-Partys funktionieren ausschließlich über Sympathie: Man kauft bei der Freundin, nicht bei der Firma.</p>
<p>Studie: Verhandler, die vor der Verhandlung fünf Minuten Smalltalk über Gemeinsamkeiten führten, kamen zu 18 % häufiger zu einer Einigung als jene, die sofort begannen (Morris et al., 2002, E-Mail-Verhandlungen).</p>
<h2>5. Autorität: Symbole wirken stärker als Substanz</h2>
<p>Milgrams Gehorsamsexperimente (1963): 65 % der Probanden verabreichten auf Anweisung eines Mannes im Laborkittel vermeintlich tödliche Stromschläge. Der Kittel war das Symbol. Cialdini nennt drei Autoritätssymbole: Titel, Kleidung, Statussymbole. Bickman (1974): Ein Mann in Wachuniform, der Passanten aufforderte, einem Fremden Kleingeld zu geben, erreichte 92 % Folgsamkeit. In Zivil: 42 %.</p>
<p><strong>Anwendung:</strong> Lass deine Expertise sichtbar werden, bevor du sie brauchst. Qualifikationen, Erfahrung, Zahlen, am besten durch Dritte eingeführt. Cialdini beschreibt eine Immobilienfirma, die Anrufer mit „Ich verbinde Sie mit Herrn X, unserem Leiter für Vermietung mit 20 Jahren Erfahrung“ weiterleitete: 20 % mehr Beratungstermine, 15 % mehr Abschlüsse.</p>
<div class="callout study"><span class="label">Die ehrliche Schwäche</span>Autorität steigt, wenn du zuerst eine kleine Schwäche zugibst und dann die Stärke nennst. „Unser Preis liegt etwas höher, dafür...“ wirkt glaubwürdiger als reines Lob. Das nutzte Avis mit „We're number two. We try harder.“</div>
`,
      quellen: [
        "Goldstein, N. J., Cialdini, R. B., & Griskevicius, V. (2008). A room with a viewpoint: Using social norms to motivate environmental conservation in hotels. <em>Journal of Consumer Research</em>, 35(3), 472-482.",
        "Milgram, S. (1963). Behavioral study of obedience. <em>Journal of Abnormal and Social Psychology</em>, 67(4), 371-378.",
        "Bickman, L. (1974). The social power of a uniform. <em>Journal of Applied Social Psychology</em>, 4(1), 47-61.",
        "Morris, M., Nadler, J., Kurtzberg, T., & Thompson, L. (2002). Schmooze or lose: Social friction and lubrication in e-mail negotiations. <em>Group Dynamics</em>, 6(1), 89-100."
      ],
      quiz: [
        { frage: "Welches Hotel-Schild erzeugte die höchste Handtuch-Wiederverwendung?", optionen: ["Helfen Sie der Umwelt", "Die meisten Gäste verwenden wieder", "Die meisten Gäste in diesem Zimmer verwenden wieder", "Bitte nicht wechseln"], richtig: 2, erklaerung: "Je ähnlicher und näher die Referenzgruppe, desto stärker die soziale Bewährtheit (49 %)." },
        { frage: "Wie hoch war die Folgsamkeit bei Bickmans Mann in Uniform?", optionen: ["42 %", "65 %", "92 %", "12 %"], richtig: 2, erklaerung: "92 % in Uniform gegenüber 42 % in Zivil. Symbole der Autorität wirken." },
        { frage: "Warum ist „Leider zahlen viele Kunden zu spät“ ein Fehler?", optionen: ["Es ist unhöflich", "Es normalisiert das unerwünschte Verhalten", "Es ist zu lang", "Es ist rechtlich problematisch"], richtig: 1, erklaerung: "Negative soziale Bewährtheit: Man sagt den Leuten, dass Zuspätzahlen normal ist." },
        { frage: "Was erhöht die Glaubwürdigkeit einer Stärke-Aussage?", optionen: ["Sie dreimal wiederholen", "Zuerst eine kleine Schwäche zugeben", "Laut sprechen", "Fachbegriffe verwenden"], richtig: 1, erklaerung: "Schwäche zuerst, dann Stärke: das Muster von Avis „We try harder“." }
      ],
      uebung: "Schreibe deine eigene Autoritäts-Einleitung in zwei Sätzen: Wer bist du, warum bist du kompetent, was hast du erreicht? Dann formuliere sie so um, wie ein Dritter dich vorstellen würde. Übe beide Versionen laut vor dem Spiegel, dreimal."
    },
    {
      id: "p3",
      titel: "Knappheit und Einheit",
      dauer: "10 Min",
      inhalt: `
<h2>6. Knappheit: Was selten ist, wirkt wertvoller</h2>
<p>Worchel, Lee und Adewole (1975) ließen Probanden Kekse aus einem Glas bewerten. Glas mit zwei Keksen: besser bewertet als Glas mit zehn. Noch besser: Wenn das Glas erst zehn hatte und dann auf zwei reduziert wurde. Am besten: Wenn die Reduktion durch Nachfrage anderer erklärt wurde.</p>
<p>Das ist das Herz der Verlustaversion (siehe Kahneman-Lektion): Die Aussicht, etwas zu verlieren, motiviert stärker als die Aussicht, etwas zu gewinnen.</p>
<p><strong>Anwendung:</strong></p>
<ul>
<li>Begrenzte Stückzahl, begrenzte Zeit, begrenzter Zugang: alles wirkt, aber nur, wenn es WAHR ist. Fake-Knappheit zerstört Vertrauen beim ersten Erkennen.</li>
<li>Exklusive Information: „Das wissen bisher nur wenige Kunden“ erhöht den wahrgenommenen Wert der Information.</li>
<li>Formuliere Verluste, nicht Gewinne: „Sie verlieren jeden Monat 400 Euro durch...“ statt „Sie sparen 400 Euro“.</li>
</ul>
<h2>7. Einheit (Unity): „Wir“ statt „Sie und ich“</h2>
<p>Das siebte Prinzip fügte Cialdini 2016 in <em>Pre-Suasion</em> hinzu. Menschen lassen sich am stärksten von jenen beeinflussen, mit denen sie eine gemeinsame Identität teilen: Familie, Heimat, Verein, Ethnie, Beruf. Es geht nicht um Ähnlichkeit (Sympathie), sondern um Zugehörigkeit: „Einer von uns“.</p>
<p>Beispiel: Buffett schreibt seine Aktionärsbriefe so, als spreche er mit seinen Schwestern. Er nennt die Aktionäre „Partner“. Das ist Einheit.</p>
<p><strong>Anwendung:</strong> Finde die Gruppe, zu der ihr beide gehört, und benenne sie. „Wir Unternehmer wissen...“, „Als jemand, der auch aus dieser Region kommt...“. Gemeinsame Gegner wirken ebenfalls (der Markt, die Bürokratie, der Wettbewerber).</p>
<div class="callout warn"><span class="label">Grenze</span>Knappheit ist die am häufigsten missbrauchte Technik. Countdown-Timer, die nach Ablauf neu starten, erfundene „nur noch 3 verfügbar“: Das ist Betrug, und Kunden merken es. Nutze Knappheit nur, wenn sie real ist.</div>
`,
      quellen: [
        "Worchel, S., Lee, J., & Adewole, A. (1975). Effects of supply and demand on ratings of object value. <em>JPSP</em>, 32(5), 906-914.",
        "Cialdini, R. B. (2016). <em>Pre-Suasion: A Revolutionary Way to Influence and Persuade</em>. Simon & Schuster.",
        "Kahneman, D., & Tversky, A. (1979). Prospect theory: An analysis of decision under risk. <em>Econometrica</em>, 47(2), 263-291."
      ],
      quiz: [
        { frage: "Welches Keks-Glas wurde am höchsten bewertet?", optionen: ["Zehn Kekse", "Zwei Kekse von Anfang an", "Von zehn auf zwei reduziert wegen Nachfrage anderer", "Leeres Glas"], richtig: 2, erklaerung: "Knappheit durch Nachfrage anderer kombiniert Knappheit mit sozialer Bewährtheit." },
        { frage: "Was unterscheidet Einheit von Sympathie?", optionen: ["Nichts", "Einheit beruht auf geteilter Identität, Sympathie auf Ähnlichkeit und Mögen", "Einheit ist schwächer", "Einheit gilt nur in Familien"], richtig: 1, erklaerung: "Einheit heißt „einer von uns“, nicht nur „ich mag dich“." },
        { frage: "Welche Formulierung nutzt Verlustaversion?", optionen: ["Sie sparen 400 Euro", "Sie gewinnen 400 Euro", "Sie verlieren jeden Monat 400 Euro", "400 Euro sind möglich"], richtig: 2, erklaerung: "Verluste wiegen etwa doppelt so schwer wie gleich große Gewinne." }
      ],
      uebung: "Formuliere für ein Produkt oder eine Dienstleistung deiner Wahl drei Sätze: einen mit echter Knappheit, einen mit Verlust-Framing, einen mit Einheit. Sprich sie laut und nimm dich auf."
    },
    {
      id: "p4",
      titel: "Kahneman: Anker, Framing, Verlustaversion",
      dauer: "16 Min",
      inhalt: `
<p>Daniel Kahneman erhielt 2002 den Wirtschaftsnobelpreis für Arbeiten, die er mit Amos Tversky begann. Ihr Kern: Menschen entscheiden nicht rational. Sie nutzen Abkürzungen (Heuristiken), die systematisch zu Fehlern führen. Diese Fehler sind vorhersagbar, und wer sie kennt, versteht Kaufentscheidungen.</p>
<h2>System 1 und System 2</h2>
<p><strong>System 1</strong>: schnell, automatisch, emotional, mühelos. <strong>System 2</strong>: langsam, bewusst, anstrengend, faul. Die meisten Kaufentscheidungen trifft System 1, und System 2 liefert danach die Begründung. Dein Ziel als Verkäufer: System 1 ein gutes Gefühl geben und System 2 gute Argumente, damit es die Entscheidung absegnet.</p>
<h2>Der Ankereffekt</h2>
<p>Tversky und Kahneman (1974) drehten ein manipuliertes Glücksrad, das bei 10 oder 65 stehen blieb. Danach fragten sie: Wie viel Prozent der UN-Staaten sind afrikanisch? Gruppe „10“ schätzte im Mittel 25 %, Gruppe „65“ schätzte 45 %. Eine zufällige Zahl verschob die Schätzung massiv.</p>
<p><strong>Im Verkauf:</strong> Die erste Zahl im Gespräch wird zum Anker. Wer zuerst einen Preis nennt, setzt den Rahmen. Nenne den hochwertigen Preis zuerst, dann die günstigere Option. Northcraft und Neale (1987): Selbst Immobilienprofis ließen sich vom genannten Listenpreis um bis zu 12 % in ihrer Bewertung verschieben.</p>
<h2>Verlustaversion</h2>
<p>Prospect Theory (1979): Der Schmerz eines Verlustes ist etwa doppelt so stark wie die Freude über einen gleich großen Gewinn. Verlustaversion wurde 2020 in einer Replikation in 19 Ländern mit über 4.000 Teilnehmern bestätigt (Ruggeri et al.).</p>
<p><strong>Im Verkauf:</strong> Kostenlose Testphasen funktionieren, weil der Kunde das Produkt danach nicht mehr „verlieren“ will (Endowment-Effekt: Kahneman, Knetsch & Thaler 1990, das Tassen-Experiment: Besitzer verlangten etwa das Doppelte dessen, was Käufer zahlen wollten).</p>
<h2>Framing</h2>
<p>Dasselbe Faktum, anders verpackt, erzeugt andere Entscheidungen. „90 % Überlebensrate“ wird anders bewertet als „10 % Sterblichkeit“ (McNeil et al., 1982, sogar bei Ärzten). „Hackfleisch 75 % mager“ schmeckt besser als „25 % Fett“ (Levin & Gaeth, 1988).</p>
<h2>Der Decoy-Effekt</h2>
<p>Dan Ariely testete das Abo-Angebot des <em>Economist</em>: Online 59 $, Print 125 $, Print+Online 125 $. Mit der sinnlosen Print-Option wählten 84 % das Kombi-Paket. Ohne sie: 32 %. Eine dritte, offensichtlich schlechtere Option lenkt die Wahl auf die, die du verkaufen willst.</p>
<div class="callout warn"><span class="label">Ehrliche Einordnung</span>Nicht alles aus <em>Thinking, Fast and Slow</em> hat die Replikationskrise überstanden. Das Kapitel über Priming (z. B. „Wer an Alter denkt, geht langsamer“) gilt heute als unzuverlässig; Kahneman selbst räumte das 2017 öffentlich ein. Anker, Verlustaversion und Framing dagegen sind robust repliziert.</div>
<div class="callout study"><div class="label">Neu aus der Forschung</div><strong>Preise umrahmen, zu viele Optionen, und wie klein Effekte draußen sind.</strong> Gourville (1998): „Ein Euro am Tag“ statt „365 Euro im Jahr“ erhöht die Zustimmung, weil die Summe mit Kleinausgaben verglichen wird. Scheibehenne, Greifeneder und Todd (2010, Meta-Analyse): Der berühmte Marmeladen-Effekt (zu viele Optionen lähmen) ist im Mittel null; er tritt nur unter bestimmten Bedingungen auf. DellaVigna und Linos (2022) verglichen 126 Nudge-Studien aus der Forschung mit 241 echten Behörden-Einsätzen: Im Feld waren die Effekte etwa sechsmal kleiner (1,4 statt 8,7 Prozentpunkte). Merke: Psychologische Effekte sind real, aber kleiner als die Bücher behaupten. Verlass dich auf Fragen und Nutzen, nicht auf Tricks.</div>
`,
      quellen: [
        "Kahneman, D. (2011). <em>Thinking, Fast and Slow</em>. Farrar, Straus and Giroux. (Deutsch: <em>Schnelles Denken, langsames Denken</em>)",
        "Tversky, A., & Kahneman, D. (1974). Judgment under uncertainty: Heuristics and biases. <em>Science</em>, 185(4157), 1124-1131.",
        "Kahneman, D., & Tversky, A. (1979). Prospect theory. <em>Econometrica</em>, 47(2), 263-291.",
        "Ruggeri, K. et al. (2020). Replicating patterns of prospect theory for decision under risk. <em>Nature Human Behaviour</em>, 4, 622-633.",
        "Kahneman, D., Knetsch, J. L., & Thaler, R. H. (1990). Experimental tests of the endowment effect and the Coase theorem. <em>Journal of Political Economy</em>, 98(6), 1325-1348.",
        "Northcraft, G. B., & Neale, M. A. (1987). Experts, amateurs, and real estate. <em>Organizational Behavior and Human Decision Processes</em>, 39(1), 84-97.",
        "Ariely, D. (2008). <em>Predictably Irrational</em>. HarperCollins.",
        "Levin, I. P., & Gaeth, G. J. (1988). How consumers are affected by the framing of attribute information. <em>Journal of Consumer Research</em>, 15(3), 374-378.",
        "Gourville, J. T. (1998). Pennies-a-day: The effect of temporal reframing on transaction evaluation. <em>Journal of Consumer Research</em>, 24(4), 395-408.",
        "Scheibehenne, B., Greifeneder, R., & Todd, P. M. (2010). Can there ever be too many options? A meta-analytic review of choice overload. <em>Journal of Consumer Research</em>, 37(3), 409-425.",
        "DellaVigna, S., & Linos, E. (2022). RCTs to scale: Comprehensive evidence from two nudge units. <em>Econometrica</em>, 90(1), 81-116."
      ],
      quiz: [
        { frage: "Was zeigte das Glücksrad-Experiment (1974)?", optionen: ["Menschen schätzen Prozentzahlen gut", "Eine zufällige Zahl verschiebt spätere Schätzungen (Anker)", "Afrikanische Staaten sind unterrepräsentiert", "Glücksräder sind manipulierbar"], richtig: 1, erklaerung: "Anker 10 führte zu 25 %, Anker 65 zu 45 %." },
        { frage: "Wie stark wiegt ein Verlust im Vergleich zu einem gleich großen Gewinn?", optionen: ["Gleich", "Etwa halb so stark", "Etwa doppelt so stark", "Zehnmal so stark"], richtig: 2, erklaerung: "Verlustaversion: Faktor etwa 2, mehrfach repliziert." },
        { frage: "Was bewirkte die Print-Option im Economist-Experiment?", optionen: ["Mehr Print-Verkäufe", "Sie lenkte 84 % auf das Kombi-Paket (Decoy)", "Sie senkte den Umsatz", "Nichts"], richtig: 1, erklaerung: "Eine offensichtlich schlechtere Option macht die Zieloption attraktiv." },
        { frage: "Welcher Teil von Kahnemans Buch gilt als nicht zuverlässig repliziert?", optionen: ["Verlustaversion", "Ankereffekt", "Soziales Priming", "Framing"], richtig: 2, erklaerung: "Kahneman räumte 2017 ein, dem Priming-Kapitel zu sehr vertraut zu haben." },
        { frage: "Was ist der Endowment-Effekt?", optionen: ["Man bewertet, was man besitzt, höher", "Man kauft lieber teuer", "Geschenke senken den Wert", "Besitz macht gleichgültig"], richtig: 0, erklaerung: "Besitzer der Tasse verlangten etwa das Doppelte dessen, was Käufer zahlen wollten." },
        {"frage": "Was ergab die Meta-Analyse von Scheibehenne et al. (2010) zum Choice Overload?", "optionen": ["Mehr Optionen lähmen immer", "Im Mittel kein Effekt, nur unter Bedingungen", "Weniger Optionen schaden immer", "Der Effekt wurde nie untersucht"], "richtig": 1, "erklaerung": "Der mittlere Effekt lag nahe null. Der Marmeladen-Effekt ist kein Naturgesetz."},
        {"frage": "Um wie viel kleiner waren Nudge-Effekte im echten Behördeneinsatz als in der Forschung (DellaVigna & Linos, 2022)?", "optionen": ["Gleich groß", "Etwa doppelt so groß", "Etwa sechsmal kleiner", "Es gab keinen Effekt"], "richtig": 2, "erklaerung": "8,7 Prozentpunkte in Studien gegen 1,4 Prozentpunkte im Feld. Publikationsbias und Auswahl erklären einen Großteil."}
      ],
      uebung: "Beobachte heute drei Preisschilder, Angebote oder Werbungen. Identifiziere bei jedem: Welcher Anker wird gesetzt? Welches Framing? Gibt es einen Decoy? Schreibe es auf."
    },
    {
      id: "p5",
      titel: "Munger: Die Psychologie menschlicher Fehlurteile",
      dauer: "12 Min",
      inhalt: `
<p>Charlie Munger, Warren Buffetts Partner bei Berkshire Hathaway, hielt 1995 an der Harvard Law School einen Vortrag mit dem Titel „The Psychology of Human Misjudgment“. Er listete 25 psychologische Tendenzen auf, die zu Fehlentscheidungen führen. Ein Milliardär, der Cialdini las und ihm dafür Berkshire-Aktien schenkte. Die wichtigsten für den Verkauf:</p>
<h2>Die verkaufsrelevanten Tendenzen</h2>
<table>
<tr><th>Tendenz</th><th>Was sie bedeutet</th><th>Im Verkauf</th></tr>
<tr><td>Reward and Punishment Superresponse</td><td>Anreize steuern Verhalten stärker als alles andere. „Show me the incentive and I will show you the outcome.“</td><td>Frag immer: Wofür wird mein Gegenüber belohnt? Der Einkäufer will nicht das beste Produkt, er will keinen Ärger.</td></tr>
<tr><td>Liking/Loving Tendency</td><td>Wir ignorieren Fehler bei Menschen, die wir mögen.</td><td>Sympathie zuerst, dann Argumente.</td></tr>
<tr><td>Doubt-Avoidance</td><td>Das Gehirn will Zweifel schnell beseitigen, besonders unter Stress.</td><td>Gib dem Kunden Gewissheit. Unsichere Kunden kaufen nicht, sie vertagen.</td></tr>
<tr><td>Inconsistency-Avoidance</td><td>Menschen ändern Gewohnheiten und Meinungen nur ungern.</td><td>Baue auf das auf, was der Kunde bereits glaubt. Widersprich nie frontal.</td></tr>
<tr><td>Social-Proof Tendency</td><td>In Unsicherheit kopieren wir andere.</td><td>Referenzen von ähnlichen Kunden.</td></tr>
<tr><td>Contrast-Misreaction</td><td>Wir bewerten relativ, nicht absolut.</td><td>Zeige das teure Angebot zuerst.</td></tr>
<tr><td>Deprival-Superreaction</td><td>Verlust tut mehr weh als Gewinn freut.</td><td>Verlust-Framing, Testphasen.</td></tr>
<tr><td>Authority-Misinfluence</td><td>Wir folgen Autoritäten, auch wenn sie irren.</td><td>Sei die Autorität, aber ehrlich.</td></tr>
<tr><td>Lollapalooza-Effekt</td><td>Mehrere Tendenzen gleichzeitig erzeugen extreme Wirkung.</td><td>Tupperware-Party: Reziprozität + Sympathie + Social Proof + Commitment auf einmal.</td></tr>
</table>
<blockquote>"I think I've been in the top 5% of my age cohort all my life in understanding the power of incentives, and all my life I've underestimated it."<cite>Charlie Munger, „The Psychology of Human Misjudgment“, Harvard Law School, 1995. Übersetzung: „Ich glaube, ich gehörte mein Leben lang zu den oberen 5 % meiner Altersgruppe im Verständnis der Macht von Anreizen, und mein Leben lang habe ich sie unterschätzt.“</cite></blockquote>
<h2>Mungers Anwendung: Invertieren</h2>
<p>„Invert, always invert“ (nach dem Mathematiker Jacobi). Statt zu fragen „Wie gewinne ich diesen Kunden?“, frag „Was würde garantiert dazu führen, dass ich ihn verliere?“ und vermeide genau das. Die Liste der Fehler ist meist klarer als die Liste der Erfolgsfaktoren.</p>
`,
      quellen: [
        "Munger, C. T. (1995). The Psychology of Human Misjudgment. Vortrag, Harvard Law School. Überarbeitete Fassung in: <em>Poor Charlie's Almanack</em> (2005), Hrsg. Peter Kaufman.",
        "Munger, C. T. (1986). Commencement Speech, Harvard School (Prescription for guaranteed misery in life).",
        "Griffin, T. (2015). <em>Charlie Munger: The Complete Investor</em>. Columbia Business School Publishing."
      ],
      quiz: [
        { frage: "Was ist laut Munger die stärkste Kraft, die Verhalten steuert?", optionen: ["Intelligenz", "Anreize", "Bildung", "Zufall"], richtig: 1, erklaerung: "„Show me the incentive and I will show you the outcome.“" },
        { frage: "Was ist der Lollapalooza-Effekt?", optionen: ["Ein Musikfestival-Verkaufstrick", "Mehrere psychologische Tendenzen wirken gleichzeitig und verstärken sich extrem", "Ein Fehler beim Anker", "Eine Verhandlungstaktik"], richtig: 1, erklaerung: "Die Kombination mehrerer Tendenzen erzeugt überproportionale Wirkung." },
        { frage: "Was bedeutet „Invert, always invert“ im Verkauf?", optionen: ["Preise umdrehen", "Fragen, was garantiert zum Verlust des Kunden führt, und das vermeiden", "Den Kunden verwirren", "Rückwärts präsentieren"], richtig: 1, erklaerung: "Fehlervermeidung ist oft klarer definierbar als Erfolg." }
      ],
      uebung: "Invertiere: Schreibe die zehn sichersten Wege auf, wie du ein Verkaufsgespräch garantiert verlieren würdest. Markiere dann die drei, die du selbst am ehesten tust."
    }
  ]
});

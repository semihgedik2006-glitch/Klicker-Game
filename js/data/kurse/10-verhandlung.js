KURSE.push({
  id: "verhandlung",
  nr: 10,
  titel: "Verhandlung",
  untertitel: "Harvard-Konzept, BATNA, Anker, Zugeständnisse, Chris Voss in der Praxis",
  beschreibung: "Verhandeln ist der Teil des Verkaufs, in dem das Geld verteilt wird. Hier lernst du, Wert zu halten statt zu verschenken.",
  lektionen: [
    {
      id: "n1",
      titel: "Das Harvard-Konzept und BATNA",
      dauer: "12 Min",
      inhalt: `
<p>Roger Fisher und William Ury (Harvard Negotiation Project, 1981) formulierten vier Prinzipien, die bis heute die Basis jeder seriösen Verhandlungslehre sind:</p>
<ol>
<li><strong>Menschen und Probleme trennen.</strong> Hart in der Sache, weich zur Person. Angriffe auf die Person zerstören jede Lösung.</li>
<li><strong>Interessen statt Positionen.</strong> Position: „Ich will 10 % Rabatt.“ Interesse: „Ich muss meinem Chef zeigen, dass ich verhandelt habe.“ Interessen lassen sich auf viele Arten bedienen, Positionen nur auf eine. Die berühmte Orange: Zwei Schwestern streiten um eine Orange, teilen sie, und eine braucht nur die Schale, die andere nur den Saft. Nach Interessen gefragt, hätten beide alles bekommen.</li>
<li><strong>Optionen zum beiderseitigen Vorteil entwickeln.</strong> Mehrere Variablen (Preis, Laufzeit, Menge, Zahlungsziel, Service) erlauben Tauschgeschäfte: Du gibst, was dich wenig kostet und ihm viel wert ist.</li>
<li><strong>Objektive Kriterien.</strong> Marktpreise, Branchenstandards, Gutachten. Das nimmt den Machtkampf heraus.</li>
</ol>
<h2>BATNA</h2>
<p>Best Alternative To a Negotiated Agreement: Was tust du, wenn es keine Einigung gibt? Deine Macht in einer Verhandlung ist exakt so groß wie deine BATNA. Deshalb: Vor jeder Verhandlung die Alternative konkret ausarbeiten (nicht nur „dann suche ich was anderes“), und die BATNA des Gegenübers abschätzen. Wer glaubt, keine Alternative zu haben, verhandelt schlecht. Studien (z. B. Pinkley, Neale & Bennett 1994) bestätigen: Verhandler mit starker BATNA erzielen deutlich bessere Ergebnisse, auch wenn sie sie nie erwähnen.</p>
<h2>ZOPA</h2>
<p>Zone of Possible Agreement: der Bereich zwischen dem Minimum des Verkäufers und dem Maximum des Käufers. Deine Aufgabe: Die ZOPA des anderen durch Fragen ausloten, deine eigene nie verraten. „Was wäre für Sie ein Ergebnis, mit dem Sie zufrieden wären?“</p>
<h2>Verteilend vs. integrativ</h2>
<p>Verteilendes Verhandeln (Kuchen aufteilen) ist ein Nullsummenspiel. Integratives Verhandeln (Kuchen vergrößern) findet Tausch über mehrere Variablen. Thompson (2014): Die meisten Verhandler lassen Wert liegen, weil sie fälschlich annehmen, dass der andere genau das Gegenteil will („Fixed-Pie-Bias“). Frage immer nach Prioritäten: „Was ist Ihnen wichtiger: der Preis oder die Lieferzeit?“</p>
`,
      quellen: [
        "Fisher, R., Ury, W., & Patton, B. (1991). <em>Getting to Yes</em> (2. Aufl.). Penguin. (Deutsch: <em>Das Harvard-Konzept</em>, Campus)",
        "Pinkley, R. L., Neale, M. A., & Bennett, R. J. (1994). The impact of alternatives to settlement in dyadic negotiation. <em>Organizational Behavior and Human Decision Processes</em>, 57(1), 97-116.",
        "Thompson, L. (2014). <em>The Mind and Heart of the Negotiator</em> (6. Aufl.). Pearson."
      ],
      quiz: [
        { frage: "Was ist der Unterschied zwischen Position und Interesse?", optionen: ["Keiner", "Position ist die Forderung, Interesse der Grund dahinter", "Interesse ist immer Geld", "Position ist immer ehrlich"], richtig: 1, erklaerung: "Interessen lassen sich auf viele Arten bedienen, Positionen nur auf eine." },
        { frage: "Wovon hängt deine Macht in einer Verhandlung ab?", optionen: ["Von deiner Lautstärke", "Von deiner BATNA", "Vom Anzug", "Von der Tageszeit"], richtig: 1, erklaerung: "Die beste Alternative bestimmt, wie viel du ablehnen kannst." },
        { frage: "Was ist der Fixed-Pie-Bias?", optionen: ["Die Annahme, der andere will genau das Gegenteil", "Ein Preisfehler", "Eine Rabattregel", "Die Liebe zu Kuchen"], richtig: 0, erklaerung: "Er lässt Wert liegen, weil Tauschmöglichkeiten übersehen werden." }
      ],
      uebung: "Nimm eine anstehende Verhandlung (Kunde, Chef, Vermieter, Partner). Schreibe auf: deine Position, dein Interesse, seine vermutete Position, sein vermutetes Interesse, deine BATNA, seine BATNA, drei Tauschvariablen."
    },
    {
      id: "n2",
      titel: "Anker, Zugeständnisse und Taktiken",
      dauer: "14 Min",
      inhalt: `
<h2>Das erste Angebot</h2>
<p>Galinsky und Mussweiler (2001): Wer das erste Angebot macht, erzielt im Schnitt das bessere Ergebnis, weil der Anker die Verhandlung dominiert. Die Ausnahme: Wenn du den Wert gar nicht einschätzen kannst, lass den anderen zuerst (Informationsvorteil). Regel: <strong>Ambitioniert, aber begründbar.</strong> Ein absurder Anker zerstört Glaubwürdigkeit; ein zu niedriger verschenkt Geld.</p>
<h2>Zugeständnisse</h2>
<ul>
<li><strong>Nie das erste Angebot annehmen.</strong> Der andere fühlt sich dann betrogen (er hätte mehr verlangen können) und du wirkst, als wäre mehr drin gewesen.</li>
<li><strong>Abnehmende Schritte:</strong> 1.000, dann 500, dann 200, dann 50. Das signalisiert, dass du dich der Grenze näherst. Gleich große Schritte signalisieren, dass noch viel Luft ist.</li>
<li><strong>Nie umsonst:</strong> Jedes Zugeständnis gegen ein Zugeständnis. „Wenn Sie die Laufzeit auf zwei Jahre verlängern, kann ich beim Preis entgegenkommen.“ (Reziprozität.)</li>
<li><strong>Langsam:</strong> Schnelle Zugeständnisse wirken wertlos (Kwon & Weingart 2004).</li>
</ul>
<h2>Voss' Ackerman-Methode</h2>
<p>Für Preisverhandlungen aus dem FBI-Kontext: Setze dein Ziel. Erstes Angebot bei 65 % des Ziels (beim Kaufen) bzw. entsprechend hoch (beim Verkaufen). Dann Schritte auf 85 %, 95 %, 100 %, jeweils mit Labeln und kalibrierten Fragen dazwischen. Die letzte Zahl ist präzise und krumm (z. B. 37.263), und du legst ein nicht-monetäres Extra dazu, das signalisiert: Das war wirklich das Letzte.</p>
<h2>Taktiken erkennen (und nicht darauf hereinfallen)</h2>
<table>
<tr><th>Taktik</th><th>Wie sie aussieht</th><th>Gegenmittel</th></tr>
<tr><td>Good Cop / Bad Cop</td><td>Einer hart, einer freundlich</td><td>Benennen: „Es scheint, Sie beide haben unterschiedliche Rollen.“</td></tr>
<tr><td>Nibbling</td><td>Nach der Einigung noch „eine Kleinigkeit“</td><td>„Gern, was bekomme ich dafür?“</td></tr>
<tr><td>Höhere Instanz</td><td>„Das muss mein Chef freigeben“</td><td>Vorher klären: „Können Sie das heute entscheiden?“</td></tr>
<tr><td>Zeitdruck</td><td>„Nur heute“</td><td>Prüfen, ob real. Eigene Zeitlinie setzen.</td></tr>
<tr><td>Salami</td><td>Viele kleine Forderungen nacheinander</td><td>Gesamtpaket verlangen: „Was ist alles auf Ihrer Liste?“</td></tr>
<tr><td>Flinch (Zusammenzucken)</td><td>Sichtbarer Schock beim Preis</td><td>Ruhig bleiben, schweigen, nicht sofort nachgeben.</td></tr>
</table>
<h2>Emotionen</h2>
<p>Verhandlungen sind emotional, auch wenn alle tun, als wären sie es nicht. Voss' Accusation Audit: Sprich die negativen Gedanken des anderen aus, bevor er es tut: „Sie denken wahrscheinlich, dass wir zu teuer sind und nur unseren Vorteil wollen.“ Das entschärft. Labeling senkt Amygdala-Aktivität (Lieberman 2007). Wer die Emotion im Raum benennt, kontrolliert sie.</p>
<div class="callout study"><div class="label">Neu aus der Forschung</div><strong>Spannen, präzise Zahlen, Wärme und Täuschung.</strong> Ames und Mason (2015): Ein Spannen-Angebot, dessen unteres Ende dein eigentliches Ziel ist („7.200 bis 7.600“), erzielt bessere Ergebnisse als die Einzelzahl, weil es informativ und höflich zugleich wirkt. Thomas, Simon und Kadiyali (2010): Präzise Preise (389.475 statt 390.000) werden als niedriger und begründeter wahrgenommen. Jeong, Minson, Yeomans und Gino (2019): Beim reinen Preisfeilschen schadet übertriebene Wärme; freundlich-sachlich schlägt überschwänglich. Boles, Croson und Murnighan (2000): Aufgedeckte Täuschung führt zu Vergeltung, auch wenn sie den Täuschenden selbst Geld kostet. Lüge nie über deine Alternative.</div>
`,
      quellen: [
        "Galinsky, A. D., & Mussweiler, T. (2001). First offers as anchors: The role of perspective-taking and negotiator focus. <em>JPSP</em>, 81(4), 657-669.",
        "Kwon, S., & Weingart, L. R. (2004). Unilateral concessions from the other party: Concession behavior, attributions, and negotiation judgments. <em>Journal of Applied Psychology</em>, 89(2), 263-278.",
        "Voss, C. (2016). <em>Never Split the Difference</em>, Kapitel 9 (Bargain Hard) und 10 (Find the Black Swan).",
        "Malhotra, D., & Bazerman, M. H. (2007). <em>Negotiation Genius</em>. Bantam.",
        "Ames, D. R., & Mason, M. F. (2015). Tandem anchoring: Informational and politeness effects of range offers in social exchange. <em>Journal of Personality and Social Psychology</em>, 108(2), 254-274.",
        "Thomas, M., Simon, D. H., & Kadiyali, V. (2010). The price precision effect: Evidence from laboratory and market data. <em>Marketing Science</em>, 29(1), 175-190.",
        "Jeong, M., Minson, J., Yeomans, M., & Gino, F. (2019). Communicating with warmth in distributive negotiations is surprisingly counterproductive. <em>Management Science</em>, 65(12), 5813-5837.",
        "Boles, T. L., Croson, R. T. A., & Murnighan, J. K. (2000). Deception and retribution in repeated ultimatum bargaining. <em>Organizational Behavior and Human Decision Processes</em>, 83(2), 235-259."
      ],
      quiz: [
        { frage: "Wer sollte in der Regel das erste Angebot machen?", optionen: ["Immer der andere", "Du, wenn du den Wert einschätzen kannst", "Niemand", "Der Ältere"], richtig: 1, erklaerung: "Der Anker dominiert. Ausnahme: völlige Unkenntnis des Werts." },
        { frage: "Wie sollten Zugeständnisse verlaufen?", optionen: ["Gleich groß", "Wachsend", "Abnehmend", "Zufällig"], richtig: 2, erklaerung: "Abnehmende Schritte signalisieren, dass die Grenze naht." },
        { frage: "Was ist das Gegenmittel gegen Nibbling?", optionen: ["Nachgeben", "„Gern, was bekomme ich dafür?“", "Verhandlung abbrechen", "Preis erhöhen"], richtig: 1, erklaerung: "Jedes Zugeständnis gegen Gegenleistung, auch nach der Einigung." },
        { frage: "Was ist ein Accusation Audit?", optionen: ["Eine Buchprüfung", "Die negativen Gedanken des anderen aussprechen, bevor er es tut", "Ein Vorwurf", "Eine Rabattprüfung"], richtig: 1, erklaerung: "Entschärft Vorbehalte, bevor sie wirken." },
        {"frage": "Welches Spannen-Angebot empfiehlt die Forschung von Ames und Mason (2015)?", "optionen": ["Eine Spanne, deren unteres Ende dein Ziel ist", "Eine Spanne, deren oberes Ende dein Ziel ist", "Eine möglichst breite Spanne", "Nie eine Spanne, immer eine Zahl"], "richtig": 0, "erklaerung": "„Bolstering range“: Ziel als Untergrenze, etwas darüber als Obergrenze. Wirkt informativ und höflich, ohne das Ziel zu gefährden."},
        {"frage": "Was zeigten Jeong et al. (2019) über Wärme beim Preisfeilschen?", "optionen": ["Wärme verbessert das Ergebnis immer", "Übertriebene Wärme verschlechtert das eigene Ergebnis", "Wärme ist egal", "Kälte verbessert die Beziehung"], "richtig": 1, "erklaerung": "In rein distributiven Verhandlungen erzielten warm-überschwängliche Verhandler schlechtere Preise als freundlich-sachliche."}
      ],
      uebung: "Verhandle diese Woche einmal bewusst um etwas, das du normalerweise zum Listenpreis kaufst (Handyvertrag, Möbel, Handwerker). Setze einen Anker, mache abnehmende Zugeständnisse, halte Stille. Dokumentiere das Ergebnis."
    },
    {
      id: "n3",
      titel: "Harte Fälle: Druck, Macht und Täuschung",
      dauer: "12 Min",
      inhalt: `
<p>Die ersten beiden Lektionen galten für faire Partner. Diese Lektion gilt für die anderen: Einkäufer, die ankern wie ein Hammer, Kunden, die bluffen, und Momente, in denen du selbst in Versuchung kommst, zu tricksen. Die Forschung dazu ist eindeutig, und sie ist nicht auf der Seite der Trickser.</p>
<h2>Wenn der andere Druck macht</h2>
<p>Druck erzeugt Reaktanz, also den Impuls, die eigene Freiheit zu verteidigen (Rains, 2013, Meta-Analyse). Das gilt für dich wie für deinen Kunden. Wenn ein Einkäufer sagt „Letztes Angebot, sonst war's das“, ist die schlechteste Reaktion, sofort nachzugeben, und die zweitschlechteste, zurückzudrohen. Die beste Reaktion ist eine kalibrierte Frage (Voss): „Wie soll ich das machen?“ oder „Was passiert bei Ihnen, wenn wir heute nicht einig werden?“. Sie zwingt den anderen, seine Alternative zu prüfen, und oft stellt sich heraus, dass sie schwächer ist als behauptet.</p>
<div class="callout practice"><div class="label">Bootcamp-Regel</div>Auf ein Ultimatum antwortest du nie mit einer Zahl. Du antwortest mit einer Frage, dann mit Stille.</div>
<h2>Macht ist Alternative</h2>
<p>Deine Macht in einer Verhandlung ist exakt so groß wie deine beste Alternative (BATNA) und so groß, wie der andere sie einschätzt. Zwei Fehler: Erstens, die eigene Alternative nicht zu kennen, dann verhandelst du aus Angst. Zweitens, über die Alternative zu lügen. Boles, Croson und Murnighan (2000) zeigten in wiederholten Verhandlungen: Wer eine Täuschung entdeckt, bestraft den Täuschenden danach, selbst wenn ihn die Strafe selbst Geld kostet. Eine erfundene Alternative ist ein Kredit, den du mit Zinsen zurückzahlst, spätestens beim nächsten Geschäft.</p>
<p>Was du stattdessen tust: Baue echte Alternativen, bevor du verhandelst. Drei Angebote einholen, zwei Kunden parallel entwickeln, einen Plan B für den Fall des Scheiterns schreiben. Dann brauchst du nicht zu bluffen, und man hört es dir an.</p>
<h2>Spannen und präzise Zahlen</h2>
<p>Ames und Mason (2015) testeten Spannen-Angebote: Eine Spanne, deren unteres Ende dein eigentliches Ziel ist („7.200 bis 7.600“), schnitt besser ab als die Einzelzahl 7.200, weil sie als informativ und zugleich höflich gelesen wird. Thomas, Simon und Kadiyali (2010) fanden bei Immobilienverkäufen, dass präzise Listenpreise (389.475) zu höheren Abschlüssen führten als runde (390.000): Präzision signalisiert, dass eine Rechnung dahintersteht. Kombination: präzise Untergrenze, kleine Spanne darüber, Begründung in einem Satz.</p>
<table><tr><th>Situation</th><th>Schwach</th><th>Stark</th></tr>
<tr><td>Einkäufer ankert 40 % unter deinem Preis</td><td>„Da kann ich 15 % entgegenkommen.“</td><td>„Wie kommen Sie auf die Zahl? Was genau vergleichen Sie?“</td></tr>
<tr><td>Ultimatum</td><td>Sofort nachgeben oder drohen</td><td>„Wie soll ich das machen?“ und Stille</td></tr>
<tr><td>Preisfrage in Minute eins</td><td>Zahl nennen</td><td>Drei Fragen, dann präzise Spanne mit Begründung</td></tr>
<tr><td>„Ihr Wettbewerber ist billiger“</td><td>Rabatt</td><td>„Was hält Sie davon ab, dort zu kaufen?“</td></tr>
<tr><td>Du hast keine Alternative</td><td>Eine erfinden</td><td>Verhandlung verschieben, Alternative aufbauen</td></tr></table>
<h2>Wärme ist nicht immer dein Freund</h2>
<p>Jeong, Minson, Yeomans und Gino (2019) ließen Verhandler per Chat um Preise feilschen. Die warm-überschwänglichen („Ich freue mich so, Sie kennenzulernen, ich bin sicher, wir finden etwas Tolles!“) erzielten schlechtere Preise als die freundlich-sachlichen. Der Grund: Wärme wurde als Verhandlungsschwäche gelesen und ausgenutzt. Achtung, das gilt für reines Preisfeilschen (distributiv). Wo gemeinsam Wert geschaffen wird, hilft Wärme. Lies die Situation, bevor du den Ton wählst.</p>
<h2>Wenn-Dann-Pläne für die Verhandlung</h2>
<p>Gollwitzer und Sheeran (2006) belegen über 94 Studien, dass Wenn-Dann-Pläne die Umsetzung von Vorsätzen deutlich erhöhen (d ≈ 0,65). Für Verhandlungen: „Wenn er ein Ultimatum stellt, dann frage ich, wie ich das machen soll, und schweige.“ „Wenn ich unter meinen Walk-away-Preis gedrückt werde, dann sage ich, dass ich nachdenken muss, und gehe.“ Schreib dir vor jeder wichtigen Verhandlung drei solche Pläne auf das Vorbereitungsblatt. Unter Stress fällst du nicht auf das Niveau deiner Ziele, sondern auf das Niveau deiner Vorbereitung.</p>
<blockquote>“In business, you don't get what you deserve, you get what you negotiate.”<cite>Chester L. Karrass, Werbeslogan seiner Seminare (seit den 1970ern); oft Milliardären zugeschrieben, stammt aber von Karrass.</cite></blockquote>
<h2>Die Grenze</h2>
<p>Alles in diesem Kurs steht unter einer Bedingung: Der Kunde muss am Ende gewinnen. Du darfst ankern, schweigen, Fragen stellen, Alternativen aufbauen, Wert argumentieren. Du darfst nicht lügen, Knappheit erfinden, Druck mit erfundenen Fristen machen oder Schwäche ausnutzen, die der andere nicht kennt. Nicht aus Moral allein, sondern weil Boles et al. und Dutzende Folgestudien zeigen: Entdeckte Täuschung kostet mehr, als sie je gebracht hat, und in kleinen Märkten wird alles entdeckt.</p>
`,
      quellen: [
        "Rains, S. A. (2013). The nature of psychological reactance revisited: A meta-analytic review. <em>Human Communication Research</em>, 39(1), 47-73.",
        "Boles, T. L., Croson, R. T. A., & Murnighan, J. K. (2000). Deception and retribution in repeated ultimatum bargaining. <em>Organizational Behavior and Human Decision Processes</em>, 83(2), 235-259.",
        "Ames, D. R., & Mason, M. F. (2015). Tandem anchoring: Informational and politeness effects of range offers in social exchange. <em>Journal of Personality and Social Psychology</em>, 108(2), 254-274.",
        "Thomas, M., Simon, D. H., & Kadiyali, V. (2010). The price precision effect: Evidence from laboratory and market data. <em>Marketing Science</em>, 29(1), 175-190.",
        "Jeong, M., Minson, J., Yeomans, M., & Gino, F. (2019). Communicating with warmth in distributive negotiations is surprisingly counterproductive. <em>Management Science</em>, 65(12), 5813-5837.",
        "Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. <em>Advances in Experimental Social Psychology</em>, 38, 69-119.",
        "Voss, C., & Raz, T. (2016). <em>Never Split the Difference</em>. Harper Business. (Deutsch: <em>Kompromisslos verhandeln</em>)"
      ],
      quiz: [
        { frage: "Ein Einkäufer sagt: „Letztes Angebot, sonst war's das.“ Was ist die beste erste Reaktion?", optionen: ["Sofort 10 % nachlassen", "Zurückdrohen", "Eine kalibrierte Frage stellen und schweigen", "Das Gespräch beenden"], richtig: 2, erklaerung: "„Wie soll ich das machen?“ zwingt den anderen, seine Alternative zu prüfen. Druck mit Druck zu beantworten erzeugt Reaktanz auf beiden Seiten." },
        { frage: "Was passiert laut Boles, Croson und Murnighan (2000), wenn eine Täuschung in der Verhandlung entdeckt wird?", optionen: ["Nichts, Geschäft ist Geschäft", "Der Getäuschte bestraft den Täuschenden, auch auf eigene Kosten", "Der Täuschende gewinnt trotzdem", "Beide einigen sich schneller"], richtig: 1, erklaerung: "Vergeltung selbst bei eigenen Kosten. Eine erfundene Alternative ist ein Kredit mit Zinsen." },
        { frage: "Welchen Preis empfiehlt die Forschung zur Präzision (Thomas et al., 2010)?", optionen: ["Runde Zahl: 390.000", "Präzise Zahl: 389.475", "Egal", "Immer eine gerade Zahl"], richtig: 1, erklaerung: "Präzise Preise signalisieren eine Rechnung dahinter und führten im Feld zu höheren Abschlüssen." },
        { frage: "Woraus besteht deine Macht in einer Verhandlung?", optionen: ["Aus deiner Lautstärke", "Aus deiner besten Alternative und wie der andere sie einschätzt", "Aus deinem Titel", "Aus der Größe deiner Firma"], richtig: 1, erklaerung: "BATNA. Wer keine hat, baut erst eine auf, statt eine zu erfinden." }
      ],
      uebung: "Schreibe für deine nächste reale Verhandlung (Kauf, Gehalt, Kunde) ein Vorbereitungsblatt: Ziel, Walk-away, echte Alternative (nicht erfunden, mit Beleg), präzise Spanne mit Begründung, und drei Wenn-Dann-Pläne für Druckmomente. Führe die Verhandlung. Berichte, welcher Wenn-Dann-Plan ausgelöst wurde und was passiert ist."
    }
  ]
});

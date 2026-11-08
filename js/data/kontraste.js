// Konzept-Kontraste: verwechselbare Begriffe nebeneinander, dazu Fälle, in denen die Methode nicht genannt wird.
// Feld faelle[].richtig = Index in begriffe.
window.KONTRASTE = [
  { id: 'label-mirror', titel: 'Labeln, Spiegeln oder Paraphrasieren?', lektion: 'f3',
    frage: 'Drei Werkzeuge des aktiven Zuhörens, die alle „den Kunden reden lassen“. Sie wirken auf verschiedene Dinge.',
    begriffe: [
      { name: 'Spiegeln (Mirroring)', kern: 'Die letzten ein bis drei Wörter des Kunden fragend wiederholen.', wirkung: 'Der Kunde redet weiter und erklärt, was er meinte. Du bekommst Information, ohne eine Frage zu stellen.', wann: 'Wenn du mehr hören willst und noch nicht weißt, worum es geht.' },
      { name: 'Labeln', kern: 'Die vermutete Emotion benennen: „Es klingt, als wäre …“', wirkung: 'Negative Gefühle verlieren Kraft, positive werden verstärkt (Lieberman 2007). Der Kunde fühlt sich verstanden.', wann: 'Wenn du eine Emotion wahrnimmst, die das Gespräch blockiert oder trägt.' },
      { name: 'Paraphrasieren', kern: 'Den Inhalt in eigenen Worten zusammenfassen: „Wenn ich Sie richtig verstehe, …“', wirkung: 'Prüft, ob du es verstanden hast, und zwingt den Kunden, sein Problem noch einmal klar zu hören.', wann: 'Vor einer Lösung oder einem Angebot, um Missverständnisse auszuschließen.' }
    ],
    faustregel: 'Wörter wiederholen = Spiegeln. Gefühl benennen = Labeln. Inhalt zusammenfassen = Paraphrasieren.',
    faelle: [
      { situation: 'Der Kunde sagt: „Das letzte Mal haben wir uns mit so einem Anbieter richtig die Finger verbrannt.“ Du antwortest: „Die Finger verbrannt?“', richtig: 0, warum: 'Du wiederholst seine letzten Wörter fragend. Er wird jetzt erzählen, was damals passierte, ohne dass du eine Frage stellen musstest.' },
      { situation: 'Der Kunde verschränkt die Arme und sagt knapp: „Schicken Sie mir einfach die Unterlagen.“ Du sagst: „Es klingt, als hätten Sie heute schon genug Verkaufsgespräche gehabt.“', richtig: 1, warum: 'Du benennst die vermutete Emotion (Genervtheit). Das Label nimmt ihr Kraft und öffnet oft ein ehrliches „Ja, ehrlich gesagt …“.' },
      { situation: 'Nach zehn Minuten sagst du: „Wenn ich Sie richtig verstehe, ist das Hauptproblem nicht der Preis, sondern dass Ihr Team das aktuelle System nicht nutzt.“', richtig: 2, warum: 'Du fasst den Inhalt in eigenen Worten zusammen und lässt ihn bestätigen oder korrigieren, bevor du eine Lösung vorschlägst.' }
    ] },
  { id: 'anker-batna', titel: 'Anker, BATNA, ZOPA oder Walk-away?', lektion: 'n1',
    frage: 'Vier Zahlen aus der Verhandlung, die ständig durcheinandergeraten. Nur eine davon nennst du laut.',
    begriffe: [
      { name: 'Anker', kern: 'Das erste Gebot, an dem alle weiteren gemessen werden.', wirkung: 'Zieht das Ergebnis in seine Richtung (Galinsky & Mussweiler 2001), auch bei Profis.', wann: 'Wenn du gut vorbereitet bist und den Markt kennst: dann setzt du ihn selbst.' },
      { name: 'BATNA', kern: 'Deine beste Alternative, falls diese Verhandlung scheitert (Fisher & Ury).', wirkung: 'Bestimmt deine Macht: Wer eine gute Alternative hat, kann Nein sagen.', wann: 'Vor jeder Verhandlung ermitteln und verbessern, nie am Tisch nennen.' },
      { name: 'ZOPA', kern: 'Der Bereich zwischen den Untergrenzen beider Seiten, in dem eine Einigung möglich ist.', wirkung: 'Existiert sie nicht, hilft keine Taktik; dann ist die BATNA die bessere Wahl.', wann: 'Zur Analyse: Gibt es überhaupt Raum für ein Ja?' },
      { name: 'Walk-away', kern: 'Deine Untergrenze: der Punkt, ab dem du aufstehst.', wirkung: 'Schützt dich vor Zugeständnissen aus Eskalation oder Erschöpfung.', wann: 'Vorher schriftlich festlegen, am Tisch nicht mehr verschieben.' }
    ],
    faustregel: 'Anker sagst du laut. BATNA ist dein Plan B. Walk-away ist deine Grenze. ZOPA ist der Raum zwischen den Grenzen.',
    faelle: [
      { situation: 'Vor dem Gehaltsgespräch hast du ein schriftliches Angebot einer anderen Firma über 58.000 Euro in der Tasche. Du erwähnst es nicht.', richtig: 1, warum: 'Das Angebot ist deine beste Alternative, falls das Gespräch scheitert. Es gibt dir Macht, auch wenn du es nicht nennst.' },
      { situation: 'Du eröffnest mit 395.000 Euro, obwohl du mit 360.000 zufrieden wärst.', richtig: 0, warum: 'Das erste Gebot ist der Anker. Alle weiteren Zahlen werden daran gemessen.' },
      { situation: 'Der Käufer kann maximal 350.000 zahlen, du gehst nicht unter 360.000. Ihr redet drei Stunden.', richtig: 2, warum: 'Es gibt keinen Bereich, in dem beide Ja sagen könnten. Ohne ZOPA hilft keine Taktik, nur eine Änderung des Pakets oder der Abbruch.' },
      { situation: 'Du hast dir vorher notiert: „Unter 52.000 unterschreibe ich nicht.“ Bei 51.000 stehst du auf.', richtig: 3, warum: 'Das ist deine vorher festgelegte Untergrenze. Sie wird am Tisch nicht verschoben, sonst war sie keine.' }
    ] },
  { id: 'rezi-fitd-ditf', titel: 'Reziprozität, Fuß in der Tür oder Tür ins Gesicht?', lektion: 'p1',
    frage: 'Drei Techniken, die mit einer ersten Bitte oder Gabe arbeiten. Der Mechanismus ist jedes Mal ein anderer.',
    begriffe: [
      { name: 'Reziprozität', kern: 'Erst geben, dann bitten. Die Gabe erzeugt das Gefühl, etwas zurückgeben zu müssen.', wirkung: 'Regan 1971: Eine unerwartete Cola verdoppelte die Los-Käufe, unabhängig von Sympathie.', wann: 'Wenn du etwas Wertvolles, Unerwartetes und Persönliches geben kannst.' },
      { name: 'Fuß in der Tür', kern: 'Erst eine kleine Bitte, der zugestimmt wird, dann die große.', wirkung: 'Freedman & Fraser 1966: 76 % statt 17 % stimmten der großen Bitte zu, weil sie sich nun als hilfsbereit sahen.', wann: 'Wenn du Zeit hast und die kleine Bitte zum Selbstbild des Kunden passt.' },
      { name: 'Tür ins Gesicht', kern: 'Erst eine große Bitte, die abgelehnt wird, dann die eigentliche, kleinere.', wirkung: 'Cialdini 1975: Das Zugeständnis des Bittstellers löst ein Gegenzugeständnis aus.', wann: 'Wenn die große Bitte glaubwürdig ist und die kleine direkt danach kommt.' }
    ],
    faustregel: 'Gabe zuerst = Reziprozität. Klein, dann groß = Fuß in der Tür. Groß, dann klein = Tür ins Gesicht.',
    faelle: [
      { situation: 'Ein Berater schickt dem Interessenten vor dem ersten Gespräch eine zweiseitige Analyse seiner Website, unaufgefordert und konkret.', richtig: 0, warum: 'Er gibt zuerst etwas Wertvolles und Persönliches. Der Interessent wird das Gespräch kaum ablehnen.' },
      { situation: 'Du bittest um eine Antwort auf drei kurze Fragen per Mail. Eine Woche später fragst du nach einem 30-Minuten-Termin.', richtig: 1, warum: 'Die kleine Zustimmung kommt zuerst. Wer schon geholfen hat, sieht sich als jemand, der hilft, und sagt der größeren Bitte eher zu.' },
      { situation: 'Du fragst, ob die Firma ein Jahrespaket für 12.000 Euro nimmt. Nach dem Nein: „Verstehe. Wäre ein Pilot über drei Monate für 2.500 Euro denkbar?“', richtig: 2, warum: 'Die große Bitte wurde abgelehnt, dein Rückzug auf die kleinere wirkt wie ein Zugeständnis, das erwidert werden will.' }
    ] },
  { id: 'halo-pratfall', titel: 'Ersteindruck, Halo-Effekt oder Pratfall-Effekt?', lektion: 'w3',
    frage: 'Drei Befunde aus der Wirkungsforschung, die alle mit „wie du rüberkommst“ zu tun haben, aber Verschiedenes vorhersagen.',
    begriffe: [
      { name: 'Ersteindruck (100 ms)', kern: 'Das Urteil über Vertrauenswürdigkeit fällt in etwa einer Zehntelsekunde (Willis & Todorov 2006).', wirkung: 'Mehr Zeit ändert das Urteil kaum, sie macht nur sicherer.', wann: 'Erklärt, warum die ersten Sekunden mehr zählen als die nächsten zehn Minuten.' },
      { name: 'Halo-Effekt', kern: 'Ein positives Merkmal färbt auf unverbundene Merkmale ab (Thorndike 1920).', wirkung: 'Wer attraktiv oder gut gekleidet wirkt, gilt auch als kompetenter und ehrlicher.', wann: 'Erklärt, warum Kleidung und Auftreten die Bewertung deiner Argumente verändern.' },
      { name: 'Pratfall-Effekt', kern: 'Ein kleiner Patzer macht eine ohnehin kompetente Person sympathischer (Aronson 1966).', wirkung: 'Gilt nur bei gezeigter Kompetenz. Beim Durchschnittlichen schadet der Patzer.', wann: 'Erklärt, warum Perfektion Distanz schafft und ein ehrliches „Da habe ich mich vertan“ Nähe.' }
    ],
    faustregel: 'Schnell geurteilt = Ersteindruck. Ein Merkmal färbt ab = Halo. Patzer macht sympathisch = Pratfall.',
    faelle: [
      { situation: 'Eine Expertin hält einen brillanten Vortrag, verschüttet beim Schlusswort ihr Wasser und lacht darüber. Das Publikum mag sie danach mehr als vorher.', richtig: 2, warum: 'Die Kompetenz war gezeigt, der kleine Fehler macht sie menschlich. Ohne den starken Vortrag hätte derselbe Patzer geschadet.' },
      { situation: 'Zwei Bewerber geben identische Antworten. Der im gut sitzenden Anzug wird in der Bewertung als „analytisch stärker“ eingestuft.', richtig: 1, warum: 'Ein unverbundenes Merkmal (Kleidung) färbt auf das Urteil über Analysefähigkeit ab. Das ist der Halo-Effekt.' },
      { situation: 'Ein Kunde entscheidet nach dem Händedruck innerlich, dass er dem Verkäufer nicht traut. Die folgende Präsentation ändert daran nichts.', richtig: 0, warum: 'Das Urteil fiel in den ersten Augenblicken. Die weitere Information machte es nur sicherer, nicht anders.' }
    ] },
  { id: 'spin', titel: 'Situations-, Problem-, Implikations- oder Need-Payoff-Frage?', lektion: 'f1',
    frage: 'Die vier Fragetypen nach Rackham. Die ersten beiden kann jeder, die letzten beiden unterscheiden Spitzenverkäufer.',
    begriffe: [
      { name: 'Situationsfrage', kern: 'Fakten über den Ist-Zustand sammeln.', wirkung: 'Nötig, aber langweilig für den Kunden. Spitzenverkäufer stellen wenige davon.', wann: 'Nur, was du nicht vorher recherchieren konntest.' },
      { name: 'Problemfrage', kern: 'Nach Schwierigkeiten, Unzufriedenheit, Lücken fragen.', wirkung: 'Macht den latenten Bedarf sichtbar. Reicht bei kleinen Verkäufen oft aus.', wann: 'Sobald du die Situation grob kennst.' },
      { name: 'Implikationsfrage', kern: 'Nach den Folgen des Problems fragen: Kosten, Zeit, Wirkung auf andere.', wirkung: 'Macht das Problem groß genug, dass es die Lösung wert ist. Stärkster Prädiktor für Erfolg bei großen Verkäufen.', wann: 'Wenn ein Problem genannt wurde, der Kunde es aber als klein empfindet.' },
      { name: 'Need-Payoff-Frage (Nutzenfrage)', kern: 'Den Kunden den Wert der Lösung selbst aussprechen lassen.', wirkung: 'Der Kunde argumentiert für dich. Reduziert Einwände, weil er es gesagt hat, nicht du.', wann: 'Wenn das Problem groß geworden ist und die Lösung noch nicht genannt wurde.' }
    ],
    faustregel: 'Was ist? = Situation. Was stört? = Problem. Was kostet es? = Implikation. Was brächte es? = Need-Payoff.',
    faelle: [
      { situation: '„Wie viele Stunden gehen Ihrem Team pro Woche mit der Nachbearbeitung verloren, und was bedeutet das für die Termintreue bei den anderen Kunden?“', richtig: 2, warum: 'Die Frage zielt auf die Folgen des Problems, nicht auf das Problem selbst. Sie macht es größer und teurer.' },
      { situation: '„Wenn die Nachbearbeitung auf eine Stunde pro Woche sänke, was würden Sie mit der gewonnenen Zeit machen?“', richtig: 3, warum: 'Der Kunde formuliert den Nutzen der Lösung selbst. Das ist die Frage, die vor dem Angebot kommt.' },
      { situation: '„Wo hakt es derzeit bei der Übergabe zwischen Vertrieb und Technik?“', richtig: 1, warum: 'Die Frage sucht Schwierigkeiten und Unzufriedenheit, noch ohne nach Folgen zu fragen.' },
      { situation: '„Mit welchem System arbeiten Sie aktuell, und seit wann?“', richtig: 0, warum: 'Reine Faktenabfrage zum Ist-Zustand. Nötig, aber davon so wenige wie möglich.' }
    ] },
  { id: 'einwand-arten', titel: 'Kein Bedarf, kein Vertrauen, kein Geld, keine Eile oder Vorwand?', lektion: 'v3',
    frage: 'Fünf Einwandtypen, die sich gleich anhören können. Die Antwort hängt davon ab, welcher es wirklich ist.',
    begriffe: [
      { name: 'Kein Bedarf', kern: 'Der Kunde sieht das Problem nicht oder nicht als seins.', wirkung: 'Argumente für die Lösung prallen ab, weil es für ihn nichts zu lösen gibt.', wann: 'Zurück zu Problem- und Implikationsfragen, nicht zur Präsentation.' },
      { name: 'Kein Vertrauen', kern: 'Der Kunde glaubt dir, dem Produkt oder der Firma nicht.', wirkung: 'Beweise wirken nur, wenn sie von außen kommen: Referenzen, Zahlen, Garantie.', wann: 'Beleg liefern, Risiko umkehren, Zeit geben.' },
      { name: 'Kein Geld', kern: 'Das Budget fehlt tatsächlich oder ist anderswo gebunden.', wirkung: 'Rabatt löst es nicht, wenn null Budget da ist; Zeitpunkt, Paket oder Finanzierung lösen es.', wann: 'Prüfen, ob es Geld oder Priorität ist: „Angenommen, das Budget wäre da …?“' },
      { name: 'Keine Eile', kern: 'Der Kunde glaubt, das Problem könne warten.', wirkung: 'Der Schmerz ist nicht groß genug. Druck erzeugt Reaktanz.', wann: 'Kosten des Wartens in seinen Zahlen rechnen, Termin für die Entscheidung vereinbaren.' },
      { name: 'Vorwand', kern: 'Der genannte Grund ist nicht der echte.', wirkung: 'Wer den Vorwand entkräftet, bekommt den nächsten.', wann: 'Isolieren: „Angenommen, das wäre geklärt, würden Sie es dann machen?“' }
    ],
    faustregel: 'Erst isolieren, dann einordnen. Ein Nein auf die Isolationsfrage heißt: Der genannte Grund war ein Vorwand.',
    faelle: [
      { situation: '„Wir haben das bisher auch ohne geschafft, ehrlich gesagt sehe ich das Problem nicht so dramatisch.“', richtig: 0, warum: 'Der Kunde erkennt den Bedarf nicht. Jetzt helfen Problem- und Implikationsfragen, keine Produktvorteile.' },
      { situation: '„Zu teuer.“ Du fragst: „Angenommen, der Preis wäre geklärt, würden Sie starten?“ Er: „Hm, ich müsste erst noch sehen, ob es überhaupt zu uns passt.“', richtig: 4, warum: 'Das Nein auf die Isolationsfrage zeigt: Der Preis war vorgeschoben. Der echte Einwand liegt woanders, vermutlich Bedarf oder Vertrauen.' },
      { situation: '„Klingt gut, aber woher weiß ich, dass das bei uns auch so läuft wie in Ihrer Präsentation?“', richtig: 1, warum: 'Der Kunde zweifelt an der Glaubwürdigkeit. Hier helfen Referenzen aus seiner Branche, Zahlen und eine Risikoumkehr.' },
      { situation: '„Das machen wir dann im nächsten Quartal, jetzt ist gerade viel los.“', richtig: 3, warum: 'Keine Dringlichkeit. Rechne die Kosten des Wartens in seinen Zahlen vor und vereinbare ein konkretes Datum.' }
    ] },
  { id: 'challenger', titel: 'Challenger, Relationship Builder oder Hard Worker?', lektion: 'v2',
    frage: 'Drei der fünf Verkäufertypen aus der Dixon-&-Adamson-Studie an 6.000 Verkäufern. Nur einer gewinnt bei komplexen Verkäufen überdurchschnittlich.',
    begriffe: [
      { name: 'Challenger', kern: 'Bringt dem Kunden eine neue Einsicht über sein Geschäft, passt die Botschaft an und übernimmt die Kontrolle über das Gespräch.', wirkung: '39 % der Spitzenverkäufer bei komplexen Verkäufen, der häufigste Typ unter den Besten.', wann: 'Wenn der Kunde glaubt, sein Problem schon zu verstehen.' },
      { name: 'Relationship Builder (Beziehungsbauer)', kern: 'Vermeidet Spannung, ist großzügig mit Zeit, will gemocht werden.', wirkung: 'Nur 7 % der Spitzenverkäufer bei komplexen Verkäufen, der seltenste Typ unter den Besten.', wann: 'Funktioniert bei einfachen Verkäufen, scheitert, wenn der Kunde Orientierung braucht.' },
      { name: 'Hard Worker (Fleißiger)', kern: 'Macht mehr Anrufe, mehr Termine, gibt nicht auf, motiviert sich selbst.', wirkung: 'Solide, aber kein überdurchschnittlicher Anteil unter den Besten bei komplexen Verkäufen.', wann: 'Volumen hilft bei transaktionalen Verkäufen, ersetzt aber keine Einsicht.' }
    ],
    faustregel: 'Lehrt der Verkäufer etwas Neues und hält er Spannung aus? Dann Challenger. Vermeidet er Spannung? Relationship Builder. Setzt er auf Menge? Hard Worker.',
    faelle: [
      { situation: 'Die Verkäuferin eröffnet: „Die meisten Firmen Ihrer Größe messen Kundenzufriedenheit falsch, und das kostet sie etwa fünf Prozent Umsatz. Ich zeige Ihnen, woran Sie erkennen, ob Sie dazugehören.“', richtig: 0, warum: 'Sie bringt eine Einsicht, die der Kunde nicht hatte, und erzeugt bewusst eine produktive Spannung. Das ist der Challenger-Ansatz.' },
      { situation: 'Der Verkäufer nimmt jeden Einwand sofort zurück, lädt zum dritten Mal zum Essen ein und sagt: „Lassen Sie sich Zeit, ich will Sie nicht drängen.“', richtig: 1, warum: 'Er vermeidet jede Spannung und setzt auf Sympathie. Bei komplexen Verkäufen ist das der schwächste Typ.' },
      { situation: 'Er telefoniert 80 Kontakte am Tag, verschickt abends noch 30 Mails und führt eine Strichliste der Neins.', richtig: 2, warum: 'Volumen und Ausdauer, aber keine neue Einsicht für den Kunden. Hard Worker, nicht Challenger.' }
    ] },
  { id: 'knapp-verlust', titel: 'Knappheit, Verlustaversion oder Reaktanz?', lektion: 'p3',
    frage: 'Drei Effekte, die alle mit „weg sein“ zu tun haben, aber verschieden wirken und verschieden missbraucht werden.',
    begriffe: [
      { name: 'Knappheit', kern: 'Was selten oder begrenzt ist, wirkt wertvoller (Worchel 1975: zwei Kekse schmecken besser als zehn).', wirkung: 'Erhöht den wahrgenommenen Wert, besonders wenn die Knappheit neu ist und andere konkurrieren.', wann: 'Nur bei echter Begrenzung. Erfundene Knappheit ist ein dunkles Muster und fliegt auf.' },
      { name: 'Verlustaversion', kern: 'Verluste wiegen etwa doppelt so schwer wie gleich große Gewinne (Kahneman & Tversky 1979).', wirkung: 'Dieselbe Sache als Verlust gerahmt bewegt mehr als als Gewinn gerahmt.', wann: 'Ehrlich: zeige, was der Kunde heute schon verliert, statt zu drohen, was er verlieren könnte.' },
      { name: 'Reaktanz', kern: 'Wird die Freiheit bedroht, wehren Menschen sich und wollen das Verbotene umso mehr (Brehm 1966).', wirkung: 'Druck erzeugt Gegendruck. Der Kunde sagt Nein, um die Kontrolle zu behalten.', wann: 'Vermeiden: Wahl lassen, „Sie entscheiden“, keine Deadlines ohne Grund.' }
    ],
    faustregel: 'Selten = Knappheit. Verlust schmerzt mehr = Verlustaversion. Druck erzeugt Gegendruck = Reaktanz.',
    faelle: [
      { situation: 'Der Kunde zögert. Du sagst: „Sie verlieren aktuell etwa 1.200 Euro im Monat durch die doppelte Dateneingabe, das haben wir vorhin zusammen gerechnet.“', richtig: 1, warum: 'Du rahmst den Ist-Zustand als laufenden Verlust. Das wiegt schwerer als „Sie könnten 1.200 Euro sparen“.' },
      { situation: 'Die Verkäuferin: „Sie müssen heute unterschreiben, sonst ist das Angebot weg.“ Der Kunde, der eigentlich wollte, bricht ab.', richtig: 2, warum: 'Die Freiheit zu entscheiden wurde bedroht. Der Kunde holt sich die Kontrolle zurück, indem er Nein sagt.' },
      { situation: 'Es gibt diesen Workshop nur zweimal im Jahr mit je zwölf Plätzen, und neun sind vergeben. Du sagst genau das.', richtig: 0, warum: 'Echte Begrenzung, ehrlich kommuniziert. Der wahrgenommene Wert steigt, ohne dass du Druck machst.' }
    ] },
  { id: 'commit-konsist', titel: 'Commitment, Soziale Bewährtheit oder Autorität?', lektion: 'p2',
    frage: 'Drei Cialdini-Prinzipien, die im Verkaufsalltag oft in einem Satz zusammenkommen. Jedes hat eine andere Quelle der Wirkung.',
    begriffe: [
      { name: 'Commitment', kern: 'Menschen handeln konsistent mit dem, was sie gesagt oder getan haben, besonders öffentlich und schriftlich.', wirkung: 'Die Quelle ist der Kunde selbst: sein früheres Wort.', wann: 'Lass den Kunden kleine Dinge selbst aussprechen oder aufschreiben.' },
      { name: 'Soziale Bewährtheit', kern: 'Bei Unsicherheit orientieren sich Menschen daran, was ähnliche andere tun.', wirkung: 'Die Quelle sind Gleichgesinnte, je ähnlicher, desto stärker.', wann: 'Referenzen aus derselben Branche und Größe, konkrete Zahlen.' },
      { name: 'Autorität', kern: 'Fachwissen und Status erhöhen die Folgebereitschaft (Bickman 1974: Uniform verdreifachte den Gehorsam).', wirkung: 'Die Quelle ist ein Experte oder Titel, nicht die Masse.', wann: 'Eigene Expertise belegen oder eine anerkannte Instanz zitieren.' }
    ],
    faustregel: 'Eigenes Wort = Commitment. Viele Ähnliche = Soziale Bewährtheit. Ein Experte = Autorität.',
    faelle: [
      { situation: '„Sie sagten vorhin, Termintreue sei für Sie das Wichtigste. Deshalb schlage ich die Variante mit festem Ansprechpartner vor.“', richtig: 0, warum: 'Du knüpfst an sein eigenes Wort an. Er bleibt konsistent mit dem, was er selbst gesagt hat.' },
      { situation: '„Drei Steuerkanzleien mit zehn bis fünfzehn Mitarbeitern in Ihrer Region arbeiten seit letztem Jahr damit, im Schnitt mit vier Stunden weniger Nacharbeit pro Woche.“', richtig: 1, warum: 'Ähnliche andere tun es bereits. Je näher die Referenz an seiner Situation, desto stärker.' },
      { situation: '„Die Methode stammt aus der Studie von Rackham an 35.000 Gesprächen, nicht aus einem Ratgeber.“', richtig: 2, warum: 'Du berufst dich auf eine anerkannte Instanz. Die Wirkung kommt vom Experten, nicht von der Zahl der Anwender.' }
    ] },
  { id: 'abschluss', titel: 'Trial Close, Abschlussfrage oder bedingter Abschluss?', lektion: 'v4',
    frage: 'Drei Werkzeuge der Schlussphase. Eines prüft, zwei fordern. Wer sie verwechselt, fordert zu früh.',
    begriffe: [
      { name: 'Trial Close', kern: 'Eine Meinungsfrage, die die Temperatur misst: „Wie klingt das bisher für Sie?“', wirkung: 'Zeigt, ob der Kunde bereit ist, ohne ihn festzulegen. Ein Nein kostet nichts.', wann: 'Mehrfach im Gespräch, nach jedem Nutzenargument.' },
      { name: 'Abschlussfrage', kern: 'Die direkte Bitte um die Entscheidung: „Sollen wir es so machen?“', wirkung: 'Zwingt zur Entscheidung. Zu früh gestellt erzeugt sie Einwände.', wann: 'Erst, wenn der Trial Close positiv war und die Bedingungen (Produkt, du, Firma) erfüllt sind.' },
      { name: 'Bedingter Abschluss', kern: 'Du knüpfst die Entscheidung an eine Bedingung, die du erfüllen kannst: „Wenn ich den Start zum 1. März garantiere, machen wir es dann?“', wirkung: 'Der Kunde entscheidet, aber unter einer Zusage von dir; der letzte Einwand wird in die Bedingung verwandelt statt wegdiskutiert.', wann: 'Wenn nach klaren Kaufsignalen genau eine Hürde übrig ist, die du selbst ausräumen kannst.' }
    ],
    faustregel: 'Fragt nach Meinung = Trial Close. Fragt nach Entscheidung = Abschlussfrage. Knüpft die Entscheidung an eine Bedingung = bedingter Abschluss.',
    faelle: [
      { situation: '„Wenn Sie das Ganze bis hierhin bewerten, was gefällt Ihnen am besten und was fehlt noch?“', richtig: 0, warum: 'Eine Meinungsfrage. Sie misst die Temperatur und legt den Kunden auf nichts fest.' },
      { situation: 'Der Kunde fragt nach Zahlungszielen und Startterminen. Du sagst: „Wenn ich Ihnen den Start am Ersten und den Kick-off in der zweiten Woche fest zusage, machen wir es dann?“', richtig: 2, warum: 'Die Entscheidung wird an eine Zusage geknüpft, die du halten kannst. Nach klaren Kaufsignalen ist das ein sauberer Abschluss; ohne Signale käme die Frage zu früh.' },
      { situation: '„Wollen wir es so machen?“', richtig: 1, warum: 'Die direkte Bitte um die Entscheidung. Richtig platziert nach einem positiven Trial Close.' }
    ] },
  { id: 'motive', titel: 'Gewinn, Sicherheit, Bequemlichkeit oder Ansehen?', lektion: 'a1',
    frage: 'Vier Kaufmotive, die sich hinter derselben Frage verstecken können. Die Argumentation muss zum Motiv passen, nicht zum Produkt.',
    begriffe: [
      { name: 'Gewinn', kern: 'Mehr Umsatz, weniger Kosten, bessere Rendite.', wirkung: 'Reagiert auf Zahlen, Rechnungen, Amortisation.', wann: 'Fragen nach ROI, Einsparung, Vergleichszahlen.' },
      { name: 'Sicherheit', kern: 'Risiko vermeiden, nichts falsch machen, abgesichert sein.', wirkung: 'Reagiert auf Garantien, Referenzen, Standards, Ausstiegsoptionen.', wann: 'Fragen nach „Was, wenn …“, Haftung, Erfahrung anderer.' },
      { name: 'Bequemlichkeit', kern: 'Weniger Aufwand, weniger Entscheidungen, es soll einfach laufen.', wirkung: 'Reagiert auf „Wir übernehmen das“, Komplettpakete, einen Ansprechpartner.', wann: 'Fragen nach Aufwand, Einarbeitung, „Muss ich mich darum kümmern?“' },
      { name: 'Ansehen', kern: 'Gut dastehen, vor Chef, Team oder Markt als klug gelten.', wirkung: 'Reagiert auf Sichtbarkeit, Vorreiterrolle, Erfolgsgeschichten mit Namen.', wann: 'Fragen nach „Wer nutzt das noch?“, Präsentierbarkeit, Außenwirkung.' }
    ],
    faustregel: 'Hör auf die Frage hinter der Frage: Rechnet er, sichert er ab, will er Ruhe oder will er glänzen?',
    faelle: [
      { situation: '„Und wenn das nach drei Monaten nicht läuft, wie komme ich da wieder raus?“', richtig: 1, warum: 'Die Frage sucht die Absicherung gegen den Fehlkauf. Hier zählen Testphase, Garantie und Referenzen, nicht die Rendite.' },
      { situation: '„Ich will mich ehrlich gesagt nicht noch um ein weiteres System kümmern müssen. Wer macht die Einrichtung?“', richtig: 2, warum: 'Der Kunde will weniger Aufwand. Das Argument ist „Wir übernehmen das komplett“, nicht die Funktionsliste.' },
      { situation: '„Wie schnell rechnet sich das, und was spare ich im ersten Jahr konkret?“', richtig: 0, warum: 'Er rechnet. Zahlen, Amortisation und ein Vergleich mit dem heutigen Zustand überzeugen ihn.' },
      { situation: '„Welche bekannten Firmen setzen das ein, und könnte ich das intern als Projekt vorstellen?“', richtig: 3, warum: 'Er will mit der Entscheidung gut dastehen. Namen, Sichtbarkeit und eine präsentierbare Geschichte zählen.' }
    ] },
  { id: 'anker-decoy', titel: 'Anker, Decoy oder Framing?', lektion: 'p4',
    frage: 'Drei Effekte aus Kahnemans Werkstatt, die alle „die Wahrnehmung des Preises verschieben“. Sie greifen an verschiedenen Stellen an.',
    begriffe: [
      { name: 'Anker', kern: 'Eine zuerst genannte Zahl zieht alle folgenden Urteile zu sich hin.', wirkung: 'Selbst zufällige Zahlen verschieben Schätzungen (Tversky & Kahneman 1974); der erste Preis prägt, was danach „teuer“ heißt.', wann: 'Wenn du die Reihenfolge bestimmst: das hochwertige Paket zuerst nennen, dann das mittlere.' },
      { name: 'Decoy (Köder)', kern: 'Eine dritte Option, die eindeutig schlechter ist als eine der beiden anderen, macht diese zur klaren Wahl.', wirkung: 'Asymmetrische Dominanz (Huber, Payne & Puto 1982): Der Anteil für die Zieloption steigt, obwohl niemand den Köder nimmt. Ariely 2008: 84 statt 32 Prozent für das Kombi-Abo.', wann: 'Wenn zwei Angebote gleich attraktiv wirken und du eins davon zur Mitte machen willst.' },
      { name: 'Framing', kern: 'Dieselbe Tatsache, anders eingerahmt: Verlust statt Gewinn, 75 % mager statt 25 % fett.', wirkung: 'Der Rahmen ändert die Entscheidung bei identischem Inhalt (Tversky & Kahneman 1981; Levin & Gaeth 1988).', wann: 'Wenn du eine Zahl erklärst: Was kostet das Nichtstun, nicht nur, was spart die Lösung.' }
    ],
    faustregel: 'Erste Zahl = Anker. Dritte, schlechtere Option = Decoy. Gleiche Zahl, anderer Satz = Framing.',
    faelle: [
      { situation: 'Eine Software gibt es als „Basis 29 €“ und „Pro 59 €“. Die meisten nehmen Basis. Der Anbieter ergänzt „Pro ohne Support 55 €“. Jetzt wählen deutlich mehr „Pro 59 €“.', richtig: 1, warum: 'Die neue Option ist in allem schlechter als Pro für 59, also ein Köder. Sie macht Pro zur offensichtlich klugen Wahl, ohne dass jemand sie kauft.' },
      { situation: 'Der Makler zeigt zuerst eine Wohnung für 520.000 Euro, dann die, um die es ihm geht, für 440.000. Der Kunde findet 440.000 „fair“.', richtig: 0, warum: 'Die erste Zahl setzt den Maßstab. Ohne die teure Wohnung zuerst wäre 440.000 die Vergleichsgröße gewesen, nicht die günstige Alternative.' },
      { situation: 'Statt „Mit uns sparen Sie 300 Euro im Monat“ sagt die Verkäuferin: „Jeden Monat ohne Umstellung verlieren Sie 300 Euro.“ Der Inhalt ist gleich, die Reaktion nicht.', richtig: 2, warum: 'Gleiche Zahl, anderer Rahmen: Verlust statt Gewinn. Das ist Framing, kein Anker (es gibt keine Vergleichszahl) und kein Köder (keine dritte Option).' },
      { situation: 'Ein Berater nennt sein Honorar: „Vergleichbare Projekte kosten bei Agenturen 18.000 bis 25.000 Euro. Mein Angebot liegt bei 14.800.“', richtig: 0, warum: 'Die Agenturspanne ist der Anker, an dem 14.800 gemessen wird. Es ist kein Framing, weil nicht derselbe Sachverhalt umformuliert wird, sondern eine Vergleichszahl vorangestellt wird.' }
    ] },
  { id: 'besitz-status', titel: 'Besitztumseffekt, Status-quo-Verzerrung oder versunkene Kosten?', lektion: 'p4',
    frage: 'Drei Gründe, warum Kunden beim Alten bleiben. Jeder braucht eine andere Antwort.',
    begriffe: [
      { name: 'Besitztumseffekt', kern: 'Was man besitzt, bewertet man höher als dasselbe Ding, das man nicht besitzt.', wirkung: 'Tauschexperimente mit Tassen: Besitzer verlangten etwa das Doppelte dessen, was Käufer zahlen wollten (Kahneman, Knetsch & Thaler 1990).', wann: 'Erklärt, warum Testphasen und Probefahrten wirken: Der Kunde besitzt schon, bevor er zahlt.' },
      { name: 'Status-quo-Verzerrung', kern: 'Die bestehende Option wird bevorzugt, nur weil sie besteht; jede Änderung fühlt sich wie Risiko an.', wirkung: 'Je mehr Alternativen, desto stärker die Neigung zum Bestehenden (Samuelson & Zeckhauser 1988).', wann: 'Wenn der Kunde kein Argument gegen dich hat, aber trotzdem nichts ändert. Antwort: Wechsel klein und umkehrbar machen.' },
      { name: 'Versunkene Kosten', kern: 'Vergangene, nicht rückholbare Ausgaben beeinflussen die Entscheidung, obwohl sie es nicht sollten.', wirkung: 'Wer mehr für ein Ticket gezahlt hat, geht öfter hin, auch wenn er keine Lust hat (Arkes & Blumer 1985).', wann: 'Wenn der Kunde sagt: „Wir haben in das alte System so viel investiert.“ Antwort: Blick nach vorn, was kostet es ab heute?' }
    ],
    faustregel: 'Hängt an dem, was er hat = Besitztum. Hängt am Nichtstun = Status quo. Hängt an dem, was er schon gezahlt hat = versunkene Kosten.',
    faelle: [
      { situation: 'IT-Leiterin: „Wir haben in die alte Plattform über drei Jahre fast 200.000 Euro gesteckt, das können wir jetzt nicht einfach wegwerfen.“', richtig: 2, warum: 'Die 200.000 sind weg, egal wie sie entscheidet. Dass sie trotzdem zählen, ist der Sunk-Cost-Effekt. Die richtige Frage lautet: Was kostet jede Option ab heute?' },
      { situation: 'Ein Kunde hat das Gerät zwei Wochen zu Hause getestet. Beim Rückgabetermin will er es behalten, obwohl er vorher „maximal 300 Euro“ zahlen wollte und es 390 kostet.', richtig: 0, warum: 'Zwei Wochen Besitz haben den subjektiven Wert erhöht. Das ist der Besitztumseffekt, das Prinzip hinter jeder Probezeit.' },
      { situation: 'Der Geschäftsführer sieht ein, dass dein Angebot besser und günstiger ist. Trotzdem: „Wir bleiben erst mal beim bisherigen Anbieter, läuft ja.“ Es gibt keine Investition in das alte System und kein Produkt im Besitz.', richtig: 1, warum: 'Kein Argument, keine versunkenen Kosten, nur die Trägheit des Bestehenden. Status-quo-Verzerrung. Hilfreich ist ein kleiner, umkehrbarer erster Schritt statt eines Komplettwechsels.' },
      { situation: 'Ein Autohändler lässt Interessenten das Wunschauto über das Wochenende mitnehmen. Die Abschlussquote danach ist deutlich höher.', richtig: 0, warum: 'Das Wochenende erzeugt vorübergehenden Besitz. Danach würde der Kunde das Auto „verlieren“, und Besitz wird höher bewertet als Nichtbesitz.' }
    ] },
  { id: 'denkfehler-verkaeufer', titel: 'Fluch des Wissens, Attributionsfehler oder Bestätigungsfehler?', lektion: 'a2',
    frage: 'Drei Denkfehler, die nicht beim Kunden passieren, sondern bei dir, wenn du ihn liest.',
    begriffe: [
      { name: 'Fluch des Wissens', kern: 'Wer etwas weiß, kann sich nicht mehr vorstellen, es nicht zu wissen, und erklärt zu knapp.', wirkung: 'Klopfer von Melodien schätzten, dass 50 Prozent der Zuhörer das Lied erkennen; es waren 2,5 Prozent (Newton 1990; Camerer, Loewenstein & Weber 1989).', wann: 'Wenn du Fachbegriffe benutzt, Schritte überspringst oder dich wunderst, dass der Kunde „es nicht versteht“.' },
      { name: 'Fundamentaler Attributionsfehler', kern: 'Fremdes Verhalten wird dem Charakter zugeschrieben, eigenes der Situation.', wirkung: 'Beobachter hielten Aufsatzschreiber für überzeugt, obwohl sie wussten, dass die Position zugewiesen war (Jones & Harris 1967; Ross 1977).', wann: 'Wenn du denkst „der ist einfach schwierig“ statt „der hat gerade ein Problem, das ich nicht kenne“.' },
      { name: 'Bestätigungsfehler', kern: 'Man sucht und gewichtet Informationen, die die eigene Annahme stützen.', wirkung: 'Versuchspersonen testeten ihre Regelhypothese fast nur mit bestätigenden Beispielen (Wason 1960; Überblick Nickerson 1998).', wann: 'Wenn du nach zwei Sätzen den Kundentyp „erkannt“ hast und danach nur noch hörst, was dazu passt.' }
    ],
    faustregel: 'Du erklärst zu knapp = Fluch des Wissens. Du erklärst ihn über seinen Charakter = Attributionsfehler. Du hörst nur, was passt = Bestätigungsfehler.',
    faelle: [
      { situation: 'Nach der ersten Minute ordnest du den Kunden als „Dominant“ ein. Als er später lange nach Details fragt, denkst du: „Typisch D, der testet mich.“', richtig: 2, warum: 'Die Detailfragen widersprechen deiner Einordnung, du deutest sie trotzdem als Bestätigung. Das ist der Bestätigungsfehler. Besser: die Hypothese als Frage prüfen.' },
      { situation: 'Der Einkäufer antwortet einsilbig und sagt den Termin zweimal ab. Du schließt: „Der ist arrogant und desinteressiert.“ Tatsächlich läuft bei ihm eine Umstrukturierung.', richtig: 1, warum: 'Du erklärst sein Verhalten über seinen Charakter, nicht über seine Situation. Fundamentaler Attributionsfehler. Eine einzige Frage nach seiner Lage hätte es gezeigt.' },
      { situation: 'Du erklärst der Praxisinhaberin in drei Sätzen die Schnittstelle „zum PVS über HL7“. Sie nickt und meldet sich nie wieder.', richtig: 0, warum: 'Für dich sind die Begriffe selbstverständlich, für sie nicht. Fluch des Wissens: Du kannst dir ihr Nichtwissen nicht mehr vorstellen und merkst nicht, dass du sie verloren hast.' },
      { situation: 'Du bist überzeugt, dass Handwerker „keine Software wollen“. In den nächsten drei Gesprächen merkst du dir jeden skeptischen Satz und vergisst, dass zwei der drei nach einer Demo gefragt haben.', richtig: 2, warum: 'Die Erinnerung filtert zugunsten der Annahme. Bestätigungsfehler, hier in der Gewichtung dessen, was hängen bleibt.' }
    ] }
];

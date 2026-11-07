KURSE.push({
  id: "kundenanalyse",
  nr: 8,
  titel: "Kundenanalyse: Menschen lesen und verstehen",
  untertitel: "Kaufmotive, Persönlichkeitstypen, Qualifizierung, Entscheidungsstrukturen",
  beschreibung: "Am Ende dieses Moduls kannst du einen Kunden in Minuten einordnen: Was treibt ihn, wie entscheidet er, was braucht er von dir, und ob er überhaupt kaufen kann.",
  lektionen: [
    {
      id: "a1",
      titel: "Kaufmotive: Warum Menschen wirklich kaufen",
      dauer: "12 Min",
      inhalt: `
<p>Niemand kauft ein Produkt. Alle kaufen ein Gefühl, eine Lösung, einen Status oder die Abwesenheit eines Schmerzes. Wer das Motiv kennt, verkauft das Motiv.</p>
<h2>Die Grundbedürfnisse (wissenschaftlich fundiert)</h2>
<p>Die Selbstbestimmungstheorie von Deci und Ryan (1985, 2000), eine der am besten belegten Motivationstheorien, nennt drei universelle psychologische Grundbedürfnisse:</p>
<ul>
<li><strong>Autonomie:</strong> Selbst entscheiden, Kontrolle haben. Verkaufsangriff: „Sie behalten die volle Kontrolle“, „Sie entscheiden, wann“.</li>
<li><strong>Kompetenz:</strong> Wirksam sein, Dinge beherrschen. „Damit wirken Sie vor Ihren Kunden wie ein Profi.“</li>
<li><strong>Verbundenheit:</strong> Dazugehören, geschätzt werden. „Die meisten Betriebe in Ihrem Verband nutzen das bereits.“</li>
</ul>
<h2>Die Praktiker-Liste der Kaufmotive</h2>
<p>Im Vertrieb hat sich eine Liste von sechs bis acht Motiven etabliert, die sich gut mit der Forschung deckt (u. a. bei Zig Ziglar und in der deutschen Vertriebsliteratur, z. B. Limbeck):</p>
<table>
<tr><th>Motiv</th><th>Erkennungszeichen</th><th>Sprache dafür</th></tr>
<tr><td>Gewinn / Sparen</td><td>Fragt früh nach Preis, Rendite, Amortisation</td><td>Zahlen, ROI, „rechnet sich in X Monaten“</td></tr>
<tr><td>Sicherheit</td><td>Fragt nach Garantie, Referenzen, Risiken</td><td>Garantien, Zertifikate, „bewährt seit“</td></tr>
<tr><td>Bequemlichkeit</td><td>Fragt nach Aufwand, Zeit, Service</td><td>„Wir übernehmen das komplett“</td></tr>
<tr><td>Ansehen / Status</td><td>Erwähnt Wettbewerber, Außenwirkung, Marke</td><td>Exklusivität, „führende Unternehmen“</td></tr>
<tr><td>Gesundheit / Wohlbefinden</td><td>Spricht über Stress, Belastung</td><td>Entlastung, Ruhe</td></tr>
<tr><td>Neugier / Innovation</td><td>Fragt nach Neuem, Technik, Trends</td><td>„Als einer der Ersten“</td></tr>
<tr><td>Angst vor Verlust</td><td>Spricht über Probleme, Konkurrenzdruck</td><td>Kosten des Nichtstuns (Verlustaversion)</td></tr>
</table>
<h2>Wie du das Motiv findest</h2>
<ol>
<li>Höre auf die ERSTE Frage des Kunden. Sie verrät meist das Hauptmotiv.</li>
<li>Frage: „Was ist Ihnen bei so einer Entscheidung am wichtigsten?“ und dann: „Und warum ist Ihnen das wichtig?“ (zweimal „warum“ führt zum echten Motiv).</li>
<li>Beobachte, wo er sich vorbeugt (Modul 4).</li>
</ol>
<p>Dann sprichst du das Hauptmotiv in 70 % deiner Argumente an, das Nebenmotiv in 30 %. Alle sieben Motive aufzuzählen verwässert alles.</p>
`,
      quellen: [
        "Deci, E. L., & Ryan, R. M. (2000). The „what“ and „why“ of goal pursuits: Human needs and the self-determination of behavior. <em>Psychological Inquiry</em>, 11(4), 227-268.",
        "Ryan, R. M., & Deci, E. L. (2017). <em>Self-Determination Theory</em>. Guilford Press.",
        "Maslow, A. H. (1943). A theory of human motivation. <em>Psychological Review</em>, 50(4), 370-396.",
        "Limbeck, M. (2010). <em>Nicht gekauft hat er schon</em>. Redline."
      ],
      quiz: [
        { frage: "Welche drei Grundbedürfnisse nennt die Selbstbestimmungstheorie?", optionen: ["Geld, Macht, Ruhm", "Autonomie, Kompetenz, Verbundenheit", "Sicherheit, Status, Bequemlichkeit", "Essen, Schlaf, Sex"], richtig: 1, erklaerung: "Deci & Ryan: die am besten belegten psychologischen Grundbedürfnisse." },
        { frage: "Woran erkennst du das Motiv „Sicherheit“?", optionen: ["Kunde fragt nach Rendite", "Kunde fragt nach Garantie, Referenzen, Risiken", "Kunde fragt nach Trends", "Kunde fragt nach Marke"], richtig: 1, erklaerung: "Sicherheitsorientierte wollen Risiken ausschließen." },
        { frage: "Wie viel Prozent deiner Argumente sollten das Hauptmotiv ansprechen?", optionen: ["10 %", "30 %", "70 %", "100 %"], richtig: 2, erklaerung: "70 % Hauptmotiv, 30 % Nebenmotiv. Alle Motive aufzählen verwässert." }
      ],
      uebung: "Analysiere drei Menschen aus deinem Umfeld: Welches Kaufmotiv dominiert bei ihnen? Woran erkennst du es? Formuliere für jeden einen Satz, der genau dieses Motiv anspricht."
    },
    {
      id: "a2",
      titel: "Persönlichkeitstypen: DISG, Big Five und die Wahrheit dazwischen",
      dauer: "14 Min",
      inhalt: `
<h2>DISG: Beliebt, aber wissenschaftlich schwach</h2>
<p>Das DISG-Modell (DISC) geht auf William Marston (1928) zurück und ist in Vertriebstrainings allgegenwärtig. Vier Typen:</p>
<table>
<tr><th>Typ</th><th>Merkmale</th><th>Wie du ihn behandelst</th></tr>
<tr><td><strong>D</strong>ominant (rot)</td><td>Direkt, ergebnisorientiert, ungeduldig, will Kontrolle</td><td>Kurz, auf den Punkt, Optionen statt Vorschriften, Ergebnisse zuerst. Kein Smalltalk.</td></tr>
<tr><td><strong>I</strong>nitiativ (gelb)</td><td>Gesellig, enthusiastisch, redet viel, impulsiv</td><td>Beziehung aufbauen, Begeisterung spiegeln, Geschichten, dann konkret werden und Details schriftlich nachliefern.</td></tr>
<tr><td><strong>S</strong>tetig (grün)</td><td>Geduldig, loyal, harmoniebedürftig, risikoscheu</td><td>Langsam, Sicherheit, Garantien, Zeit lassen, nie drängen, persönliche Betreuung betonen.</td></tr>
<tr><td><strong>G</strong>ewissenhaft (blau)</td><td>Analytisch, präzise, skeptisch, braucht Daten</td><td>Fakten, Zahlen, Belege, Vergleiche, keine Superlative, schriftliche Unterlagen.</td></tr>
</table>
<p><strong>Das Problem:</strong> DISG hat eine schwache Testgüte. Menschen sind keine vier Typen. Eine Studie des Instituts für Psychologie der Uni Hamburg (Hossiep & Mühlhaus) und Reviews im <em>Journal of Personality Assessment</em> zeigen geringe Retest-Reliabilität und Validität. Es ist ein Gesprächsraster, kein Messinstrument.</p>
<h2>Big Five: Das wissenschaftliche Modell</h2>
<p>Die Big Five (Costa & McCrae, 1992) sind das in der Forschung etablierte Persönlichkeitsmodell, kulturübergreifend repliziert. Fünf Dimensionen, jeweils als Spektrum:</p>
<ul>
<li><strong>Offenheit:</strong> Hoch = will Neues, Innovation, Ideen. Niedrig = will Bewährtes.</li>
<li><strong>Gewissenhaftigkeit:</strong> Hoch = will Details, Pläne, Zuverlässigkeit. Niedrig = will es unkompliziert.</li>
<li><strong>Extraversion:</strong> Hoch = redet, will Energie, Tempo. Niedrig = will Ruhe, schriftlich, Zeit.</li>
<li><strong>Verträglichkeit:</strong> Hoch = will Harmonie, vermeidet Konflikt, sagt selten direkt Nein (Achtung: höfliche Zusagen ohne Substanz). Niedrig = fordernd, skeptisch, verhandelt hart.</li>
<li><strong>Neurotizismus:</strong> Hoch = ängstlich, braucht Sicherheit und Rückversicherung. Niedrig = gelassen, entscheidet schnell.</li>
</ul>
<h2>Wie du es praktisch nutzt</h2>
<p>Nutze DISG als schnelle Heuristik in den ersten zwei Minuten (Tempo? Gesprächigkeit? Fragt nach Daten oder nach Beziehung?), aber bleibe flexibel. Nutze die Big Five, um deine Hypothese zu verfeinern: Ein ängstlicher, gewissenhafter Kunde braucht Garantien UND Daten. Ein extrovertierter, offener Kunde braucht Geschichten UND Neuheit.</p>
<p>Die wichtigste Regel: <strong>Passe dein Tempo, deine Detailtiefe und dein Energielevel an den Kunden an, nicht umgekehrt.</strong> Das ist Spiegeln auf Persönlichkeitsebene.</p>
`,
      quellen: [
        "Marston, W. M. (1928). <em>Emotions of Normal People</em>. Kegan Paul.",
        "Costa, P. T., & McCrae, R. R. (1992). <em>NEO PI-R Professional Manual</em>. Psychological Assessment Resources.",
        "John, O. P., & Srivastava, S. (1999). The Big Five trait taxonomy. In: <em>Handbook of Personality</em>. Guilford.",
        "Hossiep, R., & Mühlhaus, O. (2015). <em>Personalauswahl und -entwicklung mit Persönlichkeitstests</em>. Hogrefe. (Kritik an DISG)"
      ],
      quiz: [
        { frage: "Wie behandelst du einen dominanten (D) Kunden?", optionen: ["Viel Smalltalk", "Kurz, Ergebnisse zuerst, Optionen statt Vorschriften", "Langsam und mit Garantien", "Mit vielen Details"], richtig: 1, erklaerung: "D-Typen wollen Kontrolle und Tempo." },
        { frage: "Was ist das Hauptproblem von DISG?", optionen: ["Zu kompliziert", "Schwache wissenschaftliche Testgüte", "Zu teuer", "Nur auf Englisch"], richtig: 1, erklaerung: "Ein Gesprächsraster, kein Messinstrument." },
        { frage: "Was braucht ein Kunde mit hohem Neurotizismus?", optionen: ["Tempo", "Innovation", "Sicherheit und Rückversicherung", "Humor"], richtig: 2, erklaerung: "Ängstliche Kunden brauchen Garantien und Zeit." },
        { frage: "Was ist die Gefahr bei hoch verträglichen Kunden?", optionen: ["Sie verhandeln hart", "Sie sagen höflich Ja, ohne es zu meinen", "Sie reden zu viel", "Sie fragen zu viel"], richtig: 1, erklaerung: "Konfliktvermeidung führt zu Zusagen ohne Substanz. Nachprüfen." }
      ],
      uebung: "Ordne fünf Menschen, die du kennst, grob nach DISG und nach Big Five ein. Beschreibe für jeden in zwei Sätzen, wie du ihm etwas verkaufen würdest. Prüfe im Kundenanalyse-Tool der App."
    },
    {
      id: "a3",
      titel: "Qualifizierung: Kann dieser Kunde überhaupt kaufen?",
      dauer: "12 Min",
      inhalt: `
<p>Der teuerste Fehler im Vertrieb ist Zeit mit Menschen, die nie kaufen werden. Qualifizierung heißt: früh herausfinden, ob es sich lohnt.</p>
<h2>BANT (IBM, 1960er)</h2>
<ul>
<li><strong>B</strong>udget: Gibt es Geld? „Welchen Rahmen haben Sie dafür vorgesehen?“</li>
<li><strong>A</strong>uthority: Entscheidet diese Person? „Wer ist außer Ihnen an der Entscheidung beteiligt?“</li>
<li><strong>N</strong>eed: Gibt es ein echtes Problem? (SPIN)</li>
<li><strong>T</strong>iming: Wann? „Was passiert, wenn Sie es dieses Quartal nicht lösen?“</li>
</ul>
<p>BANT ist einfach und für kleine Verkäufe ausreichend. Kritik: Es fragt zu früh nach Budget (wirkt verkäuferisch) und ignoriert den Prozess.</p>
<h2>MEDDIC (PTC, 1990er, für komplexe B2B-Verkäufe)</h2>
<ul>
<li><strong>M</strong>etrics: Welche messbare Verbesserung erwartet der Kunde?</li>
<li><strong>E</strong>conomic Buyer: Wer hat die Budgethoheit? (Oft nicht dein Gesprächspartner.)</li>
<li><strong>D</strong>ecision Criteria: Nach welchen Kriterien wird entschieden?</li>
<li><strong>D</strong>ecision Process: Welche Schritte, wer, wann?</li>
<li><strong>I</strong>dentify Pain: Was ist der konkrete Schmerz?</li>
<li><strong>C</strong>hampion: Gibt es intern jemanden, der für dich kämpft?</li>
</ul>
<h2>Das Buying Center</h2>
<p>Webster und Wind (1972) beschrieben, dass bei Firmenkäufen mehrere Rollen beteiligt sind: Nutzer, Beeinflusser, Entscheider, Einkäufer, Gatekeeper. CEB/Gartner fand 2017: An einer typischen B2B-Kaufentscheidung sind durchschnittlich 6,8 Personen beteiligt. Wer nur mit einer redet, verliert.</p>
<h2>Rote Flaggen (Zeit sparen)</h2>
<ul>
<li>„Schicken Sie mir mal was zu.“ ohne Termin = meist Abwimmeln. Antwort: „Gern. Damit ich das Richtige schicke: Was genau soll es beantworten? Und wann besprechen wir es?“</li>
<li>Kein Zugang zum Entscheider nach dem zweiten Gespräch.</li>
<li>Der Kunde kann nicht sagen, was passiert, wenn er nichts tut.</li>
<li>Reine Preisanfragen ohne Interesse am Problem (Vergleichsangebot für den bestehenden Anbieter).</li>
</ul>
<div class="callout practice"><span class="label">Bootcamp</span>Du wirst lernen, Nein zu Kunden zu sagen. Ein „Ich glaube, wir passen nicht zusammen“ zur richtigen Zeit ist Prize Frame (Klaff) und spart Monate.</div>
`,
      quellen: [
        "Webster, F. E., & Wind, Y. (1972). A general model for understanding organizational buying behavior. <em>Journal of Marketing</em>, 36(2), 12-19.",
        "Gartner/CEB (2017). The New B2B Buying Journey. (6,8 Beteiligte)",
        "Dunkel, J. (PTC, 1996). MEDDIC Sales Qualification Framework.",
        "IBM Sales Training (1960er). BANT."
      ],
      quiz: [
        { frage: "Wofür steht das A in BANT?", optionen: ["Attention", "Authority (Entscheidungsbefugnis)", "Attitude", "Amount"], richtig: 1, erklaerung: "Entscheidet diese Person überhaupt?" },
        { frage: "Wie viele Personen sind laut Gartner an einer B2B-Kaufentscheidung beteiligt?", optionen: ["1-2", "3-4", "Etwa 6,8", "Über 20"], richtig: 2, erklaerung: "Wer nur mit einer Person spricht, verliert." },
        { frage: "Was ist ein Champion im MEDDIC-Modell?", optionen: ["Der beste Verkäufer", "Jemand im Kundenunternehmen, der intern für dich kämpft", "Der Geschäftsführer", "Der Wettbewerber"], richtig: 1, erklaerung: "Ohne internen Fürsprecher stirbt der Deal in Meetings, bei denen du nicht dabei bist." },
        { frage: "Was antwortest du auf „Schicken Sie mir mal was zu“?", optionen: ["Sofort alles schicken", "Nachfragen, was es beantworten soll, und einen Besprechungstermin festlegen", "Ablehnen", "Nach dem Budget fragen"], richtig: 1, erklaerung: "Ohne Termin ist es meist ein Abwimmeln." }
      ],
      uebung: "Nimm eine Verkaufschance (echt oder fiktiv) und fülle BANT und MEDDIC vollständig aus. Markiere jedes Feld, das du NICHT weißt. Formuliere für jedes unbekannte Feld die Frage, die es klärt."
    }
  ]
});

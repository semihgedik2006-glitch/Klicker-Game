// Milliardärs-Bibliothek. status: "primaer" (an Primärquelle geprüft), "buch" (Buch/Rede bekannt, Wortlaut vor Zitat prüfen), "zugeschrieben" (nur Sekundärquellen).
// Quelle: research/tech-milliardaere-verkaufen.md und research/milliardaere-investoren.md
window.MILLIARDAERE = [
  { id: "jobs", name: "Steve Jobs", firma: "Apple", kategorie: "tech", prio: true,
    kurz: "Gründer von Apple und Pixar. Der beste Produkt-Präsentator seiner Generation. Lehre: vom Kunden her denken, eine Botschaft, Dramaturgie.",
    zitate: [
      { en: "You've got to start with the customer experience and work backwards to the technology. You can't start with the technology and try to figure out where you're going to try to sell it.", de: "Man muss beim Kundenerlebnis anfangen und sich zur Technik zurückarbeiten. Man kann nicht mit der Technik anfangen und dann herausfinden, wo man sie verkaufen will.", quelle: "WWDC, Fragerunde, 16. Mai 1997", status: "primaer", lektion: "Nutzen vor Merkmal. Und: Jobs antwortete auf einen öffentlichen Angriff ruhig und sachlich. Ruhe unter Druck ist Kompetenzsignal.", thema: "kunde" },
      { en: "It's really hard to design products by focus groups. A lot of times, people don't know what they want until you show it to them.", de: "Es ist sehr schwer, Produkte mit Fokusgruppen zu entwerfen. Oft wissen Menschen nicht, was sie wollen, bis man es ihnen zeigt.", quelle: "BusinessWeek, 25. Mai 1998", status: "primaer", lektion: "Zeigen statt beschreiben. Eine Demo schlägt jede Präsentation.", thema: "pitch" },
      { en: "Simple can be harder than complex: You have to work hard to get your thinking clean to make it simple. But it's worth it in the end because once you get there, you can move mountains.", de: "Einfach kann schwerer sein als komplex: Man muss hart arbeiten, um sein Denken so klar zu bekommen, dass es einfach wird. Aber es lohnt sich, denn dann kann man Berge versetzen.", quelle: "BusinessWeek, 25. Mai 1998", status: "primaer", lektion: "Dein Pitch ist erst fertig, wenn er in einem Satz passt.", thema: "pitch" },
      { en: "To me, marketing is about values. This is a very complicated world, it's a very noisy world. And we're not going to get the chance to get people to remember much about us. No company is. So we have to be really clear on what we want them to know about us.", de: "Für mich geht es im Marketing um Werte. Die Welt ist kompliziert und laut. Niemand wird sich viel über uns merken. Also müssen wir glasklar sein, was sie über uns wissen sollen.", quelle: "Interne Apple-Versammlung zu „Think Different“, 23. September 1997", status: "primaer", lektion: "Eine Botschaft, nicht zehn. Kunden merken sich eine Sache.", thema: "positionierung" },
      { en: "Focusing is about saying no.", de: "Fokussieren bedeutet, Nein zu sagen.", quelle: "WWDC, 16. Mai 1997", status: "primaer", lektion: "Auch im Verkauf: Nicht jeder Kunde, nicht jedes Feature, nicht jede Gelegenheit.", thema: "mindset" },
      { en: "Do you want to spend the rest of your life selling sugared water, or do you want a chance to change the world?", de: "Willst du den Rest deines Lebens Zuckerwasser verkaufen oder willst du eine Chance, die Welt zu verändern?", quelle: "An John Sculley, 1983; wiedergegeben in Sculley, „Odyssey“ (1987) und Isaacson, „Steve Jobs“ (2011)", status: "primaer", lektion: "Der stärkste Abschluss ist eine Frage, die den anderen über seine Identität entscheiden lässt.", thema: "abschluss" },
      { en: "1,000 songs in your pocket.", de: "1.000 Songs in deiner Tasche.", quelle: "iPod-Vorstellung, 23. Oktober 2001", status: "primaer", lektion: "Nicht „5 GB Festplatte“ (Merkmal), sondern was der Kunde davon hat (Nutzen). Übe: Jedes Merkmal deines Produkts in ein Bild übersetzen.", thema: "pitch" },
      { en: "Today, we're introducing three revolutionary products … an iPod, a phone, and an Internet communicator. An iPod, a phone … are you getting it? These are not three separate devices, this is one device, and we are calling it iPhone.", de: "Heute stellen wir drei revolutionäre Produkte vor … einen iPod, ein Telefon und einen Internet-Kommunikator. Ein iPod, ein Telefon … verstehen Sie es? Das sind nicht drei Geräte, das ist ein Gerät, und wir nennen es iPhone.", quelle: "Macworld-Keynote, 9. Januar 2007", status: "primaer", lektion: "Dreierregel, Wiederholung, Auflösung am Ende: klassische Pitch-Dramaturgie.", thema: "pitch" },
      { en: "The people who can make the company more successful are sales and marketing people, and they end up running the companies. And the product people get driven out of the decision making forums, and the companies forget what it means to make great products.", de: "Die Leute, die die Firma erfolgreicher machen können, sind Vertriebs- und Marketingleute, und am Ende leiten sie die Firmen. Die Produktleute werden verdrängt, und die Firmen vergessen, was es heißt, großartige Produkte zu bauen.", quelle: "Interview mit Robert Cringely, 1995 („The Lost Interview“, 2012)", status: "primaer", lektion: "Verkaufen ohne Substanz ist kurzfristig. Lerne verkaufen UND sorge dafür, dass es etwas Gutes ist.", thema: "mindset" },
      { en: "Real artists ship.", de: "Echte Künstler liefern aus.", quelle: "Jobs zum Macintosh-Team, 1983; dokumentiert von Andy Hertzfeld (folklore.org)", status: "primaer", lektion: "Abschluss zählt, nicht Vorbereitung. Irgendwann musst du fragen.", thema: "abschluss" },
      { en: "Your time is limited, so don't waste it living someone else's life.", de: "Deine Zeit ist begrenzt, also verschwende sie nicht damit, das Leben eines anderen zu leben.", quelle: "Stanford-Abschlussrede, 12. Juni 2005", status: "primaer", lektion: "Mindset.", thema: "mindset" }
    ],
    mythen: [
      { text: "Here's to the crazy ones…", wahrheit: "Geschrieben von der Agentur TBWA\\Chiat\\Day (Rob Siltanen, Lee Clow) für „Think Different“, 1997. Nicht von Jobs." },
      { text: "If I had asked people what they wanted, they would have said faster horses.", wahrheit: "Wird Jobs oder Henry Ford zugeschrieben. Für Ford kein Beleg vor den 2000ern. Jobs' echtes Zitat dazu ist das Fokusgruppen-Zitat von 1998." }
    ]
  },
  { id: "musk", name: "Elon Musk", firma: "Tesla, SpaceX", kategorie: "tech", prio: true,
    kurz: "Gründer von SpaceX, Chef von Tesla. Lehre: Feedback-Schleifen, negatives Feedback aktiv suchen, von ersten Prinzipien denken, Vision als Geschichte. Achtung: Zu Musk kursieren besonders viele erfundene Zitate.",
    zitate: [
      { en: "I think it's very important to have a feedback loop, where you're constantly thinking about what you've done and how you could be doing it better. I think that's the single best piece of advice: constantly think about how you could be doing things better and questioning yourself.", de: "Ich halte es für sehr wichtig, eine Feedback-Schleife zu haben, in der man ständig darüber nachdenkt, was man getan hat und wie man es besser machen könnte. Das ist der beste Rat überhaupt: ständig überlegen, wie man es besser machen kann, und sich selbst hinterfragen.", quelle: "Mashable-Interview, 13. April 2012", status: "primaer", lektion: "Nach jedem Verkaufsgespräch: Was lief gut, was mache ich nächstes Mal anders? Das Bootcamp zwingt dich zu diesem Debrief.", thema: "mindset" },
      { en: "Really pay attention to negative feedback, and solicit it, particularly from friends. Hardly anyone does that, and it's incredibly helpful.", de: "Achte wirklich auf negatives Feedback und hol es aktiv ein, besonders von Freunden. Fast niemand macht das, und es hilft unglaublich.", quelle: "Mashable-Interview, 2012", status: "primaer", lektion: "Frag nach jedem Nein: „Was genau hat Sie abgehalten?“ Das Nein ist die wertvollste Information.", thema: "mindset" },
      { en: "I think it's important to reason from first principles rather than by analogy. With first principles, you boil things down to the most fundamental truths and then reason up from there.", de: "Ich halte es für wichtig, von ersten Prinzipien aus zu denken statt per Analogie. Man bricht Dinge auf die grundlegendsten Wahrheiten herunter und denkt von dort aus nach oben.", quelle: "Interview mit Kevin Rose, „Foundation“, Folge 20, 2012", status: "primaer", lektion: "Nicht kopieren, was „man so macht“. Frage: Was braucht dieser Kunde wirklich? Was kostet die Lösung wirklich?", thema: "mindset" },
      { en: "Build sports car. Use that money to build an affordable car. Use that money to build an even more affordable car. While doing above, also provide zero emission electric power generation options. Don't tell anyone.", de: "Baue einen Sportwagen. Nutze das Geld für ein bezahlbares Auto. Nutze das Geld für ein noch bezahlbareres Auto. Biete dabei emissionsfreie Stromerzeugung an. Sag es niemandem.", quelle: "„The Secret Tesla Motors Master Plan“, Tesla-Blog, 2. August 2006", status: "primaer", lektion: "Eine Vision in vier Schritten, mit Augenzwinkern. Storytelling als Verkauf an Investoren und Kunden.", thema: "pitch" },
      { en: "We'll try a little advertising and see how it goes.", de: "Wir probieren ein wenig Werbung und schauen, wie es läuft.", quelle: "Tesla-Hauptversammlung, 16. Mai 2023 (Tesla machte zuvor jahrelang keine bezahlte Werbung)", status: "primaer", lektion: "Ein Produkt, über das Kunden reden, ist die billigste Werbung. Und selbst Tesla musste irgendwann aktiv verkaufen.", thema: "positionierung" }
    ],
    mythen: [
      { text: "When something is important enough, you do it even if the odds are not in your favor.", wahrheit: "Wird oft dem „60 Minutes“-Interview 2014 zugeordnet. Wörtliche Stelle nicht bestätigt. Nur als „zugeschrieben“." },
      { text: "Brand is just a perception, and perception will match reality over time.", wahrheit: "Keine Primärquelle auffindbar. Nicht verwenden." }
    ]
  },
  { id: "bezos", name: "Jeff Bezos", firma: "Amazon", kategorie: "tech", prio: false,
    kurz: "Gründer von Amazon. Lehre: Kundenbesessenheit, rückwärts vom Kunden arbeiten, erzählen statt Folien, Regret Minimization.",
    zitate: [
      { en: "We will continue to focus relentlessly on our customers.", de: "Wir werden uns weiterhin unerbittlich auf unsere Kunden konzentrieren.", quelle: "Brief an die Aktionäre 1997, Abschnitt „Obsess Over Customers“", status: "primaer", lektion: "Bezos legte diesen Brief jedem späteren Jahresbrief bei. Konsistenz der Botschaft über 25 Jahre.", thema: "kunde" },
      { en: "Customers are always beautifully, wonderfully dissatisfied, even when they report being happy and business is great. Even when they don't yet know it, customers want something better.", de: "Kunden sind immer wunderbar unzufrieden, selbst wenn sie sagen, sie seien glücklich. Auch wenn sie es noch nicht wissen, wollen Kunden etwas Besseres.", quelle: "Brief an die Aktionäre 2016", status: "primaer", lektion: "Es gibt immer ein Problem, das du lösen kannst. Finde es mit Implikationsfragen.", thema: "kunde" },
      { en: "If you make customers unhappy in the physical world, they might each tell 6 friends. If you make customers unhappy on the Internet, they can each tell 6,000 friends.", de: "Wenn du Kunden in der physischen Welt unglücklich machst, erzählt es vielleicht jeder sechs Freunden. Im Internet kann jeder es 6.000 Freunden erzählen.", quelle: "Fast Company, 1996", status: "primaer", lektion: "Ein schlechter Abschluss kostet mehr als ein verlorener Abschluss. Reputation ist das Kapital.", thema: "ethik" },
      { en: "Day 2 is stasis. Followed by irrelevance. Followed by excruciating, painful decline. Followed by death. And that is why it is always Day 1.", de: "Tag 2 ist Stillstand. Danach Bedeutungslosigkeit. Danach schmerzhafter Niedergang. Danach der Tod. Deshalb ist es immer Tag 1.", quelle: "Brief an die Aktionäre 2016", status: "primaer", lektion: "Mindset: Jeder Tag ist ein Anfang.", thema: "mindset" },
      { en: "We don't do PowerPoint (or any other slide-oriented) presentations at Amazon. Instead, we write narratively structured six-page memos.", de: "Bei Amazon machen wir keine PowerPoint-Präsentationen. Stattdessen schreiben wir erzählerisch aufgebaute sechsseitige Memos.", quelle: "Brief an die Aktionäre 2017", status: "primaer", lektion: "Wer es nicht in klaren Sätzen aufschreiben kann, hat es nicht verstanden. Schreibe dein Angebot auf einer Seite in ganzen Sätzen.", thema: "pitch" },
      { en: "I knew that when I was 80 I was not going to regret having tried this. I knew the one thing I might regret is not ever having tried.", de: "Ich wusste, dass ich mit 80 nicht bereuen würde, es versucht zu haben. Das Einzige, was ich bereuen könnte, wäre, es nie versucht zu haben.", quelle: "Academy of Achievement, Interview, 4. Mai 2001", status: "primaer", lektion: "Die Angst vor dem Anruf ist kleiner als das Bedauern, nicht angerufen zu haben.", thema: "mindset" }
    ],
    mythen: [
      { text: "Your brand is what other people say about you when you're not in the room.", wahrheit: "Wird fast überall Bezos zugeschrieben. Keine Primärquelle. Nicht als Bezos-Zitat verwenden." },
      { text: "Your margin is my opportunity.", wahrheit: "Überliefert in Brad Stone, „The Everything Store“ (2013). Kein eigener Text von Bezos." }
    ]
  },
  { id: "thiel", name: "Peter Thiel", firma: "PayPal, Palantir", kategorie: "tech", prio: false,
    kurz: "Mitgründer von PayPal, erster Investor bei Facebook. Sein Buch „Zero to One“ enthält das direkteste Kapitel über Verkauf aus der Tech-Welt.",
    zitate: [
      { en: "Poor sales rather than bad product is the most common cause of failure.", de: "Schlechter Vertrieb ist häufiger die Ursache des Scheiterns als ein schlechtes Produkt.", quelle: "Thiel & Masters, „Zero to One“ (2014), Kapitel 11", status: "primaer", lektion: "Warum du dieses Bootcamp machst.", thema: "mindset" },
      { en: "Superior sales and distribution by itself can create a monopoly, even with no product differentiation. The converse is not true.", de: "Überlegener Vertrieb allein kann ein Monopol schaffen, sogar ohne Produktunterschied. Umgekehrt gilt das nicht.", quelle: "„Zero to One“ (2014), Kapitel 11", status: "primaer", lektion: "Vertrieb ist kein Anhängsel, sondern Kernkompetenz.", thema: "mindset" },
      { en: "Whatever the career, sales ability distinguishes superstars from also-rans.", de: "In jedem Beruf trennt die Fähigkeit zu verkaufen die Superstars vom Mittelmaß.", quelle: "„Zero to One“ (2014), Kapitel 11", status: "primaer", lektion: "Auch wenn du nie „im Vertrieb“ arbeitest.", thema: "mindset" },
      { en: "Sales works best when hidden.", de: "Verkauf wirkt am besten, wenn man ihn nicht sieht.", quelle: "„Zero to One“ (2014), Kapitel 11", status: "primaer", lektion: "Der beste Verkäufer wirkt wie ein Berater, nicht wie ein Verkäufer. Fragen statt pitchen.", thema: "pitch" },
      { en: "What important truth do very few people agree with you on?", de: "Welche wichtige Wahrheit teilen nur sehr wenige Menschen mit dir?", quelle: "„Zero to One“ (2014), Kapitel 1", status: "primaer", lektion: "Deine Positionierung: Was weißt du über deinen Markt, das andere nicht glauben?", thema: "positionierung" }
    ], mythen: []
  },
  { id: "gates", name: "Bill Gates", firma: "Microsoft", kategorie: "tech", prio: false,
    kurz: "Gründer von Microsoft. 1980 verkaufte er IBM ein Betriebssystem, das er noch nicht besaß, und kaufte es dann.",
    zitate: [
      { en: "Your most unhappy customers are your greatest source of learning.", de: "Deine unzufriedensten Kunden sind deine größte Lernquelle.", quelle: "„Business @ the Speed of Thought“ (1999)", status: "primaer", lektion: "Einwände und Reklamationen sind Daten, keine Angriffe.", thema: "kunde" },
      { en: "Success is a lousy teacher. It seduces smart people into thinking they can't lose.", de: "Erfolg ist ein schlechter Lehrer. Er verführt kluge Menschen zu dem Glauben, sie könnten nicht verlieren.", quelle: "„The Road Ahead“ (1995)", status: "primaer", lektion: "Nach dem Abschluss: Debrief trotzdem. Warum hat es geklappt?", thema: "mindset" }
    ],
    mythen: [
      { text: "640K ought to be enough for anybody.", wahrheit: "Gates hat bestritten, das je gesagt zu haben. Kein Beleg." },
      { text: "I choose a lazy person to do a hard job…", wahrheit: "Keine Quelle bei Gates. Ähnliche Sprüche seit Jahrzehnten von anderen." }
    ]
  },
  { id: "zuckerberg", name: "Mark Zuckerberg", firma: "Meta", kategorie: "tech", prio: false,
    kurz: "Gründer von Facebook.",
    zitate: [
      { en: "People influence people. Nothing influences people more than a recommendation from a trusted friend.", de: "Menschen beeinflussen Menschen. Nichts beeinflusst Menschen mehr als die Empfehlung eines Freundes, dem sie vertrauen.", quelle: "Vorstellung von Facebook Ads, New York, 6. November 2007", status: "primaer", lektion: "Soziale Bewährtheit (Cialdini) aus Sicht des Plattform-Gründers. Sammle Empfehlungen aktiv.", thema: "kunde" },
      { en: "The biggest risk is not taking any risk. In a world that's changing really quickly, the only strategy that is guaranteed to fail is not taking risks.", de: "Das größte Risiko ist, kein Risiko einzugehen. In einer sich schnell verändernden Welt ist die einzige Strategie, die garantiert scheitert, kein Risiko einzugehen.", quelle: "Y Combinator Startup School, Interview mit Jessica Livingston, Oktober 2011", status: "primaer", lektion: "Der Anruf, den du nicht machst, ist das Risiko.", thema: "mindset" }
    ], mythen: []
  },
  { id: "huang", name: "Jensen Huang", firma: "Nvidia", kategorie: "tech", prio: false,
    kurz: "Gründer von Nvidia. Begann als Tellerwäscher bei Denny's.",
    zitate: [
      { en: "People with very high expectations have very low resilience, and unfortunately, resilience matters in success. I wish upon you ample doses of pain and suffering.", de: "Menschen mit sehr hohen Erwartungen haben sehr geringe Resilienz, und leider zählt Resilienz für den Erfolg. Ich wünsche Ihnen reichlich Schmerz und Leid.", quelle: "Stanford GSB, „View From The Top“, März 2024", status: "primaer", lektion: "Ablehnung ist Training. Das Bootcamp verlangt Neins von dir.", thema: "mindset" },
      { en: "Run, don't walk. Remember, either you're running for food, or you are running from being food.", de: "Renn, geh nicht. Entweder rennst du nach Futter, oder du rennst davor weg, selbst Futter zu sein.", quelle: "Abschlussrede, National Taiwan University, 27. Mai 2023", status: "primaer", lektion: "Tempo.", thema: "mindset" },
      { en: "The more you buy, the more you save.", de: "Je mehr Sie kaufen, desto mehr sparen Sie.", quelle: "Nvidia GTC-Keynote 2018, wiederholt Computex 2023", status: "primaer", lektion: "Ein ironischer Satz, der ein Kosten-Argument (Leistung pro Euro) in eine Kaufaufforderung dreht. Reframing.", thema: "pitch" }
    ], mythen: []
  },
  { id: "ma", name: "Jack Ma", firma: "Alibaba", kategorie: "tech", prio: false,
    kurz: "Gründer von Alibaba. Überzeugte Masayoshi Son 1999 in einem Pitch von wenigen Minuten zu einer Investition von rund 20 Millionen Dollar.",
    zitate: [
      { en: "Customers first, employees second, and shareholders third.", de: "Kunden zuerst, Mitarbeiter an zweiter Stelle, Aktionäre an dritter.", quelle: "Brief an Investoren im Börsenprospekt von Alibaba (F-1), Mai 2014; Davos 2015", status: "primaer", lektion: "Reihenfolge der Prioritäten.", thema: "kunde" },
      { en: "Today is hard, tomorrow will be worse, but the day after tomorrow will be sunshine.", de: "Heute ist hart, morgen wird es schlimmer, aber übermorgen scheint die Sonne.", quelle: "Von Ma in Reden häufig verwendet; Erstquelle nicht gesichert", status: "zugeschrieben", lektion: "Durchhalten.", thema: "mindset" }
    ], mythen: []
  },
  { id: "chesky", name: "Brian Chesky", firma: "Airbnb", kategorie: "tech", prio: false,
    kurz: "Gründer von Airbnb. Ging 2009 in New York selbst von Gastgeber zu Gastgeber und fotografierte Wohnungen.",
    zitate: [
      { en: "It's better to have 100 people that love you than a million people that sort of like you.", de: "Es ist besser, 100 Menschen zu haben, die dich lieben, als eine Million, die dich so halbwegs mögen.", quelle: "Masters of Scale (Podcast mit Reid Hoffman), 2017; der Rat stammt von Paul Graham (2009)", status: "primaer", lektion: "Am Anfang verkauft man persönlich, Kunde für Kunde. Dinge tun, die nicht skalieren.", thema: "kunde" }
    ], mythen: []
  },
  { id: "cuban", name: "Mark Cuban", firma: "broadcast.com, Dallas Mavericks", kategorie: "unternehmer", prio: false,
    kurz: "Verkaufte als Kind Müllsäcke von Tür zu Tür, später Software. Der direkteste Vertriebs-Verfechter unter den Milliardären.",
    zitate: [
      { en: "Sales cures all. Know how your company will make money and how you will actually make sales.", de: "Verkauf heilt alles. Wisse, wie deine Firma Geld verdient und wie du tatsächlich Verkäufe machst.", quelle: "„How to Win at the Sport of Business“ (2011); Fortune, 24. Dezember 2014", status: "primaer", lektion: "Alles andere ist zweitrangig.", thema: "mindset" },
      { en: "There has never been a business that succeeded without sales.", de: "Es hat noch nie ein Unternehmen gegeben, das ohne Verkauf erfolgreich war.", quelle: "iCONIC-Konferenz Chicago, 19. Mai 2015 (Inc.com)", status: "primaer", lektion: "", thema: "mindset" },
      { en: "I learned how to put myself in my customer's shoes.", de: "Ich habe gelernt, mich in die Lage meines Kunden zu versetzen.", quelle: "iCONIC 2015 (Inc.com)", status: "primaer", lektion: "Kundenperspektive.", thema: "kunde" },
      { en: "Everyone has the will to win. Only those with the will to prepare actually win.", de: "Jeder hat den Willen zu gewinnen. Nur die mit dem Willen, sich vorzubereiten, gewinnen wirklich.", quelle: "Cuban-AMA auf X, Januar 2024 (paraphrasiert Basketball-Coach Bobby Knight)", status: "primaer", lektion: "Vorbereitung vor jedem Gespräch ist Pflicht.", thema: "mindset" }
    ],
    mythen: [ { text: "Selling is about helping, not convincing.", wahrheit: "Häufig Cuban zugeschrieben, in geprüften Quellen nicht gefunden." } ]
  },
  { id: "buffett", name: "Warren Buffett", firma: "Berkshire Hathaway", kategorie: "investor", prio: false,
    kurz: "Der erfolgreichste Investor der Geschichte. Hatte panische Angst vor öffentlichem Reden, belegte für 100 Dollar den Dale-Carnegie-Kurs. Das Zertifikat ist das einzige Diplom in seinem Büro.",
    zitate: [
      { en: "Price is what you pay; value is what you get.", de: "Der Preis ist, was du zahlst; der Wert ist, was du bekommst.", quelle: "Aktionärsbrief 2008 (Buffett schreibt den Satz selbst Ben Graham zu)", status: "primaer", lektion: "Wer über den Preis diskutiert, hat den Wert nicht klar gemacht.", thema: "preis" },
      { en: "We simply attempt to be fearful when others are greedy and to be greedy only when others are fearful.", de: "Wir versuchen, ängstlich zu sein, wenn andere gierig sind, und nur dann gierig, wenn andere ängstlich sind.", quelle: "Aktionärsbrief 1986; NYT-Gastbeitrag „Buy American. I Am.“, 16. Oktober 2008", status: "buch", lektion: "Gegen den Strom denken.", thema: "mindset" },
      { en: "Lose money for the firm and I will be understanding; lose a shred of reputation for the firm, and I will be ruthless.", de: "Verliert Geld für die Firma, und ich werde Verständnis haben. Verliert auch nur einen Hauch Reputation, und ich werde gnadenlos sein.", quelle: "Aussage vor dem US-Kongress, 4. September 1991 (Salomon Brothers)", status: "buch", lektion: "Die ethische Leitplanke dieses Bootcamps. Kein Abschluss ist einen Ruf wert.", thema: "ethik" }
    ],
    mythen: [ { text: "It takes 20 years to build a reputation and five minutes to ruin it.", wahrheit: "Wird Buffett überall zugeschrieben. Kein Primärbeleg gefunden. Inhaltlich deckungsgleich mit seiner Kongressaussage 1991." } ]
  },
  { id: "munger", name: "Charlie Munger", firma: "Berkshire Hathaway", kategorie: "investor", prio: false,
    kurz: "Buffetts Partner. Hielt 1995 den Vortrag „The Psychology of Human Misjudgment“ und schenkte Cialdini aus Dankbarkeit für „Influence“ eine Berkshire-Aktie.",
    zitate: [
      { en: "Never, ever, think about something else when you should be thinking about the power of incentives.", de: "Denk niemals an etwas anderes, wenn du an die Macht der Anreize denken solltest.", quelle: "„The Psychology of Human Misjudgment“, Harvard, 1995", status: "primaer", lektion: "Frag immer: Wofür wird mein Gegenüber belohnt?", thema: "kunde" },
      { en: "If you would persuade, appeal to interest and not to reason.", de: "Wenn du überzeugen willst, sprich das Interesse an, nicht die Vernunft.", quelle: "Benjamin Franklin, von Munger zitiert in der Harvard-Rede 1995", status: "primaer", lektion: "Emotion und Interesse vor Logik.", thema: "kunde" },
      { en: "Invert, always invert.", de: "Umkehren, immer umkehren.", quelle: "Harvard-Rede 1995 (Munger zitiert den Mathematiker Jacobi)", status: "primaer", lektion: "Wie würde ich diesen Abschluss garantiert verlieren? Genau das vermeiden.", thema: "mindset" },
      { en: "I'm not entitled to have an opinion on this subject unless I can state the arguments against my position better than the people do who are supporting it.", de: "Ich habe kein Recht auf eine Meinung, solange ich die Gegenargumente nicht besser darlegen kann als ihre Vertreter.", quelle: "USC Law School Commencement, Mai 2007", status: "primaer", lektion: "Einwandbehandlung beginnt damit, den Einwand besser zu verstehen als der Kunde.", thema: "einwand" },
      { en: "The safest way to try and get what you want is to try and deserve what you want.", de: "Der sicherste Weg, zu bekommen, was du willst, ist, es dir zu verdienen.", quelle: "USC Law School Commencement, Mai 2007", status: "primaer", lektion: "", thema: "ethik" }
    ],
    mythen: [ { text: "Show me the incentive and I'll show you the outcome.", wahrheit: "Populäre Kurzform. Belegt ist nur die längere Fassung von 1995." } ]
  },
  { id: "dalio", name: "Ray Dalio", firma: "Bridgewater", kategorie: "investor", prio: false,
    kurz: "Gründer des größten Hedgefonds der Welt. Buch „Principles“ (2017).",
    zitate: [
      { en: "Pain + Reflection = Progress.", de: "Schmerz + Reflexion = Fortschritt.", quelle: "„Principles: Life and Work“ (2017)", status: "buch", lektion: "Jedes verlorene Gespräch wird nachbesprochen. Debrief ist Pflicht.", thema: "mindset" },
      { en: "Truth, or, more precisely, an accurate understanding of reality, is the essential foundation for any good outcome.", de: "Wahrheit, genauer: ein zutreffendes Verständnis der Realität, ist das Fundament jedes guten Ergebnisses.", quelle: "„Principles“ (2017), Life Principle 1", status: "buch", lektion: "Keine Selbsttäuschung über deine Zahlen.", thema: "mindset" }
    ], mythen: []
  },
  { id: "branson", name: "Richard Branson", firma: "Virgin Group", kategorie: "unternehmer", prio: false,
    kurz: "Gründer von über 400 Firmen unter der Marke Virgin. Hat immer ein Notizbuch dabei.",
    zitate: [
      { en: "Screw it, let's do it.", de: "Egal, machen wir's.", quelle: "Buchtitel „Screw It, Let's Do It“ (2006)", status: "buch", lektion: "Handeln vor Perfektion.", thema: "mindset" },
      { en: "Listen, Learn, Laugh, Lead.", de: "Zuhören, lernen, lachen, führen.", quelle: "„The Virgin Way“ (2014), Grundstruktur des Buchs", status: "buch", lektion: "Zuhören steht an erster Stelle.", thema: "kunde" }
    ],
    mythen: [ { text: "Take care of your employees and they will take care of your customers.", wahrheit: "Kurzform stammt ursprünglich von J. W. Marriott. Branson vertritt den Gedanken, hat ihn aber nicht geprägt." } ]
  },
  { id: "blakely", name: "Sara Blakely", firma: "Spanx", kategorie: "unternehmer", prio: false,
    kurz: "Verkaufte sieben Jahre lang Faxgeräte in der Kaltakquise, bevor sie Spanx gründete. Überzeugte den Neiman-Marcus-Einkäufer mit einer Vorführung auf der Damentoilette.",
    zitate: [
      { en: "What did you fail at this week?", de: "Woran bist du diese Woche gescheitert?", quelle: "Frage ihres Vaters am Esstisch; erzählt u. a. in Forbes-Porträt 2012, CNBC", status: "buch", lektion: "Scheitern heißt: nicht versucht zu haben. Das Bootcamp fragt dich dasselbe.", thema: "mindset" }
    ], mythen: []
  },
  { id: "oprah", name: "Oprah Winfrey", firma: "Harpo", kategorie: "unternehmer", prio: false,
    kurz: "Über 35.000 Interviews. Ihre Harvard-Rede 2013 enthält die wichtigste Zuhör-Lektion.",
    zitate: [
      { en: "We want to be validated. We want to be understood. Did you hear me? Do you see me? Did what I say mean anything to you?", de: "Wir wollen bestätigt werden. Wir wollen verstanden werden. Hast du mich gehört? Siehst du mich? Hat das, was ich gesagt habe, dir etwas bedeutet?", quelle: "Harvard Commencement, 30. Mai 2013", status: "primaer", lektion: "Jeder Kunde stellt sich diese drei Fragen. Aktives Zuhören und Labeling beantworten sie.", thema: "kunde" },
      { en: "There is no such thing as failure. Failure is just life trying to move us in another direction.", de: "So etwas wie Scheitern gibt es nicht. Scheitern ist nur das Leben, das versucht, uns in eine andere Richtung zu bewegen.", quelle: "Harvard Commencement 2013", status: "primaer", lektion: "", thema: "mindset" }
    ],
    mythen: [ { text: "Did you see me? / 30,000 people", wahrheit: "Original: „Do you see me?“ und „over 35,000 interviews“." } ]
  },
  { id: "kroc", name: "Ray Kroc", firma: "McDonald's", kategorie: "unternehmer", prio: false,
    kurz: "17 Jahre Pappbecher-Verkäufer, dann Multimixer-Vertreter, übernahm mit 52 McDonald's.",
    zitate: [
      { en: "Luck is a dividend of sweat. The more you sweat, the luckier you get.", de: "Glück ist eine Dividende des Schweißes. Je mehr du schwitzt, desto mehr Glück hast du.", quelle: "„Grinding It Out“ (1977)", status: "buch", lektion: "Aktivität schlägt Talent.", thema: "mindset" }
    ],
    mythen: [ { text: "We're not in the hamburger business, we're in real estate.", wahrheit: "Stammt von Finanzchef Harry Sonneborn (Love, „Behind the Arches“, 1986). Der Film „The Founder“ hat es Kroc zugeschrieben." } ]
  },
  { id: "knight", name: "Phil Knight", firma: "Nike", kategorie: "unternehmer", prio: false,
    kurz: "Scheiterte beim Verkauf von Enzyklopädien, verkaufte Laufschuhe mühelos, weil er daran glaubte.",
    zitate: [
      { en: "I realized that I wasn't selling. I believed in running.", de: "Mir wurde klar, dass ich gar nicht verkaufte. Ich glaubte an das Laufen.", quelle: "Stanford-GSB-Interview; ausführlich in „Shoe Dog“ (2016)", status: "primaer", lektion: "Überzeugung überträgt sich. Wer nicht ans Produkt glaubt, muss es verstehen oder wechseln. Belforts „Gewissheit“.", thema: "mindset" }
    ], mythen: []
  },
  { id: "walton", name: "Sam Walton", firma: "Walmart", kategorie: "unternehmer", prio: false,
    kurz: "Gründer von Walmart. Die „10-Foot-Rule“: Jeden Kunden innerhalb von drei Metern ansehen, grüßen, Hilfe anbieten.",
    zitate: [
      { en: "Exceed your customers' expectations. If you do, they'll come back over and over.", de: "Übertriff die Erwartungen deiner Kunden. Dann kommen sie immer wieder.", quelle: "„Sam Walton: Made in America“ (1992), Regel 8 der zehn Regeln", status: "buch", lektion: "Nach dem Abschluss beginnt der nächste Verkauf.", thema: "kunde" },
      { en: "There is only one boss. The customer. And he can fire everybody in the company from the chairman on down, simply by spending his money somewhere else.", de: "Es gibt nur einen Chef: den Kunden. Er kann jeden feuern, vom Vorstandschef abwärts, indem er sein Geld woanders ausgibt.", quelle: "Von Walmart Walton zugeschrieben; Seitenbeleg im Buch nicht gefunden", status: "zugeschrieben", lektion: "", thema: "kunde" }
    ], mythen: []
  },
  { id: "mateschitz", name: "Dietrich Mateschitz", firma: "Red Bull", kategorie: "unternehmer", prio: false,
    kurz: "Die Marktforschung lehnte Geschmack, Logo und Namen vor dem Start ab. Er startete trotzdem. Originalzitate auf Deutsch.",
    zitate: [
      { en: "", de: "Das Original ist das Mass aller Dinge.", quelle: "Bilanz-Interview, 31. März 2004", status: "primaer", lektion: "Differenzierung erlaubt Premiumpreise.", thema: "positionierung" },
      { en: "", de: "Der Konsument ist schon lange nicht mehr manipulierbar, sondern mündig. Er kann unterscheiden.", quelle: "Bilanz-Interview, 2004", status: "primaer", lektion: "Ehrlichkeit ist keine Moral-Frage, sondern Strategie.", thema: "ethik" },
      { en: "", de: "Wir haben je nach Markt und Marktsegment einen sechs- bis zehnfachen Preisbonus gegenüber Coca-Cola.", quelle: "Bilanz-Interview, 2004", status: "primaer", lektion: "Wer einzigartig ist, verhandelt nicht über Rabatte.", thema: "preis" }
    ], mythen: [ { text: "We don't bring the product to the people, we bring the people to the product.", wahrheit: "Kursiert als Mateschitz-Zitat, im Original nicht gefunden." } ]
  },
  { id: "wuerth", name: "Reinhold Würth", firma: "Würth-Gruppe", kategorie: "unternehmer", prio: false,
    kurz: "Baute ein Weltunternehmen über einen Außendienst mit über 40.000 Verkäufern auf. Schreibt handgeschriebene Briefe an den Außendienst.",
    zitate: [
      { en: "", de: "Diese Außendienstler sind im Grunde kleine selbstständige Unternehmer. Tun sie viel, verdienen sie auch viel, tun sie wenig, verdienen sie auch wenig.", quelle: "OMR Podcast mit Philipp Westermeyer, Oktober 2022", status: "primaer", lektion: "Verkauf ist Leistungsprinzip.", thema: "mindset" },
      { en: "", de: "Keiner will der Letzte sein, das ist wie in der Bundesliga.", quelle: "OMR Podcast, 2022", status: "primaer", lektion: "Ranking als Motivation. Deshalb hat das Bootcamp Statistiken.", thema: "mindset" },
      { en: "", de: "Wenn denen Emotion, Gefühl und Einfühlsamkeit in die Welt der Mitarbeiter fehlt, dann scheitern sie.", quelle: "Rede zum 90. Geburtstag, Stuttgarter Zeitung, 29. April 2025", status: "primaer", lektion: "Gilt für Kunden genauso.", thema: "kunde" }
    ], mythen: []
  },
  { id: "hoffman", name: "Reid Hoffman", firma: "LinkedIn", kategorie: "tech", prio: false, kurz: "Gründer von LinkedIn.",
    zitate: [ { en: "If you are not embarrassed by the first version of your product, you've launched too late.", de: "Wenn dir die erste Version deines Produkts nicht peinlich ist, hast du zu spät gestartet.", quelle: "Von Hoffman vielfach wiederholt und bestätigt (u. a. Masters of Scale); Erstquelle mit Datum nicht gesichert", status: "buch", lektion: "Raus zum Kunden, bevor alles perfekt ist.", thema: "mindset" } ], mythen: [] },
  { id: "kamprad", name: "Ingvar Kamprad", firma: "IKEA", kategorie: "unternehmer", prio: false, kurz: "Gründer von IKEA.",
    zitate: [ { en: "Only those who are asleep make no mistakes.", de: "Nur wer schläft, macht keine Fehler.", quelle: "„The Testament of a Furniture Dealer“ (1976)", status: "buch", lektion: "", thema: "mindset" } ], mythen: [] },
  { id: "bosch", name: "Robert Bosch", firma: "Bosch", kategorie: "unternehmer", prio: false, kurz: "Gründer von Bosch.",
    zitate: [ { en: "", de: "Lieber Geld verlieren als Vertrauen.", quelle: "Um 1919, Bosch-Archiv", status: "buch", lektion: "Die ethische Leitplanke, deutsch.", thema: "ethik" } ], mythen: [] },
  { id: "siemens", name: "Werner von Siemens", firma: "Siemens", kategorie: "unternehmer", prio: false, kurz: "Gründer von Siemens.",
    zitate: [ { en: "", de: "Für augenblicklichen Gewinn verkaufe ich die Zukunft nicht.", quelle: "Brief an Bruder Carl, 1884 (Siemens Historical Institute)", status: "buch", lektion: "Kein Abschluss ist eine Beziehung wert.", thema: "ethik" } ], mythen: [] },
  { id: "schwarzman", name: "Stephen Schwarzman", firma: "Blackstone", kategorie: "investor", prio: false, kurz: "Gründer von Blackstone.",
    zitate: [ { en: "It's as hard to do something big as it is to do something small.", de: "Etwas Großes zu tun ist genauso schwer wie etwas Kleines.", quelle: "„What It Takes“ (2019)", status: "buch", lektion: "Denk bei der Zielgröße nicht zu klein.", thema: "mindset" } ], mythen: [] },
  { id: "google", name: "Larry Page & Sergey Brin", firma: "Google", kategorie: "tech", prio: false, kurz: "Gründer von Google.",
    zitate: [ { en: "Focus on the user and all else will follow.", de: "Konzentriere dich auf den Nutzer, und alles andere folgt.", quelle: "Googles „Ten things we know to be true“, Punkt 1 (seit 2004)", status: "primaer", lektion: "", thema: "kunde" } ], mythen: [] }
];
window.MILLIARDAERE_THEMEN = { kunde: "Kundenperspektive", pitch: "Pitch & Botschaft", mindset: "Mindset & Resilienz", positionierung: "Positionierung", abschluss: "Abschluss", preis: "Wert & Preis", ethik: "Reputation & Ethik", einwand: "Einwände" };

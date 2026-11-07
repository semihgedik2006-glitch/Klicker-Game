// Kundenanalyse-Tool: Fragebogen -> Profil (Kaufmotiv, DISG-Tendenz, Big-Five-Hinweise, Qualifizierung) -> Gesprächsempfehlung
window.KA_FRAGEN = [
  { id: "erste_frage", text: "Was war die ERSTE Frage des Kunden?", typ: "wahl", optionen: [
    { text: "Was kostet das? / Was bringt mir das?", motiv: "gewinn" },
    { text: "Gibt es Garantie? / Referenzen? / Was, wenn es nicht klappt?", motiv: "sicherheit" },
    { text: "Wie viel Aufwand ist das für mich?", motiv: "bequemlichkeit" },
    { text: "Wer nutzt das noch? / Was macht der Wettbewerb?", motiv: "status" },
    { text: "Was ist neu daran? / Wie funktioniert die Technik?", motiv: "neugier" },
    { text: "Er hat über seine Probleme und seinen Stress gesprochen.", motiv: "verlust" }
  ]},
  { id: "tempo", text: "Wie spricht der Kunde?", typ: "wahl", optionen: [
    { text: "Schnell, direkt, unterbricht, will zum Punkt", disg: "D" },
    { text: "Lebhaft, viele Geschichten, springt zwischen Themen", disg: "I" },
    { text: "Ruhig, bedächtig, freundlich, lässt dich ausreden", disg: "S" },
    { text: "Präzise, fragt nach Details, skeptisch, wenig Smalltalk", disg: "G" }
  ]},
  { id: "entscheidung", text: "Wie entscheidet er?", typ: "wahl", optionen: [
    { text: "Schnell, aus dem Bauch, will Kontrolle über Optionen", disg: "D" },
    { text: "Begeistert sich schnell, vergisst Details, braucht Nachfassen", disg: "I" },
    { text: "Langsam, will Sicherheit, fragt Team oder Familie", disg: "S" },
    { text: "Nur mit Daten, Vergleichen, schriftlichen Unterlagen", disg: "G" }
  ]},
  { id: "neurotizismus", text: "Wie wirkt er emotional?", typ: "wahl", optionen: [
    { text: "Gelassen, entscheidet ohne große Sorge", big5: "stabil" },
    { text: "Besorgt, fragt mehrfach nach Risiken, braucht Rückversicherung", big5: "aengstlich" }
  ]},
  { id: "vertraeglich", text: "Wie geht er mit Widerspruch um?", typ: "wahl", optionen: [
    { text: "Sagt höflich Ja, auch wenn er Zweifel hat (Achtung: Zusagen ohne Substanz)", big5: "vertraeglich" },
    { text: "Fordernd, verhandelt hart, sagt klar Nein", big5: "fordernd" }
  ]},
  { id: "budget", text: "Budget: Gibt es Geld für die Lösung?", typ: "wahl", optionen: [ { text: "Ja, bekannt", bant: 1 }, { text: "Unklar", bant: 0 }, { text: "Nein, keins", bant: -1 } ] },
  { id: "authority", text: "Entscheidet diese Person allein?", typ: "wahl", optionen: [ { text: "Ja", bant: 1 }, { text: "Mit anderen (wer?)", bant: 0 }, { text: "Nein, nur Einfluss", bant: -1 } ] },
  { id: "need", text: "Hat er ein Problem, das er in Zahlen benennen kann?", typ: "wahl", optionen: [ { text: "Ja, mit Zahl", bant: 1 }, { text: "Vage", bant: 0 }, { text: "Sieht kein Problem", bant: -1 } ] },
  { id: "timing", text: "Kann er sagen, was passiert, wenn er nichts tut?", typ: "wahl", optionen: [ { text: "Ja, und es drängt", bant: 1 }, { text: "Irgendwann", bant: 0 }, { text: "Nichts passiert", bant: -1 } ] }
];
window.KA_MOTIVE = {
  gewinn: { name: "Gewinn / Sparen", sprache: "Zahlen, Rendite, Amortisation: „rechnet sich in X Monaten“, Kosten des Nichtstuns in Euro.", warnung: "Nicht mit Emotionen oder Status argumentieren. Er will die Rechnung sehen." },
  sicherheit: { name: "Sicherheit", sprache: "Garantien, Referenzen ähnlicher Kunden, Zertifikate, „bewährt seit“, Risikoumkehr, Testphase.", warnung: "Keine Superlative, kein Zeitdruck. Druck erzeugt Flucht." },
  bequemlichkeit: { name: "Bequemlichkeit", sprache: "„Wir übernehmen das komplett“, wenig Aufwand, ein Ansprechpartner, Zeitersparnis in Stunden.", warnung: "Keine komplexen Optionen. Eine klare Empfehlung." },
  status: { name: "Ansehen / Status", sprache: "Exklusivität, „führende Unternehmen“, Außenwirkung, was die Konkurrenz nicht hat.", warnung: "Nicht über Rabatte reden. Billig ist für ihn ein Makel." },
  neugier: { name: "Neugier / Innovation", sprache: "„Als einer der Ersten“, Technik erklären, Demo zeigen, Trends.", warnung: "Nicht zu konservativ wirken. Er will Neues, nicht Bewährtes." },
  verlust: { name: "Angst vor Verlust", sprache: "Kosten des Nichtstuns, was er verliert, Wettbewerbsdruck, Verlust-Framing.", warnung: "Nach der Problemphase Hoffnung geben, sonst erstarrt er." }
};
window.KA_DISG = {
  D: { name: "Dominant", tipps: "Kurz, auf den Punkt, Ergebnisse zuerst. Gib Optionen statt Vorschriften („A oder B?“). Kein Smalltalk, keine langen Erklärungen. Lass ihn entscheiden. Widersprich sachlich, nicht unterwürfig." },
  I: { name: "Initiativ", tipps: "Beziehung zuerst, Begeisterung spiegeln, Geschichten erzählen. Dann konkret werden und alles schriftlich nachliefern, weil er Details vergisst. Nachfassen ist Pflicht." },
  S: { name: "Stetig", tipps: "Langsam, geduldig, Sicherheit betonen. Nie drängen. Garantien, persönliche Betreuung, Zeit zum Überlegen. Frag, wen er einbeziehen will, und lade die Person ein." },
  G: { name: "Gewissenhaft", tipps: "Fakten, Zahlen, Belege, Vergleiche, schriftliche Unterlagen. Keine Superlative, keine Emotionen. Gib ihm Zeit zum Prüfen. Beantworte jede Detailfrage präzise oder sag ehrlich, dass du nachlieferst." }
};

/* KI-Coach: Chat, Rollenspiele, Berichtsprüfung, Business-Planer. Nutzt den Anthropic-API-Schlüssel aus den Einstellungen, direkt aus dem Browser. */
(function () {
  'use strict';
  const VA = window.VA; const { esc, md, toast } = VA;
  const API = 'https://api.anthropic.com/v1/messages';
  const VERSION = '2026-10-21';

  // ---------- API ----------
  function headers(key) { return { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': VERSION, 'anthropic-dangerous-direct-browser-access': 'true' }; }
  function errorText(status, body) {
    let msg = ''; try { msg = JSON.parse(body).error.message; } catch (e) { msg = body.slice(0, 200); }
    if (status === 401) return 'Schlüssel ungültig (401). Prüfe den API-Schlüssel in den Einstellungen.';
    if (status === 403) return 'Zugriff verweigert (403): ' + msg;
    if (status === 429) return 'Zu viele Anfragen oder Guthaben erschöpft (429). Kurz warten oder Guthaben unter console.anthropic.com prüfen.';
    if (status === 529 || status === 503) return 'Anthropic ist gerade überlastet. In einer Minute nochmal.';
    return `Fehler ${status}: ${msg}`;
  }
  async function call(body, { onText, signal } = {}) {
    const S = VA.S; if (!S.apiKey) throw new Error('Kein API-Schlüssel. Trage ihn unter Einstellungen ein.');
    const req = { model: S.model || 'claude-opus-5-5', max_tokens: 4000, ...body };
    let res;
    try { res = await fetch(API, { method: 'POST', headers: headers(S.apiKey), body: JSON.stringify({ ...req, stream: !!onText }), signal }); }
    catch (e) { if (e.name === 'AbortError') throw e; throw new Error('Keine Verbindung zu api.anthropic.com. Internet prüfen; Browser-Erweiterungen (Adblocker) können die Anfrage blockieren.'); }
    if (!res.ok) throw new Error(errorText(res.status, await res.text()));
    if (!onText) { const j = await res.json(); if (j.stop_reason === 'refusal') throw new Error('Die Anfrage wurde aus Sicherheitsgründen abgelehnt. Formuliere sie anders.'); return j.content.filter(c => c.type === 'text').map(c => c.text).join(''); }
    const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '', text = '', stop = null;
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      buf += dec.decode(value, { stream: true }); const lines = buf.split('\n'); buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data:')) continue; let ev; try { ev = JSON.parse(line.slice(5)); } catch (e) { continue; }
        if (ev.type === 'content_block_delta' && ev.delta && ev.delta.type === 'text_delta') { text += ev.delta.text; onText(text); }
        else if (ev.type === 'message_delta' && ev.delta) stop = ev.delta.stop_reason;
        else if (ev.type === 'error') throw new Error(ev.error ? ev.error.message : 'Stream-Fehler');
      }
    }
    if (stop === 'refusal') throw new Error('Die Antwort wurde aus Sicherheitsgründen abgebrochen. Formuliere die Anfrage anders.');
    if (stop === 'max_tokens') text += '\n\n_(Antwort wurde wegen Länge abgeschnitten. Schreib „weiter“.)_';
    return text;
  }
  async function test(key, model) {
    const res = await fetch(API, { method: 'POST', headers: headers(key), body: JSON.stringify({ model, max_tokens: 20, messages: [{ role: 'user', content: 'Antworte nur mit: bereit' }] }) });
    if (!res.ok) throw new Error(errorText(res.status, await res.text()));
    return true;
  }

  // ---------- Kontext und System-Prompts ----------
  function userContext() {
    const S = VA.S; const ns = VA.nextStep(); const cur = VA.currentKurs();
    const passed = VA.KURSE.filter(k => VA.examPassed(k.id)).map(k => k.nr + ' ' + k.titel);
    const lastReports = Object.entries(S.reports).flatMap(([lid, rs]) => rs.map(r => ({ lid, ...r }))).sort((a, b) => b.ts - a.ts).slice(0, 3).map(r => { const l = VA.findLesson(r.lid); return `- ${l ? l.lektion.titel : r.lid}: ${r.bestanden ? 'bestanden' : 'nicht bestanden'}, Auszug: "${r.text.slice(0, 200)}"`; }).join('\n');
    const lastNein = S.nein.slice(-2).map(n => `- A: ${n.a.slice(0, 120)} | B: ${n.b.slice(0, 120)}`).join('\n');
    return `## Über den Schüler
Name: ${S.name || 'unbekannt (frag nach dem Namen)'}
Rang: ${VA.rang()} · Curriculum: ${VA.totalProgress()} % · Tage in Folge: ${VA.streak()}
Bestandene Module: ${passed.length ? passed.join('; ') : 'noch keins'}
Aktuelles Modul: ${cur.nr} ${cur.titel} · Nächster Schritt: ${ns.text}
Wenn-Dann-Plan: ${S.plan || 'keiner'}
Wiederholung: ${Object.values(S.srs || {}).reduce((a, x) => a + x.n, 0)} Karten beantwortet
Einstufung: ${S.einstufung ? S.einstufung.gesamt + '/' + S.einstufung.n + ' richtig; schwach in: ' + (VA.KURSE.filter(k => (S.einstufung.module[k.id] || {}).ok === 0).map(k => k.titel).join(', ') || 'keinem Modul') + '; Vorwissen in: ' + (VA.KURSE.filter(k => { const m = S.einstufung.module[k.id]; return m && m.ok === m.n; }).map(k => k.titel).join(', ') || 'keinem Modul') : 'nicht gemacht'}
Fällige Wiedervorlagen (Übungen): ${(() => { const w = VA.wiedervorlagen ? VA.wiedervorlagen() : []; return w.length ? w.slice(0, 5).map(x => x.titel).join('; ') : 'keine'; })()}
Gesammelte Neins: ${S.nein.length} · Ablehnungstraining Tag ${Object.keys(S.ablehnung).length}/30 · Erfolgsprotokoll-Einträge: ${S.erfolg.length} · Beweisbuch: ${S.beweis.length}
Letzte Berichte:\n${lastReports || '- keine'}
Letzte Nein-Analysen:\n${lastNein || '- keine'}`;
  }
  const RULES = `# Rolle
Du bist der Coach der „Verkaufsakademie“, einem strengen persönlichen Bootcamp für Verkauf, Verkaufspsychologie, Körpersprache, Selbstvermarktung, Kundenanalyse und Verhandlung. Du sprichst Deutsch, duzt den Schüler, bist direkt, warm, aber kompromisslos in der Sache. Du bist kein Cheerleader und kein Erklärbär: Du fragst mehr, als du erklärst.

# Regeln (immer)
1. Belege markieren: Wenn du eine Behauptung über Wirkung machst, markiere die Evidenz: [A] robuste, replizierte Forschung · [B] Studien mit Einschränkungen · [C] Praxiserfahrung/Expertenmeinung · [D] Mythos oder widerlegt. Nenne bei [A]/[B] die Quelle (Autor, Jahr). Erfinde keine Studien. Wenn du unsicher bist, sag es.
2. „Woher weißt du das?“ ist deine Lieblingsfrage. Wenn der Schüler etwas über Kunden, Märkte oder sich selbst behauptet, frag nach dem Beleg.
3. Hypothetisches zählt nicht. „Ich würde…“ ist keine Übung. Nur Berichte über tatsächliches Verhalten gelten.
4. Jede Sitzung endet mit genau einer konkreten Aufgabe mit Datum (Format: „Aufgabe bis TT.MM.: …“), die im echten Leben stattfindet.
5. Keine Manipulation: Keine erfundene Knappheit, keine Lügen, keine Druck-Closes. Wer manipuliert, fällt durch. Erkläre bei Bedarf den Unterschied zwischen Überzeugen (Kunde gewinnt) und Manipulieren (Kunde verliert).
6. Kurz. Lieber drei scharfe Sätze und eine Frage als zehn Absätze. Nummerierte Listen nur, wenn es wirklich eine Liste ist.
7. Fachliche Basis: SPIN (Rackham), Challenger Sale, Voss (Spiegeln, Labeln, kalibrierte Fragen, Accusation Audit), Cialdini, Kahneman, Harvard-Konzept, Belforts Straight Line (nur die ethischen Teile: Drei Zehnen, Tonalität, Looping), Fiske (Wärme vor Kompetenz), Bandura (Selbstwirksamkeit), Seligman (ABCDE), Grant (Ambiverts), Gong-Daten (43:57, 11-14 Fragen, Preis spät).
8. Milliardärs-Zitate sind Evidenz [C] (Erfahrungswissen von Gewinnern, Survivorship Bias). Zitiere sie nur neben einer Studie, nie als alleinigen Beleg. Szenen aus Spielfilmen (The Founder, Air, The Wolf of Wall Street, The Social Network) und unautorisierten Biografien sind dramatisiert: sag das dazu.
10. Feedback-Disziplin: Zitiere die Stelle aus dem Text des Schülers, auf die du dich beziehst („Du schreibst: ‚…‘“). Trenne Fehler von vertretbaren Ermessensentscheidungen und sag, welches von beiden du meinst. Nenne die Ursache des Fehlers, nicht nur die Korrektur. Eine Hauptkorrektur schlägt fünf Nebensächlichkeiten. Bewerte die Arbeit, nie die Person. Dein Urteil ist eine Hypothese, die der Schüler an der Wirklichkeit prüft.
9. Bekannte Mythen, die du korrigierst, wenn sie auftauchen: 7-38-55 (Mehrabian, falsch verallgemeinert), Power Posing (nicht repliziert), Lügen an Körpersprache erkennen (54 % Trefferquote), NLP-Augenbewegungen, „Extrovertierte verkaufen besser“ (Ambiverts tun es), DISG als wissenschaftliches Instrument (ist es nicht).`;
  function sysCoach() { return `${RULES}\n\n# Modus: Coaching\nDu trainierst, prüfst und forderst. Frag am Anfang, was er heute geübt hat, falls der Kontext keine Aktivität zeigt. Beziehe dich auf sein aktuelles Modul und seine letzten Berichte.\n\n${userContext()}`; }
  function sysRollenspiel(s) {
    return `${RULES}\n\n# Modus: Rollenspiel
Du spielst jetzt die Kundenrolle. Bleib in der Rolle, bis der Schüler „ENDE“ schreibt. Antworte als diese Person, in natürlicher gesprochener Sprache, 1-4 Sätze, mit ihren Emotionen und Einwänden. Gib verdeckte Informationen NICHT von dir aus preis; nur wenn der Schüler sie durch gute Fragen, Spiegeln oder Labeln verdient. Reagiere realistisch: Auf Druck ziehst du dich zurück, auf echtes Interesse öffnest du dich. Wenn der Schüler manipuliert oder lügt, brich das Gespräch als Kunde ab.
Wenn der Schüler „ENDE“ schreibt, verlasse die Rolle und bewerte streng nach diesem Raster. Formatiere exakt so (jede Zeile einzeln):
BEWERTUNG
Vorbereitung: X/10 – Begründung
Fragen und Zuhören: X/10 – Begründung
Taktische Empathie: X/10 – Begründung
Anker und Zugeständnisse: X/10 – Begründung
Einwandbehandlung: X/10 – Begründung
Abschluss/nächster Schritt: X/10 – Begründung
Ethik: bestanden | nicht bestanden – Begründung
Pflichtkriterien: erfüllt N von ${s.pflicht.length}, fehlend: …
Gesamt: X/60
Danach: die zwei wichtigsten Verbesserungen und eine Aufgabe mit Datum. Bestanden ist ein Rollenspiel ab 42/60 UND Ethik bestanden UND alle Pflichtkriterien.

## Szenario: ${s.titel}
Lage: ${s.lage}
Deine Rolle (Persona): ${s.persona}
Verdeckte Informationen (nur bei verdienten Fragen preisgeben): ${s.verdeckt}
Ziel des Schülers: ${s.ziel}
Pflichtkriterien des Schülers: ${s.pflicht.map((p, i) => (i + 1) + '. ' + p).join(' ')}
${(() => { const p = (VA.S.rpPlan || {})[s.id]; return p ? `Vorbereitung des Schülers (nur für deine Bewertung, nie in der Rolle erwähnen): Ziel: ${p.ziel} | Erster Satz: ${p.erste} | Grenze: ${p.grenze}. Prüfe in der Bewertung unter „Vorbereitung“, ob er Ziel und Grenze gehalten hat, und benenne die Stelle, an der er davon abgewichen ist.` : 'Der Schüler hat keine Vorbereitung notiert. Zieh dafür unter „Vorbereitung“ Punkte ab und empfiehl am Ende die drei Zeilen (Ziel, erster Satz, Grenze).'; })()}

Eröffne das Gespräch sofort in der Rolle mit dem ersten Satz der Situation.\n\n${userContext()}`;
  }
  function lernMaterial() {
    const S = VA.S; const t = new Date().toISOString().slice(0, 10); const out = []; const blind = [];
    for (const k of VA.KURSE) for (const l of k.lektionen) if (VA.lessonDone(l.id)) l.quiz.forEach((q, i) => {
      const id = l.id + ':' + i; const st = S.srs[id];
      const item = { id, lektion: `${k.nr} ${l.titel}`, frage: q.frage, antwort: q.optionen[q.richtig], erkl: q.erklaerung, kern: l.kernpunkte || [] };
      if (S.blind && S.blind[id]) blind.push(item); else if (!st || st.due <= t) out.push(item);
    });
    const pick = blind.slice(0, 2).concat(out.sort(() => Math.random() - 0.5).slice(0, 6 - Math.min(2, blind.length)));
    return { items: pick, blindN: blind.length, dueN: out.length };
  }
  function sysLern() {
    const m = lernMaterial(); const S = VA.S;
    const k = S.kalib || {}; const kal = (k.sicher || 0) + (k.unsicher || 0) >= 10 ? `Kalibrierung: sicher ${k.sicherOk || 0}/${k.sicher || 0} richtig, unsicher ${k.unsicherOk || 0}/${k.unsicher || 0} richtig.` : 'Kalibrierung: noch zu wenig Daten.';
    return `${RULES}\n\n# Modus: Lernsitzung (10 bis 20 Minuten)
Du führst eine Lernsitzung nach den Regeln des Abrufübens. Harte Regeln:
1. Eröffne NIE mit einer Zusammenfassung („Letztes Mal haben wir …“). Eröffne mit der ersten Abruffrage aus dem Material unten. Eine Frage, dann warten.
2. Nach jeder Antwort fragst du zuerst: „Sicher, wahrscheinlich oder geraten?“ Erst nach seiner Einschätzung gibst du Feedback. Sicher und falsch nennst du ausdrücklich „blinder Fleck“ und kündigst an, dass die Frage morgen wiederkommt. Geraten und richtig ist ebenfalls brüchig: früher wiederholen.
3. Feedback nach Regel 10: zitieren, was richtig war, Fehler lokalisieren, Ursache nennen, zum Prinzip (Kernpunkt) verbinden, dann eine Variation stellen (andere Namen, Zahlen, Kontext), nie dieselbe Frage.
4. Zeig die Antwort nie vor einem Versuch, auch wenn er darum bittet. Gib stattdessen einen eingegrenzten Hinweis und verlange den Versuch. Erkläre einmal, warum: Antworten vor dem Versuch fühlen sich effizient an und bleiben nicht hängen.
5. Wenn er „fass mal zusammen“ oder „erklär mir nochmal“ sagt, antwortest du mit der kleinsten Frage, mit der er es selbst rekonstruieren kann.
6. Blinde Flecken zuerst, dann fällige Karten. Keine neuen Themen in der Sitzung.
7. Schluss nach vier bis sechs Fragen oder wenn er „ENDE“ schreibt, exakt in diesem Format:
LERNLOG
- Frage (Lektion) | Einschätzung | Ergebnis | nächste Wiederholung (morgen / in 3 Tagen / in 7 Tagen)
(eine Zeile pro Frage)
Dann ein Satz, was sich seit der letzten Sitzung messbar verbessert hat (nur mit Beleg aus dieser Sitzung, kein Lob ohne Grund), und wann er wiederkommen soll und wofür.

## Material für diese Sitzung
${m.blindN} blinde Flecken offen, ${m.dueN} Karten fällig. ${kal}
${m.items.length ? m.items.map((x, i) => `${i + 1}. [${(VA.S.blind && VA.S.blind[x.id]) ? 'BLINDER FLECK' : 'fällig'}] Lektion ${x.lektion}\n   Frage: ${x.frage}\n   Richtige Antwort: ${x.antwort}\n   Erklärung: ${x.erkl}\n   Kernpunkte der Lektion: ${x.kern.slice(0, 3).join(' · ')}`).join('\n') : 'Noch nichts fällig und keine Lektion abgeschlossen. Sag das in einem Satz und schick ihn in die nächste Lektion, keine Fragen erfinden.'}
Stelle die Fragen frei formuliert als offene Abruffragen (ohne Antwortoptionen), nicht als Multiple Choice.\n\n${userContext()}`;
  }
  function sysFall(f) {
    const R = window.FAELLE_RUBRIK || [];
    return `${RULES}\n\n# Modus: Fallbewertung
Du bewertest die Einschätzung des Schülers zu einem offenen Fall. Nicht nach Übereinstimmung mit einer Musterlösung, sondern nach der Qualität des Denkwegs, streng nach der Rubrik unten. Vorgehen:
1. Lies die Einschätzung vollständig. Zitiere zu jeder Dimension mindestens eine Stelle wörtlich („Du schreibst: ‚…‘“), auf die sich dein Urteil stützt. Ohne Zitat kein Urteil.
2. Trenne ausdrücklich: Fehler (etwas ist sachlich falsch oder fehlt, obwohl die Lage es hergibt) von vertretbaren Ermessensentscheidungen (ein anderer Weg, der mit Begründung gangbar wäre). Sag bei jeder Kritik, welches von beiden du meinst.
3. Bewerte jede Dimension mit 1, 2 oder 3 nach den drei Stufen. Im Zweifel die niedrigere Stufe, aber nie unter dem, was belegbar da ist.
4. Nenne genau EINE Hauptkorrektur: der Punkt, der die Antwort am meisten verbessern würde, mit Ursache (warum ist das passiert) und Bezug zum Prinzip.
5. Stelle zum Schluss eine Variation: dieselbe Struktur, andere Oberfläche (andere Branche, andere Zahlen), damit er die Korrektur sofort anwenden kann.
6. Dein Urteil ist eine Hypothese, die er an der Wirklichkeit prüft; sag das in einem Satz.
Formatiere die Bewertung exakt so:
BEWERTUNG FALL
${R.map(d => `${d.name}: X/3 – Zitat und Begründung`).join('\n')}
Gesamt: X/18
Hauptkorrektur: …
Vertretbar anders: … (was du anders gemacht hättest, aber nicht als Fehler zählst)
Variation: …

## Der Fall
${f.lage}
## Auftrag
${f.auftrag}
## Rubrik (Stufe 1 / 2 / 3)
${R.map(d => `${d.name} (${d.frage})\n  1: ${f.stufen[d.id][0]}\n  2: ${f.stufen[d.id][1]}\n  3: ${f.stufen[d.id][2]}`).join('\n')}
## Elemente einer starken Antwort (als Prüfliste, nicht als Pflichtwortlaut)
${f.stark.map(x => '- ' + x).join('\n')}
## Häufigste Falle
${f.falle}\n\n${userContext()}`;
  }
  function sysEinwand(e) {
    return `${RULES}\n\n# Modus: Einwand-Drill
Du spielst einen Kunden, der genau diesen Einwand bringt: „${e.einwand}“ (Kontext: ${e.kontext}). Was bei dir dahintersteckt: ${e.warum} Bleib in der Rolle, 1-3 Sätze pro Antwort, in gesprochener Sprache. Gib nicht nach, nur weil der Schüler argumentiert; gib nach, wenn er zuhört, anerkennt, isoliert oder fragt und dich dadurch zum Nachdenken bringt. Wenn er drängt, droht oder Rabatt ohne Gegenleistung anbietet, zieh dich zurück und sag warum (in der Rolle). Nach höchstens sechs Wechseln oder wenn der Schüler „ENDE“ schreibt, verlässt du die Rolle und bewertest in genau diesem Format:
BEWERTUNG EINWAND
Zugehört und anerkannt: X/10 – Begründung mit Zitat aus seiner Antwort
Erkundet statt verteidigt: X/10 – Begründung mit Zitat
Antwort mit Beleg oder Zahl: X/10 – Begründung mit Zitat
Nächster Schritt vereinbart: X/10 – Begründung
Falle vermieden (${e.falle.split('.')[0]}): ja | nein – Begründung
Gesamt: X/40
Danach ein Satz, was er beim nächsten Mal zuerst anders macht, und eine Aufgabe mit Datum. Bestanden ab 28/40 und Falle vermieden.
Eröffne sofort in der Rolle mit dem Einwand selbst, eingebettet in einen natürlichen Satz.\n\n${userContext()}`;
  }
  const FRAMEWORKS = [
    { id: 'A', name: 'Ideen-Check', text: 'Zehn harte Fragen zu einer Geschäftsidee. Ergebnis: Weitermachen, Umbauen oder Beerdigen, mit Begründung.', schritte: [
      'Welches Problem löst die Idee, und für wen genau? (Ein Satz. „Alle“ ist keine Antwort.)',
      'Wie lösen diese Menschen das Problem heute, und was kostet sie das in Euro oder Stunden?',
      'Woher weißt du, dass das Problem existiert? Nenne drei Gespräche mit Betroffenen, nicht deine Meinung.',
      'Hat schon jemand dafür Geld ausgegeben (Wettbewerber, Ersatzlösungen)? Wenn niemand, warum nicht?',
      'Wer ist der erste zahlende Kunde mit Namen? Kannst du ihn diese Woche anrufen?',
      'Was ist dein unfairer Vorteil: Zugang, Wissen, Netzwerk, Geschwindigkeit?',
      'Warum jetzt? Was hat sich im Markt oder in der Technik geändert?',
      'Was ist die kleinste Version, die du in 14 Tagen verkaufen kannst (nicht bauen, verkaufen)?',
      'Welche Annahme würde die Idee töten, wenn sie falsch ist? Wie testest du sie für unter 100 Euro?',
      'Entscheidung: Weitermachen, Umbauen oder Beerdigen. Begründung in drei Sätzen. Datum für den nächsten Test.'
    ] },
    { id: 'B', name: 'Lean Canvas', text: 'Die neun Felder nach Maurya, jedes mit „Woher weißt du das?“ geprüft.', schritte: [
      'Problem: die drei wichtigsten Probleme deiner Zielkunden, mit Beleg aus Gesprächen.',
      'Kundensegmente: wer genau, und wer ist der Early Adopter mit dem größten Schmerz?',
      'Wertversprechen: ein Satz, den ein Kunde versteht und weitererzählen kann.',
      'Lösung: pro Problem eine Funktion, nicht mehr.',
      'Kanäle: wie erreichst du die ersten 10, dann die ersten 100 Kunden?',
      'Einnahmen: Preis, Preismodell, Lebenszeitwert eines Kunden (grob gerechnet).',
      'Kosten: fixe und variable Kosten, Break-even in Kundenzahl.',
      'Kennzahlen: die eine Zahl, die dir diese Woche sagt, ob es funktioniert.',
      'Unfairer Vorteil: was kann nicht einfach kopiert werden?',
      'Die riskanteste Annahme markieren und einen Test mit Datum festlegen.'
    ] },
    { id: 'C', name: 'Erste Kunden (nach Aulet)', text: 'Marktsegmentierung, Beachhead, Persona, Top-10-Liste. Ergebnis: Menschen, die du diese Woche ansprichst.', schritte: [
      'Brainstorm: alle denkbaren Kundengruppen, mindestens zehn.',
      'Für jede: Zahlungsbereitschaft, Erreichbarkeit, Dringlichkeit, Konkurrenz, Referenzwirkung bewerten (1-5).',
      'Beachhead wählen: das eine Segment, das du zuerst gewinnst, klein genug, um es zu dominieren.',
      'Endnutzerprofil: Alter, Rolle, Tagesablauf, was ihn nachts wach hält.',
      'Eine Persona mit Namen, Foto und Zitat. Alle Entscheidungen werden an ihr geprüft.',
      'Lebenszyklus eines Kaufs: wie erfährt sie von dir, wie entscheidet sie, wer bezahlt, wie nutzt sie es?',
      'Top-10-Liste: zehn echte Menschen oder Firmen aus dem Beachhead, mit Kontaktweg.',
      'Diese Woche: drei Gespräche aus der Liste führen. Fragen stellen, nichts verkaufen. Bericht an den Coach.'
    ] },
    { id: 'D', name: 'Angebots-Baukasten', text: 'Aus Idee wird ein Angebot auf einer Seite, das ein Kunde versteht.', schritte: [
      'Traumergebnis des Kunden in einem Satz, in seinen Worten (aus Gesprächen).',
      'Wahrscheinlichkeit: Welche Belege zeigen, dass es klappt? (Referenzen, Zahlen, Garantie)',
      'Zeit bis zum Ergebnis: wie schnell merkt der Kunde etwas? Kann es schneller gehen?',
      'Aufwand für den Kunden: was muss er tun? Nimm ihm so viel wie möglich ab.',
      'Risikoumkehr: Testphase, Geld-zurück, Zahlung nach Ergebnis. Was kannst du dir leisten?',
      'Preisstufen: Basis, Standard, Premium. Der mittlere ist der, den du verkaufen willst.',
      'Name des Angebots: nicht „Beratungspaket“, sondern das Ergebnis.',
      'Eine Seite schreiben: Problem, Ergebnis, Ablauf, Beweis, Preis, Garantie, nächster Schritt.',
      'Drei Zielkunden die Seite zeigen und fragen: „Was ist unklar? Was würden Sie zahlen?“'
    ] },
    { id: 'E', name: 'Preisfindung (Van Westendorp)', text: 'Vier Preisfragen an zehn echte Kunden, Auswertung, präziser Preis mit Begründung.', schritte: [
      'Zehn Menschen aus deiner Zielgruppe finden, die das Angebot verstanden haben.',
      'Frage 1: „Ab welchem Preis wäre es so billig, dass Sie an der Qualität zweifeln?“',
      'Frage 2: „Welcher Preis wäre günstig, ein guter Deal?“',
      'Frage 3: „Ab welchem Preis wird es teuer, Sie müssten überlegen?“',
      'Frage 4: „Ab welchem Preis ist es so teuer, dass Sie es nicht kaufen?“',
      'Antworten in eine Tabelle, je Frage die kumulierten Prozentwerte eintragen.',
      'Den Bereich zwischen „zu billig“ und „zu teuer“ ablesen; der optimale Punkt liegt meist zwischen den Schnittpunkten.',
      'Präzisen Preis festlegen (nicht rund), Begründung in einem Satz, Vergleich zu Kosten und Wettbewerb.',
      'Mit dem Preis drei echte Verkaufsgespräche führen. Reaktionen dokumentieren.'
    ] },
    { id: 'F', name: 'Pitch-Trainer', text: 'Sieben Kriterien, iterieren, bis jedes mindestens 8/10 hat.', schritte: [
      'Pitch aufschreiben, maximal 150 Wörter, unter 60 Sekunden gesprochen.',
      'Kriterium 1: Problem mit einer Zahl im ersten Satz.',
      'Kriterium 2: Nutzen statt Funktion („1.000 Songs“, nicht „5 GB“).',
      'Kriterium 3: Eine konkrete Kundengeschichte in zwei Sätzen.',
      'Kriterium 4: Ein Beweis (Zahl, Referenz, Ergebnis).',
      'Kriterium 5: Positionierung: warum du, warum jetzt, anders als wer?',
      'Kriterium 6: Klarer Ask am Ende (Termin, Pilot, Einführung).',
      'Kriterium 7: Dreierregel genutzt, kein Fachjargon, kein Füllwort.',
      'Jedes Kriterium 0-10 bewerten, schwächstes zuerst verbessern, neu bewerten. Erst unter 8 aufhören, wenn alle ≥ 8.',
      'Pitch aufnehmen, anhören, drei Fremden vortragen, Feedback notieren.'
    ] },
    { id: 'G', name: 'Story-Baukasten', text: 'Drei Geschichten, die jeder Verkäufer braucht, je unter 90 Sekunden.', schritte: [
      'Gründungsgeschichte: Welcher Moment hat dich dazu gebracht? Situation, Wendepunkt, Entscheidung.',
      'Kundengeschichte: Ein Kunde, sein Problem in Zahlen, was ihr getan habt, Ergebnis in Zahlen, sein Zitat.',
      'Fehlergeschichte: Ein Fehler, was er gekostet hat, was du geändert hast. Macht dich glaubwürdig (Pratfall-Effekt).',
      'Struktur je Geschichte: Situation (2 Sätze), Wendepunkt (1 Satz), Ergebnis mit Zahl (1 Satz), Lehre (1 Satz).',
      'Laut vortragen und stoppen: unter 90 Sekunden, sonst kürzen.',
      'Jede Geschichte hat einen Zweck: Wärme, Beweis oder Vertrauen. Welche nutzt du wann im Gespräch?',
      'Diese Woche jede Geschichte einmal in einem echten Gespräch erzählen und die Reaktion notieren.'
    ] },
    { id: 'H', name: '4-Wochen-Marken-Plan', text: 'Positionierung, Zielgruppe, Kanal, wöchentlicher Output, Messgröße. Der Coach fragt wöchentlich ab.', schritte: [
      'Positionierung in einem Satz: „Ich helfe [wem] dabei, [Ergebnis] zu erreichen, ohne [Schmerz].“',
      'Zielgruppe: wo verbringt sie Zeit (eine Plattform, ein Verband, ein Ort)? Nur ein Kanal für vier Wochen.',
      'Beweise sammeln: drei Ergebnisse, drei Stimmen anderer (Pfeffer 2006: Lob durch Dritte wirkt).',
      'Woche 1: Profil und Positionierung fertig, fünf Gespräche mit Zielkunden, Fragen statt Pitch.',
      'Woche 2: drei Inhalte, die ein konkretes Problem lösen; zehn direkte Nachrichten mit Bezug.',
      'Woche 3: eine Kundengeschichte veröffentlichen, fünf Empfehlungen aktiv erbitten.',
      'Woche 4: ein Angebot machen (bezahlter Pilot, Workshop, Erstgespräch), zehn Menschen direkt ansprechen.',
      'Messgröße: Anzahl echter Gespräche pro Woche, nicht Likes. Wochenbericht an den Coach mit Datum.'
    ] },
    { id: 'I', name: 'Hindernis-Liste und Angebots-Stapel', text: 'Jedes Hindernis zwischen Kunde und Ergebnis wird zu einem Baustein des Angebots. Ergebnis: ein Stapel aus Kern, Boni, Garantie und Name, den der Kunde ohne Rückfrage versteht.', schritte: [
      'Das Ergebnis, das der Kunde kauft, in einem Satz in seinen Worten (nicht dein Produkt).',
      'Hindernisse VOR dem Kauf: Zweifel, Preis, Wechselaufwand, „Was sagt mein Chef?“ Mindestens fünf, aus echten Gesprächen oder Einwänden.',
      'Hindernisse WÄHREND: Wartezeit, Einarbeitung, Unbequemlichkeit, Abhängigkeit von dir. Mindestens fünf.',
      'Hindernisse DANACH: Hält es? Was, wenn es nicht wirkt? Wer hilft bei Problemen? Mindestens fünf. Ziel: 15 bis 30 Hindernisse insgesamt.',
      'Für jedes Hindernis eine Lösung (Feature, Service, Garantie, Format). Bewertung: Wert für den Kunden 1 bis 5, Kosten für dich 1 bis 5. Behalte hoher Wert, niedrige Kosten.',
      'Stapeln: Der Kern (beschrieben über das Ergebnis), zwei bis drei Boni (jeder tötet genau ein Hindernis), die Garantie (was passiert, wenn es nicht liefert; vorher durchrechnen, was sie bei realistischer Quote kostet).',
      'Knappheit und Dringlichkeit nur, wenn sie wahr sind (Startwoche, erste Charge). Nie ein erfundener Countdown.',
      'Name des Angebots: das Ergebnis, nicht die Firma. Test: Versteht ein Fremder in fünf Sekunden, was er bekommt?',
      'Wertgleichung vorher/nachher, je 1 bis 10: Traumergebnis, Wahrscheinlichkeit, Zeit bis zum Ergebnis, Aufwand. Welcher Baustein bewegt welche Zahl?',
      'Drei echten Zielkunden den neuen Stapel zeigen, dieselben Fragen wie beim alten. Welche Einwände sind weg, welche neu? Wenn nichts sich bewegt, liegt es nicht am Angebot, sondern an Markt oder Preis.'
    ] },
    { id: 'J', name: 'Stückkosten und Break-even', text: 'Bevor ein Preis steht, muss klar sein, was ein Stück kostet und wie viele du verkaufen musst, um zu leben. Ergebnis: Deckungsbeitrag, Break-even und ein Preis, der beides trägt.', schritte: [
      'Die Einheit festlegen: Was ist „ein Stück“? Eine Stunde, ein Paket, ein Monat Abo, ein Kunde?',
      'Variable Kosten pro Stück: alles, was nur anfällt, wenn du verkaufst (Material, Einkauf, Zahlungsgebühren, Versand, Stundenlohn für Zuarbeit). Echte Zahlen, keine Schätzungen aus dem Bauch.',
      'Fixkosten pro Monat: Miete, Software, Versicherung, dein Mindestgehalt zum Leben. Dein Gehalt gehört hinein, sonst rechnest du dich arm.',
      'Deckungsbeitrag = Preis minus variable Kosten. Bei drei Kandidatenpreisen (niedrig, mittel, hoch) ausrechnen.',
      'Break-even = Fixkosten geteilt durch Deckungsbeitrag. Wie viele Stück pro Monat bei jedem Preis? Ist das mit deiner Zeit und deinem Markt möglich? Wenn nicht: Preis hoch oder Kosten runter, nicht hoffen.',
      'Preis gegen den Markt: Was kosten die nächsten Ersatzlösungen für dieselbe Aufgabe, und was ist bei ihnen enthalten? Gleiches mit Gleichem vergleichen.',
      'Preis gegen den Kunden: die vier Van-Westendorp-Fragen an zehn echte Kunden (Framework E), wenn noch nicht geschehen. Liegt dein Preis im akzeptablen Bereich?',
      'Preisleiter: Basis, Standard, Premium mit je einem Grund, eine Stufe höher zu gehen. Der mittlere ist der, den du verkaufen willst.',
      'Startangebot: ein Vorteil zum Start mit Enddatum (Bonus, nicht Rabatt), damit du Kunden nicht beibringst, auf den nächsten Nachlass zu warten.',
      'Entscheidung: der Preis, der Deckungsbeitrag, der Break-even in Stück pro Monat, und das Datum, an dem du die Zahlen zum ersten Mal mit echten Verkäufen prüfst.'
    ] }
  ];
  function sysBusiness(fw) {
    return `${RULES}\n\n# Modus: Business-Planer
Du bist Sparringspartner und Umsetzungs-Coach für die Geschäftsideen des Schülers. Du planst UND setzt mit ihm um: konkrete Texte, Listen, Skripte, Preise, Pläne. Arbeite streng nach dem gewählten Framework, Schritt für Schritt, eine Frage auf einmal. Lass dir nichts Vages durchgehen („Zielgruppe: alle“ ist eine Antwort, die du ablehnst). Markiere, wo seine Annahmen ungetestet sind, und mache daraus Testaufgaben in der echten Welt (Gespräche, Anrufe, Verkäufe), nicht Recherche am Schreibtisch.
${fw ? `## Gewähltes Framework ${fw.id}: ${fw.name}\n${fw.text}\nSchritte (einen nach dem anderen, nie mehrere Fragen auf einmal):\n${fw.schritte.map((x, i) => (i + 1) + '. ' + x).join('\n')}` : '## Kein Framework gewählt\nFrag zuerst, welche Idee es ist, und schlage dann das passende Framework (A-H) vor: ' + FRAWORKS_LIST()}
\n${userContext()}`;
  }
  function FRAWORKS_LIST() { return FRAMEWORKS.map(f => `${f.id} ${f.name}`).join(', '); }

  // ---------- Berichtsprüfung ----------
  async function gradeReport({ kurs, lektion }, text) {
    const sys = `${RULES}\n\n# Modus: Berichtsprüfung\nDu prüfst einen Übungsbericht. Antworte NUR mit JSON: {"bestanden": true|false, "note": 1-10, "feedback": "…"}.\nKriterien: (1) Konkrete Handlung in der Vergangenheit, kein Hypothetisches. (2) Was tatsächlich passiert ist (Reaktion, Ergebnis). (3) Ein ehrlicher Lernpunkt, der sich auf die Lektion bezieht. (4) Plausibilität: Wenn der Bericht generisch, kopiert oder erfunden wirkt, fällt er durch. Bestanden ab Note 7.\nNotenstufen: 9-10 = alle vier Kriterien, Lernpunkt nennt einen Kernpunkt der Lektion und was beim nächsten Mal konkret anders läuft. 7-8 = Handlung und Ergebnis konkret, Lernpunkt vorhanden, aber allgemein. 4-6 = eine Komponente fehlt oder der Bericht bleibt vage. 1-3 = hypothetisch, generisch oder erfunden.\nIm Feedback zitierst du mindestens eine Stelle aus dem Bericht wörtlich, trennst Fehler von vertretbaren Entscheidungen und nennst genau eine Hauptkorrektur. Das Feedback: 3-6 Sätze, direkt, mit einer Nachfrage im Stil „Woher weißt du das?“ und einer konkreten Verbesserung. Deutsch, duzen.`;
    const user = `Modul ${kurs.nr}: ${kurs.titel}\nLektion: ${lektion.titel}\nAufgabe: ${lektion.uebung}\nKernpunkte der Lektion:\n${(lektion.kernpunkte || []).map(k => '- ' + k).join('\n')}\n\nBericht des Schülers:\n"""\n${text}\n"""`;
    const out = await call({ system: sys, messages: [{ role: 'user', content: user }], max_tokens: 800 });
    const m = out.match(/\{[\s\S]*\}/); if (!m) throw new Error('Unerwartete Antwort des Coaches.');
    const j = JSON.parse(m[0]); VA.touch();
    return { bestanden: !!j.bestanden && Number(j.note) >= 7, note: Number(j.note) || 0, feedback: String(j.feedback || ''), von: 'Coach' };
  }

  async function abrufFeedback({ kurs, lektion }, text) {
    const sys = `${RULES}\n\n# Modus: Abruf-Feedback\nDer Schüler hat nach dem Lesen einer Lektion aus dem Kopf zusammengefasst, was er behalten hat. Vergleiche seine Zusammenfassung mit den Kernpunkten der Lektion. Antworte in höchstens 6 Sätzen, Deutsch, duzen, kein JSON: (1) Was er richtig erfasst hat, in einem Satz. (2) Welcher Kernpunkt fehlt oder verdreht ist, konkret. (3) Eine Rückfrage, die ihn zwingt, den fehlenden Punkt selbst zu formulieren. Kein Lob ohne Grund, keine Listen.`;
    const user = `Modul ${kurs.nr}: ${kurs.titel}\nLektion: ${lektion.titel}\n\nKernpunkte der Lektion:\n${(lektion.kernpunkte || []).map(k => '- ' + k).join('\n')}\n\nZusammenfassung des Schülers:\n\"\"\"\n${text}\n\"\"\"`;
    const out = await call({ system: sys, messages: [{ role: 'user', content: user }], max_tokens: 600 }); VA.touch();
    return out.trim();
  }

  // ---------- Chat-Seite ----------
  let mode = 'coach', scenario = null, framework = null, einwand = null, fall = null, busy = false, abort = null;
  function chatKey() { return mode === 'rollenspiel' ? 'rp_' + scenario.id : mode === 'einwand' ? 'ew_' + einwand.id : mode === 'fall' ? 'fall_' + fall.id : mode === 'lern' ? 'lern_' + new Date().toISOString().slice(0, 10) : mode === 'business' ? 'biz_' + (framework ? framework.id : 'frei') : 'coach'; }
  function history() { const S = VA.S; return S.chats[chatKey()] = S.chats[chatKey()] || []; }
  function page(parts) {
    const S = VA.S; const qs = new URLSearchParams((location.hash.split('?')[1] || ''));
    if (qs.get('rp') && window.SZENARIEN.find(s => s.id === qs.get('rp'))) { mode = 'rollenspiel'; scenario = window.SZENARIEN.find(s => s.id === qs.get('rp')); }
    else if (qs.has('biz')) { mode = 'business'; framework = FRAMEWORKS.find(f => f.id === qs.get('biz')) || null; }
    else if (qs.get('einwand') && (window.EINWAENDE || []).find(x => x.id === qs.get('einwand'))) { mode = 'einwand'; einwand = window.EINWAENDE.find(x => x.id === qs.get('einwand')); }
    else if (qs.has('lern')) { mode = 'lern'; }
    else if (qs.get('fall') && (window.FAELLE || []).find(x => x.id === qs.get('fall'))) { mode = 'fall'; fall = window.FAELLE.find(x => x.id === qs.get('fall')); }
    else { mode = 'coach'; }
    const title = mode === 'rollenspiel' ? `Rollenspiel: ${scenario.titel}` : mode === 'einwand' ? `Einwand: „${einwand.einwand}“` : mode === 'lern' ? 'Lernsitzung' : mode === 'fall' ? `Fallbewertung: ${fall.titel}` : mode === 'business' ? `Business-Planer${framework ? ': ' + framework.name : ''}` : 'KI-Coach';
    if (!S.apiKey && mode === 'business' && framework) return `<div class="breadcrumb"><a href="#/business">Business-Planer</a> › ${esc(framework.name)}</div><section class="hero small"><div class="eyebrow">Leitfaden ${framework.id} · ohne Coach</div><h1>${esc(framework.name)}</h1><p class="lead">${esc(framework.text)}</p>
      <p class="muted">Arbeite die Schritte schriftlich durch und speichere deine Antworten unten im Business-Planer. Mit API-Schlüssel führt dich der Coach Schritt für Schritt und widerspricht, wo du vage bleibst.</p></section>
      <div class="card"><ol class="steps">${framework.schritte.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>
      <div class="btn-row"><a class="btn primary" href="#/business">Antworten im Business-Planer notieren</a><a class="btn ghost" href="#/einstellungen">Schlüssel eintragen</a></div>`;
    if (!S.apiKey) return `<section class="hero small"><div class="eyebrow">KI-Coach</div><h1>${esc(title)}</h1>
      ${mode === 'rollenspiel' ? `<div class="callout practice"><div class="label">Ohne Schlüssel</div>${scenario.offline ? `Dieses Szenario gibt es als <a href="#/rollenspiel/${scenario.id}">Offline-Version</a> mit Entscheidungsbaum.` : 'Dieses Szenario braucht den Live-Coach. Drei andere Szenarien sind <a href="#/rollenspiel">offline spielbar</a>.'}</div>` : ''}
      <p class="lead">Der Live-Coach braucht deinen Anthropic-API-Schlüssel. Er trainiert dich im Gespräch, spielt Kunden in Rollenspielen, bewertet deine Übungsberichte und plant mit dir deine Geschäftsideen.</p>
      <div class="callout"><div class="label">Einrichten</div><ol class="steps"><li>Konto unter console.anthropic.com anlegen und Guthaben laden.</li><li>Unter „API Keys“ einen Schlüssel erstellen.</li><li>Schlüssel in den <a href="#/einstellungen">Einstellungen</a> eintragen und „Verbindung testen“ klicken.</li></ol></div>
      <div class="callout study"><div class="label">Bis dahin</div>Alles andere funktioniert ohne Schlüssel: Lektionen, Quiz, Prüfungen, Offline-Rollenspiele, Drills, Checklisten, Bibliothek, Kundenanalyse. Berichte werden per Selbst-Check geprüft.</div></section>`;
    const h = history();
    return `<div class="chat-page">
      <div class="chat-head"><div><div class="eyebrow">${mode === 'rollenspiel' ? 'Rollenspiel · Schreib „ENDE“ für die Bewertung' : mode === 'business' ? 'Business-Planer' : 'Coaching'}</div><h1>${esc(title)}</h1></div>
        <div class="btn-row"><button class="btn small ghost" data-act="chat-mode" data-mode="coach" ${mode === 'coach' ? 'disabled' : ''}>Coach</button><a class="btn small ghost ${mode === 'lern' ? 'active' : ''}" href="#/coach?lern=1">Lernsitzung</a><a class="btn small ghost" href="#/rollenspiel">Rollenspiele</a><a class="btn small ghost" href="#/business">Business</a><button class="btn small ghost" data-act="chat-clear">Neu beginnen</button></div></div>
      ${mode === 'rollenspiel' ? `<div class="callout practice"><div class="label">Lage</div>${esc(scenario.lage)}<br><strong>Pflicht:</strong> ${scenario.pflicht.map(esc).join(' · ')}</div>` : mode === 'einwand' ? `<div class="callout practice"><div class="label">Lage</div>${esc(einwand.kontext)}. Der Kunde bringt den Einwand, du antwortest nach LAER. Schreib „ENDE“ für die Bewertung. <a href="#/einwaende/${einwand.id}">Zurück zum Drill</a></div>` : mode === 'fall' ? (() => { const r = (VA.S.drills['fall_' + fall.id] || []); const last = r[r.length - 1]; return `<div class="callout practice"><div class="label">Bewertung nach Rubrik</div>${last ? `Der Coach bewertet deine letzte Einschätzung (${new Date(last.ts).toLocaleDateString('de-DE')}, Selbstbewertung ${last.selbst}/18) in sechs Dimensionen, zitiert deine Stellen und trennt Fehler von vertretbaren Entscheidungen. Danach kannst du nachfragen.` : 'Noch keine Einschätzung gespeichert. Schreib sie zuerst im Fall.'} <a href="#/faelle/${fall.id}">Zum Fall</a></div>`; })() : mode === 'lern' ? `<div class="callout practice"><div class="label">So läuft die Sitzung</div>Der Coach fragt ab, du antwortest aus dem Kopf, dann sagst du „sicher, wahrscheinlich oder geraten“. Erst danach kommt Feedback. Blinde Flecken zuerst, dann fällige Karten. Er zeigt keine Antwort vor deinem Versuch, auch nicht auf Nachfrage. Schreib „ENDE“ für das Protokoll.</div>` : ''}
      <div class="chat" id="chat">${h.length ? h.map(m => bubble(m.role, m.content)).join('') : `<div class="chat-empty">${mode === 'rollenspiel' ? 'Klick „Gespräch eröffnen“. Der Kunde beginnt.' : mode === 'lern' ? 'Klick „Sitzung starten“. Der Coach stellt die erste Frage.' : mode === 'fall' ? 'Klick „Bewerten lassen“. Deine gespeicherte Einschätzung wird mitgeschickt.' : mode === 'business' ? 'Beschreibe deine Idee in zwei Sätzen. Der Coach übernimmt die Führung.' : 'Sag dem Coach, was du heute geübt hast, oder stell eine Frage. Er wird nachfragen.'}</div>`}</div>
      <form class="chat-form" id="chat-form">
        ${(mode === 'rollenspiel' || mode === 'einwand') && !h.length ? `<button class="btn primary" type="button" data-act="rp-open">Gespräch eröffnen</button>` : mode === 'lern' && !h.length ? `<button class="btn primary" type="button" data-act="rp-open">Sitzung starten</button>` : mode === 'fall' && !h.length && (VA.S.drills['fall_' + fall.id] || []).length ? `<button class="btn primary" type="button" data-act="rp-open">Bewerten lassen</button>` : ''}
        <textarea id="chat-input" rows="2" placeholder="${mode === 'rollenspiel' ? 'Deine Antwort an den Kunden…' : 'Nachricht an den Coach…'}  (Enter senden, Shift+Enter neue Zeile)"></textarea>
        <button class="btn primary" id="chat-send" ${busy ? 'disabled' : ''}>${busy ? '…' : 'Senden'}</button>
        ${busy ? '<button class="btn ghost" type="button" data-act="chat-stop">Stopp</button>' : ''}
      </form></div>`;
  }
  function bubble(role, text, id) { return `<div class="msg ${role}" ${id ? `id="${id}"` : ''}><div class="who">${role === 'user' ? esc(VA.S.name || 'Du') : (mode === 'rollenspiel' ? esc(scenario.persona.split(',')[0]) : 'Coach')}</div><div class="body">${role === 'user' ? esc(text).replace(/\n/g, '<br>') : md(text)}</div></div>`; }
  async function send(text, { hidden = false } = {}) {
    if (busy) return; const h = history();
    if (!hidden) { h.push({ role: 'user', content: text }); VA.save(); }
    const chat = document.getElementById('chat'); if (!chat) return;
    chat.querySelector('.chat-empty')?.remove();
    if (!hidden) chat.insertAdjacentHTML('beforeend', bubble('user', text));
    const id = 'm' + VA.uid(); chat.insertAdjacentHTML('beforeend', bubble('assistant', '…', id)); chat.scrollTop = chat.scrollHeight;
    busy = true; const sendBtn = document.getElementById('chat-send'); if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = '…'; }
    abort = new AbortController();
    const sys = mode === 'rollenspiel' ? sysRollenspiel(scenario) : mode === 'einwand' ? sysEinwand(einwand) : mode === 'lern' ? sysLern() : mode === 'fall' ? sysFall(fall) : mode === 'business' ? sysBusiness(framework) : sysCoach();
    const msgs = h.slice(-40).map(m => ({ role: m.role, content: m.content }));
    if (hidden) msgs.push({ role: 'user', content: text });
    let out = '';
    try {
      out = await call({ system: sys, messages: msgs }, { signal: abort.signal, onText: (t) => { const el = document.getElementById(id); if (el) { el.querySelector('.body').innerHTML = md(t); chat.scrollTop = chat.scrollHeight; } } });
      h.push({ role: 'assistant', content: out }); VA.touch(); VA.save();
      if (mode === 'rollenspiel' && /BEWERTUNG/.test(out)) saveRating(out);
      if (mode === 'fall' && /BEWERTUNG FALL/.test(out)) { const m = out.match(/Gesamt:\s*(\d+)\s*\/\s*18/); const r = VA.S.drills['fall_' + fall.id]; if (m && r && r.length) { r[r.length - 1].coach = Number(m[1]); VA.touch(); VA.save(); } }
      if (mode === 'einwand' && /BEWERTUNG EINWAND/.test(out)) { const m = out.match(/Gesamt:\s*(\d+)\s*\/\s*40/); const falle = /Falle vermieden[^\n]*:\s*ja/i.test(out); const pts = m ? Number(m[1]) : 0; (VA.S.drills['ew_' + einwand.id] = VA.S.drills['ew_' + einwand.id] || []).push({ ts: Date.now(), wert: pts >= 28 && falle ? 2 : pts >= 20 ? 1 : 0, coach: pts, antwort: '(Coach-Gespräch)' }); VA.touch(); VA.save(); }
    } catch (e) {
      const el = document.getElementById(id); if (e.name === 'AbortError') { if (el) el.remove(); } else { if (el) el.querySelector('.body').innerHTML = `<span class="err">${esc(e.message)}</span>`; }
    }
    busy = false; abort = null; if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Senden'; }
    document.querySelector('[data-act=chat-stop]')?.remove();
  }
  function saveRating(out) {
    const S = VA.S; const g = out.match(/Gesamt:\s*(\d+)\s*\/\s*60/); const eth = /Ethik:\s*bestanden/i.test(out) && !/Ethik:\s*nicht bestanden/i.test(out);
    const score = g ? Number(g[1]) : 0; const fazit = `Coach-Bewertung ${score}/60 · Ethik ${eth ? 'bestanden' : 'nicht bestanden'}`;
    (S.drills['rp_' + scenario.id] = S.drills['rp_' + scenario.id] || []).push({ ts: Date.now(), art: 'Live mit Coach', score, fazit });
    VA.save(); toast(score >= 42 && eth ? `Rollenspiel bestanden: ${score}/60` : `Nicht bestanden: ${score}/60. Nochmal.`, score >= 42 && eth ? 'good' : 'bad');
  }
  function onSubmit(e) {
    if (e.target.id !== 'chat-form') return false;
    const ta = document.getElementById('chat-input'); const t = ta.value.trim(); if (!t) return true; ta.value = ''; send(t); return true;
  }
  function onClick(a, el) {
    if (a === 'chat-clear') { delete VA.S.chats[chatKey()]; VA.save(); VA.navigate(); }
    else if (a === 'chat-mode') { mode = el.dataset.mode; location.hash = '#/coach?mode=coach'; VA.navigate(); }
    else if (a === 'chat-stop') { abort?.abort(); }
    else if (a === 'rp-open') { el.remove(); if (mode === 'fall') { const r = VA.S.drills['fall_' + fall.id]; const last = r[r.length - 1]; const w = (window.FAELLE_RUBRIK || []).map(d => `${d.name} ${last.wertung ? last.wertung[d.id] : '?'}/3`).join(', '); return send(`Hier ist meine Einschätzung zum Fall „${fall.titel}“. Meine Selbstbewertung: ${w} (${last.selbst}/18).\n\n${last.text}`); } send(mode === 'lern' ? '(Beginne die Lernsitzung jetzt mit der ersten Abruffrage, ohne Zusammenfassung.)' : '(Beginne jetzt das Gespräch in deiner Rolle mit dem ersten Satz.)', { hidden: true }); }
    else if (a === 'biz-del') { VA.S.business = VA.S.business.filter(b => b.id !== el.dataset.id); VA.save(); VA.navigate(); }
  }
  document.addEventListener('keydown', (e) => { if (e.target.id === 'chat-input' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('chat-form').requestSubmit(); } });

  // ---------- Business-Seite ----------
  function businessPage() {
    const S = VA.S;
    return `<section class="hero small"><div class="eyebrow">Ich</div><h1>Business-Planer</h1>
      <p class="lead">Zehn Werkzeuge, mit denen der Coach deine Geschäftsideen prüft, plant und mit dir umsetzt. Jedes endet mit Aufgaben in der echten Welt, nicht mit einem Dokument. Ohne API-Schlüssel kannst du die Frameworks als Leitfaden selbst durcharbeiten und deine Antworten unten notieren.</p></section>
      <div class="grid">${FRAMEWORKS.map(f => `<div class="card"><div class="num">${f.id}</div><h3>${esc(f.name)}</h3><p class="muted">${esc(f.text)}</p><details><summary>${f.schritte.length} Schritte</summary><ol class="steps small">${f.schritte.map(x => `<li>${esc(x)}</li>`).join('')}</ol></details><div class="btn-row"><a class="btn small" href="#/coach?biz=${f.id}">${S.apiKey ? 'Mit dem Coach starten' : 'Leitfaden öffnen'}</a></div></div>`).join('')}</div>
      <h2 class="section-title">Meine Ideen und Notizen</h2>
      <form class="biz-add card"><input name="titel" placeholder="Idee in einem Satz" required><textarea class="journal" name="text" rows="4" placeholder="Status, nächste Aufgabe, offene Annahmen…" required></textarea><div class="btn-row"><button class="btn primary small">Speichern</button></div></form>
      ${S.business.slice().reverse().map(b => `<div class="card"><div class="meta">${VA.fmtTime(b.ts)} <button class="btn small ghost" data-act="biz-del" data-id="${b.id}">Löschen</button></div><h3>${esc(b.titel)}</h3><p>${esc(b.text).replace(/\n/g, '<br>')}</p></div>`).join('')}`;
  }
  document.addEventListener('submit', (e) => { if (e.target.classList.contains('biz-add')) { e.preventDefault(); const fd = new FormData(e.target); VA.S.business.push({ id: VA.uid(), titel: fd.get('titel'), text: fd.get('text'), ts: Date.now() }); VA.touch(); VA.save(); VA.navigate(); } });

  window.Coach = { page, businessPage, gradeReport, abrufFeedback, test, onSubmit, onClick, FRAMEWORKS };
})();

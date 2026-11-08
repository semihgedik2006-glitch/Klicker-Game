// Runde 5, Durchgang 8: Prüfungs-Rückschau (Fehler speichern, vorziehen, erledigen) und Einwand-Spielbuch
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; for (const l of window.KURSE[0].lektionen) S.lessonsDone[l.id] = Date.now(); window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300);
  // Leere Rückschau
  await go('#/rueckschau'); ok('Rückschau leer → Hinweis', await page.evaluate(() => !!document.querySelector('.card.empty')));
  // Echte Prüfung: Modul 1 starten und alles falsch beantworten → Fehler werden mit lid/qi gespeichert
  await go('#/pruefung/grundlagen');
  const started = await page.evaluate(() => { const btn = document.querySelector('[data-act="exam-start"]'); if (btn) { btn.click(); return true; } return false; });
  await page.waitForTimeout(400);
  let answered = 0;
  for (let i = 0; i < 20; i++) {
    const r = await page.evaluate(() => { const h = document.querySelector('.exam-q h2'); if (!h) return null; const q = window.KURSE.flatMap(k => k.lektionen).flatMap(l => l.quiz).find(q => q.frage === h.textContent); const btns = [...document.querySelectorAll('[data-act="exam-answer"]')]; const wrong = btns.find(b => Number(b.dataset.oi) !== q.richtig); if (wrong) { wrong.click(); return true; } return null; });
    if (!r) break; answered++; await page.waitForTimeout(120);
  }
  ok('Prüfung komplett falsch beantwortet (Modul 1 hat 12 Fragen)', started && answered === 12, String(answered)); const N = answered;
  const att = await page.evaluate(() => { const ex = window.VA.S.exams.grundlagen; const a = ex && ex.attempts.at(-1); return a ? { n: (a.falsch || []).length, hasLid: !!(a.falsch && a.falsch[0] && a.falsch[0].lid), pct: a.pct } : null; });
  ok('Versuch speichert alle Fehler mit Lektions-Id', !!att && att.n === N && att.hasLid && att.pct === 0, JSON.stringify(att));
  ok('Ergebnisseite verlinkt Rückschau', await page.evaluate(() => !!document.querySelector('a[href="#/rueckschau"]')));
  // Rückschau zeigt Gruppe und Zähler in der Navigation
  await go('#/rueckschau');
  ok('Rückschau: alle offenen Fragen in Modul 1', await page.evaluate((N) => document.querySelectorAll('.card.rs').length === N && /Modul 1/.test(document.querySelector('.section-title').textContent), N));
  ok('Navigation zeigt Zähler', await page.evaluate((N) => { const c = document.querySelector('.nav-count'); return !!c && c.textContent === String(N); }, N));
  ok('Warum-falsch wird gezeigt', await page.evaluate(() => /Warum deine Antwort nicht stimmt/.test(document.querySelector('.card.rs').textContent)));
  // Vorziehen → alle in heutige Wiederholung
  await page.click('[data-act="rs-vorziehen"]'); await page.waitForTimeout(500);
  ok('Vorziehen setzt alle Karten auf heute und wechselt zu Wiederholen', await page.evaluate((N) => location.hash === '#/wiederholen' && Object.values(window.VA.S.srs).filter(x => x.due === new Date().toISOString().slice(0, 10) && x.box === 0).length >= N, N));
  // Karten richtig beantworten, bis eine der Prüfungsfehler-Karten dran war
  await page.click('[data-act="srs-start"]'); await page.waitForTimeout(300);
  let hit = false;
  for (let i = 0; i < 20 && !hit; i++) {
    const r = await page.evaluate(() => { const h = document.querySelector('.exam-q h2'); if (!h) return null; for (const k of window.KURSE) for (const l of k.lektionen) { const qi = l.quiz.findIndex(q => q.frage === h.textContent); if (qi >= 0) return { key: l.id + ':' + qi, richtig: l.quiz[qi].richtig }; } return null; });
    if (!r) break;
    await page.click(`[data-act="srs-answer"][data-oi="${r.richtig}"]`); await page.waitForTimeout(250);
    hit = await page.evaluate((key) => { const ex = window.VA.S.exams.grundlagen; return ex.attempts.at(-1).falsch.some(f => f.lid + ':' + f.qi === key) && !!(window.VA.S.srs[key] && window.VA.S.srs[key].lastOk); }, r.key);
    const nx = await page.$('[data-act="srs-next"]'); if (nx) { await nx.click(); await page.waitForTimeout(200); }
  }
  ok('Eine Prüfungsfehler-Karte in der Wiederholung richtig beantwortet', hit);
  await page.reload(); await go('#/rueckschau');
  ok('Nach richtiger Wiederholung: eine weniger offen, 1 erledigt', await page.evaluate((N) => document.querySelectorAll('.card.rs').length === N - 1 && /1 erledigt/.test(document.body.textContent), N));
  // Spielbuch
  await go('#/spielbuch'); await page.waitForTimeout(600);
  ok('Spielbuch leer → Hinweis mit Link zum Drill', await page.evaluate(() => { const c = document.querySelector('.card.empty'); return !!c && !!c.querySelector('a[href="#/einwaende"]'); }));
  await page.evaluate(() => { const S = window.VA.S; S.drills.ew_teuer = [{ ts: Date.now() - 5000, wert: 1, antwort: 'Erste schwache Antwort.' }, { ts: Date.now(), wert: 2, antwort: 'Zu teuer im Vergleich womit? Sie sagten, die Nacharbeit kostet sechs Stunden pro Woche.' }]; S.drills.ew_budget = [{ ts: Date.now(), wert: 0, antwort: 'Hm.' }]; window.VA.save(); location.hash = '#/x'; location.hash = '#/spielbuch'; });
  await page.waitForTimeout(500);
  ok('Spielbuch: 2 Einträge, beste Antwort oben', await page.evaluate(() => { const cards = [...document.querySelectorAll('.card.sb')]; return cards.length === 2 && cards.some(c => /Nacharbeit kostet sechs Stunden/.test(c.textContent) && !/Erste schwache/.test(c.textContent)); }));
  ok('Status „sitzt“ und Falle und Muster vorhanden', await page.evaluate(() => { const c = [...document.querySelectorAll('.card.sb')].find(c => /zu teuer/i.test(c.querySelector('h3').textContent)); return !!c && /sitzt/.test(c.textContent) && !!c.querySelector('.sb-row.falle') && !!c.querySelector('details.muster'); }));
  ok('Liste „Noch ohne eigene Antwort“ zeigt übrige', await page.evaluate(() => { const E = window.EINWAENDE.length; return document.querySelectorAll('.wv-list-wrap li').length === E - 2; }));
  ok('Druckknopf vorhanden', await page.evaluate(() => !!document.querySelector('[data-act="print"]')));
  ok('Navigation: Einwand-Spielbuch', await page.evaluate(() => !!document.querySelector('a[href="#/spielbuch"]')));
  // Mobil
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/spielbuch');
  ok('Mobile Overflow Spielbuch', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await go('#/rueckschau'); ok('Mobile Overflow Rückschau', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

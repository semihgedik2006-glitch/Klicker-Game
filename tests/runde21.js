// Runde 5, Durchgang 17: Onboarding-Texte gestrafft, Wochenrückblick mit einer Empfehlung
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  const day = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
  const tipp = async () => { await page.reload(); await page.waitForTimeout(500); return page.evaluate(() => { const c = document.querySelector('.wochen-tipp'); return c ? { t: c.textContent, href: c.querySelector('a') && c.querySelector('a').getAttribute('href') } : null; }); };
  // Onboarding
  const src = fs.readFileSync(path.resolve(__dirname, '..', 'js/app.js'), 'utf8');
  ok('Onboarding ohne Verzichtsliste, mit Beleg für den Abruf', !src.includes('verzichtet auf Herzen') && /Roediger & Karpicke 2006/.test(src) && /94 Studien/.test(src));
  const ob = await page.evaluate(() => document.querySelector('main').textContent);
  ok('Onboarding zeigt den neuen Einstieg', /Jede Lektion endet mit einem Quiz und einem Bericht über ein echtes Gespräch/.test(ob) && /Erinnerungen mit schlechtem Gewissen/.test(ob));
  // Wochenrückblick: ohne Aktivität keine Karte
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  ok('Ohne Aktivität kein Wochenrückblick', (await tipp()) === null);
  // Fall 1: wenig aktive Tage in beiden Wochen
  await page.evaluate((d) => { const S = window.VA.S; S.activity[d[0]] = 1; S.activity[d[1]] = 1; S.activity[d[2]] = 1; S.lessonsDone.g1 = Date.now(); window.VA.save(); }, [day(1), day(8), day(12)]);
  const t1 = await tipp();
  ok('Wenige aktive Tage: Empfehlung zwei feste Tage mit Wenn-Dann-Plan', !!t1 && /Zwei kurze Einheiten/.test(t1.t) && t1.href === '#/einstellungen', JSON.stringify(t1));
  // Fall 2: aktiv, aber Karten fällig und keine wiederholt
  await page.evaluate((d) => { const S = window.VA.S; for (const x of d) S.activity[x] = 1; const g = window.KURSE[0]; for (const l of g.lektionen) S.lessonsDone[l.id] = Date.now(); window.VA.save(); }, [day(0), day(1), day(2), day(3), day(7), day(8), day(9)]);
  const t2 = await tipp();
  ok('Viele fällige Karten, keine wiederholt: Empfehlung Wiederholen', !!t2 && /Karten warten/.test(t2.t) && t2.href === '#/wiederholen', JSON.stringify(t2));
  // Fall 3: Karten erledigt, aber zwei Wochen ohne Nein
  await page.evaluate((d) => { const S = window.VA.S; const y = new Date(); for (const k of Object.keys(S.lessonsDone)) { const g = window.KURSE[0].lektionen.find(l => l.id === k); if (g) g.quiz.forEach((q, i) => { S.srs[k + ':' + i] = { box: 2, n: 1, richtig: 1, due: '2999-01-01', last: d }; }); } S.srsLog[d] = 20; window.VA.save(); }, day(0));
  const t3 = await tipp();
  ok('Zwei Wochen ohne Nein: Empfehlung ein Nein mit Link ins Journal', !!t3 && /ohne ein Nein/.test(t3.t) && t3.href === '#/journal', JSON.stringify(t3));
  // Fall 4: Nein da, Einwände fehlen
  await page.evaluate(() => { const S = window.VA.S; S.nein.push({ ts: Date.now(), text: 'x' }); window.VA.save(); });
  const t4 = await tipp();
  ok('Nein vorhanden: nächste Lücke sind die Einwände', !!t4 && /ohne Einwand-Drill/.test(t4.t) && t4.href === '#/einwaende', JSON.stringify(t4));
  // Fall 5: alles läuft, aber eine Zahl gefallen
  await page.evaluate((d) => { const S = window.VA.S; const now = Date.now(), vor = now - 8 * 864e5; S.drills.ew_teuer = [{ ts: vor, wert: 2 }, { ts: vor, wert: 2 }, { ts: vor, wert: 1 }, { ts: now, wert: 2 }]; S.drills.rp_preishammer = [{ ts: now, art: 'Offline', fazit: 'Bestanden.' }]; S.drills['fall_f-grundlagen'] = [{ ts: now, selbst: 10 }]; S.reports.g1 = [{ ts: now, bestanden: true, text: 'x' }]; window.VA.save(); }, day(0));
  const t5 = await tipp();
  ok('Gefallene Zahl: Empfehlung nennt die Zeile', !!t5 && /„Einwände geübt“ ist von 3 auf 1 gefallen/.test(t5.t), JSON.stringify(t5));
  ok('Genau eine Empfehlung', await page.evaluate(() => document.querySelectorAll('.wochen-tipp').length === 1));
  await page.setViewportSize({ width: 390, height: 844 }); await page.reload(); await page.waitForTimeout(400);
  ok('Mobile Overflow Startseite', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();
// Quellenbereich Lernforschung
(async () => {
  const { chromium } = require('playwright'); const path = require('path');
  const b = await chromium.launch(); const page = await b.newPage();
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'T'; window.VA.save(); location.hash = '#/quellen'; }); await page.waitForTimeout(1500);
  const q = await page.evaluate(() => ({ bereich: window.QUELLEN_BEREICHE && window.QUELLEN_BEREICHE.lernforschung, n: (window.QUELLEN || []).filter(x => x.b === 'lernforschung').length, roediger: (window.QUELLEN || []).some(x => /Roediger & Karpicke/.test(x.q)), sichtbar: /Lernforschung/.test(document.body.textContent) }));
  console.log('Quellenbereich Lernforschung mit 12 Einträgen sichtbar:', q.bereich && q.n === 12 && q.roediger && q.sichtbar ? 'OK' : 'FEHLER', JSON.stringify(q));
  await b.close();
})();

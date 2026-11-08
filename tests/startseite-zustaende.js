// Startseite in drei Zuständen (neu, mittendrin, Modul bestanden) auf Handy und Desktop
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(600); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await go('#/');
  // Neu: Erste Schritte sichtbar, Tagesplan nennt die Minuten nur einmal
  const neu = await page.evaluate(() => ({ tour: !!document.querySelector('.card.tour'), plan: (document.querySelector('.tagesplan') || {}).textContent || '', cols: getComputedStyle(document.querySelector('.today-row')).gridTemplateColumns.split(' ').length }));
  ok('Neu: Erste-Schritte-Liste sichtbar', neu.tour);
  ok('Neu: Tagesplan nennt die Minuten bei einem Punkt nur einmal', /Heute etwa \d+ Minuten: Lektion 1\.1\. /.test(neu.plan), neu.plan);
  ok('Desktop: Heute-Karten in einer Reihe (4 Spalten)', neu.cols === 4, String(neu.cols));
  // Mittendrin: Lektion abgeschlossen ⇒ Schritte 2 und 3 gelten als erledigt, auch ohne Abruf-Eintrag
  await page.evaluate(() => { const S = window.VA.S; S.lessonsDone[window.KURSE[0].lektionen[0].id] = Date.now() - 86400000; window.VA.save(); });
  await go('#/lektion/grundlagen/g1'); await go('#/');
  const mitte = await page.evaluate(() => ({ eyebrow: (document.querySelector('.card.tour .eyebrow') || {}).textContent || '', next: (document.querySelector('.card.tour li.next a') || {}).textContent || '' }));
  ok('Mittendrin: Liste zählt Lesen und Quiz als erledigt', /3 von 6/.test(mitte.eyebrow) && /Bericht/.test(mitte.next), mitte.eyebrow + ' / ' + mitte.next);
  // Bestanden: Modulprüfung bestanden ⇒ Liste verschwindet
  await page.evaluate(() => { const S = window.VA.S; for (const l of window.KURSE[0].lektionen) S.lessonsDone[l.id] = Date.now() - 86400000; S.exams.grundlagen = { attempts: [{ ts: Date.now() - 3600000, pct: 92, passed: true, falsch: [] }], passed: true, best: 92 }; window.VA.save(); });
  await go('#/lektion/grundlagen/g1'); await go('#/');
  ok('Bestanden: Erste-Schritte-Liste ausgeblendet', !(await page.evaluate(() => !!document.querySelector('.card.tour'))));
  // Handy: fünfte Statistik-Kachel nimmt die ganze Zeile, kein Overflow
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/lektion/grundlagen/g1'); await go('#/');
  const m = await page.evaluate(() => { const st = [...document.querySelectorAll('.stats .stat')]; const w = st.map(e => e.getBoundingClientRect().width); return { n: st.length, lastFull: w[w.length - 1] > w[0] * 1.8, overflow: document.documentElement.scrollWidth > window.innerWidth + 1 }; });
  ok('Handy: letzte Statistik-Kachel über volle Breite', m.n === 5 && m.lastFull, JSON.stringify(m));
  ok('Handy: kein horizontaler Overflow', !m.overflow);
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

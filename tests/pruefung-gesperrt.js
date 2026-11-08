// Gesperrte Prüfung zeigt die offenen Lektionen, Prüfungsbeschreibung nennt Rückblick-Fragen und Pause
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(600); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; const L = window.KURSE[0].lektionen; S.lessonsDone[L[0].id] = Date.now(); S.lessonsDone[L[1].id] = Date.now(); window.VA.save(); });
  await go('#/pruefung/grundlagen');
  const g = await page.evaluate(() => ({ h1: (document.querySelector('.hero h1') || {}).textContent || '', items: [...document.querySelectorAll('.pruefung-offen li a')].map(a => a.getAttribute('href')), lead: (document.querySelector('.hero .lead') || {}).textContent || '', cta: (document.querySelector('.hero .btn.primary') || {}).getAttribute ? document.querySelector('.hero .btn.primary').getAttribute('href') : '', n: window.KURSE[0].lektionen.length, ids: window.KURSE[0].lektionen.slice(2).map(l => '#/lektion/grundlagen/' + l.id) }));
  ok('Gesperrte Prüfung zeigt Modultitel und Zahl der fehlenden Lektionen', g.h1.length > 5 && g.lead.includes(`${g.n} Lektionen`) && g.lead.includes(`${g.n - 2} fehlen noch`), g.lead);
  ok('Liste enthält genau die offenen Lektionen mit Links', JSON.stringify(g.items) === JSON.stringify(g.ids), JSON.stringify(g.items));
  ok('Button führt zur ersten offenen Lektion', g.cta === g.ids[0], g.cta);
  ok('Kein doppeltes „Min“', !/Min Min/.test(await page.evaluate(() => document.querySelector('.pruefung-offen').textContent)));
  // Alle fertig: Beschreibung Modul 1 ohne Rückblick, Modul 2 mit Rückblick und Pause
  await page.evaluate(() => { const S = window.VA.S; for (const k of window.KURSE.slice(0, 2)) for (const l of k.lektionen) S.lessonsDone[l.id] = Date.now(); window.VA.save(); });
  await go('#/'); await go('#/pruefung/grundlagen');
  const l1 = await page.evaluate(() => document.querySelector('.hero .lead').textContent);
  ok('Modul 1: keine Rückblick-Fragen angekündigt, Pause genannt', !/Rückblick/.test(l1) && /20 Minuten Pause/.test(l1), l1);
  await go('#/pruefung/psychologie');
  const l2 = await page.evaluate(() => document.querySelector('.hero .lead').textContent);
  ok('Modul 2: 3 Rückblick-Fragen angekündigt', /plus 3 Rückblick-Fragen/.test(l2), l2);
  await page.click('[data-act="exam-start"]'); await page.waitForTimeout(400);
  const bc = await page.evaluate(() => document.querySelector('.breadcrumb').textContent);
  ok('Prüfung Modul 2 hat tatsächlich 15 Fragen', /von 15/.test(bc), bc);
  await page.setViewportSize({ width: 390, height: 844 }); await page.evaluate(() => { const S = window.VA.S; delete S.lessonsDone[window.KURSE[0].lektionen[3].id]; window.VA.save(); }); await go('#/pruefung/grundlagen');
  ok('Mobile Overflow gesperrte Prüfung', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

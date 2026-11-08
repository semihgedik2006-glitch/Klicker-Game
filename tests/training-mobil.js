// Trainingsseiten auf dem Handy (Drills kompakt, 30-Tage-Liste eingeklappt, Rollenspiel-Texte)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(800); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await go('#/training');
  const t = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, drills: document.querySelectorAll('.drill-row').length, tage: document.querySelectorAll('.card.day').length, mehr: !!document.querySelector('[data-act="tage-alle"]') }));
  ok('Training: Drills als kompakte Liste (10 Zeilen)', t.drills === 10, String(t.drills));
  ok('Training: nur die nächsten 3 Tage sichtbar plus Knopf für alle 30', t.tage === 3 && t.mehr, JSON.stringify(t));
  ok('Training: Seite deutlich kürzer als 7000 px auf dem Handy', t.h < 7000, t.h + ' px');
  ok('Training: kein Overflow', await noOverflow());
  await page.click('[data-act="drill-done"]'); await page.waitForTimeout(500);
  ok('Drill abhaken funktioniert weiter', await page.evaluate(() => /heute/.test(document.querySelector('.drill-row .btn').textContent)));
  await page.click('[data-act="tage-alle"]'); await page.waitForTimeout(500);
  ok('Alle 30 Tage aufklappbar', (await page.evaluate(() => document.querySelectorAll('.card.day').length)) === 30);
  await page.fill('form.ablehnung textarea', 'Ich habe im Bäcker nach einem Rabatt gefragt. Die Verkäuferin hat gelacht und Nein gesagt. War halb so wild.');
  await page.click('form.ablehnung button'); await page.waitForTimeout(600);
  ok('Tag 1 abschließen funktioniert, Tag 2 aktiv', await page.evaluate(() => !!document.querySelector('form.ablehnung[data-tag="2"]')));
  // Rollenspiel: Plural und Platzhalter
  await go('#/rollenspiel'); const rp = await page.evaluate(() => document.querySelector('.card.clickable').dataset.route); await go(rp);
  const ph = await page.evaluate(() => [...document.querySelectorAll('.rp-plan input')].map(i => i.placeholder.length));
  ok('Rollenspiel-Plan: kurze Platzhalter (unter 40 Zeichen)', ph.length === 3 && ph.every(n => n < 40), JSON.stringify(ph));
  await page.click('[data-act="rp-start"]'); await page.waitForTimeout(500); await page.click('[data-act="rp-choose"]'); await page.waitForTimeout(500);
  const bil = await page.evaluate(() => (document.querySelector('.rp-bilanz') || {}).textContent || '');
  ok('Rollenspiel-Bilanz: Singular bei einer Entscheidung', !bil || /^1 Entscheidung:/.test(bil) || /^\d{2,} Entscheidungen/.test(bil) || /^[2-9] Entscheidungen/.test(bil), bil);
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

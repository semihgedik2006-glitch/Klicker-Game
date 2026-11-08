// restliche Seiten auf dem Handy, Kundenanalyse-Zitatfeld als volles Textfeld
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(900); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await go('#/kundenanalyse');
  const ta = await page.evaluate(() => { const t = document.querySelector('#ka-form textarea[name=zitate]'); const r = t.getBoundingClientRect(); const lab = t.parentElement.getBoundingClientRect(); return { w: r.width, h: r.height, labW: lab.width, font: getComputedStyle(t).fontFamily, block: getComputedStyle(t).display }; });
  ok('Kundenanalyse: Zitatfeld nimmt die volle Breite, eigene Zeile, App-Schrift', ta.block === 'block' && ta.w > ta.labW - 4 && ta.h >= 80 && !/monospace/i.test(ta.font), JSON.stringify(ta));
  let bad = [];
  for (const r of ['faelle', 'kontraste', 'beispiele', 'koerper', 'checklisten', 'kundenanalyse', 'glossar', 'quellen', 'journal', 'einstellungen', 'rueckschau', 'spielbuch', 'coach', 'business', 'milliardaere', 'mythen', 'einstufung', 'zertifikat', 'abschluss']) {
    await go('#/' + r);
    if (!(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))) bad.push(r);
  }
  ok('19 Seiten ohne horizontalen Overflow', bad.length === 0, bad.join(','));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

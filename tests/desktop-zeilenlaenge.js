// Desktop-Pass bei 1280 px. node tests/desktop-zeilenlaenge.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/user/Klicker-Game/index.html');
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  const go = async h => { await page.evaluate(() => { location.hash = '#/'; }); await page.waitForTimeout(150); await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(600); };
  let fails = 0; const check = (ok, msg) => { console.log((ok ? 'OK  ' : 'FAIL') + ' ' + msg); if (!ok) fails++; };
  const routes = ['', 'kurs/grundlagen', 'lektion/grundlagen/g1', 'training', 'einstellungen', 'kundenanalyse', 'journal', 'business', 'glossar', 'coach', 'spielbuch', 'checklisten'];
  for (const r of routes) {
    await go('#/' + r);
    const m = await page.evaluate(() => {
      const ps = [...document.querySelectorAll('#main p, #main li')].filter(e => e.textContent.trim().length > 120 && e.getBoundingClientRect().width > 0);
      const probe = document.createElement('div'); probe.style.cssText = 'position:absolute;width:74ch;visibility:hidden'; document.body.appendChild(probe);
      const tooWide = ps.filter(e => { const cs = getComputedStyle(e); probe.style.font = cs.font; return e.getBoundingClientRect().width > probe.getBoundingClientRect().width + 2; }).map(e => e.className || e.tagName);
      probe.remove();
      const inputs = [...document.querySelectorAll('#main label input:not([type=radio]):not([type=checkbox]), #main label select')].map(e => Math.round(e.getBoundingClientRect().width));
      return { tooWide, maxInput: inputs.length ? Math.max(...inputs) : 0, ov: document.documentElement.scrollWidth - window.innerWidth };
    });
    check(m.tooWide.length === 0, `${r || 'start'}: kein Fließtext breiter als 74ch (${m.tooWide.slice(0, 3).join(', ') || 'ok'})`);
    check(m.maxInput <= 560, `${r || 'start'}: Eingabefelder höchstens 560 px (${m.maxInput})`);
    check(m.ov === 0, `${r || 'start'}: kein horizontaler Überlauf`);
  }
  // Lektion bleibt bei 78ch Lesemaß
  await go('#/lektion/grundlagen/g1');
  const lw = await page.evaluate(() => { const l = document.querySelector('.lesson'); return l ? Math.round(l.getBoundingClientRect().width) : 0; });
  check(lw > 600 && lw < 900, `Lektion: Lesebreite ${lw} px`);
  check(errs.length === 0, 'keine JS-Fehler ' + errs.join(' | '));
  console.log(fails ? `${fails} FEHLER` : 'alle Checks bestanden');
  await b.close(); process.exit(fails ? 1 : 0);
})();

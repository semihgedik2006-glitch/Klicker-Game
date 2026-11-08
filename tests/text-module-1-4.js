// Copy-Editing Module 1–4, Beispiel-Prozeduren verweisen auf Einwand-Drills
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(600); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300);
  // Satzlänge in allen zehn Modulen
  const lang = await page.evaluate(() => {
    const strip = h => String(h).replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const out = [];
    for (const k of window.KURSE) for (const l of k.lektionen) for (const [key, v] of Object.entries(l)) {
      if (typeof v !== 'string' || v.length < 200) continue;
      for (const s of strip(v).split(/(?<=[.!?:]“?\)?)\s+(?=[A-ZÄÖÜ„(])/)) { const w = s.split(/\s+/).length; if (w > 42 && !/“ „/.test(s)) out.push(`${l.id}.${key} ${w}w`); }
    }
    return out;
  });
  ok('Alle zehn Module: kein Fließtext-Satz über 42 Wörter', lang.length === 0, lang.join(' | '));
  const src = fs.readFileSync(path.resolve(__dirname, '..', 'js/data/kurse/03-wirkung.js'), 'utf8') + fs.readFileSync(path.resolve(__dirname, '..', 'js/data/kurse/04-koerpersprache.js'), 'utf8');
  ok('Halo und Power Posing in kurzen Sätzen', /Der Halo-Effekt beschreibt seine Ausbreitung/.test(src) && /Das Versprechen: Die Haltung verändert/.test(src));
  // Jede Beispiel-Prozedur verweist auf existierende Einwände
  await go('#/beispiele'); await go('#/einwaende');
  const map = await page.evaluate(() => window.BEISPIELE.map(x => ({ id: x.id, n: (x.einwaende || []).length, bad: (x.einwaende || []).filter(id => !window.EINWAENDE.find(e => e.id === id)) })));
  ok('Alle 7 Prozeduren haben 1–3 gültige Einwand-Verweise', map.length === 7 && map.every(m => m.n >= 1 && m.n <= 3 && m.bad.length === 0), JSON.stringify(map));
  // Kasten erscheint erst ab Stufe 3
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload(); await page.waitForTimeout(300);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await go('#/beispiele/laer');
  ok('Stufe 1: noch kein Anwenden-Kasten', await page.evaluate(() => !document.querySelector('.wb-anwenden')));
  await page.evaluate(() => { window.VA.S.drills.wb_laer = { stufe: 2, ts: Date.now() }; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300); await go('#/beispiele/laer');
  await page.waitForTimeout(800);
  const box = await page.evaluate(() => { const c = document.querySelector('.wb-anwenden'); return c ? { links: [...c.querySelectorAll('a')].map(a => a.getAttribute('href') + '|' + a.textContent) } : null; });
  ok('Stufe 3: Kasten mit Einwandtexten und Links', !!box && box.links.length === 3 && box.links[0] === '#/einwaende/teuer|Das ist mir zu teuer.', JSON.stringify(box));
  await page.click('.wb-anwenden a'); await page.waitForTimeout(600);
  ok('Link führt zum Einwand-Drill', await page.evaluate(() => location.hash === '#/einwaende/teuer' && /zu teuer/.test(document.querySelector('main h1, main h2').textContent)));
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/beispiele/laer');
  ok('Mobile Overflow Beispiel', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  const url = 'file://' + path.resolve(__dirname, '..', 'index.html');
  await p.goto(url + '#/rollenspiel'); await p.waitForTimeout(300);
  console.log('Lead:', await p.$eval('.lead', e => e.textContent.slice(0, 120)));
  const ids = await p.evaluate(() => window.SZENARIEN.map(s => s.id + ':' + !!s.offline));
  console.log(ids.join(' '));
  for (const sid of await p.evaluate(() => window.SZENARIEN.map(s => s.id))) {
    await p.evaluate((sid) => location.hash = '#/rollenspiel/' + sid, sid); await p.waitForTimeout(150);
    await p.click('[data-act=rp-start]'); await p.waitForTimeout(150);
    // immer die beste Option wählen (good), bis Ende
    let steps = 0;
    while (steps < 20) {
      const done = await p.evaluate((sid) => { const s = window.SZENARIEN.find(x => x.id === sid); const box = document.getElementById('rp-box'); if (!box.querySelector('.options')) return true; const btns = [...box.querySelectorAll('[data-act=rp-choose]')]; const nodeId = (window.__rp && window.__rp[sid]) || null; let best = btns[0]; for (const bt of btns) { const o = Object.values(s.offline.knoten).flatMap(n => n.optionen || []).find(o => o.text === bt.textContent); if (o && o.bewertung === 'good') { best = bt; break; } } best.click(); return false; }, sid);
      if (done) break; steps++; await p.waitForTimeout(80);
    }
    const fazit = await p.evaluate(() => { const c = document.querySelector('#rp-box .callout'); return c ? c.textContent.replace('Fazit', '').trim().slice(0, 70) : 'KEIN FAZIT'; });
    console.log(sid.padEnd(16), steps, 'Schritte →', fazit);
  }
  await p.evaluate(() => location.hash = '#/rollenspiel/einkaeufer'); await p.waitForTimeout(150); await p.click('[data-act=rp-start]'); await p.waitForTimeout(150); await p.click('[data-act=rp-choose]'); await p.waitForTimeout(150);
  await p.screenshot({ path: 'r4-rollenspiel.png' });
  console.log('ERRORS:', errs.length ? errs : 'none'); await b.close(); })();

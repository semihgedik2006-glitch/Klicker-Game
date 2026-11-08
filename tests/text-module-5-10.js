// Copy-Editing Module 5–10, Nächster-Schritt-Empfehlung aus der Selbsteinschätzung
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300);
  // Copy-Editing: keine Satzlänge über 42 Wörter in den Fließtexten der Module 5–10 (Tabellen ausgenommen)
  const lang = await page.evaluate(() => {
    const strip = h => String(h).replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const out = [];
    for (const k of window.KURSE.filter(k => k.nr >= 5)) for (const l of k.lektionen) for (const [key, v] of Object.entries(l)) {
      if (typeof v !== 'string' || v.length < 200) continue;
      for (const s of strip(v).split(/(?<=[.!?:]“?\)?)\s+(?=[A-ZÄÖÜ„(])/)) { const w = s.split(/\s+/).length; if (w > 42 && !/“ „/.test(s)) out.push(`${l.id}.${key} ${w}w: ${s.slice(0, 80)}`); }
    }
    return out;
  });
  ok('Module 5–10: kein Fließtext-Satz über 42 Wörter', lang.length === 0, lang.join(' | '));
  // Überarbeitete Stellen sind drin
  const src = ['07-straightline', '08-kundenanalyse', '09-selbstvermarktung', '10-verhandlung'].map(f => fs.readFileSync(path.resolve(__dirname, '..', 'js/data/kurse', f + '.js'), 'utf8')).join('\n');
  ok('Verhandlung: Wenn-dann-Pläne in drei Sätzen', /Ohne Plan greifst du auf die Gewohnheit zurück, und die heißt meist Nachgeben\./.test(src));
  ok('Selbstvermarktung: Granovetter in zwei Sätzen', /Er nannte das <strong>schwache Bindungen<\/strong>/.test(src));
  ok('Straight Line: Schmerzschwelle auf zwei Wegen', /Du erhöhst sie auf zwei Wegen\./.test(src));
  // Quellen: Lichtenstein 1982 und Koriat 1980 vorhanden
  const q = fs.readFileSync(path.resolve(__dirname, '..', 'js/data/quellen.js'), 'utf8');
  ok('Quellenliste enthält Lichtenstein 1982 und Koriat 1980', /Lichtenstein, Fischhoff & Phillips \(1982\)/.test(q) && /Koriat, Lichtenstein & Fischhoff \(1980\)/.test(q));
  // Nächster Schritt 1: blinde Flecken → Modulprüfung des betroffenen Moduls
  await page.evaluate(() => { const S = window.VA.S; S.kalib = { sicher: 8, sicherOk: 5, unsicher: 4, unsicherOk: 2 }; const g = window.KURSE[0]; for (const l of g.lektionen) S.lessonsDone[l.id] = Date.now(); S.blind = {}; S.blind[g.lektionen[0].id + ':0'] = Date.now(); S.blind[g.lektionen[1].id + ':1'] = Date.now(); const v = window.KURSE[5]; S.blind[v.lektionen[0].id + ':0'] = Date.now(); for (const k of window.KURSE) for (const l of k.lektionen) for (let i = 0; i < 20; i++) S.srs[l.id + ':' + i] = { due: Date.now() + 9e9, box: 3 }; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300); await go('#/wiederholen');
  const s1 = await page.evaluate(() => { const c = document.querySelector('.card.kalib .callout.practice'); return c ? { t: c.textContent, href: (c.querySelector('a') || {}).getAttribute && c.querySelector('a').getAttribute('href') } : null; });
  ok('Blinde Flecken: Empfehlung zeigt auf Prüfung des Moduls mit den meisten', !!s1 && /2 deiner blinden Flecken/.test(s1.t) && s1.href === '#/pruefung/' + (await page.evaluate(() => window.KURSE[0].id)), JSON.stringify(s1));
  // Nächster Schritt 2: Überkonfidenz ohne blinde Flecken → Gegenprobe
  await page.evaluate(() => { const S = window.VA.S; S.blind = {}; S.kalib = { sicher: 10, sicherOk: 5, unsicher: 2, unsicherOk: 1 }; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300); await go('#/wiederholen');
  ok('Überkonfidenz: Empfehlung Gegenprobe mit Koriat-Beleg', await page.evaluate(() => { const c = document.querySelector('.card.kalib .callout.practice'); return !!c && /Gegenprobe/.test(c.textContent) && /Koriat/.test(c.textContent); }));
  // Nächster Schritt 3: Unterschätzung → Einwand laut beantworten
  await page.evaluate(() => { const S = window.VA.S; S.kalib = { sicher: 4, sicherOk: 3, unsicher: 8, unsicherOk: 7 }; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300); await go('#/wiederholen');
  ok('Unterschätzung: Empfehlung zeigt auf Einwände', await page.evaluate(() => { const c = document.querySelector('.card.kalib .callout.practice'); return !!c && /einen Einwand/.test(c.textContent) && c.querySelector('a[href="#/einwaende"]'); }));
  // Gut kalibriert: keine Empfehlung nötig
  await page.evaluate(() => { const S = window.VA.S; S.kalib = { sicher: 10, sicherOk: 9, unsicher: 4, unsicherOk: 2 }; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300); await go('#/wiederholen');
  ok('Gut kalibriert: kein Nächster-Schritt-Kasten', await page.evaluate(() => !document.querySelector('.card.kalib .callout.practice')));
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/wiederholen');
  ok('Mobile Overflow Wiederholen', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

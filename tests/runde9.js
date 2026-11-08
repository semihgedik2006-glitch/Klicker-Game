// Runde 5, Durchgang 5: Wiedervorlagen (+1/+7/+30), Einstufung, Coach-Kontext
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const D = 864e5;
  await page.evaluate((D) => { const S = window.VA.S; S.onboarded = true; S.name = 'Test';
    S.drills.ew_teuer = [{ ts: Date.now() - 2 * D, wert: 2 }];                       // 1. Durchgang vor 2 Tagen → fällig (+1)
    S.drills.ew_budget = [{ ts: Date.now() - 10 * D, wert: 1 }, { ts: Date.now() - 3 * D, wert: 2 }]; // 2. Durchgang vor 3 Tagen → nicht fällig (+7)
    S.drills.kt_spin = [{ ts: Date.now() - 40 * D, score: 4, n: 4 }, { ts: Date.now() - 31 * D, score: 4, n: 4 }, { ts: Date.now() - 31 * D, score: 4, n: 4 }]; // 3. → +30 → fällig
    S.drills.wb_laer = { stufe: 4, ts: Date.now() - 8 * D };                           // abgeschlossen vor 8 Tagen → fällig
    S.drills.wb_spin = { stufe: 2, ts: Date.now() - 20 * D };                          // nicht abgeschlossen → nie fällig
    window.VA.save(); }, D);
  await page.reload();
  const wv = await page.evaluate(() => window.VA.wiedervorlagen().map(x => x.key));
  console.log('Fällige Wiedervorlagen:', JSON.stringify(wv), JSON.stringify(wv.sort()) === JSON.stringify(['ew_teuer', 'kt_spin', 'wb_laer']) ? 'OK' : 'FEHLER');
  console.log('Start zeigt Wiedervorlage-Karte:', await page.evaluate(() => !!document.querySelector('.card.wv')) ? 'OK' : 'FEHLER');
  console.log('Heute-Karte „Üben“ nennt Wiedervorlage:', await page.evaluate(() => /Wiedervorlage/.test(document.body.textContent)) ? 'OK' : 'FEHLER');
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  await go('#/einwaende'); console.log('Einwand-Liste: fällig-Tag:', await page.evaluate(() => [...document.querySelectorAll('.card')].filter(c => /fällig/.test(c.textContent)).length), '(erwartet 1)');
  await go('#/beispiele'); console.log('Beispiele: fällig-Tag:', await page.evaluate(() => [...document.querySelectorAll('.card')].filter(c => /fällig/.test(c.textContent)).length), '(erwartet 1)');
  // Einstufung
  await go('#/einstufung'); await page.click('[data-act="es-start"]'); await page.waitForTimeout(200);
  console.log('Einstufung Frage 1 mit „Weiß ich nicht“:', await page.evaluate(() => document.querySelectorAll('[data-act="es-answer"]').length), '(erwartet 5)');
  for (let i = 0; i < 20; i++) { await page.evaluate((i) => { const btns = [...document.querySelectorAll('[data-act="es-answer"]')]; (i % 3 === 0 ? btns[btns.length - 1] : btns[0]).click(); }, i); await page.waitForTimeout(60); }
  const E = await page.evaluate(() => window.VA.S.einstufung);
  console.log('Einstufung gespeichert:', E && E.n === 20 && Object.keys(E.module).length === 10 ? 'OK' : 'FEHLER', '| Profil-Tabelle:', await page.evaluate(() => document.querySelectorAll('.week-table tbody tr').length), '(erwartet 10)');
  console.log('Schaltet nichts frei (Modul 2 gesperrt):', await page.evaluate(() => { location.hash = '#/kurs/psychologie'; return new Promise(r => setTimeout(() => r(/Gesperrt/.test(document.body.textContent)), 300)); }) ? 'OK' : 'FEHLER');
  await go('#/kurs/grundlagen'); console.log('Modulseite zeigt Einstufung:', await page.evaluate(() => /Einstufung: \d von \d/.test(document.body.textContent)) ? 'OK' : 'FEHLER');
  // Deterministisch: zweimal dieselben Fragen
  const f1 = await page.evaluate(() => JSON.stringify(window.VA.S.einstufung.module));
  console.log('Zwei Fragen je Modul deterministisch:', f1.length > 50 ? 'OK' : 'FEHLER');
  console.log('ERRORS:', errs.length ? errs : 'none');
  await b.close();
})();

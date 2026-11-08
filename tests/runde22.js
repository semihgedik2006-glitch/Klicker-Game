// Runde 5, Durchgang 18: Einwand-Drill mit Texthinweisen und Selbstbewertung nach den Coach-Kriterien
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(700); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await go('#/einwaende/teuer');
  // Schwache Antwort: drei Warnhinweise, kein Lob
  await page.fill('form.ew-form textarea', 'Aber unser Produkt ist das beste am Markt und Sie bekommen 10 % Rabatt, wenn Sie heute unterschreiben. Das lohnt sich wirklich.');
  await page.click('form.ew-form button[type="submit"]'); await page.waitForTimeout(500);
  const h1 = await page.evaluate(() => ({ warn: document.querySelectorAll('.ew-check li.warn').length, ok: document.querySelectorAll('.ew-check li.ok').length, pos: (() => { const a = document.querySelector('.log-entry'); const c = document.querySelector('.ew-check'); return a && c && a.nextElementSibling === c; })(), text: (document.querySelector('.ew-check') || {}).textContent || '' }));
  ok('Schwache Antwort: drei Hinweise (keine Frage, Widerspruch zuerst, Nachlass), direkt unter der Antwort', h1.warn === 3 && h1.ok === 0 && h1.pos && /Keine Frage/.test(h1.text) && /widerspricht/.test(h1.text) && /Nachlass/.test(h1.text), JSON.stringify(h1));
  // Rubrik: ein Haken -> daneben (0)
  await page.check('form.ew-rubrik input[value="beleg"]'); await page.click('form.ew-rubrik button[type="submit"]'); await page.waitForTimeout(400);
  let runs = await page.evaluate(() => window.VA.S.drills.ew_teuer);
  ok('Ein Kriterium: wert 0, Kriterien und Falle gespeichert', runs.length === 1 && runs[0].wert === 0 && runs[0].kriterien.join() === 'beleg' && runs[0].falle === false && /Aber unser Produkt/.test(runs[0].antwort), JSON.stringify(runs));
  // Starke Antwort: Lob, keine Warnung zu fehlender Frage
  await page.fill('form.ew-form textarea', 'Verstehe, der Preis ist im Moment der größte Brocken. Zu teuer im Vergleich womit? Sie sagten vorhin, die Nachbearbeitung kostet sechs Stunden pro Woche. Rechnen wir das zusammen durch, und dann entscheiden Sie bis Freitag?');
  await page.click('form.ew-form button[type="submit"]'); await page.waitForTimeout(500);
  const h2 = await page.evaluate(() => ({ warn: document.querySelectorAll('.ew-check li.warn').length, ok: document.querySelectorAll('.ew-check li.ok').length, text: (document.querySelector('.ew-check') || {}).textContent || '' }));
  ok('Starke Antwort: zwei positive Hinweise, keine Warnung', h2.warn === 0 && h2.ok === 2 && /Anerkennen oder einem Label/.test(h2.text) && /Kunde gesagt hat/.test(h2.text), JSON.stringify(h2));
  const rub = await page.evaluate(() => ({ n: document.querySelectorAll('form.ew-rubrik input[name="k"]').length, falle: (document.querySelector('form.ew-rubrik label.falle') || {}).textContent || '', alt: !!document.querySelector('[data-act="ew-wert"]') }));
  ok('Rubrik: vier Kriterien plus Falle mit Klartext, keine alten Knöpfe', rub.n === 4 && /Die Falle hier: sofort Rabatt anbieten\./.test(rub.falle) && !rub.alt, JSON.stringify(rub));
  // Alle vier plus Falle -> getroffen (2)
  for (const v of ['zuhoeren', 'erkunden', 'beleg', 'schritt']) await page.check(`form.ew-rubrik input[value="${v}"]`);
  await page.check('form.ew-rubrik input[name="falle"]'); await page.click('form.ew-rubrik button[type="submit"]'); await page.waitForTimeout(400);
  runs = await page.evaluate(() => window.VA.S.drills.ew_teuer);
  ok('Alle Kriterien und Falle vermieden: wert 2', runs.length === 2 && runs[1].wert === 2 && runs[1].kriterien.length === 4 && runs[1].falle === true, JSON.stringify(runs.map(r => r.wert)));
  // Vier Kriterien ohne Falle -> nur teilweise (1)
  await page.fill('form.ew-form textarea', 'Verstehe. Zu teuer im Vergleich womit? Sie sagten vorhin, die Nachbearbeitung kostet sechs Stunden pro Woche. Lassen Sie uns das durchrechnen und nächste Woche entscheiden.');
  await page.click('form.ew-form button[type="submit"]'); await page.waitForTimeout(400);
  for (const v of ['zuhoeren', 'erkunden', 'beleg', 'schritt']) await page.check(`form.ew-rubrik input[value="${v}"]`);
  await page.click('form.ew-rubrik button[type="submit"]'); await page.waitForTimeout(400);
  runs = await page.evaluate(() => window.VA.S.drills.ew_teuer);
  ok('Vier Kriterien, Falle nicht vermieden: wert 1', runs.length === 3 && runs[2].wert === 1, JSON.stringify(runs.map(r => r.wert)));
  ok('Übersicht zeigt den letzten Stand „teilweise · 3×“', await page.evaluate(() => { location.hash = '#/einwaende'; return new Promise(r => setTimeout(() => r(/teilweise · 3×/.test(document.body.textContent)), 600)); }));
  // Spielbuch: beste Antwort mit Selbstcheck
  await go('#/spielbuch');
  const sb = await page.evaluate(() => (document.querySelector('.sb-row.mine') || {}).textContent || '');
  ok('Spielbuch zeigt die beste Antwort mit Selbstcheck 4/4 und Falle vermieden', /Verstehe, der Preis ist im Moment/.test(sb) && /Selbstcheck 4\/4, Falle vermieden/.test(sb), sb.slice(0, 160));
  // Coach speichert den ersten Schülersatz statt „(Coach-Gespräch)“
  const coach = fs.readFileSync(path.resolve(__dirname, '..', 'js/coach.js'), 'utf8');
  ok('Coach-Bewertung speichert den ersten Schülersatz als Antwort', /const erste = \(h\.find\(x => x\.role === 'user'/.test(coach) && /antwort: erste \? erste\.slice\(0, 400\) : '\(Coach-Gespräch\)'/.test(coach));
  // Kriterien im Prompt und in der App decken sich
  const app = fs.readFileSync(path.resolve(__dirname, '..', 'js/app.js'), 'utf8');
  ok('Kriterien der Rubrik entsprechen dem Coach-Prompt', ['Zugehört und anerkannt', 'Erkundet statt verteidigt', 'Nächster Schritt vereinbart'].every(k => coach.includes(k) && app.includes(k)) && /Antwort mit Beleg oder Zahl/.test(coach) && /Beleg oder Zahl des Kunden/.test(app));
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/einwaende/budget');
  await page.fill('form.ew-form textarea', 'Aber das Budget lässt sich doch sicher noch verschieben, wenn der Nutzen stimmt, oder nicht?');
  await page.click('form.ew-form button[type="submit"]'); await page.waitForTimeout(400);
  ok('Mobile Overflow Drill mit Rubrik', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

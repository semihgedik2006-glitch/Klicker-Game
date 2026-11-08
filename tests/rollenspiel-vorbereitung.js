// Rollenspiel-Vorbereitung, Checklisten druckbar, Einstiegstexte ohne Floskeln
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300);
  // Vorbereitung
  await go('#/rollenspiel/preishammer');
  ok('Vorbereitungsformular sichtbar', await page.evaluate(() => !!document.querySelector('form.rp-plan-form') && document.querySelectorAll('form.rp-plan-form input').length === 3));
  await page.fill('form.rp-plan-form [name="ziel"]', 'Termin für eine Rechnung mit ihren Zahlen nächste Woche');
  await page.fill('form.rp-plan-form [name="erste"]', 'Es klingt, als wäre der Preis gerade der größte Brocken.');
  await page.fill('form.rp-plan-form [name="grenze"]', 'Kein Rabatt ohne Gegenleistung');
  await page.click('form.rp-plan-form button[type="submit"]'); await page.waitForTimeout(400);
  ok('Plan gespeichert und als Karte angezeigt', await page.evaluate(() => { const p = window.VA.S.rpPlan.preishammer; return !!p && /Rechnung/.test(p.ziel) && !document.querySelector('form.rp-plan-form') && /Kein Rabatt ohne Gegenleistung/.test(document.querySelector('.card.rp-plan').textContent); }));
  await page.click('[data-act="rp-plan-edit"]'); await page.waitForTimeout(300);
  ok('Ändern öffnet Formular mit Werten', await page.evaluate(() => { const f = document.querySelector('form.rp-plan-form'); return !!f && f.querySelector('[name="grenze"]').value === 'Kein Rabatt ohne Gegenleistung'; }));
  await page.click('[data-act="rp-plan-cancel"]'); await page.waitForTimeout(300);
  ok('Abbrechen zeigt wieder die Karte', await page.evaluate(() => !document.querySelector('form.rp-plan-form') && !!document.querySelector('.card.rp-plan')));
  // Offline-Rollenspiel bis zum Ende: Fazit zeigt „Plan gegen Verlauf“
  await page.click('[data-act="rp-start"]'); await page.waitForTimeout(300);
  for (let i = 0; i < 12; i++) { const btn = await page.$('[data-act="rp-choose"]'); if (!btn) break; await btn.click(); await page.waitForTimeout(200); }
  ok('Fazit zeigt Plan gegen Verlauf', await page.evaluate(() => /Plan gegen Verlauf/.test(document.body.textContent) && /Dein Ziel war/.test(document.body.textContent)));
  // Coach-Prompt enthält die Vorbereitung
  const prompt = await page.evaluate(() => window.Coach && window.Coach._sys ? window.Coach._sys('rp', 'preishammer') : null);
  if (prompt !== null) ok('Coach-Prompt enthält Vorbereitung', /Vorbereitung des Schülers/.test(prompt) && /Kein Rabatt ohne Gegenleistung/.test(prompt));
  else console.log('Coach-Prompt: kein Testzugang (_sys fehlt), Prüfung per Quelltext:', require('fs').readFileSync(path.resolve(__dirname, '..', 'js/coach.js'), 'utf8').includes('Vorbereitung des Schülers') ? 'OK' : 'FEHLER');
  // Checklisten
  await go('#/checklisten');
  ok('Checklisten: Druckknopf und Container', await page.evaluate(() => !!document.querySelector('[data-act="print"]') && !!document.querySelector('.checklisten') && document.querySelectorAll('.checklisten .card').length >= 3));
  ok('Zurücksetzen-Knöpfe sind no-print', await page.evaluate(() => [...document.querySelectorAll('[data-act="check-reset"]')].every(b => b.classList.contains('no-print'))));
  await page.emulateMedia({ media: 'print' });
  ok('Druckansicht: Sidebar und Knöpfe ausgeblendet', await page.evaluate(() => { const sb = document.querySelector('.sidebar, aside, nav'); const np = document.querySelector('.btn-row.no-print'); return !!sb && getComputedStyle(sb).display === 'none' && !!np && getComputedStyle(np).display === 'none'; }));
  await page.emulateMedia({ media: 'screen' });
  // Copywriting: Floskeln weg
  const src = require('fs').readFileSync(path.resolve(__dirname, '..', 'js/app.js'), 'utf8');
  ok('„Keine Hilfsmittel, kein Zurückblättern“ entfernt', !src.includes('Keine Hilfsmittel, kein Zurückblättern'));
  ok('„kein Kurs zum Durchklicken“-Kontrast entfernt', !src.includes('kein Kurs zum Durchklicken'));
  ok('„beste Lernliste, die es gibt“ entfernt', !src.includes('beste Lernliste, die es gibt'));
  ok('Checklisten-Lead ohne Fragmentkette', !src.includes('Abhaken, zurücksetzen, wieder abhaken'));
  // Mobil
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/rollenspiel/preishammer');
  ok('Mobile Overflow Rollenspiel mit Plan', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

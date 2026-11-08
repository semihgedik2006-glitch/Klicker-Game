// Runde 5, Durchgang 7: Selbsteinschätzung auf #/wiederholen, blinde Flecken, Einstellungen gegliedert, Lektorat
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300);
  // Ohne Daten: keine Karte
  await go('#/wiederholen'); ok('Ohne Kalibrierungsdaten keine Karte', await page.evaluate(() => !document.querySelector('.card.kalib')));
  // Überkonfidenz + zwei blinde Flecken
  await page.evaluate(() => { const S = window.VA.S; S.lessonsDone.g1 = Date.now(); S.kalib = { sicher: 10, sicherOk: 5, unsicher: 4, unsicherOk: 2 }; S.blind['g1:0'] = Date.now() - 1000; S.blind['g1:1'] = Date.now(); const l = window.KURSE.flatMap(k => k.lektionen).find(x => x.id === 'g1'); l.quiz.forEach((q, qi) => { S.srs['g1:' + qi] = { n: 1, richtig: 1, box: 3, due: '2999-01-01' }; }); S.srs['g1:0'] = { n: 1, richtig: 0, box: 0, due: new Date().toISOString().slice(0, 10) }; S.srs['g1:1'] = { n: 1, richtig: 0, box: 0, due: new Date().toISOString().slice(0, 10) }; window.VA.save(); location.hash = '#/x'; location.hash = '#/wiederholen'; });
  await page.waitForTimeout(500);
  const txt = await page.evaluate(() => (document.querySelector('.card.kalib') || {}).textContent || '');
  ok('Karte zeigt 50 % bei sicher', /50 %/.test(txt));
  ok('Deutung Überkonfidenz mit Quelle', /Überkonfidenz/.test(txt) && /Lichtenstein/.test(txt));
  ok('Zwei blinde Flecken mit Lektionslink', await page.evaluate(() => { const d = document.querySelector('.card.kalib details'); return !!d && /2 blinde Flecken/.test(d.textContent) && d.querySelectorAll('a[href^="#/lektion/grundlagen/g1"]').length === 2; }));
  // Richtige Antwort in der Wiederholung löscht den blinden Fleck
  await page.click('[data-act="srs-start"]'); await page.waitForTimeout(300);
  const richtig = await page.evaluate(() => { const S = window.VA.S; const id = window.VA.srsStateId ? window.VA.srsStateId() : null; return id; });
  // Antworte korrekt: finde die richtige Option über den Fragetext
  const r = await page.evaluate(() => { const h = document.querySelector('.exam-q h2').textContent; const l = window.KURSE.flatMap(k => k.lektionen).find(x => x.id === 'g1'); const q = l.quiz.find(q => q.frage === h); return q ? q.richtig : -1; });
  ok('Fällige Karte aus g1 gestartet', r >= 0);
  if (r >= 0) { await page.click(`[data-act="srs-answer"][data-oi="${r}"]`); await page.waitForTimeout(300); }
  ok('Blinder Fleck nach richtiger Antwort gelöscht', await page.evaluate(() => Object.keys(window.VA.S.blind).length === 1));
  // Gut kalibriert
  await page.evaluate(() => { const S = window.VA.S; S.kalib = { sicher: 20, sicherOk: 18, unsicher: 10, unsicherOk: 5 }; window.VA.save(); });
  await page.reload(); await go('#/wiederholen');
  ok('Deutung „Gut kalibriert“', await page.evaluate(() => /Gut kalibriert/.test(document.querySelector('.card.kalib').textContent)));
  // Wochenrückblick verlinkt
  await go('#/'); ok('Wochenrückblick-Zeile verlinkt Selbsteinschätzung', await page.evaluate(() => !!document.querySelector('.card.week a[href="#/wiederholen"]')));
  // Einstellungen
  await go('#/einstellungen');
  ok('Einstellungen: drei Gruppen + Gefahrenzone', await page.evaluate(() => { const t = document.querySelector('main').textContent; return /Profil/.test(t) && /KI-Coach/.test(t) && /Daten/.test(t) && !!document.querySelector('.card.gefahr [data-act="reset"]'); }));
  ok('Gefahrenzone ist letzte Karte', await page.evaluate(() => { const cards = [...document.querySelectorAll('main .card')]; return cards.at(-1).classList.contains('gefahr'); }));
  ok('Formularfelder unverändert', await page.evaluate(() => ['name', 'plan', 'textsize', 'apiKey', 'model'].every(n => document.querySelector(`#settings [name="${n}"]`))));
  await page.fill('#settings [name="name"]', 'Neu'); await page.click('#settings button[type="submit"]'); await page.waitForTimeout(300);
  ok('Speichern funktioniert', await page.evaluate(() => window.VA.S.name === 'Neu'));
  await page.click('[data-act="reset"]'); await page.waitForTimeout(200);
  ok('Reset fragt nach', await page.evaluate(() => !!document.querySelector('#reset-yes')));
  await page.click('[data-act="close-modal"]').catch(() => {});
  // Lektorat
  ok('Aufzählungs-Tells in Beispiel-Hinweisen entfernt', await page.evaluate(() => !JSON.stringify(window.BEISPIELE).includes('Keine runde Zahl, keine Spanne') && !JSON.stringify(window.BEISPIELE).includes('Keine Entschuldigung, keine Frage')));
  // Mobil
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/wiederholen');
  ok('Mobile Overflow Wiederholen', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await go('#/einstellungen'); ok('Mobile Overflow Einstellungen', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

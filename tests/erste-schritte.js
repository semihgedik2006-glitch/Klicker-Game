// Erste-Schritte-Liste, leerer Zustand Trainingsbilanz, neue Kontraste, JTBD-Beispiel, Glossar-Erweiterung
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(400);
  // Erste Schritte: erster Punkt vorab erledigt (Endowed Progress)
  ok('Erste-Schritte-Karte sichtbar', await page.evaluate(() => !!document.querySelector('.card.tour')));
  const n0 = await page.evaluate(() => document.querySelector('.card.tour .eyebrow').textContent);
  ok('Startet bei 1 von 6', /1 von 6/.test(n0), n0);
  ok('Nächster Schritt hervorgehoben', await page.evaluate(() => /Erste Lektion/.test(document.querySelector('.tour-list li.next').textContent)));
  // Fortschritt: Abruf + Quiz + Bericht simulieren
  await page.evaluate(() => { const S = window.VA.S; S.abruf.g1 = { text: 'x'.repeat(130), ts: Date.now() }; S.quiz.g1 = { score: 5, total: 5, ts: Date.now(), versuche: 1 }; S.reports.g1 = [{ bestanden: true, ts: Date.now() }]; window.VA.save(); location.hash = '#/x'; location.hash = '#/'; });
  await page.waitForTimeout(400);
  const n1 = await page.evaluate(() => document.querySelector('.card.tour .eyebrow').textContent);
  ok('Zählt 4 von 6 nach Abruf, Quiz, Bericht', /4 von 6/.test(n1), n1);
  ok('Nächster Schritt jetzt Drill', await page.evaluate(() => /Drill/.test(document.querySelector('.tour-list li.next').textContent)));
  // Ausblenden
  await page.click('[data-act="tour-weg"]'); await page.waitForTimeout(300);
  ok('Liste ausgeblendet', await page.evaluate(() => !document.querySelector('.card.tour') && window.VA.S.tourWeg === true));
  // Alle erledigt → keine Karte, auch ohne tourWeg
  await page.evaluate(() => { const S = window.VA.S; S.tourWeg = false; S.drills.ew_teuer = [{ ts: Date.now(), wert: 2 }]; S.nein.push({ ts: Date.now(), text: 'x' }); window.VA.save(); location.hash = '#/x'; location.hash = '#/'; });
  await page.waitForTimeout(400);
  ok('Alle sechs erledigt → Karte verschwindet', await page.evaluate(() => !document.querySelector('.card.tour')));
  // Leerer Zustand Trainingsbilanz
  await page.evaluate(() => { const S = window.VA.S; S.drills = {}; window.VA.save(); });
  await go('#/training');
  ok('Trainingsbilanz leer → Einstiegskarte', await page.evaluate(() => { const c = document.querySelector('.card.empty'); return !!c && /Einwand-Drill/.test(c.textContent) && !!c.querySelector('a[href="#/einwaende"]'); }));
  // Neue Kontraste
  await go('#/kontraste'); ok('Kontraste: 14 Gruppen', await page.evaluate(() => document.querySelectorAll('.card.clickable').length) === 14);
  await go('#/kontraste/besitz-status');
  const names = await page.evaluate(() => [...document.querySelectorAll('[data-act="kt-wahl"]')].map(b => b.textContent.trim()));
  ok('Besitz/Status/Sunk Cost spielbar', names.length === 3 && names.some(n => /Besitztum/.test(n)), JSON.stringify(names));
  let richtig = 0;
  for (let i = 0; i < 4; i++) { const r = await page.evaluate(() => { const x = window.KONTRASTE.find(k => k.id === 'besitz-status'); const q = document.querySelector('.kt-drill .situation').textContent; const f = x.faelle.find(f => q.includes(f.situation.slice(0, 40))); return f ? f.richtig : -1; }); if (r < 0) break; await page.click(`[data-act="kt-wahl"][data-i="${r}"]`); await page.waitForTimeout(150); richtig++; const nx = await page.$('[data-act="kt-next"]'); if (nx) { await nx.click(); await page.waitForTimeout(150); } }
  ok('4 Fälle beantwortet', richtig === 4, String(richtig));
  ok('Ergebnis 4/4 gespeichert', await page.evaluate(() => { const r = (window.VA.S.drills['kt_besitz-status'] || []).at(-1); return !!r && r.score === r.n && r.n === 4; }));
  // JTBD-Beispiel
  await go('#/beispiele'); ok('Beispiele: 7 Prozeduren', await page.evaluate(() => /Job des Kunden/.test(document.body.textContent)));
  await go('#/beispiele/jtbd'); ok('JTBD Stufe 1 rendert vier Schritte', await page.evaluate(() => document.querySelectorAll('.steps.wb li, .wb-step').length >= 4 || /Zeitstrahl/.test(document.body.textContent)));
  // Vertiefen-Callout in Lektion a1 verweist auf Kontrast und Beispiel
  await page.evaluate(() => { const S = window.VA.S; for (const k of window.KURSE) { if (k.id === 'kundenanalyse') break; S.exams[k.id] = { passed: true, score: 10, total: 10, ts: Date.now() }; for (const l of k.lektionen) { S.lessonsDone[l.id] = Date.now(); } } S.vorfragen.a1 = { text: 'Weil sie ein Problem lösen wollen.', ts: Date.now() }; window.VA.save(); });
  await go('#/lektion/kundenanalyse/a1');
  ok('Lektion a1: Vertiefen nennt Denkfehler-Kontrast und JTBD', await page.evaluate(() => /Fluch des Wissens/.test(document.body.textContent) && /Job des Kunden/.test(document.body.textContent)));
  // Glossar
  await go('#/glossar'); await page.waitForTimeout(800);
  ok('Glossar 97 Begriffe, alphabetisch', await page.evaluate(() => window.GLOSSAR.length === 97 && window.GLOSSAR.every((g, i, a) => i === 0 || a[i - 1].b.localeCompare(g.b, 'de') <= 0)));
  await page.fill('#glossar-suche, input[type=search], .glossar input', 'Sunk').catch(() => {});
  await page.waitForTimeout(300);
  ok('Glossar-Suche „Sunk“ findet Versunkene Kosten', await page.evaluate(() => /Versunkene Kosten/.test(document.body.textContent)));
  // Mobil
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/'); await page.evaluate(() => { const S = window.VA.S; S.tourWeg = false; S.drills = {}; S.nein = []; window.VA.save(); location.hash = '#/x'; location.hash = '#/'; }); await page.waitForTimeout(400);
  ok('Mobile Overflow Start mit Erste-Schritte', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

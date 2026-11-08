// Persona-Felder in der Kundenanalyse, Zertifikat mit Trainingsbilanz, Framework J erweitert
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300);
  // Kundenanalyse mit Persona-Feldern
  await go('#/kundenanalyse');
  ok('Formular hat Auslöser, Zitate, Alternativen', await page.evaluate(() => ['ausloeser', 'zitate', 'alternativen'].every(n => document.querySelector(`#ka-form [name="${n}"]`))));
  await page.fill('#ka-form [name="name"]', 'Bäckerei Weber');
  await page.fill('#ka-form [name="ausloeser"]', 'Steuerprüfung hat zwei Tage gedauert');
  await page.fill('#ka-form [name="zitate"]', '„Ich mache jeden Abend drei Abrechnungen.“\nDie alte Kasse kenne ich blind.');
  await page.fill('#ka-form [name="alternativen"]', 'Beim alten System bleiben, Anbieter X');
  await page.evaluate(() => { for (const q of window.KA_FRAGEN) { const r = document.querySelector(`#ka-form [name="${q.id}"]`); if (r) r.checked = true; } });
  await page.click('#ka-form button.primary'); await page.waitForTimeout(500);
  const prof = await page.evaluate(() => window.VA.S.ka.at(-1));
  ok('Profil speichert die Persona-Felder', !!prof && prof.ausloeser.includes('Steuerprüfung') && prof.zitate.includes('drei Abrechnungen') && prof.alternativen.includes('Anbieter X') && !!prof.motiv);
  ok('Karte zeigt zwei Zitate mit Anführungszeichen, ohne doppelte', await page.evaluate(() => { const z = [...document.querySelectorAll('.ka-profile .zitat')].map(x => x.textContent); return z.length === 2 && z[0] === '„Ich mache jeden Abend drei Abrechnungen.“' && z[1].startsWith('„Die alte Kasse'); }));
  ok('Hypothesen-Hinweis und Druckknopf', await page.evaluate(() => /Hypothese aus einem Gespräch/.test(document.querySelector('.ka-profile .meta').textContent) && !!document.querySelector('[data-act="print"]')));
  // Altes Profil ohne die Felder bleibt darstellbar
  await page.evaluate(() => { window.VA.S.ka.push({ id: 'alt1', name: 'Alt', ts: Date.now() - 86400000, html: '<p>altes Profil</p>' }); window.VA.save(); location.hash = '#/x'; location.hash = '#/kundenanalyse'; });
  await page.waitForTimeout(400);
  ok('Altes Profil ohne Persona-Felder rendert', await page.evaluate(() => [...document.querySelectorAll('.ka-profile')].some(c => /altes Profil/.test(c.textContent) && !c.querySelector('.persona'))));
  // Zertifikat mit Trainingsbilanz
  await page.evaluate(() => { const S = window.VA.S; for (const k of window.KURSE) { S.exams[k.id] = { passed: true, attempts: [{ ts: Date.now(), pct: 90, passed: true }], best: 90 }; for (const l of k.lektionen) S.lessonsDone[l.id] = Date.now(); } S.exams.abschluss = { passed: true, attempts: [{ ts: Date.now(), pct: 93, passed: true }], best: 93 }; S.drills.ew_teuer = [{ ts: Date.now(), wert: 2 }, { ts: Date.now(), wert: 1 }]; S.drills.kt_spin = [{ ts: Date.now(), score: 4, n: 4 }]; S.drills.fall_x = [{ ts: Date.now(), selbst: 12 }]; S.drills.rp_preishammer = [{ ts: Date.now(), art: 'Offline', fazit: 'Bestanden. Gut.' }, { ts: Date.now(), art: 'Coach', score: 30 }]; S.nein = [{ ts: Date.now() }, { ts: Date.now() }, { ts: Date.now() }]; window.VA.save(); });
  await go('#/zertifikat');
  const stats = await page.evaluate(() => [...document.querySelectorAll('.cert-training div')].map(d => d.querySelector('strong').textContent + ' ' + d.querySelector('span').textContent));
  ok('Zertifikat zeigt Trainingsbilanz 2/1/1/1/3', JSON.stringify(stats) === JSON.stringify(['2 Einwände geübt', '1 Kontrast-Drills', '1 Fälle bearbeitet', '1 Rollenspiele bestanden', '3 Neins gesammelt']), JSON.stringify(stats));
  // Framework J
  const coach = fs.readFileSync(path.resolve(__dirname, '..', 'js/coach.js'), 'utf8');
  ok('Framework J: Was-wäre-wenn und Regel gegen Verkauf unter variablen Kosten', /Preis minus 10 %, Menge minus 20 %, Stückkosten plus 15 %/.test(coach) && /Nie unter den variablen Kosten verkaufen/.test(coach));
  ok('Business-Seite rendert Framework J mit 12 Schritten', await (async () => { await go('#/business'); return page.evaluate(() => { const f = window.Coach && window.Coach.FRAMEWORKS ? window.Coach.FRAMEWORKS.find(x => x.id === 'J') : null; return f ? f.schritte.length === 12 : /Stückkosten und Break-even/.test(document.body.textContent); }); })());
  // Mobil
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/kundenanalyse');
  ok('Mobile Overflow Kundenanalyse', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await go('#/zertifikat'); ok('Mobile Overflow Zertifikat', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

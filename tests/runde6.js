// Runde 5, Durchgang 2: Abruf vor Wiedererkennen, Distraktor-Feedback, Einwand-Drill, Mitnehmen-Karte
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.KURSE.slice(0, 2).forEach(k => { k.lektionen.forEach(l => { S.quiz[l.id] = { score: 4, total: 4, ts: Date.now() }; S.lessonsDone[l.id] = Date.now(); }); S.exams[k.id] = { attempts: [], passed: true, best: 100 }; }); window.VA.save(); });
  await page.reload();
  // Mitnehmen-Karte auf abgeschlossener Lektion
  await page.evaluate(() => { location.hash = '#/lektion/grundlagen/g1'; }); await page.waitForTimeout(300);
  console.log('Mitnehmen-Karte:', await page.evaluate(() => !!document.querySelector('.callout.mitnehmen')) ? 'OK' : 'FEHLT');
  // Quiz: Optionen erst nach Klick
  await page.evaluate(() => { location.hash = '#/lektion/wirkung/w1'; }); await page.waitForTimeout(300);
  await page.fill('.vorfrage-form textarea', 'Ich vermute, dass der erste Eindruck in Sekundenbruchteilen entsteht.'); await page.click('.vorfrage-form button'); await page.waitForTimeout(200);
  await page.fill('.abruf-form textarea', 'x'.repeat(130)); await page.click('.abruf-form button'); await page.waitForTimeout(200);
  const n = await page.evaluate(() => document.querySelectorAll('.quiz-q').length);
  const hidden = await page.evaluate(() => document.querySelectorAll('.opts[hidden]').length);
  console.log('Optionen verborgen:', hidden + '/' + n, hidden === n ? 'OK' : 'FEHLER');
  await page.click('[data-act="show-opts"]'); await page.waitForTimeout(100);
  console.log('Nach Klick verborgen:', await page.evaluate(() => document.querySelectorAll('.opts[hidden]').length), '(erwartet ' + (n - 1) + ')');
  // Alles falsch beantworten -> warumFalsch je Frage
  await page.evaluate(() => { const quiz = window.VA.quizSet('w1'); document.querySelectorAll('.quiz-q').forEach((box, qi) => { const q = quiz[qi]; const wrong = q.optionen.findIndex((o, i) => i !== q.richtig); box.querySelector(`input[value="${wrong}"]`).checked = true; }); });
  await page.click('.quiz button[type=submit]'); await page.waitForTimeout(300);
  const wf = await page.evaluate(() => document.querySelectorAll('.explain .wf').length);
  console.log('warumFalsch angezeigt:', wf + '/' + n, wf === n ? 'OK' : 'FEHLER');
  console.log('Optionen nach Auswertung sichtbar:', await page.evaluate(() => document.querySelectorAll('.opts[hidden]').length) === 0 ? 'OK' : 'FEHLER');
  // Einwand-Drill
  await page.evaluate(() => { location.hash = '#/einwaende'; }); await page.waitForTimeout(600);
  console.log('Einwände:', await page.evaluate(() => document.querySelectorAll('.card.clickable').length), '(erwartet 16)');
  await page.evaluate(() => { location.hash = '#/einwaende/teuer'; }); await page.waitForTimeout(300);
  await page.fill('.ew-form textarea', 'kurz'); await page.click('.ew-form button[type=submit]'); await page.waitForTimeout(200);
  console.log('Zu kurze Antwort abgewiesen:', await page.evaluate(() => !document.querySelector('[data-act="ew-wert"]')) ? 'OK' : 'FEHLER');
  await page.fill('.ew-form textarea', 'Ich verstehe, dass der Preis Ihnen hoch vorkommt. Womit vergleichen Sie ihn, damit ich einordnen kann, wo der Unterschied liegt?');
  await page.click('.ew-form button[type=submit]'); await page.waitForTimeout(300);
  console.log('Muster und Falle sichtbar:', await page.evaluate(() => document.querySelectorAll('.callout.practice, .callout.warn').length) >= 2 ? 'OK' : 'FEHLER');
  await page.click('[data-act="ew-wert"][data-wert="1"]'); await page.waitForTimeout(300);
  console.log('Selbstbewertung gespeichert:', await page.evaluate(() => JSON.stringify(window.VA.S.drills.ew_teuer.map(x => x.wert))));
  // Coach-Modus Einwand (ohne Schlüssel nur Titel)
  await page.evaluate(() => { location.hash = '#/coach?einwand=teuer'; }); await page.waitForTimeout(500);
  console.log('Coach-Einwand-Titel:', await page.evaluate(() => (document.querySelector('h1,h2') || {}).textContent));
  // Rollenspiel-Tag
  await page.evaluate(() => { location.hash = '#/rollenspiel'; }); await page.waitForTimeout(300);
  console.log('„offline spielbar“ entfernt:', await page.evaluate(() => !document.body.textContent.includes('offline spielbar')) ? 'OK' : 'FEHLER');
  console.log('ERRORS:', errs.length ? errs : 'none');
  await b.close();
})();

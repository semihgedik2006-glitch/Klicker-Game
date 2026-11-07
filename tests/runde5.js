// Runde 5: Rückblick-Fragen, Sicherheits-Abfrage, Berichtsvorlage, Selbsterklärung, Glossar, CSP. Start: node tests/runde5.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const csp = []; page.on('console', m => { if (/Content Security Policy|Refused to/.test(m.text())) csp.push(m.text()); });
  const url = 'file://' + path.resolve(__dirname, '..', 'index.html'); await page.goto(url);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.KURSE[0].lektionen.forEach(l => { S.quiz[l.id] = { score: 4, total: 4, ts: Date.now() }; S.lessonsDone[l.id] = Date.now(); }); S.exams[window.KURSE[0].id] = { attempts: [], passed: true, best: 100 }; window.VA.save(); });
  await page.reload(); const k2 = await page.evaluate(() => ({ kid: window.KURSE[1].id, lid: window.KURSE[1].lektionen[0].id, n: window.KURSE[1].lektionen[0].quiz.length }));
  await page.goto(url + '#/lektion/' + k2.kid + '/' + k2.lid); await page.waitForTimeout(200);
  await page.fill('.vorfrage-form textarea', 'Ich rate, dass es um Gegenseitigkeit geht und Menschen Gefälligkeiten erwidern.'); await page.click('.vorfrage-form button'); await page.waitForTimeout(200);
  await page.fill('.abruf-form textarea', 'x'.repeat(130)); await page.click('.abruf-form button'); await page.waitForTimeout(200);
  const selbst = await page.$$eval('.callout.selbst li', l => l.length); console.log('Selbsterklärung-Fragen:', selbst);
  const nq = await page.$$eval('.quiz-q', q => q.length); const rb = await page.$$eval('.quiz-q .eyebrow', e => e.length);
  console.log('Quizfragen:', nq, '(Lektion ' + k2.n + ' + Rückblick ' + rb + ')', nq === k2.n + 2 && rb === 2 ? 'OK' : 'FEHLER');
  // Antworten: alle richtig, außer Frage 0 falsch und "sicher" angekreuzt
  await page.evaluate((lid) => { const set = window.VA.quizSet(lid); set.forEach((q, i) => { const v = i === 0 ? (q.richtig + 1) % q.optionen.length : q.richtig; document.querySelector(`input[name="q${i}"][value="${v}"]`).click(); }); document.querySelector('input[name="s0"]').click(); }, k2.lid);
  await page.click('.quiz button[type=submit]'); await page.waitForTimeout(300);
  const score = await page.$eval('.quiz .score', e => e.textContent); console.log('Score:', score, /blinder Fleck/.test(score) ? 'OK' : 'FEHLER');
  const st = await page.evaluate((lid) => ({ kalib: window.VA.S.kalib, blind: Object.keys(window.VA.S.blind), srs: window.VA.S.srs[lid + ':0'] }), k2.lid); console.log('Kalibrierung:', JSON.stringify(st));
  await page.waitForTimeout(900);
  const hasVorlage = await page.$('[data-act=report-vorlage]'); console.log('Vorlage-Button:', !!hasVorlage ? 'OK' : 'FEHLER');
  if (hasVorlage) { await page.click('[data-act=report-vorlage]'); const t = await page.$eval('.report textarea', e => e.value); console.log('Vorlage eingefügt:', /Situation/.test(t) ? 'OK' : 'FEHLER', '· Zähler:', await page.$eval('.report .count .n', e => e.textContent)); }
  // Modulprüfung Modul 2 mit Rückblick aus Modul 1
  await page.evaluate(() => { const S = window.VA.S; window.KURSE[1].lektionen.forEach(l => { S.quiz[l.id] = { score: 4, total: 4, ts: Date.now() }; S.lessonsDone[l.id] = Date.now(); }); window.VA.save(); });
  await page.goto(url + '#/pruefung/' + k2.kid); await page.waitForTimeout(200); await page.click('[data-act=exam-start]'); await page.waitForTimeout(200);
  const total = await page.$eval('.breadcrumb', e => e.textContent); console.log('Prüfung:', total.trim(), /von 15/.test(total) ? 'OK' : 'FEHLER');
  // Glossar
  await page.goto(url + '#/glossar'); await page.waitForTimeout(600);
  const g = await page.$$eval('.glos', e => e.length); console.log('Glossar-Einträge:', g, g >= 60 ? 'OK' : 'FEHLER');
  await page.fill('#g-q', 'batna'); await page.waitForTimeout(400); console.log('Glossar-Suche BATNA:', await page.$$eval('.glos', e => e.length));
  console.log('CSP-Verstöße:', csp.length, csp.slice(0, 3));
  await b.close();
})();

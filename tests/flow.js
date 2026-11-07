const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('file://' + require('path').resolve(__dirname, '..', 'index.html'));
  // Modul 1 komplett: alle Lektionen als erledigt setzen (Quiz + Bericht), dann Prüfung spielen
  await page.evaluate(() => { const S = JSON.parse(localStorage.getItem('verkaufsakademie_v1') || '{}'); S.quiz = {}; S.lessonsDone = {}; S.reports = {}; S.vorfragen = {}; S.abruf = {}; S.srs = {}; S.onboarded = true; S.name = 'Semih'; window.KURSE[0].lektionen.forEach(l => { S.quiz[l.id] = { score: 4, total: 4, ts: Date.now() }; S.lessonsDone[l.id] = Date.now(); }); localStorage.setItem('verkaufsakademie_v1', JSON.stringify(S)); location.reload(); });
  await page.waitForTimeout(300);
  await page.evaluate(() => location.hash = '#/pruefung/grundlagen'); await page.waitForTimeout(200);
  await page.click('[data-act=exam-start]'); await page.waitForTimeout(200);
  // alle Fragen richtig beantworten
  for (let i = 0; i < 20; i++) {
    const done = await page.evaluate(() => !document.querySelector('.exam-q'));
    if (done) break;
    await page.evaluate(() => { const frage = document.querySelector('.exam-q h2').textContent; let q; window.KURSE[0].lektionen.forEach(l => l.quiz.forEach(x => { if (x.frage === frage) q = x; })); [...document.querySelectorAll('.exam-q .btn-opt')].find(b => b.textContent === q.optionen[q.richtig]).click(); });
    await page.waitForTimeout(80);
  }
  console.log('Ergebnis:', await page.$eval('#main h1', e => e.textContent));
  console.log('Modul 2 frei:', await page.evaluate(() => { location.hash = '#/kurs/psychologie'; return new Promise(r => setTimeout(() => r(!document.querySelector('.callout.warn')), 200)); }));
  console.log('Nav:', await page.$eval('#nav', e => e.innerText.replace(/\n+/g, ' | ').slice(0, 200)));
  // Prüfung nicht bestehen -> Sperre
  await page.evaluate(() => location.hash = '#/pruefung/grundlagen'); await page.waitForTimeout(200);
  await page.click('[data-act=exam-start]'); await page.waitForTimeout(200);
  for (let i = 0; i < 20; i++) { if (await page.evaluate(() => !document.querySelector('.exam-q'))) break; await page.locator('.exam-q .btn-opt').first().click(); await page.waitForTimeout(60); }
  console.log('Fail-Ergebnis:', await page.$eval('#main h1', e => e.textContent), '| passed bleibt:', await page.evaluate(() => JSON.parse(localStorage.getItem('verkaufsakademie_v1')).exams.grundlagen.passed));
  // Offline-Rollenspiel bis zum Ende
  await page.evaluate(() => location.hash = '#/rollenspiel/preishammer'); await page.waitForTimeout(200);
  await page.click('[data-act=rp-start]'); await page.waitForTimeout(200);
  for (let i = 0; i < 10; i++) { const btn = await page.$('#rp-box .btn-opt'); if (!btn) break; await btn.click(); await page.waitForTimeout(60); }
  console.log('RP Fazit:', await page.$eval('#rp-box .callout', e => e.innerText.slice(0, 80)));
  // Mythen-Check durchspielen
  await page.evaluate(() => location.hash = '#/mythen'); await page.waitForTimeout(200);
  for (let i = 0; i < 10; i++) { await page.click('[data-act=myth-answer]'); await page.waitForTimeout(60); await page.click('[data-act=myth-next]'); await page.waitForTimeout(60); }
  console.log('Mythen:', await page.$eval('#main h1', e => e.textContent));
  // Kundenanalyse
  await page.evaluate(() => location.hash = '#/kundenanalyse'); await page.waitForTimeout(200);
  await page.fill('#ka-form [name=name]', 'Test GmbH');
  await page.evaluate(() => document.querySelectorAll('#ka-form .ka-q').forEach(q => q.querySelector('input').click()));
  await page.click('#ka-form button'); await page.waitForTimeout(200);
  console.log('KA Profil:', await page.$eval('#main', e => /Kaufmotiv/.test(e.innerText)));
  // Körper-Drill Timer
  await page.evaluate(() => location.hash = '#/koerper'); await page.waitForTimeout(200);
  await page.click('[data-act=kd-start][data-id=laecheln]'); await page.waitForTimeout(300);
  console.log('Timer:', await page.$eval('#kd-timer', e => e.textContent));
  await page.click('[data-act=kd-skip]');
  // Ablehnungstraining Tag 1
  await page.evaluate(() => location.hash = '#/training'); await page.waitForTimeout(200);
  await page.fill('.ablehnung textarea', 'Ich habe im Supermarkt nach Rabatt gefragt, die Kassiererin hat nein gesagt und gelacht.');
  await page.click('.ablehnung button'); await page.waitForTimeout(200);
  console.log('Tag 1 done:', await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('verkaufsakademie_v1')).ablehnung)));
  // Journal
  await page.evaluate(() => location.hash = '#/journal'); await page.waitForTimeout(200);
  await page.fill('[data-book=erfolg] textarea', 'Drei Neins gesammelt.'); await page.click('[data-book=erfolg] button'); await page.waitForTimeout(200);
  console.log('Journal:', await page.evaluate(() => JSON.parse(localStorage.getItem('verkaufsakademie_v1')).erfolg.length));
  // Settings + Coach-Seite mit Key (ohne echten Call)
  await page.evaluate(() => location.hash = '#/einstellungen'); await page.waitForTimeout(200);
  await page.fill('#settings [name=apiKey]', 'sk-ant-test'); await page.click('#settings button[type=submit]'); await page.waitForTimeout(200);
  await page.evaluate(() => location.hash = '#/coach?rp=partner'); await page.waitForTimeout(200);
  console.log('Coach RP page:', await page.$eval('#main h1', e => e.textContent), '|', await page.$('[data-act=rp-open]') ? 'open-btn' : 'no-btn');
  await page.evaluate(() => location.hash = '#/coach?biz=F'); await page.waitForTimeout(200);
  console.log('Coach Biz page:', await page.$eval('#main h1', e => e.textContent));
  await page.evaluate(() => location.hash = '#/coach?mode=coach'); await page.waitForTimeout(200);
  console.log('Coach page:', await page.$eval('#main h1', e => e.textContent));
  await page.screenshot({ path: 'coach.png' });
  await page.evaluate(() => location.hash = '#/lektion/grundlagen/g2'); await page.waitForTimeout(200);
  await page.screenshot({ path: 'lesson.png', fullPage: false });
  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
    // Wiederholen: Karten aus abgeschlossenen Lektionen
  await page.evaluate(() => location.hash = '#/wiederholen'); await page.waitForTimeout(200);
  console.log('SRS Seite:', await page.evaluate(() => document.querySelector('h1').textContent + ' | ' + (document.querySelector('.stats .big') || {}).textContent));
  if (await page.$('[data-act=srs-start]')) {
    await page.click('[data-act=srs-start]'); await page.waitForTimeout(200);
    for (let i = 0; i < 3; i++) { await page.click('.exam-q .btn-opt'); await page.waitForTimeout(150); console.log('SRS Antwort', i, await page.evaluate(() => !!document.querySelector('.explain'))); await page.click('[data-act=srs-next]'); await page.waitForTimeout(150); }
    console.log('SRS state:', await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('verkaufsakademie_v1')).srs).length));
  }
  await page.screenshot({ path: 'srs.png' });
  // Abschlussprüfung: alle Module bestanden setzen, 30 Fragen lösen, Zertifikat
  await page.evaluate(() => { const S = window.VA.S; window.KURSE.forEach(k => { S.exams[k.id] = { attempts: [{ ts: Date.now(), pct: 100, passed: true }], passed: true, best: 100 }; k.lektionen.forEach(l => { S.lessonsDone[l.id] = Date.now(); }); }); window.VA.save(); location.hash = '#/abschluss'; location.reload(); }); await page.waitForTimeout(400);
  console.log('Abschluss frei:', await page.evaluate(() => !!document.querySelector('[data-act=exam-start][data-kid=abschluss]')));
  await page.click('[data-act=exam-start][data-kid=abschluss]'); await page.waitForTimeout(200);
  for (let i = 0; i < 30; i++) {
    const ok = await page.evaluate(() => { const h = document.querySelector('.exam-q h2'); if (!h) return false; const frage = h.textContent; let q; window.KURSE.forEach(k => k.lektionen.forEach(l => l.quiz.forEach(x => { if (x.frage === frage) q = x; }))); const b = [...document.querySelectorAll('.exam-q .btn-opt')].find(b => b.textContent === q.optionen[q.richtig]); b.click(); return true; });
    if (!ok) break; await page.waitForTimeout(60);
  }
  console.log('Abschluss-Ergebnis:', await page.evaluate(() => document.querySelector('h1').textContent + ' | Rang ' + window.VA.rang()));
  await page.evaluate(() => location.hash = '#/zertifikat'); await page.waitForTimeout(300);
  console.log('Zertifikat:', await page.evaluate(() => (document.querySelector('.cert-name') || {}).textContent));
  await page.screenshot({ path: 'zertifikat.png' });
  await page.evaluate(() => location.hash = '#/'); await page.waitForTimeout(300);
  console.log('Wochenrückblick:', await page.evaluate(() => !!document.querySelector('.week-table')));
  await page.evaluate(() => location.hash = '#/quellen'); await page.waitForTimeout(800);
  console.log('Quellen lazy:', await page.evaluate(() => (window.QUELLEN || []).length));
await browser.close();
})();

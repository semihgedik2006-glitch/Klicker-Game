// Runde 5, Durchgang 3: Konzept-Kontraste, Schritt für Schritt, Lernsitzung, Einwand-Coach, Business-Frameworks I/J
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const reqs = [];
  await page.route('https://api.anthropic.com/**', async (route) => {
    const body = JSON.parse(route.request().postData()); reqs.push(body);
    const text = body.system.includes('Modus: Einwand-Drill') && /ENDE/.test(body.messages.at(-1).content) ? 'BEWERTUNG EINWAND\nZugehört und anerkannt: 8/10 – ok\nErkundet statt verteidigt: 7/10 – ok\nAntwort mit Beleg oder Zahl: 7/10 – ok\nNächster Schritt vereinbart: 8/10 – ok\nFalle vermieden (Sofort Rabatt anbieten): ja – ok\nGesamt: 30/40' : body.system.includes('Modus: Lernsitzung') ? 'Erste Frage: Was kauft der Kunde laut Levitt wirklich?' : 'ok';
    const chunks = text.match(/.{1,12}/gs).map(t => `event: content_block_delta\ndata: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: t } })}\n\n`).join('');
    await route.fulfill({ status: 200, contentType: 'text/event-stream', body: `event: message_start\ndata: {"type":"message_start"}\n\n${chunks}event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"}}\n\nevent: message_stop\ndata: {"type":"message_stop"}\n\n` });
  });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; S.apiKey = 'sk-ant-test'; window.KURSE[0].lektionen.forEach(l => { S.quiz[l.id] = { score: 4, total: 4, ts: Date.now() }; S.lessonsDone[l.id] = Date.now(); }); S.exams.grundlagen = { attempts: [], passed: true, best: 100 }; S.blind = { 'g1:0': Date.now() }; window.VA.save(); });
  await page.reload();
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(300); };
  // Kontraste
  await go('#/kontraste'); console.log('Kontraste:', await page.evaluate(() => document.querySelectorAll('.card.clickable').length), '(erwartet 11)');
  await go('#/kontraste/spin');
  const names = await page.evaluate(() => [...document.querySelectorAll('[data-act="kt-wahl"]')].map(b => b.textContent));
  console.log('Fall zeigt Begriffe ohne Nennung der Methode:', names.length === 4 && !(await page.evaluate(() => document.querySelector('.kt-drill .situation').textContent)).includes('Implikationsfrage') ? 'OK' : 'FEHLER');
  for (let i = 0; i < 4; i++) { await page.evaluate(() => { const x = window.KONTRASTE.find(k => k.id === 'spin'); const q = document.querySelector('.kt-drill .situation').textContent; const f = x.faelle.find(ff => ff.situation === q); document.querySelector(`[data-act="kt-wahl"][data-i="${f.richtig}"]`).click(); }); await page.waitForTimeout(100); await page.click('[data-act="kt-next"]'); await page.waitForTimeout(100); }
  console.log('Kontrast-Drill alles richtig:', await page.evaluate(() => document.querySelector('.kt-drill h2').textContent), '| gespeichert:', JSON.stringify(await page.evaluate(() => window.VA.S.drills.kt_spin)));
  // Beispiele
  await go('#/beispiele'); console.log('Schritt für Schritt:', await page.evaluate(() => document.querySelectorAll('.card.clickable').length), '(erwartet 6)');
  await go('#/beispiele/spin');
  console.log('Stufe 1 zeigt Warum je Schritt:', await page.evaluate(() => document.querySelectorAll('.steps.wb .warum').length), '(erwartet 4)');
  await page.click('[data-act="wb-next"]'); await page.waitForTimeout(150);
  await page.fill('.wb-form textarea', 'kurz'); await page.click('.wb-form button'); await page.waitForTimeout(150);
  console.log('Zu kurze Lücke abgewiesen:', await page.evaluate(() => !document.body.textContent.includes('Eine mögliche Lösung')) ? 'OK' : 'FEHLER');
  await page.fill('.wb-form textarea', 'Wie viele Anrufe verpassen Sie am Tag, und was kostet Sie das im Monat?'); await page.click('.wb-form button'); await page.waitForTimeout(150);
  console.log('Lösung erst nach Versuch:', await page.evaluate(() => document.body.textContent.includes('Eine mögliche Lösung')) ? 'OK' : 'FEHLER');
  await page.click('[data-act="wb-next"]'); await page.waitForTimeout(150);
  console.log('Stufe 3: Kriterien vor Versuch verborgen:', await page.evaluate(() => document.querySelectorAll('.krit-box').length) === 0 ? 'OK' : 'FEHLER');
  await page.fill('.wb-form textarea', 'S: … P: … I: … N: … '.repeat(8)); await page.click('.wb-form button'); await page.waitForTimeout(150);
  console.log('Kriterien + Musterlösung eingeklappt:', await page.evaluate(() => document.querySelectorAll('.krit-box').length === 4 && !!document.querySelector('details.muster:not([open])')) ? 'OK' : 'FEHLER');
  console.log('Fortschritt gespeichert:', JSON.stringify(await page.evaluate(() => window.VA.S.drills.wb_spin)));
  // Lektion verweist auf Vertiefung
  await go('#/lektion/grundlagen/g1'); 
  console.log('Lektion 5.1 hätte Vertiefung; g1 nicht:', await page.evaluate(() => !document.querySelector('.vertiefen')) ? 'OK' : 'FEHLER');
  // Lernsitzung
  await go('#/coach?lern=1');
  console.log('Lernsitzung-Titel:', await page.evaluate(() => document.querySelector('h1').textContent));
  await page.click('[data-act="rp-open"]'); await page.waitForTimeout(400);
  const lern = reqs.find(r => r.system.includes('Modus: Lernsitzung'));
  console.log('Lern-Prompt enthält blinden Fleck + Kernpunkte + Regel „nie Zusammenfassung“:', lern && /BLINDER FLECK/.test(lern.system) && /Kernpunkte der Lektion/.test(lern.system) && /Eröffne NIE mit einer Zusammenfassung/.test(lern.system) ? 'OK' : 'FEHLER');
  console.log('Erste Frage im Chat:', await page.evaluate(() => document.querySelector('#chat').textContent.includes('Erste Frage')) ? 'OK' : 'FEHLER');
  // Einwand-Coach: Bewertung wird gespeichert
  await go('#/coach?einwand=teuer'); await page.waitForTimeout(400);
  await page.click('[data-act="rp-open"]'); await page.waitForTimeout(300);
  await page.fill('#chat-input', 'ENDE'); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  console.log('Einwand-Bewertung gespeichert als getroffen:', JSON.stringify(await page.evaluate(() => (window.VA.S.drills.ew_teuer || []).map(x => [x.wert, x.coach]))));
  // Business I/J
  console.log('Business-Frameworks:', await page.evaluate(() => window.Coach.FRAMEWORKS.map(f => f.id).join('')), '(erwartet ABCDEFGHIJ)');
  // Mobile: Kontrast-Grid kein Overflow
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/kontraste/anker-batna');
  console.log('Mobile Overflow Kontraste:', await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) ? 'FEHLER' : 'OK');
  console.log('ERRORS:', errs.length ? errs : 'none');
  await b.close();
})();

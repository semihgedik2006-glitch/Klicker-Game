const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  let lastReq = null;
  await page.route('https://api.anthropic.com/**', async (route) => {
    const body = JSON.parse(route.request().postData()); lastReq = { headers: route.request().headers(), body };
    if (body.stream) {
      const text = body.system.includes('Modus: Rollenspiel') && /ENDE/.test(body.messages.at(-1).content) ? 'Gut.\nBEWERTUNG\nVorbereitung: 7/10 – ok\nFragen und Zuhören: 8/10 – ok\nTaktische Empathie: 7/10 – ok\nAnker und Zugeständnisse: 6/10 – ok\nEinwandbehandlung: 7/10 – ok\nAbschluss/nächster Schritt: 8/10 – ok\nEthik: bestanden – sauber\nPflichtkriterien: erfüllt 3 von 3\nGesamt: 43/60\n\nAufgabe bis 10.11.: ruf an.' : 'Hallo **' + (body.system.match(/Name: (\S+)/) || [, '?'])[1] + '**. Was hast du heute geübt?\n\n- Punkt A\n- Punkt B';
      const chunks = text.match(/.{1,12}/gs).map(t => `event: content_block_delta\ndata: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: t } })}\n\n`).join('');
      const sse = `event: message_start\ndata: {"type":"message_start"}\n\n${chunks}event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"}}\n\nevent: message_stop\ndata: {"type":"message_stop"}\n\n`;
      await route.fulfill({ status: 200, contentType: 'text/event-stream', body: sse });
    } else if (body.system && body.system.includes('Berichtsprüfung')) {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ stop_reason: 'end_turn', content: [{ type: 'text', text: '{"bestanden": true, "note": 8, "feedback": "Konkret. Woher weißt du, dass sie gelacht hat, weil es ihr peinlich war?"}' }] }) });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ stop_reason: 'end_turn', content: [{ type: 'text', text: 'bereit' }] }) });
    }
  });
  await page.goto('file://' + require('path').resolve(__dirname, '..', 'index.html'));
  await page.evaluate(() => { localStorage.removeItem('verkaufsakademie_v1'); location.reload(); }); await page.waitForTimeout(200);
  await page.evaluate(() => location.hash = '#/einstellungen'); await page.waitForTimeout(150);
  await page.fill('#settings [name=name]', 'Semih'); await page.fill('#settings [name=apiKey]', 'sk-ant-test'); await page.click('#settings button[type=submit]'); await page.waitForTimeout(100);
  await page.click('[data-act=test-key]'); await page.waitForTimeout(300);
  console.log('Test headers:', lastReq.headers['anthropic-version'], lastReq.headers['anthropic-dangerous-direct-browser-access'], lastReq.body.model);
  await page.evaluate(() => location.hash = '#/coach'); await page.waitForTimeout(150);
  await page.fill('#chat-input', 'Ich habe heute drei Leute angerufen.'); await page.keyboard.press('Enter'); await page.waitForTimeout(500);
  console.log('Coach reply:', await page.$eval('.msg.assistant .body', e => e.innerHTML.slice(0, 120)));
  console.log('System has context:', /Über den Schüler/.test(lastReq.body.system), '| stream:', lastReq.body.stream, '| msgs:', lastReq.body.messages.length);
  // Rollenspiel
  await page.evaluate(() => location.hash = '#/coach?rp=partner'); await page.waitForTimeout(150);
  await page.click('[data-act=rp-open]'); await page.waitForTimeout(400);
  console.log('RP opened msgs:', await page.$$eval('.msg', e => e.length), '| hidden user msg stored:', await page.evaluate(() => JSON.parse(localStorage.getItem('verkaufsakademie_v1')).chats.rp_partner.length));
  await page.fill('#chat-input', 'ENDE'); await page.keyboard.press('Enter'); await page.waitForTimeout(600);
  console.log('RP rating saved:', await page.evaluate(() => JSON.parse(localStorage.getItem('verkaufsakademie_v1')).drills.rp_partner));
  // Bericht durch Coach prüfen
  await page.evaluate(() => location.hash = '#/lektion/grundlagen/g1'); await page.waitForTimeout(150);
  if (await page.$('.vorfrage-form')) { await page.fill('.vorfrage-form textarea', 'Ich glaube, Vertrauen zählt mehr als Argumente.'); await page.click('.vorfrage-form button[type=submit]'); await page.waitForTimeout(300); }
  if (await page.$('.abruf-form')) { await page.fill('.abruf-form textarea', 'a'.repeat(130)); await page.click('.abruf-form button[type=submit]'); await page.waitForTimeout(300); }
  await page.evaluate(() => { const l = window.KURSE[0].lektionen[0]; l.quiz.forEach((q, i) => document.querySelector(`input[name="q${i}"][value="${q.richtig}"]`).click()); });
  await page.click('.quiz button[type=submit]'); await page.waitForTimeout(1100);
  await page.fill('.report textarea', 'x'.repeat(260)); await page.click('.report button[type=submit]'); await page.waitForTimeout(500);
  console.log('Report via coach:', await page.evaluate(() => JSON.parse(localStorage.getItem('verkaufsakademie_v1')).reports.g1[0].von), '| done:', await page.evaluate(() => !!JSON.parse(localStorage.getItem('verkaufsakademie_v1')).lessonsDone.g1));
  await page.evaluate(() => location.hash = '#/coach'); await page.waitForTimeout(200);
  await page.screenshot({ path: 'coach.png' });
  // Fehlerfall 401
  await page.unroute('https://api.anthropic.com/**');
  await page.route('https://api.anthropic.com/**', r => r.fulfill({ status: 401, contentType: 'application/json', body: '{"error":{"message":"invalid x-api-key"}}' }));
  await page.fill('#chat-input', 'test'); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
  console.log('401 handled:', await page.$eval('.msg.assistant:last-child .err', e => e.textContent));
  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();

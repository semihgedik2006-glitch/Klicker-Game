// Fälle mit Rubrik, Coach-Fallbewertung, Trainingsbilanz, Wochenrückblick
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const reqs = [];
  await page.route('https://api.anthropic.com/**', async (route) => {
    const body = JSON.parse(route.request().postData()); reqs.push(body);
    const text = body.system.includes('Modus: Fallbewertung') ? 'BEWERTUNG FALL\nProblem erfassen: 3/3 – Du schreibst: „…“\nInformationen nutzen: 2/3 – ok\nAlternativen abwägen: 2/3 – ok\nEntscheiden: 3/3 – ok\nPrüfen: 2/3 – ok\nKommunizieren: 3/3 – ok\nGesamt: 15/18\nHauptkorrektur: …\nVertretbar anders: …\nVariation: …' : 'ok';
    const chunks = text.match(/.{1,12}/gs).map(t => `event: content_block_delta\ndata: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: t } })}\n\n`).join('');
    await route.fulfill({ status: 200, contentType: 'text/event-stream', body: `event: message_start\ndata: {"type":"message_start"}\n\n${chunks}event: message_delta\ndata: {"type":"message_delta","delta":{"stop_reason":"end_turn"}}\n\nevent: message_stop\ndata: {"type":"message_stop"}\n\n` });
  });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; S.apiKey = 'sk-ant-test'; S.lessonsDone.g1 = Date.now(); S.quiz.g1 = { score: 4, total: 4, ts: Date.now() }; window.VA.save(); });
  await page.reload();
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  await go('#/faelle');
  console.log('Fälle:', await page.evaluate(() => document.querySelectorAll('.card.clickable, .card.locked').length), '(erwartet 10) · gesperrt:', await page.evaluate(() => document.querySelectorAll('.card.locked').length), '(erwartet 9)');
  await go('#/faelle/f-grundlagen');
  console.log('Methode nicht genannt in Lage/Auftrag:', await page.evaluate(() => !/Selbstwirksamkeit|Levitt|Bandura/.test(document.querySelector('.kontext').textContent)) ? 'OK' : 'FEHLER');
  await page.fill('.fall-form textarea', 'zu kurz'); await page.click('.fall-form button'); await page.waitForTimeout(150);
  console.log('Zu kurz abgewiesen:', await page.evaluate(() => !document.querySelector('.fall-rubrik')) ? 'OK' : 'FEHLER');
  await page.fill('.fall-form textarea', 'Befund: Jonas hat kein Akquiseproblem, sondern ein Identitätsproblem. '.repeat(6)); await page.click('.fall-form button'); await page.waitForTimeout(200);
  console.log('Rubrik mit 6 Dimensionen × 3 Stufen:', await page.evaluate(() => document.querySelectorAll('.rubrik-dim').length + '×' + document.querySelectorAll('.rubrik-dim')[0].querySelectorAll('input').length));
  console.log('Musterelemente vor Bewertung verborgen:', await page.evaluate(() => !document.body.textContent.includes('Was eine starke Antwort enthält')) ? 'OK' : 'FEHLER');
  await page.evaluate(() => { document.querySelectorAll('.rubrik-dim').forEach((d, i) => d.querySelectorAll('input')[i % 2 ? 2 : 1].checked = true); });
  await page.click('.fall-rubrik button[type=submit]'); await page.waitForTimeout(200);
  console.log('Ergebnis:', await page.evaluate(() => document.querySelector('h2').textContent), '| gespeichert:', JSON.stringify(await page.evaluate(() => window.VA.S.drills['fall_f-grundlagen'].map(x => x.selbst))));
  console.log('Musterelemente + Falle sichtbar:', await page.evaluate(() => document.body.textContent.includes('Was eine starke Antwort enthält') && document.body.textContent.includes('häufigste Falle')) ? 'OK' : 'FEHLER');
  // Coach-Fallbewertung
  await go('#/coach?fall=f-grundlagen');
  console.log('Coach-Fall-Titel:', await page.evaluate(() => document.querySelector('h1').textContent));
  await page.click('[data-act="rp-open"]'); await page.waitForTimeout(600);
  const r = reqs.find(x => x.system.includes('Modus: Fallbewertung'));
  console.log('Prompt: Rubrik + Zitatpflicht + Fehler/Ermessen + Antwort mitgeschickt:', r && /Stufe 1 \/ 2 \/ 3/.test(r.system) && /Zitiere/.test(r.system) && /vertretbaren Ermessensentscheidungen/.test(r.system) && /Identitätsproblem/.test(r.messages[0].content) ? 'OK' : 'FEHLER');
  console.log('Coach-Score gespeichert:', JSON.stringify(await page.evaluate(() => window.VA.S.drills['fall_f-grundlagen'].map(x => x.coach))), '(erwartet [15])');
  // Trainingsbilanz + Wochenrückblick
  await page.evaluate(() => { const S = window.VA.S; S.drills.ew_teuer = [{ ts: Date.now(), wert: 2 }]; S.drills['kt_spin'] = [{ ts: Date.now(), score: 4, n: 4 }]; S.drills.wb_laer = { stufe: 4, ts: Date.now() }; for (let i = 0; i < 3; i++) { const d = new Date(); d.setDate(d.getDate() - i); S.activity[d.toISOString().slice(0, 10)] = 1; } window.VA.save(); });
  await go('#/training');
  console.log('Trainingsbilanz Zeilen:', await page.evaluate(() => [...document.querySelectorAll('.week-table tbody tr')].map(tr => tr.textContent.replace(/\s+/g, ' ').trim()).join(' | ')));
  await go('#/');
  console.log('Wochenrückblick enthält Drill-Zeilen:', await page.evaluate(() => { const t = document.querySelector('.card.week'); return t && /Einwände geübt/.test(t.textContent) && /Fälle bearbeitet/.test(t.textContent); }) ? 'OK' : 'FEHLER');
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/faelle/f-verhandlung');
  console.log('Mobile Overflow Fall:', await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1) ? 'FEHLER' : 'OK');
  console.log('ERRORS:', errs.length ? errs : 'none');
  await b.close();
})();

const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE ' + m.text()); });
  const url = 'file://' + path.resolve(process.argv[2] || path.join(__dirname, '..', 'index.html'));
  await page.goto(url);
  // Einstieg beim ersten Start
  await page.goto(url + '#/'); await page.waitForTimeout(300);
  console.log('Onboarding sichtbar:', await page.evaluate(() => !!document.getElementById('onboarding')));
  await page.fill('#onboarding input[name=name]', 'Semih'); await page.fill('#onboarding input[name=plan]', 'Wenn ich morgens Kaffee koche, dann lerne ich 15 Minuten.'); await page.click('#onboarding button[type=submit]'); await page.waitForTimeout(300);
  console.log('Dashboard nach Einstieg:', await page.evaluate(() => document.querySelector('h1').textContent + ' | ' + document.querySelector('.eyebrow').textContent));
  const routes = ['#/', '#/kurs/grundlagen', '#/lektion/grundlagen/g1', '#/kurs/psychologie', '#/pruefung/grundlagen', '#/milliardaere', '#/milliardaere/musk', '#/mythen', '#/rollenspiel', '#/rollenspiel/preishammer', '#/training', '#/koerper', '#/checklisten', '#/kundenanalyse', '#/journal', '#/business', '#/coach', '#/einstellungen', '#/quellen', '#/abschluss', '#/zertifikat', '#/wiederholen'];
  for (const r of routes) {
    await page.evaluate(h => location.hash = h, r); await page.waitForTimeout(150);
    const txt = await page.$eval('#main', e => e.innerText.slice(0, 80).replace(/\n/g, ' '));
    const h = await page.$eval('#main', e => e.scrollHeight);
    console.log(r.padEnd(32), String(h).padStart(5), txt);
  }
  // Quiz durchspielen: Lektion g1 korrekt beantworten
  await page.evaluate(() => location.hash = '#/lektion/grundlagen/g1'); await page.waitForTimeout(150);
  // Vorab-Frage und Abruf durchlaufen, falls vorhanden
  if (await page.$('.vorfrage-form')) { await page.fill('.vorfrage-form textarea', 'Ich glaube, es geht darum, dass Vertrauen wichtiger ist als Argumente.'); await page.click('.vorfrage-form button[type=submit]'); await page.waitForTimeout(300); }
  console.log('Inhalt sichtbar:', await page.evaluate(() => !!document.querySelector('.lesson .sources')));
  if (await page.$('.abruf-form')) { await page.fill('.abruf-form textarea', 'Ich habe behalten, dass Menschen zuerst entscheiden, ob sie jemandem vertrauen, und erst dann, ob sie ihn für kompetent halten. Wärme vor Kompetenz. Außerdem, dass ein Nein kleiner ist als die Angst davor.'); await page.click('.abruf-form button[type=submit]'); await page.waitForTimeout(300); console.log('Kernpunkte sichtbar:', await page.evaluate(() => document.querySelectorAll('.kern li').length)); }
  console.log('Quiz frei:', await page.evaluate(() => !document.querySelector('#quiz-box').classList.contains('locked')));
  const n = await page.evaluate(() => { const l = window.KURSE[0].lektionen[0]; l.quiz.forEach((q, i) => document.querySelector(`input[name="q${i}"][value="${q.richtig}"]`).click()); return l.quiz.length; });
  await page.click('.quiz button[type=submit]'); await page.waitForTimeout(1200);
  console.log('Quiz bestanden:', await page.evaluate(() => JSON.parse(localStorage.getItem('verkaufsakademie_v1')).quiz.g1));
  // Bericht
  await page.fill('.report textarea', 'Ich habe gestern im Café den Barista gefragt, ob ich einen Rabatt bekomme, weil ich Stammkunde bin. Er hat gelacht und gesagt, das gehe nicht, aber er hat mir einen Keks dazugelegt. Vorher war mein Puls hoch, danach war ich fast euphorisch. Ich habe gelernt, dass das Nein viel kleiner ist als die Angst davor, und beim nächsten Mal frage ich direkter und schaue dabei in die Augen.');
  await page.click('.report button[type=submit]'); await page.waitForTimeout(400);
  console.log('Lektion done:', await page.evaluate(() => !!JSON.parse(localStorage.getItem('verkaufsakademie_v1')).lessonsDone.g1));
  // Mobile
  await page.setViewportSize({ width: 390, height: 800 }); await page.evaluate(() => location.hash = '#/'); await page.waitForTimeout(200);
  const over = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log('Mobile horizontal overflow:', over);
  await page.screenshot({ path: process.argv[3] || '/tmp/claude-0/-home-user-Klicker-Game/6c1793a3-4717-59b3-ad9c-261f1edbc4cd/scratchpad/mobile.png', fullPage: false });
  await page.setViewportSize({ width: 1280, height: 900 }); await page.evaluate(() => location.hash = '#/'); await page.waitForTimeout(200);
  await page.screenshot({ path: '/tmp/claude-0/-home-user-Klicker-Game/6c1793a3-4717-59b3-ad9c-261f1edbc4cd/scratchpad/desktop.png' });
  console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
  await browser.close();
})();

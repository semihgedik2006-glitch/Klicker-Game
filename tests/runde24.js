// Runde 5, Durchgang 20: Konzept-Kontraste erklären bei einer Verwechslung die Abgrenzung und zeigen das Fehlermuster
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(700); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  const rx = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  const kid = await page.evaluate(() => window.KONTRASTE.find(k => k.faelle.length >= 3).id);
  await go('#/kontraste/' + kid);
  const info = await page.evaluate(() => { const x = window.KONTRASTE.find(k => location.hash.endsWith(k.id)); return { n: x.faelle.length, richtig: x.faelle.map(f => f.richtig), begriffe: x.begriffe.map(b => b.name), wann: x.begriffe.map(b => b.wann) }; });
  // Erster Fall absichtlich falsch: einen anderen Begriff als den richtigen wählen
  const falsch0 = (info.richtig[0] + 1) % info.begriffe.length;
  await page.click(`[data-act="kt-wahl"][data-i="${falsch0}"]`); await page.waitForTimeout(300);
  const fb = await page.evaluate(() => ({ abg: (document.querySelector('.kt-drill .kt-abgrenzung') || {}).textContent || '', warn: !!document.querySelector('.kt-drill .callout.warn') }));
  ok('Falsche Wahl: Abgrenzung nennt beide Bedingungen', fb.warn && fb.abg.includes(info.begriffe[falsch0] + ' hätte gepasst, wenn: ' + info.wann[falsch0]) && fb.abg.includes(info.begriffe[info.richtig[0]] + ' passt, weil: ' + info.wann[info.richtig[0]]), fb.abg.slice(0, 160));
  await page.click('[data-act="kt-next"]'); await page.waitForTimeout(300);
  // Zweiter Fall richtig: keine Abgrenzung
  await page.click(`[data-act="kt-wahl"][data-i="${info.richtig[1]}"]`); await page.waitForTimeout(300);
  ok('Richtige Wahl: keine Abgrenzung', await page.evaluate(() => !document.querySelector('.kt-drill .kt-abgrenzung') && !!document.querySelector('.kt-drill .callout.practice')));
  await page.click('[data-act="kt-next"]'); await page.waitForTimeout(300);
  // Restliche Fälle: dieselbe Verwechslung wie im ersten Fall erzwingen, wo möglich
  for (let i = 2; i < info.n; i++) {
    const w = info.richtig[i] === info.richtig[0] ? falsch0 : (info.richtig[i] + 1) % info.begriffe.length;
    await page.click(`[data-act="kt-wahl"][data-i="${w}"]`); await page.waitForTimeout(250); await page.click('[data-act="kt-next"]'); await page.waitForTimeout(250);
  }
  const ende = await page.evaluate(() => ({ review: document.querySelectorAll('.kt-review li.bad .kt-abgrenzung').length, bad: document.querySelectorAll('.kt-review li.bad').length, muster: (document.querySelector('.kt-verwechslung') || {}).textContent || '', run: window.VA.S.drills['kt_' + location.hash.split('/').pop()].at(-1) }));
  ok('Auswertung: jede falsche Zuordnung mit Abgrenzung', ende.bad >= 1 && ende.review === ende.bad, JSON.stringify({ bad: ende.bad, review: ende.review }));
  ok('Durchlauf speichert die Fehlerpaare', Array.isArray(ende.run.fehler) && ende.run.fehler.length === ende.bad && ende.run.fehler.every(p => p.length === 2), JSON.stringify(ende.run));
  const sameTwice = ende.run.fehler.filter(p => p[0] === ende.run.fehler[0][0] && p[1] === ende.run.fehler[0][1]).length >= 2;
  ok('Muster-Hinweis erscheint genau dann, wenn eine Verwechslung mindestens zweimal vorkam', sameTwice ? /Dein Muster in diesem Durchgang/.test(ende.muster) && /× /.test(ende.muster) : ende.muster === '', JSON.stringify({ sameTwice, muster: ende.muster.slice(0, 80) }));
  // Liste: häufigste Verwechslung über alle Durchläufe (zwei Läufe mit demselben Paar)
  await page.evaluate((k) => { const S = window.VA.S; S.drills['kt_' + k] = [{ ts: Date.now() - 864e5, score: 1, n: 3, fehler: [[0, 1], [0, 1]] }, { ts: Date.now(), score: 2, n: 3, fehler: [[0, 1]] }]; window.VA.save(); }, kid);
  await go('#/kontraste');
  const liste = await page.evaluate((k) => { const c = document.querySelector(`[data-route="#/kontraste/${k}"]`); return c ? (c.querySelector('.kt-top') || {}).textContent || '' : 'keine Karte'; }, kid);
  ok('Liste nennt die häufigste Verwechslung mit Zahl', new RegExp('Verwechselst du oft: ' + rx(info.begriffe[0]) + ' statt ' + rx(info.begriffe[1]) + ' \\(3×\\)').test(liste), liste);
  // Alte Durchläufe ohne fehler-Feld bleiben darstellbar
  await page.evaluate((k) => { const S = window.VA.S; S.drills['kt_' + k] = [{ ts: Date.now(), score: 2, n: 3 }]; window.VA.save(); }, kid);
  await page.reload(); await page.waitForTimeout(500); await go('#/kontraste');
  ok('Alter Durchlauf ohne Fehlerpaare: Karte ohne Hinweis, kein Fehler', await page.evaluate((k) => { const c = document.querySelector(`[data-route="#/kontraste/${k}"]`); return !!c && !c.querySelector('.kt-top'); }, kid));
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/kontraste/' + kid);
  if (await page.$('[data-act="kt-restart"]')) { await page.click('[data-act="kt-restart"]'); await page.waitForTimeout(300); }
  await page.click(`[data-act="kt-wahl"][data-i="${falsch0}"]`); await page.waitForTimeout(300);
  ok('Mobile Overflow Kontrast mit Abgrenzung', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

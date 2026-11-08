// Runde 5, Durchgang 22: Kontraste, Beispiele und Szenarien werden erst auf ihren Seiten nachgeladen
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(900); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'T'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(500);
  const start = await page.evaluate(() => ({ kt: !!window.KONTRASTE, wb: !!window.BEISPIELE, sz: !!window.SZENARIEN, n: document.querySelectorAll('script[src]').length }));
  ok('Startseite lädt Kontraste, Beispiele, Szenarien nicht (19 Skripte)', !start.kt && !start.wb && !start.sz && start.n === 19, JSON.stringify(start));
  await go('#/kontraste');
  ok('Kontraste-Seite lädt nach und zeigt 14 Karten', await page.evaluate(() => !!window.KONTRASTE && document.querySelectorAll('.card.clickable').length === 14));
  await go('#/beispiele');
  ok('Beispiele-Seite lädt nach', await page.evaluate(() => !!window.BEISPIELE && document.querySelectorAll('.card').length >= 7));
  await page.reload(); await page.waitForTimeout(400);
  await go('#/rollenspiel');
  ok('Rollenspiele laden Szenarien und Offline-Bäume nach', await page.evaluate(() => !!window.SZENARIEN && window.SZENARIEN.every(s => s.offline) && document.querySelectorAll('.card.clickable').length === 8));
  // Lektion: Vertiefen-Kasten erscheint, nachdem die Daten nachgeladen wurden
  await page.reload(); await page.waitForTimeout(400);
  await page.evaluate(() => { const S = window.VA.S; for (const k of window.KURSE) { for (const l of k.lektionen) S.lessonsDone[l.id] = Date.now(); S.exams[k.id] = { passed: true, attempts: [], best: 90 }; } window.VA.save(); });
  await go('#/lektion/psychologie/p1');
  ok('Lektion zeigt den Vertiefen-Kasten nach dem Nachladen', await page.evaluate(() => !!document.querySelector('.vertiefen') && !!window.KONTRASTE && !!window.BEISPIELE));
  // Coach mit Szenario ohne vorherigen Besuch der Rollenspiele
  await page.reload(); await page.waitForTimeout(400);
  await go('#/coach?rp=preishammer');
  ok('Coach-Seite mit Szenario lädt es nach', await page.evaluate(() => !!window.SZENARIEN && /Rollenspiel: /.test((document.querySelector('h1') || {}).textContent || '')));
  // Wiedervorlage eines Kontrasts: Titel wird nachgeladen
  await page.reload(); await page.waitForTimeout(400);
  await page.evaluate(() => { const S = window.VA.S; S.drills.kt_spin = [{ ts: Date.now() - 10 * 864e5, score: 3, n: 4 }]; window.VA.save(); location.hash = '#/'; });
  await page.reload(); await page.waitForTimeout(1200);
  ok('Startseite mit fälligem Kontrast: Titel nachgeladen', await page.evaluate(() => !!window.KONTRASTE && !/>Kontrast</.test(document.querySelector('.tagesplan') ? document.querySelector('.tagesplan').innerHTML : '')));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

// Runde 5, Durchgang 31: Wiederholen-Karte und Prüfungsdurchlauf auf dem Handy
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(600); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; for (const l of window.KURSE[0].lektionen) S.lessonsDone[l.id] = Date.now() - 2 * 86400000; window.VA.save(); });
  await go('#/wiederholen');
  ok('Wiederholen: Kachel heißt „sicher gelernt“', await page.evaluate(() => [...document.querySelectorAll('.stats .lbl')].some(e => e.textContent === 'sicher gelernt')));
  await page.click('[data-act="srs-start"]'); await page.waitForTimeout(500);
  const eb = await page.evaluate(() => document.querySelector('.exam-q .eyebrow').textContent);
  ok('Karte: Kopfzeile nennt Lektionsnummer statt Modultitel', /^Lektion 1\.\d · /.test(eb) && !/Grundlagen: Was/.test(eb), eb);
  // Alle fälligen Karten durchgehen: keine darf horizontal überlaufen
  let bad = 0, n = 0;
  for (let i = 0; i < 20; i++) {
    if (!(await page.$('[data-act="srs-answer"]'))) break;
    n++; if (!(await noOverflow())) bad++;
    await page.click('[data-act="srs-answer"]'); await page.waitForTimeout(200);
    if (!(await noOverflow())) bad++;
    const nx = await page.$('[data-act="srs-next"]'); if (!nx) break; await nx.click(); await page.waitForTimeout(200);
  }
  ok(`Karten: kein horizontaler Overflow (${n} Karten, Frage und Auswertung)`, n >= 10 && bad === 0, 'Overflows: ' + bad);
  // Prüfung
  await go('#/pruefung/grundlagen'); await page.click('[data-act="exam-start"]'); await page.waitForTimeout(400);
  let bad2 = 0;
  for (let i = 0; i < 12; i++) { if (!(await noOverflow())) bad2++; await page.click('[data-act="exam-answer"]'); await page.waitForTimeout(200); }
  ok('Prüfung: 12 Fragen ohne Overflow, Ergebnisseite ohne Overflow', bad2 === 0 && (await noOverflow()) && /von 12/.test(await page.evaluate(() => document.querySelector('.hero h1').textContent)));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

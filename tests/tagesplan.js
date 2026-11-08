// Tagesplan mit Zeitangabe auf der Startseite, Nachlesen-Verweise in der Fallsammlung
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(600); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(400);
  // Neuer Nutzer: nur die erste Lektion steht an
  const p1 = await page.evaluate(() => (document.querySelector('.tagesplan') || {}).textContent);
  ok('Tagesplan neuer Nutzer: Lektion 1.1 mit 12 Minuten', /Heute etwa 12 Minuten/.test(p1) && /Lektion 1\.1/.test(p1) && /Kaffeepause/.test(p1), p1);
  // Mit fälligen Karten und Wiedervorlage
  await page.evaluate(() => { const S = window.VA.S; const g = window.KURSE[0]; S.lessonsDone[g.lektionen[0].id] = Date.now() - 2 * 864e5;  S.drills.ew_teuer = [{ ts: Date.now() - 2 * 864e5, wert: 2 }]; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(800);
  const p2 = await page.evaluate(() => { const t = document.querySelector('.tagesplan'); return { text: t.textContent, links: [...t.querySelectorAll('a')].map(a => a.getAttribute('href')) }; });
  ok('Tagesplan: 6 neue Karten (3 Min) + Wiedervorlage (3 Min) + Lektion 1.2 (10 Min) = 16', /Heute etwa 16 Minuten/.test(p2.text) && /6 Karten/.test(p2.text) && /1 Wiedervorlage \(3 Min\)/.test(p2.text) && /Lektion 1\.2 \(10 Min\)/.test(p2.text) && p2.links[0] === '#/wiederholen' && p2.links[1] === '#/einwaende/teuer', JSON.stringify(p2));
  // Lektion heute schon gelernt: Lernblock fällt weg
  await page.evaluate(() => { const S = window.VA.S; S.lessonsDone[window.KURSE[0].lektionen[1].id] = Date.now(); window.VA.save(); });
  await page.reload(); await page.waitForTimeout(800);
  const p3 = await page.evaluate(() => document.querySelector('.tagesplan').textContent);
  ok('Nach dem Lernen: nur Karten (jetzt 12) und Wiedervorlage, 9 Min', /Heute etwa 9 Minuten/.test(p3) && /12 Karten/.test(p3) && !/Lektion/.test(p3), p3);
  // Großer Tag: Hinweis mit den Karten anzufangen
  await page.evaluate(() => { const S = window.VA.S; for (let i = 0; i < 12; i++) S.drills['kt_x' + i] = [{ ts: Date.now() - 2 * 864e5, score: 3, n: 4 }]; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(800);
  ok('Über 30 Minuten: Rat, mit den Karten anzufangen', await page.evaluate(() => /Fang mit den Karten an/.test(document.querySelector('.tagesplan').textContent)));
  // Fälle: jeder Fall hat 2–3 Nachlesen-Verweise auf existierende Lektionen
  await go('#/faelle');
  const nl = await page.evaluate(() => window.FAELLE.map(f => ({ id: f.id, n: (f.nachlesen || []).length, bad: (f.nachlesen || []).filter(x => !window.VA.findLesson(x.lid)).length })));
  ok('10 Fälle mit je 2–3 gültigen Nachlesen-Verweisen', nl.length === 10 && nl.every(x => x.n >= 2 && x.n <= 3 && x.bad === 0), JSON.stringify(nl));
  // Kasten erscheint nach der Selbstbewertung
  await go('#/faelle/f-grundlagen');
  await page.fill('form.fall-form textarea', 'Jonas hat ein Identitätsproblem, kein Technikproblem. Erster kleiner Schritt mit Prozessmaß, nach 14 Tagen prüfen, Abbruchsignal benennen. '.repeat(4));
  await page.click('form.fall-form button[type="submit"]'); await page.waitForTimeout(500);
  await page.evaluate(() => { for (const d of window.FAELLE_RUBRIK) document.querySelector(`input[name="r-${d.id}"][value="2"]`).checked = true; });
  await page.click('form.fall-rubrik button[type="submit"]'); await page.waitForTimeout(600);
  const box = await page.evaluate(() => { const c = document.querySelector('.nachlesen'); return c ? [...c.querySelectorAll('a')].map(a => a.getAttribute('href') + '|' + a.textContent) : null; });
  ok('Nachlesen-Kasten nach der Bewertung mit Lektions-Links', !!box && box.length === 3 && box[0].startsWith('#/lektion/grundlagen/g1|Lektion 1.1'), JSON.stringify(box));
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/');
  ok('Mobile Overflow Startseite', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

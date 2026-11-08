// Runde 5, Durchgang 21: Barrierefreiheit der Drill-Formulare (Labels, Tastaturfokus) und Sicherheitsinvarianten
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(800); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'T'; const g = window.KURSE[0]; S.lessonsDone[g.lektionen[0].id] = Date.now(); window.VA.save(); });
  const unlabeled = async () => page.evaluate(() => [...document.querySelectorAll('input, textarea, select')].filter(el => el.type !== 'hidden' && !(el.labels && el.labels.length) && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.closest('label')).map(el => (el.name || el.id || el.className) + ':' + (el.placeholder || '').slice(0, 25)));
  const seiten = ['#/', '#/lektion/grundlagen/g1', '#/lektion/grundlagen/g2', '#/einwaende/teuer', '#/kontraste/label-mirror', '#/rollenspiel/preishammer', '#/faelle/f-grundlagen', '#/beispiele', '#/training', '#/journal', '#/kundenanalyse', '#/glossar', '#/quellen', '#/bibliothek', '#/einstellungen', '#/coach'];
  const offen = {};
  for (const s of seiten) { await go(s); const u = await unlabeled(); if (u.length) offen[s] = u; }
  ok('Jedes Eingabefeld hat ein Label oder aria-label (16 Seiten)', !Object.keys(offen).length, JSON.stringify(offen));
  // Einwand-Drill: Rubrik per Tastatur mit sichtbarem Fokus
  await go('#/einwaende/teuer');
  await page.fill('form.ew-form textarea', 'Verstehe, der Preis ist der größte Brocken. Zu teuer im Vergleich womit? Sie sagten vorhin sechs Stunden.'); await page.click('form.ew-form button[type="submit"]'); await page.waitForTimeout(400);
  await page.focus('.exam-q a[href^="#/lektion"]');
  const seq = []; for (let i = 0; i < 8; i++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { el: a.tagName + (a.name ? '[' + a.name + ']' : ''), focus: cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px' }; })); if (seq.at(-1).el === 'BUTTON') break; }
  ok('Rubrik: fünf Haken und der Knopf per Tab erreichbar, Fokus sichtbar', seq.length === 6 && seq.slice(0, 5).every(x => x.el === 'INPUT[k]' || x.el === 'INPUT[falle]') && seq.every(x => x.focus), JSON.stringify(seq));
  await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Space');
  ok('Leertaste hakt ab', await page.evaluate(() => document.querySelector('.ew-rubrik input[name="falle"]').checked));
  // Fall-Rubrik: Radios mit sichtbarem Fokus
  await go('#/faelle/f-grundlagen');
  await page.fill('form.fall-form textarea', 'Jonas hat ein Identitätsproblem, kein Technikproblem. Erster kleiner Schritt mit Prozessmaß, nach 14 Tagen prüfen, Abbruchsignal benennen. '.repeat(4));
  await page.click('form.fall-form button[type="submit"]'); await page.waitForTimeout(500);
  await page.focus('form.fall-rubrik input[type="radio"]');
  ok('Fall-Rubrik: Radio zeigt Fokus', await page.evaluate(() => { const r = document.querySelector('form.fall-rubrik input[type="radio"]'); const cs = getComputedStyle(r); return r === document.activeElement && (cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px' || getComputedStyle(r.closest('label')).borderColor !== 'rgba(0, 0, 0, 0)'); }));
  // Sicherheitsinvarianten
  const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8'); const app = fs.readFileSync(path.resolve(__dirname, '..', 'js/app.js'), 'utf8');
  const csp = (html.match(/Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
  ok('CSP: script-src nur self, connect-src nur self und api.anthropic.com, object-src none', /script-src 'self';/.test(csp) && /connect-src 'self' https:\/\/api\.anthropic\.com;/.test(csp) && /object-src 'none'/.test(csp) && !/unsafe-eval/.test(csp));
  ok('Export und Sitzungsspeicher lassen den Schlüssel weg', /JSON\.stringify\(\{ \.\.\.S, apiKey: '' \}, null, 2\)/.test(app) && /localStorage\.setItem\(KEY, JSON\.stringify\(\{ \.\.\.S, apiKey: '' \}\)\)/.test(app));
  // Fremde Eingaben werden escaped: Antwort mit Markup landet als Text im Drill
  await go('#/einwaende/budget');
  await page.fill('form.ew-form textarea', '<img src=x onerror="window.__xss=1"> Verstehe, das Budget ist dieses Jahr fest. Wann wird es geplant, und wer entscheidet darüber?'); await page.click('form.ew-form button[type="submit"]'); await page.waitForTimeout(400);
  ok('Markup in der eigenen Antwort bleibt Text', await page.evaluate(() => !window.__xss && !document.querySelector('.log-entry img') && document.querySelector('.log-entry .body').textContent.includes('<img')));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

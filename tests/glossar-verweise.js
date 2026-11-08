// Glossar-Verweise im Lektionstext, Glossar bleibt nachgeladen
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(900); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; for (const k of window.KURSE) for (const l of k.lektionen) if (l.vorfrage) S.vorfragen[l.id] = { text: 'Vorab-Antwort zum Testen, lang genug.', ts: Date.now() }; const g = window.KURSE[0]; for (const l of g.lektionen) S.lessonsDone[l.id] = Date.now(); S.exams[g.id] = { passed: true, attempts: [], best: 90 }; for (const l of window.KURSE[1].lektionen.slice(0, 3)) S.lessonsDone[l.id] = Date.now(); window.VA.save(); });
  await page.reload(); await page.waitForTimeout(400);
  ok('Startseite lädt das Glossar nicht', await page.evaluate(() => !window.GLOSSAR));
  await go('#/lektion/grundlagen/g1');
  const g1 = await page.evaluate(() => { const links = [...document.querySelectorAll('article.lesson a.gl')]; const titles = links.map(a => a.title.split(':')[0]); return { n: links.length, unique: new Set(titles).size === titles.length, inHead: !!document.querySelector('article.lesson :is(h1,h2,h3,h4) a.gl'), inQuiz: !!document.querySelector('.quiz a.gl, .exam-q a.gl'), hint: (document.querySelector('.gl-hint') || {}).textContent || '', href: links[0] && links[0].getAttribute('href'), titleOk: links.every(a => a.title.length > 30), loaded: !!window.GLOSSAR, sample: titles.slice(0, 6) }; });
  ok('Lektion 1.1: mindestens zwei Begriffe verlinkt, je einmal, nicht in Überschriften oder Quiz', g1.n >= 2 && g1.unique && !g1.inHead && !g1.inQuiz && g1.titleOk && g1.loaded && /#\/glossar\?q=/.test(g1.href || ''), JSON.stringify(g1));
  ok('Hinweiszeile unter der Überschrift', /Fachbegriffe in dieser Lektion/.test(g1.hint), g1.hint);
  await go('#/lektion/psychologie/p4');
  const p4 = await page.evaluate(() => [...document.querySelectorAll('article.lesson a.gl')].map(a => a.textContent));
  ok('Lektion 2.4 verlinkt Anker, Framing oder Verlustaversion', p4.some(t => /anker|framing|verlustaversion/i.test(t)), p4.join(', '));
  // Klick öffnet das Glossar gefiltert auf den Begriff
  const first = await page.evaluate(() => { const a = document.querySelector('article.lesson a.gl'); return { term: a.title.split(':')[0], text: a.textContent }; });
  await page.click('article.lesson a.gl'); await page.waitForTimeout(900);
  const gl = await page.evaluate(() => ({ hash: location.hash, q: (document.querySelector('#g-q') || {}).value, cards: document.querySelectorAll('.glossar > *').length, first: (document.querySelector('.glossar h3, .glossar strong, .glossar .b') || {}).textContent }));
  ok('Klick: Glossar mit Suchfeld auf den Begriff gesetzt, Treffer vorhanden', gl.hash === '#/glossar' && gl.q === first.term && gl.cards >= 1, JSON.stringify({ first, gl }));
  // Zurück zur Lektion: wieder verlinkt (kein doppeltes Annotieren derselben DOM-Stelle)
  await go('#/lektion/psychologie/p4');
  const again = await page.evaluate(() => ({ n: document.querySelectorAll('article.lesson a.gl').length, nested: !!document.querySelector('a.gl a.gl'), hints: document.querySelectorAll('.gl-hint').length }));
  ok('Erneuter Besuch: Verweise da, nicht verschachtelt, eine Hinweiszeile', again.n >= 1 && !again.nested && again.hints === 1, JSON.stringify(again));
  // Druck: keine Unterstreichung, kein Hinweis
  await page.emulateMedia({ media: 'print' });
  ok('Druckansicht blendet Hinweis aus', await page.evaluate(() => getComputedStyle(document.querySelector('.gl-hint')).display === 'none'));
  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/lektion/psychologie/p4');
  ok('Mobile Overflow Lektion', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

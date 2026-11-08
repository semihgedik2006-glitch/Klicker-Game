// Härtung (Import-Whitelist, Sitzungs-Schlüssel, Escaping) und Gesamt-Durchlauf aller Seiten
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(500); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  const KEY = 'verkaufsakademie_v1';
  // 1) localStorage mit Fremdschlüsseln und __proto__: nur bekannte Felder kommen durch
  await page.evaluate((KEY) => { localStorage.setItem(KEY, JSON.stringify({ name: 'Mallory', quiz: {}, fremd: 1, __proto__: { polluted: true } })); }, KEY);
  await page.reload(); await page.waitForTimeout(300);
  ok('Fremde Felder werden beim Laden verworfen', await page.evaluate(() => window.VA.S.name === 'Mallory' && !('fremd' in window.VA.S) && !window.VA.S.polluted && !({}).polluted));
  // 2) Import: gleiche Whitelist, Schlüssel bleibt der eigene
  await page.evaluate(() => { const S = window.VA.S; S.apiKey = 'sk-ant-test'; S.onboarded = true; window.VA.save(); });
  await go('#/einstellungen');
  await page.setInputFiles('#import-file', { name: 'x.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ quiz: { g1: { score: 5, total: 5, ts: 1, versuche: 1 } }, name: 'Import', apiKey: 'sk-ant-FREMD', bogus: 'x', __proto__: { polluted2: true } })) });
  await page.waitForTimeout(500);
  ok('Import übernimmt bekannte Felder, verwirft fremde, behält eigenen Schlüssel', await page.evaluate(() => { const S = window.VA.S; return S.name === 'Import' && S.quiz.g1 && !('bogus' in S) && S.apiKey === 'sk-ant-test' && !S.polluted2; }));
  // 3) Export enthält keinen Schlüssel
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="export"]')]);
  const exp = JSON.parse(require('fs').readFileSync(await dl.path(), 'utf8'));
  ok('Export ohne API-Schlüssel', exp.apiKey === '' && exp.name === 'Import');
  // 4) Schlüssel nur für die Sitzung
  await go('#/einstellungen');
  await page.fill('#settings [name="apiKey"]', 'sk-ant-session'); await page.check('#settings [name="keySession"]'); await page.click('#settings button[type="submit"]'); await page.waitForTimeout(300);
  const stor = await page.evaluate((KEY) => ({ ls: JSON.parse(localStorage.getItem(KEY)).apiKey, ss: sessionStorage.getItem(KEY + '_key'), mem: window.VA.S.apiKey }), KEY);
  ok('Sitzungsmodus: localStorage ohne Schlüssel, sessionStorage mit', stor.ls === '' && stor.ss === 'sk-ant-session' && stor.mem === 'sk-ant-session', JSON.stringify(stor));
  await page.reload(); await page.waitForTimeout(300);
  ok('Nach Reload im selben Tab bleibt der Schlüssel', await page.evaluate(() => window.VA.S.apiKey === 'sk-ant-session' && window.VA.S.keySession === true));
  const ctx2 = await b.newContext(); const p2 = await ctx2.newPage(); await p2.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await p2.evaluate(({ KEY, ls }) => { localStorage.setItem(KEY, ls); }, { KEY, ls: await page.evaluate((KEY) => localStorage.getItem(KEY), KEY) });
  await p2.reload(); await p2.waitForTimeout(300);
  ok('Neuer Tab ohne Sitzungsspeicher hat keinen Schlüssel', await p2.evaluate(() => window.VA.S.apiKey === ''));
  await ctx2.close();
  await go('#/einstellungen'); await page.uncheck('#settings [name="keySession"]'); await page.click('#settings button[type="submit"]'); await page.waitForTimeout(300);
  ok('Dauerhaft-Modus schreibt den Schlüssel wieder in localStorage', await page.evaluate((KEY) => JSON.parse(localStorage.getItem(KEY)).apiKey === 'sk-ant-session' && sessionStorage.getItem(KEY + '_key') === null, KEY));
  // 5) Escaping von Name und Coach-Text
  await page.evaluate(() => { const S = window.VA.S; S.name = '<img src=x onerror="window.__xss=1">'; window.VA.save(); location.hash = '#/x'; location.hash = '#/'; });
  await page.waitForTimeout(400);
  ok('Name wird auf der Startseite escaped', await page.evaluate(() => !window.__xss && !document.querySelector('main img[src="x"]')));
  ok('md() escaped HTML aus Coach-Antworten', await page.evaluate(() => { const h = window.VA.md('Hallo <img src=x onerror="window.__xss2=1"> **fett**'); return /&lt;img/.test(h) && /<strong>fett<\/strong>/.test(h) && !/<img/.test(h); }));
  // 6) Gesamt-Durchlauf aller Seiten auf zwei Breiten
  await page.evaluate(() => { const S = window.VA.S; S.name = 'T'; for (const k of window.KURSE) { S.exams[k.id] = { passed: true, attempts: [], best: 100 }; for (const l of k.lektionen) S.lessonsDone[l.id] = Date.now(); } window.VA.save(); });
  const routes = ['#/', '#/kurs/grundlagen', '#/lektion/grundlagen/g1', '#/pruefung/grundlagen', '#/abschluss', '#/zertifikat', '#/milliardaere', '#/mythen', '#/rollenspiel', '#/rollenspiel/preishammer', '#/faelle', '#/kontraste', '#/kontraste/anker-decoy', '#/beispiele', '#/beispiele/jtbd', '#/einwaende', '#/einwaende/teuer', '#/einstufung', '#/training', '#/koerper', '#/checklisten', '#/kundenanalyse', '#/wiederholen', '#/glossar', '#/quellen', '#/journal', '#/einstellungen', '#/coach', '#/business', '#/rueckschau', '#/spielbuch'];
  for (const vp of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(vp); const bad = [];
    for (const r of routes) { await page.evaluate(h => { location.hash = h; }, r); await page.waitForTimeout(r === '#/quellen' || r === '#/glossar' ? 1200 : 300); const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); const head = await page.evaluate(() => !!document.querySelector('main h1, main h2')); if (over > 1 || !head) bad.push(r + ' overflow=' + over); }
    ok(`${routes.length} Seiten bei ${vp.width}px ohne Überlauf und mit Überschrift`, bad.length === 0, bad.join(', '));
  }
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

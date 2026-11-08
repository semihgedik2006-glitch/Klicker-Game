const { chromium } = require('playwright'); const path = require('path');
const URL_ = 'https://testprojekt.supabase.co';
const nutzer = {}, tokens = {}, zeilen = {}; let n = 0;
const zeit = () => new Date(Date.now() + (n++)).toISOString().replace('Z', '123+00:00');
const sitzung = (u) => { const t = 'tok' + (n++); tokens[t] = u.id; return { access_token: t, refresh_token: 'r' + t, expires_in: 3600, user: { id: u.id, email: u.email } }; };
async function server(route) {
  const req = route.request(); const u = new URL(req.url()); const body = req.postData() ? JSON.parse(req.postData()) : null;
  const json = (status, d) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(d), headers: { 'access-control-allow-origin': '*' } });
  if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
  if (req.headers().apikey !== 'anon-test-schluessel-1234567890') return json(401, { message: 'no apikey' });
  const p = u.pathname;
  if (p === '/auth/v1/signup') { if (nutzer[body.email]) return json(422, { error_code: 'user_already_exists' }); const x = nutzer[body.email] = { id: 'uid-' + (n++), email: body.email, pw: body.password }; return json(200, sitzung(x)); }
  if (p === '/auth/v1/token') {
    if (u.searchParams.get('grant_type') === 'password') { const x = nutzer[body.email]; if (!x || x.pw !== body.password) return json(400, { error_code: 'invalid_credentials' }); return json(200, sitzung(x)); }
    const uid = tokens[body.refresh_token.slice(1)]; const x = Object.values(nutzer).find(v => v.id === uid); return x ? json(200, sitzung(x)) : json(400, { error_code: 'refresh_token_not_found' });
  }
  if (p === '/auth/v1/logout') return route.fulfill({ status: 204 });
  const uid = tokens[(req.headers().authorization || '').replace('Bearer ', '')];
  if (!uid) return json(401, { message: 'JWT expired' });
  if (p === '/rest/v1/fortschritt') {
    const ziel = (u.searchParams.get('user_id') || '').replace('eq.', '');
    if (req.method() === 'GET') return json(200, ziel === uid && zeilen[uid] ? [zeilen[uid]] : []);
    if (req.method() === 'POST') { if (body.user_id !== uid) return json(403, {}); if (zeilen[uid]) return json(409, { code: '23505' }); zeilen[uid] = { ...body, aktualisiert: zeit() }; return json(201, [zeilen[uid]]); }
    if (req.method() === 'PATCH') { const st = (u.searchParams.get('aktualisiert') || '').replace('eq.', ''); const r = zeilen[uid]; if (ziel !== uid || !r || r.aktualisiert !== st) return json(200, []); Object.assign(r, body, { aktualisiert: zeit() }); return json(200, [r]); }
  }
  if (p === '/rest/v1/rpc/konto_loeschen') { delete zeilen[uid]; const e = Object.keys(nutzer).find(k => nutzer[k].id === uid); delete nutzer[e]; return route.fulfill({ status: 204 }); }
  return json(404, { message: 'unbekannt ' + p });
}
(async () => {
  const b = await chromium.launch();
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  const errs = [];
  async function geraet(vp = { width: 1280, height: 900 }) {
    const ctx = await b.newContext({ viewport: vp });
    await ctx.addInitScript((url) => { Object.defineProperty(window, 'KONTO_CONFIG', { value: { url, anonKey: 'anon-test-schluessel-1234567890' }, writable: false }); }, URL_);
    await ctx.route(URL_ + '/**', server);
    const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
    await page.goto('file://' + path.resolve(__dirname, '..', 'index.html') + '#/einstellungen'); await page.waitForTimeout(400);
    return page;
  }
  const toast = async (p) => p.evaluate(() => (document.getElementById('toast') || {}).textContent || '');

  const A = await geraet();
  await A.evaluate(() => { const S = window.VA.S; S.name = 'Semih'; S.lessonsDone.g1 = Date.now(); S.activity['2026-11-01'] = 3; S.apiKey = 'sk-ant-geheim-123'; window.VA.save(); window.VA.navigate(); });
  ok('Konto-Karte zeigt Anmeldung', !!(await A.$('#konto-form [name=email]')));
  await A.fill('#konto-form [name=email]', 'semih@example.com'); await A.fill('#konto-form [name=pw]', 'kurz');
  await A.click('#konto-form [value=neu]'); await A.waitForTimeout(300);
  ok('Zu kurzes Passwort wird abgelehnt', Object.keys(nutzer).length === 0);
  await A.fill('#konto-form [name=pw]', 'richtig-langes-pw'); await A.click('#konto-form [value=neu]'); await A.waitForTimeout(1500);
  const uid = nutzer['semih@example.com'] && nutzer['semih@example.com'].id; const r = zeilen[uid];
  ok('Registrierung legt Kontostand an', r && r.daten.name === 'Semih' && r.daten.lessonsDone.g1);
  ok('Schlüssel liegt nur verschlüsselt auf dem Server', r && r.schluessel && !r.schluessel.includes('sk-ant') && !JSON.stringify(r.daten).includes('sk-ant'), r && r.schluessel && r.schluessel.slice(0, 20));
  ok('Angemeldet-Ansicht mit Status', /semih@example\.com/.test(await A.textContent('.konto')) && /Synchron/.test(await A.textContent('#konto-status')));
  await A.screenshot({ path: 'konto-angemeldet.png', fullPage: false });

  const B = await geraet({ width: 390, height: 844 });
  await B.screenshot({ path: 'konto-anmelden-mobil.png' });
  await B.fill('#konto-form [name=email]', 'semih@example.com'); await B.fill('#konto-form [name=pw]', 'falsches-passwort');
  await B.click('#konto-form [value=anmelden]'); await B.waitForTimeout(400);
  ok('Falsches Passwort meldet Fehler', /falsch/.test(await toast(B)));
  await B.fill('#konto-form [name=pw]', 'richtig-langes-pw'); await B.click('#konto-form [value=anmelden]'); await B.waitForTimeout(1500);
  const sB = await B.evaluate(() => ({ name: window.VA.S.name, g1: !!window.VA.S.lessonsDone.g1, key: window.VA.S.apiKey }));
  ok('Zweites Gerät übernimmt Fortschritt', sB.name === 'Semih' && sB.g1, JSON.stringify(sB));
  ok('Zweites Gerät hat den API-Schlüssel', sB.key === 'sk-ant-geheim-123');

  await B.evaluate(() => { window.VA.S.lessonsDone.g2 = Date.now(); window.VA.save(); }); await B.waitForTimeout(2200);
  ok('Änderung wird automatisch hochgeladen', !!zeilen[uid].daten.lessonsDone.g2);
  await A.reload(); await A.waitForTimeout(1200);
  ok('Erstes Gerät holt die Änderung beim Öffnen', await A.evaluate(() => !!window.VA.S.lessonsDone.g2));

  await A.evaluate(() => { window.VA.S.name = 'Neu'; window.VA.S.apiKey = 'sk-ant-neu-456'; window.VA.save(); }); await A.waitForTimeout(2200);
  await B.evaluate(() => document.dispatchEvent(new Event('visibilitychange'))); await B.waitForTimeout(1000);
  ok('Neuer Schlüssel kommt auf dem anderen Gerät an', await B.evaluate(() => window.VA.S.apiKey === 'sk-ant-neu-456' && window.VA.S.name === 'Neu'));

  await A.evaluate(() => { window.VA.S.lessonsDone.a1 = 1; window.Konto.geaendert = () => {}; });
  await A.evaluate(() => { localStorage.setItem('verkaufsakademie_konto', JSON.stringify({ ...JSON.parse(localStorage.getItem('verkaufsakademie_konto')), dirty: true })); window.VA.save(); });
  await B.evaluate(() => { window.VA.S.lessonsDone.b1 = 1; window.VA.save(); }); await B.waitForTimeout(2200);
  await A.reload(); await A.waitForTimeout(1200);
  const modalDa = await A.$('#konto-laden');
  ok('Gleichzeitige Änderungen fragen nach', !!modalDa);
  if (modalDa) { await A.click('#konto-laden'); await A.waitForTimeout(500); }
  ok('Kontostand laden übernimmt den Stand des anderen Geräts', await A.evaluate(() => !!window.VA.S.lessonsDone.b1));

  await B.evaluate(() => { location.hash = '#/x'; location.hash = '#/einstellungen'; }); await B.waitForTimeout(300);
  await B.click('[data-act=konto-ab]'); await B.waitForTimeout(400);
  ok('Abmelden behält den lokalen Stand', await B.evaluate(() => !!window.VA.S.lessonsDone.b1 && !!document.querySelector('#konto-form')));

  const C = await geraet();
  await C.fill('#konto-form [name=email]', 'semih@example.com'); await C.fill('#konto-form [name=pw]', 'richtig-langes-pw');
  await C.click('#konto-form [value=neu]'); await C.waitForTimeout(500);
  ok('Doppelte Registrierung meldet vorhandenes Konto', /schon ein Konto/.test(await toast(C)));

  await A.evaluate(() => { location.hash = '#/x'; location.hash = '#/einstellungen'; }); await A.waitForTimeout(300);
  await A.click('[data-act=konto-loeschen]'); await A.click('#konto-weg'); await A.waitForTimeout(600);
  ok('Konto löschen entfernt Serverdaten', !zeilen[uid] && !nutzer['semih@example.com']);

  ok('Keine Seitenfehler', errs.length === 0, errs.join(' | '));
  await b.close();
})();

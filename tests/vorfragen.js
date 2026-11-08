// Vorfragen mit Antwort der Lektion, Selbsterklärungen als Warum/Wie-Fragen. node tests/vorfragen.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
global.window = global;
fs.readdirSync('js/data/kurse').sort().forEach(f => require(path.resolve('js/data/kurse', f)));
let fails = 0; const check = (ok, msg) => { console.log((ok ? 'OK  ' : 'FAIL') + ' ' + msg); if (!ok) fails++; };
const all = []; window.KURSE.forEach(k => k.lektionen.forEach(l => all.push(l)));
all.forEach(l => {
  check(typeof l.vorfrageAntwort === 'string' && l.vorfrageAntwort.length >= 80 && l.vorfrageAntwort.length <= 420, `${l.id}: vorfrageAntwort vorhanden (${(l.vorfrageAntwort || '').length} Zeichen)`);
  check(/\?/.test(l.vorfrage) && !/^(Ist|Sollte|Kann|Hast|Gibt|Glaubst) /.test(l.vorfrage), `${l.id}: Vorfrage ist eine offene Frage`);
  check(l.selbsterklaerung.length >= 3 && l.selbsterklaerung.every(s => /^(Warum|Was|Woran|Wie)\b/.test(s)), `${l.id}: ${l.selbsterklaerung.length} Selbsterklärungen, alle Warum/Was/Woran/Wie`);
});
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/user/Klicker-Game/index.html');
  await page.evaluate(() => { const S = window.VA.S, now = Date.now(); S.onboarded = true; S.name = 'Test'; S.vorfragen.g1 = { text: 'Weil sie lauter sind', ts: now }; S.abruf.g1 = { text: 'Pink 40 Prozent, Ambiverte verkaufen am meisten, Überzeugen nützt dem Kunden bei voller Information, Damasio Emotion entscheidet.', ts: now }; window.VA.save(); });
  await page.evaluate(() => { location.hash = '#/lektion/grundlagen/g1'; }); await page.waitForTimeout(800);
  const t = await page.evaluate(() => { const e = document.querySelector('.vorfrage-check'); return e ? e.textContent : ''; });
  check(t.includes('Weil sie lauter sind') && t.includes('Antwort der Lektion') && t.includes('Grant (2013)'), 'Nach dem Abruf stehen eigene Vorab-Antwort und Antwort der Lektion nebeneinander');
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(ov === 0, 'kein horizontaler Überlauf auf 390 px');
  check(errs.length === 0, 'keine JS-Fehler ' + errs.join(' | '));
  await page.evaluate(() => document.querySelector('.vorfrage-check').scrollIntoView());
  await page.screenshot({ path: '/mnt/project-files/verkaufs-app/d39-vorfrage-antwort-mobil.png' });
  console.log(fails ? `${fails} FEHLER` : 'alle Checks bestanden'); await b.close(); process.exit(fails ? 1 : 0);
})();

// Runde 5, Durchgang 19: Rollenspiele offline mit einheitlichem Maßstab, Bilanz und Pflichtkriterien-Check
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(900); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await go('#/rollenspiel/preishammer');
  // Besten Pfad im Baum finden (nur „good“-Optionen bis zu einem Ende, das mit „Bestanden“ beginnt) und ihn klicken
  const pfad = await page.evaluate(() => { const s = window.SZENARIEN.find(x => x.id === 'preishammer'); const K = s.offline.knoten; const dfs = (k, acc) => { const n = K[k]; if (n.ende) return /^Bestanden/.test(n.fazit) ? acc : null; for (let i = 0; i < n.optionen.length; i++) { const r = dfs(n.optionen[i].next, acc.concat([{ k, text: n.optionen[i].text }])); if (r) return r; } return null; }; return dfs(s.offline.start, []); });
  ok('Bestanden-Pfad im Baum vorhanden', !!pfad && pfad.length >= 3, JSON.stringify((pfad || []).length));
  await page.click('[data-act="rp-start"]'); await page.waitForTimeout(300);
  for (const step of pfad) { await page.click(`#rp-box .options button:has-text("${step.text.slice(0, 40).replace(/"/g, '')}")`); await page.waitForTimeout(250); }
  const ende = await page.evaluate(() => ({ fazit: (document.querySelector('.rp-fazit') || {}).textContent || '', tag: (document.querySelector('.rp-fazit .tag') || {}).textContent, bilanz: (document.querySelector('.rp-bilanz') || {}).textContent || '', form: !!document.querySelector('form.rp-pflicht'), n: document.querySelectorAll('form.rp-pflicht input').length, run: window.VA.S.drills.rp_preishammer.at(-1) }));
  ok('Ende: Fazit mit Tag „bestanden“, Bilanz und Pflichtkriterien-Formular', ende.tag === 'bestanden' && /Entscheidungen: \d+ stark/.test(ende.bilanz) && ende.form && ende.n >= 2 && ende.run.n === pfad.length && ende.run.score === pfad.length, JSON.stringify({ tag: ende.tag, bilanz: ende.bilanz.slice(0, 60), n: ende.n, run: ende.run }));
  // Pflichtkriterien: eines abhaken, speichern
  await page.check('form.rp-pflicht input[value="0"]'); await page.click('form.rp-pflicht button[type="submit"]'); await page.waitForTimeout(400);
  const nach = await page.evaluate(() => ({ pflicht: window.VA.S.drills.rp_preishammer.at(-1).pflicht, form: !!document.querySelector('form.rp-pflicht'), text: document.querySelector('#rp-box').textContent }));
  ok('Pflichtkriterien gespeichert, Formular weg, fehlende benannt', JSON.stringify(nach.pflicht) === '[0]' && !nach.form && /Pflichtkriterien laut deiner Prüfung: 1 von \d+\. Fehlend:/.test(nach.text), JSON.stringify(nach.pflicht));
  // Liste und Log mit Status
  await page.reload(); await page.waitForTimeout(600); await go('#/rollenspiel');
  const liste = await page.evaluate(() => ({ tags: [...document.querySelectorAll('.card.clickable .tag.green')].map(t => t.textContent), alt: document.body.textContent.includes('beste Wertung') }));
  ok('Liste zeigt „bestanden · 1×“ statt roher Zahl', liste.tags.some(t => /^bestanden · 1×$/.test(t)) && !liste.alt, JSON.stringify(liste));
  await go('#/rollenspiel/preishammer');
  const log = await page.evaluate(() => (document.querySelector('.log-entry.ok .meta') || {}).textContent || '');
  ok('Durchlauf-Log: Status, Entscheidungen und Pflichtkriterien', /bestanden/.test(log) && /von \d+ Entscheidungen stark/.test(log) && /Pflichtkriterien 1 von/.test(log), log);
  // Einheitlicher Maßstab: Coach-Lauf mit 45/60 aber Ethik nicht bestanden zählt nicht, Teilweise-Fazit offline = 1
  await page.evaluate(() => { const S = window.VA.S; S.drills.rp_partner = [{ ts: Date.now(), art: 'Live mit Coach', score: 45, fazit: 'Coach-Bewertung 45/60 · Ethik nicht bestanden' }, { ts: Date.now(), art: 'Offline', score: 2, n: 4, fazit: 'Teilweise. Der gemeinsame Termin war die richtige Idee.' }]; S.drills.rp_gehalt = [{ ts: Date.now(), art: 'Live mit Coach', score: 50, fazit: 'Coach-Bewertung 50/60 · Ethik bestanden' }]; S.drills.rp_skeptiker = [{ ts: Date.now(), art: 'Offline', score: 4, n: 5, fazit: 'Fast. Du hattest den Schmerz aufgedeckt. Teilweise bestanden. Wiederhole.' }]; window.VA.save(); });
  await go('#/rollenspiel');
  const tags = await page.evaluate(() => [...document.querySelectorAll('.card.clickable')].map(c => ({ t: c.querySelector('h3').textContent, s: [...c.querySelectorAll('.tag')].map(x => x.textContent).join('|') })));
  const partner = tags.find(x => /Partner/i.test(x.t)) || {}, gehalt = tags.find(x => /Gehalt/i.test(x.t)) || {}, skeptiker = tags.find(x => /Skeptiker/i.test(x.t)) || {};
  ok('Partner: bestes Ergebnis „teilweise“ (Ethik-Durchfall zählt nicht), Gehalt: bestanden, „Teilweise bestanden“ mitten im Fazit zählt als teilweise', /teilweise · 2×/.test(partner.s || '') && /bestanden · 1×/.test(gehalt.s || '') && !/\|bestanden/.test(partner.s || '') && /teilweise · 1×/.test(skeptiker.s || ''), JSON.stringify({ partner, gehalt, skeptiker }));
  // Trainingsbilanz zählt bestandene Rollenspiele (vorher immer 0)
  await go('#/training');
  const tb = await page.evaluate(() => { const row = [...document.querySelectorAll('tr')].find(r => /Rollenspiele/.test(r.textContent)); return row ? row.textContent : document.body.textContent.match(/Rollenspiele[^\n]{0,80}/)?.[0] || ''; });
  ok('Trainingsbilanz: 5 Rollenspiele, 40 % getroffen (vorher immer 0 %)', /Rollenspiele.*40 %/.test(tb), tb.slice(0, 120));
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/rollenspiel/preishammer');
  ok('Mobile Overflow Rollenspiel', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

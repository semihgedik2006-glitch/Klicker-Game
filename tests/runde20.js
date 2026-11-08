// Runde 5, Durchgang 16: Szenarien nachgeladen, Export-Erinnerung nach bestandener Prüfung, Mythen-Quellen vollständig
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  const go = async h => { await page.evaluate(hh => { location.hash = hh; }, h); await page.waitForTimeout(700); };
  const ok = (name, cond, extra = '') => console.log(name + ':', cond ? 'OK' : 'FEHLER', extra);
  await page.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'Test'; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(400);
  ok('Start lädt die Offline-Szenarien nicht', await page.evaluate(() => !window.SZENARIEN_OFFLINE && document.querySelectorAll('script[src*="szenarien-offline"]').length === 0));
  await go('#/rollenspiel');
  const rp = await page.evaluate(() => ({ loaded: !!window.SZENARIEN_OFFLINE, offline: window.SZENARIEN.filter(s => s.offline).length, total: window.SZENARIEN.length, cards: document.querySelectorAll('.card.clickable').length, lead: document.querySelector('.lead').textContent }));
  ok('Rollenspiel-Übersicht: Szenarien nachgeladen, alle offline spielbar', rp.loaded && rp.offline === rp.total && rp.cards === rp.total && /Alle spielst du offline/.test(rp.lead), JSON.stringify(rp));
  await go('#/rollenspiel/einkaeufer');
  ok('Nachgeladenes Szenario hat den Offline-Knopf', await page.evaluate(() => !!document.querySelector('[data-act="rp-start"][data-sid="einkaeufer"]')));
  await page.click('[data-act="rp-start"]'); await page.waitForTimeout(300);
  ok('Offline-Baum startet', await page.evaluate(() => document.querySelectorAll('[data-act="rp-choose"]').length >= 2));
  // Direktaufruf eines Szenarios in frischem Tab (ohne vorherige Übersicht)
  const ctx2 = await b.newContext(); const p2 = await ctx2.newPage(); await p2.goto('file://' + path.resolve(__dirname, '..', 'index.html'));
  await p2.evaluate(() => { const S = window.VA.S; S.onboarded = true; S.name = 'T'; window.VA.save(); location.hash = '#/rollenspiel/grossdeal'; }); await p2.waitForTimeout(900);
  ok('Direktaufruf: Szenario nach dem Nachladen vollständig gerendert', await p2.evaluate(() => !!document.querySelector('[data-act="rp-start"][data-sid="grossdeal"]') && /Pflichtkriterien/.test(document.body.textContent)));
  await ctx2.close();
  // Export-Erinnerung: Prüfung bestehen
  await page.evaluate(() => { const S = window.VA.S; const g = window.KURSE[0]; for (const l of g.lektionen) { S.lessonsDone[l.id] = Date.now(); S.quiz[l.id] = { score: 5, total: 5, ts: Date.now(), versuche: 1 }; } S.lastExport = 0; window.VA.save(); });
  await page.reload(); await page.waitForTimeout(300); await go('#/pruefung/grundlagen');
  const startBtn = await page.$('[data-act="exam-start"]'); if (startBtn) { await startBtn.click(); await page.waitForTimeout(300); }
  for (let i = 0; i < 40; i++) { const r = await page.evaluate(() => { const h = document.querySelector('.exam-q h2'); if (!h) return false; const q = window.KURSE.flatMap(k => k.lektionen).flatMap(l => l.quiz).find(q => q.frage === h.textContent); const btns = [...document.querySelectorAll('[data-act="exam-answer"]')]; const right = btns.find(b => Number(b.dataset.oi) === q.richtig) || btns[0]; right.click(); return true; }); if (!r) break; await page.waitForTimeout(150); }
  const res = await page.evaluate(() => ({ ex: window.VA.S.exams.grundlagen, hinweis: !!document.querySelector('.export-hinweis'), text: (document.querySelector('.export-hinweis') || {}).textContent }));
  console.log('Prüfungsergebnis:', JSON.stringify(res.ex && { passed: res.ex.passed, best: res.ex.best }));
  if (res.ex && res.ex.passed) ok('Nach bestandener Prüfung: Sicherungshinweis mit Export-Knopf', res.hinweis && /Noch nie gesichert/.test(res.text));
  else ok('Nach nicht bestandener Prüfung: kein Sicherungshinweis', !res.hinweis);
  // Kurz nach einem Export kein Hinweis mehr (Wert setzen, Ergebnisseite neu prüfen über Abschluss-Simulation unnötig): Logik direkt prüfen
  ok('Export-Handler setzt lastExport', await page.evaluate(() => { const before = window.VA.S.lastExport; const a = document.createElement('button'); a.dataset.act = 'export'; document.body.appendChild(a); const orig = HTMLAnchorElement.prototype.click; HTMLAnchorElement.prototype.click = function () {}; a.click(); HTMLAnchorElement.prototype.click = orig; a.remove(); return window.VA.S.lastExport > before; }));
  // Mythen: jede Aussage hat Quelle und gültigen Status
  const my = await page.evaluate(() => { let z = 0, bad = 0; for (const p of window.MILLIARDAERE) { for (const q of p.zitate || []) { z++; if (!q.quelle || q.quelle.length < 10 || !['primaer', 'buch', 'zugeschrieben'].includes(q.status)) bad++; } for (const m of p.mythen || []) { z++; if (!m.wahrheit || m.wahrheit.length < 10) bad++; } } return { z, bad }; });
  ok('Mythen-Check: alle Aussagen mit Quelle oder Erklärung', my.z >= 80 && my.bad === 0, JSON.stringify(my));
  await page.setViewportSize({ width: 390, height: 844 }); await go('#/rollenspiel');
  ok('Mobile Overflow Rollenspiele', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  console.log('ERRORS:', errs.length ? errs.join(' | ') : 'none');
  await b.close();
})();

// Jede im Lektionstext zitierte Studie (Autor + Jahr) steht in der Quellenliste der Lektion. node tests/daten-zitate-quellen.js
const fs = require('fs'), path = require('path');
global.window = global;
fs.readdirSync('js/data/kurse').sort().forEach(f => require(path.resolve('js/data/kurse', f)));
const strip = s => String(s).replace(/<[^>]+>/g, ' ');
const norm = s => s.toLowerCase().replace(/[^a-zäöüß0-9]+/g, ' ').trim();
const generisch = new Set(['studie', 'meta', 'analyse', 'forschung', 'experiment', 'lektion', 'ergebnis', 'ergebnisse', 'urteil', 'zahlen', 'referenzen', 'mund', 'sympathie', 'kostet', 'psychologen', 'buch', 'sein', 'seine', 'das', 'die', 'der', 'eine', 'bei', 'und', 'von', 'nach', 'laut', 'glücksrad', 'glücksrad experiment', 'talks', 'ted', 'menschen', 'lügen', 'säule', 'kompetenz', 'selbstbestimmungstheorie', 'offiziersbewertungen', 'gehorsamsexperimente', 'cola', 'ambivert', 'proxemik']);
// Keine Studienzitate: Gerichtsurteil, Firmenübernahme
const keinZitat = [/Das Urteil \(2003\)/, /Gartner \(2017\)/];
const re = /([A-ZÄÖÜ][\wäöüß'-]+(?:,? (?:und|&) [A-ZÄÖÜ][\wäöüß'-]+|,? [A-ZÄÖÜ][\wäöüß'-]+(?:,| und| &)? ?[A-ZÄÖÜ]?[\wäöüß'-]*| et al\.)*)\s*\((\d{4}[a-z]?(?:[,;/] ?\d{4})*)[^)]*\)/g;
let total = 0; const offen = [];
window.KURSE.forEach(k => k.lektionen.forEach(l => {
  const text = strip([l.inhalt, ...(l.kernpunkte || []), ...(l.lernziele || []), ...l.quiz.map(q => [q.frage, q.erklaerung, ...(q.warumFalsch || [])].join(' '))].join(' '));
  const quellen = norm(strip((l.quellen || []).join(' ')));
  let m; const seen = new Set();
  while ((m = re.exec(text))) {
    if (keinZitat.some(r => r.test(m[0]))) continue;
    const names = (m[1].match(/[A-ZÄÖÜ][\wäöüß'-]+/g) || []).map(x => norm(x)).filter(x => x.length >= 3 && !generisch.has(x));
    if (!names.length) continue;
    const years = m[2].match(/\d{4}/g);
    years.forEach(y => {
      const key = names.join('+') + ' ' + y; if (seen.has(key)) return; seen.add(key); total++;
      const autor = names.some(n => quellen.includes(n) || (n.endsWith('s') && quellen.includes(n.slice(0, -1))));
      if (!(autor && quellen.includes(y))) offen.push(`${l.id}: ${m[0].slice(0, 60)} (${autor ? 'Jahr' : 'Autor'} fehlt in quellen)`);
    });
  }
}));
console.log(`${total} Zitate geprüft`);
offen.forEach(o => console.log('FAIL ' + o));
console.log(offen.length ? `${offen.length} FEHLER` : 'alle Zitate haben eine Quelle');
process.exit(offen.length ? 1 : 0);

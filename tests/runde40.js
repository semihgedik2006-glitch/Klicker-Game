// Durchgang 41: Kontraste und Beispiele passen zu ihren Lektionen. node tests/runde40.js
const fs = require('fs'), path = require('path');
global.window = global;
fs.readdirSync('js/data/kurse').sort().forEach(f => require(path.resolve('js/data/kurse', f)));
require(path.resolve('js/data/kontraste.js')); require(path.resolve('js/data/beispiele.js'));
const L = {}; window.KURSE.forEach(k => k.lektionen.forEach(l => L[l.id] = (l.inhalt + ' ' + l.kernpunkte.join(' ')).replace(/<[^>]+>/g, ' ').toLowerCase()));
let fails = 0; const check = (ok, msg) => { console.log((ok ? 'OK  ' : 'FAIL') + ' ' + msg); if (!ok) fails++; };
const stemWord = w => w.replace(/(fragen|frage|streben)$/, '').replace(/(es|en|er|s|e)$/, '');
const stem = s => s.toLowerCase().replace(/\s*\([^)]*\)$/, '').replace(/[()]/g, ' ').replace(/[-–]/g, ' ').split(/\s+/).filter(Boolean).map(stemWord).join(' ').trim();
// Begriffe, die der Kontrast bewusst über die Lektion hinaus einführt (eigene Erklärung im Kontrast)
const extra = new Set(['Vorwand', 'Reaktanz', 'Commitment', 'Fluch des Wissens']); // Commitment (p1) und Fluch des Wissens (a1) stammen aus der Vorgängerlektion
window.KONTRASTE.forEach(k => {
  check(!!L[k.lektion], `${k.id}: Lektion ${k.lektion} existiert`);
  const t = stem(L[k.lektion] || '');
  k.begriffe.forEach(b => { if (extra.has(b.name)) return; check(t.includes(stem(b.name)), `${k.id}: Begriff „${b.name}“ steht im Text von ${k.lektion}`); });
  k.faelle.forEach((f, i) => check(Number.isInteger(f.richtig) && f.richtig < k.begriffe.length && f.warum && f.warum.length > 20, `${k.id}: Fall ${i + 1} zeigt auf einen Begriff und begründet`));
});
window.BEISPIELE.forEach(b => {
  check(!!L[b.lektion], `${b.id}: Lektion ${b.lektion} existiert`);
  check(b.beispiel && b.luecke && b.eigen && b.fern, `${b.id}: vier Stufen (Beispiel, Lücke, eigenständig, neuer Kontext)`);
});
// D41: Begriffe folgen jetzt der Lektionssprache
const K = id => window.KONTRASTE.find(x => x.id === id);
check(K('spin').begriffe.some(b => b.name.startsWith('Need-Payoff')), 'spin: Need-Payoff-Frage statt Nutzenfrage');
check(K('motive').begriffe.map(b => b.name).join(',') === 'Gewinn,Sicherheit,Bequemlichkeit,Ansehen', 'motive: Namen wie die sieben Kaufmotive der Lektion');
check(K('abschluss').begriffe.some(b => b.name === 'Bedingter Abschluss') && !JSON.stringify(K('abschluss')).includes('Annahme'), 'abschluss: bedingter Abschluss statt Annahme-Abschluss');
check(K('challenger').begriffe.some(b => b.name.startsWith('Relationship Builder')), 'challenger: Typnamen wie in der CEB-Studie');
check(K('denkfehler-verkaeufer').lektion === 'a2', 'denkfehler-verkaeufer: bei 8.2, wo die Denkfehler eingeführt werden');
console.log(fails ? `${fails} FEHLER` : 'alle Checks bestanden'); process.exit(fails ? 1 : 0);

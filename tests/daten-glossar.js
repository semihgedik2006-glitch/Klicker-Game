// Jeder Glossarbegriff kommt in der Lektion vor, der er zugeordnet ist. node tests/daten-glossar.js
const fs = require('fs'), path = require('path');
global.window = global;
fs.readdirSync('js/data/kurse').sort().forEach(f => require(path.resolve('js/data/kurse', f)));
require(path.resolve('js/data/glossar.js'));
const L = {}; window.KURSE.forEach(k => k.lektionen.forEach(l => L[l.id] = { k: k.id, t: (l.inhalt + ' ' + l.kernpunkte.join(' ')).replace(/<[^>]+>/g, ' ') }));
const stem = s => s.toLowerCase().replace(/[()]/g, ' ').replace(/[-–]/g, ' ').split(/\s+/).filter(Boolean).map(w => w.replace(/(es|en|er|s|e)$/, '')).join(' ').trim();
const norm = s => stem(s); const normTerm = s => stem(s.replace(/\s*\([^)]*\)/g, ''));
let fails = 0;
window.GLOSSAR.forEach(g => {
  const l = L[g.l];
  if (!l) { console.log('FAIL ' + g.b + ': Lektion ' + g.l + ' unbekannt'); fails++; return; }
  if (l.k !== g.k) { console.log('FAIL ' + g.b + ': Kurs ' + g.k + ' passt nicht zu ' + g.l); fails++; }
  const t = norm(l.t);
  const ok = [g.b, ...(g.syn || [])].some(x => t.includes(normTerm(x)));
  if (!ok) { console.log('FAIL ' + g.b + ' kommt in ' + g.l + ' nicht vor'); fails++; }
});
console.log(window.GLOSSAR.length + ' Glossarbegriffe geprüft, ' + (fails ? fails + ' FEHLER' : 'alle in ihrer Lektion belegt'));
process.exit(fails ? 1 : 0);

global.window = {};
require('../js/data/milliardaere.js');
require('../js/data/mythen.js');
const M = window.MILLIARDAERE, ids = new Set();
let fehler = 0;
for (const m of window.MYTHEN) {
  const p = M.find(x => x.name === m.person);
  const z = p && p.zitate.find(z => z.en.startsWith(m.zitat));
  const ok = z && z.status !== 'zugeschrieben' && m.mythos && m.merke && !ids.has(m.id);
  ids.add(m.id);
  if (!ok) { fehler++; console.log('FEHLER', m.id); }
}
console.log(`${window.MYTHEN.length} Mythen, Fehler: ${fehler}`);

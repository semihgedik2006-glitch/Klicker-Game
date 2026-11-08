global.window = global;
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'js', 'data', 'kurse');
fs.readdirSync(dir).sort().forEach(f => require(path.join(dir, f)));
let errs = 0; const ids = new Set();
for (const k of window.KURSE) {
  for (const l of k.lektionen) {
    const where = `${k.id}/${l.id}`;
    if (ids.has(l.id)) { console.log('DOPPELTE ID', where); errs++; } ids.add(l.id);
    for (const key of ['titel', 'dauer', 'inhalt', 'quellen', 'quiz', 'uebung']) if (!l[key]) { console.log('FEHLT', key, where); errs++; }
    if (!Array.isArray(l.lernziele) || l.lernziele.length < 2) { console.log('lernziele fehlen', where); errs++; }
    if (!l.vorfrage) { console.log('vorfrage fehlt', where); errs++; }
    if (!Array.isArray(l.kernpunkte) || l.kernpunkte.length < 3) { console.log('kernpunkte fehlen', where); errs++; }
    if (!Array.isArray(l.selbsterklaerung) || l.selbsterklaerung.length < 2) { console.log('selbsterklaerung fehlt', where); errs++; }
    if (l.quiz.length < 3) { console.log('zu wenig Quiz', where); errs++; }
    if (l.quiz.filter(q => q.typ === 'anwendung').length < 2) { console.log('weniger als 2 Anwendungsfragen', where); errs++; }
    l.quiz.forEach((q, i) => {
      if (!q.optionen || q.optionen.length < 3 || typeof q.richtig !== 'number' || q.richtig >= q.optionen.length || !q.erklaerung) { console.log('Quizfrage defekt', where, i); errs++; return; }
      if (!Array.isArray(q.warumFalsch) || q.warumFalsch.length !== q.optionen.length || q.warumFalsch[q.richtig] !== null || q.warumFalsch.some((w, j) => j !== q.richtig && (typeof w !== 'string' || w.length < 10))) { console.log('warumFalsch fehlt oder passt nicht', where, i); errs++; }
      const lens = q.optionen.map(o => o.length); if (lens[q.richtig] === Math.max(...lens) && lens.filter(x => x === lens[q.richtig]).length === 1 && lens[q.richtig] > 1.5 * Math.max(...lens.filter((x, j) => j !== q.richtig))) { console.log('richtige Option deutlich am längsten', where, i); errs++; }
    });
    if (/<script/i.test(l.inhalt)) { console.log('script im inhalt', where); errs++; }
  }
}
console.log(window.KURSE.length, 'Module,', ids.size, 'Lektionen,', window.KURSE.reduce((a, k) => a + k.lektionen.reduce((b, l) => b + l.quiz.length, 0), 0), 'Fragen,', errs, 'Fehler');
process.exit(errs ? 1 : 0);

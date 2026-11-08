// Durchgang 34: Lernziele <-> Quiz-Alignment. Läuft ohne Browser: node tests/runde33.js
const fs = require('fs'), path = require('path');
global.window = global;
fs.readdirSync('js/data/kurse').sort().forEach(f => require(path.resolve('js/data/kurse', f)));
let fails = 0;
const check = (ok, msg) => { console.log((ok ? 'OK  ' : 'FAIL') + ' ' + msg); if (!ok) fails++; };
const all = [];
window.KURSE.forEach(k => k.lektionen.forEach(l => all.push(l)));
// 1. Jede Lektion hat mindestens so viele Wissensfragen wie Lernziele (jedes Ziel kann geprüft werden)
all.forEach(l => {
  const wissen = l.quiz.filter(q => q.typ !== 'anwendung').length;
  check(wissen >= l.lernziele.length, `${l.id}: ${wissen} Wissensfragen für ${l.lernziele.length} Lernziele`);
});
// 2. Die in D34 ergänzten Fragen zu vorher ungeprüften Lernzielen existieren und sind vollständig
const neu = {
  g4: 'Welche vier Quellen der Selbstwirksamkeit',
  p2: 'Expertise nach der Lektion am glaubwürdigsten',
  w2: 'Welche Tonalität passt nach Belfort',
  f2: 'Gong-Muster trotz fehlender Kausalität',
  v2: 'Datenbasis der Challenger-Studie',
  v3: 'Welche fünf Gründe stecken laut Lektion',
  s2: 'Vorbereitung vor einem wichtigen Gespräch',
  s3: 'Reihenfolge laufen die fünf Phasen',
  n3: 'Wenn-Dann-Muster nach Gollwitzer'
};
Object.entries(neu).forEach(([id, frag]) => {
  const l = all.find(x => x.id === id);
  const q = l && l.quiz.find(x => x.frage.includes(frag));
  check(!!q && q.optionen.length === 4 && q.warumFalsch.length === 4 && q.warumFalsch[q.richtig] === null, `${id}: neue Frage „${frag}“ vorhanden und vollständig`);
});
// 3. Kernpunkte, die zu den Lernzielen nachgezogen wurden
check(all.find(l => l.id === 'p2').kernpunkte.some(k => k.includes('Dritter sie einführt')), 'p2: Kernpunkt Autorität durch Dritte');
check(all.find(l => l.id === 'w2').kernpunkte.some(k => k.includes('Tonalitäten')), 'w2: Kernpunkt Belforts Tonalitäten');
console.log(fails ? `${fails} FEHLER` : 'alle Checks bestanden');
process.exit(fails ? 1 : 0);

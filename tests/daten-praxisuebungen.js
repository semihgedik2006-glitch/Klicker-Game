// Praxisübungen sind konkret, messbar und decken das Anwendungs-Lernziel. node tests/daten-praxisuebungen.js
const fs = require('fs'), path = require('path');
global.window = global;
fs.readdirSync('js/data/kurse').sort().forEach(f => require(path.resolve('js/data/kurse', f)));
let fails = 0; const check = (ok, msg) => { console.log((ok ? 'OK  ' : 'FAIL') + ' ' + msg); if (!ok) fails++; };
const all = []; window.KURSE.forEach(k => k.lektionen.forEach(l => all.push(l)));
// 1. Jede Übung nennt eine Menge oder Zeit (messbar) und beginnt mit einer Handlung
all.forEach(l => {
  const u = l.uebung;
  check(/\d|\b(drei|fünf|zwei|zehn|zwanzig|vier|sechs|acht)\b/i.test(u), `${l.id}: Übung nennt Menge oder Zeit`);
  check(/^(Schreibe|Sammle|Nimm|Führe|Formuliere|Gib|Beobachte|Invertiere|Fotografiere|Suche|Wähle|Analysiere|Ordne|Liste|Verhandle|Bereite)\b/.test(u), `${l.id}: Übung beginnt mit einer Handlung („${u.slice(0, 20)}…“)`);
  check(u.length >= 120 && u.length <= 420, `${l.id}: Übungslänge ${u.length} Zeichen`);
});
// 2. In D38 nachgezogene Passungen zum Anwendungs-Lernziel
[['g4', 'Wenn-Dann-Plan'], ['p1', 'ehrlich Ja sagen'], ['p4', 'Verlust-Framing'], ['w2', 'Tonalitäten'], ['f2', 'terminierten nächsten Schritt'], ['s1', 'Risikoumkehr'], ['s2', 'belegten Techniken'], ['v1', 'Agenda-Frame'], ['k3', 'Hände sichtbar']].forEach(([id, t]) => {
  check(all.find(l => l.id === id).uebung.includes(t), `${id}: Übung deckt „${t}“`);
});
console.log(fails ? `${fails} FEHLER` : 'alle Checks bestanden'); process.exit(fails ? 1 : 0);

// Durchgang 36: Qualität der Falschantworten. Läuft ohne Browser: node tests/runde35.js
const fs = require('fs'), path = require('path');
global.window = global;
fs.readdirSync('js/data/kurse').sort().forEach(f => require(path.resolve('js/data/kurse', f)));
let fails = 0; const check = (ok, msg) => { console.log((ok ? 'OK  ' : 'FAIL') + ' ' + msg); if (!ok) fails++; };
const all = []; window.KURSE.forEach(k => k.lektionen.forEach(l => l.quiz.forEach((q, i) => all.push({ id: `${l.id}#${i + 1}`, q }))));
// 1. Keine Mini-Falschantwort neben einer langen richtigen (Länge verrät die Lösung)
const mini = all.filter(({ q }) => q.optionen.some((o, j) => j !== q.richtig && o.length < 14 && q.optionen[q.richtig].length > 40));
check(mini.length === 0, 'keine Falschantwort unter 14 Zeichen neben richtiger über 40: ' + mini.map(x => x.id).join(', '));
// 2. Richtige Antwort höchstens 1,3-mal so lang wie die längste Falschantwort
const lang = all.filter(({ q }) => { const l = q.optionen.map(o => o.length); return l[q.richtig] > 1.3 * Math.max(...l.filter((_, j) => j !== q.richtig)); });
check(lang.length === 0, 'richtige Antwort nie deutlich am längsten: ' + lang.map(x => x.id).join(', '));
// 3. Höchstens eine Falschantwort pro Frage mit Großbuchstaben-Geschrei oder „Äh“-Karikatur
const kari = all.filter(({ q }) => q.optionen.filter((o, j) => j !== q.richtig && (/[A-ZÄÖÜ]{5,}/.test(o) || /^„?Äh/.test(o))).length > 1);
check(kari.length === 0, 'höchstens eine Karikatur-Falschantwort pro Frage: ' + kari.map(x => x.id).join(', '));
// 4. Antwortreihenfolge wird in Quiz, Prüfung, Wiederholung und Einstufung gemischt (Datenposition verrät nichts)
const app = fs.readFileSync('js/app.js', 'utf8');
check((app.match(/shuffle\(q\.optionen\.map/g) || []).length >= 4, 'Optionen werden in allen vier Abfrage-Modi gemischt');
// 5. In D36 überarbeitete Distraktoren
[['g2', 'Hippocampus'], ['p2', 'Über 30 % der Mieter'], ['p4', 'Print-Abos auf 32 %'], ['k3', 'sympathischer, aber weniger kompetent'], ['f3', 'senkt die Herzfrequenz'], ['s2', 'seit Kurzem im Versicherungsbereich'], ['a1', 'für einen Folgetermin aufheben']].forEach(([lid, t]) => {
  const hit = all.find(x => x.id.startsWith(lid + '#') && x.q.optionen.some(o => o.includes(t)));
  const ok = hit && hit.q.optionen.findIndex(o => o.includes(t)) !== hit.q.richtig && hit.q.warumFalsch[hit.q.optionen.findIndex(o => o.includes(t))];
  check(!!ok, `${lid}: neue Falschantwort „${t}“ vorhanden, nicht die richtige, mit Begründung`);
});
console.log(fails ? `${fails} FEHLER` : 'alle Checks bestanden'); process.exit(fails ? 1 : 0);

// Textprüfung der Lektionen: node tools/check-text.js [Modulnummern]
// Meldet lange Sätze (> 42 Wörter), Füllwörter, Behauptungsfloskeln ohne Quelle, KI-Tells und Sätze ohne Jahreszahl bei Studienverweisen. Nur Bericht, kein Fehlerstatus.
global.window = global; global.KURSE = [];
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'js', 'data', 'kurse');
fs.readdirSync(dir).sort().forEach(f => require(path.join(dir, f)));
const mods = process.argv.slice(2).map(Number);
const strip = h => h.replace(/<table[\s\S]*?<\/table>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const split = t => t.split(/(?<=[.!?:]“?\)?)\s+(?=[A-ZÄÖÜ„(])/);
const inQuote = (t, i) => { const before = t.slice(0, i); return (before.split('„').length - 1) > (before.split('“').length - 1); };
const pats = {
  'Füllwort': /\b(eigentlich|grundsätzlich|im Grunde|selbstverständlich|wirklich|durchaus|ziemlich|relativ|quasi|sozusagen|gewissermaßen|letztendlich|letztlich|im Prinzip|generell|tatsächlich|einfach nur|ganz einfach)\b/gi,
  'Behauptung ohne Quelle': /\b(Studien zeigen|Forschung zeigt|wissenschaftlich (belegt|bewiesen)|nachweislich|erwiesen|Experten (sagen|sind sich einig)|man weiß|bekanntlich)\b/gi,
  'KI-Tell „nicht X, sondern Y“': /\b[Nn]icht\b[^.]{3,60}, sondern\b/g,
  'KI-Tell „kein X, kein Y, kein Z“': /\b[Kk]ein\w*\b[^.]{2,30}, kein\w*\b[^.]{2,30}, kein\w*\b/g,
  'KI-Tell „Es geht nicht um“': /Es geht nicht um/g,
  'Gedankenstrich': /\s[–—]\s/g,
};
let total = 0;
for (const k of KURSE) {
  if (mods.length && !mods.includes(k.nr)) continue;
  for (const l of k.lektionen) {
    const t = strip(l.inhalt || ''); const sents = split(t); const hits = [];
    for (const s of sents) if (s.split(/\s+/).length > 42) hits.push('LANG (' + s.split(/\s+/).length + '): ' + s.slice(0, 120) + '…');
    for (const [name, re] of Object.entries(pats)) for (const m of t.matchAll(re)) { if (inQuote(t, m.index)) continue; hits.push(name + ': „…' + t.slice(Math.max(0, m.index - 50), m.index + m[0].length + 40).replace(/\s+/g, ' ') + '…“'); }
    const studie = sents.filter(s => /\b(Studie|Meta-Analyse|Experiment|untersuchte|zeigte|fand(en)?)\b/.test(s) && /\b[A-ZÄÖÜ][a-zäöüß]+ (et al\.|und [A-ZÄÖÜ][a-zäöüß]+)\b/.test(s) && !/\b(19|20)\d\d\b/.test(s));
    for (const s of studie) hits.push('Studie ohne Jahr: ' + s.slice(0, 120) + '…');
    if (hits.length) { total += hits.length; console.log(`\n## ${k.nr}.${l.id} ${l.titel} (${t.split(/\s+/).length} Wörter, Ø ${Math.round(t.split(/\s+/).length / sents.length)} Wörter je Satz)`); hits.forEach(h => console.log('  ' + h)); }
  }
}
console.log(`\n${total} Hinweise${mods.length ? ' in Modul ' + mods.join(', ') : ''}. Zitate in „…“ sind ausgenommen. Jeder Hinweis ist ein Prüfauftrag, kein Fehler.`);

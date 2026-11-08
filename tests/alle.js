// Führt alle Tests nacheinander aus: node tests/alle.js [filter]
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const filter = process.argv[2] || '';
const dateien = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && f !== 'alle.js' && f.includes(filter)).sort();
const fehler = [];
for (const f of dateien) {
  let out = '', ok = true;
  try { out = execFileSync('node', [path.join(__dirname, f)], { cwd: path.join(__dirname, '..'), encoding: 'utf8', timeout: 180000, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { ok = false; out = (e.stdout || '') + (e.stderr || ''); }
  if (ok && /^\s*(FAIL|FEHLER)\b|PAGEERROR|\bfalse\b.*(sichtbar|frei)|Fehler: [1-9]/m.test(out)) ok = false;
  console.log((ok ? 'ok    ' : 'FEHLER') + ' ' + f);
  if (!ok) fehler.push([f, out.split('\n').filter(l => /FAIL|FEHLER|Error|false/.test(l)).slice(0, 8).join('\n')]);
}
for (const [f, out] of fehler) console.log('\n## ' + f + '\n' + out);
console.log(`\n${dateien.length - fehler.length} von ${dateien.length} ohne Befund.`);
process.exit(fehler.length ? 1 : 0);

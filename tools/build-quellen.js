const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'research', 'quellen');
const TITEL = { 'koerpersprache-stimme': 'Körpersprache & Stimme', 'milliardaere-investoren': 'Milliardäre & Investoren', 'selbstvermarktung-business': 'Selbstvermarktung & Business', 'tech-milliardaere': 'Tech-Milliardäre', 'verhandlung-einwaende-abschluss': 'Verhandlung, Einwände, Abschluss', 'verkaufsmethoden-coaches': 'Verkaufsmethoden & Coaches', 'entscheidungspsychologie': 'Entscheidungspsychologie', 'ueberzeugungspsychologie': 'Überzeugungspsychologie', 'kunden-analysieren': 'Kunden analysieren', 'selbstbewusstsein-kompetenzwirkung': 'Selbstbewusstsein & Kompetenzwirkung', 'lernforschung': 'Lernforschung (Methode der App)' };
const strip = (s) => s.replace(/\*\*/g, '').replace(/\*(.+?)\*/g, '$1').replace(/<[^>]+>/g, '').trim();
const splitRow = (line) => { const cells = []; let cur = '', depth = 0; for (let i = 1; i < line.length; i++) { const c = line[i]; if (c === '|' && line[i - 1] !== '\\') { cells.push(cur); cur = ''; } else cur += c; } if (cur.trim()) cells.push(cur); return cells.map(c => c.trim()); };
const out = [];
for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
  const key = file.replace('.md', ''); const lines = fs.readFileSync(path.join(dir, file), 'utf8').split('\n');
  let section = '', map = null;
  for (const line of lines) {
    if (/^##\s/.test(line)) { section = strip(line.replace(/^#+\s*/, '')); map = null; continue; }
    if (!line.startsWith('|')) continue;
    const cells = splitRow(line);
    if (/^-+$/.test(cells[0].replace(/[:\s]/g, ''))) continue;
    const lower = cells.map(c => c.toLowerCase());
    if (lower[0].startsWith('nr') || lower[0] === '#') {
      map = {}; lower.forEach((h, i) => { if (/^nr|^#/.test(h)) map.nr = i; else if (/typ|art/.test(h)) map.typ = i; else if (/quelle|werk|titel/.test(h)) map.quelle = i; else if (/kern|aussage|inhalt|relevanz/.test(h)) map.kern = i; else if (/stärke|beweis|evidenz|status|prüf|grad|stufe/.test(h)) map.staerke = i; else if (/link|url/.test(h)) map.link = i; });
      continue;
    }
    if (!map || !/^\d+/.test(cells[0])) continue;
    const g = (k) => map[k] !== undefined ? strip(cells[map[k]] || '') : '';
    const linkRaw = map.link !== undefined ? (cells[map.link] || '') : '';
    const m = linkRaw.match(/\((https?:[^)\s]+)\)/) || linkRaw.match(/(https?:\/\/[^\s|)]+)/);
    let link = m ? m[1] : ''; if (!link && /^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(strip(linkRaw))) link = 'https://' + strip(linkRaw);
    out.push({ b: key, s: section, nr: Number(cells[0].match(/\d+/)[0]), typ: g('typ'), q: g('quelle'), k: g('kern'), st: g('staerke'), l: link });
  }
}
const header = `// Automatisch erzeugt aus research/quellen/*.md durch tools/build-quellen.js. Nicht von Hand bearbeiten.\nwindow.QUELLEN_BEREICHE = ${JSON.stringify(TITEL)};\nwindow.QUELLEN = `;
fs.writeFileSync(path.join(__dirname, '..', 'js', 'data', 'quellen.js'), header + JSON.stringify(out) + ';\n');
const byFile = {}; out.forEach(o => byFile[o.b] = (byFile[o.b] || 0) + 1);
console.log(out.length, 'Quellen', byFile);

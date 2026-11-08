/* Verkaufsakademie – App-Kern: Zustand, Router, Lektionen, Prüfungen, Bibliothek, Training, Werkzeuge */
(function () {
  'use strict';

  // ---------- Hilfsfunktionen ----------
  const $ = (sel, el = document) => el.querySelector(sel);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const fmtDate = (ts) => new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const fmtTime = (ts) => new Date(ts).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const uid = () => Math.random().toString(36).slice(2, 10);
  const PASS = 80;              // Prozent zum Bestehen
  const REPORT_MIN = 250;       // Mindestzeichen für einen Übungsbericht
  const EXAM_COOLDOWN = 20 * 60 * 1000; // 20 Minuten Sperre nach nicht bestandener Prüfung

  // ---------- Zustand ----------
  const KEY = 'verkaufsakademie_v1';
  const DEFAULT = {
    name: '', apiKey: '', model: 'claude-opus-5-5',
    quiz: {}, lessonsDone: {}, exams: {}, reports: {},
    erfolg: [], beweis: [], nein: [], ablehnung: {}, leiter: null,
    checks: {}, drills: {}, ka: [], chats: {}, activity: {}, streakBest: 0,
    business: [], started: Date.now(), vorfragen: {}, abruf: {}, srs: {}, plan: '', lastExport: 0, textsize: 'normal', onboarded: false, tourWeg: false, rpPlan: {}, keySession: false, srsLog: {}, kalib: { sicher: 0, sicherOk: 0, unsicher: 0, unsicherOk: 0 }, blind: {}
  };
  let S;
  const KEY_SESSION = KEY + '_key';
  // Übernimmt aus fremden Daten (localStorage, Import) nur die Felder, die DEFAULT kennt. Verhindert __proto__-Tricks und Datenmüll.
  function pickState(d) { const out = Object.assign({}, DEFAULT); if (!d || typeof d !== 'object') return out; for (const k of Object.keys(DEFAULT)) if (Object.prototype.hasOwnProperty.call(d, k)) out[k] = d[k]; return out; }
  function load() {
    try { S = pickState(JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { S = pickState(null); }
    try { if (S.keySession) { const k = sessionStorage.getItem(KEY_SESSION); if (k) S.apiKey = k; } } catch (e) { /* kein sessionStorage */ }
    if (!S.leiter) S.leiter = window.ERFOLGSLEITER_VORLAGE.map(t => ({ text: t, done: false }));
    if (!S.kalib) S.kalib = { sicher: 0, sicherOk: 0, unsicher: 0, unsicherOk: 0 }; if (!S.blind) S.blind = {}; if (!S.rpPlan) S.rpPlan = {};
    if (!S.onboarded && (Object.keys(S.activity).length > 0 || S.name)) S.onboarded = true;
    (window.SZENARIEN || []).forEach(sz => { if (!sz.offline && window.SZENARIEN_OFFLINE && window.SZENARIEN_OFFLINE[sz.id]) sz.offline = window.SZENARIEN_OFFLINE[sz.id]; });
  }
  function save() {
    try {
      if (S.keySession) { try { sessionStorage.setItem(KEY_SESSION, S.apiKey || ''); } catch (e) { /* ignorieren */ } localStorage.setItem(KEY, JSON.stringify({ ...S, apiKey: '' })); }
      else { try { sessionStorage.removeItem(KEY_SESSION); } catch (e) { /* ignorieren */ } localStorage.setItem(KEY, JSON.stringify(S)); }
    } catch (e) { toast('Speichern fehlgeschlagen: ' + e.message, 'bad'); }
  }
  function touch() { S.activity[today()] = (S.activity[today()] || 0) + 1; }

  // ---------- Fortschrittslogik ----------
  const KURSE = window.KURSE;
  const kursById = (id) => KURSE.find(k => k.id === id);
  function lessonIndex(kurs, lid) { return kurs.lektionen.findIndex(l => l.id === lid); }
  function quizPassed(lid) { const q = S.quiz[lid]; return !!q && q.total > 0 && (q.score / q.total) * 100 >= PASS; }
  function reportDone(lid) { return (S.reports[lid] || []).some(r => r.bestanden); }
  function lessonDone(lid) { return !!S.lessonsDone[lid]; }
  function examPassed(kid) { return !!(S.exams[kid] && S.exams[kid].passed); }
  function moduleUnlocked(kurs) { const i = KURSE.indexOf(kurs); return i === 0 || examPassed(KURSE[i - 1].id); }
  function lessonUnlocked(kurs, idx) { if (!moduleUnlocked(kurs)) return false; return idx === 0 || lessonDone(kurs.lektionen[idx - 1].id); }
  function allLessonsDone(kurs) { return kurs.lektionen.every(l => lessonDone(l.id)); }
  function moduleProgress(kurs) { const n = kurs.lektionen.length + 1; let d = kurs.lektionen.filter(l => lessonDone(l.id)).length + (examPassed(kurs.id) ? 1 : 0); return Math.round(d / n * 100); }
  function totalProgress() { const n = KURSE.reduce((a, k) => a + k.lektionen.length + 1, 0); const d = KURSE.reduce((a, k) => a + k.lektionen.filter(l => lessonDone(l.id)).length + (examPassed(k.id) ? 1 : 0), 0); return Math.round(d / n * 100); }
  function currentKurs() { return KURSE.find(k => !examPassed(k.id)) || KURSE[KURSE.length - 1]; }
  function nextStep() {
    for (const k of KURSE) {
      if (!moduleUnlocked(k)) break;
      for (const l of k.lektionen) if (!lessonDone(l.id)) return { kurs: k, lektion: l, text: `Lektion ${k.nr}.${lessonIndex(k, l.id) + 1}: ${l.titel}`, route: `#/lektion/${k.id}/${l.id}` };
      if (!examPassed(k.id)) return { kurs: k, text: `Modulprüfung ${k.nr}: ${k.titel}`, route: `#/pruefung/${k.id}` };
    }
    if (!abschlussPassed()) return { text: 'Alle Module bestanden. Jetzt die Abschlussprüfung über das gesamte Curriculum.', route: '#/abschluss' };
    return { text: 'Abschluss bestanden. Jetzt: tägliche Drills, Wiederholung und echte Gespräche.', route: '#/training' };
  }
  const RAENGE = [[0, 'Rekrut'], [1, 'Anwärter'], [2, 'Verkäufer'], [4, 'Berater'], [6, 'Verhandler'], [8, 'Closer'], [10, 'Meister']];
  function rang() { if (abschlussPassed()) return 'Absolvent'; const n = KURSE.filter(k => examPassed(k.id)).length; let r = RAENGE[0][1]; for (const [m, t] of RAENGE) if (n >= m) r = t; return r; }
  function abschlussPassed() { return !!(S.exams.abschluss && S.exams.abschluss.passed); }
  function allExamsPassed() { return KURSE.every(k => examPassed(k.id)); }
  // Serie mit einem Ruhetag pro sieben Tage: ein ausgelassener Tag bricht die Serie nicht, zwei innerhalb einer Woche schon.
  function streak() {
    let n = 0, lastRest = -99, i = 0; const d = new Date();
    if (!S.activity[today()]) { d.setDate(d.getDate() - 1); i = 1; }
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (S.activity[key]) n++;
      else if (i - lastRest > 6 && n > 0) lastRest = i;
      else break;
      d.setDate(d.getDate() - 1); i++; if (i > 3650) break;
    }
    if (n > S.streakBest) S.streakBest = n;
    return n;
  }
  function wocheAktiv() { let c = 0; const d = new Date(); for (let i = 0; i < 7; i++) { if (S.activity[d.toISOString().slice(0, 10)]) c++; d.setDate(d.getDate() - 1); } return c; }

  // ---------- Wiederholung mit Abständen (Leitner, 6 Stufen) ----------
  const SRS_INTERVALLE = [1, 3, 7, 14, 30, 60];
  const SRS_MAX_TAG = 20;
  function srsKarten() { const out = []; for (const k of KURSE) for (const l of k.lektionen) if (lessonDone(l.id)) l.quiz.forEach((q, i) => out.push({ id: l.id + ':' + i, q, lektion: l, kurs: k })); return out; }
  function srsFaellig() {
    const t = today(); const heute = Object.values(S.srs).filter(x => x.last === t).length;
    const due = srsKarten().filter(c => { const st = S.srs[c.id]; return !st || st.due <= t; });
    return { due: shuffle(due), heute, rest: Math.max(0, SRS_MAX_TAG - heute) };
  }
  function srsAntwort(id, ok) {
    const st = S.srs[id] || { box: 0, n: 0, richtig: 0 };
    st.n++; if (ok) { st.richtig++; st.box = Math.min(st.box + 1, SRS_INTERVALLE.length - 1); } else st.box = 0;
    const d = new Date(); d.setDate(d.getDate() + (ok ? SRS_INTERVALLE[st.box] : 1)); st.due = d.toISOString().slice(0, 10); st.last = today();
    S.srs[id] = st; S.srsLog[today()] = (S.srsLog[today()] || 0) + 1; touch(); save();
  }

  // ---------- UI-Bausteine ----------
  function toast(msg, kind = '') {
    let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'show ' + kind; clearTimeout(t._t); t._t = setTimeout(() => t.className = '', 3200);
  }
  function modal(html, { wide = false } = {}) {
    closeModal();
    const m = document.createElement('div'); m.className = 'modal-bg'; m.id = 'modal';
    m.innerHTML = `<div class="modal ${wide ? 'wide' : ''}"><button class="modal-x" aria-label="Schließen">×</button>${html}</div>`;
    m.addEventListener('click', e => { if (e.target === m || e.target.classList.contains('modal-x')) closeModal(); });
    document.body.appendChild(m); return m;
  }
  function closeModal() { const m = $('#modal'); if (m) m.remove(); }
  function md(text) { // kleines Markdown für Coach-Antworten
    let h = esc(text);
    h = h.replace(/```([\s\S]*?)```/g, (_, c) => `<pre>${c}</pre>`);
    h = h.replace(/^### (.*)$/gm, '<h4>$1</h4>').replace(/^## (.*)$/gm, '<h3>$1</h3>').replace(/^# (.*)$/gm, '<h3>$1</h3>');
    h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    h = h.replace(/^(?:- |• |\* )(.*)$/gm, '<li>$1</li>').replace(/^\d+\. (.*)$/gm, '<li class="n">$1</li>');
    h = h.replace(/(?:<li[^>]*>.*<\/li>\n?)+/g, m => '<ul>' + m.replace(/\n/g, '') + '</ul>\n');
    h = h.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
    h = h.replace(/<br><ul>/g, '<ul>').replace(/<\/ul><br>/g, '</ul>').replace(/<p>(\s|<br>)*<\/p>/g, '').replace(/<p>(<ul>|<h3>|<h4>|<pre>)/g, '$1').replace(/(<\/ul>|<\/h3>|<\/h4>|<\/pre>)<\/p>/g, '$1');
    return '<p>' + h + '</p>';
  }
  const ICON_LOCK = '<svg class="ico" viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false"><rect x="3" y="7" width="10" height="7.5" rx="1.5" fill="currentColor"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  const lock = (t) => `<span class="lock" title="${esc(t)}" aria-label="gesperrt">${ICON_LOCK}</span>`;

  // ---------- Router ----------
  const routes = {};
  function route(path, fn) { routes[path] = fn; }
  function navigate() {
    const hash = location.hash || '#/';
    const parts = hash.split('?')[0].slice(2).split('/').filter(Boolean);
    const name = parts[0] || 'start';
    const fn = routes[name] || routes.start;
    if (examState && !(name === 'pruefung' && examState.kid !== 'abschluss') && !(name === 'abschluss' && examState.kid === 'abschluss')) { const ex = S.exams[examState.kid] = S.exams[examState.kid] || { attempts: [], passed: false, best: 0 }; ex.attempts.push({ ts: Date.now(), pct: 0, passed: false, abgebrochen: true }); examState = null; save(); toast('Prüfung verlassen. Das zählt als nicht bestanden.', 'bad'); }
    const main = $('#main');
    main.className = 'main fade';
    try { main.innerHTML = fn(parts.slice(1)) || ''; }
    catch (e) { main.innerHTML = `<div class="callout warn"><div class="label">Fehler</div>${esc(e.message)}</div>`; console.error(e); }
    main.scrollTop = 0; window.scrollTo(0, 0); main.setAttribute('tabindex', '-1'); if (document.activeElement && document.activeElement !== document.body) main.focus({ preventScroll: true });
    renderNav(); setMenu(false);
    if (name === 'lektion') glossarVerlinken();
    if (typeof afterRender === 'function') afterRender(name, parts.slice(1));
    document.querySelectorAll('[data-route]').forEach(el => el.onclick = () => location.hash = el.dataset.route);
  }
  let afterRender = null;
  function renderNav() {
    const hash = location.hash || '#/';
    const cur = currentKurs();
    const path = hash.split('?')[0];
    const item = (href, label, extra = '') => `<a href="${href}" class="${path === href || (href !== '#/' && path.startsWith(href)) ? 'active' : ''}">${label}${extra}</a>`;
    $('#nav').innerHTML = `
      <div class="nav-section">Start</div>
      ${item('#/', 'Übersicht')}
      ${item('#/coach', 'KI-Coach', S.apiKey ? '' : ' <span class="nav-dot" title="API-Schlüssel fehlt"></span>')}
      <div class="nav-section">Curriculum</div>
      ${(() => { const f = srsFaellig(); const n = Math.min(f.due.length, f.rest); return item('#/wiederholen', 'Wiederholen', n ? ` <span class="nav-badge">${n}</span>` : ''); })()}
      ${KURSE.map(k => item('#/kurs/' + k.id, `<span class="nav-num">${k.nr}</span> ${k.titel}`, moduleUnlocked(k) ? (examPassed(k.id) ? ' <span class="nav-ok">✓</span>' : (k === cur ? ' <span class="nav-cur"></span>' : '')) : ` <span class="nav-lock" title="Erst das vorherige Modul bestehen" aria-label="gesperrt">${ICON_LOCK}</span>`)).join('')}
      ${item('#/einstufung', 'Einstufung')}
      ${item('#/rueckschau', 'Prüfungs-Rückschau', (() => { const n = rueckschauListe().filter(x => !x.erledigt).length; return n ? ` <span class="nav-count">${n}</span>` : ''; })())}
      ${item('#/abschluss', 'Abschlussprüfung', abschlussPassed() ? ' <span class="nav-ok">✓</span>' : allExamsPassed() ? '' : ` <span class="nav-lock" title="Erst alle Module bestehen" aria-label="gesperrt">${ICON_LOCK}</span>`)}
      <div class="nav-section">Training</div>
      ${item('#/rollenspiel', 'Rollenspiele')}
      ${item('#/einwaende', 'Einwand-Drill')}
      ${item('#/kontraste', 'Konzept-Kontraste')}
      ${item('#/faelle', 'Fälle')}
      ${item('#/beispiele', 'Schritt für Schritt')}
      ${item('#/spielbuch', 'Einwand-Spielbuch')}
      ${item('#/training', 'Drills & Programm')}
      ${item('#/koerper', 'Körpersprache-Trainer')}
      ${item('#/checklisten', 'Checklisten')}
      <div class="nav-section">Wissen</div>
      ${item('#/milliardaere', 'Milliardärs-Bibliothek')}
      ${item('#/mythen', 'Mythen-Check')}
      ${item('#/kundenanalyse', 'Kundenanalyse')}
      ${item('#/glossar', 'Glossar')}
      ${item('#/quellen', 'Quellenverzeichnis')}
      <div class="nav-section">Ich</div>
      ${item('#/business', 'Business-Planer')}
      ${item('#/journal', 'Journal & Beweisbuch')}
      ${item('#/einstellungen', 'Einstellungen')}`;
    const p = totalProgress(); $('#total-pct').textContent = p + ' %'; $('#total-bar').style.width = p + '%';
  }

  // ---------- Seiten ----------
  route('start', () => {
    if (!S.onboarded) return onboarding();
    const ns = nextStep(); const st = streak(); const k = currentKurs();
    const day = Object.keys(S.ablehnung).length;
    const ad = window.ABLEHNUNGSTRAINING[Math.min(day, 29)];
    const drill = window.TAGESDRILLS[(new Date().getDate() + new Date().getMonth()) % window.TAGESDRILLS.length];
    const allQ = window.MILLIARDAERE.flatMap(p => p.zitate.filter(z => z.status !== 'zugeschrieben').map(z => ({ ...z, name: p.name })));
    const q = allQ[(Math.floor(Date.now() / 864e5)) % allQ.length];
    const exams = KURSE.filter(x => examPassed(x.id)).length;
    const reports = Object.values(S.reports).flat().filter(r => r.bestanden).length;
    return `
      <section class="hero">
        <div class="eyebrow">${S.name ? 'Willkommen zurück, ' + esc(S.name) : 'Verkaufsakademie'} · Rang: <strong>${rang()}</strong></div>
        <h1>Dein nächster Schritt</h1>
        <p class="lead">${esc(ns.text)}</p>
        <div class="btn-row"><a class="btn primary" href="${ns.route}">Weiter →</a><a class="btn ghost" href="#/coach">Mit dem Coach sprechen</a></div>
      </section>
      ${!S.einstufung && Object.keys(S.lessonsDone).length < 3 ? `<div class="callout practice"><div class="label">Quereinsteiger?</div>Wenn du schon verkauft hast: Die <a href="#/einstufung">Einstufung</a> (20 Fragen, 10 Minuten) zeigt dir, wo du Vorwissen hast und wo nicht. Sie schaltet nichts frei, aber du liest danach gezielter.</div>` : ''}
      ${ersteSchritte()}
      ${wvCard(5)}
      <div class="grid stats">
        <div class="stat"><div class="big">${totalProgress()} %</div><div class="lbl">Curriculum</div></div>
        <div class="stat"><div class="big">${exams}/${KURSE.length}</div><div class="lbl">Prüfungen bestanden</div></div>
        <div class="stat"><div class="big">${st}</div><div class="lbl">Tage in Folge (Rekord ${S.streakBest})</div></div>
        <div class="stat"><div class="big">${S.nein.length}</div><div class="lbl">Gesammelte Neins</div></div>
        <div class="stat"><div class="big">${reports}</div><div class="lbl">Berichte bestanden</div></div>
      </div>
      <div class="card today"><div class="eyebrow">Heute · ${new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        <div class="today-row">${heute().map(t => `<a class="today-item ${t.done ? 'done' : ''}" href="${t.route}"><span class="ms-icon">${t.done ? '✓' : '○'}</span><span><strong>${esc(t.name)}</strong><br><span class="muted">${esc(t.text)}</span></span></a>`).join('')}</div>
        ${tagesplan()}
        <p class="muted small">Die Serie zählt Tage mit mindestens einer dieser Handlungen. Ein Ruhetag pro Woche bricht sie nicht. Diese Woche: ${wocheAktiv()} von 7 Tagen aktiv.</p>
        ${S.plan ? `<div class="plan">Dein Wenn-Dann-Plan: <strong>${esc(S.plan)}</strong></div>` : `<div class="plan muted">Noch kein Wenn-Dann-Plan. Menschen mit einem konkreten Auslöser („Wenn ich morgens den Kaffee aufsetze, dann…“) setzen Vorsätze etwa doppelt so oft um (Gollwitzer & Sheeran 2006). <a href="#/einstellungen">Plan festlegen</a></div>`}</div>
      ${backupHinweis()}
      ${wochenrueckblick()}
      <div class="two-col">
        <div class="card">
          <div class="eyebrow">Drill des Tages · ${drill.dauer} Min.</div>
          <h3>${esc(drill.name)}</h3><p>${esc(drill.text)}</p>
          <button class="btn small" data-act="drill-done" data-id="${drill.id}">${(S.drills['tag_' + drill.id] || []).some(d => d.ts > Date.now() - 864e5) ? '✓ Heute erledigt' : 'Erledigt'}</button>
        </div>
        <div class="card">
          <div class="eyebrow">Ablehnungstraining · Tag ${Math.min(day + 1, 30)} von 30</div>
          <h3>${day >= 30 ? 'Programm abgeschlossen' : esc(ad.aufgabe)}</h3>
          <p class="muted">${day >= 30 ? 'Fang von vorn an, diesmal mit höherem Einsatz.' : 'Stufe ' + ad.stufe + ' · Dokumentiere das Ergebnis im Journal.'}</p>
          <a class="btn small ghost" href="#/training">Zum Programm</a>
        </div>
      </div>
      <div class="quote-card">
        <div class="en">“${esc(q.en)}”</div>
        <div class="de">${esc(q.de)}</div>
        <div class="src">${esc(q.name)} · ${esc(q.quelle)} · <a href="#/milliardaere">Bibliothek</a></div>
      </div>
      <h2 class="section-title">Meilensteine</h2>
      <div class="milestones">${meilensteine().map(m => `<div class="ms ${m.done ? 'done' : ''}" title="${esc(m.text)}"><span class="ms-icon">${m.done ? '✓' : '○'}</span><span>${esc(m.name)}</span></div>`).join('')}</div>
      <h2 class="section-title">Aktuelles Modul</h2>
      ${kursCard(k)}
      <h2 class="section-title">Die Regeln dieses Bootcamps</h2>
      <div class="card rules">
        <ol class="steps">
          <li><strong>Reihenfolge.</strong> Module und Lektionen werden in der vorgegebenen Reihenfolge freigeschaltet. Kein Überspringen.</li>
          <li><strong>Lektion abschließen</strong> heißt: Vorab-Frage raten, lesen, aus dem Kopf zusammenfassen, Quiz mit mindestens ${PASS} %, dann Übungsbericht (mindestens ${REPORT_MIN} Zeichen), der vom Coach oder dem Selbst-Check bestanden wird. Diese Reihenfolge folgt der Lernforschung: Vorab-Raten, Abrufen und Testen festigen stärker als Lesen allein.</li>
          <li><strong>Wiederholen.</strong> Fragen abgeschlossener Lektionen kommen in wachsenden Abständen wieder. Höchstens ${SRS_MAX_TAG} pro Tag, kein Rückstau.</li>
          <li><strong>Abschluss.</strong> Nach allen zehn Modulen folgt die Abschlussprüfung über das gesamte Curriculum (30 Fragen, ${PASS} %). Dann gibt es das Zertifikat, und du bist Absolvent.</li>
          <li><strong>Modulprüfung</strong> mit mindestens ${PASS} %. Nicht bestanden heißt 20 Minuten Sperre und zurück in die Lektionen.</li>
          <li><strong>Echte Welt.</strong> Was du hier liest, zählt erst, wenn du es draußen getan hast. Deshalb verlangt jede Lektion einen Bericht über eine echte Handlung, und das Training zählt Drills und gesammelte Neins.</li>
          <li><strong>Ehrlichkeit.</strong> Niemand kontrolliert dich außer dir. Wer sich selbst belügt, verkauft später auch schlechter.</li>
          <li><strong>Keine Tricks.</strong> Die App kommt ohne Herzen, Werbung, Bezahlschranke und Schuld-Benachrichtigungen aus, und die Serie erlaubt einen Ruhetag pro Woche. Die Strenge steckt im Stoff und in den ${PASS} %.</li>
        </ol>
      </div>`;
  });

  function onboarding() {
    return `<section class="hero"><div class="eyebrow">Verkaufsakademie</div><h1>Bevor du anfängst</h1>
      <p class="lead">Ein persönliches Bootcamp mit zehn Modulen, einer Abschlussprüfung und Aufgaben in der echten Welt. Jede Lektion endet mit einem Quiz und einem Bericht über ein echtes Gespräch; Durchklicken bringt deshalb nichts. Zwei Minuten Einrichtung, dann geht es los.</p></section>
      <div class="two-col">
        <div class="card"><div class="eyebrow">So lernst du hier</div>
          <ol class="steps">
            <li><strong>Raten, lesen, abrufen.</strong> Vor jedem Text eine Frage, nach jedem Text eine Zusammenfassung aus dem Kopf. Abrufen hält eine Woche später etwa ein Drittel mehr im Gedächtnis als noch einmal lesen (Roediger & Karpicke 2006).</li>
            <li><strong>Quiz und Bericht.</strong> Mindestens ${PASS} % im Quiz, dann ein Bericht über etwas, das du wirklich getan hast. Hypothetisches zählt nicht.</li>
            <li><strong>Prüfung je Modul.</strong> ${PASS} % oder zurück in die Lektionen. Kein Überspringen.</li>
            <li><strong>Wiederholen.</strong> Alte Fragen kommen in wachsenden Abständen wieder, höchstens ${SRS_MAX_TAG} am Tag.</li>
            <li><strong>Draußen üben.</strong> Drills, Rollenspiele, 30 Tage Ablehnungstraining. Alles freiwillig, alles zählt.</li>
          </ol>
          <p class="muted small">Die Strenge steckt im Stoff und in den ${PASS} %, nicht in Ranglisten oder Erinnerungen mit schlechtem Gewissen.</p></div>
        <form id="onboarding" class="card">
          <div class="eyebrow">Einrichtung</div>
          <label>Dein Vorname <input name="name" required placeholder="So spricht dich der Coach an"></label>
          <label>Dein Wenn-Dann-Plan <input name="plan" placeholder="Wenn ich morgens den Kaffee aufsetze, dann mache ich 15 Minuten Akademie."></label>
          <p class="muted small">Ein konkreter Auslöser plus eine konkrete Handlung. Menschen mit so einem Plan setzen Vorsätze etwa doppelt so oft um (Gollwitzer & Sheeran 2006, 94 Studien). Du kannst ihn später ändern.</p>
          <label>Textgröße <select name="textsize"><option value="normal">Normal</option><option value="gross">Groß</option><option value="sehr-gross">Sehr groß</option></select></label>
          <p class="muted small">Der KI-Coach braucht später einen eigenen Anthropic-API-Schlüssel (Einstellungen). Ohne Schlüssel funktioniert alles andere.</p>
          <div class="btn-row"><button class="btn primary" type="submit">Los geht's</button><label class="btn ghost">Sicherung importieren <input type="file" id="import-file" accept="application/json" hidden></label></div>
        </form>
      </div>`;
  }
  // Erste Schritte: Checkliste für die erste Woche. Der erste Punkt ist schon erledigt (Einrichtung), weil begonnene Listen eher beendet werden (Nunes & Drèze 2006).
  function ersteSchritte() {
    const drillsAny = Object.keys(S.drills).some(k => /^(tag_|ew_|kt_|fall_|wb_|rp_|kd_)/.test(k));
    const steps = [
      { name: 'Einrichtung', text: 'Name und Wenn-Dann-Plan festgelegt.', done: true, route: '#/einstellungen' },
      { name: 'Erste Lektion lesen und aus dem Kopf zusammenfassen', text: 'Lektion 1.1, etwa 15 Minuten. Der Abruf nach dem Lesen ist der Teil, der hängen bleibt.', done: Object.keys(S.abruf).length > 0 || Object.keys(S.lessonsDone).length > 0, route: '#/lektion/grundlagen/g1' },
      { name: 'Erstes Quiz bestehen', text: `Mindestens ${PASS} %. Die Optionen siehst du erst, wenn du selbst eine Antwort im Kopf hast.`, done: Object.keys(S.quiz).some(quizPassed) || Object.keys(S.lessonsDone).length > 0, route: '#/lektion/grundlagen/g1' },
      { name: 'Ersten Bericht schreiben', text: 'Über etwas, das du wirklich getan hast. Hypothetisches zählt nicht.', done: Object.values(S.reports).flat().some(r => r.bestanden), route: '#/lektion/grundlagen/g1' },
      { name: 'Einen Drill machen', text: 'Fünf Minuten Einwand-Drill: schreiben, Muster vergleichen, selbst bewerten.', done: drillsAny, route: '#/einwaende' },
      { name: 'Erstes Nein sammeln', text: 'Tag 1 des Ablehnungstrainings. Es geht nicht um das Ja.', done: S.nein.length >= 1 || Object.keys(S.ablehnung).length >= 1, route: '#/training' },
    ];
    const n = steps.filter(x => x.done).length;
    // Wer schon eine Modulprüfung bestanden hat, ist über die erste Woche hinaus: Liste weg, Startseite kürzer.
    if (S.tourWeg || n === steps.length || KURSE.some(k => examPassed(k.id))) return '';
    const next = steps.find(x => !x.done);
    return `<div class="card tour"><div class="eyebrow">Erste Schritte · ${n} von ${steps.length}</div>
      <div class="bar"><div class="bar-fill" style="width:${Math.round(n / steps.length * 100)}%"></div></div>
      <ol class="tour-list">${steps.map(x => `<li class="${x.done ? 'done' : x === next ? 'next' : ''}"><span class="ms-icon">${x.done ? '✓' : '○'}</span><span><a href="${x.route}">${esc(x.name)}</a>${x === next ? `<br><span class="muted small">${esc(x.text)}</span>` : ''}</span></li>`).join('')}</ol>
      <div class="btn-row"><a class="btn small primary" href="${next.route}">${esc(next.name)} →</a><button class="btn small ghost" data-act="tour-weg">Liste ausblenden</button></div>
      ${!S.apiKey ? '<p class="muted small">Optional: Mit eigenem API-Schlüssel (Einstellungen) bewertet der Coach Berichte, Fälle und Rollenspiele. Ohne Schlüssel läuft alles andere.</p>' : ''}</div>`;
  }
  function wochenrueckblick() {
    const tage = (n) => { const out = []; const d = new Date(); d.setDate(d.getDate() - n); for (let i = 0; i < 7; i++) { out.push(d.toISOString().slice(0, 10)); d.setDate(d.getDate() - 1); } return out; };
    const diese = tage(0), vorige = tage(7);
    const inWeek = (ts, week) => week.includes(new Date(ts).toISOString().slice(0, 10));
    const row = (name, f) => ({ name, a: f(diese), b: f(vorige) });
    const rows = [
      row('Aktive Tage', w => w.filter(d => S.activity[d]).length),
      row('Lektionen abgeschlossen', w => Object.values(S.lessonsDone).filter(ts => inWeek(ts, w)).length),
      row('Karten wiederholt', w => w.reduce((a, d) => a + (S.srsLog[d] || 0), 0)),
      row('Berichte bestanden', w => Object.values(S.reports).flat().filter(r => r.bestanden && inWeek(r.ts, w)).length),
      row('Neins gesammelt', w => S.nein.filter(n => inWeek(n.ts, w)).length),
      row('Rollenspiele', w => drillCount('rp_', w)),
      row('Einwände geübt', w => drillCount('ew_', w)),
      row('Kontrast-Drills', w => drillCount('kt_', w)),
      row('Schritt-für-Schritt-Stufen', w => Object.entries(S.drills).filter(([k, v]) => k.startsWith('wb_') && v && inWeek(v.ts, w)).length),
      row('Fälle bearbeitet', w => drillCount('fall_', w)),
    ];
    function drillCount(prefix, w) { return Object.entries(S.drills).filter(([k]) => k.startsWith(prefix)).flatMap(([, v]) => Array.isArray(v) ? v : []).filter(r => inWeek(r.ts, w)).length; }
    if (rows.every(r => r.a === 0 && r.b === 0)) return '';
    return `<div class="card week"><div class="eyebrow">Wochenrückblick · letzte 7 Tage</div>
      <table class="week-table"><thead><tr><th></th><th>Diese Woche</th><th>Vorwoche</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.name}</td><td class="wk">${r.a}</td><td class="wk muted">${r.b}${r.a > r.b ? ' <span class="up">↑</span>' : r.a < r.b ? ' <span class="down">↓</span>' : ''}</td></tr>`).join('')}</tbody></table>
      ${kalibZeile()}
      ${wochenEmpfehlung(rows)}</div>`;
  }
  // Eine Empfehlung für die kommende Woche, aus den Zahlen abgeleitet. Immer nur eine, mit Link und Zeitangabe.
  function wochenEmpfehlung(rows) {
    const g = (name) => rows.find(r => r.name === name) || { a: 0, b: 0 };
    const box = (t) => `<div class="callout practice wochen-tipp"><div class="label">Nächste Woche</div>${t}</div>`;
    const aktiv = g('Aktive Tage');
    if (aktiv.a <= 2 && aktiv.b <= 2 && Object.keys(S.activity).length >= 3) return box(`Zwei kurze Einheiten schlagen eine lange: ${aktiv.a === 1 ? "ein aktiver Tag" : aktiv.a + " aktive Tage"} diese Woche. Leg zwei feste Tage mit je 15 Minuten fest, ${S.plan ? 'dein Wenn-Dann-Plan steht schon' : `<a href="#/einstellungen">ein Wenn-Dann-Plan</a> hilft dabei`} (verteiltes Lernen, Cepeda et al. 2006).`);
    const f = srsFaellig(); if (f.due.length >= 10 && g('Karten wiederholt').a === 0) return box(`${f.due.length} Karten warten, und diese Woche hast du keine wiederholt. <a href="#/wiederholen">Zehn Minuten Wiederholung</a> an zwei Tagen holen das auf, bevor die Lücken in die nächste Prüfung wandern.`);
    const leer = [
      ['Neins gesammelt', `Zwei Wochen ohne ein Nein. <a href="#/journal">Ein Nein diese Woche</a>: eine Frage stellen, deren Antwort wahrscheinlich Nein ist, und das Ergebnis eintragen (10 Minuten).`],
      ['Einwände geübt', `Zwei Wochen ohne Einwand-Drill. <a href="#/einwaende">Ein Einwand</a>, laut beantwortet und selbst bewertet, dauert fünf Minuten.`],
      ['Rollenspiele', `Zwei Wochen ohne Rollenspiel. <a href="#/rollenspiel">Eines offline</a> mit Vorbereitungsplan, 15 Minuten, und das Fazit mit dem Plan vergleichen.`],
      ['Berichte bestanden', `Zwei Wochen ohne Bericht. Der nächste Bericht über ein echtes Gespräch zählt mehr als jede weitere Lektion: <a href="${nextStep().route}">weiter im Curriculum</a>.`],
      ['Fälle bearbeitet', `Zwei Wochen ohne Fall. <a href="#/faelle">Ein Checkpoint-Fall</a> prüft, ob du das Gelernte ohne Methodennamen anwendest (20 Minuten).`],
    ];
    for (const [name, text] of leer) { const r = g(name); if (r.a === 0 && r.b === 0) return box(text); }
    const runter = rows.filter(r => r.b > 0 && r.a < r.b).sort((x, y) => (y.b - y.a) - (x.b - x.a))[0];
    if (runter) return box(`„${runter.name}“ ist von ${runter.b} auf ${runter.a} gefallen. Halte diese Zahl nächste Woche, der Rest läuft.`);
    return box('Alle Zeilen laufen. Nächste Stufe: ein Rollenspiel mit Vorbereitungsplan oder ein Fall, den du noch nicht bearbeitet hast.');
  }
  // Selbsteinschätzung: Trefferquote bei „sicher“ gegen „unsicher“, dazu die blinden Flecken (sicher und falsch) mit Fundstelle.
  function kalibKarte() {
    const c = S.kalib; const n = c.sicher + c.unsicher; const blindIds = Object.keys(S.blind);
    if (!n && !blindIds.length) return '';
    const ps = c.sicher ? Math.round(c.sicherOk / c.sicher * 100) : null, pu = c.unsicher ? Math.round(c.unsicherOk / c.unsicher * 100) : null;
    let deutung = `Noch zu wenig Daten (${n} von 10 Antworten). Kreuz im Quiz „Ich bin mir sicher“ an, wenn es stimmt.`;
    if (n >= 10) {
      if (ps !== null && ps < 70) deutung = `Überkonfidenz: Wo du dir sicher warst, lagst du nur zu ${ps} % richtig. Das ist der Normalfall, nicht die Ausnahme (Lichtenstein, Fischhoff & Phillips 1982). Lies bei „sicher“ die Erklärung trotzdem.`;
      else if (ps !== null && pu !== null && pu >= 80 && pu >= ps - 10) deutung = `Du unterschätzt dich: Auch wo du unsicher warst, lagst du zu ${pu} % richtig. Dein Gefühl unterscheidet kaum zwischen Wissen und Raten. Entscheide dich öfter und prüf dann.`;
      else if (ps !== null && ps >= 85) deutung = `Gut kalibriert: Dein „sicher“ ist verlässlich (${ps} % richtig)${pu !== null ? `, dein „unsicher“ liegt bei ${pu} %` : ''}. Diese Unterscheidung ist das Ziel: Sie sagt dir, was du wiederholen musst und was nicht.`;
      else deutung = `Mittelfeld: ${ps !== null ? `${ps} % richtig bei „sicher“` : 'noch nie „sicher“ angekreuzt'}${pu !== null ? `, ${pu} % bei „unsicher“` : ''}. Je größer der Abstand zwischen beiden, desto besser kennst du dein eigenes Wissen.`;
    }
    const blind = blindIds.map(id => { const [lid, qi] = id.split(':'); const fl = findLesson(lid); const q = fl && fl.lektion.quiz[Number(qi)]; return fl && q ? { lid, kid: fl.kurs.id, titel: fl.lektion.titel, frage: q.frage, ts: S.blind[id] } : null; }).filter(Boolean).sort((a, b) => b.ts - a.ts);
    // Nächster Schritt aus der Selbsteinschätzung: ein konkreter Link statt einer Diagnose ohne Folge
    let schritt = '';
    if (blind.length) { const byK = {}; for (const b of blind) byK[b.kid] = (byK[b.kid] || 0) + 1; const top = Object.entries(byK).sort((a, b) => b[1] - a[1])[0]; const kurs = KURSE.find(k => k.id === top[0]); if (kurs) schritt = `<div class="callout practice"><div class="label">Nächster Schritt</div>${top[1]} deiner blinden Flecken liegen in „${esc(kurs.titel)}“. Wiederhol die Karten unten, dann <a href="#/pruefung/${kurs.id}">leg die Modulprüfung noch einmal ab</a>: Erst wenn „sicher“ dort stimmt, trägt das Wissen im Gespräch.</div>`; }
    else if (n >= 10 && ps !== null && ps < 70) schritt = `<div class="callout practice"><div class="label">Nächster Schritt</div>Mach die nächsten zehn Quizfragen mit Gegenprobe: Sag dir vor dem Klick in einem Satz, was gegen deine Antwort spricht. Wer Gegengründe sucht, schätzt sich treffender ein (Koriat, Lichtenstein & Fischhoff 1980).</div>`;
    else if (n >= 10 && ps !== null && pu !== null && pu >= 80 && pu >= ps - 10) schritt = `<div class="callout practice"><div class="label">Nächster Schritt</div>Trau deinem Wissen im Ernstfall: Nimm dir <a href="#/einwaende">einen Einwand</a> und antworte laut, ohne vorher die Musterlösung zu lesen. Bewerte erst danach.</div>`;
    const row = (name, k, ok, p) => `<div class="kalib-row"><span class="lbl">${name} <span class="muted">(${k})</span></span><div class="bar"><div class="bar-fill" style="width:${p || 0}%"></div></div><strong>${p === null ? '–' : p + ' %'}</strong></div>`;
    return `<div class="card kalib"><div class="eyebrow">Selbsteinschätzung</div>
      <p class="muted">Bei jeder Quizfrage kannst du „Ich bin mir sicher“ ankreuzen. Hier siehst du, ob dein Gefühl die Wahrheit sagt.</p>
      ${row('Sicher', c.sicher, c.sicherOk, ps)}${row('Unsicher', c.unsicher, c.unsicherOk, pu)}
      <p class="small">${deutung}</p>${schritt}
      ${blind.length ? `<details><summary>${blind.length} blinde Flecken: sicher und trotzdem falsch</summary><ul class="wv-list">${blind.slice(0, 12).map(b => `<li><a href="#/lektion/${b.kid}/${b.lid}">${esc(b.titel)}</a><br><span class="muted small">${esc(b.frage)}</span></li>`).join('')}</ul><p class="muted small">Ein blinder Fleck verschwindet, sobald du die Karte in der Wiederholung richtig beantwortest.</p></details>` : '<p class="muted small">Kein blinder Fleck: Noch nie sicher und falsch zugleich.</p>'}</div>`;
  }
  function kalibZeile() {
    const c = S.kalib; if (c.sicher + c.unsicher < 10) return '';
    const ps = c.sicher ? Math.round(c.sicherOk / c.sicher * 100) : null, pu = c.unsicher ? Math.round(c.unsicherOk / c.unsicher * 100) : null;
    const blind = Object.keys(S.blind).length;
    return `<p class="muted small"><strong><a href="#/wiederholen">Selbsteinschätzung</a>:</strong> ${ps !== null ? `Wo du dir sicher warst, lagst du zu ${ps} % richtig` : 'Du hast dich noch nie sicher erklärt'}${pu !== null ? `, wo du unsicher warst, zu ${pu} %` : ''}. ${blind ? `${blind} blinde Flecken (sicher und falsch) liegen in der Wiederholung.` : 'Noch kein blinder Fleck.'} ${ps !== null && ps < 70 ? 'Deine Sicherheit ist größer als dein Wissen, also kreuze seltener „sicher“ an und lies die Erklärungen genauer.' : ''}</p>`;
  }
  function backupHinweis() {
    const aktiv = Object.keys(S.activity).length; const seit = Date.now() - Math.max(S.lastExport || 0, S.started || 0);
    if (aktiv < 3 || seit < 14 * 864e5) return '';
    return `<div class="callout warn"><div class="label">Sicherung</div>Dein Fortschritt liegt nur in diesem Browser. Seit ${Math.floor(seit / 864e5)} Tagen keine Sicherung. <a href="#/einstellungen">Jetzt exportieren</a> (eine Datei, 10 Sekunden).</div>`;
  }
  // ---------- Wiedervorlagen für Übungen: +1, +7, +30 Tage (sukzessives Wiederlernen) ----------
  const WV_TAGE = [1, 7, 30];
  function wiedervorlagen() {
    const now = Date.now(); const out = [];
    const name = (prefix, id) => {
      if (prefix === 'ew_') { const e = (window.EINWAENDE || []).find(x => x.id === id); return { titel: e ? `Einwand „${e.einwand}“` : 'Einwand', route: '#/einwaende/' + id, art: 'Einwand' }; }
      if (prefix === 'kt_') { const x = (window.KONTRASTE || []).find(k => k.id === id); return { titel: x ? x.titel : 'Kontrast', route: '#/kontraste/' + id, art: 'Kontrast' }; }
      if (prefix === 'fall_') { const x = (window.FAELLE || []).find(k => k.id === id); return { titel: x ? 'Fall: ' + x.titel : 'Fall', route: '#/faelle/' + id, art: 'Fall' }; }
      if (prefix === 'wb_') { const x = (window.BEISPIELE || []).find(k => k.id === id); return { titel: x ? x.titel + ' (Stufe 3 und 4 mit eigenem Fall)' : 'Schritt für Schritt', route: '#/beispiele/' + id, art: 'Prozedur' }; }
    };
    for (const [key, v] of Object.entries(S.drills)) {
      const prefix = ['ew_', 'kt_', 'fall_', 'wb_'].find(pf => key.startsWith(pf)); if (!prefix) continue;
      const id = key.slice(prefix.length);
      let last, n;
      if (Array.isArray(v)) { if (!v.length) continue; last = v[v.length - 1].ts; n = v.length; } else { if (!v || v.stufe < 4) continue; last = v.ts; n = v.n || 1; }
      const due = last + WV_TAGE[Math.min(n - 1, WV_TAGE.length - 1)] * 864e5;
      if (due <= now) out.push({ key, id, prefix, n, due, ueberfaellig: Math.floor((now - due) / 864e5), ...name(prefix, id) });
    }
    if (out.some(x => x.prefix === 'ew_') && !window.EINWAENDE) ensureEinwaende();
    if (out.some(x => x.prefix === 'fall_') && !window.FAELLE) ensureFaelle();
    if (out.some(x => x.prefix === 'kt_') && !window.KONTRASTE) ensureKontraste();
    if (out.some(x => x.prefix === 'wb_') && !window.BEISPIELE) ensureBeispiele();
    return out.sort((a, b) => a.due - b.due);
  }
  function wvTag(prefix, id) { const w = wiedervorlagen().find(x => x.prefix === prefix && x.id === id); return w ? '<span class="tag red">fällig</span>' : ''; }
  function wvCard(limit) {
    const w = wiedervorlagen(); if (!w.length) return '';
    return `<div class="card wv"><div class="eyebrow">Wiedervorlage · ${w.length} fällig</div>
      <p class="muted small">Eine Übung sitzt erst nach dem dritten Durchgang mit Abstand: nach einem Tag, nach einer Woche, nach einem Monat (sukzessives Wiederlernen, Rawson & Dunlosky 2011). Fällig heißt: nicht nachlesen, sondern noch einmal selbst antworten.</p>
      <ul class="wv-list">${w.slice(0, limit || 8).map(x => `<li><a href="${x.route}">${esc(x.titel)}</a> <span class="muted small">· ${x.n}. Durchgang war vor ${x.ueberfaellig + WV_TAGE[Math.min(x.n - 1, 2)]} Tagen</span></li>`).join('')}</ul>
      ${w.length > (limit || 8) ? `<p class="muted small">und ${w.length - (limit || 8)} weitere auf der <a href="#/training">Trainingsseite</a>.</p>` : ''}</div>`;
  }
  function heute() {
    const t0 = new Date(); t0.setHours(0, 0, 0, 0); const t0ms = t0.getTime();
    const ns = nextStep();
    const lernen = Object.values(S.quiz).some(q => q.ts >= t0ms) || Object.values(S.lessonsDone).some(ts => ts >= t0ms) || Object.values(S.exams).some(e => e.attempts.some(a => a.ts >= t0ms));
    const drill = Object.entries(S.drills).some(([k, v]) => (Array.isArray(v) ? (/^(tag_|kd_|rp_|ew_|kt_|fall_)/.test(k) && v.some(x => x.ts >= t0ms)) : (k.startsWith('wb_') && v && v.ts >= t0ms)));
    const nein = S.nein.some(n => n.ts >= t0ms) || Object.values(S.ablehnung).some(a => a.ts >= t0ms);
    const f = srsFaellig(); const wdh = Math.min(f.due.length, f.rest);
    return [
      { name: 'Lernen', text: ns.text, done: lernen, route: ns.route },
      { name: 'Wiederholen', text: wdh ? `${wdh} Karte${wdh === 1 ? '' : 'n'} fällig, etwa ${Math.max(1, Math.round(wdh / 2))} Min` : f.heute ? `${f.heute} heute wiederholt` : 'Noch nichts fällig', done: wdh === 0 && (f.heute > 0 || srsKarten().length === 0), route: '#/wiederholen' },
      (() => { const w = wiedervorlagen(); return { name: 'Üben', text: w.length ? `${w.length} Wiedervorlage${w.length > 1 ? 'n' : ''} fällig: ${w[0].titel}${w.length > 1 ? ' …' : ''}` : 'Ein Drill, ein Rollenspiel, ein Einwand, ein Kontrast-Fall oder ein Körper-Drill', done: drill && !w.length, route: w.length ? w[0].route : '#/training' }; })(),
      { name: 'Raus', text: 'Ein Nein holen oder den Tag im Ablehnungstraining abschließen', done: nein, route: '#/journal' }
    ];
  }
  // Tagesplan: was heute offen ist, in Minuten. Karten etwa eine halbe Minute, Wiedervorlagen etwa drei, Lektion laut Angabe, Prüfung etwa zehn.
  function tagesplan() {
    const t0 = new Date(); t0.setHours(0, 0, 0, 0); const t0ms = t0.getTime();
    const f = srsFaellig(); const wdh = Math.min(f.due.length, f.rest); const w = wiedervorlagen(); const ns = nextStep();
    const teile = [];
    if (wdh) teile.push({ min: Math.max(1, Math.round(wdh / 2)), text: `${wdh} Karten`, route: '#/wiederholen' });
    if (w.length) teile.push({ min: w.length * 3, text: `${w.length} Wiedervorlage${w.length > 1 ? 'n' : ''}`, route: w[0].route });
    const lernenHeute = Object.values(S.lessonsDone).some(ts => ts >= t0ms) || Object.values(S.exams).some(e => e.attempts.some(a => a.ts >= t0ms));
    if (!lernenHeute && ns.lektion) teile.push({ min: parseInt(ns.lektion.dauer, 10) || 12, text: `Lektion ${ns.kurs.nr}.${lessonIndex(ns.kurs, ns.lektion.id) + 1}`, route: ns.route });
    else if (!lernenHeute && ns.kurs) teile.push({ min: 10, text: `Modulprüfung ${ns.kurs.nr}`, route: ns.route });
    if (!teile.length) return `<p class="tagesplan muted small">Für heute ist nichts offen. Ein Nein oder ein Drill hält die Serie.</p>`;
    const sum = teile.reduce((a, t) => a + t.min, 0);
    return `<p class="tagesplan small"><strong>Heute etwa ${sum} Minuten:</strong> ${teile.map(t => `<a href="${t.route}">${t.text}</a>${teile.length > 1 ? ` (${t.min} Min)` : ''}`).join(' · ')}. ${sum > 30 ? 'Fang mit den Karten an, die sind am schnellsten vergessen.' : 'Das passt in eine Kaffeepause.'}</p>`;
  }
  function meilensteine() {
    const rpPassed = Object.entries(S.drills).some(([k, v]) => k.startsWith('rp_') && v.some(r => rpStatus(r).s === 2));
    const exams = KURSE.filter(k => examPassed(k.id)).length;
    return [
      { name: 'Erste Lektion', text: 'Erste Lektion komplett abgeschlossen', done: Object.keys(S.lessonsDone).length >= 1 },
      { name: 'Erstes Nein', text: 'Erstes Nein im Ablehnungstagebuch', done: S.nein.length >= 1 },
      { name: 'Erste Prüfung', text: 'Erste Modulprüfung bestanden', done: exams >= 1 },
      { name: '7 Tage', text: 'Sieben Tage in Folge trainiert', done: S.streakBest >= 7 },
      { name: '10 Neins', text: 'Zehn Neins gesammelt', done: S.nein.length >= 10 },
      { name: 'Rollenspiel', text: 'Ein Rollenspiel bestanden', done: rpPassed },
      { name: 'Beweisbuch', text: 'Fünf Belege im Beweisbuch', done: S.beweis.length >= 5 },
      { name: 'Mythenjäger', text: 'Mythen-Check mit 9 oder mehr von 10', done: (S.drills.mythen || []).some(m => m.score >= 9) },
      { name: '100 Wiederholungen', text: 'Hundert Karten in der Abstandswiederholung beantwortet', done: Object.values(S.srs).reduce((a, x) => a + x.n, 0) >= 100 },
      { name: 'Halbzeit', text: 'Fünf Module bestanden', done: exams >= 5 },
      { name: '30 Tage', text: 'Ablehnungstraining abgeschlossen', done: Object.keys(S.ablehnung).length >= 30 },
      { name: '30 Tage Serie', text: 'Dreißig Tage in Folge trainiert', done: S.streakBest >= 30 },
      { name: 'Meister', text: 'Alle zehn Module bestanden', done: exams >= KURSE.length }
    ];
  }
  function kursCard(k) {
    const un = moduleUnlocked(k); const p = moduleProgress(k);
    return `<div class="card clickable ${un ? '' : 'locked'}" data-route="#/kurs/${k.id}">
      <div class="num">${k.nr}</div>
      <div class="meta">${k.lektionen.length} Lektionen · Prüfung ${examPassed(k.id) ? '<span class="tag green">bestanden</span>' : un ? '' : lock('Vorheriges Modul zuerst bestehen')}</div>
      <h3>${esc(k.titel)}</h3><p class="muted">${esc(k.untertitel)}</p>
      <div class="bar"><div class="bar-fill" style="width:${p}%"></div></div></div>`;
  }

  route('kurs', ([kid]) => {
    const k = kursById(kid); if (!k) return routes.start();
    const un = moduleUnlocked(k);
    return `
      <div class="breadcrumb"><a href="#/">Übersicht</a> › Modul ${k.nr}</div>
      <section class="hero small">
        <div class="eyebrow">Modul ${k.nr} von ${KURSE.length}</div>
        <h1>${esc(k.titel)}</h1>
        <p class="lead">${esc(k.untertitel)}</p>
        <p>${esc(k.beschreibung)}</p>
        ${un ? '' : `<div class="callout warn"><div class="label">Gesperrt</div>Du musst erst die Prüfung von Modul ${k.nr - 1} bestehen.</div>`}
        ${S.einstufung && S.einstufung.module[k.id] ? `<p class="muted small">Einstufung: ${S.einstufung.module[k.id].ok} von ${S.einstufung.module[k.id].n} richtig${S.einstufung.module[k.id].ok === S.einstufung.module[k.id].n ? '. Vorwissen vorhanden, achte auf die Gegenproben.' : S.einstufung.module[k.id].ok === 0 ? '. Hier gründlich lesen.' : '.'}</p>` : ''}
      </section>
      <div class="lesson-list">
        ${k.lektionen.map((l, i) => {
          const ul = lessonUnlocked(k, i); const done = lessonDone(l.id);
          return `<div class="card ${ul ? 'clickable' : 'locked'}" ${ul ? `data-route="#/lektion/${k.id}/${l.id}"` : ''}>
            <div class="num">${k.nr}.${i + 1}</div>
            <div class="meta"><span>${l.dauer}</span>${done ? '<span class="tag green">abgeschlossen</span>' : quizPassed(l.id) ? '<span class="tag gold">Bericht offen</span>' : ul ? '' : lock('Vorherige Lektion abschließen')}</div>
            <h3>${esc(l.titel)}</h3>${l.lernziele ? `<p class="muted small-note">${esc(l.lernziele[0])}</p>` : ''}</div>`;
        }).join('')}
        <div class="card ${allLessonsDone(k) ? 'clickable exam' : 'locked'}" ${allLessonsDone(k) ? `data-route="#/pruefung/${k.id}"` : ''}>
          <div class="num">★</div>
          <div class="meta"><span>Mindestens ${PASS} %</span>${examPassed(k.id) ? `<span class="tag green">bestanden mit ${S.exams[k.id].best} %</span>` : allLessonsDone(k) ? '<span class="tag gold">freigeschaltet</span>' : lock('Alle Lektionen abschließen')}</div>
          <h3>Modulprüfung ${k.nr}</h3></div>
      </div>`;
  });

  route('lektion', ([kid, lid]) => {
    const k = kursById(kid); if (!k) return routes.start();
    const i = lessonIndex(k, lid); const l = k.lektionen[i]; if (!l) return routes.kurs([kid]);
    if (!lessonUnlocked(k, i)) return `<div class="callout warn"><div class="label">Gesperrt</div>Diese Lektion ist noch nicht freigeschaltet. <a href="#/kurs/${k.id}">Zurück zum Modul</a></div>`;
    const qp = quizPassed(lid); const reps = S.reports[lid] || [];
    const next = k.lektionen[i + 1];
    const vf = S.vorfragen[lid]; const ab = S.abruf[lid]; const done = lessonDone(lid);
    const brauchtVorfrage = !!l.vorfrage && !vf && !done;
    const brauchtAbruf = !!l.kernpunkte && !ab && !done;
    return `
      <div class="read-progress"><div id="read-bar"></div></div>
      <div class="breadcrumb"><a href="#/">Übersicht</a> › <a href="#/kurs/${k.id}">Modul ${k.nr}</a> › Lektion ${k.nr}.${i + 1}</div>
      <article class="lesson">
        <div class="eyebrow">Lektion ${k.nr}.${i + 1} · ${l.dauer} Lesen · plus Quiz und Aufgabe</div>
        <h1>${esc(l.titel)}</h1>
        ${done && l.kernpunkte ? `<div class="callout study mitnehmen"><div class="label">Abgeschlossen am ${new Date(S.lessonsDone[lid]).toLocaleDateString('de-DE')}</div><strong>Mitnehmen:</strong> ${esc(l.kernpunkte[0])} ${next ? `<a href="#/lektion/${k.id}/${next.id}">Weiter mit ${k.nr}.${i + 2} ${esc(next.titel)}</a>` : `<a href="#/pruefung/${k.id}">Zur Modulprüfung</a>`}</div>` : ''}
        ${l.lernziele ? `<div class="callout ziele"><div class="label">Nach dieser Lektion kannst du</div><ul>${l.lernziele.map(z => `<li>${esc(z)}</li>`).join('')}</ul></div>` : ''}
        ${l.vorfrage ? `<section class="card vorfrage ${vf ? 'done' : ''}"><div class="eyebrow">Bevor du liest</div><p class="q">${esc(l.vorfrage)}</p>
          ${vf ? `<div class="log-entry"><div class="meta">Deine Antwort vor dem Lesen</div><div class="body">${esc(vf.text)}</div></div>` : `<p class="muted small-note">Rate aus dem Bauch, ein Satz reicht. Falsch liegen ist hier erwünscht: Wer vorher rät, behält die richtige Antwort besser (Pretesting-Effekt, Richland et al. 2009).</p><form class="vorfrage-form" data-lid="${lid}"><textarea class="journal" rows="3" aria-label="Deine Antwort auf die Vorab-Frage" placeholder="Ich vermute, dass …"></textarea><div class="btn-row"><button class="btn primary small" type="submit">Antwort festhalten und lesen</button></div></form>`}</section>` : ''}
        ${brauchtVorfrage ? `<div class="muted locked-note">${lock('')} Der Text erscheint, sobald du deine Vorab-Antwort festgehalten hast.</div>` : `${l.inhalt}
        ${(() => { if (!window.KONTRASTE || !window.BEISPIELE) { ensureKontraste(); ensureBeispiele(); return ''; } const kt = window.KONTRASTE.filter(x => x.lektion === lid); const wb = window.BEISPIELE.filter(x => x.lektion === lid); if (!kt.length && !wb.length) return ''; return `<div class="callout practice vertiefen"><div class="label">Vertiefen</div>${kt.map(x => `<div><strong>Nicht verwechseln:</strong> <a href="#/kontraste/${x.id}">${esc(x.titel)}</a> · Vergleichstabelle und Fälle ohne Nennung der Methode</div>`).join('')}${wb.map(x => `<div><strong>Schritt für Schritt:</strong> <a href="#/beispiele/${x.id}">${esc(x.titel)}</a> · Beispiel mit Begründung, dann Lücke, dann allein, dann neuer Kontext</div>`).join('')}</div>`; })()}
        <div class="sources"><strong>Quellen</strong><ol>${(l.quellen || []).map(q => `<li>${q}</li>`).join('')}</ol></div>`}
      </article>
      ${l.kernpunkte && !brauchtVorfrage ? `<section class="card abruf" id="abruf-box"><h2>Abruf</h2>
        ${ab ? `<div class="two-col"><div><div class="eyebrow">Deine Zusammenfassung</div><p>${esc(ab.text)}</p></div><div><div class="eyebrow">Kernpunkte der Lektion</div><ul class="kern">${l.kernpunkte.map(z => `<li>${esc(z)}</li>`).join('')}</ul></div></div>${l.selbsterklaerung ? `<div class="callout ziele selbst"><div class="label">Erklär es dir selbst</div><p class="muted small-note">Beantworte die Fragen laut oder im Kopf, bevor du zum Quiz gehst. Wer das Warum selbst erklärt, behält den Stoff länger als wer eine fertige Erklärung liest (Chi et al. 1994).</p><ul>${l.selbsterklaerung.map(z => `<li>${esc(z)}</li>`).join('')}</ul></div>` : ''}${vf ? `<p class="muted small-note">Vorab hattest du geantwortet: „${esc(vf.text)}“. Was stimmte, was nicht?</p>` : ''}${ab.coach ? `<div class="callout study"><div class="label">Coach zum Abruf</div>${md(ab.coach)}</div>` : S.apiKey ? `<div class="btn-row"><button class="btn small ghost" data-act="abruf-coach" data-lid="${lid}">Coach: Was fehlt in meiner Zusammenfassung?</button></div>` : ''}`
        : `<p class="muted">Schließ die Augen und schreib aus dem Kopf auf, was du behalten hast: drei bis fünf Sätze, ohne nach oben zu scrollen. Das Abrufen selbst festigt stärker als nochmal lesen (Karpicke & Blunt 2011; Dunlosky et al. 2013). Danach siehst du die Kernpunkte zum Vergleich.</p>
          <form class="abruf-form" data-lid="${lid}"><textarea class="journal" rows="5" aria-label="Abruf: Was ist aus der Lektion hängen geblieben?" placeholder="Was war der Kern? Welche Zahl, welcher Name, welche Regel?"></textarea><div class="count muted"><span class="n">0</span> / 120 Zeichen</div><div class="btn-row"><button class="btn primary small" type="submit">Mit Kernpunkten vergleichen</button></div></form>`}
      </section>` : ''}
      <section class="card ${brauchtAbruf || brauchtVorfrage ? 'locked' : ''}" id="quiz-box">
        <h2>Wissensprüfung</h2>
        ${brauchtAbruf || brauchtVorfrage ? `<p class="muted">${lock('')} Erst ${brauchtVorfrage ? 'die Vorab-Frage beantworten' : 'den Abruf schreiben'}.</p>` : `<p class="muted">${l.quiz.length} Fragen. Mindestens ${PASS} %. ${qp ? `<span class="tag green">bestanden (${S.quiz[lid].score}/${S.quiz[lid].total})</span>` : S.quiz[lid] ? `<span class="tag">letzter Versuch ${S.quiz[lid].score}/${S.quiz[lid].total}</span>` : ''}</p>
        ${renderQuiz(l.quiz, lid)}`}
      </section>
      <section class="card ${qp ? '' : 'locked'}" id="report-box">
        <h2>Praxisaufgabe</h2>
        <div class="callout practice"><div class="label">Aufgabe</div>${esc(l.uebung)}</div>
        ${qp ? renderReportForm(lid, reps) : `<p class="muted">${lock('')} Erst das Quiz bestehen.</p>`}
      </section>
      <div class="btn-row">
        ${lessonDone(lid) ? (next ? `<a class="btn primary" href="#/lektion/${k.id}/${next.id}">Nächste Lektion →</a>` : `<a class="btn primary" href="#/pruefung/${k.id}">Zur Modulprüfung →</a>`) : `<span class="muted">Quiz bestehen und Bericht abgeben, um fortzufahren.</span>`}
        <a class="btn ghost" href="#/kurs/${k.id}">Modulübersicht</a>
      </div>`;
  });

  // Rückblick: zwei Fragen aus früher abgeschlossenen Lektionen wandern in jedes Lektionsquiz (verschachteltes Üben, Rohrer & Taylor 2007).
  const RUECKBLICK_N = 2; const quizSets = {};
  function hashStr(t) { let h = 7; for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; }
  function rueckblickFragen(lid) {
    const pool = [];
    for (const k of KURSE) for (const l of k.lektionen) { if (l.id === lid) { k._stop = true; } if (k._stop) continue; if (lessonDone(l.id)) l.quiz.forEach((q, qi) => pool.push({ ...q, srsId: l.id + ':' + qi, rueckblick: `Lektion ${k.nr}.${lessonIndex(k, l.id) + 1} · ${l.titel}` })); }
    KURSE.forEach(k => delete k._stop);
    if (!pool.length) return [];
    const seed = hashStr(lid + ':' + ((S.quiz[lid] || {}).versuche || 0)); const out = [];
    for (let i = 0; i < RUECKBLICK_N && pool.length; i++) { const idx = (seed + i * 7919) % pool.length; out.push(pool.splice(idx, 1)[0]); }
    return out;
  }
  function quizSet(lid) { const l = findLesson(lid).lektion; const set = l.quiz.map((q, qi) => ({ ...q, srsId: lid + ':' + qi })).concat(rueckblickFragen(lid)); quizSets[lid] = set; return set; }
  function renderQuiz(quiz, lid) {
    quiz = quizSet(lid);
    return `<form class="quiz" data-lid="${lid}">
      <p class="muted small-note">Formuliere zu jeder Frage erst eine Antwort im Kopf und zeige dann die Optionen. Wer erst abruft und dann wiedererkennt, behält mehr als wer nur ankreuzt.${quiz.some(q => q.rueckblick) ? ' Die Rückblick-Fragen fühlen sich schwerer an als reines Wiederholen; das ist gewollt und der Grund, warum sie wirken.' : ''}</p>
      ${quiz.map((q, qi) => `<div class="quiz-q" data-qi="${qi}">${q.rueckblick ? `<div class="eyebrow">Rückblick · ${esc(q.rueckblick)}</div>` : ''}<div class="q">${q.typ === 'anwendung' ? '<span class="tag gold">Anwendung</span> ' : ''}${qi + 1}. ${esc(q.frage)}</div>
        <button class="btn small ghost show-opts" type="button" data-act="show-opts">Ich habe eine Antwort im Kopf. Optionen zeigen</button>
        <div class="opts" hidden>${shuffle(q.optionen.map((o, oi) => oi)).map(oi => `<label class="opt" data-oi="${oi}"><input type="radio" name="q${qi}" value="${oi}"> <span>${esc(q.optionen[oi])}</span></label>`).join('')}
        <label class="sure"><input type="checkbox" name="s${qi}"> <span>Ich bin mir sicher</span></label></div>
        <div class="explain" hidden>${esc(q.erklaerung)}</div></div>`).join('')}
      <p class="muted small-note">Kreuze „Ich bin mir sicher“ nur an, wenn du wetten würdest. Sicher und falsch ist der teuerste Fehler, deshalb landen solche Fragen morgen in der Wiederholung.</p>
      <div class="btn-row"><button class="btn primary" type="submit">Auswerten</button><div class="score" id="score-${lid}"></div></div></form>`;
  }
  function gradeQuiz(form) {
    const lid = form.dataset.lid; let kurs, lesson;
    for (const k of KURSE) { const l = k.lektionen.find(x => x.id === lid); if (l) { kurs = k; lesson = l; } }
    const quiz = quizSets[lid] || lesson.quiz; let score = 0; let missing = 0; const blind = [];
    form.querySelectorAll('.opts[hidden]').forEach(o => { o.hidden = false; });
    if (quiz.some((q, qi) => !form.querySelector(`input[name="q${qi}"]:checked`))) { missing = quiz.filter((q, qi) => !form.querySelector(`input[name="q${qi}"]:checked`)).length; toast(`${missing} Frage(n) unbeantwortet.`, 'bad'); return; }
    quiz.forEach((q, qi) => {
      const box = form.querySelector(`[data-qi="${qi}"]`); const sel = form.querySelector(`input[name="q${qi}"]:checked`);
      box.querySelectorAll('.opt').forEach(o => o.classList.remove('correct', 'wrong'));
      const ok = Number(sel.value) === q.richtig; if (ok) score++;
      const sure = !!form.querySelector(`input[name="s${qi}"]:checked`);
      if (sure) { S.kalib.sicher++; if (ok) S.kalib.sicherOk++; } else { S.kalib.unsicher++; if (ok) S.kalib.unsicherOk++; }
      if (sure && !ok) { blind.push(qi); box.classList.add('blind'); if (q.srsId) { S.srs[q.srsId] = Object.assign(S.srs[q.srsId] || { n: 0, richtig: 0 }, { box: 0, due: today() }); S.blind[q.srsId] = Date.now(); } }
      box.querySelector(`.opt[data-oi="${sel.value}"]`).classList.add(ok ? 'correct' : 'wrong');
      box.querySelector(`.opt[data-oi="${q.richtig}"]`).classList.add('correct');
      box.querySelector('.explain').hidden = false;
      if (!ok && q.warumFalsch && q.warumFalsch[Number(sel.value)]) box.querySelector('.explain').insertAdjacentHTML('afterbegin', `<span class="wf"><strong>Warum deine Antwort nicht stimmt:</strong> ${esc(q.warumFalsch[Number(sel.value)])}</span> `);
      if (sure && !ok) box.querySelector('.explain').insertAdjacentHTML('afterbegin', '<strong>Blinder Fleck: sicher und falsch.</strong> ');
    });
    const pct = Math.round(score / quiz.length * 100);
    S.quiz[lid] = { score, total: quiz.length, ts: Date.now(), versuche: ((S.quiz[lid] || {}).versuche || 0) + 1 }; touch(); save();
    $('#score-' + lid).innerHTML = `${score}/${quiz.length} · ${pct} % · ${pct >= PASS ? '<span class="tag green">bestanden</span>' : '<span class="tag red">nicht bestanden, Lektion nochmal lesen</span>'}${blind.length ? ` · <span class="tag red">${blind.length} blinde${blind.length === 1 ? 'r' : ''} Fleck${blind.length === 1 ? '' : 'e'}</span>` : ''}`;
    form.querySelectorAll('input').forEach(i => i.disabled = true);
    if (pct >= PASS) { toast('Quiz bestanden. Jetzt die Praxisaufgabe.', 'good'); setTimeout(navigate, 900); }
    else { form.querySelector('button[type=submit]').textContent = 'Nochmal versuchen'; form.querySelector('button[type=submit]').onclick = (e) => { e.preventDefault(); navigate(); }; }
  }

  function renderReportForm(lid, reps) {
    const last = reps[reps.length - 1];
    return `${reps.map(r => `<div class="log-entry ${r.bestanden ? 'ok' : 'fail'}"><div class="meta"><span>${fmtTime(r.ts)}</span>${r.bestanden ? '<span class="tag green">bestanden</span>' : '<span class="tag red">nicht bestanden</span>'}${r.note ? `<span>Note ${r.note}/10</span>` : ''}<span>${esc(r.von)}</span></div><div class="body">${esc(r.text).slice(0, 400)}${r.text.length > 400 ? '…' : ''}</div>${r.feedback ? `<div class="feedback">${md(r.feedback)}</div>` : ''}</div>`).join('')}
      ${reportDone(lid) ? '' : `<form class="report" data-lid="${lid}">
        <p class="muted">Schreibe, was du konkret getan hast, was passiert ist und was du daraus lernst. Hypothetische Aussagen („ich würde…“) zählen nicht. Mindestens ${REPORT_MIN} Zeichen.</p>
        <textarea class="journal" rows="8" aria-label="Bericht über ein echtes Gespräch" placeholder="Was habe ich getan? Was ist passiert? Was ändere ich beim nächsten Mal?">${last && !last.bestanden ? esc(last.text) : ''}</textarea>
        <div class="count muted"><span class="n">0</span> / ${REPORT_MIN} Zeichen</div>
        <div class="btn-row">
          <button class="btn primary" type="submit" data-mode="${S.apiKey ? 'coach' : 'self'}">${S.apiKey ? 'Vom Coach prüfen lassen' : 'Selbst-Check abgeben'}</button>
          <button class="btn small ghost" type="button" data-act="report-vorlage">Vorlage einfügen</button>
          ${S.apiKey ? '' : '<span class="muted">Ohne API-Schlüssel prüft ein strenger Selbst-Check. Mit Schlüssel bewertet der Coach.</span>'}
        </div></form>`}`;
  }
  async function submitReport(form) {
    const lid = form.dataset.lid; const text = form.querySelector('textarea').value.trim();
    if (text.length < REPORT_MIN) { toast(`Zu kurz. ${REPORT_MIN - text.length} Zeichen fehlen.`, 'bad'); return; }
    const hypo = (text.match(/\b(würde|könnte|hätte|wäre|theoretisch|vielleicht mal)\b/gi) || []).length;
    const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Wird geprüft…';
    let result;
    if (S.apiKey && window.Coach) {
      try { result = await window.Coach.gradeReport(findLesson(lid), text); }
      catch (e) { toast('Coach nicht erreichbar: ' + e.message + '. Selbst-Check wird verwendet.', 'bad'); }
    }
    if (!result) {
      const checks = [];
      const hasAction = /\b(ich habe|habe ich|ich bin|gestern|heute|vorhin|gesagt|gefragt|angerufen|getan|gemacht|geantwortet)\b/i.test(text);
      const hasOutcome = /\b(antwort|ergebnis|reagiert|gesagt|nein|ja|passiert|daraufhin)\b/i.test(text);
      const hasLearning = /\b(gelernt|nächstes mal|beim nächsten|ändern|anders|lerne|erkannt|merke)\b/i.test(text);
      if (!hasAction) checks.push('Es fehlt eine konkrete Handlung in der Vergangenheit („Ich habe…“).');
      if (!hasOutcome) checks.push('Es fehlt, was tatsächlich passiert ist (Reaktion, Antwort, Ergebnis).');
      if (!hasLearning) checks.push('Es fehlt, was du daraus beim nächsten Mal anders machst.');
      if (hypo >= 3) checks.push(`${hypo} hypothetische Formulierungen („würde“, „könnte“). Berichte, was du getan hast, nicht, was du tun würdest.`);
      result = { bestanden: checks.length === 0, note: Math.max(1, 10 - checks.length * 3), feedback: checks.length ? 'Selbst-Check nicht bestanden:\n' + checks.map(c => '- ' + c).join('\n') : 'Selbst-Check bestanden: Handlung, Ergebnis und Lernpunkt sind enthalten. Der Coach würde jetzt nachfragen: Woher weißt du, dass deine Deutung stimmt?', von: 'Selbst-Check' };
    }
    (S.reports[lid] = S.reports[lid] || []).push({ text, ts: Date.now(), ...result });
    if (result.bestanden) { S.lessonsDone[lid] = Date.now(); toast('Bericht bestanden. Lektion abgeschlossen.', 'good'); }
    else toast('Bericht nicht bestanden. Lies das Feedback und überarbeite.', 'bad');
    touch(); save(); navigate();
  }
  function findLesson(lid) { for (const k of KURSE) { const l = k.lektionen.find(x => x.id === lid); if (l) return { kurs: k, lektion: l }; } }

  // ---------- Modulprüfung ----------
  let examState = null;
  route('pruefung', ([kid]) => {
    const k = kursById(kid); if (!k) return routes.start();
    if (!allLessonsDone(k)) { const offen = k.lektionen.filter(l => !lessonDone(l.id)); return `
      <div class="breadcrumb"><a href="#/kurs/${k.id}">Modul ${k.nr}</a> › Prüfung</div>
      <section class="hero small"><div class="eyebrow">Modulprüfung · noch gesperrt</div><h1>${esc(k.titel)}</h1>
        <p class="lead">Die Prüfung öffnet sich, sobald alle ${k.lektionen.length} Lektionen abgeschlossen sind. ${offen.length === 1 ? 'Eine fehlt noch:' : `${offen.length} fehlen noch:`}</p>
        <ul class="wv-list pruefung-offen">${offen.map(l => `<li><a href="#/lektion/${k.id}/${l.id}">Lektion ${k.nr}.${lessonIndex(k, l.id) + 1} · ${esc(l.titel)}</a><span class="muted small"> · ${esc(l.dauer || '10 Min')}</span></li>`).join('')}</ul>
        <div class="btn-row"><a class="btn primary" href="#/lektion/${k.id}/${offen[0].id}">Weiter mit Lektion ${k.nr}.${lessonIndex(k, offen[0].id) + 1} →</a></div>
      </section>`; }
    const ex = S.exams[kid] || { attempts: [], passed: false, best: 0 };
    const lastFail = ex.attempts.filter(a => !a.passed).slice(-1)[0];
    const locked = lastFail && Date.now() - lastFail.ts < EXAM_COOLDOWN && !ex.passed;
    if (examState && examState.kid === kid) return renderExam(k);
    return `
      <div class="breadcrumb"><a href="#/kurs/${k.id}">Modul ${k.nr}</a> › Prüfung</div>
      <section class="hero small"><div class="eyebrow">Modulprüfung</div><h1>${esc(k.titel)}</h1>
        <p class="lead">${Math.min(12, k.lektionen.reduce((a, l) => a + l.quiz.length, 0))} Fragen aus allen Lektionen${k.nr > 1 ? ' plus 3 Rückblick-Fragen aus früheren Modulen' : ''}, zufällig gemischt. Mindestens ${PASS} %. Du beantwortest sie ohne Unterlagen und in einem Durchgang; nach einem Fehlversuch sind ${EXAM_COOLDOWN / 60000} Minuten Pause.</p>
        ${ex.attempts.length ? `<p class="muted">Versuche: ${ex.attempts.length}${ex.attempts.some(a => a.abgebrochen) ? ' (davon ' + ex.attempts.filter(a => a.abgebrochen).length + ' abgebrochen)' : ''} · Bestes Ergebnis: ${ex.best} %</p>` : ''}
        ${ex.passed ? `<div class="callout study"><div class="label">Bestanden</div>Du hast dieses Modul mit ${ex.best} % bestanden. Du kannst die Prüfung zur Übung wiederholen.</div>` : ''}
        ${locked ? `<div class="callout warn"><div class="label">Sperre</div>Nicht bestanden. Nächster Versuch in ${Math.ceil((EXAM_COOLDOWN - (Date.now() - lastFail.ts)) / 60000)} Minuten. Nutze die Zeit: Lies die Lektionen, in denen du Fehler hattest.</div>` : `<div class="btn-row"><button class="btn primary" data-act="exam-start" data-kid="${kid}">Prüfung starten</button></div>`}
      </section>`;
  });
  function startExam(kid) {
    const k = kursById(kid);
    if (kid === 'abschluss') { const pool = KURSE.flatMap(k2 => shuffle(k2.lektionen.flatMap(l => l.quiz.map((q, qi) => ({ ...q, lid: l.id, qi, kid: k2.id, lektion: `${k2.nr}.${lessonIndex(k2, l.id) + 1} ${l.titel}` })))).slice(0, 3)); examState = { kid, fragen: shuffle(pool), i: 0, antworten: [], start: Date.now() }; navigate(); return; }
    const pool = k.lektionen.flatMap(l => l.quiz.map((q, qi) => ({ ...q, lid: l.id, qi, kid: k.id, lektion: l.titel })));
    const frueher = KURSE.slice(0, KURSE.indexOf(k)).flatMap(k2 => k2.lektionen.flatMap(l => l.quiz.map((q, qi) => ({ ...q, lid: l.id, qi, kid: k2.id, lektion: `Rückblick Modul ${k2.nr} · ${l.titel}` }))));
    examState = { kid, fragen: shuffle(examAuswahl(pool, 12).concat(shuffle(frueher).slice(0, 3))), i: 0, antworten: [], start: Date.now() };
    navigate();
  }
  // Prüfungsauswahl: ein Drittel Anwendungsfragen, wenn vorhanden, Rest Wissensfragen.
  function examAuswahl(pool, n) {
    n = Math.min(n, pool.length);
    const anw = shuffle(pool.filter(q => q.typ === 'anwendung')), wis = shuffle(pool.filter(q => q.typ !== 'anwendung'));
    const na = Math.min(anw.length, Math.round(n / 3)); const pick = anw.slice(0, na).concat(wis.slice(0, n - na));
    if (pick.length < n) pick.push(...anw.slice(na, na + n - pick.length));
    return shuffle(pick);
  }
  function renderExam(k) {
    const e = examState; const q = e.fragen[e.i];
    if (!q.order) q.order = shuffle(q.optionen.map((_, i) => i));
    return `<div class="breadcrumb">${k ? 'Prüfung Modul ' + k.nr : 'Abschlussprüfung'} · Frage ${e.i + 1} von ${e.fragen.length} · Seite nicht verlassen</div>
      <div class="bar"><div class="bar-fill" style="width:${(e.i) / e.fragen.length * 100}%"></div></div>
      <section class="card exam-q"><div class="eyebrow">${esc(q.lektion)}</div><h2>${esc(q.frage)}</h2>
        ${q.order.map(oi => `<button class="opt btn-opt" data-act="exam-answer" data-oi="${oi}">${esc(q.optionen[oi])}</button>`).join('')}
      </section>`;
  }
  function examAnswer(oi) {
    const e = examState; e.antworten.push(Number(oi)); e.i++;
    if (e.i < e.fragen.length) { navigate(); return; }
    const k = kursById(e.kid); const abschluss = e.kid === 'abschluss';
    const score = e.fragen.reduce((a, q, i) => a + (q.richtig === e.antworten[i] ? 1 : 0), 0);
    const pct = Math.round(score / e.fragen.length * 100); const passed = pct >= PASS;
    const ex = S.exams[e.kid] = S.exams[e.kid] || { attempts: [], passed: false, best: 0 };
    const wrong = e.fragen.map((q, i) => ({ q, a: e.antworten[i] })).filter(x => x.q.richtig !== x.a);
    ex.attempts.push({ ts: Date.now(), pct, passed, falsch: wrong.filter(w => w.q.lid).map(w => ({ lid: w.q.lid, qi: w.q.qi, a: w.a })) }); ex.best = Math.max(ex.best, pct); if (passed) ex.passed = true;
    touch(); save();
    examState = null;
    $('#main').innerHTML = `<section class="hero small ${passed ? 'passed' : ''}"><div class="eyebrow">Ergebnis</div>
      <h1>${score} von ${e.fragen.length} · ${pct} %</h1>
      <p class="lead">${abschluss ? (passed ? `Bestanden. Du hast das gesamte Curriculum nachgewiesen. Rang: ${rang()}. Dein Zertifikat wartet.` : `Nicht bestanden. Mindestens ${PASS} % nötig. 20 Minuten Sperre. Die Fehler unten zeigen, welche Module du wiederholst.`) : passed ? `Bestanden. Modul ${k.nr} ist abgeschlossen${k.nr < KURSE.length ? ', Modul ' + (k.nr + 1) + ' ist frei' : ''}. Rang: ${rang()}.` : `Nicht bestanden. Mindestens ${PASS} % nötig. 20 Minuten Sperre. Lies die Lektionen zu den Fehlern.`}</p>
      ${passed && Date.now() - Math.max(S.lastExport || 0, 0) > 864e5 ? `<div class="callout warn export-hinweis"><div class="label">Sicherung</div>Dein Fortschritt liegt nur in diesem Browser. ${S.lastExport ? `Letzte Sicherung vor ${Math.floor((Date.now() - S.lastExport) / 864e5)} Tagen.` : 'Noch nie gesichert.'} Eine Datei, zehn Sekunden: <button class="btn small" data-act="export">Jetzt exportieren</button></div>` : ''}
      ${wrong.length ? `<h3>Fehler</h3><p class="muted small">Alle Prüfungsfehler sammeln sich in der <a href="#/rueckschau">Prüfungs-Rückschau</a>, bis du sie in der Wiederholung richtig beantwortet hast.</p>${wrong.map(w => `<div class="quiz-q"><div class="q">${esc(w.q.frage)}</div><div class="opt wrong">Deine Antwort: ${esc(w.q.optionen[w.a])}</div><div class="opt correct">Richtig: ${esc(w.q.optionen[w.q.richtig])}</div><div class="explain">${w.q.warumFalsch && w.q.warumFalsch[w.a] ? `<span class="wf"><strong>Warum deine Antwort nicht stimmt:</strong> ${esc(w.q.warumFalsch[w.a])}</span> ` : ''}${esc(w.q.erklaerung)} <em>(${esc(w.q.lektion)})</em></div></div>`).join('')}` : '<p>Fehlerfrei.</p>'}
      <div class="btn-row">${abschluss ? (passed ? '<a class="btn primary" href="#/zertifikat">Zertifikat ansehen →</a>' : '<a class="btn primary" href="#/abschluss">Zurück</a>') : passed ? (k.nr < KURSE.length ? `<a class="btn primary" href="#/kurs/${KURSE[KURSE.indexOf(k) + 1].id}">Nächstes Modul →</a>` : '<a class="btn primary" href="#/training">Zum Training →</a>') : `<a class="btn primary" href="#/kurs/${k.id}">Zurück zum Modul</a>`}</div></section>`;
    renderNav();
  }

  // ---------- Abschlussprüfung und Zertifikat ----------
  route('abschluss', () => {
    const n = KURSE.filter(k => examPassed(k.id)).length;
    if (!allExamsPassed()) return `<section class="hero small"><div class="eyebrow">Curriculum</div><h1>Abschlussprüfung</h1>
      <p class="lead">30 Fragen quer durch alle zehn Module, drei pro Modul, gemischt. Mindestens ${PASS} %. Sie wird frei, sobald alle Modulprüfungen bestanden sind.</p>
      <div class="callout warn"><div class="label">Gesperrt</div>${n} von ${KURSE.length} Modulprüfungen bestanden. <a href="${nextStep().route}">Weiter im Curriculum</a></div></section>`;
    const ex = S.exams.abschluss || { attempts: [], passed: false, best: 0 };
    const lastFail = ex.attempts.filter(a => !a.passed).slice(-1)[0];
    const locked = lastFail && Date.now() - lastFail.ts < EXAM_COOLDOWN && !ex.passed;
    if (examState && examState.kid === 'abschluss') return renderExam(null);
    return `<section class="hero small"><div class="eyebrow">Curriculum</div><h1>Abschlussprüfung</h1>
      <p class="lead">30 Fragen quer durch alle zehn Module, drei pro Modul, zufällig gemischt. Mindestens ${PASS} %. Du beantwortest sie ohne Unterlagen und in einem Durchgang. Das ist der Nachweis, dass das Wissen auch Monate später noch sitzt.</p>
      ${ex.attempts.length ? `<p class="muted">Versuche: ${ex.attempts.length} · Bestes Ergebnis: ${ex.best} %</p>` : ''}
      ${ex.passed ? `<div class="callout study"><div class="label">Bestanden</div>Mit ${ex.best} %. <a href="#/zertifikat">Zum Zertifikat</a>. Du kannst die Prüfung zur Übung wiederholen.</div>` : ''}
      ${locked ? `<div class="callout warn"><div class="label">Sperre</div>Nächster Versuch in ${Math.ceil((EXAM_COOLDOWN - (Date.now() - lastFail.ts)) / 60000)} Minuten.</div>` : `<div class="btn-row"><button class="btn primary" data-act="exam-start" data-kid="abschluss">Abschlussprüfung starten</button></div>`}
    </section>`;
  });
  route('zertifikat', () => {
    if (!abschlussPassed()) return routes.abschluss([]);
    const ex = S.exams.abschluss; const best = ex.attempts.filter(a => a.passed).sort((a, b) => b.pct - a.pct)[0];
    const reports = Object.values(S.reports).flat().filter(r => r.bestanden).length;
    const wdh = Object.values(S.srs).reduce((a, x) => a + x.n, 0);
    const tage = Object.keys(S.activity).length;
    const drillArr = (prefix) => Object.entries(S.drills).filter(([k]) => k.startsWith(prefix)).flatMap(([, v]) => Array.isArray(v) ? v : []);
    const rpOk = drillArr('rp_').filter(r => rpStatus(r).s === 2).length;
    const training = { einwaende: drillArr('ew_').length, faelle: drillArr('fall_').length, kontraste: drillArr('kt_').length, rollenspiele: rpOk, neins: S.nein.length };
    return `<div class="no-print btn-row"><button class="btn primary" data-act="print">Drucken oder als PDF sichern</button><a class="btn ghost" href="#/">Übersicht</a></div>
      <section class="cert">
        <div class="cert-inner">
          <div class="cert-logo">V</div>
          <div class="cert-eyebrow">Verkaufsakademie · Persönliches Bootcamp</div>
          <h1>Zertifikat</h1>
          <p class="cert-text">Hiermit wird bestätigt, dass</p>
          <div class="cert-name">${esc(S.name || 'Namenlos')}</div>
          <p class="cert-text">das vollständige Curriculum aus zehn Modulen zu Verkauf, Verkaufspsychologie, Wirkung, Körpersprache, Fragetechnik, Gesprächsführung, Straight Line, Kundenanalyse, Selbstvermarktung und Verhandlung durchlaufen, alle zehn Modulprüfungen sowie die Abschlussprüfung mit mindestens ${PASS} % bestanden hat.</p>
          <div class="cert-stats"><div><strong>${best.pct} %</strong><span>Abschlussprüfung</span></div><div><strong>${reports}</strong><span>Übungsberichte aus der Praxis</span></div><div><strong>${wdh}</strong><span>Wiederholungen</span></div><div><strong>${tage}</strong><span>aktive Tage</span></div></div>
          <div class="cert-stats cert-training"><div><strong>${training.einwaende}</strong><span>Einwände geübt</span></div><div><strong>${training.kontraste}</strong><span>Kontrast-Drills</span></div><div><strong>${training.faelle}</strong><span>Fälle bearbeitet</span></div><div><strong>${training.rollenspiele}</strong><span>Rollenspiele bestanden</span></div><div><strong>${training.neins}</strong><span>Neins gesammelt</span></div></div>
          <div class="cert-foot"><span>${new Date(best.ts).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</span><span>Rang: Absolvent</span></div>
          <p class="cert-small">Dieses Zertifikat bestätigt bestandene Prüfungen in einer persönlichen Lern-App. Es ist kein anerkannter Abschluss. Der eigentliche Beweis steht im Beweisbuch: echte Gespräche, echte Ergebnisse.</p>
        </div>
      </section>`;
  });

  // ---------- Milliardärs-Bibliothek ----------
  let libFilter = { kat: 'alle', thema: 'alle', q: '' };
  route('milliardaere', ([pid]) => {
    const M = window.MILLIARDAERE;
    if (pid) {
      const p = M.find(x => x.id === pid); if (!p) return routes.milliardaere([]);
      return `<div class="breadcrumb"><a href="#/milliardaere">Bibliothek</a> › ${esc(p.name)}</div>
        <div class="person-head"><div class="avatar">${esc(p.name.split(' ').map(x => x[0]).join('').slice(0, 2))}</div><div><h1>${esc(p.name)}</h1><div class="muted">${esc(p.firma)}</div></div></div>
        <p class="lead">${esc(p.kurz)}</p>
        <div class="legend"><span class="tag green">primär</span> belegt in Interview/Brief/Rede · <span class="tag gold">buch</span> aus eigenem Buch oder autorisierter Biografie · <span class="tag">zugeschrieben</span> keine Primärquelle gefunden</div>
        ${p.zitate.map(z => quoteCard(z)).join('')}
        ${p.mythen && p.mythen.length ? `<h2>Mythen-Check</h2>${p.mythen.map(m => `<div class="callout warn"><div class="label">Mythos</div><p><em>${esc(m.text)}</em></p><div class="label">Wahrheit</div>${esc(m.wahrheit)}</div>`).join('')}` : ''}`;
    }
    const themen = window.MILLIARDAERE_THEMEN;
    const f = libFilter;
    const persons = M.filter(p => (f.kat === 'alle' || p.kategorie === f.kat)).sort((a, b) => (a.prio || 9) - (b.prio || 9));
    const quotes = M.flatMap(p => p.zitate.map(z => ({ ...z, person: p }))).filter(z => (f.thema === 'alle' || z.thema === f.thema) && (f.kat === 'alle' || z.person.kategorie === f.kat) && (!f.q || (z.en + z.de + z.person.name + (z.lektion || '')).toLowerCase().includes(f.q.toLowerCase())));
    return `<section class="hero small"><div class="eyebrow">Wissen</div><h1>Milliardärs-Bibliothek</h1>
      <p class="lead">${M.length} Personen, ${M.reduce((a, p) => a + p.zitate.length, 0)} Zitate über Verkaufen, Kunden, Pitch, Preis und Mindset. Jedes Zitat ist nach Quellenlage markiert. Erst lesen, dann im <a href="#/mythen">Mythen-Check</a> prüfen, ob du echt von erfunden unterscheiden kannst.</p><div class="callout warn"><div class="label">Lies das richtig</div>Milliardärs-Aussagen sind Erfahrungswissen von Gewinnern, kein Beweis. Wer nur Erfolgreiche studiert, lernt aus einer verzerrten Stichprobe (Denrell 2003, Rosenzweig 2007). Darum steht in jeder Lektion zuerst die Studie und dann das Zitat.</div></section>
      <input class="search" id="lib-q" aria-label="Suche in Zitaten und Namen" placeholder="Suche in Zitaten und Namen…" value="${esc(f.q)}">
      <div class="filters" id="lib-kat">${[['alle', 'Alle'], ['tech', 'Tech'], ['investor', 'Investoren'], ['unternehmer', 'Unternehmer']].map(([v, t]) => `<button class="${f.kat === v ? 'active' : ''}" data-kat="${v}">${t}</button>`).join('')}</div>
      <div class="filters" id="lib-thema"><button class="${f.thema === 'alle' ? 'active' : ''}" data-thema="alle">Alle Themen</button>${Object.entries(themen).map(([k, v]) => `<button class="${f.thema === k ? 'active' : ''}" data-thema="${k}">${esc(v)}</button>`).join('')}</div>
      <div class="pill-row">${persons.map(p => `<a class="pill" href="#/milliardaere/${p.id}">${esc(p.name)}</a>`).join('')}</div>
      <h2 class="section-title">${quotes.length} Zitate</h2>
      ${quotes.slice(0, 60).map(z => quoteCard(z, z.person)).join('')}${quotes.length > 60 ? '<p class="muted">Weitere Zitate über Suche oder Filter eingrenzen.</p>' : ''}`;
  });
  function quoteCard(z, p) {
    const tag = z.status === 'primaer' ? '<span class="tag green">primär</span>' : z.status === 'buch' ? '<span class="tag gold">buch</span>' : '<span class="tag">zugeschrieben</span>';
    return `<div class="quote-card"><div class="en">“${esc(z.en)}”</div><div class="de">${esc(z.de)}</div>
      <div class="src">${p ? `<a href="#/milliardaere/${p.id}">${esc(p.name)}</a> · ` : ''}${esc(z.quelle)} ${tag}${z.thema && window.MILLIARDAERE_THEMEN[z.thema] ? ` · <span class="tag">${esc(window.MILLIARDAERE_THEMEN[z.thema])}</span>` : ''}</div>
      ${z.lektion ? `<div class="lesson-note"><strong>Lektion:</strong> ${esc(z.lektion)}</div>` : ''}</div>`;
  }

  // ---------- Mythen-Check ----------
  let mythState = null;
  route('mythen', () => {
    const M = window.MILLIARDAERE;
    if (!mythState) {
      const items = [];
      M.forEach(p => { p.zitate.forEach(z => items.push({ typ: 'zitat', text: z.en, de: z.de, name: p.name, echt: z.status !== 'zugeschrieben', erkl: `${z.status === 'primaer' ? 'Primärquelle' : z.status === 'buch' ? 'Buchquelle' : 'Keine Primärquelle gefunden'}: ${z.quelle}` })); (p.mythen || []).forEach(m => items.push({ typ: 'mythos', text: m.text, name: p.name, echt: false, erkl: m.wahrheit })); });
      const echt = shuffle(items.filter(x => x.echt)).slice(0, 5), falsch = shuffle(items.filter(x => !x.echt)).slice(0, 5);
      mythState = { items: shuffle(echt.concat(falsch)), i: 0, score: 0, done: false, last: null };
    }
    const s = mythState;
    if (s.done) { const r = s; mythState = null; return `<section class="hero small"><div class="eyebrow">Mythen-Check</div><h1>${r.score} von ${r.items.length}</h1><p class="lead">${r.score >= 8 ? 'Du erkennst Quellenlage. Das schützt dich vor Motivationsposter-Weisheiten.' : 'Zurück in die Bibliothek: Achte auf die Markierungen primär / buch / zugeschrieben.'}</p><div class="btn-row"><a class="btn primary" href="#/mythen">Nochmal</a><a class="btn ghost" href="#/milliardaere">Bibliothek</a></div></section>`; }
    const it = s.items[s.i];
    return `<section class="hero small"><div class="eyebrow">Mythen-Check · ${s.i + 1} von ${s.items.length} · Richtig: ${s.score}</div>
      <h1>Echt oder erfunden?</h1>
      <div class="quote-card"><div class="en">“${esc(it.text)}”</div>${it.de ? `<div class="de">${esc(it.de)}</div>` : ''}<div class="src">zugeschrieben: ${esc(it.name)}</div></div>
      ${s.last ? `<div class="callout ${s.last.ok ? 'study' : 'warn'}"><div class="label">${s.last.ok ? 'Richtig' : 'Falsch'}</div>${esc(s.last.erkl)}</div><div class="btn-row"><button class="btn primary" data-act="myth-next">Weiter →</button></div>`
        : `<div class="btn-row"><button class="btn" data-act="myth-answer" data-v="1">Belegt (Primär- oder Buchquelle)</button><button class="btn ghost" data-act="myth-answer" data-v="0">Zugeschrieben / verkürzt / erfunden</button></div>`}
    </section>`;
  });

  // ---------- Rollenspiele ----------
  let rpState = null;
  // Die Entscheidungsbäume der fünf großen Szenarien (61 KB) kommen erst, wenn jemand die Rollenspiele öffnet.
  let szOfflineLoading = false, szOfflineReady = false; const szOfflineWarteliste = [];
  function ensureSzenarienOffline(cb) {
    if (szOfflineReady) { if (cb) cb(); return true; }
    if (cb) szOfflineWarteliste.push(cb);
    if (!szOfflineLoading) {
      szOfflineLoading = true; let offen = 2;
      const fertig = () => { if (--offen) return; szOfflineReady = true; (window.SZENARIEN || []).forEach(sz => { if (!sz.offline && window.SZENARIEN_OFFLINE && window.SZENARIEN_OFFLINE[sz.id]) sz.offline = window.SZENARIEN_OFFLINE[sz.id]; }); const w = szOfflineWarteliste.splice(0); if (w.length) w.forEach(f => f()); else navigate(); };
      for (const src of ['js/data/szenarien-offline-1.js', 'js/data/szenarien-offline-2.js']) { const sc = document.createElement('script'); sc.src = src; sc.onload = fertig; sc.onerror = () => { szOfflineLoading = false; szOfflineWarteliste.length = 0; toast('Rollenspiel-Szenarien konnten nicht geladen werden.', 'bad'); }; document.head.appendChild(sc); }
    }
    return false;
  }
  // Ein Maßstab für alle Rollenspiel-Durchläufe: offline nach dem Fazit des Entscheidungsbaums, live nach Punkten und Ethik des Coach-Rasters.
  function rpStatus(r) {
    if (!r) return null;
    let s;
    if (r.art === 'Offline') s = /^Bestanden/.test(r.fazit || '') ? 2 : /(^|\.\s)Teilweise( bestanden)?\b/.test(r.fazit || '') ? 1 : 0;
    else s = (r.score || 0) >= 42 && !/Ethik nicht bestanden/.test(r.fazit || '') ? 2 : (r.score || 0) >= 30 ? 1 : 0;
    return { s, label: ['nicht bestanden', 'teilweise', 'bestanden'][s], cls: ['red', 'gold', 'green'][s] };
  }
  function rpBest(runs) { return runs.reduce((b, r) => { const st = rpStatus(r); return !b || st.s > b.s ? Object.assign({ r }, st) : b; }, null); }
  route('rollenspiel', ([sid]) => {
    if (!ensureSzenarien() || !ensureSzenarienOffline()) return `<section class="hero small"><div class="eyebrow">Training</div><h1>Rollenspiele</h1><p class="lead">Lade Szenarien…</p></section>`;
    const SZ = window.SZENARIEN;
    if (!sid) return `<section class="hero small"><div class="eyebrow">Training</div><h1>Rollenspiele</h1>
      <p class="lead">Acht Situationen mit verdeckten Informationen und Pflichtkriterien. ${(() => { const n = SZ.filter(x => x.offline).length; return n === SZ.length ? 'Alle spielst du offline als Entscheidungsbaum mit Feedback zu jeder Entscheidung.' : n + ' Szenarien spielst du offline als Entscheidungsbaum.'; })()} Mit API-Schlüssel spielt der Coach den Kunden live und bewertet dich nach dem 7-Punkte-Raster.</p></section>
      <div class="grid">${SZ.map(s => { const runs = (S.drills['rp_' + s.id] || []); const best = rpBest(runs);
        return `<div class="card clickable" data-route="#/rollenspiel/${s.id}"><div class="meta"><span class="tag">${esc(s.level)}</span> ${s.offline ? '' : '<span class="tag gold">nur mit Coach</span>'} ${best ? `<span class="tag ${best.cls}">${best.label} · ${runs.length}×</span>` : ''}</div><h3>${esc(s.titel)}</h3><p class="muted">${esc(s.lage)}</p></div>`; }).join('')}</div>`;
    const s = SZ.find(x => x.id === sid); if (!s) return routes.rollenspiel([]);
    const runs = (S.drills['rp_' + s.id] || []);
    return `<div class="breadcrumb"><a href="#/rollenspiel">Rollenspiele</a> › ${esc(s.titel)}</div>
      <section class="hero small"><div class="eyebrow">${esc(s.level)}</div><h1>${esc(s.titel)}</h1><p class="lead">${esc(s.lage)}</p>
      <div class="callout practice"><div class="label">Dein Ziel</div>${esc(s.ziel)}</div>
      <div class="callout"><div class="label">Pflichtkriterien</div><ul>${s.pflicht.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>
      ${rpPlanBox(s)}
      <div class="btn-row">
        ${s.offline ? `<button class="btn primary" data-act="rp-start" data-sid="${s.id}">Offline-Version spielen</button>` : ''}
        <a class="btn ${s.offline ? 'ghost' : 'primary'}" href="#/coach?rp=${s.id}">${S.apiKey ? 'Live mit dem Coach spielen' : 'Live mit Coach (API-Schlüssel nötig)'}</a>
      </div></section>
      <div id="rp-box">${rpState && rpState.sid === sid ? renderRp(s) : ''}</div>
      ${runs.length ? `<h2 class="section-title">Deine Durchläufe</h2>${runs.slice().reverse().map(r => { const st = rpStatus(r); return `<div class="log-entry ${st.s === 2 ? 'ok' : st.s === 0 ? 'fail' : ''}"><div class="meta">${fmtTime(r.ts)} · ${r.art} · <span class="tag ${st.cls}">${st.label}</span>${r.art === 'Offline' && r.n ? ` · ${r.score} von ${r.n} Entscheidungen stark` : ''}${r.pflicht ? ` · Pflichtkriterien ${r.pflicht.length} von ${s.pflicht.length}` : ''}</div><div class="body">${esc(r.fazit)}</div></div>`; }).join('')}` : ''}`;
  });
  // Vorbereitung vor dem Rollenspiel: drei Zeilen, die ein Profi vor jedem Gespräch aufschreibt (Ziel, Eröffnung, Grenze).
  function rpPlanBox(s) {
    const p = S.rpPlan[s.id];
    if (p && !(rpPlanEdit === s.id)) return `<div class="card rp-plan"><div class="eyebrow">Deine Vorbereitung · ${fmtDate(p.ts)}</div>
      <div class="sb-row"><div class="lbl">Ziel</div><div>${esc(p.ziel)}</div></div><div class="sb-row"><div class="lbl">Erster Satz</div><div>${esc(p.erste)}</div></div><div class="sb-row"><div class="lbl">Grenze</div><div>${esc(p.grenze)}</div></div>
      <div class="btn-row"><button class="btn small ghost" data-act="rp-plan-edit" data-sid="${s.id}">Ändern</button></div></div>`;
    return `<form class="card rp-plan rp-plan-form" data-sid="${s.id}"><div class="eyebrow">Vorbereitung · 2 Minuten</div>
      <p class="muted small">Profis gehen mit drei Zeilen ins Gespräch. Schreib sie, bevor du spielst, dann kannst du danach prüfen, ob du deinem Plan gefolgt bist oder dem Kunden hinterhergelaufen bist.</p>
      <label>Was will ich am Ende dieses Gesprächs erreicht haben? <input name="ziel" required minlength="10" value="${esc(p ? p.ziel : '')}" placeholder="Ein konkreter nächster Schritt mit Datum, kein Abschluss um jeden Preis"></label>
      <label>Mein erster Satz nach dem Einwand <input name="erste" required minlength="10" value="${esc(p ? p.erste : '')}" placeholder="Ein Label oder eine Frage, kein Gegenargument"></label>
      <label>Was tue ich nicht, egal was passiert? <input name="grenze" required minlength="5" value="${esc(p ? p.grenze : '')}" placeholder="Zum Beispiel: kein Rabatt ohne Gegenleistung"></label>
      <div class="btn-row"><button class="btn small primary" type="submit">Plan festhalten</button>${p ? `<button class="btn small ghost" type="button" data-act="rp-plan-cancel">Abbrechen</button>` : ''}</div></form>`;
  }
  let rpPlanEdit = null;
  function renderRp(s) {
    const st = rpState; const node = s.offline.knoten[st.node];
    const hist = st.hist.map(h => `<div class="scene"><div class="npc"><span class="who">${esc(s.persona.split(',')[0])}</span> ${esc(h.npc)}</div><div class="you"><span class="who">Du</span> ${esc(h.you)}</div><div class="feedback ${h.bewertung}">${esc(h.feedback)}</div></div>`).join('');
    if (node.ende) {
      const runs = S.drills['rp_' + s.id] || []; const last = runs[runs.length - 1]; const st = rpStatus(last) || { s: 0, label: 'nicht bestanden', cls: 'red' };
      const good = rpState.hist.filter(h => h.bewertung === 'good').length, ok = rpState.hist.filter(h => h.bewertung === 'ok').length, bad = rpState.hist.length - good - ok;
      return `${hist}<div class="scene"><div class="npc"><span class="who">${esc(s.persona.split(',')[0])}</span> ${esc(node.npc)}</div></div>
        <div class="callout ${st.s === 2 ? 'study' : st.s === 1 ? 'practice' : 'warn'} rp-fazit"><div class="label">Fazit · <span class="tag ${st.cls}">${st.label}</span></div>${esc(node.fazit)}<p class="muted small rp-bilanz">${rpState.hist.length} Entscheidungen: ${good} stark, ${ok} brauchbar, ${bad} schwach. Dieselben Maßstäbe wie beim Coach: Ein Rollenspiel gilt erst als bestanden, wenn der Weg stimmt, nicht nur das Ende.</p></div>
        ${last && !last.pflicht ? `<form class="card rp-pflicht" data-sid="${s.id}"><div class="eyebrow">Pflichtkriterien im Verlauf</div><p class="muted small">Lies den Verlauf oben und hake nur ab, was tatsächlich vorkam. Der Coach prüft dieselbe Liste.</p>${s.pflicht.map((p, i) => `<label class="check"><input type="checkbox" name="p" value="${i}"><span>${esc(p)}</span></label>`).join('')}<div class="btn-row"><button class="btn small primary" type="submit">Festhalten</button></div></form>` : last && last.pflicht ? `<p class="muted small">Pflichtkriterien laut deiner Prüfung: ${last.pflicht.length} von ${s.pflicht.length}${last.pflicht.length < s.pflicht.length ? '. Fehlend: ' + s.pflicht.filter((p, i) => !last.pflicht.includes(i)).map(esc).join(' · ') : ''}.</p>` : ''}
        ${S.rpPlan[s.id] ? `<div class="callout practice"><div class="label">Plan gegen Verlauf</div>Dein Ziel war: „${esc(S.rpPlan[s.id].ziel)}“. Deine Grenze: „${esc(S.rpPlan[s.id].grenze)}“. Lies den Verlauf oben noch einmal und entscheide ehrlich, ob du beides gehalten hast. Wer seinen Plan im Gespräch verliert, verliert meist das Gespräch.</div>` : ''}
        <div class="btn-row"><button class="btn primary" data-act="rp-start" data-sid="${s.id}">Nochmal</button><a class="btn ghost" href="#/rollenspiel">Alle Szenarien</a></div>`;
    }
    return `${hist}<div class="scene"><div class="npc"><span class="who">${esc(s.persona.split(',')[0])}</span> ${esc(node.npc)}</div>
      <div class="options">${shuffle(node.optionen.map((o, i) => ({ o, i }))).map(({ o, i }) => `<button class="opt btn-opt" data-act="rp-choose" data-oi="${i}">${esc(o.text)}</button>`).join('')}</div></div>`;
  }

  // ---------- Training: Drills, Ablehnung, Erfolgsleiter ----------
  // ---------- Fälle: offene Checkpoint-Fälle mit Rubrik ----------
  let faLoading = false, faState = null;
  // Generischer Nachlader für Datendateien, die nicht beim Start gebraucht werden: true, wenn da; sonst wird geladen und danach neu gerendert.
  const lazyLoading = {};
  function ensureData(global, file, label) {
    if (window[global]) return true;
    if (!lazyLoading[file]) { lazyLoading[file] = true; const sc = document.createElement('script'); sc.src = 'js/data/' + file + '.js'; sc.onload = () => navigate(); sc.onerror = () => { lazyLoading[file] = false; toast(label + ' konnten nicht geladen werden.', 'bad'); }; document.head.appendChild(sc); }
    return false;
  }
  const ensureKontraste = () => ensureData('KONTRASTE', 'kontraste', 'Kontraste');
  const ensureBeispiele = () => ensureData('BEISPIELE', 'beispiele', 'Beispiele');
  const ensureSzenarien = () => ensureData('SZENARIEN', 'szenarien', 'Szenarien');
  function ensureFaelle() {
    if (window.FAELLE) return true;
    if (!faLoading) { faLoading = true; const sc = document.createElement('script'); sc.src = 'js/data/faelle.js'; sc.onload = () => navigate(); sc.onerror = () => { faLoading = false; toast('Fälle konnten nicht geladen werden.', 'bad'); }; document.head.appendChild(sc); }
    return false;
  }
  function fallRuns(id) { return S.drills['fall_' + id] || []; }
  route('faelle', ([fid]) => {
    if (!ensureFaelle()) return '<section class="hero small"><div class="eyebrow">Training</div><h1>Fälle</h1><p class="muted">Lade Fälle…</p></section>';
    const F = window.FAELLE, R = window.FAELLE_RUBRIK;
    if (!fid) {
      return `<section class="hero small"><div class="eyebrow">Training</div><h1>Fälle</h1>
        <p class="lead">Zehn Situationen, wie sie im Beruf ankommen, ohne den Hinweis, welche Lektion gemeint ist. Du schreibst eine begründete Einschätzung, dann bewertest du sie an einer Rubrik mit sechs Dimensionen, erst danach siehst du, was eine starke Antwort enthält. Bewertet wird die Qualität des Denkwegs, nicht die Übereinstimmung mit einer Musterlösung. Mit API-Schlüssel bewertet der Coach zusätzlich, zitiert deine Stellen und trennt Fehler von vertretbaren Entscheidungen.</p></section>
        <div class="grid">${F.map(f => { const k = KURSE.find(x => x.id === f.modul); const r = fallRuns(f.id); const last = r[r.length - 1]; const locked = k && !examPassed(k.id) && !lessonDone(k.lektionen[0].id); return `<div class="card ${locked ? 'locked' : 'clickable'}" ${locked ? '' : `data-route="#/faelle/${f.id}"`}><div class="meta"><span class="tag">Modul ${k ? k.nr : '?'}</span>${wvTag('fall_', f.id)}${last ? `<span class="tag ${last.selbst >= 14 ? 'green' : 'gold'}">${last.coach != null ? 'Coach ' + last.coach : 'selbst ' + last.selbst}/18 · ${r.length}×</span>` : ''}${locked ? lock('Modul noch nicht begonnen') : ''}</div><h3>${esc(f.titel)}</h3></div>`; }).join('')}</div>
        <div class="callout study"><div class="label">Warum Fälle</div>Im Verkauf kommt kein Problem mit dem Kapitelnamen. Wer nur Fragen beantwortet, bei denen die Methode schon im Titel steht, lernt Wiedererkennen, nicht Entscheiden. Offene Fälle mit Rubrik trainieren das, was später zählt: Problem erfassen, Informationen nutzen, Alternativen abwägen, entscheiden, prüfen, erklären.</div>`;
    }
    const f = F.find(x => x.id === fid); if (!f) return routes.faelle([]);
    const k = KURSE.find(x => x.id === f.modul);
    if (!faState || faState.id !== fid) faState = { id: fid, text: '', stufe: 0, wertung: {} };
    const runs = fallRuns(f.id);
    const head = `<div class="breadcrumb"><a href="#/faelle">Fälle</a> › ${esc(f.titel)}</div>
      <section class="hero small"><div class="eyebrow">Fall · Modul ${k ? k.nr + ' ' + esc(k.titel) : ''}</div><h1>${esc(f.titel)}</h1></section>
      <section class="card"><div class="eyebrow">Die Lage</div><p class="kontext">${esc(f.lage)}</p><div class="eyebrow">Dein Auftrag</div><p>${esc(f.auftrag)}</p></section>`;
    if (faState.stufe === 0) {
      return `${head}<section class="card"><h2>Deine Einschätzung</h2><p class="muted">Schreib so, wie du es der Person in der Lage schicken würdest: Befund, Begründung, Empfehlung, Prüfung, Risiko. Mindestens ${f.min} Zeichen. Keine Methode muss beim Namen genannt werden; es zählt, ob du sie anwendest.</p>
        <form class="fall-form" data-min="${f.min}"><textarea class="journal" rows="12" aria-label="Deine Einschätzung zum Fall" placeholder="Was ist hier los, was empfiehlst du, woran prüft ihr es…">${esc(faState.text)}</textarea><div class="count muted"><span class="n">${faState.text.length}</span> / ${f.min} Zeichen</div><div class="btn-row"><button class="btn primary" type="submit">Einschätzung festhalten und an der Rubrik prüfen</button></div></form>
        ${runs.length ? `<p class="muted small">Bisher ${runs.length} Durchgänge, zuletzt ${fmtTime(runs[runs.length - 1].ts)} mit ${runs[runs.length - 1].selbst}/18 (Selbstbewertung)${runs[runs.length - 1].coach != null ? `, Coach ${runs[runs.length - 1].coach}/18` : ''}.</p>` : ''}</section>`;
    }
    if (faState.stufe === 1) {
      return `${head}<section class="card"><div class="log-entry"><div class="meta">Deine Einschätzung</div><div class="body">${esc(faState.text)}</div></div>
        <h2>Rubrik: Wo steht deine Antwort?</h2><p class="muted">Lies je Dimension die drei Stufen und wähle ehrlich, welche deine Antwort erreicht. Stufe 3 heißt nicht „perfekt“, sondern „alles da, was die Dimension verlangt“. Die Musterelemente siehst du erst danach.</p>
        <form class="fall-rubrik">${R.map(d => `<div class="rubrik-dim"><div class="eyebrow">${esc(d.name)}</div><p class="muted small">${esc(d.frage)}</p>${f.stufen[d.id].map((txt, i) => `<label class="opt"><input type="radio" name="r-${d.id}" value="${i + 1}" required> <span><strong>${i + 1}</strong> · ${esc(txt)}</span></label>`).join('')}</div>`).join('')}
        <div class="btn-row"><button class="btn primary" type="submit">Bewertung speichern und Musterelemente sehen</button><button class="btn ghost" type="button" data-act="fall-back">Einschätzung überarbeiten</button></div></form></section>`;
    }
    const sum = Object.values(faState.wertung).reduce((a, b) => a + b, 0); const last = runs[runs.length - 1];
    return `${head}<section class="card"><h2>${sum} von 18 · Selbstbewertung</h2>
      <table class="week-table"><tbody>${R.map(d => `<tr><td>${esc(d.name)}</td><td class="wk">${faState.wertung[d.id]}/3</td></tr>`).join('')}</tbody></table>
      ${last && last.coach != null ? `<p><strong>Coach:</strong> ${last.coach}/18</p>` : ''}
      <h3>Was eine starke Antwort enthält</h3><ul class="kern">${f.stark.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="callout warn"><div class="label">Die häufigste Falle</div>${esc(f.falle)}</div>
      ${f.nachlesen && f.nachlesen.length ? `<div class="callout study nachlesen"><div class="label">Worauf die starke Antwort baut</div><ul class="wv-list">${f.nachlesen.map(n => { const fl = findLesson(n.lid); return fl ? `<li><a href="#/lektion/${fl.kurs.id}/${n.lid}">Lektion ${fl.kurs.nr}.${lessonIndex(fl.kurs, n.lid) + 1}: ${esc(fl.lektion.titel)}</a> <span class="muted small">· ${esc(n.was)}</span></li>` : ''; }).join('')}</ul><p class="muted small">Fehlt dir ein Punkt oben, dann lies dort nach, bevor du den Fall in einer Woche noch einmal bearbeitest.</p></div>` : ''}
      <div class="log-entry"><div class="meta">Deine Einschätzung</div><div class="body">${esc(faState.text)}</div></div>
      <p class="muted">Vergleiche jetzt Element für Element: Welche der fünf Punkte stehen bei dir, wenn auch in anderen Worten? Welche fehlen? Das Fehlende ist dein Lernpunkt, nicht die Punktzahl.</p>
      <div class="btn-row">${S.apiKey ? `<a class="btn primary" href="#/coach?fall=${f.id}">Vom Coach bewerten lassen</a>` : ''}<button class="btn ghost" data-act="fall-restart">Noch einmal, mit dem Gelernten</button><a class="btn ghost" href="#/faelle">Alle Fälle</a></div></section>`;
  });

  // ---------- Konzept-Kontraste: Vergleichstabelle + Fälle, in denen die Methode nicht genannt wird ----------
  let ktState = null;
  // Abgrenzung bei einer Verwechslung: die Bedingung des gewählten Begriffs neben der des richtigen. Beide stehen schon in den Karten („Wann“); hier treffen sie am konkreten Fall aufeinander.
  function ktAbgrenzung(x, wahl, richtig) {
    if (wahl === richtig) return '';
    return `<p class="kt-abgrenzung"><strong>${esc(x.begriffe[wahl].name)}</strong> hätte gepasst: ${esc(x.begriffe[wahl].wann)}<br><strong>${esc(x.begriffe[richtig].name)}</strong> passt hier: ${esc(x.begriffe[richtig].wann)}</p>`;
  }
  // Häufigste Verwechslung über eine Liste von Fehlern [[wahl, richtig], …]
  function ktTopFehler(x, fehler) {
    const m = {}; for (const [w, r] of fehler) { const k = w + '>' + r; m[k] = (m[k] || 0) + 1; }
    const top = Object.entries(m).sort((a, b) => b[1] - a[1])[0]; if (!top) return null;
    const [w, r] = top[0].split('>').map(Number); return { wahl: w, richtig: r, n: top[1], wahlName: x.begriffe[w].name, richtigName: x.begriffe[r].name };
  }
  route('kontraste', ([kid]) => {
    if (!ensureKontraste()) return '<section class="hero small"><div class="eyebrow">Training</div><h1>Konzept-Kontraste</h1><p class="muted">Lade Kontraste…</p></section>';
    const K = window.KONTRASTE;
    if (!kid) {
      return `<section class="hero small"><div class="eyebrow">Training</div><h1>Konzept-Kontraste</h1>
        <p class="lead">Viele Fehler im Gespräch sind Verwechslungen: Label statt Spiegeln, Anker statt BATNA, Abschlussfrage statt Trial Close. Hier stehen die Nachbarbegriffe nebeneinander, mit dem einen Unterschied, auf den es ankommt. Danach kommen Fälle, in denen niemand sagt, welche Methode gefragt ist. Genau so kommt es im Gespräch.</p></section>
        <div class="grid">${K.map(x => { const r = S.drills['kt_' + x.id] || []; const last = r[r.length - 1]; const fl = findLesson(x.lektion); const top = ktTopFehler(x, r.flatMap(z => z.fehler || [])); return `<div class="card clickable" data-route="#/kontraste/${x.id}"><div class="meta"><span class="tag">${x.begriffe.length} Begriffe · ${x.faelle.length} Fälle</span>${wvTag('kt_', x.id)}${last ? `<span class="tag ${last.score === last.n ? 'green' : 'gold'}">${last.score}/${last.n} · ${r.length}×</span>` : ''}</div><h3>${esc(x.titel)}</h3><p class="muted small">${fl ? `Lektion ${fl.kurs.nr}.${lessonIndex(fl.kurs, fl.lektion.id) + 1}` : ''}${top && top.n >= 2 ? `${fl ? ' · ' : ''}<span class="kt-top">Verwechselst du oft: ${esc(top.wahlName)} statt ${esc(top.richtigName)} (${top.n}×)</span>` : ''}</p></div>`; }).join('')}</div>`;
    }
    const x = K.find(k => k.id === kid); if (!x) return routes.kontraste([]);
    if (!ktState || ktState.id !== kid) ktState = { id: kid, i: 0, antworten: [], gewaehlt: null };
    const fl = findLesson(x.lektion); const f = x.faelle[ktState.i]; const fertig = ktState.i >= x.faelle.length;
    const score = ktState.antworten.filter(a => a.ok).length;
    return `<div class="breadcrumb"><a href="#/kontraste">Konzept-Kontraste</a> › ${esc(x.titel)}</div>
      <section class="hero small"><div class="eyebrow">Nicht verwechseln</div><h1>${esc(x.titel)}</h1><p class="lead">${esc(x.frage)}</p>${fl ? `<p class="muted small">Stoff: <a href="#/lektion/${fl.kurs.id}/${fl.lektion.id}">Lektion ${fl.kurs.nr}.${lessonIndex(fl.kurs, fl.lektion.id) + 1} ${esc(fl.lektion.titel)}</a></p>` : ''}</section>
      <div class="kontrast-grid cols-${x.begriffe.length}">${x.begriffe.map(b => `<div class="card kontrast"><h3>${esc(b.name)}</h3><div class="row"><div class="eyebrow">Kern</div><p>${esc(b.kern)}</p></div><div class="row"><div class="eyebrow">Wirkung</div><p>${esc(b.wirkung)}</p></div><div class="row"><div class="eyebrow">Wann</div><p>${esc(b.wann)}</p></div></div>`).join('')}</div>
      <div class="callout study"><div class="label">Faustregel</div>${esc(x.faustregel)}</div>
      <section class="card exam-q kt-drill"><div class="eyebrow">Fall ${Math.min(ktState.i + 1, x.faelle.length)} von ${x.faelle.length} · die Methode wird nicht genannt</div>
        ${fertig ? `<h2>${score} von ${x.faelle.length} richtig zugeordnet</h2><p class="muted">${score === x.faelle.length ? 'Alle Fälle getroffen. In einer Woche noch einmal, dann sitzt die Unterscheidung.' : 'Lies bei den falschen Fällen die Begründung noch einmal und formuliere den Unterschied in einem eigenen Satz. Dann den Drill wiederholen.'}</p>
          ${(() => { const top = ktTopFehler(x, ktState.antworten.map((a, i) => a.ok ? null : [a.wahl, x.faelle[i].richtig]).filter(Boolean)); return top && top.n >= 2 ? `<div class="callout warn kt-verwechslung"><div class="label">Dein Muster in diesem Durchgang</div>${top.n}× <strong>${esc(top.wahlName)}</strong> gewählt, wo <strong>${esc(top.richtigName)}</strong> vorlag. Der Unterschied, den du dir merken musst:${ktAbgrenzung(x, top.wahl, top.richtig)}</div>` : ''; })()}
          <ol class="kt-review">${x.faelle.map((ff, i) => { const a = ktState.antworten[i]; return `<li class="${a.ok ? 'ok' : 'bad'}"><div class="muted small">${esc(ff.situation)}</div><div><strong>${a.ok ? 'Richtig' : 'Du: ' + esc(x.begriffe[a.wahl].name) + ' · Richtig: ' + esc(x.begriffe[ff.richtig].name)}</strong> · ${esc(ff.warum)}${a.ok ? '' : ktAbgrenzung(x, a.wahl, ff.richtig)}</div></li>`; }).join('')}</ol>
          <div class="btn-row"><button class="btn primary" data-act="kt-restart">Noch einmal</button><a class="btn ghost" href="#/kontraste">Alle Kontraste</a></div>`
        : `<h2 class="situation">${esc(f.situation)}</h2>
          ${ktState.gewaehlt === null ? `<p class="muted">Welches Prinzip liegt hier vor? Entscheide erst, dann klicke.</p><div class="btn-row wrap">${shuffle(x.begriffe.map((b, i) => i)).map(i => `<button class="btn ghost" data-act="kt-wahl" data-i="${i}">${esc(x.begriffe[i].name)}</button>`).join('')}</div>`
          : `<div class="callout ${ktState.gewaehlt === f.richtig ? 'practice' : 'warn'}"><div class="label">${ktState.gewaehlt === f.richtig ? 'Richtig: ' + esc(x.begriffe[f.richtig].name) : 'Nicht ganz. Du hast ' + esc(x.begriffe[ktState.gewaehlt].name) + ' gewählt, es ist ' + esc(x.begriffe[f.richtig].name)}</div>${esc(f.warum)}${ktAbgrenzung(x, ktState.gewaehlt, f.richtig)}</div><div class="btn-row"><button class="btn primary" data-act="kt-next">${ktState.i + 1 < x.faelle.length ? 'Nächster Fall' : 'Auswertung'}</button></div>`}`}
      </section>`;
  });

  // ---------- Schritt für Schritt: Worked Examples mit abnehmender Hilfe ----------
  let wbState = null;
  const WB_STUFEN = ['Beispiel mit Begründung', 'Lückenaufgabe', 'Allein', 'Neuer Kontext'];
  route('beispiele', ([bid]) => {
    if (!ensureBeispiele()) return '<section class="hero small"><div class="eyebrow">Training</div><h1>Schritt für Schritt</h1><p class="muted">Lade Beispiele…</p></section>';
    const B = window.BEISPIELE;
    if (!bid) {
      return `<section class="hero small"><div class="eyebrow">Training</div><h1>Schritt für Schritt</h1>
        <p class="lead">Sechs Prozeduren, die du im Schlaf können musst. Jede in vier Stufen mit abnehmender Hilfe: erst ein vollständiges Beispiel, bei dem jeder Schritt begründet ist. Dann dasselbe mit einer Lücke, die du füllst. Dann allein, mit Kriterien statt Lösung. Zuletzt ein Fall aus einem ganz anderen Lebensbereich, denn erst dort zeigt sich, ob du die Struktur verstanden hast oder nur das Beispiel (Sweller 2006; Renkl 2014).</p></section>
        <div class="grid">${B.map(x => { const st = S.drills['wb_' + x.id]; const fl = findLesson(x.lektion); return `<div class="card clickable" data-route="#/beispiele/${x.id}"><div class="meta"><span class="tag">${x.dauer} Min</span>${wvTag('wb_', x.id)}${st ? `<span class="tag ${st.stufe >= 4 ? 'green' : 'gold'}">${st.stufe >= 4 ? 'alle vier Stufen' : 'Stufe ' + st.stufe + ' von 4'}</span>` : ''}</div><h3>${esc(x.titel)}</h3><p class="muted small">${x.prozedur.length} Schritte${fl ? ` · Lektion ${fl.kurs.nr}.${lessonIndex(fl.kurs, fl.lektion.id) + 1}` : ''}</p></div>`; }).join('')}</div>`;
    }
    const x = B.find(b => b.id === bid); if (!x) return routes.beispiele([]);
    const saved = S.drills['wb_' + x.id] || { stufe: 0 };
    if (!wbState || wbState.id !== bid) wbState = { id: bid, stufe: Math.min(saved.stufe, 3), offen: false, text: '' };
    const fl = findLesson(x.lektion); const st = wbState.stufe;
    const stepper = `<ol class="stepper">${WB_STUFEN.map((n, i) => `<li class="${i < st ? 'done' : i === st ? 'cur' : ''}"><span>${i + 1}</span> ${n}</li>`).join('')}</ol>`;
    const proz = `<div class="callout ziele"><div class="label">Die Prozedur</div><ol>${x.prozedur.map(p => `<li>${esc(p)}</li>`).join('')}</ol></div>`;
    let body = '';
    if (st === 0) {
      body = `${proz}<section class="card"><div class="eyebrow">Stufe 1 · Vollständiges Beispiel</div><p class="kontext">${esc(x.beispiel.kontext)}</p>
        <ol class="steps wb">${x.beispiel.schritte.map((sch, i) => `<li><div class="eyebrow">${esc(x.prozedur[i].split(':')[0])}</div><p>${esc(sch.text)}</p><div class="warum"><strong>Warum so:</strong> ${esc(sch.warum)}</div></li>`).join('')}</ol>
        <p class="muted">Lies das Beispiel einmal mit Blick auf das Warum, nicht auf den Wortlaut. Dann decke es ab und sag dir die vier Schritte selbst auf.</p>
        <div class="btn-row"><button class="btn primary" data-act="wb-next">Weiter zur Lückenaufgabe</button></div></section>`;
    } else if (st === 1) {
      const L = x.luecke; const gap = L.schritte.findIndex(z => z === null);
      body = `<section class="card"><div class="eyebrow">Stufe 2 · Lückenaufgabe</div><p class="kontext">${esc(L.kontext)}</p>
        <ol class="steps wb">${L.schritte.map((sch, i) => `<li class="${sch === null ? 'gap' : ''}"><div class="eyebrow">${esc(x.prozedur[i].split(':')[0])}</div>${sch === null ? (wbState.offen ? `<div class="log-entry"><div class="meta">Deine Lösung</div><div class="body">${esc(wbState.text)}</div></div><div class="callout practice"><div class="label">Eine mögliche Lösung</div>${esc(L.loesung)}</div>` : `<p class="muted">${esc(L.frage)}</p>`) : `<p>${esc(sch)}</p>`}</li>`).join('')}</ol>
        ${wbState.offen ? `<p class="muted"><strong>Vergleich:</strong> ${esc(L.hinweis)} Erfüllt deine Lösung das? Dann weiter. Wenn nicht, formuliere sie noch einmal, bevor du weitergehst.</p><div class="btn-row"><button class="btn primary" data-act="wb-next">Weiter: allein</button><button class="btn ghost" data-act="wb-retry">Noch einmal versuchen</button></div>`
        : `<form class="wb-form" data-min="40"><div class="callout warn"><div class="label">Hinweis</div>${esc(L.hinweis)}</div><textarea class="journal" rows="3" aria-label="Schritt ${gap + 1} in direkter Rede" placeholder="Schritt ${gap + 1} in direkter Rede…"></textarea><div class="btn-row"><button class="btn primary" type="submit">Lösung festhalten und vergleichen</button></div></form>`}</section>`;
    } else {
      const E = st === 2 ? x.eigen : x.fern;
      body = `${st === 2 ? proz : ''}<section class="card"><div class="eyebrow">Stufe ${st + 1} · ${WB_STUFEN[st]}</div><p class="kontext">${esc(E.kontext)}</p>
        ${wbState.offen ? `<div class="log-entry"><div class="meta">Deine Lösung</div><div class="body">${esc(wbState.text)}</div></div>
          <h3>Prüfe deine Lösung an den Kriterien</h3><ul class="krit">${E.kriterien.map((k, i) => `<li><label><input type="checkbox" class="krit-box"> <span>${esc(k)}</span></label></li>`).join('')}</ul>
          <details class="muster"><summary>Erst danach: eine Musterlösung ansehen</summary><div class="callout practice">${esc(E.muster)}</div><p class="muted small">Die Musterlösung ist eine von vielen. Deine kann anders klingen und trotzdem alle Kriterien erfüllen. Vergleiche die Struktur, nicht die Worte.</p></details>
          <div class="btn-row"><button class="btn primary" data-act="wb-next">${st === 2 ? 'Weiter: neuer Kontext' : 'Abschließen'}</button><button class="btn ghost" data-act="wb-retry">Noch einmal</button>${S.apiKey ? `<a class="btn ghost" href="#/coach">Lösung vom Coach prüfen lassen</a>` : ''}</div>`
        : `<p class="muted">${st === 2 ? 'Jetzt ohne Vorlage. Die Prozedur steht oben, die Kriterien siehst du erst danach.' : 'Anderer Lebensbereich, gleiche Struktur. Wenn du hier hängst, hast du das Beispiel gelernt, nicht die Methode. Das ist normal und genau der Zweck dieser Stufe.'} Mindestens 120 Zeichen.</p>
          <form class="wb-form" data-min="120"><textarea class="journal" rows="7" aria-label="Alle Schritte in eigenen Worten" placeholder="Alle Schritte, so wie du sie sagen oder aufschreiben würdest…"></textarea><div class="btn-row"><button class="btn primary" type="submit">Lösung festhalten und an Kriterien prüfen</button></div></form>`}</section>`;
    }
    const done = saved.stufe >= 4;
    return `<div class="breadcrumb"><a href="#/beispiele">Schritt für Schritt</a> › ${esc(x.titel)}</div>
      <section class="hero small"><div class="eyebrow">Worked Example · ${x.dauer} Minuten</div><h1>${esc(x.titel)}</h1>${fl ? `<p class="muted small">Stoff: <a href="#/lektion/${fl.kurs.id}/${fl.lektion.id}">Lektion ${fl.kurs.nr}.${lessonIndex(fl.kurs, fl.lektion.id) + 1} ${esc(fl.lektion.titel)}</a></p>` : ''}</section>
      ${done && st === 3 && !wbState.offen ? `<div class="callout study"><div class="label">Alle vier Stufen abgeschlossen am ${new Date(saved.ts).toLocaleDateString('de-DE')}</div>Wiederhole die Stufen 3 und 4 in einer Woche mit einem eigenen Fall aus deinem Alltag. Die Prozedur sitzt, wenn du sie ohne die Liste oben hinschreiben kannst.</div>` : ''}
      ${stepper}${body}
      ${st >= 2 && x.einwaende && x.einwaende.length ? `<div class="callout practice wb-anwenden"><div class="label">Jetzt anwenden</div>Dieselbe Prozedur, jetzt unter Zeitdruck und ohne Liste. Nimm dir einen davon: ${x.einwaende.map(id => `<a href="#/einwaende/${id}">${esc(ewTitel(id))}</a>`).join(' ')} Antworte laut, bevor du die Musterantwort aufklappst.</div>` : ''}
      ${st > 0 ? `<div class="btn-row"><button class="btn small ghost" data-act="wb-back">Eine Stufe zurück</button></div>` : ''}`;
  });
  // Einwandtext zu einer Id, auch wenn einwaende.js noch nicht geladen ist (dann wird nachgeladen und neu gerendert)
  function ewTitel(id) { const E = window.EINWAENDE; if (!E) { ensureEinwaende(); return 'Einwand „' + id + '“'; } const e = E.find(x => x.id === id); return e ? e.einwand : id; }

  // ---------- Einwand-Drill: erst selbst antworten, dann Muster, dann Selbstbewertung ----------
  let ewState = null;
  function ewWertung(id) { return (S.drills['ew_' + id] || []); }
  let ewLoading = false;
  function ensureEinwaende() {
    if (window.EINWAENDE) return true;
    if (!ewLoading) { ewLoading = true; const sc = document.createElement('script'); sc.src = 'js/data/einwaende.js'; sc.onload = () => navigate(); sc.onerror = () => { ewLoading = false; toast('Einwände konnten nicht geladen werden.', 'bad'); }; document.head.appendChild(sc); }
    return false;
  }
  // Dieselben Kriterien wie im Coach-Prompt (sysEinwand): vier Dimensionen plus Falle. „Getroffen“ = alle vier und Falle vermieden, „teilweise“ = mindestens zwei.
  const EW_KRITERIEN = [
    { id: 'zuhoeren', name: 'Zugehört und anerkannt', frage: 'Label oder Spiegel, bevor ein Argument kommt.' },
    { id: 'erkunden', name: 'Erkundet statt verteidigt', frage: 'Eine Frage, die isoliert oder den Maßstab holt.' },
    { id: 'beleg', name: 'Beleg oder Zahl des Kunden', frage: 'Seine Zahl, sein Beispiel, nicht deine Prospektzahl.' },
    { id: 'schritt', name: 'Nächster Schritt vereinbart', frage: 'Ein konkreter Vorschlag, was als Nächstes passiert.' },
  ];
  function ewWertAus(kriterien, falle) { return kriterien.length === 4 && falle ? 2 : kriterien.length >= 2 ? 1 : 0; }
  // Rein sprachliche Prüfung der Antwort: findet Muster, die im Text sichtbar sind. Kein Urteil über Ton und Timing.
  function ewHinweise(text, e) {
    const t = ' ' + text.replace(/\s+/g, ' ').trim() + ' '; const erster = t.split(/(?<=[.!?])\s/)[0] || t;
    const out = [];
    if (!/\?/.test(t)) out.push({ art: 'warn', text: 'Keine Frage in deiner Antwort. Erkunden und Isolieren gehen nur mit einer Frage, zum Beispiel „Zu teuer im Vergleich womit?“ oder „Angenommen, das wäre geklärt, würden Sie es dann machen?“' });
    if (/^\s*(aber|nein|doch|das stimmt nicht|falsch)\b/i.test(text) || /\b(aber|allerdings)\b/i.test(erster) && !/\?/.test(erster)) out.push({ art: 'warn', text: 'Dein erster Satz widerspricht. Nach LAER kommt das Argument an dritter oder vierter Stelle; davor stehen Zuhören und Anerkennen.' });
    if (/\b(rabatt|nachlass|skonto|günstiger|billiger|entgegenkommen|prozent)\b|\d\s?%/i.test(t) && /^(teuer|budget|rabatt|wettbewerber|gehalt)$/.test(e.id)) out.push({ art: 'warn', text: 'Du bietest von dir aus einen Nachlass an. Das ist bei diesem Einwand die häufigste Falle: ein Zugeständnis ohne Gegenleistung, bevor der Maßstab geklärt ist.' });
    if (/\b(verstehe|klingt|höre|hört sich|scheint|nachvollziehen|es wirkt)\b/i.test(erster)) out.push({ art: 'ok', text: 'Du beginnst mit Anerkennen oder einem Label. Das ist der erste Schritt nach LAER.' });
    if (/\b(sie sagten|sie meinten|vorhin|ihre zahl|bei ihnen|in ihrem)\b/i.test(t)) out.push({ art: 'ok', text: 'Du greifst etwas auf, das der Kunde gesagt hat. Seine Zahlen tragen weiter als deine.' });
    if (!out.length) return '';
    return `<div class="callout study ew-check"><div class="label">Was im Text steht</div><ul>${out.map(h => `<li class="${h.art}">${esc(h.text)}</li>`).join('')}</ul><p class="muted small">Eine Textprüfung auf Fragezeichen, Reihenfolge und Zugeständnisse. Ton, Tempo und Pausen kann nur ein Gegenüber beurteilen: der Coach mit Schlüssel oder ein Mensch im echten Gespräch.</p></div>`;
  }
  route('einwaende', ([eid]) => {
    if (!ensureEinwaende()) return '<section class="hero small"><div class="eyebrow">Training</div><h1>Einwand-Drill</h1><p class="muted">Lade Einwände…</p></section>';
    const E = window.EINWAENDE;
    if (!eid) {
      const gesamt = E.reduce((a, e) => a + ewWertung(e.id).length, 0);
      return `<section class="hero small"><div class="eyebrow">Training</div><h1>Einwand-Drill</h1>
        <p class="lead">${E.length} Einwände, die in echten Gesprächen fallen. Bei jedem antwortest du zuerst selbst, laut oder getippt, und siehst erst danach das Muster nach LAER (zuhören, anerkennen, erkunden, antworten). Dann bewertest du dich ehrlich. Mit API-Schlüssel spielt der Coach den Kunden und bleibt hartnäckig.</p>
        ${gesamt ? `<p class="muted">${gesamt} Durchgänge bisher.</p>` : ''}</section>
        <div class="grid">${E.map(e => { const w = ewWertung(e.id); const last = w[w.length - 1]; return `<div class="card clickable" data-route="#/einwaende/${e.id}"><div class="meta"><span class="tag">${esc(e.kontext.split(',')[0])}</span>${wvTag('ew_', e.id)}${last ? `<span class="tag ${last.wert === 2 ? 'green' : last.wert === 1 ? 'gold' : 'red'}">${last.wert === 2 ? 'getroffen' : last.wert === 1 ? 'teilweise' : 'daneben'} · ${w.length}×</span>` : ''}</div><h3>„${esc(e.einwand)}“</h3></div>`; }).join('')}</div>`;
    }
    const e = E.find(x => x.id === eid); if (!e) return routes.einwaende([]);
    if (!ewState || ewState.id !== eid) ewState = { id: eid, antwort: '', offen: false };
    const fl = findLesson(e.lektion); const w = ewWertung(e.id);
    return `<div class="breadcrumb"><a href="#/einwaende">Einwand-Drill</a> › ${esc(e.einwand)}</div>
      <section class="card exam-q"><div class="eyebrow">${esc(e.kontext)}</div><h2>„${esc(e.einwand)}“</h2>
        ${ewState.offen ? `<div class="log-entry"><div class="meta">Deine Antwort</div><div class="body">${esc(ewState.antwort)}</div></div>
          ${ewHinweise(ewState.antwort, e)}
          <div class="callout study"><div class="label">Was meist dahintersteckt</div>${esc(e.warum)}</div>
          <h3>Vorgehen</h3><ol class="steps">${e.schritte.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
          <div class="callout practice"><div class="label">Ein mögliches Muster</div>${esc(e.muster)}</div>
          <div class="callout warn"><div class="label">Die häufigste Falle</div>${esc(e.falle)}</div>
          <p class="muted small"><strong>Beleg, der die Antwort trägt:</strong> ${esc(e.beweis)}${fl ? ` · Stoff: <a href="#/lektion/${fl.kurs.id}/${fl.lektion.id}">Lektion ${fl.kurs.nr}.${lessonIndex(fl.kurs, fl.lektion.id) + 1} ${esc(fl.lektion.titel)}</a>` : ''}</p>
          <h3>Selbstbewertung nach Kriterien</h3><p class="muted">Dieselben vier Kriterien, nach denen auch der Coach bewertet. Hake nur ab, was in deiner Antwort tatsächlich steht, nicht, was du gemeint hast. Das Urteil ergibt sich aus den Haken.</p>
          <form class="ew-rubrik" data-id="${e.id}">
            ${EW_KRITERIEN.map(k => `<label class="check"><input type="checkbox" name="k" value="${k.id}"><span><strong>${k.name}</strong> <span class="muted">${k.frage}</span></span></label>`).join('')}
            <label class="check falle"><input type="checkbox" name="falle" value="1"><span><strong>Falle vermieden</strong> <span class="muted">Die Falle hier: ${esc(e.falle.split('.')[0].replace(/^./, c => c.toLowerCase()))}.</span></span></label>
            <div class="btn-row"><button class="btn primary" type="submit">Bewertung speichern</button></div>
          </form>`
        : `<p class="muted">Antworte so, wie du es dem Kunden sagen würdest, in ganzen Sätzen. Mindestens 60 Zeichen. Noch besser: erst laut sprechen, dann tippen.</p>
          <form class="ew-form" data-id="${e.id}"><textarea class="journal" rows="4" aria-label="Deine Antwort an den Kunden" placeholder="Deine Antwort an den Kunden…"></textarea><div class="btn-row"><button class="btn primary" type="submit">Antwort festhalten und Muster sehen</button>${S.apiKey ? `<a class="btn ghost" href="#/coach?einwand=${e.id}">Mit dem Coach live üben</a>` : ''}</div></form>`}
      </section>
      ${w.length ? `<p class="muted small">Bisher ${w.length} Durchgänge, zuletzt ${fmtTime(w[w.length - 1].ts)}.</p>` : ''}
      <div class="btn-row"><a class="btn ghost" href="#/einwaende">Alle Einwände</a></div>`;
  });
  function trainingsbilanz() {
    const t7 = Date.now() - 7 * 864e5;
    const arr = (prefix) => Object.entries(S.drills).filter(([k]) => k.startsWith(prefix)).flatMap(([, v]) => Array.isArray(v) ? v : []);
    const rows = [
      { name: 'Einwand-Drill', href: '#/einwaende', all: arr('ew_'), gut: x => x.wert === 2 },
      { name: 'Konzept-Kontraste', href: '#/kontraste', all: arr('kt_'), gut: x => x.score === x.n },
      { name: 'Rollenspiele', href: '#/rollenspiel', all: arr('rp_'), gut: x => rpStatus(x).s === 2 },
      { name: 'Fälle', href: '#/faelle', all: arr('fall_'), gut: x => (x.coach != null ? x.coach : x.selbst) >= 14 },
      { name: 'Schritt für Schritt', href: '#/beispiele', all: Object.entries(S.drills).filter(([k, v]) => k.startsWith('wb_') && v).map(([, v]) => v), gut: x => x.stufe >= 4 },
    ];
    if (rows.every(r => !r.all.length)) return `<div class="card empty"><div class="eyebrow">Trainingsbilanz</div><p>Noch keine Übung gemacht. Der schnellste Einstieg: ein <a href="#/einwaende">Einwand-Drill</a>, fünf Minuten, ohne Vorwissen. Danach steht hier deine erste Zeile.</p><div class="btn-row"><a class="btn small primary" href="#/einwaende">Ersten Drill starten →</a><a class="btn small ghost" href="#/kontraste">Oder Konzept-Kontraste</a></div></div>`;
    return `<div class="card"><div class="eyebrow">Trainingsbilanz</div>
      <table class="week-table"><thead><tr><th>Übung</th><th>Gesamt</th><th>7 Tage</th><th>Getroffen</th></tr></thead><tbody>${rows.map(r => { const n7 = r.all.filter(x => x.ts > t7).length; const gut = r.all.filter(r.gut).length; return `<tr><td><a href="${r.href}">${r.name}</a></td><td class="wk">${r.all.length}</td><td class="wk ${n7 ? '' : 'muted'}">${n7}</td><td class="wk">${r.all.length ? Math.round(gut / r.all.length * 100) + ' %' : '–'}</td></tr>`; }).join('')}</tbody></table>
      <p class="muted small">„Getroffen“ heißt: Einwand als getroffen bewertet, alle Kontrast-Fälle richtig, Rollenspiel bestanden, Fall mit mindestens 14 von 18, alle vier Stufen geschafft. Eine Übung, die seit sieben Tagen bei Null steht, ist die nächste.</p></div>`;
  }
  // ---------- Einstufung: Diagnose für Quereinsteiger, schaltet nichts frei ----------
  let esState = null;
  function einstufungFragen() {
    return KURSE.flatMap(k => { const pool = k.lektionen.flatMap(l => l.quiz.filter(q => q.typ !== 'anwendung').map(q => ({ ...q, kurs: k.id, lektion: l.titel }))); const idx = hashStr('einstufung:' + k.id) % pool.length; return [pool[idx], pool[(idx + Math.floor(pool.length / 2)) % pool.length]]; });
  }
  route('einstufung', () => {
    const E = S.einstufung;
    if (esState) {
      const q = esState.fragen[esState.i]; if (!q.order) q.order = shuffle(q.optionen.map((_, i) => i));
      return `<div class="breadcrumb">Einstufung · Frage ${esState.i + 1} von ${esState.fragen.length}</div>
        <div class="bar"><div class="bar-fill" style="width:${esState.i / esState.fragen.length * 100}%"></div></div>
        <section class="card exam-q"><div class="eyebrow">Keine Hilfsmittel · Wenn du es nicht weißt, wähl „Weiß ich nicht“</div><h2>${esc(q.frage)}</h2>
          ${q.order.map(oi => `<button class="opt btn-opt" data-act="es-answer" data-oi="${oi}">${esc(q.optionen[oi])}</button>`).join('')}
          <button class="opt btn-opt muted" data-act="es-answer" data-oi="-1">Weiß ich nicht</button></section>`;
    }
    return `<section class="hero small"><div class="eyebrow">Curriculum</div><h1>Einstufung</h1>
      <p class="lead">Zwanzig Fragen, zwei je Modul, zehn Minuten. Das Ergebnis zeigt dir, wo du Vorwissen mitbringst und wo du besonders gründlich sein solltest. Es schaltet nichts frei, weil jedes Modul auf dem vorherigen aufbaut. Du weißt danach, wo das Quiz schnell geht und wo du langsamer lesen solltest. Der Coach kennt dein Ergebnis.</p>
      ${E ? `<p class="muted">Zuletzt am ${new Date(E.ts).toLocaleDateString('de-DE')}: ${E.gesamt} von ${E.n} richtig.</p>` : ''}
      <div class="btn-row"><button class="btn primary" data-act="es-start">${E ? 'Noch einmal einstufen' : 'Einstufung starten'}</button></div></section>
      ${E ? `<div class="card"><div class="eyebrow">Dein Profil</div><table class="week-table"><tbody>${KURSE.map(k => { const r = E.module[k.id] || { ok: 0, n: 2 }; return `<tr><td><a href="#/kurs/${k.id}">${k.nr} ${esc(k.titel)}</a></td><td class="wk">${r.ok}/${r.n}</td><td>${r.ok === r.n ? '<span class="tag green">Vorwissen</span>' : r.ok === 0 ? '<span class="tag red">gründlich lesen</span>' : '<span class="tag gold">teilweise</span>'}</td></tr>`; }).join('')}</tbody></table>
        <p class="muted small">Zwei Fragen je Modul sind eine grobe Schätzung, keine Prüfung. „Vorwissen“ heißt: Lies trotzdem, aber achte auf die Gegenproben und Studien, die du vermutlich nicht kennst. „Gründlich lesen“ heißt: Vorab-Frage und Abruf ernst nehmen, das Quiz nicht vor dem zweiten Lesen.</p></div>
        <div class="callout study"><div class="label">Warum kein Überspringen</div>Wer ein Modul überspringt, weil er die Begriffe kennt, verpasst meistens die Stellen, an denen das Alltagswissen falsch ist (Mehrabian, Power-Posing, „93 Prozent nonverbal“). Die Modulprüfung mit 80 Prozent ist der Test, nicht das Gefühl, es schon zu wissen.</div>` : ''}`;
  });
  route('training', () => {
    const day = Object.keys(S.ablehnung).length;
    const stufen = ['Rückblick', 'Stufe 1 · Mikro-Bitten', 'Stufe 2 · Fremde', 'Stufe 3 · Pitch & Rat', 'Stufe 4 · Kaltakquise', 'Stufe 5 · Echtgespräch'];
    return `<section class="hero small"><div class="eyebrow">Training</div><h1>Drills & Programm</h1>
      <p class="lead">Wissen ist billig. Hier zählt, was du draußen tust. Drei Instrumente: tägliche Drills, das 30-Tage-Ablehnungstraining (nach Jia Jiang und der Expositionsforschung) und die Erfolgsleiter (nach Bandura: Selbstwirksamkeit entsteht aus gestuften Erfolgen).</p></section>
      ${wvCard(20)}
      ${trainingsbilanz()}
      <h2 class="section-title">Tägliche Drills</h2>
      <div class="grid">${window.TAGESDRILLS.map(d => { const n = (S.drills['tag_' + d.id] || []).length; const todayDone = (S.drills['tag_' + d.id] || []).some(x => x.ts > Date.now() - 864e5);
        return `<div class="card"><div class="meta">${d.dauer} Min. · ${n}× gemacht</div><h3>${esc(d.name)}</h3><p class="muted">${esc(d.text)}</p><button class="btn small ${todayDone ? 'ghost' : ''}" data-act="drill-done" data-id="${d.id}">${todayDone ? '✓ heute' : 'Erledigt'}</button></div>`; }).join('')}</div>
      <h2 class="section-title">30-Tage-Ablehnungstraining · Tag ${Math.min(day + 1, 30)}</h2>
      <p class="muted">Ein Tag pro Tag. Ziel ist nicht das Ja, sondern die Erfahrung, dass das Nein dich nicht umbringt. Jede Aufgabe braucht eine kurze Notiz, was passiert ist.</p>
      <div class="days">${window.ABLEHNUNGSTRAINING.map(a => { const d = S.ablehnung[a.tag]; const active = a.tag === day + 1; const locked = a.tag > day + 1;
        return `<div class="card day ${d ? 'done' : active ? 'active' : 'locked'}"><div class="meta">Tag ${a.tag} · ${stufen[a.stufe]}${d ? ' · ✓ ' + fmtDate(d.ts) : ''}</div><p>${esc(a.aufgabe)}</p>
          ${d ? `<div class="body muted">${esc(d.note)}</div>` : active ? `<form class="ablehnung" data-tag="${a.tag}"><textarea class="journal" rows="3" aria-label="Ergebnis der heutigen Ablehnungsaufgabe" placeholder="Was hast du gefragt, was war die Antwort, wie hat es sich angefühlt?"></textarea><div class="btn-row"><button class="btn small primary">Tag abschließen</button></div></form>` : ''}</div>`; }).join('')}</div>
      <h2 class="section-title">Erfolgsleiter</h2>
      <p class="muted">Von leicht nach schwer. Jede Stufe erst abhaken, wenn du sie wirklich gemacht hast. Du kannst die Stufen auf dein Ziel anpassen.</p>
      <div class="card"><ol class="leiter">${S.leiter.map((l, i) => `<li class="check ${l.done ? 'done' : ''}" data-act="leiter-toggle" data-i="${i}"><span class="box"></span><span class="txt">${esc(l.text)}</span><button class="x" data-act="leiter-del" data-i="${i}" title="Entfernen">×</button></li>`).join('')}</ol>
        <form class="leiter-add inline"><input aria-label="Eigene Stufe hinzufügen" placeholder="Eigene Stufe hinzufügen…"><button class="btn small">Hinzufügen</button></form></div>`;
  });

  // ---------- Körpersprache-Trainer ----------
  route('koerper', () => `<section class="hero small"><div class="eyebrow">Training</div><h1>Körpersprache-Trainer</h1>
      <p class="lead">Zeitgesteuerte Drills vor Spiegel oder Kamera. Nach jedem Drill bewertest du dich an festen Kriterien. Die Belege stehen bei jedem Drill, inklusive dem, was NICHT belegt ist (Power Posing, 7-38-55).</p></section>
      <div class="grid">${window.KOERPER_DRILLS.map(d => { const runs = S.drills['kd_' + d.id] || []; const avg = runs.length ? Math.round(runs.reduce((a, r) => a + r.score, 0) / runs.length * 10) / 10 : null;
        return `<div class="card"><div class="meta"><span>${d.sekunden} Sek.</span><span>${runs.length}×</span>${avg !== null ? '<span>Ø ' + avg + '/' + d.kriterien.length + '</span>' : ''}</div><h3>${esc(d.name)}</h3><p class="muted">${esc(d.anleitung)}</p><button class="btn small" data-act="kd-start" data-id="${d.id}">Drill starten</button></div>`; }).join('')}</div>`);
  function startKd(id) {
    const d = window.KOERPER_DRILLS.find(x => x.id === id); let left = d.sekunden;
    const m = modal(`<div class="eyebrow">${esc(d.name)}</div><div class="timer" id="kd-timer">${left}</div><p>${esc(d.anleitung)}</p><div class="btn-row"><button class="btn ghost" data-act="kd-skip">Abbrechen</button></div>`);
    const iv = setInterval(() => { left--; const t = $('#kd-timer'); if (!t) { clearInterval(iv); return; } t.textContent = left; if (left <= 0) { clearInterval(iv); kdRate(d); } }, 1000);
    m.querySelector('[data-act=kd-skip]').onclick = () => { clearInterval(iv); closeModal(); };
  }
  function kdRate(d) {
    modal(`<div class="eyebrow">Selbstbewertung · ${esc(d.name)}</div><h3>Was hat gestimmt?</h3><form id="kd-form">${d.kriterien.map((k, i) => `<label class="check"><input type="checkbox" name="k${i}"> ${esc(k)}</label>`).join('')}<div class="btn-row"><button class="btn primary">Speichern</button></div></form>`);
    $('#kd-form').onsubmit = (e) => { e.preventDefault(); const score = [...e.target.querySelectorAll('input:checked')].length; (S.drills['kd_' + d.id] = S.drills['kd_' + d.id] || []).push({ ts: Date.now(), score }); touch(); save(); closeModal(); toast(`${score}/${d.kriterien.length} Kriterien. ${score === d.kriterien.length ? 'Sauber.' : 'Morgen nochmal.'}`, score === d.kriterien.length ? 'good' : ''); navigate(); };
  }

  // ---------- Checklisten ----------
  route('checklisten', () => `<section class="hero small"><div class="eyebrow">Training</div><h1>Checklisten</h1><p class="lead">Drei Listen für die Zeit vor, während und nach dem Gespräch. Die Haken bleiben pro Liste gespeichert, bis du sie zurücksetzt. Gedruckt passen sie auf eine Seite neben das Telefon.</p>
    <div class="btn-row no-print"><button class="btn ghost" data-act="print">Drucken oder als PDF sichern</button></div></section>
    <div class="checklisten">
    ${window.CHECKLISTEN.map(c => { const st = S.checks[c.id] || {}; const n = c.punkte.filter((_, i) => st[i]).length;
      return `<div class="card"><div class="meta">${n}/${c.punkte.length} <button class="btn small ghost no-print" data-act="check-reset" data-id="${c.id}">Zurücksetzen</button></div><h3>${esc(c.titel)}</h3><p class="muted">${esc(c.beschreibung)}</p>
        ${c.punkte.map((p, i) => `<label class="check ${st[i] ? 'done' : ''}"><input type="checkbox" data-act="check-toggle" data-id="${c.id}" data-i="${i}" ${st[i] ? 'checked' : ''}> ${esc(p)}</label>`).join('')}</div>`; }).join('')}</div>`);

  // ---------- Kundenanalyse ----------
  route('kundenanalyse', () => {
    const F = window.KA_FRAGEN;
    return `<section class="hero small"><div class="eyebrow">Wissen</div><h1>Kundenanalyse</h1><p class="lead">Beantworte neun Fragen über einen echten Kunden. Du bekommst Kaufmotiv, Verhaltenstendenz (DISG, Hinweis: niedrige wissenschaftliche Validität, als Gesprächshilfe gedacht), Big-Five-Hinweise, Qualifizierung (BANT) und konkrete Gesprächsempfehlungen.</p></section>
      <form id="ka-form" class="card"><label>Name oder Kürzel des Kunden <input name="name" required placeholder="z. B. Café Krüger"></label>
        <div class="callout practice"><div class="label">Erst seine Worte, dann deine Einordnung</div>Ein Profil taugt nur so viel wie die Zitate dahinter. Schreib auf, was der Kunde wörtlich gesagt hat, bevor du ihn in Typen sortierst. Ein Gespräch ergibt eine Hypothese, kein Urteil; nach dem zweiten Gespräch prüfst du sie.</div>
        <label>Auslöser: Was ist passiert, dass er jetzt sucht? <input name="ausloeser" placeholder="z. B. „Seit die Steuerprüfung zwei Tage gedauert hat …“"></label>
        <label>Wörtliche Zitate (Schmerz, Wunsch, Einwand) <textarea name="zitate" rows="3" placeholder="Ein Zitat pro Zeile, in seinen Worten, nicht in deinen"></textarea></label>
        <label>Alternativen, die er erwägt <input name="alternativen" placeholder="z. B. Wettbewerber X, selbst machen, nichts tun"></label>
        ${F.map(f => `<div class="ka-q"><div class="q">${esc(f.text)}</div>${f.optionen.map((o, i) => `<label class="opt"><input type="radio" name="${f.id}" value="${i}" required> <span>${esc(o.text)}</span></label>`).join('')}</div>`).join('')}
        <div class="btn-row"><button class="btn primary">Profil erstellen</button></div></form>
      ${S.ka.length ? `<h2 class="section-title">Gespeicherte Profile</h2><div class="btn-row no-print" style="margin-top:0"><button class="btn ghost" data-act="print">Profile drucken oder als PDF sichern</button></div>${S.ka.slice().reverse().map(p => `<div class="card ka-profile"><div class="meta">${fmtDate(p.ts)} <span class="muted">· Hypothese aus einem Gespräch, nach dem nächsten prüfen</span> <button class="btn small ghost no-print" data-act="ka-del" data-id="${p.id}">Löschen</button></div><h3>${esc(p.name)}</h3>
        ${p.ausloeser || p.zitate || p.alternativen ? `<div class="persona">${p.ausloeser ? `<div class="sb-row"><div class="lbl">Auslöser</div><div>${esc(p.ausloeser)}</div></div>` : ''}${p.zitate ? `<div class="sb-row"><div class="lbl">Seine Worte</div><div>${p.zitate.split(/\n+/).filter(Boolean).map(z => `<div class="zitat">„${esc(z.trim().replace(/^[„"“]|[“"”]$/g, ''))}“</div>`).join('')}</div></div>` : ''}${p.alternativen ? `<div class="sb-row"><div class="lbl">Alternativen</div><div>${esc(p.alternativen)}</div></div>` : ''}</div>` : ''}
        ${p.html}</div>`).join('')}` : ''}`;
  });
  function kaProfile(form) {
    const fd = new FormData(form); const F = window.KA_FRAGEN; let motiv = null; const disg = {}; const big5 = []; let bant = 0, bantN = 0; const bantNeg = [];
    F.forEach(f => { const o = f.optionen[Number(fd.get(f.id))]; if (!o) return; if (o.motiv) motiv = o.motiv; if (o.disg) disg[o.disg] = (disg[o.disg] || 0) + 1; if (o.big5) big5.push(o.big5); if (o.bant !== undefined) { bant += o.bant; bantN++; if (o.bant < 0) bantNeg.push(f.text); } });
    const top = Object.entries(disg).sort((a, b) => b[1] - a[1])[0]; const D = top ? window.KA_DISG[top[0]] : null; const Mo = window.KA_MOTIVE[motiv];
    const q = bant >= 3 ? 'Heißer Lead: Budget, Entscheider, Problem und Zeitdruck sind da. Jetzt Termin mit Abschlussziel.' : bant >= 1 ? 'Qualifiziert mit Lücken. Kläre vor dem nächsten Gespräch: ' + (bantNeg.length ? bantNeg.join('; ') : 'die offenen Punkte') + '.' : 'Schwacher Lead. Erst Problem und Entscheidungsweg aufdecken, bevor du Zeit investierst. Oder loslassen.';
    const html = `<div class="two-col"><div><div class="eyebrow">Kaufmotiv</div><h4>${esc(Mo.name)}</h4><p><strong>Sprache:</strong> ${esc(Mo.sprache)}</p><p><strong>Vermeiden:</strong> ${esc(Mo.warnung)}</p></div>
      <div><div class="eyebrow">Verhaltenstendenz</div><h4>${D ? esc(D.name) : '–'}</h4><p>${D ? esc(D.tipps) : ''}</p></div></div>
      <div class="eyebrow">Big-Five-Hinweise</div><p>${big5.includes('aengstlich') ? 'Hoher Neurotizismus: Rückversicherung, Garantien, kein Druck, Referenzen. ' : 'Emotional stabil: direkt entscheiden lassen, Fakten reichen. '}${big5.includes('vertraeglich') ? 'Hohe Verträglichkeit: Höfliche Jas prüfen („Was müsste passieren, damit das nicht klappt?“). ' : big5.includes('fordernd') ? 'Fordernd: Klar ankern, Zugeständnisse nur gegen Gegenleistung. ' : ''}</p>
      <div class="eyebrow">Qualifizierung (BANT ${bant}/${bantN})</div><p>${esc(q)}</p>
      <div class="eyebrow">Gesprächsplan</div><ol class="steps"><li>Einstieg in der Sprache des Motivs: ${esc(Mo.name)}.</li><li>Tempo und Stil anpassen: ${D ? esc(D.name) : 'neutral'}.</li><li>Drei Auswirkungsfragen zum Problem, bevor du eine Lösung nennst.</li><li>Nächster Schritt: ${bant >= 3 ? 'Abschluss oder Angebot mit Termin' : 'Qualifizierungslücken schließen, dann Termin'}.</li></ol>`;
    const cut = (k, n) => (fd.get(k) || '').trim().slice(0, n);
    S.ka.push({ id: uid(), name: fd.get('name'), ts: Date.now(), html, ausloeser: cut('ausloeser', 300), zitate: cut('zitate', 1200), alternativen: cut('alternativen', 300), motiv: Mo.name, disg: D ? D.name : '' }); touch(); save(); toast('Profil erstellt.', 'good'); navigate();
  }

  // ---------- Wiederholen ----------
  let srsState = null;
  route('wiederholen', () => {
    const karten = srsKarten(); const f = srsFaellig();
    const stats = Object.values(S.srs); const gesamt = stats.reduce((a, x) => a + (x.n || 0), 0); const sicher = karten.filter(c => (S.srs[c.id] || {}).box >= 3).length;
    if (!karten.length) return `<section class="hero small"><div class="eyebrow">Curriculum</div><h1>Wiederholen</h1><p class="lead">Hier landen alle Quizfragen abgeschlossener Lektionen als Karten. Sie kommen in wachsenden Abständen wieder (1, 3, 7, 14, 30, 60 Tage), gemischt über alle Module. Das ist die am besten belegte Lerntechnik überhaupt (Cepeda et al. 2006; Dunlosky et al. 2013). Schließ die erste Lektion ab, dann geht es los.</p></section>`;
    if (srsState && srsState.karte) {
      const c = srsState.karte; const q = c.q;
      if (!srsState.order) srsState.order = shuffle(q.optionen.map((_, i) => i));
      return `<div class="breadcrumb">Wiederholen · noch ${srsState.rest} heute</div>
        <section class="card exam-q"><div class="eyebrow">Lektion ${c.kurs.nr}.${lessonIndex(c.kurs, c.lektion.id) + 1} · ${esc(c.lektion.titel)}</div><h2>${esc(q.frage)}</h2>
        ${srsState.antwort === undefined ? srsState.order.map(oi => `<button class="opt btn-opt" data-act="srs-answer" data-oi="${oi}">${esc(q.optionen[oi])}</button>`).join('')
          : `${srsState.order.map(oi => `<div class="opt ${oi === q.richtig ? 'correct' : oi === srsState.antwort ? 'wrong' : ''}">${esc(q.optionen[oi])}</div>`).join('')}<div class="explain">${srsState.antwort !== q.richtig && q.warumFalsch && q.warumFalsch[srsState.antwort] ? `<span class="wf"><strong>Warum deine Antwort nicht stimmt:</strong> ${esc(q.warumFalsch[srsState.antwort])}</span> ` : ''}${esc(q.erklaerung)}</div><div class="btn-row"><button class="btn primary" data-act="srs-next">${srsState.rest > 0 ? 'Nächste Karte →' : 'Fertig für heute'}</button><a class="btn ghost" href="#/lektion/${c.kurs.id}/${c.lektion.id}">Lektion nachlesen</a></div>`}
        </section>`;
    }
    const n = Math.min(f.due.length, f.rest);
    return `<section class="hero small"><div class="eyebrow">Curriculum</div><h1>Wiederholen</h1>
      <p class="lead">${n ? `${n} Karten sind heute fällig.` : f.heute ? 'Für heute erledigt.' : 'Nichts fällig.'} Höchstens ${SRS_MAX_TAG} pro Tag, damit kein Berg entsteht. Richtig beantwortet heißt längerer Abstand, falsch heißt morgen wieder.</p>
      <div class="grid stats"><div class="stat"><div class="big">${karten.length}</div><div class="lbl">Karten</div></div><div class="stat"><div class="big">${sicher}</div><div class="lbl">sicher gelernt</div></div><div class="stat"><div class="big">${gesamt}</div><div class="lbl">Wiederholungen</div></div><div class="stat"><div class="big">${gesamt ? Math.round(stats.reduce((a, x) => a + (x.richtig || 0), 0) / gesamt * 100) : 0} %</div><div class="lbl">Trefferquote</div></div></div>
      ${kalibKarte()}
      ${n || S.apiKey ? `<div class="btn-row">${n ? `<button class="btn primary" data-act="srs-start">Jetzt wiederholen</button>` : ''}${S.apiKey ? `<a class="btn ghost" href="#/coach?lern=1">Lernsitzung mit dem Coach</a>` : ''}</div>` : ''}
      <div class="callout study"><div class="label">Warum so</div>Abstände statt Pauken: Cepeda et al. (2006) fanden über 254 Studien, dass verteiltes Lernen das massierte schlägt, und zwar umso deutlicher, je länger der Stoff halten soll. Mischen über Module (Interleaving) verbessert die Unterscheidung ähnlicher Konzepte (Rohrer & Taylor 2007). Die Obergrenze von ${SRS_MAX_TAG} verhindert das Anki-Problem, dass ein Rückstand zur Last wird.</div>`;
  });

  // ---------- Quellenverzeichnis ----------
  let qFilter = { b: 'alle', st: 'alle', q: '' };
  const stKlasse = (st) => { const t = (st || '').trim(); if (/^(A|✅|G)/.test(t)) return 'A'; if (/^(B|📘)/.test(t)) return 'B'; if (/^C/.test(t)) return 'C'; if (/^(D|MYTHOS|\[!\]|❌|K|Illustration|keine)/i.test(t)) return 'D'; return '?'; };
  const ST_LABEL = { A: 'A · robust / Primärquelle', B: 'B · solide / seriöse Sekundärquelle', C: 'C · Praxis / Buch / Meinung', D: 'D · Mythos, widerlegt, dramatisiert', '?': 'ohne Einstufung' };
  let quellenLoading = false;
  let glossarLoading = false; const gFilter = { q: '' }; const glossarWarteliste = [];
  // Lädt das Glossar einmal nach. cb läuft, sobald es da ist; ohne cb wird die Seite neu gerendert (Glossar-Route).
  function ensureGlossar(cb) {
    if (window.GLOSSAR) { if (cb) cb(); return true; }
    if (cb) glossarWarteliste.push(cb);
    if (!glossarLoading) { glossarLoading = true; const sc = document.createElement('script'); sc.src = 'js/data/glossar.js'; sc.onload = () => { const w = glossarWarteliste.splice(0); if (w.length) w.forEach(f => f()); else navigate(); }; sc.onerror = () => { glossarLoading = false; glossarWarteliste.length = 0; toast('Glossar konnte nicht geladen werden.', 'bad'); }; document.head.appendChild(sc); }
    return false;
  }
  // Fachbegriffe im Lektionstext mit dem Glossar verknüpfen: erste Nennung je Begriff, nur im Fließtext, nie in Überschriften, Links, Formularen oder Quiz.
  let glRegex = null;
  function glossarVerlinken() {
    const art = document.querySelector('article.lesson'); if (!art || art.dataset.gl) return;
    if (!window.GLOSSAR) { ensureGlossar(() => glossarVerlinken()); return; }
    art.dataset.gl = '1';
    const G = window.GLOSSAR; const byName = new Map();
    for (const g of G) { byName.set(g.b.toLowerCase(), g); for (const s of (g.syn || [])) byName.set(s.toLowerCase(), g); }
    if (!glRegex) { const esc2 = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); const terms = [...byName.keys()].sort((a, b) => b.length - a.length).map(esc2); glRegex = new RegExp('(?<![\\p{L}\\p{N}-])(' + terms.join('|') + ')(?![\\p{L}\\p{N}-])', 'giu'); }
    const seen = new Set(); const skip = 'a, h1, h2, h3, h4, button, label, textarea, input, form, .eyebrow, .quiz, .exam-q, summary, code, .gl';
    const walker = document.createTreeWalker(art, NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeValue.trim().length > 3 && !n.parentElement.closest(skip) && n.parentElement.closest('p, li, td, blockquote, .callout') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
    const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n);
    let count = 0;
    for (const node of nodes) {
      const text = node.nodeValue; glRegex.lastIndex = 0; let m, last = 0; const frag = document.createDocumentFragment(); let changed = false;
      while ((m = glRegex.exec(text))) {
        const g = byName.get(m[1].toLowerCase()); if (!g || seen.has(g.b)) continue;
        seen.add(g.b); changed = true; count++;
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const a = document.createElement('a'); a.className = 'gl'; a.href = '#/glossar?q=' + encodeURIComponent(g.b); a.title = g.b + ': ' + g.d; a.textContent = m[1]; frag.appendChild(a);
        last = m.index + m[0].length;
      }
      if (changed) { frag.appendChild(document.createTextNode(text.slice(last))); node.parentNode.replaceChild(frag, node); }
    }
    if (count) { const hint = document.createElement('p'); hint.className = 'muted small gl-hint'; hint.textContent = `${count} Fachbegriffe in dieser Lektion sind gepunktet unterstrichen: Zeigen gibt die Kurzdefinition, Klicken öffnet das Glossar.`; const h1 = art.querySelector('h1'); if (h1 && h1.nextSibling) h1.parentNode.insertBefore(hint, h1.nextSibling); }
  }
  route('glossar', () => {
    const qs = (location.hash.split('?')[1] || ''); if (qs) { const p = new URLSearchParams(qs); if (p.has('q')) { gFilter.q = p.get('q'); history.replaceState(null, '', '#/glossar'); } }
    if (!ensureGlossar()) return `<section class="hero small"><div class="eyebrow">Wissen</div><h1>Glossar</h1><p class="lead">Lade Begriffe…</p></section>`;
    const needle = gFilter.q.trim().toLowerCase();
    const list = window.GLOSSAR.filter(g => !needle || (g.b + ' ' + (g.syn || []).join(' ') + ' ' + g.d).toLowerCase().includes(needle));
    const buchstaben = [...new Set(list.map(g => g.b[0].toUpperCase()))];
    return `<section class="hero small"><div class="eyebrow">Wissen</div><h1>Glossar</h1>
      <p class="lead">${window.GLOSSAR.length} Fachbegriffe aus allen zehn Modulen, jeder mit der Lektion, in der er eingeführt wird. Ein Begriff, der hier steht, darf in Quiz, Prüfung und Rollenspiel vorausgesetzt werden.</p></section>
      <input id="g-q" class="search" type="search" aria-label="Begriff im Glossar suchen" placeholder="Begriff suchen, zum Beispiel BATNA oder Reziprozität" value="${esc(gFilter.q)}" aria-label="Glossar durchsuchen">
      ${list.length ? buchstaben.map(B => `<h2 class="section-title">${B}</h2><div class="glossar">${list.filter(g => g.b[0].toUpperCase() === B).map(g => { const k = kursById(g.k); const i = k ? lessonIndex(k, g.l) : -1; const l = i >= 0 ? k.lektionen[i] : null; const frei = l && lessonUnlocked(k, i); return `<div class="card glos"><h3>${esc(g.b)}${g.syn && g.syn.length ? ` <span class="muted syn">${esc(g.syn.join(', '))}</span>` : ''}</h3><p>${esc(g.d)}</p>${l ? `<div class="meta">${frei ? `<a href="#/lektion/${k.id}/${l.id}">Lektion ${k.nr}.${i + 1} · ${esc(l.titel)}</a>` : `<span class="muted">${lock('')} Lektion ${k.nr}.${i + 1} · ${esc(l.titel)}</span>`}</div>` : ''}</div>`; }).join('')}</div>`).join('') : '<p class="muted">Kein Begriff passt zu dieser Suche.</p>'}`;
  });
  route('quellen', () => {
    if (!window.QUELLEN) {
      if (!quellenLoading) { quellenLoading = true; const sc = document.createElement('script'); sc.src = 'js/data/quellen.js'; sc.onload = () => navigate(); sc.onerror = () => { quellenLoading = false; toast('Quellenverzeichnis konnte nicht geladen werden.', 'bad'); }; document.head.appendChild(sc); }
      return `<section class="hero small"><div class="eyebrow">Wissen</div><h1>Quellenverzeichnis</h1><p class="lead">Lade 1.400 Quellen…</p></section>`;
    }
    const Q = window.QUELLEN || []; const B = window.QUELLEN_BEREICHE || {}; const f = qFilter; const needle = f.q.toLowerCase();
    const list = Q.filter(x => (f.b === 'alle' || x.b === f.b) && (f.st === 'alle' || stKlasse(x.st) === f.st) && (!needle || (x.q + ' ' + x.k + ' ' + x.typ + ' ' + x.s).toLowerCase().includes(needle)));
    const counts = {}; Q.forEach(x => counts[stKlasse(x.st)] = (counts[stKlasse(x.st)] || 0) + 1);
    return `<section class="hero small"><div class="eyebrow">Wissen</div><h1>Quellenverzeichnis</h1>
      <p class="lead">${Q.length} geprüfte Quellen aus der Recherche: Meta-Analysen, Studien, Felddaten, Bücher, Reden, Briefe, Filme. Jede mit Kernaussage und Beweisstärke. Das ist die Grundlage jeder Lektion, und es ist die Antwort auf die Frage „Woher weißt du das?“.</p>
      <div class="legend">${Object.entries(ST_LABEL).filter(([k]) => counts[k]).map(([k, v]) => `<span class="tag st-${k}">${v} (${counts[k]})</span>`).join(' ')}</div></section>
      <input class="search" id="q-q" aria-label="Quellen durchsuchen" placeholder="Suche: Autor, Thema, Begriff (z. B. Anker, Cialdini, Lächeln)…" value="${esc(f.q)}">
      <div class="filters" id="q-b"><button class="${f.b === 'alle' ? 'active' : ''}" data-b="alle">Alle Bereiche</button>${Object.entries(B).filter(([k]) => Q.some(x => x.b === k)).map(([k, v]) => `<button class="${f.b === k ? 'active' : ''}" data-b="${k}">${esc(v)}</button>`).join('')}</div>
      <div class="filters" id="q-st"><button class="${f.st === 'alle' ? 'active' : ''}" data-st="alle">Alle Stärken</button>${['A', 'B', 'C', 'D'].map(k => `<button class="${f.st === k ? 'active' : ''}" data-st="${k}">${k}</button>`).join('')}</div>
      <p class="muted">${list.length} Treffer</p>
      <div class="q-list">${list.slice(0, 120).map(x => `<div class="q-item"><div class="meta"><span class="tag st-${stKlasse(x.st)}">${esc(x.st || '–')}</span> <span>${esc(x.typ)}</span> <span>${esc(B[x.b] || x.b)} · ${esc(x.s)} · Nr. ${x.nr}</span></div><div class="q-src">${x.l ? `<a href="${esc(x.l)}" target="_blank" rel="noopener">${esc(x.q)}</a>` : esc(x.q)}</div><div class="q-kern">${esc(x.k)}</div></div>`).join('')}${list.length > 120 ? '<p class="muted">Mehr als 120 Treffer. Bitte eingrenzen.</p>' : ''}</div>`;
  });

  // ---------- Journal & Beweisbuch ----------
  route('journal', () => `<section class="hero small"><div class="eyebrow">Ich</div><h1>Journal & Beweisbuch</h1><p class="lead">Drei Bücher. Das <strong>Erfolgsprotokoll</strong> (jeden Abend drei Dinge, die du geschafft hast). Das <strong>Beweisbuch</strong> (Belege, dass du kannst, was du behauptest: Zahlen, Feedback, Abschlüsse). Das <strong>Ablehnungstagebuch</strong> mit ABCDE-Analyse nach Seligman.</p></section>
    <div class="two-col">
      <div class="card"><h3>Erfolgsprotokoll</h3><form class="j-add" data-book="erfolg"><textarea class="journal" rows="2" aria-label="Neuer Eintrag im Erfolgsprotokoll" placeholder="Was habe ich heute geschafft? (drei Einträge pro Abend)"></textarea><div class="btn-row"><button class="btn small primary">Eintragen</button></div></form>${jList('erfolg')}</div>
      <div class="card"><h3>Beweisbuch</h3><form class="j-add" data-book="beweis"><textarea class="journal" rows="2" aria-label="Neuer Eintrag im Beweisbuch" placeholder="Beleg: Zahl, Zitat eines Kunden, Abschluss, Feedback…"></textarea><div class="btn-row"><button class="btn small primary">Eintragen</button></div></form>${jList('beweis')}</div>
    </div>
    <div class="card"><h3>Ablehnungstagebuch (ABCDE)</h3><form class="j-nein">
      <label>A · Auslöser: Was ist passiert?<textarea class="journal" name="a" rows="2" required></textarea></label>
      <label>B · Bewertung: Was habe ich mir darüber erzählt?<textarea class="journal" name="b" rows="2" required></textarea></label>
      <label>C · Konsequenz: Wie habe ich mich gefühlt und verhalten?<textarea class="journal" name="c" rows="2" required></textarea></label>
      <label>D · Disput: Welche Beweise sprechen gegen meine Bewertung? Welche andere Erklärung gibt es?<textarea class="journal" name="d" rows="2" required></textarea></label>
      <label>E · Energie: Was mache ich jetzt konkret?<textarea class="journal" name="e" rows="2" required></textarea></label>
      <div class="btn-row"><button class="btn primary">Nein eintragen</button></div></form>
      ${S.nein.slice().reverse().slice(0, 20).map(n => `<div class="log-entry"><div class="meta">${fmtTime(n.ts)}</div><div class="body"><strong>A</strong> ${esc(n.a)}<br><strong>B</strong> ${esc(n.b)}<br><strong>C</strong> ${esc(n.c)}<br><strong>D</strong> ${esc(n.d)}<br><strong>E</strong> ${esc(n.e)}</div></div>`).join('')}</div>`);
  function jList(book) { return S[book].slice().reverse().slice(0, 30).map(e => `<div class="log-entry"><div class="meta">${fmtTime(e.ts)} <button class="x" data-act="j-del" data-book="${book}" data-id="${e.id}">×</button></div><div class="body">${esc(e.text)}</div></div>`).join(''); }

  // ---------- Einstellungen ----------
  route('einstellungen', () => `<section class="hero small"><div class="eyebrow">Ich</div><h1>Einstellungen</h1></section>
    <form id="settings" class="card settings">
      <div class="eyebrow">Profil</div>
      <label>Dein Name <input name="name" value="${esc(S.name)}" placeholder="Wie soll der Coach dich ansprechen?"></label>
      <label>Mein Wenn-Dann-Plan <input name="plan" value="${esc(S.plan || '')}" placeholder="Wenn ich morgens den Kaffee aufsetze, dann mache ich 15 Minuten Akademie."></label>
      <label>Textgröße <select name="textsize">${[['normal', 'Normal'], ['gross', 'Groß'], ['sehr-gross', 'Sehr groß']].map(([v, t]) => `<option value="${v}" ${(S.textsize || 'normal') === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
      <div class="eyebrow gap">KI-Coach <span class="muted">(optional)</span></div>
      <label>Anthropic API-Schlüssel <input name="apiKey" type="password" value="${esc(S.apiKey)}" placeholder="sk-ant-…" autocomplete="off"></label>
      <label class="check-inline"><input type="checkbox" name="keySession" ${S.keySession ? 'checked' : ''}> Schlüssel nur für diese Sitzung merken. Er liegt dann im Sitzungsspeicher des Tabs statt dauerhaft im Browser und ist nach dem Schließen weg.</label>
      <p class="muted">Der Schlüssel wird nur in diesem Browser gespeichert (localStorage) und direkt an api.anthropic.com gesendet. Kein Server dazwischen. Ohne Schlüssel funktioniert alles außer dem Live-Coach; Berichte werden dann per Selbst-Check geprüft. Schlüssel gibt es unter console.anthropic.com.</p>
      <label>Modell <select name="model">${['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5'].map(m => `<option ${S.model === m ? 'selected' : ''}>${m}</option>`).join('')}</select></label>
      <div class="btn-row"><button class="btn primary" type="submit">Speichern</button><button class="btn ghost" type="button" data-act="test-key">Verbindung testen</button></div>
    </form>
    <div class="card"><div class="eyebrow">Daten</div><p class="muted">Alles liegt lokal in diesem Browser. Eine Sicherung ist eine JSON-Datei, die du hier auch wieder einspielen kannst.</p>
      <div class="btn-row"><button class="btn" data-act="export">Fortschritt exportieren (JSON)</button><label class="btn ghost">Importieren <input type="file" id="import-file" accept="application/json" hidden></label></div></div>
    <div class="card gefahr"><div class="eyebrow">Gefahrenzone</div><p class="muted">Löscht Fortschritt, Berichte, Journal und Schlüssel in diesem Browser. Vorher exportieren.</p>
      <div class="btn-row"><button class="btn ghost danger" data-act="reset">Alles zurücksetzen</button></div></div>`);


  // ---------- Prüfungs-Rückschau: alle falsch beantworteten Prüfungsfragen, bis sie in der Wiederholung sitzen ----------
  function rueckschauListe() {
    const seen = new Map();
    for (const [kid, ex] of Object.entries(S.exams)) for (const at of (ex.attempts || [])) for (const f of (at.falsch || [])) {
      const key = f.lid + ':' + f.qi; const fl = findLesson(f.lid); const q = fl && fl.lektion.quiz[f.qi]; if (!q) continue;
      const prev = seen.get(key); if (prev) { prev.n++; prev.ts = Math.max(prev.ts, at.ts); prev.a = f.a; continue; }
      seen.set(key, { key, kid: fl.kurs.id, kurs: fl.kurs, lid: f.lid, qi: f.qi, lektion: fl.lektion, q, a: f.a, n: 1, ts: at.ts, pruefung: kid });
    }
    // erledigt, wenn die Karte seit dem letzten Fehler in der Wiederholung richtig war
    return [...seen.values()].map(x => { const sr = S.srs[x.key]; x.erledigt = !!(sr && sr.lastOk && sr.lastOk > x.ts); return x; }).sort((a, b) => b.ts - a.ts);
  }
  route('rueckschau', () => {
    const alle = rueckschauListe(); const offen = alle.filter(x => !x.erledigt), fertig = alle.filter(x => x.erledigt);
    const gruppen = KURSE.map(k => ({ k, items: offen.filter(x => x.kid === k.id) })).filter(g => g.items.length);
    return `<section class="hero small"><div class="eyebrow">Curriculum</div><h1>Prüfungs-Rückschau</h1>
      <p class="lead">Jede Frage, die du in einer Modul- oder Abschlussprüfung falsch hattest, bleibt hier stehen, bis du sie in der Wiederholung richtig beantwortet hast. Prüfungsfehler zeigen, was du unter Druck nicht abrufen konntest, und genau das lohnt die Wiederholung am meisten.</p></section>
      ${!alle.length ? `<div class="card empty"><p>Noch keine Prüfungsfehler gespeichert. Die Liste füllt sich ab deiner nächsten <a href="#/kurs/${currentKurs().id}">Modulprüfung</a>.</p></div>` : ''}
      ${offen.length ? `<div class="btn-row"><button class="btn primary" data-act="rs-vorziehen">Alle ${offen.length} offenen in die heutige Wiederholung</button></div>` : alle.length ? '<div class="callout practice"><div class="label">Alles erledigt</div>Jeden Prüfungsfehler hast du seitdem in der Wiederholung richtig beantwortet.</div>' : ''}
      ${gruppen.map(g => `<h2 class="section-title">Modul ${g.k.nr} · ${esc(g.k.titel)}</h2>${g.items.map(x => `<div class="card quiz-q rs"><div class="meta"><a href="#/lektion/${x.kid}/${x.lid}">${esc(x.lektion.titel)}</a> · ${x.n > 1 ? x.n + '× falsch' : 'einmal falsch'} · ${fmtDate(x.ts)}</div>
        <div class="q">${esc(x.q.frage)}</div><div class="opt wrong">Deine Antwort: ${esc(x.q.optionen[x.a])}</div><div class="opt correct">Richtig: ${esc(x.q.optionen[x.q.richtig])}</div>
        <div class="explain">${x.q.warumFalsch && x.q.warumFalsch[x.a] ? `<span class="wf"><strong>Warum deine Antwort nicht stimmt:</strong> ${esc(x.q.warumFalsch[x.a])}</span> ` : ''}${esc(x.q.erklaerung || '')}</div></div>`).join('')}`).join('')}
      ${fertig.length ? `<details class="card"><summary>${fertig.length} erledigt</summary><ul class="wv-list">${fertig.map(x => `<li><a href="#/lektion/${x.kid}/${x.lid}">${esc(x.lektion.titel)}</a> · <span class="muted">${esc(x.q.frage)}</span></li>`).join('')}</ul></details>` : ''}`;
  });

  // ---------- Einwand-Spielbuch: die eigenen besten Antworten je Einwand, zum Mitnehmen ----------
  route('spielbuch', () => {
    if (!ensureEinwaende()) return '<section class="hero small"><div class="eyebrow">Training</div><h1>Einwand-Spielbuch</h1><p class="muted">Lade Einwände…</p></section>';
    const E = window.EINWAENDE;
    const eintrag = (e) => { const runs = ewWertung(e.id); if (!runs.length) return null; return runs.reduce((best, r) => (!best || r.wert > best.wert || (r.wert === best.wert && r.ts > best.ts)) ? r : best, null); };
    const mit = E.filter(e => eintrag(e)); const ohne = E.filter(e => !eintrag(e));
    const WERT = ['noch unsicher', 'brauchbar', 'sitzt'];
    return `<section class="hero small"><div class="eyebrow">Training</div><h1>Einwand-Spielbuch</h1>
      <p class="lead">Dein eigenes Nachschlagewerk für das nächste Gespräch: je Einwand, was dahintersteckt, deine beste eigene Antwort aus dem Drill, die häufigste Falle und der Beleg, der die Antwort trägt. Eigene Worte bleiben besser hängen als fremde Muster (Slamecka & Graf 1978), deshalb steht deine Antwort oben und das Muster darunter.</p>
      <div class="btn-row no-print"><button class="btn" data-act="print">Drucken oder als PDF sichern</button><a class="btn ghost" href="#/einwaende">Zum Einwand-Drill</a></div></section>
      ${!mit.length ? `<div class="card empty"><p>Noch leer. Das Spielbuch füllt sich mit jeder Antwort aus dem <a href="#/einwaende">Einwand-Drill</a>: Du schreibst deine Antwort, vergleichst sie mit dem Muster und bewertest sie. Die beste Antwort je Einwand landet hier.</p><div class="btn-row"><a class="btn small primary" href="#/einwaende">Ersten Einwand üben →</a></div></div>` : `<p class="muted small">${S.name ? esc(S.name) + ' · ' : ''}Stand ${new Date().toLocaleDateString('de-DE')} · ${mit.length} von ${E.length} Einwänden mit eigener Antwort${mit.filter(e => eintrag(e).wert === 2).length ? `, ${mit.filter(e => eintrag(e).wert === 2).length} davon sitzen` : ''}.</p>`}
      <div class="spielbuch">${mit.map(e => { const r = eintrag(e); return `<article class="card sb"><div class="meta"><span class="tag ${r.wert === 2 ? 'green' : r.wert === 1 ? 'gold' : ''}">${WERT[r.wert]}</span><span class="muted">${esc(e.kontext)}</span></div>
        <h3>„${esc(e.einwand)}“</h3>
        <div class="sb-row"><div class="lbl">Dahinter steckt meist</div><div>${esc(e.warum)}</div></div>
        <div class="sb-row mine"><div class="lbl">Meine Antwort</div><div>${esc(r.antwort)}${r.coach != null ? ` <span class="muted small">(Coach: ${r.coach}/40)</span>` : r.kriterien ? ` <span class="muted small">(Selbstcheck ${r.kriterien.length}/4${r.falle ? ', Falle vermieden' : ''})</span>` : ''}</div></div>
        <details class="muster"><summary>Muster nach LAER</summary><p>${esc(e.muster)}</p><ol class="steps">${e.schritte.map(x => `<li>${esc(x)}</li>`).join('')}</ol></details>
        <div class="sb-row falle"><div class="lbl">Falle</div><div>${esc(e.falle)}</div></div>
        ${e.beweis ? `<div class="sb-row"><div class="lbl">Beleg</div><div>${esc(e.beweis)}</div></div>` : ''}
        <div class="btn-row no-print"><a class="btn small ghost" href="#/einwaende/${e.id}">Noch einmal üben</a></div></article>`; }).join('')}</div>
      ${ohne.length && mit.length ? `<h2 class="section-title">Noch ohne eigene Antwort</h2><div class="wv-list-wrap card"><ul class="wv-list">${ohne.map(e => `<li><a href="#/einwaende/${e.id}">„${esc(e.einwand)}“</a> <span class="muted small">· ${esc(e.kontext)}</span></li>`).join('')}</ul></div>` : ''}`;
  });

  // ---------- Business-Planer und Coach-Seite werden von coach.js geliefert ----------
  route('coach', (p) => {
    if (/[?&]einwand=/.test(location.hash) && !ensureEinwaende()) return '<p class="muted">Lade Einwand…</p>';
    if (/[?&]fall=/.test(location.hash) && !ensureFaelle()) return '<p class="muted">Lade Fall…</p>';
    if (/[?&]rp=/.test(location.hash) && !ensureSzenarien()) return '<p class="muted">Lade Szenario…</p>';
    return window.Coach ? window.Coach.page(p) : '<p>Coach-Modul fehlt.</p>';
  });
  route('business', (p) => window.Coach ? window.Coach.businessPage(p) : '<p>Coach-Modul fehlt.</p>');

  // ---------- Ereignisse ----------
  document.addEventListener('submit', async (e) => {
    const f = e.target;
    if (f.classList.contains('quiz')) { e.preventDefault(); gradeQuiz(f); }
    else if (f.classList.contains('report')) { e.preventDefault(); submitReport(f); }
    else if (f.classList.contains('vorfrage-form')) { e.preventDefault(); const t = f.querySelector('textarea').value.trim(); if (t.length < 15) return toast('Ein ganzer Satz, bitte. Raten ist erlaubt.', 'bad'); S.vorfragen[f.dataset.lid] = { text: t, ts: Date.now() }; touch(); save(); navigate(); setTimeout(() => { const a = document.querySelector('.lesson h1'); if (a) a.scrollIntoView({ behavior: 'smooth' }); }, 50); }
    else if (f.classList.contains('abruf-form')) { e.preventDefault(); const t = f.querySelector('textarea').value.trim(); if (t.length < 120) return toast(`Zu kurz. ${120 - t.length} Zeichen fehlen. Schreib, was du wirklich behalten hast.`, 'bad'); S.abruf[f.dataset.lid] = { text: t, ts: Date.now() }; touch(); save(); navigate(); setTimeout(() => { const a = document.getElementById('abruf-box'); if (a) a.scrollIntoView({ behavior: 'smooth' }); }, 50); }
    else if (f.id === 'onboarding') { e.preventDefault(); const fd = new FormData(f); S.name = (fd.get('name') || '').trim(); S.plan = (fd.get('plan') || '').trim(); S.textsize = fd.get('textsize') || 'normal'; S.onboarded = true; applyTextsize(); save(); renderNav(); navigate(); toast(`Willkommen, ${S.name}. Lektion 1.1 wartet.`, 'good'); }
    else if (f.classList.contains('rp-pflicht')) { e.preventDefault(); const runs = S.drills['rp_' + f.dataset.sid] || []; const last = runs[runs.length - 1]; if (!last) return; last.pflicht = [...f.querySelectorAll('input[name="p"]:checked')].map(i => Number(i.value)); save(); const s = window.SZENARIEN.find(x => x.id === f.dataset.sid); toast(`Pflichtkriterien: ${last.pflicht.length} von ${s.pflicht.length}.`, last.pflicht.length === s.pflicht.length ? 'good' : ''); const box = $('#rp-box'); if (box && rpState && rpState.sid === s.id) box.innerHTML = renderRp(s); }
    else if (f.classList.contains('rp-plan-form')) { e.preventDefault(); const fd = new FormData(f); S.rpPlan[f.dataset.sid] = { ziel: (fd.get('ziel') || '').trim().slice(0, 300), erste: (fd.get('erste') || '').trim().slice(0, 300), grenze: (fd.get('grenze') || '').trim().slice(0, 300), ts: Date.now() }; rpPlanEdit = null; touch(); save(); navigate(); toast('Plan festgehalten. Jetzt spielen.', 'good'); }
    else if (f.classList.contains('ablehnung')) { e.preventDefault(); const note = f.querySelector('textarea').value.trim(); if (note.length < 20) return toast('Schreib mindestens zwei Sätze.', 'bad'); S.ablehnung[f.dataset.tag] = { note, ts: Date.now() }; touch(); save(); toast('Tag abgeschlossen. Morgen geht es weiter.', 'good'); navigate(); }
    else if (f.classList.contains('fall-form')) { e.preventDefault(); const min = Number(f.dataset.min); const t = f.querySelector('textarea').value.trim(); if (t.length < min) return toast(`Zu kurz. ${min - t.length} Zeichen fehlen. Befund, Empfehlung, Prüfung, Risiko: alles vier gehört hinein.`, 'bad'); faState.text = t; faState.stufe = 1; navigate(); window.scrollTo(0, 0); }
    else if (f.classList.contains('fall-rubrik')) { e.preventDefault(); const w = {}; window.FAELLE_RUBRIK.forEach(d => { const r = f.querySelector(`input[name="r-${d.id}"]:checked`); w[d.id] = r ? Number(r.value) : 1; }); faState.wertung = w; faState.stufe = 2; const sum = Object.values(w).reduce((a, b) => a + b, 0); (S.drills['fall_' + faState.id] = S.drills['fall_' + faState.id] || []).push({ ts: Date.now(), selbst: sum, wertung: w, text: faState.text.slice(0, 4000) }); touch(); save(); navigate(); window.scrollTo(0, 0); }
    else if (f.classList.contains('wb-form')) { e.preventDefault(); const min = Number(f.dataset.min); const t = f.querySelector('textarea').value.trim(); if (t.length < min) return toast(`Zu kurz. ${min - t.length} Zeichen fehlen. Schreib alle Schritte aus.`, 'bad'); wbState.text = t; wbState.offen = true; navigate(); }
    else if (f.classList.contains('ew-rubrik')) { e.preventDefault(); const id = f.dataset.id; if (!ewState || ewState.id !== id) return; const kriterien = [...f.querySelectorAll('input[name="k"]:checked')].map(i => i.value); const falle = !!f.querySelector('input[name="falle"]:checked'); const wert = ewWertAus(kriterien, falle); (S.drills['ew_' + id] = S.drills['ew_' + id] || []).push({ ts: Date.now(), wert, antwort: ewState.antwort.slice(0, 400), kriterien, falle }); touch(); save(); ewState = null; toast(wert === 2 ? 'Getroffen: alle vier Kriterien und Falle vermieden. Morgen noch einmal, dann sitzt es.' : wert === 1 ? `Teilweise: ${kriterien.length} von 4${falle ? '' : ', Falle nicht vermieden'}. Nimm dir beim nächsten Mal zuerst das fehlende Kriterium vor.` : 'Daneben. Lies das Vorgehen noch einmal und probier den ersten Schritt heute in einem echten Gespräch.', wert === 2 ? 'good' : ''); navigate(); }
    else if (f.classList.contains('ew-form')) { e.preventDefault(); const t = f.querySelector('textarea').value.trim(); if (t.length < 60) return toast(`Zu kurz. ${60 - t.length} Zeichen fehlen. Sag es so, wie du es sagen würdest.`, 'bad'); ewState = { id: f.dataset.id, antwort: t, offen: true }; navigate(); }
    else if (f.classList.contains('leiter-add')) { e.preventDefault(); const v = f.querySelector('input').value.trim(); if (v) { S.leiter.push({ text: v, done: false }); save(); navigate(); } }
    else if (f.id === 'ka-form') { e.preventDefault(); kaProfile(f); }
    else if (f.classList.contains('j-add')) { e.preventDefault(); const t = f.querySelector('textarea').value.trim(); if (!t) return; S[f.dataset.book].push({ id: uid(), text: t, ts: Date.now() }); touch(); save(); navigate(); }
    else if (f.classList.contains('j-nein')) { e.preventDefault(); const fd = new FormData(f); S.nein.push({ ts: Date.now(), a: fd.get('a'), b: fd.get('b'), c: fd.get('c'), d: fd.get('d'), e: fd.get('e') }); touch(); save(); toast('Nein eingetragen. Das war Training.', 'good'); navigate(); }
    else if (f.id === 'settings') { e.preventDefault(); const fd = new FormData(f); S.name = fd.get('name').trim(); S.apiKey = fd.get('apiKey').trim(); S.keySession = !!fd.get('keySession'); S.model = fd.get('model'); S.plan = (fd.get('plan') || '').trim(); S.textsize = fd.get('textsize') || 'normal'; applyTextsize(); save(); toast('Gespeichert.', 'good'); renderNav(); }
    else if (window.Coach && window.Coach.onSubmit) { if (window.Coach.onSubmit(e)) e.preventDefault(); }
  });
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el) return; const a = el.dataset.act;
    if (a === 'exam-start') startExam(el.dataset.kid);
    else if (a === 'exam-answer') examAnswer(el.dataset.oi);
    else if (a === 'myth-answer') { const s = mythState; const it = s.items[s.i]; const ok = (el.dataset.v === '1') === it.echt; if (ok) s.score++; s.last = { ok, erkl: it.erkl }; touch(); navigate(); }
    else if (a === 'myth-next') { const s = mythState; s.last = null; s.i++; if (s.i >= s.items.length) { s.done = true; (S.drills.mythen = S.drills.mythen || []).push({ ts: Date.now(), score: s.score }); save(); } navigate(); }
    else if (a === 'rp-start') { const s = window.SZENARIEN.find(x => x.id === el.dataset.sid); rpState = { sid: s.id, node: s.offline.start, hist: [] }; navigate(); setTimeout(() => $('#rp-box') && $('#rp-box').scrollIntoView({ behavior: 'smooth' }), 50); }
    else if (a === 'rp-choose') { const s = window.SZENARIEN.find(x => x.id === rpState.sid); const node = s.offline.knoten[rpState.node]; const o = node.optionen[Number(el.dataset.oi)]; rpState.hist.push({ npc: node.npc, you: o.text, feedback: o.feedback, bewertung: o.bewertung }); rpState.node = o.next; const nn = s.offline.knoten[o.next]; if (nn.ende) { const good = rpState.hist.filter(h => h.bewertung === 'good').length; (S.drills['rp_' + s.id] = S.drills['rp_' + s.id] || []).push({ ts: Date.now(), art: 'Offline', score: good, n: rpState.hist.length, fazit: nn.fazit }); touch(); save(); } $('#rp-box').innerHTML = renderRp(s); }
    else if (a === 'drill-done') { const k = 'tag_' + el.dataset.id; (S.drills[k] = S.drills[k] || []).push({ ts: Date.now() }); touch(); save(); toast('Drill erledigt.', 'good'); navigate(); }
    else if (a === 'leiter-toggle') { if (e.target.classList.contains('x')) return; const l = S.leiter[Number(el.dataset.i)]; l.done = !l.done; if (l.done) touch(); save(); navigate(); }
    else if (a === 'leiter-del') { e.stopPropagation(); S.leiter.splice(Number(el.dataset.i), 1); save(); navigate(); }
    else if (a === 'print') window.print();
    else if (a === 'es-start') { esState = { fragen: einstufungFragen(), i: 0, antworten: [] }; navigate(); window.scrollTo(0, 0); }
    else if (a === 'es-answer') { const e = esState; e.antworten.push(Number(el.dataset.oi)); e.i++; if (e.i < e.fragen.length) { navigate(); window.scrollTo(0, 0); return; } const module = {}; e.fragen.forEach((q, i) => { const m = module[q.kurs] = module[q.kurs] || { ok: 0, n: 0 }; m.n++; if (e.antworten[i] === q.richtig) m.ok++; }); const gesamt = Object.values(module).reduce((a, m) => a + m.ok, 0); S.einstufung = { ts: Date.now(), module, gesamt, n: e.fragen.length }; esState = null; touch(); save(); toast(`${gesamt} von ${e.fragen.length}. Dein Profil steht unten.`, 'good'); navigate(); }
    else if (a === 'fall-back') { faState.stufe = 0; navigate(); }
    else if (a === 'fall-restart') { faState = { id: faState.id, text: '', stufe: 0, wertung: {} }; navigate(); }
    else if (a === 'kt-wahl') { ktState.gewaehlt = Number(el.dataset.i); const x = window.KONTRASTE.find(k => k.id === ktState.id); ktState.antworten[ktState.i] = { wahl: ktState.gewaehlt, ok: ktState.gewaehlt === x.faelle[ktState.i].richtig }; navigate(); }
    else if (a === 'kt-next') { const x = window.KONTRASTE.find(k => k.id === ktState.id); ktState.i++; ktState.gewaehlt = null; if (ktState.i >= x.faelle.length) { (S.drills['kt_' + x.id] = S.drills['kt_' + x.id] || []).push({ ts: Date.now(), score: ktState.antworten.filter(z => z.ok).length, n: x.faelle.length, fehler: ktState.antworten.map((z, i) => z.ok ? null : [z.wahl, x.faelle[i].richtig]).filter(Boolean) }); touch(); save(); } navigate(); }
    else if (a === 'kt-restart') { ktState = null; navigate(); }
    else if (a === 'wb-next') { const x = window.BEISPIELE.find(b => b.id === wbState.id); const reached = wbState.stufe + 1; const saved = S.drills['wb_' + x.id] || { stufe: 0 }; if (reached > saved.stufe) { S.drills['wb_' + x.id] = { stufe: reached, ts: Date.now(), n: saved.n || 1 }; touch(); save(); } else if (reached >= 4) { S.drills['wb_' + x.id] = { stufe: 4, ts: Date.now(), n: (saved.n || 1) + 1 }; touch(); save(); } if (reached >= 4) { toast('Alle vier Stufen geschafft. In einer Woche mit eigenem Fall wiederholen.', 'good'); wbState = { id: x.id, stufe: 3, offen: false, text: '' }; location.hash = '#/beispiele'; return; } wbState = { id: x.id, stufe: reached, offen: false, text: '' }; navigate(); window.scrollTo(0, 0); }
    else if (a === 'wb-retry') { wbState.offen = false; wbState.text = ''; navigate(); }
    else if (a === 'wb-back') { wbState = { id: wbState.id, stufe: Math.max(0, wbState.stufe - 1), offen: false, text: '' }; navigate(); }
    else if (a === 'show-opts') { const box = el.closest('.quiz-q'); box.querySelector('.opts').hidden = false; el.remove(); }

    else if (a === 'report-vorlage') { const ta = el.closest('form').querySelector('textarea'); const tpl = 'Situation (wann, wo, mit wem):\n\nWas ich konkret gesagt oder getan habe:\n\nWas daraufhin passiert ist (Reaktion, Wortlaut, Ergebnis):\n\nWas ich beim nächsten Mal anders mache und woran ich merke, dass es wirkt:\n'; ta.value = ta.value.trim() ? ta.value + '\n\n' + tpl : tpl; ta.focus(); ta.dispatchEvent(new Event('input', { bubbles: true })); }
    else if (a === 'print') { window.print(); }
    else if (a === 'rp-plan-edit') { rpPlanEdit = el.dataset.sid; navigate(); }
    else if (a === 'rp-plan-cancel') { rpPlanEdit = null; navigate(); }
    else if (a === 'rs-vorziehen') { const t = today(); let n = 0; for (const x of rueckschauListe()) { if (x.erledigt) continue; S.srs[x.key] = Object.assign(S.srs[x.key] || { n: 0, richtig: 0 }, { box: 0, due: t }); n++; } save(); toast(`${n} Fragen stehen heute in der Wiederholung.`, 'good'); location.hash = '#/wiederholen'; }
    else if (a === 'tour-weg') { S.tourWeg = true; save(); navigate(); toast('Die Liste ist ausgeblendet. Die Schritte zählen weiter.', 'good'); }
    else if (a === 'abruf-coach') { if (!window.Coach) return; el.disabled = true; el.textContent = 'Coach liest…'; const lid = el.dataset.lid; const fl = findLesson(lid); window.Coach.abrufFeedback(fl, S.abruf[lid].text).then(t => { S.abruf[lid].coach = t; save(); navigate(); setTimeout(() => { const b = document.getElementById('abruf-box'); if (b) b.scrollIntoView(); }, 50); }).catch(err => { toast(err.message, 'bad'); el.disabled = false; el.textContent = 'Coach: Was fehlt in meiner Zusammenfassung?'; }); }
    else if (a === 'srs-start') { const f = srsFaellig(); srsState = { queue: f.due.slice(0, f.rest), rest: 0 }; srsState.karte = srsState.queue.shift(); srsState.rest = srsState.queue.length; navigate(); }
    else if (a === 'srs-answer') { const c = srsState.karte; srsState.antwort = Number(el.dataset.oi); const ok = srsState.antwort === c.q.richtig; if (ok && S.blind[c.id]) { delete S.blind[c.id]; } srsAntwort(c.id, ok); if (ok && S.srs[c.id]) { S.srs[c.id].lastOk = Date.now(); } save(); navigate(); }
    else if (a === 'srs-next') { if (!srsState.queue.length) { srsState = null; toast('Wiederholung für heute abgeschlossen.', 'good'); } else { srsState.karte = srsState.queue.shift(); srsState.rest = srsState.queue.length; srsState.antwort = undefined; srsState.order = null; } navigate(); }
    else if (a === 'kd-start') startKd(el.dataset.id);
    else if (a === 'check-toggle') { const st = S.checks[el.dataset.id] = S.checks[el.dataset.id] || {}; st[el.dataset.i] = el.checked; el.closest('label').classList.toggle('done', el.checked); save(); }
    else if (a === 'check-reset') { delete S.checks[el.dataset.id]; save(); navigate(); }
    else if (a === 'ka-del') { S.ka = S.ka.filter(p => p.id !== el.dataset.id); save(); navigate(); }
    else if (a === 'j-del') { S[el.dataset.book] = S[el.dataset.book].filter(x => x.id !== el.dataset.id); save(); navigate(); }
    else if (a === 'export') { const b = new Blob([JSON.stringify({ ...S, apiKey: '' }, null, 2)], { type: 'application/json' }); const u = URL.createObjectURL(b); const l = document.createElement('a'); l.href = u; l.download = 'verkaufsakademie-' + today() + '.json'; l.click(); S.lastExport = Date.now(); save(); toast('Sicherung heruntergeladen.', 'good'); }
    else if (a === 'reset') { modal(`<h3>Wirklich alles löschen?</h3><p>Fortschritt, Berichte, Journal, Schlüssel. Das lässt sich nicht rückgängig machen.</p><div class="btn-row"><button class="btn danger" id="reset-yes">Ja, löschen</button><button class="btn ghost" data-act="close-modal">Abbrechen</button></div>`); $('#reset-yes').onclick = () => { localStorage.removeItem(KEY); load(); closeModal(); location.hash = '#/'; navigate(); toast('Zurückgesetzt.'); }; }
    else if (a === 'close-modal') closeModal();
    else if (a === 'test-key') { if (!window.Coach) return; const key = $('#settings [name=apiKey]').value.trim(); if (!key) return toast('Erst einen Schlüssel eintragen.', 'bad'); el.textContent = 'Teste…'; window.Coach.test(key, $('#settings [name=model]').value).then(() => { el.textContent = 'Verbindung testen'; toast('Verbindung steht. Der Coach ist bereit.', 'good'); }).catch(err => { el.textContent = 'Verbindung testen'; toast('Fehler: ' + err.message, 'bad'); }); }
    else if (window.Coach && window.Coach.onClick) window.Coach.onClick(a, el, e);
  });
  document.addEventListener('input', (e) => {
    if (e.target.matches('.report textarea, .abruf-form textarea, .fall-form textarea')) { const n = e.target.value.trim().length; const c = e.target.closest('form').querySelector('.count'); const min = e.target.closest('.abruf-form') ? 120 : REPORT_MIN; c.querySelector('.n').textContent = n; c.classList.toggle('ok', n >= min); }
    if (e.target.id === 'lib-q' || e.target.id === 'q-q' || e.target.id === 'g-q') { const id = e.target.id; (id === 'lib-q' ? libFilter : id === 'g-q' ? gFilter : qFilter).q = e.target.value; clearTimeout(e.target._t); e.target._t = setTimeout(() => { const pos = e.target.selectionStart; navigate(); const n = $('#' + id); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }, 250); }
  });
  document.addEventListener('change', (e) => { if (e.target.id === 'import-file') { const r = new FileReader(); r.onload = () => { try { const d = JSON.parse(r.result); if (!d.quiz) throw new Error('kein gültiger Export'); S = Object.assign(pickState(d), { apiKey: S.apiKey, keySession: S.keySession }); if (Object.keys(S.activity || {}).length || S.name) S.onboarded = true; applyTextsize(); save(); renderNav(); toast('Importiert.', 'good'); navigate(); } catch (err) { toast('Import fehlgeschlagen: ' + err.message, 'bad'); } }; r.readAsText(e.target.files[0]); } });
  document.addEventListener('click', (e) => { const b = e.target.closest('#lib-kat button, #lib-thema button, #q-b button, #q-st button'); if (!b) return; if (b.dataset.kat) libFilter.kat = b.dataset.kat; if (b.dataset.thema) libFilter.thema = b.dataset.thema; if (b.dataset.b) qFilter.b = b.dataset.b; if (b.dataset.st) qFilter.st = b.dataset.st; navigate(); });
  function setMenu(open) { $('#sidebar').classList.toggle('open', open); $('#menu-toggle').textContent = open ? '✕' : '☰'; $('#menu-toggle').setAttribute('aria-expanded', open ? 'true' : 'false'); let bg = $('#sidebar-bg'); if (open && !bg) { bg = document.createElement('div'); bg.id = 'sidebar-bg'; bg.className = 'sidebar-bg'; bg.onclick = () => setMenu(false); document.body.appendChild(bg); } if (!open && bg) bg.remove(); }
  $('#menu-toggle').onclick = () => setMenu(!$('#sidebar').classList.contains('open'));
  const skip = document.querySelector('.skip-link'); if (skip) skip.onclick = (e) => { e.preventDefault(); const m = $('#main'); m.setAttribute('tabindex', '-1'); m.focus(); };
  window.addEventListener('hashchange', navigate);
  window.addEventListener('scroll', () => { const b = document.getElementById('read-bar'); if (!b) return; const h = document.documentElement; const p = h.scrollHeight - h.clientHeight; b.style.width = (p > 0 ? Math.min(100, h.scrollTop / p * 100) : 0) + '%'; }, { passive: true });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  window.addEventListener('beforeunload', e => { if (examState) { e.preventDefault(); e.returnValue = ''; } });

  // ---------- Öffentliche Schnittstelle für coach.js ----------
  window.VA = { get S() { return S; }, wiedervorlagen, save, touch, esc, md, toast, modal, closeModal, navigate, fmtTime, uid, KURSE, nextStep, rang, streak, totalProgress, examPassed, lessonDone, currentKurs, findLesson, quizSet, PASS, REPORT_MIN, setAfterRender: (fn) => { afterRender = fn; } };

  function applyTextsize() { document.documentElement.dataset.textsize = S.textsize || 'normal'; }
  load(); applyTextsize(); navigate();
})();

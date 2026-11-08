(function () {
  const BASIS = window.KONTO_CONFIG.url;
  const ANON = window.KONTO_CONFIG.anonKey;
  const API = BASIS + '/functions/v1/jarvis/dashboard';
  const LS = 'jarvis-sitzung';
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);
  let daten = null;

  function lesen() { try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { return null; } }
  function schreiben(s) { try { s ? localStorage.setItem(LS, JSON.stringify(s)) : localStorage.removeItem(LS); } catch (e) {} }

  async function auth(pfad, body) {
    const r = await fetch(BASIS + pfad, { method: 'POST', headers: { apikey: ANON, 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error_description || j.msg || 'Anmeldung fehlgeschlagen.');
    return { access_token: j.access_token, refresh_token: j.refresh_token, ablauf: Math.floor(Date.now() / 1000) + (j.expires_in || 3600) };
  }

  async function token() {
    const s = lesen();
    if (!s) return null;
    if (s.ablauf - 60 > Date.now() / 1000) return s.access_token;
    try { const neu = await auth('/auth/v1/token?grant_type=refresh_token', { refresh_token: s.refresh_token }); schreiben(neu); return neu.access_token; }
    catch (e) { schreiben(null); return null; }
  }

  async function api(methode, body) {
    const t = await token();
    if (!t) throw Object.assign(new Error('Nicht angemeldet.'), { status: 401 });
    const r = await fetch(API, { method: methode, headers: { authorization: 'Bearer ' + t, apikey: ANON, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(j.fehler || 'Jarvis antwortet gerade nicht.'), { status: r.status });
    return j;
  }

  function el(tag, klasse, text) { const e = document.createElement(tag); if (klasse) e.className = klasse; if (text !== undefined) e.textContent = text; return e; }
  const zeitFmt = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  const kurz = (iso) => zeitFmt.format(new Date(iso));

  function boot(zeilen) {
    return new Promise((fertig) => {
      const ol = $('boot-zeilen');
      ol.textContent = '';
      if (ruhig) return fertig();
      zeilen.forEach((z, i) => {
        const li = el('li');
        li.append(z[0] + ' ', Object.assign(el('b'), { textContent: z[1] }));
        li.style.animationDelay = (i * 160) + 'ms';
        ol.append(li);
        setTimeout(() => li.classList.add('fertig'), i * 160 + 260);
      });
      setTimeout(fertig, zeilen.length * 160 + 420);
    });
  }

  function bootAus() { $('boot').classList.add('weg'); setTimeout(() => $('boot').hidden = true, 500); }

  function begruessung() {
    const h = new Date().getHours();
    const gruss = h < 11 ? 'Guten Morgen, Semih.' : h < 18 ? 'Hallo Semih.' : 'Guten Abend, Semih.';
    $('begruessung').textContent = gruss + ' ' + new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  }

  function status(s) {
    const ul = $('status');
    ul.textContent = '';
    [[s.telegram, s.telegram ? 'Telegram verbunden' : 'Telegram nicht verbunden'],
     [s.anrufe, s.anrufe ? 'Anrufe bereit' : 'Anrufe nicht eingerichtet'],
     [true, 'Briefing ' + s.morgen + ' Uhr · Check So ' + s.sonntag + ' Uhr']].forEach(([an, text]) => {
      const li = el('li', an ? 'an' : '', text); ul.append(li);
    });
  }

  function nachricht(n, verzoegerung) {
    const li = el('li', n.rolle + (n.kanal === 'anruf' ? ' anruf' : ''));
    const kanal = { telegram: 'Telegram', dashboard: 'Dashboard', anruf: 'Anruf' }[n.kanal] || n.kanal;
    li.append(el('div', 'meta', (n.rolle === 'user' ? 'Du' : 'Jarvis') + ' · ' + kanal + ' · ' + kurz(n.zeit)), el('div', 'text', n.text));
    if (verzoegerung) li.style.animationDelay = verzoegerung + 'ms';
    return li;
  }

  function verlauf(liste) {
    const ol = $('verlauf');
    ol.textContent = '';
    if (!liste.length) { const li = el('li', 'assistant'); li.append(el('div', 'text', 'Noch keine Nachrichten. Gib mir unten einen ersten Auftrag.')); ol.append(li); }
    liste.forEach((n, i) => ol.append(nachricht(n, Math.max(0, i - liste.length + 8) * 50)));
    ol.scrollTop = ol.scrollHeight;
  }

  const ZAHLEN = [['ansprachen', 'Ansprachen'], ['gespraeche', 'Gespräche'], ['angebote', 'Angebote'], ['neue_kunden', 'Neue Kunden'], ['umsatz_eur', 'Umsatz €'], ['stunden', 'Stunden']];

  function hochzaehlen(knoten, ziel) {
    if (ruhig || !ziel) { knoten.textContent = ziel.toLocaleString('de-DE'); return; }
    const start = performance.now(), dauer = 900;
    const schritt = (t) => {
      const p = Math.min(1, (t - start) / dauer), e = 1 - Math.pow(1 - p, 3);
      knoten.textContent = (Number.isInteger(ziel) ? Math.round(ziel * e) : (ziel * e).toFixed(1)).toLocaleString('de-DE');
      if (p < 1) requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
  }

  function linie(werte) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 86 26');
    svg.setAttribute('aria-hidden', 'true');
    const zahlen = werte.map((w) => Number(w) || 0);
    if (zahlen.length < 2) return svg;
    const max = Math.max(...zahlen, 1);
    const pkt = zahlen.map((w, i) => [(i / (zahlen.length - 1)) * 82 + 2, 24 - (w / max) * 21]);
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pkt.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '));
    const c = document.createElementNS(ns, 'circle');
    const letzter = pkt[pkt.length - 1];
    c.setAttribute('cx', letzter[0]); c.setAttribute('cy', letzter[1]); c.setAttribute('r', '2.2');
    svg.append(path, c);
    return svg;
  }

  function zahlen(wochen) {
    const ul = $('zahlen');
    ul.textContent = '';
    $('zahlen-leer').hidden = wochen.length > 0;
    if (!wochen.length) return;
    const jetzt = wochen[wochen.length - 1], vorher = wochen[wochen.length - 2];
    ZAHLEN.forEach(([feld, name], i) => {
      const li = el('li');
      li.style.animationDelay = (i * 70) + 'ms';
      const wert = el('span', 'wert');
      const box = el('div');
      box.append(wert);
      const w = Number(jetzt[feld]) || 0;
      if (vorher && vorher[feld] != null && jetzt[feld] != null) {
        const d = w - (Number(vorher[feld]) || 0);
        box.append(el('span', 'diff ' + (d > 0 ? 'plus' : d < 0 ? 'minus' : ''), d === 0 ? 'wie Vorwoche' : (d > 0 ? '+' : '') + d.toLocaleString('de-DE') + ' zur Vorwoche'));
      }
      li.append(el('span', 'name', name), box, linie(wochen.map((x) => x[feld])));
      ul.append(li);
      hochzaehlen(wert, w);
    });
  }

  function erinnerungen(liste) {
    const ul = $('erinnerungen');
    ul.textContent = '';
    if (!liste.length) { const li = el('li'); li.append(el('span', 'leer', 'Nichts geplant.')); ul.append(li); return; }
    liste.forEach((r) => { const li = el('li'); li.append(el('span', 'wann', kurz(r.faellig)), el('span', '', r.text), el('span')); ul.append(li); });
  }

  function gedaechtnis() {
    const ul = $('gedaechtnis');
    const filter = $('suche').value.trim().toLowerCase();
    const liste = daten.gedaechtnis.filter((g) => !filter || (g.inhalt + ' ' + g.kategorie).toLowerCase().includes(filter));
    $('gedaechtnis-zahl').textContent = daten.gedaechtnis.length + ' Einträge';
    ul.textContent = '';
    if (!liste.length) { const li = el('li'); li.append(el('span', 'leer', filter ? 'Nichts gefunden.' : 'Noch leer.')); ul.append(li); return; }
    liste.forEach((g) => {
      const li = el('li');
      const knopf = el('button', '', 'Vergessen');
      knopf.type = 'button';
      knopf.setAttribute('aria-label', 'Eintrag vergessen: ' + g.inhalt);
      knopf.addEventListener('click', async () => {
        knopf.disabled = true;
        try {
          await api('POST', { aktion: 'vergessen', id: g.id });
          li.classList.add('raus');
          daten.gedaechtnis = daten.gedaechtnis.filter((x) => x.id !== g.id);
          setTimeout(gedaechtnis, 300);
        } catch (e) { knopf.disabled = false; knopf.textContent = 'Fehler'; }
      });
      li.append(el('span', 'art', g.kategorie), el('span', '', g.inhalt), knopf);
      ul.append(li);
    });
  }

  function zeichnen() {
    status(daten.status);
    verlauf(daten.verlauf);
    zahlen(daten.wochen);
    erinnerungen(daten.erinnerungen);
    gedaechtnis();
  }

  async function laden(mitBoot) {
    const bootZeilen = [['Verbinde mit', 'Supabase · Frankfurt'], ['Lade', 'Gedächtnis'], ['Lade', 'Wochenzahlen'], ['Prüfe', 'Telegram und Telefon']];
    const animation = mitBoot ? boot(bootZeilen) : Promise.resolve();
    try {
      const [ergebnis] = await Promise.all([api('GET'), animation]);
      daten = ergebnis;
      $('anmelden').hidden = true;
      $('app').hidden = false;
      begruessung();
      zeichnen();
    } catch (e) {
      await animation;
      $('app').hidden = true;
      $('anmelden').hidden = false;
      if (e.status !== 401) $('anmelde-fehler').textContent = e.message;
      if (e.status === 401) schreiben(null);
    }
    bootAus();
  }

  $('anmelde-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const f = ev.target, knopf = f.querySelector('button');
    $('anmelde-fehler').textContent = '';
    knopf.disabled = true;
    try {
      schreiben(await auth('/auth/v1/token?grant_type=password', { email: f.email.value.trim(), password: f.passwort.value }));
      $('boot').hidden = false; $('boot').classList.remove('weg');
      await laden(true);
    } catch (e) { $('anmelde-fehler').textContent = e.message; }
    knopf.disabled = false;
  });

  $('abmelden').addEventListener('click', () => { schreiben(null); location.reload(); });
  $('suche').addEventListener('input', () => daten && gedaechtnis());

  const feld = $('auftrag');
  feld.addEventListener('input', () => { feld.style.height = 'auto'; feld.style.height = Math.min(feld.scrollHeight, 160) + 'px'; });
  feld.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('auftrag-form').requestSubmit(); } });

  $('auftrag-form').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const text = feld.value.trim();
    if (!text) return;
    const knopf = ev.target.querySelector('button');
    knopf.disabled = true;
    feld.value = ''; feld.style.height = 'auto';
    const ol = $('verlauf');
    ol.append(nachricht({ rolle: 'user', kanal: 'dashboard', text, zeit: new Date().toISOString() }));
    const tippt = el('li', 'assistant tippt');
    tippt.append(el('span'), el('span'), el('span'));
    ol.append(tippt);
    ol.scrollTop = ol.scrollHeight;
    try {
      const { antwort } = await api('POST', { aktion: 'auftrag', text });
      tippt.replaceWith(nachricht({ rolle: 'assistant', kanal: 'dashboard', text: antwort, zeit: new Date().toISOString() }));
      const neu = await api('GET');
      daten = neu;
      zahlen(daten.wochen); erinnerungen(daten.erinnerungen); gedaechtnis();
    } catch (e) {
      tippt.replaceWith(nachricht({ rolle: 'assistant', kanal: 'dashboard', text: e.message, zeit: new Date().toISOString() }));
    }
    ol.scrollTop = ol.scrollHeight;
    knopf.disabled = false;
    feld.focus();
  });

  lesen() ? laden(true) : ($('anmelden').hidden = false, bootAus());
})();

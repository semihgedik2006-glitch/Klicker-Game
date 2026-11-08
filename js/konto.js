(function () {
  'use strict';

  const CFG = window.KONTO_CONFIG || {};
  const BASIS = String(CFG.url || '').replace(/\/+$/, '');
  const ANON = String(CFG.anonKey || '');
  const AKTIV = /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(BASIS) && ANON.length > 20;
  const LS = 'verkaufsakademie_konto';
  const ITER = 310000;
  const ROH = new Set(['apiKey', 'keySession']);

  let K = lesen();
  let laeuft = false, nochmal = false, timer = null, bereit = false, fehler = '', ansicht = 'anmelden', wiederherstellung = null;

  function lesen() { try { const d = JSON.parse(localStorage.getItem(LS) || '{}'); return d && typeof d === 'object' ? d : {}; } catch (e) { return {}; } }
  function schreiben() { try { localStorage.setItem(LS, JSON.stringify(K)); } catch (e) {} }
  const VA = () => window.VA;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const toast = (m, k) => { if (VA()) VA().toast(m, k); };
  const neuZeichnen = () => { if (VA() && /^#\/einstellungen/.test(location.hash)) VA().navigate(); };

  (function hashAuswerten() {
    const h = location.hash || '';
    if (!/access_token=|error_description=/.test(h)) return;
    const p = new URLSearchParams(h.replace(/^#\/?/, ''));
    if (p.get('type') === 'recovery' && p.get('access_token')) wiederherstellung = { access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_at: Math.floor(Date.now() / 1000) + Number(p.get('expires_in') || 3600) };
    else if (p.get('type') === 'signup') setTimeout(() => toast('E-Mail bestätigt. Jetzt anmelden.', 'good'), 300);
    else if (p.get('error_description')) setTimeout(() => toast(p.get('error_description').replace(/\+/g, ' '), 'bad'), 300);
    history.replaceState(null, '', location.pathname + location.search + '#/einstellungen');
  })();

  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function ableiten(passwort, salz) {
    const basis = await crypto.subtle.importKey('raw', new TextEncoder().encode(passwort), 'PBKDF2', false, ['deriveBits']);
    return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unb64(salz), iterations: ITER }, basis, 256));
  }
  const aesKey = (dk) => crypto.subtle.importKey('raw', unb64(dk), 'AES-GCM', false, ['encrypt', 'decrypt']);
  async function verschluesseln(text) {
    if (!text || !K.dk) return null;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await aesKey(K.dk), new TextEncoder().encode(text));
    return b64(iv) + '.' + b64(ct);
  }
  async function entschluesseln(s) {
    if (!s || !K.dk) return null;
    const [iv, ct] = s.split('.');
    return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, await aesKey(K.dk), unb64(ct)));
  }

  function meldung(j, status) {
    const code = j && (j.error_code || j.code || j.error);
    const text = (j && (j.msg || j.message || j.error_description)) || '';
    const M = {
      invalid_credentials: 'E-Mail oder Passwort falsch.', invalid_grant: 'E-Mail oder Passwort falsch.',
      user_already_exists: 'Für diese E-Mail gibt es schon ein Konto. Melde dich an.', email_exists: 'Für diese E-Mail gibt es schon ein Konto. Melde dich an.',
      weak_password: 'Passwort zu schwach. Mindestens 8 Zeichen, besser mehr.', email_not_confirmed: 'E-Mail noch nicht bestätigt. Öffne den Link in deinem Postfach.',
      over_email_send_rate_limit: 'Zu viele E-Mails in kurzer Zeit. Versuch es in einer Stunde erneut.', over_request_rate_limit: 'Zu viele Versuche. Kurz warten.',
      signup_disabled: 'Registrierung ist ausgeschaltet.', email_address_invalid: 'Diese E-Mail-Adresse wird nicht angenommen.', validation_failed: 'Eingabe ungültig.',
      same_password: 'Das neue Passwort muss sich vom alten unterscheiden.'
    };
    if (M[code]) return M[code];
    if (/invalid login/i.test(text)) return M.invalid_credentials;
    if (/already registered/i.test(text)) return M.user_already_exists;
    return text ? `Fehler ${status}: ${text}` : `Fehler ${status}`;
  }

  async function anfrage(pfad, { methode = 'GET', body, token, kopf = {}, keepalive = false } = {}) {
    const h = { apikey: ANON, 'content-type': 'application/json', ...kopf };
    if (token) h.authorization = 'Bearer ' + token;
    let res;
    try { res = await fetch(BASIS + pfad, { method: methode, headers: h, body: body === undefined ? undefined : JSON.stringify(body), keepalive }); }
    catch (e) { const err = new Error('Keine Verbindung zum Konto-Server.'); err.offline = true; throw err; }
    const txt = await res.text(); let j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
    if (!res.ok) { const err = new Error(meldung(j, res.status)); err.status = res.status; err.code = j && (j.error_code || j.code); throw err; }
    return j;
  }

  function sitzungSetzen(j) {
    K.sitzung = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || Math.floor(Date.now() / 1000) + (j.expires_in || 3600) };
    if (j.user) K.nutzer = { id: j.user.id, email: j.user.email };
    schreiben();
  }
  async function token() {
    if (!K.sitzung) throw Object.assign(new Error('Nicht angemeldet.'), { status: 401 });
    if (K.sitzung.expires_at - 60 > Date.now() / 1000) return K.sitzung.access_token;
    try { sitzungSetzen(await anfrage('/auth/v1/token?grant_type=refresh_token', { methode: 'POST', body: { refresh_token: K.sitzung.refresh_token } })); }
    catch (e) { if (!e.offline) abgemeldet('Sitzung abgelaufen. Bitte neu anmelden.'); throw e; }
    return K.sitzung.access_token;
  }
  async function db(pfad, opt = {}) {
    try { return await anfrage(pfad, { ...opt, token: await token() }); }
    catch (e) { if (e.status === 401 && K.sitzung) { K.sitzung.expires_at = 0; return anfrage(pfad, { ...opt, token: await token() }); } throw e; }
  }
  function abgemeldet(hinweis) {
    K = {}; schreiben(); bereit = false; clearTimeout(timer);
    if (hinweis) toast(hinweis, 'bad');
    neuZeichnen();
  }

  function datenVon(S) { const d = {}; for (const k of Object.keys(S)) if (!ROH.has(k)) d[k] = S[k]; return d; }
  function lokalLeer(S) { return !Object.keys(S.activity || {}).length && !S.name && !Object.keys(S.lessonsDone || {}).length; }
  function zeile(r) { return Array.isArray(r) ? r[0] || null : r; }

  async function uebernehmen(r) {
    let key = null;
    if (r.schluessel) { try { key = await entschluesseln(r.schluessel); } catch (e) { toast('Der gespeicherte Schlüssel ließ sich nicht entschlüsseln. Trag ihn in den Einstellungen neu ein.', 'bad'); } }
    K.stand = r.aktualisiert; K.letzterKey = key || ''; K.dirty = false; schreiben();
    VA().uebernehmen(r.daten || {}, key);
  }

  async function holen() {
    const uid = K.nutzer.id;
    const r = zeile(await db('/rest/v1/fortschritt?select=*&user_id=eq.' + encodeURIComponent(uid)));
    const S = VA().S;
    if (!r) { K.stand = null; K.dirty = true; schreiben(); return; }
    if (r.aktualisiert === K.stand) return;
    if (!K.stand && lokalLeer(S)) return uebernehmen(r);
    if (!K.dirty) return uebernehmen(r);
    return konflikt(r);
  }

  function konflikt(r) {
    return new Promise((fertig) => {
      const d = r.daten || {}; const S = VA().S;
      const zahl = (x) => Object.keys((x && x.lessonsDone) || {}).length;
      VA().modal(`<h3>Zwei Stände gefunden</h3><p>Im Konto: ${zahl(d)} Lektionen, zuletzt ${esc(VA().fmtTime(Date.parse(r.aktualisiert)))}. Auf diesem Gerät: ${zahl(S)} Lektionen.</p>
        <div class="btn-row"><button class="btn primary" id="konto-laden">Kontostand laden</button><button class="btn ghost" id="konto-behalten">Diesen Stand behalten</button></div>`);
      document.getElementById('konto-laden').onclick = async () => { VA().closeModal(); await uebernehmen(r); toast('Kontostand geladen.', 'good'); fertig(); };
      document.getElementById('konto-behalten').onclick = () => { VA().closeModal(); K.stand = r.aktualisiert; K.dirty = true; K.salz = r.salz || K.salz; schreiben(); fertig(); };
    });
  }

  async function senden(keepalive = false) {
    const S = VA().S; const uid = K.nutzer.id;
    const body = { daten: datenVon(S) };
    if (!S.keySession && (S.apiKey || '') !== (K.letzterKey || '')) body.schluessel = await verschluesseln(S.apiKey);
    if (K.salzNeu) { body.salz = K.salz; if (!('schluessel' in body)) body.schluessel = await verschluesseln(S.apiKey); }
    const kopf = { prefer: 'return=representation' };
    let r;
    if (K.stand) {
      r = zeile(await db('/rest/v1/fortschritt?user_id=eq.' + encodeURIComponent(uid) + '&aktualisiert=eq.' + encodeURIComponent(K.stand), { methode: 'PATCH', body, kopf, keepalive }));
      if (!r) { K.dirty = true; schreiben(); return holen(); }
    } else {
      try { r = zeile(await db('/rest/v1/fortschritt', { methode: 'POST', body: { user_id: uid, salz: K.salz, schluessel: null, ...body }, kopf, keepalive })); }
      catch (e) { if (e.status === 409) return holen(); throw e; }
    }
    K.stand = r.aktualisiert; K.dirty = false; K.salzNeu = false;
    if ('schluessel' in body) K.letzterKey = S.apiKey || '';
    K.zuletzt = Date.now(); schreiben();
  }

  async function sync({ keepalive = false, still = true } = {}) {
    if (!AKTIV || !K.sitzung || !VA()) return;
    if (laeuft) { nochmal = true; return; }
    laeuft = true; fehler = '';
    try {
      if (!bereit) { await holen(); bereit = true; }
      else if (!K.dirty) await holen();
      if (K.dirty && K.sitzung) await senden(keepalive);
      K.zuletzt = Date.now(); schreiben();
      if (!still) toast('Synchronisiert.', 'good');
    } catch (e) {
      fehler = e.message;
      if (!still) toast(e.message, 'bad');
    } finally {
      laeuft = false;
      if (nochmal) { nochmal = false; sync(); }
      const st = document.getElementById('konto-status'); if (st) st.innerHTML = statusText();
    }
  }

  async function anmelden(email, passwort, neu) {
    if (passwort.length < 8) throw new Error('Passwort: mindestens 8 Zeichen.');
    if (neu) {
      const j = await anfrage('/auth/v1/signup', { methode: 'POST', body: { email, password: passwort } });
      if (!j || !j.access_token) { ansicht = 'bestaetigen'; K.wartet = email; schreiben(); return 'bestaetigen'; }
      sitzungSetzen(j);
    } else {
      sitzungSetzen(await anfrage('/auth/v1/token?grant_type=password', { methode: 'POST', body: { email, password: passwort } }));
    }
    const r = zeile(await db('/rest/v1/fortschritt?select=salz&user_id=eq.' + encodeURIComponent(K.nutzer.id)));
    K.salz = (r && r.salz) || b64(crypto.getRandomValues(new Uint8Array(16)));
    K.salzNeu = !(r && r.salz) && !!r;
    K.dk = await ableiten(passwort, K.salz);
    K.stand = null; K.letzterKey = null; K.dirty = false; delete K.wartet; schreiben();
    bereit = false;
    await sync();
    return 'ok';
  }

  async function passwortNeu(passwort) {
    if (passwort.length < 8) throw new Error('Passwort: mindestens 8 Zeichen.');
    K.sitzung = wiederherstellung; schreiben();
    const u = await db('/auth/v1/user', { methode: 'PUT', body: { password: passwort } });
    K.nutzer = { id: u.id, email: u.email };
    K.salz = b64(crypto.getRandomValues(new Uint8Array(16))); K.salzNeu = true;
    K.dk = await ableiten(passwort, K.salz);
    K.stand = null; K.letzterKey = null; schreiben();
    wiederherstellung = null; bereit = false;
    await sync();
    const S = VA().S;
    if (!S.apiKey) toast('Passwort geändert. Trag deinen API-Schlüssel einmal neu ein.', 'good'); else toast('Passwort geändert.', 'good');
  }

  function statusText() {
    if (fehler) return `<span class="konto-punkt aus"></span>${esc(fehler)}`;
    if (laeuft) return '<span class="konto-punkt"></span>Synchronisiert…';
    if (K.dirty) return '<span class="konto-punkt"></span>Änderungen werden gleich übertragen';
    return `<span class="konto-punkt an"></span>Synchron${K.zuletzt ? ' · ' + esc(VA().fmtTime(K.zuletzt)) : ''}`;
  }

  function karte() {
    if (!AKTIV) return `<div class="card konto"><div class="eyebrow">Konto</div><p class="muted">Noch nicht eingerichtet. Anleitung: <code>supabase/ANLEITUNG.md</code>.</p></div>`;
    if (wiederherstellung) return `<form class="card konto" id="konto-pw"><div class="eyebrow">Neues Passwort</div>
      <label>Neues Passwort <input name="pw" type="password" minlength="8" autocomplete="new-password" required></label>
      <div class="btn-row"><button class="btn primary" type="submit">Passwort speichern</button></div></form>`;
    if (K.sitzung && K.nutzer) return `<div class="card konto"><div class="eyebrow">Konto</div>
      <div class="konto-zeile"><div><div class="konto-mail">${esc(K.nutzer.email)}</div><div class="muted konto-status" id="konto-status">${statusText()}</div></div>
      <div class="btn-row"><button class="btn small" data-act="konto-sync">Jetzt synchronisieren</button><button class="btn small ghost" data-act="konto-ab">Abmelden</button></div></div>
      <button class="btn small ghost konto-link konto-loeschen" type="button" data-act="konto-loeschen">Konto löschen</button></div>`;
    if (ansicht === 'bestaetigen' || K.wartet) return `<div class="card konto"><div class="eyebrow">Konto</div><p>Bestätigungslink an <strong>${esc(K.wartet || '')}</strong> geschickt. Danach hier anmelden.</p>
      <div class="btn-row"><button class="btn small ghost" data-act="konto-zurueck">Zur Anmeldung</button></div></div>`;
    const vergessen = ansicht === 'vergessen';
    return `<form class="card konto" id="konto-form" data-modus="${vergessen ? 'vergessen' : 'anmelden'}"><div class="eyebrow">Konto</div>
      <p class="muted">${vergessen ? 'Du bekommst einen Link zum Zurücksetzen.' : 'Mit Konto lernst du auf jedem Gerät weiter, inklusive API-Schlüssel.'}</p>
      <label>E-Mail <input name="email" type="email" autocomplete="email" required></label>
      ${vergessen ? '' : '<label>Passwort <input name="pw" type="password" minlength="8" autocomplete="current-password" required></label>'}
      <div class="btn-row">${vergessen
        ? '<button class="btn primary" type="submit">Link senden</button><button class="btn ghost" type="button" data-act="konto-zurueck">Abbrechen</button>'
        : '<button class="btn primary" type="submit" name="aktion" value="anmelden">Anmelden</button><button class="btn ghost" type="submit" name="aktion" value="neu">Konto erstellen</button><button class="btn small ghost konto-link" type="button" data-act="konto-vergessen">Passwort vergessen?</button>'}</div></form>`;
  }

  function schluesselHinweis() {
    return angemeldet() ? 'Wird mit deinem Passwort verschlüsselt im Konto gespeichert und geht nur an api.anthropic.com.' : 'Bleibt in diesem Browser und geht nur an api.anthropic.com.';
  }
  function angemeldet() { return AKTIV && !!(K.sitzung && K.nutzer); }

  function geaendert() {
    if (!angemeldet()) return;
    K.dirty = true; schreiben();
    clearTimeout(timer); timer = setTimeout(() => sync(), 1500);
  }

  async function laden(btn, fn) {
    const alt = btn ? btn.textContent : ''; if (btn) { btn.disabled = true; btn.textContent = 'Moment…'; }
    try { await fn(); } catch (e) { toast(e.message, 'bad'); if (btn) { btn.disabled = false; btn.textContent = alt; } return; }
    neuZeichnen();
  }

  document.addEventListener('submit', (e) => {
    const f = e.target;
    if (f.id === 'konto-form') {
      e.preventDefault();
      const fd = new FormData(f); const email = String(fd.get('email') || '').trim();
      if (f.dataset.modus === 'vergessen') {
        return laden(f.querySelector('[type=submit]'), async () => {
          await anfrage('/auth/v1/recover?redirect_to=' + encodeURIComponent(location.origin + location.pathname), { methode: 'POST', body: { email } });
          ansicht = 'anmelden'; toast('Falls ein Konto existiert, ist der Link unterwegs.', 'good');
        });
      }
      const neu = (e.submitter && e.submitter.value) === 'neu';
      return laden(e.submitter, async () => { const r = await anmelden(email, String(fd.get('pw') || ''), neu); if (r === 'ok') toast(neu ? 'Konto erstellt. Dein Fortschritt wird jetzt synchronisiert.' : 'Angemeldet.', 'good'); });
    }
    if (f.id === 'konto-pw') { e.preventDefault(); return laden(f.querySelector('[type=submit]'), () => passwortNeu(String(new FormData(f).get('pw') || ''))); }
  });
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act^="konto-"]'); if (!el) return;
    const a = el.dataset.act;
    if (a === 'konto-sync') { sync({ still: false }); const st = document.getElementById('konto-status'); if (st) st.innerHTML = statusText(); }
    else if (a === 'konto-ab') { const t = K.sitzung && K.sitzung.access_token; if (K.dirty) sync({ keepalive: true }); if (t) anfrage('/auth/v1/logout', { methode: 'POST', token: t }).catch(() => {}); abgemeldet(); toast('Abgemeldet. Dein Stand bleibt auf diesem Gerät.'); }
    else if (a === 'konto-vergessen') { ansicht = 'vergessen'; neuZeichnen(); }
    else if (a === 'konto-zurueck') { ansicht = 'anmelden'; delete K.wartet; schreiben(); neuZeichnen(); }
    else if (a === 'konto-loeschen') {
      VA().modal(`<h3>Konto löschen?</h3><p>Der Kontostand und der gespeicherte Schlüssel werden auf dem Server gelöscht. Dieses Gerät behält seinen Stand.</p><div class="btn-row"><button class="btn danger" id="konto-weg">Konto löschen</button><button class="btn ghost" data-act="close-modal">Abbrechen</button></div>`);
      document.getElementById('konto-weg').onclick = () => laden(null, async () => { await db('/rest/v1/rpc/konto_loeschen', { methode: 'POST', body: {} }); VA().closeModal(); abgemeldet(); toast('Konto gelöscht.'); });
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!angemeldet()) return;
    if (document.visibilityState === 'hidden') { if (K.dirty) { clearTimeout(timer); sync({ keepalive: true }); } }
    else sync();
  });
  window.addEventListener('online', () => sync());
  window.addEventListener('load', () => { if (angemeldet()) sync(); });

  window.Konto = { aktiv: AKTIV, angemeldet, karte, schluesselHinweis, geaendert, sync };
})();

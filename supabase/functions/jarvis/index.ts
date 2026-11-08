import Anthropic from "npm:@anthropic-ai/sdk@1.6.0";
import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const env = (name: string) => Deno.env.get(name) ?? "";

const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), {
  auth: { persistSession: false },
});
const claude = new Anthropic({ apiKey: env("ANTHROPIC_API_KEY") });
const MODELL = env("JARVIS_MODELL") || "claude-opus-5-5";
const FUNKTIONS_URL = `${env("SUPABASE_URL")}/functions/v1/jarvis`;

const GRUNDREGELN = `Du bist Jarvis, der persönliche Assistent von Semih. Du sprichst Deutsch, duzt ihn und klingst wie ein ruhiger, aufmerksamer Assistent: knapp, konkret, freundlich, ohne Floskeln und ohne Emojis.

Du bist für sein ganzes Leben da, nicht nur fürs Business:
- Alltag organisieren: Arbeitsschichten, Uni, Seminare, Prüfungen, Training, Termine und Privates im Blick behalten, Konflikte erkennen, Zeitblöcke vorschlagen, rechtzeitig erinnern.
- Mitdenken: Fristen, Lernphasen, Einkäufe, Rückrufe, Geburtstage. Frag nach, wenn eine Info fehlt, statt zu raten.
- Fragen beantworten, recherchieren, Texte und Nachrichten entwerfen, Entscheidungen mit ihm durchdenken.
- Business ist ein Teil davon: Er baut nebenher sein Personal Training auf. Sonntags fragst du kurz die 5 Zahlen ab (Ansprachen, Gespräche, Angebote, neue Kunden plus Umsatz, Stunden). Sonst sprichst du Business nur an, wenn er es tut oder es in seinen Tag passt. Keine ungefragten Verkaufs- oder Marketingtipps.
- Ehrlich bleiben: keine Hype-Ratschläge. Wenn du etwas nicht weißt oder nicht kannst, sag es. Einen Kalenderzugriff hast du noch nicht, Termine kennst du nur aus dem Gedächtnis.

Gedächtnis:
- Speichere mit "merken" alles, was später nützt: feste Zeiten (Arbeit, Uni, Training), Termine, Menschen, Vorlieben, Ziele, Zusagen. Kurz und als eigenständiger Satz, Termine immer mit Datum und Uhrzeit.
- Markiere mit "vergessen" Einträge, die erledigt oder veraltet sind.
- Wochenzahlen mit "wochenzahlen_speichern" ablegen, sobald er sie nennt.
- Erinnerungen zu einer Uhrzeit mit "erinnerung_planen" anlegen (Zeitzone Europe/Berlin). Bei Terminen von dir aus eine sinnvolle Vorab-Erinnerung anbieten.
- Erwähne das Speichern nicht jedes Mal, nur wenn er fragt.

Antworten erscheinen in Telegram: reiner Text ohne Markdown, meist unter 120 Wörtern. Längere Texte nur, wenn er einen Entwurf oder Plan verlangt.`;

const WERKZEUGE: Anthropic.Tool[] = [
  {
    name: "merken",
    description: "Speichert eine dauerhafte Information über Semih: Alltag, feste Zeiten, Termine, Menschen, Vorlieben, Ziele oder Business.",
    input_schema: {
      type: "object",
      properties: {
        kategorie: {
          type: "string",
          enum: ["person", "alltag", "arbeit", "uni", "termin", "aufgabe", "mensch", "vorliebe", "ziel", "plan", "kunde", "ergebnis", "marketing", "finanzen"],
        },
        inhalt: { type: "string", description: "Ein eigenständiger Satz, höchstens 300 Zeichen." },
      },
      required: ["kategorie", "inhalt"],
      additionalProperties: false,
    },
  },
  {
    name: "vergessen",
    description: "Markiert einen Gedächtnis-Eintrag als erledigt oder veraltet.",
    input_schema: {
      type: "object",
      properties: { id: { type: "integer" } },
      required: ["id"],
      additionalProperties: false,
    },
  },
  {
    name: "wochenzahlen_speichern",
    description: "Speichert die 5 Wochenzahlen. Fehlende Werte weglassen.",
    input_schema: {
      type: "object",
      properties: {
        woche: { type: "string", description: "Montag der Woche als YYYY-MM-DD." },
        ansprachen: { type: "integer" },
        gespraeche: { type: "integer" },
        angebote: { type: "integer" },
        neue_kunden: { type: "integer" },
        umsatz_eur: { type: "number" },
        stunden: { type: "number" },
        notiz: { type: "string" },
      },
      required: ["woche"],
      additionalProperties: false,
    },
  },
  {
    name: "erinnerung_planen",
    description: "Plant eine Telegram-Erinnerung zu einem Zeitpunkt.",
    input_schema: {
      type: "object",
      properties: {
        zeitpunkt: { type: "string", description: "Lokale Zeit Europe/Berlin als YYYY-MM-DDTHH:MM." },
        text: { type: "string" },
      },
      required: ["zeitpunkt", "text"],
      additionalProperties: false,
    },
  },
  {
    name: "einstellung_setzen",
    description: "Ändert Jarvis' Rhythmus. morgen_stunde und sonntag_stunde sind Stunden 0-23, morgen_aktiv ist ja oder nein.",
    input_schema: {
      type: "object",
      properties: {
        schluessel: { type: "string", enum: ["morgen_stunde", "sonntag_stunde", "morgen_aktiv"] },
        wert: { type: "string" },
      },
      required: ["schluessel", "wert"],
      additionalProperties: false,
    },
  },
];

function berlinJetzt() {
  const teile = Object.fromEntries(
    new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "long",
      hourCycle: "h23",
    }).formatToParts(new Date()).map((t) => [t.type, t.value]),
  );
  return {
    datum: `${teile.year}-${teile.month}-${teile.day}`,
    stunde: Number(teile.hour),
    wochentag: teile.weekday as string,
    text: `${teile.weekday}, ${teile.day}.${teile.month}.${teile.year}, ${teile.hour}:${teile.minute} Uhr`,
  };
}

function berlinNachUtc(lokal: string): string {
  const [datum, zeit = "09:00"] = lokal.split("T");
  const alsUtc = new Date(`${datum}T${zeit.slice(0, 5)}:00Z`);
  const inBerlin = new Date(alsUtc.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const inUtc = new Date(alsUtc.toLocaleString("en-US", { timeZone: "UTC" }));
  return new Date(alsUtc.getTime() - (inBerlin.getTime() - inUtc.getTime())).toISOString();
}

async function einstellung(schluessel: string, standard = ""): Promise<string> {
  const { data } = await db.from("jarvis_einstellungen").select("wert").eq("schluessel", schluessel).maybeSingle();
  return data?.wert ?? standard;
}

async function einstellungSpeichern(schluessel: string, wert: string) {
  await db.from("jarvis_einstellungen").upsert({ schluessel, wert });
}

async function kontext(): Promise<string> {
  const [gedaechtnis, zahlen, erinnerungen] = await Promise.all([
    db.from("jarvis_gedaechtnis").select("id, kategorie, inhalt").eq("aktiv", true).order("id").limit(300),
    db.from("jarvis_wochenzahlen").select("*").order("woche", { ascending: false }).limit(8),
    db.from("jarvis_erinnerungen").select("faellig, text").eq("gesendet", false).order("faellig").limit(20),
  ]);
  const zeilen = [`Jetzt: ${berlinJetzt().text} (Europe/Berlin).`, "", "Gedächtnis:"];
  for (const e of gedaechtnis.data ?? []) zeilen.push(`[${e.id}] (${e.kategorie}) ${e.inhalt}`);
  zeilen.push("", "Wochenzahlen (neueste zuerst):");
  if (!zahlen.data?.length) zeilen.push("noch keine");
  for (const w of zahlen.data ?? []) {
    zeilen.push(
      `${w.woche}: Ansprachen ${w.ansprachen ?? "-"}, Gespräche ${w.gespraeche ?? "-"}, Angebote ${w.angebote ?? "-"}, neue Kunden ${w.neue_kunden ?? "-"}, Umsatz ${w.umsatz_eur ?? "-"} €, Stunden ${w.stunden ?? "-"}${w.notiz ? `, Notiz: ${w.notiz}` : ""}`,
    );
  }
  zeilen.push("", "Offene Erinnerungen:");
  if (!erinnerungen.data?.length) zeilen.push("keine");
  for (const r of erinnerungen.data ?? []) {
    zeilen.push(`${new Date(r.faellig).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}: ${r.text}`);
  }
  return zeilen.join("\n");
}

async function werkzeugAusfuehren(name: string, eingabe: Record<string, unknown>): Promise<string> {
  switch (name) {
    case "merken": {
      const { data, error } = await db.from("jarvis_gedaechtnis")
        .insert({ kategorie: eingabe.kategorie, inhalt: String(eingabe.inhalt).slice(0, 1000) })
        .select("id").single();
      return error ? `Fehler: ${error.message}` : `gespeichert als ${data.id}`;
    }
    case "vergessen": {
      const { error } = await db.from("jarvis_gedaechtnis").update({ aktiv: false }).eq("id", eingabe.id);
      return error ? `Fehler: ${error.message}` : "erledigt";
    }
    case "wochenzahlen_speichern": {
      const { error } = await db.from("jarvis_wochenzahlen").upsert({ ...eingabe, erfasst: new Date().toISOString() });
      return error ? `Fehler: ${error.message}` : "Zahlen gespeichert";
    }
    case "erinnerung_planen": {
      const { error } = await db.from("jarvis_erinnerungen").insert({
        faellig: berlinNachUtc(String(eingabe.zeitpunkt)),
        text: String(eingabe.text).slice(0, 900),
      });
      return error ? `Fehler: ${error.message}` : "Erinnerung geplant";
    }
    case "einstellung_setzen":
      await einstellungSpeichern(String(eingabe.schluessel), String(eingabe.wert));
      return "Einstellung gespeichert";
    default:
      return `Unbekanntes Werkzeug ${name}`;
  }
}

async function denken(nachrichten: Anthropic.MessageParam[]): Promise<string> {
  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: GRUNDREGELN },
    { type: "text", text: await kontext() },
  ];
  const mitFallback = !MODELL.includes("haiku");
  const verlauf = [...nachrichten];

  for (let runde = 0; runde < 6; runde++) {
    const parameter = {
      model: MODELL,
      max_tokens: 4000,
      system,
      tools: WERKZEUGE,
      messages: verlauf,
      output_config: { effort: "low" },
    };
    // deno-lint-ignore no-explicit-any
    const antwort: any = mitFallback
      ? await claude.beta.messages.create({ ...parameter, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" } as never)
      : await claude.messages.create(parameter as never);

    if (antwort.stop_reason === "refusal") return "Dazu kann ich dir gerade nichts sagen. Formulier es bitte anders.";

    // deno-lint-ignore no-explicit-any
    const aufrufe = antwort.content.filter((b: any) => b.type === "tool_use");
    if (antwort.stop_reason !== "tool_use" || aufrufe.length === 0) {
      // deno-lint-ignore no-explicit-any
      const text = antwort.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n").trim();
      return text || "Erledigt.";
    }

    verlauf.push({ role: "assistant", content: antwort.content });
    const ergebnisse: Anthropic.ToolResultBlockParam[] = [];
    for (const aufruf of aufrufe) {
      ergebnisse.push({
        type: "tool_result",
        tool_use_id: aufruf.id,
        content: await werkzeugAusfuehren(aufruf.name, aufruf.input ?? {}),
      });
    }
    verlauf.push({ role: "user", content: ergebnisse });
  }
  return "Ich bin mit dem Speichern nicht fertig geworden. Schreib mir bitte noch einmal.";
}

async function letzteNachrichten(anzahl = 20): Promise<Anthropic.MessageParam[]> {
  const { data } = await db.from("jarvis_verlauf").select("rolle, text").order("zeit", { ascending: false }).limit(anzahl);
  const liste = (data ?? []).reverse().map((z) => ({ role: z.rolle, content: z.text }) as Anthropic.MessageParam);
  while (liste.length && liste[0].role !== "user") liste.shift();
  const zusammengefasst: Anthropic.MessageParam[] = [];
  for (const n of liste) {
    const vorher = zusammengefasst[zusammengefasst.length - 1];
    if (vorher && vorher.role === n.role) vorher.content = `${vorher.content}\n\n${n.content}`;
    else zusammengefasst.push({ ...n });
  }
  return zusammengefasst;
}

async function speichern(rolle: "user" | "assistant", text: string, kanal = "telegram") {
  await db.from("jarvis_verlauf").insert({ rolle, text: text.slice(0, 8000), kanal });
}

async function telegram(methode: string, daten: Record<string, unknown>) {
  const antwort = await fetch(`https://api.telegram.org/bot${env("TELEGRAM_BOT_TOKEN")}/${methode}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(daten),
  });
  return antwort.json();
}

async function senden(text: string) {
  const chat = await einstellung("telegram_chat");
  if (!chat) return;
  for (let i = 0; i < text.length; i += 4000) {
    await telegram("sendMessage", { chat_id: chat, text: text.slice(i, i + 4000) });
  }
}

async function auftrag(anweisung: string, kanal = "telegram") {
  const nachrichten = await letzteNachrichten(10);
  nachrichten.push({ role: "user", content: `[Automatischer Auftrag, nicht von Semih geschrieben] ${anweisung}` });
  if (nachrichten.length > 1 && nachrichten[nachrichten.length - 2].role === "user") {
    const zuletzt = nachrichten.pop()!;
    nachrichten[nachrichten.length - 1].content = `${nachrichten[nachrichten.length - 1].content}\n\n${zuletzt.content}`;
  }
  const text = await denken(nachrichten);
  await speichern("assistant", text, kanal);
  await senden(text);
  return text;
}

function anrufMoeglich() {
  return Boolean(env("VAPI_API_KEY") && env("VAPI_ASSISTANT_ID") && env("VAPI_PHONE_NUMBER_ID") && env("JARVIS_TELEFON"));
}

async function anrufen(anlass: string) {
  const antwort = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: { authorization: `Bearer ${env("VAPI_API_KEY")}`, "content-type": "application/json" },
    body: JSON.stringify({
      assistantId: env("VAPI_ASSISTANT_ID"),
      phoneNumberId: env("VAPI_PHONE_NUMBER_ID"),
      customer: { number: env("JARVIS_TELEFON") },
      assistantOverrides: {
        variableValues: { anlass, kontext: await kontext() },
        server: { url: `${FUNKTIONS_URL}/vapi`, headers: { "x-jarvis-geheim": await einstellung("geheim") } },
        serverMessages: ["end-of-call-report"],
      },
    }),
  });
  if (!antwort.ok) throw new Error(`Vapi ${antwort.status}: ${await antwort.text()}`);
  return antwort.json();
}

async function chat(text: string, kanal = "telegram") {
  await speichern("user", text, kanal);
  const antwort = await denken(await letzteNachrichten());
  await speichern("assistant", antwort, kanal);
  if (kanal === "telegram") await senden(antwort);
  return antwort;
}

async function telegramUpdate(update: Record<string, any>) {
  const nachricht = update.message;
  if (!nachricht?.chat?.id) return;
  const chatId = String(nachricht.chat.id);
  const text: string = nachricht.text ?? nachricht.caption ?? "";
  const besitzer = await einstellung("telegram_chat");

  if (!besitzer) {
    const code = await einstellung("start_code");
    if (code && text.trim() === `/start ${code}`) {
      await einstellungSpeichern("telegram_chat", chatId);
      await telegram("sendMessage", { chat_id: chatId, text: "Verbunden. Ich bin Jarvis. Erzähl mir, was diese Woche ansteht." });
    }
    return;
  }
  if (chatId !== besitzer) return;

  if (nachricht.voice) {
    await senden("Sprachnachrichten kann ich noch nicht hören. Nutz am Handy die Diktierfunktion der Tastatur, dann kommt es als Text an.");
    return;
  }
  if (!text) return;

  if (text.trim() === "/anruf") {
    if (!anrufMoeglich()) return senden("Anrufe sind noch nicht eingerichtet.");
    await anrufen("Semih hat um einen Anruf gebeten.");
    return senden("Ich rufe dich gleich an.");
  }
  if (text.trim().startsWith("/dashboard")) {
    const email = text.trim().split(/\s+/)[1]?.toLowerCase() ?? "";
    if (!email.includes("@")) return senden("Schreib /dashboard gefolgt von der E-Mail deines App-Kontos.");
    await einstellungSpeichern("dashboard_email", email);
    return senden(`Dashboard freigegeben für ${email}.`);
  }
  if (text.trim() === "/gedaechtnis") {
    const { data } = await db.from("jarvis_gedaechtnis").select("id, kategorie, inhalt").eq("aktiv", true).order("id");
    return senden((data ?? []).map((e) => `${e.id}. (${e.kategorie}) ${e.inhalt}`).join("\n") || "Noch leer.");
  }
  await telegram("sendChatAction", { chat_id: chatId, action: "typing" });
  await chat(text);
}

async function takt() {
  if (!(await einstellung("telegram_chat"))) return;
  const jetzt = berlinJetzt();

  const { data: faellige } = await db.from("jarvis_erinnerungen").select("id, text")
    .eq("gesendet", false).lte("faellig", new Date().toISOString()).order("faellig");
  for (const r of faellige ?? []) {
    await senden(`Erinnerung: ${r.text}`);
    await speichern("assistant", `Erinnerung: ${r.text}`);
    await db.from("jarvis_erinnerungen").update({ gesendet: true }).eq("id", r.id);
  }

  const sonntagStunde = Number(await einstellung("sonntag_stunde", "18"));
  if (jetzt.wochentag === "Sonntag" && jetzt.stunde >= sonntagStunde && jetzt.stunde < sonntagStunde + 3 &&
      (await einstellung("sonntag_erledigt")) !== jetzt.datum) {
    await einstellungSpeichern("sonntag_erledigt", jetzt.datum);
    if (anrufMoeglich()) {
      await anrufen("Wochen-Check am Sonntag: 5 Zahlen abfragen, kurz auswerten, nächste Woche planen.");
    } else {
      await auftrag("Sonntagabend: Frag Semih kurz nach seinen festen Terminen nächste Woche (Arbeit, Uni, Seminare) und nach den 5 Zahlen dieser Woche, als Liste zum Ausfüllen.");
    }
    return;
  }

  const morgenStunde = Number(await einstellung("morgen_stunde", "7"));
  if ((await einstellung("morgen_aktiv", "ja")) !== "nein" && jetzt.stunde >= morgenStunde && jetzt.stunde < morgenStunde + 3 &&
      (await einstellung("morgen_erledigt")) !== jetzt.datum) {
    await einstellungSpeichern("morgen_erledigt", jetzt.datum);
    await auftrag(
      jetzt.wochentag === "Montag"
        ? "Montagmorgen: Gib Semih einen Überblick über die Woche: feste Termine (Arbeit, Uni, Seminare), Fristen und offene Aufgaben aus dem Gedächtnis, dazu höchstens drei Prioritäten. Wenn du seine Zeiten diese Woche nicht kennst, frag danach. Frag am Ende, ob er etwas ändern will."
        : "Morgen-Briefing: Was heute ansteht (Termine, Arbeit, Uni, Erinnerungen, Fristen) und höchstens zwei Dinge, die heute wichtig sind. Wenn heute nichts ansteht, ein einziger freundlicher Satz.",
    );
  }
}

async function anrufAuswerten(nachricht: Record<string, any>) {
  const transkript: string = nachricht.artifact?.transcript ?? nachricht.transcript ?? "";
  if (!transkript.trim()) return;
  await speichern("user", `[Telefonat mit Jarvis]\n${transkript.slice(0, 7000)}`, "anruf");
  const text = await denken([{
    role: "user",
    content: `[Automatischer Auftrag] Transkript des gerade beendeten Telefonats:\n\n${transkript.slice(0, 15000)}\n\nSpeichere alles Wichtige (Zahlen, Zusagen, Termine, neue Fakten). Schreib Semih dann eine kurze Zusammenfassung mit den vereinbarten nächsten Schritten.`,
  }]);
  await speichern("assistant", text, "anruf");
  await senden(text);
}

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type, apikey",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

function json(daten: unknown, status = 200) {
  return new Response(JSON.stringify(daten), { status, headers: { ...CORS, "content-type": "application/json" } });
}

async function dashboard(anfrage: Request) {
  const jwt = (anfrage.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: nutzer } = await db.auth.getUser(jwt);
  const erlaubt = (await einstellung("dashboard_email")).toLowerCase();
  const email = nutzer?.user?.email?.toLowerCase() ?? "";
  if (!email) return json({ fehler: "Nicht angemeldet." }, 401);
  if (!erlaubt || email !== erlaubt) {
    return json({ fehler: "Dieses Konto ist noch nicht freigegeben. Schreib Jarvis in Telegram: /dashboard " + email }, 403);
  }

  if (anfrage.method === "POST") {
    const eingabe = await anfrage.json();
    if (eingabe.aktion === "auftrag" && typeof eingabe.text === "string" && eingabe.text.trim()) {
      return json({ antwort: await chat(eingabe.text.trim().slice(0, 4000), "dashboard") });
    }
    if (eingabe.aktion === "vergessen" && Number.isInteger(eingabe.id)) {
      await db.from("jarvis_gedaechtnis").update({ aktiv: false }).eq("id", eingabe.id);
      return json({ ok: true });
    }
    return json({ fehler: "Unbekannte Aktion." }, 400);
  }

  const [gedaechtnis, verlauf, wochen, erinnerungen] = await Promise.all([
    db.from("jarvis_gedaechtnis").select("id, kategorie, inhalt, erstellt").eq("aktiv", true).order("id", { ascending: false }).limit(300),
    db.from("jarvis_verlauf").select("id, rolle, kanal, text, zeit").order("zeit", { ascending: false }).limit(60),
    db.from("jarvis_wochenzahlen").select("*").order("woche", { ascending: false }).limit(12),
    db.from("jarvis_erinnerungen").select("id, faellig, text").eq("gesendet", false).order("faellig").limit(20),
  ]);
  return json({
    status: {
      telegram: Boolean(await einstellung("telegram_chat")),
      anrufe: anrufMoeglich(),
      modell: MODELL,
      morgen: await einstellung("morgen_stunde", "7"),
      sonntag: await einstellung("sonntag_stunde", "18"),
    },
    gedaechtnis: gedaechtnis.data ?? [],
    verlauf: (verlauf.data ?? []).reverse(),
    wochen: (wochen.data ?? []).reverse(),
    erinnerungen: erinnerungen.data ?? [],
  });
}

function gleich(a: string | null, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let unterschied = 0;
  for (let i = 0; i < a.length; i++) unterschied |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return unterschied === 0;
}

Deno.serve(async (anfrage) => {
  const url = new URL(anfrage.url);
  const route = url.pathname.split("/").filter(Boolean).pop();

  try {
    if (route === "dashboard") {
      if (anfrage.method === "OPTIONS") return new Response(null, { headers: CORS });
      return await dashboard(anfrage);
    }
    if (route === "telegram" && anfrage.method === "POST") {
      if (!gleich(anfrage.headers.get("x-telegram-bot-api-secret-token"), await einstellung("telegram_geheim"))) {
        return new Response("nein", { status: 401 });
      }
      const update = await anfrage.json();
      const arbeit = telegramUpdate(update).catch(async (fehler) => {
        console.error(fehler);
        await senden(`Da ist etwas schiefgelaufen: ${String(fehler?.message ?? fehler).slice(0, 300)}`);
      });
      // @ts-ignore EdgeRuntime ist in Supabase vorhanden
      if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(arbeit);
      else await arbeit;
      return new Response("ok");
    }

    const geheim = anfrage.headers.get("x-jarvis-geheim") ?? url.searchParams.get("geheim");
    if (!gleich(geheim, await einstellung("geheim"))) return new Response("nein", { status: 401 });

    if (route === "takt") {
      await takt();
      return new Response("ok");
    }
    if (route === "vapi") {
      const { message } = await anfrage.json();
      if (message?.type === "end-of-call-report") {
        // @ts-ignore EdgeRuntime ist in Supabase vorhanden
        EdgeRuntime.waitUntil(anrufAuswerten(message).catch(console.error));
      }
      return new Response("ok");
    }
    if (route === "anruf") {
      if (!anrufMoeglich()) return new Response("Anrufe nicht eingerichtet", { status: 400 });
      return Response.json(await anrufen("Test-Anruf"));
    }
    if (route === "einrichten") {
      const ergebnis = await telegram("setWebhook", {
        url: `${FUNKTIONS_URL}/telegram`,
        secret_token: await einstellung("telegram_geheim"),
        allowed_updates: ["message"],
      });
      return Response.json(ergebnis);
    }
    return new Response("unbekannt", { status: 404 });
  } catch (fehler) {
    console.error(fehler);
    return json({ fehler: String((fehler as Error)?.message ?? fehler).slice(0, 300) }, 500);
  }
});

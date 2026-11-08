# Jarvis einrichten

Persönlicher Assistent in Telegram, mit Gedächtnis, Morgen-Briefing, Wochenplan am Montag und Wochen-Check am Sonntag. Auf Wunsch ruft er sonntags an.

## Teil 1: Telegram (kostenlos bis auf Claude-Nutzung, etwa 15 Minuten)

1. In Telegram **@BotFather** öffnen, `/newbot` senden, Namen wählen. Den Token (sieht aus wie `123456:ABC...`) kopieren.
2. Supabase-Projekt **Semih** öffnen, **SQL Editor**, Inhalt von [`jarvis.sql`](jarvis.sql) einfügen, **Run**.
3. **Edge Functions → Deploy a new function → Via Editor**, Name `jarvis`, Inhalt von [`functions/jarvis/index.ts`](functions/jarvis/index.ts) einfügen. In den Einstellungen der Funktion **Verify JWT** ausschalten (Telegram schickt kein Supabase-Login mit, die Funktion prüft eigene Schlüssel).
4. **Edge Functions → Secrets**: `ANTHROPIC_API_KEY` (dein Claude-Schlüssel) und `TELEGRAM_BOT_TOKEN` (aus Schritt 1) anlegen.
5. Im **SQL Editor** ausführen und die beiden Werte notieren:
   ```sql
   select schluessel, wert from jarvis_einstellungen where schluessel in ('geheim', 'start_code');
   ```
6. Im Browser öffnen (Wert von `geheim` einsetzen):
   `https://yddyimqmkfbpwxanokaj.supabase.co/functions/v1/jarvis/einrichten?geheim=GEHEIM`
   Es sollte `"ok":true` erscheinen.
7. Deinem Bot in Telegram `/start STARTCODE` schreiben. Er antwortet mit „Verbunden“. Ab jetzt reagiert er nur auf dich.

Befehle: `/gedaechtnis` zeigt alles, was er sich gemerkt hat. `/anruf` startet einen Anruf, sobald Teil 2 eingerichtet ist. Uhrzeiten änderst du im Chat, etwa „Morgen-Briefing ab jetzt um 8“.

## Teil 2: Anrufe (optional, kostet pro Minute)

Telefonie läuft über Vapi. Die kostenlose Vapi-Nummer kann nicht ins deutsche Netz anrufen, deshalb braucht es eine Twilio-Nummer.

1. Konto auf [twilio.com](https://www.twilio.com) anlegen. Im Testkonto deine Handynummer bestätigen und eine Nummer holen. Testkonten dürfen nur bestätigte Nummern anrufen, das reicht für dich.
2. Konto auf [vapi.ai](https://vapi.ai) anlegen (10 $ Startguthaben). Unter **Phone Numbers → Import** die Twilio-Nummer mit Account SID und Auth Token importieren.
3. Unter **Assistants** einen Assistenten anlegen: Sprache Deutsch, Modell Anthropic, deutsche Stimme. Als System-Prompt:
   ```
   Du bist Jarvis, Semihs persönlicher Assistent. Du rufst ihn an. Anlass: {{anlass}}
   Sprich Deutsch, kurz und natürlich, eine Frage auf einmal. Halte das Gespräch unter zehn Minuten.
   Beim Wochen-Check frag nacheinander: Ansprachen, Gespräche, Angebote, neue Kunden und Umsatz, Stunden.
   Vergleiche kurz mit den Vorwochen und vereinbare höchstens drei Prioritäten für die nächste Woche.
   Was du über Semih weißt:
   {{kontext}}
   ```
   Erste Nachricht: `Hey Semih, hier ist Jarvis. Hast du kurz Zeit für deinen Wochen-Check?`
4. In Supabase unter **Edge Functions → Secrets** anlegen: `VAPI_API_KEY` (Vapi → API Keys, privater Schlüssel), `VAPI_ASSISTANT_ID`, `VAPI_PHONE_NUMBER_ID` und `JARVIS_TELEFON` (deine Nummer im Format `+49170...`).
5. In Telegram `/anruf` schreiben. Nach dem Auflegen schickt Jarvis eine Zusammenfassung und speichert Zahlen und Zusagen.

Sobald Teil 2 eingerichtet ist, ersetzt der Anruf am Sonntag die Telegram-Nachricht.

## Kosten

- Supabase: kostenlos.
- Claude: Standard ist `claude-opus-5-5`, grob 2 bis 4 Cent pro Nachricht. Mit dem Secret `JARVIS_MODELL` = `claude-haiku-5-5` etwa 40-mal günstiger, dafür weniger gründlich.
- Anrufe: Vapi 5 Cent pro Minute plus Telefonie, Spracherkennung, Stimme und Modell. Vor dem ersten Monat in Vapi unter **Billing** die tatsächlichen Minutenkosten prüfen.

## Was wo liegt

Alle Daten liegen in deinem Supabase-Projekt in den Tabellen `jarvis_*`. Die App und anonyme Zugriffe kommen nicht heran, nur die Funktion selbst.

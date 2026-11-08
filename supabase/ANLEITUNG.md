# Konten einrichten (Supabase, kostenlos)

Einmalig, etwa 10 Minuten.

1. Auf [supabase.com](https://supabase.com) ein Konto anlegen und **New project** wählen. Name egal, Region **Frankfurt (eu-central-1)**, Datenbank-Passwort notieren.
2. Im Projekt links **SQL Editor** öffnen, den Inhalt von [`einrichtung.sql`](einrichtung.sql) einfügen und **Run** klicken.
3. **Authentication → Sign In / Providers → Email**: **Confirm email** ausschalten. Sonst kommt bei jeder Registrierung eine Mail, und der kostenlose Tarif verschickt nur wenige pro Stunde.
4. **Authentication → URL Configuration**: bei **Site URL** die Adresse der App eintragen, z. B. `https://semihgedik2006-glitch.github.io/Klicker-Game/`. Dieselbe Adresse unter **Redirect URLs** hinzufügen (für „Passwort vergessen“).
5. **Project Settings → API**: **Project URL** und den **anon / publishable key** kopieren und in [`js/konto-config.js`](../js/konto-config.js) eintragen. Beide Werte sind öffentlich gedacht, der Zugriff wird über die Regeln aus Schritt 2 geschützt.

Danach in der App unter **Einstellungen → Konto erstellen**.

## Was wo liegt

- Fortschritt: in der Tabelle `fortschritt`, nur für das eigene Konto lesbar.
- API-Schlüssel: im Browser mit deinem Passwort verschlüsselt (AES-GCM, PBKDF2). Auf dem Server liegt nur der verschlüsselte Text.
- Passwort vergessen: Nach dem Zurücksetzen ist der gespeicherte Schlüssel nicht mehr lesbar und muss einmal neu eingetragen werden.
- Kostenlose Projekte pausieren nach einer Woche ohne Nutzung. Im Supabase-Dashboard mit einem Klick wieder starten.

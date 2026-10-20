OSOBNÍ ASISTENT v2.9 — REGISTRACE WEB PUSH

1. Na Cloudflare D1 > osobni-asistent-db > Console spusť:

CREATE TABLE IF NOT EXISTS push_subscriptions (
 device_id TEXT PRIMARY KEY,
 endpoint TEXT NOT NULL,
 p256dh TEXT NOT NULL,
 auth TEXT NOT NULL,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

2. Nahraj VŠECHNY soubory a složky z tohoto ZIP na GitHub (včetně functions/api/push-subscription.js).
3. Po úspěšném nasazení otevři aplikaci ikonou na ploše iPhonu a stiskni Zaregistrovat iPhone pro push.
4. Pošli výsledek testu. Zatím žádné automatické push zprávy NEODCHÁZEJÍ.

DŮLEŽITÉ: Záloha JSON před nasazením. Nemaž aplikaci z plochy. Nahrání nové verze nemá měnit místní data.

Bezpečnost: Tato fáze ukládá na server push endpoint a šifrovací klíče předplatného; nejsou to texty úkolů. V další fázi bude třeba zabezpečit přístup k zařízení a serverové plánování. Endpoint je citlivý technický údaj.

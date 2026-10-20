OSOBNÍ ASISTENT v3.1 – SERVEROVÝ PUSH TEST

1. Zálohuj úkoly přes JSON v aplikaci.
2. Nahraj obsah ZIP na GitHub včetně functions/api/push-test.js a sw.js.
3. Cloudflare Pages > osobni-asistent > Settings > Variables and secrets > Add:
   Název: VAPID_PRIVATE_KEY
   Hodnota: soukromý VAPID klíč vytvořený pro verzi 2.9 (soubor SOUKROMY_KLIC_NEUPLOADOVAT).
   Typ: Secret / Encrypt. Hodnotu NIKDY nenahrávej na GitHub.
4. Proveď nové nasazení (Redeploy, pokud se tajná proměnná neprojeví ihned).
5. Na iPhonu otevři aplikaci ikonou, případně znovu zaregistruj push.
6. Stiskni „Poslat test ze serveru“, zkontroluj doručení i po opuštění aplikace.

POZOR: v3.1 testuje jednorázový push vyvolaný tlačítkem. Automatické časované odesílání vyžaduje další serverový plánovač.
Texty úkolů nejsou odesílány na server.

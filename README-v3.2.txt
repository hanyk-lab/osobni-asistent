Osobní asistent v3.2 – automatické připomínky (instalace ve DVOU částech)

1) GitHub Pages: nahraj index.html, sw.js, manifest.webmanifest, ikony a složku functions z tohoto ZIPu. Soubor worker-cron.js nemusíš nahrávat na GitHub; patří do samostatného Cloudflare Workeru.
2) Cloudflare Workers & Pages: vytvoř nový samostatný Worker např. osobni-asistent-cron. Do jeho editoru vlož obsah worker-cron.js a Deploy.
3) V nastavení nového Workeru přidej D1 binding s názvem DB na existující databázi osobni-asistent-db.
4) V nastavení nového Workeru přidej Secret VAPID_PRIVATE_KEY, stejnou hodnotu jako v Pages (z původního bezpečně uloženého souboru). Nikdy ji neposílej ani nedávej na GitHub.
5) V nastavení Workeru přidej Cron Trigger: * * * * (každou minutu).
6) Otestuj připomínku s intervalem 10/30 minut a zavřenou aplikací. Push je generický, protože texty úkolů neopouštějí iPhone.

POZOR: Bez bodů 2–5 se automatické odesílání NESPUSTÍ. Před nasazením zazálohuj úkoly JSON.
Poznámka: Pokud synchronizace znovu otevřené aplikace posune termín připomínky, může se čas doručení lišit.

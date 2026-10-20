OSOBNÍ ASISTENT v3.3 – otevření konkrétního úkolu po automatické push připomínce

CO JE NOVÉ:
- Klepnutí na serverovou push připomínku otevře konkrétní úkol v aplikaci.
- Název úkolu ani poznámky se neodesílají na server. Uloží se pouze ID poslední odeslané připomínky.
- Zachována stávající grafika, lokální úkoly a nastavení připomínek.

NASAZENÍ (OBĚ ČÁSTI JSOU NUTNÉ):
1. Zálohuj seznam úkolů pomocí tlačítka Exportovat zálohu v aplikaci.
2. Nahraj do existujícího GitHub repozitáře / Cloudflare Pages soubory index.html, sw.js, manifest.webmanifest, obrázky a CELÝ adresář functions včetně NOVÉHO souboru functions/api/push-open.js. Zachovej umístění souborů.
3. V Cloudflare otevři existující Worker osobni-asistent-cron → Edit code. Nahraď celý obsah worker.js obsahem souboru worker-cron.js z tohoto ZIPu a stiskni Deploy. Není třeba znovu zadávat DB binding, VAPID secret ani cron.
4. Na iPhonu zavři a znovu otevři aplikaci, aby se načetl nový service worker.
5. Nastav připomínku na konkrétní čas a vyzkoušej klepnutí na oznámení. Měl by se otevřít příslušný úkol.

DŮLEŽITÉ:
- Samotné nahrání ZIPu na GitHub nestačí; změna worker-cron.js se musí nasadit i do samostatného Workeru.
- Cloudflare Pages musí skutečně nasazovat adresář functions (při nasazení statického webu jiným způsobem nemusí API fungovat).
- Pokud je více upozornění současně, server si pamatuje poslední odeslaný úkol pro daný iPhone. Pro přesné rozlišení každého souběžného upozornění by bylo nutné rozšířit push zprávy o šifrovaný payload.
- Testovací zpráva „Poslat test ze serveru“ není přiřazena ke konkrétnímu úkolu.

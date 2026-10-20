OSOBNÍ ASISTENT v3.4 – oprava otevření konkrétní připomínky

OPRAVENO:
- Odkaz #push=1 se zpracuje také při úplně novém spuštění aplikace, nejen při změně adresy již otevřené stránky.
- Service worker při klepnutí na oznámení otevře adresu s odkazem na připomínku.
- Pokud dočasně selže načtení připomínky, odkaz zůstane pro další pokus.
- Vzhled, místní úkoly, formát dat i ostatní funkce zůstávají zachovány.

NASAZENÍ:
1. Pro jistotu v aplikaci stáhni zálohu JSON.
2. Na GitHub do stejného repozitáře nahraj všechny soubory ZIPu do kořene, včetně adresáře functions/api.
3. Cloudflare Pages musí nasadit novou verzi z GitHubu (Production success).
4. Worker osobni-asistent-cron NENÍ třeba měnit: jeho kód z v3.3 je stejný.
5. Na iPhonu ukonči aplikaci, otevři ji ikonou na ploše a znovu vyzkoušej automatickou připomínku.

POZOR:
- Pro test použij adresu osobni-asistent.pages.dev nainstalovanou na ploše, nikoli GitHub Pages.
- Serverové push zatím uchovávají jen ID poslední odeslané připomínky pro daný telefon.
- Oznámení „Poslat test ze serveru“ není navázáno na konkrétní úkol.
- Pokud úkol po nasazení stále nejde otevřít, bude potřeba zkontrolovat odpověď API /api/push-open a databázový záznam push_deliveries.

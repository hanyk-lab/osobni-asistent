Osobní asistent v2.7 – ověření Cloudflare D1

Základ: v2.6; zachované lokální úkoly a grafika.
Novinka: tlačítko Otestovat Cloudflare a read-only funkce functions/api/db-check.js.
ŽÁDNÉ úkoly, poznámky ani připomínky se zatím neposílají na server.
Automatické push při zavřené aplikaci zatím NEFUNGUJE.

NASAZENÍ: Rozbal ZIP. Nahraj všechny soubory a složku functions/ do kořene GitHub repozitáře propojeného s Cloudflare Pages. Ujisti se, že soubor functions/api/db-check.js je ve správné cestě, nikoli v další nadřazené složce. Cloudflare Pages musí používat Git integration, ne Direct Upload (funkce se při Direct Upload nenahrají tímto způsobem). D1 binding musí mít název DB. Po nasazení na iPhonu spusť aplikaci ikonou a stiskni Otestovat Cloudflare.
Před nasazením si stáhni zálohu JSON. Nemaž aplikaci z plochy.

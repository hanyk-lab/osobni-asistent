Osobní asistent v2.8 – první synchronizace připomínek s Cloudflare D1

Nahraj celý obsah ZIP do kořene GitHub repozitáře, včetně složky functions/api.
Cloudflare Pages musí mít D1 binding DB na osobni-asistent-db.
Databáze musí mít tabulku reminders vytvořenou při předchozím nastavení.

Na iPhonu klepni na „Uložit připomínky na Cloudflare“.
Přenášejí se pouze ID a termíny připomínek, nikoliv texty úkolů.
Ukládání je zatím RUČNÍ. Změny úkolů se na serveru neprojeví, dokud znovu nestiskneš tlačítko.
Push notifikace při zavřené aplikaci ještě NEFUNGUJÍ.
Zachován původní localStorage klíč i vzhled. Před aktualizací doporučujeme JSON zálohu.

Osobní asistent v3.0 – automatická synchronizace připomínek.

Základ: v2.9. Zachovány soubory a úložiště localStorage.
Nově: automatické uložení metadat připomínek po změně úkolů, při návratu do aplikace a po obnovení internetu.
Ruční tlačítko zůstává pro diagnostiku.

Nasazení: nahrát všechny soubory včetně functions/api na GitHub (kořen projektu). Cloudflare Pages používá D1 binding DB.

POZOR: Tato verze sama neposílá push při zavřené aplikaci. K tomu je třeba bezpečná serverová služba s plánovačem a VAPID klíči. Žádný soukromý klíč do veřejného GitHubu.
Před nasazením exportovat JSON zálohu.

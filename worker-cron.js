// Osobní asistent v3.2 — samostatný Cloudflare Worker.
// Bindings: D1 database DB = osobni-asistent-db; secret VAPID_PRIVATE_KEY.
// Trigger: cron * * * * (každou minutu). No HTTP endpoint.
const PUBLIC='BCyalzlzjJ8HyLsw_2ZdEPxd_-BMgtR_mi2oKTZxZRPl8SPYpCERNwnvs6v5rEKA8rjHmGfs0YW5fZo-1rS4AyI';
const utf=s=>new TextEncoder().encode(s);
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));
const encode=bytes=>{let s='';for(const b of bytes)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const allowed=h=>h==='web.push.apple.com'||h.endsWith('.push.apple.com')||h==='fcm.googleapis.com'||h==='updates.push.services.mozilla.com';
function nextTime(row,now){
 const minutes=Number(row.interval_minutes)||0;
 // interval=0 means a one-off reminder that repeats on following days until done.
 // interval=1440 also means daily. Advance from original due time, not from execution time.
 const step=Math.max(1,minutes||1440)*60000;
 const old=Date.parse(row.next_reminder_at);
 const increments=Math.max(1,Math.floor((now-old)/step)+1);
 return new Date(old+increments*step).toISOString();
}
async function send(endpoint,key,now){
 const url=new URL(endpoint);
 if(url.protocol!=='https:'||!allowed(url.hostname)||url.username||url.password)throw Error('Nepovolená push služba');
 const pub=decode(PUBLIC),priv=decode(key.trim());
 if(pub.length!==65||pub[0]!==4||priv.length!==32)throw Error('Neplatný VAPID klíč');
 const cryptoKey=await crypto.subtle.importKey('jwk',{kty:'EC',crv:'P-256',x:encode(pub.slice(1,33)),y:encode(pub.slice(33)),d:encode(priv),ext:false},{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 const h=encode(utf(JSON.stringify({typ:'JWT',alg:'ES256'})));
 const p=encode(utf(JSON.stringify({aud:url.origin,exp:Math.floor(now/1000)+3600,sub:'https://osobni-asistent.pages.dev'})));
 const jwt=h+'.'+p;
 const signature=encode(new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},cryptoKey,utf(jwt))));
 return fetch(url.href,{method:'POST',redirect:'manual',headers:{Authorization:'vapid t='+jwt+'.'+signature+', k='+PUBLIC,TTL:'120'}});
}
export default {
 async scheduled(_event,env,ctx){ctx.waitUntil(run(env))},
 async fetch(){return new Response('Not found',{status:404})}
};
async function run(env){
 if(!env.DB||!env.VAPID_PRIVATE_KEY)throw Error('Chybí DB binding nebo VAPID_PRIVATE_KEY');
 const now=Date.now();
 const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Prague',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(now));
 const hour=Number(time.slice(0,2));
 if(hour<8||hour>=20)return; // Only 08:00–19:59 Prague time.
 await env.DB.prepare('CREATE TABLE IF NOT EXISTS push_deliveries (device_id TEXT PRIMARY KEY, task_id TEXT NOT NULL, sent_at TEXT NOT NULL)').run();
 const rows=await env.DB.prepare(`SELECT r.id,r.device_id,r.next_reminder_at,r.interval_minutes,s.endpoint
  FROM reminders r JOIN push_subscriptions s ON s.device_id=r.device_id
  WHERE r.active=1 AND r.next_reminder_at<=? ORDER BY r.next_reminder_at LIMIT 50`).bind(new Date(now).toISOString()).all();
 for(const row of rows.results||[]){
  try{
   const response=await send(row.endpoint,env.VAPID_PRIVATE_KEY,now);
   if(response.ok){
    await env.DB.prepare('INSERT INTO push_deliveries (device_id,task_id,sent_at) VALUES (?,?,?) ON CONFLICT(device_id) DO UPDATE SET task_id=excluded.task_id,sent_at=excluded.sent_at').bind(row.device_id,row.id.slice(row.device_id.length+1),new Date(now).toISOString()).run();
    await env.DB.prepare('UPDATE reminders SET next_reminder_at=? WHERE id=? AND next_reminder_at=? AND active=1')
      .bind(nextTime(row,now),row.id,row.next_reminder_at).run();
   }else if(response.status===404||response.status===410){
    await env.DB.prepare('DELETE FROM push_subscriptions WHERE device_id=?').bind(row.device_id).run();
   }else console.log('Push rejected',response.status);
  }catch(e){console.log('Push failed',String(e))}
 }
}

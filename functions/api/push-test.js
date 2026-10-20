// Server-side test of an actual Web Push request, without any task data.
// Requires VAPID_PRIVATE_KEY in Cloudflare Pages > Settings > Variables and secrets.
const PUBLIC='BLB3l2u5CK_BwZzP9sL1zCJF4DO1Cvhksg1G8vERF7nARzthQcNgC5dmeGA3mucjp7DQHC_tcOrX6AvM4EbtS_8';
const reply=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
function decode(s){const a=atob(s.replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-s.length%4)%4));return Uint8Array.from(a,c=>c.charCodeAt(0))}
function encode(data){let s='';for(const b of data)s+=String.fromCharCode(b);return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
const utf=s=>new TextEncoder().encode(s);
const allowed=host=>host==='web.push.apple.com'||host.endsWith('.push.apple.com')||host==='fcm.googleapis.com'||host==='updates.push.services.mozilla.com';
export async function onRequestPost({request,env}){
 if(!env.DB)return reply({ok:false,error:'Chybí propojení D1 jako DB.'},503);
 if(!env.VAPID_PRIVATE_KEY)return reply({ok:false,error:'V Cloudflare chybí tajná proměnná VAPID_PRIVATE_KEY.'},503);
 const token=request.headers.get('X-Device-Token')||'';
 if(!/^[a-f0-9]{64}$/.test(token))return reply({ok:false,error:'Neplatný token zařízení.'},401);
 const digest=await crypto.subtle.digest('SHA-256',utf(token));const id=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 const sub=await env.DB.prepare('SELECT endpoint FROM push_subscriptions WHERE device_id=?').bind(id).first();
 if(!sub)return reply({ok:false,error:'iPhone zatím není registrovaný. Zaregistruj push znovu.'},404);
 let endpoint;try{endpoint=new URL(sub.endpoint)}catch{return reply({ok:false,error:'Neplatná adresa push služby.'},400)}
 if(endpoint.protocol!=='https:'||!allowed(endpoint.hostname)||endpoint.username||endpoint.password)return reply({ok:false,error:'Nepovolená push služba.'},400);
 try{
  const pub=decode(PUBLIC),priv=decode(env.VAPID_PRIVATE_KEY.trim());
  if(pub.length!==65||pub[0]!==4||priv.length!==32)throw Error('Nesprávný formát VAPID klíče.');
  const key=await crypto.subtle.importKey('jwk',{kty:'EC',crv:'P-256',x:encode(pub.slice(1,33)),y:encode(pub.slice(33)),d:encode(priv),ext:false}, {name:'ECDSA',namedCurve:'P-256'},false,['sign']);
  const now=Math.floor(Date.now()/1000);
  const head=encode(utf(JSON.stringify({typ:'JWT',alg:'ES256'})));
  const body=encode(utf(JSON.stringify({aud:endpoint.origin,exp:now+3600,sub:'https://osobni-asistent.pages.dev'})));
  const unsigned=head+'.'+body;
  const sig=encode(new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,utf(unsigned))));
  const response=await fetch(endpoint.href,{method:'POST',redirect:'manual',headers:{Authorization:'vapid t='+unsigned+'.'+sig+', k='+PUBLIC,TTL:'60'}});
  if(response.status===404||response.status===410)return reply({ok:false,error:'Registrace push vypršela. Zaregistruj iPhone znovu.'},409);
  if(!response.ok)return reply({ok:false,error:'Push služba odmítla požadavek (HTTP '+response.status+').'},502);
  return reply({ok:true,accepted:response.status});
 }catch(e){return reply({ok:false,error:'Serverový push se nepodařilo odeslat: '+e.message},502)}
}

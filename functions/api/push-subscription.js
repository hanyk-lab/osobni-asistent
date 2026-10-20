// Cloudflare Pages Function: stores only a push endpoint and its encryption keys.
const json=(obj,status=200)=>new Response(JSON.stringify(obj),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export async function onRequestPost({request,env}){
 if(!env.DB)return json({ok:false,error:'Chybí databáze DB.'},503);
 const token=request.headers.get('X-Device-Token')||'';
 if(!/^[a-f0-9]{64}$/.test(token))return json({ok:false,error:'Neplatný token zařízení.'},401);
 let data;try{data=await request.json()}catch{return json({ok:false,error:'Neplatný JSON.'},400)}
 const s=data?.subscription;
 if(!s||typeof s.endpoint!=='string'||s.endpoint.length>2048||!s.endpoint.startsWith('https://')||typeof s.keys?.p256dh!=='string'||typeof s.keys?.auth!=='string'||!(/^[A-Za-z0-9_-]{40,150}$/.test(s.keys.p256dh))||!(/^[A-Za-z0-9_-]{15,80}$/.test(s.keys.auth)))return json({ok:false,error:'Neplatná push registrace.'},400);
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
 const deviceId=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 try{
  await env.DB.prepare('INSERT INTO push_subscriptions (device_id,endpoint,p256dh,auth,updated_at) VALUES (?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(device_id) DO UPDATE SET endpoint=excluded.endpoint,p256dh=excluded.p256dh,auth=excluded.auth,updated_at=CURRENT_TIMESTAMP').bind(deviceId,s.endpoint,s.keys.p256dh,s.keys.auth).run();
  return json({ok:true});
 }catch(e){return json({ok:false,error:'Nelze uložit registraci. Zkontroluj tabulku push_subscriptions v D1.'},503)}
}

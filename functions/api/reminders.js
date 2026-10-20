// Cloudflare Pages Function. Only metadata is stored; no task text.
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'};
const reply=(value,status=200)=>new Response(JSON.stringify(value),{status,headers});
export async function onRequestPost({request,env}){
 if(!env.DB)return reply({ok:false,error:'Chybí propojení databáze DB.'},503);
 const token=request.headers.get('X-Device-Token')||'';
 if(!/^[a-f0-9]{64}$/.test(token))return reply({ok:false,error:'Chybí identifikace zařízení.'},401);
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
 const deviceId=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 let body;try{body=await request.json()}catch{return reply({ok:false,error:'Neplatná data.'},400)}
 if(!Array.isArray(body?.reminders)||body.reminders.length>200)return reply({ok:false,error:'Neplatný seznam připomínek.'},400);
 const now=Date.now();const seen=new Set();const valid=[];
 for(const x of body.reminders){
  if(!x||typeof x.id!=='string'||x.id.length<1||x.id.length>120||seen.has(x.id)||!Number.isFinite(x.next)||x.next<now-86400000||x.next>now+366*86400000||!Number.isInteger(x.interval)||x.interval<0||x.interval>525600)return reply({ok:false,error:'Neplatná připomínka.'},400);
  seen.add(x.id);valid.push(x);
 }
 try{
  // Batch operations are atomic in D1. Only rows belonging to this device are modified.
  const statements=[env.DB.prepare('DELETE FROM reminders WHERE device_id = ?').bind(deviceId)];
  for(const x of valid)statements.push(env.DB.prepare('INSERT INTO reminders (id,device_id,next_reminder_at,interval_minutes,active) VALUES (?,?,?,?,1)').bind(deviceId+':'+x.id,deviceId,new Date(x.next).toISOString(),x.interval));
  await env.DB.batch(statements);
  return reply({ok:true,count:valid.length});
 }catch(_){return reply({ok:false,error:'Databáze nepřijala připomínky.'},503)}
}

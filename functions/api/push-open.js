// Return the most recently delivered reminder ID to the authenticated iPhone.
// No task title or note is ever stored on the server.
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export async function onRequestPost({request,env}){
 if(!env.DB)return json({ok:false,error:'Chybí DB.'},503);
 const token=request.headers.get('X-Device-Token')||'';
 if(!/^[a-f0-9]{64}$/.test(token))return json({ok:false,error:'Chybí token.'},401);
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
 const deviceId=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 try{
  const row=await env.DB.prepare('SELECT task_id, sent_at FROM push_deliveries WHERE device_id=?').bind(deviceId).first();
  if(!row)return json({ok:true,taskId:null});
  // Do not reopen an old reminder when a test notification is tapped much later.
  if(Date.now()-Date.parse(row.sent_at)>24*3600000)return json({ok:true,taskId:null});
  return json({ok:true,taskId:row.task_id});
 }catch{return json({ok:false,error:'Evidence doručení není připravena.'},503)}
}

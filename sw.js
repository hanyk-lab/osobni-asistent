self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const id=event.notification.data?.taskId;
 const url=new URL('./',self.registration.scope);
 url.hash=id?'ukol='+encodeURIComponent(String(id)):'push=1';
 event.waitUntil((async()=>{
  const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  // Navigate the existing PWA window to a real deep link; this survives a cold start.
  for(const client of windows){
   try{
    const target=await client.navigate(url.href);
    if(target){await target.focus();target.postMessage(id?{type:'OPEN_TASK',taskId:String(id)}:{type:'OPEN_SERVER_PUSH'});return}
   }catch(e){/* Open a new window below if navigation is unavailable. */}
  }
  await self.clients.openWindow(url.href);
 })());
});

// v3.1: display an incoming push even when the app is not open. No task text leaves the phone.
self.addEventListener('push',event=>{
 event.waitUntil(self.registration.showNotification('Osobní asistent', {
  body:'Máš připomínku. Otevři Osobního asistenta.',
  icon:'./icon-192.png',badge:'./icon-192.png',tag:'oa-server-push',
  data:{source:'server'}
 }));
});

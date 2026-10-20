self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const id=event.notification.data?.taskId;
 const url=new URL('./',self.registration.scope);
 if(id)url.hash='ukol='+encodeURIComponent(id);
 event.waitUntil((async()=>{
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  if(clients.length){const client=clients[0];await client.navigate(url.href);await client.focus();client.postMessage({type:'OPEN_TASK',taskId:id});}
  else await self.clients.openWindow(url.href);
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

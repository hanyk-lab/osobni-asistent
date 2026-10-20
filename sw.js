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

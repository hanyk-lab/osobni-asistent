/* Osobní asistent v2.2 – základ pro webová oznámení. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick', event => {
 event.notification.close();
 const target = event.notification.data?.url || new URL('./', self.registration.scope).href;
 event.waitUntil((async () => {
  const windows = await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for (const client of windows) {
   if (client.url.startsWith(self.registration.scope)) return client.focus();
  }
  return self.clients.openWindow(target);
 })());
});

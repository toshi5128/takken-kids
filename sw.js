// Network first so new lessons show up at once; cached copy keeps it working offline.
const CACHE='tk-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const c=r.clone();if(r.ok)caches.open(CACHE).then(k=>k.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});

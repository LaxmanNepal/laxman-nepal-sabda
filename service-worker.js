const CACHE='sabda-online-v4';
const CORE=['./','./index.html','./style.css','./script.js','./manifest.json','./image/logo.png','./image/favicon.ico','./image/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(self.skipWaiting())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Online-first PWA: network is authoritative. Cache is used only as a short-lived fallback.
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok&&e.request.destination!=='document'){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{})}return r}).catch(()=>caches.match(e.request).then(c=>c||Response.error())))});
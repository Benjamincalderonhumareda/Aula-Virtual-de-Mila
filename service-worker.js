const CACHE_NAME = "aula-mila-v5";

self.addEventListener("install", e=>{
self.skipWaiting();
});

self.addEventListener("activate", e=>{
self.clients.claim();
});

self.addEventListener("fetch", e=>{
e.respondWith(fetch(e.request));
});

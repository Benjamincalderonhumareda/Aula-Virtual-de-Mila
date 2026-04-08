const CACHE_NAME = "aula-mila-v2";

self.addEventListener("install", e => {
  self.skipWaiting(); // fuerza activación inmediata
});

self.addEventListener("activate", e => {
  e.waitUntil(self.clients.claim()); // toma control de la página
});

self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request));
});

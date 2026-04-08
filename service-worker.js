const CACHE_NAME = "aula-pro-v2"; // Incrementa el número si haces cambios grandes

const urlsToCache = [
  "./",
  "./index.html",
  "./styles.css",
  "./manifest.json",
  "./app.js",
  "./dashboard.js",
  "./cursos.js",
  "./tareas.js",
  "./apuntes.js",
  "./icon.png"
];

// INSTALAR: Guarda los archivos en el cache
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Cache abierto, guardando recursos...");
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Fuerza al SW a activarse de inmediato
});

// ACTIVAR: Limpia caches antiguos
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// FETCH: Sirve los archivos desde el cache si no hay red
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        // Retorna el archivo del cache o lo busca en internet
        return res || fetch(e.request);
      })
  );
});
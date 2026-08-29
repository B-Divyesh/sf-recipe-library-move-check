const CACHE = "recipe-move-check-v7";
const SHELL = ["/", "/?demo=1", "/demo", "/privacy", "/terms", "/notebook-migration.98e3f6.webp", "/terminal-recording.4a32d1.svg", "/favicon.4bc1a9.svg"];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(caches.match(event.request, { ignoreSearch: true }).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("/") : undefined)));
});

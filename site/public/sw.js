const CACHE = "recipe-move-check-v2";
const SHELL = ["/", "/demo", "/privacy", "/terms", "/notebook-migration.webp", "/favicon.svg"];
self.addEventListener("install", event => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);
  const html = await (await fetch("/")).text();
  const builtAssets = [...new Set(html.match(/\/assets\/[^\"']+/g) || [])];
  await cache.addAll(builtAssets);
  await self.skipWaiting();
})()));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => event.request.mode === "navigate" ? caches.match("/") : undefined)));
});

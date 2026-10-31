/* Service worker: guarda la app para que abra sin internet.
   Al cambiar cualquier archivo, subir VERSION. */
const VERSION = "v2.1";
const CACHE = "visor-" + VERSION;
const SHELL = [
  "./",
  "./index.html",
  "./pdf.min.mjs",
  "./pdf.worker.min.mjs",
  "./manifest.json",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("visor-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Primero la copia guardada (abre al instante y sin internet);
   en segundo plano trae la versión nueva para la próxima vez. */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const isPage = req.mode === "navigate";
    const key = isPage ? "./index.html" : req;
    const hit = await cache.match(key, { ignoreSearch: true });
    const net = fetch(req).then(r => {
      if (r && r.ok && r.type === "basic") cache.put(key, r.clone());
      return r;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const r = await net;
    return r || new Response("Sin conexión", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  })());
});

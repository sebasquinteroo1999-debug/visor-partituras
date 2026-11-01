/* Service worker: guarda la app para que abra sin internet.
   Al cambiar cualquier archivo, subir VERSION. */
const VERSION = "v2.4";
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

/* Siempre la copia guardada: abre al instante, sin internet y sin gastar datos.
   La versión nueva llega cuando cambia este archivo (VERSION): el navegador
   lo revisa al abrir la app, instala todo de nuevo y se ve en la siguiente apertura. */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = req.mode === "navigate" ? "./index.html" : req;
    const hit = await cache.match(key, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r && r.ok && r.type === "basic") e.waitUntil(cache.put(key, r.clone()));
      return r;
    } catch {
      return new Response("Sin conexión", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
  })());
});

// Briefing service worker — offline app shell for the PWA.
// Bump CACHE when shipping new assets so old caches are cleared.
const CACHE = "briefing-v1";
const CORE = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(CORE);
      self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Never intercept the dynamic APIs / photos — let them hit the network.
  if (
    url.hostname.includes("api.openweathermap.org") ||
    url.hostname.includes("api.unsplash.com") ||
    url.hostname.includes("images.unsplash.com")
  ) {
    return;
  }

  const sameOrigin = url.origin === self.location.origin;
  const isFont =
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com");

  if (sameOrigin) {
    // Network-first so new deploys show up immediately; fall back to cache offline.
    e.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res && res.ok) {
            const cache = await caches.open(CACHE);
            cache.put(req, res.clone());
          }
          return res;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          if (req.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        }
      })(),
    );
    return;
  }

  if (isFont) {
    // Cache-first for fonts so they work offline after the first load.
    e.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res && res.ok) {
            const cache = await caches.open(CACHE);
            cache.put(req, res.clone());
          }
          return res;
        } catch {
          return Response.error();
        }
      })(),
    );
  }
});

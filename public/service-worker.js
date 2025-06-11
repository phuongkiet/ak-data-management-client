const CACHE_NAME = "ankhanh-cache-v2";
const urlsToCache = [
  "/",
  "/index.html"
  // Có thể thêm các file tĩnh không đổi tên ở đây
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Không cache API
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Chỉ fallback về index.html cho navigation (route client-side)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Với file tĩnh: trả về đúng file, không fallback về index.html
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

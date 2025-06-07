const CACHE_NAME = "ankhanh-cache-v1";
const urlsToCache = [
  "/",
  "/index.html"
  // Thêm các file tĩnh khác nếu muốn cache thêm
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  // Chỉ cache file tĩnh, không cache API
  if (event.request.url.includes('/api/')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

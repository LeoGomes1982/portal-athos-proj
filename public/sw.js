const CACHE_NAME = 'portal-athos-v3';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/lovable-uploads/e995f00e-eb37-4f16-bfb4-67e260b861c6.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});
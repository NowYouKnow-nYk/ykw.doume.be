const nom_cache = 'YouKnow-Cache'; // Le nom pourri, je sais...
const fichiers = [
  '/',
  '/index.html',
  '/etape1.png',
  '/etape2.png',
  '/etape3.png',
  '/etape4.png',
  '/etape5.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(nom_cache).then((cache) => {
      return cache.addAll(fichiers);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(nom_cache).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
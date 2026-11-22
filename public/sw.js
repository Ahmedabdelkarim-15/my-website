/* ======================================================
   market.com — Service Worker (تشغيل سريع + عمل بدون إنترنت)
   ====================================================== */
const CACHE_VERSION = 'market-v1';

const APP_SHELL = [
  '/',
  '/index.html',
  '/order-success.html',
  '/css/styles.css',
  '/css/ltr.css',
  '/js/products.js',
  '/js/i18n.js',
  '/js/app.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* طلبات الـ API: الشبكة فقط، بدون كاش */
  if (url.pathname.startsWith('/api/')) return;

  /* الصفحات: الشبكة أولاً مع fallback للكاش (تصفح بدون إنترنت) */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('/index.html')))
    );
    return;
  }

  /* الملفات الثابتة والصور: الكاش أولاً مع تحديث في الخلفية */
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && (url.origin === self.location.origin || res.type === 'cors')) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

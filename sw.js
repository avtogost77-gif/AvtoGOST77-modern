// ===============================================
// SERVICE WORKER - АВТОГОСТ PWA v2.1 - FIXED!
// Кэширование, офлайн-режим, уведомления
// ===============================================

const CACHE_NAME = 'avtogost-v2.1-fixed'; // НОВАЯ ВЕРСИЯ!
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/styles-optimized.min.css', // ОБНОВЛЁННЫЕ ПУТИ!
  '/assets/js/main.js',
  '/assets/js/smart-calculator-v2.js',
  '/assets/js/cities-simple.js',
  '/assets/js/form-handler.js',
  '/favicon.svg'
  // УБРАЛИ MANIFEST.JSON НАХРЕН!
];

// Установка service worker с принудительным обновлением
self.addEventListener('install', event => {
  console.log('🔄 SW installing - v2.1-fixed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching updated files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Принудительно активируем новый SW
        return self.skipWaiting();
      })
  );
});

// Обновление кэша - УДАЛЯЕМ СТАРЫЕ ВЕРСИИ
self.addEventListener('activate', event => {
  console.log('✅ SW activated - v2.1-fixed');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Принудительно обновляем все табы
      return self.clients.claim();
    })
  );
});

// Перехват запросов - NETWORK FIRST для HTML
self.addEventListener('fetch', event => {
  // Для HTML файлов - сначала сеть, потом кэш
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Кэшируем новую версию
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Если нет сети - берём из кэша
          return caches.match(event.request);
        })
    );
  } else {
    // Для остальных ресурсов - сначала кэш, потом сеть
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
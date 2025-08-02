// Service Worker для AvtoGOST77.ru - v2.6
const CACHE_NAME = 'avtogost-v2.6-temp'; // ВРЕМЕННАЯ ВЕРСИЯ БЕЗ ФАВИКОН

// Файлы для кэширования - ТОЛЬКО КРИТИЧНЫЕ
const urlsToCache = [
  '/',
  '/assets/css/styles-optimized.min.css',
  '/assets/js/smart-calculator-v2.min.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('🔄 SW installing - v2.6-temp');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching critical files only');
        return cache.addAll(urlsToCache).catch(err => {
          console.error('❌ Cache addAll failed:', err);
          // Кэшируем файлы по одному
          return Promise.allSettled(
            urlsToCache.map(url => 
              cache.add(url).catch(e => console.error('❌ Failed to cache:', url, e))
            )
          );
        });
      })
  );
  // Немедленно активируем новый SW
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', event => {
  console.log('✅ SW activated - v2.6-temp');
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
    })
  );
  // Немедленно берём контроль над всеми страницами
  self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // ВАЖНО: Игнорируем внешние домены (Yandex, Tawk.to, etc.)
  if (url.origin !== location.origin) {
    console.log('🚫 Ignoring external request:', url.href);
    return; // Не обрабатываем внешние запросы
  }
  
  // Только для наших файлов
  if (event.request.destination === 'document') {
    // Для HTML - сначала сеть, потом кэш
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Клонируем ответ для кэша
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
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
          if (response) {
            return response;
          }
          return fetch(event.request).catch(err => {
            console.log('❌ Failed to fetch:', event.request.url, err.message);
            // Не выбрасываем ошибку, просто логируем
            return new Response('', { status: 404 });
          });
        })
    );
  }
});
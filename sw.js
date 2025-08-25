// ========================================================
// 💀 SERVICE WORKER KILLER v3.1 - АГРЕССИВНАЯ ОЧИСТКА
// Принудительно уничтожает все кеши и пропускает все запросы
// ========================================================

const CACHE_VERSION = 'v3.1-KILLER';
const CACHE_NAME = `avtogost77-${CACHE_VERSION}`;

console.log('💀 Service Worker KILLER v3.1 activated');

// Уничтожаем ВСЕ старые кеши при активации
self.addEventListener('activate', event => {
  console.log('💀 SW Killer v3.1 ready - old caches will be destroyed!');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('💀 Destroying old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('💀 All old caches destroyed!');
      return self.clients.claim();
    })
  );
});

// Пропускаем ВСЕ запросы без кеширования
self.addEventListener('fetch', event => {
  console.log('🚫 SW Killer: passing through request to', event.request.url);
  
  // Просто пропускаем все запросы к серверу
  event.respondWith(fetch(event.request));
});

// Устанавливаем SW без кеширования
self.addEventListener('install', event => {
  console.log('💀 SW Killer v3.1 installed - no caching!');
  self.skipWaiting();
});

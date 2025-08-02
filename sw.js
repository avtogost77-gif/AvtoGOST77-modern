// SERVICE WORKER KILLER v3.0 - УБИВАЕМ ВСЕ СТАРЫЕ КЭШИ
console.log('💀 Service Worker KILLER v3.0 activated');

// Немедленно активируемся
self.addEventListener('install', (event) => {
  console.log('🔥 SW Killer installing - destroying old caches');
  self.skipWaiting();
});

// Удаляем ВСЕ кэши при активации
self.addEventListener('activate', (event) => {
  console.log('💀 SW Killer activated - NUKING ALL CACHES');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('📋 Found caches:', cacheNames);
      
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('🗑️ DELETING cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ ALL CACHES DESTROYED!');
      
      // Уведомляем все табы об обновлении
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            msg: 'CACHE_CLEARED',
            version: '3.0'
          });
        });
      });
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// НЕ КЭШИРУЕМ НИЧЕГО - просто пропускаем все запросы
self.addEventListener('fetch', (event) => {
  // Логируем только критичные ошибки
  if (event.request.url.includes('avtogost77.ru')) {
    console.log('🚫 SW Killer: passing through request to', event.request.url);
  }
  
  // Пропускаем запрос без кэширования
  return;
});

// Слушаем сообщения от страницы
self.addEventListener('message', (event) => {
  console.log('📨 SW Killer received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('💀 SW Killer v3.0 ready - old caches will be destroyed!');
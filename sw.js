// SERVICE WORKER АВТОГОСТ77 - ПРОДАКШН ВЕРСИЯ
console.log('🚀 Service Worker АвтоГОСТ77 активирован');

const CACHE_NAME = 'avtogost77-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/critical-optimized.min.css',
  '/assets/css/unified-styles.min.css',
  '/assets/js/main.min.js',
  '/assets/js/smart-calculator-v2.js',
  '/favicon.svg',
  '/manifest.json'
];

// Установка
self.addEventListener('install', (event) => {
  console.log('📦 SW: Установка кэша');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ SW: Кэш открыт');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Активация
self.addEventListener('activate', (event) => {
  console.log('🔄 SW: Активация');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ SW: Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем аналитику и внешние ресурсы
  if (event.request.url.includes('googletagmanager.com') ||
      event.request.url.includes('mc.yandex.ru') ||
      event.request.url.includes('unpkg.com') ||
      event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем из кэша или загружаем из сети
        return response || fetch(event.request);
      })
  );
});

console.log('✅ Service Worker АвтоГОСТ77 готов к работе');

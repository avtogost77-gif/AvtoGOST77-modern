// ===============================================
// SERVICE WORKER - АВТОГОСТ PWA v2.0
// Кэширование, офлайн-режим, уведомления
// ===============================================

const CACHE_NAME = 'avtogost-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/css/main.css',
  '/assets/css/mobile.css',
  '/assets/css/hero-fix.css',
  '/assets/js/main.js',
  '/assets/js/smart-calculator-v2.js',
  '/assets/js/cities-simple.js',
  '/assets/js/form-handler.js',
  '/assets/img/logo.png',
  '/manifest.json'
];

// Установка service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный ответ или делаем сетевой запрос
        return response || fetch(event.request);
      }
    )
  );
});

// Обновление кэша
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
// ===============================================
// SERVICE WORKER - АВТОГОСТ PWA v2.0
// Кэширование, офлайн-режим, уведомления
// ===============================================

const CACHE_NAME = 'avtogost-v2.1.0';
const STATIC_CACHE = 'static-v2.1.0';
const DYNAMIC_CACHE = 'dynamic-v2.1.0';
const IMAGE_CACHE = 'images-v2.1.0';

// Критические ресурсы для кэширования
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/assets/css/styles.css',
  '/assets/css/critical.css',
  '/assets/css/mobile.css',
  '/assets/js/calc.js',
  '/assets/js/modern-ux.js',
  '/assets/js/main.js',
  '/assets/js/performance.js',
  '/manifest.json',
  // Критические изображения
  '/assets/img/favicon.png',
  '/assets/img/favicon-16x16.png',
  '/assets/img/favicon-32x32.png',
  '/assets/img/apple-touch-icon.png',
  '/assets/img/icon-192x192.svg',
  '/assets/img/icon-512x512.svg'
];

// Статические ресурсы
const STATIC_RESOURCES = [
  '/services.html',
  '/contact.html',
  '/about.html',
  '/faq.html',
  '/news.html',
  '/marketplace-delivery.html',
  '/urgent-delivery.html',
  '/moscow-regions.html',
  // '/assets/js/interactive-map.js', // Временно отключено
  '/assets/js/benefit.js',
  '/assets/js/ticker.js',
  '/assets/js/sticky-bar.js',
  '/assets/js/seo-optimizer.js',
  '/assets/js/content-generator.js',
  // Важные изображения для SEO
  '/assets/img/hero-logistics.webp',
  '/assets/img/logo.png',
  '/assets/img/og-image.jpg',
  '/assets/img/twitter-card.jpg'
];

// CDN ресурсы
const CDN_RESOURCES = [
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://unpkg.com/aos@2.3.4/dist/aos.css',
  'https://unpkg.com/aos@2.3.4/dist/aos.js'
];

// ===============================================
// УСТАНОВКА SERVICE WORKER
// ===============================================

self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Кэшируем критические ресурсы
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Кэшируем статические ресурсы
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      }),
      
      // Кэшируем CDN ресурсы
      caches.open(STATIC_CACHE).then(cache => {
        console.log('SW: Caching CDN resources');
        return cache.addAll(CDN_RESOURCES.map(url => new Request(url, { mode: 'cors' })));
      })
    ]).then(() => {
      console.log('SW: Installation successful');
      return self.skipWaiting();
    })
  );
});

// ===============================================
// АКТИВАЦИЯ SERVICE WORKER
// ===============================================

self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Очищаем старые кэши
      cleanupOldCaches(),
      
      // Берем контроль над всеми клиентами
      self.clients.claim()
    ]).then(() => {
      console.log('SW: Activated successfully');
    })
  );
});

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  
  return Promise.all(
    cacheNames
      .filter(name => !validCaches.includes(name))
      .map(name => {
        console.log('SW: Deleting old cache:', name);
        return caches.delete(name);
      })
  );
}

// ===============================================
// ОБРАБОТКА FETCH ЗАПРОСОВ
// ===============================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Игнорируем chrome-extension и другие протоколы
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Разные стратегии для разных типов ресурсов
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isStaticResource(request)) {
    event.respondWith(handleStaticResource(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

// ===============================================
// СТРАТЕГИИ КЭШИРОВАНИЯ
// ===============================================

// Cache First - для статических ресурсов
async function handleStaticResource(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Failed to fetch static resource:', request.url);
    return new Response('Resource not available offline', { status: 503 });
  }
}

// Network First - для API запросов
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Кэшируем только успешные ответы
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('SW: Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback для API
    return new Response(JSON.stringify({
      error: 'Нет подключения к интернету',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale While Revalidate - для изображений
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  return cachedResponse || networkPromise || createPlaceholderImage();
}

// Navigation requests с fallback на офлайн страницу
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback на главную страницу
    const indexPage = await caches.match('/');
    return indexPage || createOfflinePage();
  }
}

// Generic requests
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Not available offline', { status: 503 });
  }
}

// ===============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ===============================================

function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
}

function isAPIRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('telegram.org') ||
         request.url.includes('maps.yandex.ru');
}

function isStaticResource(request) {
  return request.destination === 'style' ||
         request.destination === 'script' ||
         request.destination === 'font' ||
         /\.(css|js|woff|woff2|ttf|eot)$/i.test(request.url);
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function createPlaceholderImage() {
  // SVG placeholder для изображений
  const svg = `
    <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">
        📷 Изображение недоступно
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

function createOfflinePage() {
  const html = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Офлайн - АвтоГОСТ</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 2rem;
        }
        .offline-icon { font-size: 4rem; margin-bottom: 2rem; }
        h1 { margin-bottom: 1rem; }
        p { opacity: 0.9; margin-bottom: 2rem; }
        .retry-btn {
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="offline-icon">📡</div>
      <h1>Нет подключения к интернету</h1>
      <p>Проверьте подключение и попробуйте снова.<br>
         Некоторые функции доступны в офлайн-режиме.</p>
      <button class="retry-btn" onclick="location.reload()">
        Повторить попытку
      </button>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// ===============================================
// BACKGROUND SYNC & PUSH NOTIFICATIONS
// ===============================================

self.addEventListener('sync', (event) => {
  console.log('SW: Background sync:', event.tag);
  
  if (event.tag === 'calculator-data') {
    event.waitUntil(syncCalculatorData());
  }
});

async function syncCalculatorData() {
  try {
    // Синхронизируем данные калькулятора при восстановлении сети
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Обновляем кэшированные расчеты
    console.log('SW: Syncing calculator data...');
  } catch (error) {
    console.log('SW: Sync failed:', error);
  }
}

self.addEventListener('push', (event) => {
  console.log('SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от АвтоГОСТ',
    icon: '/assets/img/icon-192x192.png',
    badge: '/assets/img/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'Открыть',
        icon: '/assets/img/action-view.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/assets/img/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('АвтоГОСТ', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// ===============================================
// PERIODIC BACKGROUND SYNC (экспериментальное)
// ===============================================

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-rates') {
    event.waitUntil(updateTransportRates());
  }
});

async function updateTransportRates() {
  try {
    // Обновляем тарифы в фоне
    console.log('SW: Updating transport rates...');
  } catch (error) {
    console.log('SW: Failed to update rates:', error);
  }
}

console.log('SW: Service Worker script loaded');
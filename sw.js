const CACHE_NAME = 'avtogost77-v4.4-full-restore';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/master/master-styles.min.css',
    '/assets/css/unified-site-styles.css',
    '/assets/css/critical-fixes.css',
    '/assets/js/interactive-infographic.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('🚀 SW v4.4 Full Restore: установка...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Кеширование файлов...');
                return cache.addAll(urlsToCache);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('🔄 SW v4.4 Full Restore: активация...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Удаляем старый кеш:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработка запросов
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Пропускаем запросы к аналитике
    if (url.hostname.includes('google-analytics') || 
        url.hostname.includes('googletagmanager') ||
        url.hostname.includes('mc.yandex') ||
        url.hostname.includes('yandex')) {
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Стратегия для HTML страниц: Network First
    if (event.request.headers.get('accept') && 
        event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseClone));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }
    
    // Стратегия для статических ресурсов: Cache First
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$/)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) return response;
                    return fetch(event.request)
                        .then(response => {
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, responseClone));
                            }
                            return response;
                        });
                })
        );
        return;
    }
    
    // Для остальных запросов: Network First
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});

#!/bin/bash

# Скрипт для оптимизации Service Worker для SEO
# Обновляет SW для лучшей индексации поисковыми системами

echo "🔧 Оптимизация Service Worker для SEO..."

# Создаем новую версию Service Worker
cat > sw.js << 'EOF'
const CACHE_NAME = 'avtogost77-v4.0-seo-optimized';
const urlsToCache = [
    '/',
    '/index.html',
    '/services.html',
    '/contact.html',
    '/about.html',
    '/assets/css/master/master-styles.min.css',
    '/assets/css/unified-site-styles.css',
    '/assets/css/critical-fixes.css',
    '/assets/js/smart-calculator-v2.js',
    '/assets/js/distance-api.js',
    '/assets/js/preview-calculator.js',
    '/favicon.svg',
    '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('🚀 SW v4.0 SEO Optimized: установка...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Кеш открыт');
                return cache.addAll(urlsToCache);
            })
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('🔄 SW v4.0 SEO Optimized: активация...');
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
    
    // Пропускаем все запросы к поисковым роботам
    if (event.request.headers.get('user-agent') && 
        (event.request.headers.get('user-agent').includes('bot') ||
         event.request.headers.get('user-agent').includes('crawler') ||
         event.request.headers.get('user-agent').includes('spider'))) {
        console.log('🤖 Пропускаем запрос от поискового робота:', url.pathname);
        event.respondWith(fetch(event.request));
        return;
    }
    
    // Пропускаем запросы к sitemap и robots.txt
    if (url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt') {
        console.log('📋 Пропускаем SEO файл:', url.pathname);
        event.respondWith(fetch(event.request));
        return;
    }
    
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
                    // Кешируем только успешные ответы
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    // Если сеть недоступна, возвращаем из кеша
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // Стратегия для статических ресурсов: Cache First
    if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|webp)$/)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }
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

// Обработка push уведомлений (если понадобится в будущем)
self.addEventListener('push', event => {
    console.log('📱 Push уведомление получено');
    // Здесь можно добавить логику push уведомлений
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
    console.log('👆 Клик по уведомлению');
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
EOF

echo "✅ Service Worker оптимизирован для SEO"
echo "📋 Основные изменения:"
echo "   - Пропуск запросов от поисковых роботов"
echo "   - Пропуск sitemap.xml и robots.txt"
echo "   - Network First для HTML страниц"
echo "   - Cache First для статических ресурсов"
echo "   - Улучшенная стратегия кеширования"

# Загружаем на сервер
echo "📤 Загрузка на сервер..."
scp -i ~/.ssh/id_ed25519 sw.js root@193.160.208.183:/www/wwwroot/avtogost77.ru/

if [ $? -eq 0 ]; then
    echo "✅ Service Worker загружен на сервер"
    echo "🔄 Проверьте работу SW в браузере"
else
    echo "❌ Ошибка загрузки Service Worker"
fi

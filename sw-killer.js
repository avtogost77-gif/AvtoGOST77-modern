// Service Worker Killer - принудительное удаление SW из браузера
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
            console.log('🗑️ Удаляем Service Worker:', registration.scope);
            registration.unregister();
        }
        console.log('✅ Все Service Workers удалены');
        
        // Очистка кэша
        if ('caches' in window) {
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        console.log('🗑️ Удаляем кэш:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            }).then(function() {
                console.log('✅ Весь кэш очищен');
                // Принудительная перезагрузка
                window.location.reload(true);
            });
        }
    });
} else {
    console.log('Service Worker не поддерживается');
}
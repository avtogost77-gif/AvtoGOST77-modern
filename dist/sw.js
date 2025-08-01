// 🔧 NextGen Logistics - Service Worker
// Modern PWA implementation with advanced caching strategies

const CACHE_NAME = 'nextgen-logistics-v1.2.0';
const STATIC_CACHE_NAME = 'nextgen-static-v1.2.0';
const DYNAMIC_CACHE_NAME = 'nextgen-dynamic-v1.2.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json',
  '/favicon.svg',
  // Add more critical assets
];

// External resources that can be cached
const EXTERNAL_RESOURCES = [
  'https://fonts.googleapis.com',
  'https://api.telegram.org',
  'https://www.googletagmanager.com'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (isStaticAsset(request)) {
      // Cache First strategy for static assets
      event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(request)) {
      // Network First strategy for API calls
      event.respondWith(networkFirst(request));
    } else if (isExternalResource(request)) {
      // Stale While Revalidate for external resources
      event.respondWith(staleWhileRevalidate(request));
    } else {
      // Network First with fallback for pages
      event.respondWith(networkFirstWithFallback(request));
    }
  }
});

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return new Response('Offline content not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Network First Strategy - for API calls
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Network request failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for calculator
    if (request.url.includes('/api/calculate')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Нет подключения к интернету. Попробуйте позже.',
        code: 'OFFLINE'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Stale While Revalidate - for external resources
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Network First with Fallback - for pages
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    if (request.destination === 'document') {
      const offlineResponse = await caches.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    throw error;
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|webp|woff2?|ttf)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.hostname === 'api.telegram.org';
}

function isExternalResource(request) {
  const url = new URL(request.url);
  return EXTERNAL_RESOURCES.some(domain => url.hostname.includes(domain));
}

// Background Sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'lead-form-sync') {
    event.waitUntil(syncLeadForms());
  }
  
  if (event.tag === 'calculator-usage-sync') {
    event.waitUntil(syncCalculatorUsage());
  }
});

// Sync lead forms when back online
async function syncLeadForms() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const requests = await cache.keys();
    
    const pendingForms = requests.filter(req => 
      req.url.includes('/api/leads') && req.method === 'POST'
    );
    
    for (const request of pendingForms) {
      try {
        await fetch(request);
        await cache.delete(request);
        console.log('✅ Synced lead form');
      } catch (error) {
        console.error('❌ Failed to sync lead form:', error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Sync calculator usage analytics
async function syncCalculatorUsage() {
  try {
    // Send analytics data when back online
    const analyticsData = await getStoredAnalytics();
    if (analyticsData.length > 0) {
      for (const data of analyticsData) {
        // Send to analytics service
        gtag('event', data.event, data.parameters);
      }
      await clearStoredAnalytics();
    }
  } catch (error) {
    console.error('❌ Analytics sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📢 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'У вас новое сообщение',
    icon: '/images/icon-192.png',
    badge: '/images/badge-72.png',
    vibrate: [200, 100, 200],
    tag: 'nextgen-notification',
    actions: [
      {
        action: 'open-calculator',
        title: 'Открыть калькулятор',
        icon: '/images/calc-icon.png'
      },
      {
        action: 'call-manager', 
        title: 'Позвонить менеджеру',
        icon: '/images/phone-icon.png'
      }
    ],
    data: {
      url: '/#calculator',
      timestamp: Date.now()
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('NextGen Logistics', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  const actionHandlers = {
    'open-calculator': () => clients.openWindow('/#calculator'),
    'call-manager': () => clients.openWindow('tel:+79162720932'),
    'default': () => clients.openWindow('/')
  };
  
  const handler = actionHandlers[event.action] || actionHandlers.default;
  event.waitUntil(handler());
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('💬 Message received:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
      case 'CACHE_CALCULATOR_RESULT':
        cacheCalculatorResult(event.data.payload);
        break;
      case 'GET_CACHE_INFO':
        sendCacheInfo(event.source);
        break;
    }
  }
});

// Cache calculator result for offline use
async function cacheCalculatorResult(result) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const request = new Request('/api/calculator-cache', {
      method: 'POST',
      body: JSON.stringify(result)
    });
    const response = new Response(JSON.stringify(result));
    await cache.put(request, response);
  } catch (error) {
    console.error('❌ Failed to cache calculator result:', error);
  }
}

// Send cache information to main thread
async function sendCacheInfo(client) {
  try {
    const cacheNames = await caches.keys();
    const cacheInfo = {
      static: await getCacheSize(STATIC_CACHE_NAME),
      dynamic: await getCacheSize(DYNAMIC_CACHE_NAME),
      total: cacheNames.length
    };
    
    client.postMessage({
      type: 'CACHE_INFO',
      payload: cacheInfo
    });
  } catch (error) {
    console.error('❌ Failed to get cache info:', error);
  }
}

// Get cache size
async function getCacheSize(cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    return keys.length;
  } catch (error) {
    return 0;
  }
}

// Store analytics data when offline
async function storeAnalyticsData(data) {
  // Use IndexedDB or localStorage to store analytics
  if ('indexedDB' in self) {
    // Implementation for IndexedDB storage
  }
}

async function getStoredAnalytics() {
  // Retrieve stored analytics data
  return [];
}

async function clearStoredAnalytics() {
  // Clear stored analytics after sync
}

console.log('🚀 NextGen Logistics Service Worker loaded');
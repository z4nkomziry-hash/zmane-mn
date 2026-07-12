// service-worker.js - Advanced Caching Strategies
const CACHE_VERSION = 'v3';
const CACHE_NAME = `zimanemin-${CACHE_VERSION}`;
const RUNTIME_CACHE = `zimanemin-runtime-${CACHE_VERSION}`;

// Resources to pre-cache
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/config.js',
    '/scripts/app.js',
    '/manifest.json',
    '/offline.html'
];

// Install - Pre-cache critical resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Pre-caching resources...');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => {
                    return name !== CACHE_NAME && name !== RUNTIME_CACHE;
                }).map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Advanced strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // API calls - Network First
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Images - Cache First
    if (request.destination === 'image') {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Fonts & CSS - Cache First
    if (request.destination === 'font' || request.destination === 'style') {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // HTML & JS - Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
});

// Cache First Strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        return new Response('Offline', { status: 503 });
    }
}

// Network First Strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        return cached || new Response(JSON.stringify({ error: 'Offline' }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then(response => {
        cache.put(request, response.clone());
        return response;
    }).catch(() => cached);
    
    return cached || fetchPromise;
}

// Push Notification
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'وەرە بو فێربوونێ!',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge.png',
        vibrate: [200, 100, 200],
        data: { url: data.url || '/' },
        actions: [
            { action: 'open', title: 'ڤەکە' },
            { action: 'close', title: 'داخە' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(
            data.title || 'Zimanê Min',
            options
        )
    );
});

// Notification Click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// Background Sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgress());
    }
});

async function syncProgress() {
    // Sync user progress when back online
    const cache = await caches.open(RUNTIME_CACHE);
    const pendingRequests = await cache.match('/api/sync-queue');
    // Process pending sync requests...
    console.log('Background sync completed');
}

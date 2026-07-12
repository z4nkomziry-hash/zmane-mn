// service-worker.js - بو کارکرنا ئۆفلاین
const CACHE_NAME = 'zimanemin-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/config.js',
    '/scripts/translations.js',
    '/scripts/courses.js',
    '/scripts/auth.js',
    '/scripts/license.js',
    '/scripts/payment.js',
    '/scripts/gamification.js',
    '/scripts/ai-chat.js',
    '/scripts/flashcards.js',
    '/scripts/speech.js',
    '/scripts/lessons.js',
    '/scripts/lesson-page.js',
    '/scripts/reports.js',
    '/scripts/notifications.js',
    '/scripts/profile.js',
    '/scripts/premium.js',
    '/scripts/backup.js',
    '/scripts/leaderboard.js',
    '/scripts/partners.js',
    '/scripts/export.js',
    '/scripts/app.js',
    '/manifest.json'
];

// ئینستاڵکرنا سێرڤیس وۆرکەر
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('✅ کەش ئامادەیە!');
                return cache.addAll(urlsToCache);
            })
    );
});

// وەرگرتنا ژ کەشێ
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(function(response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                });
            })
    );
});

// نویکرنا کەشێ
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName !== CACHE_NAME;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});
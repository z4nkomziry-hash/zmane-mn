// service-worker.js - ئاپدێتکری بۆ ساڵا 2026 (خێراتر و جێگیرتر)
const CACHE_NAME = 'zimanemin-v3';

// تەنێ ئەو فایلێن بەردەست و سەرەکی یێن تە فرێکرین مە هێلاینە دا سێرڤیس وۆرکەر نەوەستیت
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/scripts/config.js',
    '/scripts/auth.js',
    '/scripts/courses.js',
    '/scripts/gamification.js',
    '/scripts/lesson-page.js',
    '/scripts/partners.js',
    '/scripts/backup.js',
    '/scripts/reports.js',
    '/scripts/exports.js',
    '/license.js'
];

// ئینستاڵکرن و پاشکەوتکرنا فایلان
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ کەش ب سەرکەفتیانە هاتە ئامادەکرن');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // ئێکسەر سێرڤیس وۆرکەرا نوو چالاك دکەت
    );
});

// ئەکتیڤکرن و پاقژکرنا کەشێن کۆن
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('🧹 ژێبرنا کەشا کۆن:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// ستراتیجیا Stale-While-Revalidate بۆ خێراییەکا ئیکستریم
self.addEventListener('fetch', event => {
    // تەنێ داخوازیێن لۆکاڵ کەش بکە (نەک هی دەرڤە وەک ئەنیمەیشن یان فۆنتان)
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const cacheCopy = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
                }
                return networkResponse;
            }).catch(() => {
                // ئەگەر ئینتەرنێت نەبوو، کێشە نینە ل سەر کەشێ دێ کار کەت
            });

            return cachedResponse || fetchPromise;
        })
    );
});

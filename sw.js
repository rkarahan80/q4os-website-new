// Service Worker for Q4OS Website
const CACHE_NAME = 'q4os-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/downloads.html',
    '/documents.html',
    '/partner.html',
    '/css/css.css',
    '/css/bootstrap-reboot.min.css',
    '/css/bootstrap-grid.min.css',
    '/js/javascript.js',
    '/js/enhanced-features.js',
    '/img/q4os-logo-vertical.svg',
    '/img/q4os-logo-fullcolor.svg'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event
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

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    // Handle offline form submissions when back online
    const formData = await getStoredFormData();
    if (formData) {
        try {
            await fetch('/contact', {
                method: 'POST',
                body: formData
            });
            await clearStoredFormData();
        } catch (error) {
            console.log('Failed to sync form data:', error);
        }
    }
}

async function getStoredFormData() {
    // Retrieve stored form data from IndexedDB
    return null; // Implement based on your needs
}

async function clearStoredFormData() {
    // Clear stored form data after successful sync
}
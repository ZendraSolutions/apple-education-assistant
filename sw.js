/**
 * @fileoverview Service Worker for PWA functionality
 * @version 1.0.0
 * @description
 * Implements caching strategy for offline-first experience:
 * - Cache First for static assets (HTML, CSS, JS, icons)
 * - Network First for API calls
 * - Offline fallback page
 */

const CACHE_VERSION = 'v1.4.0';
const CACHE_NAME = `jamf-edu-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',

    // CSS
    './css/styles.css',
    './css/tooltips.css',
    './css/toasts.css',
    './css/onboarding.css',
    './css/accessibility.css',

    // Core JavaScript
    './js/main.js',
    './js/app.js',
    './js/splash.js',
    './js/consent.js',
    './js/knowledge-base.js',
    './js/diagnostics.js',
    './js/chatbot.js',

    // Core modules
    './js/core/bootstrap.js',
    './js/core/Container.js',
    './js/core/StateManager.js',
    './js/core/ThemeManager.js',
    './js/core/NavigationManager.js',
    './js/core/SidebarManager.js',
    './js/core/ModalManager.js',

    // Views
    './js/views/BaseView.js',
    './js/views/DashboardView.js',
    './js/views/EcosistemaView.js',
    './js/views/IPadsView.js',
    './js/views/MacsView.js',
    './js/views/AulaView.js',
    './js/views/TeacherView.js',
    './js/views/TroubleshootingView.js',
    './js/views/ChecklistsView.js',
    './js/views/MisDatosView.js',

    // Features
    './js/features/SearchEngine.js',
    './js/features/DiagnosticsManager.js',
    './js/features/ChecklistManager.js',
    './js/features/DataManager.js',
    './js/features/GuideManager.js',

    // UI
    './js/ui/ToastManager.js',
    './js/ui/OnboardingTour.js',
    './js/ui/ConnectionStatus.js',
    './js/ui/TooltipManager.js',
    './js/ui/FocusTrap.js',

    // Chatbot
    './js/chatbot/index.js',
    './js/chatbot/ChatbotCore.js',
    './js/chatbot/ChatUI.js',
    './js/chatbot/GeminiClient.js',
    './js/chatbot/RAGEngine.js',
    './js/chatbot/RateLimiter.js',
    './js/chatbot/EncryptionService.js',
    './js/chatbot/ApiKeyManager.js',
    './js/chatbot/EventBus.js',

    // Patterns
    './js/patterns/index.js',
    './js/patterns/SectionRegistry.js',
    './js/patterns/ValidatorChain.js',
    './js/patterns/RenderStrategy.js',

    // Data
    './js/data/index.js',
    './js/data/KnowledgeMetadata.js',
    './js/data/KnowledgeEcosystem.js',
    './js/data/KnowledgeIPads.js',
    './js/data/KnowledgeMacs.js',
    './js/data/KnowledgeTeacher.js',
    './js/data/KnowledgeChecklists.js',
    './js/data/KnowledgeDiagrams.js',
    './js/data/KnowledgeAula.js',
    './js/data/KnowledgeAulaBasic.js',
    './js/data/KnowledgeAulaAdvanced.js',

    // Icons
    './icons/icon-72.png',
    './icons/icon-96.png',
    './icons/icon-128.png',
    './icons/icon-144.png',
    './icons/icon-152.png',
    './icons/icon-192.png',
    './icons/icon-384.png',
    './icons/icon-512.png',
    './icons/apple-touch-icon.png',

    // Legal pages
    './aviso-legal.html',
    './politica-privacidad.html'
];

// Network-first resources (API calls, external CDNs)
const NETWORK_FIRST_PATTERNS = [
    /^https:\/\/generativelanguage\.googleapis\.com/,
    /^https:\/\/fonts\.googleapis\.com/,
    /^https:\/\/fonts\.gstatic\.com/,
    /^https:\/\/cdn\.jsdelivr\.net/
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker version:', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'no-cache' })));
            })
            .then(() => {
                console.log('[SW] Static assets cached successfully');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker version:', CACHE_VERSION);

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Delete old caches
                            return cacheName.startsWith('jamf-edu-') && cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service worker activated successfully');
                return self.clients.claim(); // Take control immediately
            })
    );
});

/**
 * Fetch event - implement caching strategies
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // Network First for API calls and external resources
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(request.url))) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Cache First for static assets
    event.respondWith(cacheFirst(request));
});

/**
 * Cache First Strategy
 * Try cache first, fallback to network, then cache the response
 */
async function cacheFirst(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url);
            return cachedResponse;
        }

        // Not in cache, fetch from network
        console.log('[SW] Fetching from network:', request.url);
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const clonedResponse = networkResponse.clone();
            cache.put(request, clonedResponse);
        }

        return networkResponse;

    } catch (error) {
        console.error('[SW] Cache first failed:', error);

        // Return offline fallback for navigation requests
        if (request.destination === 'document') {
            const cache = await caches.open(CACHE_NAME);
            return cache.match('./index.html') || new Response('Offline - Please check your connection', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: new Headers({
                    'Content-Type': 'text/plain'
                })
            });
        }

        throw error;
    }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache if offline
 */
async function networkFirst(request) {
    try {
        console.log('[SW] Network first for:', request.url);
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            const clonedResponse = networkResponse.clone();
            cache.put(request, clonedResponse);
        }

        return networkResponse;

    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
    console.log('[SW] Received message:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_VERSION') {
        event.ports[0].postMessage({ version: CACHE_VERSION });
    }
});

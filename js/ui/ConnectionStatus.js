/**
 * @fileoverview Connection status detector for offline-first applications
 * @module ui/ConnectionStatus
 * @version 1.0.0
 * @author Apple Edu Assistant Team
 * @license MIT
 *
 * @description
 * Monitors network connectivity and provides visual feedback to users.
 * Handles:
 * - Online/offline detection
 * - Toast notifications for connection changes
 * - Visual indicators (body class, chatbot badge)
 * - Event emission for other modules
 *
 * Features:
 * - Debounced connection checks to avoid flapping
 * - Graceful handling of slow connections
 * - Integration with ToastManager
 * - EventBus notifications
 *
 * @example
 * const connectionStatus = new ConnectionStatus(eventBus, toastManager);
 * // Automatically monitors and notifies
 */

/**
 * Monitors network connection status and provides visual feedback
 * @class ConnectionStatus
 */
export class ConnectionStatus {
    /**
     * Event bus for cross-module communication
     * @type {import('../utils/EventBus.js').EventBus}
     * @private
     */
    #eventBus = null;

    /**
     * Toast manager for notifications
     * @type {import('./ToastManager.js').ToastManager}
     * @private
     */
    #toastManager = null;

    /**
     * Current connection state
     * @type {boolean}
     * @private
     */
    #isOnline = navigator.onLine;

    /**
     * Chatbot FAB badge element
     * @type {HTMLElement}
     * @private
     */
    #fabBadge = null;

    /**
     * Debounce timer for connection checks
     * @type {number}
     * @private
     */
    #debounceTimer = null;

    /**
     * Last notification toast ID
     * @type {string}
     * @private
     */
    #lastToastId = null;

    /**
     * Creates a new ConnectionStatus instance
     *
     * @param {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
     * @param {import('./ToastManager.js').ToastManager} toastManager - Toast manager instance
     */
    constructor(eventBus, toastManager) {
        this.#eventBus = eventBus;
        this.#toastManager = toastManager;

        this.#init();
    }

    /**
     * Initializes connection monitoring
     * @private
     */
    #init() {
        // Get chatbot badge element
        this.#fabBadge = document.getElementById('fabBadge');

        // Set initial state
        this.#updateUI(this.#isOnline);

        // Listen for connection events
        window.addEventListener('online', () => this.#handleOnline());
        window.addEventListener('offline', () => this.#handleOffline());

        // Optional: Periodic connection check for more reliable detection
        // Some browsers don't fire events reliably
        this.#startPeriodicCheck();
    }

    /**
     * Handles online event
     * @private
     */
    #handleOnline() {
        // Debounce to avoid multiple rapid notifications
        clearTimeout(this.#debounceTimer);

        this.#debounceTimer = setTimeout(() => {
            if (!this.#isOnline) {
                this.#isOnline = true;
                this.#updateUI(true);
                this.#showToast('Conexión restablecida', 'success');
                this.#eventBus.emit('connection:online');
            }
        }, 500);
    }

    /**
     * Handles offline event
     * @private
     */
    #handleOffline() {
        // Debounce to avoid multiple rapid notifications
        clearTimeout(this.#debounceTimer);

        this.#debounceTimer = setTimeout(() => {
            if (this.#isOnline) {
                this.#isOnline = false;
                this.#updateUI(false);
                this.#showToast('Sin conexión. Algunas funciones no estarán disponibles.', 'warning');
                this.#eventBus.emit('connection:offline');
            }
        }, 500);
    }

    /**
     * Updates UI to reflect connection status
     *
     * @param {boolean} isOnline - Whether device is online
     * @private
     */
    #updateUI(isOnline) {
        // Update body class for global CSS styling
        document.body.classList.toggle('offline-mode', !isOnline);

        // Update chatbot badge
        if (this.#fabBadge) {
            if (!isOnline) {
                this.#fabBadge.innerHTML = '<i class="ri-wifi-off-line"></i>';
                this.#fabBadge.setAttribute('title', 'Chatbot IA no disponible sin conexión');
                this.#fabBadge.classList.add('offline-badge');
            } else {
                this.#fabBadge.innerHTML = '';
                this.#fabBadge.removeAttribute('title');
                this.#fabBadge.classList.remove('offline-badge');
            }
        }
    }

    /**
     * Shows a toast notification for connection status
     *
     * @param {string} message - Message to display
     * @param {'info' | 'success' | 'warning' | 'error'} type - Toast type
     * @private
     */
    #showToast(message, type) {
        // Dismiss previous connection toast if still visible
        if (this.#lastToastId) {
            this.#toastManager.dismiss(this.#lastToastId);
        }

        // Show new toast
        this.#lastToastId = this.#toastManager.show(message, type, 5000);
    }

    /**
     * Starts periodic connection check
     * Fallback for browsers that don't reliably fire online/offline events
     *
     * @private
     */
    #startPeriodicCheck() {
        setInterval(() => {
            const currentOnlineStatus = navigator.onLine;

            // Only update if status changed
            if (currentOnlineStatus !== this.#isOnline) {
                if (currentOnlineStatus) {
                    this.#handleOnline();
                } else {
                    this.#handleOffline();
                }
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Gets current connection status
     *
     * @returns {boolean} True if online
     *
     * @example
     * if (connectionStatus.isOnline) {
     *     // Fetch from API
     * } else {
     *     // Use cached data
     * }
     */
    get isOnline() {
        return this.#isOnline;
    }

    /**
     * Manually triggers a connection check
     * Useful after failed network requests
     *
     * @returns {Promise<boolean>} Connection status
     *
     * @example
     * try {
     *     await fetch('/api/data');
     * } catch (error) {
     *     const online = await connectionStatus.check();
     *     if (!online) {
     *         console.log('Network error confirmed');
     *     }
     * }
     */
    async check() {
        // Quick check: navigator.onLine
        if (!navigator.onLine) {
            this.#handleOffline();
            return false;
        }

        // More reliable check: Try to fetch a lightweight resource
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            this.#handleOnline();
            return true;

        } catch (error) {
            this.#handleOffline();
            return false;
        }
    }

    /**
     * Destroys the connection monitor
     */
    destroy() {
        clearTimeout(this.#debounceTimer);
        window.removeEventListener('online', this.#handleOnline);
        window.removeEventListener('offline', this.#handleOffline);
    }
}

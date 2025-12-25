/**
 * @fileoverview Event Bus for decoupled inter-module communication
 * @module utils/EventBus
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

/**
 * @typedef {Function} EventCallback
 * @param {*} data - Event payload data
 */

/**
 * @typedef {Object} Subscription
 * @property {string} event - Event name
 * @property {EventCallback} callback - Callback function
 * @property {Function} unsubscribe - Method to remove subscription
 */

/**
 * Centralized event bus for publish-subscribe pattern communication.
 * Enables loose coupling between application modules.
 *
 * @class EventBus
 * @example
 * const eventBus = new EventBus();
 *
 * // Subscribe to events
 * const subscription = eventBus.on('user:login', (user) => {
 *     console.log('User logged in:', user.name);
 * });
 *
 * // Emit events
 * eventBus.emit('user:login', { name: 'John' });
 *
 * // Unsubscribe when done
 * subscription.unsubscribe();
 */
export class EventBus {
    /**
     * Map of event names to their subscriber callbacks
     * @type {Map<string, Set<EventCallback>>}
     * @private
     */
    #listeners = new Map();

    /**
     * Debug mode flag for logging events
     * @type {boolean}
     * @private
     */
    #debugMode = false;

    /**
     * Creates a new EventBus instance
     * @param {Object} [options={}] - Configuration options
     * @param {boolean} [options.debug=false] - Enable debug logging
     */
    constructor(options = {}) {
        this.#debugMode = options.debug || false;
    }

    /**
     * Subscribes to an event with a callback function
     *
     * @param {string} event - Event name to subscribe to (e.g., 'navigation:changed')
     * @param {EventCallback} callback - Function to call when event is emitted
     * @returns {Subscription} Subscription object with unsubscribe method
     * @throws {TypeError} If event is not a string or callback is not a function
     *
     * @example
     * const sub = eventBus.on('theme:changed', (theme) => {
     *     document.body.classList.toggle('dark', theme === 'dark');
     * });
     *
     * // Later: sub.unsubscribe();
     */
    on(event, callback) {
        if (typeof event !== 'string' || event.trim() === '') {
            throw new TypeError('Event name must be a non-empty string');
        }
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, new Set());
        }

        this.#listeners.get(event).add(callback);

        if (this.#debugMode) {
            console.log(`[EventBus] Subscribed to: ${event}`);
        }

        return {
            event,
            callback,
            unsubscribe: () => this.off(event, callback)
        };
    }

    /**
     * Subscribes to an event for a single emission only
     *
     * @param {string} event - Event name to subscribe to
     * @param {EventCallback} callback - Function to call once when event is emitted
     * @returns {Subscription} Subscription object with unsubscribe method
     *
     * @example
     * eventBus.once('app:ready', () => {
     *     console.log('Application initialized');
     * });
     */
    once(event, callback) {
        const onceWrapper = (data) => {
            this.off(event, onceWrapper);
            callback(data);
        };

        return this.on(event, onceWrapper);
    }

    /**
     * Unsubscribes a callback from an event
     *
     * @param {string} event - Event name to unsubscribe from
     * @param {EventCallback} callback - The specific callback to remove
     * @returns {boolean} True if callback was found and removed
     *
     * @example
     * const handler = (data) => console.log(data);
     * eventBus.on('test', handler);
     * eventBus.off('test', handler); // Returns true
     */
    off(event, callback) {
        const listeners = this.#listeners.get(event);

        if (!listeners) {
            return false;
        }

        const deleted = listeners.delete(callback);

        if (listeners.size === 0) {
            this.#listeners.delete(event);
        }

        if (this.#debugMode && deleted) {
            console.log(`[EventBus] Unsubscribed from: ${event}`);
        }

        return deleted;
    }

    /**
     * Emits an event with optional data payload
     *
     * @param {string} event - Event name to emit
     * @param {*} [data] - Data to pass to subscribers
     * @returns {boolean} True if event had subscribers
     *
     * @example
     * eventBus.emit('navigation:changed', {
     *     section: 'dashboard',
     *     previousSection: 'settings'
     * });
     */
    emit(event, data) {
        if (this.#debugMode) {
            console.log(`[EventBus] Emit: ${event}`, data);
        }

        const listeners = this.#listeners.get(event);

        if (!listeners || listeners.size === 0) {
            return false;
        }

        listeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[EventBus] Error in listener for "${event}":`, error);
            }
        });

        return true;
    }

    /**
     * Removes all subscribers for a specific event or all events
     *
     * @param {string} [event] - Optional event name. If omitted, clears all events
     * @returns {void}
     *
     * @example
     * eventBus.clear('navigation:changed'); // Clear specific event
     * eventBus.clear(); // Clear all events
     */
    clear(event) {
        if (event) {
            this.#listeners.delete(event);
            if (this.#debugMode) {
                console.log(`[EventBus] Cleared: ${event}`);
            }
        } else {
            this.#listeners.clear();
            if (this.#debugMode) {
                console.log('[EventBus] Cleared all events');
            }
        }
    }

    /**
     * Gets the number of subscribers for an event
     *
     * @param {string} event - Event name to check
     * @returns {number} Number of subscribers
     *
     * @example
     * const count = eventBus.listenerCount('theme:changed');
     * console.log(`${count} listeners for theme:changed`);
     */
    listenerCount(event) {
        const listeners = this.#listeners.get(event);
        return listeners ? listeners.size : 0;
    }

    /**
     * Gets all registered event names
     *
     * @returns {string[]} Array of event names
     *
     * @example
     * const events = eventBus.eventNames();
     * console.log('Registered events:', events);
     */
    eventNames() {
        return Array.from(this.#listeners.keys());
    }
}

/**
 * Standard event names used throughout the application
 * @constant {Object}
 */
export const AppEvents = {
    // Navigation events
    NAVIGATION_CHANGED: 'navigation:changed',
    NAVIGATION_BEFORE_CHANGE: 'navigation:beforeChange',

    // Theme events
    THEME_CHANGED: 'theme:changed',
    THEME_LOADED: 'theme:loaded',

    // Modal events
    MODAL_OPENED: 'modal:opened',
    MODAL_CLOSED: 'modal:closed',

    // Search events
    SEARCH_QUERY: 'search:query',
    SEARCH_RESULTS: 'search:results',
    SEARCH_CLEARED: 'search:cleared',

    // Diagnostic events
    DIAGNOSTIC_STARTED: 'diagnostic:started',
    DIAGNOSTIC_STEP_CHANGED: 'diagnostic:stepChanged',
    DIAGNOSTIC_COMPLETED: 'diagnostic:completed',

    // Checklist events
    CHECKLIST_OPENED: 'checklist:opened',
    CHECKLIST_ITEM_TOGGLED: 'checklist:itemToggled',
    CHECKLIST_COMPLETED: 'checklist:completed',

    // Data events
    DATA_EXPORTED: 'data:exported',
    DATA_DELETED: 'data:deleted',

    // Application lifecycle
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error',

    // Connection events
    CONNECTION_ONLINE: 'connection:online',
    CONNECTION_OFFLINE: 'connection:offline'
};

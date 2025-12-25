/**
 * @fileoverview Event Bus - Pub/Sub communication between modules
 * @module chatbot/EventBus
 * @version 2.0.0
 * @license MIT
 *
 * Provides decoupled communication between chatbot modules
 * using the publish-subscribe pattern.
 */

/**
 * @typedef {Function} EventHandler
 * @param {...*} args - Event arguments
 */

/**
 * @typedef {Object} Subscription
 * @property {Function} unsubscribe - Removes the subscription
 */

/**
 * @class EventBus
 * @description Publish-subscribe event bus for inter-module communication
 *
 * @example
 * const bus = new EventBus();
 *
 * // Subscribe to events
 * const sub = bus.on('message:sent', (msg) => console.log(msg));
 *
 * // Publish events
 * bus.emit('message:sent', 'Hello!');
 *
 * // Unsubscribe
 * sub.unsubscribe();
 */
export class EventBus {
    /** @private @type {Map<string, Set<EventHandler>>} */
    #listeners = new Map();

    /** @private @type {Map<string, Set<EventHandler>>} */
    #onceListeners = new Map();

    /**
     * Creates a new EventBus instance
     */
    constructor() {
        this.#listeners = new Map();
        this.#onceListeners = new Map();
    }

    /**
     * Subscribes to an event
     *
     * @param {string} event - Event name
     * @param {EventHandler} handler - Event handler function
     * @returns {Subscription} Subscription object with unsubscribe method
     *
     * @example
     * const sub = bus.on('api:error', (error) => {
     *   console.error('API Error:', error);
     * });
     *
     * // Later...
     * sub.unsubscribe();
     */
    on(event, handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }

        if (!this.#listeners.has(event)) {
            this.#listeners.set(event, new Set());
        }

        this.#listeners.get(event).add(handler);

        // Return subscription object for easy unsubscribe
        return {
            unsubscribe: () => this.off(event, handler)
        };
    }

    /**
     * Subscribes to an event for a single emission
     *
     * @param {string} event - Event name
     * @param {EventHandler} handler - Event handler function
     * @returns {Subscription} Subscription object with unsubscribe method
     *
     * @example
     * bus.once('init:complete', () => {
     *   console.log('Initialization done');
     * });
     */
    once(event, handler) {
        if (typeof handler !== 'function') {
            throw new TypeError('Handler must be a function');
        }

        if (!this.#onceListeners.has(event)) {
            this.#onceListeners.set(event, new Set());
        }

        this.#onceListeners.get(event).add(handler);

        return {
            unsubscribe: () => {
                const handlers = this.#onceListeners.get(event);
                if (handlers) {
                    handlers.delete(handler);
                }
            }
        };
    }

    /**
     * Unsubscribes from an event
     *
     * @param {string} event - Event name
     * @param {EventHandler} handler - Handler to remove
     * @returns {boolean} True if handler was found and removed
     *
     * @example
     * const handler = (msg) => console.log(msg);
     * bus.on('message', handler);
     * bus.off('message', handler);
     */
    off(event, handler) {
        const handlers = this.#listeners.get(event);
        if (handlers) {
            return handlers.delete(handler);
        }
        return false;
    }

    /**
     * Emits an event to all subscribers
     *
     * @param {string} event - Event name
     * @param {...*} args - Arguments to pass to handlers
     * @returns {boolean} True if any handlers were called
     *
     * @example
     * bus.emit('message:received', { text: 'Hello', from: 'bot' });
     */
    emit(event, ...args) {
        let handled = false;

        // Call regular listeners
        const handlers = this.#listeners.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(...args);
                    handled = true;
                } catch (error) {
                    console.error(`Error in event handler for '${event}':`, error);
                }
            });
        }

        // Call once listeners and remove them
        const onceHandlers = this.#onceListeners.get(event);
        if (onceHandlers) {
            onceHandlers.forEach(handler => {
                try {
                    handler(...args);
                    handled = true;
                } catch (error) {
                    console.error(`Error in once handler for '${event}':`, error);
                }
            });
            this.#onceListeners.delete(event);
        }

        return handled;
    }

    /**
     * Removes all listeners for an event (or all events)
     *
     * @param {string} [event] - Event name (optional, clears all if omitted)
     * @returns {void}
     *
     * @example
     * bus.clear('message'); // Clear message listeners
     * bus.clear();          // Clear all listeners
     */
    clear(event) {
        if (event) {
            this.#listeners.delete(event);
            this.#onceListeners.delete(event);
        } else {
            this.#listeners.clear();
            this.#onceListeners.clear();
        }
    }

    /**
     * Gets the count of listeners for an event
     *
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     *
     * @example
     * const count = bus.listenerCount('message');
     */
    listenerCount(event) {
        const regular = this.#listeners.get(event)?.size || 0;
        const once = this.#onceListeners.get(event)?.size || 0;
        return regular + once;
    }

    /**
     * Gets all registered event names
     *
     * @returns {string[]} Array of event names
     *
     * @example
     * const events = bus.eventNames();
     * // ['message:sent', 'api:error', ...]
     */
    eventNames() {
        const names = new Set([
            ...this.#listeners.keys(),
            ...this.#onceListeners.keys()
        ]);
        return [...names];
    }
}

/**
 * Standard chatbot events
 * @readonly
 * @enum {string}
 */
export const ChatEvents = {
    // Lifecycle
    INIT: 'chatbot:init',
    READY: 'chatbot:ready',
    DESTROY: 'chatbot:destroy',

    // Chat actions
    MESSAGE_SEND: 'message:send',
    MESSAGE_RECEIVED: 'message:received',
    MESSAGE_ERROR: 'message:error',

    // API
    API_KEY_CHANGED: 'api:key:changed',
    API_KEY_CLEARED: 'api:key:cleared',
    API_ERROR: 'api:error',

    // UI
    CHAT_OPENED: 'ui:chat:opened',
    CHAT_CLOSED: 'ui:chat:closed',
    MODAL_OPENED: 'ui:modal:opened',
    MODAL_CLOSED: 'ui:modal:closed',

    // Rate limiting
    RATE_LIMIT_WARNING: 'rate:warning',
    RATE_LIMIT_EXCEEDED: 'rate:exceeded'
};

export default EventBus;

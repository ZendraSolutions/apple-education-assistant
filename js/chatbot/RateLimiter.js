/**
 * @fileoverview Rate Limiter - Protection against API abuse
 * @module chatbot/RateLimiter
 * @version 2.0.0
 * @license MIT
 *
 * Limits the number of API calls within a time window.
 * Synchronized across browser tabs using BroadcastChannel.
 *
 * @security This module protects API quotas and prevents abuse
 */

/**
 * @typedef {Object} RateLimitResult
 * @property {boolean} allowed - Whether the call is allowed
 * @property {number} [waitTime] - Seconds to wait if not allowed
 */

/**
 * @class RateLimiter
 * @description Rate limiter with cross-tab synchronization via BroadcastChannel
 *
 * @example
 * const limiter = new RateLimiter(10, 60000); // 10 calls per minute
 * const result = limiter.canMakeCall();
 * if (result.allowed) {
 *   // Make API call
 * } else {
 *   console.log(`Wait ${result.waitTime} seconds`);
 * }
 */
export class RateLimiter {
    /** @private @type {number} */
    #maxCalls;

    /** @private @type {number} */
    #windowMs;

    /** @private @type {number[]} */
    #calls;

    /** @private @type {string} */
    #storageKey;

    /** @private @type {BroadcastChannel|null} */
    #channel;

    /**
     * Creates a new RateLimiter instance
     *
     * @param {number} [maxCalls=10] - Maximum calls allowed in the time window
     * @param {number} [windowMs=60000] - Time window in milliseconds
     * @throws {TypeError} If maxCalls or windowMs are not positive numbers
     */
    constructor(maxCalls = 10, windowMs = 60000) {
        if (typeof maxCalls !== 'number' || maxCalls <= 0) {
            throw new TypeError('maxCalls must be a positive number');
        }
        if (typeof windowMs !== 'number' || windowMs <= 0) {
            throw new TypeError('windowMs must be a positive number');
        }

        this.#maxCalls = maxCalls;
        this.#windowMs = windowMs;
        this.#calls = [];
        this.#storageKey = 'jamf-rate-limiter-calls';
        this.#channel = null;

        this.#loadFromStorage();
        this.#initBroadcastChannel();
    }

    /**
     * Maximum calls allowed in the time window
     * @type {number}
     * @readonly
     */
    get maxCalls() {
        return this.#maxCalls;
    }

    /**
     * Time window in milliseconds
     * @type {number}
     * @readonly
     */
    get windowMs() {
        return this.#windowMs;
    }

    /**
     * Initializes cross-tab synchronization via BroadcastChannel
     * @private
     */
    #initBroadcastChannel() {
        if (typeof BroadcastChannel !== 'undefined') {
            try {
                this.#channel = new BroadcastChannel('jamf-rate-limiter');
                this.#channel.onmessage = (event) => {
                    if (event.data?.type === 'call') {
                        this.#loadFromStorage();
                    }
                };
            } catch (e) {
                // BroadcastChannel not supported in this context
                this.#channel = null;
            }
        }
    }

    /**
     * Loads call timestamps from localStorage
     * @private
     */
    #loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.#storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                const now = Date.now();
                this.#calls = parsed.filter(time => now - time < this.#windowMs);
            }
        } catch (e) {
            this.#calls = [];
        }
    }

    /**
     * Saves call timestamps to localStorage
     * @private
     */
    #saveToStorage() {
        try {
            localStorage.setItem(this.#storageKey, JSON.stringify(this.#calls));
        } catch (e) {
            // Storage might be full or disabled
        }
    }

    /**
     * Notifies other tabs about a new call
     * @private
     */
    #notifyOtherTabs() {
        if (this.#channel) {
            try {
                this.#channel.postMessage({ type: 'call', timestamp: Date.now() });
            } catch (e) {
                // Channel might be closed
            }
        }
    }

    /**
     * Checks if a new API call is allowed and registers it if so
     *
     * @returns {RateLimitResult} Result indicating if call is allowed
     *
     * @example
     * const result = limiter.canMakeCall();
     * if (!result.allowed) {
     *   showMessage(`Please wait ${result.waitTime} seconds`);
     * }
     */
    canMakeCall() {
        const now = Date.now();

        // Reload from storage to get updates from other tabs
        this.#loadFromStorage();

        // Clean up calls outside the time window
        this.#calls = this.#calls.filter(time => now - time < this.#windowMs);

        if (this.#calls.length >= this.#maxCalls) {
            // Calculate wait time until the oldest call expires
            const oldestCall = Math.min(...this.#calls);
            const waitTime = Math.ceil((this.#windowMs - (now - oldestCall)) / 1000);
            return { allowed: false, waitTime };
        }

        // Register this call
        this.#calls.push(now);
        this.#saveToStorage();
        this.#notifyOtherTabs();

        return { allowed: true };
    }

    /**
     * Gets the number of remaining calls in the current window
     *
     * @returns {number} Number of calls remaining
     *
     * @example
     * const remaining = limiter.getRemainingCalls();
     * if (remaining <= 3) {
     *   showWarning(`Only ${remaining} calls left`);
     * }
     */
    getRemainingCalls() {
        const now = Date.now();
        this.#loadFromStorage();
        this.#calls = this.#calls.filter(time => now - time < this.#windowMs);
        return Math.max(0, this.#maxCalls - this.#calls.length);
    }

    /**
     * Resets the rate limiter, clearing all recorded calls
     *
     * @returns {void}
     *
     * @example
     * // Reset after user acknowledges rate limit warning
     * limiter.reset();
     */
    reset() {
        this.#calls = [];
        this.#saveToStorage();
    }

    /**
     * Cleans up resources (BroadcastChannel)
     * Call this when the rate limiter is no longer needed
     *
     * @returns {void}
     */
    destroy() {
        if (this.#channel) {
            this.#channel.close();
            this.#channel = null;
        }
    }
}

export default RateLimiter;

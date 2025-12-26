/**
 * @fileoverview Rate Limiter - Protection against API abuse
 * @module chatbot/RateLimiter
 * @version 3.0.0
 * @license MIT
 *
 * Limits the number of API calls within a time window.
 * Synchronized across browser tabs using BroadcastChannel.
 *
 * @security This module protects API quotas and prevents abuse
 * @security v3.0.0: Added HMAC checksum validation to detect localStorage manipulation
 * @security v3.0.0: Device fingerprinting for unique checksums per device
 * @security v3.0.0: 24-hour penalty for detected manipulation attempts
 */

/**
 * @typedef {Object} RateLimitResult
 * @property {boolean} allowed - Whether the call is allowed
 * @property {number} [waitTime] - Seconds to wait if not allowed
 * @property {boolean} [penalized] - Whether user is under penalty for manipulation
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

    /** @private @type {string} */
    #checksumKey;

    /** @private @type {string} */
    #penaltyKey;

    /** @private @type {string|null} */
    #deviceFingerprint;

    /** @private @type {boolean} */
    #integrityVerified;

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
        this.#checksumKey = 'jamf-rate-limiter-checksum';
        this.#penaltyKey = 'jamf-rate-limiter-penalty';
        this.#deviceFingerprint = null;
        this.#integrityVerified = false;
        this.#channel = null;

        // Initialize async security features
        this.#initSecurity();
        this.#initBroadcastChannel();
    }

    /**
     * Initializes security features asynchronously
     * @private
     * @returns {Promise<void>}
     */
    async #initSecurity() {
        try {
            this.#deviceFingerprint = this.#getDeviceFingerprint();
            await this.#loadFromStorageSecure();
        } catch (e) {
            // Fallback to basic loading if security init fails
            this.#loadFromStorageFallback();
        }
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
     * Generates a device fingerprint for HMAC key derivation
     * This creates a semi-unique identifier based on browser characteristics
     *
     * @private
     * @returns {string} Device fingerprint string
     */
    #getDeviceFingerprint() {
        const components = [
            navigator.userAgent || '',
            navigator.language || '',
            `${screen.width}x${screen.height}`,
            screen.colorDepth?.toString() || '',
            new Date().getTimezoneOffset().toString(),
            navigator.hardwareConcurrency?.toString() || '',
            navigator.platform || ''
        ];
        return components.join('|');
    }

    /**
     * Generates HMAC-SHA256 checksum using Web Crypto API
     *
     * @private
     * @param {string} data - Data to checksum
     * @returns {Promise<string>} Hex-encoded HMAC checksum
     */
    async #generateChecksum(data) {
        try {
            const encoder = new TextEncoder();
            const secret = this.#deviceFingerprint || this.#getDeviceFingerprint();

            const key = await crypto.subtle.importKey(
                'raw',
                encoder.encode(secret),
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            );

            const signature = await crypto.subtle.sign(
                'HMAC',
                key,
                encoder.encode(data)
            );

            return Array.from(new Uint8Array(signature))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        } catch (e) {
            // Fallback for environments without Web Crypto API
            return this.#generateFallbackChecksum(data);
        }
    }

    /**
     * Fallback checksum for environments without Web Crypto API
     * Uses a simple hash algorithm (not cryptographically secure but better than nothing)
     *
     * @private
     * @param {string} data - Data to checksum
     * @returns {string} Simple hash checksum
     */
    #generateFallbackChecksum(data) {
        const secret = this.#deviceFingerprint || '';
        const combined = data + secret;
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        // Add timestamp component for additional entropy
        const timestamp = Math.floor(Date.now() / (24 * 60 * 60 * 1000)); // Daily rotation
        return `fb_${Math.abs(hash).toString(16)}_${timestamp.toString(16)}`;
    }

    /**
     * Checks if user is currently under penalty for manipulation
     *
     * @private
     * @returns {boolean} True if under penalty
     */
    #isUnderPenalty() {
        try {
            const penaltyUntil = localStorage.getItem(this.#penaltyKey);
            if (penaltyUntil) {
                const penaltyTime = parseInt(penaltyUntil, 10);
                if (Date.now() < penaltyTime) {
                    return true;
                }
                // Penalty expired, clean up
                localStorage.removeItem(this.#penaltyKey);
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    /**
     * Gets remaining penalty time in seconds
     *
     * @private
     * @returns {number} Seconds remaining in penalty, or 0 if not penalized
     */
    #getPenaltyTimeRemaining() {
        try {
            const penaltyUntil = localStorage.getItem(this.#penaltyKey);
            if (penaltyUntil) {
                const remaining = parseInt(penaltyUntil, 10) - Date.now();
                return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    /**
     * Applies a 24-hour penalty for detected manipulation
     *
     * @private
     * @returns {void}
     */
    #applyPenalty() {
        try {
            const penaltyDuration = 24 * 60 * 60 * 1000; // 24 hours
            const penaltyUntil = Date.now() + penaltyDuration;
            localStorage.setItem(this.#penaltyKey, penaltyUntil.toString());

            // Log security event (could be enhanced to report to server)
            console.warn(
                '[RateLimiter Security] Manipulation detected. ' +
                'Access restricted for 24 hours. ' +
                'Timestamp:', new Date().toISOString()
            );
        } catch (e) {
            // Storage might be disabled
        }
    }

    /**
     * Securely loads call timestamps from localStorage with integrity verification
     *
     * @private
     * @async
     * @returns {Promise<void>}
     */
    async #loadFromStorageSecure() {
        try {
            const stored = localStorage.getItem(this.#storageKey);
            const storedChecksum = localStorage.getItem(this.#checksumKey);

            // Case 1: No data exists - fresh start
            if (!stored && !storedChecksum) {
                this.#calls = [];
                this.#integrityVerified = true;
                return;
            }

            // Case 2: Data exists but checksum is missing - potential manipulation
            if (stored && !storedChecksum) {
                // First-time migration: generate checksum for existing data
                // Only if data looks valid (array of timestamps)
                try {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.every(t => typeof t === 'number')) {
                        // Migrate: generate checksum for existing valid data
                        const checksum = await this.#generateChecksum(stored);
                        localStorage.setItem(this.#checksumKey, checksum);
                        const now = Date.now();
                        this.#calls = parsed.filter(time => now - time < this.#windowMs);
                        this.#integrityVerified = true;
                        return;
                    }
                } catch (parseError) {
                    // Invalid JSON - treat as manipulation
                }

                // Data is corrupted or manipulated
                this.#applyPenalty();
                this.#calls = [];
                this.#integrityVerified = false;
                return;
            }

            // Case 3: Checksum exists but data is missing - manipulation detected
            if (!stored && storedChecksum) {
                this.#applyPenalty();
                this.#calls = [];
                this.#integrityVerified = false;
                return;
            }

            // Case 4: Both exist - verify integrity
            const expectedChecksum = await this.#generateChecksum(stored);

            if (storedChecksum !== expectedChecksum) {
                // Checksum mismatch - manipulation detected!
                this.#applyPenalty();
                this.#calls = [];
                this.#integrityVerified = false;
                return;
            }

            // Integrity verified - load data
            const parsed = JSON.parse(stored);
            const now = Date.now();
            this.#calls = parsed.filter(time => now - time < this.#windowMs);
            this.#integrityVerified = true;

        } catch (e) {
            // Any error during secure load - apply penalty to be safe
            this.#applyPenalty();
            this.#calls = [];
            this.#integrityVerified = false;
        }
    }

    /**
     * Fallback loader for environments where async/crypto fails
     *
     * @private
     * @returns {void}
     */
    #loadFromStorageFallback() {
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
     * Loads call timestamps from localStorage (legacy method, now calls secure version)
     * @private
     */
    #loadFromStorage() {
        // Synchronous wrapper that initiates async secure load
        // For backward compatibility, also do a basic load
        this.#loadFromStorageFallback();

        // Trigger async secure verification in background
        this.#loadFromStorageSecure().catch(() => {
            // Secure load failed, fallback already loaded
        });
    }

    /**
     * Saves call timestamps to localStorage with integrity checksum
     * @private
     * @async
     * @returns {Promise<void>}
     */
    async #saveToStorageSecure() {
        try {
            const data = JSON.stringify(this.#calls);
            const checksum = await this.#generateChecksum(data);

            localStorage.setItem(this.#storageKey, data);
            localStorage.setItem(this.#checksumKey, checksum);
        } catch (e) {
            // Storage might be full or disabled
        }
    }

    /**
     * Saves call timestamps to localStorage (legacy sync wrapper)
     * @private
     */
    #saveToStorage() {
        try {
            // Immediate sync save for compatibility
            localStorage.setItem(this.#storageKey, JSON.stringify(this.#calls));

            // Async secure save with checksum
            this.#saveToStorageSecure().catch(() => {
                // Secure save failed, basic save already done
            });
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
     *   if (result.penalized) {
     *     showMessage(`Access restricted due to manipulation. Wait ${result.waitTime} seconds`);
     *   } else {
     *     showMessage(`Rate limit reached. Wait ${result.waitTime} seconds`);
     *   }
     * }
     */
    canMakeCall() {
        // SECURITY CHECK: Verify user is not under penalty
        if (this.#isUnderPenalty()) {
            const waitTime = this.#getPenaltyTimeRemaining();
            return {
                allowed: false,
                waitTime,
                penalized: true
            };
        }

        const now = Date.now();

        // Reload from storage to get updates from other tabs
        this.#loadFromStorage();

        // Clean up calls outside the time window
        this.#calls = this.#calls.filter(time => now - time < this.#windowMs);

        if (this.#calls.length >= this.#maxCalls) {
            // Calculate wait time until the oldest call expires
            const oldestCall = Math.min(...this.#calls);
            const waitTime = Math.ceil((this.#windowMs - (now - oldestCall)) / 1000);
            return { allowed: false, waitTime, penalized: false };
        }

        // Register this call
        this.#calls.push(now);
        this.#saveToStorage();
        this.#notifyOtherTabs();

        return { allowed: true, penalized: false };
    }

    /**
     * Async version of canMakeCall with full integrity verification
     * Use this when you need guaranteed security checks
     *
     * @async
     * @returns {Promise<RateLimitResult>} Result indicating if call is allowed
     *
     * @example
     * const result = await limiter.canMakeCallSecure();
     * if (!result.allowed) {
     *   handleRateLimitError(result);
     * }
     */
    async canMakeCallSecure() {
        // SECURITY CHECK: Verify user is not under penalty
        if (this.#isUnderPenalty()) {
            const waitTime = this.#getPenaltyTimeRemaining();
            return {
                allowed: false,
                waitTime,
                penalized: true
            };
        }

        // Perform full secure verification
        await this.#loadFromStorageSecure();

        // Check again after secure load (might have detected manipulation)
        if (this.#isUnderPenalty()) {
            const waitTime = this.#getPenaltyTimeRemaining();
            return {
                allowed: false,
                waitTime,
                penalized: true
            };
        }

        const now = Date.now();

        // Clean up calls outside the time window
        this.#calls = this.#calls.filter(time => now - time < this.#windowMs);

        if (this.#calls.length >= this.#maxCalls) {
            // Calculate wait time until the oldest call expires
            const oldestCall = Math.min(...this.#calls);
            const waitTime = Math.ceil((this.#windowMs - (now - oldestCall)) / 1000);
            return { allowed: false, waitTime, penalized: false };
        }

        // Register this call
        this.#calls.push(now);
        await this.#saveToStorageSecure();
        this.#notifyOtherTabs();

        return { allowed: true, penalized: false };
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
     * Note: This does NOT clear penalties - those must expire naturally
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
     * Checks if the user is currently under penalty for manipulation
     *
     * @returns {boolean} True if under penalty
     *
     * @example
     * if (limiter.isPenalized()) {
     *   showSecurityWarning();
     * }
     */
    isPenalized() {
        return this.#isUnderPenalty();
    }

    /**
     * Gets the remaining penalty time in seconds
     *
     * @returns {number} Seconds remaining, or 0 if not penalized
     *
     * @example
     * const remaining = limiter.getPenaltyRemaining();
     * if (remaining > 0) {
     *   showMessage(`Access restricted for ${Math.ceil(remaining / 3600)} hours`);
     * }
     */
    getPenaltyRemaining() {
        return this.#getPenaltyTimeRemaining();
    }

    /**
     * Gets security status information
     *
     * @returns {Object} Security status object
     * @property {boolean} integrityVerified - Whether last integrity check passed
     * @property {boolean} penalized - Whether user is under penalty
     * @property {number} penaltyRemaining - Seconds remaining in penalty
     *
     * @example
     * const status = limiter.getSecurityStatus();
     * console.log('Integrity:', status.integrityVerified);
     */
    getSecurityStatus() {
        return {
            integrityVerified: this.#integrityVerified,
            penalized: this.#isUnderPenalty(),
            penaltyRemaining: this.#getPenaltyTimeRemaining()
        };
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

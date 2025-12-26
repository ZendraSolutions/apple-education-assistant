/**
 * @fileoverview ErrorMonitor - Enterprise Error Monitoring Service with Sentry Integration
 * @module core/ErrorMonitor
 * @version 1.0.0
 * @license MIT
 *
 * @description
 * Provides comprehensive error monitoring and tracking for production environments.
 * Supports Sentry integration when DSN is configured, falls back to local logging otherwise.
 *
 * Features:
 * - Global error and unhandled rejection capture
 * - Sentry integration with privacy-safe configuration
 * - Local error logging when Sentry is not available
 * - Breadcrumb tracking for debugging context
 * - Health check endpoint for monitoring
 * - PII filtering to comply with privacy regulations
 *
 * @example
 * // Initialize without Sentry (local mode)
 * ErrorMonitor.initialize();
 *
 * // Initialize with Sentry
 * ErrorMonitor.initialize({
 *   dsn: 'https://xxx@sentry.io/project',
 *   release: 'apple-edu-assistant@1.0.0'
 * });
 *
 * // Capture an exception
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   ErrorMonitor.captureException(error, { component: 'MyComponent' });
 * }
 */

/**
 * @typedef {Object} ErrorMonitorConfig
 * @property {string} [dsn=''] - Sentry DSN for error reporting
 * @property {string} [environment='production'] - Environment name
 * @property {string} [release='1.0.0'] - Application release version
 * @property {number} [sampleRate=1.0] - Error sample rate (0-1)
 * @property {number} [tracesSampleRate=0.1] - Performance trace sample rate
 */

/**
 * @typedef {Object} LocalError
 * @property {string} type - Error type ('error', 'unhandledrejection', 'exception')
 * @property {string} message - Error message
 * @property {string} [stack] - Stack trace if available
 * @property {Object} [context] - Additional context
 * @property {string} timestamp - ISO timestamp
 */

/**
 * @typedef {Object} HealthCheckResult
 * @property {boolean} initialized - Whether ErrorMonitor is initialized
 * @property {boolean} hasSentry - Whether Sentry SDK is available
 * @property {boolean} hasDSN - Whether Sentry DSN is configured
 * @property {string} environment - Current environment
 * @property {number} localErrorCount - Number of locally captured errors
 */

/**
 * @class ErrorMonitor
 * @description Enterprise error monitoring service with Sentry integration
 *
 * This service provides:
 * - Global error capturing
 * - Sentry integration for production monitoring
 * - Local fallback logging for development
 * - Privacy-safe error reporting (no PII)
 * - Breadcrumb tracking for debugging
 */
export class ErrorMonitor {
    /** @private @type {ErrorMonitor|null} */
    static #instance = null;

    /** @private @type {boolean} */
    static #isInitialized = false;

    /** @private @type {ErrorMonitorConfig} */
    static #config = {
        dsn: '',
        environment: 'production',
        release: '1.0.0',
        sampleRate: 1.0,
        tracesSampleRate: 0.1
    };

    /** @private @type {LocalError[]} */
    static #localErrors = [];

    /** @private @type {number} */
    static #maxLocalErrors = 100;

    /** @private @type {Function|null} */
    static #originalOnError = null;

    /** @private @type {Function|null} */
    static #originalOnUnhandledRejection = null;

    /**
     * Private constructor - use static methods
     * @private
     */
    constructor() {
        throw new Error('ErrorMonitor is a static class. Use ErrorMonitor.initialize() instead.');
    }

    /**
     * Initializes the ErrorMonitor service
     *
     * @param {ErrorMonitorConfig} [options={}] - Configuration options
     * @returns {void}
     *
     * @example
     * // Local mode (no Sentry)
     * ErrorMonitor.initialize();
     *
     * // With Sentry
     * ErrorMonitor.initialize({
     *   dsn: 'https://xxx@sentry.io/project',
     *   release: 'apple-edu-assistant@1.0.0'
     * });
     */
    static initialize(options = {}) {
        if (this.#isInitialized) {
            console.info('[ErrorMonitor] Already initialized, skipping...');
            return;
        }

        // Detect environment
        const isLocalhost = typeof window !== 'undefined' && (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:'
        );

        // Merge configuration
        this.#config = {
            ...this.#config,
            ...options,
            environment: options.environment || (isLocalhost ? 'development' : 'production')
        };

        // If no DSN, run in local mode
        if (!this.#config.dsn) {
            console.info('[ErrorMonitor] Running in local mode (no DSN configured)');
            this.#setupLocalLogging();
            this.#isInitialized = true;
            return;
        }

        // Initialize Sentry if available
        if (typeof Sentry !== 'undefined') {
            try {
                Sentry.init({
                    dsn: this.#config.dsn,
                    environment: this.#config.environment,
                    release: this.#config.release,
                    sampleRate: this.#config.sampleRate,
                    tracesSampleRate: this.#config.tracesSampleRate,

                    // Filter out noisy errors from third parties
                    ignoreErrors: [
                        'ResizeObserver loop limit exceeded',
                        'ResizeObserver loop completed with undelivered notifications',
                        'Non-Error promise rejection captured',
                        /^Script error\.?$/,
                        /^Network request failed$/,
                        /Loading chunk \d+ failed/,
                        'ChunkLoadError'
                    ],

                    // Deny URLs from browser extensions and third parties
                    denyUrls: [
                        /extensions\//i,
                        /^chrome:\/\//i,
                        /^chrome-extension:\/\//i,
                        /^moz-extension:\/\//i
                    ],

                    // Privacy-safe: Remove PII before sending
                    beforeSend(event) {
                        // Remove user PII
                        if (event.user) {
                            delete event.user.email;
                            delete event.user.ip_address;
                            delete event.user.username;
                        }

                        // Scrub sensitive data from breadcrumbs
                        if (event.breadcrumbs) {
                            event.breadcrumbs = event.breadcrumbs.map(breadcrumb => {
                                if (breadcrumb.data) {
                                    // Remove potential API keys from URLs
                                    if (breadcrumb.data.url) {
                                        breadcrumb.data.url = breadcrumb.data.url
                                            .replace(/key=[^&]+/gi, 'key=[REDACTED]')
                                            .replace(/api_key=[^&]+/gi, 'api_key=[REDACTED]')
                                            .replace(/apikey=[^&]+/gi, 'apikey=[REDACTED]');
                                    }
                                }
                                return breadcrumb;
                            });
                        }

                        return event;
                    }
                });

                console.info(`[ErrorMonitor] Sentry initialized (${this.#config.environment})`);
            } catch (error) {
                console.error('[ErrorMonitor] Failed to initialize Sentry:', error);
                this.#setupLocalLogging();
            }
        } else {
            console.warn('[ErrorMonitor] Sentry SDK not loaded, using local logging');
            this.#setupLocalLogging();
        }

        // Setup global handlers as fallback
        this.#setupGlobalHandlers();
        this.#isInitialized = true;

        console.info('[ErrorMonitor] Service initialized successfully');
    }

    /**
     * Sets up local error logging when Sentry is not available
     * @private
     */
    static #setupLocalLogging() {
        // Save original handlers
        this.#originalOnError = window.onerror;
        this.#originalOnUnhandledRejection = window.onunhandledrejection;

        // Global error handler
        window.onerror = (message, source, lineno, colno, error) => {
            this.#addLocalError({
                type: 'error',
                message: String(message),
                stack: error?.stack || `at ${source}:${lineno}:${colno}`,
                timestamp: new Date().toISOString()
            });

            console.error('[ErrorMonitor] Global error:', message, {
                source,
                lineno,
                colno
            });

            // Call original handler if exists
            if (this.#originalOnError) {
                return this.#originalOnError(message, source, lineno, colno, error);
            }
            return false;
        };

        // Unhandled promise rejection handler
        window.onunhandledrejection = (event) => {
            const reason = event.reason;
            this.#addLocalError({
                type: 'unhandledrejection',
                message: reason?.message || String(reason),
                stack: reason?.stack,
                timestamp: new Date().toISOString()
            });

            console.error('[ErrorMonitor] Unhandled rejection:', reason);

            // Call original handler if exists
            if (this.#originalOnUnhandledRejection) {
                return this.#originalOnUnhandledRejection(event);
            }
        };
    }

    /**
     * Sets up global error handlers as fallback
     * @private
     */
    static #setupGlobalHandlers() {
        // Only setup if not already in local logging mode
        if (this.#originalOnError !== null) {
            return;
        }

        const originalOnError = window.onerror;
        window.onerror = (message, source, lineno, colno, error) => {
            this.captureException(error || new Error(String(message)), {
                source,
                lineno,
                colno,
                handler: 'global'
            });

            if (originalOnError) {
                return originalOnError(message, source, lineno, colno, error);
            }
            return false;
        };

        const originalOnUnhandledRejection = window.onunhandledrejection;
        window.onunhandledrejection = (event) => {
            this.captureException(event.reason, {
                handler: 'unhandledrejection'
            });

            if (originalOnUnhandledRejection) {
                return originalOnUnhandledRejection(event);
            }
        };
    }

    /**
     * Adds an error to the local error log
     * @private
     * @param {LocalError} error - Error to add
     */
    static #addLocalError(error) {
        this.#localErrors.push(error);

        // Trim if exceeds max
        if (this.#localErrors.length > this.#maxLocalErrors) {
            this.#localErrors = this.#localErrors.slice(-this.#maxLocalErrors);
        }
    }

    /**
     * Captures an exception and sends to Sentry or local log
     *
     * @param {Error} error - The error to capture
     * @param {Object} [context={}] - Additional context
     * @returns {void}
     *
     * @example
     * try {
     *   await apiCall();
     * } catch (error) {
     *   ErrorMonitor.captureException(error, {
     *     component: 'GeminiClient',
     *     action: 'sendMessage',
     *     userId: 'anonymous-123'
     *   });
     * }
     */
    static captureException(error, context = {}) {
        if (!this.#isInitialized) {
            console.warn('[ErrorMonitor] Not initialized. Call ErrorMonitor.initialize() first.');
            return;
        }

        // Log to console
        console.error('[ErrorMonitor] Exception captured:', error, context);

        // Send to Sentry if available and configured
        if (typeof Sentry !== 'undefined' && this.#config.dsn) {
            Sentry.withScope((scope) => {
                // Add context as extras
                Object.entries(context).forEach(([key, value]) => {
                    scope.setExtra(key, value);
                });

                // Set tags for filtering
                if (context.component) {
                    scope.setTag('component', context.component);
                }
                if (context.action) {
                    scope.setTag('action', context.action);
                }

                Sentry.captureException(error);
            });
        } else {
            // Local logging fallback
            this.#addLocalError({
                type: 'exception',
                message: error.message || String(error),
                stack: error.stack,
                context,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Captures a message/event
     *
     * @param {string} message - Message to capture
     * @param {'info'|'warning'|'error'|'fatal'|'debug'} [level='info'] - Severity level
     * @param {Object} [context={}] - Additional context
     * @returns {void}
     *
     * @example
     * ErrorMonitor.captureMessage('User started onboarding', 'info', {
     *   step: 1,
     *   component: 'OnboardingTour'
     * });
     */
    static captureMessage(message, level = 'info', context = {}) {
        if (!this.#isInitialized) {
            console.warn('[ErrorMonitor] Not initialized. Call ErrorMonitor.initialize() first.');
            return;
        }

        // Log to console
        const logMethod = level === 'error' || level === 'fatal' ? 'error' :
                         level === 'warning' ? 'warn' : 'log';
        console[logMethod](`[ErrorMonitor] ${level}:`, message, context);

        // Send to Sentry if available
        if (typeof Sentry !== 'undefined' && this.#config.dsn) {
            Sentry.withScope((scope) => {
                Object.entries(context).forEach(([key, value]) => {
                    scope.setExtra(key, value);
                });
                Sentry.captureMessage(message, level);
            });
        } else {
            // Local logging fallback
            this.#addLocalError({
                type: 'message',
                message,
                level,
                context,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Sets user context (without PII)
     *
     * @param {Object} userContext - User context object
     * @param {string} [userContext.id] - Anonymous user ID
     * @param {string} [userContext.role] - User role (e.g., 'teacher', 'admin')
     * @returns {void}
     *
     * @example
     * // Only set anonymous identifier, never PII
     * ErrorMonitor.setUser({
     *   id: 'anonymous-hash-123',
     *   role: 'teacher'
     * });
     */
    static setUser(userContext) {
        if (!this.#isInitialized) return;

        if (typeof Sentry !== 'undefined' && this.#config.dsn) {
            // Only set safe, non-PII fields
            Sentry.setUser({
                id: userContext.id,
                // Explicitly DO NOT set: email, ip_address, username
            });

            // Set role as tag for filtering
            if (userContext.role) {
                Sentry.setTag('user.role', userContext.role);
            }
        }
    }

    /**
     * Clears user context
     * @returns {void}
     */
    static clearUser() {
        if (typeof Sentry !== 'undefined') {
            Sentry.setUser(null);
        }
    }

    /**
     * Adds a breadcrumb for debugging context
     *
     * @param {Object} breadcrumb - Breadcrumb data
     * @param {string} breadcrumb.category - Category (e.g., 'ui', 'api', 'navigation')
     * @param {string} breadcrumb.message - Description of the action
     * @param {'debug'|'info'|'warning'|'error'|'fatal'} [breadcrumb.level='info'] - Severity
     * @param {Object} [breadcrumb.data] - Additional data
     * @returns {void}
     *
     * @example
     * ErrorMonitor.addBreadcrumb({
     *   category: 'navigation',
     *   message: 'User navigated to Dashboard',
     *   level: 'info',
     *   data: { from: 'iPads', to: 'Dashboard' }
     * });
     */
    static addBreadcrumb(breadcrumb) {
        if (!this.#isInitialized) return;

        if (typeof Sentry !== 'undefined' && this.#config.dsn) {
            Sentry.addBreadcrumb({
                category: breadcrumb.category,
                message: breadcrumb.message,
                level: breadcrumb.level || 'info',
                data: breadcrumb.data,
                timestamp: Date.now() / 1000
            });
        }

        // Also log to console in development
        if (this.#config.environment === 'development') {
            console.debug('[ErrorMonitor] Breadcrumb:', breadcrumb);
        }
    }

    /**
     * Sets a tag for filtering in Sentry
     *
     * @param {string} key - Tag key
     * @param {string} value - Tag value
     * @returns {void}
     *
     * @example
     * ErrorMonitor.setTag('feature', 'chatbot');
     */
    static setTag(key, value) {
        if (typeof Sentry !== 'undefined' && this.#config.dsn) {
            Sentry.setTag(key, value);
        }
    }

    /**
     * Gets locally captured errors (useful for debugging without Sentry)
     *
     * @returns {LocalError[]} Array of local errors
     *
     * @example
     * const errors = ErrorMonitor.getLocalErrors();
     * console.table(errors);
     */
    static getLocalErrors() {
        return [...this.#localErrors];
    }

    /**
     * Clears local error log
     * @returns {void}
     */
    static clearLocalErrors() {
        this.#localErrors = [];
    }

    /**
     * Performs a health check of the ErrorMonitor service
     *
     * @returns {HealthCheckResult} Health check results
     *
     * @example
     * const health = ErrorMonitor.healthCheck();
     * console.log(health);
     * // { initialized: true, hasSentry: true, hasDSN: true, environment: 'production', localErrorCount: 0 }
     */
    static healthCheck() {
        return {
            initialized: this.#isInitialized,
            hasSentry: typeof Sentry !== 'undefined',
            hasDSN: !!this.#config.dsn,
            environment: this.#config.environment,
            localErrorCount: this.#localErrors.length,
            release: this.#config.release
        };
    }

    /**
     * Gets current configuration (without sensitive data)
     * @returns {Object} Safe configuration object
     */
    static getConfig() {
        return {
            environment: this.#config.environment,
            release: this.#config.release,
            sampleRate: this.#config.sampleRate,
            tracesSampleRate: this.#config.tracesSampleRate,
            hasDSN: !!this.#config.dsn
        };
    }

    /**
     * Updates the Sentry DSN (requires re-initialization)
     *
     * @param {string} dsn - New Sentry DSN
     * @returns {void}
     *
     * @example
     * // Admin configures DSN from settings
     * ErrorMonitor.setDSN('https://xxx@sentry.io/project');
     */
    static setDSN(dsn) {
        if (this.#config.dsn === dsn) {
            return;
        }

        this.#config.dsn = dsn;
        this.#isInitialized = false;

        // Re-initialize with new DSN
        this.initialize(this.#config);
    }

    /**
     * Flushes pending events to Sentry (useful before page unload)
     *
     * @param {number} [timeout=2000] - Flush timeout in ms
     * @returns {Promise<boolean>} Whether flush completed successfully
     */
    static async flush(timeout = 2000) {
        if (typeof Sentry !== 'undefined' && this.#config.dsn) {
            try {
                return await Sentry.flush(timeout);
            } catch {
                return false;
            }
        }
        return true;
    }
}

// Export as default for convenience
export default ErrorMonitor;

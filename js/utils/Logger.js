/**
 * @fileoverview Conditional Logger - Production-safe logging utility
 * @module utils/Logger
 * @version 1.0.0
 * @license MIT
 *
 * @description
 * Provides a conditional logging system that can be disabled in production.
 * Logs are only output when DEBUG mode is enabled via localStorage or query parameter.
 *
 * Usage:
 *   import { logger } from './utils/Logger.js';
 *   logger.log('Debug message');
 *   logger.warn('Warning message');
 *   logger.error('Error message');
 *
 * Enable debug mode:
 *   - localStorage.setItem('DEBUG_MODE', 'true')
 *   - Add ?debug=true to URL
 */

/**
 * Logger class with conditional output based on DEBUG_MODE
 * @class Logger
 */
class Logger {
    /**
     * Creates a new Logger instance
     */
    constructor() {
        this.#checkDebugMode();
        this.#showDebugStatus();
    }

    /**
     * Shows debug status on initialization (only once)
     * @private
     */
    #showDebugStatus() {
        if (this.#debugEnabled && !this.#statusShown) {
            console.log(
                '%c[Logger] Debug mode enabled',
                'color: #4CAF50; font-weight: bold;',
                '\n- console.log/info/debug will be displayed',
                '\n- To disable: logger.disable() or localStorage.removeItem("DEBUG_MODE")',
                '\n- Production builds will suppress non-error logs automatically'
            );
            this.#statusShown = true;
        }
    }

    /** @private @type {boolean} Status message shown flag */
    #statusShown = false;

    /** @private @type {boolean} Debug mode state */
    #debugEnabled = false;

    /**
     * Checks if debug mode is enabled
     * @private
     */
    #checkDebugMode() {
        // Check localStorage
        const debugStorage = localStorage.getItem('DEBUG_MODE');

        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const debugParam = urlParams.get('debug');

        // Enable if either is true
        this.#debugEnabled = debugStorage === 'true' || debugParam === 'true';

        // Auto-enable in development (localhost)
        if (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '') {
            this.#debugEnabled = true;
        }
    }

    /**
     * Gets the current debug mode state
     * @returns {boolean} True if debug mode is enabled
     */
    get isDebugEnabled() {
        return this.#debugEnabled;
    }

    /**
     * Enables debug mode
     */
    enable() {
        this.#debugEnabled = true;
        localStorage.setItem('DEBUG_MODE', 'true');
    }

    /**
     * Disables debug mode
     */
    disable() {
        this.#debugEnabled = false;
        localStorage.removeItem('DEBUG_MODE');
    }

    /**
     * Logs a message (only in debug mode)
     * @param {...any} args - Arguments to log
     */
    log(...args) {
        if (this.#debugEnabled) {
            console.log(...args);
        }
    }

    /**
     * Logs an informational message (only in debug mode)
     * @param {...any} args - Arguments to log
     */
    info(...args) {
        if (this.#debugEnabled) {
            console.info(...args);
        }
    }

    /**
     * Logs a debug message (only in debug mode)
     * @param {...any} args - Arguments to log
     */
    debug(...args) {
        if (this.#debugEnabled) {
            console.debug(...args);
        }
    }

    /**
     * Logs a warning message (always shown, but can be suppressed)
     * @param {...any} args - Arguments to log
     */
    warn(...args) {
        // Warnings are shown in production but can be suppressed in debug mode
        if (this.#debugEnabled || !this.#isSuppressedWarning(args[0])) {
            console.warn(...args);
        }
    }

    /**
     * Logs an error message (always shown)
     * @param {...any} args - Arguments to log
     */
    error(...args) {
        // Errors are always shown
        console.error(...args);
    }

    /**
     * Checks if a warning should be suppressed in production
     * @private
     * @param {string} message - Warning message
     * @returns {boolean} True if warning should be suppressed
     */
    #isSuppressedWarning(message) {
        // Suppress certain warnings in production
        if (!this.#debugEnabled && typeof message === 'string') {
            // Add patterns for warnings to suppress in production
            const suppressPatterns = [
                // Example: /Development mode/i
            ];

            return suppressPatterns.some(pattern => pattern.test(message));
        }
        return false;
    }

    /**
     * Groups logs together (only in debug mode)
     * @param {string} label - Group label
     */
    group(label) {
        if (this.#debugEnabled) {
            console.group(label);
        }
    }

    /**
     * Groups logs together (collapsed) (only in debug mode)
     * @param {string} label - Group label
     */
    groupCollapsed(label) {
        if (this.#debugEnabled) {
            console.groupCollapsed(label);
        }
    }

    /**
     * Ends a log group (only in debug mode)
     */
    groupEnd() {
        if (this.#debugEnabled) {
            console.groupEnd();
        }
    }

    /**
     * Logs a table (only in debug mode)
     * @param {any} data - Data to display as table
     */
    table(data) {
        if (this.#debugEnabled) {
            console.table(data);
        }
    }

    /**
     * Starts a timer (only in debug mode)
     * @param {string} label - Timer label
     */
    time(label) {
        if (this.#debugEnabled) {
            console.time(label);
        }
    }

    /**
     * Ends a timer and logs elapsed time (only in debug mode)
     * @param {string} label - Timer label
     */
    timeEnd(label) {
        if (this.#debugEnabled) {
            console.timeEnd(label);
        }
    }

    /**
     * Logs current time for a running timer (only in debug mode)
     * @param {string} label - Timer label
     */
    timeLog(label) {
        if (this.#debugEnabled) {
            console.timeLog(label);
        }
    }
}

// Create and export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };

// Make logger available globally for legacy code (optional)
if (typeof window !== 'undefined') {
    window.__logger = logger;
}

export default logger;

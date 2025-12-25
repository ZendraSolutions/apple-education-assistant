/**
 * @fileoverview Centralized state management with localStorage persistence
 * @module core/StateManager
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

import { AppEvents } from '../utils/EventBus.js';

/**
 * @typedef {Object} AppState
 * @property {string} theme - Current theme ('light' | 'dark')
 * @property {string} currentSection - Active navigation section
 * @property {boolean} sidebarCollapsed - Sidebar collapse state
 * @property {Object<string, boolean[]>} checklistProgress - Checklist completion states
 */

/**
 * @typedef {Object} StateManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {Storage} [storage] - Storage adapter (defaults to localStorage)
 */

/**
 * Manages application state with localStorage persistence.
 * Provides a single source of truth for all application state.
 *
 * @class StateManager
 * @example
 * const stateManager = new StateManager({ eventBus, storage: localStorage });
 *
 * // Get state
 * const theme = stateManager.get('theme');
 *
 * // Set state
 * stateManager.set('theme', 'dark');
 *
 * // Subscribe to changes
 * stateManager.subscribe('theme', (newTheme) => {
 *     console.log('Theme changed to:', newTheme);
 * });
 */
export class StateManager {
    /**
     * Event bus for state change notifications
     * @type {import('../utils/EventBus.js').EventBus}
     * @private
     */
    #eventBus;

    /**
     * Storage adapter for persistence
     * @type {Storage}
     * @private
     */
    #storage;

    /**
     * In-memory state cache
     * @type {Map<string, *>}
     * @private
     */
    #state = new Map();

    /**
     * State change subscribers
     * @type {Map<string, Set<Function>>}
     * @private
     */
    #subscribers = new Map();

    /**
     * Storage key prefix to avoid collisions
     * @type {string}
     * @private
     */
    #prefix = 'jamf_';

    /**
     * Creates a new StateManager instance
     *
     * @param {StateManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If eventBus is not provided
     */
    constructor({ eventBus, storage = null }) {
        if (!eventBus) {
            throw new TypeError('StateManager requires an EventBus instance');
        }

        this.#eventBus = eventBus;
        this.#storage = storage || this.#createStorageAdapter();
        this.#loadInitialState();
    }

    /**
     * Creates a storage adapter that wraps localStorage
     * @returns {Storage} Storage adapter
     * @private
     */
    #createStorageAdapter() {
        return {
            getItem: (key) => {
                try {
                    return localStorage.getItem(key);
                } catch {
                    return null;
                }
            },
            setItem: (key, value) => {
                try {
                    localStorage.setItem(key, value);
                } catch (e) {
                    console.warn('[StateManager] Storage write failed:', e);
                }
            },
            removeItem: (key) => {
                try {
                    localStorage.removeItem(key);
                } catch {
                    // Ignore removal errors
                }
            },
            clear: () => {
                try {
                    localStorage.clear();
                } catch {
                    // Ignore clear errors
                }
            },
            get length() {
                try {
                    return localStorage.length;
                } catch {
                    return 0;
                }
            },
            key: (index) => {
                try {
                    return localStorage.key(index);
                } catch {
                    return null;
                }
            }
        };
    }

    /**
     * Loads initial state from storage
     * @private
     */
    #loadInitialState() {
        const defaults = {
            theme: 'light',
            sidebarCollapsed: false,
            currentSection: 'dashboard'
        };

        Object.entries(defaults).forEach(([key, defaultValue]) => {
            const stored = this.#storage.getItem(this.#getStorageKey(key));
            this.#state.set(key, stored !== null ? this.#parse(stored) : defaultValue);
        });
    }

    /**
     * Gets the storage key with prefix
     * @param {string} key - State key
     * @returns {string} Prefixed storage key
     * @private
     */
    #getStorageKey(key) {
        // Some keys use legacy names for backward compatibility
        const legacyMap = {
            theme: 'theme',
            sidebarCollapsed: 'sidebarCollapsed'
        };
        return legacyMap[key] || `${this.#prefix}${key}`;
    }

    /**
     * Parses a stored value
     * @param {string} value - Stored string value
     * @returns {*} Parsed value
     * @private
     */
    #parse(value) {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    /**
     * Serializes a value for storage
     * @param {*} value - Value to serialize
     * @returns {string} Serialized value
     * @private
     */
    #serialize(value) {
        return typeof value === 'string' ? value : JSON.stringify(value);
    }

    /**
     * Gets a state value
     *
     * @param {string} key - State key to retrieve
     * @param {*} [defaultValue] - Default value if key doesn't exist
     * @returns {*} State value or default
     *
     * @example
     * const theme = stateManager.get('theme', 'light');
     */
    get(key, defaultValue = null) {
        if (this.#state.has(key)) {
            return this.#state.get(key);
        }

        const stored = this.#storage.getItem(this.#getStorageKey(key));
        if (stored !== null) {
            const parsed = this.#parse(stored);
            this.#state.set(key, parsed);
            return parsed;
        }

        return defaultValue;
    }

    /**
     * Sets a state value and persists to storage
     *
     * @param {string} key - State key
     * @param {*} value - Value to store
     * @param {Object} [options={}] - Options
     * @param {boolean} [options.persist=true] - Whether to persist to storage
     * @param {boolean} [options.silent=false] - Whether to skip notifications
     * @returns {void}
     *
     * @example
     * stateManager.set('theme', 'dark');
     * stateManager.set('tempValue', 123, { persist: false });
     */
    set(key, value, options = {}) {
        const { persist = true, silent = false } = options;
        const oldValue = this.#state.get(key);

        this.#state.set(key, value);

        if (persist) {
            this.#storage.setItem(this.#getStorageKey(key), this.#serialize(value));
        }

        if (!silent && oldValue !== value) {
            this.#notifySubscribers(key, value, oldValue);
        }
    }

    /**
     * Removes a state value
     *
     * @param {string} key - State key to remove
     * @returns {boolean} True if key existed
     *
     * @example
     * stateManager.remove('temporaryData');
     */
    remove(key) {
        const existed = this.#state.has(key);
        this.#state.delete(key);
        this.#storage.removeItem(this.#getStorageKey(key));
        return existed;
    }

    /**
     * Subscribes to state changes for a specific key
     *
     * @param {string} key - State key to watch
     * @param {Function} callback - Function called with (newValue, oldValue)
     * @returns {Function} Unsubscribe function
     *
     * @example
     * const unsubscribe = stateManager.subscribe('theme', (theme, oldTheme) => {
     *     console.log(`Theme changed from ${oldTheme} to ${theme}`);
     * });
     *
     * // Later: unsubscribe();
     */
    subscribe(key, callback) {
        if (!this.#subscribers.has(key)) {
            this.#subscribers.set(key, new Set());
        }

        this.#subscribers.get(key).add(callback);

        return () => {
            this.#subscribers.get(key)?.delete(callback);
        };
    }

    /**
     * Notifies subscribers of a state change
     * @param {string} key - Changed key
     * @param {*} newValue - New value
     * @param {*} oldValue - Previous value
     * @private
     */
    #notifySubscribers(key, newValue, oldValue) {
        const subscribers = this.#subscribers.get(key);
        if (subscribers) {
            subscribers.forEach(callback => {
                try {
                    callback(newValue, oldValue);
                } catch (error) {
                    console.error(`[StateManager] Subscriber error for "${key}":`, error);
                }
            });
        }

        this.#eventBus.emit(`state:${key}:changed`, { key, newValue, oldValue });
    }

    /**
     * Gets all stored data (for RGPD export)
     *
     * @returns {Object} All stored data
     *
     * @example
     * const allData = stateManager.exportAll();
     * downloadAsJSON(allData);
     */
    exportAll() {
        const allData = {};

        for (let i = 0; i < this.#storage.length; i++) {
            const key = this.#storage.key(i);
            if (key) {
                try {
                    const value = this.#storage.getItem(key);
                    allData[key] = this.#parse(value);
                } catch {
                    allData[key] = '[Error reading]';
                }
            }
        }

        return allData;
    }

    /**
     * Clears all stored data (for RGPD deletion)
     *
     * @returns {void}
     * @fires StateManager#data:deleted
     *
     * @example
     * stateManager.clearAll();
     */
    clearAll() {
        this.#storage.clear();
        this.#state.clear();
        this.#eventBus.emit(AppEvents.DATA_DELETED);
    }

    /**
     * Gets checklist progress
     *
     * @param {string} checklistId - Checklist identifier
     * @returns {boolean[]} Array of completion states
     *
     * @example
     * const progress = stateManager.getChecklistProgress('inicio-curso');
     */
    getChecklistProgress(checklistId) {
        const key = `checklist-${checklistId}`;
        return this.get(key, []);
    }

    /**
     * Sets checklist item progress
     *
     * @param {string} checklistId - Checklist identifier
     * @param {number} itemIndex - Item index
     * @param {boolean} completed - Completion state
     * @returns {void}
     */
    setChecklistProgress(checklistId, itemIndex, completed) {
        const key = `checklist-${checklistId}`;
        const progress = this.getChecklistProgress(checklistId);
        progress[itemIndex] = completed;
        this.#storage.setItem(key, JSON.stringify(progress));
        this.#eventBus.emit(AppEvents.CHECKLIST_ITEM_TOGGLED, {
            checklistId,
            itemIndex,
            completed
        });
    }
}

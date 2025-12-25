/**
 * @fileoverview Theme management for light/dark mode switching
 * @module core/ThemeManager
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

import { AppEvents } from '../utils/EventBus.js';

/**
 * @typedef {'light'|'dark'} Theme
 */

/**
 * @typedef {Object} ThemeManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {import('./StateManager.js').StateManager} stateManager - State manager instance
 * @property {Document} [document] - Document reference (for testing)
 */

/**
 * Manages application theme (light/dark mode).
 * Handles theme persistence, toggling, and UI synchronization.
 *
 * @class ThemeManager
 * @example
 * const themeManager = new ThemeManager({ eventBus, stateManager });
 *
 * // Toggle theme
 * const newTheme = themeManager.toggle();
 *
 * // Set specific theme
 * themeManager.setTheme('dark');
 *
 * // Get current theme
 * const current = themeManager.getCurrentTheme();
 */
export class ThemeManager {
    /**
     * Current theme value
     * @type {Theme}
     * @private
     */
    #currentTheme = 'light';

    /**
     * Event bus for theme change notifications
     * @type {import('../utils/EventBus.js').EventBus}
     * @private
     */
    #eventBus;

    /**
     * State manager for persistence
     * @type {import('./StateManager.js').StateManager}
     * @private
     */
    #stateManager;

    /**
     * Document reference
     * @type {Document}
     * @private
     */
    #document;

    /**
     * Theme toggle button element
     * @type {HTMLElement|null}
     * @private
     */
    #toggleButton = null;

    /**
     * Theme icon element
     * @type {HTMLElement|null}
     * @private
     */
    #iconElement = null;

    /**
     * Creates a new ThemeManager instance
     *
     * @param {ThemeManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If required dependencies are missing
     */
    constructor({ eventBus, stateManager, document: doc = null }) {
        if (!eventBus) {
            throw new TypeError('ThemeManager requires an EventBus instance');
        }
        if (!stateManager) {
            throw new TypeError('ThemeManager requires a StateManager instance');
        }

        this.#eventBus = eventBus;
        this.#stateManager = stateManager;
        this.#document = doc || (typeof document !== 'undefined' ? document : null);
    }

    /**
     * Initializes the theme manager and loads saved theme
     *
     * @returns {void}
     * @fires ThemeManager#theme:loaded
     *
     * @example
     * themeManager.init();
     */
    init() {
        this.#loadSavedTheme();
        this.#bindToggleButton();
        this.#eventBus.emit(AppEvents.THEME_LOADED, this.#currentTheme);
    }

    /**
     * Loads the saved theme from storage
     * @private
     */
    #loadSavedTheme() {
        const savedTheme = this.#stateManager.get('theme', 'light');
        this.#currentTheme = this.#validateTheme(savedTheme);
        this.#applyTheme();
    }

    /**
     * Validates a theme value
     * @param {string} theme - Theme to validate
     * @returns {Theme} Valid theme value
     * @private
     */
    #validateTheme(theme) {
        return theme === 'dark' ? 'dark' : 'light';
    }

    /**
     * Binds the theme toggle button
     * @private
     */
    #bindToggleButton() {
        if (!this.#document) return;

        this.#toggleButton = this.#document.getElementById('themeToggle');
        this.#iconElement = this.#document.getElementById('themeIcon');

        if (this.#toggleButton) {
            this.#toggleButton.addEventListener('click', () => this.toggle());
        }

        this.#updateIcon();
    }

    /**
     * Applies the current theme to the document
     * @private
     */
    #applyTheme() {
        if (!this.#document) return;

        this.#document.documentElement.setAttribute('data-theme', this.#currentTheme);
        this.#updateIcon();
    }

    /**
     * Updates the theme icon based on current theme
     * @private
     */
    #updateIcon() {
        if (this.#iconElement) {
            this.#iconElement.className = this.#currentTheme === 'dark'
                ? 'ri-sun-line'
                : 'ri-moon-line';
        }
    }

    /**
     * Toggles between light and dark themes
     *
     * @returns {Theme} The new active theme
     * @fires ThemeManager#theme:changed
     *
     * @example
     * const newTheme = themeManager.toggle();
     * console.log(`Theme changed to: ${newTheme}`);
     */
    toggle() {
        this.#currentTheme = this.#currentTheme === 'light' ? 'dark' : 'light';
        this.#persistAndApply();
        return this.#currentTheme;
    }

    /**
     * Sets a specific theme
     *
     * @param {Theme} theme - Theme to set ('light' or 'dark')
     * @returns {Theme} The applied theme
     * @fires ThemeManager#theme:changed
     *
     * @example
     * themeManager.setTheme('dark');
     */
    setTheme(theme) {
        this.#currentTheme = this.#validateTheme(theme);
        this.#persistAndApply();
        return this.#currentTheme;
    }

    /**
     * Persists theme and applies to document
     * @private
     */
    #persistAndApply() {
        this.#stateManager.set('theme', this.#currentTheme);
        this.#applyTheme();
        this.#eventBus.emit(AppEvents.THEME_CHANGED, this.#currentTheme);
    }

    /**
     * Gets the current theme
     *
     * @returns {Theme} Current theme value
     *
     * @example
     * const theme = themeManager.getCurrentTheme();
     * if (theme === 'dark') {
     *     // Dark mode specific logic
     * }
     */
    getCurrentTheme() {
        return this.#currentTheme;
    }

    /**
     * Checks if dark mode is active
     *
     * @returns {boolean} True if dark mode is active
     *
     * @example
     * if (themeManager.isDarkMode()) {
     *     console.log('Dark mode is active');
     * }
     */
    isDarkMode() {
        return this.#currentTheme === 'dark';
    }

    /**
     * Checks if light mode is active
     *
     * @returns {boolean} True if light mode is active
     *
     * @example
     * if (themeManager.isLightMode()) {
     *     console.log('Light mode is active');
     * }
     */
    isLightMode() {
        return this.#currentTheme === 'light';
    }
}

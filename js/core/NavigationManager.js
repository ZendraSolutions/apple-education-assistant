/**
 * @fileoverview Navigation management for SPA section routing
 * @module core/NavigationManager
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

import { AppEvents } from '../utils/EventBus.js';

/**
 * @typedef {string} Section
 * @description Valid section identifiers for navigation
 */

/**
 * @typedef {Object} NavigationManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {import('./StateManager.js').StateManager} stateManager - State manager instance
 * @property {Document} [document] - Document reference (for testing)
 */

/**
 * @typedef {Object} NavigationEvent
 * @property {Section} section - Target section
 * @property {Section} previousSection - Previous section
 */

/**
 * Manages SPA navigation between sections.
 * Handles nav item activation, sidebar state, and view rendering delegation.
 *
 * @class NavigationManager
 * @example
 * const navigationManager = new NavigationManager({
 *     eventBus,
 *     stateManager
 * });
 *
 * navigationManager.init();
 * navigationManager.navigateTo('dashboard');
 */
export class NavigationManager {
    /**
     * Current active section
     * @type {Section}
     * @private
     */
    #currentSection = 'dashboard';

    /**
     * Event bus for navigation events
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
     * Valid section identifiers
     * @type {Set<string>}
     * @private
     */
    #validSections = new Set([
        'dashboard',
        'ecosistema',
        'ipads',
        'macs',
        'aula',
        'classroom',
        'teacher',
        'troubleshooting',
        'checklists',
        'mis-datos'
    ]);

    /**
     * Creates a new NavigationManager instance
     *
     * @param {NavigationManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If required dependencies are missing
     */
    constructor({ eventBus, stateManager, document: doc = null }) {
        if (!eventBus) {
            throw new TypeError('NavigationManager requires an EventBus instance');
        }
        if (!stateManager) {
            throw new TypeError('NavigationManager requires a StateManager instance');
        }

        this.#eventBus = eventBus;
        this.#stateManager = stateManager;
        this.#document = doc || (typeof document !== 'undefined' ? document : null);
    }

    /**
     * Initializes navigation bindings
     *
     * @returns {void}
     *
     * @example
     * navigationManager.init();
     */
    init() {
        this.#bindNavItems();
        this.#currentSection = this.#stateManager.get('currentSection', 'dashboard');
    }

    /**
     * Binds click handlers to navigation items
     * @private
     */
    #bindNavItems() {
        if (!this.#document) return;

        const navItems = this.#document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                if (section) {
                    this.navigateTo(section);
                }
            });
        });
    }

    /**
     * Navigates to a specific section
     *
     * @param {Section} section - Target section identifier
     * @returns {boolean} True if navigation was successful
     * @fires NavigationManager#navigation:changed
     *
     * @example
     * navigationManager.navigateTo('ipads');
     */
    navigateTo(section) {
        if (!this.#isValidSection(section)) {
            console.warn(`[NavigationManager] Invalid section: ${section}`);
            return false;
        }

        const previousSection = this.#currentSection;

        // Emit before change event (allows cancellation)
        this.#eventBus.emit(AppEvents.NAVIGATION_BEFORE_CHANGE, {
            section,
            previousSection
        });

        // Update nav item active states
        this.#updateNavActiveState(section);

        // Close mobile sidebar
        this.#closeMobileSidebar();

        // Update current section
        this.#currentSection = section;
        this.#stateManager.set('currentSection', section);

        // Emit navigation changed event
        this.#eventBus.emit(AppEvents.NAVIGATION_CHANGED, {
            section,
            previousSection
        });

        return true;
    }

    /**
     * Validates if a section identifier is valid
     * @param {string} section - Section to validate
     * @returns {boolean} True if valid
     * @private
     */
    #isValidSection(section) {
        return this.#validSections.has(section);
    }

    /**
     * Updates the active state of nav items
     * @param {Section} activeSection - Section to mark as active
     * @private
     */
    #updateNavActiveState(activeSection) {
        if (!this.#document) return;

        const navItems = this.#document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = this.#document.querySelector(
            `[data-section="${activeSection}"]`
        );
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    /**
     * Closes the mobile sidebar
     * @private
     */
    #closeMobileSidebar() {
        if (!this.#document) return;

        const sidebar = this.#document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }

    /**
     * Gets the current active section
     *
     * @returns {Section} Current section identifier
     *
     * @example
     * const current = navigationManager.getCurrentSection();
     */
    getCurrentSection() {
        return this.#currentSection;
    }

    /**
     * Gets the list of valid sections
     *
     * @returns {string[]} Array of valid section identifiers
     *
     * @example
     * const sections = navigationManager.getValidSections();
     */
    getValidSections() {
        return Array.from(this.#validSections);
    }

    /**
     * Checks if a section is the current active section
     *
     * @param {Section} section - Section to check
     * @returns {boolean} True if section is active
     *
     * @example
     * if (navigationManager.isActive('dashboard')) {
     *     // Dashboard is currently active
     * }
     */
    isActive(section) {
        return this.#currentSection === section;
    }
}

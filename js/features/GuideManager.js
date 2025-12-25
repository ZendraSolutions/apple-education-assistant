/**
 * @fileoverview Guide display management
 * @module features/GuideManager
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

/**
 * @typedef {Object} GuideManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {import('../core/ModalManager.js').ModalManager} modalManager - Modal manager
 * @property {Object} knowledgeBase - Knowledge base data
 */

/**
 * Manages guide lookup and display in modals.
 * Handles navigation from guide IDs to their content.
 *
 * @class GuideManager
 * @example
 * const guideManager = new GuideManager({
 *     eventBus,
 *     modalManager,
 *     knowledgeBase: KnowledgeBase
 * });
 *
 * guideManager.init();
 * guideManager.openGuide('ipad-enrollment');
 */
export class GuideManager {
    /**
     * Event bus for guide events
     * @type {import('../utils/EventBus.js').EventBus}
     * @private
     */
    #eventBus;

    /**
     * Modal manager for display
     * @type {import('../core/ModalManager.js').ModalManager}
     * @private
     */
    #modalManager;

    /**
     * Knowledge base reference
     * @type {Object}
     * @private
     */
    #knowledgeBase;

    /**
     * Guide prefix to category mapping
     * @type {Object<string, string>}
     * @private
     */
    #prefixMap = {
        'ipad-': 'ipads',
        'mac-': 'macs',
        'aula-': 'aula',
        'classroom-': 'aula', // Legacy support
        'teacher-': 'teacher'
    };

    /**
     * Creates a new GuideManager instance
     *
     * @param {GuideManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If required dependencies are missing
     */
    constructor({ eventBus, modalManager, knowledgeBase }) {
        if (!eventBus) {
            throw new TypeError('GuideManager requires an EventBus instance');
        }
        if (!modalManager) {
            throw new TypeError('GuideManager requires a ModalManager instance');
        }
        if (!knowledgeBase) {
            throw new TypeError('GuideManager requires a knowledgeBase');
        }

        this.#eventBus = eventBus;
        this.#modalManager = modalManager;
        this.#knowledgeBase = knowledgeBase;
    }

    /**
     * Initializes guide manager (no bindings needed - uses event bus)
     *
     * @returns {void}
     */
    init() {
        // GuideManager is triggered by events from views, no init bindings needed
    }

    /**
     * Opens a guide in the modal
     *
     * @param {string} guideId - Guide identifier (e.g., 'ipad-enrollment')
     * @returns {boolean} True if guide was found and opened
     *
     * @example
     * guideManager.openGuide('aula-howto');
     */
    openGuide(guideId) {
        const guide = this.#findGuide(guideId);

        if (guide && guide.content) {
            this.#modalManager.show(guide.content);
            this.#eventBus.emit('guide:opened', { id: guideId, title: guide.title });
            return true;
        }

        console.warn(`[GuideManager] Guide not found: ${guideId}`);
        return false;
    }

    /**
     * Finds a guide by its ID
     * @param {string} guideId - Guide identifier
     * @returns {Object|null} Guide object or null
     * @private
     */
    #findGuide(guideId) {
        // Check each prefix mapping
        for (const [prefix, category] of Object.entries(this.#prefixMap)) {
            if (guideId.startsWith(prefix)) {
                const key = guideId.replace(prefix, '');
                const categoryData = this.#knowledgeBase[category];

                if (categoryData && categoryData[key]) {
                    return categoryData[key];
                }
            }
        }

        // Direct lookup for special cases
        if (guideId === 'teacher-setup') {
            return this.#knowledgeBase.teacher?.setup;
        }

        // Fallback: try each category
        for (const category of ['ipads', 'macs', 'aula', 'teacher']) {
            const categoryData = this.#knowledgeBase[category];
            if (categoryData) {
                for (const [key, guide] of Object.entries(categoryData)) {
                    if (`${category}-${key}` === guideId || key === guideId) {
                        return guide;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Gets a guide without opening it
     *
     * @param {string} guideId - Guide identifier
     * @returns {Object|null} Guide object or null
     *
     * @example
     * const guide = guideManager.getGuide('mac-enrollment');
     * if (guide) {
     *     console.log(guide.title);
     * }
     */
    getGuide(guideId) {
        return this.#findGuide(guideId);
    }

    /**
     * Checks if a guide exists
     *
     * @param {string} guideId - Guide identifier
     * @returns {boolean} True if guide exists
     *
     * @example
     * if (guideManager.hasGuide('aula-advanced')) {
     *     // Guide is available
     * }
     */
    hasGuide(guideId) {
        return this.#findGuide(guideId) !== null;
    }

    /**
     * Gets all guides for a category
     *
     * @param {string} category - Category name (ipads, macs, aula, teacher)
     * @returns {Object} Guides in category
     *
     * @example
     * const iPadGuides = guideManager.getCategory('ipads');
     */
    getCategory(category) {
        return this.#knowledgeBase[category] || {};
    }

    /**
     * Gets all available categories
     *
     * @returns {string[]} Array of category names
     *
     * @example
     * const categories = guideManager.getCategories();
     */
    getCategories() {
        return ['ipads', 'macs', 'aula', 'teacher'].filter(
            cat => this.#knowledgeBase[cat]
        );
    }
}

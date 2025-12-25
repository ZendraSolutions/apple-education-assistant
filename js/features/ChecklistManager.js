/**
 * @fileoverview Checklist progress management
 * @module features/ChecklistManager
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

import { AppEvents } from '../utils/EventBus.js';

/**
 * @typedef {Object} ChecklistItem
 * @property {string} text - Item description
 */

/**
 * @typedef {Object} Checklist
 * @property {string} title - Checklist title
 * @property {string} icon - Icon HTML/class
 * @property {string} [category] - Category label
 * @property {string} [estimatedTime] - Time estimate
 * @property {ChecklistItem[]} items - Checklist items
 */

/**
 * @typedef {Object} ChecklistManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {import('../core/ModalManager.js').ModalManager} modalManager - Modal manager
 * @property {import('../core/StateManager.js').StateManager} stateManager - State manager
 * @property {Object<string, Checklist>} checklists - Checklists data
 */

/**
 * Manages checklist display and progress tracking.
 * Persists progress to localStorage via StateManager.
 *
 * @class ChecklistManager
 * @example
 * const checklistManager = new ChecklistManager({
 *     eventBus,
 *     modalManager,
 *     stateManager,
 *     checklists: KnowledgeBase.checklists
 * });
 *
 * checklistManager.init();
 * checklistManager.open('inicio-curso');
 */
export class ChecklistManager {
    /**
     * Event bus for checklist events
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
     * State manager for persistence
     * @type {import('../core/StateManager.js').StateManager}
     * @private
     */
    #stateManager;

    /**
     * Checklists data
     * @type {Object<string, Checklist>}
     * @private
     */
    #checklists;

    /**
     * Currently open checklist ID
     * @type {string|null}
     * @private
     */
    #currentChecklistId = null;

    /**
     * Creates a new ChecklistManager instance
     *
     * @param {ChecklistManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If required dependencies are missing
     */
    constructor({ eventBus, modalManager, stateManager, checklists }) {
        if (!eventBus) {
            throw new TypeError('ChecklistManager requires an EventBus instance');
        }
        if (!modalManager) {
            throw new TypeError('ChecklistManager requires a ModalManager instance');
        }
        if (!stateManager) {
            throw new TypeError('ChecklistManager requires a StateManager instance');
        }
        if (!checklists) {
            throw new TypeError('ChecklistManager requires checklists data');
        }

        this.#eventBus = eventBus;
        this.#modalManager = modalManager;
        this.#stateManager = stateManager;
        this.#checklists = checklists;
    }

    /**
     * Initializes event subscriptions
     *
     * @returns {void}
     *
     * @example
     * checklistManager.init();
     */
    init() {
        this.#subscribeToModalEvents();
    }

    /**
     * Subscribes to modal checkbox events
     * @private
     */
    #subscribeToModalEvents() {
        this.#eventBus.on('modal:checklistItemChanged', (data) => {
            if (this.#currentChecklistId) {
                this.#updateItemProgress(data.index, data.checked);
            }
        });
    }

    /**
     * Opens a checklist in the modal
     *
     * @param {string} checklistId - Checklist identifier
     * @returns {boolean} True if checklist was opened
     * @fires ChecklistManager#checklist:opened
     *
     * @example
     * checklistManager.open('inicio-curso');
     */
    open(checklistId) {
        const checklist = this.#checklists[checklistId];
        if (!checklist) {
            console.warn(`[ChecklistManager] Checklist not found: ${checklistId}`);
            return false;
        }

        this.#currentChecklistId = checklistId;
        const savedState = this.#stateManager.getChecklistProgress(checklistId);
        const html = this.#buildChecklistHtml(checklist, savedState, checklistId);

        this.#modalManager.show(html);

        this.#eventBus.emit(AppEvents.CHECKLIST_OPENED, {
            id: checklistId,
            title: checklist.title
        });

        return true;
    }

    /**
     * Builds HTML for checklist display
     * @param {Checklist} checklist - Checklist data
     * @param {boolean[]} savedState - Saved completion states
     * @param {string} checklistId - Checklist identifier
     * @returns {string} Checklist HTML
     * @private
     */
    #buildChecklistHtml(checklist, savedState, checklistId) {
        return `
            <h2>${checklist.icon} ${checklist.title}</h2>
            <div class="checklist-items" data-checklist-id="${checklistId}">
                ${checklist.items.map((item, idx) => `
                    <label class="checklist-item">
                        <input type="checkbox"
                               data-idx="${idx}"
                               ${savedState[idx] ? 'checked' : ''}>
                        <span>${item.text}</span>
                    </label>
                `).join('')}
            </div>
        `;
    }

    /**
     * Updates item progress
     * @param {number} itemIndex - Item index
     * @param {boolean} completed - Completion state
     * @private
     */
    #updateItemProgress(itemIndex, completed) {
        if (!this.#currentChecklistId) return;

        this.#stateManager.setChecklistProgress(
            this.#currentChecklistId,
            itemIndex,
            completed
        );

        // Check if all items are completed
        const checklist = this.#checklists[this.#currentChecklistId];
        const progress = this.#stateManager.getChecklistProgress(this.#currentChecklistId);
        const allCompleted = checklist.items.every((_, idx) => progress[idx] === true);

        if (allCompleted) {
            this.#eventBus.emit(AppEvents.CHECKLIST_COMPLETED, {
                id: this.#currentChecklistId,
                title: checklist.title
            });
        }
    }

    /**
     * Gets progress for a checklist
     *
     * @param {string} checklistId - Checklist identifier
     * @returns {Object} Progress information
     *
     * @example
     * const progress = checklistManager.getProgress('inicio-curso');
     * console.log(`${progress.completed}/${progress.total} completed`);
     */
    getProgress(checklistId) {
        const checklist = this.#checklists[checklistId];
        if (!checklist) return { completed: 0, total: 0, percentage: 0 };

        const savedState = this.#stateManager.getChecklistProgress(checklistId);
        const completed = savedState.filter(Boolean).length;
        const total = checklist.items.length;

        return {
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    /**
     * Resets progress for a checklist
     *
     * @param {string} checklistId - Checklist identifier
     * @returns {boolean} True if reset was successful
     *
     * @example
     * checklistManager.resetProgress('inicio-curso');
     */
    resetProgress(checklistId) {
        const checklist = this.#checklists[checklistId];
        if (!checklist) return false;

        const emptyState = new Array(checklist.items.length).fill(false);
        checklist.items.forEach((_, idx) => {
            this.#stateManager.setChecklistProgress(checklistId, idx, false);
        });

        return true;
    }

    /**
     * Gets all checklists grouped by category
     *
     * @returns {Object<string, Array>} Checklists grouped by category
     *
     * @example
     * const grouped = checklistManager.getGroupedByCategory();
     */
    getGroupedByCategory() {
        const categories = {};

        Object.entries(this.#checklists).forEach(([key, checklist]) => {
            const category = checklist.category || 'General';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push({
                key,
                ...checklist,
                progress: this.getProgress(key)
            });
        });

        return categories;
    }

    /**
     * Gets available checklist IDs
     *
     * @returns {string[]} Array of checklist identifiers
     *
     * @example
     * const ids = checklistManager.getAvailableChecklists();
     */
    getAvailableChecklists() {
        return Object.keys(this.#checklists);
    }

    /**
     * Gets a checklist by ID
     *
     * @param {string} id - Checklist identifier
     * @returns {Checklist|null} Checklist data or null
     *
     * @example
     * const checklist = checklistManager.getChecklist('inicio-curso');
     */
    getChecklist(id) {
        return this.#checklists[id] || null;
    }

    /**
     * Gets the currently open checklist ID
     *
     * @returns {string|null} Current checklist ID or null
     */
    getCurrentChecklistId() {
        return this.#currentChecklistId;
    }
}

/**
 * @fileoverview Modal dialog management with WCAG 2.1 AA compliance
 * @module core/ModalManager
 * @version 1.1.0
 * @author Jamf Assistant Team
 * @license MIT
 */

import { AppEvents } from '../utils/EventBus.js';
import { createFocusTrap } from '../ui/FocusTrap.js';

/**
 * @typedef {Object} ModalManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {Document} [document] - Document reference (for testing)
 */

/**
 * @typedef {Object} SanitizerConfig
 * @property {string[]} ALLOWED_TAGS - Allowed HTML tags
 * @property {string[]} ALLOWED_ATTR - Allowed HTML attributes
 */

/**
 * Manages modal dialogs including guides, diagnostics, and checklists.
 * Handles opening, closing, and content sanitization.
 *
 * @class ModalManager
 * @example
 * const modalManager = new ModalManager({ eventBus });
 *
 * modalManager.init();
 * modalManager.show('<h2>Guide Title</h2><p>Content here...</p>');
 * modalManager.hide();
 */
export class ModalManager {
    /**
     * Event bus for modal events
     * @type {import('../utils/EventBus.js').EventBus}
     * @private
     */
    #eventBus;

    /**
     * Document reference
     * @type {Document}
     * @private
     */
    #document;

    /**
     * Modal container element
     * @type {HTMLElement|null}
     * @private
     */
    #modalElement = null;

    /**
     * Modal body element
     * @type {HTMLElement|null}
     * @private
     */
    #modalBody = null;

    /**
     * Modal close button element
     * @type {HTMLElement|null}
     * @private
     */
    #closeButton = null;

    /**
     * Focus trap instance for keyboard accessibility
     * @type {import('../ui/FocusTrap.js').FocusTrap|null}
     * @private
     */
    #focusTrap = null;

    /**
     * Sanitizer configuration
     * @type {SanitizerConfig}
     * @private
     */
    #sanitizerConfig = {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li',
            'strong', 'em', 'br', 'div', 'span', 'a', 'i',
            'button', 'label', 'input', 'pre', 'code'
        ],
        ALLOWED_ATTR: [
            'class', 'href', 'target', 'data-idx', 'data-next',
            'data-solution', 'id', 'type', 'checked', 'style', 'title'
        ]
    };

    /**
     * Creates a new ModalManager instance
     *
     * @param {ModalManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If eventBus is not provided
     */
    constructor({ eventBus, document: doc = null }) {
        if (!eventBus) {
            throw new TypeError('ModalManager requires an EventBus instance');
        }

        this.#eventBus = eventBus;
        this.#document = doc || (typeof document !== 'undefined' ? document : null);
    }

    /**
     * Initializes modal elements and event bindings
     *
     * @returns {void}
     *
     * @example
     * modalManager.init();
     */
    init() {
        this.#cacheElements();
        this.#bindCloseEvents();
        this.#bindEventDelegation();
        this.#initFocusTrap();
    }

    /**
     * Caches DOM element references
     * @private
     */
    #cacheElements() {
        if (!this.#document) return;

        this.#modalElement = this.#document.getElementById('guideModal');
        this.#modalBody = this.#document.getElementById('modalBody');
        this.#closeButton = this.#document.getElementById('modalClose');
    }

    /**
     * Binds close button and overlay click events
     * @private
     */
    #bindCloseEvents() {
        if (this.#closeButton) {
            this.#closeButton.addEventListener('click', () => this.hide());
        }

        if (this.#modalElement) {
            this.#modalElement.addEventListener('click', (e) => {
                if (e.target === this.#modalElement) {
                    this.hide();
                }
            });
        }

        // Add keyboard event listener for Escape key
        this.#document?.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible()) {
                this.hide();
            }
        });
    }

    /**
     * Initializes focus trap for modal accessibility
     * @private
     */
    #initFocusTrap() {
        if (!this.#modalElement) return;

        try {
            this.#focusTrap = createFocusTrap(this.#modalElement, {
                escapeDeactivates: true,
                returnFocusOnClose: true,
                clickOutsideDeactivates: false,
                initialFocus: this.#closeButton,
                onDeactivate: () => {
                    // Modal closed via focus trap
                    if (this.isVisible()) {
                        this.hide();
                    }
                }
            });
        } catch (error) {
            console.warn('[ModalManager] Failed to initialize focus trap:', error);
        }
    }

    /**
     * Sets up event delegation for dynamic modal content
     * @private
     */
    #bindEventDelegation() {
        if (!this.#modalBody) return;

        // Handle wizard option clicks
        this.#modalBody.addEventListener('click', (e) => {
            const wizardOption = e.target.closest('.wizard-option');
            if (wizardOption) {
                const next = wizardOption.dataset.next;
                const solution = wizardOption.dataset.solution;

                this.#eventBus.emit('modal:wizardOptionClicked', {
                    next: next !== '' ? parseInt(next, 10) : null,
                    solution: solution || null
                });
            }

            const restartBtn = e.target.closest('#restartDiag');
            if (restartBtn) {
                this.#eventBus.emit('modal:diagnosticRestart');
            }
        });

        // Handle checklist checkbox changes
        this.#modalBody.addEventListener('change', (e) => {
            const checkbox = e.target.closest('.checklist-item input[type="checkbox"]');
            if (checkbox) {
                const idx = parseInt(checkbox.dataset.idx, 10);
                this.#eventBus.emit('modal:checklistItemChanged', {
                    index: idx,
                    checked: checkbox.checked
                });
            }
        });
    }

    /**
     * Sanitizes HTML content for safe display
     * @param {string} content - HTML content to sanitize
     * @returns {string} Sanitized HTML
     * @private
     */
    #sanitize(content) {
        // Use DOMPurify if available (expected to be loaded globally)
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(content, this.#sanitizerConfig);
        }

        // Fallback: basic escape (not recommended for production)
        console.warn('[ModalManager] DOMPurify not available, using basic escape');
        return this.#basicEscape(content);
    }

    /**
     * Basic HTML escape fallback
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     * @private
     */
    #basicEscape(text) {
        const div = this.#document?.createElement('div');
        if (div) {
            div.textContent = text;
            return div.innerHTML;
        }
        return text;
    }

    /**
     * Shows the modal with the provided content
     *
     * @param {string} content - HTML content to display
     * @param {Object} [options={}] - Display options
     * @param {boolean} [options.sanitize=true] - Whether to sanitize content
     * @returns {void}
     * @fires ModalManager#modal:opened
     *
     * @example
     * modalManager.show('<h2>Title</h2><p>Content</p>');
     * modalManager.show(trustedHtml, { sanitize: false });
     */
    show(content, options = {}) {
        const { sanitize = true } = options;

        if (!this.#modalBody || !this.#modalElement) {
            console.error('[ModalManager] Modal elements not initialized');
            return;
        }

        const displayContent = sanitize ? this.#sanitize(content) : content;
        this.#modalBody.innerHTML = displayContent;
        this.#modalElement.classList.add('active');

        // Activate focus trap for keyboard accessibility
        if (this.#focusTrap) {
            // Small delay to ensure modal is visible before activating trap
            setTimeout(() => {
                this.#focusTrap.activate();
            }, 50);
        }

        this.#eventBus.emit(AppEvents.MODAL_OPENED, { content: displayContent });
    }

    /**
     * Hides the modal
     *
     * @returns {void}
     * @fires ModalManager#modal:closed
     *
     * @example
     * modalManager.hide();
     */
    hide() {
        if (this.#modalElement) {
            this.#modalElement.classList.remove('active');
        }

        // Deactivate focus trap and restore focus
        if (this.#focusTrap && this.#focusTrap.isActive()) {
            this.#focusTrap.deactivate();
        }

        this.#eventBus.emit(AppEvents.MODAL_CLOSED);
    }

    /**
     * Checks if the modal is currently visible
     *
     * @returns {boolean} True if modal is visible
     *
     * @example
     * if (modalManager.isVisible()) {
     *     modalManager.hide();
     * }
     */
    isVisible() {
        return this.#modalElement?.classList.contains('active') ?? false;
    }

    /**
     * Updates the modal body content without hiding/showing
     *
     * @param {string} content - New HTML content
     * @param {boolean} [sanitize=true] - Whether to sanitize content
     * @returns {void}
     *
     * @example
     * modalManager.updateContent('<h2>Step 2</h2><p>New content</p>');
     */
    updateContent(content, sanitize = true) {
        if (!this.#modalBody) return;

        const displayContent = sanitize ? this.#sanitize(content) : content;
        this.#modalBody.innerHTML = displayContent;

        // Update focus trap when content changes
        if (this.#focusTrap && this.#focusTrap.isActive()) {
            this.#focusTrap.updateTrap();
        }
    }

    /**
     * Gets the modal body element for direct manipulation
     *
     * @returns {HTMLElement|null} Modal body element
     *
     * @example
     * const body = modalManager.getBodyElement();
     * if (body) {
     *     const btn = body.querySelector('#customBtn');
     * }
     */
    getBodyElement() {
        return this.#modalBody;
    }

    /**
     * Destroys the modal manager and cleans up resources
     *
     * @returns {void}
     *
     * @example
     * modalManager.destroy();
     */
    destroy() {
        // Clean up focus trap
        if (this.#focusTrap) {
            this.#focusTrap.destroy();
            this.#focusTrap = null;
        }

        // Remove event listeners
        if (this.#closeButton) {
            this.#closeButton.removeEventListener('click', () => this.hide());
        }

        // Clear references
        this.#modalElement = null;
        this.#modalBody = null;
        this.#closeButton = null;
    }
}

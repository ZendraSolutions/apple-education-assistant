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
 * @property {boolean} ALLOW_DATA_ATTR - Whether to allow data attributes
 * @property {string[]} ADD_ATTR - Attributes to force add
 * @property {boolean} FORCE_BODY - Force body parsing
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
     * Sanitizer configuration - Security hardened
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
            'class', 'href', 'target', 'rel', 'data-idx', 'data-next',
            'data-solution', 'id', 'type', 'checked', 'title'
        ],
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: ['target'],
        FORCE_BODY: true
    };

    /**
     * Flag to track if DOMPurify availability has been verified
     * @type {boolean}
     * @private
     */
    #domPurifyVerified = false;

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
     * SECURITY: Verifies DOMPurify is loaded and functional
     * DOMPurify is REQUIRED - modal rendering is disabled without it
     *
     * @throws {Error} If DOMPurify is not available
     * @returns {boolean} True if DOMPurify is available
     * @private
     */
    #ensureDOMPurify() {
        if (this.#domPurifyVerified) {
            return true;
        }

        if (typeof DOMPurify === 'undefined' || typeof DOMPurify.sanitize !== 'function') {
            const errorMsg = 'SECURITY ERROR: DOMPurify is required but not loaded. ' +
                'Modal rendering disabled for security. ' +
                'Ensure DOMPurify is loaded before ModalManager.';
            console.error('[ModalManager]', errorMsg);
            throw new Error(errorMsg);
        }

        this.#domPurifyVerified = true;
        return true;
    }

    /**
     * SECURITY: Sanitizes HTML content using DOMPurify (MANDATORY)
     * This method ALWAYS sanitizes - there is no bypass option
     *
     * @param {string} content - HTML content to sanitize
     * @returns {string} Sanitized HTML safe for innerHTML
     * @throws {Error} If DOMPurify is not available
     * @private
     */
    #sanitizeHTML(content) {
        this.#ensureDOMPurify();
        return DOMPurify.sanitize(content, this.#sanitizerConfig);
    }

    /**
     * SECURITY: Safe content renderer with fallback to plain text
     * If sanitization fails for any reason, content is rendered as plain text
     *
     * @param {HTMLElement} element - Target element to render content into
     * @param {string} content - HTML content to render
     * @returns {boolean} True if content was rendered safely, false if fallback was used
     * @private
     */
    #safeRenderContent(element, content) {
        if (!element) {
            console.error('[ModalManager] Security: Cannot render - element is null');
            return false;
        }

        try {
            const sanitizedContent = this.#sanitizeHTML(content);
            element.innerHTML = sanitizedContent;
            return true;
        } catch (error) {
            console.error('[ModalManager] Security: Cannot render content safely', error);

            // Fallback to plain text - completely safe
            element.textContent = 'Content unavailable for security reasons. Please refresh the page.';

            // Notify user via ToastManager if available
            if (typeof window !== 'undefined' && window.ToastManager) {
                window.ToastManager.show(
                    'Error de seguridad al cargar contenido. Por favor, recarga la pagina.',
                    'error'
                );
            }

            return false;
        }
    }

    /**
     * Shows the modal with the provided content
     * SECURITY: Content is ALWAYS sanitized - no bypass option available
     *
     * @param {string} content - HTML content to display (will be sanitized)
     * @returns {void}
     * @fires ModalManager#modal:opened
     *
     * @example
     * modalManager.show('<h2>Title</h2><p>Content</p>');
     */
    show(content) {
        if (!this.#modalBody || !this.#modalElement) {
            console.error('[ModalManager] Modal elements not initialized');
            return;
        }

        // SECURITY: Always use safe render - no bypass allowed
        const renderSuccess = this.#safeRenderContent(this.#modalBody, content);

        if (renderSuccess) {
            this.#modalElement.classList.add('active');

            // Activate focus trap for keyboard accessibility
            if (this.#focusTrap) {
                // Small delay to ensure modal is visible before activating trap
                setTimeout(() => {
                    this.#focusTrap.activate();
                }, 50);
            }

            this.#eventBus.emit(AppEvents.MODAL_OPENED, { content });
        }
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
     * SECURITY: Content is ALWAYS sanitized - no bypass option available
     *
     * @param {string} content - New HTML content (will be sanitized)
     * @returns {void}
     *
     * @example
     * modalManager.updateContent('<h2>Step 2</h2><p>New content</p>');
     */
    updateContent(content) {
        if (!this.#modalBody) return;

        // SECURITY: Always use safe render - no bypass allowed
        const renderSuccess = this.#safeRenderContent(this.#modalBody, content);

        // Update focus trap when content changes successfully
        if (renderSuccess && this.#focusTrap && this.#focusTrap.isActive()) {
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

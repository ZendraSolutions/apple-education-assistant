/**
 * FocusTrap - Modal Focus Management
 *
 * Manages keyboard focus within modal dialogs to meet WCAG 2.1 AA standards.
 *
 * Features:
 * - Traps Tab/Shift+Tab navigation within modal
 * - Restores focus to trigger element on close
 * - Supports Escape key to close
 * - Handles dynamic content updates
 *
 * Requirements:
 * - WCAG 2.1 - 2.1.2 No Keyboard Trap (Level A)
 * - WCAG 2.1 - 2.4.3 Focus Order (Level A)
 *
 * @class FocusTrap
 */
export class FocusTrap {
    /**
     * Creates a new FocusTrap instance
     * @param {HTMLElement} container - The modal container element
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            initialFocus: options.initialFocus || null,
            returnFocusOnClose: options.returnFocusOnClose !== false,
            escapeDeactivates: options.escapeDeactivates !== false,
            onActivate: options.onActivate || null,
            onDeactivate: options.onDeactivate || null,
            clickOutsideDeactivates: options.clickOutsideDeactivates || false,
            ...options
        };

        this.active = false;
        this.previousFocus = null;
        this.focusableElements = [];
        this.firstFocusable = null;
        this.lastFocusable = null;

        // Bind event handlers
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    /**
     * Query for all focusable elements within the container
     * @private
     */
    updateFocusableElements() {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ].join(', ');

        this.focusableElements = Array.from(
            this.container.querySelectorAll(focusableSelectors)
        ).filter(el => {
            // Filter out hidden elements
            return el.offsetParent !== null &&
                   getComputedStyle(el).visibility !== 'hidden' &&
                   !el.hasAttribute('aria-hidden');
        });

        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
    }

    /**
     * Activate the focus trap
     */
    activate() {
        if (this.active) return;

        // Store the currently focused element
        this.previousFocus = document.activeElement;

        // Update focusable elements
        this.updateFocusableElements();

        // Set up event listeners
        document.addEventListener('keydown', this.handleKeydown);

        if (this.options.clickOutsideDeactivates) {
            document.addEventListener('mousedown', this.handleClickOutside);
        }

        // Set initial focus
        this.setInitialFocus();

        // Mark as active
        this.active = true;

        // Set ARIA attributes
        this.container.setAttribute('aria-modal', 'true');
        this.container.setAttribute('aria-hidden', 'false');

        // Callback
        if (typeof this.options.onActivate === 'function') {
            this.options.onActivate();
        }

        // Announce modal to screen readers
        this.announceModal();
    }

    /**
     * Deactivate the focus trap
     */
    deactivate() {
        if (!this.active) return;

        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('mousedown', this.handleClickOutside);

        // Restore focus to previous element
        if (this.options.returnFocusOnClose && this.previousFocus) {
            this.previousFocus.focus();
        }

        // Mark as inactive
        this.active = false;

        // Update ARIA attributes
        this.container.setAttribute('aria-hidden', 'true');

        // Callback
        if (typeof this.options.onDeactivate === 'function') {
            this.options.onDeactivate();
        }
    }

    /**
     * Set initial focus when trap activates
     * @private
     */
    setInitialFocus() {
        let focusTarget = null;

        // Priority 1: Explicit initial focus element
        if (this.options.initialFocus) {
            if (typeof this.options.initialFocus === 'string') {
                focusTarget = this.container.querySelector(this.options.initialFocus);
            } else if (this.options.initialFocus instanceof HTMLElement) {
                focusTarget = this.options.initialFocus;
            }
        }

        // Priority 2: Element with autofocus attribute
        if (!focusTarget) {
            focusTarget = this.container.querySelector('[autofocus]');
        }

        // Priority 3: First focusable element
        if (!focusTarget) {
            focusTarget = this.firstFocusable;
        }

        // Priority 4: Container itself (as last resort)
        if (!focusTarget) {
            focusTarget = this.container;
            this.container.setAttribute('tabindex', '-1');
        }

        if (focusTarget) {
            // Delay focus to ensure modal is visible
            setTimeout(() => {
                focusTarget.focus();
            }, 100);
        }
    }

    /**
     * Handle keydown events for tab navigation and escape key
     * @private
     * @param {KeyboardEvent} event
     */
    handleKeydown(event) {
        if (!this.active) return;

        // Escape key
        if (event.key === 'Escape' && this.options.escapeDeactivates) {
            event.preventDefault();
            this.deactivate();
            return;
        }

        // Tab key
        if (event.key === 'Tab') {
            // Update focusable elements in case DOM changed
            this.updateFocusableElements();

            if (this.focusableElements.length === 0) {
                event.preventDefault();
                return;
            }

            if (this.focusableElements.length === 1) {
                event.preventDefault();
                this.firstFocusable.focus();
                return;
            }

            // Shift + Tab (backwards)
            if (event.shiftKey) {
                if (document.activeElement === this.firstFocusable) {
                    event.preventDefault();
                    this.lastFocusable.focus();
                }
            }
            // Tab (forwards)
            else {
                if (document.activeElement === this.lastFocusable) {
                    event.preventDefault();
                    this.firstFocusable.focus();
                }
            }
        }
    }

    /**
     * Handle click outside modal
     * @private
     * @param {MouseEvent} event
     */
    handleClickOutside(event) {
        if (!this.container.contains(event.target)) {
            this.deactivate();
        }
    }

    /**
     * Announce modal opening to screen readers
     * @private
     */
    announceModal() {
        const title = this.container.getAttribute('aria-labelledby');
        if (title) {
            const titleElement = document.getElementById(title);
            if (titleElement) {
                // Screen readers will announce this
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.className = 'sr-only';
                announcement.textContent = `Modal abierto: ${titleElement.textContent}`;
                document.body.appendChild(announcement);

                setTimeout(() => {
                    announcement.remove();
                }, 1000);
            }
        }
    }

    /**
     * Check if trap is currently active
     * @returns {boolean}
     */
    isActive() {
        return this.active;
    }

    /**
     * Update the focus trap when content changes
     */
    updateTrap() {
        if (this.active) {
            this.updateFocusableElements();
        }
    }

    /**
     * Pause the focus trap without deactivating
     */
    pause() {
        if (this.active) {
            document.removeEventListener('keydown', this.handleKeydown);
        }
    }

    /**
     * Resume a paused focus trap
     */
    resume() {
        if (this.active) {
            document.addEventListener('keydown', this.handleKeydown);
        }
    }

    /**
     * Destroy the focus trap and clean up
     */
    destroy() {
        this.deactivate();
        this.container = null;
        this.options = null;
        this.focusableElements = [];
        this.previousFocus = null;
    }
}

/**
 * Helper function to create and manage a focus trap
 * @param {HTMLElement|string} containerSelector - Container element or selector
 * @param {Object} options - Focus trap options
 * @returns {FocusTrap}
 */
export function createFocusTrap(containerSelector, options = {}) {
    const container = typeof containerSelector === 'string'
        ? document.querySelector(containerSelector)
        : containerSelector;

    if (!container) {
        throw new Error(`FocusTrap: Container not found: ${containerSelector}`);
    }

    return new FocusTrap(container, options);
}

/**
 * Global focus trap manager for managing multiple traps
 */
export class FocusTrapManager {
    constructor() {
        this.traps = new Map();
        this.stack = [];
    }

    /**
     * Create and register a focus trap
     * @param {string} id - Unique identifier for the trap
     * @param {HTMLElement|string} container - Container element or selector
     * @param {Object} options - Focus trap options
     * @returns {FocusTrap}
     */
    createTrap(id, container, options = {}) {
        if (this.traps.has(id)) {
            console.warn(`FocusTrap with id "${id}" already exists`);
            return this.traps.get(id);
        }

        const trap = createFocusTrap(container, options);
        this.traps.set(id, trap);
        return trap;
    }

    /**
     * Activate a trap by ID
     * @param {string} id
     */
    activate(id) {
        const trap = this.traps.get(id);
        if (!trap) {
            console.error(`FocusTrap "${id}" not found`);
            return;
        }

        // Pause current active trap
        if (this.stack.length > 0) {
            const currentId = this.stack[this.stack.length - 1];
            const currentTrap = this.traps.get(currentId);
            if (currentTrap) {
                currentTrap.pause();
            }
        }

        // Activate new trap
        trap.activate();
        this.stack.push(id);
    }

    /**
     * Deactivate a trap by ID
     * @param {string} id
     */
    deactivate(id) {
        const trap = this.traps.get(id);
        if (!trap) {
            console.error(`FocusTrap "${id}" not found`);
            return;
        }

        trap.deactivate();

        // Remove from stack
        const index = this.stack.indexOf(id);
        if (index > -1) {
            this.stack.splice(index, 1);
        }

        // Resume previous trap
        if (this.stack.length > 0) {
            const previousId = this.stack[this.stack.length - 1];
            const previousTrap = this.traps.get(previousId);
            if (previousTrap) {
                previousTrap.resume();
            }
        }
    }

    /**
     * Remove a trap from the manager
     * @param {string} id
     */
    removeTrap(id) {
        const trap = this.traps.get(id);
        if (trap) {
            trap.destroy();
            this.traps.delete(id);

            const index = this.stack.indexOf(id);
            if (index > -1) {
                this.stack.splice(index, 1);
            }
        }
    }

    /**
     * Get a trap by ID
     * @param {string} id
     * @returns {FocusTrap|undefined}
     */
    getTrap(id) {
        return this.traps.get(id);
    }

    /**
     * Deactivate all traps
     */
    deactivateAll() {
        this.traps.forEach(trap => trap.deactivate());
        this.stack = [];
    }

    /**
     * Destroy all traps
     */
    destroyAll() {
        this.traps.forEach(trap => trap.destroy());
        this.traps.clear();
        this.stack = [];
    }
}

// Export singleton instance
export const focusTrapManager = new FocusTrapManager();

export default FocusTrap;

/**
 * @fileoverview Sidebar toggle and responsive behavior management
 * @module core/SidebarManager
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

/**
 * @typedef {Object} SidebarManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {import('./StateManager.js').StateManager} stateManager - State manager
 * @property {Document} [document] - Document reference
 * @property {Window} [window] - Window reference
 */

/**
 * Manages sidebar toggle behavior for both mobile and desktop.
 * Handles collapse state, overlay interactions, and responsive breakpoints.
 *
 * @class SidebarManager
 * @example
 * const sidebarManager = new SidebarManager({ eventBus, stateManager });
 * sidebarManager.init();
 */
export class SidebarManager {
    /**
     * Event bus for sidebar events
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
     * Window reference
     * @type {Window}
     * @private
     */
    #window;

    /**
     * Sidebar element
     * @type {HTMLElement|null}
     * @private
     */
    #sidebar = null;

    /**
     * Overlay element
     * @type {HTMLElement|null}
     * @private
     */
    #overlay = null;

    /**
     * Menu toggle button
     * @type {HTMLElement|null}
     * @private
     */
    #menuToggle = null;

    /**
     * Main content element
     * @type {HTMLElement|null}
     * @private
     */
    #mainContent = null;

    /**
     * Desktop breakpoint in pixels
     * @type {number}
     * @private
     */
    #desktopBreakpoint = 1024;

    /**
     * Creates a new SidebarManager instance
     *
     * @param {SidebarManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If required dependencies are missing
     */
    constructor({ eventBus, stateManager, document: doc = null, window: win = null }) {
        if (!eventBus) {
            throw new TypeError('SidebarManager requires an EventBus instance');
        }
        if (!stateManager) {
            throw new TypeError('SidebarManager requires a StateManager instance');
        }

        this.#eventBus = eventBus;
        this.#stateManager = stateManager;
        this.#document = doc || (typeof document !== 'undefined' ? document : null);
        this.#window = win || (typeof window !== 'undefined' ? window : null);
    }

    /**
     * Initializes sidebar bindings and restores saved state
     *
     * @returns {void}
     *
     * @example
     * sidebarManager.init();
     */
    init() {
        this.#cacheElements();
        this.#restoreSavedState();
        this.#bindToggleButton();
        this.#bindOverlayClick();
        this.#bindNavItemsClose();
        this.#bindWindowResize();
    }

    /**
     * Caches DOM element references
     * @private
     */
    #cacheElements() {
        if (!this.#document) return;

        this.#sidebar = this.#document.getElementById('sidebar');
        this.#overlay = this.#document.getElementById('sidebarOverlay');
        this.#menuToggle = this.#document.getElementById('menuToggle');
        this.#mainContent = this.#document.querySelector('.main-content');
    }

    /**
     * Restores saved collapse state on desktop
     * @private
     */
    #restoreSavedState() {
        if (!this.#sidebar || !this.#mainContent || !this.#window) return;

        const isCollapsed = this.#stateManager.get('sidebarCollapsed', false);

        if (isCollapsed && this.#window.innerWidth > this.#desktopBreakpoint) {
            this.#sidebar.classList.add('collapsed');
            this.#mainContent.classList.add('sidebar-collapsed');
        }
    }

    /**
     * Binds the menu toggle button
     * @private
     */
    #bindToggleButton() {
        if (!this.#menuToggle) return;

        this.#menuToggle.addEventListener('click', () => {
            this.toggle();
        });
    }

    /**
     * Binds overlay click to close sidebar
     * @private
     */
    #bindOverlayClick() {
        if (!this.#overlay) return;

        this.#overlay.addEventListener('click', () => {
            this.closeMobile();
        });
    }

    /**
     * Binds nav items to close sidebar on mobile
     * @private
     */
    #bindNavItemsClose() {
        if (!this.#document) return;

        this.#document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (this.#isMobile()) {
                    this.closeMobile();
                }
            });
        });
    }

    /**
     * Binds window resize handler
     * @private
     */
    #bindWindowResize() {
        if (!this.#window) return;

        this.#window.addEventListener('resize', () => {
            if (!this.#isMobile()) {
                this.closeMobile();
            }
        });
    }

    /**
     * Checks if current viewport is mobile
     * @returns {boolean} True if mobile viewport
     * @private
     */
    #isMobile() {
        return this.#window ? this.#window.innerWidth <= this.#desktopBreakpoint : false;
    }

    /**
     * Toggles sidebar state (mobile: open/close, desktop: collapse/expand)
     *
     * @returns {void}
     *
     * @example
     * sidebarManager.toggle();
     */
    toggle() {
        if (this.#isMobile()) {
            this.#toggleMobile();
        } else {
            this.#toggleDesktop();
        }
    }

    /**
     * Toggles mobile sidebar with overlay
     * @private
     */
    #toggleMobile() {
        if (!this.#sidebar || !this.#overlay) return;

        this.#sidebar.classList.toggle('active');
        this.#overlay.classList.toggle('active');

        this.#eventBus.emit('sidebar:toggled', {
            mode: 'mobile',
            isOpen: this.#sidebar.classList.contains('active')
        });
    }

    /**
     * Toggles desktop sidebar collapse
     * @private
     */
    #toggleDesktop() {
        if (!this.#sidebar || !this.#mainContent) return;

        this.#sidebar.classList.toggle('collapsed');
        this.#mainContent.classList.toggle('sidebar-collapsed');

        const isCollapsed = this.#sidebar.classList.contains('collapsed');
        this.#stateManager.set('sidebarCollapsed', isCollapsed);

        this.#eventBus.emit('sidebar:toggled', {
            mode: 'desktop',
            isCollapsed
        });
    }

    /**
     * Closes mobile sidebar
     *
     * @returns {void}
     *
     * @example
     * sidebarManager.closeMobile();
     */
    closeMobile() {
        if (!this.#sidebar || !this.#overlay) return;

        this.#sidebar.classList.remove('active');
        this.#overlay.classList.remove('active');
    }

    /**
     * Checks if sidebar is collapsed (desktop mode)
     *
     * @returns {boolean} True if collapsed
     *
     * @example
     * if (sidebarManager.isCollapsed()) {
     *     console.log('Sidebar is minimized');
     * }
     */
    isCollapsed() {
        return this.#sidebar?.classList.contains('collapsed') ?? false;
    }

    /**
     * Checks if mobile sidebar is open
     *
     * @returns {boolean} True if open
     *
     * @example
     * if (sidebarManager.isMobileOpen()) {
     *     sidebarManager.closeMobile();
     * }
     */
    isMobileOpen() {
        return this.#sidebar?.classList.contains('active') ?? false;
    }
}

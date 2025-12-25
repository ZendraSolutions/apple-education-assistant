/**
 * @fileoverview Jamf Assistant - Main Application Orchestrator
 * @module app
 * @version 3.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Main application orchestrator that coordinates all modules.
 *
 * Follows SOLID Principles:
 * - Single Responsibility: Only handles orchestration and event routing
 * - Open/Closed: Uses Registry Pattern for extensible views
 * - Liskov Substitution: Dependencies are injected as abstractions
 * - Interface Segregation: Modules only expose what they need
 * - Dependency Inversion: Receives container, doesn't create dependencies
 *
 * This version uses IoC Container for dependency injection.
 * All dependencies are resolved from the container, enabling:
 * - Easy testing with mock dependencies
 * - Clear dependency graph
 * - Single source of truth for service creation
 *
 * @example
 * // Usage with container (from main.js)
 * import { createContainer } from './core/bootstrap.js';
 * import { JamfAssistant } from './app.js';
 *
 * const container = createContainer();
 * const app = new JamfAssistant(container);
 */

import { AppEvents } from './utils/EventBus.js';

/**
 * Main application orchestrator.
 * Receives all dependencies from IoC container.
 *
 * @class JamfAssistant
 *
 * @example
 * // With container
 * const app = new JamfAssistant(container);
 *
 * @example
 * // Legacy compatibility (creates own container)
 * const app = new JamfAssistant();
 */
export class JamfAssistant {
    /**
     * IoC Container reference
     * @type {import('./core/Container.js').Container}
     * @private
     */
    #container;

    /**
     * Event bus for inter-module communication
     * @type {import('./utils/EventBus.js').EventBus}
     * @private
     */
    #eventBus;

    /**
     * State manager for persistence
     * @type {import('./core/StateManager.js').StateManager}
     * @private
     */
    #stateManager;

    /**
     * Section registry for views
     * @type {import('./patterns/SectionRegistry.js').SectionRegistry}
     * @private
     */
    #sectionRegistry;

    /**
     * Guide manager reference
     * @type {import('./features/GuideManager.js').GuideManager}
     * @private
     */
    #guideManager;

    /**
     * Diagnostics manager reference
     * @type {import('./features/DiagnosticsManager.js').DiagnosticsManager}
     * @private
     */
    #diagnosticsManager;

    /**
     * Checklist manager reference
     * @type {import('./features/ChecklistManager.js').ChecklistManager}
     * @private
     */
    #checklistManager;

    /**
     * Data manager reference
     * @type {import('./features/DataManager.js').DataManager}
     * @private
     */
    #dataManager;

    /**
     * Creates application instance with dependency injection.
     *
     * @param {import('./core/Container.js').Container} container - IoC container with registered services
     * @throws {Error} If container is not provided
     */
    constructor(container) {
        if (!container) {
            throw new Error('[JamfAssistant] Container is required. Use createContainer() from bootstrap.js');
        }

        this.#container = container;
        this.#initializeFromContainer();
        this.#setupEventRouting();
        this.#renderInitialSection();
        this.#showUpdateInfo();
        this.#eventBus.emit(AppEvents.APP_READY);
    }

    /**
     * Resolves and initializes all dependencies from container.
     * This replaces the manual instantiation in the old version.
     *
     * @private
     */
    #initializeFromContainer() {
        // ====================================================================
        // RESOLVE CORE SERVICES (all singletons, already configured)
        // ====================================================================

        this.#eventBus = this.#container.resolve('eventBus');
        this.#stateManager = this.#container.resolve('stateManager');
        this.#sectionRegistry = this.#container.resolve('sectionRegistry');

        // ====================================================================
        // RESOLVE AND INITIALIZE UI MANAGERS
        // ====================================================================

        const themeManager = this.#container.resolve('themeManager');
        themeManager.init();

        const navigationManager = this.#container.resolve('navigationManager');
        navigationManager.init();

        const modalManager = this.#container.resolve('modalManager');
        modalManager.init();

        const sidebarManager = this.#container.resolve('sidebarManager');
        sidebarManager.init();

        // Toast Manager and Connection Status (no init needed)
        // ToastManager initializes itself in constructor
        // ConnectionStatus auto-starts monitoring
        this.#container.resolve('toastManager');
        this.#container.resolve('connectionStatus');

        // ====================================================================
        // RESOLVE AND INITIALIZE FEATURES
        // Features may need external globals (KnowledgeBase, Diagnostics)
        // ====================================================================

        // Get external globals from container (registered in main.js)
        const knowledgeBase = this.#container.tryResolve('knowledgeBase');
        const diagnostics = this.#container.tryResolve('diagnostics');

        // Search Engine - needs knowledgeBase and diagnostics
        const searchEngine = this.#container.resolve('searchEngine');
        // Inject additional dependencies that weren't in container registration
        if (knowledgeBase) searchEngine.knowledgeBase = knowledgeBase;
        if (diagnostics) searchEngine.diagnostics = diagnostics;
        searchEngine.init();

        // Diagnostics Manager
        this.#diagnosticsManager = this.#container.resolve('diagnosticsManager');
        if (diagnostics) this.#diagnosticsManager.diagnostics = diagnostics;
        this.#diagnosticsManager.init();

        // Checklist Manager - needs checklists from KnowledgeBase
        this.#checklistManager = this.#container.resolve('checklistManager');
        if (knowledgeBase?.checklists) {
            this.#checklistManager.checklists = knowledgeBase.checklists;
        }
        this.#checklistManager.init();

        // Guide Manager - needs knowledgeBase
        this.#guideManager = this.#container.resolve('guideManager');
        if (knowledgeBase) this.#guideManager.knowledgeBase = knowledgeBase;
        this.#guideManager.init();

        // Data Manager
        this.#dataManager = this.#container.resolve('dataManager');
        this.#dataManager.init();
    }

    /**
     * Sets up event routing between modules.
     * This is the coordination logic that ties modules together.
     *
     * @private
     */
    #setupEventRouting() {
        // Navigation changes trigger view rendering
        this.#eventBus.on(AppEvents.NAVIGATION_CHANGED, ({ section }) => {
            this.#renderSection(section);
        });

        // Search results trigger guide/diagnostic opening
        this.#eventBus.on(AppEvents.SEARCH_RESULTS, ({ type, id }) => {
            if (type === 'guide') {
                this.#guideManager.openGuide(id);
            } else if (type === 'diagnostic') {
                this.#diagnosticsManager.start(id);
            }
        });
    }

    /**
     * Renders a section to the content wrapper.
     * Uses SectionRegistry to get the view - no switch statements needed.
     *
     * @param {string} section - Section identifier
     * @private
     */
    #renderSection(section) {
        const wrapper = document.getElementById('contentWrapper');
        const view = this.#sectionRegistry.get(section);

        if (view && wrapper) {
            wrapper.innerHTML = view.render();
            this.#bindSectionEvents();
        } else if (wrapper && !view) {
            console.warn(`[JamfAssistant] Section "${section}" not found in registry`);
        }
    }

    /**
     * Renders the initial dashboard section.
     *
     * @private
     */
    #renderInitialSection() {
        this.#renderSection('dashboard');
    }

    /**
     * Binds event handlers for dynamic section content.
     * Called after each section render.
     *
     * @private
     */
    #bindSectionEvents() {
        // Quick access cards navigation
        document.querySelectorAll('[data-section]').forEach(el => {
            el.addEventListener('click', () => {
                const section = el.dataset.section;
                this.#eventBus.emit(AppEvents.NAVIGATION_BEFORE_CHANGE, { section });
                this.#eventBus.emit(AppEvents.NAVIGATION_CHANGED, { section });
                this.#updateNavActiveState(section);
            });
        });

        // Guide cards
        document.querySelectorAll('[data-guide]').forEach(el => {
            el.addEventListener('click', () => {
                this.#guideManager.openGuide(el.dataset.guide);
            });
        });

        // Diagnostic cards
        document.querySelectorAll('[data-diagnostic]').forEach(el => {
            el.addEventListener('click', () => {
                this.#diagnosticsManager.start(el.dataset.diagnostic);
            });
        });

        // Checklist cards
        document.querySelectorAll('[data-checklist]').forEach(el => {
            el.addEventListener('click', () => {
                this.#checklistManager.open(el.dataset.checklist);
            });
        });

        // Chatbot opener
        document.getElementById('openChatbot')?.addEventListener('click', () => {
            document.getElementById('chatbotPanel')?.classList.add('active');
        });

        // Mis Datos action cards
        this.#bindMisDatosEvents();
    }

    /**
     * Binds Mis Datos section events.
     *
     * @private
     */
    #bindMisDatosEvents() {
        document.getElementById('viewDataCard')?.addEventListener('click', () => {
            this.#dataManager.viewData();
        });

        document.getElementById('exportDataCard')?.addEventListener('click', () => {
            this.#dataManager.exportData();
        });

        document.getElementById('deleteDataCard')?.addEventListener('click', () => {
            this.#dataManager.confirmDelete();
        });

        document.getElementById('configApiCard')?.addEventListener('click', () => {
            document.getElementById('apiModal')?.classList.add('active');
        });
    }

    /**
     * Updates navigation active state.
     *
     * @param {string} section - Active section
     * @private
     */
    #updateNavActiveState(section) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
    }

    /**
     * Shows version update information in sidebar.
     *
     * @private
     */
    #showUpdateInfo() {
        const updateEl = document.getElementById('updateInfo');
        const knowledgeBase = this.#container.tryResolve('knowledgeBase');

        if (updateEl && knowledgeBase && knowledgeBase._metadata) {
            const meta = knowledgeBase._metadata;
            const version = DOMPurify.sanitize(meta.version);
            const lastUpdated = DOMPurify.sanitize(meta.lastUpdated);
            const articleCount = parseInt(meta.articleCount) || 0;

            updateEl.innerHTML = `
                <i class="ri-book-open-line update-icon"></i>
                <span class="update-text">v${version} - ${lastUpdated}<br>${articleCount} guias</span>
            `;
        }
    }

    /**
     * Gets the IoC container (for debugging/testing).
     *
     * @returns {import('./core/Container.js').Container}
     */
    get container() {
        return this.#container;
    }

    /**
     * Gets the event bus (for external subscriptions).
     *
     * @returns {import('./utils/EventBus.js').EventBus}
     */
    get eventBus() {
        return this.#eventBus;
    }
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

// NOTE: The DOMContentLoaded initialization has been moved to main.js
// This file now only exports the JamfAssistant class

// For legacy compatibility, if someone loads app.js directly via script tag
// and doesn't use main.js, provide a warning
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Check if main.js has initialized the app
        setTimeout(() => {
            if (!window.app && !window.__container__) {
                console.warn(
                    '[JamfAssistant] Legacy loading detected. ' +
                    'For IoC container support, load main.js instead of app.js directly.'
                );
            }
        }, 100);
    });
}

export default JamfAssistant;

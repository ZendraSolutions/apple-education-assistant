/**
 * @fileoverview Application Entry Point - Bootstrap and Initialization
 * @module main
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * This is the SINGLE entry point for the application. It:
 * 1. Creates the IoC container with all services configured
 * 2. Registers external global dependencies (KnowledgeBase, Diagnostics)
 * 3. Initializes the JamfAssistant application
 * 4. Sets up the chatbot
 *
 * This follows Dependency Inversion Principle (DIP):
 * - App.js no longer creates dependencies directly
 * - All dependencies flow through the container
 * - Testing is simplified by swapping the container
 *
 * @example
 * // The script tag in index.html loads this file
 * // <script type="module" src="js/main.js"></script>
 */

import { createContainer } from './core/bootstrap.js';
import { JamfAssistant } from './app.js';
import { OnboardingTour } from './ui/OnboardingTour.js';
import { TooltipManager } from './ui/TooltipManager.js';

// Import views to trigger self-registration with SectionRegistry
import './views/DashboardView.js';
import './views/EcosistemaView.js';
import './views/IPadsView.js';
import './views/MacsView.js';
import './views/AulaView.js';
import './views/TeacherView.js';
import './views/TroubleshootingView.js';
import './views/ChecklistsView.js';
import './views/MisDatosView.js';

/**
 * Register Service Worker for PWA functionality
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js', {
                scope: './'
            });

            console.log('[PWA] Service Worker registered successfully:', registration.scope);

            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('[PWA] New Service Worker found, installing...');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('[PWA] New version available! Reload to update.');
                        // Optionally show a toast notification to the user
                        if (window.toastManager) {
                            window.toastManager.show(
                                'Nueva versión disponible. Recarga la página para actualizar.',
                                'info',
                                10000
                            );
                        }
                    }
                });
            });

            // Handle service worker updates
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    console.log('[PWA] Controller changed, reloading page...');
                    window.location.reload();
                }
            });

        } catch (error) {
            console.error('[PWA] Service Worker registration failed:', error);
        }
    } else {
        console.log('[PWA] Service Workers not supported in this browser');
    }
}

/**
 * Initializes the application when DOM is ready.
 * This is the composition root - the only place where
 * dependencies are wired together.
 */
async function initializeApplication() {
    try {
        // ====================================================================
        // 0. Register Service Worker for PWA functionality
        // ====================================================================
        await registerServiceWorker();

        // ====================================================================
        // 1. Create IoC Container with all services configured
        // ====================================================================
        const container = createContainer({
            debug: false, // Set to true for dependency resolution logging
            rateLimitCalls: 10,
            rateLimitWindow: 60000
        });

        // ====================================================================
        // 2. Register external global dependencies
        // These are loaded via script tags before main.js
        // Note: knowledge-base.js uses async loading, so we must wait for it
        // ====================================================================

        // Wait for KnowledgeBase to be loaded (async dynamic imports)
        if (typeof KnowledgeBase === 'undefined') {
            console.log('[Main] Waiting for KnowledgeBase to load...');
            await new Promise((resolve, reject) => {
                // Check if already loaded
                if (typeof window.KnowledgeBase !== 'undefined') {
                    resolve();
                    return;
                }

                // Wait for the load event
                const timeout = setTimeout(() => {
                    console.warn('[Main] KnowledgeBase load timeout - continuing without it');
                    resolve();
                }, 5000);

                window.addEventListener('knowledgeBaseLoaded', () => {
                    clearTimeout(timeout);
                    console.log('[Main] KnowledgeBase loaded via event');
                    resolve();
                }, { once: true });
            });
        }

        // KnowledgeBase - Global object from knowledge-base.js
        if (typeof KnowledgeBase !== 'undefined') {
            container.registerInstance('knowledgeBase', KnowledgeBase);
            console.log('[Main] KnowledgeBase registered successfully');
        } else {
            console.warn('[Main] KnowledgeBase not found - some features may not work');
        }

        // Diagnostics - Global object from diagnostics.js
        if (typeof Diagnostics !== 'undefined') {
            container.registerInstance('diagnostics', Diagnostics);
        } else {
            console.warn('[Main] Diagnostics not found - troubleshooting may not work');
        }

        // ====================================================================
        // 3. Configure SectionRegistry with view dependencies
        // Views self-registered on import, now we set their dependencies
        // ====================================================================
        const sectionRegistry = container.resolve('sectionRegistry');
        const eventBus = container.resolve('eventBus');

        sectionRegistry.setDefaultDependencies({
            eventBus,
            knowledgeBase: container.tryResolve('knowledgeBase'),
            diagnostics: container.tryResolve('diagnostics')
        });

        // ====================================================================
        // 4. Create and initialize main application
        // ====================================================================
        const app = new JamfAssistant(container);

        // Expose for debugging (development only)
        if (typeof window !== 'undefined') {
            // Check if we're in development mode
            const isDev = window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1' ||
                          window.location.protocol === 'file:';

            if (isDev) {
                window.__container__ = container;
                window.__app__ = app;
                console.log('[Main] Development mode - container exposed as window.__container__');
            }

            // Always expose app for compatibility
            window.app = app;
        }

        // ====================================================================
        // 5. Initialize Chatbot
        // The chatbot is initialized separately for now to maintain
        // backward compatibility with the legacy JamfChatbot class
        // ====================================================================
        const chatbotCore = container.resolve('chatbotCore');
        await chatbotCore.init();

        // Expose chatbot for compatibility
        if (typeof window !== 'undefined') {
            window.chatbot = chatbotCore;
        }

        console.log('[Main] Application initialized successfully');
        console.log(`[Main] Registered services: ${container.size}`);

        // ====================================================================
        // 6. Initialize Tooltip System via Container (D-Principle)
        // Register factory in container to enable DI and testability
        // ====================================================================
        container.registerFactory('tooltipManager', () => new TooltipManager({
            delay: 300,
            offset: 8,
            preferredPlacement: 'top'
        }), true); // singleton

        const tooltipManager = container.resolve('tooltipManager');

        // Expose for debugging/testing
        if (typeof window !== 'undefined') {
            window.tooltipManager = tooltipManager;
        }

        console.log('[Main] Tooltip system initialized');

        // ====================================================================
        // 7. Initialize Onboarding Tour via Container (D-Principle)
        // Register factory in container to enable DI and testability
        // ====================================================================
        container.registerFactory('onboardingTour', () => new OnboardingTour(), true); // singleton

        const onboardingTour = container.resolve('onboardingTour');

        // Start tour after a short delay to ensure all elements are rendered
        setTimeout(() => {
            if (onboardingTour.shouldShow()) {
                console.log('[Main] Starting onboarding tour for first-time user');
                onboardingTour.start();
            }
        }, 1000);

        // Expose tour for debugging/testing
        if (typeof window !== 'undefined') {
            const isDev = window.location.hostname === 'localhost' ||
                          window.location.hostname === '127.0.0.1' ||
                          window.location.protocol === 'file:';

            if (isDev) {
                window.__tour__ = onboardingTour;
                console.log('[Main] Development mode - tour exposed as window.__tour__');
                console.log('[Main] Use window.__tour__.reset() to reset the tour');
            }
        }

    } catch (error) {
        console.error('[Main] Failed to initialize application:', error);

        // Show user-friendly error message
        const wrapper = document.getElementById('contentWrapper');
        if (wrapper) {
            wrapper.innerHTML = `
                <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
                    <h2 style="color: var(--accent-primary); margin-bottom: 16px;">Error de inicializacion</h2>
                    <p>No se pudo cargar la aplicacion. Por favor, recarga la pagina.</p>
                    <p style="font-size: 0.875em; margin-top: 16px; color: var(--text-tertiary);">
                        Error: ${error.message}
                    </p>
                    <button id="reload-btn" style="
                        margin-top: 24px;
                        padding: 12px 24px;
                        background: var(--accent-primary);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                    ">
                        Recargar pagina
                    </button>
                </div>
            `;

            // Add event listener instead of inline onclick (CSP compliance)
            document.getElementById('reload-btn')?.addEventListener('click', () => {
                location.reload();
            });
        }
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Wait for DOM to be ready, then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    // DOM is already ready
    initializeApplication();
}

// Export for potential testing
export { initializeApplication, registerServiceWorker };

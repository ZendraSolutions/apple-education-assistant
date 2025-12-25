/**
 * @fileoverview Onboarding Tour - Interactive first-time user guide
 * @module ui/OnboardingTour
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Custom onboarding tour implementation without external libraries.
 * Features:
 * - 7-step interactive tour
 * - Element highlighting with overlay
 * - Navigation controls (Next, Previous, Skip)
 * - LocalStorage persistence
 * - Responsive positioning
 * - Accessible keyboard navigation
 *
 * @example
 * const tour = new OnboardingTour();
 * tour.start();
 */

export class OnboardingTour {
    /**
     * Tour steps configuration
     * @type {Array<{target: string, title: string, content: string, position: string}>}
     * @private
     */
    #steps = [
        {
            target: '.dashboard-hero',
            title: 'Bienvenido a Apple Edu Assistant',
            content: 'Este es tu centro de control para gestionar el ecosistema educativo Apple. Desde aqui puedes acceder rapidamente a todas las herramientas y recursos.',
            position: 'bottom'
        },
        {
            target: '.sidebar',
            title: 'Navegacion en el Sidebar',
            content: 'Usa el menu lateral para navegar entre las diferentes secciones: Dashboard, Ecosistema, iPads, Macs, App Aula, y mas. Cada seccion contiene guias y recursos especificos.',
            position: 'right'
        },
        {
            target: '.quick-access-grid',
            title: 'Accesos Rapidos',
            content: 'Accede rapidamente a las herramientas mas utilizadas: ASM (School Manager), Jamf School, App Aula, y el Chatbot IA. Haz clic en cualquier tarjeta para comenzar.',
            position: 'bottom'
        },
        {
            target: '.search-container',
            title: 'Motor de Busqueda',
            content: 'Busca soluciones, guias y diagnosticos escribiendo aqui. El motor de busqueda inteligente te ayudara a encontrar respuestas rapidamente.',
            position: 'bottom'
        },
        {
            target: '.chatbot-fab',
            title: 'Chatbot IA - Tu Asistente Personal',
            content: 'Haz clic aqui para abrir el asistente con IA. Necesitaras configurar tu API Key de Google Gemini (gratuita) para usar esta funcionalidad.',
            position: 'left'
        },
        {
            target: '#themeToggle',
            title: 'Selector de Tema',
            content: 'Cambia entre modo claro y oscuro segun tus preferencias. El tema seleccionado se guardara automaticamente.',
            position: 'right'
        },
        {
            target: '.dashboard-hero',
            title: 'Listo para Empezar',
            content: 'Ya estas preparado para usar Apple Edu Assistant. Explora las diferentes secciones, utiliza el buscador, o pregunta al chatbot si necesitas ayuda. Este tour no volvera a mostrarse.',
            position: 'bottom'
        }
    ];

    /**
     * Current step index
     * @type {number}
     * @private
     */
    #currentStep = 0;

    /**
     * Tour overlay element
     * @type {HTMLElement|null}
     * @private
     */
    #overlay = null;

    /**
     * Tour tooltip element
     * @type {HTMLElement|null}
     * @private
     */
    #tooltip = null;

    /**
     * Highlight element
     * @type {HTMLElement|null}
     * @private
     */
    #highlight = null;

    /**
     * LocalStorage key for tour completion
     * @type {string}
     * @private
     */
    #storageKey = 'jamf-tour-completed';

    /**
     * Checks if tour should be shown (first visit)
     *
     * @returns {boolean} True if tour should be shown
     */
    shouldShow() {
        try {
            return localStorage.getItem(this.#storageKey) !== 'true';
        } catch (e) {
            console.warn('[OnboardingTour] LocalStorage not available:', e);
            return false;
        }
    }

    /**
     * Starts the onboarding tour
     */
    start() {
        if (!this.shouldShow()) {
            console.log('[OnboardingTour] Tour already completed');
            return;
        }

        console.log('[OnboardingTour] Starting tour');
        this.#currentStep = 0;
        this.#createElements();
        this.#showStep(this.#currentStep);
        this.#setupKeyboardNavigation();
    }

    /**
     * Creates tour DOM elements
     * @private
     */
    #createElements() {
        // Create overlay
        this.#overlay = document.createElement('div');
        this.#overlay.className = 'onboarding-overlay';
        this.#overlay.setAttribute('role', 'dialog');
        this.#overlay.setAttribute('aria-label', 'Tour de bienvenida');

        // Create highlight
        this.#highlight = document.createElement('div');
        this.#highlight.className = 'onboarding-highlight';

        // Create tooltip
        this.#tooltip = document.createElement('div');
        this.#tooltip.className = 'onboarding-tooltip';
        this.#tooltip.setAttribute('role', 'alertdialog');
        this.#tooltip.setAttribute('aria-live', 'polite');

        // Append to body
        document.body.appendChild(this.#overlay);
        document.body.appendChild(this.#highlight);
        document.body.appendChild(this.#tooltip);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    /**
     * Shows a specific step
     * @param {number} stepIndex - Step index to show
     * @private
     */
    #showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.#steps.length) {
            return;
        }

        const step = this.#steps[stepIndex];
        const target = document.querySelector(step.target);

        if (!target) {
            console.warn(`[OnboardingTour] Target not found: ${step.target}`);
            // Skip to next step
            if (stepIndex < this.#steps.length - 1) {
                this.#showStep(stepIndex + 1);
            } else {
                this.#complete();
            }
            return;
        }

        // Update current step
        this.#currentStep = stepIndex;

        // Position highlight around target
        this.#positionHighlight(target);

        // Render tooltip content
        this.#renderTooltip(step, stepIndex);

        // Position tooltip relative to target
        this.#positionTooltip(target, step.position);

        // Add animation classes
        this.#highlight.classList.add('active');
        this.#tooltip.classList.add('active');
        this.#overlay.classList.add('active');

        // Scroll target into view
        setTimeout(() => {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }, 100);
    }

    /**
     * Positions the highlight around target element
     * @param {HTMLElement} target - Target element
     * @private
     */
    #positionHighlight(target) {
        const rect = target.getBoundingClientRect();
        const padding = 8;

        this.#highlight.style.top = `${rect.top - padding + window.scrollY}px`;
        this.#highlight.style.left = `${rect.left - padding + window.scrollX}px`;
        this.#highlight.style.width = `${rect.width + padding * 2}px`;
        this.#highlight.style.height = `${rect.height + padding * 2}px`;
    }

    /**
     * Renders tooltip content
     * @param {Object} step - Step configuration
     * @param {number} stepIndex - Current step index
     * @private
     */
    #renderTooltip(step, stepIndex) {
        const isFirst = stepIndex === 0;
        const isLast = stepIndex === this.#steps.length - 1;
        const progress = ((stepIndex + 1) / this.#steps.length) * 100;

        this.#tooltip.innerHTML = `
            <div class="onboarding-tooltip-header">
                <h3 class="onboarding-tooltip-title">${step.title}</h3>
                <button class="onboarding-close" aria-label="Cerrar tour">
                    <i class="ri-close-line"></i>
                </button>
            </div>
            <div class="onboarding-tooltip-body">
                <p>${step.content}</p>
            </div>
            <div class="onboarding-tooltip-footer">
                <div class="onboarding-progress">
                    <div class="onboarding-progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="onboarding-tooltip-actions">
                    <button class="onboarding-btn onboarding-btn-skip" ${isLast ? 'style="display:none"' : ''}>
                        Saltar tour
                    </button>
                    <div class="onboarding-nav-buttons">
                        <button class="onboarding-btn onboarding-btn-prev" ${isFirst ? 'disabled' : ''}>
                            <i class="ri-arrow-left-line"></i> Anterior
                        </button>
                        <button class="onboarding-btn onboarding-btn-next">
                            ${isLast ? 'Finalizar' : 'Siguiente'}
                            ${isLast ? '<i class="ri-check-line"></i>' : '<i class="ri-arrow-right-line"></i>'}
                        </button>
                    </div>
                </div>
                <div class="onboarding-step-indicator">
                    Paso ${stepIndex + 1} de ${this.#steps.length}
                </div>
            </div>
        `;

        // Bind event listeners
        this.#tooltip.querySelector('.onboarding-close').addEventListener('click', () => this.#skip());
        this.#tooltip.querySelector('.onboarding-btn-skip')?.addEventListener('click', () => this.#skip());
        this.#tooltip.querySelector('.onboarding-btn-prev')?.addEventListener('click', () => this.#previous());
        this.#tooltip.querySelector('.onboarding-btn-next').addEventListener('click', () => this.#next());
    }

    /**
     * Positions tooltip relative to target
     * @param {HTMLElement} target - Target element
     * @param {string} position - Preferred position (top, bottom, left, right)
     * @private
     */
    #positionTooltip(target, position) {
        const rect = target.getBoundingClientRect();
        const tooltipRect = this.#tooltip.getBoundingClientRect();
        const spacing = 20;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top, left;

        // Calculate position based on preference
        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - spacing + window.scrollY;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + window.scrollX;
                break;

            case 'bottom':
                top = rect.bottom + spacing + window.scrollY;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + window.scrollX;
                break;

            case 'left':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2) + window.scrollY;
                left = rect.left - tooltipRect.width - spacing + window.scrollX;
                break;

            case 'right':
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2) + window.scrollY;
                left = rect.right + spacing + window.scrollX;
                break;

            default:
                top = rect.bottom + spacing + window.scrollY;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2) + window.scrollX;
        }

        // Adjust if tooltip goes off-screen
        if (left < 10) {
            left = 10;
        } else if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }

        if (top < 10) {
            top = rect.bottom + spacing + window.scrollY;
        } else if (top + tooltipRect.height > viewportHeight - 10 + window.scrollY) {
            top = rect.top - tooltipRect.height - spacing + window.scrollY;
        }

        this.#tooltip.style.top = `${top}px`;
        this.#tooltip.style.left = `${left}px`;

        // Add position class for arrow direction
        this.#tooltip.className = `onboarding-tooltip active onboarding-tooltip-${position}`;
    }

    /**
     * Goes to next step
     * @private
     */
    #next() {
        if (this.#currentStep < this.#steps.length - 1) {
            this.#showStep(this.#currentStep + 1);
        } else {
            this.#complete();
        }
    }

    /**
     * Goes to previous step
     * @private
     */
    #previous() {
        if (this.#currentStep > 0) {
            this.#showStep(this.#currentStep - 1);
        }
    }

    /**
     * Skips the tour
     * @private
     */
    #skip() {
        if (confirm('¿Seguro que quieres saltar el tour? Podras volver a verlo limpiando los datos del navegador.')) {
            this.#complete();
        }
    }

    /**
     * Completes and cleans up the tour
     * @private
     */
    #complete() {
        console.log('[OnboardingTour] Tour completed');

        // Mark as completed in localStorage
        try {
            localStorage.setItem(this.#storageKey, 'true');
        } catch (e) {
            console.warn('[OnboardingTour] Could not save completion state:', e);
        }

        // Remove elements with fade out
        this.#overlay?.classList.remove('active');
        this.#tooltip?.classList.remove('active');
        this.#highlight?.classList.remove('active');

        // Clean up after animation
        setTimeout(() => {
            this.#overlay?.remove();
            this.#tooltip?.remove();
            this.#highlight?.remove();
            document.body.style.overflow = '';
            this.#removeKeyboardNavigation();
        }, 300);
    }

    /**
     * Sets up keyboard navigation
     * @private
     */
    #setupKeyboardNavigation() {
        this.#handleKeyPress = this.#handleKeyPress.bind(this);
        document.addEventListener('keydown', this.#handleKeyPress);
    }

    /**
     * Removes keyboard navigation
     * @private
     */
    #removeKeyboardNavigation() {
        if (this.#handleKeyPress) {
            document.removeEventListener('keydown', this.#handleKeyPress);
        }
    }

    /**
     * Handles keyboard press events
     * @param {KeyboardEvent} e - Keyboard event
     * @private
     */
    #handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'Enter':
                e.preventDefault();
                this.#next();
                break;

            case 'ArrowLeft':
                e.preventDefault();
                this.#previous();
                break;

            case 'Escape':
                e.preventDefault();
                this.#skip();
                break;
        }
    }

    /**
     * Resets the tour (for testing purposes)
     */
    reset() {
        try {
            localStorage.removeItem(this.#storageKey);
            console.log('[OnboardingTour] Tour reset - will show on next page load');
        } catch (e) {
            console.warn('[OnboardingTour] Could not reset tour:', e);
        }
    }
}

export default OnboardingTour;

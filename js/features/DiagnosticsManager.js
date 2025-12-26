/**
 * @fileoverview Interactive diagnostic wizard management
 * @module features/DiagnosticsManager
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

import { AppEvents } from '../utils/EventBus.js';

/**
 * @typedef {Object} DiagnosticStep
 * @property {string} question - Step question text
 * @property {DiagnosticOption[]} options - Available options
 */

/**
 * @typedef {Object} DiagnosticOption
 * @property {string} text - Option text
 * @property {number} [next] - Next step index
 * @property {string} [solution] - Solution key if terminal
 */

/**
 * @typedef {Object} DiagnosticSolution
 * @property {string} title - Solution title
 * @property {string} content - Solution HTML content
 */

/**
 * @typedef {Object} Diagnostic
 * @property {string} title - Diagnostic title
 * @property {string} icon - Icon HTML/class
 * @property {DiagnosticStep[]} steps - Wizard steps
 * @property {Object<string, DiagnosticSolution>} solutions - Solution definitions
 */

/**
 * @typedef {Object} DiagnosticsManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {import('../core/ModalManager.js').ModalManager} modalManager - Modal manager
 * @property {Object<string, Diagnostic>} diagnostics - Diagnostics data
 */

/**
 * Manages interactive diagnostic wizards for troubleshooting.
 * Handles step navigation and solution display.
 *
 * @class DiagnosticsManager
 * @example
 * const diagnosticsManager = new DiagnosticsManager({
 *     eventBus,
 *     modalManager,
 *     diagnostics: Diagnostics
 * });
 *
 * diagnosticsManager.init();
 * diagnosticsManager.start('aula-no-funciona');
 */
export class DiagnosticsManager {
    /**
     * Event bus for diagnostic events
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
     * Diagnostics data
     * @type {Object<string, Diagnostic>}
     * @private
     */
    #diagnostics;

    /**
     * Current active diagnostic
     * @type {Diagnostic|null}
     * @private
     */
    #currentDiagnostic = null;

    /**
     * Current diagnostic ID
     * @type {string|null}
     * @private
     */
    #currentDiagnosticId = null;

    /**
     * Current step index
     * @type {number}
     * @private
     */
    #currentStep = 0;

    /**
     * Creates a new DiagnosticsManager instance
     *
     * @param {DiagnosticsManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If required dependencies are missing
     */
    constructor({ eventBus, modalManager, diagnostics }) {
        if (!eventBus) {
            throw new TypeError('DiagnosticsManager requires an EventBus instance');
        }
        if (!modalManager) {
            throw new TypeError('DiagnosticsManager requires a ModalManager instance');
        }

        // Graceful degradation - work without diagnostics data
        if (!diagnostics) {
            console.warn('[DiagnosticsManager] diagnostics data not provided - troubleshooting disabled');
        }

        this.#eventBus = eventBus;
        this.#modalManager = modalManager;
        this.#diagnostics = diagnostics || {};
    }

    /**
     * Initializes event subscriptions
     *
     * @returns {void}
     *
     * @example
     * diagnosticsManager.init();
     */
    init() {
        this.#subscribeToModalEvents();
    }

    /**
     * Subscribes to modal events for wizard interaction
     * @private
     */
    #subscribeToModalEvents() {
        this.#eventBus.on('modal:wizardOptionClicked', (data) => {
            if (this.#currentDiagnostic) {
                if (data.solution) {
                    this.#showSolution(data.solution);
                } else if (data.next !== null) {
                    this.#goToStep(data.next);
                }
            }
        });

        this.#eventBus.on('modal:diagnosticRestart', () => {
            if (this.#currentDiagnostic) {
                this.#restart();
            }
        });
    }

    /**
     * Starts a diagnostic wizard
     *
     * @param {string} diagnosticId - Diagnostic identifier
     * @returns {boolean} True if diagnostic was started
     * @fires DiagnosticsManager#diagnostic:started
     *
     * @example
     * diagnosticsManager.start('aula-no-funciona');
     */
    start(diagnosticId) {
        const diagnostic = this.#diagnostics[diagnosticId];
        if (!diagnostic) {
            console.warn(`[DiagnosticsManager] Diagnostic not found: ${diagnosticId}`);
            return false;
        }

        this.#currentDiagnostic = diagnostic;
        this.#currentDiagnosticId = diagnosticId;
        this.#currentStep = 0;

        this.#renderCurrentStep();

        this.#eventBus.emit(AppEvents.DIAGNOSTIC_STARTED, {
            id: diagnosticId,
            title: diagnostic.title
        });

        return true;
    }

    /**
     * Goes to a specific step
     * @param {number} stepIndex - Target step index
     * @private
     */
    #goToStep(stepIndex) {
        if (!this.#currentDiagnostic) return;

        if (stepIndex < 0 || stepIndex >= this.#currentDiagnostic.steps.length) {
            console.warn(`[DiagnosticsManager] Invalid step index: ${stepIndex}`);
            return;
        }

        this.#currentStep = stepIndex;
        this.#renderCurrentStep();

        this.#eventBus.emit(AppEvents.DIAGNOSTIC_STEP_CHANGED, {
            id: this.#currentDiagnosticId,
            step: stepIndex,
            totalSteps: this.#currentDiagnostic.steps.length
        });
    }

    /**
     * Renders the current step in the modal
     * @private
     */
    #renderCurrentStep() {
        if (!this.#currentDiagnostic) return;

        const step = this.#currentDiagnostic.steps[this.#currentStep];
        const html = this.#buildStepHtml(step);

        this.#modalManager.show(html);
    }

    /**
     * Builds HTML for a diagnostic step
     * @param {DiagnosticStep} step - Step data
     * @returns {string} Step HTML
     * @private
     */
    #buildStepHtml(step) {
        const diag = this.#currentDiagnostic;

        return `
            <h2>${diag.icon} ${diag.title}</h2>
            <div class="diagnostic-wizard">
                <div class="wizard-progress">
                    Paso ${this.#currentStep + 1} de ${diag.steps.length}
                </div>
                <h3>${step.question}</h3>
                <div class="wizard-options">
                    ${step.options.map(opt => `
                        <button class="wizard-option"
                                data-next="${opt.next !== undefined ? opt.next : ''}"
                                data-solution="${opt.solution || ''}">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Shows a diagnostic solution
     * @param {string} solutionKey - Solution identifier
     * @private
     */
    #showSolution(solutionKey) {
        if (!this.#currentDiagnostic) return;

        const solution = this.#currentDiagnostic.solutions[solutionKey];
        if (!solution) {
            console.warn(`[DiagnosticsManager] Solution not found: ${solutionKey}`);
            return;
        }

        const html = this.#buildSolutionHtml(solution);
        this.#modalManager.show(html);

        this.#eventBus.emit(AppEvents.DIAGNOSTIC_COMPLETED, {
            id: this.#currentDiagnosticId,
            solution: solutionKey
        });
    }

    /**
     * Builds HTML for a solution display
     * @param {DiagnosticSolution} solution - Solution data
     * @returns {string} Solution HTML
     * @private
     */
    #buildSolutionHtml(solution) {
        return `
            <h2><i class="ri-lightbulb-flash-line"></i> Solucion encontrada</h2>
            <div class="solution-box">
                <h3>${solution.title}</h3>
                ${solution.content}
            </div>
            <button class="diagnostic-btn" id="restartDiag" style="margin-top: 20px;">
                Volver a empezar
            </button>
        `;
    }

    /**
     * Restarts the current diagnostic from the beginning
     * @private
     */
    #restart() {
        this.#currentStep = 0;
        this.#renderCurrentStep();
    }

    /**
     * Gets the current diagnostic state
     *
     * @returns {Object|null} Current state or null if no active diagnostic
     *
     * @example
     * const state = diagnosticsManager.getCurrentState();
     * if (state) {
     *     console.log(`Step ${state.step} of ${state.totalSteps}`);
     * }
     */
    getCurrentState() {
        if (!this.#currentDiagnostic) return null;

        return {
            id: this.#currentDiagnosticId,
            step: this.#currentStep,
            totalSteps: this.#currentDiagnostic.steps.length,
            title: this.#currentDiagnostic.title
        };
    }

    /**
     * Checks if a diagnostic is currently active
     *
     * @returns {boolean} True if a diagnostic is active
     *
     * @example
     * if (diagnosticsManager.isActive()) {
     *     // Diagnostic wizard is open
     * }
     */
    isActive() {
        return this.#currentDiagnostic !== null;
    }

    /**
     * Gets available diagnostic IDs
     *
     * @returns {string[]} Array of diagnostic identifiers
     *
     * @example
     * const ids = diagnosticsManager.getAvailableDiagnostics();
     */
    getAvailableDiagnostics() {
        return Object.keys(this.#diagnostics);
    }

    /**
     * Gets a diagnostic by ID
     *
     * @param {string} id - Diagnostic identifier
     * @returns {Diagnostic|null} Diagnostic data or null
     *
     * @example
     * const diag = diagnosticsManager.getDiagnostic('aula-no-funciona');
     */
    getDiagnostic(id) {
        return this.#diagnostics[id] || null;
    }
}

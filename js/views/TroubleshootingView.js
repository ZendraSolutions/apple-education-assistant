/**
 * @fileoverview Troubleshooting section view rendering
 * @module views/TroubleshootingView
 * @version 1.1.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * This view self-registers with the SectionRegistry on import,
 * enabling the Open/Closed Principle - no modification to app.js needed.
 */

import { BaseView } from './BaseView.js';
import { sectionRegistry } from '../patterns/SectionRegistry.js';

/**
 * Renders the troubleshooting section with diagnostic wizard cards.
 *
 * @class TroubleshootingView
 * @extends BaseView
 * @example
 * const troubleshootingView = new TroubleshootingView({
 *     eventBus,
 *     diagnostics: Diagnostics
 * });
 * const html = troubleshootingView.render();
 */
export class TroubleshootingView extends BaseView {
    /**
     * Diagnostics data reference
     * @type {Object}
     * @private
     */
    #diagnostics;

    /**
     * Creates a new TroubleshootingView instance
     *
     * @param {Object} dependencies - Injected dependencies
     * @param {import('../utils/EventBus.js').EventBus} dependencies.eventBus - Event bus
     * @param {Object} dependencies.diagnostics - Diagnostics data
     */
    constructor({ eventBus, diagnostics }) {
        super({ eventBus });
        this.#diagnostics = diagnostics || {};
    }

    /**
     * Renders the troubleshooting view
     *
     * @returns {string} Troubleshooting HTML content
     * @override
     */
    render() {
        return this.wrapSection(`
            ${this.renderSectionHeader(
                'Troubleshooting',
                'Diagnostico guiado de problemas'
            )}
            <div class="diagnostic-cards">
                ${this.#renderDiagnosticCards()}
            </div>
        `);
    }

    /**
     * Renders all diagnostic cards
     * @returns {string} Diagnostic cards HTML
     * @private
     */
    #renderDiagnosticCards() {
        return Object.entries(this.#diagnostics).map(([key, diag]) => {
            return this.#renderDiagnosticCard(key, diag);
        }).join('');
    }

    /**
     * Renders a single diagnostic card
     * @param {string} key - Diagnostic identifier
     * @param {Object} diag - Diagnostic data
     * @returns {string} Diagnostic card HTML
     * @private
     */
    #renderDiagnosticCard(key, diag) {
        return `
            <div class="diagnostic-card" data-diagnostic="${key}">
                <div class="diagnostic-header">
                    <span class="diagnostic-icon">${diag.icon || ''}</span>
                    <span class="diagnostic-severity high">Diagnostico</span>
                </div>
                <h3>${diag.title || ''}</h3>
                <p>Sigue el asistente para encontrar la solucion</p>
                <button class="diagnostic-btn">Iniciar diagnostico -></button>
            </div>
        `;
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

sectionRegistry.register('troubleshooting', (deps) => new TroubleshootingView(deps), {
    displayName: 'Troubleshooting',
    icon: 'ri-bug-line',
    order: 7
});

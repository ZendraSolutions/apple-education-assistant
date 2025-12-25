/**
 * @fileoverview App Aula (Apple Classroom) view rendering
 * @module views/AulaView
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
 * Renders the App Aula section with comprehensive guides
 * for classroom control functionality.
 *
 * @class AulaView
 * @extends BaseView
 * @example
 * const aulaView = new AulaView({ eventBus, knowledgeBase });
 * const html = aulaView.render();
 */
export class AulaView extends BaseView {
    /**
     * Renders the Aula view
     *
     * @returns {string} Aula HTML content
     * @override
     */
    render() {
        const aula = this.knowledgeBase?.aula || {};

        return this.wrapSection(`
            ${this.renderSectionHeader(
                'App Aula (Apple Classroom)',
                'Control de aula para profesores - Herramienta de uso diario'
            )}
            ${this.#renderIntroInfoBox()}
            ${this.#renderHighlightInfoBox()}
            ${this.#renderBasicGuides(aula)}
            ${this.#renderAdvancedGuides(aula)}
            ${this.#renderTroubleshootingGuides(aula)}
        `);
    }

    /**
     * Renders introduction info box
     * @returns {string} Info box HTML
     * @private
     */
    #renderIntroInfoBox() {
        return this.renderInfoBox({
            icon: 'ri-lightbulb-line',
            title: 'Que es la App Aula?',
            content: '<p>Es la herramienta principal que los profesores usan todos los dias para controlar los iPads del alumnado. Permite ver pantallas, abrir apps, bloquear dispositivos y guiar la clase de forma interactiva.</p>'
        });
    }

    /**
     * Renders highlight info box
     * @returns {string} Info box HTML
     * @private
     */
    #renderHighlightInfoBox() {
        return `
            <div class="info-box" style="background: #fef3c7; border-color: #fbbf24;">
                <div class="info-icon" style="color: #f59e0b;"><i class="ri-star-line"></i></div>
                <div class="info-content">
                    <h4 style="color: #92400e;">Herramienta fundamental para profesores</h4>
                    <p style="color: #78350f;">Esta app se utiliza a diario en cada clase. Es importante que todos los profesores sepan usarla y que funcione correctamente.</p>
                </div>
            </div>
        `;
    }

    /**
     * Renders basic guides section
     * @param {Object} aula - Aula knowledge base data
     * @returns {string} Basic guides HTML
     * @private
     */
    #renderBasicGuides(aula) {
        return `
            ${this.renderContentTitle('ri-book-read-line', 'Guias Basicas')}
            <div class="guide-cards">
                ${this.renderGuideCard('aula-overview', aula.overview)}
                ${this.renderGuideCard('aula-howto', aula.howto)}
                ${this.renderGuideCard('aula-setup', aula.setup)}
            </div>
        `;
    }

    /**
     * Renders advanced guides section
     * @param {Object} aula - Aula knowledge base data
     * @returns {string} Advanced guides HTML
     * @private
     */
    #renderAdvancedGuides(aula) {
        return `
            ${this.renderContentTitle('ri-rocket-line', 'Funciones Avanzadas')}
            <div class="guide-cards">
                ${this.renderGuideCard('aula-advanced', aula.advanced)}
                ${this.renderGuideCard('aula-remotehybrid', aula.remotehybrid)}
                ${this.renderGuideCard('aula-sharedipad', aula.sharedipad)}
            </div>
        `;
    }

    /**
     * Renders troubleshooting guides section
     * @param {Object} aula - Aula knowledge base data
     * @returns {string} Troubleshooting guides HTML
     * @private
     */
    #renderTroubleshootingGuides(aula) {
        return `
            ${this.renderContentTitle('ri-tools-line', 'Solucionar Problemas')}
            <div class="guide-cards">
                ${this.renderGuideCard('aula-troubleshoot', aula.troubleshoot)}
            </div>
        `;
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

// Register both 'aula' and 'classroom' as aliases (backward compatibility)
sectionRegistry.register('aula', (deps) => new AulaView(deps), {
    displayName: 'App Aula',
    icon: 'ri-group-line',
    order: 5
});

sectionRegistry.register('classroom', (deps) => new AulaView(deps), {
    displayName: 'Classroom',
    icon: 'ri-group-line',
    order: 5,
    hidden: true // Hide from navigation (alias only)
});

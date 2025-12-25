/**
 * @fileoverview Ecosistema Apple Education view rendering
 * @module views/EcosistemaView
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
 * Renders the Apple Education ecosystem overview with diagrams
 * and component explanations.
 *
 * @class EcosistemaView
 * @extends BaseView
 * @example
 * const ecosistemaView = new EcosistemaView({ eventBus, knowledgeBase });
 * const html = ecosistemaView.render();
 */
export class EcosistemaView extends BaseView {
    /**
     * Renders the ecosistema view
     *
     * @returns {string} Ecosistema HTML content
     * @override
     */
    render() {
        return this.wrapSection(`
            ${this.renderSectionHeader(
                'Ecosistema Apple Education',
                'Como funciona todo el sistema integrado'
            )}
            ${this.#renderIntroInfoBox()}
            ${this.#renderEcosystemDiagram()}
            ${this.#renderAulaFlowDiagram()}
            ${this.#renderComponentCards()}
            ${this.#renderTroubleshootingFlow()}
            ${this.#renderWhyStructure()}
        `);
    }

    /**
     * Renders introduction info box
     * @returns {string} Info box HTML
     * @private
     */
    #renderIntroInfoBox() {
        return this.renderInfoBox({
            icon: 'ri-information-line',
            title: 'El ecosistema educativo de Apple',
            content: '<p>Tres piezas trabajando juntas: <strong>ASM</strong> (centro del sistema) -> <strong>Jamf School</strong> (gestion) -> <strong>App Aula</strong> (uso diario).</p>'
        });
    }

    /**
     * Renders ecosystem diagram
     * @returns {string} Diagram HTML
     * @private
     */
    #renderEcosystemDiagram() {
        const diagram = this.knowledgeBase?.diagrams?.ecosystem;
        if (!diagram) return '';

        return `
            ${this.renderContentTitle('ri-organization-chart', 'Diagrama del Ecosistema')}
            ${diagram.html}
        `;
    }

    /**
     * Renders Aula flow diagram
     * @returns {string} Flow diagram HTML
     * @private
     */
    #renderAulaFlowDiagram() {
        const diagram = this.knowledgeBase?.diagrams?.aulaFlow;
        if (!diagram) return '';

        return `
            ${this.renderContentTitle('ri-route-line', 'Como llega la clase a la App Aula?')}
            ${diagram.html}
        `;
    }

    /**
     * Renders component cards
     * @returns {string} Component cards HTML
     * @private
     */
    #renderComponentCards() {
        return `
            ${this.renderContentTitle('ri-layout-grid-line', 'Componentes del Sistema')}
            <div class="guide-cards">
                ${this.#renderComponentCard(
                    'ecosistema-asm',
                    'ri-cloud-line',
                    'Centro',
                    'Apple School Manager',
                    'Portal de Apple donde se crean usuarios, clases y se asignan dispositivos. Todo empieza aqui.',
                    '<i class="ri-link"></i> school.apple.com'
                )}
                ${this.#renderComponentCard(
                    'ecosistema-jamf',
                    'ri-settings-3-line',
                    'Gestion',
                    'Jamf School',
                    'MDM que recibe datos de ASM. Aqui se configuran restricciones, se instalan apps y se organizan grupos.',
                    '<i class="ri-smartphone-line"></i> Configuracion remota'
                )}
                ${this.#renderComponentCard(
                    'aula-overview',
                    'ri-group-line',
                    'Uso diario',
                    'App Aula',
                    'App que usan los profesores para controlar iPads en clase: ver pantallas, abrir apps, bloquear dispositivos.',
                    '<i class="ri-eye-line"></i> Control en tiempo real',
                    true
                )}
            </div>
        `;
    }

    /**
     * Renders a single component card
     * @param {string} guide - Guide ID
     * @param {string} icon - Icon class
     * @param {string} tag - Tag text
     * @param {string} title - Card title
     * @param {string} description - Card description
     * @param {string} meta - Meta info HTML
     * @param {boolean} [highlight=false] - Highlight card
     * @returns {string} Component card HTML
     * @private
     */
    #renderComponentCard(guide, icon, tag, title, description, meta, highlight = false) {
        const tagClass = highlight ? 'hot-tag' : '';
        return `
            <div class="guide-card ${highlight ? 'highlight-card' : ''}" data-guide="${guide}">
                <div class="guide-header">
                    <span class="guide-icon"><i class="${icon}"></i></span>
                    <span class="guide-tag ${tagClass}">${tag}</span>
                </div>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="guide-meta">
                    <span>${meta}</span>
                </div>
            </div>
        `;
    }

    /**
     * Renders troubleshooting flow diagram
     * @returns {string} Troubleshooting flow HTML
     * @private
     */
    #renderTroubleshootingFlow() {
        const diagram = this.knowledgeBase?.diagrams?.troubleshootFlow;
        if (!diagram) return '';

        return `
            ${this.renderContentTitle('ri-bug-line', 'Cuando algo no funciona')}
            ${diagram.html}
        `;
    }

    /**
     * Renders why structure section
     * @returns {string} Why structure HTML
     * @private
     */
    #renderWhyStructure() {
        return `
            ${this.renderContentTitle('ri-question-line', 'Por que esta estructura?')}
            <div class="action-cards">
                <div class="action-card">
                    <div class="action-icon"><i class="ri-shield-check-line"></i></div>
                    <h3>Seguridad y privacidad</h3>
                    <p>Los dispositivos son propiedad del centro, con Apple IDs gestionados que protegen a los menores</p>
                </div>
                <div class="action-card">
                    <div class="action-icon"><i class="ri-refresh-line"></i></div>
                    <h3>Gestion automatizada</h3>
                    <p>Los cambios en Jamf se aplican automaticamente sin tocar los dispositivos fisicamente</p>
                </div>
                <div class="action-card">
                    <div class="action-icon"><i class="ri-team-line"></i></div>
                    <h3>Control pedagogico</h3>
                    <p>Los profesores tienen autonomia para gestionar su aula sin depender de IT</p>
                </div>
            </div>
        `;
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

sectionRegistry.register('ecosistema', (deps) => new EcosistemaView(deps), {
    displayName: 'Ecosistema',
    icon: 'ri-cloud-line',
    order: 2
});

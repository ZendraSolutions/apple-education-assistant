/**
 * @fileoverview Jamf Teacher view rendering
 * @module views/TeacherView
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
 * Renders the Jamf Teacher section showing configuration
 * and usage guides for teacher app management.
 *
 * @class TeacherView
 * @extends BaseView
 * @example
 * const teacherView = new TeacherView({ eventBus, knowledgeBase });
 * const html = teacherView.render();
 */
export class TeacherView extends BaseView {
    /**
     * Renders the Teacher view
     *
     * @returns {string} Teacher HTML content
     * @override
     */
    render() {
        const guide = this.knowledgeBase?.teacher?.setup;

        return this.wrapSection(`
            ${this.renderSectionHeader(
                'Jamf Teacher',
                'Permite a profesores gestionar apps del alumnado'
            )}
            ${guide?.content || this.#renderFallbackContent()}
        `);
    }

    /**
     * Renders fallback content when guide is not available
     * @returns {string} Fallback content HTML
     * @private
     */
    #renderFallbackContent() {
        return this.renderInfoBox({
            icon: 'ri-information-line',
            title: 'Contenido no disponible',
            content: '<p>La guia de Jamf Teacher no esta disponible en este momento.</p>'
        });
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

sectionRegistry.register('teacher', (deps) => new TeacherView(deps), {
    displayName: 'Jamf Teacher',
    icon: 'ri-user-star-line',
    order: 6
});

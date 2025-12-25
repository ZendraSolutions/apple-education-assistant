/**
 * @fileoverview iPads section view rendering
 * @module views/IPadsView
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
 * Renders the iPads management section with guides for enrollment,
 * apps management, and restrictions.
 *
 * @class IPadsView
 * @extends BaseView
 * @example
 * const ipadsView = new IPadsView({ eventBus, knowledgeBase });
 * const html = ipadsView.render();
 */
export class IPadsView extends BaseView {
    /**
     * Renders the iPads view
     *
     * @returns {string} iPads HTML content
     * @override
     */
    render() {
        const ipads = this.knowledgeBase?.ipads || {};

        return this.wrapSection(`
            ${this.renderSectionHeader(
                'iPads del Alumnado',
                'Gestion completa de tablets del centro'
            )}
            <div class="guide-cards">
                ${this.renderGuideCard('ipad-enrollment', ipads.enrollment)}
                ${this.renderGuideCard('ipad-apps', ipads.apps)}
                ${this.renderGuideCard('ipad-restrictions', ipads.restrictions)}
            </div>
        `);
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

sectionRegistry.register('ipads', (deps) => new IPadsView(deps), {
    displayName: 'iPads',
    icon: 'ri-tablet-line',
    order: 3
});

/**
 * @fileoverview Macs section view rendering
 * @module views/MacsView
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
 * Renders the Macs management section with guides for enrollment
 * and policy configuration for teacher devices.
 *
 * @class MacsView
 * @extends BaseView
 * @example
 * const macsView = new MacsView({ eventBus, knowledgeBase });
 * const html = macsView.render();
 */
export class MacsView extends BaseView {
    /**
     * Renders the Macs view
     *
     * @returns {string} Macs HTML content
     * @override
     */
    render() {
        const macs = this.knowledgeBase?.macs || {};

        return this.wrapSection(`
            ${this.renderSectionHeader(
                'Macs del Profesorado',
                'Configuracion y soporte para equipos docentes'
            )}
            <div class="guide-cards">
                ${this.renderGuideCard('mac-enrollment', macs.enrollment)}
                ${this.renderGuideCard('mac-policies', macs.policies)}
            </div>
        `);
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

sectionRegistry.register('macs', (deps) => new MacsView(deps), {
    displayName: 'Macs',
    icon: 'ri-macbook-line',
    order: 4
});

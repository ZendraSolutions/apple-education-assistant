/**
 * @fileoverview Checklists section view rendering
 * @module views/ChecklistsView
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
 * Renders the checklists section with categorized checklist cards.
 *
 * @class ChecklistsView
 * @extends BaseView
 * @example
 * const checklistsView = new ChecklistsView({
 *     eventBus,
 *     knowledgeBase
 * });
 * const html = checklistsView.render();
 */
export class ChecklistsView extends BaseView {
    /**
     * Category icon mapping
     * @type {Object<string, string>}
     * @private
     */
    #categoryIcons = {
        'Dispositivos': 'ri-smartphone-line',
        'Procesos Anuales': 'ri-calendar-line',
        'Troubleshooting': 'ri-bug-line',
        'Mantenimiento IT': 'ri-tools-line',
        'Profesores': 'ri-user-line',
        'General': 'ri-checkbox-circle-line'
    };

    /**
     * Renders the checklists view
     *
     * @returns {string} Checklists HTML content
     * @override
     */
    render() {
        const checklists = this.knowledgeBase?.checklists || {};
        const grouped = this.#groupByCategory(checklists);

        return this.wrapSection(`
            ${this.renderSectionHeader(
                'Checklists',
                'Listas de verificacion para procesos comunes'
            )}
            ${this.#renderProgressInfoBox()}
            ${this.#renderCategories(grouped)}
        `);
    }

    /**
     * Groups checklists by category
     * @param {Object} checklists - Checklists data
     * @returns {Object<string, Array>} Grouped checklists
     * @private
     */
    #groupByCategory(checklists) {
        const categories = {};

        Object.entries(checklists).forEach(([key, cl]) => {
            const cat = cl.category || 'General';
            if (!categories[cat]) {
                categories[cat] = [];
            }
            categories[cat].push({ key, ...cl });
        });

        return categories;
    }

    /**
     * Renders progress info box
     * @returns {string} Info box HTML
     * @private
     */
    #renderProgressInfoBox() {
        return this.renderInfoBox({
            icon: 'ri-checkbox-circle-line',
            title: 'Progreso guardado localmente',
            content: '<p>Tu progreso en cada checklist se guarda en tu navegador. Puedes cerrar y volver cuando quieras.</p>'
        });
    }

    /**
     * Renders all category sections
     * @param {Object<string, Array>} grouped - Grouped checklists
     * @returns {string} Categories HTML
     * @private
     */
    #renderCategories(grouped) {
        return Object.entries(grouped).map(([category, items]) => {
            const icon = this.#getCategoryIcon(category);
            return `
                ${this.renderContentTitle(icon, category)}
                <div class="checklist-cards">
                    ${items.map(cl => this.#renderChecklistCard(cl)).join('')}
                </div>
            `;
        }).join('');
    }

    /**
     * Gets icon class for a category
     * @param {string} category - Category name
     * @returns {string} Icon class
     * @private
     */
    #getCategoryIcon(category) {
        return this.#categoryIcons[category] || 'ri-checkbox-circle-line';
    }

    /**
     * Renders a single checklist card
     * @param {Object} checklist - Checklist data with key
     * @returns {string} Checklist card HTML
     * @private
     */
    #renderChecklistCard(checklist) {
        const itemCount = checklist.items?.length || 0;

        return `
            <div class="checklist-card" data-checklist="${checklist.key}">
                <div class="checklist-header">
                    <span class="checklist-icon">${checklist.icon || ''}</span>
                    <div class="checklist-badges">
                        <span class="category-badge">${checklist.category || 'General'}</span>
                        ${checklist.estimatedTime ?
                            `<span class="time-badge"><i class="ri-time-line"></i> ${checklist.estimatedTime}</span>`
                            : ''}
                    </div>
                </div>
                <h3>${checklist.title || ''}</h3>
                <p class="checklist-count">${itemCount} tareas a completar</p>
                <div class="checklist-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <span class="progress-text">0/${itemCount}</span>
                </div>
            </div>
        `;
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

sectionRegistry.register('checklists', (deps) => new ChecklistsView(deps), {
    displayName: 'Checklists',
    icon: 'ri-checkbox-circle-line',
    order: 8
});

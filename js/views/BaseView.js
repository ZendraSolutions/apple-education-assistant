/**
 * @fileoverview Base view class for all section views
 * @module views/BaseView
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

/**
 * @typedef {Object} BaseViewDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {Object} [knowledgeBase] - Knowledge base data
 */

/**
 * Abstract base class for all section views.
 * Provides common rendering utilities and guide card generation.
 *
 * @abstract
 * @class BaseView
 */
export class BaseView {
    /**
     * Event bus for view events
     * @type {import('../utils/EventBus.js').EventBus}
     * @protected
     */
    eventBus;

    /**
     * Knowledge base reference
     * @type {Object}
     * @protected
     */
    knowledgeBase;

    /**
     * Creates a new BaseView instance
     *
     * @param {BaseViewDependencies} dependencies - Injected dependencies
     */
    constructor({ eventBus, knowledgeBase = null }) {
        if (new.target === BaseView) {
            throw new TypeError('BaseView is abstract and cannot be instantiated directly');
        }

        this.eventBus = eventBus;
        this.knowledgeBase = knowledgeBase;
    }

    /**
     * Renders the view content
     *
     * @abstract
     * @returns {string} HTML content for the view
     */
    render() {
        throw new Error('Subclasses must implement render()');
    }

    /**
     * Renders a guide card component
     *
     * @param {string} id - Guide identifier
     * @param {Object} guide - Guide data object
     * @returns {string} Guide card HTML
     *
     * @example
     * const html = this.renderGuideCard('ipad-enrollment', guide);
     */
    renderGuideCard(id, guide) {
        if (!guide) return '';

        return `
            <div class="guide-card" data-guide="${id}">
                <div class="guide-header">
                    <span class="guide-icon">${guide.icon || ''}</span>
                    <span class="guide-tag">${guide.tag || ''}</span>
                </div>
                <h3>${guide.title || ''}</h3>
                <p>${guide.steps ? 'Guia paso a paso' : 'Ver detalles'}</p>
                <div class="guide-meta">
                    ${guide.time ? `<span><i class="ri-time-line"></i> ${guide.time}</span>` : ''}
                    ${guide.steps ? `<span><i class="ri-list-check-2"></i> ${guide.steps} pasos</span>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Renders a section header
     *
     * @param {string} title - Section title
     * @param {string} subtitle - Section subtitle
     * @returns {string} Section header HTML
     *
     * @example
     * const header = this.renderSectionHeader('iPads', 'Gestion de tablets');
     */
    renderSectionHeader(title, subtitle) {
        return `
            <div class="section-header">
                <h1>${title}</h1>
                <p class="section-subtitle">${subtitle}</p>
            </div>
        `;
    }

    /**
     * Renders an info box component
     *
     * @param {Object} options - Info box options
     * @param {string} options.icon - Icon class
     * @param {string} options.title - Box title
     * @param {string} options.content - Box content HTML
     * @param {string} [options.style] - Additional inline styles
     * @returns {string} Info box HTML
     *
     * @example
     * const infoBox = this.renderInfoBox({
     *     icon: 'ri-information-line',
     *     title: 'Important',
     *     content: '<p>Info content here</p>'
     * });
     */
    renderInfoBox({ icon, title, content, style = '' }) {
        return `
            <div class="info-box" ${style ? `style="${style}"` : ''}>
                <div class="info-icon"><i class="${icon}"></i></div>
                <div class="info-content">
                    <h4>${title}</h4>
                    ${content}
                </div>
            </div>
        `;
    }

    /**
     * Renders a content title with icon
     *
     * @param {string} icon - Icon class
     * @param {string} title - Title text
     * @returns {string} Content title HTML
     *
     * @example
     * const title = this.renderContentTitle('ri-book-line', 'Guides');
     */
    renderContentTitle(icon, title) {
        return `<h2 class="content-title"><i class="${icon}"></i> ${title}</h2>`;
    }

    /**
     * Wraps content in a section container
     *
     * @param {string} content - Inner HTML content
     * @returns {string} Section wrapper HTML
     *
     * @example
     * return this.wrapSection(innerContent);
     */
    wrapSection(content) {
        return `<section class="content-section active">${content}</section>`;
    }

    /**
     * Escapes HTML special characters
     *
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     * @protected
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}

/**
 * @fileoverview Dashboard view rendering
 * @module views/DashboardView
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
 * @typedef {Object} DailyTip
 * @property {string} text - Tip text content
 */

/**
 * Renders the main dashboard view with quick access cards,
 * system status, and daily tips.
 *
 * @class DashboardView
 * @extends BaseView
 * @example
 * const dashboardView = new DashboardView({ eventBus });
 * const html = dashboardView.render();
 */
export class DashboardView extends BaseView {
    /**
     * Daily tips collection
     * @type {DailyTip[]}
     * @private
     */
    #tips = [
        { text: 'La App Aula requiere que el Mac y los iPads esten en la misma red WiFi para funcionar correctamente.' },
        { text: 'Puedes usar AirDrop desde la App Aula para enviar archivos rapidamente a tus estudiantes.' },
        { text: 'Las clases creadas en ASM tardan hasta 24 horas en sincronizarse con Jamf School y la App Aula.' },
        { text: 'Si los iPads no aparecen en Aula, verifica que tengan la supervision activada desde Jamf School.' },
        { text: 'Jamf Teacher permite a los profesores instalar apps educativas sin necesidad de contactar con IT.' },
        { text: 'Puedes bloquear todos los iPads en una app especifica usando la funcion "Bloquear en app" de Aula.' },
        { text: 'Las restricciones aplicadas en Jamf School se sincronizan automaticamente con los dispositivos cada hora.' }
    ];

    /**
     * Renders the dashboard view
     *
     * @returns {string} Dashboard HTML content
     * @override
     *
     * @example
     * const html = dashboardView.render();
     * container.innerHTML = html;
     */
    render() {
        const greeting = this.#getGreeting();
        const currentDate = this.#getCurrentDate();
        const tip = this.#getDailyTip();

        return this.wrapSection(`
            ${this.#renderHero(greeting, currentDate)}
            ${this.#renderQuickAccess()}
            ${this.#renderSystemStatus()}
            ${this.#renderTipOfDay(tip)}
            ${this.#renderFrequentActions()}
        `);
    }

    /**
     * Gets time-based greeting
     * @returns {string} Greeting text
     * @private
     */
    #getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'Buenos dias';
        if (hour >= 12 && hour < 20) return 'Buenas tardes';
        return 'Buenas noches';
    }

    /**
     * Gets formatted current date
     * @returns {string} Formatted date
     * @private
     */
    #getCurrentDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('es-ES', options);
    }

    /**
     * Gets the daily tip based on day of year
     * @returns {DailyTip} Daily tip
     * @private
     */
    #getDailyTip() {
        const dayOfYear = Math.floor(
            (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
        );
        return this.#tips[dayOfYear % this.#tips.length];
    }

    /**
     * Renders the hero section
     * @param {string} greeting - Greeting text
     * @param {string} currentDate - Formatted date
     * @returns {string} Hero HTML
     * @private
     */
    #renderHero(greeting, currentDate) {
        return `
            <div class="dashboard-hero">
                <div class="hero-content">
                    <div class="hero-greeting">
                        <i class="ri-sun-line hero-icon"></i>
                        <h1>${greeting}</h1>
                    </div>
                    <p class="hero-subtitle">Gestiona tu ecosistema educativo de forma eficiente</p>
                    <p class="hero-date"><i class="ri-calendar-line"></i> ${currentDate}</p>
                </div>
                <div class="hero-illustration">
                    <i class="ri-graduation-cap-fill"></i>
                </div>
            </div>
        `;
    }

    /**
     * Renders quick access cards
     * @returns {string} Quick access HTML
     * @private
     */
    #renderQuickAccess() {
        return `
            ${this.renderContentTitle('ri-flashlight-line', 'Accesos Rapidos')}
            <div class="quick-access-grid">
                ${this.#renderQuickAccessCard('ecosistema', 'asm-card', 'ri-cloud-line', 'ASM', 'Gestionar identidades')}
                ${this.#renderQuickAccessCard('ipads', 'jamf-card', 'ri-settings-3-line', 'Jamf School', 'Administrar dispositivos')}
                ${this.#renderQuickAccessCard('aula', 'aula-card', 'ri-group-line', 'App Aula', 'Control de clase')}
                <div class="quick-access-card chatbot-card" id="openChatbot">
                    <div class="qa-icon"><i class="ri-robot-line"></i></div>
                    <div class="qa-content">
                        <h3>Chatbot IA</h3>
                        <p>Preguntar al asistente</p>
                    </div>
                    <i class="ri-arrow-right-line qa-arrow"></i>
                </div>
            </div>
        `;
    }

    /**
     * Renders a single quick access card
     * @param {string} section - Target section
     * @param {string} cardClass - CSS class
     * @param {string} icon - Icon class
     * @param {string} title - Card title
     * @param {string} description - Card description
     * @returns {string} Card HTML
     * @private
     */
    #renderQuickAccessCard(section, cardClass, icon, title, description) {
        return `
            <div class="quick-access-card ${cardClass}" data-section="${section}">
                <div class="qa-icon"><i class="${icon}"></i></div>
                <div class="qa-content">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
                <i class="ri-arrow-right-line qa-arrow"></i>
            </div>
        `;
    }

    /**
     * Renders system status cards
     * @returns {string} System status HTML
     * @private
     */
    #renderSystemStatus() {
        return `
            ${this.renderContentTitle('ri-dashboard-3-line', 'Estado del Sistema')}
            <div class="system-status-grid">
                ${this.#renderStatusCard('sync', 'ri-refresh-line', 'Ultima sincronizacion', 'Hace 2 horas')}
                ${this.#renderStatusCard('devices', 'ri-tablet-line', 'Dispositivos activos', '124 iPads')}
                ${this.#renderStatusCard('tasks', 'ri-task-line', 'Tareas pendientes', '3 checklists')}
            </div>
        `;
    }

    /**
     * Renders a single status card
     * @param {string} type - Status type
     * @param {string} icon - Icon class
     * @param {string} label - Status label
     * @param {string} value - Status value
     * @returns {string} Status card HTML
     * @private
     */
    #renderStatusCard(type, icon, label, value) {
        return `
            <div class="status-mini-card">
                <div class="status-icon ${type}">
                    <i class="${icon}"></i>
                </div>
                <div class="status-info">
                    <span class="status-label">${label}</span>
                    <span class="status-value">${value}</span>
                </div>
            </div>
        `;
    }

    /**
     * Renders the tip of the day section
     * @param {DailyTip} tip - Tip data
     * @returns {string} Tip HTML
     * @private
     */
    #renderTipOfDay(tip) {
        return `
            <div class="tip-of-day">
                <div class="tip-icon">
                    <i class="ri-lightbulb-flash-line"></i>
                </div>
                <div class="tip-content">
                    <h3>Consejo del dia</h3>
                    <p>${tip.text}</p>
                </div>
            </div>
        `;
    }

    /**
     * Renders frequent actions section
     * @returns {string} Actions HTML
     * @private
     */
    #renderFrequentActions() {
        return `
            ${this.renderContentTitle('ri-fire-line', 'Acciones Frecuentes')}
            <div class="action-cards">
                <div class="action-card" data-diagnostic="aula-no-funciona">
                    <div class="action-icon"><i class="ri-error-warning-line"></i></div>
                    <h3>App Aula no funciona</h3>
                    <p>No veo alumnos o pantallas en gris</p>
                </div>
                <div class="action-card" data-diagnostic="apps-not-installing">
                    <div class="action-icon"><i class="ri-download-cloud-2-line"></i></div>
                    <h3>Apps no se instalan</h3>
                    <p>Diagnostico paso a paso</p>
                </div>
                <div class="action-card" data-section="checklists">
                    <div class="action-icon"><i class="ri-task-line"></i></div>
                    <h3>Ver Checklists</h3>
                    <p>Procesos y tareas pendientes</p>
                </div>
                <div class="action-card" data-guide="aula-howto">
                    <div class="action-icon"><i class="ri-play-circle-line"></i></div>
                    <h3>Usar App Aula</h3>
                    <p>Guia rapida de uso diario</p>
                </div>
            </div>
        `;
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

/**
 * Auto-register this view with the SectionRegistry.
 * This enables adding new sections without modifying app.js.
 */
sectionRegistry.register('dashboard', (deps) => new DashboardView(deps), {
    displayName: 'Dashboard',
    icon: 'ri-dashboard-line',
    order: 1
});

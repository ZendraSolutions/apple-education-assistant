/**
 * @fileoverview RGPD data management view rendering
 * @module views/MisDatosView
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
 * Renders the RGPD data management section (Mis Datos) allowing users
 * to view, export, and delete their personal data.
 *
 * @class MisDatosView
 * @extends BaseView
 * @example
 * const misDatosView = new MisDatosView({ eventBus });
 * const html = misDatosView.render();
 */
export class MisDatosView extends BaseView {
    /**
     * Renders the Mis Datos view
     *
     * @returns {string} Mis Datos HTML content
     * @override
     */
    render() {
        return this.wrapSection(`
            ${this.renderSectionHeader(
                'Gestion de Mis Datos',
                'Ejercita tus derechos ARCO sobre tus datos personales'
            )}
            ${this.#renderSecurityInfoBox()}
            ${this.#renderDataManagementCards()}
            ${this.#renderStoredDataInfo()}
        `);
    }

    /**
     * Renders security info box
     * @returns {string} Info box HTML
     * @private
     */
    #renderSecurityInfoBox() {
        return this.renderInfoBox({
            icon: 'ri-shield-user-line',
            title: 'Tus datos estan seguros',
            content: '<p>Toda tu informacion se almacena unicamente en este navegador (localStorage). No se envia a ningun servidor externo.</p>'
        });
    }

    /**
     * Renders data management action cards
     * @returns {string} Action cards HTML
     * @private
     */
    #renderDataManagementCards() {
        return `
            ${this.renderContentTitle('ri-database-2-line', 'Gestion de Datos')}
            <div class="action-cards">
                ${this.#renderActionCard('viewDataCard', 'ri-eye-line', 'Ver mis datos', 'Visualiza todos los datos almacenados en formato JSON')}
                ${this.#renderActionCard('exportDataCard', 'ri-download-2-line', 'Exportar mis datos', 'Descarga todos tus datos en formato JSON')}
                ${this.#renderActionCard('deleteDataCard', 'ri-delete-bin-line', 'Eliminar todos mis datos', 'Borra permanentemente todos los datos almacenados', 'color: var(--error);')}
                ${this.#renderActionCard('configApiCard', 'ri-settings-3-line', 'Configurar API Key', 'Acceso rapido a la configuracion del chatbot')}
            </div>
        `;
    }

    /**
     * Renders a single action card
     * @param {string} id - Card element ID
     * @param {string} icon - Icon class
     * @param {string} title - Card title
     * @param {string} description - Card description
     * @param {string} [iconStyle=''] - Additional icon styles
     * @returns {string} Action card HTML
     * @private
     */
    #renderActionCard(id, icon, title, description, iconStyle = '') {
        return `
            <div class="action-card" id="${id}">
                <div class="action-icon" ${iconStyle ? `style="${iconStyle}"` : ''}>
                    <i class="${icon}"></i>
                </div>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
    }

    /**
     * Renders stored data information section
     * @returns {string} Stored data info HTML
     * @private
     */
    #renderStoredDataInfo() {
        return `
            ${this.renderContentTitle('ri-information-line', 'Datos Almacenados')}
            <div class="info-box">
                <div class="info-icon"><i class="ri-list-check"></i></div>
                <div class="info-content">
                    <h4>Que datos guardamos?</h4>
                    <ul>
                        <li><strong>API Key:</strong> Tu clave de Google Gemini (cifrada)</li>
                        <li><strong>Tema:</strong> Preferencia de modo claro/oscuro</li>
                        <li><strong>Sidebar:</strong> Estado del menu lateral (expandido/colapsado)</li>
                        <li><strong>Progreso de Checklists:</strong> Tareas completadas en cada lista</li>
                    </ul>
                    <p style="margin-top: 10px; color: var(--text-muted); font-size: 14px;">
                        <i class="ri-lock-line"></i> Todos estos datos permanecen en tu dispositivo y nunca se comparten.
                    </p>
                </div>
            </div>
        `;
    }
}

// ============================================================================
// SELF-REGISTRATION - Open/Closed Principle
// ============================================================================

sectionRegistry.register('mis-datos', (deps) => new MisDatosView(deps), {
    displayName: 'Mis Datos',
    icon: 'ri-shield-user-line',
    order: 9
});

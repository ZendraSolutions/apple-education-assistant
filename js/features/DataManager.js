/**
 * @fileoverview RGPD data operations management
 * @module features/DataManager
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

import { AppEvents } from '../utils/EventBus.js';

/**
 * @typedef {Object} DataManagerDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {import('../core/ModalManager.js').ModalManager} modalManager - Modal manager
 * @property {import('../core/StateManager.js').StateManager} stateManager - State manager
 * @property {Document} [document] - Document reference
 */

/**
 * Manages RGPD data operations including view, export, and delete.
 * Provides user-facing functionality for data rights (ARCO).
 *
 * @class DataManager
 * @example
 * const dataManager = new DataManager({
 *     eventBus,
 *     modalManager,
 *     stateManager
 * });
 *
 * dataManager.init();
 */
export class DataManager {
    /**
     * Event bus for data events
     * @type {import('../utils/EventBus.js').EventBus}
     * @private
     */
    #eventBus;

    /**
     * Modal manager for dialogs
     * @type {import('../core/ModalManager.js').ModalManager}
     * @private
     */
    #modalManager;

    /**
     * State manager for data access
     * @type {import('../core/StateManager.js').StateManager}
     * @private
     */
    #stateManager;

    /**
     * Document reference
     * @type {Document}
     * @private
     */
    #document;

    /**
     * Creates a new DataManager instance
     *
     * @param {DataManagerDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If required dependencies are missing
     */
    constructor({ eventBus, modalManager, stateManager, document: doc = null }) {
        if (!eventBus) {
            throw new TypeError('DataManager requires an EventBus instance');
        }
        if (!modalManager) {
            throw new TypeError('DataManager requires a ModalManager instance');
        }
        if (!stateManager) {
            throw new TypeError('DataManager requires a StateManager instance');
        }

        this.#eventBus = eventBus;
        this.#modalManager = modalManager;
        this.#stateManager = stateManager;
        this.#document = doc || (typeof document !== 'undefined' ? document : null);
    }

    /**
     * Initializes data manager (no bindings needed - uses event bus)
     *
     * @returns {void}
     */
    init() {
        // DataManager is triggered by events from views, no init bindings needed
    }

    /**
     * Shows all stored data in a modal
     *
     * @returns {void}
     *
     * @example
     * dataManager.viewData();
     */
    viewData() {
        const allData = this.#stateManager.exportAll();
        const dataCount = Object.keys(allData).length;
        const jsonFormatted = JSON.stringify(allData, null, 2);

        const html = `
            <h2><i class="ri-eye-line"></i> Mis Datos Almacenados</h2>
            <div class="info-box">
                <div class="info-icon"><i class="ri-database-2-line"></i></div>
                <div class="info-content">
                    <p><strong>${dataCount} elementos</strong> almacenados en localStorage</p>
                    <p style="color: var(--text-muted); font-size: 14px; margin-top: 8px;">
                        Estos datos solo existen en este navegador y no se han enviado a ningun servidor.
                    </p>
                </div>
            </div>

            <div class="code-block" style="background: var(--bg-input); border-radius: var(--radius-md); padding: 20px; margin: 20px 0; max-height: 500px; overflow-y: auto;">
                <pre style="margin: 0; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; color: var(--text-primary);">${this.#escapeHtml(jsonFormatted)}</pre>
            </div>

            <div class="info-box" style="background: var(--accent-bg); border-left-color: var(--accent-primary);">
                <div class="info-icon" style="color: var(--accent-primary);"><i class="ri-information-line"></i></div>
                <div class="info-content">
                    <p><strong>Que significa esto?</strong></p>
                    <p style="font-size: 14px; margin-top: 8px;">Puedes exportar estos datos como archivo JSON o eliminarlos permanentemente usando las opciones de la seccion "Mis Datos".</p>
                </div>
            </div>
        `;

        this.#modalManager.show(html);
    }

    /**
     * Exports all data as a JSON file download
     *
     * @returns {void}
     * @fires DataManager#data:exported
     *
     * @example
     * dataManager.exportData();
     */
    exportData() {
        const allData = this.#stateManager.exportAll();

        const exportData = {
            exportDate: new Date().toISOString(),
            application: 'Jamf Assistant',
            dataCount: Object.keys(allData).length,
            data: allData
        };

        const jsonString = JSON.stringify(exportData, null, 2);
        this.#downloadJson(jsonString);
        this.#showExportSuccessModal(Object.keys(allData).length);

        this.#eventBus.emit(AppEvents.DATA_EXPORTED, {
            count: Object.keys(allData).length
        });
    }

    /**
     * Downloads a JSON string as a file
     * @param {string} jsonString - JSON content
     * @private
     */
    #downloadJson(jsonString) {
        if (!this.#document) return;

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = this.#document.createElement('a');

        a.href = url;
        a.download = `mis-datos-jamf-assistant-${new Date().toISOString().split('T')[0]}.json`;

        this.#document.body.appendChild(a);
        a.click();
        this.#document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Shows export success modal
     * @param {number} count - Number of exported items
     * @private
     */
    #showExportSuccessModal(count) {
        const html = `
            <h2><i class="ri-download-2-line"></i> Datos Exportados</h2>
            <div class="info-box" style="background: var(--accent-bg); border-left-color: var(--success);">
                <div class="info-icon" style="color: var(--success);"><i class="ri-checkbox-circle-line"></i></div>
                <div class="info-content">
                    <h4>Exportacion completada</h4>
                    <p>Tus datos se han descargado en formato JSON.</p>
                    <p style="margin-top: 10px; font-size: 14px;"><strong>${count} elementos</strong> exportados</p>
                </div>
            </div>

            <div class="info-box">
                <div class="info-icon"><i class="ri-shield-check-line"></i></div>
                <div class="info-content">
                    <h4>Seguridad de tus datos</h4>
                    <p>El archivo descargado contiene todos tus datos en formato JSON legible. Guardalo en un lugar seguro si contiene informacion sensible como tu API Key.</p>
                </div>
            </div>
        `;

        this.#modalManager.show(html);
    }

    /**
     * Shows delete confirmation modal
     *
     * @returns {void}
     *
     * @example
     * dataManager.confirmDelete();
     */
    confirmDelete() {
        const allData = this.#stateManager.exportAll();
        const dataCount = Object.keys(allData).length;

        const html = `
            <h2><i class="ri-error-warning-line"></i> Confirmar Eliminacion</h2>
            <div class="info-box" style="background: hsl(8, 45%, 95%); border-left-color: var(--error);">
                <div class="info-icon" style="color: var(--error);"><i class="ri-alert-line"></i></div>
                <div class="info-content">
                    <h4>Esta accion no se puede deshacer</h4>
                    <p>Se eliminaran permanentemente <strong>${dataCount} elementos</strong> de localStorage:</p>
                    <ul style="margin-top: 10px;">
                        <li>API Key de Google Gemini</li>
                        <li>Preferencias de tema</li>
                        <li>Estado del sidebar</li>
                        <li>Progreso de todas las checklists</li>
                    </ul>
                </div>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="diagnostic-btn" id="confirmDelete" style="background: var(--error);">
                    <i class="ri-delete-bin-line"></i> Si, eliminar todos mis datos
                </button>
                <button class="diagnostic-btn" id="cancelDelete" style="background: var(--text-muted);">
                    Cancelar
                </button>
            </div>
        `;

        this.#modalManager.show(html);
        this.#bindDeleteButtons();
    }

    /**
     * Binds delete confirmation buttons
     * @private
     */
    #bindDeleteButtons() {
        if (!this.#document) return;

        const confirmBtn = this.#document.getElementById('confirmDelete');
        const cancelBtn = this.#document.getElementById('cancelDelete');

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.executeDelete());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.#modalManager.hide());
        }
    }

    /**
     * Executes data deletion and shows success message
     *
     * @returns {void}
     * @fires DataManager#data:deleted
     *
     * @example
     * dataManager.executeDelete();
     */
    executeDelete() {
        this.#stateManager.clearAll();
        this.#showDeleteSuccessModal();
    }

    /**
     * Shows delete success modal and reloads page
     * @private
     */
    #showDeleteSuccessModal() {
        const html = `
            <h2><i class="ri-checkbox-circle-line"></i> Datos Eliminados</h2>
            <div class="info-box" style="background: var(--accent-bg); border-left-color: var(--success);">
                <div class="info-icon" style="color: var(--success);"><i class="ri-check-line"></i></div>
                <div class="info-content">
                    <h4>Todos tus datos han sido eliminados</h4>
                    <p>localStorage ha sido limpiado completamente. La pagina se recargara para aplicar los cambios.</p>
                </div>
            </div>
        `;

        this.#modalManager.show(html);

        setTimeout(() => {
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        }, 2000);
    }

    /**
     * Escapes HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     * @private
     */
    #escapeHtml(text) {
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

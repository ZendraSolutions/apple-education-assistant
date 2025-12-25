/**
 * @fileoverview Toast notification system for user feedback
 * @module ui/ToastManager
 * @version 1.0.0
 * @author Apple Edu Assistant Team
 * @license MIT
 *
 * @description
 * Provides non-intrusive toast notifications for:
 * - Connection status changes
 * - User action confirmations
 * - Error messages
 * - General information
 *
 * Features:
 * - Auto-dismiss with configurable duration
 * - Stack multiple toasts
 * - Different types: info, success, warning, error
 * - Smooth animations
 * - Accessible (ARIA labels)
 *
 * @example
 * const toastManager = new ToastManager();
 * toastManager.show('Conexión restablecida', 'success');
 * toastManager.show('Error al guardar', 'error', 8000);
 */

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} ToastType
 */

/**
 * @typedef {Object} ToastConfig
 * @property {string} message - Message to display
 * @property {ToastType} type - Toast type
 * @property {number} duration - Duration in milliseconds (0 = no auto-dismiss)
 * @property {boolean} dismissible - Allow manual dismiss
 */

/**
 * Manages toast notifications with automatic stacking and dismissal
 * @class ToastManager
 */
export class ToastManager {
    /**
     * Container element for all toasts
     * @type {HTMLElement}
     * @private
     */
    #container = null;

    /**
     * Active toast elements by ID
     * @type {Map<string, HTMLElement>}
     * @private
     */
    #activeToasts = new Map();

    /**
     * Auto-increment ID for unique toast identification
     * @type {number}
     * @private
     */
    #toastId = 0;

    /**
     * Icons for different toast types
     * @type {Object<ToastType, string>}
     * @private
     */
    #icons = {
        info: 'ri-information-line',
        success: 'ri-checkbox-circle-line',
        warning: 'ri-alert-line',
        error: 'ri-error-warning-line'
    };

    /**
     * Creates a new ToastManager instance
     */
    constructor() {
        this.#init();
    }

    /**
     * Initializes the toast container
     * @private
     */
    #init() {
        // Create container if it doesn't exist
        this.#container = document.getElementById('toast-container');

        if (!this.#container) {
            this.#container = document.createElement('div');
            this.#container.id = 'toast-container';
            this.#container.className = 'toast-container';
            this.#container.setAttribute('role', 'region');
            this.#container.setAttribute('aria-label', 'Notificaciones');
            document.body.appendChild(this.#container);
        }
    }

    /**
     * Shows a toast notification
     *
     * @param {string} message - Message to display
     * @param {ToastType} [type='info'] - Toast type
     * @param {number} [duration=5000] - Duration in ms (0 = no auto-dismiss)
     * @param {boolean} [dismissible=true] - Allow manual dismiss
     * @returns {string} Toast ID for programmatic dismissal
     *
     * @example
     * toastManager.show('Cambios guardados', 'success');
     * toastManager.show('Error de conexión', 'error', 8000);
     *
     * const id = toastManager.show('Procesando...', 'info', 0);
     * // Later: toastManager.dismiss(id);
     */
    show(message, type = 'info', duration = 5000, dismissible = true) {
        if (!message || typeof message !== 'string') {
            console.error('[ToastManager] Invalid message:', message);
            return null;
        }

        const id = `toast-${++this.#toastId}`;
        const toast = this.#createToast(id, message, type, dismissible);

        // Add to container with animation
        this.#container.appendChild(toast);
        this.#activeToasts.set(id, toast);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toast.classList.add('toast-enter');
        });

        // Auto-dismiss after duration
        if (duration > 0) {
            setTimeout(() => this.dismiss(id), duration);
        }

        return id;
    }

    /**
     * Creates a toast DOM element
     *
     * @param {string} id - Unique toast ID
     * @param {string} message - Message text
     * @param {ToastType} type - Toast type
     * @param {boolean} dismissible - Allow dismiss button
     * @returns {HTMLElement} Toast element
     * @private
     */
    #createToast(id, message, type, dismissible) {
        const toast = document.createElement('div');
        toast.id = id;
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

        // Icon
        const icon = document.createElement('i');
        icon.className = `toast-icon ${this.#icons[type] || this.#icons.info}`;
        toast.appendChild(icon);

        // Message
        const messageEl = document.createElement('span');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;
        toast.appendChild(messageEl);

        // Dismiss button
        if (dismissible) {
            const dismissBtn = document.createElement('button');
            dismissBtn.className = 'toast-dismiss';
            dismissBtn.setAttribute('aria-label', 'Cerrar notificación');
            dismissBtn.innerHTML = '<i class="ri-close-line"></i>';
            dismissBtn.addEventListener('click', () => this.dismiss(id));
            toast.appendChild(dismissBtn);
        }

        return toast;
    }

    /**
     * Dismisses a specific toast
     *
     * @param {string} id - Toast ID to dismiss
     * @returns {boolean} True if toast was found and dismissed
     *
     * @example
     * const id = toastManager.show('Loading...', 'info', 0);
     * // Later...
     * toastManager.dismiss(id);
     */
    dismiss(id) {
        const toast = this.#activeToasts.get(id);

        if (!toast) {
            return false;
        }

        // Exit animation
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');

        // Remove from DOM after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.#activeToasts.delete(id);
        }, 300); // Match CSS transition duration

        return true;
    }

    /**
     * Dismisses all active toasts
     *
     * @example
     * toastManager.dismissAll();
     */
    dismissAll() {
        const ids = Array.from(this.#activeToasts.keys());
        ids.forEach(id => this.dismiss(id));
    }

    /**
     * Shows a success toast
     *
     * @param {string} message - Success message
     * @param {number} [duration=5000] - Duration in ms
     * @returns {string} Toast ID
     */
    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    /**
     * Shows an error toast
     *
     * @param {string} message - Error message
     * @param {number} [duration=8000] - Duration in ms (longer for errors)
     * @returns {string} Toast ID
     */
    error(message, duration = 8000) {
        return this.show(message, 'error', duration);
    }

    /**
     * Shows a warning toast
     *
     * @param {string} message - Warning message
     * @param {number} [duration=6000] - Duration in ms
     * @returns {string} Toast ID
     */
    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    /**
     * Shows an info toast
     *
     * @param {string} message - Info message
     * @param {number} [duration=5000] - Duration in ms
     * @returns {string} Toast ID
     */
    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }

    /**
     * Gets count of active toasts
     *
     * @returns {number} Number of active toasts
     */
    get count() {
        return this.#activeToasts.size;
    }

    /**
     * Destroys the toast manager and removes all toasts
     */
    destroy() {
        this.dismissAll();

        if (this.#container && this.#container.parentNode) {
            this.#container.parentNode.removeChild(this.#container);
        }

        this.#container = null;
        this.#activeToasts.clear();
    }
}

/**
 * @fileoverview API Key Manager - Storage, validation, and lifecycle
 * @module chatbot/ApiKeyManager
 * @version 2.1.0
 * @license MIT
 *
 * Manages API key storage with encryption, validation, and expiration.
 * Supports session-only, temporary (24h), and permanent storage modes.
 *
 * Uses Chain of Responsibility pattern (ValidatorChain) for extensible
 * validation - new validators can be added without modifying this class.
 *
 * @security API keys are encrypted at rest using EncryptionService
 */

// Note: Dependencies are injected via constructor (D-Principle)
// No direct imports of concrete implementations used for instantiation

/**
 * @typedef {Object} ApiKeySettings
 * @property {string} key - Encrypted API key
 * @property {boolean} encrypted - Whether the key is encrypted
 * @property {boolean} pinned - Whether the key is pinned permanently
 * @property {number} expiry - Expiration timestamp (0 if pinned)
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the key format is valid
 * @property {string} [error] - Error message if invalid
 * @property {string} [strength] - Key strength: 'fuerte', 'media', 'debil'
 */

/**
 * @typedef {Object} ApiTestResult
 * @property {boolean} valid - Whether the API key works
 * @property {string} [error] - Error message if invalid
 */

/**
 * @typedef {Object} ApiKeyManagerDependencies
 * @property {import('./EncryptionService.js').EncryptionService} encryptionService - Encryption service
 * @property {import('../patterns/ValidatorChain.js').ApiKeyValidatorChain} validatorChain - Validator chain
 */

/**
 * @class ApiKeyManager
 * @description Manages API key storage, validation, and lifecycle
 *
 * SOLID Compliance:
 * - D (Dependency Inversion): All dependencies injected via constructor
 * - O (Open/Closed): Validation extended via ValidatorChain without modification
 *
 * @example
 * // With dependency injection (SOLID compliant)
 * const manager = new ApiKeyManager({
 *     encryptionService: new EncryptionService(),
 *     validatorChain: createGeminiValidator()
 * });
 * await manager.loadSettings();
 *
 * if (manager.hasKey) {
 *   const key = manager.apiKey;
 * }
 */
export class ApiKeyManager {
    /** @private @type {EncryptionService} */
    #encryptionService;

    /** @private @type {string} */
    #apiKey = '';

    /** @private @type {boolean} */
    #isPinned = false;

    /** @private @type {boolean} */
    #useSessionOnly = false;

    /** @private @type {number} */
    #expiryTime = 0;

    /** @private @type {string} */
    #localStorageKey = 'jamf-api-settings';

    /** @private @type {string} */
    #sessionStorageKey = 'jamf-api-settings';

    /** @private @type {number} 24 hours in milliseconds */
    #defaultExpiryMs = 24 * 60 * 60 * 1000;

    /**
     * Validator chain for API key format validation.
     * Uses Chain of Responsibility pattern for extensibility.
     * @private @type {import('../patterns/ValidatorChain.js').ApiKeyValidatorChain}
     */
    #validatorChain;

    /**
     * Creates a new ApiKeyManager instance
     *
     * @param {ApiKeyManagerDependencies} deps - Dependencies object with named properties
     * @throws {Error} If required dependencies are missing
     */
    constructor(deps) {
        if (!deps || typeof deps !== 'object') {
            throw new Error('ApiKeyManager requires a dependencies object');
        }
        if (!deps.encryptionService) {
            throw new Error('ApiKeyManager requires encryptionService dependency');
        }
        if (!deps.validatorChain) {
            throw new Error('ApiKeyManager requires validatorChain dependency');
        }
        this.#encryptionService = deps.encryptionService;
        this.#validatorChain = deps.validatorChain;
    }

    /**
     * Gets the current validator chain (for extension/testing)
     * @type {import('../patterns/ValidatorChain.js').ApiKeyValidatorChain}
     * @readonly
     */
    get validatorChain() {
        return this.#validatorChain;
    }

    /**
     * Sets a custom validator chain
     * Enables runtime switching of validation strategies
     * @param {import('../patterns/ValidatorChain.js').ApiKeyValidatorChain} chain
     */
    setValidatorChain(chain) {
        this.#validatorChain = chain;
    }

    /**
     * Current API key (decrypted)
     * @type {string}
     * @readonly
     */
    get apiKey() {
        return this.#apiKey;
    }

    /**
     * Whether an API key is currently configured
     * @type {boolean}
     * @readonly
     */
    get hasKey() {
        return Boolean(this.#apiKey);
    }

    /**
     * Whether the key is pinned (permanent storage)
     * @type {boolean}
     * @readonly
     */
    get isPinned() {
        return this.#isPinned;
    }

    /**
     * Whether the key is session-only
     * @type {boolean}
     * @readonly
     */
    get isSessionOnly() {
        return this.#useSessionOnly;
    }

    /**
     * Expiration timestamp (0 if pinned or session-only)
     * @type {number}
     * @readonly
     */
    get expiryTime() {
        return this.#expiryTime;
    }

    /**
     * Loads API key settings from storage
     *
     * @returns {Promise<void>}
     * @throws {Error} If decryption fails and key cannot be recovered
     *
     * @example
     * await manager.loadSettings();
     * if (manager.hasKey) {
     *   console.log('API key loaded successfully');
     * }
     */
    async loadSettings() {
        // Try session storage first
        const sessionSettings = sessionStorage.getItem(this.#sessionStorageKey);
        if (sessionSettings) {
            try {
                const settings = JSON.parse(sessionSettings);
                this.#apiKey = await this.#encryptionService.decrypt(settings.key);
                this.#isPinned = false;
                this.#useSessionOnly = true;
                this.#expiryTime = 0;
                return;
            } catch (e) {
                console.error('[API] Error decrypting from sessionStorage:', e);
                sessionStorage.removeItem(this.#sessionStorageKey);
            }
        }

        // Try localStorage
        const localSettings = localStorage.getItem(this.#localStorageKey);
        if (localSettings) {
            try {
                const settings = JSON.parse(localSettings);

                // Migration: If key is not encrypted (legacy), encrypt it
                if (settings.key && !settings.encrypted) {
                    console.log('[API] Migrating API Key to encrypted format...');
                    await this.saveKey(settings.key, settings.pinned || false, false);
                    return;
                }

                // Decrypt the key
                this.#apiKey = await this.#encryptionService.decrypt(settings.key);
                this.#isPinned = settings.pinned || false;
                this.#useSessionOnly = false;
                this.#expiryTime = settings.expiry || 0;

                // Check if expired (24h)
                if (!this.#isPinned && this.#expiryTime && Date.now() > this.#expiryTime) {
                    this.clearKey();
                }
            } catch (e) {
                console.error('[API] Error decrypting API Key:', e);
                this.clearKey();
            }
        }
    }

    /**
     * Saves an API key with specified storage mode
     *
     * @param {string} key - The API key to save
     * @param {boolean} [pinned=false] - Whether to pin permanently
     * @param {boolean} [sessionOnly=false] - Whether to use session storage only
     * @returns {Promise<void>}
     *
     * @example
     * // Save for 24 hours
     * await manager.saveKey('AIza...', false, false);
     *
     * // Pin permanently
     * await manager.saveKey('AIza...', true, false);
     *
     * // Session only
     * await manager.saveKey('AIza...', false, true);
     */
    async saveKey(key, pinned = false, sessionOnly = false) {
        const encryptedKey = await this.#encryptionService.encrypt(key);
        const expiry = pinned ? 0 : Date.now() + this.#defaultExpiryMs;

        /** @type {ApiKeySettings} */
        const settings = {
            key: encryptedKey,
            encrypted: true,
            pinned: pinned,
            expiry: expiry
        };

        if (sessionOnly) {
            sessionStorage.setItem(this.#sessionStorageKey, JSON.stringify(settings));
            localStorage.removeItem(this.#localStorageKey);
        } else {
            localStorage.setItem(this.#localStorageKey, JSON.stringify(settings));
            sessionStorage.removeItem(this.#sessionStorageKey);
        }

        this.#apiKey = key;
        this.#isPinned = pinned;
        this.#useSessionOnly = sessionOnly;
        this.#expiryTime = expiry;
    }

    /**
     * Clears the stored API key
     * @returns {void}
     */
    clearKey() {
        localStorage.removeItem(this.#localStorageKey);
        sessionStorage.removeItem(this.#sessionStorageKey);
        this.#apiKey = '';
        this.#isPinned = false;
        this.#useSessionOnly = false;
        this.#expiryTime = 0;
    }

    /**
     * Validates API key format using the Chain of Responsibility pattern.
     * Uses the configured validator chain for extensible validation.
     *
     * To add new validators without modifying this class:
     * ```javascript
     * manager.validatorChain.addValidator(new MyCustomValidator());
     * ```
     *
     * Or inject a completely different chain:
     * ```javascript
     * import { createOpenAIValidator } from '../patterns/ValidatorChain.js';
     * manager.setValidatorChain(createOpenAIValidator());
     * ```
     *
     * @param {string} key - API key to validate
     * @returns {ValidationResult} Validation result with strength property
     *
     * @example
     * const result = manager.validateFormat('AIza...');
     * if (!result.valid) {
     *   console.error(result.error);
     * } else {
     *   console.log(`Strength: ${result.strength}`);
     * }
     */
    validateFormat(key) {
        // Delegate to validator chain - Chain of Responsibility pattern
        // This eliminates the hardcoded if/else statements and enables
        // extending validation without modifying this method
        return this.#validatorChain.validate(key);
    }

    /**
     * Tests an API key with the Gemini API
     *
     * @param {string} key - API key to test
     * @returns {Promise<ApiTestResult>} Test result
     *
     * @example
     * const result = await manager.testKey('AIza...');
     * if (result.valid) {
     *   await manager.saveKey('AIza...');
     * }
     */
    async testKey(key) {
        try {
            const response = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': key
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: 'Responde solo: OK' }] }]
                    })
                }
            );

            if (response.ok) {
                return { valid: true };
            }

            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || response.statusText;

            return { valid: false, error: this.#translateError(errorMsg, response.status) };
        } catch (e) {
            if (e.message.includes('Failed to fetch')) {
                return { valid: false, error: 'Error de red. Verifica tu conexion a internet.' };
            }
            return { valid: false, error: 'Error de conexion: ' + e.message };
        }
    }

    /**
     * Translates API errors to user-friendly Spanish messages
     *
     * @private
     * @param {string} errorMsg - Original error message
     * @param {number} status - HTTP status code
     * @returns {string} Translated error message
     */
    #translateError(errorMsg, status) {
        if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
            return 'API Key invalida. Verifica que la copiaste sin espacios extra.';
        }
        if (errorMsg.includes('QUOTA_EXCEEDED')) {
            return 'Cuota excedida. Espera unos minutos o crea otra key.';
        }
        if (errorMsg.includes('PERMISSION_DENIED')) {
            return 'Permisos denegados. Activa la API en Google Cloud Console.';
        }
        if (errorMsg.includes('not found') || errorMsg.includes('does not exist')) {
            return 'Modelo no disponible. Intenta de nuevo mas tarde.';
        }
        if (status === 400) {
            return 'API Key invalida o mal formada. Copia la key completa desde Google AI Studio.';
        }

        console.error('API Error:', errorMsg);
        return 'Error: ' + errorMsg.substring(0, 80);
    }

    /**
     * Gets a human-readable status description
     *
     * @returns {string} Status description in Spanish
     *
     * @example
     * const status = manager.getStatusDescription();
     * // "Guardada permanentemente (cifrada)"
     */
    getStatusDescription() {
        if (!this.#apiKey) {
            return 'No configurada';
        }

        if (this.#useSessionOnly) {
            return 'Solo en esta sesion (se borra al cerrar navegador)';
        }

        if (this.#isPinned) {
            return 'Guardada permanentemente (cifrada)';
        }

        const hoursRemaining = Math.round((this.#expiryTime - Date.now()) / (1000 * 60 * 60));
        return `Expira en ${hoursRemaining} hora${hoursRemaining !== 1 ? 's' : ''} (cifrada)`;
    }
}

export default ApiKeyManager;

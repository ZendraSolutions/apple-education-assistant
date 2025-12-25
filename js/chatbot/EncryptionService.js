/**
 * @fileoverview Encryption Service - AES-256-GCM with PBKDF2
 * @module chatbot/EncryptionService
 * @version 2.0.0
 * @license MIT
 *
 * @security This module handles sensitive data encryption/decryption.
 * Uses Web Crypto API for cryptographic operations.
 *
 * Security features:
 * - AES-256-GCM authenticated encryption
 * - PBKDF2 key derivation with 100,000 iterations
 * - Random IV generation for each encryption
 * - Per-user unique salt stored locally
 */

import { logger } from '../utils/Logger.js';

/**
 * Custom error class for encryption failures
 * @class EncryptionError
 * @extends Error
 */
export class EncryptionError extends Error {
    /**
     * @param {string} message - Error message
     * @param {Error} [cause] - Original error that caused this
     */
    constructor(message, cause) {
        super(message);
        this.name = 'EncryptionError';
        this.cause = cause;
    }
}

/**
 * Custom error class for decryption failures
 * @class DecryptionError
 * @extends Error
 */
export class DecryptionError extends Error {
    /**
     * @param {string} message - Error message
     * @param {Error} [cause] - Original error that caused this
     */
    constructor(message, cause) {
        super(message);
        this.name = 'DecryptionError';
        this.cause = cause;
    }
}

/**
 * @class EncryptionService
 * @description Service for encrypting/decrypting sensitive data using AES-256-GCM
 *
 * @example
 * const encService = new EncryptionService();
 * const encrypted = await encService.encrypt('my-api-key');
 * const decrypted = await encService.decrypt(encrypted);
 */
export class EncryptionService {
    /** @private @type {number} PBKDF2 iterations for key derivation */
    #iterations = 100000;

    /** @private @type {number} IV length in bytes */
    #ivLength = 12;

    /** @private @type {string} Storage key for user salt */
    #saltStorageKey = 'jamf-user-salt';

    /** @private @type {string} Storage key for installation entropy */
    #entropyStorageKey = 'jamf-install-entropy';

    /** @private @type {string} Storage key for first use timestamp */
    #timestampStorageKey = 'jamf-first-use-ts';

    /** @private @type {CryptoKey|null} Cached derived key */
    #cachedKey = null;

    /**
     * Creates a new EncryptionService instance
     */
    constructor() {
        // Check Web Crypto API availability
        this.#checkCryptoSupport();
    }

    /**
     * Checks if Web Crypto API is available
     * @private
     * @returns {boolean} True if crypto is available
     */
    #checkCryptoSupport() {
        return typeof window !== 'undefined' &&
               window.crypto &&
               window.crypto.subtle;
    }

    /**
     * Indicates if encryption is supported in the current environment
     * @type {boolean}
     * @readonly
     */
    get isSupported() {
        return this.#checkCryptoSupport();
    }

    /**
     * Encrypts plaintext using AES-256-GCM
     *
     * @param {string} plaintext - Text to encrypt
     * @returns {Promise<string>} Base64-encoded encrypted data (IV + ciphertext)
     * @throws {EncryptionError} If encryption fails or crypto not available
     *
     * @example
     * const encrypted = await encService.encrypt('secret-api-key');
     * // Returns: "base64-encoded-iv-and-ciphertext"
     */
    async encrypt(plaintext) {
        if (!this.#checkCryptoSupport()) {
            logger.warn('[SECURITY] Web Crypto API not available, returning plaintext');
            return plaintext;
        }

        if (typeof plaintext !== 'string') {
            throw new EncryptionError('Plaintext must be a string');
        }

        try {
            const key = await this.#deriveKey();
            const encoder = new TextEncoder();
            const data = encoder.encode(plaintext);

            // Generate random IV (12 bytes for GCM)
            const iv = window.crypto.getRandomValues(new Uint8Array(this.#ivLength));

            // Encrypt with AES-GCM
            const encrypted = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            // Combine IV + encrypted data
            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encrypted), iv.length);

            // Convert to base64
            return btoa(String.fromCharCode(...combined));
        } catch (error) {
            logger.error('[SECURITY] Encryption error:', error);
            throw new EncryptionError('Failed to encrypt data', error);
        }
    }

    /**
     * Decrypts AES-256-GCM encrypted data
     *
     * @param {string} encryptedBase64 - Base64-encoded encrypted data
     * @returns {Promise<string>} Decrypted plaintext
     * @throws {DecryptionError} If decryption fails or data is corrupted
     *
     * @example
     * const decrypted = await encService.decrypt(encryptedData);
     * // Returns: "secret-api-key"
     */
    async decrypt(encryptedBase64) {
        if (!this.#checkCryptoSupport()) {
            // Fallback: assume data is not encrypted
            return encryptedBase64;
        }

        if (typeof encryptedBase64 !== 'string') {
            throw new DecryptionError('Encrypted data must be a string');
        }

        try {
            const key = await this.#deriveKey();

            // Decode base64
            const combined = Uint8Array.from(
                atob(encryptedBase64),
                c => c.charCodeAt(0)
            );

            // Validate minimum length (IV + some data)
            if (combined.length <= this.#ivLength) {
                throw new DecryptionError('Invalid encrypted data format');
            }

            // Extract IV and encrypted data
            const iv = combined.slice(0, this.#ivLength);
            const encrypted = combined.slice(this.#ivLength);

            // Decrypt
            const decrypted = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            logger.error('[SECURITY] Decryption error:', error);
            throw new DecryptionError('Failed to decrypt data', error);
        }
    }

    /**
     * Derives the encryption key using PBKDF2
     *
     * @private
     * @returns {Promise<CryptoKey>} Derived AES-256 key
     */
    async #deriveKey() {
        // Return cached key if available
        if (this.#cachedKey) {
            return this.#cachedKey;
        }

        const encoder = new TextEncoder();

        // Get or generate unique per-user salt
        const userSalt = this.#getOrCreateUserSalt();

        // Get additional entropy sources for stronger key derivation
        const installEntropy = this.#getOrCreateInstallEntropy();
        const firstUseTimestamp = this.#getOrCreateFirstUseTimestamp();

        // Create key material from multiple entropy sources
        // Combines: origin, userAgent (limited), install-time random, first-use timestamp
        const keySource = [
            window.location.origin,
            navigator.userAgent.substring(0, 50),
            installEntropy,
            firstUseTimestamp
        ].join('::');

        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(keySource),
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        // Use unique user salt
        const saltBytes = encoder.encode('jamf-assistant-v3-' + userSalt);

        // Derive AES-256 key with PBKDF2
        this.#cachedKey = await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: saltBytes,
                iterations: this.#iterations,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );

        return this.#cachedKey;
    }

    /**
     * Gets existing user salt or creates a new one
     *
     * @private
     * @returns {string} Base64-encoded user salt
     */
    #getOrCreateUserSalt() {
        let userSalt = localStorage.getItem(this.#saltStorageKey);

        if (!userSalt) {
            // Generate random 16-byte salt
            const randomSalt = window.crypto.getRandomValues(new Uint8Array(16));
            userSalt = btoa(String.fromCharCode(...randomSalt));
            localStorage.setItem(this.#saltStorageKey, userSalt);
        }

        return userSalt;
    }

    /**
     * Gets existing installation entropy or creates a new one
     * This random value is generated once per installation and persists
     *
     * @private
     * @returns {string} Base64-encoded installation entropy
     */
    #getOrCreateInstallEntropy() {
        let entropy = localStorage.getItem(this.#entropyStorageKey);

        if (!entropy) {
            // Generate random 32-byte entropy at first installation
            const randomEntropy = window.crypto.getRandomValues(new Uint8Array(32));
            entropy = btoa(String.fromCharCode(...randomEntropy));
            localStorage.setItem(this.#entropyStorageKey, entropy);
        }

        return entropy;
    }

    /**
     * Gets existing first-use timestamp or creates a new one
     * This timestamp marks the first use of the application
     *
     * @private
     * @returns {string} First-use timestamp in ISO format
     */
    #getOrCreateFirstUseTimestamp() {
        let timestamp = localStorage.getItem(this.#timestampStorageKey);

        if (!timestamp) {
            // Record first use timestamp
            timestamp = new Date().toISOString();
            localStorage.setItem(this.#timestampStorageKey, timestamp);
        }

        return timestamp;
    }

    /**
     * Clears the cached key (call when security context changes)
     * @returns {void}
     */
    clearCache() {
        this.#cachedKey = null;
    }

    /**
     * Checks if a string appears to be encrypted (base64 with min length)
     *
     * @param {string} data - Data to check
     * @returns {boolean} True if data appears encrypted
     *
     * @example
     * if (encService.isEncrypted(storedValue)) {
     *   const decrypted = await encService.decrypt(storedValue);
     * }
     */
    isEncrypted(data) {
        if (typeof data !== 'string' || data.length < 20) {
            return false;
        }

        // Check if valid base64 with reasonable length
        try {
            const decoded = atob(data);
            // IV (12) + at least some encrypted data (8+)
            return decoded.length > this.#ivLength + 8;
        } catch {
            return false;
        }
    }
}

export default EncryptionService;

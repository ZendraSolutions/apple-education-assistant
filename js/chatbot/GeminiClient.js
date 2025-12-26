/**
 * @fileoverview Gemini API Client - HTTP client for Google Gemini
 * @module chatbot/GeminiClient
 * @version 2.2.0
 * @license MIT
 *
 * Handles all communication with the Google Gemini API.
 * Supports RAG context injection and conversation history.
 * Includes ErrorMonitor integration for production error tracking.
 *
 * @security API key is passed via header, not URL parameters
 * @security Integrates PromptGuard for injection protection
 */

import { PromptGuard } from './PromptGuard.js';
import { ErrorMonitor } from '../core/ErrorMonitor.js';

/**
 * @typedef {Object} ConversationMessage
 * @property {string} role - 'user' or 'model'
 * @property {Array<{text: string}>} parts - Message content parts
 */

/**
 * @typedef {Object} GeminiConfig
 * @property {number} [temperature=0.3] - Response randomness (0-1)
 * @property {number} [maxOutputTokens=1024] - Maximum response length
 * @property {number} [timeout=30000] - Request timeout in ms
 */

/**
 * Custom error for API failures
 * @class GeminiApiError
 * @extends Error
 */
export class GeminiApiError extends Error {
    /**
     * @param {string} message - Error message
     * @param {number} [statusCode] - HTTP status code
     * @param {Error} [cause] - Original error
     */
    constructor(message, statusCode, cause) {
        super(message);
        this.name = 'GeminiApiError';
        this.statusCode = statusCode;
        this.cause = cause;
    }
}

/**
 * @class GeminiClient
 * @description HTTP client for Google Gemini API
 *
 * @example
 * const client = new GeminiClient('AIza...');
 * const response = await client.sendMessage(
 *   'How do I enroll a device?',
 *   systemPrompt,
 *   conversationHistory
 * );
 */
export class GeminiClient {
    /** @private @type {string} */
    #apiKey;

    /** @private @type {string} */
    #model = 'gemini-2.5-flash';

    /** @private @type {string} */
    #baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

    /** @private @type {number} */
    #timeout = 30000;

    /** @private @type {number} */
    #temperature = 0.3;

    /** @private @type {number} */
    #maxOutputTokens = 1024;

    /** @private @type {number} */
    #maxHistoryLength = 16;

    /** @private @type {ConversationMessage[]} */
    #conversationHistory = [];

    /**
     * Creates a new GeminiClient instance
     *
     * @param {string} apiKey - Google AI API key
     * @param {GeminiConfig} [config] - Optional configuration
     * @throws {Error} If apiKey is not provided
     */
    constructor(apiKey, config = {}) {
        if (!apiKey) {
            throw new Error('API key is required');
        }

        this.#apiKey = apiKey;

        if (config.timeout) this.#timeout = config.timeout;
        if (config.temperature !== undefined) this.#temperature = config.temperature;
        if (config.maxOutputTokens) this.#maxOutputTokens = config.maxOutputTokens;
    }

    /**
     * Current conversation history
     * @type {ConversationMessage[]}
     * @readonly
     */
    get conversationHistory() {
        return [...this.#conversationHistory];
    }

    /**
     * Updates the API key
     * @param {string} apiKey - New API key
     */
    setApiKey(apiKey) {
        this.#apiKey = apiKey;
    }

    /**
     * Sends a message to Gemini with optional context and history
     * Applies PromptGuard protection against injection attacks
     *
     * @param {string} userMessage - User's message
     * @param {string} systemPrompt - System instructions
     * @param {string} [ragContext=''] - RAG-retrieved context
     * @returns {Promise<string>} Model's response
     * @throws {GeminiApiError} If API call fails or message is blocked
     *
     * @example
     * const response = await client.sendMessage(
     *   'Como configuro App Aula?',
     *   systemPrompt,
     *   ragContext
     * );
     *
     * @security User messages and RAG context are validated and sanitized
     */
    async sendMessage(userMessage, systemPrompt, ragContext = '') {
        // Add breadcrumb for request tracking
        ErrorMonitor.addBreadcrumb({
            category: 'api',
            message: 'Sending message to Gemini API',
            level: 'info',
            data: {
                model: this.#model,
                hasContext: !!ragContext,
                messageLength: userMessage?.length || 0
            }
        });

        // Validate user message for injection attempts
        const userValidation = PromptGuard.validateUserMessage(userMessage);
        if (!userValidation.valid) {
            console.warn('[GeminiClient] User message blocked:', userValidation.threats);
            throw new GeminiApiError(
                'Tu mensaje contiene patrones no permitidos. Por favor, reformula tu pregunta.',
                400
            );
        }

        // Use the validated/truncated message
        const safeUserMessage = userValidation.message;

        // Add user message to history
        this.#conversationHistory.push({
            role: 'user',
            parts: [{ text: safeUserMessage }]
        });

        // Sanitize RAG context with clear delimiters
        let safeContext = '';
        if (ragContext) {
            const contextAnalysis = PromptGuard.analyze(ragContext);
            if (contextAnalysis.safe) {
                safeContext = PromptGuard.sanitize(ragContext);
                safeContext = PromptGuard.wrapContext(safeContext);
            } else {
                console.warn('[GeminiClient] RAG context blocked:', contextAnalysis.threats);
                // Continue without context rather than failing
            }
        }

        // Build full prompt with sanitized context
        const fullSystemPrompt = safeContext
            ? `${systemPrompt}\n\n${safeContext}`
            : systemPrompt;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.#timeout);

        try {
            const response = await fetch(
                `${this.#baseUrl}/${this.#model}:generateContent`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': this.#apiKey
                    },
                    body: JSON.stringify({
                        contents: [
                            { role: 'user', parts: [{ text: fullSystemPrompt }] },
                            { role: 'model', parts: [{ text: 'Entendido.' }] },
                            ...this.#conversationHistory
                        ],
                        tools: [{ google_search: {} }],
                        generationConfig: {
                            temperature: this.#temperature,
                            maxOutputTokens: this.#maxOutputTokens
                        }
                    }),
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new GeminiApiError(
                    err.error?.message || 'API Error',
                    response.status
                );
            }

            const data = await response.json();
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!botResponse) {
                throw new GeminiApiError('Malformed API response');
            }

            // Add bot response to history
            this.#conversationHistory.push({
                role: 'model',
                parts: [{ text: botResponse }]
            });

            // Trim history if too long
            this.#trimHistory();

            return botResponse;
        } catch (error) {
            clearTimeout(timeoutId);

            // Add breadcrumb for error context
            ErrorMonitor.addBreadcrumb({
                category: 'api',
                message: `Gemini API error: ${error.message}`,
                level: 'error',
                data: {
                    model: this.#model,
                    historyLength: this.#conversationHistory.length
                }
            });

            if (error.name === 'AbortError') {
                const timeoutError = new GeminiApiError(
                    `Timeout: La API tardo mas de ${this.#timeout / 1000} segundos en responder`
                );
                ErrorMonitor.captureException(timeoutError, {
                    component: 'GeminiClient',
                    action: 'sendMessage',
                    errorType: 'timeout',
                    timeout: this.#timeout
                });
                throw timeoutError;
            }

            if (error instanceof GeminiApiError) {
                ErrorMonitor.captureException(error, {
                    component: 'GeminiClient',
                    action: 'sendMessage',
                    errorType: 'api_error',
                    statusCode: error.statusCode
                });
                throw error;
            }

            const wrappedError = new GeminiApiError(error.message, null, error);
            ErrorMonitor.captureException(wrappedError, {
                component: 'GeminiClient',
                action: 'sendMessage',
                errorType: 'unknown',
                originalError: error.name
            });
            throw wrappedError;
        }
    }

    /**
     * Trims conversation history to max length
     * @private
     */
    #trimHistory() {
        if (this.#conversationHistory.length > this.#maxHistoryLength) {
            this.#conversationHistory = this.#conversationHistory.slice(-this.#maxHistoryLength);
        }
    }

    /**
     * Clears conversation history
     * @returns {void}
     */
    clearHistory() {
        this.#conversationHistory = [];
    }

    /**
     * Gets the current model name
     * @type {string}
     * @readonly
     */
    get model() {
        return this.#model;
    }

    /**
     * Sets the model to use
     * @param {string} model - Model name (e.g., 'gemini-2.5-flash')
     */
    setModel(model) {
        this.#model = model;
    }
}

export default GeminiClient;

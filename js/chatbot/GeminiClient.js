/**
 * @fileoverview Gemini API Client - HTTP client for Google Gemini
 * @module chatbot/GeminiClient
 * @version 2.0.0
 * @license MIT
 *
 * Handles all communication with the Google Gemini API.
 * Supports RAG context injection and conversation history.
 *
 * @security API key is passed via header, not URL parameters
 */

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
     *
     * @param {string} userMessage - User's message
     * @param {string} systemPrompt - System instructions
     * @param {string} [ragContext=''] - RAG-retrieved context
     * @returns {Promise<string>} Model's response
     * @throws {GeminiApiError} If API call fails
     *
     * @example
     * const response = await client.sendMessage(
     *   'Como configuro App Aula?',
     *   systemPrompt,
     *   ragContext
     * );
     */
    async sendMessage(userMessage, systemPrompt, ragContext = '') {
        // Add user message to history
        this.#conversationHistory.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        // Build full prompt with context
        const fullSystemPrompt = ragContext
            ? `${systemPrompt}\n\nDOCUMENTACION OFICIAL DE JAMF:\n${ragContext}`
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

            if (error.name === 'AbortError') {
                throw new GeminiApiError(
                    `Timeout: La API tardo mas de ${this.#timeout / 1000} segundos en responder`
                );
            }

            if (error instanceof GeminiApiError) {
                throw error;
            }

            throw new GeminiApiError(error.message, null, error);
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

/**
 * @fileoverview Chatbot Module - Main entry point and factory
 * @module chatbot
 * @version 2.0.0
 * @license MIT
 *
 * Jamf Assistant - Educational AI Chatbot
 *
 * Architecture: Clean Architecture with Dependency Injection
 * - ChatbotCore: Orchestrator (no business logic)
 * - Modules: Single Responsibility, loosely coupled
 * - EventBus: Pub/Sub for inter-module communication
 *
 * @example
 * // Simple usage (recommended)
 * import { createChatbot } from './chatbot/index.js';
 * const chatbot = await createChatbot();
 *
 * // Advanced usage with custom config
 * import { createChatbot } from './chatbot/index.js';
 * const chatbot = await createChatbot({
 *   rateLimitCalls: 15,
 *   rateLimitWindow: 60000
 * });
 */

// Module exports
export { RateLimiter } from './RateLimiter.js';
export { EncryptionService, EncryptionError, DecryptionError } from './EncryptionService.js';
export { ApiKeyManager } from './ApiKeyManager.js';
export { GeminiClient, GeminiApiError } from './GeminiClient.js';
export { RAGEngine } from './RAGEngine.js';
export { EmbeddingService } from './EmbeddingService.js';
export { ChatUI } from './ChatUI.js';
export { EventBus, ChatEvents } from './EventBus.js';
export { ChatbotCore } from './ChatbotCore.js';
export { PromptGuard } from './PromptGuard.js';

// Import for factory (Composition Root pattern)
import { RateLimiter } from './RateLimiter.js';
import { EncryptionService } from './EncryptionService.js';
import { ApiKeyManager } from './ApiKeyManager.js';
import { GeminiClient } from './GeminiClient.js';
import { RAGEngine } from './RAGEngine.js';
import { ChatUI } from './ChatUI.js';
import { EventBus } from './EventBus.js';
import { ChatbotCore } from './ChatbotCore.js';
import { createGeminiValidator } from '../patterns/ValidatorChain.js';

/**
 * @typedef {Object} ChatbotConfig
 * @property {number} [rateLimitCalls=10] - Max API calls per window
 * @property {number} [rateLimitWindow=60000] - Rate limit window in ms
 * @property {string} [docsPath='data/docs.json'] - Path to documentation
 */

/**
 * Factory function to create a fully configured chatbot instance
 *
 * @param {ChatbotConfig} [config={}] - Optional configuration
 * @returns {Promise<ChatbotCore>} Initialized chatbot instance
 *
 * @example
 * const chatbot = await createChatbot();
 *
 * // Listen to events
 * chatbot.eventBus.on('message:received', (msg) => {
 *   console.log('Bot response:', msg);
 * });
 */
export async function createChatbot(config = {}) {
    const {
        rateLimitCalls = 10,
        rateLimitWindow = 60000,
        docsPath = 'data/docs.json'
    } = config;

    // Composition Root: All dependencies created here (D-Principle)
    const encryptionService = new EncryptionService();
    const validatorChain = createGeminiValidator();
    const apiKeyManager = new ApiKeyManager({
        encryptionService,
        validatorChain
    });
    const rateLimiter = new RateLimiter(rateLimitCalls, rateLimitWindow);
    const ragEngine = new RAGEngine(docsPath);
    const chatUI = new ChatUI();
    const eventBus = new EventBus();

    // Factory for GeminiClient (D-Principle: inject factory)
    const geminiClientFactory = (apiKey) => new GeminiClient(apiKey);

    // Create core with injected dependencies
    const chatbot = new ChatbotCore({
        apiKeyManager,
        ragEngine,
        chatUI,
        rateLimiter,
        eventBus,
        geminiClientFactory
    });

    // Initialize
    await chatbot.init();

    return chatbot;
}

/**
 * Legacy compatibility wrapper - Creates JamfChatbot class
 *
 * This maintains backward compatibility with existing code that uses:
 * `new JamfChatbot()` or `window.JamfChatbot`
 *
 * @class JamfChatbot
 * @deprecated Use createChatbot() factory instead
 */
export class JamfChatbot {
    /** @private @type {ChatbotCore|null} */
    #core = null;

    /** @private @type {RateLimiter} */
    #rateLimiter;

    /** @private @type {ApiKeyManager} */
    #apiKeyManager;

    /** @private @type {RAGEngine} */
    #ragEngine;

    /**
     * Creates legacy JamfChatbot instance
     * @deprecated Use createChatbot() instead
     */
    constructor() {
        // Composition Root: All dependencies created here (D-Principle)
        const encryptionService = new EncryptionService();
        const validatorChain = createGeminiValidator();
        this.#apiKeyManager = new ApiKeyManager({
            encryptionService,
            validatorChain
        });
        this.#rateLimiter = new RateLimiter(10, 60000);
        this.#ragEngine = new RAGEngine();

        // Expose for legacy compatibility
        this.rateLimiter = this.#rateLimiter;
        this.jamfDocs = [];
        this.docsMetadata = {
            version: '1.0.0',
            lastUpdated: '2025-12-23',
            source: 'Manual'
        };

        // Initialize asynchronously
        this.#initAsync();
    }

    /**
     * Async initialization
     * @private
     */
    async #initAsync() {
        try {
            const chatUI = new ChatUI();
            const eventBus = new EventBus();
            const geminiClientFactory = (apiKey) => new GeminiClient(apiKey);

            await this.#apiKeyManager.loadSettings();

            this.#core = new ChatbotCore({
                apiKeyManager: this.#apiKeyManager,
                ragEngine: this.#ragEngine,
                chatUI,
                rateLimiter: this.#rateLimiter,
                eventBus,
                geminiClientFactory
            });

            await this.#core.init();

            // Update legacy properties
            this.jamfDocs = [];
            this.docsMetadata = this.#ragEngine.metadata;

        } catch (error) {
            console.error('[JamfChatbot] Initialization error:', error);
        }
    }

    /**
     * Legacy property: API key
     * @type {string}
     */
    get apiKey() {
        return this.#apiKeyManager?.apiKey || '';
    }

    /**
     * Legacy property: Is pinned
     * @type {boolean}
     */
    get isPinned() {
        return this.#apiKeyManager?.isPinned || false;
    }

    /**
     * Legacy property: Conversation history
     * @type {Array}
     */
    get conversationHistory() {
        return this.#core?.conversationHistory || [];
    }
}

// Make available globally for backward compatibility
if (typeof window !== 'undefined') {
    window.JamfChatbot = JamfChatbot;
    window.createChatbot = createChatbot;
}

export default createChatbot;

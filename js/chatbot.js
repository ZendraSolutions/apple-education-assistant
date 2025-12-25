/**
 * JAMF ASSISTANT - Chatbot Module v5 (Modular Architecture)
 * Sistema RAG centrado en ASM + Jamf School + App Aula
 * Colegio Huerta Santa Ana - Gines, Sevilla
 *
 * @version 5.1.0
 * @license MIT
 *
 * Architecture: Clean Architecture with SOLID Principles
 *
 * This file provides backward compatibility by re-exporting the modular
 * chatbot components and providing a factory for legacy usage.
 *
 * SOLID Compliance:
 * - S: Each module in js/chatbot/ has single responsibility
 * - O: ValidatorChain allows extending validation without modification
 * - L: All classes can be substituted via their interfaces
 * - I: Small, focused interfaces for each module
 * - D: Dependencies injected via constructor, no internal instantiation
 *
 * @example
 * // Modern usage (SOLID compliant)
 * import { createChatbot } from './chatbot.js';
 * const chatbot = await createChatbot();
 *
 * @example
 * // Legacy usage (for backward compatibility)
 * const chatbot = new JamfChatbot();
 */

// ============================================================================
// RE-EXPORT MODULAR COMPONENTS
// ============================================================================

// Import logger for conditional logging
import { logger } from './utils/Logger.js';

// Re-export all modular components for direct usage
export { RateLimiter } from './chatbot/RateLimiter.js';
export { EncryptionService, EncryptionError, DecryptionError } from './chatbot/EncryptionService.js';
export { ApiKeyManager } from './chatbot/ApiKeyManager.js';
export { GeminiClient, GeminiApiError } from './chatbot/GeminiClient.js';
export { RAGEngine } from './chatbot/RAGEngine.js';
export { ChatUI } from './chatbot/ChatUI.js';
export { EventBus as ChatEventBus, ChatEvents } from './chatbot/EventBus.js';
export { ChatbotCore } from './chatbot/ChatbotCore.js';

// ============================================================================
// LEGACY COMPATIBILITY LAYER
// ============================================================================

/**
 * @typedef {Object} ChatbotDependencies
 * @property {import('./chatbot/EncryptionService.js').EncryptionService} encryptionService
 * @property {import('./chatbot/ApiKeyManager.js').ApiKeyManager} apiKeyManager
 * @property {import('./chatbot/RateLimiter.js').RateLimiter} rateLimiter
 * @property {import('./chatbot/RAGEngine.js').RAGEngine} ragEngine
 * @property {import('./chatbot/ChatUI.js').ChatUI} chatUI
 * @property {import('./chatbot/GeminiClient.js').GeminiClient} [geminiClient]
 * @property {Function} geminiClientFactory - Factory to create GeminiClient
 */

/**
 * @class JamfChatbot
 * @description Main chatbot class - orchestrates all modules with DI
 *
 * SOLID Compliance:
 * - D (Dependency Inversion): All dependencies injected via constructor
 * - S (Single Responsibility): Only orchestration, delegates to modules
 *
 * @example
 * // With dependency injection (SOLID compliant)
 * const chatbot = new JamfChatbot({
 *     encryptionService,
 *     apiKeyManager,
 *     rateLimiter,
 *     ragEngine,
 *     chatUI,
 *     geminiClientFactory: (key) => new GeminiClient(key)
 * });
 */
class JamfChatbot {
    /** @private */ #encryptionService;
    /** @private */ #apiKeyManager;
    /** @private */ #rateLimiter;
    /** @private */ #ragEngine;
    /** @private */ #chatUI;
    /** @private */ #geminiClient = null;
    /** @private */ #geminiClientFactory;
    /** @private */ #isProcessing = false;
    /** @private */ #systemPrompt;

    /**
     * Creates a new JamfChatbot instance with dependency injection.
     *
     * @param {ChatbotDependencies} deps - Injected dependencies
     * @throws {Error} If required dependencies are missing
     */
    constructor(deps) {
        this.#validateDependencies(deps);

        this.#encryptionService = deps.encryptionService;
        this.#apiKeyManager = deps.apiKeyManager;
        this.#rateLimiter = deps.rateLimiter;
        this.#ragEngine = deps.ragEngine;
        this.#chatUI = deps.chatUI;
        this.#geminiClient = deps.geminiClient || null;
        this.#geminiClientFactory = deps.geminiClientFactory;

        this.#systemPrompt = this.#buildSystemPrompt();
    }

    /**
     * Validates required dependencies
     * @private
     */
    #validateDependencies(deps) {
        const required = ['encryptionService', 'apiKeyManager', 'rateLimiter', 'ragEngine', 'chatUI', 'geminiClientFactory'];
        for (const dep of required) {
            if (!deps[dep]) {
                throw new Error(`JamfChatbot requires dependency: ${dep}`);
            }
        }
    }

    // ========================================================================
    // PUBLIC GETTERS (Legacy compatibility)
    // ========================================================================

    get apiKey() { return this.#apiKeyManager.apiKey; }
    get isPinned() { return this.#apiKeyManager.isPinned; }
    get useSessionOnly() { return this.#apiKeyManager.isSessionOnly; }
    get expiryTime() { return this.#apiKeyManager.expiryTime; }
    get isOpen() { return this.#chatUI.isOpen; }
    get conversationHistory() { return this.#geminiClient?.conversationHistory || []; }
    get isProcessing() { return this.#isProcessing; }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    /**
     * Initializes the chatbot
     * @returns {Promise<void>}
     */
    async init() {
        await this.#apiKeyManager.loadSettings();
        if (this.#apiKeyManager.hasKey) {
            this.#geminiClient = this.#geminiClientFactory(this.#apiKeyManager.apiKey);
        }
        await this.#ragEngine.loadDocumentation();
        this.#bindEvents();
        this.#updateApiKeyUI();
        this.#showDocsInfo();
    }

    // ========================================================================
    // EVENT BINDING
    // ========================================================================

    #bindEvents() {
        document.getElementById('chatbotFab')?.addEventListener('click', () => this.#handleChatToggle());
        document.getElementById('chatbotClose')?.addEventListener('click', () => this.#chatUI.closeChat());
        document.getElementById('chatbotSettings')?.addEventListener('click', () => {
            this.#chatUI.openApiModal();
            this.#updateApiKeyUI();
        });
        document.getElementById('chatbotSend')?.addEventListener('click', () => this.#handleSendMessage());
        document.getElementById('chatbotInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.#isProcessing) this.#handleSendMessage();
        });
        document.getElementById('apiModalClose')?.addEventListener('click', () => this.#chatUI.closeApiModal());
        document.getElementById('saveApiKey')?.addEventListener('click', () => this.#handleSaveApiKey());
        document.getElementById('apiModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'apiModal') this.#chatUI.closeApiModal();
        });
        document.getElementById('apiKeyInput')?.addEventListener('input', (e) => {
            this.#handleApiKeyValidation(e.target.value);
        });
        document.getElementById('sessionApiKey')?.addEventListener('change', (e) => {
            if (e.target.checked) document.getElementById('pinApiKey').checked = false;
        });
        document.getElementById('pinApiKey')?.addEventListener('change', (e) => {
            if (e.target.checked) document.getElementById('sessionApiKey').checked = false;
        });
    }

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    #handleChatToggle() {
        const isOpen = this.#chatUI.toggleChat();
        if (isOpen && !this.#apiKeyManager.hasKey) {
            setTimeout(() => {
                if (!this.#apiKeyManager.hasKey) {
                    const meta = this.#ragEngine.metadata;
                    this.#chatUI.addBotMessage(
                        `Para respuestas con IA, necesitas una API Key de Google Gemini (gratuita). ` +
                        `Pulsa el icono de configuracion para configurarla.\n\n` +
                        `Documentacion: v${meta.version} (${meta.lastUpdated})`
                    );
                }
            }, 500);
        }
    }

    async #handleSendMessage() {
        const message = this.#chatUI.getInputValue();
        if (!message || this.#isProcessing) return;

        this.#isProcessing = true;

        try {
            if (this.#apiKeyManager.hasKey) {
                const rateLimitCheck = this.#rateLimiter.canMakeCall();
                if (!rateLimitCheck.allowed) {
                    this.#showRateLimitMessage(message, rateLimitCheck.waitTime);
                    return;
                }
            }

            this.#chatUI.clearInput();
            this.#chatUI.addUserMessage(message);
            this.#chatUI.showTyping();

            const relevantDocs = this.#ragEngine.search(message);

            let response;
            if (this.#apiKeyManager.hasKey && this.#geminiClient) {
                const ragContext = this.#ragEngine.buildContext(relevantDocs);
                response = await this.#geminiClient.sendMessage(message, this.#systemPrompt, ragContext);
            } else {
                response = this.#ragEngine.generateOfflineResponse(message, relevantDocs);
            }

            this.#chatUI.hideTyping();
            this.#chatUI.addBotMessage(response);

            if (relevantDocs.length > 0) {
                this.#chatUI.showSources(relevantDocs);
            }

            if (this.#apiKeyManager.hasKey) {
                const remaining = this.#rateLimiter.getRemainingCalls();
                if (remaining <= 3) {
                    this.#chatUI.showRateLimitWarning(remaining);
                }
            }
        } catch (error) {
            this.#chatUI.hideTyping();
            this.#chatUI.addBotMessage('Error al procesar. ' + (error.message || 'Verifica tu conexion.'));
            logger.error('Chat error:', error);
        } finally {
            this.#isProcessing = false;
        }
    }

    #showRateLimitMessage(message, waitTime) {
        const waitMinutes = Math.floor(waitTime / 60);
        const waitSeconds = waitTime % 60;
        const timeText = waitMinutes > 0
            ? `${waitMinutes} minuto${waitMinutes > 1 ? 's' : ''} y ${waitSeconds} segundo${waitSeconds !== 1 ? 's' : ''}`
            : `${waitSeconds} segundo${waitSeconds !== 1 ? 's' : ''}`;

        this.#chatUI.addUserMessage(message);
        this.#chatUI.addBotMessage(
            `**Limite de consultas alcanzado**\n\n` +
            `Para proteger tu cuota de API, he limitado las llamadas a ${this.#rateLimiter.maxCalls} por minuto.\n\n` +
            `Por favor, espera **${timeText}** antes de hacer otra consulta.\n\n` +
            `_Esto protege tu API Key de Google de consumir toda su cuota gratuita._`
        );

        this.#isProcessing = false;
    }

    #handleApiKeyValidation(value) {
        const trimmed = value.trim();
        if (!trimmed) {
            this.#chatUI.updateValidationInfo(null);
            return;
        }
        const cleanKey = trimmed.replace(/[\s\n\r]/g, '');
        const validation = this.#apiKeyManager.validateFormat(cleanKey);
        this.#chatUI.updateValidationInfo(validation);
    }

    async #handleSaveApiKey() {
        const { key, pinned, sessionOnly } = this.#chatUI.getApiModalValues();

        if (!key) {
            this.#chatUI.updateApiStatus('Introduce una API Key valida', 'error');
            return;
        }

        const cleanKey = key.replace(/[\s\n\r]/g, '');
        const formatValidation = this.#apiKeyManager.validateFormat(cleanKey);

        if (!formatValidation.valid) {
            this.#chatUI.updateApiStatus(formatValidation.error, 'error');
            return;
        }

        this.#chatUI.updateApiStatus(`Validando formato... (Fortaleza: ${formatValidation.strength})`, '');

        const result = await this.#apiKeyManager.testKey(cleanKey);

        if (result.valid) {
            await this.#apiKeyManager.saveKey(cleanKey, pinned, sessionOnly);
            this.#geminiClient = this.#geminiClientFactory(cleanKey);

            let msg = sessionOnly
                ? 'API Key guardada solo para esta sesion'
                : pinned
                    ? 'API Key guardada permanentemente (cifrada)'
                    : 'API Key guardada por 24 horas (cifrada)';

            this.#chatUI.updateApiStatus(msg, 'success');
            setTimeout(() => this.#chatUI.closeApiModal(), 1500);
        } else {
            this.#chatUI.updateApiStatus(result.error, 'error');
        }
    }

    // ========================================================================
    // UI HELPERS
    // ========================================================================

    #updateApiKeyUI() {
        this.#chatUI.updateApiKeyUI({
            apiKey: this.#apiKeyManager.apiKey,
            isPinned: this.#apiKeyManager.isPinned,
            isSessionOnly: this.#apiKeyManager.isSessionOnly,
            statusText: this.#apiKeyManager.getStatusDescription()
        });
    }

    #showDocsInfo() {
        const meta = this.#ragEngine.metadata;
        this.#chatUI.showDocsInfo({
            lastUpdated: meta.lastUpdated,
            articleCount: this.#ragEngine.documentCount
        });
    }

    // ========================================================================
    // SYSTEM PROMPT
    // ========================================================================

    #buildSystemPrompt() {
        return `Eres un asistente experto en el ecosistema educativo de Apple para un centro escolar.

ECOSISTEMA (orden de importancia):
1. APPLE SCHOOL MANAGER (ASM) - school.apple.com - ES EL CENTRO DE TODO
   - Aqui se crean usuarios (profesores, alumnos)
   - Aqui se crean las clases
   - Aqui se asignan dispositivos al servidor MDM
   - Aqui se compran y asignan apps (VPP integrado)

2. JAMF SCHOOL - Herramienta de gestion (MDM)
   - RECIBE usuarios y dispositivos desde ASM (sincronizacion)
   - Aplica perfiles de configuracion y restricciones
   - Distribuye apps a los dispositivos
   - NO es donde se crean usuarios ni clases (eso es en ASM)

3. DISPOSITIVOS + APP AULA
   - iPads supervisados para alumnado
   - Macs para profesorado
   - App Aula (Apple Classroom) usa las clases creadas en ASM

FLUJO CORRECTO: ASM crea -> Jamf sincroniza -> Dispositivos reciben

INSTRUCCIONES:
1. Responde en espanol, con lenguaje accesible para profesores (no solo IT)
2. Usa la DOCUMENTACION proporcionada como base
3. Siempre menciona si algo se hace en ASM o en Jamf School
4. Para problemas: primero verificar ASM, luego Jamf, luego dispositivo
5. Da rutas de menu exactas cuando sea posible
6. La app Aula es fundamental - prioriza soluciones relacionadas

IMPORTANTE: Si el usuario pregunta como crear algo (usuarios, clases, etc.),
recuerda que se crea en Apple School Manager, NO en Jamf.`;
    }

    // ========================================================================
    // PUBLIC METHODS (Legacy compatibility)
    // ========================================================================

    toggleChat() { this.#handleChatToggle(); }
    closeChat() { this.#chatUI.closeChat(); }
    openApiModal() { this.#chatUI.openApiModal(); this.#updateApiKeyUI(); }
    closeApiModal() { this.#chatUI.closeApiModal(); }
    sendMessage() { this.#handleSendMessage(); }
    clearHistory() { if (this.#geminiClient) this.#geminiClient.clearHistory(); }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Creates a fully configured JamfChatbot instance.
 * This is the recommended way to create a chatbot with proper DI.
 *
 * @param {Object} [config={}] - Configuration options
 * @param {number} [config.rateLimitCalls=10] - Max calls per window
 * @param {number} [config.rateLimitWindow=60000] - Rate limit window in ms
 * @returns {Promise<JamfChatbot>} Configured chatbot instance
 *
 * @example
 * const chatbot = await createChatbot({ rateLimitCalls: 15 });
 * await chatbot.init();
 */
export async function createChatbot(config = {}) {
    const { rateLimitCalls = 10, rateLimitWindow = 60000 } = config;

    // Lazy load modules to avoid circular dependencies
    const [
        { EncryptionService },
        { ApiKeyManager },
        { RateLimiter },
        { RAGEngine },
        { ChatUI },
        { GeminiClient },
        { createGeminiValidator }
    ] = await Promise.all([
        import('./chatbot/EncryptionService.js'),
        import('./chatbot/ApiKeyManager.js'),
        import('./chatbot/RateLimiter.js'),
        import('./chatbot/RAGEngine.js'),
        import('./chatbot/ChatUI.js'),
        import('./chatbot/GeminiClient.js'),
        import('./patterns/ValidatorChain.js')
    ]);

    // Create dependencies - all instantiation happens in factory (Composition Root)
    const encryptionService = new EncryptionService();
    const validatorChain = createGeminiValidator();
    const apiKeyManager = new ApiKeyManager({
        encryptionService,
        validatorChain
    });
    const rateLimiter = new RateLimiter(rateLimitCalls, rateLimitWindow);
    const ragEngine = new RAGEngine();
    const chatUI = new ChatUI();

    return new JamfChatbot({
        encryptionService,
        apiKeyManager,
        rateLimiter,
        ragEngine,
        chatUI,
        geminiClientFactory: (key) => new GeminiClient(key)
    });
}

/**
 * Creates a JamfChatbot with custom dependencies (for testing).
 *
 * @param {ChatbotDependencies} deps - Custom dependencies
 * @returns {JamfChatbot} Chatbot with custom dependencies
 *
 * @example
 * // Testing with mocks
 * const chatbot = createChatbotWithDeps({
 *     encryptionService: mockEncryption,
 *     apiKeyManager: mockApiManager,
 *     ...
 * });
 */
export function createChatbotWithDeps(deps) {
    return new JamfChatbot(deps);
}

// ============================================================================
// GLOBAL EXPORT FOR LEGACY SCRIPT TAG USAGE
// ============================================================================

// Make JamfChatbot available globally for legacy compatibility
// but encourage using the factory function
if (typeof window !== 'undefined') {
    // Provide a proxy that creates the chatbot on first use
    window.JamfChatbot = class LegacyJamfChatbot {
        constructor() {
            logger.warn(
                '[JamfChatbot] Direct instantiation is deprecated. ' +
                'Use createChatbot() for SOLID-compliant dependency injection.'
            );

            // Create the chatbot synchronously for backward compatibility
            // This requires the modules to be already loaded
            return this.#createLegacyInstance();
        }

        #createLegacyInstance() {
            // For legacy compatibility, we need to create instances here
            // This is NOT SOLID compliant but maintains backward compatibility
            const loadModules = async () => {
                const chatbot = await createChatbot();
                await chatbot.init();
                return chatbot;
            };

            // Return a promise-like object for async init
            const instance = {
                _initPromise: loadModules(),
                async init() {
                    return this._initPromise;
                }
            };

            return instance;
        }
    };

    // Also expose the factory function
    window.createChatbot = createChatbot;
}

export { JamfChatbot };
export default JamfChatbot;

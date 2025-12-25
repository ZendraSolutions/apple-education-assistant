/**
 * @fileoverview Chatbot Core - Main orchestrator
 * @module chatbot/ChatbotCore
 * @version 2.0.0
 * @license MIT
 *
 * Central orchestrator for the Jamf Assistant chatbot.
 * Coordinates all modules using dependency injection.
 *
 * @example
 * import { createChatbot } from './chatbot/index.js';
 * const chatbot = await createChatbot();
 */

import { ChatEvents } from './EventBus.js';

/**
 * @typedef {Object} ChatbotDependencies
 * @property {import('./ApiKeyManager.js').ApiKeyManager} apiKeyManager
 * @property {import('./GeminiClient.js').GeminiClient} [geminiClient]
 * @property {import('./RAGEngine.js').RAGEngine} ragEngine
 * @property {import('./ChatUI.js').ChatUI} chatUI
 * @property {import('./RateLimiter.js').RateLimiter} rateLimiter
 * @property {import('./EventBus.js').EventBus} eventBus
 * @property {function(string): import('./GeminiClient.js').GeminiClient} geminiClientFactory - Factory to create GeminiClient
 */

/**
 * @class ChatbotCore
 * @description Main orchestrator for the Jamf Assistant chatbot
 *
 * Responsibilities:
 * - Coordinates all chatbot modules
 * - Handles message flow
 * - Manages initialization and event binding
 *
 * Does NOT:
 * - Implement business logic (delegated to modules)
 * - Render UI (delegated to ChatUI)
 * - Handle encryption (delegated to EncryptionService)
 */
export class ChatbotCore {
    /** @private @type {import('./ApiKeyManager.js').ApiKeyManager} */
    #apiKeyManager;

    /** @private @type {import('./GeminiClient.js').GeminiClient|null} */
    #geminiClient = null;

    /** @private @type {import('./RAGEngine.js').RAGEngine} */
    #ragEngine;

    /** @private @type {import('./ChatUI.js').ChatUI} */
    #chatUI;

    /** @private @type {import('./RateLimiter.js').RateLimiter} */
    #rateLimiter;

    /** @private @type {import('./EventBus.js').EventBus} */
    #eventBus;

    /** @private @type {function(string): import('./GeminiClient.js').GeminiClient} */
    #geminiClientFactory;

    /** @private @type {boolean} */
    #isProcessing = false;

    /** @private @type {boolean} */
    #isInitialized = false;

    /** @private @type {string} */
    #systemPrompt;

    /**
     * Creates a new ChatbotCore instance
     *
     * @param {ChatbotDependencies} deps - Injected dependencies
     * @throws {Error} If required dependencies are missing
     */
    constructor(deps) {
        this.#validateDependencies(deps);

        this.#apiKeyManager = deps.apiKeyManager;
        this.#geminiClient = deps.geminiClient || null;
        this.#ragEngine = deps.ragEngine;
        this.#chatUI = deps.chatUI;
        this.#rateLimiter = deps.rateLimiter;
        this.#eventBus = deps.eventBus;
        this.#geminiClientFactory = deps.geminiClientFactory;

        this.#systemPrompt = this.#buildSystemPrompt();
    }

    /**
     * Validates required dependencies
     * @private
     * @param {ChatbotDependencies} deps
     */
    #validateDependencies(deps) {
        const required = ['apiKeyManager', 'ragEngine', 'chatUI', 'rateLimiter', 'eventBus', 'geminiClientFactory'];
        for (const dep of required) {
            if (!deps[dep]) {
                throw new Error(`Missing required dependency: ${dep}`);
            }
        }
    }

    /**
     * Whether the chatbot is currently processing a message
     * @type {boolean}
     * @readonly
     */
    get isProcessing() {
        return this.#isProcessing;
    }

    /**
     * Whether the chatbot has been initialized
     * @type {boolean}
     * @readonly
     */
    get isInitialized() {
        return this.#isInitialized;
    }

    /**
     * Initializes the chatbot and all modules
     *
     * @returns {Promise<void>}
     *
     * @example
     * const chatbot = new ChatbotCore(deps);
     * await chatbot.init();
     */
    async init() {
        if (this.#isInitialized) return;

        // Load API key settings
        await this.#apiKeyManager.loadSettings();

        // Initialize Gemini client if we have an API key
        if (this.#apiKeyManager.hasKey) {
            this.#initGeminiClient();
        }

        // Load documentation
        await this.#ragEngine.loadDocumentation();

        // Bind UI events
        this.#bindEvents();

        // Update UI with current state
        this.#updateApiKeyUI();
        this.#showDocsInfo();

        this.#isInitialized = true;
        this.#eventBus.emit(ChatEvents.READY);
    }

    /**
     * Initializes the Gemini client with current API key
     * @private
     */
    #initGeminiClient() {
        // D-Principle: Use injected factory instead of direct instantiation
        this.#geminiClient = this.#geminiClientFactory(this.#apiKeyManager.apiKey);
    }

    /**
     * Binds all UI event handlers
     * @private
     */
    #bindEvents() {
        // Chat toggle
        document.getElementById('chatbotFab')?.addEventListener('click', () => {
            this.#handleChatToggle();
        });

        document.getElementById('chatbotClose')?.addEventListener('click', () => {
            this.#chatUI.closeChat();
            this.#eventBus.emit(ChatEvents.CHAT_CLOSED);
        });

        // Settings
        document.getElementById('chatbotSettings')?.addEventListener('click', () => {
            this.#chatUI.openApiModal();
            this.#updateApiKeyUI();
            this.#eventBus.emit(ChatEvents.MODAL_OPENED);
        });

        // Send message
        document.getElementById('chatbotSend')?.addEventListener('click', () => {
            this.#handleSendMessage();
        });

        document.getElementById('chatbotInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.#isProcessing) {
                this.#handleSendMessage();
            }
        });

        // API Modal
        document.getElementById('apiModalClose')?.addEventListener('click', () => {
            this.#chatUI.closeApiModal();
            this.#eventBus.emit(ChatEvents.MODAL_CLOSED);
        });

        document.getElementById('saveApiKey')?.addEventListener('click', () => {
            this.#handleSaveApiKey();
        });

        document.getElementById('apiModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'apiModal') {
                this.#chatUI.closeApiModal();
                this.#eventBus.emit(ChatEvents.MODAL_CLOSED);
            }
        });

        // API Key validation
        document.getElementById('apiKeyInput')?.addEventListener('input', (e) => {
            this.#handleApiKeyValidation(e.target.value);
        });

        // Mutually exclusive checkboxes
        document.getElementById('sessionApiKey')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.getElementById('pinApiKey').checked = false;
            }
        });

        document.getElementById('pinApiKey')?.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.getElementById('sessionApiKey').checked = false;
            }
        });
    }

    /**
     * Handles chat panel toggle
     * @private
     */
    #handleChatToggle() {
        const isOpen = this.#chatUI.toggleChat();

        if (isOpen) {
            this.#eventBus.emit(ChatEvents.CHAT_OPENED);

            // Show welcome message if no API key
            if (!this.#apiKeyManager.hasKey) {
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
        } else {
            this.#eventBus.emit(ChatEvents.CHAT_CLOSED);
        }
    }

    /**
     * Handles sending a message
     * @private
     */
    async #handleSendMessage() {
        const message = this.#chatUI.getInputValue();

        if (!message || this.#isProcessing) return;

        // Set processing flag immediately to prevent race conditions
        this.#isProcessing = true;

        try {
            // Check rate limiting if API key is configured
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

            // Search for relevant documents
            const relevantDocs = this.#ragEngine.search(message);

            let response;
            if (this.#apiKeyManager.hasKey && this.#geminiClient) {
                // Build RAG context
                const ragContext = this.#ragEngine.buildContext(relevantDocs);
                response = await this.#geminiClient.sendMessage(
                    message,
                    this.#systemPrompt,
                    ragContext
                );
            } else {
                // Offline response from documentation
                response = this.#ragEngine.generateOfflineResponse(message, relevantDocs);
            }

            this.#chatUI.hideTyping();
            this.#chatUI.addBotMessage(response);

            if (relevantDocs.length > 0) {
                this.#chatUI.showSources(relevantDocs);
            }

            // Show rate limit warning if running low
            if (this.#apiKeyManager.hasKey) {
                const remaining = this.#rateLimiter.getRemainingCalls();
                if (remaining <= 3) {
                    this.#chatUI.showRateLimitWarning(remaining);
                    this.#eventBus.emit(ChatEvents.RATE_LIMIT_WARNING, remaining);
                }
            }

            this.#eventBus.emit(ChatEvents.MESSAGE_RECEIVED, response);

        } catch (error) {
            this.#chatUI.hideTyping();
            this.#chatUI.addBotMessage('Error al procesar. ' + (error.message || 'Verifica tu conexion.'));
            console.error('Chat error:', error);
            this.#eventBus.emit(ChatEvents.MESSAGE_ERROR, error);

        } finally {
            this.#isProcessing = false;
        }
    }

    /**
     * Shows rate limit exceeded message
     * @private
     * @param {string} message - Original user message
     * @param {number} waitTime - Seconds to wait
     */
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

        this.#eventBus.emit(ChatEvents.RATE_LIMIT_EXCEEDED, waitTime);
        this.#isProcessing = false;
    }

    /**
     * Handles API key validation in real-time
     * @private
     * @param {string} value - Input value
     */
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

    /**
     * Handles saving API key from modal
     * @private
     */
    async #handleSaveApiKey() {
        const { key, pinned, sessionOnly } = this.#chatUI.getApiModalValues();

        if (!key) {
            this.#chatUI.updateApiStatus('Introduce una API Key valida', 'error');
            return;
        }

        // Clean whitespace
        const cleanKey = key.replace(/[\s\n\r]/g, '');

        // Validate format
        const formatValidation = this.#apiKeyManager.validateFormat(cleanKey);
        if (!formatValidation.valid) {
            this.#chatUI.updateApiStatus(formatValidation.error, 'error');
            return;
        }

        this.#chatUI.updateApiStatus(
            `Validando formato... (Fortaleza: ${formatValidation.strength})`,
            ''
        );

        // Test with real API
        const result = await this.#apiKeyManager.testKey(cleanKey);

        if (result.valid) {
            await this.#apiKeyManager.saveKey(cleanKey, pinned, sessionOnly);

            // D-Principle: Use injected factory instead of direct instantiation
            this.#geminiClient = this.#geminiClientFactory(cleanKey);

            let msg = '';
            if (sessionOnly) {
                msg = 'API Key guardada solo para esta sesion';
            } else if (pinned) {
                msg = 'API Key guardada permanentemente (cifrada)';
            } else {
                msg = 'API Key guardada por 24 horas (cifrada)';
            }

            this.#chatUI.updateApiStatus(msg, 'success');
            this.#eventBus.emit(ChatEvents.API_KEY_CHANGED);

            setTimeout(() => this.#chatUI.closeApiModal(), 1500);
        } else {
            this.#chatUI.updateApiStatus(result.error, 'error');
            this.#eventBus.emit(ChatEvents.API_ERROR, result.error);
        }
    }

    /**
     * Updates the API key UI with current settings
     * @private
     */
    #updateApiKeyUI() {
        this.#chatUI.updateApiKeyUI({
            apiKey: this.#apiKeyManager.apiKey,
            isPinned: this.#apiKeyManager.isPinned,
            isSessionOnly: this.#apiKeyManager.isSessionOnly,
            statusText: this.#apiKeyManager.getStatusDescription()
        });
    }

    /**
     * Shows documentation info footer
     * @private
     */
    #showDocsInfo() {
        const meta = this.#ragEngine.metadata;
        this.#chatUI.showDocsInfo({
            lastUpdated: meta.lastUpdated,
            articleCount: this.#ragEngine.documentCount
        });
    }

    /**
     * Builds the system prompt for Gemini
     * @private
     * @returns {string} System prompt
     */
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

    /**
     * Clears the conversation history
     * @returns {void}
     */
    clearHistory() {
        if (this.#geminiClient) {
            this.#geminiClient.clearHistory();
        }
    }

    /**
     * Gets the event bus for external subscriptions
     * @type {import('./EventBus.js').EventBus}
     * @readonly
     */
    get eventBus() {
        return this.#eventBus;
    }
}

export default ChatbotCore;

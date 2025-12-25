/**
 * @fileoverview Chat UI - User interface management
 * @module chatbot/ChatUI
 * @version 2.0.0
 * @license MIT
 *
 * Handles all UI rendering for the chatbot interface.
 * Uses DOMPurify for XSS protection on all rendered content.
 */

/**
 * @typedef {Object} UIElements
 * @property {HTMLElement} panel - Chat panel container
 * @property {HTMLElement} messages - Messages container
 * @property {HTMLInputElement} input - User input field
 * @property {HTMLElement} fab - Floating action button
 * @property {HTMLElement} apiModal - API key modal
 * @property {HTMLInputElement} apiKeyInput - API key input field
 * @property {HTMLElement} apiStatus - API status display
 * @property {HTMLInputElement} pinCheckbox - Pin API key checkbox
 * @property {HTMLInputElement} sessionCheckbox - Session only checkbox
 * @property {HTMLElement} validationInfo - API key validation info
 */

/**
 * @class ChatUI
 * @description Manages the chatbot user interface
 *
 * @example
 * const ui = new ChatUI();
 * ui.addUserMessage('Hello!');
 * ui.addBotMessage('Hi there!');
 */
export class ChatUI {
    /** @private @type {UIElements} */
    #elements = {};

    /** @private @type {boolean} */
    #isOpen = false;

    /**
     * Creates a new ChatUI instance and caches DOM elements
     */
    constructor() {
        this.#cacheElements();
    }

    /**
     * Whether the chat panel is currently open
     * @type {boolean}
     * @readonly
     */
    get isOpen() {
        return this.#isOpen;
    }

    /**
     * Caches DOM element references
     * @private
     */
    #cacheElements() {
        this.#elements = {
            panel: document.getElementById('chatbotPanel'),
            messages: document.getElementById('chatbotMessages'),
            input: document.getElementById('chatbotInput'),
            fab: document.getElementById('chatbotFab'),
            apiModal: document.getElementById('apiModal'),
            apiKeyInput: document.getElementById('apiKeyInput'),
            apiStatus: document.getElementById('apiStatus'),
            pinCheckbox: document.getElementById('pinApiKey'),
            sessionCheckbox: document.getElementById('sessionApiKey'),
            validationInfo: document.getElementById('apiValidationInfo')
        };
    }

    /**
     * Gets the current input value
     * @returns {string} Trimmed input value
     */
    getInputValue() {
        return this.#elements.input?.value?.trim() || '';
    }

    /**
     * Clears the input field
     * @returns {void}
     */
    clearInput() {
        if (this.#elements.input) {
            this.#elements.input.value = '';
        }
    }

    /**
     * Toggles the chat panel visibility
     * @returns {boolean} New open state
     */
    toggleChat() {
        this.#isOpen = !this.#isOpen;
        this.#elements.panel?.classList.toggle('active', this.#isOpen);
        return this.#isOpen;
    }

    /**
     * Opens the chat panel
     * @returns {void}
     */
    openChat() {
        this.#isOpen = true;
        this.#elements.panel?.classList.add('active');
    }

    /**
     * Closes the chat panel
     * @returns {void}
     */
    closeChat() {
        this.#isOpen = false;
        this.#elements.panel?.classList.remove('active');
    }

    /**
     * Opens the API key modal
     * @returns {void}
     */
    openApiModal() {
        this.#elements.apiModal?.classList.add('active');
    }

    /**
     * Closes the API key modal
     * @returns {void}
     */
    closeApiModal() {
        this.#elements.apiModal?.classList.remove('active');
    }

    /**
     * Adds a user message to the chat
     *
     * @param {string} text - Message text
     * @returns {void}
     */
    addUserMessage(text) {
        const container = this.#elements.messages;
        if (!container) return;

        const msg = document.createElement('div');
        msg.className = 'chat-message user';

        // Use textContent for user input (plain text only)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        const p = document.createElement('p');
        p.textContent = text;
        contentDiv.appendChild(p);

        msg.innerHTML = '<div class="message-avatar"><i class="ri-user-line"></i></div>';
        msg.appendChild(contentDiv);
        container.appendChild(msg);

        this.#scrollToBottom();
    }

    /**
     * Adds a bot message to the chat with markdown formatting
     *
     * @param {string} text - Message text (supports basic markdown)
     * @returns {void}
     */
    addBotMessage(text) {
        const container = this.#elements.messages;
        if (!container) return;

        const msg = document.createElement('div');
        msg.className = 'chat-message bot';

        // Sanitize AI-generated content before rendering
        const formattedMessage = this.#formatMessage(text);
        const sanitized = typeof DOMPurify !== 'undefined'
            ? DOMPurify.sanitize(formattedMessage)
            : this.#escapeHtml(text);

        msg.innerHTML = `
            <div class="message-avatar"><i class="ri-robot-line"></i></div>
            <div class="message-content">${sanitized}</div>
        `;

        container.appendChild(msg);
        this.#scrollToBottom();
    }

    /**
     * Shows the typing indicator
     * @returns {void}
     */
    showTyping() {
        const container = this.#elements.messages;
        if (!container) return;

        const indicator = document.createElement('div');
        indicator.className = 'chat-message bot';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="message-avatar"><i class="ri-robot-line"></i></div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        container.appendChild(indicator);
        this.#scrollToBottom();
    }

    /**
     * Hides the typing indicator
     * @returns {void}
     */
    hideTyping() {
        document.getElementById('typingIndicator')?.remove();
    }

    /**
     * Shows source documents under the last message
     *
     * @param {Array<{title: string, category: string}>} docs - Source documents
     * @returns {void}
     */
    showSources(docs) {
        const container = this.#elements.messages;
        if (!container || !docs?.length) return;

        const sanitize = typeof DOMPurify !== 'undefined'
            ? (s) => DOMPurify.sanitize(s)
            : (s) => this.#escapeHtml(s);

        const sourcesHtml = docs.slice(0, 2).map(doc => {
            const safeTitle = sanitize(doc.title);
            const safeCategory = sanitize(doc.category);
            return `<span class="source-tag" title="${safeTitle}">
                <i class="ri-file-text-line"></i> ${safeCategory}
            </span>`;
        }).join(' ');

        const sources = document.createElement('div');
        sources.className = 'chat-sources';
        sources.innerHTML = sanitize(`<small>Fuentes: ${sourcesHtml}</small>`);

        container.appendChild(sources);
        this.#scrollToBottom();
    }

    /**
     * Shows rate limit warning
     *
     * @param {number} remaining - Number of remaining calls
     * @returns {void}
     */
    showRateLimitWarning(remaining) {
        const container = this.#elements.messages;
        if (!container) return;

        const safeRemaining = parseInt(remaining) || 0;
        const warning = document.createElement('div');
        warning.className = 'chat-rate-limit-warning';
        warning.innerHTML = `<small>
            <i class="ri-time-line"></i>
            Te quedan ${safeRemaining} consulta${safeRemaining !== 1 ? 's' : ''} en este minuto
        </small>`;

        container.appendChild(warning);
        this.#scrollToBottom();
    }

    /**
     * Updates the API status message
     *
     * @param {string} message - Status message
     * @param {string} [type] - Status type: 'success', 'error', or empty
     * @returns {void}
     */
    updateApiStatus(message, type) {
        const status = this.#elements.apiStatus;
        if (status) {
            status.textContent = message;
            status.className = 'api-status';
            if (type) status.classList.add(type);
        }
    }

    /**
     * Updates API key validation info display
     *
     * @param {Object} validation - Validation result
     * @param {boolean} validation.valid - Whether format is valid
     * @param {string} [validation.error] - Error message if invalid
     * @param {string} [validation.strength] - Key strength if valid
     * @returns {void}
     */
    updateValidationInfo(validation) {
        const info = this.#elements.validationInfo;
        if (!info) return;

        if (!validation) {
            info.innerHTML = '';
            return;
        }

        const sanitize = typeof DOMPurify !== 'undefined'
            ? (s) => DOMPurify.sanitize(s)
            : (s) => this.#escapeHtml(s);

        if (validation.valid) {
            const strengthEmoji = {
                'fuerte': '&#x1F7E2;',
                'media': '&#x1F7E1;',
                'debil': '&#x1F7E0;'
            }[validation.strength] || '&#x1F7E2;';

            info.innerHTML = `${strengthEmoji} <span style="color: #16a34a;">Formato valido</span>
                • Fortaleza: <strong>${sanitize(validation.strength)}</strong>`;
        } else {
            info.innerHTML = `&#x1F534; <span style="color: #dc2626;">${sanitize(validation.error)}</span>`;
        }
    }

    /**
     * Updates API key UI with current settings
     *
     * @param {Object} settings - Current API settings
     * @param {string} settings.apiKey - Current API key
     * @param {boolean} settings.isPinned - Whether key is pinned
     * @param {boolean} settings.isSessionOnly - Whether using session storage
     * @param {string} settings.statusText - Status description
     * @returns {void}
     */
    updateApiKeyUI(settings) {
        const { apiKey, isPinned, isSessionOnly, statusText } = settings;

        if (this.#elements.apiKeyInput && apiKey) {
            this.#elements.apiKeyInput.value = apiKey;
        }

        if (this.#elements.pinCheckbox) {
            this.#elements.pinCheckbox.checked = isPinned;
        }

        if (this.#elements.sessionCheckbox) {
            this.#elements.sessionCheckbox.checked = isSessionOnly;
        }

        if (apiKey && statusText) {
            this.updateApiStatus(`API Key configurada - ${statusText}`, 'success');
        }
    }

    /**
     * Gets API modal form values
     *
     * @returns {{key: string, pinned: boolean, sessionOnly: boolean}} Form values
     */
    getApiModalValues() {
        return {
            key: this.#elements.apiKeyInput?.value?.trim() || '',
            pinned: this.#elements.pinCheckbox?.checked || false,
            sessionOnly: this.#elements.sessionCheckbox?.checked || false
        };
    }

    /**
     * Shows documentation info footer
     *
     * @param {Object} metadata - Documentation metadata
     * @param {string} metadata.lastUpdated - Last update date
     * @param {number} metadata.articleCount - Number of articles
     * @returns {void}
     */
    showDocsInfo(metadata) {
        const panel = this.#elements.panel;
        if (!panel || panel.querySelector('.docs-info')) return;

        const sanitize = typeof DOMPurify !== 'undefined'
            ? (s) => DOMPurify.sanitize(s)
            : (s) => this.#escapeHtml(s);

        const footer = document.createElement('div');
        footer.className = 'docs-info';
        footer.innerHTML = `<i class="ri-book-open-line"></i> Docs: ${sanitize(metadata.lastUpdated)}
            • ${parseInt(metadata.articleCount) || 0} articulos`;

        panel.appendChild(footer);
    }

    /**
     * Formats message text with basic markdown
     *
     * @private
     * @param {string} text - Raw message text
     * @returns {string} HTML formatted message
     */
    #formatMessage(text) {
        let html = this.#escapeHtml(text);

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Lists
        html = html.replace(/^\d+\.\s/gm, '<br>&#8226; ');
        html = html.replace(/^-\s/gm, '<br>&#8226; ');

        // Paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        return '<p>' + html + '</p>';
    }

    /**
     * Escapes HTML entities
     *
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    #escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Scrolls messages container to bottom
     * @private
     */
    #scrollToBottom() {
        const container = this.#elements.messages;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}

export default ChatUI;

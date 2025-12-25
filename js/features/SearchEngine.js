/**
 * @fileoverview Search engine for guides and diagnostics
 * @module features/SearchEngine
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

import { AppEvents } from '../utils/EventBus.js';

/**
 * @typedef {Object} SearchResult
 * @property {'guide'|'diagnostic'} type - Result type
 * @property {string} id - Unique identifier
 * @property {string} icon - Icon HTML/class
 * @property {string} title - Display title
 * @property {string} category - Category label
 */

/**
 * @typedef {Object} SearchEngineDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus - Event bus instance
 * @property {Object} knowledgeBase - Knowledge base data
 * @property {Object} diagnostics - Diagnostics data
 * @property {Document} [document] - Document reference
 */

/**
 * Full-text search engine for guides and diagnostics.
 * Implements debounced search with result highlighting.
 *
 * @class SearchEngine
 * @example
 * const searchEngine = new SearchEngine({
 *     eventBus,
 *     knowledgeBase: KnowledgeBase,
 *     diagnostics: Diagnostics
 * });
 *
 * searchEngine.init();
 * const results = searchEngine.search('ipad wifi');
 */
export class SearchEngine {
    /**
     * Event bus for search events
     * @type {import('../utils/EventBus.js').EventBus}
     * @private
     */
    #eventBus;

    /**
     * Knowledge base reference
     * @type {Object}
     * @private
     */
    #knowledgeBase;

    /**
     * Diagnostics reference
     * @type {Object}
     * @private
     */
    #diagnostics;

    /**
     * Document reference
     * @type {Document}
     * @private
     */
    #document;

    /**
     * Debounce timeout ID
     * @type {number|null}
     * @private
     */
    #searchTimeout = null;

    /**
     * Debounce delay in milliseconds
     * @type {number}
     * @private
     */
    #debounceDelay = 300;

    /**
     * Minimum query length
     * @type {number}
     * @private
     */
    #minQueryLength = 2;

    /**
     * Search input element
     * @type {HTMLInputElement|null}
     * @private
     */
    #inputElement = null;

    /**
     * Search overlay element
     * @type {HTMLElement|null}
     * @private
     */
    #overlayElement = null;

    /**
     * Search results container element
     * @type {HTMLElement|null}
     * @private
     */
    #resultsElement = null;

    /**
     * Creates a new SearchEngine instance
     *
     * @param {SearchEngineDependencies} dependencies - Injected dependencies
     * @throws {TypeError} If required dependencies are missing
     */
    constructor({ eventBus, knowledgeBase, diagnostics, document: doc = null }) {
        if (!eventBus) {
            throw new TypeError('SearchEngine requires an EventBus instance');
        }
        if (!knowledgeBase) {
            throw new TypeError('SearchEngine requires a knowledgeBase');
        }
        if (!diagnostics) {
            throw new TypeError('SearchEngine requires diagnostics data');
        }

        this.#eventBus = eventBus;
        this.#knowledgeBase = knowledgeBase;
        this.#diagnostics = diagnostics;
        this.#document = doc || (typeof document !== 'undefined' ? document : null);
    }

    /**
     * Initializes search bindings
     *
     * @returns {void}
     *
     * @example
     * searchEngine.init();
     */
    init() {
        this.#cacheElements();
        this.#bindInputEvents();
        this.#bindResultsClickEvent();
    }

    /**
     * Caches DOM element references
     * @private
     */
    #cacheElements() {
        if (!this.#document) return;

        this.#inputElement = this.#document.getElementById('searchInput');
        this.#overlayElement = this.#document.getElementById('searchOverlay');
        this.#resultsElement = this.#document.getElementById('searchResults');
    }

    /**
     * Binds input events for search
     * @private
     */
    #bindInputEvents() {
        if (!this.#inputElement) return;

        this.#inputElement.addEventListener('input', () => {
            this.#handleInput();
        });

        this.#inputElement.addEventListener('blur', () => {
            setTimeout(() => this.#hideOverlay(), 200);
        });
    }

    /**
     * Handles input change with debouncing
     * @private
     */
    #handleInput() {
        if (this.#searchTimeout) {
            clearTimeout(this.#searchTimeout);
        }

        const query = this.#inputElement?.value.trim().toLowerCase() || '';

        if (query.length < this.#minQueryLength) {
            this.#hideOverlay();
            return;
        }

        this.#searchTimeout = setTimeout(() => {
            const results = this.search(query);
            this.#displayResults(results, query);
        }, this.#debounceDelay);
    }

    /**
     * Binds click events for results using event delegation
     * @private
     */
    #bindResultsClickEvent() {
        if (!this.#resultsElement) return;

        this.#resultsElement.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result-item');
            if (!item) return;

            const type = item.dataset.type;
            const id = item.dataset.id;

            this.#hideOverlay();
            this.#clearInput();

            this.#eventBus.emit(AppEvents.SEARCH_RESULTS, { type, id });
        });
    }

    /**
     * Performs search across knowledge base and diagnostics
     *
     * @param {string} query - Search query (lowercase)
     * @returns {SearchResult[]} Array of matching results
     *
     * @example
     * const results = searchEngine.search('wifi');
     */
    search(query) {
        const results = [];

        // Search guides
        this.#searchInGuides(results, this.#knowledgeBase.ipads, 'ipad', 'iPads', query);
        this.#searchInGuides(results, this.#knowledgeBase.macs, 'mac', 'Macs', query);
        this.#searchInGuides(results, this.#knowledgeBase.aula, 'aula', 'App Aula', query);

        // Search diagnostics
        this.#searchInDiagnostics(results, query);

        this.#eventBus.emit(AppEvents.SEARCH_QUERY, { query, resultCount: results.length });

        return results;
    }

    /**
     * Searches within a guides category
     * @param {SearchResult[]} results - Results array to populate
     * @param {Object} guides - Guides object to search
     * @param {string} prefix - ID prefix for results
     * @param {string} category - Category label
     * @param {string} query - Search query
     * @private
     */
    #searchInGuides(results, guides, prefix, category, query) {
        if (!guides) return;

        Object.entries(guides).forEach(([key, guide]) => {
            const titleMatch = guide.title?.toLowerCase().includes(query);
            const contentMatch = guide.content?.toLowerCase().includes(query);

            if (titleMatch || contentMatch) {
                results.push({
                    type: 'guide',
                    id: `${prefix}-${key}`,
                    icon: guide.icon || '<i class="ri-file-text-line"></i>',
                    title: guide.title,
                    category
                });
            }
        });
    }

    /**
     * Searches within diagnostics
     * @param {SearchResult[]} results - Results array to populate
     * @param {string} query - Search query
     * @private
     */
    #searchInDiagnostics(results, query) {
        Object.entries(this.#diagnostics).forEach(([key, diag]) => {
            if (diag.title?.toLowerCase().includes(query)) {
                results.push({
                    type: 'diagnostic',
                    id: key,
                    icon: diag.icon || '<i class="ri-bug-line"></i>',
                    title: diag.title,
                    category: 'Troubleshooting'
                });
            }
        });
    }

    /**
     * Displays search results in the overlay
     * @param {SearchResult[]} results - Search results
     * @param {string} query - Original query
     * @private
     */
    #displayResults(results, query) {
        if (!this.#resultsElement) return;

        if (results.length === 0) {
            this.#displayNoResults(query);
        } else {
            this.#renderResults(results);
        }

        this.#showOverlay();
    }

    /**
     * Displays no results message
     * @param {string} query - Search query
     * @private
     */
    #displayNoResults(query) {
        if (!this.#resultsElement || !this.#document) return;

        const noResults = this.#document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = `No se encontraron resultados para "${query}"`;

        this.#resultsElement.innerHTML = '';
        this.#resultsElement.appendChild(noResults);
    }

    /**
     * Renders search results HTML
     * @param {SearchResult[]} results - Search results
     * @private
     */
    #renderResults(results) {
        if (!this.#resultsElement) return;

        const html = results.map(r => {
            const safeType = this.#escapeHtml(r.type);
            const safeId = this.#escapeHtml(r.id);
            const safeIcon = this.#sanitizeIcon(r.icon);
            const safeTitle = this.#escapeHtml(r.title);
            const safeCategory = this.#escapeHtml(r.category);

            return `
                <div class="search-result-item" data-type="${safeType}" data-id="${safeId}">
                    <span class="search-result-icon">${safeIcon}</span>
                    <div class="search-result-content">
                        <h4>${safeTitle}</h4>
                        <p>${safeCategory}</p>
                    </div>
                </div>
            `;
        }).join('');

        this.#resultsElement.innerHTML = html;
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

    /**
     * Sanitizes icon HTML (allows only i tags with class)
     * @param {string} icon - Icon HTML
     * @returns {string} Sanitized icon HTML
     * @private
     */
    #sanitizeIcon(icon) {
        if (typeof DOMPurify !== 'undefined') {
            return DOMPurify.sanitize(icon, {
                ALLOWED_TAGS: ['i'],
                ALLOWED_ATTR: ['class']
            });
        }
        return this.#escapeHtml(icon);
    }

    /**
     * Shows the search overlay
     * @private
     */
    #showOverlay() {
        if (this.#overlayElement) {
            this.#overlayElement.classList.add('active');
        }
    }

    /**
     * Hides the search overlay
     * @private
     */
    #hideOverlay() {
        if (this.#overlayElement) {
            this.#overlayElement.classList.remove('active');
        }
        this.#eventBus.emit(AppEvents.SEARCH_CLEARED);
    }

    /**
     * Clears the search input
     * @private
     */
    #clearInput() {
        if (this.#inputElement) {
            this.#inputElement.value = '';
        }
    }

    /**
     * Programmatically trigger a search
     *
     * @param {string} query - Search query
     * @returns {SearchResult[]} Search results
     *
     * @example
     * const results = searchEngine.performSearch('configurar');
     */
    performSearch(query) {
        const normalizedQuery = query.trim().toLowerCase();
        if (normalizedQuery.length < this.#minQueryLength) {
            return [];
        }
        return this.search(normalizedQuery);
    }
}

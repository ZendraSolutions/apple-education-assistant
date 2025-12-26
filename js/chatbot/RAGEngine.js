/**
 * @fileoverview RAG Engine - Retrieval-Augmented Generation with Semantic Search
 * @module chatbot/RAGEngine
 * @version 3.0.0
 * @license MIT
 *
 * Provides document search and context building for the chatbot.
 * Uses semantic embeddings for intelligent retrieval with keyword fallback.
 * Includes ErrorMonitor integration for debugging breadcrumbs.
 *
 * @security Integrates PromptGuard for context sanitization
 *
 * @example
 * const rag = new RAGEngine();
 * await rag.loadDocumentation();
 * const results = await rag.search('Como configurar App Aula?');
 */

import { PromptGuard } from './PromptGuard.js';
import { EmbeddingService } from './EmbeddingService.js';
import { ErrorMonitor } from '../core/ErrorMonitor.js';

/**
 * @typedef {Object} Document
 * @property {string} id - Unique document identifier
 * @property {string} title - Document title
 * @property {string} category - Document category
 * @property {string} content - Full document content
 * @property {string[]} [keywords] - Search keywords
 * @property {string} [officialDocUrl] - Link to official documentation
 */

/**
 * @typedef {Object} IndexedDocument
 * @property {string} id - Document ID
 * @property {Float32Array} embedding - Semantic embedding vector
 * @property {Document} document - Original document
 */

/**
 * @typedef {Object} SearchResult
 * @property {string} id - Document ID
 * @property {string} title - Document title
 * @property {string} category - Document category
 * @property {string} content - Document content
 * @property {string[]} [keywords] - Search keywords
 * @property {string} [officialDocUrl] - Official documentation URL
 * @property {number} score - Relevance score (0-1 for semantic, normalized for keyword)
 * @property {string} [searchType] - 'semantic', 'keyword', or 'hybrid'
 */

/**
 * @typedef {Object} DocsMetadata
 * @property {string} version - Documentation version
 * @property {string} lastUpdated - Last update date
 * @property {string} source - Documentation source
 * @property {string} [updateFrequency] - Update frequency
 */

/**
 * @typedef {Object} SearchOptions
 * @property {number} [topK=3] - Maximum results to return
 * @property {number} [minScore=0.3] - Minimum similarity score for semantic search
 * @property {boolean} [forceKeyword=false] - Force keyword search only
 * @property {boolean} [hybridMode=true] - Combine semantic and keyword scores
 */

/**
 * @class RAGEngine
 * @description Retrieval-Augmented Generation engine with semantic search
 *
 * Architecture:
 * - Semantic search using Transformers.js embeddings (primary)
 * - Keyword-based search (fallback)
 * - Hybrid mode combining both approaches
 * - Lazy initialization of embedding model
 * - PromptGuard integration for security
 * - ErrorMonitor integration for debugging
 *
 * @example
 * const rag = new RAGEngine();
 * await rag.loadDocumentation();
 *
 * // Semantic search (default, async)
 * const results = await rag.search('problemas con bluetooth');
 *
 * // Force keyword search (sync compatible)
 * const kwResults = rag.search('bluetooth', { forceKeyword: true });
 */
export class RAGEngine {
    /** @private @type {Document[]} */
    #documents = [];

    /** @private @type {IndexedDocument[]} */
    #indexedDocuments = [];

    /** @private @type {boolean} */
    #isIndexed = false;

    /** @private @type {boolean} */
    #isIndexing = false;

    /** @private @type {EmbeddingService} */
    #embeddingService;

    /** @private @type {DocsMetadata} */
    #metadata = {
        version: '1.0.0',
        lastUpdated: '2025-12-23',
        source: 'Manual'
    };

    /** @private @type {string} */
    #docsPath = 'data/docs.json';

    /** @private @type {function(Object):void|null} */
    #onProgress = null;

    /**
     * Creates a new RAGEngine instance
     *
     * @param {string} [docsPath='data/docs.json'] - Path to documentation JSON
     * @param {Object} [options={}] - Configuration options
     * @param {function(Object):void} [options.onProgress] - Progress callback for indexing
     */
    constructor(docsPath, options = {}) {
        if (docsPath) {
            this.#docsPath = docsPath;
        }

        this.#onProgress = options.onProgress || null;

        // Create embedding service with progress reporting
        this.#embeddingService = new EmbeddingService({
            onProgress: (progress) => {
                this.#reportProgress({
                    type: 'embedding',
                    ...progress
                });
            }
        });
    }

    /**
     * Documentation metadata
     * @type {DocsMetadata}
     * @readonly
     */
    get metadata() {
        return { ...this.#metadata };
    }

    /**
     * Number of loaded documents
     * @type {number}
     * @readonly
     */
    get documentCount() {
        return this.#documents.length;
    }

    /**
     * Whether documents are semantically indexed
     * @type {boolean}
     * @readonly
     */
    get isIndexed() {
        return this.#isIndexed;
    }

    /**
     * Whether semantic search is available
     * @type {boolean}
     * @readonly
     */
    get isSemanticReady() {
        return this.#embeddingService.isReady && this.#isIndexed;
    }

    /**
     * Embedding service instance (for external access)
     * @type {EmbeddingService}
     * @readonly
     */
    get embeddingService() {
        return this.#embeddingService;
    }

    /**
     * Reports progress to callback
     * @private
     * @param {Object} data
     */
    #reportProgress(data) {
        if (this.#onProgress) {
            this.#onProgress(data);
        }
    }

    /**
     * Loads documentation from JSON file or uses embedded fallback
     *
     * @returns {Promise<void>}
     *
     * @example
     * await rag.loadDocumentation();
     * console.log(`Loaded ${rag.documentCount} documents`);
     */
    async loadDocumentation() {
        ErrorMonitor.addBreadcrumb({
            category: 'rag',
            message: 'Loading documentation',
            level: 'info',
            data: { docsPath: this.#docsPath }
        });

        try {
            const response = await fetch(this.#docsPath);
            if (response.ok) {
                const data = await response.json();
                this.#documents = data.articles || [];
                this.#metadata = {
                    version: data.version,
                    lastUpdated: data.lastUpdated,
                    source: data.source,
                    updateFrequency: data.updateFrequency
                };
                console.log(
                    `[RAG] Documentation loaded: ${this.#documents.length} articles (v${data.version})`
                );

                ErrorMonitor.addBreadcrumb({
                    category: 'rag',
                    message: 'Documentation loaded successfully',
                    level: 'info',
                    data: {
                        articleCount: this.#documents.length,
                        version: data.version
                    }
                });
            } else {
                console.log('[RAG] Could not load docs.json, using embedded docs');
                this.#documents = this.#getEmbeddedDocs();

                ErrorMonitor.addBreadcrumb({
                    category: 'rag',
                    message: 'Using embedded documentation (fetch failed)',
                    level: 'warning',
                    data: { status: response.status }
                });
            }
        } catch (e) {
            console.log('[RAG] Error loading documentation:', e);
            this.#documents = this.#getEmbeddedDocs();

            ErrorMonitor.addBreadcrumb({
                category: 'rag',
                message: 'Error loading documentation, using embedded',
                level: 'error',
                data: { error: e.message }
            });
        }

        // Start background indexing (non-blocking)
        this.#backgroundIndex();
    }

    /**
     * Starts background indexing of documents for semantic search
     * @private
     */
    async #backgroundIndex() {
        // Don't block the main flow - index in background
        setTimeout(async () => {
            try {
                await this.indexDocuments();
            } catch (error) {
                console.warn('[RAG] Background indexing failed, will use keyword search:', error.message);
                ErrorMonitor.addBreadcrumb({
                    category: 'rag',
                    message: 'Background indexing failed',
                    level: 'warning',
                    data: { error: error.message }
                });
            }
        }, 1000); // Small delay to let UI settle
    }

    /**
     * Indexes all documents for semantic search
     * Downloads embedding model on first call (~22MB, cached)
     *
     * @returns {Promise<boolean>} True if indexing succeeded
     *
     * @example
     * const indexed = await rag.indexDocuments();
     * if (indexed) console.log('Semantic search ready');
     */
    async indexDocuments() {
        if (this.#isIndexed) return true;
        if (this.#isIndexing) return this.#waitForIndexing();
        if (this.#documents.length === 0) return false;

        this.#isIndexing = true;
        this.#reportProgress({
            type: 'indexing',
            status: 'start',
            total: this.#documents.length
        });

        ErrorMonitor.addBreadcrumb({
            category: 'rag',
            message: 'Starting document indexing for semantic search',
            level: 'info',
            data: { documentCount: this.#documents.length }
        });

        try {
            // Initialize embedding service first
            const initialized = await this.#embeddingService.initialize();
            if (!initialized) {
                throw new Error('Embedding service failed to initialize');
            }

            console.log(`[RAG] Indexing ${this.#documents.length} documents...`);

            // Index each document
            this.#indexedDocuments = [];
            for (let i = 0; i < this.#documents.length; i++) {
                const doc = this.#documents[i];

                // Create searchable text from document
                const searchText = this.#createSearchableText(doc);

                // Generate embedding
                const embedding = await this.#embeddingService.embed(searchText);

                this.#indexedDocuments.push({
                    id: doc.id,
                    embedding,
                    document: doc
                });

                this.#reportProgress({
                    type: 'indexing',
                    status: 'progress',
                    current: i + 1,
                    total: this.#documents.length
                });
            }

            this.#isIndexed = true;
            this.#isIndexing = false;

            this.#reportProgress({
                type: 'indexing',
                status: 'complete',
                total: this.#documents.length
            });

            console.log(`[RAG] Indexing complete: ${this.#indexedDocuments.length} documents indexed`);

            ErrorMonitor.addBreadcrumb({
                category: 'rag',
                message: 'Semantic indexing complete',
                level: 'info',
                data: { indexedCount: this.#indexedDocuments.length }
            });

            return true;

        } catch (error) {
            this.#isIndexing = false;
            this.#reportProgress({
                type: 'indexing',
                status: 'error',
                error: error.message
            });
            console.error('[RAG] Indexing failed:', error);

            ErrorMonitor.addBreadcrumb({
                category: 'rag',
                message: 'Indexing failed',
                level: 'error',
                data: { error: error.message }
            });

            return false;
        }
    }

    /**
     * Waits for ongoing indexing to complete
     * @private
     * @returns {Promise<boolean>}
     */
    async #waitForIndexing() {
        const maxWait = 120000; // 2 minutes
        const interval = 100;
        let waited = 0;

        while (this.#isIndexing && waited < maxWait) {
            await new Promise(r => setTimeout(r, interval));
            waited += interval;
        }

        return this.#isIndexed;
    }

    /**
     * Creates searchable text from document for embedding
     * @private
     * @param {Document} doc
     * @returns {string}
     */
    #createSearchableText(doc) {
        const parts = [
            doc.title,
            doc.category,
            doc.content,
            (doc.keywords || []).join(' ')
        ];

        return parts.join(' ').slice(0, 512); // Limit for model
    }

    /**
     * Searches for relevant documents based on a query
     * Uses semantic search if available, falls back to keyword search
     *
     * @param {string} query - User's search query
     * @param {SearchOptions|number} [options={}] - Search options or topK (legacy)
     * @returns {Promise<SearchResult[]>|SearchResult[]} Sorted array of relevant documents
     *
     * @example
     * // Modern async usage (recommended)
     * const results = await rag.search('problemas con bluetooth', { topK: 5 });
     *
     * // Legacy sync usage (keyword only)
     * const results = rag.search('bluetooth', 3);
     */
    search(query, options = {}) {
        // Legacy support: if options is a number, treat as topK
        if (typeof options === 'number') {
            options = { topK: options };
        }

        const {
            topK = 3,
            minScore = 0.3,
            forceKeyword = false,
            hybridMode = true
        } = options;

        // Add breadcrumb for search tracking (don't log full query for privacy)
        ErrorMonitor.addBreadcrumb({
            category: 'rag',
            message: 'RAG search executed',
            level: 'info',
            data: {
                queryLength: query?.length || 0,
                topK,
                documentsAvailable: this.#documents.length,
                semanticReady: this.isSemanticReady,
                forceKeyword
            }
        });

        // If semantic is ready and not forced keyword, do async semantic search
        if (!forceKeyword && this.#embeddingService.isReady && this.#isIndexed) {
            return this.#asyncSearch(query, topK, minScore, hybridMode);
        }

        // Fallback to synchronous keyword search
        return this.#keywordSearch(query, topK);
    }

    /**
     * Performs async semantic search with fallback
     * @private
     * @param {string} query
     * @param {number} topK
     * @param {number} minScore
     * @param {boolean} hybridMode
     * @returns {Promise<SearchResult[]>}
     */
    async #asyncSearch(query, topK, minScore, hybridMode) {
        try {
            const semanticResults = await this.#semanticSearch(query, topK, minScore);

            // If hybrid mode, boost with keyword matches
            if (hybridMode && semanticResults.length > 0) {
                return this.#hybridRank(query, semanticResults, topK);
            }

            if (semanticResults.length > 0) {
                return semanticResults;
            }

            // Semantic returned nothing, fall through to keyword
            console.log('[RAG] Semantic search returned no results, using keyword fallback');
        } catch (error) {
            console.warn('[RAG] Semantic search failed, falling back to keyword:', error.message);
        }

        // Fallback to keyword search
        return this.#keywordSearch(query, topK);
    }

    /**
     * Performs semantic search using embeddings
     * @private
     * @param {string} query
     * @param {number} topK
     * @param {number} minScore
     * @returns {Promise<SearchResult[]>}
     */
    async #semanticSearch(query, topK, minScore) {
        // Generate query embedding
        const queryEmbedding = await this.#embeddingService.embed(query);

        // Calculate similarity scores
        const scores = this.#indexedDocuments.map(indexed => {
            const similarity = this.#embeddingService.cosineSimilarity(
                queryEmbedding,
                indexed.embedding
            );

            return {
                ...indexed.document,
                score: similarity,
                searchType: 'semantic'
            };
        });

        // Filter by minimum score and sort
        const results = scores
            .filter(d => d.score >= minScore)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);

        ErrorMonitor.addBreadcrumb({
            category: 'rag',
            message: 'Semantic search completed',
            level: 'info',
            data: {
                resultsCount: results.length,
                topScore: results[0]?.score || 0
            }
        });

        return results;
    }

    /**
     * Performs keyword-based search (fallback)
     * @private
     * @param {string} query
     * @param {number} topK
     * @returns {SearchResult[]}
     */
    #keywordSearch(query, topK) {
        const queryWords = query.toLowerCase().split(/\s+/);

        const results = this.#documents.map(doc => {
            let score = 0;
            const allText = (
                doc.title + ' ' +
                doc.content + ' ' +
                (doc.keywords || []).join(' ')
            ).toLowerCase();

            queryWords.forEach(word => {
                if (word.length < 3) return;

                // Content match
                if (allText.includes(word)) score++;

                // Keyword match (weighted higher)
                if ((doc.keywords || []).some(k => k.includes(word))) score += 2;

                // Title match (weighted highest)
                if (doc.title.toLowerCase().includes(word)) score += 3;
            });

            // Normalize score to 0-1 range for consistency with semantic
            const normalizedScore = Math.min(score / 10, 1);

            return {
                ...doc,
                score: normalizedScore,
                searchType: 'keyword'
            };
        });

        return results
            .filter(d => d.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    /**
     * Combines semantic and keyword scores for hybrid ranking
     * @private
     * @param {string} query
     * @param {SearchResult[]} semanticResults
     * @param {number} topK
     * @returns {SearchResult[]}
     */
    #hybridRank(query, semanticResults, topK) {
        const queryWords = query.toLowerCase().split(/\s+/);

        return semanticResults.map(result => {
            // Calculate keyword boost
            let keywordBoost = 0;

            queryWords.forEach(word => {
                if (word.length < 3) return;

                // Exact keyword match gets boost
                if ((result.keywords || []).some(k => k.toLowerCase() === word)) {
                    keywordBoost += 0.1;
                }

                // Title exact match gets bigger boost
                if (result.title.toLowerCase().includes(word)) {
                    keywordBoost += 0.05;
                }
            });

            return {
                ...result,
                score: Math.min(result.score + keywordBoost, 1),
                searchType: 'hybrid'
            };
        }).sort((a, b) => b.score - a.score).slice(0, topK);
    }

    /**
     * Builds a context string for the LLM from search results
     * Applies PromptGuard sanitization to prevent injection attacks
     *
     * @param {SearchResult[]} docs - Documents to include in context
     * @returns {string} Formatted and sanitized context string
     *
     * @example
     * const results = await rag.search(query);
     * const context = rag.buildContext(results);
     * // Returns sanitized: "[1] Title (relevancia: 85%)\nContent...\nFuente: url\n"
     *
     * @security Documents are analyzed and sanitized before inclusion
     */
    buildContext(docs) {
        if (!docs || docs.length === 0) {
            return '';
        }

        let context = '';
        let blockedCount = 0;

        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];

            // Analyze document content for injection attempts
            const analysis = PromptGuard.analyze(doc.content);

            if (!analysis.safe) {
                console.warn(
                    `[RAGEngine] Blocked suspicious document "${doc.title}":`,
                    analysis.threats
                );
                blockedCount++;
                continue;
            }

            // Sanitize content even if it passed initial analysis
            const sanitizedContent = PromptGuard.sanitize(doc.content);
            const truncatedContent = PromptGuard.truncate(sanitizedContent, 1500);

            // Add relevance info for semantic/hybrid results
            const scoreInfo = doc.searchType === 'semantic' || doc.searchType === 'hybrid'
                ? ` (relevancia: ${Math.round(doc.score * 100)}%)`
                : '';

            context += `\n[${i + 1 - blockedCount}] ${doc.title}${scoreInfo}\n${truncatedContent}\n`;

            if (doc.officialDocUrl) {
                context += `Fuente: ${doc.officialDocUrl}\n`;
            }
        }

        if (blockedCount > 0) {
            console.log(`[RAGEngine] ${blockedCount} document(s) blocked for security`);
        }

        // Apply final truncation to total context
        return PromptGuard.truncate(context, 6000);
    }

    /**
     * Generates an offline response when no API key is available
     *
     * @param {string} query - User's query
     * @param {SearchResult[]} relevantDocs - Search results
     * @returns {string} Offline response with documentation
     *
     * @example
     * const docs = await rag.search(query);
     * const response = rag.generateOfflineResponse(query, docs);
     */
    generateOfflineResponse(query, relevantDocs) {
        if (relevantDocs.length > 0) {
            const doc = relevantDocs[0];
            let resp = `**${doc.title}**\n\n${doc.content}`;

            // Add relevance info for semantic results
            if (doc.searchType === 'semantic' || doc.searchType === 'hybrid') {
                resp += `\n\n_Relevancia: ${Math.round(doc.score * 100)}%_`;
            }

            if (doc.officialDocUrl) {
                resp += `\n\n[Ver documentacion oficial](${doc.officialDocUrl})`;
            }

            resp += '\n\nConfigura tu API Key para respuestas personalizadas.';
            return resp;
        }

        return `No encontre informacion sobre eso.\n\n` +
            `Prueba con: enrollment, apps, classroom, teacher, restricciones, bloqueo, actualizaciones`;
    }

    /**
     * Gets search statistics and status
     * @returns {Object} Search engine stats
     */
    getStats() {
        return {
            documentCount: this.#documents.length,
            isIndexed: this.#isIndexed,
            isSemanticReady: this.isSemanticReady,
            embeddingService: this.#embeddingService.getStats()
        };
    }

    /**
     * Gets embedded fallback documentation
     *
     * @private
     * @returns {Document[]} Embedded documentation array
     */
    #getEmbeddedDocs() {
        return [
            {
                id: 'ecosistema-apple',
                title: 'El Ecosistema Apple en Educacion',
                category: 'Ecosistema',
                content: `El ecosistema educativo de Apple tiene 3 componentes principales:

1. APPLE SCHOOL MANAGER (ASM) - school.apple.com - ES EL CENTRO
   - Aqui se crean los usuarios (profesores y alumnos)
   - Aqui se crean las clases
   - Aqui se asignan los dispositivos al servidor MDM
   - Aqui se compran y asignan las apps (VPP integrado)

2. JAMF SCHOOL - Herramienta MDM
   - Se conecta a ASM y RECIBE los datos (sincronizacion)
   - Aplica configuraciones y restricciones a dispositivos
   - Distribuye apps a los iPads y Macs

3. DISPOSITIVOS + APP AULA
   - iPads supervisados para alumnado
   - Macs para profesorado
   - App Aula usa las clases de ASM

IMPORTANTE: Las cosas se CREAN en ASM, no en Jamf. Jamf solo las recibe.`,
                keywords: ['ecosistema', 'asm', 'apple school manager', 'jamf school', 'flujo', 'como funciona']
            },
            {
                id: 'aula-app',
                title: 'App Aula (Apple Classroom) para Profesores',
                category: 'Aula',
                content: `La app Aula permite a los profesores gestionar la clase en tiempo real:

QUE PUEDE HACER UN PROFESOR:
- Ver las pantallas de todos los iPads de su clase
- Abrir una app en todos los iPads a la vez
- Bloquear los iPads durante un examen
- Silenciar dispositivos
- Enviar/recibir archivos con AirDrop

REQUISITOS PARA QUE FUNCIONE:
1. Las clases deben estar creadas en Apple School Manager (NO en Jamf)
2. Jamf School sincroniza las clases desde ASM
3. Bluetooth activado en todos los dispositivos
4. Misma red WiFi (sin "aislamiento de clientes")
5. iPads deben ser supervisados

SI NO FUNCIONA: Ver diagnostico "Problemas con Aula"`,
                keywords: ['aula', 'classroom', 'apple classroom', 'profesor', 'ver pantallas', 'bloquear', 'clase']
            },
            {
                id: 'aula-troubleshoot',
                title: 'Problemas con App Aula',
                category: 'Aula',
                content: `Si el profesor no ve los dispositivos en Aula:

PASO 1 - VERIFICAR EN ASM (school.apple.com):
- Existe la clase con el profesor asignado?
- Los alumnos/iPads estan en esa clase?

PASO 2 - VERIFICAR EN JAMF SCHOOL:
- Se ha sincronizado la clase desde ASM?
- Ir a Usuarios -> Clases -> Aparece la clase?

PASO 3 - VERIFICAR EN LOS DISPOSITIVOS:
- Bluetooth activado en TODOS (profesor + alumnos)
- Misma red WiFi (preguntar a IT si hay "client isolation")
- Reiniciar la app Aula en el iPad del profesor

PASO 4 - FORZAR SINCRONIZACION:
- En Jamf School: seleccionar dispositivos -> Send Blank Push
- Esperar 2-3 minutos y reiniciar Aula

TODAVIA NO FUNCIONA:
- Reiniciar los iPads
- Verificar que los iPads son supervisados (Ajustes -> General -> Info)`,
                keywords: ['aula', 'problema', 'no ve', 'no aparece', 'classroom', 'troubleshooting', 'bluetooth', 'wifi']
            },
            {
                id: 'apps-vpp',
                title: 'Instalar Apps (VPP desde ASM)',
                category: 'Apps',
                content: `Las apps se compran/asignan en ASM y se distribuyen desde Jamf:

PASO 1 - EN ASM (school.apple.com):
1. Ir a Apps y libros
2. Buscar la app que necesitas
3. Comprar licencias (muchas apps educativas son gratis)
4. Asignar a tu ubicacion

PASO 2 - EN JAMF SCHOOL:
5. Ir a Apps -> App Store -> la app aparece automaticamente
6. Crear distribucion: seleccionar la app -> Distribute
7. Elegir a quien: grupo de dispositivos, clase, o todos
8. Modo: Automatico (se instala sola) o Bajo demanda`,
                keywords: ['apps', 'vpp', 'instalar', 'distribuir', 'licencias', 'app store', 'asm']
            },
            {
                id: 'restricciones',
                title: 'Perfiles de Restriccion',
                category: 'Restricciones',
                content: `Los perfiles de restriccion se crean en Jamf School:

EN JAMF SCHOOL:
1. Ir a Perfiles -> + Nuevo perfil
2. Tipo: iOS/iPadOS
3. Seccion: Restricciones
4. Configurar segun edad/curso

PRIMARIA (mas restrictivo):
- Sin Safari, Sin App Store, Sin camara (opcional), Sin AirDrop

ESO/BACHILLERATO (menos restrictivo):
- Safari con filtro de contenido
- App Store con restriccion de edad (+12)

IMPORTANTE: Los iPads deben ser supervisados para que funcionen todas las restricciones.`,
                keywords: ['restricciones', 'perfil', 'bloquear', 'safari', 'seguridad', 'primaria', 'eso']
            }
        ];
    }

    /**
     * Sets documents directly (useful for testing)
     *
     * @param {Document[]} docs - Documents to use
     * @returns {void}
     */
    setDocuments(docs) {
        this.#documents = docs;
        this.#isIndexed = false;
        this.#indexedDocuments = [];
    }

    /**
     * Forces re-indexing of documents
     * @returns {Promise<boolean>}
     */
    async reindex() {
        this.#isIndexed = false;
        this.#indexedDocuments = [];
        return this.indexDocuments();
    }
}

export default RAGEngine;

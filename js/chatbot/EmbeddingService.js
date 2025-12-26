/**
 * @fileoverview Embedding Service - Semantic embeddings using Transformers.js
 * @module chatbot/EmbeddingService
 * @version 1.0.0
 * @license MIT
 *
 * Provides semantic text embeddings for RAG search using Transformers.js.
 * Runs entirely in the browser with a lightweight 22MB model.
 *
 * @example
 * const embedder = new EmbeddingService();
 * await embedder.initialize();
 * const vector = await embedder.embed('Hola mundo');
 * const similarity = embedder.cosineSimilarity(vec1, vec2);
 */

/**
 * @typedef {Object} EmbeddingProgress
 * @property {string} status - Current status ('loading', 'ready', 'error')
 * @property {number} progress - Progress percentage (0-100)
 * @property {string} [message] - Optional status message
 */

/**
 * @typedef {Object} EmbeddingConfig
 * @property {string} [modelId='Xenova/all-MiniLM-L6-v2'] - HuggingFace model ID
 * @property {boolean} [quantized=true] - Use quantized model for smaller size
 * @property {function(EmbeddingProgress):void} [onProgress] - Progress callback
 */

/**
 * @class EmbeddingService
 * @description Generates semantic embeddings using Transformers.js in the browser
 *
 * Features:
 * - Lazy initialization (model loads only when first needed)
 * - Progress tracking during model download
 * - Embedding cache for repeated queries
 * - Cosine similarity calculation
 * - Graceful degradation if model fails to load
 */
export class EmbeddingService {
    /** @private @type {any} - Transformers.js pipeline */
    #pipeline = null;

    /** @private @type {string} - Model identifier */
    #modelId;

    /** @private @type {boolean} - Use quantized model */
    #quantized;

    /** @private @type {boolean} - Loading in progress */
    #isLoading = false;

    /** @private @type {boolean} - Service ready */
    #isReady = false;

    /** @private @type {boolean} - Initialization failed */
    #hasFailed = false;

    /** @private @type {string|null} - Error message if failed */
    #errorMessage = null;

    /** @private @type {Map<string, Float32Array>} - Embedding cache */
    #cache = new Map();

    /** @private @type {number} - Max cache size */
    #maxCacheSize = 500;

    /** @private @type {function(EmbeddingProgress):void|null} - Progress callback */
    #onProgress = null;

    /** @private @type {number} - Embedding dimension (384 for MiniLM) */
    #dimension = 384;

    /**
     * Creates a new EmbeddingService instance
     *
     * @param {EmbeddingConfig} [config={}] - Configuration options
     */
    constructor(config = {}) {
        this.#modelId = config.modelId || 'Xenova/all-MiniLM-L6-v2';
        this.#quantized = config.quantized !== false; // Default true
        this.#onProgress = config.onProgress || null;
    }

    /**
     * Whether the service is ready to generate embeddings
     * @type {boolean}
     * @readonly
     */
    get isReady() {
        return this.#isReady;
    }

    /**
     * Whether the service is currently loading
     * @type {boolean}
     * @readonly
     */
    get isLoading() {
        return this.#isLoading;
    }

    /**
     * Whether initialization has failed
     * @type {boolean}
     * @readonly
     */
    get hasFailed() {
        return this.#hasFailed;
    }

    /**
     * Error message if initialization failed
     * @type {string|null}
     * @readonly
     */
    get errorMessage() {
        return this.#errorMessage;
    }

    /**
     * Embedding dimension size
     * @type {number}
     * @readonly
     */
    get dimension() {
        return this.#dimension;
    }

    /**
     * Number of cached embeddings
     * @type {number}
     * @readonly
     */
    get cacheSize() {
        return this.#cache.size;
    }

    /**
     * Initializes the embedding model
     * Downloads the model on first use (~22MB, cached by browser)
     *
     * @returns {Promise<boolean>} True if initialized successfully
     * @throws {Error} If Transformers.js is not available
     *
     * @example
     * const embedder = new EmbeddingService();
     * const success = await embedder.initialize();
     * if (success) {
     *   console.log('Model ready');
     * }
     */
    async initialize() {
        // Already ready
        if (this.#isReady) return true;

        // Already loading, wait for it
        if (this.#isLoading) {
            return this.#waitForReady();
        }

        // Already failed, don't retry
        if (this.#hasFailed) {
            console.warn('[EmbeddingService] Previous initialization failed, not retrying');
            return false;
        }

        this.#isLoading = true;
        this.#reportProgress('loading', 0, 'Inicializando modelo de embeddings...');

        try {
            // Check if Transformers.js is available
            if (!window.TransformersJS?.pipeline) {
                throw new Error('Transformers.js not loaded. Add the CDN script to index.html');
            }

            const { pipeline } = window.TransformersJS;

            console.log(`[EmbeddingService] Loading model: ${this.#modelId}`);
            this.#reportProgress('loading', 10, 'Descargando modelo (~22MB)...');

            // Create feature-extraction pipeline with progress callback
            this.#pipeline = await pipeline('feature-extraction', this.#modelId, {
                quantized: this.#quantized,
                progress_callback: (progress) => {
                    if (progress.status === 'progress') {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        this.#reportProgress('loading', percent, `Descargando: ${percent}%`);
                    }
                }
            });

            this.#isReady = true;
            this.#isLoading = false;
            this.#reportProgress('ready', 100, 'Modelo listo');
            console.log('[EmbeddingService] Model loaded successfully');

            return true;

        } catch (error) {
            this.#isLoading = false;
            this.#hasFailed = true;
            this.#errorMessage = error.message;
            this.#reportProgress('error', 0, `Error: ${error.message}`);
            console.error('[EmbeddingService] Failed to load model:', error);

            return false;
        }
    }

    /**
     * Waits for the model to finish loading
     * @private
     * @returns {Promise<boolean>}
     */
    async #waitForReady() {
        const maxWait = 60000; // 60 seconds
        const interval = 100;
        let waited = 0;

        while (this.#isLoading && waited < maxWait) {
            await new Promise(r => setTimeout(r, interval));
            waited += interval;
        }

        return this.#isReady;
    }

    /**
     * Reports progress to callback
     * @private
     * @param {string} status
     * @param {number} progress
     * @param {string} message
     */
    #reportProgress(status, progress, message) {
        if (this.#onProgress) {
            this.#onProgress({ status, progress, message });
        }
    }

    /**
     * Generates an embedding vector for the given text
     *
     * @param {string} text - Text to embed
     * @param {Object} [options={}] - Options
     * @param {boolean} [options.useCache=true] - Use cache for repeated texts
     * @returns {Promise<Float32Array>} Embedding vector (384 dimensions)
     * @throws {Error} If model is not ready or embedding fails
     *
     * @example
     * const vector = await embedder.embed('Como configurar App Aula?');
     * console.log(vector.length); // 384
     */
    async embed(text, options = {}) {
        const { useCache = true } = options;

        // Normalize text for consistent embeddings
        const normalizedText = this.#normalizeText(text);

        // Check cache
        if (useCache && this.#cache.has(normalizedText)) {
            return this.#cache.get(normalizedText);
        }

        // Ensure model is ready
        if (!this.#isReady) {
            const success = await this.initialize();
            if (!success) {
                throw new Error('EmbeddingService not available');
            }
        }

        try {
            // Generate embedding
            const output = await this.#pipeline(normalizedText, {
                pooling: 'mean',
                normalize: true
            });

            // Convert to Float32Array
            const embedding = new Float32Array(output.data);

            // Cache the result
            if (useCache) {
                this.#addToCache(normalizedText, embedding);
            }

            return embedding;

        } catch (error) {
            console.error('[EmbeddingService] Embedding failed:', error);
            throw new Error(`Embedding generation failed: ${error.message}`);
        }
    }

    /**
     * Generates embeddings for multiple texts in batch
     *
     * @param {string[]} texts - Array of texts to embed
     * @param {Object} [options={}] - Options
     * @param {boolean} [options.useCache=true] - Use cache
     * @returns {Promise<Float32Array[]>} Array of embedding vectors
     *
     * @example
     * const vectors = await embedder.embedBatch(['texto 1', 'texto 2']);
     */
    async embedBatch(texts, options = {}) {
        const embeddings = [];

        for (const text of texts) {
            const embedding = await this.embed(text, options);
            embeddings.push(embedding);
        }

        return embeddings;
    }

    /**
     * Calculates cosine similarity between two vectors
     * Vectors must be normalized (which they are from this service)
     *
     * @param {Float32Array|number[]} a - First vector
     * @param {Float32Array|number[]} b - Second vector
     * @returns {number} Similarity score between -1 and 1 (1 = identical)
     *
     * @example
     * const sim = embedder.cosineSimilarity(vec1, vec2);
     * if (sim > 0.8) console.log('Very similar');
     */
    cosineSimilarity(a, b) {
        if (a.length !== b.length) {
            throw new Error(`Vector dimensions must match: ${a.length} vs ${b.length}`);
        }

        let dotProduct = 0;
        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
        }

        // Vectors are already normalized, so dot product equals cosine similarity
        return dotProduct;
    }

    /**
     * Finds the most similar items from a collection
     *
     * @param {Float32Array} queryEmbedding - Query vector
     * @param {Array<{id: string, embedding: Float32Array}>} candidates - Candidate items
     * @param {number} [topK=5] - Number of results to return
     * @returns {Array<{id: string, similarity: number}>} Sorted results
     *
     * @example
     * const results = embedder.findSimilar(queryVec, documents, 5);
     */
    findSimilar(queryEmbedding, candidates, topK = 5) {
        const scores = candidates.map(candidate => ({
            id: candidate.id,
            similarity: this.cosineSimilarity(queryEmbedding, candidate.embedding)
        }));

        return scores
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, topK);
    }

    /**
     * Normalizes text for consistent embeddings
     * @private
     * @param {string} text
     * @returns {string}
     */
    #normalizeText(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, ' ')
            .slice(0, 512); // Limit length for model
    }

    /**
     * Adds embedding to cache with LRU eviction
     * @private
     * @param {string} key
     * @param {Float32Array} value
     */
    #addToCache(key, value) {
        // LRU eviction: remove oldest if at capacity
        if (this.#cache.size >= this.#maxCacheSize) {
            const oldestKey = this.#cache.keys().next().value;
            this.#cache.delete(oldestKey);
        }

        this.#cache.set(key, value);
    }

    /**
     * Clears the embedding cache
     * @returns {void}
     */
    clearCache() {
        this.#cache.clear();
        console.log('[EmbeddingService] Cache cleared');
    }

    /**
     * Gets statistics about the service
     * @returns {Object} Service statistics
     */
    getStats() {
        return {
            isReady: this.#isReady,
            isLoading: this.#isLoading,
            hasFailed: this.#hasFailed,
            modelId: this.#modelId,
            dimension: this.#dimension,
            cacheSize: this.#cache.size,
            maxCacheSize: this.#maxCacheSize
        };
    }
}

export default EmbeddingService;

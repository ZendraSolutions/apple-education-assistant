/**
 * @fileoverview RAG Engine - Retrieval-Augmented Generation
 * @module chatbot/RAGEngine
 * @version 2.0.0
 * @license MIT
 *
 * Provides document search and context building for the chatbot.
 * Uses keyword-based retrieval to find relevant documentation.
 */

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
 * @typedef {Object} SearchResult
 * @property {string} id - Document ID
 * @property {string} title - Document title
 * @property {string} category - Document category
 * @property {string} content - Document content
 * @property {string[]} [keywords] - Search keywords
 * @property {string} [officialDocUrl] - Official documentation URL
 * @property {number} score - Relevance score
 */

/**
 * @typedef {Object} DocsMetadata
 * @property {string} version - Documentation version
 * @property {string} lastUpdated - Last update date
 * @property {string} source - Documentation source
 * @property {string} [updateFrequency] - Update frequency
 */

/**
 * @class RAGEngine
 * @description Retrieval-Augmented Generation engine for document search
 *
 * @example
 * const rag = new RAGEngine();
 * await rag.loadDocumentation();
 *
 * const results = rag.search('Como configurar App Aula?');
 * const context = rag.buildContext(results);
 */
export class RAGEngine {
    /** @private @type {Document[]} */
    #documents = [];

    /** @private @type {DocsMetadata} */
    #metadata = {
        version: '1.0.0',
        lastUpdated: '2025-12-23',
        source: 'Manual'
    };

    /** @private @type {string} */
    #docsPath = 'data/docs.json';

    /**
     * Creates a new RAGEngine instance
     *
     * @param {string} [docsPath='data/docs.json'] - Path to documentation JSON
     */
    constructor(docsPath) {
        if (docsPath) {
            this.#docsPath = docsPath;
        }
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
     * Loads documentation from JSON file or uses embedded fallback
     *
     * @returns {Promise<void>}
     *
     * @example
     * await rag.loadDocumentation();
     * console.log(`Loaded ${rag.documentCount} documents`);
     */
    async loadDocumentation() {
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
                    `[Docs] Documentation loaded: ${this.#documents.length} articles (v${data.version})`
                );
            } else {
                console.log('[WARN] Could not load docs.json, using embedded docs');
                this.#documents = this.#getEmbeddedDocs();
            }
        } catch (e) {
            console.log('[WARN] Error loading documentation:', e);
            this.#documents = this.#getEmbeddedDocs();
        }
    }

    /**
     * Searches for relevant documents based on a query
     *
     * @param {string} query - User's search query
     * @param {number} [topK=3] - Maximum number of results to return
     * @returns {SearchResult[]} Sorted array of relevant documents
     *
     * @example
     * const results = rag.search('problemas con bluetooth aula', 3);
     * // Returns top 3 most relevant documents
     */
    search(query, topK = 3) {
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

            return { ...doc, score };
        });

        return results
            .filter(d => d.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    /**
     * Builds a context string for the LLM from search results
     *
     * @param {SearchResult[]} docs - Documents to include in context
     * @returns {string} Formatted context string
     *
     * @example
     * const results = rag.search(query);
     * const context = rag.buildContext(results);
     * // Returns: "[1] Title\nContent...\nFuente: url\n"
     */
    buildContext(docs) {
        if (!docs || docs.length === 0) {
            return '';
        }

        let context = '';
        docs.forEach((doc, i) => {
            context += `\n[${i + 1}] ${doc.title}\n${doc.content}\n`;
            if (doc.officialDocUrl) {
                context += `Fuente: ${doc.officialDocUrl}\n`;
            }
        });

        return context;
    }

    /**
     * Generates an offline response when no API key is available
     *
     * @param {string} query - User's query
     * @param {SearchResult[]} relevantDocs - Search results
     * @returns {string} Offline response with documentation
     *
     * @example
     * const docs = rag.search(query);
     * const response = rag.generateOfflineResponse(query, docs);
     */
    generateOfflineResponse(query, relevantDocs) {
        if (relevantDocs.length > 0) {
            const doc = relevantDocs[0];
            let resp = `**${doc.title}**\n\n${doc.content}`;

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
    }
}

export default RAGEngine;

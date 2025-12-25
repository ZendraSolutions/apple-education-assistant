/**
 * JAMF ASSISTANT - Knowledge Base Metadata
 * Metadatos y configuracion de la base de conocimiento
 *
 * @module KnowledgeMetadata
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 */

/**
 * Metadata configuration for the knowledge base
 * @typedef {Object} KnowledgeMetadataType
 * @property {string} version - Version of the knowledge base
 * @property {string} lastUpdated - Last update date (YYYY-MM-DD)
 * @property {string} source - Primary source of documentation
 * @property {string} officialDocs - URL to official Jamf documentation
 * @property {number} articleCount - Total number of articles
 * @property {string} updateFrequency - How often the KB should be updated
 * @property {string} ecosystem - Description of the managed ecosystem
 */

/**
 * Knowledge base metadata
 * @type {KnowledgeMetadataType}
 */
export const metadata = {
    version: '2.0.0',
    lastUpdated: '2025-12-24',
    source: 'Documentacion oficial de Jamf (learn.jamf.com)',
    officialDocs: 'https://learn.jamf.com/bundle/jamf-school-documentation/',
    articleCount: 22,
    updateFrequency: 'Manual - Verificar cada trimestre',
    ecosystem: 'Apple School Manager + Jamf School + App Aula'
};

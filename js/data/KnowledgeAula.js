/**
 * JAMF ASSISTANT - Knowledge Base Aula (Apple Classroom)
 * Re-exports all Aula-related guides from split modules
 *
 * This module aggregates the Aula guides which have been split
 * into basic and advanced modules to maintain the 500-line limit.
 *
 * @module KnowledgeAula
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 */

// =============================================================================
// Import from split modules
// =============================================================================

export { overview, howto, setup } from './KnowledgeAulaBasic.js';
export { advanced, remotehybrid, sharedipad, troubleshoot } from './KnowledgeAulaAdvanced.js';

// =============================================================================
// Re-import for combined object
// =============================================================================

import { overview, howto, setup } from './KnowledgeAulaBasic.js';
import { advanced, remotehybrid, sharedipad, troubleshoot } from './KnowledgeAulaAdvanced.js';

/**
 * Complete aula module as a combined object for backwards compatibility
 * @type {Object}
 */
export const aula = {
    overview,
    howto,
    setup,
    advanced,
    remotehybrid,
    sharedipad,
    troubleshoot
};

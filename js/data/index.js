/**
 * JAMF ASSISTANT - Knowledge Base Index
 * Re-exports all knowledge modules and provides backwards compatibility
 *
 * This module aggregates all knowledge base sections and exports them
 * in a way that maintains backwards compatibility with the original
 * monolithic KnowledgeBase object while enabling tree-shaking and
 * lazy loading for modern consumers.
 *
 * @module KnowledgeBase
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 *
 * @example
 * // Modern usage - import only what you need (tree-shakable)
 * import { ipads, aula } from './data/index.js';
 *
 * @example
 * // Legacy usage - import the full KnowledgeBase object
 * import { KnowledgeBase } from './data/index.js';
 *
 * @example
 * // Dynamic import for lazy loading
 * const { ipads } = await import('./data/KnowledgeIPads.js');
 */

// =============================================================================
// Named Exports - Tree-shakable individual modules
// =============================================================================

/**
 * Metadata configuration
 * @see module:KnowledgeMetadata
 */
export { metadata } from './KnowledgeMetadata.js';

/**
 * Ecosystem documentation (ASM, Apple Education overview)
 * @see module:KnowledgeEcosystem
 */
export {
    ecosistema,
    overview as ecosistemaOverview,
    asm
} from './KnowledgeEcosystem.js';

/**
 * iPad management guides
 * @see module:KnowledgeIPads
 */
export {
    ipads,
    enrollment as ipadEnrollment,
    apps as ipadApps,
    restrictions as ipadRestrictions
} from './KnowledgeIPads.js';

/**
 * Mac management guides
 * @see module:KnowledgeMacs
 */
export {
    macs,
    enrollment as macEnrollment,
    policies as macPolicies
} from './KnowledgeMacs.js';

/**
 * Apple Classroom (Aula) guides
 * @see module:KnowledgeAula
 */
export {
    aula,
    overview as aulaOverview,
    howto as aulaHowto,
    setup as aulaSetup,
    advanced as aulaAdvanced,
    remotehybrid as aulaRemotehybrid,
    sharedipad as aulaSharedipad,
    troubleshoot as aulaTroubleshoot
} from './KnowledgeAula.js';

/**
 * Jamf Teacher guides
 * @see module:KnowledgeTeacher
 */
export {
    teacher,
    setup as teacherSetup
} from './KnowledgeTeacher.js';

/**
 * Operational checklists
 * @see module:KnowledgeChecklists
 */
export {
    checklists,
    newIpad,
    newMac,
    startYear,
    endYear,
    newTeacher,
    studentLeaves,
    aulaNotWorking,
    dailyCheck,
    weeklyMaintenance,
    prepareExam
} from './KnowledgeChecklists.js';

/**
 * Visual diagrams
 * @see module:KnowledgeDiagrams
 */
export {
    diagrams,
    ecosystem as ecosystemDiagram,
    aulaFlow as aulaFlowDiagram,
    troubleshootFlow as troubleshootFlowDiagram
} from './KnowledgeDiagrams.js';

// =============================================================================
// Backwards Compatible KnowledgeBase Object
// =============================================================================

// Import all modules for the combined object
import { metadata } from './KnowledgeMetadata.js';
import { ecosistema } from './KnowledgeEcosystem.js';
import { ipads } from './KnowledgeIPads.js';
import { macs } from './KnowledgeMacs.js';
import { aula } from './KnowledgeAula.js';
import { teacher } from './KnowledgeTeacher.js';
import { checklists } from './KnowledgeChecklists.js';
import { diagrams } from './KnowledgeDiagrams.js';

/**
 * Complete KnowledgeBase object for backwards compatibility
 *
 * This object mirrors the structure of the original monolithic knowledge-base.js
 * file, ensuring that existing code continues to work without modifications.
 *
 * @type {Object}
 * @property {Object} _metadata - Version and update information
 * @property {Object} ecosistema - Apple Education ecosystem documentation
 * @property {Object} ipads - iPad management guides
 * @property {Object} macs - Mac management guides
 * @property {Object} aula - Apple Classroom guides
 * @property {Object} teacher - Jamf Teacher guides
 * @property {Object} checklists - Operational checklists
 * @property {Object} diagrams - Visual diagrams
 */
export const KnowledgeBase = {
    _metadata: metadata,
    ecosistema,
    ipads,
    macs,
    aula,
    teacher,
    checklists,
    diagrams
};

// =============================================================================
// Global Export for Non-Module Scripts
// =============================================================================

/**
 * Attach KnowledgeBase to window for backwards compatibility with
 * scripts that don't use ES6 modules.
 *
 * This ensures that existing code like:
 *   if (KnowledgeBase._metadata) { ... }
 *   KnowledgeBase.ipads.enrollment.title
 *
 * continues to work without modifications.
 */
if (typeof window !== 'undefined') {
    window.KnowledgeBase = KnowledgeBase;
}

// =============================================================================
// Lazy Loading Helpers
// =============================================================================

/**
 * Dynamically load a specific knowledge module
 *
 * This function enables lazy loading of individual modules,
 * reducing initial bundle size for applications that don't
 * need all knowledge sections immediately.
 *
 * @async
 * @param {'metadata'|'ecosistema'|'ipads'|'macs'|'aula'|'teacher'|'checklists'|'diagrams'} moduleName - The module to load
 * @returns {Promise<Object>} The loaded module
 * @throws {Error} If the module name is invalid
 *
 * @example
 * const ipadsModule = await loadKnowledgeModule('ipads');
 * console.log(ipadsModule.enrollment.title);
 */
export async function loadKnowledgeModule(moduleName) {
    const moduleMap = {
        metadata: () => import('./KnowledgeMetadata.js'),
        ecosistema: () => import('./KnowledgeEcosystem.js'),
        ipads: () => import('./KnowledgeIPads.js'),
        macs: () => import('./KnowledgeMacs.js'),
        aula: () => import('./KnowledgeAula.js'),
        teacher: () => import('./KnowledgeTeacher.js'),
        checklists: () => import('./KnowledgeChecklists.js'),
        diagrams: () => import('./KnowledgeDiagrams.js')
    };

    if (!moduleMap[moduleName]) {
        throw new Error(`Unknown module: ${moduleName}. Valid modules are: ${Object.keys(moduleMap).join(', ')}`);
    }

    return moduleMap[moduleName]();
}

/**
 * Get all available module names
 *
 * @returns {string[]} Array of module names that can be lazy loaded
 */
export function getAvailableModules() {
    return ['metadata', 'ecosistema', 'ipads', 'macs', 'aula', 'teacher', 'checklists', 'diagrams'];
}

// =============================================================================
// Default Export
// =============================================================================

/**
 * Default export is the complete KnowledgeBase object for convenience
 */
export default KnowledgeBase;

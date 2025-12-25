/**
 * @fileoverview Error class for missing section lookups
 * @module patterns/errors/SectionNotFoundError
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

/**
 * Error thrown when attempting to access a section that doesn't exist in the registry.
 *
 * @class SectionNotFoundError
 * @extends Error
 *
 * @example
 * const view = sectionRegistry.get('nonexistent');
 * if (!view) {
 *     throw new SectionNotFoundError('nonexistent', sectionRegistry.list());
 * }
 */
export class SectionNotFoundError extends Error {
    /**
     * The name of the section that was not found
     * @type {string}
     */
    sectionName;

    /**
     * List of available sections for helpful error messages
     * @type {string[]}
     */
    availableSections;

    /**
     * Creates a new SectionNotFoundError
     *
     * @param {string} sectionName - The name of the section that was not found
     * @param {string[]} [availableSections=[]] - List of available sections
     */
    constructor(sectionName, availableSections = []) {
        const available = availableSections.length > 0
            ? ` Available sections: ${availableSections.join(', ')}`
            : '';

        super(`Section "${sectionName}" is not registered.${available}`);
        this.name = 'SectionNotFoundError';
        this.sectionName = sectionName;
        this.availableSections = availableSections;

        // Maintains proper stack trace in V8 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, SectionNotFoundError);
        }
    }
}

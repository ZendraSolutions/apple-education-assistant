/**
 * @fileoverview Error class for duplicate section registration attempts
 * @module patterns/errors/DuplicateSectionError
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

/**
 * Error thrown when attempting to register a section with an existing name.
 * This enforces the uniqueness constraint of section identifiers in the registry.
 *
 * @class DuplicateSectionError
 * @extends Error
 *
 * @example
 * try {
 *     sectionRegistry.register('dashboard', () => new DashboardView());
 *     sectionRegistry.register('dashboard', () => new AnotherView()); // throws
 * } catch (error) {
 *     if (error instanceof DuplicateSectionError) {
 *         console.error(`Section "${error.sectionName}" already exists`);
 *     }
 * }
 */
export class DuplicateSectionError extends Error {
    /**
     * The name of the section that caused the conflict
     * @type {string}
     */
    sectionName;

    /**
     * Creates a new DuplicateSectionError
     *
     * @param {string} sectionName - The name of the duplicate section
     */
    constructor(sectionName) {
        super(`Section "${sectionName}" is already registered. Use a unique name or unregister the existing section first.`);
        this.name = 'DuplicateSectionError';
        this.sectionName = sectionName;

        // Maintains proper stack trace in V8 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DuplicateSectionError);
        }
    }
}

/**
 * @fileoverview CircularDependencyError - Error for dependency cycles
 * @module core/errors/CircularDependencyError
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Custom error thrown when the IoC container detects a circular dependency
 * during service resolution. Circular dependencies occur when service A
 * depends on B, B depends on C, and C depends on A (or any similar cycle).
 *
 * This error provides the full dependency chain to help identify and fix
 * the circular reference.
 *
 * @example
 * // If serviceA -> serviceB -> serviceC -> serviceA
 * try {
 *     container.resolve('serviceA');
 * } catch (error) {
 *     if (error instanceof CircularDependencyError) {
 *         console.log('Cycle:', error.dependencyChain.join(' -> '));
 *         // Output: serviceA -> serviceB -> serviceC -> serviceA
 *     }
 * }
 */

/**
 * Error thrown when a circular dependency is detected
 *
 * @class CircularDependencyError
 * @extends Error
 *
 * @example
 * throw new CircularDependencyError(['serviceA', 'serviceB', 'serviceA']);
 */
export class CircularDependencyError extends Error {
    /**
     * The dependency chain that forms the cycle
     * @type {string[]}
     */
    dependencyChain;

    /**
     * The service that closes the cycle (appears twice)
     * @type {string}
     */
    cyclicService;

    /**
     * Creates a new CircularDependencyError
     *
     * @param {string[]} chain - The dependency resolution chain
     *                           Last element should be the same as an earlier element
     */
    constructor(chain) {
        const cyclePath = chain.join(' -> ');
        super(`Circular dependency detected: ${cyclePath}`);

        this.name = 'CircularDependencyError';
        this.dependencyChain = chain;

        // Find the service that creates the cycle
        this.cyclicService = chain[chain.length - 1];

        // Maintains proper stack trace in V8 (Chrome/Node)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CircularDependencyError);
        }
    }

    /**
     * Gets a formatted explanation of the circular dependency
     *
     * @returns {string} Human-readable explanation
     */
    getExplanation() {
        const chain = this.dependencyChain;
        if (chain.length < 2) {
            return 'Self-referential dependency detected.';
        }

        const lines = [
            'Circular dependency detected:',
            ''
        ];

        for (let i = 0; i < chain.length - 1; i++) {
            const arrow = i === chain.length - 2 ? ' --> CYCLE!' : '';
            lines.push(`  ${i + 1}. "${chain[i]}" depends on "${chain[i + 1]}"${arrow}`);
        }

        lines.push('');
        lines.push(`To fix: Remove the dependency from "${chain[chain.length - 2]}" to "${chain[chain.length - 1]}",`);
        lines.push('or use a factory pattern with lazy resolution.');

        return lines.join('\n');
    }

    /**
     * Gets the length of the dependency cycle
     *
     * @returns {number} Number of services in the cycle
     */
    getCycleLength() {
        // Find where the cycle starts
        const lastService = this.dependencyChain[this.dependencyChain.length - 1];
        const firstOccurrence = this.dependencyChain.indexOf(lastService);
        return this.dependencyChain.length - firstOccurrence;
    }
}

export default CircularDependencyError;

/**
 * @fileoverview ServiceNotFoundError - Error for missing container registrations
 * @module core/errors/ServiceNotFoundError
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Custom error thrown when attempting to resolve a service that has not been
 * registered in the IoC container. Provides helpful debugging information
 * including the list of available services.
 *
 * @example
 * try {
 *     container.resolve('unknownService');
 * } catch (error) {
 *     if (error instanceof ServiceNotFoundError) {
 *         console.log('Missing service:', error.serviceName);
 *         console.log('Available:', error.availableServices);
 *     }
 * }
 */

/**
 * Error thrown when a service is not found in the container
 *
 * @class ServiceNotFoundError
 * @extends Error
 *
 * @example
 * throw new ServiceNotFoundError('missingService', ['eventBus', 'stateManager']);
 */
export class ServiceNotFoundError extends Error {
    /**
     * Name of the service that was not found
     * @type {string}
     */
    serviceName;

    /**
     * List of available registered services
     * @type {string[]}
     */
    availableServices;

    /**
     * Creates a new ServiceNotFoundError
     *
     * @param {string} serviceName - The name of the service that was not found
     * @param {string[]} [availableServices=[]] - List of currently registered services
     */
    constructor(serviceName, availableServices = []) {
        const availableText = availableServices.length > 0
            ? `\nAvailable services: ${availableServices.join(', ')}`
            : '\nNo services are currently registered.';

        super(`Service "${serviceName}" is not registered in the container.${availableText}`);

        this.name = 'ServiceNotFoundError';
        this.serviceName = serviceName;
        this.availableServices = availableServices;

        // Maintains proper stack trace in V8 (Chrome/Node)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServiceNotFoundError);
        }
    }

    /**
     * Suggests similar service names that might have been intended
     * Useful for typo detection
     *
     * @returns {string[]} Array of similar service names
     */
    getSuggestions() {
        if (!this.availableServices.length) return [];

        const target = this.serviceName.toLowerCase();
        return this.availableServices.filter(name => {
            const lower = name.toLowerCase();
            // Check for substring match
            if (lower.includes(target) || target.includes(lower)) {
                return true;
            }
            // Check for similar length and common characters
            if (Math.abs(name.length - this.serviceName.length) <= 2) {
                const common = [...target].filter(c => lower.includes(c)).length;
                return common >= target.length * 0.6;
            }
            return false;
        });
    }
}

export default ServiceNotFoundError;

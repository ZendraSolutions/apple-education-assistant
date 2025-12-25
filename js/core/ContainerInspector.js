/**
 * @fileoverview Container Inspector - Debug and introspection utilities
 * @module core/ContainerInspector
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Provides debugging and introspection capabilities for IoC Container.
 * Separated from Container class to follow Interface Segregation Principle (ISP).
 *
 * This allows normal container usage without exposing debug/inspection methods,
 * while still providing these capabilities when needed for development and testing.
 *
 * @example
 * // Use inspector for debugging
 * const container = new Container({ debug: true });
 * const inspector = new ContainerInspector(container);
 *
 * console.log(inspector.getRegistrationInfo('eventBus'));
 * const scope = inspector.createScope();
 */

/**
 * Inspector class for Container debugging and introspection.
 * Provides methods that are useful for development but not needed for normal usage.
 *
 * @class ContainerInspector
 *
 * @example
 * const inspector = new ContainerInspector(container);
 * const info = inspector.getRegistrationInfo('themeManager');
 * console.log('Dependencies:', info.dependencies);
 */
export class ContainerInspector {
    /**
     * Container instance to inspect
     * @type {import('./Container.js').Container}
     * @private
     */
    #container;

    /**
     * Creates a new ContainerInspector instance
     *
     * @param {import('./Container.js').Container} container - Container to inspect
     * @throws {TypeError} If container is not provided
     */
    constructor(container) {
        if (!container) {
            throw new TypeError('ContainerInspector requires a Container instance');
        }
        this.#container = container;
    }

    /**
     * Gets debug information about a registration
     *
     * @param {string} name - Service identifier
     * @returns {Object|null} Registration info or null if not found
     *
     * @example
     * const info = inspector.getRegistrationInfo('eventBus');
     * console.log('Lifecycle:', info.lifecycle);
     * console.log('Dependencies:', info.dependencies);
     */
    getRegistrationInfo(name) {
        return this.#container.getRegistrationInfo(name);
    }

    /**
     * Creates a child scope container
     * Child inherits parent's registrations but can override with local instances
     * Useful for request-scoped services or testing
     *
     * @returns {import('./Container.js').Container} New child container
     *
     * @example
     * // Create isolated scope for testing
     * const testScope = inspector.createScope();
     * testScope.registerInstance('eventBus', mockEventBus);
     * const manager = testScope.resolve('themeManager');
     */
    createScope() {
        return this.#container.createScope();
    }

    /**
     * Lists all registered service names
     *
     * @returns {string[]} Array of service names
     *
     * @example
     * const services = inspector.listRegistered();
     * console.log('Available services:', services);
     */
    listRegistered() {
        return this.#container.listRegistered();
    }

    /**
     * Checks if a service is registered
     *
     * @param {string} name - Service identifier
     * @returns {boolean} True if service is registered
     *
     * @example
     * if (inspector.has('eventBus')) {
     *     console.log('EventBus is registered');
     * }
     */
    has(name) {
        return this.#container.has(name);
    }

    /**
     * Gets the number of registered services
     *
     * @returns {number} Registration count
     *
     * @example
     * console.log(`Total services: ${inspector.size}`);
     */
    get size() {
        return this.#container.size;
    }

    /**
     * Gets all registration information for debugging
     *
     * @returns {Object[]} Array of registration info objects
     *
     * @example
     * const allInfo = inspector.getAllRegistrations();
     * allInfo.forEach(info => {
     *     console.log(`${info.name}: ${info.lifecycle}`);
     * });
     */
    getAllRegistrations() {
        const names = this.#container.listRegistered();
        return names.map(name => this.getRegistrationInfo(name)).filter(Boolean);
    }

    /**
     * Prints a formatted debug report of all registrations
     *
     * @returns {void}
     *
     * @example
     * inspector.printDebugReport();
     * // Outputs formatted table of all services
     */
    printDebugReport() {
        const registrations = this.getAllRegistrations();
        console.log('\n=== Container Debug Report ===');
        console.log(`Total Services: ${registrations.length}\n`);

        registrations.forEach(info => {
            console.log(`Service: ${info.name}`);
            console.log(`  Lifecycle: ${info.lifecycle}`);
            console.log(`  Dependencies: ${info.dependencies.join(', ') || 'none'}`);
            console.log(`  Factory: ${info.isFactory ? 'yes' : 'no'}`);
            console.log(`  Singleton Cached: ${info.isSingleton ? 'yes' : 'no'}`);
            console.log('');
        });
    }
}

export default ContainerInspector;

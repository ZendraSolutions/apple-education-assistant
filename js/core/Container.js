/**
 * @fileoverview IoC Container - Dependency Injection container implementation
 * @module core/Container
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Lightweight IoC (Inversion of Control) container for managing dependencies.
 * Implements Dependency Injection pattern to decouple service instantiation
 * from usage, enabling:
 * - Single source of truth for service creation
 * - Easy testing with mock injection
 * - Lifecycle management (singleton, transient, scoped)
 * - Automatic dependency resolution
 * - Circular dependency detection
 *
 * This follows the Dependency Inversion Principle (DIP) - high-level modules
 * should not depend on low-level modules; both should depend on abstractions.
 *
 * @example
 * // Basic usage
 * const container = new Container();
 * container.register('eventBus', EventBus, { lifecycle: 'singleton' });
 * container.register('themeManager', ThemeManager, {
 *     dependencies: ['eventBus', 'stateManager'],
 *     lifecycle: 'singleton'
 * });
 *
 * const theme = container.resolve('themeManager');
 *
 * @example
 * // Using factories for complex initialization
 * container.register('validatorChain', () => createGeminiValidator(), {
 *     lifecycle: 'singleton',
 *     factory: true
 * });
 *
 * @example
 * // Testing with mocks
 * const testContainer = container.createScope();
 * testContainer.registerInstance('eventBus', mockEventBus);
 * const manager = testContainer.resolve('themeManager'); // Uses mock
 */

import { ServiceNotFoundError } from './errors/ServiceNotFoundError.js';
import { CircularDependencyError } from './errors/CircularDependencyError.js';

/**
 * @typedef {'singleton'|'transient'|'scoped'} Lifecycle
 * @description
 * - singleton: Single instance shared across all resolutions
 * - transient: New instance created on every resolution
 * - scoped: Single instance within a scope (child container)
 */

/**
 * @typedef {Object} RegistrationOptions
 * @property {Lifecycle} [lifecycle='transient'] - Instance lifecycle
 * @property {string[]} [dependencies=[]] - Names of dependencies to inject
 * @property {boolean} [factory=false] - If true, implementation is a factory function
 */

/**
 * @typedef {Object} Registration
 * @property {Function|null} implementation - Class constructor or factory function
 * @property {Lifecycle} lifecycle - Instance lifecycle
 * @property {string[]} dependencies - Dependency names
 * @property {boolean} factory - Whether implementation is a factory
 */

/**
 * IoC Container for managing application dependencies.
 * Provides dependency injection, lifecycle management, and automatic resolution.
 *
 * @class Container
 *
 * @example
 * // Create and configure container
 * const container = new Container();
 *
 * // Register services
 * container
 *     .register('eventBus', EventBus, { lifecycle: 'singleton' })
 *     .register('stateManager', StateManager, {
 *         lifecycle: 'singleton',
 *         dependencies: ['eventBus']
 *     });
 *
 * // Resolve services (dependencies auto-injected)
 * const state = container.resolve('stateManager');
 */
export class Container {
    /**
     * Service registrations
     * @type {Map<string, Registration>}
     * @private
     */
    #registrations = new Map();

    /**
     * Singleton instances cache
     * @type {Map<string, any>}
     * @private
     */
    #singletons = new Map();

    /**
     * Scoped instances cache (for child containers)
     * @type {Map<string, any>}
     * @private
     */
    #scopedInstances = new Map();

    /**
     * Parent container reference (for scopes)
     * @type {Container|null}
     * @private
     */
    #parent = null;

    /**
     * Debug mode flag
     * @type {boolean}
     * @private
     */
    #debug = false;

    /**
     * Creates a new Container instance
     *
     * @param {Object} [options={}] - Container options
     * @param {boolean} [options.debug=false] - Enable debug logging
     */
    constructor(options = {}) {
        this.#debug = options.debug || false;
    }

    /**
     * Registers a service in the container
     *
     * @param {string} name - Unique service identifier
     * @param {Function} implementation - Class constructor or factory function
     * @param {RegistrationOptions} [options={}] - Registration options
     * @returns {this} Container instance for chaining
     * @throws {TypeError} If name is not a string or implementation is not a function
     *
     * @example
     * // Register a singleton service
     * container.register('eventBus', EventBus, {
     *     lifecycle: 'singleton'
     * });
     *
     * @example
     * // Register with dependencies
     * container.register('themeManager', ThemeManager, {
     *     lifecycle: 'singleton',
     *     dependencies: ['eventBus', 'stateManager']
     * });
     *
     * @example
     * // Register a factory
     * container.register('rateLimiter', () => new RateLimiter(10, 60000), {
     *     lifecycle: 'singleton',
     *     factory: true
     * });
     */
    register(name, implementation, options = {}) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new TypeError('Service name must be a non-empty string');
        }

        if (typeof implementation !== 'function') {
            throw new TypeError(`Implementation for "${name}" must be a function or class`);
        }

        const registration = {
            implementation,
            lifecycle: options.lifecycle || 'transient',
            dependencies: options.dependencies || [],
            factory: options.factory || false
        };

        this.#registrations.set(name, registration);

        if (this.#debug) {
            console.log(`[Container] Registered: ${name} (${registration.lifecycle})`);
        }

        return this;
    }

    /**
     * Registers an existing instance directly
     * Useful for external dependencies or pre-configured objects
     *
     * @param {string} name - Service identifier
     * @param {any} instance - Pre-created instance
     * @returns {this} Container instance for chaining
     * @throws {TypeError} If name is not a string
     *
     * @example
     * // Register external objects
     * container.registerInstance('knowledgeBase', KnowledgeBase);
     * container.registerInstance('diagnostics', Diagnostics);
     *
     * @example
     * // Register mocks for testing
     * container.registerInstance('eventBus', mockEventBus);
     */
    registerInstance(name, instance) {
        if (typeof name !== 'string' || name.trim() === '') {
            throw new TypeError('Service name must be a non-empty string');
        }

        // Store as singleton
        this.#singletons.set(name, instance);

        // Create a dummy registration for consistency
        this.#registrations.set(name, {
            implementation: null,
            lifecycle: 'singleton',
            dependencies: [],
            factory: false
        });

        if (this.#debug) {
            console.log(`[Container] Registered instance: ${name}`);
        }

        return this;
    }

    /**
     * Resolves a service and all its dependencies
     *
     * @param {string} name - Service identifier to resolve
     * @param {Set<string>} [resolutionStack] - Internal: tracks resolution chain for circular detection
     * @returns {any} Resolved service instance
     * @throws {ServiceNotFoundError} If service is not registered
     * @throws {CircularDependencyError} If circular dependency is detected
     *
     * @example
     * // Resolve a service (dependencies auto-injected)
     * const themeManager = container.resolve('themeManager');
     */
    resolve(name, resolutionStack = new Set()) {
        // Check for circular dependencies
        if (resolutionStack.has(name)) {
            throw new CircularDependencyError([...resolutionStack, name]);
        }

        // Check singleton cache first
        if (this.#singletons.has(name)) {
            return this.#singletons.get(name);
        }

        // Check scoped instances (for child containers)
        if (this.#scopedInstances.has(name)) {
            return this.#scopedInstances.get(name);
        }

        // Get registration (check parent if not found locally)
        let registration = this.#registrations.get(name);
        if (!registration && this.#parent) {
            // Try to resolve from parent
            return this.#parent.resolve(name, resolutionStack);
        }

        if (!registration) {
            throw new ServiceNotFoundError(name, this.listRegistered());
        }

        // Instance was already resolved (registered via registerInstance)
        if (registration.implementation === null) {
            // This shouldn't happen if registerInstance sets up correctly
            throw new ServiceNotFoundError(name, this.listRegistered());
        }

        // Add to resolution stack for circular detection
        resolutionStack.add(name);

        // Resolve all dependencies first
        const deps = {};
        for (const depName of registration.dependencies) {
            // Create new Set to track each dependency branch
            deps[depName] = this.resolve(depName, new Set(resolutionStack));
        }

        // Create instance
        let instance;
        if (registration.factory) {
            // Factory function receives dependencies object
            instance = registration.implementation(deps);
        } else {
            // Class constructor receives dependencies object
            instance = new registration.implementation(deps);
        }

        if (this.#debug) {
            console.log(`[Container] Resolved: ${name}`);
        }

        // Cache based on lifecycle
        if (registration.lifecycle === 'singleton') {
            this.#singletons.set(name, instance);
        } else if (registration.lifecycle === 'scoped') {
            this.#scopedInstances.set(name, instance);
        }
        // transient: no caching, new instance each time

        return instance;
    }

    /**
     * Checks if a service is registered
     *
     * @param {string} name - Service identifier
     * @returns {boolean} True if service is registered
     *
     * @example
     * if (container.has('eventBus')) {
     *     const bus = container.resolve('eventBus');
     * }
     */
    has(name) {
        if (this.#registrations.has(name)) {
            return true;
        }
        if (this.#parent) {
            return this.#parent.has(name);
        }
        return false;
    }

    /**
     * Lists all registered service names
     *
     * @returns {string[]} Array of service names
     *
     * @example
     * const services = container.listRegistered();
     * console.log('Available services:', services);
     */
    listRegistered() {
        const local = [...this.#registrations.keys()];
        if (this.#parent) {
            const parentKeys = this.#parent.listRegistered();
            return [...new Set([...local, ...parentKeys])];
        }
        return local;
    }

    /**
     * Creates a child scope container
     * Child inherits parent's registrations but can override with local instances
     * Useful for request-scoped services or testing
     *
     * @returns {Container} New child container
     *
     * @example
     * // Create isolated scope for testing
     * const testScope = container.createScope();
     * testScope.registerInstance('eventBus', mockEventBus);
     * const manager = testScope.resolve('themeManager');
     */
    createScope() {
        const scope = new Container({ debug: this.#debug });

        // Copy registrations (shallow copy - same registration objects)
        scope.#registrations = new Map(this.#registrations);

        // Share singleton cache (singletons are global)
        scope.#singletons = this.#singletons;

        // Set parent reference
        scope.#parent = this;

        if (this.#debug) {
            console.log('[Container] Created child scope');
        }

        return scope;
    }

    /**
     * Clears all singleton instances (useful for testing)
     * Does NOT remove registrations
     *
     * @returns {void}
     */
    clearInstances() {
        this.#singletons.clear();
        this.#scopedInstances.clear();

        if (this.#debug) {
            console.log('[Container] Cleared all instances');
        }
    }

    /**
     * Completely resets the container
     * Removes all registrations and instances
     *
     * @returns {void}
     */
    reset() {
        this.#registrations.clear();
        this.#singletons.clear();
        this.#scopedInstances.clear();

        if (this.#debug) {
            console.log('[Container] Reset complete');
        }
    }

    /**
     * Gets the number of registered services
     *
     * @returns {number} Registration count
     */
    get size() {
        return this.#registrations.size;
    }

    /**
     * Tries to resolve a service, returns null if not found
     * Does not throw on missing service
     *
     * @param {string} name - Service identifier
     * @returns {any|null} Service instance or null
     *
     * @example
     * const service = container.tryResolve('optionalService');
     * if (service) {
     *     service.doSomething();
     * }
     */
    tryResolve(name) {
        try {
            return this.resolve(name);
        } catch (error) {
            if (error instanceof ServiceNotFoundError) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Resolves multiple services at once
     *
     * @param {string[]} names - Array of service identifiers
     * @returns {Object} Object with service names as keys and instances as values
     *
     * @example
     * const { eventBus, stateManager, themeManager } = container.resolveMany([
     *     'eventBus',
     *     'stateManager',
     *     'themeManager'
     * ]);
     */
    resolveMany(names) {
        const result = {};
        for (const name of names) {
            result[name] = this.resolve(name);
        }
        return result;
    }

    /**
     * Gets debug information about a registration
     *
     * @param {string} name - Service identifier
     * @returns {Object|null} Registration info or null if not found
     */
    getRegistrationInfo(name) {
        const reg = this.#registrations.get(name);
        if (!reg) return null;

        return {
            name,
            lifecycle: reg.lifecycle,
            dependencies: [...reg.dependencies],
            isFactory: reg.factory,
            isSingleton: this.#singletons.has(name),
            hasImplementation: reg.implementation !== null
        };
    }
}

export default Container;

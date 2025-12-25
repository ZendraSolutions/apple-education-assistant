/**
 * @fileoverview Registry Pattern for managing application views/sections
 * @module patterns/SectionRegistry
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Implements the Registry Pattern to allow views to self-register,
 * eliminating the need for switch statements and enabling the
 * Open/Closed Principle - new sections can be added without
 * modifying existing code.
 *
 * @example
 * // In DashboardView.js - self-registration
 * import { sectionRegistry } from '../patterns/SectionRegistry.js';
 * import { DashboardView } from './DashboardView.js';
 *
 * sectionRegistry.register('dashboard', (deps) => new DashboardView(deps));
 *
 * // In app.js - usage
 * const view = sectionRegistry.get('dashboard');
 * if (view) {
 *     container.innerHTML = view.render();
 * }
 */

import { DuplicateSectionError } from './errors/DuplicateSectionError.js';
import { SectionNotFoundError } from './errors/SectionNotFoundError.js';

/**
 * @callback ViewFactory
 * @param {Object} [dependencies] - Dependencies to inject into the view
 * @returns {import('../views/BaseView.js').BaseView} A view instance
 */

/**
 * @typedef {Object} SectionMetadata
 * @property {string} name - Section identifier
 * @property {string} [displayName] - Human-readable name
 * @property {string} [icon] - Icon class for navigation
 * @property {number} [order] - Display order in navigation
 * @property {boolean} [hidden] - Whether to hide from navigation
 */

/**
 * @typedef {Object} RegisteredSection
 * @property {ViewFactory} factory - Factory function to create the view
 * @property {SectionMetadata} metadata - Section metadata
 */

/**
 * Registry Pattern implementation for managing application views/sections.
 * Allows views to self-register, enabling the Open/Closed Principle.
 *
 * @class SectionRegistry
 *
 * @example
 * // Create a new registry (or use the singleton)
 * const registry = new SectionRegistry();
 *
 * // Register a section with factory
 * registry.register('dashboard', (deps) => new DashboardView(deps), {
 *     displayName: 'Dashboard',
 *     icon: 'ri-dashboard-line',
 *     order: 1
 * });
 *
 * // Get a view instance
 * const dashboardView = registry.get('dashboard', dependencies);
 */
export class SectionRegistry {
    /**
     * Map of registered sections
     * @type {Map<string, RegisteredSection>}
     * @private
     */
    #sections = new Map();

    /**
     * Whether to throw on get() miss or return null
     * @type {boolean}
     * @private
     */
    #strictMode;

    /**
     * Cached dependencies for factory calls
     * @type {Object|null}
     * @private
     */
    #defaultDependencies = null;

    /**
     * Creates a new SectionRegistry instance
     *
     * @param {Object} [options={}] - Configuration options
     * @param {boolean} [options.strictMode=false] - Throw errors on missing sections
     */
    constructor(options = {}) {
        this.#strictMode = options.strictMode || false;
    }

    /**
     * Sets default dependencies to be passed to all view factories
     *
     * @param {Object} dependencies - Default dependencies
     * @returns {this} For method chaining
     *
     * @example
     * sectionRegistry.setDefaultDependencies({
     *     eventBus: new EventBus(),
     *     knowledgeBase: KnowledgeBase
     * });
     */
    setDefaultDependencies(dependencies) {
        this.#defaultDependencies = dependencies;
        return this;
    }

    /**
     * Registers a new section with its view factory
     *
     * @param {string} name - Unique section identifier
     * @param {ViewFactory} factory - Factory function that creates the view
     * @param {SectionMetadata} [metadata={}] - Optional section metadata
     * @returns {this} For method chaining
     * @throws {DuplicateSectionError} If section name is already registered
     * @throws {TypeError} If factory is not a function
     *
     * @example
     * sectionRegistry.register('ipads', (deps) => new IPadsView(deps), {
     *     displayName: 'iPads',
     *     icon: 'ri-tablet-line',
     *     order: 3
     * });
     */
    register(name, factory, metadata = {}) {
        if (typeof factory !== 'function') {
            throw new TypeError(`Factory for section "${name}" must be a function`);
        }

        if (this.#sections.has(name)) {
            throw new DuplicateSectionError(name);
        }

        this.#sections.set(name, {
            factory,
            metadata: {
                name,
                displayName: metadata.displayName || name,
                icon: metadata.icon || null,
                order: metadata.order || 0,
                hidden: metadata.hidden || false,
                ...metadata
            }
        });

        return this;
    }

    /**
     * Unregisters a section from the registry
     *
     * @param {string} name - Section identifier to remove
     * @returns {boolean} True if section was removed, false if not found
     *
     * @example
     * sectionRegistry.unregister('deprecated-section');
     */
    unregister(name) {
        return this.#sections.delete(name);
    }

    /**
     * Checks if a section is registered
     *
     * @param {string} name - Section identifier
     * @returns {boolean} True if section exists
     *
     * @example
     * if (sectionRegistry.has('dashboard')) {
     *     // Section is available
     * }
     */
    has(name) {
        return this.#sections.has(name);
    }

    /**
     * Gets a view instance for a section
     *
     * @param {string} name - Section identifier
     * @param {Object} [dependencies] - Dependencies to pass to factory
     * @returns {import('../views/BaseView.js').BaseView|null} View instance or null
     * @throws {SectionNotFoundError} In strict mode, if section doesn't exist
     *
     * @example
     * const view = sectionRegistry.get('dashboard');
     * if (view) {
     *     container.innerHTML = view.render();
     * }
     */
    get(name, dependencies = null) {
        const section = this.#sections.get(name);

        if (!section) {
            if (this.#strictMode) {
                throw new SectionNotFoundError(name, this.list());
            }
            return null;
        }

        const deps = dependencies || this.#defaultDependencies || {};
        return section.factory(deps);
    }

    /**
     * Gets metadata for a section
     *
     * @param {string} name - Section identifier
     * @returns {SectionMetadata|null} Section metadata or null
     *
     * @example
     * const meta = sectionRegistry.getMetadata('dashboard');
     * console.log(meta.displayName, meta.icon);
     */
    getMetadata(name) {
        const section = this.#sections.get(name);
        return section ? { ...section.metadata } : null;
    }

    /**
     * Lists all registered section names
     *
     * @returns {string[]} Array of section identifiers
     *
     * @example
     * const sections = sectionRegistry.list();
     * // ['dashboard', 'ipads', 'macs', ...]
     */
    list() {
        return [...this.#sections.keys()];
    }

    /**
     * Lists all sections with their metadata, optionally sorted
     *
     * @param {Object} [options={}] - List options
     * @param {boolean} [options.includeHidden=false] - Include hidden sections
     * @param {boolean} [options.sortByOrder=true] - Sort by metadata.order
     * @returns {SectionMetadata[]} Array of section metadata
     *
     * @example
     * const navItems = sectionRegistry.listWithMetadata({ includeHidden: false });
     * navItems.forEach(section => {
     *     console.log(`${section.displayName} (${section.icon})`);
     * });
     */
    listWithMetadata(options = {}) {
        const { includeHidden = false, sortByOrder = true } = options;

        let sections = [...this.#sections.values()]
            .map(s => ({ ...s.metadata }));

        if (!includeHidden) {
            sections = sections.filter(s => !s.hidden);
        }

        if (sortByOrder) {
            sections.sort((a, b) => (a.order || 0) - (b.order || 0));
        }

        return sections;
    }

    /**
     * Clears all registered sections
     * Useful for testing
     *
     * @returns {void}
     */
    clear() {
        this.#sections.clear();
    }

    /**
     * Gets the number of registered sections
     *
     * @returns {number} Section count
     */
    get size() {
        return this.#sections.size;
    }

    /**
     * Iterates over all sections
     *
     * @param {function(RegisteredSection, string): void} callback - Iteration callback
     * @returns {void}
     *
     * @example
     * sectionRegistry.forEach((section, name) => {
     *     console.log(`${name}: ${section.metadata.displayName}`);
     * });
     */
    forEach(callback) {
        this.#sections.forEach((section, name) => {
            callback(section, name);
        });
    }
}

/**
 * Singleton instance of SectionRegistry for application-wide use.
 * Views can import this and self-register.
 *
 * @type {SectionRegistry}
 *
 * @example
 * // In any view file
 * import { sectionRegistry } from '../patterns/SectionRegistry.js';
 *
 * export class MyView extends BaseView { ... }
 *
 * // Self-register at module load time
 * sectionRegistry.register('my-view', (deps) => new MyView(deps));
 */
export const sectionRegistry = new SectionRegistry();

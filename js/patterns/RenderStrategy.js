/**
 * @fileoverview Strategy Pattern for view rendering
 * @module patterns/RenderStrategy
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Implements the Strategy Pattern for flexible view rendering.
 * Different rendering strategies can be swapped without modifying
 * the views, following the Open/Closed Principle.
 *
 * @example
 * // Use template-based rendering
 * const view = new MyView({
 *     renderStrategy: new TemplateRenderStrategy(myTemplate)
 * });
 *
 * // Or component-based rendering
 * const view = new MyView({
 *     renderStrategy: new ComponentRenderStrategy(MyComponent)
 * });
 */

/**
 * @typedef {Object} RenderContext
 * @property {Object} data - Data to render
 * @property {HTMLElement} [container] - Target container element
 * @property {Object} [options] - Additional rendering options
 */

/**
 * @typedef {function(Object): string} TemplateFn
 * @description Template function that receives data and returns HTML string
 */

/**
 * Abstract base class for render strategies.
 * Defines the interface for all rendering implementations.
 *
 * @abstract
 * @class RenderStrategy
 *
 * @example
 * class MyCustomStrategy extends RenderStrategy {
 *     render(container, data) {
 *         // Custom rendering logic
 *     }
 * }
 */
export class RenderStrategy {
    /**
     * Strategy name for identification
     * @type {string}
     */
    name = 'RenderStrategy';

    /**
     * Creates a new RenderStrategy
     *
     * @param {string} [name='RenderStrategy'] - Strategy identifier
     */
    constructor(name = 'RenderStrategy') {
        if (new.target === RenderStrategy) {
            throw new TypeError('RenderStrategy is abstract and cannot be instantiated directly');
        }
        this.name = name;
    }

    /**
     * Renders content to a container
     *
     * @abstract
     * @param {HTMLElement} container - Target container element
     * @param {Object} data - Data to render
     * @param {Object} [options={}] - Additional rendering options
     * @returns {void|string} Rendered content or void if rendering to container
     */
    render(container, data, options = {}) {
        throw new Error('Subclasses must implement render()');
    }

    /**
     * Cleans up resources when strategy is no longer needed
     *
     * @returns {void}
     */
    dispose() {
        // Override in subclasses if cleanup is needed
    }
}

/**
 * Template-based rendering strategy.
 * Uses a template function to generate HTML from data.
 *
 * @class TemplateRenderStrategy
 * @extends RenderStrategy
 *
 * @example
 * const template = (data) => `
 *     <div class="card">
 *         <h2>${data.title}</h2>
 *         <p>${data.description}</p>
 *     </div>
 * `;
 *
 * const strategy = new TemplateRenderStrategy(template);
 * strategy.render(container, { title: 'Hello', description: 'World' });
 */
export class TemplateRenderStrategy extends RenderStrategy {
    /**
     * Template function
     * @type {TemplateFn}
     * @private
     */
    #template;

    /**
     * Whether to sanitize output (requires DOMPurify)
     * @type {boolean}
     * @private
     */
    #sanitize;

    /**
     * Creates a new TemplateRenderStrategy
     *
     * @param {TemplateFn} templateFn - Template function that returns HTML
     * @param {Object} [options={}] - Strategy options
     * @param {boolean} [options.sanitize=true] - Sanitize HTML output
     */
    constructor(templateFn, options = {}) {
        super('TemplateRenderStrategy');

        if (typeof templateFn !== 'function') {
            throw new TypeError('Template must be a function');
        }

        this.#template = templateFn;
        this.#sanitize = options.sanitize !== false;
    }

    /**
     * Renders the template to a container
     *
     * @param {HTMLElement} container - Target container element
     * @param {Object} data - Data to pass to template
     * @param {Object} [options={}] - Rendering options
     * @returns {void}
     */
    render(container, data, options = {}) {
        if (!container) {
            throw new TypeError('Container element is required');
        }

        let html = this.#template(data);

        if (this.#sanitize && typeof DOMPurify !== 'undefined') {
            html = DOMPurify.sanitize(html);
        }

        container.innerHTML = html;
    }

    /**
     * Returns rendered HTML without modifying DOM
     *
     * @param {Object} data - Data to pass to template
     * @returns {string} Rendered HTML
     */
    renderToString(data) {
        let html = this.#template(data);

        if (this.#sanitize && typeof DOMPurify !== 'undefined') {
            html = DOMPurify.sanitize(html);
        }

        return html;
    }
}

/**
 * Component-based rendering strategy.
 * Creates and renders web components or custom elements.
 *
 * @class ComponentRenderStrategy
 * @extends RenderStrategy
 *
 * @example
 * const strategy = new ComponentRenderStrategy('my-card', {
 *     attributes: ['title', 'description']
 * });
 * strategy.render(container, { title: 'Hello', description: 'World' });
 */
export class ComponentRenderStrategy extends RenderStrategy {
    /**
     * Component tag name
     * @type {string}
     * @private
     */
    #tagName;

    /**
     * Attributes to set on the component
     * @type {string[]}
     * @private
     */
    #attributes;

    /**
     * Whether to clear container before rendering
     * @type {boolean}
     * @private
     */
    #clearContainer;

    /**
     * Creates a new ComponentRenderStrategy
     *
     * @param {string} tagName - Custom element tag name
     * @param {Object} [options={}] - Strategy options
     * @param {string[]} [options.attributes=[]] - Data properties to set as attributes
     * @param {boolean} [options.clearContainer=true] - Clear container before rendering
     */
    constructor(tagName, options = {}) {
        super('ComponentRenderStrategy');

        if (!tagName || typeof tagName !== 'string') {
            throw new TypeError('Tag name must be a non-empty string');
        }

        this.#tagName = tagName;
        this.#attributes = options.attributes || [];
        this.#clearContainer = options.clearContainer !== false;
    }

    /**
     * Renders a component to a container
     *
     * @param {HTMLElement} container - Target container element
     * @param {Object} data - Data to pass to component
     * @param {Object} [options={}] - Rendering options
     * @returns {HTMLElement} The created element
     */
    render(container, data, options = {}) {
        if (!container) {
            throw new TypeError('Container element is required');
        }

        if (this.#clearContainer) {
            container.innerHTML = '';
        }

        const element = document.createElement(this.#tagName);

        // Set attributes from data
        this.#attributes.forEach(attr => {
            if (data[attr] !== undefined) {
                element.setAttribute(attr, String(data[attr]));
            }
        });

        // Set remaining data as properties
        Object.keys(data).forEach(key => {
            if (!this.#attributes.includes(key)) {
                element[key] = data[key];
            }
        });

        container.appendChild(element);
        return element;
    }
}

/**
 * Fragment-based rendering strategy.
 * Builds DOM using DocumentFragment for performance.
 *
 * @class FragmentRenderStrategy
 * @extends RenderStrategy
 *
 * @example
 * const builder = (data, fragment) => {
 *     const div = document.createElement('div');
 *     div.textContent = data.title;
 *     fragment.appendChild(div);
 * };
 *
 * const strategy = new FragmentRenderStrategy(builder);
 * strategy.render(container, { title: 'Hello' });
 */
export class FragmentRenderStrategy extends RenderStrategy {
    /**
     * Builder function
     * @type {function(Object, DocumentFragment): void}
     * @private
     */
    #builder;

    /**
     * Whether to clear container before appending
     * @type {boolean}
     * @private
     */
    #clearContainer;

    /**
     * Creates a new FragmentRenderStrategy
     *
     * @param {function(Object, DocumentFragment): void} builder - Builder function
     * @param {Object} [options={}] - Strategy options
     * @param {boolean} [options.clearContainer=true] - Clear container before rendering
     */
    constructor(builder, options = {}) {
        super('FragmentRenderStrategy');

        if (typeof builder !== 'function') {
            throw new TypeError('Builder must be a function');
        }

        this.#builder = builder;
        this.#clearContainer = options.clearContainer !== false;
    }

    /**
     * Renders using DocumentFragment
     *
     * @param {HTMLElement} container - Target container element
     * @param {Object} data - Data to pass to builder
     * @param {Object} [options={}] - Rendering options
     * @returns {void}
     */
    render(container, data, options = {}) {
        if (!container) {
            throw new TypeError('Container element is required');
        }

        const fragment = document.createDocumentFragment();
        this.#builder(data, fragment);

        if (this.#clearContainer) {
            container.innerHTML = '';
        }

        container.appendChild(fragment);
    }
}

/**
 * Diff-based rendering strategy.
 * Only updates changed elements (virtual DOM-like approach).
 *
 * @class DiffRenderStrategy
 * @extends RenderStrategy
 *
 * @example
 * const strategy = new DiffRenderStrategy((data) => `<div>${data.value}</div>`);
 * strategy.render(container, { value: 1 }); // Full render
 * strategy.render(container, { value: 2 }); // Diff update
 */
export class DiffRenderStrategy extends RenderStrategy {
    /**
     * Template function
     * @type {TemplateFn}
     * @private
     */
    #template;

    /**
     * Last rendered HTML for diffing
     * @type {string}
     * @private
     */
    #lastHtml = '';

    /**
     * Creates a new DiffRenderStrategy
     *
     * @param {TemplateFn} templateFn - Template function
     */
    constructor(templateFn) {
        super('DiffRenderStrategy');

        if (typeof templateFn !== 'function') {
            throw new TypeError('Template must be a function');
        }

        this.#template = templateFn;
    }

    /**
     * Renders with diff comparison
     *
     * @param {HTMLElement} container - Target container element
     * @param {Object} data - Data to render
     * @param {Object} [options={}] - Rendering options
     * @param {boolean} [options.force=false] - Force full re-render
     * @returns {boolean} True if DOM was updated
     */
    render(container, data, options = {}) {
        if (!container) {
            throw new TypeError('Container element is required');
        }

        const newHtml = this.#template(data);

        if (options.force || newHtml !== this.#lastHtml) {
            container.innerHTML = newHtml;
            this.#lastHtml = newHtml;
            return true;
        }

        return false;
    }

    /**
     * Clears the cached HTML
     *
     * @returns {void}
     */
    dispose() {
        this.#lastHtml = '';
    }
}

// ============================================================================
// RENDER CONTEXT - Manages rendering lifecycle
// ============================================================================

/**
 * Manages render strategy selection and lifecycle.
 * Allows switching strategies at runtime.
 *
 * @class RenderContext
 *
 * @example
 * const context = new RenderContext(new TemplateRenderStrategy(template));
 * context.render(container, data);
 *
 * // Switch strategy
 * context.setStrategy(new ComponentRenderStrategy('my-component'));
 * context.render(container, data);
 */
export class RenderContext {
    /**
     * Current render strategy
     * @type {RenderStrategy}
     * @private
     */
    #strategy;

    /**
     * Creates a new RenderContext
     *
     * @param {RenderStrategy} [strategy] - Initial strategy
     */
    constructor(strategy = null) {
        this.#strategy = strategy;
    }

    /**
     * Sets the current render strategy
     *
     * @param {RenderStrategy} strategy - Strategy to use
     * @returns {this} For method chaining
     */
    setStrategy(strategy) {
        if (this.#strategy) {
            this.#strategy.dispose();
        }
        this.#strategy = strategy;
        return this;
    }

    /**
     * Gets the current strategy
     *
     * @returns {RenderStrategy|null} Current strategy
     */
    getStrategy() {
        return this.#strategy;
    }

    /**
     * Renders using the current strategy
     *
     * @param {HTMLElement} container - Target container
     * @param {Object} data - Data to render
     * @param {Object} [options={}] - Rendering options
     * @returns {*} Strategy-specific return value
     * @throws {Error} If no strategy is set
     */
    render(container, data, options = {}) {
        if (!this.#strategy) {
            throw new Error('No render strategy set. Call setStrategy() first.');
        }

        return this.#strategy.render(container, data, options);
    }

    /**
     * Disposes the current strategy
     *
     * @returns {void}
     */
    dispose() {
        if (this.#strategy) {
            this.#strategy.dispose();
            this.#strategy = null;
        }
    }
}

/**
 * @fileoverview Chain of Responsibility Pattern for API Key validation
 * @module patterns/ValidatorChain
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Implements the Chain of Responsibility Pattern for extensible validation.
 * New validators can be added without modifying existing code, following
 * the Open/Closed Principle.
 *
 * @example
 * // Create a validation chain
 * const apiKeyValidator = new ApiKeyValidatorChain()
 *     .addValidator(new NotEmptyValidator())
 *     .addValidator(new LengthValidator(39))
 *     .addValidator(new PrefixValidator('AIza'))
 *     .addValidator(new RegexValidator(/^[A-Za-z0-9_-]+$/, 'Invalid characters'));
 *
 * // Validate
 * const result = apiKeyValidator.validate('AIza...');
 * if (!result.valid) {
 *     console.error(result.error);
 * }
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string} [error] - Error message if validation failed
 * @property {string} [validatorName] - Name of the validator that failed
 * @property {string} [strength] - Optional strength indicator
 * @property {Object} [context] - Additional context information
 */

/**
 * @interface Validator
 * @description Interface for validators in the chain
 */

/**
 * @typedef {Object} Validator
 * @property {function(string): ValidationResult} validate - Validation method
 * @property {Validator|null} next - Next validator in chain
 * @property {string} name - Validator name for error reporting
 */

/**
 * Chain of Responsibility implementation for API Key validation.
 * Validators are linked and executed in sequence until one fails
 * or all pass.
 *
 * @class ApiKeyValidatorChain
 *
 * @example
 * // Easy to extend for different API providers
 * const openAIValidator = new ApiKeyValidatorChain()
 *     .addValidator(new NotEmptyValidator())
 *     .addValidator(new PrefixValidator('sk-'));
 *
 * const anthropicValidator = new ApiKeyValidatorChain()
 *     .addValidator(new NotEmptyValidator())
 *     .addValidator(new PrefixValidator('sk-ant-'));
 */
export class ApiKeyValidatorChain {
    /**
     * Head of the validator chain
     * @type {Validator|null}
     * @private
     */
    #head = null;

    /**
     * Tail of the validator chain (for efficient appending)
     * @type {Validator|null}
     * @private
     */
    #tail = null;

    /**
     * Number of validators in the chain
     * @type {number}
     * @private
     */
    #size = 0;

    /**
     * Optional name for this validator chain
     * @type {string}
     */
    name = 'ApiKeyValidatorChain';

    /**
     * Creates a new ApiKeyValidatorChain
     *
     * @param {string} [name='ApiKeyValidatorChain'] - Chain identifier
     */
    constructor(name = 'ApiKeyValidatorChain') {
        this.name = name;
    }

    /**
     * Adds a validator to the end of the chain
     *
     * @param {Validator} validator - Validator to add
     * @returns {this} For method chaining
     * @throws {TypeError} If validator doesn't have a validate method
     *
     * @example
     * chain.addValidator(new NotEmptyValidator())
     *      .addValidator(new LengthValidator(39));
     */
    addValidator(validator) {
        if (!validator || typeof validator.validate !== 'function') {
            throw new TypeError('Validator must have a validate() method');
        }

        if (!this.#head) {
            this.#head = validator;
            this.#tail = validator;
        } else {
            this.#tail.next = validator;
            this.#tail = validator;
        }

        this.#size++;
        return this;
    }

    /**
     * Adds a validator to the beginning of the chain
     *
     * @param {Validator} validator - Validator to prepend
     * @returns {this} For method chaining
     *
     * @example
     * chain.prependValidator(new CriticalSecurityValidator());
     */
    prependValidator(validator) {
        if (!validator || typeof validator.validate !== 'function') {
            throw new TypeError('Validator must have a validate() method');
        }

        validator.next = this.#head;
        this.#head = validator;

        if (!this.#tail) {
            this.#tail = validator;
        }

        this.#size++;
        return this;
    }

    /**
     * Executes the entire validation chain
     *
     * @param {string} apiKey - The API key to validate
     * @returns {ValidationResult} Validation result
     *
     * @example
     * const result = chain.validate('AIza...');
     * if (result.valid) {
     *     console.log('API Key is valid');
     * } else {
     *     console.error(result.error);
     * }
     */
    validate(apiKey) {
        if (!this.#head) {
            return { valid: true };
        }

        return this.#head.validate(apiKey);
    }

    /**
     * Validates and collects all errors (doesn't stop at first failure)
     *
     * @param {string} apiKey - The API key to validate
     * @returns {ValidationResult} Result with all errors
     *
     * @example
     * const result = chain.validateAll('');
     * // result.errors = ['API Key cannot be empty', 'Length incorrect', ...]
     */
    validateAll(apiKey) {
        const errors = [];
        let current = this.#head;

        while (current) {
            // Temporarily disconnect to get individual result
            const next = current.next;
            current.next = null;

            const result = current.validate(apiKey);
            if (!result.valid) {
                errors.push({
                    error: result.error,
                    validatorName: current.name || 'Unknown'
                });
            }

            // Reconnect
            current.next = next;
            current = next;
        }

        if (errors.length === 0) {
            return { valid: true };
        }

        return {
            valid: false,
            error: errors[0].error,
            errors,
            validatorName: errors[0].validatorName
        };
    }

    /**
     * Gets the number of validators in the chain
     *
     * @returns {number} Validator count
     */
    get size() {
        return this.#size;
    }

    /**
     * Clears all validators from the chain
     *
     * @returns {void}
     */
    clear() {
        this.#head = null;
        this.#tail = null;
        this.#size = 0;
    }

    /**
     * Creates a copy of this chain
     *
     * @returns {ApiKeyValidatorChain} New chain with same validators
     */
    clone() {
        const newChain = new ApiKeyValidatorChain(this.name);
        let current = this.#head;

        while (current) {
            // Clone each validator (shallow copy)
            const cloned = Object.assign(
                Object.create(Object.getPrototypeOf(current)),
                current
            );
            cloned.next = null;
            newChain.addValidator(cloned);
            current = current.next;
        }

        return newChain;
    }
}

// ============================================================================
// CONCRETE VALIDATORS
// ============================================================================

/**
 * Validates that the API key is not empty
 *
 * @class NotEmptyValidator
 * @implements {Validator}
 *
 * @example
 * const validator = new NotEmptyValidator();
 * validator.validate(''); // { valid: false, error: 'API Key cannot be empty' }
 */
export class NotEmptyValidator {
    /**
     * Next validator in the chain
     * @type {Validator|null}
     */
    next = null;

    /**
     * Validator name for error reporting
     * @type {string}
     */
    name = 'NotEmptyValidator';

    /**
     * Custom error message
     * @type {string}
     * @private
     */
    #errorMessage;

    /**
     * Creates a new NotEmptyValidator
     *
     * @param {string} [errorMessage='API Key cannot be empty'] - Custom error
     */
    constructor(errorMessage = 'API Key cannot be empty') {
        this.#errorMessage = errorMessage;
    }

    /**
     * Validates that the value is not empty
     *
     * @param {string} key - Value to validate
     * @returns {ValidationResult} Validation result
     */
    validate(key) {
        if (!key || key.trim() === '') {
            return {
                valid: false,
                error: this.#errorMessage,
                validatorName: this.name
            };
        }

        return this.next ? this.next.validate(key) : { valid: true };
    }
}

/**
 * Validates the API key length
 *
 * @class LengthValidator
 * @implements {Validator}
 *
 * @example
 * const validator = new LengthValidator(39);
 * validator.validate('abc'); // { valid: false, error: 'Incorrect length: 3 (must be 39)' }
 */
export class LengthValidator {
    /**
     * Next validator in the chain
     * @type {Validator|null}
     */
    next = null;

    /**
     * Validator name for error reporting
     * @type {string}
     */
    name = 'LengthValidator';

    /**
     * Expected length
     * @type {number}
     * @private
     */
    #expectedLength;

    /**
     * Whether to allow lengths within a range
     * @type {number|null}
     * @private
     */
    #minLength;

    /**
     * Maximum length (if range validation)
     * @type {number|null}
     * @private
     */
    #maxLength;

    /**
     * Creates a new LengthValidator
     *
     * @param {number} length - Expected exact length
     * @param {Object} [options={}] - Additional options
     * @param {number} [options.min] - Minimum length (overrides exact)
     * @param {number} [options.max] - Maximum length (overrides exact)
     */
    constructor(length = 39, options = {}) {
        if (options.min !== undefined || options.max !== undefined) {
            this.#minLength = options.min || 0;
            this.#maxLength = options.max || Infinity;
            this.#expectedLength = null;
        } else {
            this.#expectedLength = length;
            this.#minLength = null;
            this.#maxLength = null;
        }
    }

    /**
     * Validates the length of the value
     *
     * @param {string} key - Value to validate
     * @returns {ValidationResult} Validation result
     */
    validate(key) {
        const len = key.length;

        if (this.#expectedLength !== null) {
            // Exact length validation
            if (len !== this.#expectedLength) {
                return {
                    valid: false,
                    error: `Incorrect length: ${len} (must be ${this.#expectedLength})`,
                    validatorName: this.name,
                    context: { actual: len, expected: this.#expectedLength }
                };
            }
        } else {
            // Range validation
            if (len < this.#minLength || len > this.#maxLength) {
                return {
                    valid: false,
                    error: `Length ${len} out of range (${this.#minLength}-${this.#maxLength})`,
                    validatorName: this.name,
                    context: { actual: len, min: this.#minLength, max: this.#maxLength }
                };
            }
        }

        return this.next ? this.next.validate(key) : { valid: true };
    }
}

/**
 * Validates that the API key starts with a specific prefix
 *
 * @class PrefixValidator
 * @implements {Validator}
 *
 * @example
 * const validator = new PrefixValidator('AIza');
 * validator.validate('sk-...'); // { valid: false, error: 'Must start with "AIza"' }
 */
export class PrefixValidator {
    /**
     * Next validator in the chain
     * @type {Validator|null}
     */
    next = null;

    /**
     * Validator name for error reporting
     * @type {string}
     */
    name = 'PrefixValidator';

    /**
     * Required prefix
     * @type {string}
     * @private
     */
    #prefix;

    /**
     * Whether the check is case-sensitive
     * @type {boolean}
     * @private
     */
    #caseSensitive;

    /**
     * Creates a new PrefixValidator
     *
     * @param {string} prefix - Required prefix
     * @param {Object} [options={}] - Validation options
     * @param {boolean} [options.caseSensitive=true] - Case-sensitive comparison
     */
    constructor(prefix = 'AIza', options = {}) {
        this.#prefix = prefix;
        this.#caseSensitive = options.caseSensitive !== false;
    }

    /**
     * Validates that the value starts with the prefix
     *
     * @param {string} key - Value to validate
     * @returns {ValidationResult} Validation result
     */
    validate(key) {
        const keyToCheck = this.#caseSensitive ? key : key.toLowerCase();
        const prefixToCheck = this.#caseSensitive ? this.#prefix : this.#prefix.toLowerCase();

        if (!keyToCheck.startsWith(prefixToCheck)) {
            return {
                valid: false,
                error: `Must start with "${this.#prefix}"`,
                validatorName: this.name,
                context: { expectedPrefix: this.#prefix }
            };
        }

        return this.next ? this.next.validate(key) : { valid: true };
    }
}

/**
 * Validates the API key against a regular expression
 *
 * @class RegexValidator
 * @implements {Validator}
 *
 * @example
 * const validator = new RegexValidator(
 *     /^[A-Za-z0-9_-]+$/,
 *     'Contains invalid characters'
 * );
 */
export class RegexValidator {
    /**
     * Next validator in the chain
     * @type {Validator|null}
     */
    next = null;

    /**
     * Validator name for error reporting
     * @type {string}
     */
    name = 'RegexValidator';

    /**
     * Regular expression to match
     * @type {RegExp}
     * @private
     */
    #regex;

    /**
     * Error message for failed validation
     * @type {string}
     * @private
     */
    #errorMessage;

    /**
     * Creates a new RegexValidator
     *
     * @param {RegExp} regex - Pattern to match
     * @param {string} [errorMessage='Invalid format'] - Error message
     */
    constructor(regex, errorMessage = 'Invalid format') {
        if (!(regex instanceof RegExp)) {
            throw new TypeError('First argument must be a RegExp');
        }
        this.#regex = regex;
        this.#errorMessage = errorMessage;
    }

    /**
     * Validates the value against the regex
     *
     * @param {string} key - Value to validate
     * @returns {ValidationResult} Validation result
     */
    validate(key) {
        if (!this.#regex.test(key)) {
            return {
                valid: false,
                error: this.#errorMessage,
                validatorName: this.name,
                context: { pattern: this.#regex.toString() }
            };
        }

        return this.next ? this.next.validate(key) : { valid: true };
    }
}

/**
 * Validates API key character composition for strength assessment
 *
 * @class StrengthValidator
 * @implements {Validator}
 *
 * @example
 * const validator = new StrengthValidator();
 * const result = validator.validate('AIza...');
 * console.log(result.strength); // 'strong', 'medium', or 'weak'
 */
export class StrengthValidator {
    /**
     * Next validator in the chain
     * @type {Validator|null}
     */
    next = null;

    /**
     * Validator name for error reporting
     * @type {string}
     */
    name = 'StrengthValidator';

    /**
     * Minimum strength required (0-3)
     * @type {number}
     * @private
     */
    #minStrength;

    /**
     * Creates a new StrengthValidator
     *
     * @param {number} [minStrength=0] - Minimum required strength (0-3)
     */
    constructor(minStrength = 0) {
        this.#minStrength = minStrength;
    }

    /**
     * Calculates and validates key strength
     *
     * @param {string} key - Value to validate
     * @returns {ValidationResult} Validation result with strength property
     */
    validate(key) {
        const uniqueChars = new Set(key.split('')).size;
        const hasNumbers = /\d/.test(key);
        const hasUpperCase = /[A-Z]/.test(key);
        const hasLowerCase = /[a-z]/.test(key);
        const hasSpecial = /[_-]/.test(key);

        let strength = 0;
        if (uniqueChars >= 20) strength++;
        if (hasNumbers && hasUpperCase && hasLowerCase) strength++;
        if (hasSpecial) strength++;

        const strengthLabel = strength >= 3 ? 'strong' : (strength >= 2 ? 'medium' : 'weak');

        if (strength < this.#minStrength) {
            return {
                valid: false,
                error: `Key strength too weak (${strengthLabel})`,
                validatorName: this.name,
                strength: strengthLabel,
                context: { strengthScore: strength, required: this.#minStrength }
            };
        }

        const result = { valid: true, strength: strengthLabel };

        if (this.next) {
            const nextResult = this.next.validate(key);
            return { ...nextResult, strength: strengthLabel };
        }

        return result;
    }
}

// ============================================================================
// FACTORY FUNCTIONS FOR COMMON CONFIGURATIONS
// ============================================================================

/**
 * Creates a validator chain for Google Gemini API keys
 *
 * @returns {ApiKeyValidatorChain} Configured validator chain
 *
 * @example
 * const geminiValidator = createGeminiValidator();
 * const result = geminiValidator.validate(apiKey);
 */
export function createGeminiValidator() {
    return new ApiKeyValidatorChain('GeminiAPIKey')
        .addValidator(new NotEmptyValidator('La API Key no puede estar vacia'))
        .addValidator(new LengthValidator(39))
        .addValidator(new PrefixValidator('AIza'))
        .addValidator(new RegexValidator(
            /^[A-Za-z0-9_-]+$/,
            'Formato invalido. Contiene caracteres no permitidos'
        ))
        .addValidator(new StrengthValidator(0));
}

/**
 * Creates a validator chain for OpenAI API keys
 *
 * @returns {ApiKeyValidatorChain} Configured validator chain
 *
 * @example
 * const openAIValidator = createOpenAIValidator();
 */
export function createOpenAIValidator() {
    return new ApiKeyValidatorChain('OpenAIAPIKey')
        .addValidator(new NotEmptyValidator('API Key cannot be empty'))
        .addValidator(new PrefixValidator('sk-'));
}

/**
 * Creates a validator chain for Anthropic API keys
 *
 * @returns {ApiKeyValidatorChain} Configured validator chain
 *
 * @example
 * const anthropicValidator = createAnthropicValidator();
 */
export function createAnthropicValidator() {
    return new ApiKeyValidatorChain('AnthropicAPIKey')
        .addValidator(new NotEmptyValidator('API Key cannot be empty'))
        .addValidator(new PrefixValidator('sk-ant-'));
}

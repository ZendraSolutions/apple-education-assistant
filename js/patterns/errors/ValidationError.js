/**
 * @fileoverview Error class for validation failures
 * @module patterns/errors/ValidationError
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 */

/**
 * Error thrown when validation fails in the validator chain.
 * Contains detailed information about which validator failed and why.
 *
 * @class ValidationError
 * @extends Error
 *
 * @example
 * const result = validatorChain.validate(apiKey);
 * if (!result.valid) {
 *     throw new ValidationError(result.error, result.validatorName);
 * }
 */
export class ValidationError extends Error {
    /**
     * The name of the validator that failed
     * @type {string|null}
     */
    validatorName;

    /**
     * The value that failed validation
     * @type {*}
     */
    invalidValue;

    /**
     * Additional context about the validation failure
     * @type {Object}
     */
    context;

    /**
     * Creates a new ValidationError
     *
     * @param {string} message - Description of the validation failure
     * @param {string} [validatorName=null] - Name of the validator that failed
     * @param {*} [invalidValue=null] - The value that failed validation
     * @param {Object} [context={}] - Additional context information
     */
    constructor(message, validatorName = null, invalidValue = null, context = {}) {
        super(message);
        this.name = 'ValidationError';
        this.validatorName = validatorName;
        this.invalidValue = invalidValue;
        this.context = context;

        // Maintains proper stack trace in V8 environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }

    /**
     * Creates a ValidationError from a ValidationResult object
     *
     * @param {import('../ValidatorChain.js').ValidationResult} result - Validation result
     * @param {*} [value=null] - The value that was validated
     * @returns {ValidationError} A new ValidationError instance
     * @static
     */
    static fromResult(result, value = null) {
        return new ValidationError(
            result.error || 'Validation failed',
            result.validatorName || null,
            value,
            result.context || {}
        );
    }
}

/**
 * @fileoverview Tests for ValidatorChain - Chain of Responsibility Pattern
 * @module __tests__/patterns/ValidatorChain.test
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import {
    ApiKeyValidatorChain,
    NotEmptyValidator,
    LengthValidator,
    PrefixValidator,
    RegexValidator,
    StrengthValidator,
    createGeminiValidator
} from '../../js/patterns/ValidatorChain.js';

describe('ApiKeyValidatorChain', () => {
    let chain;

    beforeEach(() => {
        chain = new ApiKeyValidatorChain();
    });

    describe('constructor', () => {
        it('should create a new validator chain', () => {
            expect(chain).toBeInstanceOf(ApiKeyValidatorChain);
        });

        it('should accept a custom name', () => {
            const namedChain = new ApiKeyValidatorChain('CustomChain');
            expect(namedChain.name).toBe('CustomChain');
        });

        it('should start with size 0', () => {
            expect(chain.size).toBe(0);
        });
    });

    describe('addValidator', () => {
        it('should add a validator to the chain', () => {
            chain.addValidator(new NotEmptyValidator());
            expect(chain.size).toBe(1);
        });

        it('should allow method chaining', () => {
            const result = chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new LengthValidator(39));
            expect(result).toBe(chain);
            expect(chain.size).toBe(2);
        });

        it('should add multiple validators in order', () => {
            chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new LengthValidator(39))
                .addValidator(new PrefixValidator('AIza'));
            expect(chain.size).toBe(3);
        });

        it('should throw TypeError if validator lacks validate method', () => {
            expect(() => {
                chain.addValidator({ invalid: true });
            }).toThrow(TypeError);
        });

        it('should throw TypeError if validator is null', () => {
            expect(() => {
                chain.addValidator(null);
            }).toThrow(TypeError);
        });
    });

    describe('prependValidator', () => {
        it('should add validator to the beginning of chain', () => {
            chain.addValidator(new LengthValidator(39));
            chain.prependValidator(new NotEmptyValidator());
            expect(chain.size).toBe(2);
        });

        it('should validate prepended validator first', () => {
            chain.addValidator(new LengthValidator(39));
            chain.prependValidator(new NotEmptyValidator());
            const result = chain.validate('');
            expect(result.valid).toBe(false);
            expect(result.validatorName).toBe('NotEmptyValidator');
        });

        it('should allow method chaining', () => {
            const result = chain.prependValidator(new NotEmptyValidator());
            expect(result).toBe(chain);
        });

        it('should throw TypeError if validator lacks validate method', () => {
            expect(() => {
                chain.prependValidator({});
            }).toThrow(TypeError);
        });
    });

    describe('validate', () => {
        it('should return valid for empty chain', () => {
            const result = chain.validate('anything');
            expect(result.valid).toBe(true);
        });

        it('should execute validators in sequence', () => {
            chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new LengthValidator(39));

            const result = chain.validate('');
            expect(result.valid).toBe(false);
            expect(result.validatorName).toBe('NotEmptyValidator');
        });

        it('should stop at first failed validator', () => {
            chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new LengthValidator(39))
                .addValidator(new PrefixValidator('AIza'));

            const result = chain.validate('short');
            expect(result.valid).toBe(false);
            expect(result.validatorName).toBe('LengthValidator');
        });

        it('should return valid if all validators pass', () => {
            chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new LengthValidator(5));

            const result = chain.validate('hello');
            expect(result.valid).toBe(true);
        });
    });

    describe('validateAll', () => {
        it('should collect all errors', () => {
            chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new LengthValidator(39))
                .addValidator(new PrefixValidator('AIza'));

            const result = chain.validateAll('');
            expect(result.valid).toBe(false);
            expect(result.errors).toHaveLength(3);
        });

        it('should return valid if all validators pass', () => {
            chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new PrefixValidator('AI'));

            const result = chain.validateAll('AIzaSyTest');
            expect(result.valid).toBe(true);
        });
    });

    describe('clear', () => {
        it('should remove all validators', () => {
            chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new LengthValidator(39));
            chain.clear();
            expect(chain.size).toBe(0);
        });

        it('should allow adding validators after clear', () => {
            chain.addValidator(new NotEmptyValidator());
            chain.clear();
            chain.addValidator(new LengthValidator(39));
            expect(chain.size).toBe(1);
        });
    });

    describe('clone', () => {
        it('should create a copy of the chain', () => {
            chain
                .addValidator(new NotEmptyValidator())
                .addValidator(new LengthValidator(39));
            const cloned = chain.clone();
            expect(cloned).toBeInstanceOf(ApiKeyValidatorChain);
            expect(cloned.size).toBe(chain.size);
        });

        it('should create independent copy', () => {
            chain.addValidator(new NotEmptyValidator());
            const cloned = chain.clone();
            cloned.addValidator(new LengthValidator(39));
            expect(chain.size).toBe(1);
            expect(cloned.size).toBe(2);
        });
    });
});

describe('NotEmptyValidator', () => {
    let validator;

    beforeEach(() => {
        validator = new NotEmptyValidator();
    });

    it('should reject empty string', () => {
        const result = validator.validate('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('API Key cannot be empty');
    });

    it('should reject whitespace-only string', () => {
        const result = validator.validate('   ');
        expect(result.valid).toBe(false);
    });

    it('should accept non-empty string', () => {
        const result = validator.validate('test');
        expect(result.valid).toBe(true);
    });

    it('should accept custom error message', () => {
        const custom = new NotEmptyValidator('Custom error');
        const result = custom.validate('');
        expect(result.error).toBe('Custom error');
    });

    it('should include validator name in result', () => {
        const result = validator.validate('');
        expect(result.validatorName).toBe('NotEmptyValidator');
    });
});

describe('LengthValidator', () => {
    it('should validate exact length', () => {
        const validator = new LengthValidator(5);
        expect(validator.validate('hello').valid).toBe(true);
        expect(validator.validate('hi').valid).toBe(false);
    });

    it('should default to length 39', () => {
        const validator = new LengthValidator();
        const result = validator.validate('short');
        expect(result.valid).toBe(false);
        expect(result.context.expected).toBe(39);
    });

    it('should provide context with actual and expected length', () => {
        const validator = new LengthValidator(10);
        const result = validator.validate('short');
        expect(result.context.actual).toBe(5);
        expect(result.context.expected).toBe(10);
    });

    it('should validate range when min/max provided', () => {
        const validator = new LengthValidator(null, { min: 5, max: 10 });
        expect(validator.validate('hello').valid).toBe(true);
        expect(validator.validate('hi').valid).toBe(false);
        expect(validator.validate('this is too long').valid).toBe(false);
    });

    it('should include validator name in result', () => {
        const validator = new LengthValidator(5);
        const result = validator.validate('hi');
        expect(result.validatorName).toBe('LengthValidator');
    });
});

describe('PrefixValidator', () => {
    it('should validate prefix', () => {
        const validator = new PrefixValidator('AIza');
        expect(validator.validate('AIzaSyTest').valid).toBe(true);
        expect(validator.validate('xyz').valid).toBe(false);
    });

    it('should be case-sensitive by default', () => {
        const validator = new PrefixValidator('AIza');
        expect(validator.validate('aiza').valid).toBe(false);
    });

    it('should support case-insensitive mode', () => {
        const validator = new PrefixValidator('AIza', { caseSensitive: false });
        expect(validator.validate('aiza').valid).toBe(true);
        expect(validator.validate('AIZA').valid).toBe(true);
    });

    it('should include expected prefix in error context', () => {
        const validator = new PrefixValidator('AIza');
        const result = validator.validate('xyz');
        expect(result.context.expectedPrefix).toBe('AIza');
    });

    it('should include validator name in result', () => {
        const validator = new PrefixValidator('AIza');
        const result = validator.validate('xyz');
        expect(result.validatorName).toBe('PrefixValidator');
    });
});

describe('RegexValidator', () => {
    it('should validate against regex pattern', () => {
        const validator = new RegexValidator(/^[A-Za-z0-9_-]+$/);
        expect(validator.validate('AIzaSy-Test_123').valid).toBe(true);
        expect(validator.validate('invalid!@#').valid).toBe(false);
    });

    it('should use custom error message', () => {
        const validator = new RegexValidator(/^\d+$/, 'Must be numbers only');
        const result = validator.validate('abc');
        expect(result.error).toBe('Must be numbers only');
    });

    it('should include pattern in error context', () => {
        const pattern = /^[A-Z]+$/;
        const validator = new RegexValidator(pattern);
        const result = validator.validate('abc');
        expect(result.context.pattern).toBe(pattern.toString());
    });

    it('should throw TypeError if not given a RegExp', () => {
        expect(() => {
            new RegexValidator('not-a-regex');
        }).toThrow(TypeError);
    });

    it('should include validator name in result', () => {
        const validator = new RegexValidator(/test/);
        const result = validator.validate('fail');
        expect(result.validatorName).toBe('RegexValidator');
    });
});

describe('StrengthValidator', () => {
    it('should calculate strength based on character diversity', () => {
        const validator = new StrengthValidator(0);
        const result = validator.validate('AIzaSyTest-123_AbCdEfGhIjKlMnOp');
        expect(result.valid).toBe(true);
        expect(result.strength).toBeDefined();
    });

    it('should reject weak keys if minStrength is set', () => {
        const validator = new StrengthValidator(3);
        const result = validator.validate('weak');
        expect(result.valid).toBe(false);
    });

    it('should classify strength as weak/medium/strong', () => {
        const validator = new StrengthValidator(0);
        const strongResult = validator.validate('AIzaSy-Test_123AbCdEfGhIjKlMnOp');
        expect(['weak', 'medium', 'strong']).toContain(strongResult.strength);
    });

    it('should include strength in result', () => {
        const validator = new StrengthValidator(0);
        const result = validator.validate('test123');
        expect(result.strength).toBeDefined();
    });

    it('should include validator name in result', () => {
        const validator = new StrengthValidator(2);
        const result = validator.validate('weak');
        expect(result.validatorName).toBe('StrengthValidator');
    });
});

describe('createGeminiValidator', () => {
    it('should create a complete Gemini API key validator', () => {
        const validator = createGeminiValidator();
        expect(validator).toBeInstanceOf(ApiKeyValidatorChain);
        expect(validator.size).toBeGreaterThan(0);
    });

    it('should reject empty key', () => {
        const validator = createGeminiValidator();
        const result = validator.validate('');
        expect(result.valid).toBe(false);
    });

    it('should reject wrong length', () => {
        const validator = createGeminiValidator();
        const result = validator.validate('AIzaShort');
        expect(result.valid).toBe(false);
    });

    it('should reject wrong prefix', () => {
        const validator = createGeminiValidator();
        const result = validator.validate('WrongPrefixWith39CharactersTotal12345');
        expect(result.valid).toBe(false);
    });

    it('should reject invalid characters', () => {
        const validator = createGeminiValidator();
        const result = validator.validate('AIza!@#$%^&*()12345678901234567890123');
        expect(result.valid).toBe(false);
    });

    it('should accept valid Gemini API key format', () => {
        const validator = createGeminiValidator();
        const result = validator.validate('AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI');
        expect(result.valid).toBe(true);
    });
});

describe('Validator Chain Integration', () => {
    it('should link validators and execute in sequence', () => {
        const chain = new ApiKeyValidatorChain()
            .addValidator(new NotEmptyValidator())
            .addValidator(new LengthValidator(10))
            .addValidator(new PrefixValidator('TEST'));

        // Empty - fails first validator
        let result = chain.validate('');
        expect(result.valid).toBe(false);
        expect(result.validatorName).toBe('NotEmptyValidator');

        // Wrong length - fails second validator
        result = chain.validate('TEST');
        expect(result.valid).toBe(false);
        expect(result.validatorName).toBe('LengthValidator');

        // Wrong prefix - fails third validator
        result = chain.validate('WRONG12345');
        expect(result.valid).toBe(false);
        expect(result.validatorName).toBe('PrefixValidator');

        // Valid - passes all
        result = chain.validate('TEST123456');
        expect(result.valid).toBe(true);
    });

    it('should pass data through entire chain on success', () => {
        const chain = new ApiKeyValidatorChain()
            .addValidator(new NotEmptyValidator())
            .addValidator(new LengthValidator(5))
            .addValidator(new StrengthValidator(0));

        const result = chain.validate('Test1');
        expect(result.valid).toBe(true);
        expect(result.strength).toBeDefined();
    });
});

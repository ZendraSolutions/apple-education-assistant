/**
 * @fileoverview Design Patterns Module - Re-exports all patterns
 * @module patterns
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Central export point for all design patterns implemented in this module.
 * Includes Registry, Chain of Responsibility, and Strategy patterns.
 *
 * These patterns eliminate the need for switch statements and enable
 * the Open/Closed Principle - new functionality can be added without
 * modifying existing code.
 *
 * @example
 * // Import everything
 * import * as patterns from './patterns/index.js';
 *
 * // Or import specific items
 * import { sectionRegistry, SectionRegistry } from './patterns/index.js';
 * import { ApiKeyValidatorChain, NotEmptyValidator } from './patterns/index.js';
 * import { TemplateRenderStrategy, RenderContext } from './patterns/index.js';
 */

// ============================================================================
// ERROR CLASSES
// ============================================================================

export { DuplicateSectionError } from './errors/DuplicateSectionError.js';
export { ValidationError } from './errors/ValidationError.js';
export { SectionNotFoundError } from './errors/SectionNotFoundError.js';

// ============================================================================
// REGISTRY PATTERN - Section/View Management
// ============================================================================

export {
    SectionRegistry,
    sectionRegistry
} from './SectionRegistry.js';

// ============================================================================
// CHAIN OF RESPONSIBILITY - Validation
// ============================================================================

export {
    // Main chain class
    ApiKeyValidatorChain,

    // Concrete validators
    NotEmptyValidator,
    LengthValidator,
    PrefixValidator,
    RegexValidator,
    StrengthValidator,

    // Factory functions for common configurations
    createGeminiValidator,
    createOpenAIValidator,
    createAnthropicValidator
} from './ValidatorChain.js';

// ============================================================================
// STRATEGY PATTERN - Rendering
// ============================================================================

export {
    // Base class
    RenderStrategy,

    // Concrete strategies
    TemplateRenderStrategy,
    ComponentRenderStrategy,
    FragmentRenderStrategy,
    DiffRenderStrategy,

    // Context manager
    RenderContext
} from './RenderStrategy.js';

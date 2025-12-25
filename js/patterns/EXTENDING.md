# Design Patterns - Extension Guide

This document explains how to extend the Jamf Assistant application using the implemented design patterns without modifying existing code (Open/Closed Principle).

## Table of Contents

1. [Adding a New Section/View](#adding-a-new-sectionview)
2. [Adding a New API Key Validator](#adding-a-new-api-key-validator)
3. [Supporting a New API Provider](#supporting-a-new-api-provider)
4. [Custom Render Strategies](#custom-render-strategies)

---

## Adding a New Section/View

The SectionRegistry pattern allows you to add new sections to the application by creating a single file - no modification to `app.js` required.

### Step-by-Step Guide

1. **Create your view file** in `js/views/`:

```javascript
// js/views/MyNewView.js

import { BaseView } from './BaseView.js';
import { sectionRegistry } from '../patterns/SectionRegistry.js';

/**
 * My custom view for a new section
 */
export class MyNewView extends BaseView {
    render() {
        return this.wrapSection(`
            ${this.renderSectionHeader('My New Section', 'Description here')}
            <div class="guide-cards">
                <!-- Your content here -->
            </div>
        `);
    }
}

// SELF-REGISTRATION - This is the key!
// The view registers itself when the module is imported
sectionRegistry.register('my-section', (deps) => new MyNewView(deps), {
    displayName: 'My Section',
    icon: 'ri-star-line',
    order: 10
});
```

2. **Import your view in `app.js`** (only add one line):

```javascript
// At the top with other view imports
import './views/MyNewView.js';
```

3. **Add navigation item in HTML** (optional):

```html
<div class="nav-item" data-section="my-section">
    <i class="ri-star-line"></i>
    <span>My Section</span>
</div>
```

That's it! No switches to modify, no view objects to update.

### Registry Metadata Options

```javascript
sectionRegistry.register('section-name', factory, {
    displayName: 'Human Readable Name',  // For UI display
    icon: 'ri-icon-class',               // Remix Icon class
    order: 10,                           // Sort order in navigation
    hidden: false                        // Hide from auto-generated nav
});
```

---

## Adding a New API Key Validator

The ValidatorChain uses the Chain of Responsibility pattern. Add validators without modifying existing validation logic.

### Option 1: Add to Existing Chain

```javascript
import { sectionRegistry } from './patterns/SectionRegistry.js';
import { ApiKeyManager } from './chatbot/ApiKeyManager.js';

// Get the manager instance
const manager = new ApiKeyManager();

// Add a custom validator to the existing chain
manager.validatorChain.addValidator(new MyCustomValidator());
```

### Option 2: Create a Custom Validator

```javascript
// js/validators/BlacklistValidator.js

/**
 * Validator that checks against a blacklist of compromised keys
 */
export class BlacklistValidator {
    next = null;
    name = 'BlacklistValidator';

    #blacklist = new Set(['known-bad-key-1', 'known-bad-key-2']);

    validate(key) {
        if (this.#blacklist.has(key)) {
            return {
                valid: false,
                error: 'This API key has been compromised',
                validatorName: this.name
            };
        }

        // Pass to next validator in chain
        return this.next ? this.next.validate(key) : { valid: true };
    }
}
```

### Option 3: Prepend Critical Validators

```javascript
// Add validator at the START of the chain (runs first)
manager.validatorChain.prependValidator(new CriticalSecurityValidator());
```

---

## Supporting a New API Provider

To support a different AI provider (OpenAI, Anthropic, etc.), create a new validator chain:

### Step 1: Create Factory Function

```javascript
// js/patterns/ValidatorChain.js - Add this function

export function createHuggingFaceValidator() {
    return new ApiKeyValidatorChain('HuggingFaceAPIKey')
        .addValidator(new NotEmptyValidator('Token cannot be empty'))
        .addValidator(new PrefixValidator('hf_'))
        .addValidator(new LengthValidator(37, { min: 30, max: 50 }));
}
```

### Step 2: Inject into ApiKeyManager

```javascript
import { createHuggingFaceValidator } from '../patterns/ValidatorChain.js';

// Create manager with custom validator
const manager = new ApiKeyManager(
    new EncryptionService(),
    createHuggingFaceValidator()
);

// Or switch at runtime
manager.setValidatorChain(createHuggingFaceValidator());
```

### Pre-built Validators Available

- `createGeminiValidator()` - Google Gemini (AIza...)
- `createOpenAIValidator()` - OpenAI (sk-...)
- `createAnthropicValidator()` - Anthropic (sk-ant-...)

---

## Custom Render Strategies

The RenderStrategy pattern allows different rendering approaches for views.

### Available Strategies

```javascript
import {
    TemplateRenderStrategy,
    ComponentRenderStrategy,
    FragmentRenderStrategy,
    DiffRenderStrategy,
    RenderContext
} from '../patterns/RenderStrategy.js';
```

### Example: Template Strategy

```javascript
const template = (data) => `
    <div class="card">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
    </div>
`;

const strategy = new TemplateRenderStrategy(template, {
    sanitize: true  // Uses DOMPurify
});

strategy.render(container, { title: 'Hello', description: 'World' });
```

### Example: Using RenderContext

```javascript
const context = new RenderContext();

// Use template rendering
context.setStrategy(new TemplateRenderStrategy(myTemplate));
context.render(container, data);

// Switch to diff-based rendering for updates
context.setStrategy(new DiffRenderStrategy(myTemplate));
context.render(container, newData);  // Only updates changed parts
```

---

## Summary: Open/Closed Principle in Action

| Task | Old Way (Violates OCP) | New Way (Follows OCP) |
|------|------------------------|----------------------|
| Add new section | Modify switch in app.js | Create new file with self-registration |
| Add new validator | Modify if/else in validateFormat() | Add validator to chain |
| Support new API | Modify regex and conditionals | Create new validator chain |
| Change rendering | Modify render methods | Inject new RenderStrategy |

All extensions are additive - you add code without modifying existing code.

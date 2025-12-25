# Contributing Guide

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [How to Add Features](#how-to-add-features)
  - [Adding a New Section/View](#adding-a-new-sectionview)
  - [Adding a New Service](#adding-a-new-service)
  - [Adding a New Validator](#adding-a-new-validator)
  - [Adding a New Event](#adding-a-new-event)
- [Coding Standards](#coding-standards)
- [JSDoc Standards](#jsdoc-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Architecture Principles](#architecture-principles)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - JavaScript (ES6) code snippets
  - Path Intellisense
- **Git**: For version control
- **Node.js** (optional): For running development tools

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd app-papa
   ```

2. **Open in browser**:
   - Simply open `index.html` in your browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js http-server
     npx http-server -p 8000
     ```

3. **Verify setup**:
   - Open browser console (F12)
   - Look for `[Main] Application initialized successfully`
   - Check for any errors

---

## Project Structure

```
app-papa/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── main.js             # Entry point (START HERE)
│   ├── app.js              # Application orchestrator
│   ├── core/               # Foundation services
│   │   ├── Container.js    # IoC container
│   │   ├── bootstrap.js    # Service registration
│   │   └── ...
│   ├── features/           # Business logic
│   │   ├── SearchEngine.js
│   │   └── ...
│   ├── views/              # UI components
│   │   ├── BaseView.js
│   │   └── ...
│   ├── chatbot/            # AI assistant
│   │   └── ...
│   ├── patterns/           # Design patterns
│   │   └── ...
│   ├── data/               # Knowledge base
│   │   └── ...
│   ├── utils/              # Utilities
│   │   └── EventBus.js
│   └── ui/                 # UI components
│       └── ...
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # Architecture details
│   ├── API.md              # API reference
│   └── CONTRIBUTING.md     # This file
└── README.md               # Project overview
```

### Key Files to Know

- **`js/main.js`**: Application entry point - composition root
- **`js/core/bootstrap.js`**: Service registration configuration
- **`js/app.js`**: Main application orchestrator
- **`js/core/Container.js`**: IoC container implementation
- **`js/utils/EventBus.js`**: Event system
- **`js/patterns/SectionRegistry.js`**: View registry

---

## Development Workflow

### 1. Understanding the Flow

```
main.js (creates container)
    ↓
bootstrap.js (registers services)
    ↓
app.js (resolves services, orchestrates)
    ↓
Views (self-register with SectionRegistry)
    ↓
User interaction
    ↓
Events emitted
    ↓
Services react
    ↓
Views re-render
```

### 2. Making Changes

1. **Find the right place**:
   - UI/Rendering → `js/views/`
   - Business logic → `js/features/`
   - Infrastructure → `js/core/`
   - Data → `js/data/`

2. **Follow SOLID principles**:
   - One responsibility per module
   - Extend, don't modify
   - Use dependency injection
   - Program to interfaces

3. **Test your changes**:
   - Open browser console
   - Check for errors
   - Test user interactions
   - Verify events are emitted

4. **Document your code**:
   - Add JSDoc comments
   - Update relevant documentation
   - Add inline comments for complex logic

---

## How to Add Features

### Adding a New Section/View

**Example**: Adding a "Reports" section

#### Step 1: Create the View Class

Create `js/views/ReportsView.js`:

```javascript
/**
 * @fileoverview Reports section view
 * @module views/ReportsView
 */

import { BaseView } from './BaseView.js';
import { sectionRegistry } from '../patterns/SectionRegistry.js';

/**
 * Reports view - displays usage reports and analytics
 * @extends BaseView
 */
export class ReportsView extends BaseView {
    /**
     * Renders the reports section
     * @returns {string} HTML content
     */
    render() {
        return this.wrapSection(`
            ${this.renderSectionHeader('Reports', 'View usage analytics and reports')}

            <div class="content-grid">
                <div class="card">
                    <h3>Usage Statistics</h3>
                    <p>View device usage statistics</p>
                </div>
                <div class="card">
                    <h3>User Reports</h3>
                    <p>Generate user activity reports</p>
                </div>
            </div>
        `);
    }
}

// Self-register with the SectionRegistry
sectionRegistry.register('reports', (deps) => new ReportsView(deps), {
    displayName: 'Reports',
    icon: 'ri-bar-chart-line',
    order: 10  // Display order in navigation
});
```

#### Step 2: Import in main.js

Add to `js/main.js`:

```javascript
// In the imports section
import './views/ReportsView.js';
```

#### Step 3: Add Navigation Item

Add to `index.html`:

```html
<li class="nav-item" data-section="reports">
    <i class="ri-bar-chart-line"></i>
    <span class="nav-text">Reports</span>
</li>
```

#### Step 4: Test

1. Open browser
2. Click "Reports" in sidebar
3. Verify view renders correctly
4. Check browser console for errors

**That's it!** The view is now integrated. No changes to app.js needed thanks to the Registry Pattern.

---

### Adding a New Service

**Example**: Adding a "ReportGenerator" service

#### Step 1: Create the Service Class

Create `js/features/ReportGenerator.js`:

```javascript
/**
 * @fileoverview Report generation service
 * @module features/ReportGenerator
 */

/**
 * @typedef {Object} ReportGeneratorDependencies
 * @property {import('../utils/EventBus.js').EventBus} eventBus
 * @property {import('../core/StateManager.js').StateManager} stateManager
 */

/**
 * Generates usage reports and analytics
 * @class ReportGenerator
 */
export class ReportGenerator {
    /** @private @type {import('../utils/EventBus.js').EventBus} */
    #eventBus;

    /** @private @type {import('../core/StateManager.js').StateManager} */
    #stateManager;

    /**
     * Creates a new ReportGenerator
     * @param {ReportGeneratorDependencies} dependencies
     */
    constructor({ eventBus, stateManager }) {
        this.#eventBus = eventBus;
        this.#stateManager = stateManager;
    }

    /**
     * Initializes the report generator
     */
    init() {
        // Setup event listeners if needed
        this.#eventBus.on('report:generate', (data) => {
            this.generateReport(data.type);
        });
    }

    /**
     * Generates a report
     * @param {string} type - Report type
     * @returns {Object} Report data
     */
    generateReport(type) {
        // Implementation here
        const data = this.#collectData(type);
        this.#eventBus.emit('report:generated', { type, data });
        return data;
    }

    /**
     * Collects data for report
     * @private
     * @param {string} type
     * @returns {Object}
     */
    #collectData(type) {
        // Implementation
        return {};
    }
}
```

#### Step 2: Register in bootstrap.js

Add to `js/core/bootstrap.js`:

```javascript
// In imports
import { ReportGenerator } from '../features/ReportGenerator.js';

// In createContainer function, under FEATURES section
container.register('reportGenerator', ReportGenerator, {
    lifecycle: 'singleton',
    dependencies: ['eventBus', 'stateManager']
});
```

#### Step 3: Update SERVICE_REGISTRY

Add to the `SERVICE_REGISTRY` object in `bootstrap.js`:

```javascript
reportGenerator: {
    class: 'ReportGenerator',
    lifecycle: 'singleton',
    dependencies: ['eventBus', 'stateManager'],
    description: 'Generates usage reports and analytics'
}
```

#### Step 4: Use in Your Code

```javascript
// In app.js or any other module
const reportGenerator = this.container.resolve('reportGenerator');
reportGenerator.init();

// Or use via events
this.eventBus.emit('report:generate', { type: 'usage' });
```

---

### Adding a New Validator

**Example**: Adding an email validator to ValidatorChain

#### Step 1: Create the Validator

Add to `js/patterns/ValidatorChain.js`:

```javascript
/**
 * Validates email format
 * @class EmailValidator
 * @implements {Validator}
 */
export class EmailValidator {
    /** @type {Validator|null} */
    next = null;

    /** @type {string} */
    name = 'EmailValidator';

    /** @private @type {string} */
    #errorMessage;

    /**
     * Creates a new EmailValidator
     * @param {string} [errorMessage='Invalid email format']
     */
    constructor(errorMessage = 'Invalid email format') {
        this.#errorMessage = errorMessage;
    }

    /**
     * Validates email format
     * @param {string} email - Email to validate
     * @returns {ValidationResult}
     */
    validate(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return {
                valid: false,
                error: this.#errorMessage,
                validatorName: this.name
            };
        }

        return this.next ? this.next.validate(email) : { valid: true };
    }
}
```

#### Step 2: Create a Factory (Optional)

```javascript
/**
 * Creates an email validator chain
 * @returns {ApiKeyValidatorChain}
 */
export function createEmailValidator() {
    return new ApiKeyValidatorChain('EmailValidator')
        .addValidator(new NotEmptyValidator('Email cannot be empty'))
        .addValidator(new EmailValidator())
        .addValidator(new RegexValidator(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Email format is invalid'
        ));
}
```

#### Step 3: Use It

```javascript
import { createEmailValidator } from './patterns/ValidatorChain.js';

const emailValidator = createEmailValidator();
const result = emailValidator.validate('user@example.com');

if (!result.valid) {
    console.error(result.error);
}
```

---

### Adding a New Event

**Example**: Adding a "report:generated" event

#### Step 1: Define in EventBus

Add to `js/utils/EventBus.js` in the `AppEvents` constant:

```javascript
export const AppEvents = {
    // ... existing events ...

    // Reports events
    REPORT_GENERATED: 'report:generated',
    REPORT_EXPORTED: 'report:exported',
    REPORT_ERROR: 'report:error'
};
```

#### Step 2: Emit the Event

In your service:

```javascript
import { AppEvents } from '../utils/EventBus.js';

class ReportGenerator {
    generateReport(type) {
        const data = this.#collectData(type);

        // Emit event
        this.#eventBus.emit(AppEvents.REPORT_GENERATED, {
            type,
            data,
            timestamp: Date.now()
        });

        return data;
    }
}
```

#### Step 3: Listen to the Event

In any module:

```javascript
import { AppEvents } from '../utils/EventBus.js';

eventBus.on(AppEvents.REPORT_GENERATED, ({ type, data, timestamp }) => {
    console.log(`Report ${type} generated at ${new Date(timestamp)}`);
    // Handle the event
});
```

---

## Coding Standards

### JavaScript Style Guide

#### 1. Use ES6+ Features

```javascript
// ✅ Good
const items = [...array];
const { name, age } = user;
const filtered = items.filter(item => item.active);

// ❌ Bad
var items = array.slice();
var name = user.name;
var age = user.age;
```

#### 2. Use Private Fields

```javascript
// ✅ Good
class Service {
    #privateField;

    constructor() {
        this.#privateField = 'private';
    }
}

// ❌ Bad
class Service {
    constructor() {
        this._privateField = 'private'; // Convention, not enforced
    }
}
```

#### 3. Prefer Const Over Let

```javascript
// ✅ Good
const MAX_ITEMS = 10;
const items = [];

// ❌ Bad (unless reassignment needed)
let MAX_ITEMS = 10;
let items = [];
```

#### 4. Use Descriptive Names

```javascript
// ✅ Good
const isUserAuthenticated = checkAuth(user);
const customerList = fetchCustomers();

// ❌ Bad
const flag = checkAuth(user);
const list = fetchCustomers();
```

#### 5. Avoid Magic Numbers

```javascript
// ✅ Good
const RATE_LIMIT_CALLS = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

const limiter = new RateLimiter(RATE_LIMIT_CALLS, RATE_LIMIT_WINDOW);

// ❌ Bad
const limiter = new RateLimiter(10, 60000);
```

#### 6. Use Template Literals

```javascript
// ✅ Good
const message = `User ${name} logged in at ${time}`;

// ❌ Bad
const message = 'User ' + name + ' logged in at ' + time;
```

#### 7. Error Handling

```javascript
// ✅ Good
try {
    const result = await riskyOperation();
    return result;
} catch (error) {
    console.error('[ModuleName] Error:', error);
    throw new CustomError('Operation failed', { cause: error });
}

// ❌ Bad
try {
    return await riskyOperation();
} catch (e) {
    console.log(e);
}
```

---

## JSDoc Standards

### Module-Level Documentation

Every file should start with a JSDoc fileoverview:

```javascript
/**
 * @fileoverview Brief description of the module
 * @module path/to/Module
 * @version 1.0.0
 * @author Your Name
 * @license MIT
 *
 * @description
 * Detailed description of what this module does,
 * its purpose, and how it fits into the architecture.
 *
 * @example
 * // Usage example
 * import { MyModule } from './path/to/Module.js';
 * const instance = new MyModule();
 */
```

### Class Documentation

```javascript
/**
 * Brief class description
 *
 * @class ClassName
 *
 * @example
 * const instance = new ClassName({ dependency });
 * instance.doSomething();
 */
export class ClassName {
    // ...
}
```

### Constructor Documentation

```javascript
/**
 * Creates a new ClassName instance
 *
 * @param {Object} dependencies - Injected dependencies
 * @param {EventBus} dependencies.eventBus - Event bus instance
 * @param {StateManager} dependencies.stateManager - State manager
 * @throws {TypeError} If required dependencies are missing
 *
 * @example
 * const instance = new ClassName({ eventBus, stateManager });
 */
constructor({ eventBus, stateManager }) {
    // ...
}
```

### Method Documentation

```javascript
/**
 * Method description
 *
 * @param {string} param1 - Parameter description
 * @param {number} [param2=0] - Optional parameter with default
 * @returns {Promise<Object>} Description of return value
 * @throws {Error} When something goes wrong
 *
 * @example
 * const result = await instance.methodName('value', 10);
 */
async methodName(param1, param2 = 0) {
    // ...
}
```

### Private Member Documentation

```javascript
/**
 * Private field description
 * @type {string}
 * @private
 */
#privateField = 'value';

/**
 * Private method description
 * @private
 * @param {string} param
 * @returns {boolean}
 */
#privateMethod(param) {
    // ...
}
```

### Type Definitions

```javascript
/**
 * @typedef {Object} CustomType
 * @property {string} name - User name
 * @property {number} age - User age
 * @property {boolean} [active] - Whether user is active
 */

/**
 * @callback EventCallback
 * @param {Object} data - Event data
 * @returns {void}
 */
```

### Required JSDoc Elements

Every public class/function must have:
1. **Description**: What it does
2. **@param**: All parameters with types
3. **@returns**: Return value and type
4. **@throws**: Errors that can be thrown
5. **@example**: At least one usage example

---

## Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Feature works as expected
- [ ] No console errors
- [ ] No console warnings
- [ ] Works in light and dark themes
- [ ] Responsive on mobile/tablet/desktop
- [ ] Navigation still works
- [ ] Events are properly emitted/consumed
- [ ] State persists after page reload
- [ ] Accessibility (keyboard navigation, screen reader friendly)

### Unit Testing (Future)

When unit tests are added:

```javascript
// Example test structure
import { ReportGenerator } from '../features/ReportGenerator.js';
import { createTestContainer } from '../core/bootstrap.js';

describe('ReportGenerator', () => {
    let reportGenerator;
    let mockEventBus;
    let mockStateManager;

    beforeEach(() => {
        mockEventBus = {
            on: jest.fn(),
            emit: jest.fn()
        };

        mockStateManager = {
            get: jest.fn(),
            set: jest.fn()
        };

        const container = createTestContainer({
            eventBus: mockEventBus,
            stateManager: mockStateManager
        });

        reportGenerator = container.resolve('reportGenerator');
    });

    test('should generate report', () => {
        const result = reportGenerator.generateReport('usage');
        expect(result).toBeDefined();
        expect(mockEventBus.emit).toHaveBeenCalledWith(
            'report:generated',
            expect.any(Object)
        );
    });
});
```

---

## Pull Request Process

### 1. Before You Start

- Check existing issues/PRs to avoid duplicates
- Discuss major changes in an issue first
- Fork the repository
- Create a feature branch: `git checkout -b feature/my-feature`

### 2. While Developing

- Follow coding standards
- Write JSDoc comments
- Keep commits atomic and well-described
- Test thoroughly

### 3. Commit Message Format

```
type(scope): brief description

Detailed explanation of what changed and why.

Fixes #123
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code restructuring (no behavior change)
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example**:
```
feat(reports): add usage report generation

Implemented ReportGenerator service to generate usage
statistics. Integrated with EventBus for reactive updates.

- Added ReportGenerator class
- Registered service in bootstrap.js
- Created ReportsView for UI
- Added unit tests

Fixes #42
```

### 4. Before Submitting PR

- [ ] Code follows style guide
- [ ] JSDoc is complete
- [ ] Manual testing completed
- [ ] No console errors/warnings
- [ ] Relevant documentation updated
- [ ] Commits are clean and descriptive

### 5. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List of changes
- Another change

## Testing Done
- Tested in Chrome, Firefox, Safari
- Verified light/dark themes
- Tested responsive layouts
- No console errors

## Screenshots (if applicable)
[Add screenshots]

## Related Issues
Fixes #123
Relates to #456

## Checklist
- [ ] Code follows style guide
- [ ] JSDoc is complete
- [ ] Testing completed
- [ ] Documentation updated
```

### 6. Review Process

1. **Automated Checks**: (If set up) Linting, formatting
2. **Code Review**: Maintainer reviews code
3. **Feedback**: Address review comments
4. **Approval**: Once approved, PR will be merged
5. **Merge**: Squash and merge (usually)

---

## Architecture Principles

### SOLID Principles

Always follow SOLID when adding code:

#### Single Responsibility Principle (SRP)
```javascript
// ✅ Good - Single responsibility
class ThemeManager {
    setTheme(theme) { /* Only manages theme */ }
}

class StateManager {
    saveState(key, value) { /* Only manages state */ }
}

// ❌ Bad - Multiple responsibilities
class Manager {
    setTheme(theme) { }
    saveState(key, value) { }
    navigate(section) { }
}
```

#### Open/Closed Principle (OCP)
```javascript
// ✅ Good - Extend via SectionRegistry
sectionRegistry.register('newSection', factory);

// ❌ Bad - Modify existing code
function renderSection(section) {
    switch(section) {
        case 'dashboard': // ...
        case 'newSection': // Adding new case modifies function
    }
}
```

#### Dependency Inversion Principle (DIP)
```javascript
// ✅ Good - Depend on abstraction (container)
class MyService {
    constructor({ eventBus }) {
        this.eventBus = eventBus;
    }
}

// ❌ Bad - Create dependency directly
class MyService {
    constructor() {
        this.eventBus = new EventBus(); // Tight coupling
    }
}
```

### Dependency Injection

Always use the IoC container:

```javascript
// ✅ Good
const container = createContainer();
const service = container.resolve('myService');

// ❌ Bad
const service = new MyService(new EventBus(), new StateManager());
```

### Event-Driven Communication

Use EventBus for module communication:

```javascript
// ✅ Good - Decoupled via events
eventBus.emit('user:loggedIn', { userId: 123 });

// ❌ Bad - Direct coupling
userManager.onLogin = () => {
    dashboardManager.updateUI();
    analyticsManager.track();
};
```

---

## Common Patterns

### Pattern 1: Creating a Manager

```javascript
/**
 * @fileoverview Description
 * @module features/MyManager
 */

export class MyManager {
    #eventBus;
    #stateManager;

    constructor({ eventBus, stateManager }) {
        this.#eventBus = eventBus;
        this.#stateManager = stateManager;
    }

    init() {
        this.#setupEventListeners();
        this.#loadState();
    }

    #setupEventListeners() {
        this.#eventBus.on('my:event', (data) => {
            this.handleEvent(data);
        });
    }

    #loadState() {
        const saved = this.#stateManager.get('myKey', {});
        // Use saved state
    }

    handleEvent(data) {
        // Do something
        this.#eventBus.emit('my:completed', { result: data });
    }
}
```

### Pattern 2: Creating a View

```javascript
/**
 * @fileoverview Description
 * @module views/MyView
 */

import { BaseView } from './BaseView.js';
import { sectionRegistry } from '../patterns/SectionRegistry.js';

export class MyView extends BaseView {
    render() {
        const content = this.knowledgeBase?.mySection || {};

        return this.wrapSection(`
            ${this.renderSectionHeader('Title', 'Subtitle')}

            <div class="content-grid">
                ${this.renderCards(content)}
            </div>
        `);
    }

    renderCards(content) {
        return Object.entries(content)
            .map(([key, item]) => this.renderGuideCard(key, item))
            .join('');
    }
}

sectionRegistry.register('mySection', (deps) => new MyView(deps), {
    displayName: 'My Section',
    icon: 'ri-icon-line',
    order: 5
});
```

### Pattern 3: Using Events

```javascript
// Emitter
class Producer {
    doSomething() {
        const result = this.process();
        this.#eventBus.emit('data:processed', { result });
    }
}

// Consumer
class Consumer {
    init() {
        this.#eventBus.on('data:processed', ({ result }) => {
            this.handleResult(result);
        });
    }
}
```

---

## Troubleshooting

### Common Issues

#### Issue: Service not found error

```
Error: Service 'myService' not found
```

**Solution**: Register the service in `bootstrap.js`:
```javascript
container.register('myService', MyService, {
    lifecycle: 'singleton',
    dependencies: ['eventBus']
});
```

#### Issue: Circular dependency error

```
Error: Circular dependency: A -> B -> A
```

**Solution**: Refactor dependencies. Consider:
- Using events instead of direct dependencies
- Extracting shared logic to a third service
- Rethinking the architecture

#### Issue: View not rendering

**Solution**: Check:
1. View is registered in SectionRegistry
2. View file is imported in `main.js`
3. View's `render()` method returns HTML
4. No JavaScript errors in console

#### Issue: Events not firing

**Solution**: Verify:
1. Emitter uses correct event name
2. Listener is registered before event is emitted
3. EventBus instance is the same (use injected instance)
4. No typos in event names

### Debugging Tips

#### Enable Debug Mode

In `main.js`:
```javascript
const container = createContainer({
    debug: true // Logs service resolutions
});
```

In `EventBus`:
```javascript
const eventBus = new EventBus({ debug: true }); // Logs all events
```

#### Inspect Container

In browser console:
```javascript
// List all services
window.__container__.listRegistered();

// Check if service exists
window.__container__.has('myService');

// Get service info
window.__container__.getRegistrationInfo('myService');
```

#### Monitor Events

```javascript
// Log all events
eventBus.eventNames().forEach(name => {
    eventBus.on(name, (data) => {
        console.log(`Event: ${name}`, data);
    });
});
```

---

## Resources

### Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API.md](./API.md) - API reference
- README.md - Project overview

### External Resources

- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Dependency Injection](https://martinfowler.com/articles/injection.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [JSDoc](https://jsdoc.app/)

---

## Questions?

If you have questions:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce (if bug)
   - Expected vs actual behavior
   - Browser/OS info

---

**Happy Contributing!**

Version: 3.0.0
Last Updated: 2024-01-15
Maintained By: Jamf Assistant Team

# Architecture Documentation

## Table of Contents

- [Overview](#overview)
- [Architectural Principles](#architectural-principles)
- [System Architecture](#system-architecture)
- [Layer Structure](#layer-structure)
- [Design Patterns](#design-patterns)
- [Dependency Flow](#dependency-flow)
- [Data Flow](#data-flow)
- [Module Organization](#module-organization)

---

## Overview

**Jamf Assistant** is a progressive web application (PWA) built for educational environments to manage Apple device ecosystems. The application has been completely refactored to follow SOLID principles and modern architectural patterns.

### Key Statistics

- **40+ ES6 Modules**: Fully modular codebase
- **18 Registered Services**: Managed via IoC Container
- **Zero Global Dependencies**: All services injected
- **100% Event-Driven**: Pub/Sub pattern via EventBus
- **Pattern-Based**: Registry, Chain of Responsibility, Strategy, Factory

---

## Architectural Principles

### SOLID Principles

The entire application adheres to SOLID design principles:

#### 1. Single Responsibility Principle (SRP)
Each module has one reason to change:
- `StateManager`: Only manages state persistence
- `ThemeManager`: Only manages theme switching
- `NavigationManager`: Only manages navigation

#### 2. Open/Closed Principle (OCP)
Extension without modification:
- **SectionRegistry**: Add new views without touching existing code
- **ValidatorChain**: Add new validators by chaining
- **RenderStrategy**: Add new rendering strategies

#### 3. Liskov Substitution Principle (LSP)
All views extend `BaseView` and can be substituted:
```javascript
const view = sectionRegistry.get('dashboard'); // Returns BaseView
container.innerHTML = view.render(); // Works with any view
```

#### 4. Interface Segregation Principle (ISP)
Modules only expose what they need:
- Validators expose only `validate()`
- Views expose only `render()`
- Managers expose specific public methods

#### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions (IoC Container):
```javascript
// App doesn't create dependencies
const app = new JamfAssistant(container);

// Container resolves dependencies
const themeManager = container.resolve('themeManager');
```

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         MAIN.JS (Entry Point)                    │
│  - Creates IoC Container                                         │
│  - Registers external globals (KnowledgeBase, Diagnostics)       │
│  - Initializes Application                                       │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    IoC CONTAINER (bootstrap.js)                  │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐     │
│  │   Utils     │    Core     │  Features   │  Chatbot    │     │
│  │  EventBus   │ StateManager│ SearchEngine│ ChatbotCore │     │
│  │ ToastMgr    │ ThemeMgr    │ GuideManager│ ApiKeyMgr   │     │
│  │             │ NavMgr      │ DiagMgr     │ RAGEngine   │     │
│  └─────────────┴─────────────┴─────────────┴─────────────┘     │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    JAMF ASSISTANT (app.js)                       │
│  - Orchestrates all modules                                      │
│  - Routes events between services                                │
│  - Manages view lifecycle                                        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬──────────────┐
        │               │               │              │
        ▼               ▼               ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│    VIEWS     │ │   FEATURES   │ │     CORE     │ │   CHATBOT    │
│  (Registry)  │ │  (Managers)  │ │  (Services)  │ │   (AI Chat)  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Component Interaction Flow

```
User Action
    │
    ▼
┌────────────────┐
│  DOM Event     │
└────────┬───────┘
         │
         ▼
┌────────────────────┐
│  View/Manager      │──────► Validates input
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  EventBus.emit()   │──────► Publishes event
└────────┬───────────┘
         │
         ▼
┌────────────────────────┐
│  Subscribers listen    │
│  - StateManager        │──────► Persists state
│  - NavigationManager   │──────► Updates navigation
│  - App orchestrator    │──────► Coordinates response
└────────┬───────────────┘
         │
         ▼
┌────────────────────┐
│  View renders      │──────► Updates DOM
└────────────────────┘
```

---

## Layer Structure

### 1. Core Layer (`js/core/`)

**Purpose**: Foundation services that other layers depend on

| Module | Responsibility | Dependencies |
|--------|---------------|--------------|
| `Container.js` | IoC container for DI | None |
| `bootstrap.js` | Service registration config | Container + All modules |
| `StateManager.js` | State persistence (localStorage) | EventBus |
| `ThemeManager.js` | Theme switching (dark/light) | EventBus, StateManager |
| `NavigationManager.js` | Section navigation | EventBus, StateManager |
| `ModalManager.js` | Modal dialog management | EventBus |
| `SidebarManager.js` | Sidebar state management | EventBus, StateManager |

**Characteristics**:
- No business logic
- Generic, reusable services
- Foundation for other layers

### 2. Features Layer (`js/features/`)

**Purpose**: Application-specific business logic

| Module | Responsibility | Dependencies |
|--------|---------------|--------------|
| `SearchEngine.js` | Full-text search | EventBus, KnowledgeBase, Diagnostics |
| `ChecklistManager.js` | Checklist CRUD + persistence | EventBus, StateManager, ModalManager |
| `DiagnosticsManager.js` | Troubleshooting wizards | EventBus, ModalManager, Diagnostics |
| `GuideManager.js` | Guide display logic | EventBus, ModalManager, KnowledgeBase |
| `DataManager.js` | User data export/delete (GDPR) | EventBus, StateManager, ModalManager |

**Characteristics**:
- Domain-specific logic
- Coordinates between core services
- Emits domain events

### 3. Views Layer (`js/views/`)

**Purpose**: Presentation and rendering

| Module | Responsibility | Pattern |
|--------|---------------|---------|
| `BaseView.js` | Abstract base class | Template Method |
| `DashboardView.js` | Dashboard rendering | Self-registration |
| `EcosistemaView.js` | Ecosystem view | Self-registration |
| `IPadsView.js` | iPads section | Self-registration |
| `MacsView.js` | Macs section | Self-registration |
| `AulaView.js` | Classroom app section | Self-registration |
| `TeacherView.js` | Teacher resources | Self-registration |
| `TroubleshootingView.js` | Diagnostics UI | Self-registration |
| `ChecklistsView.js` | Checklists UI | Self-registration |
| `MisDatosView.js` | User data (GDPR) | Self-registration |

**Characteristics**:
- Only responsible for HTML generation
- Self-register with `SectionRegistry`
- No business logic

### 4. Chatbot Layer (`js/chatbot/`)

**Purpose**: AI assistant functionality

```
ChatbotCore (Orchestrator)
    │
    ├──► ApiKeyManager ──► EncryptionService (AES-256-GCM)
    │                  └──► ValidatorChain (Format validation)
    │
    ├──► GeminiClient ──────► Google Gemini API
    │
    ├──► RAGEngine ─────────► Context retrieval
    │
    ├──► ChatUI ────────────► Message rendering
    │
    ├──► RateLimiter ───────► API call throttling
    │
    └──► EventBus (Chat) ───► Internal events
```

**Modules**:
- `ChatbotCore.js`: Main orchestrator
- `ApiKeyManager.js`: Secure key storage
- `EncryptionService.js`: AES-256-GCM encryption
- `GeminiClient.js`: Gemini API wrapper
- `RAGEngine.js`: Retrieval-Augmented Generation
- `ChatUI.js`: Message display
- `RateLimiter.js`: Request throttling
- `EventBus.js`: Chat-specific events

### 5. Patterns Layer (`js/patterns/`)

**Purpose**: Reusable design pattern implementations

| Pattern | Implementation | Use Case |
|---------|---------------|----------|
| **Registry** | `SectionRegistry.js` | View management (Open/Closed) |
| **Chain of Responsibility** | `ValidatorChain.js` | API key validation |
| **Strategy** | `RenderStrategy.js` | Different rendering approaches |
| **Factory** | `ValidatorChain.js` | `createGeminiValidator()` |

**Custom Errors**:
- `DuplicateSectionError.js`: Registry conflicts
- `SectionNotFoundError.js`: Missing views
- `ValidationError.js`: Validation failures
- `ServiceNotFoundError.js`: Container resolution failures
- `CircularDependencyError.js`: Dependency cycles

### 6. Data Layer (`js/data/`)

**Purpose**: Static knowledge base content

- `KnowledgeMetadata.js`: Version and update info
- `KnowledgeEcosystem.js`: Ecosystem guides
- `KnowledgeIPads.js`: iPad guides
- `KnowledgeMacs.js`: Mac guides
- `KnowledgeAula.js`: Classroom app guides (Basic + Advanced)
- `KnowledgeTeacher.js`: Teacher resources
- `KnowledgeChecklists.js`: Predefined checklists
- `KnowledgeDiagrams.js`: Visual diagrams
- `index.js`: Aggregator

### 7. Utils Layer (`js/utils/`)

**Purpose**: Cross-cutting utilities

- `EventBus.js`: Pub/Sub event system
- `AppEvents`: Standard event names

### 8. UI Layer (`js/ui/`)

**Purpose**: Reusable UI components

- `ToastManager.js`: Notification toasts
- `ConnectionStatus.js`: Network status indicator
- `OnboardingTour.js`: First-time user tutorial
- `TooltipManager.js`: Tooltip system
- `FocusTrap.js`: Accessibility helper

---

## Design Patterns

### 1. Dependency Injection (IoC Container)

**Problem**: Tight coupling between modules, difficult testing

**Solution**: Inversion of Control Container

```javascript
// OLD WAY (tight coupling)
class App {
    constructor() {
        this.eventBus = new EventBus(); // ❌ Creates dependency
        this.stateManager = new StateManager(this.eventBus);
    }
}

// NEW WAY (dependency injection)
class App {
    constructor(container) {
        this.eventBus = container.resolve('eventBus'); // ✅ Injected
        this.stateManager = container.resolve('stateManager');
    }
}
```

**Benefits**:
- Single source of truth for service creation
- Easy testing with mocks
- Clear dependency graph
- Lifecycle management (singleton, transient, scoped)

### 2. Registry Pattern (SectionRegistry)

**Problem**: Switch statements for view selection, violates OCP

**Solution**: Views self-register in a registry

```javascript
// In DashboardView.js (self-registration at module load)
import { sectionRegistry } from '../patterns/SectionRegistry.js';

export class DashboardView extends BaseView { ... }

sectionRegistry.register('dashboard', (deps) => new DashboardView(deps), {
    displayName: 'Dashboard',
    icon: 'ri-dashboard-line',
    order: 1
});
```

```javascript
// In app.js (no switch statement needed)
const view = sectionRegistry.get('dashboard');
container.innerHTML = view.render();
```

**Benefits**:
- Add new views without modifying app code (OCP)
- No central switch/if-else
- Metadata attached to views

### 3. Chain of Responsibility (ValidatorChain)

**Problem**: Complex validation logic, hard to extend

**Solution**: Chain validators together

```javascript
const geminiValidator = new ApiKeyValidatorChain('GeminiAPIKey')
    .addValidator(new NotEmptyValidator())
    .addValidator(new LengthValidator(39))
    .addValidator(new PrefixValidator('AIza'))
    .addValidator(new RegexValidator(/^[A-Za-z0-9_-]+$/))
    .addValidator(new StrengthValidator(0));

const result = geminiValidator.validate(apiKey);
if (!result.valid) {
    console.error(result.error); // First failure
}
```

**Benefits**:
- Easy to add new validators
- Fail-fast or collect-all modes
- Each validator has single responsibility

### 4. Pub/Sub (EventBus)

**Problem**: Direct module coupling, circular dependencies

**Solution**: Event-driven communication

```javascript
// Publisher (doesn't know who listens)
eventBus.emit(AppEvents.NAVIGATION_CHANGED, { section: 'dashboard' });

// Subscriber (doesn't know who emitted)
eventBus.on(AppEvents.NAVIGATION_CHANGED, ({ section }) => {
    renderSection(section);
});
```

**Benefits**:
- Decoupled modules
- Easy to add new listeners
- Event history for debugging

### 5. Factory Pattern (Service Factories)

**Problem**: Complex object creation logic

**Solution**: Factory functions in bootstrap

```javascript
// In bootstrap.js
container.register('rateLimiter', () => new RateLimiter(10, 60000), {
    lifecycle: 'singleton',
    factory: true // Indicates this is a factory function
});

container.register('chatbotCore', (deps) => {
    return new ChatbotCore({
        apiKeyManager: deps.apiKeyManager,
        ragEngine: deps.ragEngine,
        chatUI: deps.chatUI,
        rateLimiter: deps.rateLimiter,
        eventBus: deps.chatEventBus // Mapping
    });
}, {
    lifecycle: 'singleton',
    factory: true,
    dependencies: ['apiKeyManager', 'ragEngine', 'chatUI', 'rateLimiter', 'chatEventBus']
});
```

### 6. Strategy Pattern (RenderStrategy)

**Problem**: Different rendering approaches for different contexts

**Solution**: Pluggable rendering strategies

```javascript
// Different strategies for different content types
const htmlStrategy = new HtmlRenderStrategy();
const markdownStrategy = new MarkdownRenderStrategy();

view.setRenderStrategy(markdownStrategy);
const output = view.render();
```

### 7. Template Method (BaseView)

**Problem**: Common rendering utilities duplicated

**Solution**: Abstract base class with shared methods

```javascript
export class BaseView {
    // Template methods (reusable)
    renderGuideCard(id, guide) { ... }
    renderSectionHeader(title, subtitle) { ... }
    renderInfoBox({ icon, title, content }) { ... }

    // Abstract method (must implement)
    render() {
        throw new Error('Subclasses must implement render()');
    }
}
```

---

## Dependency Flow

### Container Dependency Graph

```
EventBus (singleton)
    ↓
    ├──► StateManager (singleton)
    │        ↓
    │        ├──► ThemeManager (singleton)
    │        ├──► NavigationManager (singleton)
    │        ├──► SidebarManager (singleton)
    │        └──► ChecklistManager (singleton)
    │
    ├──► ModalManager (singleton)
    │        ↓
    │        ├──► DiagnosticsManager (singleton)
    │        ├──► GuideManager (singleton)
    │        ├──► ChecklistManager (singleton)
    │        └──► DataManager (singleton)
    │
    └──► SearchEngine (singleton)

EncryptionService (singleton)
    ↓
    └──► ApiKeyManager (singleton)
             ↓
             └──► ChatbotCore (singleton)

ValidatorChain (singleton, factory)
    ↓
    └──► ApiKeyManager (singleton)

RateLimiter (singleton, factory)
    ↓
    └──► ChatbotCore (singleton)

RAGEngine (singleton)
    ↓
    └──► ChatbotCore (singleton)

ChatUI (singleton)
    ↓
    └──► ChatbotCore (singleton)

ChatEventBus (singleton)
    ↓
    └──► ChatbotCore (singleton)

SectionRegistry (singleton, factory)
    ↓
    └──► NavigationManager (singleton)
```

### Lifecycle Management

| Lifecycle | Behavior | Use Case |
|-----------|----------|----------|
| **Singleton** | One instance shared globally | EventBus, StateManager, Managers |
| **Transient** | New instance per resolution | (Currently unused) |
| **Scoped** | One instance per container scope | Testing with mocks |

### Circular Dependency Detection

The container automatically detects circular dependencies:

```javascript
// This would throw CircularDependencyError
container.register('A', ClassA, { dependencies: ['B'] });
container.register('B', ClassB, { dependencies: ['A'] });

container.resolve('A'); // ❌ Throws: Circular dependency: A -> B -> A
```

---

## Data Flow

### 1. Navigation Flow

```
User clicks nav item
    │
    ▼
NavigationManager detects click
    │
    ▼
EventBus.emit(NAVIGATION_BEFORE_CHANGE)
    │
    ▼
App.js listens and validates
    │
    ▼
EventBus.emit(NAVIGATION_CHANGED)
    │
    ▼
App.js renders new section
    │
    ├──► SectionRegistry.get(section)
    │         │
    │         ▼
    │    View factory creates instance
    │         │
    │         ▼
    │    View.render() returns HTML
    │
    ▼
contentWrapper.innerHTML = html
    │
    ▼
App.js binds events on new content
```

### 2. Search Flow

```
User types in search box
    │
    ▼
SearchEngine debounces input (300ms)
    │
    ▼
SearchEngine.search(query)
    │
    ├──► Searches KnowledgeBase.ipads
    ├──► Searches KnowledgeBase.macs
    ├──► Searches KnowledgeBase.aula
    └──► Searches Diagnostics
    │
    ▼
Results displayed in overlay
    │
    ▼
User clicks result
    │
    ▼
EventBus.emit(SEARCH_RESULTS, { type, id })
    │
    ▼
App.js opens guide or diagnostic
```

### 3. Chatbot Message Flow

```
User sends message
    │
    ▼
ChatbotCore.handleSendMessage()
    │
    ├──► Check RateLimiter.canMakeCall()
    │    │
    │    ├──► ✅ Allowed
    │    └──► ❌ Show rate limit message
    │
    ▼
ChatUI.addUserMessage(message)
ChatUI.showTyping()
    │
    ▼
RAGEngine.search(message)
    │
    ├──► Searches documentation
    └──► Returns relevant chunks
    │
    ▼
RAGEngine.buildContext(chunks)
    │
    ▼
GeminiClient.sendMessage(message, systemPrompt, context)
    │
    ├──► Sends to Google Gemini API
    └──► Receives AI response
    │
    ▼
ChatUI.hideTyping()
ChatUI.addBotMessage(response)
ChatUI.showSources(chunks)
    │
    ▼
EventBus.emit(MESSAGE_RECEIVED, response)
```

### 4. State Persistence Flow

```
User performs action (e.g., theme change)
    │
    ▼
ThemeManager.setTheme('dark')
    │
    ├──► Updates DOM classes
    └──► EventBus.emit(THEME_CHANGED, 'dark')
    │
    ▼
StateManager listens to THEME_CHANGED
    │
    ▼
StateManager.set('theme', 'dark')
    │
    ▼
localStorage.setItem('theme', 'dark')
    │
    ▼
EventBus.emit(STATE_PERSISTED, { key: 'theme', value: 'dark' })
```

---

## Module Organization

### Directory Structure

```
js/
├── app.js                      # Main application orchestrator
├── main.js                     # Entry point (composition root)
├── core/                       # Foundation services
│   ├── Container.js            # IoC container
│   ├── bootstrap.js            # Service registration
│   ├── StateManager.js         # State persistence
│   ├── ThemeManager.js         # Theme management
│   ├── NavigationManager.js    # Navigation
│   ├── ModalManager.js         # Modals
│   ├── SidebarManager.js       # Sidebar
│   └── errors/                 # Core errors
│       ├── ServiceNotFoundError.js
│       └── CircularDependencyError.js
├── features/                   # Business logic
│   ├── SearchEngine.js         # Search functionality
│   ├── ChecklistManager.js     # Checklist management
│   ├── DiagnosticsManager.js   # Troubleshooting wizards
│   ├── GuideManager.js         # Guide display
│   └── DataManager.js          # GDPR data management
├── views/                      # Presentation layer
│   ├── BaseView.js             # Abstract base class
│   ├── DashboardView.js        # Dashboard
│   ├── EcosistemaView.js       # Ecosystem
│   ├── IPadsView.js            # iPads section
│   ├── MacsView.js             # Macs section
│   ├── AulaView.js             # Classroom app
│   ├── TeacherView.js          # Teacher resources
│   ├── TroubleshootingView.js  # Diagnostics UI
│   ├── ChecklistsView.js       # Checklists UI
│   └── MisDatosView.js         # User data
├── chatbot/                    # AI assistant
│   ├── ChatbotCore.js          # Main orchestrator
│   ├── ApiKeyManager.js        # Key management
│   ├── EncryptionService.js    # AES-256-GCM
│   ├── GeminiClient.js         # Gemini API client
│   ├── RAGEngine.js            # Document retrieval
│   ├── ChatUI.js               # Message rendering
│   ├── RateLimiter.js          # Request throttling
│   ├── EventBus.js             # Chat events
│   └── index.js                # Chatbot factory
├── patterns/                   # Design patterns
│   ├── SectionRegistry.js      # Registry pattern
│   ├── ValidatorChain.js       # Chain of Responsibility
│   ├── RenderStrategy.js       # Strategy pattern
│   ├── index.js                # Pattern exports
│   └── errors/                 # Pattern errors
│       ├── DuplicateSectionError.js
│       ├── SectionNotFoundError.js
│       └── ValidationError.js
├── data/                       # Knowledge base
│   ├── KnowledgeMetadata.js    # Version info
│   ├── KnowledgeEcosystem.js   # Ecosystem guides
│   ├── KnowledgeIPads.js       # iPad guides
│   ├── KnowledgeMacs.js        # Mac guides
│   ├── KnowledgeAula.js        # Classroom guides
│   ├── KnowledgeAulaBasic.js   # Basic guides
│   ├── KnowledgeAulaAdvanced.js# Advanced guides
│   ├── KnowledgeTeacher.js     # Teacher resources
│   ├── KnowledgeChecklists.js  # Predefined checklists
│   ├── KnowledgeDiagrams.js    # Visual diagrams
│   └── index.js                # Aggregator
├── utils/                      # Utilities
│   └── EventBus.js             # Pub/Sub system
└── ui/                         # UI components
    ├── ToastManager.js         # Notifications
    ├── ConnectionStatus.js     # Network status
    ├── OnboardingTour.js       # User tutorial
    ├── TooltipManager.js       # Tooltips
    └── FocusTrap.js            # Accessibility
```

### Module Naming Conventions

| Suffix | Purpose | Example |
|--------|---------|---------|
| `Manager` | Coordinates a feature area | `StateManager`, `ThemeManager` |
| `Engine` | Performs complex processing | `SearchEngine`, `RAGEngine` |
| `Service` | Provides utility functionality | `EncryptionService` |
| `Client` | External API wrapper | `GeminiClient` |
| `View` | Renders UI | `DashboardView`, `IPadsView` |
| `Error` | Custom error class | `ServiceNotFoundError` |
| `Bus` | Event communication | `EventBus` |
| `Registry` | Pattern implementation | `SectionRegistry` |

---

## Event System

### Core Events (AppEvents)

```javascript
export const AppEvents = {
    // Navigation
    NAVIGATION_CHANGED: 'navigation:changed',
    NAVIGATION_BEFORE_CHANGE: 'navigation:beforeChange',

    // Theme
    THEME_CHANGED: 'theme:changed',
    THEME_LOADED: 'theme:loaded',

    // Modal
    MODAL_OPENED: 'modal:opened',
    MODAL_CLOSED: 'modal:closed',

    // Search
    SEARCH_QUERY: 'search:query',
    SEARCH_RESULTS: 'search:results',
    SEARCH_CLEARED: 'search:cleared',

    // Diagnostics
    DIAGNOSTIC_STARTED: 'diagnostic:started',
    DIAGNOSTIC_STEP_CHANGED: 'diagnostic:stepChanged',
    DIAGNOSTIC_COMPLETED: 'diagnostic:completed',

    // Checklists
    CHECKLIST_OPENED: 'checklist:opened',
    CHECKLIST_ITEM_TOGGLED: 'checklist:itemToggled',
    CHECKLIST_COMPLETED: 'checklist:completed',

    // Data
    DATA_EXPORTED: 'data:exported',
    DATA_DELETED: 'data:deleted',

    // Lifecycle
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error',

    // Connection
    CONNECTION_ONLINE: 'connection:online',
    CONNECTION_OFFLINE: 'connection:offline'
};
```

### Chat Events (ChatEvents)

```javascript
export const ChatEvents = {
    READY: 'chatbot:ready',
    CHAT_OPENED: 'chatbot:opened',
    CHAT_CLOSED: 'chatbot:closed',
    MESSAGE_SENT: 'chatbot:messageSent',
    MESSAGE_RECEIVED: 'chatbot:messageReceived',
    MESSAGE_ERROR: 'chatbot:messageError',
    MODAL_OPENED: 'chatbot:modalOpened',
    MODAL_CLOSED: 'chatbot:modalClosed',
    API_KEY_CHANGED: 'chatbot:apiKeyChanged',
    API_ERROR: 'chatbot:apiError',
    RATE_LIMIT_WARNING: 'chatbot:rateLimitWarning',
    RATE_LIMIT_EXCEEDED: 'chatbot:rateLimitExceeded'
};
```

---

## Testing Strategy

### Testing with IoC Container

```javascript
// Create test container with mocks
import { createTestContainer } from './core/bootstrap.js';

const mockEventBus = {
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn()
};

const container = createTestContainer({
    eventBus: mockEventBus
});

// Resolve service under test
const themeManager = container.resolve('themeManager');

// ThemeManager will use mockEventBus instead of real one
expect(mockEventBus.emit).toHaveBeenCalledWith('theme:changed', 'dark');
```

### Container Scopes for Isolation

```javascript
// Create isolated scope for each test
const testScope = container.createScope();
testScope.registerInstance('stateManager', mockStateManager);

// Test in isolation
const manager = testScope.resolve('themeManager');
```

---

## Performance Considerations

### Singleton Caching

All managers are singletons, created once:

```javascript
// First call creates instance
const stateManager1 = container.resolve('stateManager');

// Subsequent calls return cached instance
const stateManager2 = container.resolve('stateManager');

console.log(stateManager1 === stateManager2); // true
```

### Lazy Loading

Services are only created when resolved:

```javascript
// Container is configured, but services not yet created
const container = createContainer();

// Service created on first resolve
const themeManager = container.resolve('themeManager'); // Creates instance here
```

### Event Bus Efficiency

- Uses `Map` and `Set` for O(1) lookups
- Weak references to prevent memory leaks
- Automatic cleanup of zero-listener events

---

## Security Considerations

### 1. API Key Security

- **Encryption**: AES-256-GCM with Web Crypto API
- **Storage**: Encrypted in localStorage
- **Session-only mode**: In-memory storage option
- **Validation**: Multi-stage validator chain

### 2. XSS Prevention

- **DOMPurify**: All user input sanitized
- **Template literals**: Escaped HTML
- **CSP headers**: Content Security Policy

### 3. Rate Limiting

- **Token bucket algorithm**: 10 requests/minute
- **Client-side enforcement**: Protects API quota
- **Visual feedback**: User notifications

---

## Migration from Legacy Code

### Before (Monolithic)

```javascript
// app.js (old)
class JamfAssistant {
    constructor() {
        // Creates all dependencies directly
        this.eventBus = new EventBus();
        this.stateManager = new StateManager(this.eventBus);
        this.themeManager = new ThemeManager(this.eventBus, this.stateManager);
        // ... 50+ lines of instantiation
    }
}
```

### After (IoC Container)

```javascript
// main.js (new)
const container = createContainer();
const app = new JamfAssistant(container);

// app.js (new)
class JamfAssistant {
    constructor(container) {
        // All dependencies injected
        this.eventBus = container.resolve('eventBus');
        this.stateManager = container.resolve('stateManager');
        this.themeManager = container.resolve('themeManager');
        // Clean and testable
    }
}
```

### Benefits Realized

1. **Reduced coupling**: App doesn't create dependencies
2. **Testability**: Easy to inject mocks
3. **Maintainability**: Single place to configure services
4. **Extensibility**: Add services without touching app code

---

## Future Architecture Enhancements

### Potential Improvements

1. **Service Worker**: Full offline support
2. **IndexedDB**: Richer client-side data
3. **WebSockets**: Real-time collaboration
4. **Module Federation**: Micro-frontend architecture
5. **Web Workers**: Background processing
6. **Virtual Scrolling**: Performance for large lists
7. **State Machine**: Complex workflow management

---

## Glossary

- **IoC**: Inversion of Control
- **DI**: Dependency Injection
- **RAG**: Retrieval-Augmented Generation
- **PWA**: Progressive Web App
- **SOLID**: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion
- **OCP**: Open/Closed Principle
- **SRP**: Single Responsibility Principle
- **LSP**: Liskov Substitution Principle
- **ISP**: Interface Segregation Principle
- **DIP**: Dependency Inversion Principle

---

**Version**: 3.0.0
**Last Updated**: 2024-01-15
**Maintained By**: Jamf Assistant Team

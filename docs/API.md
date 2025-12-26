# API Documentation

## Table of Contents

- [Overview](#overview)
- [Core APIs](#core-apis)
  - [Container](#container)
  - [EventBus](#eventbus)
  - [StateManager](#statemanager)
  - [ThemeManager](#thememanager)
  - [NavigationManager](#navigationmanager)
  - [ModalManager](#modalmanager)
  - [SidebarManager](#sidebarmanager)
- [Pattern APIs](#pattern-apis)
  - [SectionRegistry](#sectionregistry)
  - [ValidatorChain](#validatorchain)
- [Feature APIs](#feature-apis)
  - [SearchEngine](#searchengine)
  - [ChecklistManager](#checklistmanager)
  - [DiagnosticsManager](#diagnosticsmanager)
  - [GuideManager](#guidemanager)
  - [DataManager](#datamanager)
- [Chatbot APIs](#chatbot-apis)
  - [ChatbotCore](#chatbotcore)
  - [ApiKeyManager](#apikeymanager)
  - [EncryptionService](#encryptionservice)
  - [GeminiClient](#geminiclient)
  - [RAGEngine](#ragengine)
  - [RateLimiter](#ratelimiter)
- [View APIs](#view-apis)
  - [BaseView](#baseview)
- [UI APIs](#ui-apis)
  - [ToastManager](#toastmanager)
  - [ConnectionStatus](#connectionstatus)
- [Events Reference](#events-reference)
- [Type Definitions](#type-definitions)

---

## Overview

This document describes the public APIs of all major modules in the Jamf Assistant application. Each section includes:

- **Purpose**: What the module does
- **Constructor**: How to instantiate it
- **Public Methods**: Available methods with signatures
- **Events**: Events emitted and consumed
- **Examples**: Usage examples

---

## Core APIs

### Container

**Module**: `js/core/Container.js`

**Purpose**: IoC container for dependency injection and lifecycle management.

#### Constructor

```javascript
new Container(options?: { debug?: boolean })
```

**Parameters**:
- `options.debug` (boolean, optional): Enable debug logging. Default: `false`

**Example**:
```javascript
const container = new Container({ debug: true });
```

#### Public Methods

##### `register(name, implementation, options)`

Registers a service in the container.

```javascript
register(
    name: string,
    implementation: Function,
    options?: {
        lifecycle?: 'singleton' | 'transient' | 'scoped',
        dependencies?: string[],
        factory?: boolean
    }
): Container
```

**Parameters**:
- `name`: Unique service identifier
- `implementation`: Class constructor or factory function
- `options.lifecycle`: Instance lifecycle (default: `'transient'`)
- `options.dependencies`: Array of dependency names
- `options.factory`: Whether implementation is a factory function

**Returns**: `this` (for chaining)

**Example**:
```javascript
container.register('eventBus', EventBus, {
    lifecycle: 'singleton'
});

container.register('themeManager', ThemeManager, {
    lifecycle: 'singleton',
    dependencies: ['eventBus', 'stateManager']
});
```

##### `registerInstance(name, instance)`

Registers an existing instance directly.

```javascript
registerInstance(name: string, instance: any): Container
```

**Example**:
```javascript
container.registerInstance('knowledgeBase', KnowledgeBase);
```

##### `resolve(name)`

Resolves a service and all its dependencies.

```javascript
resolve(name: string): any
```

**Throws**:
- `ServiceNotFoundError`: If service is not registered
- `CircularDependencyError`: If circular dependency detected

**Example**:
```javascript
const eventBus = container.resolve('eventBus');
const themeManager = container.resolve('themeManager');
```

##### `has(name)`

Checks if a service is registered.

```javascript
has(name: string): boolean
```

**Example**:
```javascript
if (container.has('eventBus')) {
    const bus = container.resolve('eventBus');
}
```

##### `listRegistered()`

Lists all registered service names.

```javascript
listRegistered(): string[]
```

**Example**:
```javascript
const services = container.listRegistered();
console.log('Services:', services); // ['eventBus', 'stateManager', ...]
```

##### `createScope()`

Creates a child scope container.

```javascript
createScope(): Container
```

**Example**:
```javascript
const testScope = container.createScope();
testScope.registerInstance('eventBus', mockEventBus);
const manager = testScope.resolve('themeManager'); // Uses mock
```

##### `tryResolve(name)`

Tries to resolve a service, returns null if not found.

```javascript
tryResolve(name: string): any | null
```

**Example**:
```javascript
const service = container.tryResolve('optionalService');
if (service) {
    service.doSomething();
}
```

##### `resolveMany(names)`

Resolves multiple services at once.

```javascript
resolveMany(names: string[]): Object
```

**Example**:
```javascript
const { eventBus, stateManager } = container.resolveMany([
    'eventBus',
    'stateManager'
]);
```

##### `clearInstances()`

Clears all singleton instances (useful for testing).

```javascript
clearInstances(): void
```

##### `reset()`

Completely resets the container.

```javascript
reset(): void
```

#### Properties

##### `size`

Gets the number of registered services.

```javascript
get size(): number
```

---

### EventBus

**Module**: `js/utils/EventBus.js`

**Purpose**: Centralized pub/sub event system for decoupled communication.

#### Constructor

```javascript
new EventBus(options?: { debug?: boolean })
```

#### Public Methods

##### `on(event, callback)`

Subscribes to an event.

```javascript
on(event: string, callback: Function): Subscription
```

**Returns**: Subscription object with `unsubscribe()` method

**Example**:
```javascript
const sub = eventBus.on('theme:changed', (theme) => {
    console.log('Theme changed to:', theme);
});

// Later: sub.unsubscribe();
```

##### `once(event, callback)`

Subscribes to an event for a single emission only.

```javascript
once(event: string, callback: Function): Subscription
```

**Example**:
```javascript
eventBus.once('app:ready', () => {
    console.log('App initialized');
});
```

##### `off(event, callback)`

Unsubscribes a callback from an event.

```javascript
off(event: string, callback: Function): boolean
```

**Returns**: `true` if callback was found and removed

##### `emit(event, data)`

Emits an event with optional data.

```javascript
emit(event: string, data?: any): boolean
```

**Returns**: `true` if event had subscribers

**Example**:
```javascript
eventBus.emit('navigation:changed', {
    section: 'dashboard',
    previousSection: 'settings'
});
```

##### `clear(event)`

Removes all subscribers for a specific event or all events.

```javascript
clear(event?: string): void
```

**Example**:
```javascript
eventBus.clear('navigation:changed'); // Clear specific event
eventBus.clear(); // Clear all events
```

##### `listenerCount(event)`

Gets the number of subscribers for an event.

```javascript
listenerCount(event: string): number
```

##### `eventNames()`

Gets all registered event names.

```javascript
eventNames(): string[]
```

---

### StateManager

**Module**: `js/core/StateManager.js`

**Purpose**: Manages application state persistence using localStorage.

#### Constructor

```javascript
constructor(dependencies: { eventBus: EventBus })
```

**Dependencies**: `eventBus`

#### Public Methods

##### `init()`

Initializes the state manager and loads persisted state.

```javascript
init(): void
```

##### `get(key, defaultValue)`

Gets a state value.

```javascript
get(key: string, defaultValue?: any): any
```

**Example**:
```javascript
const theme = stateManager.get('theme', 'light');
```

##### `set(key, value)`

Sets a state value and persists it.

```javascript
set(key: string, value: any): void
```

**Example**:
```javascript
stateManager.set('theme', 'dark');
```

##### `remove(key)`

Removes a state value.

```javascript
remove(key: string): void
```

##### `clear()`

Clears all state.

```javascript
clear(): void
```

##### `getAll()`

Gets all state as an object.

```javascript
getAll(): Object
```

#### Events Emitted

- `state:changed` - When state is updated
- `state:loaded` - When state is loaded from storage

---

### ThemeManager

**Module**: `js/core/ThemeManager.js`

**Purpose**: Manages theme switching (light/dark mode).

#### Constructor

```javascript
constructor(dependencies: { eventBus: EventBus, stateManager: StateManager })
```

**Dependencies**: `eventBus`, `stateManager`

#### Public Methods

##### `init()`

Initializes theme from saved preference.

```javascript
init(): void
```

##### `setTheme(theme)`

Sets the application theme.

```javascript
setTheme(theme: 'light' | 'dark'): void
```

**Example**:
```javascript
themeManager.setTheme('dark');
```

##### `toggleTheme()`

Toggles between light and dark themes.

```javascript
toggleTheme(): void
```

##### `getCurrentTheme()`

Gets the current theme.

```javascript
getCurrentTheme(): 'light' | 'dark'
```

#### Events Emitted

- `theme:changed` - When theme changes (payload: theme string)
- `theme:loaded` - When theme is loaded on init

---

### NavigationManager

**Module**: `js/core/NavigationManager.js`

**Purpose**: Manages section navigation and URL routing.

#### Constructor

```javascript
constructor(dependencies: { eventBus: EventBus, stateManager: StateManager })
```

**Dependencies**: `eventBus`, `stateManager`

#### Public Methods

##### `init()`

Initializes navigation listeners.

```javascript
init(): void
```

##### `navigateTo(section)`

Navigates to a section.

```javascript
navigateTo(section: string): void
```

**Example**:
```javascript
navigationManager.navigateTo('dashboard');
```

##### `getCurrentSection()`

Gets the current active section.

```javascript
getCurrentSection(): string
```

#### Events Emitted

- `navigation:beforeChange` - Before navigation changes
- `navigation:changed` - After navigation changes (payload: `{ section, previousSection }`)

#### Events Consumed

- `navigation:changed` - Listens for navigation requests

---

### ModalManager

**Module**: `js/core/ModalManager.js`

**Purpose**: Manages modal dialog lifecycle.

#### Constructor

```javascript
constructor(dependencies: { eventBus: EventBus })
```

**Dependencies**: `eventBus`

#### Public Methods

##### `init()`

Initializes modal event listeners.

```javascript
init(): void
```

##### `open(modalId)`

Opens a modal by ID.

```javascript
open(modalId: string): void
```

**Example**:
```javascript
modalManager.open('apiModal');
```

##### `close(modalId)`

Closes a modal by ID.

```javascript
close(modalId: string): void
```

##### `closeAll()`

Closes all open modals.

```javascript
closeAll(): void
```

#### Events Emitted

- `modal:opened` - When modal opens (payload: modalId)
- `modal:closed` - When modal closes (payload: modalId)

---

### SidebarManager

**Module**: `js/core/SidebarManager.js`

**Purpose**: Manages sidebar state (collapsed/expanded).

#### Constructor

```javascript
constructor(dependencies: { eventBus: EventBus, stateManager: StateManager })
```

**Dependencies**: `eventBus`, `stateManager`

#### Public Methods

##### `init()`

Initializes sidebar from saved state.

```javascript
init(): void
```

##### `toggle()`

Toggles sidebar between collapsed and expanded.

```javascript
toggle(): void
```

##### `collapse()`

Collapses the sidebar.

```javascript
collapse(): void
```

##### `expand()`

Expands the sidebar.

```javascript
expand(): void
```

##### `isCollapsed()`

Checks if sidebar is collapsed.

```javascript
isCollapsed(): boolean
```

---

## Pattern APIs

### SectionRegistry

**Module**: `js/patterns/SectionRegistry.js`

**Purpose**: Registry pattern for managing application views/sections.

#### Constructor

```javascript
new SectionRegistry(options?: { strictMode?: boolean })
```

**Parameters**:
- `options.strictMode`: Throw errors on missing sections (default: `false`)

#### Public Methods

##### `register(name, factory, metadata)`

Registers a section with its view factory.

```javascript
register(
    name: string,
    factory: (deps: Object) => BaseView,
    metadata?: {
        displayName?: string,
        icon?: string,
        order?: number,
        hidden?: boolean
    }
): SectionRegistry
```

**Example**:
```javascript
sectionRegistry.register('ipads', (deps) => new IPadsView(deps), {
    displayName: 'iPads',
    icon: 'ri-tablet-line',
    order: 3
});
```

##### `unregister(name)`

Unregisters a section.

```javascript
unregister(name: string): boolean
```

##### `get(name, dependencies)`

Gets a view instance for a section.

```javascript
get(name: string, dependencies?: Object): BaseView | null
```

**Example**:
```javascript
const view = sectionRegistry.get('dashboard');
if (view) {
    container.innerHTML = view.render();
}
```

##### `has(name)`

Checks if a section is registered.

```javascript
has(name: string): boolean
```

##### `list()`

Lists all registered section names.

```javascript
list(): string[]
```

##### `listWithMetadata(options)`

Lists all sections with metadata.

```javascript
listWithMetadata(options?: {
    includeHidden?: boolean,
    sortByOrder?: boolean
}): SectionMetadata[]
```

**Example**:
```javascript
const navItems = sectionRegistry.listWithMetadata({
    includeHidden: false,
    sortByOrder: true
});
```

##### `setDefaultDependencies(dependencies)`

Sets default dependencies for all view factories.

```javascript
setDefaultDependencies(dependencies: Object): SectionRegistry
```

**Example**:
```javascript
sectionRegistry.setDefaultDependencies({
    eventBus,
    knowledgeBase: KnowledgeBase
});
```

##### `clear()`

Clears all registered sections.

```javascript
clear(): void
```

#### Properties

##### `size`

Gets the number of registered sections.

```javascript
get size(): number
```

---

### ValidatorChain

**Module**: `js/patterns/ValidatorChain.js`

**Purpose**: Chain of Responsibility pattern for extensible validation.

#### ApiKeyValidatorChain

##### Constructor

```javascript
new ApiKeyValidatorChain(name?: string)
```

##### Public Methods

###### `addValidator(validator)`

Adds a validator to the end of the chain.

```javascript
addValidator(validator: Validator): ApiKeyValidatorChain
```

**Example**:
```javascript
chain.addValidator(new NotEmptyValidator())
     .addValidator(new LengthValidator(39));
```

###### `prependValidator(validator)`

Adds a validator to the beginning of the chain.

```javascript
prependValidator(validator: Validator): ApiKeyValidatorChain
```

###### `validate(apiKey)`

Executes the entire validation chain.

```javascript
validate(apiKey: string): ValidationResult
```

**Returns**: `{ valid: boolean, error?: string, validatorName?: string, strength?: string }`

**Example**:
```javascript
const result = chain.validate('AIza...');
if (!result.valid) {
    console.error(result.error);
}
```

###### `validateAll(apiKey)`

Validates and collects all errors (doesn't stop at first failure).

```javascript
validateAll(apiKey: string): ValidationResult
```

###### `clear()`

Clears all validators from the chain.

```javascript
clear(): void
```

###### `clone()`

Creates a copy of the chain.

```javascript
clone(): ApiKeyValidatorChain
```

#### Concrete Validators

##### NotEmptyValidator

```javascript
new NotEmptyValidator(errorMessage?: string)
```

##### LengthValidator

```javascript
new LengthValidator(length: number, options?: { min?: number, max?: number })
```

##### PrefixValidator

```javascript
new PrefixValidator(prefix: string, options?: { caseSensitive?: boolean })
```

##### RegexValidator

```javascript
new RegexValidator(regex: RegExp, errorMessage?: string)
```

##### StrengthValidator

```javascript
new StrengthValidator(minStrength?: number)
```

#### Factory Functions

##### `createGeminiValidator()`

Creates a pre-configured validator chain for Google Gemini API keys.

```javascript
createGeminiValidator(): ApiKeyValidatorChain
```

**Example**:
```javascript
const validator = createGeminiValidator();
const result = validator.validate(apiKey);
```

##### `createOpenAIValidator()`

Creates validator for OpenAI API keys.

```javascript
createOpenAIValidator(): ApiKeyValidatorChain
```

##### `createAnthropicValidator()`

Creates validator for Anthropic API keys.

```javascript
createAnthropicValidator(): ApiKeyValidatorChain
```

---

## Feature APIs

### SearchEngine

**Module**: `js/features/SearchEngine.js`

**Purpose**: Full-text search engine for guides and diagnostics.

#### Constructor

```javascript
constructor(dependencies: {
    eventBus: EventBus,
    knowledgeBase: Object,
    diagnostics: Object,
    document?: Document
})
```

**Dependencies**: `eventBus`, `knowledgeBase`, `diagnostics`

#### Public Methods

##### `init()`

Initializes search bindings.

```javascript
init(): void
```

##### `search(query)`

Performs search across knowledge base and diagnostics.

```javascript
search(query: string): SearchResult[]
```

**Returns**: Array of `{ type, id, icon, title, category }`

**Example**:
```javascript
const results = searchEngine.search('wifi');
results.forEach(r => console.log(r.title));
```

##### `performSearch(query)`

Programmatically triggers a search.

```javascript
performSearch(query: string): SearchResult[]
```

#### Events Emitted

- `search:query` - When search is performed (payload: `{ query, resultCount }`)
- `search:results` - When result is selected (payload: `{ type, id }`)
- `search:cleared` - When search is cleared

---

### ChecklistManager

**Module**: `js/features/ChecklistManager.js`

**Purpose**: Checklist management with persistence.

#### Constructor

```javascript
constructor(dependencies: {
    eventBus: EventBus,
    stateManager: StateManager,
    modalManager: ModalManager
})
```

**Dependencies**: `eventBus`, `stateManager`, `modalManager`

#### Public Methods

##### `init()`

Initializes checklist manager.

```javascript
init(): void
```

##### `open(checklistId)`

Opens a checklist modal.

```javascript
open(checklistId: string): void
```

**Example**:
```javascript
checklistManager.open('ipad-enrollment');
```

##### `toggleItem(checklistId, itemIndex)`

Toggles a checklist item.

```javascript
toggleItem(checklistId: string, itemIndex: number): void
```

##### `getProgress(checklistId)`

Gets checklist progress.

```javascript
getProgress(checklistId: string): { completed: number, total: number, percentage: number }
```

##### `resetChecklist(checklistId)`

Resets a checklist.

```javascript
resetChecklist(checklistId: string): void
```

##### `exportChecklist(checklistId)`

Exports checklist as JSON.

```javascript
exportChecklist(checklistId: string): string
```

#### Events Emitted

- `checklist:opened` - When checklist opens
- `checklist:itemToggled` - When item is toggled
- `checklist:completed` - When all items are checked

---

### DiagnosticsManager

**Module**: `js/features/DiagnosticsManager.js`

**Purpose**: Interactive troubleshooting wizards.

#### Constructor

```javascript
constructor(dependencies: {
    eventBus: EventBus,
    modalManager: ModalManager
})
```

**Dependencies**: `eventBus`, `modalManager`

#### Public Methods

##### `init()`

Initializes diagnostics manager.

```javascript
init(): void
```

##### `start(diagnosticId)`

Starts a diagnostic wizard.

```javascript
start(diagnosticId: string): void
```

**Example**:
```javascript
diagnosticsManager.start('wifi-troubleshooting');
```

##### `nextStep()`

Advances to the next step.

```javascript
nextStep(): void
```

##### `previousStep()`

Goes back to the previous step.

```javascript
previousStep(): void
```

##### `selectOption(optionIndex)`

Selects an option in the current step.

```javascript
selectOption(optionIndex: number): void
```

##### `restart()`

Restarts the current diagnostic.

```javascript
restart(): void
```

#### Events Emitted

- `diagnostic:started` - When diagnostic starts
- `diagnostic:stepChanged` - When step changes
- `diagnostic:completed` - When diagnostic completes

---

### GuideManager

**Module**: `js/features/GuideManager.js`

**Purpose**: Guide display and navigation.

#### Constructor

```javascript
constructor(dependencies: {
    eventBus: EventBus,
    modalManager: ModalManager
})
```

**Dependencies**: `eventBus`, `modalManager`

#### Public Methods

##### `init()`

Initializes guide manager.

```javascript
init(): void
```

##### `openGuide(guideId)`

Opens a guide modal.

```javascript
openGuide(guideId: string): void
```

**Example**:
```javascript
guideManager.openGuide('ipad-enrollment');
```

##### `closeGuide()`

Closes the current guide.

```javascript
closeGuide(): void
```

---

### DataManager

**Module**: `js/features/DataManager.js`

**Purpose**: User data management for GDPR compliance.

#### Constructor

```javascript
constructor(dependencies: {
    eventBus: EventBus,
    stateManager: StateManager,
    modalManager: ModalManager
})
```

**Dependencies**: `eventBus`, `stateManager`, `modalManager`

#### Public Methods

##### `init()`

Initializes data manager.

```javascript
init(): void
```

##### `viewData()`

Opens modal showing all stored user data.

```javascript
viewData(): void
```

##### `exportData()`

Exports user data as JSON file.

```javascript
exportData(): void
```

##### `confirmDelete()`

Shows confirmation dialog for data deletion.

```javascript
confirmDelete(): void
```

##### `deleteAllData()`

Deletes all user data from localStorage.

```javascript
deleteAllData(): void
```

#### Events Emitted

- `data:exported` - When data is exported
- `data:deleted` - When data is deleted

---

## Chatbot APIs

### ChatbotCore

**Module**: `js/chatbot/ChatbotCore.js`

**Purpose**: Main orchestrator for the AI chatbot.

#### Constructor

```javascript
constructor(dependencies: {
    apiKeyManager: ApiKeyManager,
    geminiClient?: GeminiClient,
    ragEngine: RAGEngine,
    chatUI: ChatUI,
    rateLimiter: RateLimiter,
    eventBus: EventBus
})
```

**Dependencies**: `apiKeyManager`, `ragEngine`, `chatUI`, `rateLimiter`, `eventBus`

#### Public Methods

##### `init()`

Initializes the chatbot.

```javascript
async init(): Promise<void>
```

**Example**:
```javascript
await chatbotCore.init();
```

##### `clearHistory()`

Clears the conversation history.

```javascript
clearHistory(): void
```

#### Properties

##### `isProcessing`

Whether the chatbot is currently processing a message.

```javascript
get isProcessing(): boolean
```

##### `isInitialized`

Whether the chatbot has been initialized.

```javascript
get isInitialized(): boolean
```

##### `eventBus`

Gets the event bus for external subscriptions.

```javascript
get eventBus(): EventBus
```

#### Events Emitted

- `chatbot:ready` - When chatbot is initialized
- `chatbot:opened` - When chat panel opens
- `chatbot:closed` - When chat panel closes
- `chatbot:messageSent` - When user sends message
- `chatbot:messageReceived` - When bot responds
- `chatbot:messageError` - When error occurs
- `chatbot:apiKeyChanged` - When API key is updated
- `chatbot:rateLimitWarning` - When approaching rate limit
- `chatbot:rateLimitExceeded` - When rate limit exceeded

---

### ApiKeyManager

**Module**: `js/chatbot/ApiKeyManager.js`

**Purpose**: Secure API key storage and validation.

#### Constructor

```javascript
constructor(dependencies: {
    encryptionService: EncryptionService,
    validatorChain: ApiKeyValidatorChain
})
```

**Dependencies**: `encryptionService`, `validatorChain`

#### Public Methods

##### `loadSettings()`

Loads API key settings from storage.

```javascript
async loadSettings(): Promise<void>
```

##### `saveKey(apiKey, pinned, sessionOnly)`

Saves an API key.

```javascript
async saveKey(apiKey: string, pinned: boolean, sessionOnly: boolean): Promise<void>
```

**Example**:
```javascript
await apiKeyManager.saveKey('AIza...', true, false);
```

##### `validateFormat(apiKey)`

Validates API key format.

```javascript
validateFormat(apiKey: string): ValidationResult
```

**Returns**: `{ valid: boolean, error?: string, strength?: string }`

##### `testKey(apiKey)`

Tests API key with actual API call.

```javascript
async testKey(apiKey: string): Promise<{ valid: boolean, error?: string }>
```

##### `removeKey()`

Removes the saved API key.

```javascript
async removeKey(): Promise<void>
```

##### `getStatusDescription()`

Gets human-readable status of API key.

```javascript
getStatusDescription(): string
```

#### Properties

##### `hasKey`

Whether an API key is available.

```javascript
get hasKey(): boolean
```

##### `apiKey`

Gets the decrypted API key.

```javascript
get apiKey(): string | null
```

##### `isPinned`

Whether the API key is pinned (permanent).

```javascript
get isPinned(): boolean
```

##### `isSessionOnly`

Whether the API key is session-only (not persisted).

```javascript
get isSessionOnly(): boolean
```

---

### EncryptionService

**Module**: `js/chatbot/EncryptionService.js`

**Purpose**: AES-256-GCM encryption for API keys.

#### Public Methods

##### `encrypt(data)`

Encrypts data using AES-256-GCM.

```javascript
async encrypt(data: string): Promise<string>
```

**Returns**: Base64-encoded encrypted data with IV

##### `decrypt(encryptedData)`

Decrypts encrypted data.

```javascript
async decrypt(encryptedData: string): Promise<string>
```

**Throws**: Error if decryption fails

---

### GeminiClient

**Module**: `js/chatbot/GeminiClient.js`

**Purpose**: Google Gemini API client wrapper.

#### Constructor

```javascript
new GeminiClient(apiKey: string, config?: { model?: string, temperature?: number })
```

**Parameters**:
- `apiKey`: Google Gemini API key
- `config.model`: Model name (default: `'gemini-1.5-flash'`)
- `config.temperature`: Response creativity (default: `0.7`)

#### Public Methods

##### `sendMessage(message, systemPrompt, context)`

Sends a message to Gemini API.

```javascript
async sendMessage(
    message: string,
    systemPrompt?: string,
    context?: string
): Promise<string>
```

**Returns**: AI response text

**Example**:
```javascript
const response = await geminiClient.sendMessage(
    'How do I enroll an iPad?',
    systemPrompt,
    ragContext
);
```

##### `clearHistory()`

Clears conversation history.

```javascript
clearHistory(): void
```

---

### RAGEngine

**Module**: `js/chatbot/RAGEngine.js`

**Purpose**: Retrieval-Augmented Generation for document search.

#### Public Methods

##### `loadDocumentation()`

Loads and indexes documentation.

```javascript
async loadDocumentation(): Promise<void>
```

##### `search(query, limit)`

Searches for relevant documents.

```javascript
search(query: string, limit?: number): Array<{ content: string, title: string, similarity: number }>
```

**Parameters**:
- `query`: Search query
- `limit`: Maximum results (default: 5)

**Example**:
```javascript
const docs = ragEngine.search('iPad enrollment', 3);
```

##### `buildContext(documents)`

Builds context string from documents.

```javascript
buildContext(documents: Array<{ content: string, title: string }>): string
```

##### `generateOfflineResponse(query, documents)`

Generates response from documents without AI.

```javascript
generateOfflineResponse(query: string, documents: Array): string
```

#### Properties

##### `metadata`

Gets documentation metadata.

```javascript
get metadata(): { version: string, lastUpdated: string, articleCount: number }
```

##### `documentCount`

Gets the number of indexed documents.

```javascript
get documentCount(): number
```

---

### RateLimiter

**Module**: `js/chatbot/RateLimiter.js`

**Purpose**: Token bucket rate limiter for API calls.

#### Constructor

```javascript
new RateLimiter(maxCalls: number, windowMs: number)
```

**Parameters**:
- `maxCalls`: Maximum calls allowed in window
- `windowMs`: Time window in milliseconds

**Example**:
```javascript
const limiter = new RateLimiter(10, 60000); // 10 calls per minute
```

#### Public Methods

##### `canMakeCall()`

Checks if a call is allowed.

```javascript
canMakeCall(): { allowed: boolean, waitTime?: number }
```

**Returns**:
- `allowed`: Whether call is allowed
- `waitTime`: Seconds to wait if not allowed

**Example**:
```javascript
const check = limiter.canMakeCall();
if (check.allowed) {
    await makeApiCall();
} else {
    console.log(`Wait ${check.waitTime} seconds`);
}
```

##### `getRemainingCalls()`

Gets remaining calls in current window.

```javascript
getRemainingCalls(): number
```

##### `reset()`

Resets the rate limiter.

```javascript
reset(): void
```

---

## View APIs

### BaseView

**Module**: `js/views/BaseView.js`

**Purpose**: Abstract base class for all views.

#### Constructor

```javascript
constructor(dependencies: { eventBus: EventBus, knowledgeBase?: Object })
```

**Dependencies**: `eventBus`, `knowledgeBase` (optional)

#### Abstract Methods

##### `render()`

Renders the view (must be implemented by subclasses).

```javascript
abstract render(): string
```

#### Protected Methods

##### `renderGuideCard(id, guide)`

Renders a guide card component.

```javascript
renderGuideCard(id: string, guide: Object): string
```

##### `renderSectionHeader(title, subtitle)`

Renders a section header.

```javascript
renderSectionHeader(title: string, subtitle: string): string
```

##### `renderInfoBox(options)`

Renders an info box component.

```javascript
renderInfoBox(options: {
    icon: string,
    title: string,
    content: string,
    style?: string
}): string
```

##### `renderContentTitle(icon, title)`

Renders a content title with icon.

```javascript
renderContentTitle(icon: string, title: string): string
```

##### `wrapSection(content)`

Wraps content in a section container.

```javascript
wrapSection(content: string): string
```

##### `escapeHtml(text)`

Escapes HTML special characters.

```javascript
escapeHtml(text: string): string
```

---

## UI APIs

### ToastManager

**Module**: `js/ui/ToastManager.js`

**Purpose**: Toast notification system.

#### Public Methods

##### `show(message, type, duration)`

Shows a toast notification.

```javascript
show(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number): void
```

**Parameters**:
- `message`: Notification text
- `type`: Toast type (default: `'info'`)
- `duration`: Display duration in ms (default: 3000)

**Example**:
```javascript
toastManager.show('Settings saved!', 'success', 3000);
```

##### `hide()`

Hides the current toast.

```javascript
hide(): void
```

---

### ConnectionStatus

**Module**: `js/ui/ConnectionStatus.js`

**Purpose**: Network connection status monitor.

#### Constructor

```javascript
constructor(dependencies: { eventBus: EventBus, toastManager: ToastManager })
```

**Dependencies**: `eventBus`, `toastManager`

#### Events Emitted

- `connection:online` - When connection is restored
- `connection:offline` - When connection is lost

---

## Events Reference

### Application Events (AppEvents)

```javascript
// Navigation
NAVIGATION_CHANGED: 'navigation:changed'
NAVIGATION_BEFORE_CHANGE: 'navigation:beforeChange'

// Theme
THEME_CHANGED: 'theme:changed'
THEME_LOADED: 'theme:loaded'

// Modal
MODAL_OPENED: 'modal:opened'
MODAL_CLOSED: 'modal:closed'

// Search
SEARCH_QUERY: 'search:query'
SEARCH_RESULTS: 'search:results'
SEARCH_CLEARED: 'search:cleared'

// Diagnostics
DIAGNOSTIC_STARTED: 'diagnostic:started'
DIAGNOSTIC_STEP_CHANGED: 'diagnostic:stepChanged'
DIAGNOSTIC_COMPLETED: 'diagnostic:completed'

// Checklists
CHECKLIST_OPENED: 'checklist:opened'
CHECKLIST_ITEM_TOGGLED: 'checklist:itemToggled'
CHECKLIST_COMPLETED: 'checklist:completed'

// Data
DATA_EXPORTED: 'data:exported'
DATA_DELETED: 'data:deleted'

// Lifecycle
APP_READY: 'app:ready'
APP_ERROR: 'app:error'

// Connection
CONNECTION_ONLINE: 'connection:online'
CONNECTION_OFFLINE: 'connection:offline'
```

### Chat Events (ChatEvents)

```javascript
READY: 'chatbot:ready'
CHAT_OPENED: 'chatbot:opened'
CHAT_CLOSED: 'chatbot:closed'
MESSAGE_SENT: 'chatbot:messageSent'
MESSAGE_RECEIVED: 'chatbot:messageReceived'
MESSAGE_ERROR: 'chatbot:messageError'
MODAL_OPENED: 'chatbot:modalOpened'
MODAL_CLOSED: 'chatbot:modalClosed'
API_KEY_CHANGED: 'chatbot:apiKeyChanged'
API_ERROR: 'chatbot:apiError'
RATE_LIMIT_WARNING: 'chatbot:rateLimitWarning'
RATE_LIMIT_EXCEEDED: 'chatbot:rateLimitExceeded'
```

---

## Type Definitions

### Common Types

```typescript
// Validation Result
type ValidationResult = {
    valid: boolean;
    error?: string;
    validatorName?: string;
    strength?: 'weak' | 'medium' | 'strong';
    context?: Object;
};

// Search Result
type SearchResult = {
    type: 'guide' | 'diagnostic';
    id: string;
    icon: string;
    title: string;
    category: string;
};

// Subscription
type Subscription = {
    event: string;
    callback: Function;
    unsubscribe: () => void;
};

// Lifecycle
type Lifecycle = 'singleton' | 'transient' | 'scoped';

// Registration Options
type RegistrationOptions = {
    lifecycle?: Lifecycle;
    dependencies?: string[];
    factory?: boolean;
};

// Section Metadata
type SectionMetadata = {
    name: string;
    displayName?: string;
    icon?: string;
    order?: number;
    hidden?: boolean;
};
```

---

## Additional UI APIs

### OnboardingTour

**Module**: `js/ui/OnboardingTour.js`

**Purpose**: Interactive first-time user guide with element highlighting.

#### Constructor

```javascript
new OnboardingTour()
```

#### Public Methods

##### `shouldShow()`

Checks if tour should be shown (first-time visit).

```javascript
shouldShow(): boolean
```

**Returns**: `true` if tour has not been completed before

##### `start()`

Starts the onboarding tour.

```javascript
start(): void
```

**Example**:
```javascript
const tour = new OnboardingTour();
if (tour.shouldShow()) {
    tour.start();
}
```

##### `reset()`

Resets the tour (for testing purposes).

```javascript
reset(): void
```

**Example**:
```javascript
tour.reset(); // Tour will show again on next page load
```

#### Tour Steps

The tour includes 7 steps:
1. Welcome - Dashboard hero section
2. Navigation - Sidebar navigation
3. Quick Access - Quick access grid
4. Search - Search container
5. Chatbot - Chatbot FAB button
6. Theme Toggle - Theme selector
7. Completion - Ready to start

#### Features

- Element highlighting with overlay
- Navigation controls (Next, Previous, Skip)
- LocalStorage persistence
- Responsive positioning
- Keyboard navigation (Arrow keys, Escape)

---

### TooltipManager

**Module**: `js/ui/TooltipManager.js`

**Purpose**: Lightweight tooltip system with intelligent viewport-aware positioning.

#### Constructor

```javascript
new TooltipManager(options?: {
    delay?: number,
    offset?: number,
    className?: string,
    preferredPlacement?: 'top' | 'bottom' | 'left' | 'right'
})
```

**Parameters**:
- `options.delay`: Delay before showing tooltip in ms (default: 300)
- `options.offset`: Offset from trigger element in px (default: 8)
- `options.className`: Additional CSS class for tooltips
- `options.preferredPlacement`: Preferred position (default: `'top'`)

#### Public Methods

##### `show(trigger)`

Shows tooltip for a trigger element.

```javascript
show(trigger: HTMLElement): void
```

##### `hide()`

Hides the active tooltip.

```javascript
hide(): void
```

##### `refresh()`

Refreshes tooltips after dynamic content changes.

```javascript
refresh(): void
```

##### `destroy()`

Destroys the tooltip manager.

```javascript
destroy(): void
```

#### Usage with Data Attributes

```html
<!-- Basic tooltip -->
<button data-tooltip="Click to save">Save</button>

<!-- With placement -->
<button data-tooltip="Settings" data-tooltip-placement="right">
    <i class="ri-settings-line"></i>
</button>

<!-- With variant -->
<button data-tooltip="Delete item" data-tooltip-variant="error">Delete</button>

<!-- Multiline tooltip -->
<button data-tooltip="This is a longer tooltip text" data-tooltip-multiline>Info</button>
```

#### Features

- Automatic viewport-aware positioning
- 300ms delay before showing
- Smooth fade-in animation
- Keyboard accessible (ESC to close)
- Mobile support (tap to show/hide)
- ARIA attributes for screen readers

---

### FocusTrap

**Module**: `js/ui/FocusTrap.js`

**Purpose**: Modal focus management for WCAG 2.1 AA compliance.

#### Constructor

```javascript
new FocusTrap(container: HTMLElement, options?: {
    initialFocus?: string | HTMLElement,
    returnFocusOnClose?: boolean,
    escapeDeactivates?: boolean,
    clickOutsideDeactivates?: boolean,
    onActivate?: Function,
    onDeactivate?: Function
})
```

**Parameters**:
- `container`: The modal container element
- `options.initialFocus`: Element or selector to focus on activation
- `options.returnFocusOnClose`: Restore focus to trigger element (default: true)
- `options.escapeDeactivates`: Close on Escape key (default: true)
- `options.clickOutsideDeactivates`: Close on click outside (default: false)
- `options.onActivate`: Callback when trap activates
- `options.onDeactivate`: Callback when trap deactivates

#### Public Methods

##### `activate()`

Activates the focus trap.

```javascript
activate(): void
```

**Example**:
```javascript
const modal = document.getElementById('myModal');
const trap = new FocusTrap(modal);
trap.activate();
```

##### `deactivate()`

Deactivates the focus trap and restores focus.

```javascript
deactivate(): void
```

##### `isActive()`

Checks if trap is currently active.

```javascript
isActive(): boolean
```

##### `updateTrap()`

Updates focusable elements when content changes.

```javascript
updateTrap(): void
```

##### `pause()`

Pauses the focus trap without deactivating.

```javascript
pause(): void
```

##### `resume()`

Resumes a paused focus trap.

```javascript
resume(): void
```

##### `destroy()`

Destroys the focus trap and cleans up.

```javascript
destroy(): void
```

---

### FocusTrapManager

**Module**: `js/ui/FocusTrap.js`

**Purpose**: Global manager for handling multiple focus traps.

#### Constructor

```javascript
new FocusTrapManager()
```

#### Public Methods

##### `createTrap(id, container, options)`

Creates and registers a focus trap.

```javascript
createTrap(
    id: string,
    container: HTMLElement | string,
    options?: FocusTrapOptions
): FocusTrap
```

**Example**:
```javascript
const manager = new FocusTrapManager();
manager.createTrap('settings-modal', '#settingsModal', {
    escapeDeactivates: true
});
```

##### `activate(id)`

Activates a trap by ID.

```javascript
activate(id: string): void
```

##### `deactivate(id)`

Deactivates a trap by ID.

```javascript
deactivate(id: string): void
```

##### `getTrap(id)`

Gets a trap by ID.

```javascript
getTrap(id: string): FocusTrap | undefined
```

##### `removeTrap(id)`

Removes a trap from the manager.

```javascript
removeTrap(id: string): void
```

##### `deactivateAll()`

Deactivates all traps.

```javascript
deactivateAll(): void
```

##### `destroyAll()`

Destroys all traps.

```javascript
destroyAll(): void
```

#### Singleton Export

```javascript
import { focusTrapManager } from './FocusTrap.js';
focusTrapManager.activate('myModal');
```

---

## Additional Pattern APIs

### RenderStrategy

**Module**: `js/patterns/RenderStrategy.js`

**Purpose**: Strategy Pattern for flexible view rendering.

#### Abstract Class: RenderStrategy

Base class for all render strategies.

```javascript
abstract class RenderStrategy {
    name: string;
    abstract render(container: HTMLElement, data: Object, options?: Object): void | string;
    dispose(): void;
}
```

---

### TemplateRenderStrategy

**Module**: `js/patterns/RenderStrategy.js`

**Purpose**: Template-based rendering using template functions.

#### Constructor

```javascript
new TemplateRenderStrategy(
    templateFn: (data: Object) => string,
    options?: { sanitize?: boolean }
)
```

**Parameters**:
- `templateFn`: Function that returns HTML string from data
- `options.sanitize`: Sanitize output with DOMPurify (default: true)

#### Public Methods

##### `render(container, data, options)`

Renders the template to a container.

```javascript
render(container: HTMLElement, data: Object, options?: Object): void
```

##### `renderToString(data)`

Returns rendered HTML without modifying DOM.

```javascript
renderToString(data: Object): string
```

**Example**:
```javascript
const template = (data) => `
    <div class="card">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
    </div>
`;

const strategy = new TemplateRenderStrategy(template);
strategy.render(container, { title: 'Hello', description: 'World' });
```

---

### ComponentRenderStrategy

**Module**: `js/patterns/RenderStrategy.js`

**Purpose**: Component-based rendering using custom elements.

#### Constructor

```javascript
new ComponentRenderStrategy(
    tagName: string,
    options?: {
        attributes?: string[],
        clearContainer?: boolean
    }
)
```

**Parameters**:
- `tagName`: Custom element tag name
- `options.attributes`: Data properties to set as attributes
- `options.clearContainer`: Clear container before rendering (default: true)

#### Public Methods

##### `render(container, data, options)`

Creates and renders a component.

```javascript
render(container: HTMLElement, data: Object, options?: Object): HTMLElement
```

**Example**:
```javascript
const strategy = new ComponentRenderStrategy('my-card', {
    attributes: ['title', 'description']
});
strategy.render(container, { title: 'Hello', description: 'World' });
// Creates: <my-card title="Hello" description="World"></my-card>
```

---

### FragmentRenderStrategy

**Module**: `js/patterns/RenderStrategy.js`

**Purpose**: Performance-optimized rendering using DocumentFragment.

#### Constructor

```javascript
new FragmentRenderStrategy(
    builder: (data: Object, fragment: DocumentFragment) => void,
    options?: { clearContainer?: boolean }
)
```

**Parameters**:
- `builder`: Function that populates the fragment
- `options.clearContainer`: Clear container before appending (default: true)

#### Public Methods

##### `render(container, data, options)`

Renders using DocumentFragment.

```javascript
render(container: HTMLElement, data: Object, options?: Object): void
```

**Example**:
```javascript
const builder = (data, fragment) => {
    data.items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.name;
        fragment.appendChild(div);
    });
};

const strategy = new FragmentRenderStrategy(builder);
strategy.render(container, { items: [...] });
```

---

### DiffRenderStrategy

**Module**: `js/patterns/RenderStrategy.js`

**Purpose**: Diff-based rendering that only updates changed elements.

#### Constructor

```javascript
new DiffRenderStrategy(templateFn: (data: Object) => string)
```

#### Public Methods

##### `render(container, data, options)`

Renders with diff comparison.

```javascript
render(
    container: HTMLElement,
    data: Object,
    options?: { force?: boolean }
): boolean
```

**Returns**: `true` if DOM was updated

**Example**:
```javascript
const strategy = new DiffRenderStrategy((data) => `<div>${data.value}</div>`);
strategy.render(container, { value: 1 }); // Full render, returns true
strategy.render(container, { value: 1 }); // No change, returns false
strategy.render(container, { value: 2 }); // Diff update, returns true
```

---

### RenderContext

**Module**: `js/patterns/RenderStrategy.js`

**Purpose**: Manages render strategy selection and lifecycle.

#### Constructor

```javascript
new RenderContext(strategy?: RenderStrategy)
```

#### Public Methods

##### `setStrategy(strategy)`

Sets the current render strategy.

```javascript
setStrategy(strategy: RenderStrategy): RenderContext
```

##### `getStrategy()`

Gets the current strategy.

```javascript
getStrategy(): RenderStrategy | null
```

##### `render(container, data, options)`

Renders using the current strategy.

```javascript
render(container: HTMLElement, data: Object, options?: Object): any
```

##### `dispose()`

Disposes the current strategy.

```javascript
dispose(): void
```

**Example**:
```javascript
const context = new RenderContext(new TemplateRenderStrategy(template));
context.render(container, data);

// Switch strategy at runtime
context.setStrategy(new ComponentRenderStrategy('my-component'));
context.render(container, data);
```

---

## Bootstrap API

### createContainer

**Module**: `js/core/bootstrap.js`

**Purpose**: IoC container factory - Single source of truth for dependency injection.

```javascript
createContainer(config?: {
    debug?: boolean,
    rateLimitCalls?: number,
    rateLimitWindow?: number
}): Container
```

**Parameters**:
- `config.debug`: Enable container debug logging (default: false)
- `config.rateLimitCalls`: Rate limiter max calls (default: 10)
- `config.rateLimitWindow`: Rate limiter window in ms (default: 60000)

**Returns**: Configured `Container` instance with all application services registered

**Example**:
```javascript
import { createContainer } from './core/bootstrap.js';

const container = createContainer({ debug: true });
const eventBus = container.resolve('eventBus');
const themeManager = container.resolve('themeManager');
```

#### Registered Services

| Service Name | Class | Lifecycle | Dependencies |
|-------------|-------|-----------|--------------|
| eventBus | EventBus | singleton | - |
| toastManager | ToastManager | singleton | - |
| connectionStatus | ConnectionStatus | singleton | eventBus, toastManager |
| stateManager | StateManager | singleton | eventBus |
| themeManager | ThemeManager | singleton | eventBus, stateManager |
| modalManager | ModalManager | singleton | eventBus |
| sidebarManager | SidebarManager | singleton | eventBus, stateManager |
| navigationManager | NavigationManager | singleton | eventBus, stateManager |
| sectionRegistry | SectionRegistry | singleton | - |
| validatorChain | ApiKeyValidatorChain | singleton | - |
| searchEngine | SearchEngine | singleton | eventBus |
| diagnosticsManager | DiagnosticsManager | singleton | eventBus, modalManager |
| checklistManager | ChecklistManager | singleton | eventBus, stateManager, modalManager |
| guideManager | GuideManager | singleton | eventBus, modalManager |
| dataManager | DataManager | singleton | eventBus, stateManager, modalManager |
| encryptionService | EncryptionService | singleton | - |
| rateLimiter | RateLimiter | singleton | - |
| apiKeyManager | ApiKeyManager | singleton | encryptionService, validatorChain |
| ragEngine | RAGEngine | singleton | - |
| chatUI | ChatUI | singleton | - |
| chatEventBus | EventBus | singleton | - |
| geminiClientFactory | Function | singleton | - |
| chatbotCore | ChatbotCore | singleton | apiKeyManager, ragEngine, chatUI, rateLimiter, chatEventBus, geminiClientFactory |

---

### createTestContainer

**Module**: `js/core/bootstrap.js`

**Purpose**: Creates a test container with mock services for unit testing.

```javascript
createTestContainer(
    mocks?: { [serviceName: string]: any },
    config?: Object
): Container
```

**Parameters**:
- `mocks`: Object mapping service names to mock instances
- `config`: Container configuration (passed to createContainer)

**Returns**: Child scope container with mocks applied

**Example**:
```javascript
import { createTestContainer } from './core/bootstrap.js';

const mockEventBus = {
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn()
};

const container = createTestContainer({
    eventBus: mockEventBus
});

const themeManager = container.resolve('themeManager');
// themeManager uses mockEventBus instead of real EventBus
```

---

### SERVICE_REGISTRY

**Module**: `js/core/bootstrap.js`

**Purpose**: Documentation constant listing all registered services.

```javascript
const SERVICE_REGISTRY: {
    [serviceName: string]: {
        class: string,
        lifecycle: 'singleton' | 'transient' | 'scoped',
        dependencies: string[],
        description: string
    }
}
```

**Example**:
```javascript
import { SERVICE_REGISTRY } from './core/bootstrap.js';

console.log(SERVICE_REGISTRY.themeManager);
// {
//   class: 'ThemeManager',
//   lifecycle: 'singleton',
//   dependencies: ['eventBus', 'stateManager'],
//   description: 'Theme switching (dark/light mode)'
// }
```

---

## ChatUI (Extended)

**Module**: `js/chatbot/ChatUI.js`

**Purpose**: Manages the chatbot user interface with XSS protection.

#### Constructor

```javascript
new ChatUI()
```

#### Properties

##### `isOpen`

Whether the chat panel is currently open.

```javascript
get isOpen(): boolean
```

#### Public Methods

##### `getInputValue()`

Gets the current input value (trimmed).

```javascript
getInputValue(): string
```

##### `clearInput()`

Clears the input field.

```javascript
clearInput(): void
```

##### `toggleChat()`

Toggles the chat panel visibility.

```javascript
toggleChat(): boolean
```

**Returns**: New open state

##### `openChat()`

Opens the chat panel.

```javascript
openChat(): void
```

##### `closeChat()`

Closes the chat panel.

```javascript
closeChat(): void
```

##### `openApiModal()`

Opens the API key configuration modal.

```javascript
openApiModal(): void
```

##### `closeApiModal()`

Closes the API key configuration modal.

```javascript
closeApiModal(): void
```

##### `addUserMessage(text)`

Adds a user message to the chat.

```javascript
addUserMessage(text: string): void
```

##### `addBotMessage(text)`

Adds a bot message with markdown formatting.

```javascript
addBotMessage(text: string): void
```

**Supported Markdown**:
- Bold: `**text**`
- Links: `[text](url)`
- Lists: `- item` or `1. item`

##### `showTyping()`

Shows the typing indicator.

```javascript
showTyping(): void
```

##### `hideTyping()`

Hides the typing indicator.

```javascript
hideTyping(): void
```

##### `showSources(docs)`

Shows source documents under the last message.

```javascript
showSources(docs: Array<{title: string, category: string}>): void
```

##### `showRateLimitWarning(remaining)`

Shows rate limit warning.

```javascript
showRateLimitWarning(remaining: number): void
```

##### `updateApiStatus(message, type)`

Updates the API status message.

```javascript
updateApiStatus(message: string, type?: 'success' | 'error'): void
```

##### `updateValidationInfo(validation)`

Updates API key validation info display.

```javascript
updateValidationInfo(validation: {
    valid: boolean,
    error?: string,
    strength?: string
} | null): void
```

##### `updateApiKeyUI(settings)`

Updates API key UI with current settings.

```javascript
updateApiKeyUI(settings: {
    apiKey: string,
    isPinned: boolean,
    isSessionOnly: boolean,
    statusText: string
}): void
```

##### `getApiModalValues()`

Gets API modal form values.

```javascript
getApiModalValues(): {
    key: string,
    pinned: boolean,
    sessionOnly: boolean
}
```

##### `showDocsInfo(metadata)`

Shows documentation info footer.

```javascript
showDocsInfo(metadata: {
    lastUpdated: string,
    articleCount: number
}): void
```

---

**Version**: 3.1.0
**Last Updated**: 2025-01-15
**Maintained By**: Apple Edu Assistant Team

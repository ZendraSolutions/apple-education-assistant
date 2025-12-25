/**
 * @fileoverview IoC Container Bootstrap - Service Registration Configuration
 * @module core/bootstrap
 * @version 1.0.0
 * @author Jamf Assistant Team
 * @license MIT
 *
 * @description
 * Central configuration for the IoC container. This file is the SINGLE SOURCE
 * OF TRUTH for service instantiation in the application.
 *
 * All services are registered here with their:
 * - Dependencies (what they need to function)
 * - Lifecycle (singleton, transient, scoped)
 * - Factory configuration (if needed)
 *
 * This follows the Dependency Inversion Principle (DIP):
 * - High-level modules (app.js) don't import low-level modules directly
 * - Both depend on abstractions (container interface)
 * - Dependencies are injected, not instantiated
 *
 * Benefits:
 * 1. Single place to see all application services
 * 2. Easy to swap implementations (testing, different environments)
 * 3. Clear dependency graph
 * 4. Enables mocking for unit tests
 *
 * @example
 * // Production usage
 * import { createContainer } from './core/bootstrap.js';
 * const container = createContainer();
 * const app = container.resolve('app');
 *
 * @example
 * // Testing with mocks
 * import { createTestContainer } from './core/bootstrap.js';
 * const container = createTestContainer({
 *     eventBus: mockEventBus,
 *     stateManager: mockStateManager
 * });
 * const themeManager = container.resolve('themeManager');
 */

import { Container } from './Container.js';

// ============================================================================
// UTILS
// ============================================================================
import { EventBus } from '../utils/EventBus.js';

// ============================================================================
// UI MODULES
// ============================================================================
import { ToastManager } from '../ui/ToastManager.js';
import { ConnectionStatus } from '../ui/ConnectionStatus.js';

// ============================================================================
// CORE MODULES
// ============================================================================
import { StateManager } from './StateManager.js';
import { ThemeManager } from './ThemeManager.js';
import { NavigationManager } from './NavigationManager.js';
import { ModalManager } from './ModalManager.js';
import { SidebarManager } from './SidebarManager.js';

// ============================================================================
// FEATURES
// ============================================================================
import { SearchEngine } from '../features/SearchEngine.js';
import { ChecklistManager } from '../features/ChecklistManager.js';
import { DiagnosticsManager } from '../features/DiagnosticsManager.js';
import { GuideManager } from '../features/GuideManager.js';
import { DataManager } from '../features/DataManager.js';

// ============================================================================
// PATTERNS
// ============================================================================
import { SectionRegistry } from '../patterns/SectionRegistry.js';
import { createGeminiValidator } from '../patterns/ValidatorChain.js';

// ============================================================================
// CHATBOT MODULES
// ============================================================================
import { RateLimiter } from '../chatbot/RateLimiter.js';
import { EncryptionService } from '../chatbot/EncryptionService.js';
import { ApiKeyManager } from '../chatbot/ApiKeyManager.js';
import { GeminiClient } from '../chatbot/GeminiClient.js';
import { RAGEngine } from '../chatbot/RAGEngine.js';
import { ChatUI } from '../chatbot/ChatUI.js';
import { EventBus as ChatEventBus } from '../chatbot/EventBus.js';
import { ChatbotCore } from '../chatbot/ChatbotCore.js';

/**
 * Creates and configures the IoC container with all application services.
 * This is the SINGLE SOURCE OF TRUTH for dependency injection configuration.
 *
 * @param {Object} [config={}] - Optional configuration overrides
 * @param {boolean} [config.debug=false] - Enable container debug logging
 * @param {number} [config.rateLimitCalls=10] - Rate limiter max calls
 * @param {number} [config.rateLimitWindow=60000] - Rate limiter window in ms
 * @returns {Container} Configured container instance
 *
 * @example
 * const container = createContainer();
 * const eventBus = container.resolve('eventBus');
 * const themeManager = container.resolve('themeManager');
 */
export function createContainer(config = {}) {
    const {
        debug = false,
        rateLimitCalls = 10,
        rateLimitWindow = 60000
    } = config;

    const container = new Container({ debug });

    // ========================================================================
    // UTILS - Foundation services with no dependencies
    // ========================================================================

    container.register('eventBus', EventBus, {
        lifecycle: 'singleton'
    });

    // ========================================================================
    // UI - User interface components
    // ========================================================================

    container.register('toastManager', ToastManager, {
        lifecycle: 'singleton'
    });

    container.register('connectionStatus', ConnectionStatus, {
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'toastManager']
    });

    // ========================================================================
    // CORE - Application infrastructure
    // ========================================================================

    container.register('stateManager', StateManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus']
    });

    container.register('themeManager', ThemeManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager']
    });

    container.register('modalManager', ModalManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus']
    });

    container.register('sidebarManager', SidebarManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager']
    });

    // ========================================================================
    // PATTERNS - Design pattern implementations
    // ========================================================================

    container.register('sectionRegistry', (deps) => new SectionRegistry(), {
        lifecycle: 'singleton',
        factory: true
    });

    container.register('validatorChain', () => createGeminiValidator(), {
        lifecycle: 'singleton',
        factory: true
    });

    // ========================================================================
    // NAVIGATION - Depends on sectionRegistry
    // ========================================================================

    container.register('navigationManager', NavigationManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager']
    });

    // ========================================================================
    // FEATURES - Application features
    // ========================================================================

    // SearchEngine needs KnowledgeBase and Diagnostics which are global
    // We'll register them as instances in the app initialization
    container.register('searchEngine', SearchEngine, {
        lifecycle: 'singleton',
        dependencies: ['eventBus']
    });

    container.register('diagnosticsManager', DiagnosticsManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'modalManager']
    });

    container.register('checklistManager', ChecklistManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager', 'modalManager']
    });

    container.register('guideManager', GuideManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'modalManager']
    });

    container.register('dataManager', DataManager, {
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager', 'modalManager']
    });

    // ========================================================================
    // CHATBOT - AI assistant modules
    // ========================================================================

    container.register('encryptionService', EncryptionService, {
        lifecycle: 'singleton'
    });

    // RateLimiter with custom configuration
    container.register('rateLimiter', () => new RateLimiter(rateLimitCalls, rateLimitWindow), {
        lifecycle: 'singleton',
        factory: true
    });

    container.register('apiKeyManager', ApiKeyManager, {
        lifecycle: 'singleton',
        dependencies: ['encryptionService', 'validatorChain']
    });

    container.register('ragEngine', RAGEngine, {
        lifecycle: 'singleton'
    });

    container.register('chatUI', ChatUI, {
        lifecycle: 'singleton'
    });

    // Chatbot has its own EventBus for internal communication
    container.register('chatEventBus', ChatEventBus, {
        lifecycle: 'singleton'
    });

    // GeminiClient is created on-demand when API key is available
    // We don't register it as a standalone service since it requires runtime API key

    // GeminiClient factory - D-Principle: inject factory instead of class
    container.registerFactory('geminiClientFactory', () => {
        return (apiKey) => new GeminiClient(apiKey);
    }, true);

    // ChatbotCore needs 'eventBus' but we want to give it the chat-specific one
    // We use a factory to map chatEventBus -> eventBus
    // D-Principle: inject geminiClientFactory for runtime client creation
    container.register('chatbotCore', (deps) => {
        return new ChatbotCore({
            apiKeyManager: deps.apiKeyManager,
            ragEngine: deps.ragEngine,
            chatUI: deps.chatUI,
            rateLimiter: deps.rateLimiter,
            eventBus: deps.chatEventBus,
            geminiClientFactory: deps.geminiClientFactory
        });
    }, {
        lifecycle: 'singleton',
        factory: true,
        dependencies: ['apiKeyManager', 'ragEngine', 'chatUI', 'rateLimiter', 'chatEventBus', 'geminiClientFactory']
    });

    if (debug) {
        console.log('[Bootstrap] Container configured with', container.size, 'services');
        console.log('[Bootstrap] Registered:', container.listRegistered().join(', '));
    }

    return container;
}

/**
 * Creates a test container with mock services.
 * All non-mocked services are inherited from the production container.
 *
 * @param {Object} [mocks={}] - Services to mock (name -> instance)
 * @param {Object} [config={}] - Container configuration
 * @returns {Container} Test container with mocks applied
 *
 * @example
 * // Create test container with mock EventBus
 * const mockEventBus = {
 *     on: jest.fn(),
 *     emit: jest.fn(),
 *     off: jest.fn()
 * };
 *
 * const container = createTestContainer({
 *     eventBus: mockEventBus
 * });
 *
 * const themeManager = container.resolve('themeManager');
 * // themeManager will use mockEventBus instead of real EventBus
 *
 * @example
 * // Mock multiple services
 * const container = createTestContainer({
 *     eventBus: mockEventBus,
 *     stateManager: mockStateManager,
 *     modalManager: mockModalManager
 * });
 */
export function createTestContainer(mocks = {}, config = {}) {
    // Create base container
    const container = createContainer({ ...config, debug: false });

    // Create a child scope for isolation
    const testScope = container.createScope();

    // Register all mocks as instances
    for (const [name, mockInstance] of Object.entries(mocks)) {
        testScope.registerInstance(name, mockInstance);
    }

    return testScope;
}

/**
 * Service registry documentation for reference.
 * Lists all registered services and their dependencies.
 *
 * @constant {Object}
 */
export const SERVICE_REGISTRY = {
    // Utils
    eventBus: {
        class: 'EventBus',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'Pub/Sub event bus for inter-module communication'
    },

    // UI
    toastManager: {
        class: 'ToastManager',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'Toast notification system for user feedback'
    },
    connectionStatus: {
        class: 'ConnectionStatus',
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'toastManager'],
        description: 'Network connection status monitor with visual feedback'
    },

    // Core
    stateManager: {
        class: 'StateManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus'],
        description: 'Application state persistence and management'
    },
    themeManager: {
        class: 'ThemeManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager'],
        description: 'Theme switching (dark/light mode)'
    },
    modalManager: {
        class: 'ModalManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus'],
        description: 'Modal dialog management'
    },
    sidebarManager: {
        class: 'SidebarManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager'],
        description: 'Sidebar navigation state'
    },
    navigationManager: {
        class: 'NavigationManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager'],
        description: 'Section navigation and routing'
    },

    // Patterns
    sectionRegistry: {
        class: 'SectionRegistry',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'Registry pattern for view management'
    },
    validatorChain: {
        class: 'ApiKeyValidatorChain',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'Chain of Responsibility for API key validation'
    },

    // Features
    searchEngine: {
        class: 'SearchEngine',
        lifecycle: 'singleton',
        dependencies: ['eventBus'],
        description: 'Knowledge base search functionality'
    },
    diagnosticsManager: {
        class: 'DiagnosticsManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'modalManager'],
        description: 'Interactive troubleshooting wizards'
    },
    checklistManager: {
        class: 'ChecklistManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager', 'modalManager'],
        description: 'Checklist management and persistence'
    },
    guideManager: {
        class: 'GuideManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'modalManager'],
        description: 'Guide display and navigation'
    },
    dataManager: {
        class: 'DataManager',
        lifecycle: 'singleton',
        dependencies: ['eventBus', 'stateManager', 'modalManager'],
        description: 'User data export/delete (GDPR)'
    },

    // Chatbot
    encryptionService: {
        class: 'EncryptionService',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'AES-256-GCM encryption for API keys'
    },
    rateLimiter: {
        class: 'RateLimiter',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'API call rate limiting'
    },
    apiKeyManager: {
        class: 'ApiKeyManager',
        lifecycle: 'singleton',
        dependencies: ['encryptionService', 'validatorChain'],
        description: 'API key storage and validation'
    },
    ragEngine: {
        class: 'RAGEngine',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'Retrieval-Augmented Generation for documents'
    },
    chatUI: {
        class: 'ChatUI',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'Chatbot user interface management'
    },
    chatEventBus: {
        class: 'EventBus',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'Chatbot-specific event bus'
    },
    geminiClientFactory: {
        class: 'Function',
        lifecycle: 'singleton',
        dependencies: [],
        description: 'Factory function to create GeminiClient instances (D-Principle)'
    },
    chatbotCore: {
        class: 'ChatbotCore',
        lifecycle: 'singleton',
        dependencies: ['apiKeyManager', 'ragEngine', 'chatUI', 'rateLimiter', 'chatEventBus', 'geminiClientFactory'],
        description: 'Main chatbot orchestrator (factory maps chatEventBus -> eventBus)'
    }
};

export default createContainer;

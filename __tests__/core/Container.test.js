/**
 * @fileoverview Tests for Container - IoC Dependency Injection Container
 * @module __tests__/core/Container.test
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { Container } from '../../js/core/Container.js';
import { ServiceNotFoundError } from '../../js/core/errors/ServiceNotFoundError.js';
import { CircularDependencyError } from '../../js/core/errors/CircularDependencyError.js';

// Mock classes for testing
class MockEventBus {
    constructor() {
        this.events = new Map();
    }
}

class MockStateManager {
    constructor(deps) {
        this.eventBus = deps.eventBus;
    }
}

class MockThemeManager {
    constructor(deps) {
        this.eventBus = deps.eventBus;
        this.stateManager = deps.stateManager;
    }
}

// Service with circular dependency A -> B -> A
class ServiceA {
    constructor(deps) {
        this.serviceB = deps.serviceB;
    }
}

class ServiceB {
    constructor(deps) {
        this.serviceA = deps.serviceA;
    }
}

describe('Container', () => {
    let container;

    beforeEach(() => {
        container = new Container();
    });

    describe('constructor', () => {
        it('should create a new Container instance', () => {
            expect(container).toBeInstanceOf(Container);
        });

        it('should accept debug option', () => {
            const debugContainer = new Container({ debug: true });
            expect(debugContainer).toBeInstanceOf(Container);
        });

        it('should start with size 0', () => {
            expect(container.size).toBe(0);
        });
    });

    describe('register', () => {
        it('should register a service with default transient lifecycle', () => {
            container.register('eventBus', MockEventBus);
            expect(container.has('eventBus')).toBe(true);
            expect(container.size).toBe(1);
        });

        it('should register a service with singleton lifecycle', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'singleton' });
            expect(container.has('eventBus')).toBe(true);
        });

        it('should register a service with dependencies', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'singleton' });
            container.register('stateManager', MockStateManager, {
                lifecycle: 'singleton',
                dependencies: ['eventBus']
            });
            expect(container.has('stateManager')).toBe(true);
        });

        it('should register a factory function', () => {
            const factory = () => ({ value: 42 });
            container.register('config', factory, {
                lifecycle: 'singleton',
                factory: true
            });
            expect(container.has('config')).toBe(true);
        });

        it('should allow method chaining', () => {
            const result = container
                .register('eventBus', MockEventBus)
                .register('stateManager', MockStateManager);
            expect(result).toBe(container);
        });

        it('should throw TypeError if name is not a string', () => {
            expect(() => {
                container.register(123, MockEventBus);
            }).toThrow(TypeError);
        });

        it('should throw TypeError if name is empty', () => {
            expect(() => {
                container.register('', MockEventBus);
            }).toThrow(TypeError);
        });

        it('should throw TypeError if implementation is not a function', () => {
            expect(() => {
                container.register('test', 'not-a-function');
            }).toThrow(TypeError);
        });

        it('should allow overwriting a registration', () => {
            container.register('service', MockEventBus);
            container.register('service', MockStateManager); // Overwrite
            expect(container.has('service')).toBe(true);
        });
    });

    describe('registerInstance', () => {
        it('should register an existing instance', () => {
            const instance = new MockEventBus();
            container.registerInstance('eventBus', instance);
            expect(container.has('eventBus')).toBe(true);
        });

        it('should return the exact instance when resolved', () => {
            const instance = new MockEventBus();
            container.registerInstance('eventBus', instance);
            const resolved = container.resolve('eventBus');
            expect(resolved).toBe(instance);
        });

        it('should allow method chaining', () => {
            const result = container.registerInstance('test', {});
            expect(result).toBe(container);
        });

        it('should throw TypeError if name is not a string', () => {
            expect(() => {
                container.registerInstance(null, {});
            }).toThrow(TypeError);
        });

        it('should throw TypeError if name is empty', () => {
            expect(() => {
                container.registerInstance('', {});
            }).toThrow(TypeError);
        });
    });

    describe('resolve', () => {
        it('should resolve a simple service without dependencies', () => {
            container.register('eventBus', MockEventBus);
            const instance = container.resolve('eventBus');
            expect(instance).toBeInstanceOf(MockEventBus);
        });

        it('should resolve a service with dependencies', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'singleton' });
            container.register('stateManager', MockStateManager, {
                dependencies: ['eventBus']
            });
            const instance = container.resolve('stateManager');
            expect(instance).toBeInstanceOf(MockStateManager);
            expect(instance.eventBus).toBeInstanceOf(MockEventBus);
        });

        it('should resolve nested dependencies', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'singleton' });
            container.register('stateManager', MockStateManager, {
                lifecycle: 'singleton',
                dependencies: ['eventBus']
            });
            container.register('themeManager', MockThemeManager, {
                dependencies: ['eventBus', 'stateManager']
            });
            const instance = container.resolve('themeManager');
            expect(instance).toBeInstanceOf(MockThemeManager);
            expect(instance.eventBus).toBeInstanceOf(MockEventBus);
            expect(instance.stateManager).toBeInstanceOf(MockStateManager);
        });

        it('should cache singleton instances', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'singleton' });
            const instance1 = container.resolve('eventBus');
            const instance2 = container.resolve('eventBus');
            expect(instance1).toBe(instance2); // Same instance
        });

        it('should create new instances for transient lifecycle', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'transient' });
            const instance1 = container.resolve('eventBus');
            const instance2 = container.resolve('eventBus');
            expect(instance1).not.toBe(instance2); // Different instances
        });

        it('should throw ServiceNotFoundError for unregistered service', () => {
            expect(() => {
                container.resolve('unknownService');
            }).toThrow(ServiceNotFoundError);
        });

        it('should detect circular dependencies', () => {
            container.register('serviceA', ServiceA, { dependencies: ['serviceB'] });
            container.register('serviceB', ServiceB, { dependencies: ['serviceA'] });

            expect(() => {
                container.resolve('serviceA');
            }).toThrow(CircularDependencyError);
        });

        it('should resolve factory functions', () => {
            const factory = (deps) => ({ value: 42, deps });
            container.register('config', factory, {
                lifecycle: 'singleton',
                factory: true
            });
            const instance = container.resolve('config');
            expect(instance.value).toBe(42);
        });
    });

    describe('has', () => {
        it('should return true for registered service', () => {
            container.register('eventBus', MockEventBus);
            expect(container.has('eventBus')).toBe(true);
        });

        it('should return false for unregistered service', () => {
            expect(container.has('unknownService')).toBe(false);
        });

        it('should return true for registered instance', () => {
            container.registerInstance('test', {});
            expect(container.has('test')).toBe(true);
        });
    });

    describe('listRegistered', () => {
        it('should return empty array for new container', () => {
            expect(container.listRegistered()).toEqual([]);
        });

        it('should return all registered service names', () => {
            container.register('eventBus', MockEventBus);
            container.register('stateManager', MockStateManager);
            const services = container.listRegistered();
            expect(services).toContain('eventBus');
            expect(services).toContain('stateManager');
            expect(services.length).toBe(2);
        });
    });

    describe('tryResolve', () => {
        it('should return instance for existing service', () => {
            container.register('eventBus', MockEventBus);
            const instance = container.tryResolve('eventBus');
            expect(instance).toBeInstanceOf(MockEventBus);
        });

        it('should return null for non-existent service', () => {
            const instance = container.tryResolve('unknownService');
            expect(instance).toBeNull();
        });

        it('should throw CircularDependencyError even in tryResolve', () => {
            container.register('serviceA', ServiceA, { dependencies: ['serviceB'] });
            container.register('serviceB', ServiceB, { dependencies: ['serviceA'] });

            expect(() => {
                container.tryResolve('serviceA');
            }).toThrow(CircularDependencyError);
        });
    });

    describe('resolveMany', () => {
        it('should resolve multiple services at once', () => {
            container.register('eventBus', MockEventBus);
            container.register('stateManager', MockStateManager, {
                dependencies: ['eventBus']
            });
            const { eventBus, stateManager } = container.resolveMany(['eventBus', 'stateManager']);
            expect(eventBus).toBeInstanceOf(MockEventBus);
            expect(stateManager).toBeInstanceOf(MockStateManager);
        });

        it('should throw if any service is not found', () => {
            container.register('eventBus', MockEventBus);
            expect(() => {
                container.resolveMany(['eventBus', 'unknownService']);
            }).toThrow(ServiceNotFoundError);
        });
    });

    describe('createScope', () => {
        it('should create a child container', () => {
            const scope = container.createScope();
            expect(scope).toBeInstanceOf(Container);
            expect(scope).not.toBe(container);
        });

        it('should inherit parent registrations', () => {
            container.register('eventBus', MockEventBus);
            const scope = container.createScope();
            expect(scope.has('eventBus')).toBe(true);
        });

        it('should share singleton instances with parent', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'singleton' });
            const instance1 = container.resolve('eventBus');
            const scope = container.createScope();
            const instance2 = scope.resolve('eventBus');
            expect(instance1).toBe(instance2);
        });

        it('should allow local overrides', () => {
            container.register('eventBus', MockEventBus);
            const scope = container.createScope();
            const mockInstance = new MockEventBus();
            scope.registerInstance('eventBus', mockInstance);
            const resolved = scope.resolve('eventBus');
            expect(resolved).toBe(mockInstance);
        });
    });

    describe('clearInstances', () => {
        it('should clear singleton cache', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'singleton' });
            const instance1 = container.resolve('eventBus');
            container.clearInstances();
            const instance2 = container.resolve('eventBus');
            expect(instance1).not.toBe(instance2);
        });

        it('should not remove registrations', () => {
            container.register('eventBus', MockEventBus);
            container.clearInstances();
            expect(container.has('eventBus')).toBe(true);
        });
    });

    describe('reset', () => {
        it('should remove all registrations and instances', () => {
            container.register('eventBus', MockEventBus);
            container.register('stateManager', MockStateManager);
            container.reset();
            expect(container.size).toBe(0);
            expect(container.has('eventBus')).toBe(false);
            expect(container.has('stateManager')).toBe(false);
        });
    });

    describe('getRegistrationInfo', () => {
        it('should return registration details', () => {
            container.register('eventBus', MockEventBus, {
                lifecycle: 'singleton',
                dependencies: []
            });
            const info = container.getRegistrationInfo('eventBus');
            expect(info).toEqual({
                name: 'eventBus',
                lifecycle: 'singleton',
                dependencies: [],
                isFactory: false,
                isSingleton: false,
                hasImplementation: true
            });
        });

        it('should return null for non-existent service', () => {
            const info = container.getRegistrationInfo('unknownService');
            expect(info).toBeNull();
        });

        it('should show isSingleton as true after resolution', () => {
            container.register('eventBus', MockEventBus, { lifecycle: 'singleton' });
            container.resolve('eventBus');
            const info = container.getRegistrationInfo('eventBus');
            expect(info.isSingleton).toBe(true);
        });
    });

    describe('size', () => {
        it('should return correct count of registrations', () => {
            expect(container.size).toBe(0);
            container.register('service1', MockEventBus);
            expect(container.size).toBe(1);
            container.register('service2', MockStateManager);
            expect(container.size).toBe(2);
        });
    });

    describe('scoped lifecycle', () => {
        it('should cache instances within scope', () => {
            container.register('service', MockEventBus, { lifecycle: 'scoped' });
            const scope = container.createScope();
            const instance1 = scope.resolve('service');
            const instance2 = scope.resolve('service');
            expect(instance1).toBe(instance2);
        });

        it('should create different instances in different scopes', () => {
            container.register('service', MockEventBus, { lifecycle: 'scoped' });
            const scope1 = container.createScope();
            const scope2 = container.createScope();
            const instance1 = scope1.resolve('service');
            const instance2 = scope2.resolve('service');
            expect(instance1).not.toBe(instance2);
        });
    });
});

/**
 * @fileoverview Tests for SectionRegistry - Registry Pattern
 * @module __tests__/patterns/SectionRegistry.test
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { SectionRegistry } from '../../js/patterns/SectionRegistry.js';
import { DuplicateSectionError } from '../../js/patterns/errors/DuplicateSectionError.js';
import { SectionNotFoundError } from '../../js/patterns/errors/SectionNotFoundError.js';

// Mock view classes for testing
class MockView {
    constructor(deps = {}) {
        this.deps = deps;
        this.rendered = false;
    }

    render() {
        this.rendered = true;
        return '<div>Mock View</div>';
    }
}

class DashboardView extends MockView {
    constructor(deps) {
        super(deps);
        this.type = 'dashboard';
    }
}

class IPadsView extends MockView {
    constructor(deps) {
        super(deps);
        this.type = 'ipads';
    }
}

describe('SectionRegistry', () => {
    let registry;

    beforeEach(() => {
        registry = new SectionRegistry();
    });

    describe('constructor', () => {
        it('should create a new SectionRegistry instance', () => {
            expect(registry).toBeInstanceOf(SectionRegistry);
        });

        it('should accept strictMode option', () => {
            const strictRegistry = new SectionRegistry({ strictMode: true });
            expect(strictRegistry).toBeInstanceOf(SectionRegistry);
        });

        it('should start with size 0', () => {
            expect(registry.size).toBe(0);
        });
    });

    describe('register', () => {
        it('should register a section with factory', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            expect(registry.has('dashboard')).toBe(true);
            expect(registry.size).toBe(1);
        });

        it('should register a section with metadata', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps), {
                displayName: 'Dashboard',
                icon: 'ri-dashboard-line',
                order: 1
            });
            const metadata = registry.getMetadata('dashboard');
            expect(metadata.displayName).toBe('Dashboard');
            expect(metadata.icon).toBe('ri-dashboard-line');
            expect(metadata.order).toBe(1);
        });

        it('should allow method chaining', () => {
            const result = registry
                .register('dashboard', (deps) => new DashboardView(deps))
                .register('ipads', (deps) => new IPadsView(deps));
            expect(result).toBe(registry);
            expect(registry.size).toBe(2);
        });

        it('should throw TypeError if factory is not a function', () => {
            expect(() => {
                registry.register('test', 'not-a-function');
            }).toThrow(TypeError);
        });

        it('should throw DuplicateSectionError on duplicate registration', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            expect(() => {
                registry.register('dashboard', (deps) => new DashboardView(deps));
            }).toThrow(DuplicateSectionError);
        });

        it('should use section name as displayName if not provided', () => {
            registry.register('test', (deps) => new MockView(deps));
            const metadata = registry.getMetadata('test');
            expect(metadata.displayName).toBe('test');
        });

        it('should default order to 0', () => {
            registry.register('test', (deps) => new MockView(deps));
            const metadata = registry.getMetadata('test');
            expect(metadata.order).toBe(0);
        });

        it('should default hidden to false', () => {
            registry.register('test', (deps) => new MockView(deps));
            const metadata = registry.getMetadata('test');
            expect(metadata.hidden).toBe(false);
        });

        it('should store custom metadata fields', () => {
            registry.register('test', (deps) => new MockView(deps), {
                customField: 'custom value'
            });
            const metadata = registry.getMetadata('test');
            expect(metadata.customField).toBe('custom value');
        });
    });

    describe('unregister', () => {
        it('should remove a registered section', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            const removed = registry.unregister('dashboard');
            expect(removed).toBe(true);
            expect(registry.has('dashboard')).toBe(false);
        });

        it('should return false if section does not exist', () => {
            const removed = registry.unregister('nonexistent');
            expect(removed).toBe(false);
        });

        it('should decrease size', () => {
            registry.register('test', (deps) => new MockView(deps));
            expect(registry.size).toBe(1);
            registry.unregister('test');
            expect(registry.size).toBe(0);
        });
    });

    describe('has', () => {
        it('should return true for registered section', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            expect(registry.has('dashboard')).toBe(true);
        });

        it('should return false for unregistered section', () => {
            expect(registry.has('nonexistent')).toBe(false);
        });

        it('should return false after unregistering', () => {
            registry.register('test', (deps) => new MockView(deps));
            registry.unregister('test');
            expect(registry.has('test')).toBe(false);
        });
    });

    describe('get', () => {
        it('should create and return a view instance', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            const view = registry.get('dashboard');
            expect(view).toBeInstanceOf(DashboardView);
        });

        it('should pass dependencies to factory', () => {
            const deps = { eventBus: {}, stateManager: {} };
            registry.register('dashboard', (d) => new DashboardView(d));
            const view = registry.get('dashboard', deps);
            expect(view.deps).toBe(deps);
        });

        it('should use default dependencies if set', () => {
            const defaultDeps = { eventBus: {} };
            registry.setDefaultDependencies(defaultDeps);
            registry.register('dashboard', (deps) => new DashboardView(deps));
            const view = registry.get('dashboard');
            expect(view.deps).toBe(defaultDeps);
        });

        it('should return null in non-strict mode for missing section', () => {
            const view = registry.get('nonexistent');
            expect(view).toBeNull();
        });

        it('should throw SectionNotFoundError in strict mode', () => {
            const strictRegistry = new SectionRegistry({ strictMode: true });
            expect(() => {
                strictRegistry.get('nonexistent');
            }).toThrow(SectionNotFoundError);
        });

        it('should create new instance on each call', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            const view1 = registry.get('dashboard');
            const view2 = registry.get('dashboard');
            expect(view1).not.toBe(view2);
        });
    });

    describe('getMetadata', () => {
        it('should return metadata for registered section', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps), {
                displayName: 'Dashboard',
                icon: 'ri-dashboard-line'
            });
            const metadata = registry.getMetadata('dashboard');
            expect(metadata).toEqual({
                name: 'dashboard',
                displayName: 'Dashboard',
                icon: 'ri-dashboard-line',
                order: 0,
                hidden: false
            });
        });

        it('should return null for non-existent section', () => {
            const metadata = registry.getMetadata('nonexistent');
            expect(metadata).toBeNull();
        });

        it('should return a copy of metadata', () => {
            registry.register('test', (deps) => new MockView(deps), {
                displayName: 'Test'
            });
            const metadata1 = registry.getMetadata('test');
            metadata1.displayName = 'Modified';
            const metadata2 = registry.getMetadata('test');
            expect(metadata2.displayName).toBe('Test');
        });
    });

    describe('list', () => {
        it('should return empty array for new registry', () => {
            expect(registry.list()).toEqual([]);
        });

        it('should return all registered section names', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            registry.register('ipads', (deps) => new IPadsView(deps));
            const sections = registry.list();
            expect(sections).toContain('dashboard');
            expect(sections).toContain('ipads');
            expect(sections).toHaveLength(2);
        });

        it('should not include unregistered sections', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            registry.unregister('dashboard');
            expect(registry.list()).toEqual([]);
        });
    });

    describe('listWithMetadata', () => {
        beforeEach(() => {
            registry.register('dashboard', (deps) => new DashboardView(deps), {
                displayName: 'Dashboard',
                icon: 'ri-dashboard-line',
                order: 1
            });
            registry.register('ipads', (deps) => new IPadsView(deps), {
                displayName: 'iPads',
                icon: 'ri-tablet-line',
                order: 2,
                hidden: true
            });
            registry.register('macs', (deps) => new MockView(deps), {
                displayName: 'Macs',
                icon: 'ri-computer-line',
                order: 0
            });
        });

        it('should return metadata for all sections', () => {
            const list = registry.listWithMetadata({ includeHidden: true });
            expect(list).toHaveLength(3);
        });

        it('should exclude hidden sections by default', () => {
            const list = registry.listWithMetadata();
            expect(list).toHaveLength(2);
            expect(list.some(s => s.name === 'ipads')).toBe(false);
        });

        it('should include hidden sections when requested', () => {
            const list = registry.listWithMetadata({ includeHidden: true });
            expect(list.some(s => s.name === 'ipads')).toBe(true);
        });

        it('should sort by order by default', () => {
            const list = registry.listWithMetadata({ includeHidden: true });
            expect(list[0].name).toBe('macs');   // order: 0
            expect(list[1].name).toBe('dashboard'); // order: 1
            expect(list[2].name).toBe('ipads');  // order: 2
        });

        it('should not sort when sortByOrder is false', () => {
            const list = registry.listWithMetadata({
                includeHidden: true,
                sortByOrder: false
            });
            // Order depends on insertion, not metadata.order
            expect(list).toHaveLength(3);
        });
    });

    describe('clear', () => {
        it('should remove all sections', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            registry.register('ipads', (deps) => new IPadsView(deps));
            registry.clear();
            expect(registry.size).toBe(0);
            expect(registry.list()).toEqual([]);
        });

        it('should allow registering after clear', () => {
            registry.register('test', (deps) => new MockView(deps));
            registry.clear();
            registry.register('new', (deps) => new MockView(deps));
            expect(registry.size).toBe(1);
        });
    });

    describe('size', () => {
        it('should return correct count', () => {
            expect(registry.size).toBe(0);
            registry.register('test1', (deps) => new MockView(deps));
            expect(registry.size).toBe(1);
            registry.register('test2', (deps) => new MockView(deps));
            expect(registry.size).toBe(2);
            registry.unregister('test1');
            expect(registry.size).toBe(1);
        });
    });

    describe('forEach', () => {
        it('should iterate over all sections', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            registry.register('ipads', (deps) => new IPadsView(deps));

            const names = [];
            registry.forEach((section, name) => {
                names.push(name);
            });

            expect(names).toContain('dashboard');
            expect(names).toContain('ipads');
            expect(names).toHaveLength(2);
        });

        it('should provide section data to callback', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps), {
                displayName: 'Dashboard'
            });

            registry.forEach((section, name) => {
                expect(section.factory).toBeInstanceOf(Function);
                expect(section.metadata).toBeDefined();
                expect(section.metadata.displayName).toBe('Dashboard');
            });
        });

        it('should handle empty registry', () => {
            let called = false;
            registry.forEach(() => {
                called = true;
            });
            expect(called).toBe(false);
        });
    });

    describe('setDefaultDependencies', () => {
        it('should set default dependencies', () => {
            const deps = { eventBus: {} };
            const result = registry.setDefaultDependencies(deps);
            expect(result).toBe(registry);
        });

        it('should use default dependencies when resolving', () => {
            const defaultDeps = { eventBus: { type: 'default' } };
            registry.setDefaultDependencies(defaultDeps);
            registry.register('test', (deps) => new MockView(deps));
            const view = registry.get('test');
            expect(view.deps.eventBus.type).toBe('default');
        });

        it('should override defaults with explicit dependencies', () => {
            const defaultDeps = { eventBus: { type: 'default' } };
            const customDeps = { eventBus: { type: 'custom' } };
            registry.setDefaultDependencies(defaultDeps);
            registry.register('test', (deps) => new MockView(deps));
            const view = registry.get('test', customDeps);
            expect(view.deps.eventBus.type).toBe('custom');
        });
    });

    describe('Error Scenarios', () => {
        it('should provide helpful error message with available sections', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));
            registry.register('ipads', (deps) => new IPadsView(deps));

            const strictRegistry = new SectionRegistry({ strictMode: true });
            strictRegistry.register('dashboard', (deps) => new DashboardView(deps));

            try {
                strictRegistry.get('nonexistent');
                fail('Should have thrown SectionNotFoundError');
            } catch (error) {
                expect(error).toBeInstanceOf(SectionNotFoundError);
                expect(error.sectionName).toBe('nonexistent');
                expect(error.availableSections).toContain('dashboard');
            }
        });

        it('should preserve error details in DuplicateSectionError', () => {
            registry.register('dashboard', (deps) => new DashboardView(deps));

            try {
                registry.register('dashboard', (deps) => new DashboardView(deps));
                fail('Should have thrown DuplicateSectionError');
            } catch (error) {
                expect(error).toBeInstanceOf(DuplicateSectionError);
                expect(error.sectionName).toBe('dashboard');
                expect(error.message).toContain('dashboard');
            }
        });
    });
});

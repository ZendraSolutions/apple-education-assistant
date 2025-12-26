/**
 * @fileoverview Tests for StateManager - Centralized State Management
 * @module __tests__/core/StateManager.test
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { StateManager } from '../../js/core/StateManager.js';
import { EventBus, AppEvents } from '../../js/utils/EventBus.js';

describe('StateManager', () => {
    let stateManager;
    let eventBus;
    let mockStorage;

    /**
     * Creates a mock storage adapter
     * @returns {Object} Mock storage object
     */
    const createMockStorage = () => {
        const store = new Map();
        return {
            getItem: jest.fn((key) => store.get(key) ?? null),
            setItem: jest.fn((key, value) => store.set(key, value)),
            removeItem: jest.fn((key) => store.delete(key)),
            clear: jest.fn(() => store.clear()),
            get length() { return store.size; },
            key: jest.fn((index) => Array.from(store.keys())[index] ?? null),
            _store: store // For test inspection
        };
    };

    beforeEach(() => {
        eventBus = new EventBus();
        mockStorage = createMockStorage();
        stateManager = new StateManager({ eventBus, storage: mockStorage });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should create a new StateManager instance', () => {
            expect(stateManager).toBeInstanceOf(StateManager);
        });

        it('should throw TypeError if eventBus is not provided', () => {
            expect(() => {
                new StateManager({});
            }).toThrow(TypeError);

            expect(() => {
                new StateManager({ eventBus: null });
            }).toThrow(TypeError);
        });

        it('should throw TypeError with descriptive message', () => {
            expect(() => {
                new StateManager({});
            }).toThrow('StateManager requires an EventBus instance');
        });

        it('should accept custom storage adapter', () => {
            const customStorage = createMockStorage();
            const sm = new StateManager({ eventBus, storage: customStorage });
            sm.set('test', 'value');
            expect(customStorage.setItem).toHaveBeenCalled();
        });

        it('should load initial state with defaults', () => {
            const sm = new StateManager({ eventBus, storage: mockStorage });
            expect(sm.get('theme')).toBe('light');
            expect(sm.get('sidebarCollapsed')).toBe(false);
            expect(sm.get('currentSection')).toBe('dashboard');
        });

        it('should load persisted state from storage', () => {
            mockStorage.setItem('theme', JSON.stringify('dark'));
            mockStorage.setItem('sidebarCollapsed', JSON.stringify(true));

            const sm = new StateManager({ eventBus, storage: mockStorage });
            expect(sm.get('theme')).toBe('dark');
            expect(sm.get('sidebarCollapsed')).toBe(true);
        });

        it('should use legacy keys for backward compatibility', () => {
            mockStorage.setItem('theme', '"dark"');
            const sm = new StateManager({ eventBus, storage: mockStorage });
            expect(sm.get('theme')).toBe('dark');
        });
    });

    describe('get', () => {
        it('should return stored value', () => {
            stateManager.set('testKey', 'testValue');
            expect(stateManager.get('testKey')).toBe('testValue');
        });

        it('should return default value for non-existent key', () => {
            expect(stateManager.get('nonExistent', 'defaultValue')).toBe('defaultValue');
        });

        it('should return null for non-existent key without default', () => {
            expect(stateManager.get('nonExistent')).toBe(null);
        });

        it('should return cached value from memory', () => {
            stateManager.set('cached', 'value');
            mockStorage.getItem.mockClear();

            stateManager.get('cached');
            // Should not call storage if already in cache
            expect(mockStorage.getItem).not.toHaveBeenCalled();
        });

        it('should parse JSON values from storage', () => {
            mockStorage._store.set('jamf_objectKey', JSON.stringify({ nested: true }));
            const result = stateManager.get('objectKey');
            expect(result).toEqual({ nested: true });
        });

        it('should return raw string if not valid JSON', () => {
            mockStorage._store.set('jamf_rawString', 'just-a-string');
            const result = stateManager.get('rawString');
            expect(result).toBe('just-a-string');
        });

        it('should handle array values', () => {
            stateManager.set('arrayKey', [1, 2, 3]);
            expect(stateManager.get('arrayKey')).toEqual([1, 2, 3]);
        });

        it('should handle boolean values', () => {
            stateManager.set('boolTrue', true);
            stateManager.set('boolFalse', false);
            expect(stateManager.get('boolTrue')).toBe(true);
            expect(stateManager.get('boolFalse')).toBe(false);
        });

        it('should handle numeric values', () => {
            stateManager.set('number', 42);
            stateManager.set('float', 3.14);
            expect(stateManager.get('number')).toBe(42);
            expect(stateManager.get('float')).toBe(3.14);
        });

        it('should handle null values', () => {
            stateManager.set('nullValue', null);
            expect(stateManager.get('nullValue')).toBe(null);
        });
    });

    describe('set', () => {
        it('should set a state value', () => {
            stateManager.set('key', 'value');
            expect(stateManager.get('key')).toBe('value');
        });

        it('should persist to storage by default', () => {
            stateManager.set('persistedKey', 'persistedValue');
            expect(mockStorage.setItem).toHaveBeenCalled();
        });

        it('should not persist when persist option is false', () => {
            mockStorage.setItem.mockClear();
            stateManager.set('tempKey', 'tempValue', { persist: false });
            expect(mockStorage.setItem).not.toHaveBeenCalled();
        });

        it('should notify subscribers on change', () => {
            const callback = jest.fn();
            stateManager.subscribe('notifyKey', callback);

            stateManager.set('notifyKey', 'newValue');

            expect(callback).toHaveBeenCalledWith('newValue', undefined);
        });

        it('should not notify when silent option is true', () => {
            const callback = jest.fn();
            stateManager.subscribe('silentKey', callback);

            stateManager.set('silentKey', 'value', { silent: true });

            expect(callback).not.toHaveBeenCalled();
        });

        it('should not notify when value is unchanged', () => {
            stateManager.set('sameKey', 'value');
            const callback = jest.fn();
            stateManager.subscribe('sameKey', callback);

            stateManager.set('sameKey', 'value');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should serialize objects to JSON', () => {
            stateManager.set('objKey', { test: true });
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'jamf_objKey',
                JSON.stringify({ test: true })
            );
        });

        it('should serialize arrays to JSON', () => {
            stateManager.set('arrKey', [1, 2, 3]);
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'jamf_arrKey',
                JSON.stringify([1, 2, 3])
            );
        });

        it('should store strings directly', () => {
            stateManager.set('strKey', 'stringValue');
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'jamf_strKey',
                'stringValue'
            );
        });

        it('should emit state change event via eventBus', () => {
            const eventCallback = jest.fn();
            eventBus.on('state:testEvent:changed', eventCallback);

            stateManager.set('testEvent', 'value');

            expect(eventCallback).toHaveBeenCalledWith({
                key: 'testEvent',
                newValue: 'value',
                oldValue: undefined
            });
        });

        it('should pass oldValue to subscribers', () => {
            stateManager.set('trackOld', 'initial');
            const callback = jest.fn();
            stateManager.subscribe('trackOld', callback);

            stateManager.set('trackOld', 'updated');

            expect(callback).toHaveBeenCalledWith('updated', 'initial');
        });
    });

    describe('remove', () => {
        it('should remove a state value', () => {
            stateManager.set('removeMe', 'value');
            const existed = stateManager.remove('removeMe');

            expect(existed).toBe(true);
            expect(stateManager.get('removeMe')).toBe(null);
        });

        it('should return false for non-existent key', () => {
            const existed = stateManager.remove('nonExistent');
            expect(existed).toBe(false);
        });

        it('should remove from storage', () => {
            stateManager.set('removeFromStorage', 'value');
            stateManager.remove('removeFromStorage');

            expect(mockStorage.removeItem).toHaveBeenCalledWith('jamf_removeFromStorage');
        });
    });

    describe('subscribe', () => {
        it('should register a subscriber', () => {
            const callback = jest.fn();
            stateManager.subscribe('subKey', callback);

            stateManager.set('subKey', 'value');

            expect(callback).toHaveBeenCalled();
        });

        it('should return unsubscribe function', () => {
            const callback = jest.fn();
            const unsubscribe = stateManager.subscribe('unsubKey', callback);

            expect(typeof unsubscribe).toBe('function');
        });

        it('should unsubscribe correctly', () => {
            const callback = jest.fn();
            const unsubscribe = stateManager.subscribe('unsubKey', callback);

            unsubscribe();
            stateManager.set('unsubKey', 'value');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should support multiple subscribers for same key', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            stateManager.subscribe('multiSub', callback1);
            stateManager.subscribe('multiSub', callback2);

            stateManager.set('multiSub', 'value');

            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it('should only notify subscribers for specific key', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            stateManager.subscribe('key1', callback1);
            stateManager.subscribe('key2', callback2);

            stateManager.set('key1', 'value');

            expect(callback1).toHaveBeenCalled();
            expect(callback2).not.toHaveBeenCalled();
        });

        it('should handle subscriber errors gracefully', () => {
            const errorCallback = jest.fn(() => {
                throw new Error('Subscriber error');
            });
            const successCallback = jest.fn();

            stateManager.subscribe('errorKey', errorCallback);
            stateManager.subscribe('errorKey', successCallback);

            // Should not throw
            expect(() => {
                stateManager.set('errorKey', 'value');
            }).not.toThrow();

            expect(successCallback).toHaveBeenCalled();
        });

        it('should call subscribers with new and old values', () => {
            stateManager.set('valueTrack', 'old');
            const callback = jest.fn();
            stateManager.subscribe('valueTrack', callback);

            stateManager.set('valueTrack', 'new');

            expect(callback).toHaveBeenCalledWith('new', 'old');
        });
    });

    describe('exportAll', () => {
        it('should return all stored data', () => {
            mockStorage._store.set('key1', JSON.stringify('value1'));
            mockStorage._store.set('key2', JSON.stringify({ obj: true }));

            const exported = stateManager.exportAll();

            expect(exported.key1).toBe('value1');
            expect(exported.key2).toEqual({ obj: true });
        });

        it('should handle empty storage', () => {
            mockStorage._store.clear();
            const exported = stateManager.exportAll();
            expect(exported).toEqual({});
        });

        it('should handle parsing errors gracefully', () => {
            mockStorage._store.set('invalidJson', 'not-valid-json');

            const exported = stateManager.exportAll();
            expect(exported.invalidJson).toBe('not-valid-json');
        });
    });

    describe('clearAll', () => {
        it('should clear all stored data', () => {
            stateManager.set('key1', 'value1');
            stateManager.set('key2', 'value2');

            stateManager.clearAll();

            expect(mockStorage.clear).toHaveBeenCalled();
        });

        it('should clear in-memory state', () => {
            stateManager.set('key1', 'value1');
            stateManager.clearAll();

            expect(stateManager.get('key1')).toBe(null);
        });

        it('should emit DATA_DELETED event', () => {
            const callback = jest.fn();
            eventBus.on(AppEvents.DATA_DELETED, callback);

            stateManager.clearAll();

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('getChecklistProgress', () => {
        it('should return empty array for new checklist', () => {
            const progress = stateManager.getChecklistProgress('new-checklist');
            expect(progress).toEqual([]);
        });

        it('should return stored progress', () => {
            // The key uses jamf_ prefix via get() method
            mockStorage._store.set('jamf_checklist-test', JSON.stringify([true, false, true]));

            const progress = stateManager.getChecklistProgress('test');
            expect(progress).toEqual([true, false, true]);
        });
    });

    describe('setChecklistProgress', () => {
        it('should set checklist item progress', () => {
            stateManager.setChecklistProgress('test-list', 0, true);

            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'checklist-test-list',
                expect.any(String)
            );
        });

        it('should emit CHECKLIST_ITEM_TOGGLED event', () => {
            const callback = jest.fn();
            eventBus.on(AppEvents.CHECKLIST_ITEM_TOGGLED, callback);

            stateManager.setChecklistProgress('list1', 2, true);

            expect(callback).toHaveBeenCalledWith({
                checklistId: 'list1',
                itemIndex: 2,
                completed: true
            });
        });

        it('should persist progress to storage', () => {
            stateManager.setChecklistProgress('persist-list', 0, true);

            // Verify it was saved to storage
            expect(mockStorage.setItem).toHaveBeenCalledWith(
                'checklist-persist-list',
                JSON.stringify([true])
            );
        });

        it('should build upon existing progress in storage', () => {
            // First set
            stateManager.setChecklistProgress('build-list', 0, true);

            // Manually update the mock storage to simulate persistence
            mockStorage._store.set('jamf_checklist-build-list', JSON.stringify([true]));

            // Second set
            stateManager.setChecklistProgress('build-list', 1, false);

            // Check that storage was called with updated array
            const lastCall = mockStorage.setItem.mock.calls.find(call =>
                call[0] === 'checklist-build-list' && call[1].includes('false')
            );
            expect(lastCall).toBeDefined();
        });

        it('should emit event with correct data', () => {
            const callback = jest.fn();
            eventBus.on(AppEvents.CHECKLIST_ITEM_TOGGLED, callback);

            stateManager.setChecklistProgress('event-list', 3, true);

            expect(callback).toHaveBeenCalledWith({
                checklistId: 'event-list',
                itemIndex: 3,
                completed: true
            });
        });
    });

    describe('storage adapter fallback', () => {
        it('should create internal adapter if storage is null', () => {
            // This tests the createStorageAdapter branch
            const sm = new StateManager({ eventBus, storage: null });
            expect(sm).toBeInstanceOf(StateManager);
        });
    });

    describe('prefix handling', () => {
        it('should use jamf_ prefix for non-legacy keys', () => {
            stateManager.set('customKey', 'value');
            expect(mockStorage.setItem).toHaveBeenCalledWith('jamf_customKey', 'value');
        });

        it('should use legacy key for theme', () => {
            stateManager.set('theme', 'dark');
            expect(mockStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
        });

        it('should use legacy key for sidebarCollapsed', () => {
            stateManager.set('sidebarCollapsed', true);
            expect(mockStorage.setItem).toHaveBeenCalledWith('sidebarCollapsed', 'true');
        });
    });

    describe('edge cases', () => {
        it('should handle undefined values', () => {
            stateManager.set('undefinedKey', undefined);
            expect(stateManager.get('undefinedKey')).toBeUndefined();
        });

        it('should handle empty string keys', () => {
            stateManager.set('', 'value');
            expect(stateManager.get('')).toBe('value');
        });

        it('should handle special characters in keys', () => {
            stateManager.set('key:with:colons', 'value');
            expect(stateManager.get('key:with:colons')).toBe('value');
        });

        it('should handle deeply nested objects', () => {
            const nested = {
                level1: {
                    level2: {
                        level3: {
                            value: 'deep'
                        }
                    }
                }
            };
            stateManager.set('nested', nested);
            expect(stateManager.get('nested')).toEqual(nested);
        });

        it('should handle large arrays', () => {
            const largeArray = Array.from({ length: 1000 }, (_, i) => i);
            stateManager.set('largeArray', largeArray);
            expect(stateManager.get('largeArray')).toEqual(largeArray);
        });
    });

    describe('memory management', () => {
        it('should not leak subscriptions', () => {
            const callback = jest.fn();

            for (let i = 0; i < 100; i++) {
                const unsubscribe = stateManager.subscribe('leakTest', callback);
                unsubscribe();
            }

            stateManager.set('leakTest', 'value');
            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('integration scenarios', () => {
        it('should handle theme toggle workflow', () => {
            const themeCallback = jest.fn();
            stateManager.subscribe('theme', themeCallback);

            // Initial theme
            expect(stateManager.get('theme')).toBe('light');

            // Toggle to dark
            stateManager.set('theme', 'dark');
            expect(themeCallback).toHaveBeenCalledWith('dark', 'light');

            // Toggle back to light
            stateManager.set('theme', 'light');
            expect(themeCallback).toHaveBeenCalledWith('light', 'dark');
        });

        it('should persist and restore session state', () => {
            // Save session state
            stateManager.set('lastSection', 'settings');
            stateManager.set('scrollPosition', 500);
            stateManager.set('expandedPanels', ['panel1', 'panel2']);

            // Create new instance (simulating page reload)
            const newStateManager = new StateManager({ eventBus, storage: mockStorage });

            expect(newStateManager.get('lastSection')).toBe('settings');
            expect(newStateManager.get('scrollPosition')).toBe(500);
            expect(newStateManager.get('expandedPanels')).toEqual(['panel1', 'panel2']);
        });
    });
});

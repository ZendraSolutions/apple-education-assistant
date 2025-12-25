/**
 * @fileoverview Tests for EventBus - Publish-Subscribe Pattern
 * @module __tests__/utils/EventBus.test
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { EventBus, AppEvents } from '../../js/utils/EventBus.js';

describe('EventBus', () => {
    let eventBus;

    beforeEach(() => {
        eventBus = new EventBus();
    });

    describe('constructor', () => {
        it('should create a new EventBus instance', () => {
            expect(eventBus).toBeInstanceOf(EventBus);
        });

        it('should accept debug option', () => {
            const debugBus = new EventBus({ debug: true });
            expect(debugBus).toBeInstanceOf(EventBus);
        });

        it('should start with no listeners', () => {
            expect(eventBus.eventNames()).toEqual([]);
        });
    });

    describe('on', () => {
        it('should register an event listener', () => {
            const callback = jest.fn();
            const subscription = eventBus.on('test:event', callback);

            expect(subscription).toBeDefined();
            expect(subscription.event).toBe('test:event');
            expect(subscription.callback).toBe(callback);
            expect(subscription.unsubscribe).toBeInstanceOf(Function);
        });

        it('should call listener when event is emitted', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);

            eventBus.emit('test:event', { data: 'test' });

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith({ data: 'test' });
        });

        it('should support multiple listeners for same event', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            eventBus.on('test:event', callback1);
            eventBus.on('test:event', callback2);

            eventBus.emit('test:event', 'data');

            expect(callback1).toHaveBeenCalledWith('data');
            expect(callback2).toHaveBeenCalledWith('data');
        });

        it('should throw TypeError if event name is not a string', () => {
            expect(() => {
                eventBus.on(123, jest.fn());
            }).toThrow(TypeError);

            expect(() => {
                eventBus.on(null, jest.fn());
            }).toThrow(TypeError);
        });

        it('should throw TypeError if event name is empty', () => {
            expect(() => {
                eventBus.on('', jest.fn());
            }).toThrow(TypeError);

            expect(() => {
                eventBus.on('   ', jest.fn());
            }).toThrow(TypeError);
        });

        it('should throw TypeError if callback is not a function', () => {
            expect(() => {
                eventBus.on('test:event', 'not-a-function');
            }).toThrow(TypeError);

            expect(() => {
                eventBus.on('test:event', null);
            }).toThrow(TypeError);
        });

        it('should allow subscribing same callback multiple times', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);
            eventBus.on('test:event', callback);

            eventBus.emit('test:event', 'data');

            // Should be called twice (subscribed twice)
            expect(callback).toHaveBeenCalledTimes(2);
        });
    });

    describe('once', () => {
        it('should call listener only once', () => {
            const callback = jest.fn();
            eventBus.once('test:event', callback);

            eventBus.emit('test:event', 'data1');
            eventBus.emit('test:event', 'data2');
            eventBus.emit('test:event', 'data3');

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith('data1');
        });

        it('should automatically unsubscribe after first call', () => {
            const callback = jest.fn();
            eventBus.once('test:event', callback);

            eventBus.emit('test:event', 'data');
            expect(eventBus.listenerCount('test:event')).toBe(0);
        });

        it('should return subscription object', () => {
            const callback = jest.fn();
            const subscription = eventBus.once('test:event', callback);

            expect(subscription).toBeDefined();
            expect(subscription.unsubscribe).toBeInstanceOf(Function);
        });

        it('should allow manual unsubscribe before first emit', () => {
            const callback = jest.fn();
            const subscription = eventBus.once('test:event', callback);

            subscription.unsubscribe();
            eventBus.emit('test:event', 'data');

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('off', () => {
        it('should remove a listener', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);

            const removed = eventBus.off('test:event', callback);

            expect(removed).toBe(true);
            eventBus.emit('test:event', 'data');
            expect(callback).not.toHaveBeenCalled();
        });

        it('should return false if listener was not found', () => {
            const callback = jest.fn();
            const removed = eventBus.off('test:event', callback);
            expect(removed).toBe(false);
        });

        it('should only remove specified callback', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            eventBus.on('test:event', callback1);
            eventBus.on('test:event', callback2);

            eventBus.off('test:event', callback1);
            eventBus.emit('test:event', 'data');

            expect(callback1).not.toHaveBeenCalled();
            expect(callback2).toHaveBeenCalledWith('data');
        });

        it('should clean up event when last listener is removed', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);

            eventBus.off('test:event', callback);

            expect(eventBus.eventNames()).toEqual([]);
        });

        it('should work with subscription.unsubscribe', () => {
            const callback = jest.fn();
            const subscription = eventBus.on('test:event', callback);

            subscription.unsubscribe();
            eventBus.emit('test:event', 'data');

            expect(callback).not.toHaveBeenCalled();
        });
    });

    describe('emit', () => {
        it('should trigger all listeners for an event', () => {
            const callback1 = jest.fn();
            const callback2 = jest.fn();

            eventBus.on('test:event', callback1);
            eventBus.on('test:event', callback2);

            const hadListeners = eventBus.emit('test:event', 'data');

            expect(hadListeners).toBe(true);
            expect(callback1).toHaveBeenCalledWith('data');
            expect(callback2).toHaveBeenCalledWith('data');
        });

        it('should return false if event has no listeners', () => {
            const hadListeners = eventBus.emit('nonexistent:event', 'data');
            expect(hadListeners).toBe(false);
        });

        it('should pass data to listeners', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);

            const testData = { user: 'John', action: 'login' };
            eventBus.emit('test:event', testData);

            expect(callback).toHaveBeenCalledWith(testData);
        });

        it('should work without data', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);

            eventBus.emit('test:event');

            expect(callback).toHaveBeenCalledWith(undefined);
        });

        it('should handle listener errors without stopping other listeners', () => {
            const callback1 = jest.fn(() => {
                throw new Error('Listener error');
            });
            const callback2 = jest.fn();

            eventBus.on('test:event', callback1);
            eventBus.on('test:event', callback2);

            // Should not throw
            expect(() => {
                eventBus.emit('test:event', 'data');
            }).not.toThrow();

            // Both should have been called
            expect(callback1).toHaveBeenCalled();
            expect(callback2).toHaveBeenCalled();
        });

        it('should support different data types', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);

            eventBus.emit('test:event', 'string');
            eventBus.emit('test:event', 123);
            eventBus.emit('test:event', { obj: true });
            eventBus.emit('test:event', [1, 2, 3]);
            eventBus.emit('test:event', null);

            expect(callback).toHaveBeenCalledTimes(5);
        });
    });

    describe('clear', () => {
        it('should remove all listeners for a specific event', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);
            eventBus.on('other:event', jest.fn());

            eventBus.clear('test:event');

            expect(eventBus.listenerCount('test:event')).toBe(0);
            expect(eventBus.listenerCount('other:event')).toBe(1);
        });

        it('should remove all events when called without argument', () => {
            eventBus.on('event1', jest.fn());
            eventBus.on('event2', jest.fn());
            eventBus.on('event3', jest.fn());

            eventBus.clear();

            expect(eventBus.eventNames()).toEqual([]);
        });

        it('should not throw if event does not exist', () => {
            expect(() => {
                eventBus.clear('nonexistent:event');
            }).not.toThrow();
        });
    });

    describe('listenerCount', () => {
        it('should return 0 for event with no listeners', () => {
            expect(eventBus.listenerCount('test:event')).toBe(0);
        });

        it('should return correct count for event with listeners', () => {
            eventBus.on('test:event', jest.fn());
            eventBus.on('test:event', jest.fn());
            eventBus.on('test:event', jest.fn());

            expect(eventBus.listenerCount('test:event')).toBe(3);
        });

        it('should update after adding/removing listeners', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);
            expect(eventBus.listenerCount('test:event')).toBe(1);

            eventBus.off('test:event', callback);
            expect(eventBus.listenerCount('test:event')).toBe(0);
        });
    });

    describe('eventNames', () => {
        it('should return empty array initially', () => {
            expect(eventBus.eventNames()).toEqual([]);
        });

        it('should return all registered event names', () => {
            eventBus.on('event1', jest.fn());
            eventBus.on('event2', jest.fn());
            eventBus.on('event3', jest.fn());

            const names = eventBus.eventNames();
            expect(names).toContain('event1');
            expect(names).toContain('event2');
            expect(names).toContain('event3');
            expect(names).toHaveLength(3);
        });

        it('should not include events with no listeners', () => {
            const callback = jest.fn();
            eventBus.on('test:event', callback);
            eventBus.off('test:event', callback);

            expect(eventBus.eventNames()).toEqual([]);
        });
    });

    describe('integration scenarios', () => {
        it('should support event-driven communication pattern', () => {
            const mockThemeManager = {
                changeTheme: jest.fn((theme) => {
                    eventBus.emit('theme:changed', { theme });
                })
            };

            const mockUI = {
                updateTheme: jest.fn()
            };

            // UI subscribes to theme changes
            eventBus.on('theme:changed', (data) => {
                mockUI.updateTheme(data.theme);
            });

            // Theme manager changes theme
            mockThemeManager.changeTheme('dark');

            expect(mockUI.updateTheme).toHaveBeenCalledWith('dark');
        });

        it('should handle multiple subscribers for application events', () => {
            const logger = jest.fn();
            const analytics = jest.fn();
            const notification = jest.fn();

            eventBus.on('user:login', logger);
            eventBus.on('user:login', analytics);
            eventBus.on('user:login', notification);

            const userData = { name: 'John', id: 123 };
            eventBus.emit('user:login', userData);

            expect(logger).toHaveBeenCalledWith(userData);
            expect(analytics).toHaveBeenCalledWith(userData);
            expect(notification).toHaveBeenCalledWith(userData);
        });

        it('should support request-response pattern with once', (done) => {
            // Responder
            eventBus.once('data:request', (data) => {
                eventBus.emit('data:response', { result: data.query + ' result' });
            });

            // Requester
            eventBus.once('data:response', (data) => {
                expect(data.result).toBe('test result');
                done();
            });

            eventBus.emit('data:request', { query: 'test' });
        });

        it('should support cleanup in lifecycle hooks', () => {
            const subscriptions = [];

            // Component mount
            subscriptions.push(eventBus.on('event1', jest.fn()));
            subscriptions.push(eventBus.on('event2', jest.fn()));
            subscriptions.push(eventBus.on('event3', jest.fn()));

            expect(eventBus.eventNames()).toHaveLength(3);

            // Component unmount - cleanup
            subscriptions.forEach(sub => sub.unsubscribe());

            expect(eventBus.eventNames()).toEqual([]);
        });
    });

    describe('memory management', () => {
        it('should not leak listeners', () => {
            const callback = jest.fn();

            // Add and remove many times
            for (let i = 0; i < 100; i++) {
                const sub = eventBus.on('test:event', callback);
                sub.unsubscribe();
            }

            expect(eventBus.listenerCount('test:event')).toBe(0);
            expect(eventBus.eventNames()).toEqual([]);
        });

        it('should handle rapid subscribe/unsubscribe cycles', () => {
            for (let i = 0; i < 1000; i++) {
                const sub = eventBus.on('test:event', jest.fn());
                if (i % 2 === 0) {
                    sub.unsubscribe();
                }
            }

            expect(eventBus.listenerCount('test:event')).toBe(500);
        });
    });

    describe('edge cases', () => {
        it('should handle same callback registered for different events', () => {
            const callback = jest.fn();

            eventBus.on('event1', callback);
            eventBus.on('event2', callback);

            eventBus.emit('event1', 'data1');
            eventBus.emit('event2', 'data2');

            expect(callback).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenNthCalledWith(1, 'data1');
            expect(callback).toHaveBeenNthCalledWith(2, 'data2');
        });

        it('should handle events with special characters in names', () => {
            const callback = jest.fn();
            eventBus.on('event:with:colons', callback);
            eventBus.on('event-with-dashes', callback);
            eventBus.on('event.with.dots', callback);

            eventBus.emit('event:with:colons', 1);
            eventBus.emit('event-with-dashes', 2);
            eventBus.emit('event.with.dots', 3);

            expect(callback).toHaveBeenCalledTimes(3);
        });

        it('should preserve listener order', () => {
            const order = [];

            eventBus.on('test:event', () => order.push(1));
            eventBus.on('test:event', () => order.push(2));
            eventBus.on('test:event', () => order.push(3));

            eventBus.emit('test:event');

            expect(order).toEqual([1, 2, 3]);
        });
    });
});

describe('AppEvents', () => {
    it('should export standard event names', () => {
        expect(AppEvents).toBeDefined();
        expect(AppEvents.NAVIGATION_CHANGED).toBe('navigation:changed');
        expect(AppEvents.THEME_CHANGED).toBe('theme:changed');
        expect(AppEvents.APP_READY).toBe('app:ready');
    });

    it('should have all common application events', () => {
        expect(AppEvents.MODAL_OPENED).toBeDefined();
        expect(AppEvents.SEARCH_QUERY).toBeDefined();
        expect(AppEvents.DATA_EXPORTED).toBeDefined();
        expect(AppEvents.CONNECTION_ONLINE).toBeDefined();
    });

    it('should use consistent naming convention', () => {
        const events = Object.values(AppEvents);
        events.forEach(event => {
            expect(event).toMatch(/^[a-z]+:[a-zA-Z]+$/);
        });
    });
});

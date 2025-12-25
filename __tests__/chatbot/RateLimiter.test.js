/**
 * @fileoverview Tests for RateLimiter - API Rate Limiting
 * @module __tests__/chatbot/RateLimiter.test
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { RateLimiter } from '../../js/chatbot/RateLimiter.js';

describe('RateLimiter', () => {
    let limiter;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Clear any open BroadcastChannels
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Cleanup
        if (limiter) {
            limiter.destroy();
        }
        localStorage.clear();
    });

    describe('constructor', () => {
        it('should create a new RateLimiter instance with defaults', () => {
            limiter = new RateLimiter();
            expect(limiter).toBeInstanceOf(RateLimiter);
            expect(limiter.maxCalls).toBe(10);
            expect(limiter.windowMs).toBe(60000);
        });

        it('should accept custom maxCalls and windowMs', () => {
            limiter = new RateLimiter(5, 30000);
            expect(limiter.maxCalls).toBe(5);
            expect(limiter.windowMs).toBe(30000);
        });

        it('should throw TypeError if maxCalls is not a number', () => {
            expect(() => {
                new RateLimiter('invalid', 60000);
            }).toThrow(TypeError);
        });

        it('should throw TypeError if maxCalls is not positive', () => {
            expect(() => {
                new RateLimiter(0, 60000);
            }).toThrow(TypeError);

            expect(() => {
                new RateLimiter(-5, 60000);
            }).toThrow(TypeError);
        });

        it('should throw TypeError if windowMs is not a number', () => {
            expect(() => {
                new RateLimiter(10, 'invalid');
            }).toThrow(TypeError);
        });

        it('should throw TypeError if windowMs is not positive', () => {
            expect(() => {
                new RateLimiter(10, 0);
            }).toThrow(TypeError);

            expect(() => {
                new RateLimiter(10, -1000);
            }).toThrow(TypeError);
        });

        it('should initialize empty call history', () => {
            limiter = new RateLimiter(10, 60000);
            expect(limiter.getRemainingCalls()).toBe(10);
        });
    });

    describe('canMakeCall', () => {
        beforeEach(() => {
            limiter = new RateLimiter(3, 1000); // 3 calls per second
        });

        it('should allow first call', () => {
            const result = limiter.canMakeCall();
            expect(result.allowed).toBe(true);
            expect(result.waitTime).toBeUndefined();
        });

        it('should allow calls up to the limit', () => {
            expect(limiter.canMakeCall().allowed).toBe(true);
            expect(limiter.canMakeCall().allowed).toBe(true);
            expect(limiter.canMakeCall().allowed).toBe(true);
            expect(limiter.getRemainingCalls()).toBe(0);
        });

        it('should reject calls exceeding the limit', () => {
            // Make 3 calls (max)
            limiter.canMakeCall();
            limiter.canMakeCall();
            limiter.canMakeCall();

            // 4th call should be rejected
            const result = limiter.canMakeCall();
            expect(result.allowed).toBe(false);
            expect(result.waitTime).toBeDefined();
            expect(result.waitTime).toBeGreaterThan(0);
        });

        it('should provide waitTime when rate limited', () => {
            // Exhaust limit
            limiter.canMakeCall();
            limiter.canMakeCall();
            limiter.canMakeCall();

            const result = limiter.canMakeCall();
            expect(result.allowed).toBe(false);
            expect(typeof result.waitTime).toBe('number');
            expect(result.waitTime).toBeGreaterThan(0);
            expect(result.waitTime).toBeLessThanOrEqual(1);
        });

        it('should register call in localStorage', () => {
            limiter.canMakeCall();
            const stored = localStorage.getItem('jamf-rate-limiter-calls');
            expect(stored).not.toBeNull();

            const calls = JSON.parse(stored);
            expect(Array.isArray(calls)).toBe(true);
            expect(calls.length).toBe(1);
        });
    });

    describe('getRemainingCalls', () => {
        beforeEach(() => {
            limiter = new RateLimiter(5, 60000);
        });

        it('should return max calls initially', () => {
            expect(limiter.getRemainingCalls()).toBe(5);
        });

        it('should decrease after each call', () => {
            expect(limiter.getRemainingCalls()).toBe(5);
            limiter.canMakeCall();
            expect(limiter.getRemainingCalls()).toBe(4);
            limiter.canMakeCall();
            expect(limiter.getRemainingCalls()).toBe(3);
        });

        it('should return 0 when limit is reached', () => {
            for (let i = 0; i < 5; i++) {
                limiter.canMakeCall();
            }
            expect(limiter.getRemainingCalls()).toBe(0);
        });

        it('should never return negative values', () => {
            for (let i = 0; i < 10; i++) {
                limiter.canMakeCall();
            }
            expect(limiter.getRemainingCalls()).toBe(0);
        });
    });

    describe('reset', () => {
        beforeEach(() => {
            limiter = new RateLimiter(3, 60000);
        });

        it('should clear all recorded calls', () => {
            limiter.canMakeCall();
            limiter.canMakeCall();
            limiter.canMakeCall();

            expect(limiter.getRemainingCalls()).toBe(0);

            limiter.reset();

            expect(limiter.getRemainingCalls()).toBe(3);
        });

        it('should allow calls after reset', () => {
            // Exhaust limit
            limiter.canMakeCall();
            limiter.canMakeCall();
            limiter.canMakeCall();

            expect(limiter.canMakeCall().allowed).toBe(false);

            // Reset
            limiter.reset();

            expect(limiter.canMakeCall().allowed).toBe(true);
        });

        it('should clear localStorage', () => {
            limiter.canMakeCall();
            limiter.reset();

            const stored = localStorage.getItem('jamf-rate-limiter-calls');
            const calls = JSON.parse(stored);
            expect(calls.length).toBe(0);
        });
    });

    describe('destroy', () => {
        it('should cleanup BroadcastChannel', () => {
            limiter = new RateLimiter(10, 60000);
            expect(() => limiter.destroy()).not.toThrow();
        });

        it('should be safe to call multiple times', () => {
            limiter = new RateLimiter(10, 60000);
            limiter.destroy();
            limiter.destroy();
            limiter.destroy();
            // Should not throw
        });

        it('should not affect functionality after destroy', () => {
            limiter = new RateLimiter(3, 60000);
            limiter.destroy();

            // Should still work
            expect(limiter.canMakeCall().allowed).toBe(true);
        });
    });

    describe('time window expiration', () => {
        beforeEach(() => {
            limiter = new RateLimiter(2, 100); // 2 calls per 100ms
        });

        it('should clean up expired calls', async () => {
            // Make 2 calls
            limiter.canMakeCall();
            limiter.canMakeCall();

            // Should be rate limited
            expect(limiter.canMakeCall().allowed).toBe(false);

            // Wait for window to expire
            await new Promise(resolve => setTimeout(resolve, 150));

            // Should allow new calls
            expect(limiter.canMakeCall().allowed).toBe(true);
        });

        it('should allow gradual recovery', async () => {
            limiter.canMakeCall(); // t=0
            await new Promise(resolve => setTimeout(resolve, 50));
            limiter.canMakeCall(); // t=50

            // Both calls still in window
            expect(limiter.getRemainingCalls()).toBe(0);

            // Wait for first call to expire (t=100)
            await new Promise(resolve => setTimeout(resolve, 60));

            // First call expired, second still valid
            expect(limiter.getRemainingCalls()).toBe(1);
        });
    });

    describe('localStorage persistence', () => {
        it('should persist calls across instances', () => {
            const limiter1 = new RateLimiter(5, 60000);
            limiter1.canMakeCall();
            limiter1.canMakeCall();

            const limiter2 = new RateLimiter(5, 60000);
            expect(limiter2.getRemainingCalls()).toBe(3);

            limiter1.destroy();
            limiter2.destroy();
        });

        it('should load existing calls on creation', () => {
            const limiter1 = new RateLimiter(3, 60000);
            limiter1.canMakeCall();
            limiter1.canMakeCall();

            const limiter2 = new RateLimiter(3, 60000);
            expect(limiter2.getRemainingCalls()).toBe(1);

            limiter1.destroy();
            limiter2.destroy();
        });

        it('should handle corrupted localStorage gracefully', () => {
            localStorage.setItem('jamf-rate-limiter-calls', 'invalid-json');

            limiter = new RateLimiter(5, 60000);
            expect(limiter.getRemainingCalls()).toBe(5);
        });

        it('should filter out expired calls when loading', async () => {
            const limiter1 = new RateLimiter(5, 100); // 100ms window
            limiter1.canMakeCall();

            // Wait for call to expire
            await new Promise(resolve => setTimeout(resolve, 150));

            const limiter2 = new RateLimiter(5, 100);
            expect(limiter2.getRemainingCalls()).toBe(5);

            limiter1.destroy();
            limiter2.destroy();
        });
    });

    describe('edge cases', () => {
        it('should handle very small time windows', () => {
            limiter = new RateLimiter(5, 1); // 5 calls per millisecond
            expect(limiter.canMakeCall().allowed).toBe(true);
        });

        it('should handle very large time windows', () => {
            limiter = new RateLimiter(5, 1000 * 60 * 60 * 24); // 1 day
            expect(limiter.canMakeCall().allowed).toBe(true);
        });

        it('should handle single call limit', () => {
            limiter = new RateLimiter(1, 60000);
            expect(limiter.canMakeCall().allowed).toBe(true);
            expect(limiter.canMakeCall().allowed).toBe(false);
        });

        it('should handle very high call limits', () => {
            limiter = new RateLimiter(1000, 60000);
            for (let i = 0; i < 100; i++) {
                expect(limiter.canMakeCall().allowed).toBe(true);
            }
            expect(limiter.getRemainingCalls()).toBe(900);
        });
    });

    describe('concurrent access', () => {
        it('should handle rapid sequential calls', () => {
            limiter = new RateLimiter(10, 60000);

            const results = [];
            for (let i = 0; i < 15; i++) {
                results.push(limiter.canMakeCall());
            }

            const allowed = results.filter(r => r.allowed).length;
            const denied = results.filter(r => !r.allowed).length;

            expect(allowed).toBe(10);
            expect(denied).toBe(5);
        });

        it('should maintain consistency with localStorage', () => {
            limiter = new RateLimiter(5, 60000);

            limiter.canMakeCall();
            limiter.canMakeCall();

            const stored = localStorage.getItem('jamf-rate-limiter-calls');
            const calls = JSON.parse(stored);

            expect(calls.length).toBe(2);
            expect(limiter.getRemainingCalls()).toBe(3);
        });
    });

    describe('waitTime calculation', () => {
        beforeEach(() => {
            limiter = new RateLimiter(2, 1000);
        });

        it('should calculate accurate waitTime', () => {
            limiter.canMakeCall();
            limiter.canMakeCall();

            const result = limiter.canMakeCall();
            expect(result.allowed).toBe(false);
            expect(result.waitTime).toBeGreaterThan(0);
            expect(result.waitTime).toBeLessThanOrEqual(1);
        });

        it('should decrease waitTime as time passes', async () => {
            limiter.canMakeCall();
            limiter.canMakeCall();

            const result1 = limiter.canMakeCall();
            const waitTime1 = result1.waitTime;

            await new Promise(resolve => setTimeout(resolve, 200));

            const result2 = limiter.canMakeCall();
            const waitTime2 = result2.waitTime;

            expect(waitTime2).toBeLessThan(waitTime1);
        });
    });
});

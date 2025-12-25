/**
 * @fileoverview Tests for EncryptionService - AES-256-GCM Encryption
 * @module __tests__/chatbot/EncryptionService.test
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { EncryptionService, EncryptionError, DecryptionError } from '../../js/chatbot/EncryptionService.js';

describe('EncryptionService', () => {
    let service;

    beforeEach(() => {
        service = new EncryptionService();
        // Clear localStorage before each test
        localStorage.clear();
    });

    afterEach(() => {
        // Cleanup
        localStorage.clear();
    });

    describe('constructor', () => {
        it('should create a new EncryptionService instance', () => {
            expect(service).toBeInstanceOf(EncryptionService);
        });

        it('should check for Web Crypto API support', () => {
            expect(service.isSupported).toBeDefined();
        });
    });

    describe('isSupported', () => {
        it('should return true in jsdom environment with crypto', () => {
            // jsdom provides Web Crypto API
            expect(service.isSupported).toBe(true);
        });
    });

    describe('encrypt', () => {
        it('should encrypt a plaintext string', async () => {
            const plaintext = 'my-secret-api-key';
            const encrypted = await service.encrypt(plaintext);

            expect(encrypted).toBeDefined();
            expect(typeof encrypted).toBe('string');
            expect(encrypted).not.toBe(plaintext);
            expect(encrypted.length).toBeGreaterThan(0);
        });

        it('should produce different ciphertext for same plaintext (random IV)', async () => {
            const plaintext = 'test-api-key';
            const encrypted1 = await service.encrypt(plaintext);
            const encrypted2 = await service.encrypt(plaintext);

            expect(encrypted1).not.toBe(encrypted2);
        });

        it('should encrypt empty string', async () => {
            const encrypted = await service.encrypt('');
            expect(encrypted).toBeDefined();
            expect(typeof encrypted).toBe('string');
        });

        it('should encrypt string with special characters', async () => {
            const plaintext = 'key!@#$%^&*()_+-=[]{}|;:,.<>?';
            const encrypted = await service.encrypt(plaintext);
            expect(encrypted).toBeDefined();
            expect(encrypted).not.toBe(plaintext);
        });

        it('should encrypt unicode characters', async () => {
            const plaintext = 'API-KEY-日本語-中文-한국어-🔐';
            const encrypted = await service.encrypt(plaintext);
            expect(encrypted).toBeDefined();
        });

        it('should encrypt long strings', async () => {
            const plaintext = 'a'.repeat(1000);
            const encrypted = await service.encrypt(plaintext);
            expect(encrypted).toBeDefined();
        });

        it('should throw EncryptionError if plaintext is not a string', async () => {
            await expect(service.encrypt(123)).rejects.toThrow(EncryptionError);
            await expect(service.encrypt(null)).rejects.toThrow(EncryptionError);
            await expect(service.encrypt(undefined)).rejects.toThrow(EncryptionError);
            await expect(service.encrypt({})).rejects.toThrow(EncryptionError);
        });

        it('should return base64-encoded string', async () => {
            const encrypted = await service.encrypt('test');
            // Base64 pattern
            expect(/^[A-Za-z0-9+/]+=*$/.test(encrypted)).toBe(true);
        });
    });

    describe('decrypt', () => {
        it('should decrypt encrypted data back to original plaintext', async () => {
            const plaintext = 'my-secret-api-key';
            const encrypted = await service.encrypt(plaintext);
            const decrypted = await service.decrypt(encrypted);

            expect(decrypted).toBe(plaintext);
        });

        it('should decrypt empty string', async () => {
            const encrypted = await service.encrypt('');
            const decrypted = await service.decrypt(encrypted);
            expect(decrypted).toBe('');
        });

        it('should decrypt special characters', async () => {
            const plaintext = 'key!@#$%^&*()_+-=[]{}|;:,.<>?';
            const encrypted = await service.encrypt(plaintext);
            const decrypted = await service.decrypt(encrypted);
            expect(decrypted).toBe(plaintext);
        });

        it('should decrypt unicode characters', async () => {
            const plaintext = 'API-KEY-日本語-中文-한국어-🔐';
            const encrypted = await service.encrypt(plaintext);
            const decrypted = await service.decrypt(encrypted);
            expect(decrypted).toBe(plaintext);
        });

        it('should decrypt long strings', async () => {
            const plaintext = 'a'.repeat(1000);
            const encrypted = await service.encrypt(plaintext);
            const decrypted = await service.decrypt(encrypted);
            expect(decrypted).toBe(plaintext);
        });

        it('should throw DecryptionError for invalid base64', async () => {
            await expect(service.decrypt('invalid-base64!@#')).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError for corrupted data', async () => {
            const encrypted = await service.encrypt('test');
            const corrupted = encrypted.substring(0, encrypted.length - 5) + 'XXXXX';
            await expect(service.decrypt(corrupted)).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError for data too short', async () => {
            // IV is 12 bytes, so anything shorter is invalid
            const shortData = btoa('short');
            await expect(service.decrypt(shortData)).rejects.toThrow(DecryptionError);
        });

        it('should throw DecryptionError if data is not a string', async () => {
            await expect(service.decrypt(123)).rejects.toThrow(DecryptionError);
            await expect(service.decrypt(null)).rejects.toThrow(DecryptionError);
            await expect(service.decrypt(undefined)).rejects.toThrow(DecryptionError);
        });
    });

    describe('roundtrip encryption/decryption', () => {
        it('should handle multiple encrypt/decrypt cycles', async () => {
            const original = 'test-data';

            const encrypted1 = await service.encrypt(original);
            const decrypted1 = await service.decrypt(encrypted1);
            expect(decrypted1).toBe(original);

            const encrypted2 = await service.encrypt(decrypted1);
            const decrypted2 = await service.decrypt(encrypted2);
            expect(decrypted2).toBe(original);
        });

        it('should work with different data types after stringification', async () => {
            const obj = { apiKey: 'secret', userId: 123 };
            const jsonString = JSON.stringify(obj);

            const encrypted = await service.encrypt(jsonString);
            const decrypted = await service.decrypt(encrypted);
            const parsed = JSON.parse(decrypted);

            expect(parsed).toEqual(obj);
        });
    });

    describe('isEncrypted', () => {
        it('should detect encrypted data', async () => {
            const encrypted = await service.encrypt('test-api-key');
            expect(service.isEncrypted(encrypted)).toBe(true);
        });

        it('should return false for plaintext', () => {
            expect(service.isEncrypted('plaintext')).toBe(false);
        });

        it('should return false for short strings', () => {
            expect(service.isEncrypted('short')).toBe(false);
        });

        it('should return false for empty string', () => {
            expect(service.isEncrypted('')).toBe(false);
        });

        it('should return false for non-base64 strings', () => {
            expect(service.isEncrypted('not-base64!@#$')).toBe(false);
        });

        it('should return false for non-strings', () => {
            expect(service.isEncrypted(123)).toBe(false);
            expect(service.isEncrypted(null)).toBe(false);
            expect(service.isEncrypted(undefined)).toBe(false);
            expect(service.isEncrypted({})).toBe(false);
        });

        it('should handle base64 that is too short to be encrypted', () => {
            const shortBase64 = btoa('abc');
            expect(service.isEncrypted(shortBase64)).toBe(false);
        });
    });

    describe('clearCache', () => {
        it('should clear cached key', async () => {
            // Encrypt something to generate cached key
            await service.encrypt('test');

            // Clear cache
            service.clearCache();

            // Should still work after clearing cache
            const encrypted = await service.encrypt('test2');
            const decrypted = await service.decrypt(encrypted);
            expect(decrypted).toBe('test2');
        });

        it('should not throw error when called multiple times', () => {
            expect(() => {
                service.clearCache();
                service.clearCache();
                service.clearCache();
            }).not.toThrow();
        });
    });

    describe('user salt generation', () => {
        it('should generate and store user salt on first use', async () => {
            expect(localStorage.getItem('jamf-user-salt')).toBeNull();

            await service.encrypt('test');

            const salt = localStorage.getItem('jamf-user-salt');
            expect(salt).not.toBeNull();
            expect(typeof salt).toBe('string');
        });

        it('should reuse existing salt', async () => {
            await service.encrypt('test1');
            const salt1 = localStorage.getItem('jamf-user-salt');

            await service.encrypt('test2');
            const salt2 = localStorage.getItem('jamf-user-salt');

            expect(salt1).toBe(salt2);
        });

        it('should use same salt across service instances', async () => {
            const service1 = new EncryptionService();
            await service1.encrypt('test');
            const salt1 = localStorage.getItem('jamf-user-salt');

            const service2 = new EncryptionService();
            await service2.encrypt('test');
            const salt2 = localStorage.getItem('jamf-user-salt');

            expect(salt1).toBe(salt2);
        });
    });

    describe('error handling', () => {
        it('should include cause in EncryptionError', async () => {
            try {
                await service.encrypt(123);
                fail('Should have thrown EncryptionError');
            } catch (error) {
                expect(error).toBeInstanceOf(EncryptionError);
                expect(error.name).toBe('EncryptionError');
                expect(error.message).toContain('string');
            }
        });

        it('should include cause in DecryptionError', async () => {
            try {
                await service.decrypt('invalid-data');
                fail('Should have thrown DecryptionError');
            } catch (error) {
                expect(error).toBeInstanceOf(DecryptionError);
                expect(error.name).toBe('DecryptionError');
                expect(error.cause).toBeDefined();
            }
        });
    });

    describe('security considerations', () => {
        it('should use different IV for each encryption', async () => {
            const plaintext = 'same-text';
            const encrypted1 = await service.encrypt(plaintext);
            const encrypted2 = await service.encrypt(plaintext);

            // Different ciphertexts due to different IVs
            expect(encrypted1).not.toBe(encrypted2);

            // But both decrypt to same plaintext
            const decrypted1 = await service.decrypt(encrypted1);
            const decrypted2 = await service.decrypt(encrypted2);
            expect(decrypted1).toBe(plaintext);
            expect(decrypted2).toBe(plaintext);
        });

        it('should produce ciphertext longer than plaintext (due to IV)', async () => {
            const plaintext = 'test';
            const encrypted = await service.encrypt(plaintext);

            // Base64 of (IV + ciphertext) should be longer than plaintext
            expect(encrypted.length).toBeGreaterThan(plaintext.length);
        });
    });

    describe('edge cases', () => {
        it('should handle whitespace-only strings', async () => {
            const plaintext = '   ';
            const encrypted = await service.encrypt(plaintext);
            const decrypted = await service.decrypt(encrypted);
            expect(decrypted).toBe(plaintext);
        });

        it('should handle newlines and tabs', async () => {
            const plaintext = 'line1\nline2\tindented';
            const encrypted = await service.encrypt(plaintext);
            const decrypted = await service.decrypt(encrypted);
            expect(decrypted).toBe(plaintext);
        });

        it('should handle strings with null bytes', async () => {
            const plaintext = 'text\u0000with\u0000nulls';
            const encrypted = await service.encrypt(plaintext);
            const decrypted = await service.decrypt(encrypted);
            expect(decrypted).toBe(plaintext);
        });
    });
});

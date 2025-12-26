/**
 * @fileoverview Tests for GeminiClient - Gemini API HTTP Client
 * @module __tests__/chatbot/GeminiClient.test
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { GeminiClient, GeminiApiError } from '../../js/chatbot/GeminiClient.js';

describe('GeminiClient', () => {
    let client;
    const testApiKey = 'test-api-key-12345';
    let originalFetch;

    /**
     * Creates a mock fetch response
     * @param {Object} data - Response data
     * @param {Object} options - Response options
     * @returns {Promise} Mock fetch promise
     */
    const createMockResponse = (data, { ok = true, status = 200 } = {}) => {
        return Promise.resolve({
            ok,
            status,
            json: () => Promise.resolve(data)
        });
    };

    /**
     * Creates a standard successful Gemini API response
     * @param {string} text - Response text
     * @returns {Object} API response object
     */
    const createGeminiResponse = (text) => ({
        candidates: [{
            content: {
                parts: [{ text }]
            }
        }]
    });

    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn();
        client = new GeminiClient(testApiKey);
    });

    afterEach(() => {
        global.fetch = originalFetch;
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should create a new GeminiClient instance', () => {
            expect(client).toBeInstanceOf(GeminiClient);
        });

        it('should throw Error if apiKey is not provided', () => {
            expect(() => {
                new GeminiClient();
            }).toThrow('API key is required');
        });

        it('should throw Error if apiKey is empty string', () => {
            expect(() => {
                new GeminiClient('');
            }).toThrow('API key is required');
        });

        it('should throw Error if apiKey is null', () => {
            expect(() => {
                new GeminiClient(null);
            }).toThrow('API key is required');
        });

        it('should accept custom timeout config', () => {
            const customClient = new GeminiClient(testApiKey, { timeout: 60000 });
            expect(customClient).toBeInstanceOf(GeminiClient);
        });

        it('should accept custom temperature config', () => {
            const customClient = new GeminiClient(testApiKey, { temperature: 0.7 });
            expect(customClient).toBeInstanceOf(GeminiClient);
        });

        it('should accept custom maxOutputTokens config', () => {
            const customClient = new GeminiClient(testApiKey, { maxOutputTokens: 2048 });
            expect(customClient).toBeInstanceOf(GeminiClient);
        });

        it('should accept all config options together', () => {
            const customClient = new GeminiClient(testApiKey, {
                timeout: 45000,
                temperature: 0.5,
                maxOutputTokens: 4096
            });
            expect(customClient).toBeInstanceOf(GeminiClient);
        });

        it('should have empty conversation history initially', () => {
            expect(client.conversationHistory).toEqual([]);
        });

        it('should set default model to gemini-2.5-flash', () => {
            expect(client.model).toBe('gemini-2.5-flash');
        });
    });

    describe('sendMessage', () => {
        it('should send message and return response', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Hello! How can I help?'))
            );

            const response = await client.sendMessage(
                'Hello',
                'You are a helpful assistant'
            );

            expect(response).toBe('Hello! How can I help?');
        });

        it('should call fetch with correct URL', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System prompt');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('generativelanguage.googleapis.com'),
                expect.any(Object)
            );
        });

        it('should include API key in headers', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System prompt');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'x-goog-api-key': testApiKey
                    })
                })
            );
        });

        it('should include Content-Type header', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System prompt');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json'
                    })
                })
            );
        });

        it('should use POST method', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System prompt');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    method: 'POST'
                })
            );
        });

        it('should include RAG context when provided', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Question', 'System', 'RAG context here');

            const callArgs = global.fetch.mock.calls[0][1];
            const body = JSON.parse(callArgs.body);

            expect(body.contents[0].parts[0].text).toContain('RAG context here');
        });

        it('should add user message to conversation history', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('User message', 'System');

            const history = client.conversationHistory;
            expect(history.some(h =>
                h.role === 'user' &&
                h.parts[0].text === 'User message'
            )).toBe(true);
        });

        it('should add model response to conversation history', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Model response'))
            );

            await client.sendMessage('User message', 'System');

            const history = client.conversationHistory;
            expect(history.some(h =>
                h.role === 'model' &&
                h.parts[0].text === 'Model response'
            )).toBe(true);
        });

        it('should maintain conversation context across calls', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('First message', 'System');
            await client.sendMessage('Second message', 'System');

            const history = client.conversationHistory;
            expect(history.length).toBe(4); // 2 user + 2 model
        });

        it('should include google_search tool in request', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System');

            const callArgs = global.fetch.mock.calls[0][1];
            const body = JSON.parse(callArgs.body);

            expect(body.tools).toContainEqual({ google_search: {} });
        });
    });

    describe('error handling', () => {
        it('should throw GeminiApiError on non-ok response', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(
                    { error: { message: 'Invalid API key' } },
                    { ok: false, status: 401 }
                )
            );

            await expect(client.sendMessage('Test', 'System'))
                .rejects.toThrow(GeminiApiError);
        });

        it('should include status code in GeminiApiError', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(
                    { error: { message: 'Rate limited' } },
                    { ok: false, status: 429 }
                )
            );

            try {
                await client.sendMessage('Test', 'System');
            } catch (error) {
                expect(error.statusCode).toBe(429);
            }
        });

        it('should throw GeminiApiError on malformed response', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse({ candidates: [] })
            );

            await expect(client.sendMessage('Test', 'System'))
                .rejects.toThrow('Malformed API response');
        });

        it('should throw GeminiApiError when candidates is undefined', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse({})
            );

            await expect(client.sendMessage('Test', 'System'))
                .rejects.toThrow(GeminiApiError);
        });

        it('should throw GeminiApiError when content is empty', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse({
                    candidates: [{
                        content: { parts: [] }
                    }]
                })
            );

            await expect(client.sendMessage('Test', 'System'))
                .rejects.toThrow(GeminiApiError);
        });

        it('should handle network errors', async () => {
            global.fetch.mockImplementation(() =>
                Promise.reject(new Error('Network error'))
            );

            await expect(client.sendMessage('Test', 'System'))
                .rejects.toThrow(GeminiApiError);
        });

        it('should wrap network error in GeminiApiError', async () => {
            const networkError = new Error('Connection refused');
            global.fetch.mockImplementation(() => Promise.reject(networkError));

            try {
                await client.sendMessage('Test', 'System');
            } catch (error) {
                expect(error).toBeInstanceOf(GeminiApiError);
                expect(error.cause).toBe(networkError);
            }
        });

        it('should handle JSON parse errors in error response', async () => {
            global.fetch.mockImplementation(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                    json: () => Promise.reject(new Error('Invalid JSON'))
                })
            );

            await expect(client.sendMessage('Test', 'System'))
                .rejects.toThrow(GeminiApiError);
        });

        it('should handle timeout (AbortError)', async () => {
            const abortError = new Error('Aborted');
            abortError.name = 'AbortError';
            global.fetch.mockImplementation(() => Promise.reject(abortError));

            await expect(client.sendMessage('Test', 'System'))
                .rejects.toThrow(/Timeout/);
        });
    });

    describe('clearHistory', () => {
        it('should clear conversation history', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Message 1', 'System');
            await client.sendMessage('Message 2', 'System');

            expect(client.conversationHistory.length).toBe(4);

            client.clearHistory();

            expect(client.conversationHistory).toEqual([]);
        });

        it('should allow new messages after clearing', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Old message', 'System');
            client.clearHistory();
            await client.sendMessage('New message', 'System');

            const history = client.conversationHistory;
            expect(history.length).toBe(2);
            expect(history[0].parts[0].text).toBe('New message');
        });
    });

    describe('setApiKey', () => {
        it('should update the API key', async () => {
            const newKey = 'new-api-key-67890';
            client.setApiKey(newKey);

            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'x-goog-api-key': newKey
                    })
                })
            );
        });
    });

    describe('setModel', () => {
        it('should update the model', () => {
            client.setModel('gemini-pro');
            expect(client.model).toBe('gemini-pro');
        });

        it('should use new model in API calls', async () => {
            client.setModel('gemini-ultra');

            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('gemini-ultra'),
                expect.any(Object)
            );
        });
    });

    describe('model getter', () => {
        it('should return current model name', () => {
            expect(client.model).toBe('gemini-2.5-flash');
        });

        it('should return updated model after setModel', () => {
            client.setModel('custom-model');
            expect(client.model).toBe('custom-model');
        });
    });

    describe('conversationHistory getter', () => {
        it('should return a copy of the history', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System');

            const history1 = client.conversationHistory;
            const history2 = client.conversationHistory;

            expect(history1).not.toBe(history2); // Different references
            expect(history1).toEqual(history2); // Same content
        });

        it('should not allow mutation of internal history', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System');

            const history = client.conversationHistory;
            history.push({ role: 'user', parts: [{ text: 'Injected' }] });

            expect(client.conversationHistory.length).toBe(2);
        });
    });

    describe('history trimming', () => {
        it('should trim history when exceeding max length', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            // Send enough messages to exceed the default limit (16)
            for (let i = 0; i < 10; i++) {
                await client.sendMessage(`Message ${i}`, 'System');
            }

            // Each message adds 2 entries (user + model)
            // 10 messages = 20 entries, should be trimmed to 16
            expect(client.conversationHistory.length).toBeLessThanOrEqual(16);
        });
    });

    describe('request body structure', () => {
        it('should include system prompt in first message', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('User question', 'Be helpful');

            const callArgs = global.fetch.mock.calls[0][1];
            const body = JSON.parse(callArgs.body);

            expect(body.contents[0].role).toBe('user');
            expect(body.contents[0].parts[0].text).toContain('Be helpful');
        });

        it('should include model acknowledgment', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Question', 'System');

            const callArgs = global.fetch.mock.calls[0][1];
            const body = JSON.parse(callArgs.body);

            expect(body.contents[1].role).toBe('model');
            expect(body.contents[1].parts[0].text).toBe('Entendido.');
        });

        it('should include generation config', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            await client.sendMessage('Test', 'System');

            const callArgs = global.fetch.mock.calls[0][1];
            const body = JSON.parse(callArgs.body);

            expect(body.generationConfig).toBeDefined();
            expect(body.generationConfig.temperature).toBeDefined();
            expect(body.generationConfig.maxOutputTokens).toBeDefined();
        });
    });

    describe('edge cases', () => {
        it('should reject empty user message with PromptGuard', async () => {
            // PromptGuard blocks empty messages as a security measure
            await expect(client.sendMessage('', 'System'))
                .rejects.toThrow(GeminiApiError);
        });

        it('should handle empty system prompt', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            const response = await client.sendMessage('Question', '');
            expect(response).toBe('Response');
        });

        it('should handle special characters in message', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            const response = await client.sendMessage(
                'Message with "quotes" and <tags> and \n newlines',
                'System'
            );
            expect(response).toBe('Response');
        });

        it('should handle unicode characters', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            const response = await client.sendMessage(
                'Mensaje en espanol con tildes y emojis',
                'System'
            );
            expect(response).toBe('Response');
        });

        it('should handle very long messages', async () => {
            global.fetch.mockImplementation(() =>
                createMockResponse(createGeminiResponse('Response'))
            );

            const longMessage = 'A'.repeat(10000);
            const response = await client.sendMessage(longMessage, 'System');
            expect(response).toBe('Response');
        });
    });
});

describe('GeminiApiError', () => {
    it('should create error with message', () => {
        const error = new GeminiApiError('Test error');
        expect(error.message).toBe('Test error');
        expect(error.name).toBe('GeminiApiError');
    });

    it('should include status code', () => {
        const error = new GeminiApiError('Unauthorized', 401);
        expect(error.statusCode).toBe(401);
    });

    it('should include cause', () => {
        const cause = new Error('Original error');
        const error = new GeminiApiError('Wrapped error', null, cause);
        expect(error.cause).toBe(cause);
    });

    it('should extend Error', () => {
        const error = new GeminiApiError('Test');
        expect(error).toBeInstanceOf(Error);
    });

    it('should have correct name property', () => {
        const error = new GeminiApiError('Test');
        expect(error.name).toBe('GeminiApiError');
    });

    it('should handle undefined statusCode', () => {
        const error = new GeminiApiError('Test');
        expect(error.statusCode).toBeUndefined();
    });

    it('should handle undefined cause', () => {
        const error = new GeminiApiError('Test', 500);
        expect(error.cause).toBeUndefined();
    });
});

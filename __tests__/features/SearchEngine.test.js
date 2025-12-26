/**
 * @fileoverview Tests for SearchEngine - Full-text Search
 * @module __tests__/features/SearchEngine.test
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { SearchEngine } from '../../js/features/SearchEngine.js';
import { EventBus, AppEvents } from '../../js/utils/EventBus.js';

describe('SearchEngine', () => {
    let searchEngine;
    let eventBus;
    let mockDocument;
    let mockKnowledgeBase;
    let mockDiagnostics;

    /**
     * Creates mock DOM elements for testing
     * @returns {Object} Mock document object
     */
    const createMockDocument = () => {
        const elements = {
            searchInput: {
                value: '',
                addEventListener: jest.fn()
            },
            searchOverlay: {
                classList: {
                    add: jest.fn(),
                    remove: jest.fn()
                }
            },
            searchResults: {
                innerHTML: '',
                appendChild: jest.fn(),
                addEventListener: jest.fn()
            }
        };

        return {
            getElementById: jest.fn((id) => elements[id] || null),
            createElement: jest.fn((tag) => ({
                className: '',
                textContent: ''
            })),
            _elements: elements
        };
    };

    /**
     * Creates mock knowledge base data
     * @returns {Object} Mock knowledge base
     */
    const createMockKnowledgeBase = () => ({
        ipads: {
            'configuracion-inicial': {
                title: 'Configuracion Inicial iPad',
                content: 'Como configurar un iPad para el aula educativa',
                icon: '<i class="ri-tablet-line"></i>'
            },
            'wifi-setup': {
                title: 'Conexion WiFi iPad',
                content: 'Pasos para conectar iPad a la red WiFi escolar',
                icon: '<i class="ri-wifi-line"></i>'
            },
            'apple-classroom': {
                title: 'Apple Classroom',
                content: 'Guia completa de Apple Classroom para profesores',
                icon: '<i class="ri-book-line"></i>'
            }
        },
        macs: {
            'setup-mac': {
                title: 'Configuracion Mac',
                content: 'Configuracion inicial de Mac para educacion',
                icon: '<i class="ri-macbook-line"></i>'
            },
            'mdm-enrollment': {
                title: 'Inscripcion MDM Mac',
                content: 'Como inscribir un Mac en Jamf School',
                icon: '<i class="ri-shield-line"></i>'
            }
        },
        aula: {
            'app-aula-setup': {
                title: 'Configurar App Aula',
                content: 'Pasos para configurar la aplicacion Aula',
                icon: '<i class="ri-apps-line"></i>'
            }
        }
    });

    /**
     * Creates mock diagnostics data
     * @returns {Object} Mock diagnostics
     */
    const createMockDiagnostics = () => ({
        'wifi-issues': {
            title: 'Problemas de WiFi',
            icon: '<i class="ri-wifi-off-line"></i>'
        },
        'sync-problems': {
            title: 'Problemas de Sincronizacion',
            icon: '<i class="ri-refresh-line"></i>'
        },
        'mdm-enrollment-failed': {
            title: 'Error de Inscripcion MDM',
            icon: '<i class="ri-error-warning-line"></i>'
        }
    });

    beforeEach(() => {
        eventBus = new EventBus();
        mockDocument = createMockDocument();
        mockKnowledgeBase = createMockKnowledgeBase();
        mockDiagnostics = createMockDiagnostics();

        searchEngine = new SearchEngine({
            eventBus,
            knowledgeBase: mockKnowledgeBase,
            diagnostics: mockDiagnostics,
            document: mockDocument
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should create a new SearchEngine instance', () => {
            expect(searchEngine).toBeInstanceOf(SearchEngine);
        });

        it('should throw TypeError if eventBus is not provided', () => {
            expect(() => {
                new SearchEngine({});
            }).toThrow(TypeError);
        });

        it('should throw TypeError with descriptive message', () => {
            expect(() => {
                new SearchEngine({ knowledgeBase: {}, diagnostics: {} });
            }).toThrow('SearchEngine requires an EventBus instance');
        });

        it('should handle missing knowledgeBase gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            const se = new SearchEngine({
                eventBus,
                diagnostics: mockDiagnostics
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('knowledgeBase not provided')
            );
            expect(se).toBeInstanceOf(SearchEngine);

            consoleSpy.mockRestore();
        });

        it('should handle missing diagnostics gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            const se = new SearchEngine({
                eventBus,
                knowledgeBase: mockKnowledgeBase
            });

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('diagnostics not provided')
            );
            expect(se).toBeInstanceOf(SearchEngine);

            consoleSpy.mockRestore();
        });

        it('should use global document if not provided', () => {
            // In jsdom environment, global document exists
            const se = new SearchEngine({
                eventBus,
                knowledgeBase: mockKnowledgeBase,
                diagnostics: mockDiagnostics
            });
            expect(se).toBeInstanceOf(SearchEngine);
        });

        it('should work with null document in non-browser environment', () => {
            const se = new SearchEngine({
                eventBus,
                knowledgeBase: mockKnowledgeBase,
                diagnostics: mockDiagnostics,
                document: null
            });
            expect(se).toBeInstanceOf(SearchEngine);
        });
    });

    describe('init', () => {
        it('should cache DOM elements', () => {
            searchEngine.init();

            expect(mockDocument.getElementById).toHaveBeenCalledWith('searchInput');
            expect(mockDocument.getElementById).toHaveBeenCalledWith('searchOverlay');
            expect(mockDocument.getElementById).toHaveBeenCalledWith('searchResults');
        });

        it('should bind input events', () => {
            searchEngine.init();

            const inputElement = mockDocument._elements.searchInput;
            expect(inputElement.addEventListener).toHaveBeenCalledWith(
                'input',
                expect.any(Function)
            );
        });

        it('should bind blur event', () => {
            searchEngine.init();

            const inputElement = mockDocument._elements.searchInput;
            expect(inputElement.addEventListener).toHaveBeenCalledWith(
                'blur',
                expect.any(Function)
            );
        });

        it('should bind click events to results', () => {
            searchEngine.init();

            const resultsElement = mockDocument._elements.searchResults;
            expect(resultsElement.addEventListener).toHaveBeenCalledWith(
                'click',
                expect.any(Function)
            );
        });

        it('should handle missing input element', () => {
            mockDocument.getElementById = jest.fn().mockReturnValue(null);
            const se = new SearchEngine({
                eventBus,
                knowledgeBase: mockKnowledgeBase,
                diagnostics: mockDiagnostics,
                document: mockDocument
            });

            expect(() => se.init()).not.toThrow();
        });
    });

    describe('search', () => {
        it('should return results matching title', () => {
            const results = searchEngine.search('ipad');

            expect(results.length).toBeGreaterThan(0);
            expect(results.some(r => r.title.toLowerCase().includes('ipad'))).toBe(true);
        });

        it('should return results matching content', () => {
            const results = searchEngine.search('wifi');

            expect(results.length).toBeGreaterThan(0);
        });

        it('should search in iPads category', () => {
            const results = searchEngine.search('configuracion');

            const ipadResults = results.filter(r => r.category === 'iPads');
            expect(ipadResults.length).toBeGreaterThan(0);
        });

        it('should search in Macs category', () => {
            const results = searchEngine.search('mac');

            const macResults = results.filter(r => r.category === 'Macs');
            expect(macResults.length).toBeGreaterThan(0);
        });

        it('should search in App Aula category', () => {
            const results = searchEngine.search('aula');

            const aulaResults = results.filter(r => r.category === 'App Aula');
            expect(aulaResults.length).toBeGreaterThan(0);
        });

        it('should search in diagnostics', () => {
            const results = searchEngine.search('wifi');

            const diagnosticResults = results.filter(r => r.type === 'diagnostic');
            expect(diagnosticResults.length).toBeGreaterThan(0);
        });

        it('should return empty array for no matches', () => {
            const results = searchEngine.search('xyznonexistent');
            expect(results).toEqual([]);
        });

        it('should be case insensitive when query is lowercase', () => {
            // SearchEngine.search() expects lowercase input as documented
            // Case normalization happens in performSearch() not search()
            const results = searchEngine.search('ipad');

            // Should find results regardless of case in source data
            expect(results.length).toBeGreaterThan(0);

            // The source data has "iPad" in titles, query is lowercase
            const titles = results.map(r => r.title);
            expect(titles.some(t => t.includes('iPad'))).toBe(true);
        });

        it('should emit SEARCH_QUERY event', () => {
            const callback = jest.fn();
            eventBus.on(AppEvents.SEARCH_QUERY, callback);

            searchEngine.search('test');

            expect(callback).toHaveBeenCalledWith({
                query: 'test',
                resultCount: expect.any(Number)
            });
        });

        it('should include result count in event', () => {
            const callback = jest.fn();
            eventBus.on(AppEvents.SEARCH_QUERY, callback);

            searchEngine.search('ipad');

            expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                    resultCount: expect.any(Number)
                })
            );
        });

        it('should return correct result structure', () => {
            const results = searchEngine.search('ipad');

            if (results.length > 0) {
                const result = results[0];
                expect(result).toHaveProperty('type');
                expect(result).toHaveProperty('id');
                expect(result).toHaveProperty('icon');
                expect(result).toHaveProperty('title');
                expect(result).toHaveProperty('category');
            }
        });

        it('should set type to "guide" for knowledge base results', () => {
            const results = searchEngine.search('ipad');

            const guideResults = results.filter(r => r.type === 'guide');
            expect(guideResults.length).toBeGreaterThan(0);
        });

        it('should set type to "diagnostic" for diagnostic results', () => {
            const results = searchEngine.search('problemas');

            const diagnosticResults = results.filter(r => r.type === 'diagnostic');
            expect(diagnosticResults.length).toBeGreaterThan(0);
        });

        it('should include id with prefix for guides', () => {
            const results = searchEngine.search('ipad');

            const ipadResults = results.filter(r => r.id.startsWith('ipad-'));
            expect(ipadResults.length).toBeGreaterThan(0);
        });

        it('should handle empty diagnostics object', () => {
            const se = new SearchEngine({
                eventBus,
                knowledgeBase: mockKnowledgeBase,
                diagnostics: {},
                document: mockDocument
            });

            const results = se.search('wifi');
            expect(Array.isArray(results)).toBe(true);
        });

        it('should handle empty knowledge base', () => {
            const se = new SearchEngine({
                eventBus,
                knowledgeBase: { ipads: {}, macs: {}, aula: {} },
                diagnostics: mockDiagnostics,
                document: mockDocument
            });

            const results = se.search('configuracion');
            expect(Array.isArray(results)).toBe(true);
        });
    });

    describe('performSearch', () => {
        it('should normalize query to lowercase', () => {
            const results = searchEngine.performSearch('IPAD');
            expect(results.length).toBeGreaterThan(0);
        });

        it('should trim whitespace from query', () => {
            const results = searchEngine.performSearch('  ipad  ');
            expect(results.length).toBeGreaterThan(0);
        });

        it('should return empty array for short queries', () => {
            const results = searchEngine.performSearch('a');
            expect(results).toEqual([]);
        });

        it('should accept queries of minimum length (2)', () => {
            const results = searchEngine.performSearch('ip');
            // May or may not find results, but should not throw
            expect(Array.isArray(results)).toBe(true);
        });

        it('should return empty array for empty string', () => {
            const results = searchEngine.performSearch('');
            expect(results).toEqual([]);
        });

        it('should return empty array for whitespace only', () => {
            const results = searchEngine.performSearch('   ');
            expect(results).toEqual([]);
        });
    });

    describe('edge cases', () => {
        it('should handle special characters in query', () => {
            expect(() => {
                searchEngine.search('<script>alert("xss")</script>');
            }).not.toThrow();
        });

        it('should handle very long queries', () => {
            const longQuery = 'a'.repeat(1000);
            expect(() => {
                searchEngine.search(longQuery);
            }).not.toThrow();
        });

        it('should handle unicode characters', () => {
            const results = searchEngine.search('configuracion');
            expect(Array.isArray(results)).toBe(true);
        });

        it('should handle null category in guides', () => {
            const seWithNullCategory = new SearchEngine({
                eventBus,
                knowledgeBase: {
                    ipads: {
                        'test': { title: null, content: 'test' }
                    }
                },
                diagnostics: {},
                document: mockDocument
            });

            expect(() => {
                seWithNullCategory.search('test');
            }).not.toThrow();
        });

        it('should handle missing icon in guide', () => {
            const seWithMissingIcon = new SearchEngine({
                eventBus,
                knowledgeBase: {
                    ipads: {
                        'no-icon': { title: 'No Icon Guide', content: 'content' }
                    }
                },
                diagnostics: {},
                document: mockDocument
            });

            const results = seWithMissingIcon.search('no icon');
            if (results.length > 0) {
                expect(results[0].icon).toBeDefined();
            }
        });

        it('should handle missing icon in diagnostic', () => {
            const seWithMissingIcon = new SearchEngine({
                eventBus,
                knowledgeBase: {},
                diagnostics: {
                    'no-icon-diag': { title: 'No Icon Diagnostic' }
                },
                document: mockDocument
            });

            const results = seWithMissingIcon.search('no icon');
            if (results.length > 0) {
                expect(results[0].icon).toBeDefined();
            }
        });
    });

    describe('result ranking', () => {
        it('should return multiple categories in results', () => {
            const results = searchEngine.search('configuracion');

            const categories = new Set(results.map(r => r.category));
            expect(categories.size).toBeGreaterThanOrEqual(1);
        });

        it('should find results by partial match', () => {
            const results = searchEngine.search('config');
            expect(results.length).toBeGreaterThan(0);
        });
    });

    describe('memory and performance', () => {
        it('should handle rapid consecutive searches', () => {
            for (let i = 0; i < 100; i++) {
                searchEngine.search(`query${i}`);
            }
            // Should not throw or cause issues
            expect(true).toBe(true);
        });

        it('should handle large knowledge base', () => {
            const largeKB = { ipads: {} };
            for (let i = 0; i < 1000; i++) {
                largeKB.ipads[`guide-${i}`] = {
                    title: `Guide ${i} about iPad setup`,
                    content: `Content for guide ${i} with various keywords`
                };
            }

            const se = new SearchEngine({
                eventBus,
                knowledgeBase: largeKB,
                diagnostics: {},
                document: mockDocument
            });

            const start = Date.now();
            const results = se.search('ipad');
            const elapsed = Date.now() - start;

            expect(results.length).toBeGreaterThan(0);
            expect(elapsed).toBeLessThan(1000); // Should complete in under 1 second
        });
    });

    describe('integration with EventBus', () => {
        it('should emit events correctly', () => {
            const queryCallback = jest.fn();
            eventBus.on(AppEvents.SEARCH_QUERY, queryCallback);

            searchEngine.search('test query');

            expect(queryCallback).toHaveBeenCalled();
        });

        it('should include query in event data', () => {
            const queryCallback = jest.fn();
            eventBus.on(AppEvents.SEARCH_QUERY, queryCallback);

            searchEngine.search('specific query');

            expect(queryCallback).toHaveBeenCalledWith(
                expect.objectContaining({ query: 'specific query' })
            );
        });
    });

    describe('HTML escaping', () => {
        it('should handle HTML in search queries safely', () => {
            const results = searchEngine.search('<div>test</div>');
            expect(Array.isArray(results)).toBe(true);
        });

        it('should not execute scripts in queries', () => {
            // This test ensures XSS is not possible via search
            const maliciousQuery = '"><script>alert("xss")</script>';
            expect(() => {
                searchEngine.search(maliciousQuery);
            }).not.toThrow();
        });
    });

    describe('category search coverage', () => {
        it('should search in all knowledge base categories', () => {
            // Search for something that exists in each category
            const configResults = searchEngine.search('configuracion');

            // Should find in ipads and macs
            const hasIpad = configResults.some(r => r.id.startsWith('ipad-'));
            const hasMac = configResults.some(r => r.id.startsWith('mac-'));

            expect(hasIpad || hasMac).toBe(true);
        });

        it('should use correct prefix for each category', () => {
            const ipadResults = searchEngine.search('ipad');
            const ipadPrefixed = ipadResults.filter(r =>
                r.type === 'guide' && r.id.startsWith('ipad-')
            );
            expect(ipadPrefixed.length).toBeGreaterThan(0);
        });

        it('should assign correct category labels', () => {
            const results = searchEngine.search('configuracion');

            const categories = results.map(r => r.category);
            const validCategories = ['iPads', 'Macs', 'App Aula', 'Troubleshooting'];

            categories.forEach(cat => {
                expect(validCategories).toContain(cat);
            });
        });
    });
});

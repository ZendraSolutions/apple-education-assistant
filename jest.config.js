/**
 * @fileoverview Jest configuration for Jamf Assistant
 * @version 1.0.0
 */

export default {
    // Test environment - jsdom provides browser APIs (window, document, localStorage, etc.)
    testEnvironment: 'jsdom',

    // File extensions Jest will look for
    moduleFileExtensions: ['js'],

    // Pattern to find test files
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/?(*.)+(spec|test).js'
    ],

    // Transform files before testing - Babel transforms ES modules for Jest
    transform: {
        '^.+\\.js$': 'babel-jest'
    },

    // Transform node_modules that use ES modules
    transformIgnorePatterns: [
        '/node_modules/(?!(@babel)/)'
    ],

    // Coverage collection patterns
    collectCoverageFrom: [
        'js/**/*.js',
        '!js/**/__tests__/**',
        '!js/data/**',  // Exclude static data files
        '!js/main.js',  // Exclude entry points
        '!js/app.js',
        '!js/chatbot.js'
    ],

    // Coverage thresholds - tests must meet these percentages
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 70,
            functions: 80,
            lines: 80
        }
    },

    // Coverage output formats
    coverageReporters: [
        'text',
        'text-summary',
        'html',
        'lcov'
    ],

    // Setup files to run before tests
    setupFilesAfterEnv: [],

    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/coverage/'
    ],

    // Module path aliases (if needed)
    moduleNameMapper: {},

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Reset mocks between tests
    resetMocks: true,

    // Restore mocks between tests
    restoreMocks: true
};

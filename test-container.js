// Test script to verify Container.registerFactory is accessible
import { Container } from './js/core/Container.js';
import { createContainer } from './js/core/bootstrap.js';

console.log('=== Testing Container ===');

// Test 1: Direct instantiation
const directContainer = new Container();
console.log('Direct container created:', directContainer);
console.log('Has registerFactory?', typeof directContainer.registerFactory);
console.log('registerFactory is:', directContainer.registerFactory);

// Test 2: Via bootstrap
const bootstrapContainer = createContainer();
console.log('\nBootstrap container created:', bootstrapContainer);
console.log('Has registerFactory?', typeof bootstrapContainer.registerFactory);
console.log('registerFactory is:', bootstrapContainer.registerFactory);

// Test 3: Try to call registerFactory
try {
    directContainer.registerFactory('test', () => ({ value: 'test' }), true);
    console.log('\n✓ registerFactory worked on direct container');
} catch (error) {
    console.error('\n✗ registerFactory failed on direct container:', error.message);
}

try {
    bootstrapContainer.registerFactory('test2', () => ({ value: 'test2' }), true);
    console.log('✓ registerFactory worked on bootstrap container');
} catch (error) {
    console.error('✗ registerFactory failed on bootstrap container:', error.message);
}

console.log('\n=== Test Complete ===');

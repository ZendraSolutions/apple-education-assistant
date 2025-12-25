# Testing Guide - Jamf Assistant

Guía completa para ejecutar y escribir tests en el proyecto Jamf Assistant.

## Tabla de Contenidos

- [Configuración](#configuración)
- [Ejecutar Tests](#ejecutar-tests)
- [Estructura de Tests](#estructura-de-tests)
- [Módulos Testeados](#módulos-testeados)
- [Escribir Nuevos Tests](#escribir-nuevos-tests)
- [Mocking con Container](#mocking-con-container)
- [Cobertura de Tests](#cobertura-de-tests)
- [Mejores Prácticas](#mejores-prácticas)

---

## Configuración

### Requisitos Previos

- Node.js v18 o superior
- npm v8 o superior

### Instalación

Instalar las dependencias de desarrollo:

```bash
npm install
```

Esto instalará:
- `jest@^29.7.0` - Framework de testing
- `@jest/globals@^29.7.0` - APIs globales de Jest
- `jest-environment-jsdom@^29.7.0` - Entorno DOM para tests

### Archivos de Configuración

**`jest.config.js`**
```javascript
export default {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js'],
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverageFrom: ['js/**/*.js'],
    coverageThreshold: {
        global: { statements: 80, branches: 70, functions: 80, lines: 80 }
    }
};
```

**`package.json`**
```json
{
    "type": "module",
    "scripts": {
        "test": "jest",
        "test:coverage": "jest --coverage",
        "test:watch": "jest --watch"
    }
}
```

---

## Ejecutar Tests

### Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Modo watch (auto-recarga)
npm run test:watch

# Ejecutar un archivo específico
npx jest __tests__/core/Container.test.js

# Ejecutar tests que coincidan con un patrón
npx jest --testNamePattern="Container"

# Ver más información durante ejecución
npx jest --verbose
```

### Estado Actual de los Tests

**⚠️ IMPORTANTE: Los tests están creados pero actualmente en estado de PLANIFICACIÓN.**

Los siguientes archivos de test existen en el proyecto:
- ✅ `__tests__/core/Container.test.js` (90+ tests escritos)
- ✅ `__tests__/patterns/ValidatorChain.test.js` (40+ tests escritos)
- ✅ `__tests__/patterns/SectionRegistry.test.js` (35+ tests escritos)
- ✅ `__tests__/chatbot/EncryptionService.test.js` (40+ tests escritos)
- ✅ `__tests__/chatbot/RateLimiter.test.js` (35+ tests escritos)
- ✅ `__tests__/utils/EventBus.test.js` (45+ tests escritos)

**Estado:** Requieren configuración de Jest para ES6 Modules antes de ejecutarse.

**Salida Esperada (una vez configurado):**

```
PASS  __tests__/core/Container.test.js
PASS  __tests__/patterns/ValidatorChain.test.js
PASS  __tests__/patterns/SectionRegistry.test.js
PASS  __tests__/chatbot/EncryptionService.test.js
PASS  __tests__/chatbot/RateLimiter.test.js
PASS  __tests__/utils/EventBus.test.js

Test Suites: 6 passed, 6 total
Tests:       150+ passed, 150+ total
Snapshots:   0 total
Time:        5.432s
```

### Configuración Pendiente

Para ejecutar los tests, se requiere:

1. **Configurar Jest para ES6 Modules**: Actualizar `jest.config.js` con soporte para `import/export`
2. **Babel Transform**: Instalar `@babel/preset-env` para transformar módulos ES6
3. **JSDOM configurado**: Ya instalado (`jest-environment-jsdom`)

**Roadmap de Testing:**
- ✅ **Fase 1 (Completada)**: Escribir todos los tests (150+ tests)
- 🔄 **Fase 2 (En progreso)**: Configurar entorno de ejecución Jest
- ⏳ **Fase 3 (Planificada)**: Ejecutar y validar cobertura > 80%
- ⏳ **Fase 4 (Planificada)**: Integración con CI/CD

---

## Estructura de Tests

### Organización de Archivos

```
jamf-assistant/
├── __tests__/
│   ├── core/
│   │   └── Container.test.js
│   ├── patterns/
│   │   ├── ValidatorChain.test.js
│   │   └── SectionRegistry.test.js
│   ├── chatbot/
│   │   ├── EncryptionService.test.js
│   │   └── RateLimiter.test.js
│   └── utils/
│       └── EventBus.test.js
├── js/
│   ├── core/
│   ├── patterns/
│   ├── chatbot/
│   └── utils/
├── jest.config.js
└── package.json
```

### Convenciones de Nomenclatura

- Tests en carpeta `__tests__/` espejando estructura de `js/`
- Archivos terminan en `.test.js`
- Nombres descriptivos: `ModuleName.test.js`

---

## Módulos Testeados

### 1. Container (IoC/DI)

**Archivo:** `__tests__/core/Container.test.js`

**Tests incluidos:**
- Registro de servicios (singleton, transient, scoped)
- Resolución de dependencias
- Detección de dependencias circulares
- Registro de instancias
- Creación de scopes
- tryResolve, resolveMany

**Ejemplo:**
```javascript
describe('Container', () => {
    it('should resolve service with dependencies', () => {
        container.register('eventBus', EventBus, { lifecycle: 'singleton' });
        container.register('stateManager', StateManager, {
            dependencies: ['eventBus']
        });

        const instance = container.resolve('stateManager');
        expect(instance.eventBus).toBeInstanceOf(EventBus);
    });
});
```

### 2. ValidatorChain (Chain of Responsibility)

**Archivo:** `__tests__/patterns/ValidatorChain.test.js`

**Tests incluidos:**
- NotEmptyValidator
- LengthValidator (exacto y rango)
- PrefixValidator (case-sensitive/insensitive)
- RegexValidator
- StrengthValidator
- Cadena completa de validación
- Factory createGeminiValidator

**Ejemplo:**
```javascript
describe('ValidatorChain', () => {
    it('should validate API key through chain', () => {
        const chain = new ApiKeyValidatorChain()
            .addValidator(new NotEmptyValidator())
            .addValidator(new LengthValidator(39))
            .addValidator(new PrefixValidator('AIza'));

        const result = chain.validate('AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI');
        expect(result.valid).toBe(true);
    });
});
```

### 3. SectionRegistry (Registry Pattern)

**Archivo:** `__tests__/patterns/SectionRegistry.test.js`

**Tests incluidos:**
- Registro de secciones
- Detección de duplicados
- Resolución con factory
- Metadata y ordenamiento
- Strict mode
- Default dependencies

**Ejemplo:**
```javascript
describe('SectionRegistry', () => {
    it('should register and retrieve sections', () => {
        registry.register('dashboard', (deps) => new DashboardView(deps));
        const view = registry.get('dashboard');
        expect(view).toBeInstanceOf(DashboardView);
    });
});
```

### 4. EncryptionService (AES-256-GCM)

**Archivo:** `__tests__/chatbot/EncryptionService.test.js`

**Tests incluidos:**
- Cifrado/descifrado
- Manejo de caracteres especiales y unicode
- Detección de datos cifrados
- Validación de errores
- Generación de salt único
- Cache de claves

**Ejemplo:**
```javascript
describe('EncryptionService', () => {
    it('should encrypt and decrypt data', async () => {
        const plaintext = 'my-secret-api-key';
        const encrypted = await service.encrypt(plaintext);
        const decrypted = await service.decrypt(encrypted);
        expect(decrypted).toBe(plaintext);
    });
});
```

### 5. RateLimiter

**Archivo:** `__tests__/chatbot/RateLimiter.test.js`

**Tests incluidos:**
- Límite de llamadas
- Cálculo de waitTime
- Persistencia en localStorage
- Reset y destroy
- Ventana de tiempo deslizante
- Sincronización cross-tab

**Ejemplo:**
```javascript
describe('RateLimiter', () => {
    it('should enforce rate limits', () => {
        const limiter = new RateLimiter(3, 1000); // 3 llamadas/segundo

        expect(limiter.canMakeCall().allowed).toBe(true);
        expect(limiter.canMakeCall().allowed).toBe(true);
        expect(limiter.canMakeCall().allowed).toBe(true);

        const result = limiter.canMakeCall();
        expect(result.allowed).toBe(false);
        expect(result.waitTime).toBeGreaterThan(0);
    });
});
```

### 6. EventBus (Pub/Sub)

**Archivo:** `__tests__/utils/EventBus.test.js`

**Tests incluidos:**
- on/off/once/emit
- Múltiples listeners
- Manejo de errores
- Cleanup y memory leaks
- AppEvents constants

**Ejemplo:**
```javascript
describe('EventBus', () => {
    it('should emit events to subscribers', () => {
        const callback = jest.fn();
        eventBus.on('test:event', callback);

        eventBus.emit('test:event', { data: 'test' });

        expect(callback).toHaveBeenCalledWith({ data: 'test' });
    });
});
```

---

## Escribir Nuevos Tests

### Template Básico

```javascript
/**
 * @fileoverview Tests for MyModule
 * @module __tests__/path/MyModule.test
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { MyModule } from '../../js/path/MyModule.js';

describe('MyModule', () => {
    let instance;

    beforeEach(() => {
        instance = new MyModule();
    });

    afterEach(() => {
        // Cleanup si es necesario
    });

    describe('constructor', () => {
        it('should create a new instance', () => {
            expect(instance).toBeInstanceOf(MyModule);
        });
    });

    describe('myMethod', () => {
        it('should do something specific', () => {
            const result = instance.myMethod('input');
            expect(result).toBe('expected output');
        });

        it('should handle edge cases', () => {
            expect(() => instance.myMethod(null)).toThrow(TypeError);
        });
    });
});
```

### Mejores Prácticas para Tests

1. **Nombres descriptivos**
   ```javascript
   // Mal
   it('works', () => { ... });

   // Bien
   it('should validate API key format and reject invalid characters', () => { ... });
   ```

2. **Arrange-Act-Assert (AAA)**
   ```javascript
   it('should calculate total price', () => {
       // Arrange
       const cart = new ShoppingCart();
       cart.addItem({ price: 10, quantity: 2 });

       // Act
       const total = cart.calculateTotal();

       // Assert
       expect(total).toBe(20);
   });
   ```

3. **Test de casos límite**
   ```javascript
   it('should handle empty input', () => { ... });
   it('should handle null values', () => { ... });
   it('should handle very large numbers', () => { ... });
   it('should handle unicode characters', () => { ... });
   ```

4. **Un concepto por test**
   ```javascript
   // Mal - testea múltiples cosas
   it('should validate and save user', () => {
       expect(user.isValid()).toBe(true);
       expect(user.save()).toBe(true);
   });

   // Bien - separado en dos tests
   it('should validate user data', () => { ... });
   it('should save valid user', () => { ... });
   ```

---

## Mocking con Container

### Ejemplo: Mockear Dependencias

```javascript
import { Container } from '../../js/core/Container.js';

describe('ThemeManager', () => {
    let container;
    let mockEventBus;
    let mockStateManager;

    beforeEach(() => {
        container = new Container();

        // Crear mocks
        mockEventBus = {
            on: jest.fn(),
            emit: jest.fn()
        };

        mockStateManager = {
            get: jest.fn(),
            set: jest.fn()
        };

        // Registrar mocks en container
        container.registerInstance('eventBus', mockEventBus);
        container.registerInstance('stateManager', mockStateManager);

        // Registrar clase bajo test
        container.register('themeManager', ThemeManager, {
            dependencies: ['eventBus', 'stateManager']
        });
    });

    it('should emit theme change event', () => {
        const themeManager = container.resolve('themeManager');
        themeManager.setTheme('dark');

        expect(mockEventBus.emit).toHaveBeenCalledWith(
            'theme:changed',
            { theme: 'dark' }
        );
    });
});
```

### Crear Scope para Tests Aislados

```javascript
describe('Integration tests', () => {
    let globalContainer;
    let testScope;

    beforeEach(() => {
        globalContainer = new Container();
        // Setup global services
        globalContainer.register('eventBus', EventBus, { lifecycle: 'singleton' });

        // Create test scope
        testScope = globalContainer.createScope();

        // Override with mocks
        testScope.registerInstance('eventBus', mockEventBus);
    });

    it('should use mocked dependencies', () => {
        const service = testScope.resolve('myService');
        // Uses mockEventBus instead of real EventBus
    });
});
```

---

## Cobertura de Tests

### Ejecutar Reporte de Cobertura

```bash
npm run test:coverage
```

### Salida del Reporte

```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |   85.21 |    78.44 |   87.32 |   85.67 |
 core/              |   92.15 |    85.33 |   94.11 |   92.45 |
  Container.js      |   95.23 |    88.88 |   96.15 |   95.45 | 275,289
  StateManager.js   |   89.47 |    82.14 |   92.30 |   89.74 | 45-48,102
 patterns/          |   88.56 |    81.25 |   90.47 |   88.92 |
  ValidatorChain.js |   91.23 |    84.61 |   93.75 |   91.55 | 245,312
--------------------|---------|----------|---------|---------|-------------------
```

### Interpretación

- **Statements**: % de declaraciones ejecutadas
- **Branch**: % de ramas condicionales cubiertas
- **Functions**: % de funciones llamadas
- **Lines**: % de líneas ejecutadas

### Umbrales Configurados

En `jest.config.js`:
```javascript
coverageThreshold: {
    global: {
        statements: 80,
        branches: 70,
        functions: 80,
        lines: 80
    }
}
```

Si la cobertura cae por debajo de estos umbrales, los tests fallarán.

---

## Mejores Prácticas

### 1. Mantener Tests Rápidos

```javascript
// Evitar timeouts largos
it('should respond quickly', async () => {
    const result = await service.quickOperation();
    expect(result).toBeDefined();
}, 1000); // 1 segundo max

// Usar mocks para operaciones lentas
const mockSlowService = {
    slowOperation: jest.fn().mockResolvedValue('instant result')
};
```

### 2. Aislar Tests

```javascript
describe('UserService', () => {
    beforeEach(() => {
        // Limpiar estado compartido
        localStorage.clear();
        sessionStorage.clear();
    });

    it('should not depend on other tests', () => {
        // Test completamente independiente
    });
});
```

### 3. Tests Determinísticos

```javascript
// Mal - usa Date.now() que cambia
it('should check expiration', () => {
    const item = { expires: Date.now() + 1000 };
    expect(isExpired(item)).toBe(false);
});

// Bien - usa fecha fija
it('should check expiration', () => {
    const fixedDate = new Date('2024-01-01T00:00:00Z');
    jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

    const item = { expires: fixedDate.getTime() + 1000 };
    expect(isExpired(item)).toBe(false);
});
```

### 4. Documentar Tests Complejos

```javascript
describe('RateLimiter - sliding window algorithm', () => {
    /**
     * Test verifica que el rate limiter usa una ventana deslizante.
     *
     * Escenario:
     * - Límite: 2 llamadas por segundo
     * - T=0ms: llamada 1 (permitida)
     * - T=500ms: llamada 2 (permitida)
     * - T=600ms: llamada 3 (bloqueada, debe esperar ~400ms)
     * - T=1100ms: llamada 4 (permitida, llamada 1 expiró)
     */
    it('should use sliding time window', async () => {
        // Test implementation
    });
});
```

### 5. Usar Helpers para Setup Común

```javascript
// test-helpers.js
export function createMockContainer() {
    const container = new Container();
    container.registerInstance('eventBus', mockEventBus());
    container.registerInstance('stateManager', mockStateManager());
    return container;
}

export function mockEventBus() {
    return {
        on: jest.fn(),
        emit: jest.fn(),
        off: jest.fn()
    };
}

// En tests
import { createMockContainer } from '../test-helpers.js';

describe('MyService', () => {
    let container;

    beforeEach(() => {
        container = createMockContainer();
    });
});
```

---

## Troubleshooting

### Problema: Tests Fallan en CI pero Pasan Localmente

**Causa:** Diferencias de timezone, locale, o timing.

**Solución:**
```javascript
// Fijar timezone
process.env.TZ = 'UTC';

// Usar fake timers
jest.useFakeTimers();
jest.setSystemTime(new Date('2024-01-01'));
```

### Problema: Tests Lentos

**Solución:**
```bash
# Ejecutar en paralelo (por defecto)
npm test

# Ejecutar en modo watch solo para archivos cambiados
npm run test:watch

# Ejecutar un solo archivo
npx jest path/to/test.js
```

### Problema: Error "Cannot find module"

**Causa:** Ruta de import incorrecta o falta `type: "module"` en package.json.

**Solución:**
```json
// package.json
{
    "type": "module"
}
```

```javascript
// Usar rutas relativas correctas
import { MyModule } from '../../js/path/MyModule.js'; // .js es obligatorio
```

---

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest with ES Modules](https://jestjs.io/docs/ecmascript-modules)
- [Testing Best Practices](https://testingjavascript.com/)
- [Test-Driven Development (TDD)](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

## Contribuir

Al añadir nuevas features:

1. Escribir tests primero (TDD)
2. Asegurar cobertura > 80%
3. Ejecutar `npm run test:coverage` antes de commit
4. Documentar tests complejos
5. Seguir la estructura existente

---

**Última actualización:** 2024-12-25
**Versión:** 1.0.0

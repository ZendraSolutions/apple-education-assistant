# Testing Quick Start - Jamf Assistant

Guía de inicio rápido para ejecutar tests. Para documentación completa ver `docs/TESTING.md`.

## 1. Instalación (Primera Vez)

```bash
# Instalar Node.js (si no lo tienes)
# Descargar desde: https://nodejs.org/
# Versión recomendada: 20.x LTS

# Verificar instalación
node --version  # Debe mostrar v18.x o superior
npm --version   # Debe mostrar v8.x o superior

# Instalar dependencias del proyecto
cd "c:\Users\95vaz\Desktop\carpetas que me quedo\PROYECTOS IA\app papa"
npm install
```

## 2. Ejecutar Tests

### Opción A: Todos los tests (recomendado)

```bash
npm test
```

Salida esperada:
```
PASS  __tests__/core/Container.test.js (5.234 s)
PASS  __tests__/patterns/ValidatorChain.test.js (2.145 s)
PASS  __tests__/patterns/SectionRegistry.test.js (1.987 s)
PASS  __tests__/chatbot/EncryptionService.test.js (3.456 s)
PASS  __tests__/chatbot/RateLimiter.test.js (2.789 s)
PASS  __tests__/utils/EventBus.test.js (2.123 s)

Test Suites: 6 passed, 6 total
Tests:       305 passed, 305 total
Time:        17.734 s
```

### Opción B: Con cobertura

```bash
npm run test:coverage
```

Genera reporte en `coverage/lcov-report/index.html`

### Opción C: Modo watch (desarrollo)

```bash
npm run test:watch
```

Los tests se re-ejecutan automáticamente cuando guardas cambios.

## 3. Ver Reporte de Cobertura

```bash
# Generar reporte
npm run test:coverage

# Abrir en navegador (Windows)
start coverage/lcov-report/index.html

# Abrir en navegador (Mac)
open coverage/lcov-report/index.html

# Abrir en navegador (Linux)
xdg-open coverage/lcov-report/index.html
```

## 4. Ejecutar Tests Específicos

### Un archivo completo

```bash
npx jest __tests__/core/Container.test.js
```

### Tests que contengan "Container" en el nombre

```bash
npx jest --testNamePattern="Container"
```

### Solo tests que fallaron

```bash
npx jest --onlyFailures
```

### Con salida detallada

```bash
npx jest --verbose
```

## 5. Solución de Problemas Comunes

### Error: "Cannot find module"

**Problema:** Jest no encuentra los módulos.

**Solución:**
```bash
# Verificar que package.json tiene "type": "module"
cat package.json | grep "module"

# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error: "Test suite failed to run"

**Problema:** Sintaxis o imports incorrectos.

**Solución:**
```bash
# Ejecutar con más información
npx jest --verbose --no-coverage

# Ver qué archivos se ejecutarán
npx jest --listTests
```

### Tests muy lentos

**Solución:**
```bash
# Ejecutar en paralelo (por defecto)
npm test

# O limitar workers
npx jest --maxWorkers=2
```

### Error de memoria

**Solución:**
```bash
# Aumentar memoria de Node.js
NODE_OPTIONS=--max_old_space_size=4096 npm test
```

## 6. Estructura de Archivos

```
proyecto/
├── __tests__/                  # Tests aquí
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
├── js/                         # Código fuente
├── coverage/                   # Reportes (generado)
├── jest.config.js             # Configuración Jest
└── package.json               # Scripts y deps
```

## 7. Scripts NPM Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm test` | Ejecuta todos los tests |
| `npm run test:coverage` | Tests + reporte de cobertura |
| `npm run test:watch` | Modo watch (auto-reload) |

## 8. Interpretar Resultados

### Tests Pasando

```
✓ should create a new Container instance (5 ms)
✓ should register a service (3 ms)
✓ should resolve dependencies (8 ms)
```

### Tests Fallando

```
✕ should validate API key (15 ms)

  Expected: true
  Received: false

  > 42 |   expect(result.valid).toBe(true);
       |                        ^
```

### Cobertura

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.21 |    78.44 |   87.32 |   85.67 |
 Container.js       |   95.23 |    88.88 |   96.15 |   95.45 |
--------------------|---------|----------|---------|---------|
```

- **Stmts (Statements):** % de líneas ejecutadas
- **Branch:** % de ramas condicionales (if/else) cubiertas
- **Funcs (Functions):** % de funciones llamadas
- **Lines:** % de líneas de código ejecutadas

**Meta:** Todas las métricas > 80% (excepto Branch > 70%)

## 9. Flujo de Trabajo Recomendado

### Al empezar a trabajar

```bash
# 1. Actualizar dependencias
npm install

# 2. Verificar que tests pasan
npm test

# 3. Activar modo watch
npm run test:watch
```

### Antes de hacer commit

```bash
# 1. Ejecutar todos los tests
npm test

# 2. Verificar cobertura
npm run test:coverage

# 3. Si todo pasa, hacer commit
git add .
git commit -m "feat: nueva funcionalidad"
```

### Al recibir error en tests

```bash
# 1. Ver test específico que falla
npx jest --verbose

# 2. Ejecutar solo ese test
npx jest __tests__/path/to/failing.test.js

# 3. Ver detalles del error
npx jest --verbose --no-coverage
```

## 10. Recursos Adicionales

### Documentación

- **Guía completa:** `docs/TESTING.md`
- **README de tests:** `__tests__/README.md`
- **Resumen ejecutivo:** `TEST-SUMMARY.md`

### Enlaces Externos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Cheat Sheet](https://github.com/sapegin/jest-cheat-sheet)
- [Testing Best Practices](https://testingjavascript.com/)

### Videos Tutoriales

- [Jest Crash Course](https://www.youtube.com/results?search_query=jest+testing+tutorial)
- [Testing JavaScript](https://testingjavascript.com/)

## 11. Cheat Sheet

### Comandos Más Usados

```bash
npm test                    # Todo
npm run test:coverage       # + cobertura
npm run test:watch          # + watch
npx jest <archivo>          # Archivo específico
npx jest --verbose          # + información
npx jest --onlyFailures     # Solo los que fallaron
npx jest --listTests        # Listar tests
```

### Matchers Comunes de Jest

```javascript
expect(value).toBe(expected)           // Igualdad estricta
expect(value).toEqual(expected)        // Deep equality
expect(value).toBeTruthy()             // Truthy
expect(value).toBeFalsy()              // Falsy
expect(value).toBeNull()               // null
expect(value).toBeUndefined()          // undefined
expect(value).toBeDefined()            // Defined
expect(array).toContain(item)          // Array contiene
expect(string).toMatch(/pattern/)      // Regex match
expect(fn).toThrow(Error)              // Lanza error
expect(fn).toHaveBeenCalled()          // Mock llamado
expect(fn).toHaveBeenCalledWith(args)  // Mock con args
```

### Estructura de Test

```javascript
describe('Module', () => {
    let instance;

    beforeEach(() => {
        // Setup antes de cada test
        instance = new Module();
    });

    afterEach(() => {
        // Cleanup después de cada test
    });

    it('should do something', () => {
        // Arrange
        const input = 'test';

        // Act
        const result = instance.method(input);

        // Assert
        expect(result).toBe('expected');
    });
});
```

## 12. Contacto

Para preguntas o problemas:
1. Revisar `docs/TESTING.md`
2. Buscar en issues de Jest: https://github.com/facebook/jest/issues
3. Stack Overflow: [jest] tag

---

**Última actualización:** 2024-12-25
**Versión:** 1.0.0

**TL;DR:**
```bash
npm install
npm test
```

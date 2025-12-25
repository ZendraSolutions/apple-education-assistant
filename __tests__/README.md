# Tests - Jamf Assistant

Suite completa de tests unitarios para módulos críticos del proyecto.

## Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar todos los tests
npm test

# 3. Ver cobertura
npm run test:coverage

# 4. Modo desarrollo (auto-reload)
npm run test:watch
```

## Estructura

```
__tests__/
├── core/
│   └── Container.test.js          # IoC/DI Container (90+ tests)
├── patterns/
│   ├── ValidatorChain.test.js     # Chain of Responsibility (40+ tests)
│   └── SectionRegistry.test.js    # Registry Pattern (35+ tests)
├── chatbot/
│   ├── EncryptionService.test.js  # AES-256-GCM Encryption (40+ tests)
│   └── RateLimiter.test.js        # Rate Limiting (35+ tests)
└── utils/
    └── EventBus.test.js           # Pub/Sub Pattern (45+ tests)
```

## Módulos Testeados

### Core
- **Container** - Dependency Injection, resolución de dependencias, ciclos circulares

### Patterns
- **ValidatorChain** - Validadores encadenados (NotEmpty, Length, Prefix, Regex, Strength)
- **SectionRegistry** - Registro de vistas/secciones con metadata

### Chatbot
- **EncryptionService** - Cifrado AES-256-GCM, manejo de API keys
- **RateLimiter** - Control de rate limiting cross-tab

### Utils
- **EventBus** - Sistema de eventos pub/sub para comunicación desacoplada

## Cobertura Actual

Target: 80% statements, 70% branches, 80% functions, 80% lines

Para ver reporte detallado:
```bash
npm run test:coverage
```

El reporte HTML se genera en `coverage/lcov-report/index.html`

## Ejecutar Tests Específicos

```bash
# Un módulo específico
npx jest __tests__/core/Container.test.js

# Por patrón de nombre
npx jest --testNamePattern="Container"

# Solo tests que fallaron la última vez
npx jest --onlyFailures

# Con información detallada
npx jest --verbose
```

## Debugging

```bash
# Ver qué tests se ejecutarán sin ejecutarlos
npx jest --listTests

# Ejecutar con debugger (Node.js inspector)
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Documentación Completa

Ver `docs/TESTING.md` para:
- Guía completa de testing
- Cómo escribir nuevos tests
- Mocking con Container
- Mejores prácticas
- Troubleshooting

## Contribuir

Antes de hacer commit:
1. Ejecutar `npm test` - todos los tests deben pasar
2. Ejecutar `npm run test:coverage` - mantener cobertura > 80%
3. Añadir tests para nuevas features
4. Seguir estructura AAA (Arrange-Act-Assert)

---

**Total de Tests:** 150+
**Tiempo de Ejecución:** ~5 segundos
**Framework:** Jest 29.7.0

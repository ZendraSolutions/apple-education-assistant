# Sistema de Notificaciones Toast y Estado de Conexión

## Descripción General

Este documento describe el sistema de notificaciones toast y el monitor de estado de conexión implementado en Apple Edu Assistant.

## Componentes

### 1. ToastManager (`js/ui/ToastManager.js`)

Sistema de notificaciones no intrusivas para feedback del usuario.

#### Características

- **Tipos de toast**: `info`, `success`, `warning`, `error`
- **Auto-dismiss configurable**: Duración personalizable o persistente
- **Stack de notificaciones**: Múltiples toasts apilados verticalmente
- **Animaciones suaves**: Transiciones CSS con cubic-bezier
- **Accesible**: Soporte ARIA, reducción de movimiento, alto contraste
- **Responsive**: Optimizado para móvil y escritorio

#### API de Uso

```javascript
// Obtener instancia desde el contenedor IoC
const toastManager = container.resolve('toastManager');

// Mostrar toast básico
toastManager.show('Mensaje', 'info', 5000);

// Métodos de conveniencia
toastManager.success('Operación exitosa');
toastManager.error('Error al guardar', 8000);
toastManager.warning('Advertencia importante');
toastManager.info('Información útil');

// Toast persistente (requiere cierre manual)
const id = toastManager.show('Procesando...', 'info', 0);
// Cerrar manualmente más tarde
toastManager.dismiss(id);

// Cerrar todos los toasts
toastManager.dismissAll();
```

#### Ejemplos de Integración

```javascript
// En un módulo con acceso al container
class MiModulo {
    constructor(container) {
        this.toastManager = container.resolve('toastManager');
    }

    async guardarDatos() {
        try {
            await api.save(data);
            this.toastManager.success('Datos guardados correctamente');
        } catch (error) {
            this.toastManager.error('Error al guardar los datos', 8000);
        }
    }
}
```

### 2. ConnectionStatus (`js/ui/ConnectionStatus.js`)

Monitor de estado de conexión a internet con feedback visual.

#### Características

- **Detección online/offline**: Eventos nativos del navegador
- **Verificación periódica**: Fallback cada 30s para mayor confiabilidad
- **Debouncing**: Evita notificaciones múltiples en conexiones inestables
- **Feedback visual**:
  - Badge en chatbot FAB
  - Clase CSS en `<body>` para estilos globales
  - Indicador en top-bar
- **Integración con ToastManager**: Notificaciones automáticas

#### Estados

**Online**:
- Badge en FAB: oculto
- Body class: sin `offline-mode`
- Toast: "Conexión restablecida" (success)

**Offline**:
- Badge en FAB: icono wifi-off naranja
- Body class: `offline-mode`
- Toast: "Sin conexión. Algunas funciones no estarán disponibles." (warning)
- Top-bar: línea naranja pulsante

#### API de Uso

```javascript
// Obtener instancia desde el contenedor IoC
const connectionStatus = container.resolve('connectionStatus');

// Verificar estado actual
if (connectionStatus.isOnline) {
    // Realizar petición a API
} else {
    // Usar datos en caché
}

// Verificación manual (devuelve Promise)
const online = await connectionStatus.check();

// Escuchar eventos de conexión
eventBus.on('connection:online', () => {
    console.log('Conexión restablecida');
    sincronizarDatos();
});

eventBus.on('connection:offline', () => {
    console.log('Sin conexión');
    mostrarModoOffline();
});
```

#### Ejemplo de Manejo en Chatbot

```javascript
class ChatbotCore {
    constructor(eventBus, connectionStatus) {
        this.eventBus = eventBus;
        this.connectionStatus = connectionStatus;

        // Deshabilitar envío si está offline
        this.eventBus.on('connection:offline', () => {
            this.disableInput();
        });

        this.eventBus.on('connection:online', () => {
            this.enableInput();
        });
    }

    async sendMessage(message) {
        if (!this.connectionStatus.isOnline) {
            this.toastManager.warning('Chatbot no disponible sin conexión');
            return;
        }

        // Enviar mensaje...
    }
}
```

## Estilos CSS

### Archivo: `css/toasts.css`

Incluye:
- Estilos de container y toasts
- Animaciones de entrada/salida
- Tipos de toast con colores
- Modo offline (badge, indicadores)
- Soporte dark mode
- Accesibilidad (prefers-reduced-motion, prefers-contrast)

### Clases CSS Disponibles

```css
/* Clase aplicada al body cuando está offline */
.offline-mode { }

/* Contenedor de toasts (automático) */
.toast-container { }

/* Toast individual (automático) */
.toast { }
.toast-info { }
.toast-success { }
.toast-warning { }
.toast-error { }

/* Badge de offline en chatbot FAB */
.offline-mode .chatbot-fab .fab-badge.offline-badge { }

/* Indicador en top-bar */
.offline-mode .top-bar::before { }
```

## Integración en Bootstrap

Los servicios se registran automáticamente en el contenedor IoC:

```javascript
// js/core/bootstrap.js

// Registro en container
container.register('toastManager', ToastManager, {
    lifecycle: 'singleton'
});

container.register('connectionStatus', ConnectionStatus, {
    lifecycle: 'singleton',
    dependencies: ['eventBus', 'toastManager']
});
```

## Inicialización

Los servicios se inicializan automáticamente en `js/app.js`:

```javascript
// app.js - initializeFromContainer()

// Toast Manager y Connection Status
this.#container.resolve('toastManager');
this.#container.resolve('connectionStatus');
```

No requieren llamada a `.init()` - se auto-inicializan en el constructor.

## Eventos del Sistema

Nuevos eventos agregados a `AppEvents`:

```javascript
export const AppEvents = {
    // ... otros eventos

    // Connection events
    CONNECTION_ONLINE: 'connection:online',
    CONNECTION_OFFLINE: 'connection:offline'
};
```

## Testing

### Test Manual

1. **ToastManager**:
   ```javascript
   // En consola del navegador
   const toast = app.container.resolve('toastManager');
   toast.success('Test exitoso');
   toast.error('Test de error');
   toast.warning('Test de advertencia', 0); // Persistente
   ```

2. **ConnectionStatus**:
   - Abrir DevTools > Network
   - Cambiar a "Offline"
   - Observar toast de advertencia y badge en FAB
   - Cambiar a "Online"
   - Observar toast de éxito y badge desaparece

### Test Unitario

```javascript
// test/ui/ToastManager.test.js
import { ToastManager } from '../../js/ui/ToastManager.js';

describe('ToastManager', () => {
    let toastManager;

    beforeEach(() => {
        toastManager = new ToastManager();
    });

    afterEach(() => {
        toastManager.destroy();
    });

    test('should show toast notification', () => {
        const id = toastManager.show('Test', 'info');
        expect(id).toBeTruthy();
        expect(toastManager.count).toBe(1);
    });

    test('should auto-dismiss after duration', (done) => {
        toastManager.show('Test', 'info', 100);
        expect(toastManager.count).toBe(1);

        setTimeout(() => {
            expect(toastManager.count).toBe(0);
            done();
        }, 150);
    });
});
```

## Mejores Prácticas

### 1. Duración de Toasts

- **Info**: 5000ms (predeterminado)
- **Success**: 5000ms
- **Warning**: 6000ms
- **Error**: 8000ms (requiere más tiempo de lectura)
- **Persistente**: 0ms (para operaciones largas)

### 2. Mensajes Claros

```javascript
// ❌ Malo
toastManager.error('Error');

// ✅ Bueno
toastManager.error('No se pudo guardar. Por favor, inténtalo de nuevo.');
```

### 3. No Abusar de los Toasts

```javascript
// ❌ Malo - Toast para cada tecla
input.addEventListener('keypress', () => {
    toastManager.info('Tecla presionada');
});

// ✅ Bueno - Toast para operaciones significativas
button.addEventListener('click', async () => {
    const id = toastManager.info('Guardando...', 0);
    await save();
    toastManager.dismiss(id);
    toastManager.success('Guardado correctamente');
});
```

### 4. Manejo de Conexión

```javascript
// Verificar antes de operaciones críticas
async function fetchData() {
    if (!connectionStatus.isOnline) {
        toastManager.warning('Mostrando datos en caché. Sin conexión.');
        return getCachedData();
    }

    try {
        return await api.fetch();
    } catch (error) {
        // Verificar si fue error de red
        const online = await connectionStatus.check();
        if (!online) {
            toastManager.warning('Error de conexión. Usando caché.');
            return getCachedData();
        }
        toastManager.error('Error al cargar datos');
    }
}
```

## Personalización

### Cambiar Duración Global

```javascript
// Crear wrapper con duraciones personalizadas
class CustomToastManager extends ToastManager {
    success(message, duration = 3000) { // Más rápido
        return super.success(message, duration);
    }
}
```

### Agregar Iconos Personalizados

```javascript
// En ToastManager.js
#icons = {
    info: 'ri-information-line',
    success: 'ri-checkbox-circle-line',
    warning: 'ri-alert-line',
    error: 'ri-error-warning-line',
    custom: 'ri-star-line' // Nuevo tipo
};
```

## Troubleshooting

### Toast no aparece

1. Verificar que `toasts.css` esté cargado
2. Verificar que el container de toasts exista en DOM
3. Comprobar z-index de otros elementos

### ConnectionStatus no detecta cambios

1. Algunos navegadores no disparan eventos `online/offline` de forma confiable
2. El sistema incluye verificación periódica cada 30s como fallback
3. Usar `connectionStatus.check()` para verificación manual

### Badge de offline no aparece

1. Verificar que el elemento `#fabBadge` exista en HTML
2. Comprobar que los estilos de `toasts.css` estén cargados
3. Verificar que la clase `offline-mode` se aplique al `<body>`

## Roadmap

Posibles mejoras futuras:

- [ ] Agrupar toasts similares (e.g., "3 mensajes nuevos")
- [ ] Persistencia de toasts entre recargas (para operaciones largas)
- [ ] Toasts con acciones (botones "Deshacer", "Ver más")
- [ ] Sonidos opcionales para toasts críticos
- [ ] Queue con prioridades (toasts urgentes primero)
- [ ] Análisis de velocidad de conexión (no solo online/offline)

## Referencias

- [MDN: Navigator.onLine](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [Material Design Snackbars](https://material.io/components/snackbars)

---

**Última actualización**: 2025-12-24
**Versión**: 1.0.0
**Autor**: Apple Edu Assistant Team

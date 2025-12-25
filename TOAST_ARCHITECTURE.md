# Arquitectura del Sistema Toast & Connection Status

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                        IoC Container                            │
│                     (js/core/bootstrap.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐     ┌────────────────┐│
│  │  EventBus    │─────▶│ ToastManager │◀────│ Connection     ││
│  │  (singleton) │      │  (singleton) │     │ Status         ││
│  └──────────────┘      └──────────────┘     │ (singleton)    ││
│         │                      ▲             └────────────────┘│
│         │                      │                     │         │
│         └──────────────────────┴─────────────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ resolves services
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      JamfAssistant App                          │
│                        (js/app.js)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  #initializeFromContainer() {                                   │
│      this.#container.resolve('toastManager');                   │
│      this.#container.resolve('connectionStatus');               │
│  }                                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Inicialización

```
main.js
  │
  ├─▶ createContainer() (bootstrap.js)
  │    │
  │    ├─▶ register('eventBus', EventBus)
  │    ├─▶ register('toastManager', ToastManager)
  │    └─▶ register('connectionStatus', ConnectionStatus, {
  │          dependencies: ['eventBus', 'toastManager']
  │        })
  │
  └─▶ new JamfAssistant(container)
       │
       └─▶ #initializeFromContainer()
            │
            ├─▶ resolve('toastManager') → instancia singleton
            └─▶ resolve('connectionStatus') → instancia singleton
                 │
                 └─▶ Constructor inicia monitoreo automático
```

### 2. Detección de Cambio de Conexión (Offline)

```
Browser Event: 'offline'
  │
  ▼
ConnectionStatus.#handleOffline()
  │
  ├─▶ Debounce (500ms)
  │
  ├─▶ this.#isOnline = false
  │
  ├─▶ this.#updateUI(false)
  │    │
  │    ├─▶ document.body.classList.add('offline-mode')
  │    └─▶ #fabBadge.innerHTML = '<i class="ri-wifi-off-line"></i>'
  │
  ├─▶ this.#showToast('Sin conexión...', 'warning')
  │    │
  │    └─▶ ToastManager.show(message, 'warning', 5000)
  │         │
  │         └─▶ Crea toast DOM → anima → auto-dismiss
  │
  └─▶ this.#eventBus.emit('connection:offline')
```

### 3. Detección de Recuperación de Conexión (Online)

```
Browser Event: 'online'
  │
  ▼
ConnectionStatus.#handleOnline()
  │
  ├─▶ Debounce (500ms)
  │
  ├─▶ this.#isOnline = true
  │
  ├─▶ this.#updateUI(true)
  │    │
  │    ├─▶ document.body.classList.remove('offline-mode')
  │    └─▶ #fabBadge.innerHTML = ''
  │
  ├─▶ this.#showToast('Conexión restablecida', 'success')
  │    │
  │    └─▶ ToastManager.show(message, 'success', 5000)
  │
  └─▶ this.#eventBus.emit('connection:online')
```

### 4. Mostrar Toast Manual

```
Módulo externo (ej: ApiService)
  │
  ├─▶ const toast = container.resolve('toastManager');
  │
  └─▶ toast.success('Datos guardados')
       │
       ▼
ToastManager.show('Datos guardados', 'success', 5000)
  │
  ├─▶ Genera ID único (toast-1, toast-2, etc.)
  │
  ├─▶ #createToast(id, message, type, dismissible)
  │    │
  │    ├─▶ Crea elemento <div class="toast toast-success">
  │    ├─▶ Agrega icono <i class="ri-checkbox-circle-line">
  │    ├─▶ Agrega mensaje <span class="toast-message">
  │    └─▶ Agrega botón X <button class="toast-dismiss">
  │
  ├─▶ Agrega al container → #container.appendChild(toast)
  │
  ├─▶ Animación entrada → toast.classList.add('toast-enter')
  │
  └─▶ setTimeout → dismiss(id) después de 5000ms
       │
       └─▶ Animación salida → toast.classList.add('toast-exit')
            │
            └─▶ Elimina del DOM después de 300ms
```

## Estructura de Clases

### ToastManager

```javascript
class ToastManager {
    // Estado
    #container: HTMLElement        // Container DOM para todos los toasts
    #activeToasts: Map            // ID → HTMLElement
    #toastId: number              // Auto-incremento para IDs únicos
    #icons: Object                // Tipo → clase de icono

    // API Pública
    + show(message, type, duration, dismissible): string
    + dismiss(id): boolean
    + dismissAll(): void
    + success(message, duration): string
    + error(message, duration): string
    + warning(message, duration): string
    + info(message, duration): string
    + get count(): number
    + destroy(): void

    // Métodos Privados
    - #init(): void
    - #createToast(id, message, type, dismissible): HTMLElement
}
```

### ConnectionStatus

```javascript
class ConnectionStatus {
    // Estado
    #eventBus: EventBus           // Para emitir eventos
    #toastManager: ToastManager   // Para mostrar notificaciones
    #isOnline: boolean            // Estado actual
    #fabBadge: HTMLElement        // Badge en chatbot FAB
    #debounceTimer: number        // Timer para debounce
    #lastToastId: string          // Último toast mostrado

    // API Pública
    + get isOnline(): boolean
    + check(): Promise<boolean>
    + destroy(): void

    // Métodos Privados
    - #init(): void
    - #handleOnline(): void
    - #handleOffline(): void
    - #updateUI(isOnline): void
    - #showToast(message, type): void
    - #startPeriodicCheck(): void
}
```

## Eventos del Sistema

```
EventBus
  │
  ├─▶ connection:online
  │    │
  │    └─▶ Emitido por: ConnectionStatus
  │         Escuchado por: Chatbot, SyncManager, etc.
  │         Payload: none
  │
  └─▶ connection:offline
       │
       └─▶ Emitido por: ConnectionStatus
            Escuchado por: Chatbot, SyncManager, etc.
            Payload: none
```

## Ciclo de Vida de un Toast

```
1. CREACIÓN
   ┌─────────────────┐
   │ show() llamado  │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ #createToast()  │
   │ - Crea <div>    │
   │ - Agrega icono  │
   │ - Agrega texto  │
   │ - Agrega botón  │
   └────────┬────────┘
            │
            ▼
2. INSERCIÓN
   ┌─────────────────┐
   │ appendChild()   │
   │ al container    │
   └────────┬────────┘
            │
            ▼
3. ANIMACIÓN ENTRADA
   ┌─────────────────┐
   │ classList.add   │
   │ ('toast-enter') │
   │                 │
   │ transform:      │
   │ translateX(0)   │
   │ opacity: 1      │
   └────────┬────────┘
            │
            ▼
4. VISIBLE
   ┌─────────────────┐
   │ Usuario ve      │
   │ el toast        │
   │ (5000ms)        │
   └────────┬────────┘
            │
            ▼
5. ANIMACIÓN SALIDA
   ┌─────────────────┐
   │ classList.add   │
   │ ('toast-exit')  │
   │                 │
   │ transform:      │
   │ translateX(400) │
   │ opacity: 0      │
   └────────┬────────┘
            │
            ▼
6. ELIMINACIÓN
   ┌─────────────────┐
   │ removeChild()   │
   │ del container   │
   │                 │
   │ Delete del Map  │
   └─────────────────┘
```

## Integración con Otros Módulos

### Ejemplo: Chatbot

```javascript
class ChatbotCore {
    constructor(container) {
        this.eventBus = container.resolve('eventBus');
        this.toastManager = container.resolve('toastManager');
        this.connectionStatus = container.resolve('connectionStatus');

        this.setupListeners();
    }

    setupListeners() {
        // Reaccionar a cambios de conexión
        this.eventBus.on('connection:offline', () => {
            this.disableInput();
        });

        this.eventBus.on('connection:online', () => {
            this.enableInput();
        });
    }

    async sendMessage(message) {
        // Verificar conexión antes de enviar
        if (!this.connectionStatus.isOnline) {
            this.toastManager.warning('Chatbot requiere conexión');
            return;
        }

        // Enviar mensaje...
        const thinkingToast = this.toastManager.info('Pensando...', 0);

        try {
            const response = await this.api.send(message);
            this.toastManager.dismiss(thinkingToast);
            this.displayResponse(response);
        } catch (error) {
            this.toastManager.dismiss(thinkingToast);
            this.toastManager.error('Error al enviar mensaje');
        }
    }
}
```

## Responsabilidades

### ToastManager
- ✅ Crear y gestionar elementos toast DOM
- ✅ Controlar animaciones de entrada/salida
- ✅ Auto-dismiss con timers
- ✅ Gestionar stack de toasts
- ✅ Proveer API conveniente (success, error, etc.)
- ❌ NO conoce nada sobre conexión
- ❌ NO emite eventos de negocio

### ConnectionStatus
- ✅ Monitorear estado de conexión
- ✅ Detectar cambios online/offline
- ✅ Emitir eventos de conexión
- ✅ Actualizar UI (badge, body class)
- ✅ Mostrar toasts informativos
- ❌ NO gestiona toasts directamente (delega a ToastManager)
- ❌ NO conoce detalles de otros módulos

### EventBus
- ✅ Facilitar comunicación entre módulos
- ✅ Desacoplar emisores de receptores
- ✅ Proveer API simple (on, emit, off)
- ❌ NO tiene lógica de negocio
- ❌ NO conoce detalles de eventos

## Patrones de Diseño Utilizados

### 1. Dependency Injection (IoC)
- **Dónde**: Container registra e inyecta servicios
- **Por qué**: Desacoplamiento, testabilidad, reutilización

### 2. Singleton Pattern
- **Dónde**: ToastManager, ConnectionStatus, EventBus
- **Por qué**: Una sola instancia compartida, estado global consistente

### 3. Observer Pattern (Pub/Sub)
- **Dónde**: EventBus para comunicación entre módulos
- **Por qué**: Desacoplamiento, extensibilidad

### 4. Factory Method
- **Dónde**: ToastManager.#createToast()
- **Por qué**: Encapsular creación compleja de toasts

### 5. Strategy Pattern (implícito)
- **Dónde**: Diferentes tipos de toast (info, success, warning, error)
- **Por qué**: Diferentes comportamientos visuales según tipo

## Flujo de Testing

```
Test Manual (DevTools Console)
  │
  ├─▶ Test ToastManager
  │    │
  │    ├─▶ const toast = app.container.resolve('toastManager');
  │    ├─▶ toast.success('Test');
  │    ├─▶ toast.error('Test');
  │    └─▶ toast.dismissAll();
  │
  └─▶ Test ConnectionStatus
       │
       ├─▶ const conn = app.container.resolve('connectionStatus');
       ├─▶ console.log(conn.isOnline);
       ├─▶ DevTools > Network > Offline
       │    │
       │    └─▶ Verifica toast warning + badge + body class
       │
       └─▶ DevTools > Network > Online
            │
            └─▶ Verifica toast success + no badge + no body class
```

## Extensiones Futuras

### 1. Toast con Acciones
```javascript
toastManager.showWithActions('Archivo eliminado', 'info', {
    actions: [
        { label: 'Deshacer', callback: () => restore() }
    ]
});
```

### 2. Toast de Progreso
```javascript
const id = toastManager.showProgress('Subiendo archivo...', 0);
// Update progress
toastManager.updateProgress(id, 50);
toastManager.updateProgress(id, 100);
```

### 3. Toasts Agrupados
```javascript
// Automáticamente agrupa toasts similares
toastManager.success('Mensaje guardado'); // x3
// → "3 mensajes guardados"
```

### 4. Análisis de Velocidad de Conexión
```javascript
connectionStatus.getSpeed().then(speed => {
    if (speed < 1000) { // < 1Mbps
        toastManager.warning('Conexión lenta detectada');
    }
});
```

---

**Diagrama creado**: 2025-12-24
**Versión**: 1.0.0
**Herramienta**: Texto ASCII

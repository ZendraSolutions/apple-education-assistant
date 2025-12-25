# Ejemplos de Uso - Toast Manager y Connection Status

## Ejemplos Prácticos de Integración

### 1. Uso Básico del ToastManager

```javascript
// Acceder desde cualquier módulo que tenga el container
const toastManager = container.resolve('toastManager');

// Info (azul)
toastManager.info('Información general');

// Success (verde)
toastManager.success('Operación completada');

// Warning (naranja)
toastManager.warning('Ten cuidado con esto');

// Error (rojo)
toastManager.error('Algo salió mal');
```

### 2. Control de Duración

```javascript
// Auto-dismiss después de 3 segundos
toastManager.info('Mensaje rápido', 3000);

// Persistente (no se cierra automáticamente)
const id = toastManager.show('Procesando archivo grande...', 'info', 0);

// Cuando termines, ciérralo manualmente
setTimeout(() => {
    toastManager.dismiss(id);
    toastManager.success('Archivo procesado');
}, 5000);
```

### 3. Manejo de Errores en API

```javascript
class ApiService {
    constructor(container) {
        this.toastManager = container.resolve('toastManager');
        this.connectionStatus = container.resolve('connectionStatus');
    }

    async fetchData(endpoint) {
        // Verificar conexión primero
        if (!this.connectionStatus.isOnline) {
            this.toastManager.warning('Sin conexión. Usando datos en caché.');
            return this.getCachedData(endpoint);
        }

        const loadingToast = this.toastManager.info('Cargando datos...', 0);

        try {
            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Cerrar toast de carga
            this.toastManager.dismiss(loadingToast);
            this.toastManager.success('Datos cargados correctamente');

            return data;

        } catch (error) {
            this.toastManager.dismiss(loadingToast);

            // Verificar si fue error de red
            const online = await this.connectionStatus.check();

            if (!online) {
                this.toastManager.warning('Error de conexión. Mostrando datos guardados.');
                return this.getCachedData(endpoint);
            }

            this.toastManager.error(
                `Error al cargar datos: ${error.message}`,
                8000
            );
            throw error;
        }
    }

    getCachedData(endpoint) {
        // Implementación de caché
        return localStorage.getItem(`cache_${endpoint}`);
    }
}
```

### 4. Formulario con Validación

```javascript
class FormManager {
    constructor(container) {
        this.toastManager = container.resolve('toastManager');
    }

    async submitForm(formData) {
        // Validación
        if (!formData.email) {
            this.toastManager.warning('El email es obligatorio');
            return false;
        }

        if (!this.isValidEmail(formData.email)) {
            this.toastManager.error('El formato del email no es válido');
            return false;
        }

        // Envío
        const savingToast = this.toastManager.info('Guardando formulario...', 0);

        try {
            await this.saveToAPI(formData);

            this.toastManager.dismiss(savingToast);
            this.toastManager.success('Formulario guardado correctamente');

            return true;

        } catch (error) {
            this.toastManager.dismiss(savingToast);
            this.toastManager.error(
                'No se pudo guardar. Por favor, inténtalo de nuevo.',
                8000
            );

            return false;
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async saveToAPI(data) {
        // Implementación de guardado
    }
}
```

### 5. Sistema de Sincronización con Estado de Conexión

```javascript
class SyncManager {
    constructor(container) {
        this.toastManager = container.resolve('toastManager');
        this.connectionStatus = container.resolve('connectionStatus');
        this.eventBus = container.resolve('eventBus');
        this.pendingSync = [];

        this.setupConnectionListeners();
    }

    setupConnectionListeners() {
        // Cuando vuelve la conexión, sincronizar automáticamente
        this.eventBus.on('connection:online', () => {
            if (this.pendingSync.length > 0) {
                this.toastManager.info(
                    `Sincronizando ${this.pendingSync.length} cambios pendientes...`
                );
                this.syncPending();
            }
        });

        // Cuando se pierde la conexión, informar al usuario
        this.eventBus.on('connection:offline', () => {
            if (this.pendingSync.length > 0) {
                this.toastManager.warning(
                    `${this.pendingSync.length} cambios pendientes de sincronizar`,
                    8000
                );
            }
        });
    }

    async save(data) {
        if (!this.connectionStatus.isOnline) {
            // Guardar localmente
            this.pendingSync.push(data);
            localStorage.setItem('pendingSync', JSON.stringify(this.pendingSync));

            this.toastManager.warning(
                'Sin conexión. Los cambios se sincronizarán cuando vuelva la conexión.'
            );
            return;
        }

        // Sincronizar inmediatamente
        try {
            await this.syncToServer(data);
            this.toastManager.success('Cambios guardados en la nube');
        } catch (error) {
            // Si falla, agregar a pendientes
            this.pendingSync.push(data);
            this.toastManager.error('Error al sincronizar. Se reintentará más tarde.');
        }
    }

    async syncPending() {
        const total = this.pendingSync.length;
        let synced = 0;

        for (const item of this.pendingSync) {
            try {
                await this.syncToServer(item);
                synced++;
            } catch (error) {
                console.error('Error syncing:', error);
            }
        }

        // Limpiar sincronizados
        this.pendingSync = this.pendingSync.slice(synced);
        localStorage.setItem('pendingSync', JSON.stringify(this.pendingSync));

        if (synced === total) {
            this.toastManager.success(`${synced} cambios sincronizados correctamente`);
        } else {
            this.toastManager.warning(
                `${synced}/${total} cambios sincronizados. ${total - synced} pendientes.`
            );
        }
    }

    async syncToServer(data) {
        // Implementación de sincronización
        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Sync failed');
        }

        return response.json();
    }
}
```

### 6. Chatbot con Verificación de Conexión

```javascript
class ChatbotManager {
    constructor(container) {
        this.toastManager = container.resolve('toastManager');
        this.connectionStatus = container.resolve('connectionStatus');
        this.eventBus = container.resolve('eventBus');

        this.setupUI();
    }

    setupUI() {
        // Deshabilitar input cuando está offline
        this.eventBus.on('connection:offline', () => {
            this.disableChatInput();
        });

        this.eventBus.on('connection:online', () => {
            this.enableChatInput();
        });
    }

    async sendMessage(message) {
        // Verificar conexión antes de enviar
        if (!this.connectionStatus.isOnline) {
            this.toastManager.warning(
                'El chatbot IA requiere conexión a internet para funcionar.',
                6000
            );
            return;
        }

        const thinkingToast = this.toastManager.info('Pensando...', 0);

        try {
            const response = await this.callGeminiAPI(message);

            this.toastManager.dismiss(thinkingToast);
            this.displayResponse(response);

        } catch (error) {
            this.toastManager.dismiss(thinkingToast);

            // Verificar si fue error de red
            const online = await this.connectionStatus.check();

            if (!online) {
                this.toastManager.error(
                    'Se perdió la conexión durante la consulta.',
                    8000
                );
            } else {
                this.toastManager.error(
                    'Error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
                    8000
                );
            }
        }
    }

    disableChatInput() {
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');

        if (input) {
            input.disabled = true;
            input.placeholder = 'Chatbot no disponible sin conexión';
        }

        if (sendBtn) {
            sendBtn.disabled = true;
        }
    }

    enableChatInput() {
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');

        if (input) {
            input.disabled = false;
            input.placeholder = 'Escribe tu pregunta...';
        }

        if (sendBtn) {
            sendBtn.disabled = false;
        }
    }

    async callGeminiAPI(message) {
        // Implementación de llamada a API
    }

    displayResponse(response) {
        // Implementación de mostrar respuesta
    }
}
```

### 7. Operaciones en Lote con Progreso

```javascript
class BatchProcessor {
    constructor(container) {
        this.toastManager = container.resolve('toastManager');
    }

    async processItems(items) {
        const total = items.length;
        let processed = 0;
        let failed = 0;

        const progressToast = this.toastManager.info(
            `Procesando 0/${total} elementos...`,
            0
        );

        for (const item of items) {
            try {
                await this.processItem(item);
                processed++;
            } catch (error) {
                failed++;
                console.error('Error processing item:', error);
            }

            // Actualizar progreso
            // Nota: Esto requeriría extender ToastManager para actualizar contenido
            // Por ahora, mostramos nuevo toast
            this.toastManager.dismiss(progressToast);

            if (processed + failed < total) {
                progressToast = this.toastManager.info(
                    `Procesando ${processed + failed}/${total} elementos...`,
                    0
                );
            }
        }

        // Toast final
        if (failed === 0) {
            this.toastManager.success(
                `${processed} elementos procesados correctamente`
            );
        } else {
            this.toastManager.warning(
                `${processed} procesados, ${failed} fallidos`,
                8000
            );
        }
    }

    async processItem(item) {
        // Implementación de procesamiento
    }
}
```

### 8. Uso en Consola para Testing

```javascript
// En la consola del navegador

// 1. Test básico
const toast = app.container.resolve('toastManager');
toast.success('Test exitoso');

// 2. Test de todos los tipos
toast.info('Información');
toast.success('Éxito');
toast.warning('Advertencia');
toast.error('Error');

// 3. Test de duración
toast.show('Rápido (2s)', 'info', 2000);
toast.show('Lento (10s)', 'warning', 10000);

// 4. Test de stack
for (let i = 0; i < 5; i++) {
    toast.show(`Toast ${i + 1}`, 'info', 10000);
}

// 5. Test de conexión
const conn = app.container.resolve('connectionStatus');
console.log('Online:', conn.isOnline);

// 6. Test manual de verificación
conn.check().then(online => {
    console.log('Verificación:', online);
});

// 7. Test de offline (cambiar a offline en DevTools)
// Verás el toast de advertencia y el badge en el FAB

// 8. Limpiar todos los toasts
toast.dismissAll();
```

### 9. Integración con Sistema de Búsqueda

```javascript
class SearchManager {
    constructor(container) {
        this.toastManager = container.resolve('toastManager');
        this.connectionStatus = container.resolve('connectionStatus');
    }

    async search(query) {
        if (!query.trim()) {
            this.toastManager.warning('Por favor, escribe algo para buscar');
            return [];
        }

        const searchToast = this.toastManager.info('Buscando...', 0);

        try {
            // Buscar localmente primero
            const localResults = this.searchLocal(query);

            // Si hay conexión, buscar también en línea
            if (this.connectionStatus.isOnline) {
                const onlineResults = await this.searchOnline(query);

                this.toastManager.dismiss(searchToast);

                const total = localResults.length + onlineResults.length;
                this.toastManager.success(
                    `${total} resultados encontrados`
                );

                return [...localResults, ...onlineResults];
            }

            // Solo resultados locales
            this.toastManager.dismiss(searchToast);
            this.toastManager.info(
                `${localResults.length} resultados (solo locales, sin conexión)`
            );

            return localResults;

        } catch (error) {
            this.toastManager.dismiss(searchToast);
            this.toastManager.error('Error en la búsqueda');
            return [];
        }
    }

    searchLocal(query) {
        // Búsqueda local en knowledge base
        return [];
    }

    async searchOnline(query) {
        // Búsqueda en API externa
        return [];
    }
}
```

## Consejos de UX

### 1. No Abusar de los Toasts

```javascript
// ❌ MAL: Toast para cada acción trivial
button.addEventListener('click', () => {
    toastManager.info('Botón clickeado');
});

// ✅ BIEN: Toast para confirmación de acciones importantes
deleteButton.addEventListener('click', async () => {
    await deleteItem();
    toastManager.success('Elemento eliminado');
});
```

### 2. Mensajes Claros y Accionables

```javascript
// ❌ MAL: Mensaje vago
toastManager.error('Error');

// ✅ BIEN: Mensaje específico con guía
toastManager.error(
    'No se pudo guardar el archivo. Verifica tu conexión y vuelve a intentarlo.',
    8000
);
```

### 3. Duración Apropiada

```javascript
// ❌ MAL: Error desaparece muy rápido
toastManager.error('Error crítico', 1000);

// ✅ BIEN: Error con tiempo suficiente para leer
toastManager.error('Error crítico del sistema', 8000);
```

### 4. Toast Persistente para Operaciones Largas

```javascript
// ✅ BIEN: Operación larga con toast persistente
const uploadToast = toastManager.info('Subiendo archivo (0%)...', 0);

uploadFile(file, (progress) => {
    // Actualizar mensaje (requeriría extender ToastManager)
}).then(() => {
    toastManager.dismiss(uploadToast);
    toastManager.success('Archivo subido correctamente');
});
```

---

**Nota**: Todos estos ejemplos asumen que tienes acceso al contenedor IoC de la aplicación. Si estás en un contexto donde no lo tienes, pásalo como dependencia en el constructor de tu clase.

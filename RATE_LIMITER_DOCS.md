# Sistema de Rate Limiting - Documentación Técnica

## Descripción General

Se ha implementado un sistema de **rate limiting del lado del cliente** para proteger la cuota de API de Google Gemini contra abuso y uso excesivo.

## Características Implementadas

### 1. Clase RateLimiter

Ubicación: `js/chatbot.js` (líneas 7-44)

```javascript
class RateLimiter {
    constructor(maxCalls = 10, windowMs = 60000) {
        this.maxCalls = maxCalls;      // Límite de llamadas
        this.windowMs = windowMs;      // Ventana de tiempo en ms
        this.calls = [];               // Timestamps de llamadas
    }

    canMakeCall()       // Verifica si se puede hacer una llamada
    getRemainingCalls() // Retorna llamadas disponibles
    reset()            // Reinicia el contador
}
```

#### Configuración por defecto:
- **Máximo de llamadas:** 10
- **Ventana de tiempo:** 60 segundos (1 minuto)
- **Almacenamiento:** En memoria (se reinicia al recargar la página)

### 2. Integración en JamfChatbot

#### Constructor (línea 55):
```javascript
this.rateLimiter = new RateLimiter(10, 60000);
```

#### Método sendMessage() (líneas 787-851):

**Flujo de verificación:**

1. **Verificación previa**: Solo se aplica rate limiting si hay API Key configurada
2. **Bloqueo de llamada**: Si se alcanza el límite, muestra mensaje y retorna
3. **Cálculo de tiempo de espera**: Informa al usuario exactamente cuánto tiempo debe esperar
4. **Advertencia proactiva**: Cuando quedan 3 o menos llamadas, muestra un warning

### 3. Mensajes al Usuario

#### Cuando se alcanza el límite:
```
⏸️ Límite de consultas alcanzado

Para proteger tu cuota de API, he limitado las llamadas a 10 por minuto.

Por favor, espera [X minutos y Y segundos] antes de hacer otra consulta.

Esto protege tu API Key de Google de consumir toda su cuota gratuita.
```

#### Warning de llamadas restantes:
```
⏱️ Te quedan X consulta(s) en este minuto
```

### 4. Estilos CSS

Ubicación: `css/styles.css` (líneas 1162-1180)

```css
.chat-rate-limit-warning {
    padding: 8px 12px;
    margin: 8px 12px;
    background: linear-gradient(...);
    border-left: 3px solid var(--warning);
    /* Indicador visual ámbar/ocre */
}
```

## Funcionamiento Técnico

### Algoritmo de Sliding Window

1. **Registro de llamadas**: Cada llamada exitosa guarda su timestamp
2. **Limpieza automática**: Al verificar, elimina timestamps fuera de la ventana
3. **Verificación**: Compara llamadas restantes vs límite
4. **Cálculo de espera**: `waitTime = windowMs - (now - oldestCall)`

### Ventajas del enfoque

✅ **Protección del lado del cliente**: No requiere backend
✅ **UX amigable**: Informa al usuario del tiempo exacto de espera
✅ **Granularidad**: Ventana deslizante (no reinicio cada minuto)
✅ **Performance**: O(n) donde n es número de llamadas (típicamente < 20)
✅ **Sin dependencias**: JavaScript puro

### Limitaciones conocidas

⚠️ **Solo protección del lado del cliente**: Un usuario técnico podría bypassearlo
⚠️ **Reinicio al recargar**: No persiste entre sesiones del navegador
⚠️ **No sincroniza pestañas**: Cada pestaña tiene su propio límite

## Configuración Personalizada

Para ajustar los límites, modificar en `js/chatbot.js` línea 55:

```javascript
// Ejemplo: 20 llamadas cada 2 minutos
this.rateLimiter = new RateLimiter(20, 120000);

// Ejemplo: 5 llamadas cada 30 segundos
this.rateLimiter = new RateLimiter(5, 30000);
```

## Testing

### Prueba manual:

1. Abrir la aplicación en el navegador
2. Configurar una API Key válida
3. Hacer 10 consultas rápidas al chatbot
4. La consulta 11 debe ser bloqueada con mensaje de espera
5. Esperar el tiempo indicado y verificar que se desbloquea

### Consola del navegador:

```javascript
// Ver estado actual
chatbot.rateLimiter.getRemainingCalls()  // Retorna: 7 (por ejemplo)

// Resetear manualmente
chatbot.rateLimiter.reset()

// Ver configuración
chatbot.rateLimiter.maxCalls    // 10
chatbot.rateLimiter.windowMs    // 60000
```

## Mejoras Futuras Posibles

1. **Persistencia en localStorage**: Mantener límite entre recargas
2. **Configuración por usuario**: Panel de ajustes avanzados
3. **Rate limiting adaptativo**: Ajustar según uso
4. **Sincronización cross-tab**: BroadcastChannel API
5. **Telemetría**: Registrar patrones de uso para ajustar límites

## Compatibilidad

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Seguridad

El rate limiter trabaja en conjunto con:
- **Cifrado AES-GCM** de la API Key (implementado por el usuario)
- **Validación de formato** de API Key
- **Manejo de errores** de cuota excedida del servidor

## Soporte

Para dudas o problemas:
- Revisar consola del navegador (F12)
- Verificar que `chatbot.rateLimiter` existe
- Comprobar que los estilos `.chat-rate-limit-warning` se aplican

---

**Implementado:** 2025-12-24
**Versión:** 1.0.0
**Autor:** Backend Senior Engineer

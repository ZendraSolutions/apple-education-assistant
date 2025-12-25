# Guía Rápida de Testing - Toast Manager & Connection Status

## Test Rápido en 5 Minutos

### Paso 1: Abrir la Aplicación
1. Abrir `index.html` en un navegador moderno
2. Verificar que no haya errores en consola (F12)
3. La aplicación debe cargar normalmente

### Paso 2: Test de ToastManager (2 minutos)

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Obtener instancia del ToastManager
const toast = app.container.resolve('toastManager');

// Test 1: Toast de éxito (verde)
toast.success('Test exitoso');

// Test 2: Toast de error (rojo)
toast.error('Test de error');

// Test 3: Toast de advertencia (naranja)
toast.warning('Test de advertencia');

// Test 4: Toast de información (azul)
toast.info('Test de información');

// Test 5: Múltiples toasts
toast.success('Toast 1');
toast.warning('Toast 2');
toast.error('Toast 3');

// Test 6: Toast persistente (no se cierra solo)
const id = toast.show('Este toast no se cierra solo', 'info', 0);
// Cerrarlo manualmente después de 5 segundos
setTimeout(() => toast.dismiss(id), 5000);

// Test 7: Limpiar todos
toast.dismissAll();
```

**Resultado esperado**:
- Los toasts deben aparecer en la esquina superior derecha
- Deben tener los colores correctos según el tipo
- Deben desaparecer automáticamente (excepto el persistente)
- Las animaciones deben ser suaves
- El botón X debe cerrar el toast al hacer clic

### Paso 3: Test de ConnectionStatus (2 minutos)

#### 3.1 Verificar Estado Actual

```javascript
// Obtener instancia
const conn = app.container.resolve('connectionStatus');

// Verificar estado
console.log('¿Estoy online?', conn.isOnline); // Debe ser true
```

#### 3.2 Simular Pérdida de Conexión

1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Cambia el dropdown de "Online" a **"Offline"**

**Resultado esperado**:
- Debe aparecer un toast naranja con mensaje "Sin conexión. Algunas funciones no estarán disponibles."
- Debe aparecer un badge naranja con icono wifi-off en el chatbot FAB (esquina inferior derecha)
- Debe aparecer una línea naranja pulsante en la parte superior de la página
- El body debe tener la clase `offline-mode`

#### 3.3 Simular Recuperación de Conexión

1. En DevTools > Network
2. Cambia de "Offline" a **"Online"**

**Resultado esperado**:
- Debe aparecer un toast verde con mensaje "Conexión restablecida"
- El badge naranja en el chatbot FAB debe desaparecer
- La línea naranja pulsante debe desaparecer
- El body ya NO debe tener la clase `offline-mode`

### Paso 4: Test de Integración Chatbot (1 minuto)

#### 4.1 Con Conexión Offline

1. Cambiar a "Offline" en DevTools
2. Hacer clic en el botón de chatbot (esquina inferior derecha)
3. Intentar escribir en el input del chatbot

**Resultado esperado**:
- El input debe estar deshabilitado
- El placeholder debe decir "Chatbot no disponible sin conexión"
- El botón de enviar debe estar deshabilitado

#### 4.2 Con Conexión Online

1. Cambiar a "Online" en DevTools
2. Verificar el chatbot

**Resultado esperado**:
- El input debe estar habilitado
- El placeholder debe decir "Escribe tu pregunta..."
- El botón de enviar debe estar habilitado

## Test Visual Rápido

### Verificar Toasts en Móvil

1. Abre DevTools (F12)
2. Activa modo responsive (Ctrl+Shift+M)
3. Selecciona un dispositivo móvil (iPhone, Samsung, etc.)
4. Ejecuta los tests de toast

**Resultado esperado**:
- Los toasts deben aparecer en la parte inferior (no superior)
- Deben ocupar todo el ancho menos los márgenes
- Deben estar encima del botón FAB del chatbot

### Verificar Dark Mode

1. Haz clic en el botón de cambio de tema (icono luna/sol)
2. Ejecuta los tests de toast

**Resultado esperado**:
- Los toasts deben tener fondo oscuro
- El texto debe ser claro
- Los iconos deben mantener sus colores
- El badge de offline debe verse bien sobre el FAB oscuro

## Checklist Completo

### ToastManager
- [ ] Toast info aparece (azul)
- [ ] Toast success aparece (verde)
- [ ] Toast warning aparece (naranja)
- [ ] Toast error aparece (rojo)
- [ ] Toasts se auto-cierran después de la duración
- [ ] Botón X cierra el toast
- [ ] Toast persistente no se cierra solo
- [ ] Múltiples toasts se apilan correctamente
- [ ] dismissAll() cierra todos los toasts
- [ ] Animaciones son suaves
- [ ] Funciona en móvil (bottom position)
- [ ] Funciona en dark mode
- [ ] No hay errores en consola

### ConnectionStatus
- [ ] Estado inicial es "online"
- [ ] Cambiar a offline muestra toast de advertencia
- [ ] Cambiar a offline muestra badge en FAB
- [ ] Cambiar a offline agrega línea pulsante en top-bar
- [ ] Cambiar a offline agrega clase `offline-mode` al body
- [ ] Cambiar a online muestra toast de éxito
- [ ] Cambiar a online quita badge del FAB
- [ ] Cambiar a online quita línea pulsante
- [ ] Cambiar a online quita clase `offline-mode`
- [ ] connectionStatus.isOnline refleja el estado real
- [ ] No hay errores en consola

### Chatbot Integration
- [ ] Chatbot se deshabilita cuando está offline
- [ ] Input muestra mensaje apropiado cuando offline
- [ ] Chatbot se habilita cuando vuelve online
- [ ] No se puede enviar mensaje cuando offline
- [ ] Badge de offline es visible y claro

### Responsive & Accessibility
- [ ] Toasts responsive en móvil
- [ ] Toasts responsive en tablet
- [ ] Toasts responsive en desktop
- [ ] Dark mode funciona correctamente
- [ ] Botones tienen focus visible
- [ ] Screen readers anuncian toasts (si tienes uno)
- [ ] prefers-reduced-motion respetado (si está activado)

## Comandos Útiles de Consola

```javascript
// Ver todos los servicios registrados
app.container.listRegistered();

// Obtener servicio
const toast = app.container.resolve('toastManager');
const conn = app.container.resolve('connectionStatus');

// Escuchar eventos
app.eventBus.on('connection:online', () => console.log('Online!'));
app.eventBus.on('connection:offline', () => console.log('Offline!'));

// Ver cuántos toasts activos
console.log('Toasts activos:', toast.count);

// Forzar verificación de conexión
conn.check().then(online => console.log('Conexión:', online));
```

## Problemas Comunes y Soluciones

### Toast no aparece

**Solución**:
1. Verificar que `toasts.css` esté cargado (inspeccionar Network tab)
2. Verificar que no haya errores en consola
3. Verificar z-index de otros elementos (toasts usan z-index: 10000)

### ConnectionStatus no detecta cambios

**Solución**:
1. El sistema tiene verificación periódica cada 30s como fallback
2. Probar con `conn.check()` manual
3. Verificar que los eventos del navegador funcionen (algunos navegadores tienen bugs)

### Badge de offline no visible

**Solución**:
1. Verificar que existe elemento `#fabBadge` en HTML
2. Verificar que `toasts.css` esté cargado
3. Inspeccionar elemento para ver si tiene clase `offline-badge`

### Toasts se ven mal en dark mode

**Solución**:
1. Verificar que el atributo `data-theme="dark"` esté en el elemento raíz
2. Verificar que los estilos de dark mode en `toasts.css` estén cargados
3. Limpiar caché del navegador

## Test de Performance

```javascript
// Test de stress: Crear muchos toasts
for (let i = 0; i < 100; i++) {
    setTimeout(() => {
        toast.show(`Toast ${i + 1}`, 'info', 2000);
    }, i * 100);
}

// Verificar:
// - La app no se congela
// - Los toasts aparecen suavemente
// - No hay lag en animaciones
// - Memoria no aumenta dramáticamente
```

## Verificación de Archivos

Asegúrate de que estos archivos existan:

```
js/
  ui/
    ToastManager.js ✓
    ConnectionStatus.js ✓
css/
  toasts.css ✓
```

Y que estos archivos hayan sido modificados:

```
js/
  core/
    bootstrap.js ✓ (imports + registro)
  utils/
    EventBus.js ✓ (nuevos eventos)
  app.js ✓ (inicialización)
index.html ✓ (link a toasts.css)
```

---

**Tiempo estimado de testing**: 5-10 minutos
**Nivel de dificultad**: Fácil
**Herramientas necesarias**: Navegador moderno + DevTools

Si todos los tests pasan: ✅ **Implementación exitosa**

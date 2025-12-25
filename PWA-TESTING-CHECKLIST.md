# PWA Testing Checklist

## 📋 Lista de Verificación para Instalación en iPad

Usa esta checklist para asegurar que la PWA funciona correctamente antes de distribuir a usuarios finales.

---

## ✅ Pre-Requisitos

### Archivos Obligatorios

- [ ] `manifest.json` existe en la raíz del proyecto
- [ ] `sw.js` existe en la raíz del proyecto
- [ ] `index.html` contiene el link al manifest: `<link rel="manifest" href="manifest.json">`
- [ ] `js/main.js` registra el Service Worker

### Iconos (CRÍTICO)

- [ ] `icons/icon-72.png` (72x72px)
- [ ] `icons/icon-96.png` (96x96px)
- [ ] `icons/icon-128.png` (128x128px)
- [ ] `icons/icon-144.png` (144x144px)
- [ ] `icons/icon-152.png` (152x152px)
- [ ] `icons/icon-192.png` (192x192px)
- [ ] `icons/icon-384.png` (384x384px)
- [ ] `icons/icon-512.png` (512x512px)
- [ ] `icons/apple-touch-icon.png` (180x180px) ← **MUY IMPORTANTE para iOS**

**Si faltan iconos:**
```bash
# Generar con la herramienta incluida:
Abre: icons/convert-svg-to-png.html
```

### Configuración HTTPS

- [ ] App servida desde HTTPS (o localhost para testing)
- [ ] Certificado SSL válido (si es producción)
- [ ] URLs accesibles sin errores

**GitHub Pages (recomendado):**
```bash
git push origin main
# Settings > Pages > Deploy from main branch
```

---

## 🖥️ Testing en Desktop (Chrome/Edge)

### 1. DevTools - Application Tab

- [ ] Abrir DevTools (F12)
- [ ] Ir a **Application** tab

#### Manifest
- [ ] Section "Manifest" muestra:
  - ✅ Name: "Jamf Assistant - Apple Edu"
  - ✅ Short name: "Jamf Edu"
  - ✅ Start URL: "./index.html"
  - ✅ Theme color: "#233D70"
  - ✅ Display: "standalone"
  - ✅ Icons: 9 iconos listados

#### Service Workers
- [ ] Section "Service Workers" muestra:
  - ✅ sw.js
  - ✅ Status: "activated and running"
  - ✅ Source: ./sw.js

- [ ] Botones disponibles:
  - [ ] "Update" funciona
  - [ ] "Unregister" disponible (no usar)

#### Cache Storage
- [ ] Section "Cache Storage" muestra:
  - ✅ Cache: `jamf-edu-v1.0.0`
  - ✅ Archivos cacheados (50+ assets)

- [ ] Assets cacheados incluyen:
  - [ ] index.html
  - [ ] manifest.json
  - [ ] Todos los archivos CSS (styles.css, tooltips.css, etc.)
  - [ ] Todos los archivos JS (main.js, app.js, etc.)
  - [ ] Todos los iconos PNG

### 2. Console Logs

- [ ] Abrir Console tab
- [ ] Recargar la página (Ctrl+R)
- [ ] Verificar logs:

```
✓ [PWA] Service Worker registered successfully: ./
✓ [SW] Installing service worker version: v1.0.0
✓ [SW] Caching static assets
✓ [SW] Static assets cached successfully
✓ [SW] Service worker activated successfully
✓ [Main] Application initialized successfully
```

### 3. Network Tab - Offline Mode

- [ ] Abrir Network tab
- [ ] Activar "Offline" checkbox
- [ ] Recargar la página (F5)
- [ ] Verificar que la app carga correctamente
- [ ] En Console, ver logs:

```
✓ [SW] Serving from cache: ./index.html
✓ [SW] Serving from cache: ./css/styles.css
✓ [SW] Serving from cache: ./js/main.js
...
```

### 4. Lighthouse Audit

- [ ] DevTools > Lighthouse tab
- [ ] Categories: seleccionar "Progressive Web App"
- [ ] Click "Analyze page load"

#### Scores esperados:

- [ ] **PWA**: ≥ 90 (verde)
  - ✅ Installable
  - ✅ PWA Optimized
  - ✅ Works Offline

- [ ] **Performance**: ≥ 80
- [ ] **Accessibility**: ≥ 90
- [ ] **Best Practices**: ≥ 90
- [ ] **SEO**: ≥ 80

#### PWA Checks específicos:

- [ ] ✅ Registers a service worker
- [ ] ✅ Web app manifest meets the installability requirements
- [ ] ✅ Configured for a custom splash screen
- [ ] ✅ Sets a theme color
- [ ] ✅ Content sized correctly for viewport
- [ ] ✅ Has a <meta name="viewport"> tag
- [ ] ✅ Provides a valid apple-touch-icon

### 5. Install Prompt (Chrome/Edge)

- [ ] Esperar unos segundos
- [ ] Verificar que aparece icono de instalación en barra de direcciones (⊕)
- [ ] Click en el icono
- [ ] Diálogo de instalación aparece:
  - [ ] Nombre: "Jamf Assistant - Apple Edu"
  - [ ] Icono correcto mostrado

- [ ] Click "Install"
- [ ] App se abre en ventana standalone
- [ ] Icono aparece en el escritorio/aplicaciones

---

## 📱 Testing en iPad/iPhone (Safari)

### 1. Acceso Inicial

- [ ] Abrir **Safari** (no Chrome ni otros navegadores)
- [ ] Navegar a la URL de la app
- [ ] Página carga correctamente
- [ ] No hay errores visuales

### 2. Verificar Logs (Opcional - requiere Mac)

Si tienes un Mac disponible:

- [ ] Conectar iPad/iPhone por cable
- [ ] Mac: Safari > Develop > [Tu dispositivo] > [Tu página]
- [ ] Ver Console logs:

```
✓ [PWA] Service Worker registered successfully
✓ [SW] Installing service worker version: v1.0.0
✓ [SW] Static assets cached successfully
```

### 3. Instalación

- [ ] Tocar botón **Compartir** (cuadrado con flecha ↑)
- [ ] Scroll hacia abajo
- [ ] Verificar que aparece **"Añadir a pantalla de inicio"**

**⚠️ Si NO aparece:**
- Verifica que usas Safari (no Chrome)
- Verifica HTTPS (o localhost)
- Verifica que `apple-touch-icon.png` existe

- [ ] Tocar "Añadir a pantalla de inicio"
- [ ] Pantalla de confirmación aparece:
  - [ ] Icono correcto mostrado
  - [ ] Nombre: "Jamf Edu" (editable)

- [ ] Tocar "Añadir"
- [ ] Icono aparece en pantalla de inicio

### 4. Abrir App Instalada

- [ ] Buscar icono "Jamf Edu" en pantalla de inicio
- [ ] Tocar el icono
- [ ] App se abre en **modo standalone**:
  - [ ] SIN barra de Safari en la parte inferior
  - [ ] SIN botones de navegación
  - [ ] Barra de estado (hora, batería) visible
  - [ ] Color de barra de estado: tema de la app

- [ ] Splash screen aparece brevemente al abrir
- [ ] App carga correctamente

### 5. Funcionalidad Básica

- [ ] Navegación funciona:
  - [ ] Sidebar se abre/cierra
  - [ ] Secciones cambian correctamente
  - [ ] Búsqueda funciona

- [ ] Chatbot funciona (si API key configurada)
- [ ] Temas (claro/oscuro) cambian correctamente
- [ ] Tooltips aparecen

### 6. Modo Offline

- [ ] Con la app abierta, activar **Modo Avión**
- [ ] Deslizar hacia abajo para recargar (pull to refresh)
- [ ] Verificar que la app carga:
  - [ ] Interfaz completa visible
  - [ ] Estilos aplicados correctamente
  - [ ] Navegación funciona
  - [ ] Assets (iconos, CSS) cargados

- [ ] Intentar acceder a secciones:
  - [ ] Dashboard: ✓ Funciona
  - [ ] Ecosistema: ✓ Funciona
  - [ ] iPads: ✓ Funciona
  - [ ] Todas las secciones cargadas

**⚠️ Si NO funciona offline:**
- Verifica que el Service Worker está activo
- Verifica que los assets están cacheados
- Recarga con conexión primero

- [ ] Desactivar Modo Avión
- [ ] App sigue funcionando

### 7. Actualizaciones

**Preparación:**
```bash
# 1. Cambiar versión en sw.js:
const CACHE_VERSION = 'v1.0.1';

# 2. Deploy cambios
git commit -am "test: Update SW version"
git push origin main
```

**Testing:**
- [ ] Abrir app instalada
- [ ] Esperar ~30 segundos
- [ ] Verificar notificación:
  - [ ] Toast aparece: "Nueva versión disponible..."

- [ ] Deslizar para recargar
- [ ] App se recarga automáticamente
- [ ] Nueva versión activa

### 8. Multitarea

- [ ] Abrir la app
- [ ] Presionar botón Home
- [ ] Abrir otra app
- [ ] Volver a "Jamf Edu"
- [ ] Verificar que:
  - [ ] Estado se mantiene
  - [ ] No hay reloads innecesarios
  - [ ] Navegación mantiene posición

---

## 🔧 Testing de Compatibilidad

### Diferentes Modelos iPad

- [ ] iPad Pro 12.9" (si disponible)
- [ ] iPad Pro 11" (si disponible)
- [ ] iPad Air (si disponible)
- [ ] iPad normal (si disponible)
- [ ] iPad mini (si disponible)

**Verificar en cada modelo:**
- [ ] Instalación funciona
- [ ] Layout responsive correcto
- [ ] Performance aceptable

### Diferentes Versiones iOS

- [ ] iOS/iPadOS 14.x
- [ ] iOS/iPadOS 15.x
- [ ] iOS/iPadOS 16.x
- [ ] iOS/iPadOS 17.x (más reciente)

### Orientación

- [ ] Portrait (vertical)
  - [ ] Layout correcto
  - [ ] Sidebar funciona

- [ ] Landscape (horizontal)
  - [ ] Layout correcto
  - [ ] Sidebar visible/colapsable

---

## 🎯 Testing de Edge Cases

### Caso 1: Sin conexión al instalar

- [ ] Modo avión ON
- [ ] Intentar instalar
- [ ] Verificar comportamiento

### Caso 2: Conexión lenta

- [ ] DevTools > Network > Slow 3G
- [ ] Instalar app
- [ ] Verificar que carga progresivamente

### Caso 3: Eliminar y reinstalar

- [ ] Mantener presionado icono
- [ ] "Eliminar App"
- [ ] Reinstalar desde Safari
- [ ] Verificar que funciona

### Caso 4: Storage lleno

- [ ] Verificar comportamiento si storage está casi lleno
- [ ] Service Worker debería manejar errores de quota

### Caso 5: Múltiples pestañas

- [ ] Abrir app en Safari
- [ ] Abrir nueva pestaña con la misma URL
- [ ] Abrir app instalada
- [ ] Verificar que todas funcionan

---

## 📊 Métricas de Éxito

### Instalación

- [ ] **Tasa de instalación**: > 80% de usuarios pueden instalar
- [ ] **Tiempo para instalar**: < 3 clicks
- [ ] **Tiempo de carga inicial**: < 3 segundos

### Offline

- [ ] **Funcionalidad offline**: 100% de la UI accesible
- [ ] **Tiempo de carga offline**: < 1 segundo
- [ ] **Assets cacheados**: 50+ archivos

### Performance

- [ ] **Lighthouse PWA score**: ≥ 90
- [ ] **First Contentful Paint**: < 2s
- [ ] **Time to Interactive**: < 4s

### Compatibilidad

- [ ] **iOS versions**: iOS 11.3+
- [ ] **Navegadores**: Safari 11.3+
- [ ] **Dispositivos**: 100% iPads soportados

---

## ✅ Checklist Final Pre-Distribución

### Archivos

- [ ] Todos los iconos PNG generados
- [ ] manifest.json configurado correctamente
- [ ] sw.js sin errores
- [ ] index.html con meta tags PWA
- [ ] main.js registra Service Worker

### Hosting

- [ ] HTTPS configurado
- [ ] Certificado SSL válido
- [ ] DNS configurado (si dominio propio)
- [ ] Assets accesibles públicamente

### Testing

- [ ] Desktop testing completado
- [ ] iPad testing completado
- [ ] Lighthouse score > 90
- [ ] Funciona offline
- [ ] Actualizaciones funcionan

### Documentación

- [ ] README actualizado
- [ ] Guías de instalación disponibles
- [ ] Troubleshooting documentado

### Distribución

- [ ] URL de la app lista
- [ ] Instrucciones de instalación para usuarios
- [ ] Soporte técnico preparado

---

## 🚀 ¡Listo para Distribuir!

Si todos los items están marcados ✅, tu PWA está lista para distribuirse a usuarios finales.

**Próximos pasos:**

1. **Comunicar URL a usuarios:**
   ```
   Accede a: https://tu-dominio.com
   Safari > Compartir > Añadir a pantalla de inicio
   ```

2. **Monitorear:**
   - Logs de Service Worker
   - Errores en producción
   - Feedback de usuarios

3. **Mantener:**
   - Actualizar versión en sw.js cuando sea necesario
   - Probar actualizaciones antes de deploy
   - Documentar cambios

---

**Versión:** 1.0.0
**Última actualización:** 2025-12-25

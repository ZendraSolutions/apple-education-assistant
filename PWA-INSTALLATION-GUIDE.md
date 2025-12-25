# Guía de Instalación PWA - iPad

Esta guía te ayudará a convertir la aplicación Jamf Assistant en una PWA instalable en iPads.

## ✅ Checklist Previo

Antes de instalar en iPads, asegúrate de completar estos pasos:

### 1. Generar Iconos PNG

Los iconos son **OBLIGATORIOS** para que la PWA funcione en iOS/iPadOS.

**Opción A: Herramienta Web (Recomendado)**
1. Abre `icons/convert-svg-to-png.html` en Chrome o Safari
2. Espera a que se generen todos los iconos
3. Descarga todos los iconos haciendo clic en "Descargar Todos"
4. Coloca todos los archivos PNG en la carpeta `icons/`

**Opción B: PWA Builder**
1. Ve a https://www.pwabuilder.com/imageGenerator
2. Sube `icons/icon-source.svg`
3. Descarga el paquete completo
4. Extrae todos los PNG a la carpeta `icons/`

**Opción C: Línea de comandos (ImageMagick)**
```bash
cd icons
magick icon-source.svg -resize 72x72 icon-72.png
magick icon-source.svg -resize 96x96 icon-96.png
magick icon-source.svg -resize 128x128 icon-128.png
magick icon-source.svg -resize 144x144 icon-144.png
magick icon-source.svg -resize 152x152 icon-152.png
magick icon-source.svg -resize 192x192 icon-192.png
magick icon-source.svg -resize 384x384 icon-384.png
magick icon-source.svg -resize 512x512 icon-512.png
magick icon-source.svg -resize 180x180 apple-touch-icon.png
```

### 2. Verificar Archivos Creados

Asegúrate de que estos archivos existan:

```
✓ manifest.json (en raíz)
✓ sw.js (en raíz)
✓ icons/icon-72.png
✓ icons/icon-96.png
✓ icons/icon-128.png
✓ icons/icon-144.png
✓ icons/icon-152.png
✓ icons/icon-192.png
✓ icons/icon-384.png
✓ icons/icon-512.png
✓ icons/apple-touch-icon.png (¡IMPORTANTE para iOS!)
```

### 3. Configurar HTTPS

**⚠️ CRÍTICO**: Las PWA **SOLO** funcionan con HTTPS (excepto en localhost).

**Para desarrollo local:**
- Usar `http://localhost` o `http://127.0.0.1` (funciona sin HTTPS)
- O usar un servidor local con SSL (ver opciones abajo)

**Para producción:**
- Alojar en GitHub Pages (HTTPS gratuito)
- Netlify / Vercel (HTTPS automático)
- Servidor propio con certificado SSL

#### Opciones de servidor local con HTTPS:

**Opción 1: http-server con SSL**
```bash
npm install -g http-server
http-server -S -C cert.pem -K key.pem -p 8080
```

**Opción 2: live-server**
```bash
npm install -g live-server
live-server --https
```

**Opción 3: Python con SSL (Python 3.8+)**
```bash
# Generar certificado autofirmado
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Ejecutar servidor
python3 -m http.server 8000 --bind 0.0.0.0 --ssl
```

**Opción 4: Servir desde GitHub Pages (más fácil)**
1. Sube el proyecto a un repositorio GitHub
2. Ve a Settings > Pages
3. Selecciona la rama y carpeta
4. GitHub generará una URL HTTPS automáticamente

## 📱 Instalación en iPad/iPhone

### Paso 1: Acceder a la App

1. Abre **Safari** en tu iPad (⚠️ DEBE ser Safari, no Chrome ni otros navegadores)
2. Navega a la URL de tu app:
   - Desarrollo local: `http://localhost:8000` (o el puerto que uses)
   - Producción: `https://tu-dominio.com`

### Paso 2: Añadir a Pantalla de Inicio

1. Toca el botón de **Compartir** (cuadrado con flecha hacia arriba)
2. Desplázate hacia abajo y toca **"Añadir a pantalla de inicio"**
3. Edita el nombre si lo deseas (aparecerá como "Jamf Edu" por defecto)
4. Toca **"Añadir"**

### Paso 3: Abrir la PWA

1. Busca el icono de "Jamf Edu" en la pantalla de inicio
2. Tócalo para abrir la app
3. La app se abrirá en **modo standalone** (sin la barra de Safari)

## 🔍 Verificación y Testing

### Verificar que todo funciona:

1. **Abre las DevTools** (en Safari desktop conectado al iPad):
   - Safari > Develop > [Tu iPad] > [Tu PWA]

2. **Verifica en la consola**:
   ```
   [PWA] Service Worker registered successfully
   [SW] Installing service worker version: v1.0.0
   [SW] Static assets cached successfully
   [SW] Service worker activated successfully
   ```

3. **Prueba el modo offline**:
   - Abre la app instalada
   - Activa el modo avión
   - Recarga la app → Debería funcionar desde caché
   - Verifica que aparece "[SW] Serving from cache" en la consola

4. **Verifica el manifest**:
   - Abre: `https://tu-dominio.com/manifest.json`
   - Debería devolver el JSON correctamente

### Herramientas de Testing:

**Lighthouse (Chrome DevTools)**
```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Ejecutar audit PWA
lighthouse https://tu-dominio.com --view --preset=pwa
```

**PWA Builder Test**
1. Ve a https://www.pwabuilder.com
2. Ingresa tu URL
3. Haz clic en "Test"
4. Revisa los resultados

## 🔧 Troubleshooting

### Problema: No aparece "Añadir a pantalla de inicio"

**Causas posibles:**
- ❌ No estás usando Safari (usa Safari en iOS)
- ❌ No estás en HTTPS (excepto localhost)
- ❌ Falta el archivo `manifest.json`
- ❌ Faltan los iconos PNG (especialmente `apple-touch-icon.png`)

**Solución:**
1. Verifica que `manifest.json` esté accesible: `https://tu-dominio.com/manifest.json`
2. Verifica que los iconos existan: `https://tu-dominio.com/icons/apple-touch-icon.png`
3. Revisa la consola de Safari para errores
4. Asegúrate de usar HTTPS

### Problema: El Service Worker no se registra

**Causas posibles:**
- ❌ No estás en HTTPS
- ❌ El archivo `sw.js` no está en la raíz
- ❌ Hay errores de sintaxis en `sw.js`

**Solución:**
1. Verifica que `sw.js` esté accesible: `https://tu-dominio.com/sw.js`
2. Abre la consola y busca errores
3. Verifica que estés en HTTPS (o localhost)

### Problema: La app no funciona offline

**Causas posibles:**
- ❌ El Service Worker no cachea correctamente
- ❌ Rutas incorrectas en `STATIC_ASSETS`

**Solución:**
1. Abre DevTools > Application > Service Workers
2. Verifica que el SW esté "Activated and running"
3. Ve a Application > Cache Storage
4. Verifica que todos los archivos estén cacheados
5. Prueba hacer "Update on reload" para forzar actualización

### Problema: Los iconos no aparecen

**Causas posibles:**
- ❌ Los archivos PNG no existen
- ❌ Rutas incorrectas en `manifest.json`
- ❌ Los iconos no tienen el tamaño correcto

**Solución:**
1. Verifica que todos los PNG existan en `/icons/`
2. Verifica los tamaños:
   ```bash
   file icons/*.png
   ```
3. Regenera los iconos usando la herramienta de conversión

### Problema: La app se actualiza pero no recargo

**Solución:**
El Service Worker maneja las actualizaciones automáticamente. Si ves el mensaje "Nueva versión disponible", recarga la página:
1. Desliza hacia abajo para recargar (pull to refresh)
2. O cierra y vuelve a abrir la app
3. El SW se actualizará automáticamente

## 📊 Características PWA Implementadas

✅ **Manifest.json** - Metadatos de la app
✅ **Service Worker** - Funcionamiento offline
✅ **Cache First Strategy** - Assets estáticos desde caché
✅ **Network First Strategy** - APIs desde red
✅ **Update Notifications** - Alertas de nueva versión
✅ **iOS/iPadOS Support** - Meta tags específicos de Apple
✅ **Iconos multi-tamaño** - Compatibilidad con todos los dispositivos
✅ **Standalone Display** - Modo app nativa

## 🚀 Distribución

### GitHub Pages (Recomendado para desarrollo)

1. **Sube el proyecto a GitHub:**
   ```bash
   git add .
   git commit -m "feat: Add PWA support for iPad installation"
   git push origin main
   ```

2. **Habilita GitHub Pages:**
   - Ve a Settings > Pages
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

3. **Accede a tu app:**
   - URL: `https://tu-usuario.github.io/tu-repo/`
   - ¡Ya está en HTTPS y lista para instalar!

### Netlify / Vercel (Alternativa)

**Netlify:**
1. Conecta tu repositorio GitHub
2. Deploy automático
3. HTTPS gratuito

**Vercel:**
1. `npm install -g vercel`
2. `vercel --prod`
3. HTTPS automático

## 📖 Recursos Adicionales

- [PWA Checklist - web.dev](https://web.dev/pwa-checklist/)
- [Service Workers - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [iOS Safari PWA Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse PWA Audit](https://developers.google.com/web/tools/lighthouse)

## ✅ Lista de Verificación Final

Antes de distribuir a los iPads:

- [ ] Todos los iconos PNG generados y en `/icons/`
- [ ] `manifest.json` accesible en la raíz
- [ ] `sw.js` accesible en la raíz
- [ ] App servida desde HTTPS (o localhost para testing)
- [ ] Service Worker se registra correctamente
- [ ] App funciona offline
- [ ] "Añadir a pantalla de inicio" disponible en Safari
- [ ] Icono aparece correctamente al instalar
- [ ] App se abre en modo standalone
- [ ] Lighthouse PWA score > 90
- [ ] Probado en iPad real

¡Tu app ya es una PWA instalable en iPads! 🎉

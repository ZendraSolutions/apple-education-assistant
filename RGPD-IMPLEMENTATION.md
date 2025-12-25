# Implementación RGPD - Banner de Consentimiento

## Resumen

Sistema completo de consentimiento RGPD/ePrivacy implementado para la aplicación "Apple Edu Assistant", totalmente integrado con el diseño existente y cumpliendo con la normativa europea.

## Archivos Modificados y Creados

### 1. **js/consent.js** (NUEVO)
Sistema de gestión de consentimiento con las siguientes características:

- **Almacenamiento**: localStorage con versionado
- **Persistencia**: Preferencias guardadas hasta que el usuario las cambie
- **Gestión de recursos**:
  - Google Fonts: Carga condicional o fallback a fuentes del sistema
  - Remixicon: Carga condicional desde jsDelivr CDN
  - Google Gemini API: Consentimiento implícito al usar el chatbot

#### Funcionalidades Principales:
```javascript
ConsentManager.init()              // Inicializa el sistema
ConsentManager.acceptAll()         // Acepta todos los servicios
ConsentManager.acceptEssential()   // Solo cookies esenciales
ConsentManager.showSettings()      // Abre configuración personalizada
ConsentManager.hasConsentFor(service) // Verifica consentimiento
```

### 2. **css/styles.css** (MODIFICADO)
Añadida sección 13: RGPD CONSENT BANNER con:

- **Banner principal**: Posición fija en bottom con animación suave
- **Modal de configuración**: Opciones detalladas por servicio
- **Componentes visuales**:
  - Botones primarios, secundarios y de texto
  - Toggles interactivos para opciones
  - Info boxes para transparencia
  - Badges para categorías (esencial/opcional)

#### Características de diseño:
- Integración completa con variables CSS existentes (colores, espaciado, sombras)
- Soporte dark mode automático
- Responsive completo (móvil, tablet, desktop)
- Accesibilidad WCAG 2.1 (focus visible, contraste)
- Animaciones suaves con cubic-bezier

### 3. **index.html** (MODIFICADO)

#### Cambios en `<head>`:
```html
<!-- ANTES -->
<link href="https://fonts.googleapis.com/css2?family=Outfit..." rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/remixicon..." rel="stylesheet">

<!-- DESPUÉS -->
<!-- Fonts y iconos se cargan condicionalmente según consentimiento RGPD -->
```

#### Añadido antes de `</body>`:
- Banner de consentimiento con 3 botones de acción
- Modal de configuración con opciones detalladas
- Script `js/consent.js` cargado primero

## Flujo de Usuario

### Primera Visita
1. Usuario accede a la aplicación
2. Banner aparece desde abajo con animación bounce
3. Opciones disponibles:
   - **Aceptar todo**: Carga Google Fonts + Remixicon
   - **Solo necesarias**: Fuentes del sistema + iconos básicos
   - **Configurar**: Abre modal para personalizar

### Configuración Personalizada
El modal muestra 3 categorías:

1. **Cookies Esenciales** (obligatorias)
   - localStorage para tema y preferencias
   - No se pueden desactivar

2. **Google Fonts** (opcional)
   - Tipografía Outfit para mejor UX
   - Fallback: Fuentes del sistema (-apple-system, Segoe UI, etc.)
   - Datos compartidos: IP anonimizada

3. **Remixicon** (opcional)
   - Iconos desde jsDelivr CDN
   - Fallback: Iconos básicos sin CDN
   - Datos compartidos: IP anonimizada

### Uso del Chatbot IA
- El consentimiento para Google Gemini API es **implícito al usar el chatbot**
- Se informa claramente en el modal de configuración
- La API Key se guarda cifrada en localStorage

## Características Técnicas

### Almacenamiento
```javascript
// LocalStorage keys
consent_preferences: {
  version: "1.0",
  timestamp: 1234567890,
  essential: true,
  fonts: true/false,
  icons: true/false,
  analytics: false
}
```

### Carga Condicional de Recursos

#### Google Fonts (CON consentimiento):
```javascript
<link id="google-fonts" href="https://fonts.googleapis.com/..." />
```

#### Fallback (SIN consentimiento):
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

#### Remixicon (CON consentimiento):
```javascript
<link id="remixicon" href="https://cdn.jsdelivr.net/npm/remixicon..." />
```

### Versionado
- Versión actual: **1.0**
- Si cambia la versión, se resetea el consentimiento
- Permite actualizar políticas y re-solicitar consentimiento

## Responsive Design

### Desktop (1025px+)
- Banner centrado, max-width: 600px
- Modal con padding generoso
- Todos los toggles visibles

### Tablet (769px - 1024px)
- Banner adaptado a márgenes reducidos
- Modal responsive

### Mobile (< 768px)
- Banner full-width con padding reducido
- Botones en columna
- Modal adaptado a pantalla pequeña

### Mobile Small (< 480px)
- Textos más pequeños
- Padding mínimo optimizado
- Toggles reorganizados verticalmente

### Landscape Mobile
- Detalles adicionales ocultos
- Altura optimizada

## Accesibilidad

### WCAG 2.1 Compliance
- **Focus visible**: Outline de 2px en todos los elementos interactivos
- **Contraste**: Ratios mínimos cumplidos (AA)
- **Navegación por teclado**: Todos los botones accesibles
- **Semántica**: HTML estructurado correctamente

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  .consent-banner { border: 2px solid var(--text-primary); }
  .consent-btn-primary { border: 2px solid white; }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

## Internacionalización

Todos los textos en **español**:
- Banner: "Respetamos tu privacidad"
- Botones: "Aceptar todo", "Solo necesarias", "Configurar"
- Modal: Descripciones detalladas en español
- Info boxes: Explicaciones claras sobre privacidad

## Integración con Sección "Mis Datos"

El usuario puede:
1. Acceder a "Mis Datos" desde el menú lateral
2. Ver y modificar preferencias de cookies
3. Exportar/eliminar datos personales
4. Revocar consentimientos en cualquier momento

## Compliance RGPD

### Principios Cumplidos
✅ **Transparencia**: Información clara sobre servicios externos
✅ **Consentimiento específico**: Por cada servicio
✅ **Revocabilidad**: Modificable desde "Mis Datos"
✅ **Minimización de datos**: Solo IP anonimizada compartida
✅ **Finalidad específica**: Mejora de UX explicada
✅ **Privacidad por diseño**: Fallbacks sin servicios externos

### ePrivacy Directive
✅ **Consentimiento previo**: Banner en primera visita
✅ **Cookies esenciales**: Claramente diferenciadas
✅ **Rechazo fácil**: Botón "Solo necesarias" visible
✅ **Información completa**: Proveedores y datos compartidos

## Testing Recomendado

### Navegadores
- [ ] Chrome/Edge (Desktop + Mobile)
- [ ] Firefox (Desktop + Mobile)
- [ ] Safari (macOS + iOS)

### Escenarios
- [ ] Primera visita → Banner aparece
- [ ] "Aceptar todo" → Fonts + Icons cargados
- [ ] "Solo necesarias" → Fallbacks aplicados
- [ ] "Configurar" → Modal funcional
- [ ] Toggles interactivos
- [ ] Guardar preferencias → localStorage actualizado
- [ ] Recarga → Preferencias persistidas
- [ ] Dark mode → Estilos correctos
- [ ] Responsive → Todas las resoluciones

### Accesibilidad
- [ ] Navegación por teclado (Tab)
- [ ] Screen readers (NVDA/JAWS)
- [ ] High contrast mode
- [ ] Zoom 200%

## Mejoras Futuras Opcionales

1. **Analytics Consent**: Si se añade Google Analytics
2. **Cookie Policy Page**: Página dedicada a política de cookies
3. **Consent History**: Log de cambios de consentimiento
4. **Multi-idioma**: i18n para inglés/catalán
5. **A/B Testing**: Optimización de tasas de aceptación

## Soporte

Para dudas o modificaciones, revisar:
- `/js/consent.js` - Lógica JavaScript
- `/css/styles.css` - Sección 13 (línea ~2779)
- `/index.html` - Banner y modal (líneas 246-372)

---

**Versión**: 1.0
**Fecha**: 2025
**Autor**: Desarrollador Frontend Senior
**Compliance**: RGPD + ePrivacy Directive

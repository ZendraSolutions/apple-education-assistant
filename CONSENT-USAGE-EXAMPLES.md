# Ejemplos de Uso - Sistema de Consentimiento RGPD

## Casos de Uso Comunes

### 1. Verificar si hay consentimiento para un servicio

```javascript
// Verificar si el usuario ha dado consentimiento para Google Fonts
if (ConsentManager.hasConsentFor('fonts')) {
    console.log('✓ Google Fonts permitido');
    // Cargar fuentes personalizadas
} else {
    console.log('✗ Usando fuentes del sistema');
    // Usar fallback
}

// Verificar iconos
if (ConsentManager.hasConsentFor('icons')) {
    console.log('✓ Remixicon permitido');
} else {
    console.log('✗ Iconos básicos');
}
```

### 2. Abrir modal de configuración desde código

```javascript
// Desde un botón personalizado
document.getElementById('mi-boton-cookies').addEventListener('click', () => {
    ConsentManager.showSettings();
});

// Desde el menú "Mis Datos"
function openCookieSettings() {
    ConsentManager.showSettings();
}
```

### 3. Limpiar consentimiento (testing)

```javascript
// Borrar todo el consentimiento guardado
ConsentManager.clearConsent();
location.reload(); // Recargar para ver el banner

// Útil para testing o resetear preferencias
```

### 4. Obtener preferencias actuales

```javascript
const preferences = ConsentManager.getConsent();
console.log(preferences);

/* Retorna:
{
    version: "1.0",
    timestamp: 1234567890,
    essential: true,
    fonts: true,
    icons: false,
    analytics: false
}
*/
```

### 5. Programáticamente aceptar/rechazar

```javascript
// Aceptar todo
ConsentManager.acceptAll();

// Solo esenciales
ConsentManager.acceptEssential();

// Personalizado
ConsentManager.saveConsent({
    essential: true,
    fonts: true,
    icons: false,
    analytics: false
});
```

## Integración con Sección "Mis Datos"

### HTML de ejemplo para página "Mis Datos"

```html
<div class="consent-section">
    <h2>
        <i class="ri-shield-check-line"></i>
        Gestión de Cookies y Servicios Externos
    </h2>

    <div class="consent-status-card">
        <h3>Estado Actual</h3>
        <div id="current-consent-status">
            <!-- Se llena dinámicamente -->
        </div>

        <button onclick="ConsentManager.showSettings()" class="btn-primary">
            <i class="ri-settings-3-line"></i>
            Modificar Preferencias
        </button>
    </div>

    <div class="consent-history">
        <h3>Última Actualización</h3>
        <p id="last-consent-update">
            <!-- Se llena dinámicamente -->
        </p>
    </div>

    <div class="consent-actions">
        <button onclick="revokeAllConsent()" class="btn-danger">
            <i class="ri-close-circle-line"></i>
            Revocar Todos los Consentimientos
        </button>
    </div>
</div>
```

### JavaScript para página "Mis Datos"

```javascript
// Mostrar estado actual
function displayConsentStatus() {
    const consent = ConsentManager.getConsent();
    const statusContainer = document.getElementById('current-consent-status');

    if (!consent) {
        statusContainer.innerHTML = '<p>No hay preferencias guardadas</p>';
        return;
    }

    const services = [
        { key: 'fonts', name: 'Google Fonts', icon: 'ri-font-size' },
        { key: 'icons', name: 'Remixicon', icon: 'ri-emotion-line' },
    ];

    let html = '<div class="consent-list">';
    services.forEach(service => {
        const status = consent[service.key] ? 'activo' : 'inactivo';
        const icon = consent[service.key] ? 'ri-check-line' : 'ri-close-line';
        const color = consent[service.key] ? 'success' : 'muted';

        html += `
            <div class="consent-item ${status}">
                <i class="${service.icon}"></i>
                <span>${service.name}</span>
                <i class="${icon} ${color}"></i>
            </div>
        `;
    });
    html += '</div>';

    statusContainer.innerHTML = html;
}

// Mostrar última actualización
function displayLastUpdate() {
    const consent = ConsentManager.getConsent();
    const updateContainer = document.getElementById('last-consent-update');

    if (consent && consent.timestamp) {
        const date = new Date(consent.timestamp);
        updateContainer.textContent = date.toLocaleString('es-ES', {
            dateStyle: 'long',
            timeStyle: 'short'
        });
    }
}

// Revocar todos los consentimientos
function revokeAllConsent() {
    if (confirm('¿Estás seguro de que quieres revocar todos los consentimientos? Solo se usarán servicios esenciales.')) {
        ConsentManager.acceptEssential();
        displayConsentStatus();
        displayLastUpdate();

        // Mostrar notificación
        showNotification('Consentimientos revocados. Recargando...', 'success');
        setTimeout(() => location.reload(), 2000);
    }
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    displayConsentStatus();
    displayLastUpdate();
});
```

## Debugging y Testing

### Consola del navegador

```javascript
// Ver estado del consentimiento
console.table(ConsentManager.getConsent());

// Ver localStorage completo
console.log('Consent:', localStorage.getItem('consent_preferences'));
console.log('Timestamp:', localStorage.getItem('consent_timestamp'));

// Simular primera visita
localStorage.removeItem('consent_preferences');
localStorage.removeItem('consent_timestamp');
location.reload();

// Simular cambio de versión (re-solicitar consentimiento)
let consent = JSON.parse(localStorage.getItem('consent_preferences'));
consent.version = '0.9'; // Versión antigua
localStorage.setItem('consent_preferences', JSON.stringify(consent));
location.reload(); // Banner aparecerá de nuevo
```

### Testing de recursos cargados

```javascript
// Verificar si Google Fonts está cargado
const googleFontsLink = document.getElementById('google-fonts');
console.log('Google Fonts:', googleFontsLink ? 'CARGADO' : 'NO CARGADO');

// Verificar si Remixicon está cargado
const remixiconLink = document.getElementById('remixicon');
console.log('Remixicon:', remixiconLink ? 'CARGADO' : 'NO CARGADO');

// Verificar fuentes aplicadas
const computedFont = window.getComputedStyle(document.body).fontFamily;
console.log('Fuente actual:', computedFont);
// Con consentimiento: "Outfit", "Inter", sans-serif
// Sin consentimiento: -apple-system, BlinkMacSystemFont, "Segoe UI", ...
```

## Personalización Avanzada

### Añadir nuevo servicio externo

Si en el futuro añades un nuevo servicio (ej: Google Analytics):

1. **Añadir en consent.js**:

```javascript
// En getConsent()
return {
    ...parsed,
    analytics: parsed.analytics || false // Nuevo servicio
};

// En acceptAll()
const preferences = {
    essential: true,
    fonts: true,
    icons: true,
    analytics: true  // ← NUEVO
};
```

2. **Añadir en index.html**:

```html
<!-- Google Analytics (Opcional) -->
<div class="consent-option">
    <div class="consent-option-header">
        <div class="consent-option-title">
            <i class="ri-line-chart-line"></i>
            Google Analytics
            <span class="consent-option-badge optional">Opcional</span>
        </div>
        <label class="consent-toggle" id="toggle-analytics">
            <input type="checkbox" id="consent-analytics">
            <span class="consent-toggle-slider"></span>
        </label>
    </div>
    <p class="consent-option-description">
        Estadísticas anónimas para mejorar la aplicación.
    </p>
    <p class="consent-option-details">
        Proveedor: Google LLC | Cookies: _ga, _gid | Duración: 2 años
    </p>
</div>
```

3. **Añadir lógica de carga**:

```javascript
// En loadResources()
if (preferences.analytics) {
    this.loadGoogleAnalytics();
}

// Método nuevo
loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
}
```

### Cambiar duración del consentimiento

Por defecto es permanente. Para hacerlo temporal:

```javascript
// En saveConsent(), añadir expiración
saveConsent(preferences) {
    const consent = {
        version: this.CONSENT_VERSION,
        timestamp: Date.now(),
        expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 año
        ...preferences
    };
    // ...
}

// En getConsent(), verificar expiración
getConsent() {
    // ...
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        this.clearConsent();
        return null; // Expirado, mostrar banner de nuevo
    }
    // ...
}
```

## Eventos Personalizados

Emitir eventos cuando cambia el consentimiento:

```javascript
// En saveConsent()
saveConsent(preferences) {
    // ... código existente ...

    // Emitir evento personalizado
    window.dispatchEvent(new CustomEvent('consentChanged', {
        detail: preferences
    }));
}

// Escuchar cambios en otra parte de la app
window.addEventListener('consentChanged', (event) => {
    console.log('Consentimiento actualizado:', event.detail);

    // Reaccionar al cambio
    if (event.detail.fonts) {
        console.log('Fonts habilitados, recargando recursos...');
    }
});
```

## Exportar/Importar Preferencias

Para backup o migración:

```javascript
// Exportar
function exportConsent() {
    const consent = ConsentManager.getConsent();
    const blob = new Blob([JSON.stringify(consent, null, 2)],
        { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'consent-preferences.json';
    a.click();
}

// Importar
function importConsent(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const consent = JSON.parse(e.target.result);
            ConsentManager.saveConsent(consent);
            location.reload();
        } catch (error) {
            console.error('Error importando preferencias:', error);
        }
    };
    reader.readAsText(file);
}
```

## Notas Importantes

1. **Primera visita**: El banner aparece automáticamente
2. **Persistencia**: Las preferencias se guardan en `localStorage`
3. **Sin consentimiento**: La app funciona con fallbacks (fuentes del sistema)
4. **Chatbot**: El consentimiento para Gemini API es implícito al usarlo
5. **Revocación**: Siempre disponible desde "Mis Datos"

## Recursos Adicionales

- **RGPD**: https://gdpr.eu/
- **ePrivacy Directive**: https://ec.europa.eu/digital-single-market/en/eprivacy-directive
- **Cookie Consent Best Practices**: https://ico.org.uk/for-organisations/guide-to-pecr/cookies-and-similar-technologies/

---

**Última actualización**: 2025
**Compatibilidad**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

/**
 * RGPD Consent Manager
 * Gestión de consentimiento para recursos externos
 * - Google Fonts
 * - Remixicon via jsDelivr
 * - Google Gemini API (implícito al usar chatbot)
 */

const ConsentManager = {
    STORAGE_KEY: 'consent_preferences',
    CONSENT_TIMESTAMP: 'consent_timestamp',
    CONSENT_VERSION: '1.0',

    /**
     * Inicializa el sistema de consentimiento
     */
    init() {
        // Verificar si ya hay consentimiento
        const savedConsent = this.getConsent();

        if (!savedConsent) {
            // Primera visita - mostrar banner
            this.showBanner();
        } else {
            // Consentimiento existente - cargar recursos
            this.loadResources(savedConsent);
        }
    },

    /**
     * Obtiene el consentimiento guardado
     * @returns {Object|null} Preferencias de consentimiento
     */
    getConsent() {
        try {
            const consent = localStorage.getItem(this.STORAGE_KEY);
            if (!consent) return null;

            const parsed = JSON.parse(consent);

            // Verificar versión de consentimiento
            if (parsed.version !== this.CONSENT_VERSION) {
                this.clearConsent();
                return null;
            }

            return parsed;
        } catch (e) {
            console.error('Error leyendo consentimiento:', e);
            return null;
        }
    },

    /**
     * Guarda las preferencias de consentimiento
     * @param {Object} preferences Preferencias del usuario
     */
    saveConsent(preferences) {
        const consent = {
            version: this.CONSENT_VERSION,
            timestamp: Date.now(),
            ...preferences
        };

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(consent));
            localStorage.setItem(this.CONSENT_TIMESTAMP, Date.now().toString());
        } catch (e) {
            console.error('Error guardando consentimiento:', e);
        }
    },

    /**
     * Limpia el consentimiento guardado
     */
    clearConsent() {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.CONSENT_TIMESTAMP);
    },

    /**
     * Verifica si hay consentimiento para un servicio específico
     * @param {string} service Nombre del servicio
     * @returns {boolean}
     */
    hasConsentFor(service) {
        const consent = this.getConsent();
        if (!consent) return false;
        return consent[service] === true;
    },

    /**
     * Muestra el banner de consentimiento
     */
    showBanner() {
        const banner = document.getElementById('consent-banner');
        if (!banner) {
            console.error('Banner de consentimiento no encontrado');
            return;
        }

        // Animación de entrada
        setTimeout(() => {
            banner.classList.add('active');
        }, 500);
    },

    /**
     * Oculta el banner de consentimiento
     */
    hideBanner() {
        const banner = document.getElementById('consent-banner');
        if (banner) {
            banner.classList.remove('active');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    },

    /**
     * Acepta todas las cookies
     */
    acceptAll() {
        const preferences = {
            essential: true,
            fonts: true,
            icons: true,
            analytics: false // No usamos analytics aún
        };

        this.saveConsent(preferences);
        this.loadResources(preferences);
        this.hideBanner();
    },

    /**
     * Solo acepta cookies esenciales
     */
    acceptEssential() {
        const preferences = {
            essential: true,
            fonts: false,
            icons: false,
            analytics: false
        };

        this.saveConsent(preferences);
        this.loadResources(preferences);
        this.hideBanner();
    },

    /**
     * Muestra el modal de configuración
     */
    showSettings() {
        const modal = document.getElementById('consent-settings-modal');
        if (modal) {
            modal.classList.add('active');

            // Cargar preferencias actuales
            const consent = this.getConsent() || {
                essential: true,
                fonts: false,
                icons: false,
                analytics: false
            };

            // Marcar checkboxes
            document.getElementById('consent-fonts').checked = consent.fonts;
            document.getElementById('consent-icons').checked = consent.icons;
        }
    },

    /**
     * Oculta el modal de configuración
     */
    hideSettings() {
        const modal = document.getElementById('consent-settings-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    /**
     * Guarda la configuración personalizada
     */
    saveSettings() {
        const preferences = {
            essential: true, // Siempre true
            fonts: document.getElementById('consent-fonts').checked,
            icons: document.getElementById('consent-icons').checked,
            analytics: false
        };

        this.saveConsent(preferences);
        this.loadResources(preferences);
        this.hideSettings();
        this.hideBanner();
    },

    /**
     * Carga recursos externos según consentimiento
     * @param {Object} preferences Preferencias de consentimiento
     */
    loadResources(preferences) {
        // Google Fonts
        if (preferences.fonts) {
            this.loadGoogleFonts();
        } else {
            this.useFallbackFonts();
        }

        // Remixicon
        if (preferences.icons) {
            this.loadRemixicon();
        } else {
            this.useIconFallback();
        }
    },

    /**
     * Carga Google Fonts
     */
    loadGoogleFonts() {
        // Verificar si ya está cargado
        if (document.getElementById('google-fonts')) return;

        const link = document.createElement('link');
        link.id = 'google-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap';
        document.head.appendChild(link);
    },

    /**
     * Usa fuentes del sistema como fallback
     */
    useFallbackFonts() {
        const style = document.createElement('style');
        style.id = 'fallback-fonts';
        style.textContent = `
            body, .sidebar, .nav-item, .card-title, h1, h2, h3, h4, h5, h6, button {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Carga Remixicon con Subresource Integrity
     */
    loadRemixicon() {
        // Verificar si ya está cargado
        if (document.getElementById('remixicon')) return;

        const link = document.createElement('link');
        link.id = 'remixicon';
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css';
        // Subresource Integrity para verificar integridad del recurso
        link.integrity = 'sha384-3IfPN7bUY9t2yZyfTCGYPxkgBPMK8qRk4VZqiW2ViOlKVGxkPJf22+zllRYbDrVj';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    },

    /**
     * Fallback para iconos (usar texto o símbolos Unicode)
     */
    useIconFallback() {
        // Los iconos ya están en el HTML, solo añadimos un estilo de respaldo
        const style = document.createElement('style');
        style.id = 'icon-fallback';
        style.textContent = `
            /* Mantener iconos pero sin CDN externo */
            [class^="ri-"], [class*=" ri-"] {
                font-family: "Remixicon", sans-serif;
                font-style: normal;
                -webkit-font-smoothing: antialiased;
            }
        `;
        document.head.appendChild(style);
    }
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ConsentManager.init());
} else {
    ConsentManager.init();
}

// Event listeners para botones del banner
document.addEventListener('DOMContentLoaded', () => {
    // Botón "Aceptar todo"
    const acceptAllBtn = document.getElementById('consent-accept-all');
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => ConsentManager.acceptAll());
    }

    // Botón "Solo necesarias"
    const essentialBtn = document.getElementById('consent-essential');
    if (essentialBtn) {
        essentialBtn.addEventListener('click', () => ConsentManager.acceptEssential());
    }

    // Botón "Configurar"
    const settingsBtn = document.getElementById('consent-settings');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => ConsentManager.showSettings());
    }

    // Modal: Cerrar
    const modalClose = document.getElementById('consent-modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', () => ConsentManager.hideSettings());
    }

    // Modal: Guardar configuración
    const saveSettingsBtn = document.getElementById('consent-save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => ConsentManager.saveSettings());
    }

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('consent-settings-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                ConsentManager.hideSettings();
            }
        });
    }

    // Toggle switches interactivos
    const toggleFonts = document.getElementById('toggle-fonts');
    const toggleIcons = document.getElementById('toggle-icons');

    if (toggleFonts) {
        toggleFonts.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.disabled) {
                checkbox.checked = !checkbox.checked;
                this.classList.toggle('active', checkbox.checked);
            }
        });
    }

    if (toggleIcons) {
        toggleIcons.addEventListener('click', function() {
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.disabled) {
                checkbox.checked = !checkbox.checked;
                this.classList.toggle('active', checkbox.checked);
            }
        });
    }

    // Sincronizar estado visual de toggles con checkboxes
    const consentFonts = document.getElementById('consent-fonts');
    const consentIcons = document.getElementById('consent-icons');

    if (consentFonts) {
        consentFonts.addEventListener('change', function() {
            const toggle = document.getElementById('toggle-fonts');
            if (toggle) {
                toggle.classList.toggle('active', this.checked);
            }
        });
    }

    if (consentIcons) {
        consentIcons.addEventListener('change', function() {
            const toggle = document.getElementById('toggle-icons');
            if (toggle) {
                toggle.classList.toggle('active', this.checked);
            }
        });
    }
});

// Exportar para uso global
window.ConsentManager = ConsentManager;

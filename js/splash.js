/**
 * SPLASH SCREEN - Apple Edu Assistant
 * Muestra un splash screen corporativo al cargar la aplicación
 */

(function() {
    'use strict';

    // Duración del splash antes de comenzar fade-out (en milisegundos)
    const SPLASH_DURATION = 1500;

    // Duración de la animación de fade-out
    const FADE_OUT_DURATION = 800;

    /**
     * Oculta el splash screen con animación suave
     */
    function hideSplash() {
        const splash = document.getElementById('splash-screen');

        if (!splash) {
            console.warn('Splash screen element not found');
            return;
        }

        // Añadir clase para iniciar fade-out
        splash.classList.add('splash-fade-out');

        // Eliminar el splash del DOM después de la animación
        setTimeout(() => {
            splash.style.display = 'none';
            // Liberar memoria
            splash.remove();
        }, FADE_OUT_DURATION);
    }

    /**
     * Inicializa el splash screen
     */
    function initSplash() {
        // Asegurar que el splash está visible al inicio
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.display = 'flex';
        }

        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(hideSplash, SPLASH_DURATION);
            });
        } else {
            // DOM ya está listo
            setTimeout(hideSplash, SPLASH_DURATION);
        }
    }

    // Iniciar el splash
    initSplash();
})();

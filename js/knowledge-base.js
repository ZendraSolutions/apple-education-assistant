/**
 * JAMF ASSISTANT - Knowledge Base Loader
 *
 * This file provides backwards compatibility with the original monolithic
 * knowledge base structure. It imports all modular components and exposes
 * them through the global window.KnowledgeBase object.
 *
 * The knowledge base has been refactored into separate ES6 modules located in:
 * - js/data/KnowledgeMetadata.js
 * - js/data/KnowledgeEcosystem.js
 * - js/data/KnowledgeIPads.js
 * - js/data/KnowledgeMacs.js
 * - js/data/KnowledgeAula.js
 * - js/data/KnowledgeTeacher.js
 * - js/data/KnowledgeChecklists.js
 * - js/data/KnowledgeDiagrams.js
 *
 * For modern ES6 usage, import directly from js/data/index.js
 *
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 */

// =============================================================================
// Import Modular Components
// Since this file is loaded as a regular script (not a module), we need to
// use dynamic imports to load the ES6 modules.
// =============================================================================

(async function loadKnowledgeBase() {
    'use strict';

    try {
        // Determine the base path for imports
        const scripts = document.getElementsByTagName('script');
        let basePath = '';
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (src.includes('knowledge-base.js')) {
                basePath = src.replace('knowledge-base.js', 'data/');
                break;
            }
        }

        // If we couldn't determine the path, use relative path
        if (!basePath) {
            basePath = './js/data/';
        }

        // Import all modules in parallel
        const [
            metadataModule,
            ecosistemaModule,
            ipadsModule,
            macsModule,
            aulaModule,
            teacherModule,
            checklistsModule,
            diagramsModule
        ] = await Promise.all([
            import(`${basePath}KnowledgeMetadata.js`),
            import(`${basePath}KnowledgeEcosystem.js`),
            import(`${basePath}KnowledgeIPads.js`),
            import(`${basePath}KnowledgeMacs.js`),
            import(`${basePath}KnowledgeAula.js`),
            import(`${basePath}KnowledgeTeacher.js`),
            import(`${basePath}KnowledgeChecklists.js`),
            import(`${basePath}KnowledgeDiagrams.js`)
        ]);

        // Construct the KnowledgeBase object
        window.KnowledgeBase = {
            _metadata: metadataModule.metadata,
            ecosistema: ecosistemaModule.ecosistema,
            ipads: ipadsModule.ipads,
            macs: macsModule.macs,
            aula: aulaModule.aula,
            teacher: teacherModule.teacher,
            checklists: checklistsModule.checklists,
            diagrams: diagramsModule.diagrams
        };

        // Dispatch event to notify that KnowledgeBase is loaded
        window.dispatchEvent(new CustomEvent('knowledgeBaseLoaded', {
            detail: { success: true }
        }));

        console.log('[KnowledgeBase] Loaded successfully (modular version 2.0.0)');

    } catch (error) {
        console.error('[KnowledgeBase] Error loading modular components:', error);
        console.warn('[KnowledgeBase] Falling back to inline definition...');

        // Fallback: Define KnowledgeBase inline if module loading fails
        // This ensures the application continues to work even if module loading fails
        loadFallbackKnowledgeBase();
    }
})();

/**
 * Fallback function that loads the complete KnowledgeBase inline
 * This is only used if dynamic imports fail (e.g., in older browsers or
 * when running without a proper web server)
 */
function loadFallbackKnowledgeBase() {
    // Metadata
    const metadata = {
        version: '2.0.0',
        lastUpdated: '2025-12-24',
        source: 'Documentacion oficial de Jamf (learn.jamf.com)',
        officialDocs: 'https://learn.jamf.com/bundle/jamf-school-documentation/',
        articleCount: 22,
        updateFrequency: 'Manual - Verificar cada trimestre',
        ecosystem: 'Apple School Manager + Jamf School + App Aula'
    };

    // Ecosistema
    const ecosistema = {
        overview: {
            title: '¿Como funciona el ecosistema Apple Education?',
            icon: '<i class="ri-settings-3-line"></i>',
            tag: 'Fundamentos',
            time: '10 min',
            content: '<h2>Ecosistema Apple Education</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        asm: {
            title: 'Apple School Manager (ASM)',
            icon: '<i class="ri-apple-line"></i>',
            tag: 'Guia completa',
            time: '15 min',
            content: '<h2>Apple School Manager</h2><p>Ver documentacion modular para contenido completo.</p>'
        }
    };

    // iPads
    const ipads = {
        enrollment: {
            title: 'Inscribir iPads en Jamf',
            icon: '<i class="ri-tablet-line"></i>',
            tag: 'Configuracion',
            time: '10-15 min',
            steps: 8,
            content: '<h2>Inscribir iPads</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        apps: {
            title: 'Instalar Aplicaciones',
            icon: '<i class="ri-app-store-line"></i>',
            tag: 'Apps',
            time: '5 min',
            steps: 6,
            content: '<h2>Instalar Apps</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        restrictions: {
            title: 'Perfiles de Restriccion',
            icon: '<i class="ri-shield-keyhole-line"></i>',
            tag: 'Seguridad',
            time: '15 min',
            steps: 10,
            content: '<h2>Restricciones</h2><p>Ver documentacion modular para contenido completo.</p>'
        }
    };

    // Macs
    const macs = {
        enrollment: {
            title: 'Inscribir Macs en Jamf',
            icon: '<i class="ri-macbook-line"></i>',
            tag: 'Configuracion',
            time: '15 min',
            steps: 10,
            content: '<h2>Inscribir Macs</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        policies: {
            title: 'Crear Politicas',
            icon: '<i class="ri-settings-4-line"></i>',
            tag: 'Politicas',
            time: '20 min',
            steps: 12,
            content: '<h2>Politicas</h2><p>Ver documentacion modular para contenido completo.</p>'
        }
    };

    // Aula
    const aula = {
        overview: {
            title: 'App Aula - Guia para Profesores',
            icon: '<i class="ri-presentation-line"></i>',
            tag: 'Guia completa',
            time: '15 min',
            content: '<h2>App Aula</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        howto: {
            title: 'Acciones comunes en la app Aula',
            icon: '<i class="ri-function-line"></i>',
            tag: 'Guia practica',
            time: '10 min',
            content: '<h2>Acciones Comunes</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        setup: {
            title: 'Configurar la app Aula (para IT)',
            icon: '<i class="ri-settings-3-line"></i>',
            tag: 'Configuracion IT',
            time: '20 min',
            steps: 12,
            content: '<h2>Configuracion IT</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        advanced: {
            title: 'Funciones Avanzadas de la app Aula',
            icon: '<i class="ri-rocket-line"></i>',
            tag: 'Avanzado',
            time: '15 min',
            content: '<h2>Funciones Avanzadas</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        remotehybrid: {
            title: 'Clases Remotas e Hibridas con Aula',
            icon: '<i class="ri-global-line"></i>',
            tag: 'Remoto',
            time: '10 min',
            content: '<h2>Clases Remotas</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        sharedipad: {
            title: 'Aula con iPad Compartido (Shared iPad)',
            icon: '<i class="ri-group-2-line"></i>',
            tag: 'Configuracion',
            time: '10 min',
            content: '<h2>Shared iPad</h2><p>Ver documentacion modular para contenido completo.</p>'
        },
        troubleshoot: {
            title: 'Solucionar Problemas de la app Aula',
            icon: '<i class="ri-tools-line"></i>',
            tag: 'Troubleshooting',
            time: 'Variable',
            content: '<h2>Troubleshooting</h2><p>Ver documentacion modular para contenido completo.</p>'
        }
    };

    // Teacher
    const teacher = {
        setup: {
            title: 'Configurar Jamf Teacher',
            icon: '<i class="ri-presentation-line"></i>',
            tag: 'Guia completa',
            content: '<h2>Jamf Teacher</h2><p>Ver documentacion modular para contenido completo.</p>'
        }
    };

    // Checklists (simplified)
    const checklists = {
        newIpad: { title: 'Nuevo iPad', icon: '<i class="ri-smartphone-line"></i>', category: 'Dispositivos', estimatedTime: '15-20 min', items: [] },
        newMac: { title: 'Nuevo Mac', icon: '<i class="ri-macbook-line"></i>', category: 'Dispositivos', estimatedTime: '30-45 min', items: [] },
        startYear: { title: 'Inicio de Curso', icon: '<i class="ri-calendar-event-line"></i>', category: 'Curso Escolar', estimatedTime: '2-3 dias', items: [] },
        endYear: { title: 'Fin de Curso', icon: '<i class="ri-calendar-check-line"></i>', category: 'Curso Escolar', estimatedTime: '1-2 dias', items: [] },
        newTeacher: { title: 'Profesor Nuevo', icon: '<i class="ri-user-add-line"></i>', category: 'Personal', estimatedTime: '30-45 min', items: [] },
        studentLeaves: { title: 'Alumno Devuelve iPad', icon: '<i class="ri-user-unfollow-line"></i>', category: 'Dispositivos', estimatedTime: '10-15 min', items: [] },
        aulaNotWorking: { title: 'Troubleshooting Aula', icon: '<i class="ri-error-warning-line"></i>', category: 'Soporte', estimatedTime: '10-20 min', items: [] },
        dailyCheck: { title: 'Verificacion Diaria IT', icon: '<i class="ri-checkbox-circle-line"></i>', category: 'Soporte', estimatedTime: '5-10 min', items: [] },
        weeklyMaintenance: { title: 'Mantenimiento Semanal', icon: '<i class="ri-calendar-2-line"></i>', category: 'Soporte', estimatedTime: '1-2 horas', items: [] },
        prepareExam: { title: 'Preparar Examen Digital', icon: '<i class="ri-file-list-3-line"></i>', category: 'Aula', estimatedTime: '15-20 min', items: [] }
    };

    // Diagrams
    const diagrams = {
        ecosystem: { title: 'Flujo del Ecosistema Apple Education', html: '<div class="diagram-placeholder">Diagrama no disponible en modo fallback</div>' },
        aulaFlow: { title: 'Flujo de Funcionamiento de la App Aula', html: '<div class="diagram-placeholder">Diagrama no disponible en modo fallback</div>' },
        troubleshootFlow: { title: 'Orden de Verificacion cuando algo no funciona', html: '<div class="diagram-placeholder">Diagrama no disponible en modo fallback</div>' }
    };

    // Set global KnowledgeBase
    window.KnowledgeBase = {
        _metadata: metadata,
        ecosistema,
        ipads,
        macs,
        aula,
        teacher,
        checklists,
        diagrams
    };

    // Dispatch event
    window.dispatchEvent(new CustomEvent('knowledgeBaseLoaded', {
        detail: { success: true, fallback: true }
    }));

    console.warn('[KnowledgeBase] Loaded in fallback mode (limited content)');
}

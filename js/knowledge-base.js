/**
 * JAMF ASSISTANT - Knowledge Base
 * Base de conocimiento para gestión de dispositivos Apple
 * 
 * ÚLTIMA ACTUALIZACIÓN: 2025-12-23
 * FUENTE: Documentación oficial de Jamf + experiencia de implementación
 */

const KnowledgeBase = {
    // Metadatos de la base de conocimiento
    _metadata: {
        version: '1.0.0',
        lastUpdated: '2025-12-23',
        source: 'Documentación oficial de Jamf (learn.jamf.com)',
        officialDocs: 'https://learn.jamf.com/bundle/jamf-school-documentation/',
        articleCount: 15,
        updateFrequency: 'Manual - Verificar cada trimestre'
    },

    // Guías de iPads
    ipads: {
        enrollment: {
            title: 'Inscribir iPads en Jamf',
            icon: '<i class="ri-tablet-line"></i>',
            tag: 'Configuración',
            time: '10-15 min',
            steps: 8,
            content: `
                <h2><i class="ri-tablet-line"></i> Inscribir iPads en Jamf</h2>
                <div class="info-box">
                    <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
                    <div class="info-content">
                        <h4>Requisito previo</h4>
                        <p>Los iPads deben estar dados de alta en Apple Business Manager y asignados a tu servidor Jamf.</p>
                    </div>
                </div>
                
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Verificar en Apple Business Manager</h4>
                            <div class="step-details">
                                <p>Accede a <code>business.apple.com</code></p>
                                <ul>
                                    <li>Ve a Dispositivos → busca el número de serie</li>
                                    <li>Verifica que esté asignado a tu servidor MDM</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Borrar el iPad (si es necesario)</h4>
                            <div class="step-details">
                                <p>Si el iPad ya fue configurado previamente:</p>
                                <ul>
                                    <li>Ajustes → General → Transferir o Restablecer iPad</li>
                                    <li>Selecciona "Borrar contenidos y ajustes"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Conectar a WiFi</h4>
                            <div class="step-details">
                                <p>Durante el asistente de configuración:</p>
                                <ul>
                                    <li>Conecta a la red WiFi del centro</li>
                                    <li>Espera a que aparezca la pantalla de "Configuración remota"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Aceptar perfil de gestión</h4>
                            <div class="step-details">
                                <p>El iPad mostrará el perfil de tu organización:</p>
                                <ul>
                                    <li>Pulsa "Siguiente" para aceptar</li>
                                    <li>El dispositivo descargará la configuración</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Verificar en Jamf</h4>
                            <div class="step-details">
                                <p>Accede a la consola de Jamf:</p>
                                <ul>
                                    <li>Devices → Mobile Devices → Search</li>
                                    <li>Busca por nombre o número de serie</li>
                                    <li>Debería aparecer como "Managed"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        apps: {
            title: 'Instalar Aplicaciones',
            icon: '<i class="ri-app-store-line"></i>',
            tag: 'Apps',
            time: '5 min',
            steps: 6,
            content: `
                <h2><i class="ri-download-cloud-2-line"></i> Instalar Aplicaciones en iPads</h2>
                
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Verificar licencias en Apple Business Manager</h4>
                            <div class="step-details">
                                <p>Accede a <code>business.apple.com</code> → Apps y Libros</p>
                                <ul>
                                    <li>Busca la app que quieres instalar</li>
                                    <li>Verifica que tengas licencias disponibles</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Añadir app en Jamf</h4>
                            <div class="step-details">
                                <p>En Jamf: <strong>Apps → Mobile Device Apps → + Add</strong></p>
                                <ul>
                                    <li>Busca la app por nombre</li>
                                    <li>Selecciona la versión correcta</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Configurar distribución</h4>
                            <div class="step-details">
                                <ul>
                                    <li><strong>Install Automatically</strong>: Se instala sin intervención</li>
                                    <li><strong>Make Available in Self Service</strong>: El usuario la instala</li>
                                    <li><strong>Available in Teacher</strong>: El profesor decide cuándo instalarla</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Definir Scope</h4>
                            <div class="step-details">
                                <p>Selecciona a quién va dirigida:</p>
                                <ul>
                                    <li>All Mobile Devices</li>
                                    <li>Smart Group específico (ej: "iPads 1º ESO")</li>
                                    <li>Dispositivos individuales</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Guardar y distribuir</h4>
                            <div class="step-details">
                                <p>Pulsa <strong>Save</strong> y la app comenzará a distribuirse.</p>
                                <p>Tiempo estimado: 5-15 minutos dependiendo del tamaño.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        restrictions: {
            title: 'Perfiles de Restricción',
            icon: '<i class="ri-shield-keyhole-line"></i>',
            tag: 'Seguridad',
            time: '15 min',
            steps: 10,
            content: `
                <h2><i class="ri-lock-2-line"></i> Perfiles de Restricción</h2>
                <p>Limita funciones del iPad según la edad o curso del alumnado.</p>
                
                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Importante</h4>
                        <p>Los perfiles de restricción se aplican inmediatamente. Planifica bien antes de desplegar.</p>
                    </div>
                </div>
                
                <h3>Restricciones recomendadas por edad:</h3>
                
                <div class="info-box">
                    <div class="info-content">
                        <h4>Primaria (6-12 años)</h4>
                        <ul>
                            <li><i class="ri-close-circle-line"></i> Safari deshabilitado (usar navegador controlado)</li>
                            <li><i class="ri-close-circle-line"></i> App Store deshabilitado</li>
                            <li><i class="ri-close-circle-line"></i> AirDrop solo para contactos</li>
                            <li><i class="ri-close-circle-line"></i> Cambio de fondo de pantalla bloqueado</li>
                            <li><i class="ri-check-line"></i> Contenido explícito bloqueado</li>
                        </ul>
                    </div>
                </div>
                
                <div class="info-box">
                    <div class="info-content">
                        <h4>ESO (12-16 años)</h4>
                        <ul>
                            <li><i class="ri-check-line"></i> Safari permitido con filtro de contenido</li>
                            <li><i class="ri-close-circle-line"></i> App Store deshabilitado</li>
                            <li><i class="ri-close-circle-line"></i> Contenido explícito bloqueado</li>
                            <li><i class="ri-check-line"></i> AirDrop permitido</li>
                        </ul>
                    </div>
                </div>
                
                <h3>Cómo crear el perfil en Jamf:</h3>
                <p><strong>Configuration Profiles → + New → Mobile Device → Restrictions</strong></p>
            `
        }
    },

    // Guías de Macs
    macs: {
        enrollment: {
            title: 'Inscribir Macs en Jamf',
            icon: '<i class="ri-macbook-line"></i>',
            tag: 'Configuración',
            time: '15 min',
            steps: 10,
            content: `
                <h2><i class="ri-macbook-line"></i> Inscribir Macs en Jamf</h2>
                
                <h3>Método 1: Automated Device Enrollment (Recomendado)</h3>
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Borrar el Mac (si es necesario)</h4>
                            <div class="step-details">
                                <p>Reinicia manteniendo Command + R</p>
                                <ul>
                                    <li>Abre Utilidad de Discos</li>
                                    <li>Borra el disco "Macintosh HD"</li>
                                    <li>Reinstala macOS</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Conectar a Internet</h4>
                            <div class="step-details">
                                <p>Durante el asistente de configuración, conecta a WiFi o Ethernet.</p>
                                <p>Aparecerá la pantalla de "Configuración remota".</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Aceptar gestión</h4>
                            <div class="step-details">
                                <p>El Mac mostrará que será gestionado por tu organización.</p>
                                <ul>
                                    <li>Acepta el perfil MDM</li>
                                    <li>Completa la configuración inicial</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <h3>Método 2: Enrollment manual (URL)</h3>
                <p>Si el Mac no está en Apple Business Manager:</p>
                <ol>
                    <li>Abre Safari en el Mac</li>
                    <li>Ve a: <code>tudominio.jamfcloud.com/enroll</code></li>
                    <li>Inicia sesión con credenciales de Jamf</li>
                    <li>Descarga e instala el perfil MDM</li>
                </ol>
            `
        },
        policies: {
            title: 'Crear Políticas',
            icon: '<i class="ri-settings-4-line"></i>',
            tag: 'Políticas',
            time: '20 min',
            steps: 12,
            content: `
                <h2><i class="ri-settings-4-line"></i> Crear Políticas en Jamf Pro</h2>
                <p>Las políticas automatizan tareas en los Macs: instalar software, ejecutar scripts, etc.</p>
                
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Crear nueva política</h4>
                            <div class="step-details">
                                <p>Computers → Policies → + New</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Configurar Trigger</h4>
                            <div class="step-details">
                                <ul>
                                    <li><strong>Recurring Check-in</strong>: Se ejecuta periódicamente</li>
                                    <li><strong>Login</strong>: Al iniciar sesión</li>
                                    <li><strong>Self Service</strong>: Cuando el usuario lo solicita</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Añadir acciones</h4>
                            <div class="step-details">
                                <ul>
                                    <li>Packages: Instalar software</li>
                                    <li>Scripts: Ejecutar comandos</li>
                                    <li>Printers: Configurar impresoras</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Definir Scope</h4>
                            <div class="step-details">
                                <p>Selecciona los Macs objetivo:</p>
                                <ul>
                                    <li>All Computers</li>
                                    <li>Smart Group (ej: "Macs Profesorado")</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    },

    // Apple Classroom
    classroom: {
        setup: {
            title: 'Configurar Classroom en Jamf',
            icon: '<i class="ri-building-line"></i>',
            tag: 'Configuración',
            time: '20 min',
            steps: 12,
            content: `
                <h2><i class="ri-building-line"></i> Configurar Apple Classroom</h2>
                
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Crear clases en Jamf</h4>
                            <div class="step-details">
                                <p>Users → Classes → + New Class</p>
                                <ul>
                                    <li>Nombre: "1º ESO A", "2º Primaria B", etc.</li>
                                    <li>Asigna el profesor responsable</li>
                                    <li>Añade los alumnos de esa clase</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Instalar Classroom en dispositivos del profesor</h4>
                            <div class="step-details">
                                <p>App Store → Apple Classroom (gratuita)</p>
                                <p>O distribúyela automáticamente desde Jamf.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Verificar requisitos</h4>
                            <div class="step-details">
                                <ul>
                                    <li><i class="ri-check-line"></i> iPads supervisados</li>
                                    <li><i class="ri-check-line"></i> Bluetooth activado</li>
                                    <li><i class="ri-check-line"></i> Misma red WiFi (profesor y alumnos)</li>
                                    <li><i class="ri-check-line"></i> Clases sincronizadas con Jamf</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        troubleshoot: {
            title: 'Solucionar Problemas de Classroom',
            icon: '<i class="ri-tools-line"></i>',
            tag: 'Problemas',
            time: 'Variable',
            content: `
                <h2><i class="ri-tools-line"></i> Problemas comunes de Classroom</h2>
                
                <h3><i class="ri-close-circle-line"></i> "No veo los iPads de mi clase"</h3>
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Verificar Bluetooth</h4>
                            <div class="step-details">
                                <p>Classroom usa Bluetooth para descubrir dispositivos cercanos.</p>
                                <ul>
                                    <li>Comprueba que esté activado en todos los dispositivos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Verificar red WiFi</h4>
                            <div class="step-details">
                                <p>Todos deben estar en la misma red.</p>
                                <ul>
                                    <li>Evita redes con aislamiento de clientes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Forzar sincronización</h4>
                            <div class="step-details">
                                <p>En Jamf, selecciona los iPads y usa "Send Blank Push"</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    },

    // Jamf Teacher
    teacher: {
        setup: {
            title: 'Configurar Jamf Teacher',
            icon: '<i class="ri-presentation-line"></i>',
            tag: 'Guía completa',
            content: `
                <h2><i class="ri-presentation-line"></i> Configurar Jamf Teacher para Profesores</h2>
                
                <div class="info-box success">
                    <div class="info-icon"><i class="ri-check-double-line"></i></div>
                    <div class="info-content">
                        <h4>Esta es la solución para instalar apps bajo demanda</h4>
                        <p>Jamf Teacher permite que los profesores instalen/desinstalen apps en los iPads de su clase sin acceder a la consola de Jamf.</p>
                    </div>
                </div>
                
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Habilitar permisos de profesor en Jamf</h4>
                            <div class="step-details">
                                <p><strong>Devices → Settings → Teacher Permissions</strong></p>
                                <ul>
                                    <li><i class="ri-check-line"></i> Allow teachers to install apps</li>
                                    <li><i class="ri-check-line"></i> Allow teachers to clear passcodes (opcional)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Marcar apps como "Teacher Available"</h4>
                            <div class="step-details">
                                <p><strong>Apps → [App] → Scope → Distribution</strong></p>
                                <ul>
                                    <li>Marca "Available in Teacher"</li>
                                    <li>Esto NO instala la app automáticamente</li>
                                    <li>Solo la hace disponible para el profesor</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Configurar clases</h4>
                            <div class="step-details">
                                <p><strong>Users → Classes</strong></p>
                                <ul>
                                    <li>Crea una clase por cada grupo/aula</li>
                                    <li>Asigna profesor + alumnos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>El profesor accede a Jamf Teacher</h4>
                            <div class="step-details">
                                <p>Dos opciones:</p>
                                <ul>
                                    <li><strong>App Jamf Teacher</strong> - Descarga desde App Store</li>
                                    <li><strong>Portal web</strong>: <code>tudominio.jamfcloud.com/teacher</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Instalar apps bajo demanda</h4>
                            <div class="step-details">
                                <p>El profesor selecciona: Clase → Dispositivos → App → Instalar</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Requisitos</h4>
                        <ul>
                            <li>iPads <strong>supervisados</strong></li>
                            <li>Apps compradas en <strong>Apple Business Manager</strong></li>
                            <li>Necesitas <strong>Jamf School</strong> (no Jamf Pro básico)</li>
                        </ul>
                    </div>
                </div>
            `
        }
    },

    // Checklists
    checklists: {
        newIpad: {
            title: 'Nuevo iPad',
            icon: '<i class="ri-smartphone-line"></i>',
            items: [
                { text: 'Verificar número de serie en Apple Business Manager', done: false },
                { text: 'Comprobar asignación al servidor Jamf', done: false },
                { text: 'Encender y conectar a WiFi', done: false },
                { text: 'Aceptar perfil de gestión remota', done: false },
                { text: 'Verificar que aparece en Jamf como "Managed"', done: false },
                { text: 'Asignar a Smart Group correspondiente', done: false },
                { text: 'Verificar instalación de apps', done: false },
                { text: 'Etiquetar dispositivo físicamente', done: false }
            ]
        },
        newMac: {
            title: 'Nuevo Mac',
            icon: '<i class="ri-macbook-line"></i>',
            items: [
                { text: 'Verificar en Apple Business Manager', done: false },
                { text: 'Borrar disco si tiene datos previos', done: false },
                { text: 'Reinstalar macOS limpio', done: false },
                { text: 'Conectar a red y aceptar gestión', done: false },
                { text: 'Verificar enrollment en Jamf', done: false },
                { text: 'Crear cuenta de usuario local', done: false },
                { text: 'Ejecutar políticas de configuración', done: false },
                { text: 'Instalar software necesario', done: false },
                { text: 'Configurar impresoras', done: false },
                { text: 'Documentar asignación al profesor', done: false }
            ]
        },
        startYear: {
            title: 'Inicio de Curso',
            icon: '<i class="ri-calendar-event-line"></i>',
            items: [
                { text: 'Inventario de todos los dispositivos', done: false },
                { text: 'Verificar carga de baterías', done: false },
                { text: 'Actualizar iPadOS/macOS a última versión', done: false },
                { text: 'Revisar perfiles de restricción por curso', done: false },
                { text: 'Actualizar Smart Groups con nuevos alumnos', done: false },
                { text: 'Crear nuevas clases en Jamf', done: false },
                { text: 'Asignar profesores a clases', done: false },
                { text: 'Distribuir apps necesarias para el curso', done: false },
                { text: 'Verificar Apple Classroom funciona', done: false },
                { text: 'Formar a nuevos profesores en Jamf Teacher', done: false },
                { text: 'Probar Self Service en Macs', done: false },
                { text: 'Verificar conectividad WiFi en todas las aulas', done: false },
                { text: 'Preparar iPads de repuesto', done: false },
                { text: 'Documentar incidencias del año anterior', done: false },
                { text: 'Backup de configuraciones actuales', done: false }
            ]
        }
    }
};

// Export for use in other modules
window.KnowledgeBase = KnowledgeBase;

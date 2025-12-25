/**
 * JAMF ASSISTANT - Knowledge Base Macs
 * Guias de gestion de Macs
 *
 * @module KnowledgeMacs
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 */

/**
 * @typedef {Object} GuideContent
 * @property {string} title - Title of the guide
 * @property {string} icon - HTML icon string
 * @property {string} tag - Category tag
 * @property {string} time - Estimated reading time
 * @property {number} [steps] - Number of steps
 * @property {string} content - HTML content
 */

/**
 * Mac enrollment guide
 * @type {GuideContent}
 */
export const enrollment = {
    title: 'Inscribir Macs en Jamf',
    icon: '<i class="ri-macbook-line"></i>',
    tag: 'Configuracion',
    time: '15 min',
    steps: 10,
    content: `
        <h2><i class="ri-macbook-line"></i> Inscribir Macs en Jamf</h2>

        <h3>Metodo 1: Automated Device Enrollment (Recomendado)</h3>
        <p>Este metodo funciona si el Mac esta dado de alta en Apple School Manager.</p>

        <div class="steps-container">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h4>Verificar en Apple School Manager</h4>
                    <div class="step-details">
                        <p>Accede a <code>school.apple.com</code> -> Dispositivos</p>
                        <ul>
                            <li>Busca el numero de serie del Mac</li>
                            <li>Verifica que este asignado a tu servidor Jamf</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>Borrar el Mac (si es necesario)</h4>
                    <div class="step-details">
                        <p>Si el Mac tiene datos previos:</p>
                        <ul>
                            <li>Reinicia manteniendo Command + R (o Command + Option + R para Macs con chip Apple)</li>
                            <li>Abre Utilidad de Discos</li>
                            <li>Borra el disco "Macintosh HD"</li>
                            <li>Reinstala macOS</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Conectar a Internet</h4>
                    <div class="step-details">
                        <p>Durante el asistente de configuracion:</p>
                        <ul>
                            <li>Conecta a WiFi o Ethernet</li>
                            <li>Espera unos segundos</li>
                            <li>Aparecera la pantalla de "Configuracion remota" mostrando el nombre de tu centro</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>Aceptar gestion</h4>
                    <div class="step-details">
                        <p>El Mac mostrara que sera gestionado por tu organizacion</p>
                        <ul>
                            <li>Acepta el perfil MDM</li>
                            <li>Completa la configuracion inicial (crear cuenta de usuario para el profesor)</li>
                            <li>El Mac descargara automaticamente las politicas y software configurados en Jamf</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <h3>Metodo 2: Enrollment manual (URL)</h3>
        <p>Si el Mac NO esta en Apple School Manager (por ejemplo, Macs antiguos comprados antes de configurar ASM):</p>
        <ol>
            <li>Abre Safari en el Mac</li>
            <li>Ve a: <code>tudominio.jamfcloud.com/enroll</code></li>
            <li>Inicia sesion con credenciales de Jamf (usuario creado para enrollment)</li>
            <li>Descarga e instala el perfil MDM cuando te lo solicite</li>
            <li>Ve a Ajustes del Sistema -> Privacidad y seguridad -> Perfiles</li>
            <li>Verifica que el perfil de gestion este instalado</li>
        </ol>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-alert-line"></i></div>
            <div class="info-content">
                <h4>Diferencia importante</h4>
                <ul>
                    <li><strong>Automated Enrollment (desde ASM):</strong> El perfil MDM no se puede eliminar. Mayor control.</li>
                    <li><strong>Enrollment manual:</strong> El usuario puede eliminar el perfil MDM. Menor control.</li>
                </ul>
                <p><strong>Recomendacion:</strong> Siempre que sea posible, compra los Macs a traves de proveedores DEP para que aparezcan en ASM.</p>
            </div>
        </div>
    `
};

/**
 * Mac policies guide
 * @type {GuideContent}
 */
export const policies = {
    title: 'Crear Politicas',
    icon: '<i class="ri-settings-4-line"></i>',
    tag: 'Politicas',
    time: '20 min',
    steps: 12,
    content: `
        <h2><i class="ri-settings-4-line"></i> Crear Politicas en Jamf Pro</h2>
        <p>Las politicas automatizan tareas en los Macs: instalar software, ejecutar scripts, configurar ajustes, etc.</p>

        <div class="steps-container">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h4>Crear nueva politica</h4>
                    <div class="step-details">
                        <p>En Jamf Pro: <strong>Computers -> Policies -> + New</strong></p>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>Configurar Trigger (cuando se ejecuta)</h4>
                    <div class="step-details">
                        <ul>
                            <li><strong>Recurring Check-in</strong>: Se ejecuta periodicamente (cada 15 min, cada hora, etc.). Ideal para mantener software actualizado.</li>
                            <li><strong>Login</strong>: Al iniciar sesion el usuario. Ideal para configuraciones de usuario.</li>
                            <li><strong>Enrollment Complete</strong>: Una sola vez al inscribir el Mac. Ideal para configuracion inicial.</li>
                            <li><strong>Self Service</strong>: Cuando el profesor lo solicita desde la app Self Service. Ideal para software opcional.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Anadir acciones (que hace la politica)</h4>
                    <div class="step-details">
                        <ul>
                            <li><strong>Packages</strong>: Instalar software (.pkg, .dmg). Ejemplo: Microsoft Office, Google Chrome.</li>
                            <li><strong>Scripts</strong>: Ejecutar comandos personalizados. Ejemplo: configurar ajustes del sistema.</li>
                            <li><strong>Printers</strong>: Configurar impresoras automaticamente.</li>
                            <li><strong>Maintenance</strong>: Reparar permisos, actualizar inventario, etc.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>Definir Scope (a que Macs se aplica)</h4>
                    <div class="step-details">
                        <p>Selecciona los Macs objetivo:</p>
                        <ul>
                            <li><strong>All Computers</strong>: Todos los Macs del centro</li>
                            <li><strong>Smart Group</strong>: Por ejemplo "Macs Profesorado", "Macs Sala de Profesores", "Macs Biblioteca"</li>
                            <li><strong>Dispositivos especificos</strong>: Macs individuales</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">5</div>
                <div class="step-content">
                    <h4>Guardar y probar</h4>
                    <div class="step-details">
                        <p>Guarda la politica y pruebala en un Mac de prueba antes de desplegarla a todos</p>
                        <ul>
                            <li>Ve al Mac -> Abre Terminal</li>
                            <li>Ejecuta: <code>sudo jamf policy</code></li>
                            <li>Verifica que la politica se ejecuta correctamente</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <h3>Ejemplos de politicas utiles para un centro educativo:</h3>
        <div class="info-box">
            <div class="info-content">
                <h4>Politica: Instalar Microsoft Office en todos los Macs de profesores</h4>
                <ul>
                    <li><strong>Trigger:</strong> Recurring Check-in (Once per computer)</li>
                    <li><strong>Package:</strong> Microsoft Office.pkg</li>
                    <li><strong>Scope:</strong> Smart Group "Macs Profesorado"</li>
                    <li><strong>Resultado:</strong> Todos los Macs de profesores tendran Office instalado automaticamente</li>
                </ul>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Politica: Configurar impresoras automaticamente</h4>
                <ul>
                    <li><strong>Trigger:</strong> Login</li>
                    <li><strong>Printers:</strong> Anadir las impresoras del centro</li>
                    <li><strong>Scope:</strong> All Computers</li>
                    <li><strong>Resultado:</strong> Al iniciar sesion, el profesor ya tiene las impresoras configuradas</li>
                </ul>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Politica: Software opcional en Self Service</h4>
                <ul>
                    <li><strong>Trigger:</strong> Self Service</li>
                    <li><strong>Package:</strong> Adobe Acrobat, Audacity, etc.</li>
                    <li><strong>Scope:</strong> Smart Group "Macs Profesorado"</li>
                    <li><strong>Resultado:</strong> Los profesores pueden instalar software opcional cuando lo necesiten, sin llamar a IT</li>
                </ul>
            </div>
        </div>
    `
};

/**
 * Complete macs module as a combined object for backwards compatibility
 * @type {Object}
 */
export const macs = {
    enrollment,
    policies
};

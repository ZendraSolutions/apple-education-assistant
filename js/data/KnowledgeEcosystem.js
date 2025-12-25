/**
 * JAMF ASSISTANT - Knowledge Base Ecosystem
 * Documentacion del ecosistema Apple Education
 *
 * @module KnowledgeEcosystem
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 */

/**
 * @typedef {Object} GuideContent
 * @property {string} title - Title of the guide
 * @property {string} icon - HTML icon string
 * @property {string} tag - Category tag
 * @property {string} time - Estimated reading time
 * @property {string} content - HTML content
 */

/**
 * Overview of the Apple Education ecosystem
 * @type {GuideContent}
 */
export const overview = {
    title: '¿Como funciona el ecosistema Apple Education?',
    icon: '<i class="ri-settings-3-line"></i>',
    tag: 'Fundamentos',
    time: '10 min',
    content: `
        <h2><i class="ri-settings-3-line"></i> ¿Como funciona el ecosistema Apple Education?</h2>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
            <div class="info-content">
                <h4>El flujo completo</h4>
                <p>Apple School Manager -> Jamf School -> Dispositivos (iPads/Macs) -> App Aula</p>
            </div>
        </div>

        <h3>1. Apple School Manager (ASM) - El centro de todo</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Es el portal de Apple para centros educativos</strong></p>
                <ul>
                    <li><i class="ri-check-line"></i> Aqui se dan de alta todos los dispositivos (iPads y Macs)</li>
                    <li><i class="ri-check-line"></i> Aqui se compran las apps y se gestionan las licencias</li>
                    <li><i class="ri-check-line"></i> Aqui se crean las clases y se importan los usuarios (alumnos y profesores)</li>
                    <li><i class="ri-check-line"></i> Todo lo que hagas aqui se sincroniza automaticamente con Jamf</li>
                </ul>
                <p><strong>Acceso:</strong> <code>school.apple.com</code></p>
            </div>
        </div>

        <h3>2. Jamf School - El sistema de gestion (MDM)</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Es el "cerebro" que controla los dispositivos</strong></p>
                <ul>
                    <li><i class="ri-check-line"></i> Recibe automaticamente los dispositivos que estan en ASM</li>
                    <li><i class="ri-check-line"></i> Distribuye las apps a los iPads y Macs</li>
                    <li><i class="ri-check-line"></i> Aplica restricciones (que pueden o no pueden hacer los alumnos)</li>
                    <li><i class="ri-check-line"></i> Sincroniza las clases creadas en ASM</li>
                    <li><i class="ri-check-line"></i> Permite a los profesores usar Jamf Teacher</li>
                </ul>
                <p><strong>Usuarios:</strong> Personal IT y administradores del centro</p>
            </div>
        </div>

        <h3>3. Los dispositivos</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>iPads (alumnos) y Macs (profesores)</strong></p>
                <ul>
                    <li><i class="ri-check-line"></i> Se configuran automaticamente al encenderlos por primera vez</li>
                    <li><i class="ri-check-line"></i> Reciben las apps, restricciones y configuraciones desde Jamf</li>
                    <li><i class="ri-check-line"></i> No necesitan que el alumno/profesor haga nada tecnico</li>
                </ul>
            </div>
        </div>

        <h3>4. App Aula (Apple Classroom)</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>La herramienta diaria del profesor</strong></p>
                <ul>
                    <li><i class="ri-check-line"></i> Instalada en el iPad o Mac del profesor</li>
                    <li><i class="ri-check-line"></i> Muestra todos los iPads de su clase automaticamente</li>
                    <li><i class="ri-check-line"></i> Permite ver las pantallas de los alumnos</li>
                    <li><i class="ri-check-line"></i> Permite bloquear apps, abrir webs en todos los iPads, etc.</li>
                    <li><i class="ri-check-line"></i> Las clases vienen automaticamente desde ASM (no se crean en Jamf)</li>
                </ul>
            </div>
        </div>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-alert-line"></i></div>
            <div class="info-content">
                <h4>Importante para IT</h4>
                <p><strong>NO crear las clases en Jamf manualmente.</strong> Las clases se crean en Apple School Manager y se sincronizan automaticamente. Si las creas en Jamf, habra duplicados y confusion.</p>
            </div>
        </div>

        <h3>Ejemplo practico: Nuevo iPad para un alumno</h3>
        <ol>
            <li><strong>En ASM:</strong> El iPad aparece automaticamente al comprarlo (si el proveedor esta en el programa DEP)</li>
            <li><strong>En ASM:</strong> Se asigna el iPad al servidor de Jamf School</li>
            <li><strong>Enciendes el iPad:</strong> Se conecta a WiFi y automaticamente se configura con Jamf</li>
            <li><strong>En Jamf:</strong> El iPad recibe las apps y restricciones segun su grupo (por ejemplo, "1 ESO")</li>
            <li><strong>En App Aula:</strong> El profesor ve automaticamente ese iPad en su clase</li>
        </ol>
    `
};

/**
 * Apple School Manager guide
 * @type {GuideContent}
 */
export const asm = {
    title: 'Apple School Manager (ASM)',
    icon: '<i class="ri-apple-line"></i>',
    tag: 'Guia completa',
    time: '15 min',
    content: `
        <h2><i class="ri-apple-line"></i> Apple School Manager (ASM)</h2>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-apple-line"></i></div>
            <div class="info-content">
                <h4>¿Que es Apple School Manager?</h4>
                <p>Es el portal de Apple disenado especificamente para centros educativos. Desde aqui gestionas dispositivos, apps, usuarios y clases.</p>
                <p><strong>Acceso:</strong> <a href="https://school.apple.com" target="_blank">school.apple.com</a></p>
            </div>
        </div>

        <h3>¿Que se hace en Apple School Manager?</h3>

        <div class="steps-container">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h4>Gestion de dispositivos</h4>
                    <div class="step-details">
                        <p><strong>Dispositivos -> Ver todos los dispositivos</strong></p>
                        <ul>
                            <li>Ver todos los iPads y Macs del centro</li>
                            <li>Verificar que estan asignados al servidor de Jamf School</li>
                            <li>Cuando compras dispositivos nuevos, aparecen automaticamente aqui (si el proveedor participa en DEP)</li>
                        </ul>
                        <div class="info-box warning">
                            <div class="info-content">
                                <p><strong>Importante:</strong> Cuando compres iPads o Macs, asegurate de que el proveedor este en el programa DEP (Device Enrollment Program). Asi los dispositivos apareceran automaticamente en ASM.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>Compra y gestion de apps</h4>
                    <div class="step-details">
                        <p><strong>Apps y libros -> Ver todas las apps</strong></p>
                        <ul>
                            <li>Comprar apps (gratis o de pago) para el centro</li>
                            <li>Ver cuantas licencias tienes de cada app</li>
                            <li>Las licencias se asignan automaticamente a los dispositivos desde Jamf</li>
                        </ul>
                        <div class="info-box">
                            <div class="info-content">
                                <p><strong>Ejemplo:</strong> Si compras 100 licencias de Keynote, esas 100 licencias estaran disponibles en Jamf para instalar en los iPads que tu decidas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Gestion de usuarios (alumnos y profesores)</h4>
                    <div class="step-details">
                        <p><strong>Personas -> Ver todas las personas</strong></p>
                        <ul>
                            <li>Crear Apple IDs gestionados para alumnos y profesores</li>
                            <li>Importar usuarios desde el sistema de gestion del centro (CSV o integracion SFTP)</li>
                            <li>Cada alumno y profesor tiene su propio Apple ID del centro (ej: <code>alumno@tucentro.edu</code>)</li>
                        </ul>
                        <div class="info-box">
                            <div class="info-content">
                                <p><strong>Ventaja:</strong> Los Apple IDs gestionados permiten que los alumnos usen iCloud, pero tu mantienes el control (puedes resetear contrasenas, limitar almacenamiento, etc.)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>Gestion de clases</h4>
                    <div class="step-details">
                        <p><strong>Clases -> Ver todas las clases</strong></p>
                        <ul>
                            <li>Crear clases (ej: "1 ESO A", "2 Primaria B")</li>
                            <li>Asignar profesores a cada clase</li>
                            <li>Asignar alumnos a cada clase</li>
                            <li><strong>Estas clases se sincronizan automaticamente con Jamf y con la app Aula</strong></li>
                        </ul>
                        <div class="info-box warning">
                            <div class="info-content">
                                <p><strong>MUY IMPORTANTE:</strong> Las clases SOLO se crean aqui en ASM. NO las crees manualmente en Jamf. La sincronizacion es automatica.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">5</div>
                <div class="step-content">
                    <h4>Conexion con Jamf School (MDM)</h4>
                    <div class="step-details">
                        <p><strong>Ajustes -> Gestion de dispositivos</strong></p>
                        <ul>
                            <li>Aqui vinculaste tu servidor de Jamf School con ASM</li>
                            <li>Todos los dispositivos asignados a Jamf se configuran automaticamente</li>
                            <li>No necesitas tocar esta configuracion una vez hecha</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <h3>Tareas frecuentes en ASM</h3>
        <div class="info-box">
            <div class="info-content">
                <h4>Inicio de curso</h4>
                <ul>
                    <li>Importar nuevos alumnos y profesores</li>
                    <li>Crear las nuevas clases del curso</li>
                    <li>Verificar que los nuevos dispositivos comprados aparecen y estan asignados a Jamf</li>
                    <li>Comprar licencias de apps nuevas si es necesario</li>
                </ul>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Durante el curso</h4>
                <ul>
                    <li>Anadir alumnos nuevos que se incorporan</li>
                    <li>Dar de baja alumnos que se van</li>
                    <li>Resetear contrasenas de Apple IDs gestionados si un alumno la olvida</li>
                    <li>Verificar que los dispositivos nuevos aparecen correctamente</li>
                </ul>
            </div>
        </div>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-alert-line"></i></div>
            <div class="info-content">
                <h4>Permisos de acceso</h4>
                <p>Normalmente solo el coordinador IT o el administrador del centro tienen acceso a ASM. Los profesores NO necesitan acceder aqui, ellos usan la app Aula y Jamf Teacher.</p>
            </div>
        </div>

        <h3>Diferencias entre ASM y Apple Business Manager</h3>
        <div class="info-box">
            <div class="info-content">
                <ul>
                    <li><strong>Apple School Manager:</strong> Para centros educativos. Incluye gestion de clases, Apple IDs gestionados para menores, compra con descuentos educativos.</li>
                    <li><strong>Apple Business Manager:</strong> Para empresas. No tiene gestion de clases ni Apple IDs para menores.</li>
                </ul>
                <p><strong>Tu centro usa Apple School Manager.</strong></p>
            </div>
        </div>
    `
};

/**
 * Complete ecosistema module as a combined object for backwards compatibility
 * @type {Object}
 */
export const ecosistema = {
    overview,
    asm
};

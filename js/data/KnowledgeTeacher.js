/**
 * JAMF ASSISTANT - Knowledge Base Jamf Teacher
 * Guias de Jamf Teacher para profesores
 *
 * @module KnowledgeTeacher
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 */

/**
 * @typedef {Object} GuideContent
 * @property {string} title - Title of the guide
 * @property {string} icon - HTML icon string
 * @property {string} tag - Category tag
 * @property {string} content - HTML content
 */

/**
 * Jamf Teacher setup guide
 * @type {GuideContent}
 */
export const setup = {
    title: 'Configurar Jamf Teacher',
    icon: '<i class="ri-presentation-line"></i>',
    tag: 'Guia completa',
    content: `
        <h2><i class="ri-presentation-line"></i> Configurar Jamf Teacher para Profesores</h2>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-check-double-line"></i></div>
            <div class="info-content">
                <h4>Que es Jamf Teacher?</h4>
                <p>Es una herramienta que permite a los profesores instalar y desinstalar apps en los iPads de su clase bajo demanda, sin necesitar acceso a la consola de Jamf ni llamar a IT.</p>
                <p><strong>Diferencia con la app Aula:</strong> La app Aula gestiona lo que pasa DURANTE la clase (ver pantallas, bloquear, etc.). Jamf Teacher permite instalar/desinstalar apps cuando el profesor lo necesita.</p>
            </div>
        </div>

        <div class="steps-container">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h4>Habilitar permisos de profesor en Jamf (para IT)</h4>
                    <div class="step-details">
                        <p>En Jamf School: <strong>Devices -> Settings -> Teacher Permissions</strong></p>
                        <ul>
                            <li><i class="ri-check-line"></i> Allow teachers to install apps</li>
                            <li><i class="ri-check-line"></i> Allow teachers to remove apps</li>
                            <li><i class="ri-check-line"></i> Allow teachers to clear passcodes (opcional, util si un alumno olvida su codigo)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>Marcar apps como "Teacher Available" (para IT)</h4>
                    <div class="step-details">
                        <p>En Jamf School: <strong>Apps -> [App] -> Scope -> Distribution</strong></p>
                        <ul>
                            <li>Marca "Available in Teacher"</li>
                            <li>Esto NO instala la app automaticamente</li>
                            <li>Solo la hace disponible para que el profesor pueda instalarla cuando quiera</li>
                        </ul>
                        <div class="info-box">
                            <div class="info-content">
                                <p><strong>Ejemplo:</strong> Si "GarageBand" esta marcada como "Available in Teacher", el profesor de Musica puede instalarla en los iPads de su clase solo durante sus clases, y desinstalearla despues para liberar espacio.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Configurar clases (para IT)</h4>
                    <div class="step-details">
                        <p>Las clases deben estar creadas en Apple School Manager y sincronizadas con Jamf.</p>
                        <ul>
                            <li>Verifica en Jamf: <strong>Users -> Classes</strong></li>
                            <li>Cada clase debe tener asignado el profesor y los alumnos correspondientes</li>
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
                            <li><strong>App Jamf Teacher (recomendada):</strong> Descarga desde el App Store en tu iPad o Mac</li>
                            <li><strong>Portal web:</strong> Accede a <code>tudominio.jamfschool.com/teacher</code> desde cualquier navegador</li>
                        </ul>
                        <p>Inicia sesion con tus credenciales del centro (las mismas que para Apple School Manager o el correo del centro).</p>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">5</div>
                <div class="step-content">
                    <h4>Instalar apps bajo demanda (para profesores)</h4>
                    <div class="step-details">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Abre Jamf Teacher</li>
                            <li>Selecciona tu clase (ej: "1 ESO A - Tecnologia")</li>
                            <li>Selecciona los iPads donde quieres instalar la app (todos, o solo algunos)</li>
                            <li>Toca "Apps" -> "Instalar app"</li>
                            <li>Selecciona la app (solo veras las apps marcadas como "Teacher Available" por IT)</li>
                            <li>La app se instalara en unos minutos</li>
                        </ol>
                        <p><strong>Para desinstalar:</strong> Mismos pasos, pero selecciona "Desinstalar app"</p>
                    </div>
                </div>
            </div>
        </div>

        <h3>Casos de uso practicos</h3>
        <div class="info-box">
            <div class="info-content">
                <h4>Profesor de Musica</h4>
                <p>Instala GarageBand solo durante sus clases de musica. Al terminar la unidad, desinstala la app para liberar espacio en los iPads (las apps de musica ocupan mucho).</p>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Profesor de Ciencias</h4>
                <p>Instala una app especifica de Quimica ("Elementos - Tabla Periodica") solo durante el tema de Quimica. No es necesario que la tengan todo el curso.</p>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Profesor de Ingles</h4>
                <p>Instala una app de practica de pronunciacion ("Elsa Speak") solo para un grupo reducido de alumnos que necesitan refuerzo, no para toda la clase.</p>
            </div>
        </div>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-alert-line"></i></div>
            <div class="info-content">
                <h4>Requisitos</h4>
                <ul>
                    <li>iPads <strong>supervisados</strong> (configurados desde ASM + Jamf)</li>
                    <li>Apps compradas en <strong>Apple School Manager</strong> (debes tener licencias disponibles)</li>
                    <li>Necesitas <strong>Jamf School</strong> (no Jamf Pro basico)</li>
                    <li>Las apps deben estar marcadas como "Teacher Available" por IT</li>
                </ul>
            </div>
        </div>
    `
};

/**
 * Complete teacher module as a combined object for backwards compatibility
 * @type {Object}
 */
export const teacher = {
    setup
};

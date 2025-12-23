/**
 * JAMF ASSISTANT - Knowledge Base
 * Base de conocimiento para gestión de dispositivos Apple en entorno educativo
 *
 * ÚLTIMA ACTUALIZACIÓN: 2025-12-24
 * FUENTE: Documentación oficial de Jamf + experiencia de implementación
 * ENFOQUE: Apple School Manager + Jamf School + App Aula
 */

const KnowledgeBase = {
    // Metadatos de la base de conocimiento
    _metadata: {
        version: '2.0.0',
        lastUpdated: '2025-12-24',
        source: 'Documentación oficial de Jamf (learn.jamf.com)',
        officialDocs: 'https://learn.jamf.com/bundle/jamf-school-documentation/',
        articleCount: 22,
        updateFrequency: 'Manual - Verificar cada trimestre',
        ecosystem: 'Apple School Manager + Jamf School + App Aula'
    },

    // Ecosistema Apple Education
    ecosistema: {
        overview: {
            title: '¿Cómo funciona el ecosistema Apple Education?',
            icon: '<i class="ri-settings-3-line"></i>',
            tag: 'Fundamentos',
            time: '10 min',
            content: `
                <h2><i class="ri-settings-3-line"></i> ¿Cómo funciona el ecosistema Apple Education?</h2>

                <div class="info-box success">
                    <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
                    <div class="info-content">
                        <h4>El flujo completo</h4>
                        <p>Apple School Manager → Jamf School → Dispositivos (iPads/Macs) → App Aula</p>
                    </div>
                </div>

                <h3>1. Apple School Manager (ASM) - El centro de todo</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Es el portal de Apple para centros educativos</strong></p>
                        <ul>
                            <li><i class="ri-check-line"></i> Aquí se dan de alta todos los dispositivos (iPads y Macs)</li>
                            <li><i class="ri-check-line"></i> Aquí se compran las apps y se gestionan las licencias</li>
                            <li><i class="ri-check-line"></i> Aquí se crean las clases y se importan los usuarios (alumnos y profesores)</li>
                            <li><i class="ri-check-line"></i> Todo lo que hagas aquí se sincroniza automáticamente con Jamf</li>
                        </ul>
                        <p><strong>Acceso:</strong> <code>school.apple.com</code></p>
                    </div>
                </div>

                <h3>2. Jamf School - El sistema de gestión (MDM)</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Es el "cerebro" que controla los dispositivos</strong></p>
                        <ul>
                            <li><i class="ri-check-line"></i> Recibe automáticamente los dispositivos que están en ASM</li>
                            <li><i class="ri-check-line"></i> Distribuye las apps a los iPads y Macs</li>
                            <li><i class="ri-check-line"></i> Aplica restricciones (qué pueden o no pueden hacer los alumnos)</li>
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
                            <li><i class="ri-check-line"></i> Se configuran automáticamente al encenderlos por primera vez</li>
                            <li><i class="ri-check-line"></i> Reciben las apps, restricciones y configuraciones desde Jamf</li>
                            <li><i class="ri-check-line"></i> No necesitan que el alumno/profesor haga nada técnico</li>
                        </ul>
                    </div>
                </div>

                <h3>4. App Aula (Apple Classroom)</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>La herramienta diaria del profesor</strong></p>
                        <ul>
                            <li><i class="ri-check-line"></i> Instalada en el iPad o Mac del profesor</li>
                            <li><i class="ri-check-line"></i> Muestra todos los iPads de su clase automáticamente</li>
                            <li><i class="ri-check-line"></i> Permite ver las pantallas de los alumnos</li>
                            <li><i class="ri-check-line"></i> Permite bloquear apps, abrir webs en todos los iPads, etc.</li>
                            <li><i class="ri-check-line"></i> Las clases vienen automáticamente desde ASM (no se crean en Jamf)</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Importante para IT</h4>
                        <p><strong>NO crear las clases en Jamf manualmente.</strong> Las clases se crean en Apple School Manager y se sincronizan automáticamente. Si las creas en Jamf, habrá duplicados y confusión.</p>
                    </div>
                </div>

                <h3>Ejemplo práctico: Nuevo iPad para un alumno</h3>
                <ol>
                    <li><strong>En ASM:</strong> El iPad aparece automáticamente al comprarlo (si el proveedor está en el programa DEP)</li>
                    <li><strong>En ASM:</strong> Se asigna el iPad al servidor de Jamf School</li>
                    <li><strong>Enciendes el iPad:</strong> Se conecta a WiFi y automáticamente se configura con Jamf</li>
                    <li><strong>En Jamf:</strong> El iPad recibe las apps y restricciones según su grupo (por ejemplo, "1º ESO")</li>
                    <li><strong>En App Aula:</strong> El profesor ve automáticamente ese iPad en su clase</li>
                </ol>
            `
        },
        asm: {
            title: 'Apple School Manager (ASM)',
            icon: '<i class="ri-apple-line"></i>',
            tag: 'Guía completa',
            time: '15 min',
            content: `
                <h2><i class="ri-apple-line"></i> Apple School Manager (ASM)</h2>

                <div class="info-box success">
                    <div class="info-icon"><i class="ri-apple-line"></i></div>
                    <div class="info-content">
                        <h4>¿Qué es Apple School Manager?</h4>
                        <p>Es el portal de Apple diseñado específicamente para centros educativos. Desde aquí gestionas dispositivos, apps, usuarios y clases.</p>
                        <p><strong>Acceso:</strong> <a href="https://school.apple.com" target="_blank">school.apple.com</a></p>
                    </div>
                </div>

                <h3>¿Qué se hace en Apple School Manager?</h3>

                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Gestión de dispositivos</h4>
                            <div class="step-details">
                                <p><strong>Dispositivos → Ver todos los dispositivos</strong></p>
                                <ul>
                                    <li>Ver todos los iPads y Macs del centro</li>
                                    <li>Verificar que están asignados al servidor de Jamf School</li>
                                    <li>Cuando compras dispositivos nuevos, aparecen automáticamente aquí (si el proveedor participa en DEP)</li>
                                </ul>
                                <div class="info-box warning">
                                    <div class="info-content">
                                        <p><strong>Importante:</strong> Cuando compres iPads o Macs, asegúrate de que el proveedor esté en el programa DEP (Device Enrollment Program). Así los dispositivos aparecerán automáticamente en ASM.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Compra y gestión de apps</h4>
                            <div class="step-details">
                                <p><strong>Apps y libros → Ver todas las apps</strong></p>
                                <ul>
                                    <li>Comprar apps (gratis o de pago) para el centro</li>
                                    <li>Ver cuántas licencias tienes de cada app</li>
                                    <li>Las licencias se asignan automáticamente a los dispositivos desde Jamf</li>
                                </ul>
                                <div class="info-box">
                                    <div class="info-content">
                                        <p><strong>Ejemplo:</strong> Si compras 100 licencias de Keynote, esas 100 licencias estarán disponibles en Jamf para instalar en los iPads que tú decidas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Gestión de usuarios (alumnos y profesores)</h4>
                            <div class="step-details">
                                <p><strong>Personas → Ver todas las personas</strong></p>
                                <ul>
                                    <li>Crear Apple IDs gestionados para alumnos y profesores</li>
                                    <li>Importar usuarios desde el sistema de gestión del centro (CSV o integración SFTP)</li>
                                    <li>Cada alumno y profesor tiene su propio Apple ID del centro (ej: <code>alumno@tucentro.edu</code>)</li>
                                </ul>
                                <div class="info-box">
                                    <div class="info-content">
                                        <p><strong>Ventaja:</strong> Los Apple IDs gestionados permiten que los alumnos usen iCloud, pero tú mantienes el control (puedes resetear contraseñas, limitar almacenamiento, etc.)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Gestión de clases</h4>
                            <div class="step-details">
                                <p><strong>Clases → Ver todas las clases</strong></p>
                                <ul>
                                    <li>Crear clases (ej: "1º ESO A", "2º Primaria B")</li>
                                    <li>Asignar profesores a cada clase</li>
                                    <li>Asignar alumnos a cada clase</li>
                                    <li><strong>Estas clases se sincronizan automáticamente con Jamf y con la app Aula</strong></li>
                                </ul>
                                <div class="info-box warning">
                                    <div class="info-content">
                                        <p><strong>MUY IMPORTANTE:</strong> Las clases SOLO se crean aquí en ASM. NO las crees manualmente en Jamf. La sincronización es automática.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Conexión con Jamf School (MDM)</h4>
                            <div class="step-details">
                                <p><strong>Ajustes → Gestión de dispositivos</strong></p>
                                <ul>
                                    <li>Aquí vinculaste tu servidor de Jamf School con ASM</li>
                                    <li>Todos los dispositivos asignados a Jamf se configuran automáticamente</li>
                                    <li>No necesitas tocar esta configuración una vez hecha</li>
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
                            <li>Verificar que los nuevos dispositivos comprados aparecen y están asignados a Jamf</li>
                            <li>Comprar licencias de apps nuevas si es necesario</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Durante el curso</h4>
                        <ul>
                            <li>Añadir alumnos nuevos que se incorporan</li>
                            <li>Dar de baja alumnos que se van</li>
                            <li>Resetear contraseñas de Apple IDs gestionados si un alumno la olvida</li>
                            <li>Verificar que los dispositivos nuevos aparecen correctamente</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Permisos de acceso</h4>
                        <p>Normalmente solo el coordinador IT o el administrador del centro tienen acceso a ASM. Los profesores NO necesitan acceder aquí, ellos usan la app Aula y Jamf Teacher.</p>
                    </div>
                </div>

                <h3>Diferencias entre ASM y Apple Business Manager</h3>
                <div class="info-box">
                    <div class="info-content">
                        <ul>
                            <li><strong>Apple School Manager:</strong> Para centros educativos. Incluye gestión de clases, Apple IDs gestionados para menores, compra con descuentos educativos.</li>
                            <li><strong>Apple Business Manager:</strong> Para empresas. No tiene gestión de clases ni Apple IDs para menores.</li>
                        </ul>
                        <p><strong>Tu centro usa Apple School Manager.</strong></p>
                    </div>
                </div>
            `
        }
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
                        <p>Los iPads deben estar dados de alta en Apple School Manager y asignados a tu servidor Jamf.</p>
                    </div>
                </div>

                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Verificar en Apple School Manager</h4>
                            <div class="step-details">
                                <p>Accede a <code>school.apple.com</code></p>
                                <ul>
                                    <li>Ve a Dispositivos → busca el número de serie del iPad</li>
                                    <li>Verifica que esté asignado a tu servidor MDM (Jamf School)</li>
                                    <li>Si no aparece, contacta con tu proveedor para que lo añada al programa DEP</li>
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
                                    <li>Espera a que el iPad se reinicie</li>
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
                                    <li>Espera unos segundos mientras el iPad se comunica con Apple</li>
                                    <li>Aparecerá automáticamente la pantalla de "Configuración remota"</li>
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
                                    <li>Muestra el nombre de tu centro educativo</li>
                                    <li>Pulsa "Siguiente" para aceptar</li>
                                    <li>El dispositivo descargará automáticamente la configuración desde Jamf</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Completar configuración</h4>
                            <div class="step-details">
                                <p>Continúa el asistente de configuración:</p>
                                <ul>
                                    <li>El iPad se configurará automáticamente con las apps y restricciones</li>
                                    <li>Puede tardar 5-15 minutos en instalarse todo el software</li>
                                    <li>No es necesario que el alumno inicie sesión con Apple ID si usas configuración compartida</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">6</div>
                        <div class="step-content">
                            <h4>Verificar en Jamf</h4>
                            <div class="step-details">
                                <p>Accede a la consola de Jamf School:</p>
                                <ul>
                                    <li>Devices → Mobile Devices → Search</li>
                                    <li>Busca por nombre o número de serie</li>
                                    <li>Debería aparecer como "Managed" (Gestionado)</li>
                                    <li>Verifica que esté en el grupo correcto (ej: "1º ESO")</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Si el iPad no muestra "Configuración remota"</h4>
                        <p>Posibles causas:</p>
                        <ul>
                            <li>No está dado de alta en Apple School Manager</li>
                            <li>No está asignado al servidor de Jamf en ASM</li>
                            <li>El proveedor no lo añadió al programa DEP</li>
                        </ul>
                        <p>Solución: Verifica en <code>school.apple.com</code> → Dispositivos</p>
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
                            <h4>Verificar licencias en Apple School Manager</h4>
                            <div class="step-details">
                                <p>Accede a <code>school.apple.com</code> → Apps y libros</p>
                                <ul>
                                    <li>Busca la app que quieres instalar</li>
                                    <li>Verifica que tengas licencias disponibles</li>
                                    <li>Si es una app gratuita, obtenla desde aquí</li>
                                    <li>Si es de pago, cómprala con la cuenta del centro</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Añadir app en Jamf</h4>
                            <div class="step-details">
                                <p>En Jamf School: <strong>Apps → Mobile Device Apps → + Add</strong></p>
                                <ul>
                                    <li>Busca la app por nombre (ej: "Keynote")</li>
                                    <li>Selecciona la versión correcta</li>
                                    <li>La app debe estar en Apple School Manager para que aparezca aquí</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Configurar distribución</h4>
                            <div class="step-details">
                                <p>Elige cómo se instalará la app:</p>
                                <ul>
                                    <li><strong>Install Automatically</strong>: Se instala automáticamente en todos los iPads del grupo. Ideal para apps esenciales.</li>
                                    <li><strong>Make Available in Self Service</strong>: El alumno puede instalarla si quiere desde la app Self Service.</li>
                                    <li><strong>Available in Teacher</strong>: El profesor decide cuándo instalarla usando Jamf Teacher. Ideal para apps específicas de una asignatura.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Definir Scope (a quién va dirigida)</h4>
                            <div class="step-details">
                                <p>Selecciona los iPads que recibirán la app:</p>
                                <ul>
                                    <li><strong>All Mobile Devices</strong>: Todos los iPads del centro</li>
                                    <li><strong>Smart Group específico</strong>: Por ejemplo "iPads 1º ESO" o "iPads Primaria"</li>
                                    <li><strong>Dispositivos individuales</strong>: iPads concretos</li>
                                </ul>
                                <div class="info-box">
                                    <div class="info-content">
                                        <p><strong>Recomendación:</strong> Usa Smart Groups para organizar por curso/ciclo. Así cuando añades un iPad nuevo al grupo, recibe automáticamente todas las apps.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Guardar y distribuir</h4>
                            <div class="step-details">
                                <p>Pulsa <strong>Save</strong> y la app comenzará a distribuirse.</p>
                                <ul>
                                    <li>Los iPads encendidos y conectados a WiFi la recibirán en 5-15 minutos</li>
                                    <li>Los iPads apagados la recibirán al encenderlos</li>
                                    <li>Puedes ver el progreso en Jamf: Apps → [App] → Status</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Importante sobre licencias</h4>
                        <p>Las licencias de apps se asignan y liberan automáticamente:</p>
                        <ul>
                            <li>Cuando instalas una app en un iPad, se usa una licencia</li>
                            <li>Cuando desinstalas la app o borras el iPad, la licencia se libera</li>
                            <li>Si no tienes licencias suficientes, la app no se instalará</li>
                        </ul>
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
                <p>Los perfiles de restricción permiten controlar qué pueden o no pueden hacer los alumnos con sus iPads, según su edad o curso.</p>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Importante</h4>
                        <p>Los perfiles de restricción se aplican inmediatamente a los iPads. Planifica bien antes de desplegar para evitar bloquear funciones que los profesores necesitan.</p>
                    </div>
                </div>

                <h3>Restricciones recomendadas por edad:</h3>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Primaria (6-12 años)</h4>
                        <p><strong>Enfoque:</strong> Control total para proteger a los menores</p>
                        <ul>
                            <li><i class="ri-close-circle-line"></i> Safari deshabilitado (usar navegador controlado como Jamf Parent o filtros de contenido)</li>
                            <li><i class="ri-close-circle-line"></i> App Store deshabilitado (las apps las instala IT o el profesor)</li>
                            <li><i class="ri-close-circle-line"></i> AirDrop solo para contactos</li>
                            <li><i class="ri-close-circle-line"></i> Cambio de fondo de pantalla bloqueado</li>
                            <li><i class="ri-close-circle-line"></i> Siri deshabilitado o con restricciones</li>
                            <li><i class="ri-check-line"></i> Contenido explícito bloqueado (música, películas, apps)</li>
                            <li><i class="ri-check-line"></i> Compras in-app bloqueadas</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>ESO (12-16 años)</h4>
                        <p><strong>Enfoque:</strong> Más libertad, pero con filtros de contenido</p>
                        <ul>
                            <li><i class="ri-check-line"></i> Safari permitido con filtro de contenido activado</li>
                            <li><i class="ri-close-circle-line"></i> App Store deshabilitado (control de IT)</li>
                            <li><i class="ri-close-circle-line"></i> Contenido explícito bloqueado</li>
                            <li><i class="ri-check-line"></i> AirDrop permitido (útil para compartir trabajos)</li>
                            <li><i class="ri-check-line"></i> Siri permitido</li>
                            <li><i class="ri-check-line"></i> Pueden cambiar el fondo de pantalla</li>
                            <li><i class="ri-close-circle-line"></i> Compras in-app bloqueadas</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Bachillerato (16-18 años)</h4>
                        <p><strong>Enfoque:</strong> Mayor autonomía responsable</p>
                        <ul>
                            <li><i class="ri-check-line"></i> Safari permitido con filtros básicos</li>
                            <li><i class="ri-check-line"></i> AirDrop permitido</li>
                            <li><i class="ri-check-line"></i> Siri permitido</li>
                            <li><i class="ri-close-circle-line"></i> App Store deshabilitado (opcional, según política del centro)</li>
                            <li><i class="ri-close-circle-line"></i> Compras in-app bloqueadas</li>
                        </ul>
                    </div>
                </div>

                <h3>Cómo crear un perfil de restricción en Jamf:</h3>
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Crear nuevo perfil</h4>
                            <div class="step-details">
                                <p>En Jamf School: <strong>Configuration Profiles → + New → Mobile Device → Restrictions</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Seleccionar restricciones</h4>
                            <div class="step-details">
                                <p>Marca las opciones que quieres restringir según la edad/curso</p>
                                <ul>
                                    <li>Apps: App Store, Safari, Cámara, etc.</li>
                                    <li>Funcionalidad: AirDrop, Siri, etc.</li>
                                    <li>Contenido: Películas, música, apps por edad</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Asignar a un grupo</h4>
                            <div class="step-details">
                                <p>Scope → selecciona el Smart Group correspondiente</p>
                                <p>Ejemplo: "iPads Primaria", "iPads 1º-2º ESO", etc.</p>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Guardar y desplegar</h4>
                            <div class="step-details">
                                <p>El perfil se aplicará automáticamente en los próximos minutos</p>
                                <p>Los alumnos notarán que ciertas apps/funciones ya no están disponibles</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Consejo para profesores</h4>
                        <p>Informa a los profesores de las restricciones aplicadas. Si un profesor necesita que los alumnos usen Safari para una actividad y está bloqueado, puede usar la app Aula para abrir una web concreta en todos los iPads (esto sí funciona aunque Safari esté restringido).</p>
                    </div>
                </div>
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
                <p>Este método funciona si el Mac está dado de alta en Apple School Manager.</p>

                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Verificar en Apple School Manager</h4>
                            <div class="step-details">
                                <p>Accede a <code>school.apple.com</code> → Dispositivos</p>
                                <ul>
                                    <li>Busca el número de serie del Mac</li>
                                    <li>Verifica que esté asignado a tu servidor Jamf</li>
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
                                <p>Durante el asistente de configuración:</p>
                                <ul>
                                    <li>Conecta a WiFi o Ethernet</li>
                                    <li>Espera unos segundos</li>
                                    <li>Aparecerá la pantalla de "Configuración remota" mostrando el nombre de tu centro</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Aceptar gestión</h4>
                            <div class="step-details">
                                <p>El Mac mostrará que será gestionado por tu organización</p>
                                <ul>
                                    <li>Acepta el perfil MDM</li>
                                    <li>Completa la configuración inicial (crear cuenta de usuario para el profesor)</li>
                                    <li>El Mac descargará automáticamente las políticas y software configurados en Jamf</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <h3>Método 2: Enrollment manual (URL)</h3>
                <p>Si el Mac NO está en Apple School Manager (por ejemplo, Macs antiguos comprados antes de configurar ASM):</p>
                <ol>
                    <li>Abre Safari en el Mac</li>
                    <li>Ve a: <code>tudominio.jamfcloud.com/enroll</code></li>
                    <li>Inicia sesión con credenciales de Jamf (usuario creado para enrollment)</li>
                    <li>Descarga e instala el perfil MDM cuando te lo solicite</li>
                    <li>Ve a Ajustes del Sistema → Privacidad y seguridad → Perfiles</li>
                    <li>Verifica que el perfil de gestión esté instalado</li>
                </ol>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Diferencia importante</h4>
                        <ul>
                            <li><strong>Automated Enrollment (desde ASM):</strong> El perfil MDM no se puede eliminar. Mayor control.</li>
                            <li><strong>Enrollment manual:</strong> El usuario puede eliminar el perfil MDM. Menor control.</li>
                        </ul>
                        <p><strong>Recomendación:</strong> Siempre que sea posible, compra los Macs a través de proveedores DEP para que aparezcan en ASM.</p>
                    </div>
                </div>
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
                <p>Las políticas automatizan tareas en los Macs: instalar software, ejecutar scripts, configurar ajustes, etc.</p>

                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Crear nueva política</h4>
                            <div class="step-details">
                                <p>En Jamf Pro: <strong>Computers → Policies → + New</strong></p>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Configurar Trigger (cuándo se ejecuta)</h4>
                            <div class="step-details">
                                <ul>
                                    <li><strong>Recurring Check-in</strong>: Se ejecuta periódicamente (cada 15 min, cada hora, etc.). Ideal para mantener software actualizado.</li>
                                    <li><strong>Login</strong>: Al iniciar sesión el usuario. Ideal para configuraciones de usuario.</li>
                                    <li><strong>Enrollment Complete</strong>: Una sola vez al inscribir el Mac. Ideal para configuración inicial.</li>
                                    <li><strong>Self Service</strong>: Cuando el profesor lo solicita desde la app Self Service. Ideal para software opcional.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Añadir acciones (qué hace la política)</h4>
                            <div class="step-details">
                                <ul>
                                    <li><strong>Packages</strong>: Instalar software (.pkg, .dmg). Ejemplo: Microsoft Office, Google Chrome.</li>
                                    <li><strong>Scripts</strong>: Ejecutar comandos personalizados. Ejemplo: configurar ajustes del sistema.</li>
                                    <li><strong>Printers</strong>: Configurar impresoras automáticamente.</li>
                                    <li><strong>Maintenance</strong>: Reparar permisos, actualizar inventario, etc.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Definir Scope (a qué Macs se aplica)</h4>
                            <div class="step-details">
                                <p>Selecciona los Macs objetivo:</p>
                                <ul>
                                    <li><strong>All Computers</strong>: Todos los Macs del centro</li>
                                    <li><strong>Smart Group</strong>: Por ejemplo "Macs Profesorado", "Macs Sala de Profesores", "Macs Biblioteca"</li>
                                    <li><strong>Dispositivos específicos</strong>: Macs individuales</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Guardar y probar</h4>
                            <div class="step-details">
                                <p>Guarda la política y pruébala en un Mac de prueba antes de desplegarla a todos</p>
                                <ul>
                                    <li>Ve al Mac → Abre Terminal</li>
                                    <li>Ejecuta: <code>sudo jamf policy</code></li>
                                    <li>Verifica que la política se ejecuta correctamente</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <h3>Ejemplos de políticas útiles para un centro educativo:</h3>
                <div class="info-box">
                    <div class="info-content">
                        <h4>Política: Instalar Microsoft Office en todos los Macs de profesores</h4>
                        <ul>
                            <li><strong>Trigger:</strong> Recurring Check-in (Once per computer)</li>
                            <li><strong>Package:</strong> Microsoft Office.pkg</li>
                            <li><strong>Scope:</strong> Smart Group "Macs Profesorado"</li>
                            <li><strong>Resultado:</strong> Todos los Macs de profesores tendrán Office instalado automáticamente</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Política: Configurar impresoras automáticamente</h4>
                        <ul>
                            <li><strong>Trigger:</strong> Login</li>
                            <li><strong>Printers:</strong> Añadir las impresoras del centro</li>
                            <li><strong>Scope:</strong> All Computers</li>
                            <li><strong>Resultado:</strong> Al iniciar sesión, el profesor ya tiene las impresoras configuradas</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Política: Software opcional en Self Service</h4>
                        <ul>
                            <li><strong>Trigger:</strong> Self Service</li>
                            <li><strong>Package:</strong> Adobe Acrobat, Audacity, etc.</li>
                            <li><strong>Scope:</strong> Smart Group "Macs Profesorado"</li>
                            <li><strong>Resultado:</strong> Los profesores pueden instalar software opcional cuando lo necesiten, sin llamar a IT</li>
                        </ul>
                    </div>
                </div>
            `
        }
    },

    // App Aula (Apple Classroom) - Sección ampliada y renombrada
    aula: {
        overview: {
            title: 'App Aula - Guía para Profesores',
            icon: '<i class="ri-presentation-line"></i>',
            tag: 'Guía completa',
            time: '15 min',
            content: `
                <h2><i class="ri-presentation-line"></i> App Aula - La herramienta del profesor</h2>

                <div class="info-box success">
                    <div class="info-icon"><i class="ri-apple-line"></i></div>
                    <div class="info-content">
                        <h4>¿Qué es la app Aula?</h4>
                        <p>Es la app de Apple que permite a los profesores gestionar los iPads de los alumnos durante la clase. Puedes ver sus pantallas, abrir apps, compartir contenido, bloquear dispositivos y mucho más.</p>
                        <p><strong>Importante:</strong> Funciona de forma automática, sin que el profesor tenga que configurar nada técnico.</p>
                    </div>
                </div>

                <h3>¿Qué puedes hacer con la app Aula?</h3>
                <div class="info-box">
                    <div class="info-content">
                        <h4>Ver las pantallas de los alumnos</h4>
                        <p>En tiempo real, puedes ver qué están haciendo los alumnos en sus iPads. Útil para verificar que están en la tarea.</p>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Abrir una app o web en todos los iPads a la vez</h4>
                        <p>Por ejemplo, abres la app "Keynote" en todos los iPads para que empiecen una actividad. O abres una web concreta en todos los dispositivos.</p>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Bloquear los iPads</h4>
                        <p>Cuando quieres que los alumnos te presten atención, bloqueas los iPads. Las pantallas se quedan en negro y no pueden usarlos hasta que los desbloquees.</p>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Limitar a una sola app</h4>
                        <p>Puedes forzar que los alumnos solo puedan usar una app concreta. Por ejemplo, durante un examen, solo pueden usar "Pages" y nada más.</p>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Proyectar la pantalla de un alumno en tu iPad/Mac</h4>
                        <p>Para mostrar el trabajo de un alumno al resto de la clase, puedes proyectar su pantalla a través de tu dispositivo conectado al proyector.</p>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Ver el nivel de batería de todos los iPads</h4>
                        <p>Para saber si algún alumno necesita cargar su iPad antes de que se apague en mitad de la clase.</p>
                    </div>
                </div>

                <h3>Cómo empezar a usar la app Aula (para profesores)</h3>
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Instalar la app Aula</h4>
                            <div class="step-details">
                                <p>En tu iPad o Mac del centro:</p>
                                <ul>
                                    <li>Abre el App Store</li>
                                    <li>Busca "Aula" o "Apple Classroom"</li>
                                    <li>Descárgala (es gratuita)</li>
                                </ul>
                                <p><strong>Nota para IT:</strong> También puedes distribuir la app automáticamente desde Jamf a todos los dispositivos de profesores.</p>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Abrir la app Aula</h4>
                            <div class="step-details">
                                <p>Al abrirla por primera vez:</p>
                                <ul>
                                    <li>Verás automáticamente tus clases (vienen desde Apple School Manager)</li>
                                    <li>NO tienes que crear las clases manualmente</li>
                                    <li>Si no ves tus clases, contacta con IT (puede que no estén sincronizadas desde ASM)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Seleccionar tu clase</h4>
                            <div class="step-details">
                                <p>Toca la clase que vas a dar. Por ejemplo: "1º ESO A - Matemáticas"</p>
                                <ul>
                                    <li>Aparecerán todos los iPads de los alumnos de esa clase</li>
                                    <li>Deben estar en la misma red WiFi que tú</li>
                                    <li>Deben tener el Bluetooth activado</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Invitar a los alumnos a unirse</h4>
                            <div class="step-details">
                                <p>Los alumnos verán una notificación en sus iPads:</p>
                                <ul>
                                    <li>"[Tu nombre] quiere gestionar tu iPad"</li>
                                    <li>Tienen que tocar "Permitir" o "Aceptar"</li>
                                    <li>Solo hace falta aceptar la primera vez (o al inicio de curso)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Ya puedes gestionar los iPads</h4>
                            <div class="step-details">
                                <p>Una vez conectados, verás miniaturas de las pantallas de todos los alumnos</p>
                                <ul>
                                    <li>Toca un iPad para ver opciones: ver pantalla, abrir app, bloquear, etc.</li>
                                    <li>Selecciona varios iPads para hacer acciones en grupo</li>
                                    <li>Usa los botones de la parte superior para acciones rápidas (bloquear todos, limitar a app, etc.)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Requisitos para que funcione</h4>
                        <ul>
                            <li><i class="ri-check-line"></i> Los iPads de los alumnos deben estar supervisados (configurados desde Jamf)</li>
                            <li><i class="ri-check-line"></i> Tu dispositivo y los iPads deben estar en la misma red WiFi</li>
                            <li><i class="ri-check-line"></i> El Bluetooth debe estar activado en todos los dispositivos</li>
                            <li><i class="ri-check-line"></i> Las clases deben estar creadas en Apple School Manager y sincronizadas</li>
                        </ul>
                        <p><strong>Si algo no funciona,</strong> consulta la sección de "Solucionar problemas" más abajo.</p>
                    </div>
                </div>
            `
        },
        howto: {
            title: 'Acciones comunes en la app Aula',
            icon: '<i class="ri-function-line"></i>',
            tag: 'Guía práctica',
            time: '10 min',
            content: `
                <h2><i class="ri-function-line"></i> Acciones comunes en la app Aula</h2>

                <h3>1. Ver la pantalla de un alumno</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Toca el icono del iPad del alumno</li>
                            <li>Selecciona "Ver pantalla"</li>
                            <li>Verás su pantalla en tiempo real</li>
                            <li>Puedes hacer zoom si quieres ver algo con detalle</li>
                        </ol>
                        <p><strong>Cuándo usarlo:</strong> Para verificar que los alumnos están haciendo la tarea, o para ayudar a un alumno que tiene un problema sin moverte de tu sitio.</p>
                    </div>
                </div>

                <h3>2. Bloquear todos los iPads</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Toca el botón "Bloquear pantallas" en la parte superior</li>
                            <li>Todos los iPads se bloquearán con una pantalla negra</li>
                            <li>Para desbloquear, toca el mismo botón de nuevo</li>
                        </ol>
                        <p><strong>Cuándo usarlo:</strong> Cuando estás explicando algo y quieres que los alumnos te presten atención sin distracciones.</p>
                    </div>
                </div>

                <h3>3. Abrir una app en todos los iPads</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Toca el botón "Abrir app" en la parte superior</li>
                            <li>Selecciona la app que quieres abrir (ej: "Keynote", "Pages", "GarageBand")</li>
                            <li>La app se abrirá automáticamente en todos los iPads seleccionados</li>
                        </ol>
                        <p><strong>Cuándo usarlo:</strong> Al inicio de una actividad, para que todos empiecen a trabajar en la misma app a la vez.</p>
                    </div>
                </div>

                <h3>4. Abrir una web en todos los iPads</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Toca el botón "Navegar a"</li>
                            <li>Escribe la URL de la web (ej: "educaplay.com/actividad123")</li>
                            <li>La web se abrirá en Safari en todos los iPads</li>
                        </ol>
                        <p><strong>Cuándo usarlo:</strong> Para que todos los alumnos accedan a la misma actividad online, vídeo educativo, etc.</p>
                        <p><strong>Nota:</strong> Esto funciona aunque Safari esté restringido en los iPads. La app Aula tiene permisos especiales.</p>
                    </div>
                </div>

                <h3>5. Limitar a una sola app</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Toca el botón "Limitar apps"</li>
                            <li>Selecciona UNA app</li>
                            <li>Los alumnos solo podrán usar esa app, no podrán salir a ninguna otra</li>
                            <li>Para quitar la limitación, toca "Quitar límite"</li>
                        </ol>
                        <p><strong>Cuándo usarlo:</strong> Durante un examen (por ejemplo, limitar a "Formularios de Google" y nada más), o durante una actividad donde necesitas que se concentren en una sola herramienta.</p>
                    </div>
                </div>

                <h3>6. Proyectar la pantalla de un alumno</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Toca el iPad del alumno cuyo trabajo quieres mostrar</li>
                            <li>Selecciona "Ver pantalla"</li>
                            <li>Conecta tu iPad/Mac al proyector del aula</li>
                            <li>Ponlo en modo pantalla completa</li>
                            <li>Toda la clase verá el trabajo de ese alumno</li>
                        </ol>
                        <p><strong>Cuándo usarlo:</strong> Para mostrar un buen ejemplo, corregir ejercicios de forma colaborativa, o mostrar diferentes enfoques de un problema.</p>
                    </div>
                </div>

                <h3>7. Silenciar notificaciones de los iPads</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Toca "Silenciar notificaciones"</li>
                            <li>Los alumnos no recibirán notificaciones durante la clase</li>
                        </ol>
                        <p><strong>Cuándo usarlo:</strong> Durante exámenes o actividades que requieren concentración total.</p>
                    </div>
                </div>

                <div class="info-box success">
                    <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
                    <div class="info-content">
                        <h4>Consejo</h4>
                        <p>Al final de la clase, acuérdate de <strong>quitar todas las restricciones</strong> (bloqueos, límites de app, etc.) para que los alumnos puedan usar sus iPads normalmente en la siguiente clase.</p>
                    </div>
                </div>
            `
        },
        setup: {
            title: 'Configurar la app Aula (para IT)',
            icon: '<i class="ri-settings-3-line"></i>',
            tag: 'Configuración IT',
            time: '20 min',
            steps: 12,
            content: `
                <h2><i class="ri-settings-3-line"></i> Configurar la app Aula (para IT)</h2>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-user-line"></i></div>
                    <div class="info-content">
                        <h4>Para personal IT</h4>
                        <p>Esta guía es para el personal IT que configura el ecosistema. Los profesores NO necesitan hacer esta configuración, solo instalar la app y usarla.</p>
                    </div>
                </div>

                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Crear clases en Apple School Manager</h4>
                            <div class="step-details">
                                <p>Accede a <code>school.apple.com</code> → Clases → + Nueva clase</p>
                                <ul>
                                    <li>Nombre: "1º ESO A", "2º Primaria B - Inglés", etc.</li>
                                    <li>Asigna el profesor responsable</li>
                                    <li>Añade los alumnos de esa clase</li>
                                    <li>Guarda la clase</li>
                                </ul>
                                <div class="info-box warning">
                                    <div class="info-content">
                                        <p><strong>MUY IMPORTANTE:</strong> Las clases se crean SOLO aquí en Apple School Manager. NO las crees en Jamf manualmente o habrá duplicados.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Verificar sincronización con Jamf</h4>
                            <div class="step-details">
                                <p>En Jamf School: <strong>Users → Classes</strong></p>
                                <ul>
                                    <li>Deberías ver las clases creadas en ASM</li>
                                    <li>La sincronización puede tardar hasta 24 horas</li>
                                    <li>Si no aparecen, ve a Settings → Apple School Manager → Sync now</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Verificar que los iPads están supervisados</h4>
                            <div class="step-details">
                                <p>En Jamf School: <strong>Devices → Mobile Devices</strong></p>
                                <ul>
                                    <li>Busca cualquier iPad de alumnos</li>
                                    <li>Verifica que en "Supervised" ponga "Yes"</li>
                                    <li>Si pone "No", el iPad no funcionará con la app Aula</li>
                                </ul>
                                <div class="info-box">
                                    <div class="info-content">
                                        <p><strong>Importante:</strong> Solo los iPads supervisados (configurados desde Apple School Manager + Jamf) funcionan con la app Aula. Los iPads configurados manualmente NO funcionarán.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Distribuir la app Aula a dispositivos de profesores</h4>
                            <div class="step-details">
                                <p>Dos opciones:</p>
                                <ul>
                                    <li><strong>Opción 1 (manual):</strong> Los profesores la descargan desde el App Store</li>
                                    <li><strong>Opción 2 (recomendada):</strong> La distribuyes automáticamente desde Jamf</li>
                                </ul>
                                <p><strong>Para distribuirla desde Jamf:</strong></p>
                                <ol>
                                    <li>Apps → Mobile Device Apps → + Add</li>
                                    <li>Busca "Aula" o "Apple Classroom"</li>
                                    <li>Distribution: "Install Automatically"</li>
                                    <li>Scope: Smart Group "iPads Profesores" o "Macs Profesores"</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Verificar configuración de red WiFi</h4>
                            <div class="step-details">
                                <p>Requisitos de red para que la app Aula funcione:</p>
                                <ul>
                                    <li><i class="ri-close-circle-line"></i> NO debe haber aislamiento de clientes (client isolation)</li>
                                    <li><i class="ri-check-line"></i> Multicast debe estar habilitado</li>
                                    <li><i class="ri-check-line"></i> Puertos necesarios abiertos (ver documentación de Apple)</li>
                                </ul>
                                <p>Contacta con el administrador de red si hay problemas de conectividad.</p>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">6</div>
                        <div class="step-content">
                            <h4>Formar a los profesores</h4>
                            <div class="step-details">
                                <p>Organiza una sesión de formación para los profesores:</p>
                                <ul>
                                    <li>Muéstrales cómo abrir la app Aula</li>
                                    <li>Explica las acciones básicas: ver pantallas, bloquear, abrir apps</li>
                                    <li>Resuelve dudas y problemas comunes</li>
                                    <li>Proporciona una guía rápida (puedes imprimir esta sección)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <h3>Verificación final (checklist)</h3>
                <div class="info-box">
                    <div class="info-content">
                        <ul>
                            <li><i class="ri-checkbox-line"></i> Clases creadas en Apple School Manager</li>
                            <li><i class="ri-checkbox-line"></i> Clases sincronizadas en Jamf School</li>
                            <li><i class="ri-checkbox-line"></i> iPads de alumnos supervisados</li>
                            <li><i class="ri-checkbox-line"></i> App Aula instalada en dispositivos de profesores</li>
                            <li><i class="ri-checkbox-line"></i> Red WiFi configurada correctamente</li>
                            <li><i class="ri-checkbox-line"></i> Bluetooth habilitado en todos los dispositivos</li>
                            <li><i class="ri-checkbox-line"></i> Profesores formados en el uso básico</li>
                        </ul>
                    </div>
                </div>
            `
        },
        advanced: {
            title: 'Funciones Avanzadas de la app Aula',
            icon: '<i class="ri-rocket-line"></i>',
            tag: 'Avanzado',
            time: '15 min',
            content: `
                <h2><i class="ri-rocket-line"></i> Funciones Avanzadas de la app Aula</h2>

                <div class="info-box success">
                    <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
                    <div class="info-content">
                        <h4>Más allá de lo básico</h4>
                        <p>Además de ver pantallas y bloquear iPads, la app Aula tiene muchas más funciones útiles para el día a día en el aula.</p>
                    </div>
                </div>

                <h3>Ocultar la app actual</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>¿Para qué sirve?</strong> Minimiza la app que están usando los alumnos sin bloquear completamente el iPad.</p>
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Selecciona los alumnos (uno, varios o todos)</li>
                            <li>Toca <strong>"Ocultar"</strong> en la barra de acciones</li>
                            <li>La app se cierra y los alumnos ven la pantalla de inicio</li>
                        </ol>
                        <p><strong>Diferencia con Bloquear:</strong></p>
                        <ul>
                            <li><strong>Ocultar:</strong> Cierra la app, el alumno puede abrir otra cosa</li>
                            <li><strong>Bloquear:</strong> Pantalla negra, no pueden hacer nada</li>
                        </ul>
                    </div>
                </div>

                <h3>Compartir archivos con AirDrop</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>¿Para qué sirve?</strong> Enviar documentos, fotos o archivos a todos los iPads de la clase a la vez.</p>
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Selecciona los alumnos que recibirán el archivo</li>
                            <li>Toca el botón <strong>"Compartir"</strong> (icono de compartir)</li>
                            <li>Selecciona <strong>"AirDrop"</strong></li>
                            <li>Elige el archivo desde Fotos, Archivos, etc.</li>
                            <li>El archivo se envía a todos los seleccionados</li>
                        </ol>
                        <p><strong>Útil para:</strong> Repartir material de clase, plantillas, rúbricas, etc.</p>
                    </div>
                </div>

                <h3>Proyectar con AirPlay a Apple TV</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>¿Para qué sirve?</strong> Mostrar la pantalla de un alumno en el proyector del aula.</p>
                        <p><strong>Opción 1 - Mostrar TU pantalla:</strong></p>
                        <ol>
                            <li>Abre Centro de Control (desliza desde arriba-derecha)</li>
                            <li>Toca "Duplicar pantalla"</li>
                            <li>Selecciona el Apple TV del aula</li>
                        </ol>
                        <p><strong>Opción 2 - Mostrar la pantalla de UN ALUMNO:</strong></p>
                        <ol>
                            <li>Selecciona al alumno en Aula</li>
                            <li>Toca "Ver pantalla" para verlo en tu iPad</li>
                            <li>Con tu iPad proyectado al Apple TV, toda la clase lo verá</li>
                        </ol>
                        <p><strong>Opción 3 - El alumno proyecta directamente:</strong></p>
                        <ol>
                            <li>Selecciona al alumno en Aula</li>
                            <li>Toca "AirPlay" y elige el Apple TV</li>
                            <li>El iPad del alumno proyectará directamente</li>
                        </ol>
                    </div>
                </div>

                <h3>Restablecer contraseña de Apple ID</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>¿Para qué sirve?</strong> Si un alumno olvida su contraseña, puedes resetearla sin llamar a IT.</p>
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Selecciona al alumno en la app Aula</li>
                            <li>Toca <strong>"Restablecer contraseña"</strong></li>
                            <li>Se genera una contraseña temporal</li>
                            <li>Dísela al alumno verbalmente</li>
                            <li>El alumno la cambiará al iniciar sesión</li>
                        </ol>
                        <p><strong>Importante:</strong> Solo funciona con Apple IDs gestionados (creados en ASM), no con Apple IDs personales.</p>
                    </div>
                </div>

                <h3>Crear grupos dentro de la clase</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>¿Para qué sirve?</strong> Gestionar subconjuntos de alumnos para actividades diferenciadas.</p>
                        <p><strong>Pasos:</strong></p>
                        <ol>
                            <li>Mantén pulsado en un alumno y arrastra para seleccionar varios</li>
                            <li>Toca <strong>"Crear grupo"</strong></li>
                            <li>Pon nombre al grupo (ej: "Mesa 1", "Nivel avanzado")</li>
                            <li>El grupo se guarda para futuras sesiones</li>
                        </ol>
                        <p><strong>Ejemplos de uso:</strong></p>
                        <ul>
                            <li>"Grupo A" trabaja en Pages mientras "Grupo B" ve un vídeo</li>
                            <li>"Refuerzo" recibe atención individual</li>
                            <li>Trabajos por equipos de proyecto</li>
                        </ul>
                    </div>
                </div>

                <h3>Ver resumen de actividad</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>¿Para qué sirve?</strong> Al finalizar la clase, ver qué apps usaron los alumnos.</p>
                        <p><strong>Qué muestra:</strong></p>
                        <ul>
                            <li>Apps más utilizadas durante la clase</li>
                            <li>Tiempo aproximado en cada app por alumno</li>
                            <li>Webs visitadas (si usaron Safari)</li>
                            <li>Alertas o incidencias</li>
                        </ul>
                        <p><strong>Útil para:</strong> Identificar alumnos que no estuvieron en la tarea, seguimiento del uso de tecnología.</p>
                    </div>
                </div>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-information-line"></i></div>
                    <div class="info-content">
                        <h4>Límite recomendado: 60 estudiantes</h4>
                        <p>Apple recomienda un máximo de 60 alumnos por clase para un rendimiento óptimo. Si tienes clases más grandes, considera dividirlas en grupos en ASM.</p>
                    </div>
                </div>
            `
        },
        remotehybrid: {
            title: 'Clases Remotas e Híbridas con Aula',
            icon: '<i class="ri-global-line"></i>',
            tag: 'Remoto',
            time: '10 min',
            content: `
                <h2><i class="ri-global-line"></i> Clases Remotas e Híbridas con Aula</h2>

                <div class="info-box success">
                    <div class="info-icon"><i class="ri-home-wifi-line"></i></div>
                    <div class="info-content">
                        <h4>La app Aula funciona también a distancia</h4>
                        <p>No solo sirve cuando todos están en el aula física. También puedes gestionar iPads de alumnos que están en casa.</p>
                    </div>
                </div>

                <h3>Tipos de clases</h3>

                <div class="info-box">
                    <div class="info-content">
                        <h4><i class="ri-building-line"></i> Clases presenciales (modo normal)</h4>
                        <ul>
                            <li>Todos en la misma aula física</li>
                            <li>Conexión por Bluetooth + WiFi</li>
                            <li>Distancia máxima: 10-15 metros</li>
                            <li>Máximo rendimiento y velocidad</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4><i class="ri-home-line"></i> Clases remotas</h4>
                        <ul>
                            <li>Alumnos en casa, profesor en el centro (o viceversa)</li>
                            <li>Conexión a través de Internet (no necesita Bluetooth)</li>
                            <li>Los alumnos deben aceptar unirse cuando se les invite</li>
                            <li>Algunas funciones pueden tener más latencia</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4><i class="ri-group-line"></i> Clases híbridas</h4>
                        <ul>
                            <li>Algunos alumnos presenciales, otros remotos</li>
                            <li>Combina ambos modos automáticamente</li>
                            <li>Los presenciales se conectan por Bluetooth</li>
                            <li>Los remotos se conectan por Internet</li>
                        </ul>
                    </div>
                </div>

                <h3>Requisitos para clases remotas</h3>
                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-checkbox-circle-line"></i></div>
                    <div class="info-content">
                        <ul>
                            <li><i class="ri-check-line"></i> iPads supervisados y gestionados por Jamf</li>
                            <li><i class="ri-check-line"></i> Clases creadas en Apple School Manager</li>
                            <li><i class="ri-check-line"></i> Alumnos con Apple IDs gestionados</li>
                            <li><i class="ri-check-line"></i> Conexión a Internet estable (profesor y alumnos)</li>
                        </ul>
                    </div>
                </div>

                <h3>Cómo funciona en remoto</h3>
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Abre la app Aula</h4>
                            <div class="step-details">
                                <p>Selecciona tu clase como siempre</p>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Invita a los alumnos</h4>
                            <div class="step-details">
                                <p>Los alumnos remotos recibirán una notificación en sus iPads para unirse</p>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Los alumnos aceptan</h4>
                            <div class="step-details">
                                <p>Deben tocar "Unirse" cuando vean la invitación</p>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Gestiona normalmente</h4>
                            <div class="step-details">
                                <p>Puedes ver pantallas, abrir apps, bloquear, etc. (con algo más de latencia)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
                    <div class="info-content">
                        <h4>Consejo para clases remotas</h4>
                        <p>Combina la app Aula con una videollamada (FaceTime, Google Meet, Teams). Usa Aula para controlar los iPads y la videollamada para hablar con los alumnos.</p>
                    </div>
                </div>
            `
        },
        sharedipad: {
            title: 'Aula con iPad Compartido (Shared iPad)',
            icon: '<i class="ri-group-2-line"></i>',
            tag: 'Configuración',
            time: '10 min',
            content: `
                <h2><i class="ri-group-2-line"></i> Aula con iPad Compartido (Shared iPad)</h2>

                <div class="info-box success">
                    <div class="info-icon"><i class="ri-user-shared-line"></i></div>
                    <div class="info-content">
                        <h4>¿Qué es Shared iPad?</h4>
                        <p>Un modo donde varios alumnos pueden usar el mismo iPad físico, cada uno con su propia cuenta y datos separados.</p>
                    </div>
                </div>

                <h3>Cómo funciona</h3>
                <div class="info-box">
                    <div class="info-content">
                        <ul>
                            <li><strong>Un iPad, múltiples usuarios:</strong> El alumno selecciona su foto e inicia sesión con su Apple ID gestionado</li>
                            <li><strong>Datos separados:</strong> Cada alumno tiene sus propias apps, documentos y configuración</li>
                            <li><strong>Ideal para centros con menos iPads que alumnos:</strong> Los iPads se comparten entre diferentes clases y turnos</li>
                        </ul>
                    </div>
                </div>

                <h3>Cómo funciona Aula con Shared iPad</h3>
                <div class="info-box">
                    <div class="info-content">
                        <ol>
                            <li>El alumno inicia sesión en el iPad compartido</li>
                            <li>La app Aula detecta <strong>qué alumno</strong> está usando el iPad</li>
                            <li>El profesor ve el <strong>nombre del alumno</strong>, no el nombre del iPad</li>
                            <li>Todas las funciones de Aula funcionan normalmente</li>
                        </ol>
                    </div>
                </div>

                <h3>Ventajas para profesores</h3>
                <div class="info-box">
                    <div class="info-content">
                        <ul>
                            <li><i class="ri-check-line"></i> Ves quién está en cada iPad (aunque sea compartido)</li>
                            <li><i class="ri-check-line"></i> Las restricciones se aplican al usuario, no al dispositivo</li>
                            <li><i class="ri-check-line"></i> Los datos del alumno le siguen a cualquier iPad</li>
                            <li><i class="ri-check-line"></i> Funciona igual que con iPads individuales</li>
                        </ul>
                    </div>
                </div>

                <h3>Configuración (para IT)</h3>
                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-settings-3-line"></i></div>
                    <div class="info-content">
                        <h4>Requisitos de configuración</h4>
                        <ol>
                            <li><strong>En ASM:</strong> Los iPads deben estar en un grupo de Shared iPad</li>
                            <li><strong>En Jamf:</strong> Configurar PreStage con Shared iPad habilitado</li>
                            <li><strong>Almacenamiento:</strong> Definir cuántos usuarios caben (depende del espacio)</li>
                            <li><strong>Apple IDs:</strong> Todos los alumnos necesitan Apple IDs gestionados</li>
                        </ol>
                        <p><strong>Almacenamiento recomendado:</strong></p>
                        <ul>
                            <li>32GB: 2-3 usuarios máximo</li>
                            <li>64GB: 5-8 usuarios</li>
                            <li>128GB+: 10+ usuarios</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
                    <div class="info-content">
                        <h4>Escenario típico</h4>
                        <p>El centro tiene 30 iPads para 120 alumnos. Con Shared iPad, cada iPad puede ser usado por 4 alumnos diferentes (de diferentes clases/turnos). Cada alumno inicia sesión con su cuenta y encuentra sus apps y trabajos exactamente como los dejó.</p>
                    </div>
                </div>
            `
        },
        troubleshoot: {
            title: 'Solucionar Problemas de la app Aula',
            icon: '<i class="ri-tools-line"></i>',
            tag: 'Troubleshooting',
            time: 'Variable',
            content: `
                <h2><i class="ri-tools-line"></i> Problemas comunes de la app Aula</h2>

                <h3><i class="ri-close-circle-line"></i> Problema: "No veo los iPads de mi clase"</h3>
                <div class="steps-container">
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>Verificar Bluetooth</h4>
                            <div class="step-details">
                                <p>La app Aula usa Bluetooth para descubrir dispositivos cercanos.</p>
                                <ul>
                                    <li>En tu iPad/Mac: Verifica que Bluetooth esté activado (Ajustes → Bluetooth)</li>
                                    <li>En los iPads de los alumnos: Verifica que Bluetooth esté activado</li>
                                    <li>Si está desactivado en muchos iPads, pide a IT que lo active desde Jamf con un comando masivo</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Verificar red WiFi</h4>
                            <div class="step-details">
                                <p>Tu dispositivo y los iPads de los alumnos deben estar en la misma red WiFi.</p>
                                <ul>
                                    <li>Verifica que todos estáis conectados a la WiFi del centro (no a datos móviles ni WiFi personal)</li>
                                    <li>A veces las redes WiFi tienen "aislamiento de clientes" activado, lo que impide que los dispositivos se vean entre sí. Contacta con IT si sospechas que es esto.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>Verificar que tienes la clase correcta</h4>
                            <div class="step-details">
                                <p>En la app Aula, verifica que has seleccionado la clase correcta.</p>
                                <ul>
                                    <li>Si no ves tu clase en la lista, contacta con IT (puede que no esté sincronizada desde Apple School Manager)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>Verificar que los alumnos aceptaron la invitación</h4>
                            <div class="step-details">
                                <p>Los alumnos deben aceptar tu invitación la primera vez.</p>
                                <ul>
                                    <li>Pregúntales si vieron una notificación "[Tu nombre] quiere gestionar tu iPad" y si la aceptaron</li>
                                    <li>Si la rechazaron por error, cierra y vuelve a abrir la app Aula para enviar la invitación de nuevo</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-content">
                            <h4>Forzar sincronización desde Jamf (para IT)</h4>
                            <div class="step-details">
                                <p>Si el problema persiste, IT puede forzar una sincronización:</p>
                                <ul>
                                    <li>En Jamf: Devices → selecciona los iPads → Actions → Send Blank Push</li>
                                    <li>Esto fuerza a los iPads a comunicarse con Jamf y actualizar su configuración</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <h3><i class="ri-close-circle-line"></i> Problema: "Veo los iPads pero no puedo verles la pantalla"</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Posibles causas:</strong></p>
                        <ul>
                            <li>Los iPads no están supervisados (solo IT puede verificar esto en Jamf)</li>
                            <li>Hay un problema de red (contacta con IT)</li>
                            <li>Los alumnos rechazaron el permiso de "Observar pantalla" (vuelve a enviar la invitación)</li>
                        </ul>
                    </div>
                </div>

                <h3><i class="ri-close-circle-line"></i> Problema: "La app Aula se queda bloqueada o va muy lenta"</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Soluciones:</strong></p>
                        <ul>
                            <li>Cierra y vuelve a abrir la app Aula</li>
                            <li>Reinicia tu iPad/Mac</li>
                            <li>Verifica que tu dispositivo tiene suficiente batería y memoria disponible</li>
                            <li>Si persiste, contacta con IT para que verifiquen la configuración de red</li>
                        </ul>
                    </div>
                </div>

                <h3><i class="ri-close-circle-line"></i> Problema: "No aparece mi clase en la app Aula"</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Causas y soluciones:</strong></p>
                        <ul>
                            <li><strong>La clase no está creada en Apple School Manager:</strong> Contacta con IT para que la creen</li>
                            <li><strong>No estás asignado como profesor de esa clase:</strong> Contacta con IT para que te asignen</li>
                            <li><strong>La sincronización está pendiente:</strong> Espera unas horas y vuelve a intentarlo (puede tardar hasta 24h)</li>
                        </ul>
                    </div>
                </div>

                <h3><i class="ri-close-circle-line"></i> Problema: "Los alumnos pueden salir de la app aunque la haya limitado"</h3>
                <div class="info-box">
                    <div class="info-content">
                        <p><strong>Causas y soluciones:</strong></p>
                        <ul>
                            <li>Los iPads no están supervisados (contacta con IT)</li>
                            <li>No aplicaste correctamente la limitación de app (verifica que seleccionaste todos los iPads antes de aplicar la limitación)</li>
                            <li>Hay un problema de sincronización (cierra y vuelve a abrir la app Aula)</li>
                        </ul>
                    </div>
                </div>

                <div class="info-box success">
                    <div class="info-icon"><i class="ri-question-line"></i></div>
                    <div class="info-content">
                        <h4>¿Algo más no funciona?</h4>
                        <p>Contacta con el personal IT del centro. Proporciona detalles:</p>
                        <ul>
                            <li>Qué clase estás intentando gestionar</li>
                            <li>Qué acción no funciona (ver pantallas, bloquear, etc.)</li>
                            <li>Cuántos iPads están afectados (todos, solo algunos, uno concreto)</li>
                            <li>Si el problema ocurre siempre o solo a veces</li>
                        </ul>
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
                        <h4>¿Qué es Jamf Teacher?</h4>
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
                                <p>En Jamf School: <strong>Devices → Settings → Teacher Permissions</strong></p>
                                <ul>
                                    <li><i class="ri-check-line"></i> Allow teachers to install apps</li>
                                    <li><i class="ri-check-line"></i> Allow teachers to remove apps</li>
                                    <li><i class="ri-check-line"></i> Allow teachers to clear passcodes (opcional, útil si un alumno olvida su código)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>Marcar apps como "Teacher Available" (para IT)</h4>
                            <div class="step-details">
                                <p>En Jamf School: <strong>Apps → [App] → Scope → Distribution</strong></p>
                                <ul>
                                    <li>Marca "Available in Teacher"</li>
                                    <li>Esto NO instala la app automáticamente</li>
                                    <li>Solo la hace disponible para que el profesor pueda instalarla cuando quiera</li>
                                </ul>
                                <div class="info-box">
                                    <div class="info-content">
                                        <p><strong>Ejemplo:</strong> Si "GarageBand" está marcada como "Available in Teacher", el profesor de Música puede instalarla en los iPads de su clase solo durante sus clases, y desinstalearla después para liberar espacio.</p>
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
                                    <li>Verifica en Jamf: <strong>Users → Classes</strong></li>
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
                                <p>Inicia sesión con tus credenciales del centro (las mismas que para Apple School Manager o el correo del centro).</p>
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
                                    <li>Selecciona tu clase (ej: "1º ESO A - Tecnología")</li>
                                    <li>Selecciona los iPads donde quieres instalar la app (todos, o solo algunos)</li>
                                    <li>Toca "Apps" → "Instalar app"</li>
                                    <li>Selecciona la app (solo verás las apps marcadas como "Teacher Available" por IT)</li>
                                    <li>La app se instalará en unos minutos</li>
                                </ol>
                                <p><strong>Para desinstalar:</strong> Mismos pasos, pero selecciona "Desinstalar app"</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h3>Casos de uso prácticos</h3>
                <div class="info-box">
                    <div class="info-content">
                        <h4>Profesor de Música</h4>
                        <p>Instala GarageBand solo durante sus clases de música. Al terminar la unidad, desinstala la app para liberar espacio en los iPads (las apps de música ocupan mucho).</p>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Profesor de Ciencias</h4>
                        <p>Instala una app específica de Química ("Elementos - Tabla Periódica") solo durante el tema de Química. No es necesario que la tengan todo el curso.</p>
                    </div>
                </div>

                <div class="info-box">
                    <div class="info-content">
                        <h4>Profesor de Inglés</h4>
                        <p>Instala una app de práctica de pronunciación ("Elsa Speak") solo para un grupo reducido de alumnos que necesitan refuerzo, no para toda la clase.</p>
                    </div>
                </div>

                <div class="info-box warning">
                    <div class="info-icon"><i class="ri-alert-line"></i></div>
                    <div class="info-content">
                        <h4>Requisitos</h4>
                        <ul>
                            <li>iPads <strong>supervisados</strong> (configurados desde ASM + Jamf)</li>
                            <li>Apps compradas en <strong>Apple School Manager</strong> (debes tener licencias disponibles)</li>
                            <li>Necesitas <strong>Jamf School</strong> (no Jamf Pro básico)</li>
                            <li>Las apps deben estar marcadas como "Teacher Available" por IT</li>
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
                { text: 'Verificar número de serie en Apple School Manager (school.apple.com)', done: false },
                { text: 'Comprobar asignación al servidor Jamf en ASM', done: false },
                { text: 'Encender y conectar a WiFi del centro', done: false },
                { text: 'Aceptar perfil de gestión remota (debe aparecer automáticamente)', done: false },
                { text: 'Verificar que aparece en Jamf como "Managed" (Gestionado)', done: false },
                { text: 'Asignar a Smart Group correspondiente (ej: "iPads 1º ESO")', done: false },
                { text: 'Verificar instalación automática de apps', done: false },
                { text: 'Etiquetar dispositivo físicamente con número de inventario', done: false },
                { text: 'Documentar asignación al alumno (nombre, curso)', done: false }
            ]
        },
        newMac: {
            title: 'Nuevo Mac',
            icon: '<i class="ri-macbook-line"></i>',
            items: [
                { text: 'Verificar en Apple School Manager (school.apple.com)', done: false },
                { text: 'Comprobar asignación al servidor Jamf en ASM', done: false },
                { text: 'Borrar disco si tiene datos previos', done: false },
                { text: 'Reinstalar macOS limpio', done: false },
                { text: 'Conectar a red y aceptar gestión remota', done: false },
                { text: 'Verificar enrollment en Jamf como "Managed"', done: false },
                { text: 'Crear cuenta de usuario local para el profesor', done: false },
                { text: 'Ejecutar políticas de configuración automática', done: false },
                { text: 'Instalar software necesario (Office, navegadores, etc.)', done: false },
                { text: 'Configurar impresoras del centro', done: false },
                { text: 'Documentar asignación al profesor (nombre, departamento)', done: false },
                { text: 'Etiquetar dispositivo físicamente', done: false }
            ]
        },
        startYear: {
            title: 'Inicio de Curso',
            icon: '<i class="ri-calendar-event-line"></i>',
            items: [
                { text: 'Inventario completo de todos los dispositivos (iPads y Macs)', done: false },
                { text: 'Verificar estado de baterías de todos los iPads', done: false },
                { text: 'Actualizar iPadOS/macOS a la última versión estable', done: false },
                { text: 'Importar nuevos alumnos y profesores en Apple School Manager', done: false },
                { text: 'Crear nuevas clases en Apple School Manager', done: false },
                { text: 'Verificar sincronización de clases con Jamf School', done: false },
                { text: 'Actualizar Smart Groups con alumnos del nuevo curso', done: false },
                { text: 'Revisar y actualizar perfiles de restricción por curso/edad', done: false },
                { text: 'Distribuir apps necesarias para el nuevo curso', done: false },
                { text: 'Verificar que la app Aula funciona en todas las clases', done: false },
                { text: 'Formar a nuevos profesores en el uso de la app Aula', done: false },
                { text: 'Formar a profesores en el uso de Jamf Teacher (si se usa)', done: false },
                { text: 'Probar Self Service en Macs de profesores', done: false },
                { text: 'Verificar conectividad WiFi en todas las aulas', done: false },
                { text: 'Verificar que Bluetooth funciona en todos los dispositivos', done: false },
                { text: 'Preparar iPads de repuesto para préstamos/sustituciones', done: false },
                { text: 'Revisar y documentar incidencias del curso anterior', done: false },
                { text: 'Backup de configuraciones actuales de Jamf', done: false },
                { text: 'Actualizar base de conocimiento con cambios del nuevo curso', done: false }
            ]
        }
    }
};

// Export for use in other modules
window.KnowledgeBase = KnowledgeBase;

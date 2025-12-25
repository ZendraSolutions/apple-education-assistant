/**
 * JAMF ASSISTANT - Knowledge Base Aula Basic
 * Guias basicas de la app Aula para profesores
 *
 * @module KnowledgeAulaBasic
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
 * Aula app overview guide
 * @type {GuideContent}
 */
export const overview = {
    title: 'App Aula - Guia para Profesores',
    icon: '<i class="ri-presentation-line"></i>',
    tag: 'Guia completa',
    time: '15 min',
    content: `
        <h2><i class="ri-presentation-line"></i> App Aula - La herramienta del profesor</h2>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-apple-line"></i></div>
            <div class="info-content">
                <h4>Que es la app Aula?</h4>
                <p>Es la app de Apple que permite a los profesores gestionar los iPads de los alumnos durante la clase. Puedes ver sus pantallas, abrir apps, compartir contenido, bloquear dispositivos y mucho mas.</p>
                <p><strong>Importante:</strong> Funciona de forma automatica, sin que el profesor tenga que configurar nada tecnico.</p>
            </div>
        </div>

        <h3>Que puedes hacer con la app Aula?</h3>
        <div class="info-box">
            <div class="info-content">
                <h4>Ver las pantallas de los alumnos</h4>
                <p>En tiempo real, puedes ver que estan haciendo los alumnos en sus iPads. Util para verificar que estan en la tarea.</p>
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
                <p>Cuando quieres que los alumnos te presten atencion, bloqueas los iPads. Las pantallas se quedan en negro y no pueden usarlos hasta que los desbloquees.</p>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Limitar a una sola app</h4>
                <p>Puedes forzar que los alumnos solo puedan usar una app concreta. Por ejemplo, durante un examen, solo pueden usar "Pages" y nada mas.</p>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Proyectar la pantalla de un alumno en tu iPad/Mac</h4>
                <p>Para mostrar el trabajo de un alumno al resto de la clase, puedes proyectar su pantalla a traves de tu dispositivo conectado al proyector.</p>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Ver el nivel de bateria de todos los iPads</h4>
                <p>Para saber si algun alumno necesita cargar su iPad antes de que se apague en mitad de la clase.</p>
            </div>
        </div>

        <h3>Como empezar a usar la app Aula (para profesores)</h3>
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
                            <li>Descargala (es gratuita)</li>
                        </ul>
                        <p><strong>Nota para IT:</strong> Tambien puedes distribuir la app automaticamente desde Jamf a todos los dispositivos de profesores.</p>
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
                            <li>Veras automaticamente tus clases (vienen desde Apple School Manager)</li>
                            <li>NO tienes que crear las clases manualmente</li>
                            <li>Si no ves tus clases, contacta con IT (puede que no esten sincronizadas desde ASM)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Seleccionar tu clase</h4>
                    <div class="step-details">
                        <p>Toca la clase que vas a dar. Por ejemplo: "1 ESO A - Matematicas"</p>
                        <ul>
                            <li>Apareceran todos los iPads de los alumnos de esa clase</li>
                            <li>Deben estar en la misma red WiFi que tu</li>
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
                        <p>Los alumnos veran una notificacion en sus iPads:</p>
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
                        <p>Una vez conectados, veras miniaturas de las pantallas de todos los alumnos</p>
                        <ul>
                            <li>Toca un iPad para ver opciones: ver pantalla, abrir app, bloquear, etc.</li>
                            <li>Selecciona varios iPads para hacer acciones en grupo</li>
                            <li>Usa los botones de la parte superior para acciones rapidas (bloquear todos, limitar a app, etc.)</li>
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
                <p><strong>Si algo no funciona,</strong> consulta la seccion de "Solucionar problemas" mas abajo.</p>
            </div>
        </div>
    `
};

/**
 * Aula common actions guide
 * @type {GuideContent}
 */
export const howto = {
    title: 'Acciones comunes en la app Aula',
    icon: '<i class="ri-function-line"></i>',
    tag: 'Guia practica',
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
                    <li>Veras su pantalla en tiempo real</li>
                    <li>Puedes hacer zoom si quieres ver algo con detalle</li>
                </ol>
                <p><strong>Cuando usarlo:</strong> Para verificar que los alumnos estan haciendo la tarea, o para ayudar a un alumno que tiene un problema sin moverte de tu sitio.</p>
            </div>
        </div>

        <h3>2. Bloquear todos los iPads</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Pasos:</strong></p>
                <ol>
                    <li>Toca el boton "Bloquear pantallas" en la parte superior</li>
                    <li>Todos los iPads se bloquearan con una pantalla negra</li>
                    <li>Para desbloquear, toca el mismo boton de nuevo</li>
                </ol>
                <p><strong>Cuando usarlo:</strong> Cuando estas explicando algo y quieres que los alumnos te presten atencion sin distracciones.</p>
            </div>
        </div>

        <h3>3. Abrir una app en todos los iPads</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Pasos:</strong></p>
                <ol>
                    <li>Toca el boton "Abrir app" en la parte superior</li>
                    <li>Selecciona la app que quieres abrir (ej: "Keynote", "Pages", "GarageBand")</li>
                    <li>La app se abrira automaticamente en todos los iPads seleccionados</li>
                </ol>
                <p><strong>Cuando usarlo:</strong> Al inicio de una actividad, para que todos empiecen a trabajar en la misma app a la vez.</p>
            </div>
        </div>

        <h3>4. Abrir una web en todos los iPads</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Pasos:</strong></p>
                <ol>
                    <li>Toca el boton "Navegar a"</li>
                    <li>Escribe la URL de la web (ej: "educaplay.com/actividad123")</li>
                    <li>La web se abrira en Safari en todos los iPads</li>
                </ol>
                <p><strong>Cuando usarlo:</strong> Para que todos los alumnos accedan a la misma actividad online, video educativo, etc.</p>
                <p><strong>Nota:</strong> Esto funciona aunque Safari este restringido en los iPads. La app Aula tiene permisos especiales.</p>
            </div>
        </div>

        <h3>5. Limitar a una sola app</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Pasos:</strong></p>
                <ol>
                    <li>Toca el boton "Limitar apps"</li>
                    <li>Selecciona UNA app</li>
                    <li>Los alumnos solo podran usar esa app, no podran salir a ninguna otra</li>
                    <li>Para quitar la limitacion, toca "Quitar limite"</li>
                </ol>
                <p><strong>Cuando usarlo:</strong> Durante un examen (por ejemplo, limitar a "Formularios de Google" y nada mas), o durante una actividad donde necesitas que se concentren en una sola herramienta.</p>
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
                    <li>Toda la clase vera el trabajo de ese alumno</li>
                </ol>
                <p><strong>Cuando usarlo:</strong> Para mostrar un buen ejemplo, corregir ejercicios de forma colaborativa, o mostrar diferentes enfoques de un problema.</p>
            </div>
        </div>

        <h3>7. Silenciar notificaciones de los iPads</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Pasos:</strong></p>
                <ol>
                    <li>Toca "Silenciar notificaciones"</li>
                    <li>Los alumnos no recibiran notificaciones durante la clase</li>
                </ol>
                <p><strong>Cuando usarlo:</strong> Durante examenes o actividades que requieren concentracion total.</p>
            </div>
        </div>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
            <div class="info-content">
                <h4>Consejo</h4>
                <p>Al final de la clase, acuerdate de <strong>quitar todas las restricciones</strong> (bloqueos, limites de app, etc.) para que los alumnos puedan usar sus iPads normalmente en la siguiente clase.</p>
            </div>
        </div>
    `
};

/**
 * Aula IT setup guide
 * @type {GuideContent}
 */
export const setup = {
    title: 'Configurar la app Aula (para IT)',
    icon: '<i class="ri-settings-3-line"></i>',
    tag: 'Configuracion IT',
    time: '20 min',
    steps: 12,
    content: `
        <h2><i class="ri-settings-3-line"></i> Configurar la app Aula (para IT)</h2>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-user-line"></i></div>
            <div class="info-content">
                <h4>Para personal IT</h4>
                <p>Esta guia es para el personal IT que configura el ecosistema. Los profesores NO necesitan hacer esta configuracion, solo instalar la app y usarla.</p>
            </div>
        </div>

        <div class="steps-container">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h4>Crear clases en Apple School Manager</h4>
                    <div class="step-details">
                        <p>Accede a <code>school.apple.com</code> -> Clases -> + Nueva clase</p>
                        <ul>
                            <li>Nombre: "1 ESO A", "2 Primaria B - Ingles", etc.</li>
                            <li>Asigna el profesor responsable</li>
                            <li>Anade los alumnos de esa clase</li>
                            <li>Guarda la clase</li>
                        </ul>
                        <div class="info-box warning">
                            <div class="info-content">
                                <p><strong>MUY IMPORTANTE:</strong> Las clases se crean SOLO aqui en Apple School Manager. NO las crees en Jamf manualmente o habra duplicados.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>Verificar sincronizacion con Jamf</h4>
                    <div class="step-details">
                        <p>En Jamf School: <strong>Users -> Classes</strong></p>
                        <ul>
                            <li>Deberias ver las clases creadas en ASM</li>
                            <li>La sincronizacion puede tardar hasta 24 horas</li>
                            <li>Si no aparecen, ve a Settings -> Apple School Manager -> Sync now</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Verificar que los iPads estan supervisados</h4>
                    <div class="step-details">
                        <p>En Jamf School: <strong>Devices -> Mobile Devices</strong></p>
                        <ul>
                            <li>Busca cualquier iPad de alumnos</li>
                            <li>Verifica que en "Supervised" ponga "Yes"</li>
                            <li>Si pone "No", el iPad no funcionara con la app Aula</li>
                        </ul>
                        <div class="info-box">
                            <div class="info-content">
                                <p><strong>Importante:</strong> Solo los iPads supervisados (configurados desde Apple School Manager + Jamf) funcionan con la app Aula. Los iPads configurados manualmente NO funcionaran.</p>
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
                            <li><strong>Opcion 1 (manual):</strong> Los profesores la descargan desde el App Store</li>
                            <li><strong>Opcion 2 (recomendada):</strong> La distribuyes automaticamente desde Jamf</li>
                        </ul>
                        <p><strong>Para distribuirla desde Jamf:</strong></p>
                        <ol>
                            <li>Apps -> Mobile Device Apps -> + Add</li>
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
                    <h4>Verificar configuracion de red WiFi</h4>
                    <div class="step-details">
                        <p>Requisitos de red para que la app Aula funcione:</p>
                        <ul>
                            <li><i class="ri-close-circle-line"></i> NO debe haber aislamiento de clientes (client isolation)</li>
                            <li><i class="ri-check-line"></i> Multicast debe estar habilitado</li>
                            <li><i class="ri-check-line"></i> Puertos necesarios abiertos (ver documentacion de Apple)</li>
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
                        <p>Organiza una sesion de formacion para los profesores:</p>
                        <ul>
                            <li>Muestrales como abrir la app Aula</li>
                            <li>Explica las acciones basicas: ver pantallas, bloquear, abrir apps</li>
                            <li>Resuelve dudas y problemas comunes</li>
                            <li>Proporciona una guia rapida (puedes imprimir esta seccion)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <h3>Verificacion final (checklist)</h3>
        <div class="info-box">
            <div class="info-content">
                <ul>
                    <li><i class="ri-checkbox-line"></i> Clases creadas en Apple School Manager</li>
                    <li><i class="ri-checkbox-line"></i> Clases sincronizadas en Jamf School</li>
                    <li><i class="ri-checkbox-line"></i> iPads de alumnos supervisados</li>
                    <li><i class="ri-checkbox-line"></i> App Aula instalada en dispositivos de profesores</li>
                    <li><i class="ri-checkbox-line"></i> Red WiFi configurada correctamente</li>
                    <li><i class="ri-checkbox-line"></i> Bluetooth habilitado en todos los dispositivos</li>
                    <li><i class="ri-checkbox-line"></i> Profesores formados en el uso basico</li>
                </ul>
            </div>
        </div>
    `
};

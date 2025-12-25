/** @module KnowledgeAulaAdvanced - Aula Advanced Guides @version 2.0.0 */

/** Aula advanced features guide */
export const advanced = {
    title: 'Funciones Avanzadas de la app Aula',
    icon: '<i class="ri-rocket-line"></i>',
    tag: 'Avanzado',
    time: '15 min',
    content: `
        <h2><i class="ri-rocket-line"></i> Funciones Avanzadas de la app Aula</h2>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
            <div class="info-content">
                <h4>Mas alla de lo basico</h4>
                <p>Ademas de ver pantallas y bloquear iPads, la app Aula tiene muchas mas funciones utiles para el dia a dia en el aula.</p>
            </div>
        </div>

        <h3>Ocultar la app actual</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Para que sirve?</strong> Minimiza la app que estan usando los alumnos sin bloquear completamente el iPad.</p>
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
                <p><strong>Para que sirve?</strong> Enviar documentos, fotos o archivos a todos los iPads de la clase a la vez.</p>
                <p><strong>Pasos:</strong></p>
                <ol>
                    <li>Selecciona los alumnos que recibiran el archivo</li>
                    <li>Toca el boton <strong>"Compartir"</strong> (icono de compartir)</li>
                    <li>Selecciona <strong>"AirDrop"</strong></li>
                    <li>Elige el archivo desde Fotos, Archivos, etc.</li>
                    <li>El archivo se envia a todos los seleccionados</li>
                </ol>
                <p><strong>Util para:</strong> Repartir material de clase, plantillas, rubricas, etc.</p>
            </div>
        </div>

        <h3>Proyectar con AirPlay a Apple TV</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Para que sirve?</strong> Mostrar la pantalla de un alumno en el proyector del aula.</p>
                <p><strong>Opcion 1 - Mostrar TU pantalla:</strong></p>
                <ol>
                    <li>Abre Centro de Control (desliza desde arriba-derecha)</li>
                    <li>Toca "Duplicar pantalla"</li>
                    <li>Selecciona el Apple TV del aula</li>
                </ol>
                <p><strong>Opcion 2 - Mostrar la pantalla de UN ALUMNO:</strong></p>
                <ol>
                    <li>Selecciona al alumno en Aula</li>
                    <li>Toca "Ver pantalla" para verlo en tu iPad</li>
                    <li>Con tu iPad proyectado al Apple TV, toda la clase lo vera</li>
                </ol>
                <p><strong>Opcion 3 - El alumno proyecta directamente:</strong></p>
                <ol>
                    <li>Selecciona al alumno en Aula</li>
                    <li>Toca "AirPlay" y elige el Apple TV</li>
                    <li>El iPad del alumno proyectara directamente</li>
                </ol>
            </div>
        </div>

        <h3>Restablecer contrasena de Apple ID</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Para que sirve?</strong> Si un alumno olvida su contrasena, puedes resetearla sin llamar a IT.</p>
                <p><strong>Pasos:</strong></p>
                <ol>
                    <li>Selecciona al alumno en la app Aula</li>
                    <li>Toca <strong>"Restablecer contrasena"</strong></li>
                    <li>Se genera una contrasena temporal</li>
                    <li>Disela al alumno verbalmente</li>
                    <li>El alumno la cambiara al iniciar sesion</li>
                </ol>
                <p><strong>Importante:</strong> Solo funciona con Apple IDs gestionados (creados en ASM), no con Apple IDs personales.</p>
            </div>
        </div>

        <h3>Crear grupos dentro de la clase</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Para que sirve?</strong> Gestionar subconjuntos de alumnos para actividades diferenciadas.</p>
                <p><strong>Pasos:</strong></p>
                <ol>
                    <li>Manten pulsado en un alumno y arrastra para seleccionar varios</li>
                    <li>Toca <strong>"Crear grupo"</strong></li>
                    <li>Pon nombre al grupo (ej: "Mesa 1", "Nivel avanzado")</li>
                    <li>El grupo se guarda para futuras sesiones</li>
                </ol>
                <p><strong>Ejemplos de uso:</strong></p>
                <ul>
                    <li>"Grupo A" trabaja en Pages mientras "Grupo B" ve un video</li>
                    <li>"Refuerzo" recibe atencion individual</li>
                    <li>Trabajos por equipos de proyecto</li>
                </ul>
            </div>
        </div>

        <h3>Ver resumen de actividad</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Para que sirve?</strong> Al finalizar la clase, ver que apps usaron los alumnos.</p>
                <p><strong>Que muestra:</strong></p>
                <ul>
                    <li>Apps mas utilizadas durante la clase</li>
                    <li>Tiempo aproximado en cada app por alumno</li>
                    <li>Webs visitadas (si usaron Safari)</li>
                    <li>Alertas o incidencias</li>
                </ul>
                <p><strong>Util para:</strong> Identificar alumnos que no estuvieron en la tarea, seguimiento del uso de tecnologia.</p>
            </div>
        </div>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-information-line"></i></div>
            <div class="info-content">
                <h4>Limite recomendado: 60 estudiantes</h4>
                <p>Apple recomienda un maximo de 60 alumnos por clase para un rendimiento optimo. Si tienes clases mas grandes, considera dividirlas en grupos en ASM.</p>
            </div>
        </div>
    `
};

/**
 * Aula remote/hybrid classes guide
 * @type {GuideContent}
 */
export const remotehybrid = {
    title: 'Clases Remotas e Hibridas con Aula',
    icon: '<i class="ri-global-line"></i>',
    tag: 'Remoto',
    time: '10 min',
    content: `
        <h2><i class="ri-global-line"></i> Clases Remotas e Hibridas con Aula</h2>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-home-wifi-line"></i></div>
            <div class="info-content">
                <h4>La app Aula funciona tambien a distancia</h4>
                <p>No solo sirve cuando todos estan en el aula fisica. Tambien puedes gestionar iPads de alumnos que estan en casa.</p>
            </div>
        </div>

        <h3>Tipos de clases</h3>

        <div class="info-box">
            <div class="info-content">
                <h4><i class="ri-building-line"></i> Clases presenciales (modo normal)</h4>
                <ul>
                    <li>Todos en la misma aula fisica</li>
                    <li>Conexion por Bluetooth + WiFi</li>
                    <li>Distancia maxima: 10-15 metros</li>
                    <li>Maximo rendimiento y velocidad</li>
                </ul>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4><i class="ri-home-line"></i> Clases remotas</h4>
                <ul>
                    <li>Alumnos en casa, profesor en el centro (o viceversa)</li>
                    <li>Conexion a traves de Internet (no necesita Bluetooth)</li>
                    <li>Los alumnos deben aceptar unirse cuando se les invite</li>
                    <li>Algunas funciones pueden tener mas latencia</li>
                </ul>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4><i class="ri-group-line"></i> Clases hibridas</h4>
                <ul>
                    <li>Algunos alumnos presenciales, otros remotos</li>
                    <li>Combina ambos modos automaticamente</li>
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
                    <li><i class="ri-check-line"></i> Conexion a Internet estable (profesor y alumnos)</li>
                </ul>
            </div>
        </div>

        <h3>Como funciona en remoto</h3>
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
                        <p>Los alumnos remotos recibiran una notificacion en sus iPads para unirse</p>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Los alumnos aceptan</h4>
                    <div class="step-details">
                        <p>Deben tocar "Unirse" cuando vean la invitacion</p>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>Gestiona normalmente</h4>
                    <div class="step-details">
                        <p>Puedes ver pantallas, abrir apps, bloquear, etc. (con algo mas de latencia)</p>
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
};

/**
 * Aula with Shared iPad guide
 * @type {GuideContent}
 */
export const sharedipad = {
    title: 'Aula con iPad Compartido (Shared iPad)',
    icon: '<i class="ri-group-2-line"></i>',
    tag: 'Configuracion',
    time: '10 min',
    content: `
        <h2><i class="ri-group-2-line"></i> Aula con iPad Compartido (Shared iPad)</h2>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-user-shared-line"></i></div>
            <div class="info-content">
                <h4>Que es Shared iPad?</h4>
                <p>Un modo donde varios alumnos pueden usar el mismo iPad fisico, cada uno con su propia cuenta y datos separados.</p>
            </div>
        </div>

        <h3>Como funciona</h3>
        <div class="info-box">
            <div class="info-content">
                <ul>
                    <li><strong>Un iPad, multiples usuarios:</strong> El alumno selecciona su foto e inicia sesion con su Apple ID gestionado</li>
                    <li><strong>Datos separados:</strong> Cada alumno tiene sus propias apps, documentos y configuracion</li>
                    <li><strong>Ideal para centros con menos iPads que alumnos:</strong> Los iPads se comparten entre diferentes clases y turnos</li>
                </ul>
            </div>
        </div>

        <h3>Como funciona Aula con Shared iPad</h3>
        <div class="info-box">
            <div class="info-content">
                <ol>
                    <li>El alumno inicia sesion en el iPad compartido</li>
                    <li>La app Aula detecta <strong>que alumno</strong> esta usando el iPad</li>
                    <li>El profesor ve el <strong>nombre del alumno</strong>, no el nombre del iPad</li>
                    <li>Todas las funciones de Aula funcionan normalmente</li>
                </ol>
            </div>
        </div>

        <h3>Ventajas para profesores</h3>
        <div class="info-box">
            <div class="info-content">
                <ul>
                    <li><i class="ri-check-line"></i> Ves quien esta en cada iPad (aunque sea compartido)</li>
                    <li><i class="ri-check-line"></i> Las restricciones se aplican al usuario, no al dispositivo</li>
                    <li><i class="ri-check-line"></i> Los datos del alumno le siguen a cualquier iPad</li>
                    <li><i class="ri-check-line"></i> Funciona igual que con iPads individuales</li>
                </ul>
            </div>
        </div>

        <h3>Configuracion (para IT)</h3>
        <div class="info-box warning">
            <div class="info-icon"><i class="ri-settings-3-line"></i></div>
            <div class="info-content">
                <h4>Requisitos de configuracion</h4>
                <ol>
                    <li><strong>En ASM:</strong> Los iPads deben estar en un grupo de Shared iPad</li>
                    <li><strong>En Jamf:</strong> Configurar PreStage con Shared iPad habilitado</li>
                    <li><strong>Almacenamiento:</strong> Definir cuantos usuarios caben (depende del espacio)</li>
                    <li><strong>Apple IDs:</strong> Todos los alumnos necesitan Apple IDs gestionados</li>
                </ol>
                <p><strong>Almacenamiento recomendado:</strong></p>
                <ul>
                    <li>32GB: 2-3 usuarios maximo</li>
                    <li>64GB: 5-8 usuarios</li>
                    <li>128GB+: 10+ usuarios</li>
                </ul>
            </div>
        </div>

        <div class="info-box">
            <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
            <div class="info-content">
                <h4>Escenario tipico</h4>
                <p>El centro tiene 30 iPads para 120 alumnos. Con Shared iPad, cada iPad puede ser usado por 4 alumnos diferentes (de diferentes clases/turnos). Cada alumno inicia sesion con su cuenta y encuentra sus apps y trabajos exactamente como los dejo.</p>
            </div>
        </div>
    `
};

/**
 * Aula troubleshooting guide
 * @type {GuideContent}
 */
export const troubleshoot = {
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
                            <li>En tu iPad/Mac: Verifica que Bluetooth este activado (Ajustes -> Bluetooth)</li>
                            <li>En los iPads de los alumnos: Verifica que Bluetooth este activado</li>
                            <li>Si esta desactivado en muchos iPads, pide a IT que lo active desde Jamf con un comando masivo</li>
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
                            <li>Verifica que todos estais conectados a la WiFi del centro (no a datos moviles ni WiFi personal)</li>
                            <li>A veces las redes WiFi tienen "aislamiento de clientes" activado, lo que impide que los dispositivos se vean entre si. Contacta con IT si sospechas que es esto.</li>
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
                            <li>Si no ves tu clase en la lista, contacta con IT (puede que no este sincronizada desde Apple School Manager)</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>Verificar que los alumnos aceptaron la invitacion</h4>
                    <div class="step-details">
                        <p>Los alumnos deben aceptar tu invitacion la primera vez.</p>
                        <ul>
                            <li>Preguntales si vieron una notificacion "[Tu nombre] quiere gestionar tu iPad" y si la aceptaron</li>
                            <li>Si la rechazaron por error, cierra y vuelve a abrir la app Aula para enviar la invitacion de nuevo</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">5</div>
                <div class="step-content">
                    <h4>Forzar sincronizacion desde Jamf (para IT)</h4>
                    <div class="step-details">
                        <p>Si el problema persiste, IT puede forzar una sincronizacion:</p>
                        <ul>
                            <li>En Jamf: Devices -> selecciona los iPads -> Actions -> Send Blank Push</li>
                            <li>Esto fuerza a los iPads a comunicarse con Jamf y actualizar su configuracion</li>
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
                    <li>Los iPads no estan supervisados (solo IT puede verificar esto en Jamf)</li>
                    <li>Hay un problema de red (contacta con IT)</li>
                    <li>Los alumnos rechazaron el permiso de "Observar pantalla" (vuelve a enviar la invitacion)</li>
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
                    <li>Verifica que tu dispositivo tiene suficiente bateria y memoria disponible</li>
                    <li>Si persiste, contacta con IT para que verifiquen la configuracion de red</li>
                </ul>
            </div>
        </div>

        <h3><i class="ri-close-circle-line"></i> Problema: "No aparece mi clase en la app Aula"</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Causas y soluciones:</strong></p>
                <ul>
                    <li><strong>La clase no esta creada en Apple School Manager:</strong> Contacta con IT para que la creen</li>
                    <li><strong>No estas asignado como profesor de esa clase:</strong> Contacta con IT para que te asignen</li>
                    <li><strong>La sincronizacion esta pendiente:</strong> Espera unas horas y vuelve a intentarlo (puede tardar hasta 24h)</li>
                </ul>
            </div>
        </div>

        <h3><i class="ri-close-circle-line"></i> Problema: "Los alumnos pueden salir de la app aunque la haya limitado"</h3>
        <div class="info-box">
            <div class="info-content">
                <p><strong>Causas y soluciones:</strong></p>
                <ul>
                    <li>Los iPads no estan supervisados (contacta con IT)</li>
                    <li>No aplicaste correctamente la limitacion de app (verifica que seleccionaste todos los iPads antes de aplicar la limitacion)</li>
                    <li>Hay un problema de sincronizacion (cierra y vuelve a abrir la app Aula)</li>
                </ul>
            </div>
        </div>

        <div class="info-box success">
            <div class="info-icon"><i class="ri-question-line"></i></div>
            <div class="info-content">
                <h4>Algo mas no funciona?</h4>
                <p>Contacta con el personal IT del centro. Proporciona detalles:</p>
                <ul>
                    <li>Que clase estas intentando gestionar</li>
                    <li>Que accion no funciona (ver pantallas, bloquear, etc.)</li>
                    <li>Cuantos iPads estan afectados (todos, solo algunos, uno concreto)</li>
                    <li>Si el problema ocurre siempre o solo a veces</li>
                </ul>
            </div>
        </div>
    `
};

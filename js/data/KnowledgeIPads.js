/**
 * JAMF ASSISTANT - Knowledge Base iPads
 * Guias de gestion de iPads
 *
 * @module KnowledgeIPads
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
 * iPad enrollment guide
 * @type {GuideContent}
 */
export const enrollment = {
    title: 'Inscribir iPads en Jamf',
    icon: '<i class="ri-tablet-line"></i>',
    tag: 'Configuracion',
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
                            <li>Ve a Dispositivos -> busca el numero de serie del iPad</li>
                            <li>Verifica que este asignado a tu servidor MDM (Jamf School)</li>
                            <li>Si no aparece, contacta con tu proveedor para que lo anada al programa DEP</li>
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
                            <li>Ajustes -> General -> Transferir o Restablecer iPad</li>
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
                        <p>Durante el asistente de configuracion:</p>
                        <ul>
                            <li>Conecta a la red WiFi del centro</li>
                            <li>Espera unos segundos mientras el iPad se comunica con Apple</li>
                            <li>Aparecera automaticamente la pantalla de "Configuracion remota"</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>Aceptar perfil de gestion</h4>
                    <div class="step-details">
                        <p>El iPad mostrara el perfil de tu organizacion:</p>
                        <ul>
                            <li>Muestra el nombre de tu centro educativo</li>
                            <li>Pulsa "Siguiente" para aceptar</li>
                            <li>El dispositivo descargara automaticamente la configuracion desde Jamf</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">5</div>
                <div class="step-content">
                    <h4>Completar configuracion</h4>
                    <div class="step-details">
                        <p>Continua el asistente de configuracion:</p>
                        <ul>
                            <li>El iPad se configurara automaticamente con las apps y restricciones</li>
                            <li>Puede tardar 5-15 minutos en instalarse todo el software</li>
                            <li>No es necesario que el alumno inicie sesion con Apple ID si usas configuracion compartida</li>
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
                            <li>Devices -> Mobile Devices -> Search</li>
                            <li>Busca por nombre o numero de serie</li>
                            <li>Deberia aparecer como "Managed" (Gestionado)</li>
                            <li>Verifica que este en el grupo correcto (ej: "1 ESO")</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-alert-line"></i></div>
            <div class="info-content">
                <h4>Si el iPad no muestra "Configuracion remota"</h4>
                <p>Posibles causas:</p>
                <ul>
                    <li>No esta dado de alta en Apple School Manager</li>
                    <li>No esta asignado al servidor de Jamf en ASM</li>
                    <li>El proveedor no lo anadio al programa DEP</li>
                </ul>
                <p>Solucion: Verifica en <code>school.apple.com</code> -> Dispositivos</p>
            </div>
        </div>
    `
};

/**
 * iPad apps installation guide
 * @type {GuideContent}
 */
export const apps = {
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
                        <p>Accede a <code>school.apple.com</code> -> Apps y libros</p>
                        <ul>
                            <li>Busca la app que quieres instalar</li>
                            <li>Verifica que tengas licencias disponibles</li>
                            <li>Si es una app gratuita, obtenla desde aqui</li>
                            <li>Si es de pago, comprala con la cuenta del centro</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>Anadir app en Jamf</h4>
                    <div class="step-details">
                        <p>En Jamf School: <strong>Apps -> Mobile Device Apps -> + Add</strong></p>
                        <ul>
                            <li>Busca la app por nombre (ej: "Keynote")</li>
                            <li>Selecciona la version correcta</li>
                            <li>La app debe estar en Apple School Manager para que aparezca aqui</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Configurar distribucion</h4>
                    <div class="step-details">
                        <p>Elige como se instalara la app:</p>
                        <ul>
                            <li><strong>Install Automatically</strong>: Se instala automaticamente en todos los iPads del grupo. Ideal para apps esenciales.</li>
                            <li><strong>Make Available in Self Service</strong>: El alumno puede instalarla si quiere desde la app Self Service.</li>
                            <li><strong>Available in Teacher</strong>: El profesor decide cuando instalarla usando Jamf Teacher. Ideal para apps especificas de una asignatura.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>Definir Scope (a quien va dirigida)</h4>
                    <div class="step-details">
                        <p>Selecciona los iPads que recibiran la app:</p>
                        <ul>
                            <li><strong>All Mobile Devices</strong>: Todos los iPads del centro</li>
                            <li><strong>Smart Group especifico</strong>: Por ejemplo "iPads 1 ESO" o "iPads Primaria"</li>
                            <li><strong>Dispositivos individuales</strong>: iPads concretos</li>
                        </ul>
                        <div class="info-box">
                            <div class="info-content">
                                <p><strong>Recomendacion:</strong> Usa Smart Groups para organizar por curso/ciclo. Asi cuando anades un iPad nuevo al grupo, recibe automaticamente todas las apps.</p>
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
                        <p>Pulsa <strong>Save</strong> y la app comenzara a distribuirse.</p>
                        <ul>
                            <li>Los iPads encendidos y conectados a WiFi la recibiran en 5-15 minutos</li>
                            <li>Los iPads apagados la recibiran al encenderlos</li>
                            <li>Puedes ver el progreso en Jamf: Apps -> [App] -> Status</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-alert-line"></i></div>
            <div class="info-content">
                <h4>Importante sobre licencias</h4>
                <p>Las licencias de apps se asignan y liberan automaticamente:</p>
                <ul>
                    <li>Cuando instalas una app en un iPad, se usa una licencia</li>
                    <li>Cuando desinstalas la app o borras el iPad, la licencia se libera</li>
                    <li>Si no tienes licencias suficientes, la app no se instalara</li>
                </ul>
            </div>
        </div>
    `
};

/**
 * iPad restrictions guide
 * @type {GuideContent}
 */
export const restrictions = {
    title: 'Perfiles de Restriccion',
    icon: '<i class="ri-shield-keyhole-line"></i>',
    tag: 'Seguridad',
    time: '15 min',
    steps: 10,
    content: `
        <h2><i class="ri-lock-2-line"></i> Perfiles de Restriccion</h2>
        <p>Los perfiles de restriccion permiten controlar que pueden o no pueden hacer los alumnos con sus iPads, segun su edad o curso.</p>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-alert-line"></i></div>
            <div class="info-content">
                <h4>Importante</h4>
                <p>Los perfiles de restriccion se aplican inmediatamente a los iPads. Planifica bien antes de desplegar para evitar bloquear funciones que los profesores necesitan.</p>
            </div>
        </div>

        <h3>Restricciones recomendadas por edad:</h3>

        <div class="info-box">
            <div class="info-content">
                <h4>Primaria (6-12 anos)</h4>
                <p><strong>Enfoque:</strong> Control total para proteger a los menores</p>
                <ul>
                    <li><i class="ri-close-circle-line"></i> Safari deshabilitado (usar navegador controlado como Jamf Parent o filtros de contenido)</li>
                    <li><i class="ri-close-circle-line"></i> App Store deshabilitado (las apps las instala IT o el profesor)</li>
                    <li><i class="ri-close-circle-line"></i> AirDrop solo para contactos</li>
                    <li><i class="ri-close-circle-line"></i> Cambio de fondo de pantalla bloqueado</li>
                    <li><i class="ri-close-circle-line"></i> Siri deshabilitado o con restricciones</li>
                    <li><i class="ri-check-line"></i> Contenido explicito bloqueado (musica, peliculas, apps)</li>
                    <li><i class="ri-check-line"></i> Compras in-app bloqueadas</li>
                </ul>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>ESO (12-16 anos)</h4>
                <p><strong>Enfoque:</strong> Mas libertad, pero con filtros de contenido</p>
                <ul>
                    <li><i class="ri-check-line"></i> Safari permitido con filtro de contenido activado</li>
                    <li><i class="ri-close-circle-line"></i> App Store deshabilitado (control de IT)</li>
                    <li><i class="ri-close-circle-line"></i> Contenido explicito bloqueado</li>
                    <li><i class="ri-check-line"></i> AirDrop permitido (util para compartir trabajos)</li>
                    <li><i class="ri-check-line"></i> Siri permitido</li>
                    <li><i class="ri-check-line"></i> Pueden cambiar el fondo de pantalla</li>
                    <li><i class="ri-close-circle-line"></i> Compras in-app bloqueadas</li>
                </ul>
            </div>
        </div>

        <div class="info-box">
            <div class="info-content">
                <h4>Bachillerato (16-18 anos)</h4>
                <p><strong>Enfoque:</strong> Mayor autonomia responsable</p>
                <ul>
                    <li><i class="ri-check-line"></i> Safari permitido con filtros basicos</li>
                    <li><i class="ri-check-line"></i> AirDrop permitido</li>
                    <li><i class="ri-check-line"></i> Siri permitido</li>
                    <li><i class="ri-close-circle-line"></i> App Store deshabilitado (opcional, segun politica del centro)</li>
                    <li><i class="ri-close-circle-line"></i> Compras in-app bloqueadas</li>
                </ul>
            </div>
        </div>

        <h3>Como crear un perfil de restriccion en Jamf:</h3>
        <div class="steps-container">
            <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <h4>Crear nuevo perfil</h4>
                    <div class="step-details">
                        <p>En Jamf School: <strong>Configuration Profiles -> + New -> Mobile Device -> Restrictions</strong></p>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <h4>Seleccionar restricciones</h4>
                    <div class="step-details">
                        <p>Marca las opciones que quieres restringir segun la edad/curso</p>
                        <ul>
                            <li>Apps: App Store, Safari, Camara, etc.</li>
                            <li>Funcionalidad: AirDrop, Siri, etc.</li>
                            <li>Contenido: Peliculas, musica, apps por edad</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <h4>Asignar a un grupo</h4>
                    <div class="step-details">
                        <p>Scope -> selecciona el Smart Group correspondiente</p>
                        <p>Ejemplo: "iPads Primaria", "iPads 1-2 ESO", etc.</p>
                    </div>
                </div>
            </div>

            <div class="step">
                <div class="step-number">4</div>
                <div class="step-content">
                    <h4>Guardar y desplegar</h4>
                    <div class="step-details">
                        <p>El perfil se aplicara automaticamente en los proximos minutos</p>
                        <p>Los alumnos notaran que ciertas apps/funciones ya no estan disponibles</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-box warning">
            <div class="info-icon"><i class="ri-alert-line"></i></div>
            <div class="info-content">
                <h4>Consejo para profesores</h4>
                <p>Informa a los profesores de las restricciones aplicadas. Si un profesor necesita que los alumnos usen Safari para una actividad y esta bloqueado, puede usar la app Aula para abrir una web concreta en todos los iPads (esto si funciona aunque Safari este restringido).</p>
            </div>
        </div>
    `
};

/**
 * Complete iPads module as a combined object for backwards compatibility
 * @type {Object}
 */
export const ipads = {
    enrollment,
    apps,
    restrictions
};

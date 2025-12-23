/**
 * JAMF ASSISTANT - Diagnostics Module
 * Flujos de diagnóstico guiado para problemas comunes
 */

const Diagnostics = {
    'aula-no-funciona': {
        title: 'La app Aula (Classroom) no funciona',
        icon: '<i class="ri-graduation-cap-line"></i>',
        steps: [
            {
                question: '¿Tienes el Bluetooth activado en tu iPad?',
                options: [
                    { text: 'Sí', next: 1 },
                    { text: 'No', solution: 'activar-bluetooth' }
                ]
            },
            {
                question: '¿Estás conectado a la misma red WiFi que tus alumnos?',
                options: [
                    { text: 'Sí, misma red', next: 2 },
                    { text: 'No o no estoy seguro', solution: 'misma-red-wifi' }
                ]
            },
            {
                question: '¿Ves tu clase cuando abres la app Aula?',
                options: [
                    { text: 'Sí, veo mi clase', next: 3 },
                    { text: 'No veo mi clase', solution: 'verificar-asm' }
                ]
            },
            {
                question: '¿Los alumnos aparecen en la lista pero están en gris o no responden?',
                options: [
                    { text: 'Sí, están en gris', solution: 'alumnos-gris' },
                    { text: 'No aparecen en absoluto', solution: 'no-aparecen-alumnos' }
                ]
            }
        ],
        solutions: {
            'activar-bluetooth': {
                title: '<i class="ri-bluetooth-connect-line"></i> Activar Bluetooth',
                content: `
                    <p>La app Aula necesita Bluetooth para encontrar los iPads de tus alumnos cercanos.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>Abre <strong>Ajustes</strong> en tu iPad</li>
                        <li>Toca <strong>Bluetooth</strong></li>
                        <li>Activa el interruptor para encenderlo</li>
                        <li>Vuelve a abrir la app Aula</li>
                    </ol>
                    <p><strong>Nota:</strong> El Bluetooth debe estar siempre activado mientras usas Aula.</p>
                `
            },
            'misma-red-wifi': {
                title: '<i class="ri-wifi-line"></i> Conectarse a la misma red WiFi',
                content: `
                    <p>Todos los iPads (profesor y alumnos) deben estar en la misma red WiFi.</p>
                    <h4>Cómo verificarlo:</h4>
                    <ol>
                        <li>En tu iPad: <strong>Ajustes → WiFi</strong></li>
                        <li>Mira el nombre de la red conectada (tiene una ✓)</li>
                        <li>Verifica que los iPads de los alumnos están en la misma red</li>
                        <li>Si no coinciden, conéctate a la red correcta</li>
                    </ol>
                    <p><strong>Importante:</strong> Evita redes WiFi de invitados, ya que a veces tienen restricciones.</p>
                `
            },
            'verificar-asm': {
                title: '<i class="ri-cloud-line"></i> Verificar Apple School Manager',
                content: `
                    <p>Si no ves tu clase, puede que no esté configurada correctamente en el sistema.</p>
                    <h4>El flujo correcto es: ASM → Jamf School → Dispositivos</h4>

                    <h4>Pasos para IT/Admin:</h4>
                    <ol>
                        <li><strong>En Apple School Manager (ASM):</strong>
                            <ul>
                                <li>Ve a <strong>Clases</strong></li>
                                <li>Verifica que la clase existe con el profesor y alumnos correctos</li>
                                <li>Comprueba que está asignada al servidor MDM (Jamf)</li>
                            </ul>
                        </li>
                        <li><strong>En Jamf School:</strong>
                            <ul>
                                <li>Ve a <strong>Users → Classes</strong></li>
                                <li>Busca la clase y verifica que el profesor está asignado</li>
                                <li>Comprueba que los alumnos/dispositivos están en la clase</li>
                            </ul>
                        </li>
                        <li>Espera 15-30 minutos para que sincronice</li>
                        <li>El profesor debe cerrar y abrir la app Aula</li>
                    </ol>

                    <h4>Si eres profesor:</h4>
                    <p>Contacta al departamento IT para que verifiquen la configuración en ASM y Jamf.</p>
                `
            },
            'alumnos-gris': {
                title: '<i class="ri-refresh-line"></i> Alumnos aparecen en gris',
                content: `
                    <p>Si ves a los alumnos pero están en gris, significa que están fuera de alcance o no sincronizados.</p>
                    <h4>Solución inmediata (para profesores):</h4>
                    <ol>
                        <li>Verifica que los alumnos tienen sus iPads encendidos</li>
                        <li>Comprueba que están cerca (Bluetooth tiene alcance limitado)</li>
                        <li>Pide a los alumnos que verifiquen que tienen WiFi y Bluetooth activados</li>
                        <li>Cierra completamente la app Aula y vuelve a abrirla</li>
                    </ol>

                    <h4>Solución técnica (IT/Admin):</h4>
                    <ol>
                        <li>En Jamf, selecciona los dispositivos afectados</li>
                        <li>Click en <strong>Actions → Send Blank Push</strong></li>
                        <li>Esto fuerza una sincronización inmediata</li>
                        <li>Espera 2-3 minutos y pide al profesor que vuelva a abrir Aula</li>
                    </ol>

                    <p><strong>Causa común:</strong> Los iPads de alumnos no han sincronizado recientemente con Jamf.</p>
                `
            },
            'no-aparecen-alumnos': {
                title: '<i class="ri-eye-off-line"></i> Los alumnos no aparecen',
                content: `
                    <p>Si los alumnos no aparecen en absoluto en la lista, hay un problema de configuración.</p>

                    <h4>Para IT/Admin - Verificar el flujo completo:</h4>

                    <h5>1. Apple School Manager (ASM):</h5>
                    <ol>
                        <li>Accede a <strong>ASM → Clases</strong></li>
                        <li>Verifica que la clase existe</li>
                        <li>Comprueba que los alumnos están matriculados en la clase</li>
                        <li>Verifica que la clase está asignada al servidor MDM correcto</li>
                    </ol>

                    <h5>2. Jamf School:</h5>
                    <ol>
                        <li>Ve a <strong>Users → Classes</strong></li>
                        <li>Encuentra la clase y ábrela</li>
                        <li>Verifica que aparecen todos los alumnos/dispositivos</li>
                        <li>Comprueba que el profesor está asignado correctamente</li>
                    </ol>

                    <h5>3. Dispositivos de alumnos:</h5>
                    <ol>
                        <li>En Jamf: <strong>Devices → Mobile Devices</strong></li>
                        <li>Busca los iPads de los alumnos afectados</li>
                        <li>Verifica que están "Managed" (gestionados)</li>
                        <li>Comprueba que el perfil de Classroom está instalado</li>
                        <li>Envía un <strong>Blank Push</strong> para forzar sincronización</li>
                    </ol>

                    <h4>Si eres profesor:</h4>
                    <p>Contacta al departamento IT con esta información:</p>
                    <ul>
                        <li>Nombre de tu clase</li>
                        <li>Nombres de los alumnos que no aparecen</li>
                        <li>Si el problema es con todos los alumnos o solo algunos</li>
                    </ul>
                `
            }
        }
    },

    'apps-not-installing': {
        title: 'Las apps no se instalan',
        icon: '<i class="ri-download-cloud-2-line"></i>',
        steps: [
            {
                question: '¿La app está disponible en Apple School Manager (ASM)?',
                options: [
                    { text: 'Sí, está en ASM', next: 1 },
                    { text: 'No o no estoy seguro', solution: 'verificar-asm-app' }
                ]
            },
            {
                question: '¿El iPad aparece como "Managed" (gestionado) en Jamf?',
                options: [
                    { text: 'Sí, está managed', next: 2 },
                    { text: 'No o no estoy seguro', solution: 'enrollment' }
                ]
            },
            {
                question: '¿La app está asignada al dispositivo o a un Smart Group que lo incluya?',
                options: [
                    { text: 'Sí', next: 3 },
                    { text: 'No', solution: 'scope' }
                ]
            },
            {
                question: '¿Hay licencias VPP disponibles para la app?',
                options: [
                    { text: 'Sí hay licencias', next: 4 },
                    { text: 'No hay licencias', solution: 'licenses' },
                    { text: 'No sé cómo comprobarlo', solution: 'check-licenses' }
                ]
            },
            {
                question: '¿El iPad tiene conexión a Internet estable?',
                options: [
                    { text: 'Sí', next: 5 },
                    { text: 'No o inestable', solution: 'network' }
                ]
            },
            {
                question: '¿Cuánto tiempo ha pasado desde que asignaste la app?',
                options: [
                    { text: 'Menos de 30 minutos', solution: 'wait' },
                    { text: 'Más de 30 minutos', solution: 'force-sync' }
                ]
            }
        ],
        solutions: {
            'verificar-asm-app': {
                title: '<i class="ri-cloud-line"></i> Verificar app en ASM',
                content: `
                    <p>El flujo correcto es: <strong>ASM → Jamf School → Dispositivos</strong></p>
                    <p>Antes de que una app pueda instalarse, debe estar en Apple School Manager.</p>

                    <h4>Pasos para IT/Admin:</h4>
                    <ol>
                        <li>Accede a <strong>Apple School Manager</strong></li>
                        <li>Ve a <strong>Apps y Libros</strong></li>
                        <li>Busca la app que necesitas</li>
                        <li>Si no está:
                            <ul>
                                <li>Haz click en el botón <strong>+</strong> para añadirla</li>
                                <li>Busca la app en el App Store</li>
                                <li>Compra las licencias necesarias (pueden ser gratuitas)</li>
                            </ul>
                        </li>
                        <li>Una vez en ASM, ve a Jamf:
                            <ul>
                                <li><strong>Settings → VPP → Sync</strong></li>
                                <li>Espera a que sincronice (puede tardar 5-10 min)</li>
                            </ul>
                        </li>
                        <li>Ahora podrás asignar la app en Jamf</li>
                    </ol>

                    <p><strong>Importante:</strong> Si la app no está en ASM, Jamf no podrá instalarla aunque la configures.</p>
                `
            },
            'enrollment': {
                title: '<i class="ri-alert-line"></i> Problema de inscripción',
                content: `
                    <p>El iPad no está correctamente inscrito (enrolled) en Jamf.</p>
                    <h4>Verificación rápida:</h4>
                    <ol>
                        <li>En el iPad: <strong>Ajustes → General → Gestión de dispositivos</strong></li>
                        <li>Debe aparecer un perfil de gestión MDM</li>
                        <li>Si no aparece, el iPad no está gestionado</li>
                    </ol>

                    <h4>Solución para IT/Admin:</h4>
                    <ol>
                        <li>Verifica el número de serie en <strong>Apple School Manager</strong></li>
                        <li>Comprueba que está asignado a tu servidor Jamf</li>
                        <li>Si es necesario, borra el iPad (Settings → General → Reset)</li>
                        <li>Durante la configuración inicial, el iPad se inscribirá automáticamente</li>
                    </ol>
                `
            },
            'scope': {
                title: '<i class="ri-focus-3-line"></i> Asignar app al dispositivo',
                content: `
                    <p>La app no está asignada a este dispositivo.</p>
                    <h4>Solución en Jamf:</h4>
                    <ol>
                        <li>Ve a <strong>Apps → [Nombre de la app]</strong></li>
                        <li>Click en la pestaña <strong>Scope</strong></li>
                        <li>Añade el dispositivo específico O el Smart Group que lo incluye</li>
                        <li>Click en <strong>Save</strong></li>
                        <li>Espera 10-15 minutos para que se aplique</li>
                    </ol>
                    <p><strong>Tip:</strong> Usa Smart Groups para asignar apps a grupos completos (por ejemplo, "iPads 6º Primaria").</p>
                `
            },
            'licenses': {
                title: '<i class="ri-file-list-3-line"></i> Sin licencias VPP',
                content: `
                    <p>No hay licencias disponibles para esta app.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>Accede a <strong>Apple School Manager (ASM)</strong></li>
                        <li>Ve a <strong>Apps y Libros</strong> → busca la app</li>
                        <li>Compra más licencias (muchas apps educativas son gratuitas)</li>
                        <li>En Jamf: <strong>Settings → VPP → Sync</strong></li>
                        <li>Espera 5-10 minutos para que sincronicen las nuevas licencias</li>
                    </ol>
                    <p><strong>Nota:</strong> Jamf solo puede instalar apps si hay licencias disponibles en ASM.</p>
                `
            },
            'check-licenses': {
                title: '<i class="ri-search-line"></i> Cómo comprobar licencias',
                content: `
                    <h4>En Jamf:</h4>
                    <ol>
                        <li>Ve a <strong>Apps → [Nombre de la app]</strong></li>
                        <li>Mira la sección <strong>VPP Licenses</strong></li>
                        <li>Verás: <strong>Available</strong> (disponibles) vs <strong>Used</strong> (en uso)</li>
                        <li>Si Available = 0, necesitas comprar más licencias en ASM</li>
                    </ol>

                    <h4>Ejemplo:</h4>
                    <p>VPP Licenses: 45 Available / 55 Used (de 100 Total)</p>
                    <p>Esto significa que puedes instalar la app en 45 dispositivos más.</p>
                `
            },
            'network': {
                title: '<i class="ri-wifi-off-line"></i> Problema de conexión',
                content: `
                    <p>El iPad necesita conexión a Internet estable para descargar apps.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>En el iPad: <strong>Ajustes → WiFi</strong></li>
                        <li>Verifica que está conectado (icono ✓)</li>
                        <li>Abre Safari y prueba a cargar una página web</li>
                        <li>Si no funciona:
                            <ul>
                                <li>Toca la (i) junto al nombre de la red</li>
                                <li>Toca <strong>Olvidar esta red</strong></li>
                                <li>Vuelve a conectarte</li>
                            </ul>
                        </li>
                        <li>Verifica que no hay restricciones de firewall bloqueando el App Store</li>
                    </ol>
                `
            },
            'wait': {
                title: '<i class="ri-timer-line"></i> Espera un poco más',
                content: `
                    <p>Las apps pueden tardar hasta 30 minutos en instalarse automáticamente.</p>
                    <h4>Mientras tanto:</h4>
                    <ul>
                        <li>Verifica que el iPad está conectado a WiFi</li>
                        <li>Comprueba que la pantalla está desbloqueada</li>
                        <li>Puedes abrir la <strong>App Store</strong> para ver si aparece la descarga</li>
                    </ul>
                    <p><strong>Proceso normal:</strong></p>
                    <ol>
                        <li>Asignas la app en Jamf</li>
                        <li>Jamf envía un comando al iPad</li>
                        <li>El iPad recibe el comando (puede tardar)</li>
                        <li>La app empieza a descargarse</li>
                    </ol>
                `
            },
            'force-sync': {
                title: '<i class="ri-refresh-line"></i> Forzar sincronización',
                content: `
                    <h4>Desde Jamf (recomendado):</h4>
                    <ol>
                        <li>Ve a <strong>Devices → Mobile Devices</strong></li>
                        <li>Busca el iPad por nombre o número de serie</li>
                        <li>Click en el dispositivo → pestaña <strong>Management</strong></li>
                        <li>Click en <strong>Send Blank Push</strong></li>
                        <li>Espera 5 minutos y verifica en el iPad</li>
                    </ol>

                    <h4>Desde el iPad:</h4>
                    <ol>
                        <li><strong>Ajustes → General → Gestión de dispositivos</strong></li>
                        <li>Toca el perfil de gestión MDM</li>
                        <li>Esto fuerza una sincronización con Jamf</li>
                        <li>Espera unos minutos para que se procese</li>
                    </ol>

                    <p><strong>Nota:</strong> Después de forzar la sincronización, las apps deberían empezar a instalarse en 5-10 minutos.</p>
                `
            }
        }
    },

    'device-not-visible': {
        title: 'Dispositivo no visible en Classroom',
        icon: '<i class="ri-eye-off-line"></i>',
        steps: [
            {
                question: '¿La clase está configurada correctamente en Apple School Manager (ASM)?',
                options: [
                    { text: 'Sí, verificado en ASM', next: 1 },
                    { text: 'No o no estoy seguro', solution: 'verificar-asm-clase' }
                ]
            },
            {
                question: '¿El Bluetooth está activado en ambos dispositivos (profesor y alumnos)?',
                options: [
                    { text: 'Sí', next: 2 },
                    { text: 'No', solution: 'bluetooth' }
                ]
            },
            {
                question: '¿Están todos en la misma red WiFi?',
                options: [
                    { text: 'Sí', next: 3 },
                    { text: 'No', solution: 'wifi' },
                    { text: 'No estoy seguro', solution: 'check-wifi' }
                ]
            },
            {
                question: '¿La clase está configurada en Jamf con profesor y alumnos asignados?',
                options: [
                    { text: 'Sí', next: 4 },
                    { text: 'No', solution: 'class-setup' }
                ]
            },
            {
                question: '¿Has probado a cerrar y abrir la app Classroom?',
                options: [
                    { text: 'Sí, no funciona', solution: 'advanced' },
                    { text: 'No', solution: 'restart-app' }
                ]
            }
        ],
        solutions: {
            'verificar-asm-clase': {
                title: '<i class="ri-cloud-line"></i> Verificar clase en ASM',
                content: `
                    <p><strong>El flujo correcto es: ASM → Jamf School → App Classroom</strong></p>
                    <p>Todo comienza en Apple School Manager. Si la clase no está bien configurada allí, no funcionará en ningún sitio.</p>

                    <h4>Pasos para IT/Admin en ASM:</h4>
                    <ol>
                        <li>Accede a <strong>Apple School Manager</strong></li>
                        <li>Ve a la sección <strong>Clases</strong></li>
                        <li>Busca la clase del profesor</li>
                        <li>Verifica:
                            <ul>
                                <li>El profesor está asignado correctamente</li>
                                <li>Los alumnos están matriculados en la clase</li>
                                <li>La clase está activa (no archivada)</li>
                                <li>La clase está asignada al servidor MDM (Jamf)</li>
                            </ul>
                        </li>
                        <li>Si hiciste cambios, espera 15-30 minutos para que sincronice</li>
                    </ol>

                    <h4>Luego en Jamf:</h4>
                    <ol>
                        <li>Ve a <strong>Users → Classes</strong></li>
                        <li>Verifica que la clase aparece con todos los datos de ASM</li>
                        <li>Si no aparece, fuerza una sincronización: <strong>Settings → Apple School Manager → Sync</strong></li>
                    </ol>

                    <p><strong>Importante:</strong> Si la clase no existe o está mal configurada en ASM, los profesores nunca la verán en Classroom.</p>
                `
            },
            'bluetooth': {
                title: '<i class="ri-bluetooth-connect-line"></i> Activar Bluetooth',
                content: `
                    <p>La app Classroom necesita Bluetooth para descubrir dispositivos cercanos.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>En el iPad del profesor: <strong>Ajustes → Bluetooth → Activar</strong></li>
                        <li>En los iPads de alumnos: verificar que Bluetooth está activo</li>
                        <li>Vuelve a abrir la app Classroom</li>
                    </ol>
                    <p><strong>Nota para IT:</strong> Si usas perfiles de restricción, asegúrate de no bloquear Bluetooth en los iPads de profesores.</p>
                    <p><strong>Para profesores:</strong> El Bluetooth debe estar siempre activado cuando uses Classroom.</p>
                `
            },
            'wifi': {
                title: '<i class="ri-wifi-line"></i> Conectar a la misma red WiFi',
                content: `
                    <p>Todos los dispositivos deben estar en la misma red WiFi.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>En cada iPad: <strong>Ajustes → WiFi</strong></li>
                        <li>Verifica el nombre de la red conectada (la que tiene ✓)</li>
                        <li>Asegúrate de que todos están en la misma red exactamente</li>
                        <li>Si no coinciden, conéctate a la red correcta</li>
                    </ol>

                    <h4>Importante para IT:</h4>
                    <ul>
                        <li>Evita redes con "aislamiento de clientes" activado</li>
                        <li>Verifica que el firewall no bloquea Bonjour/mDNS</li>
                        <li>Las redes de invitados suelen tener restricciones</li>
                    </ul>
                `
            },
            'check-wifi': {
                title: '<i class="ri-search-line"></i> Cómo verificar la red WiFi',
                content: `
                    <h4>Pasos sencillos:</h4>
                    <ol>
                        <li>En cada dispositivo (profesor y alumnos):</li>
                        <li>Abre <strong>Ajustes</strong></li>
                        <li>Toca <strong>WiFi</strong></li>
                        <li>Anota el nombre de la red que tiene el símbolo ✓</li>
                        <li>Compara: todos deben estar en la misma red</li>
                    </ol>

                    <p><strong>Ejemplo correcto:</strong></p>
                    <ul>
                        <li>iPad profesor: WiFi_Escuela_5G ✓</li>
                        <li>iPad alumno 1: WiFi_Escuela_5G ✓</li>
                        <li>iPad alumno 2: WiFi_Escuela_5G ✓</li>
                    </ul>

                    <p><strong>Ejemplo incorrecto:</strong></p>
                    <ul>
                        <li>iPad profesor: WiFi_Escuela_5G ✓</li>
                        <li>iPad alumno 1: WiFi_Escuela_2.4G ✓ ← Diferente</li>
                    </ul>
                `
            },
            'class-setup': {
                title: '<i class="ri-building-line"></i> Configurar la clase en Jamf',
                content: `
                    <p>La clase debe estar configurada en Jamf con el profesor y alumnos asignados.</p>
                    <p><strong>Recuerda:</strong> Primero debe estar en ASM, luego en Jamf.</p>

                    <h4>Pasos en Jamf:</h4>
                    <ol>
                        <li>Ve a <strong>Users → Classes</strong></li>
                        <li>Busca la clase (debería sincronizarse automáticamente desde ASM)</li>
                        <li>Si no aparece:
                            <ul>
                                <li>Verifica que existe en ASM</li>
                                <li>Fuerza sincronización: <strong>Settings → Apple School Manager → Sync</strong></li>
                                <li>Espera 10-15 minutos</li>
                            </ul>
                        </li>
                        <li>Abre la clase y verifica:
                            <ul>
                                <li>El profesor está asignado</li>
                                <li>Los alumnos/dispositivos están en la lista</li>
                                <li>La clase está activa</li>
                            </ul>
                        </li>
                        <li>Guarda los cambios si hiciste modificaciones</li>
                        <li>Espera 15 minutos y pide al profesor que abra Classroom</li>
                    </ol>
                `
            },
            'restart-app': {
                title: '<i class="ri-refresh-line"></i> Reiniciar Classroom',
                content: `
                    <h4>Pasos para cerrar completamente Classroom:</h4>
                    <ol>
                        <li>Desde cualquier pantalla, desliza hacia arriba desde la parte inferior y mantén (o doble click en el botón Home)</li>
                        <li>Busca la app <strong>Classroom</strong></li>
                        <li>Deslízala hacia arriba para cerrarla</li>
                        <li>Espera 10 segundos</li>
                        <li>Vuelve a abrir Classroom desde la pantalla de inicio</li>
                        <li>Espera a que detecte los dispositivos (puede tardar 30-60 segundos)</li>
                    </ol>

                    <p><strong>Tip:</strong> Asegúrate de que el Bluetooth y WiFi están activados antes de abrir Classroom.</p>
                `
            },
            'advanced': {
                title: '<i class="ri-tools-fill"></i> Soluciones avanzadas',
                content: `
                    <h4>Si nada de lo anterior funciona:</h4>

                    <h5>1. Forzar sincronización desde Jamf:</h5>
                    <ol>
                        <li>Selecciona los iPads afectados en <strong>Devices → Mobile Devices</strong></li>
                        <li>Click en <strong>Actions → Send Blank Push</strong></li>
                        <li>Espera 2-3 minutos</li>
                    </ol>

                    <h5>2. Verificar perfil de Classroom:</h5>
                    <ol>
                        <li>En el iPad: <strong>Ajustes → General → Gestión de dispositivos</strong></li>
                        <li>Busca el perfil de Classroom o Education</li>
                        <li>Si no está, reinstálalo desde Jamf</li>
                    </ol>

                    <h5>3. Reiniciar iPads:</h5>
                    <ol>
                        <li>Apaga completamente los iPads de los alumnos</li>
                        <li>Enciéndelos de nuevo</li>
                        <li>Espera a que se conecten a WiFi</li>
                        <li>Reinicia Classroom en el iPad del profesor</li>
                    </ol>

                    <h5>4. Verificar en ASM y Jamf:</h5>
                    <ol>
                        <li>Confirma que la clase existe en ASM con todos los alumnos</li>
                        <li>Verifica que está asignada al servidor MDM correcto</li>
                        <li>En Jamf, comprueba que la sincronización es reciente</li>
                        <li>Revisa los logs de Jamf para errores relacionados con la clase</li>
                    </ol>

                    <p><strong>Si el problema persiste:</strong> Contacta al soporte de Jamf con los detalles específicos de la clase y los dispositivos afectados.</p>
                `
            }
        }
    },

    'activation-lock': {
        title: 'Bloqueo de activación',
        icon: '<i class="ri-lock-line"></i>',
        steps: [
            {
                question: '¿El iPad está inscrito en Jamf?',
                options: [
                    { text: 'Sí', next: 1 },
                    { text: 'No', solution: 'not-managed' }
                ]
            },
            {
                question: '¿Tienes el código de bypass guardado?',
                options: [
                    { text: 'Sí', solution: 'use-bypass' },
                    { text: 'No', next: 2 }
                ]
            },
            {
                question: '¿El iPad fue supervisado antes del bloqueo?',
                options: [
                    { text: 'Sí', solution: 'get-bypass' },
                    { text: 'No', solution: 'contact-apple' }
                ]
            }
        ],
        solutions: {
            'not-managed': {
                title: '<i class="ri-error-warning-line"></i> iPad no gestionado',
                content: `
                    <p>Si el iPad nunca estuvo gestionado en Jamf, no podemos desbloquearlo desde el MDM.</p>
                    <h4>Opciones:</h4>
                    <ol>
                        <li><strong>Si fue personal y alguien lo donó:</strong>
                            <ul>
                                <li>Contactar al propietario anterior del Apple ID</li>
                                <li>Pedirle que lo elimine de su cuenta en iCloud.com</li>
                            </ul>
                        </li>
                        <li><strong>Si lo compraste para la escuela:</strong>
                            <ul>
                                <li>Contacta a Apple Support</li>
                                <li>Necesitarás la factura de compra original</li>
                                <li>Apple puede desbloquearlo con prueba de propiedad</li>
                            </ul>
                        </li>
                    </ol>
                `
            },
            'use-bypass': {
                title: '<i class="ri-lock-unlock-line"></i> Usar código de bypass',
                content: `
                    <p>Si tienes el código de bypass guardado, puedes desbloquear el iPad fácilmente.</p>
                    <h4>Pasos:</h4>
                    <ol>
                        <li>En la pantalla de <strong>Bloqueo de activación</strong></li>
                        <li>Donde pide Apple ID, introduce <strong>cualquier email</strong> (puede ser inventado)</li>
                        <li>En <strong>contraseña</strong>, introduce el <strong>código de bypass</strong></li>
                        <li>Toca <strong>Siguiente</strong></li>
                        <li>El iPad debería desbloquearse</li>
                    </ol>
                    <p><strong>Nota:</strong> El código de bypass tiene entre 6-10 caracteres y puede contener letras y números.</p>
                `
            },
            'get-bypass': {
                title: '<i class="ri-key-2-line"></i> Obtener código de bypass desde Jamf',
                content: `
                    <p>Si el iPad estaba supervisado y gestionado por Jamf, el código de bypass debería estar guardado.</p>
                    <h4>Pasos en Jamf:</h4>
                    <ol>
                        <li>Ve a <strong>Devices → Mobile Devices</strong></li>
                        <li>Busca el iPad por nombre o número de serie</li>
                        <li>Click en el dispositivo</li>
                        <li>Ve a la pestaña <strong>Security</strong></li>
                        <li>Busca <strong>Activation Lock Bypass Code</strong></li>
                        <li>Copia el código</li>
                        <li>Úsalo en la pantalla de bloqueo del iPad</li>
                    </ol>

                    <p><strong>Si no aparece el código:</strong></p>
                    <ul>
                        <li>El iPad puede no haber estado supervisado correctamente</li>
                        <li>O Jamf no guardó el código (configuración incorrecta)</li>
                        <li>En ese caso, necesitarás contactar a Apple Support</li>
                    </ul>
                `
            },
            'contact-apple': {
                title: '<i class="ri-customer-service-2-line"></i> Contactar a Apple Support',
                content: `
                    <p>Para iPads no supervisados o sin código de bypass guardado.</p>
                    <h4>Qué necesitas preparar:</h4>
                    <ul>
                        <li><strong>Factura de compra original</strong> (imprescindible)</li>
                        <li><strong>Número de serie del iPad</strong></li>
                        <li><strong>Datos de la organización educativa</strong></li>
                        <li>Prueba de que la escuela es la propietaria</li>
                    </ul>

                    <h4>Proceso:</h4>
                    <ol>
                        <li>Contacta a <strong>Apple Business Support</strong> (no soporte normal)</li>
                        <li>Explica que es un dispositivo educativo bloqueado</li>
                        <li>Envía la documentación solicitada</li>
                        <li>Apple revisará el caso (puede tardar varios días)</li>
                        <li>Si aprueban, desbloquearán el dispositivo remotamente</li>
                    </ol>

                    <p><strong>Prevención futura:</strong></p>
                    <ul>
                        <li>Asegúrate de que todos los iPads están en Apple School Manager</li>
                        <li>Supervisa los dispositivos durante la configuración inicial</li>
                        <li>Jamf guardará automáticamente los códigos de bypass</li>
                    </ul>
                `
            }
        }
    }
};

window.Diagnostics = Diagnostics;

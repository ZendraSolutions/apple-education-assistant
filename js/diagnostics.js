/**
 * JAMF ASSISTANT - Diagnostics Module
 * Flujos de diagnóstico guiado para problemas comunes
 */

const Diagnostics = {
    'apps-not-installing': {
        title: 'Las apps no se instalan',
        icon: '<i class="ri-download-cloud-2-line"></i>',
        steps: [
            {
                question: '¿El iPad aparece como "Managed" en Jamf?',
                options: [
                    { text: 'Sí, está managed', next: 1 },
                    { text: 'No, o no estoy seguro', solution: 'enrollment' }
                ]
            },
            {
                question: '¿La app está asignada al dispositivo o a un Smart Group que lo incluya?',
                options: [
                    { text: 'Sí', next: 2 },
                    { text: 'No', solution: 'scope' }
                ]
            },
            {
                question: '¿Hay licencias VPP disponibles para la app?',
                options: [
                    { text: 'Sí hay licencias', next: 3 },
                    { text: 'No hay licencias', solution: 'licenses' },
                    { text: 'No sé cómo comprobarlo', solution: 'check-licenses' }
                ]
            },
            {
                question: '¿El iPad tiene conexión a Internet estable?',
                options: [
                    { text: 'Sí', next: 4 },
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
            'enrollment': {
                title: '<i class="ri-alert-line"></i> Problema de Enrollment',
                content: `
                    <p>El iPad no está correctamente inscrito en Jamf.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>Verifica el número de serie en Apple Business Manager</li>
                        <li>Comprueba que está asignado a tu servidor Jamf</li>
                        <li>Si es necesario, borra el iPad y vuelve a configurarlo</li>
                    </ol>
                `
            },
            'scope': {
                title: '<i class="ri-focus-3-line"></i> Problema de Scope',
                content: `
                    <p>La app no está asignada a este dispositivo.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>Ve a Apps → [Tu App] → Scope</li>
                        <li>Añade el dispositivo o el Smart Group correcto</li>
                        <li>Guarda los cambios</li>
                    </ol>
                `
            },
            'licenses': {
                title: '<i class="ri-file-list-3-line"></i> Sin licencias VPP',
                content: `
                    <p>No hay licencias disponibles para esta app.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>Accede a Apple Business Manager</li>
                        <li>Ve a Apps y Libros → busca la app</li>
                        <li>Compra más licencias</li>
                        <li>Sincroniza en Jamf: Settings → VPP → Sync</li>
                    </ol>
                `
            },
            'check-licenses': {
                title: '<i class="ri-search-line"></i> Cómo comprobar licencias',
                content: `
                    <ol>
                        <li>En Jamf, ve a Apps → [Tu App]</li>
                        <li>Mira "VPP Licenses": Available vs Used</li>
                        <li>Si Available = 0, necesitas comprar más</li>
                    </ol>
                `
            },
            'network': {
                title: '<i class="ri-wifi-off-line"></i> Problema de red',
                content: `
                    <p>El iPad necesita conexión estable para descargar apps.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>Verifica la conexión WiFi</li>
                        <li>Prueba a olvidar la red y reconectar</li>
                        <li>Comprueba que no hay restricciones de firewall</li>
                    </ol>
                `
            },
            'wait': {
                title: '<i class="ri-timer-line"></i> Espera un poco más',
                content: `
                    <p>Las apps pueden tardar hasta 30 minutos en instalarse.</p>
                    <h4>Mientras tanto puedes:</h4>
                    <ul>
                        <li>Verificar que el iPad está conectado a WiFi</li>
                        <li>Abrir la App Store para forzar la descarga</li>
                    </ul>
                `
            },
            'force-sync': {
                title: '<i class="ri-refresh-line"></i> Forzar sincronización',
                content: `
                    <h4>Desde Jamf:</h4>
                    <ol>
                        <li>Ve a Devices → Mobile Devices</li>
                        <li>Busca el iPad por nombre o serial</li>
                        <li>Click en el dispositivo → Management</li>
                        <li>Click "Send Blank Push"</li>
                        <li>Espera 5 minutos y verifica</li>
                    </ol>
                    <h4>Desde el iPad:</h4>
                    <ol>
                        <li>Ajustes → General → Gestión de dispositivos</li>
                        <li>Toca el perfil de gestión</li>
                        <li>Esto fuerza una sincronización</li>
                    </ol>
                `
            }
        }
    },

    'device-not-visible': {
        title: 'Dispositivo no visible en Classroom',
        icon: '<i class="ri-eye-off-line"></i>',
        steps: [
            {
                question: '¿El Bluetooth está activado en ambos dispositivos?',
                options: [
                    { text: 'Sí', next: 1 },
                    { text: 'No', solution: 'bluetooth' }
                ]
            },
            {
                question: '¿Están en la misma red WiFi?',
                options: [
                    { text: 'Sí', next: 2 },
                    { text: 'No', solution: 'wifi' },
                    { text: 'No estoy seguro', solution: 'check-wifi' }
                ]
            },
            {
                question: '¿La clase está configurada en Jamf con profesor y alumnos?',
                options: [
                    { text: 'Sí', next: 3 },
                    { text: 'No', solution: 'class-setup' }
                ]
            },
            {
                question: '¿Has probado a cerrar y abrir Classroom?',
                options: [
                    { text: 'Sí, no funciona', solution: 'advanced' },
                    { text: 'No', solution: 'restart-app' }
                ]
            }
        ],
        solutions: {
            'bluetooth': {
                title: '<i class="ri-bluetooth-connect-line"></i> Activar Bluetooth',
                content: `
                    <p>Classroom necesita Bluetooth para descubrir dispositivos cercanos.</p>
                    <h4>Solución:</h4>
                    <ol>
                        <li>En el iPad del profesor: Ajustes → Bluetooth → Activar</li>
                        <li>En los iPads de alumnos: verificar que Bluetooth está activo</li>
                        <li>Nota: Si usas perfiles de restricción, asegúrate de no bloquear Bluetooth</li>
                    </ol>
                `
            },
            'wifi': {
                title: '<i class="ri-wifi-line"></i> Conectar a la misma red',
                content: `
                    <p>Todos los dispositivos deben estar en la misma red WiFi.</p>
                    <h4>Verifica:</h4>
                    <ul>
                        <li>Nombre de red idéntico en todos los dispositivos</li>
                        <li>Evita redes con "aislamiento de clientes" activado</li>
                    </ul>
                `
            },
            'check-wifi': {
                title: '<i class="ri-search-line"></i> Cómo verificar la red',
                content: `
                    <ol>
                        <li>En cada dispositivo: Ajustes → WiFi</li>
                        <li>Anota el nombre de la red conectada</li>
                        <li>Deben ser exactamente iguales</li>
                    </ol>
                `
            },
            'class-setup': {
                title: '<i class="ri-building-line"></i> Configurar la clase',
                content: `
                    <p>La clase debe existir en Jamf con profesor y alumnos asignados.</p>
                    <h4>En Jamf:</h4>
                    <ol>
                        <li>Users → Classes → + New o edita existente</li>
                        <li>Asigna el profesor</li>
                        <li>Añade los alumnos/dispositivos</li>
                        <li>Guarda y espera sincronización (hasta 15 min)</li>
                    </ol>
                `
            },
            'restart-app': {
                title: '<i class="ri-refresh-line"></i> Reiniciar Classroom',
                content: `
                    <ol>
                        <li>Cierra Classroom completamente (desliza hacia arriba)</li>
                        <li>Espera 10 segundos</li>
                        <li>Vuelve a abrir Classroom</li>
                        <li>Espera a que detecte los dispositivos</li>
                    </ol>
                `
            },
            'advanced': {
                title: '<i class="ri-tools-fill"></i> Solución avanzada',
                content: `
                    <h4>Si nada funciona:</h4>
                    <ol>
                        <li>En Jamf, selecciona los iPads afectados</li>
                        <li>Usa "Send Blank Push" para forzar sincronización</li>
                        <li>Reinicia los iPads de los alumnos</li>
                        <li>Verifica que el perfil de Classroom está instalado</li>
                        <li>Si persiste, revisa los logs de Jamf para errores</li>
                    </ol>
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
                    <p>Si el iPad nunca estuvo en Jamf, necesitas:</p>
                    <ol>
                        <li>Contactar al propietario anterior del Apple ID</li>
                        <li>O contactar a Apple con prueba de compra</li>
                    </ol>
                `
            },
            'use-bypass': {
                title: '<i class="ri-lock-unlock-line"></i> Usar código de bypass',
                content: `
                    <ol>
                        <li>En la pantalla de bloqueo de activación</li>
                        <li>Donde pide Apple ID, introduce cualquier email</li>
                        <li>En contraseña, introduce el código de bypass</li>
                        <li>El iPad debería desbloquearse</li>
                    </ol>
                `
            },
            'get-bypass': {
                title: '<i class="ri-key-2-line"></i> Obtener código de bypass',
                content: `
                    <p>Si el iPad estaba supervisado, Jamf debería tener el código.</p>
                    <ol>
                        <li>En Jamf: Devices → Mobile Devices → busca el iPad</li>
                        <li>Security → Activation Lock Bypass Code</li>
                        <li>Usa ese código en la pantalla de bloqueo</li>
                    </ol>
                `
            },
            'contact-apple': {
                title: '<i class="ri-customer-service-2-line"></i> Contactar a Apple',
                content: `
                    <p>Para iPads no supervisados sin código:</p>
                    <ol>
                        <li>Contacta a Apple Support</li>
                        <li>Necesitarás: factura de compra original</li>
                        <li>Número de serie del dispositivo</li>
                        <li>Apple puede desbloquear remotamente con prueba de propiedad</li>
                    </ol>
                `
            }
        }
    }
};

window.Diagnostics = Diagnostics;

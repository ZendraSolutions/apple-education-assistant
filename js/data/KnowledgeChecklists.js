/**
 * JAMF ASSISTANT - Knowledge Base Checklists
 * Checklists operativas para IT y profesores
 *
 * @module KnowledgeChecklists
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {string} text - Description of the checklist item
 * @property {boolean} done - Whether the item is completed
 */

/**
 * @typedef {Object} Checklist
 * @property {string} title - Title of the checklist
 * @property {string} icon - HTML icon string
 * @property {string} category - Category of the checklist
 * @property {string} estimatedTime - Estimated time to complete
 * @property {ChecklistItem[]} items - List of checklist items
 */

/**
 * New iPad checklist
 * @type {Checklist}
 */
export const newIpad = {
    title: 'Nuevo iPad',
    icon: '<i class="ri-smartphone-line"></i>',
    category: 'Dispositivos',
    estimatedTime: '15-20 min',
    items: [
        { text: 'Verificar numero de serie en Apple School Manager (school.apple.com)', done: false },
        { text: 'Comprobar asignacion al servidor Jamf en ASM', done: false },
        { text: 'Encender y conectar a WiFi del centro', done: false },
        { text: 'Aceptar perfil de gestion remota (debe aparecer automaticamente)', done: false },
        { text: 'Verificar que aparece en Jamf como "Managed" (Gestionado)', done: false },
        { text: 'Asignar a Smart Group correspondiente (ej: "iPads 1 ESO")', done: false },
        { text: 'Verificar instalacion automatica de apps', done: false },
        { text: 'Etiquetar dispositivo fisicamente con numero de inventario', done: false },
        { text: 'Documentar asignacion al alumno (nombre, curso)', done: false }
    ]
};

/**
 * New Mac checklist
 * @type {Checklist}
 */
export const newMac = {
    title: 'Nuevo Mac',
    icon: '<i class="ri-macbook-line"></i>',
    category: 'Dispositivos',
    estimatedTime: '30-45 min',
    items: [
        { text: 'Verificar en Apple School Manager (school.apple.com)', done: false },
        { text: 'Comprobar asignacion al servidor Jamf en ASM', done: false },
        { text: 'Borrar disco si tiene datos previos', done: false },
        { text: 'Reinstalar macOS limpio', done: false },
        { text: 'Conectar a red y aceptar gestion remota', done: false },
        { text: 'Verificar enrollment en Jamf como "Managed"', done: false },
        { text: 'Crear cuenta de usuario local para el profesor', done: false },
        { text: 'Ejecutar politicas de configuracion automatica', done: false },
        { text: 'Instalar software necesario (Office, navegadores, etc.)', done: false },
        { text: 'Configurar impresoras del centro', done: false },
        { text: 'Documentar asignacion al profesor (nombre, departamento)', done: false },
        { text: 'Etiquetar dispositivo fisicamente', done: false }
    ]
};

/**
 * Start of year checklist
 * @type {Checklist}
 */
export const startYear = {
    title: 'Inicio de Curso',
    icon: '<i class="ri-calendar-event-line"></i>',
    category: 'Curso Escolar',
    estimatedTime: '2-3 dias',
    items: [
        { text: 'Inventario completo de todos los dispositivos (iPads y Macs)', done: false },
        { text: 'Verificar estado de baterias de todos los iPads', done: false },
        { text: 'Actualizar iPadOS/macOS a la ultima version estable', done: false },
        { text: 'Importar nuevos alumnos y profesores en Apple School Manager', done: false },
        { text: 'Crear nuevas clases en Apple School Manager', done: false },
        { text: 'Verificar sincronizacion de clases con Jamf School', done: false },
        { text: 'Actualizar Smart Groups con alumnos del nuevo curso', done: false },
        { text: 'Revisar y actualizar perfiles de restriccion por curso/edad', done: false },
        { text: 'Distribuir apps necesarias para el nuevo curso', done: false },
        { text: 'Verificar que la app Aula funciona en todas las clases', done: false },
        { text: 'Formar a nuevos profesores en el uso de la app Aula', done: false },
        { text: 'Formar a profesores en el uso de Jamf Teacher (si se usa)', done: false },
        { text: 'Probar Self Service en Macs de profesores', done: false },
        { text: 'Verificar conectividad WiFi en todas las aulas', done: false },
        { text: 'Verificar que Bluetooth funciona en todos los dispositivos', done: false },
        { text: 'Preparar iPads de repuesto para prestamos/sustituciones', done: false },
        { text: 'Revisar y documentar incidencias del curso anterior', done: false },
        { text: 'Backup de configuraciones actuales de Jamf', done: false },
        { text: 'Actualizar base de conocimiento con cambios del nuevo curso', done: false }
    ]
};

/**
 * End of year checklist
 * @type {Checklist}
 */
export const endYear = {
    title: 'Fin de Curso',
    icon: '<i class="ri-calendar-check-line"></i>',
    category: 'Curso Escolar',
    estimatedTime: '1-2 dias',
    items: [
        { text: 'Recoger todos los iPads de los alumnos', done: false },
        { text: 'Verificar estado fisico de cada dispositivo (pantalla, carcasa)', done: false },
        { text: 'Documentar dispositivos danados para reparacion', done: false },
        { text: 'Verificar que todos los iPads estan en el inventario de Jamf', done: false },
        { text: 'Cerrar sesion de iCloud en iPads personalizados', done: false },
        { text: 'Borrar contenido de usuarios en iPads compartidos (Shared iPad)', done: false },
        { text: 'Actualizar iPadOS a ultima version antes de guardar', done: false },
        { text: 'Cargar todos los dispositivos al 50-80% para almacenamiento', done: false },
        { text: 'Guardar dispositivos en lugar seguro y climatizado', done: false },
        { text: 'Desactivar alumnos que se van en Apple School Manager', done: false },
        { text: 'Archivar clases del curso actual en ASM', done: false },
        { text: 'Documentar lecciones aprendidas del curso', done: false },
        { text: 'Planificar compras o renovaciones para el proximo curso', done: false },
        { text: 'Backup completo de configuracion de Jamf School', done: false }
    ]
};

/**
 * New teacher checklist
 * @type {Checklist}
 */
export const newTeacher = {
    title: 'Profesor Nuevo',
    icon: '<i class="ri-user-add-line"></i>',
    category: 'Personal',
    estimatedTime: '30-45 min',
    items: [
        { text: 'Crear usuario en Apple School Manager (school.apple.com)', done: false },
        { text: 'Asignar rol de "Profesor" en ASM', done: false },
        { text: 'Asignar a las clases correspondientes en ASM', done: false },
        { text: 'Verificar sincronizacion del usuario con Jamf School', done: false },
        { text: 'Asignar Mac del centro (si corresponde)', done: false },
        { text: 'Crear cuenta de usuario en el Mac', done: false },
        { text: 'Instalar app Aula en su iPad personal o del centro', done: false },
        { text: 'Verificar que ve sus clases en la app Aula', done: false },
        { text: 'Instalar app Jamf Teacher (si se usa)', done: false },
        { text: 'Formacion basica: Como usar la app Aula', done: false },
        { text: 'Formacion: Como bloquear/desbloquear iPads de alumnos', done: false },
        { text: 'Formacion: Como ver pantallas de alumnos', done: false },
        { text: 'Formacion: Como abrir una app en todos los iPads', done: false },
        { text: 'Entregar guia rapida de referencia (fisica o digital)', done: false },
        { text: 'Anadir a canal de soporte tecnico (email, chat, etc.)', done: false }
    ]
};

/**
 * Student returns iPad checklist
 * @type {Checklist}
 */
export const studentLeaves = {
    title: 'Alumno Devuelve iPad',
    icon: '<i class="ri-user-unfollow-line"></i>',
    category: 'Dispositivos',
    estimatedTime: '10-15 min',
    items: [
        { text: 'Verificar numero de serie del dispositivo', done: false },
        { text: 'Comprobar estado fisico (pantalla, carcasa, botones)', done: false },
        { text: 'Documentar danos si los hay (con fotos)', done: false },
        { text: 'Verificar que incluye cargador y cable original', done: false },
        { text: 'Cerrar sesion de iCloud en el dispositivo', done: false },
        { text: 'Borrar contenido y ajustes (Ajustes -> General -> Restablecer)', done: false },
        { text: 'En Jamf: Reasignar dispositivo o dejar sin usuario', done: false },
        { text: 'Actualizar inventario: marcar como "Disponible"', done: false },
        { text: 'Guardar en armario de dispositivos de reserva', done: false },
        { text: 'Actualizar registro del alumno (dispositivo devuelto)', done: false }
    ]
};

/**
 * Aula troubleshooting checklist
 * @type {Checklist}
 */
export const aulaNotWorking = {
    title: 'Troubleshooting Aula',
    icon: '<i class="ri-error-warning-line"></i>',
    category: 'Soporte',
    estimatedTime: '10-20 min',
    items: [
        { text: 'Verificar Bluetooth activado en iPad del PROFESOR', done: false },
        { text: 'Verificar Bluetooth activado en iPads de ALUMNOS', done: false },
        { text: 'Verificar que todos estan en la MISMA red WiFi', done: false },
        { text: 'Preguntar a IT si hay "Client Isolation" en la WiFi', done: false },
        { text: 'Verificar que la clase existe en Apple School Manager', done: false },
        { text: 'Verificar que el profesor esta asignado a la clase en ASM', done: false },
        { text: 'Verificar sincronizacion de la clase en Jamf School', done: false },
        { text: 'Enviar "Blank Push" a dispositivos desde Jamf', done: false },
        { text: 'Cerrar completamente la app Aula y volver a abrirla', done: false },
        { text: 'Reiniciar iPad del profesor', done: false },
        { text: 'Reiniciar iPads de alumnos problematicos', done: false },
        { text: 'Verificar que iPads son supervisados (Ajustes -> General -> Info)', done: false },
        { text: 'Si nada funciona: contactar soporte Jamf', done: false }
    ]
};

/**
 * Daily IT check checklist
 * @type {Checklist}
 */
export const dailyCheck = {
    title: 'Verificacion Diaria IT',
    icon: '<i class="ri-checkbox-circle-line"></i>',
    category: 'Soporte',
    estimatedTime: '5-10 min',
    items: [
        { text: 'Revisar alertas en consola de Jamf School', done: false },
        { text: 'Verificar estado de conexion de dispositivos criticos', done: false },
        { text: 'Revisar tickets de soporte pendientes', done: false },
        { text: 'Comprobar que no hay actualizaciones pendientes criticas', done: false },
        { text: 'Verificar que la sincronizacion con ASM esta funcionando', done: false },
        { text: 'Revisar dispositivos que no han conectado en 7+ dias', done: false }
    ]
};

/**
 * Weekly maintenance checklist
 * @type {Checklist}
 */
export const weeklyMaintenance = {
    title: 'Mantenimiento Semanal',
    icon: '<i class="ri-calendar-2-line"></i>',
    category: 'Soporte',
    estimatedTime: '1-2 horas',
    items: [
        { text: 'Revisar informe de dispositivos con bateria baja', done: false },
        { text: 'Verificar dispositivos con almacenamiento casi lleno', done: false },
        { text: 'Revisar apps que necesitan actualizacion', done: false },
        { text: 'Comprobar caducidad de perfiles y certificados', done: false },
        { text: 'Revisar logs de errores en Jamf School', done: false },
        { text: 'Actualizar documentacion si hubo cambios', done: false },
        { text: 'Backup de configuracion de Jamf (si es manual)', done: false },
        { text: 'Revisar estadisticas de uso de apps', done: false },
        { text: 'Preparar resumen semanal para direccion (opcional)', done: false }
    ]
};

/**
 * Prepare digital exam checklist
 * @type {Checklist}
 */
export const prepareExam = {
    title: 'Preparar Examen Digital',
    icon: '<i class="ri-file-list-3-line"></i>',
    category: 'Aula',
    estimatedTime: '15-20 min',
    items: [
        { text: 'Crear perfil de restriccion especifico para examen en Jamf', done: false },
        { text: 'Bloquear acceso a Safari y navegadores', done: false },
        { text: 'Bloquear acceso a AirDrop durante el examen', done: false },
        { text: 'Bloquear acceso a mensajes y comunicacion', done: false },
        { text: 'Permitir solo la app de examen (si es especifica)', done: false },
        { text: 'Crear Smart Group temporal para los iPads del examen', done: false },
        { text: 'Asignar perfil de examen al Smart Group', done: false },
        { text: 'Verificar que la restriccion se aplica (probar en 1 iPad)', done: false },
        { text: 'Informar al profesor de como usar Aula durante el examen', done: false },
        { text: 'DESPUES: Retirar el perfil de examen del Smart Group', done: false },
        { text: 'DESPUES: Verificar que los iPads vuelven a la normalidad', done: false }
    ]
};

/**
 * Complete checklists module as a combined object for backwards compatibility
 * @type {Object}
 */
export const checklists = {
    newIpad,
    newMac,
    startYear,
    endYear,
    newTeacher,
    studentLeaves,
    aulaNotWorking,
    dailyCheck,
    weeklyMaintenance,
    prepareExam
};

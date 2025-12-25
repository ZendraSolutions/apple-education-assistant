# Manual del Usuario - Jamf Assistant

## Introducción

Jamf Assistant es tu asistente personal para la gestión del ecosistema Apple en tu centro educativo. Te ayuda a resolver problemas con iPads, Macs, la App Aula y Jamf School de forma rápida y sencilla. Con acceso a guías paso a paso, checklists y un chatbot con inteligencia artificial, tendrás soporte 24/7 a tu alcance.

---

## Primeros Pasos

### Acceder a la aplicación

1. **Abre tu navegador** (Safari recomendado en iPad)
2. **Visita la URL** proporcionada por el centro
3. La aplicación cargará automáticamente
4. No necesitas instalar nada (funciona directamente en el navegador)

### Tour de bienvenida

La primera vez que accedes, verás una pantalla de bienvenida con:

- **Logo educativo**: Un birrete de graduación combinado con una manzana
- **Título**: Apple Edu Assistant
- **Carga automática**: La app se prepara en segundos

Después aparecerá un **banner de privacidad** donde puedes:
- ✅ **Aceptar todo**: Permite fuentes externas y mejora visual
- **Solo necesarias**: Usa solo lo esencial (sin servicios externos)
- **Configurar**: Personaliza qué servicios quieres permitir

### Navegación básica

La aplicación tiene dos áreas principales:

**1. Menú lateral (Sidebar)**
- Click en el icono de menú (tres líneas) para abrirlo
- Secciones organizadas por temas:
  - Dashboard (inicio)
  - Ecosistema Apple
  - App Aula y Jamf Teacher
  - Gestión de iPads y Macs
  - Troubleshooting (solución de problemas)
  - Checklists
  - Mis Datos (privacidad)
- En la parte inferior: botón de tema oscuro/claro y documentación actualizada

**2. Área de contenido**
- Muestra la información de la sección seleccionada
- **Barra de búsqueda** en la parte superior para encontrar soluciones rápidamente
- **Tarjetas interactivas** que puedes tocar para acceder a guías y herramientas

---

## Funcionalidades Principales

### Dashboard y accesos rápidos

El Dashboard es tu punto de partida. Contiene:

**Accesos rápidos a herramientas esenciales:**
- 📱 **App Aula**: Guías para gestionar tu clase con iPads
- 👨‍🏫 **Jamf Teacher**: Controlar dispositivos durante la clase
- 📋 **Checklists**: Listas de tareas para configuraciones comunes
- 🔧 **Troubleshooting**: Soluciones a problemas frecuentes

**Tarjetas de guías destacadas:**
- Cada tarjeta tiene un título, descripción breve e icono
- Toca una tarjeta para abrir la guía completa en un modal
- Navega entre secciones con facilidad

### Buscar información

La búsqueda es tu mejor aliada para encontrar soluciones rápidas:

**Cómo buscar:**
1. Click en la barra de búsqueda (parte superior)
2. Escribe tu problema o pregunta (ej: "iPad no sincroniza")
3. Los resultados aparecen instantáneamente
4. Toca un resultado para:
   - **Guías**: Abrir instrucciones paso a paso
   - **Diagnósticos**: Iniciar un asistente interactivo

**Qué puedes buscar:**
- Problemas técnicos ("wifi no funciona")
- Herramientas ("configurar aula")
- Dispositivos ("iPad no enciende")
- Procesos ("inscribir Mac en Jamf")

### Guías paso a paso

Las guías te llevan de la mano en procesos complejos:

**Estructura de una guía:**
- **Título claro**: Indica exactamente qué aprenderás
- **Pasos numerados**: Sigue cada paso en orden
- **Capturas de pantalla** (cuando aplica): Visualiza dónde hacer click
- **Notas importantes**: Destacadas con iconos de advertencia
- **Botón "Cerrar"**: Vuelve a la vista anterior

**Ejemplo de guía:**
- "Configurar App Aula por primera vez"
  1. Abrir ajustes de iPadOS
  2. Buscar "Aula"
  3. Activar permisos
  4. Conectar con Jamf School

### Checklists

Las checklists te ayudan a no olvidar ningún paso en tareas comunes:

**Cómo usar una checklist:**
1. Accede desde el menú lateral > Checklists
2. Elige la tarea que necesitas (ej: "Inicio de curso")
3. Verás una lista de ítems marcables
4. **Marca cada ítem** cuando lo completes ✅
5. Tu progreso se guarda automáticamente en el navegador

**Ejemplos de checklists:**
- Inicio de curso: Preparar iPads para nuevos alumnos
- Fin de curso: Recopilar y resetear dispositivos
- Configuración de Mac nuevo: Pasos para docentes

### Diagnósticos de problemas

Los diagnósticos son asistentes interactivos que te guían para resolver problemas:

**Flujo de un diagnóstico:**
1. Click en "Troubleshooting" en el menú
2. Selecciona el problema (ej: "iPad no conecta a WiFi")
3. Responde preguntas sencillas (Sí/No)
4. El asistente te lleva a la solución correcta
5. Ejecuta las acciones recomendadas

**Beneficios:**
- No necesitas ser técnico
- Ahorra tiempo al IT del centro
- Soluciones probadas y actualizadas

---

## Chatbot con IA

El chatbot es tu asistente virtual con inteligencia artificial, potenciado por Google Gemini.

### Cómo funciona

El chatbot tiene acceso a:
- ✅ **Base de conocimientos** de Jamf, Apple School Manager y App Aula
- ✅ **Internet** para consultar documentación oficial actualizada
- ✅ **Contexto educativo** para entornos escolares

**Importante**: El chatbot **NO** tiene acceso a datos personales ni información privada del centro. Solo consulta documentación pública.

### Configurar API Key

Para usar el chatbot necesitas una API Key gratuita de Google:

**Pasos resumidos:**
1. **Abre el chatbot**: Click en el icono de robot (esquina inferior derecha)
2. **Click en el icono de configuración** (⚙️ en la cabecera del chat)
3. Sigue las instrucciones del modal que aparece
4. **Importante**: Lee la guía completa en `docs/API_KEY_SETUP.md` (más abajo)

**Seguridad de tu API Key:**
- Se guarda **cifrada** con AES-256-GCM en tu navegador
- **Nunca** se envía a nuestros servidores
- Solo tú tienes acceso a ella
- Puedes borrarla en cualquier momento desde "Mis Datos"

### Hacer preguntas efectivas

**Ejemplos de buenas preguntas:**
- ✅ "¿Cómo añado un iPad nuevo a Jamf School?"
- ✅ "Mi Mac no aparece en Apple School Manager, ¿qué hago?"
- ✅ "¿Cómo bloqueo apps en iPads durante un examen?"
- ✅ "Pasos para resetear un iPad de alumno"

**Evita preguntas vagas:**
- ❌ "No funciona"
- ❌ "Ayuda"
- ❌ "Problema con iPad"

**Mejor formato:**
- ✅ "El iPad de mi alumno no se conecta al WiFi del aula, ¿qué pasos debo seguir?"

### Limitaciones

El chatbot es muy útil, pero tiene límites:

- ⚠️ **No resuelve problemas de hardware**: Si el iPad está roto físicamente, contacta con IT
- ⚠️ **No accede a tu cuenta**: No puede hacer cambios en Jamf School por ti
- ⚠️ **Límite de uso gratuito**: La API de Google permite 1500 consultas/día (más que suficiente)
- ⚠️ **Requiere internet**: Sin conexión no puede funcionar

**Cuándo contactar con IT:**
- Problemas persistentes después de seguir guías
- Errores de permisos o acceso
- Cambios en configuración del centro
- Hardware dañado

---

## Características de Interfaz y UX

La aplicación incluye múltiples elementos de interfaz diseñados para mejorar tu experiencia de uso.

### Sistema de Tooltips

Los **tooltips** (pequeñas ventanas emergentes) aparecen cuando pasas el cursor sobre ciertos elementos, proporcionando ayuda contextual.

**Dónde encontrarlos:**
- **Iconos de secciones**: Pasa el cursor sobre cualquier icono del menú lateral para ver el nombre completo de la sección
- **Botones de acción**: Los botones de configuración, búsqueda y chatbot muestran su función al pasar el cursor
- **Elementos interactivos**: Tarjetas de guías y checklists muestran información adicional

**Características:**
- ✅ **Aparición automática**: Se muestran después de 500ms al pasar el cursor
- ✅ **Accesibilidad**: Compatible con lectores de pantalla
- ✅ **Diseño adaptable**: Posición inteligente para no salirse de la pantalla
- ✅ **Tema coherente**: Se adaptan al tema oscuro/claro

**Ejemplo de uso:**
```
[Icono de configuración ⚙️]
   ↓ (pasa el cursor)
┌──────────────────┐
│ Configuración    │
│ del chatbot      │
└──────────────────┘
```

### Notificaciones Toast

Las **notificaciones toast** son mensajes temporales que aparecen en la esquina de la pantalla para informarte de acciones completadas o errores.

**Tipos de notificaciones:**

1. **Éxito (verde)** ✅
   - "API Key guardada correctamente"
   - "Checklist completada"
   - "Datos exportados con éxito"

2. **Error (rojo)** ❌
   - "API Key inválida"
   - "Error al conectar con el servidor"
   - "Formato de archivo no soportado"

3. **Advertencia (amarillo)** ⚠️
   - "Límite de llamadas alcanzado"
   - "Conexión inestable"
   - "Actualización disponible"

4. **Información (azul)** ℹ️
   - "Modo offline activado"
   - "Nueva versión instalada"
   - "Configuración actualizada"

**Características:**
- ✅ **Duración ajustable**: Desaparecen automáticamente (3-5 segundos)
- ✅ **Cierre manual**: Click en la X para cerrar antes
- ✅ **No intrusivas**: Posicionadas en esquina superior derecha
- ✅ **Múltiples notificaciones**: Se apilan si hay varias a la vez
- ✅ **Animaciones suaves**: Entrada/salida con transiciones elegantes

**Cuándo aparecen:**
- Al guardar configuraciones
- Al completar checklists
- En errores de red o API
- Al exportar/eliminar datos
- Durante actualizaciones de la app

### Indicador de Estado de Conexión

El **indicador de conexión** te muestra si estás conectado a internet en tiempo real.

**Estados posibles:**

1. **Online (conectado)** 🟢
   - Icono verde en la esquina superior
   - Tooltip: "Conectado a internet"
   - Todas las funciones disponibles

2. **Offline (sin conexión)** 🔴
   - Icono rojo en la esquina superior
   - Tooltip: "Sin conexión a internet"
   - Funcionalidades limitadas

3. **Conexión inestable** 🟡
   - Icono amarillo parpadeante
   - Tooltip: "Conexión inestable"
   - Posibles fallos en chatbot

**Qué puedes hacer sin conexión:**
- ✅ Navegar por secciones guardadas
- ✅ Ver guías previamente abiertas
- ✅ Consultar checklists
- ✅ Usar diagnósticos offline
- ❌ Chatbot IA (requiere internet)
- ❌ Buscar en documentación online
- ❌ Actualizar contenido

**Ventajas del PWA offline:**
- El **Service Worker** cachea contenido automáticamente
- Las páginas visitadas quedan disponibles sin conexión
- La app se recarga automáticamente cuando vuelve la conexión
- Los datos se sincronizan cuando hay internet

**Cómo interpretar el indicador:**
```
┌─────────────────────────────┐
│  [🟢] Estado de conexión:   │
│  • Verde: Todo OK           │
│  • Amarillo: Inestable      │
│  • Rojo: Sin internet       │
└─────────────────────────────┘
```

### Tour de Bienvenida (Onboarding)

La **primera vez que accedes**, verás un tour interactivo que te guía por las funcionalidades principales.

**Pasos del tour:**

1. **Bienvenida**
   - Introducción a Jamf Assistant
   - Botón "Comenzar tour"

2. **Navegación**
   - Cómo usar el menú lateral
   - Secciones disponibles

3. **Búsqueda**
   - Dónde está la barra de búsqueda
   - Cómo buscar soluciones

4. **Chatbot IA**
   - Presentación del asistente virtual
   - Cómo configurar API Key

5. **Configuración**
   - Tema oscuro/claro
   - Opciones de privacidad

**Características:**
- ✅ **Opcional**: Puedes saltarlo si ya conoces la app
- ✅ **No se repite**: Solo se muestra la primera vez (guardado en localStorage)
- ✅ **Reiniciable**: Puedes volver a verlo desde Configuración
- ✅ **Progreso visual**: Indicadores de paso 1/5, 2/5, etc.
- ✅ **Accesible**: Compatible con teclado (Enter/Escape)

**Cómo reiniciar el tour:**
1. Ve a "Mis Datos" en el menú lateral
2. Scroll hasta "Configuración avanzada"
3. Click en "Reiniciar tour de bienvenida"

### Focus Trap (Accesibilidad)

El **Focus Trap** mantiene el foco del teclado dentro de los modales y ventanas emergentes para mejorar la accesibilidad.

**Qué hace:**
- Cuando abres un modal, el foco queda "atrapado" dentro
- Presionar **Tab** navega solo entre elementos del modal
- Presionar **Escape** cierra el modal
- Al cerrar, el foco vuelve al elemento que lo abrió

**Beneficios:**
- ✅ **Navegación por teclado**: Usuarios sin ratón pueden usar la app
- ✅ **Lectores de pantalla**: Mejor experiencia para usuarios con discapacidad visual
- ✅ **Estándar WCAG 2.1**: Cumple con pautas de accesibilidad nivel AA
- ✅ **UX coherente**: Comportamiento predecible

**Ejemplo de flujo:**
```
Usuario presiona Tab en modal:
[Botón Cerrar] → [Campo de texto] → [Botón Guardar] → [Botón Cerrar] (ciclo)

Usuario presiona Escape:
Modal se cierra → Foco vuelve al botón que abrió el modal
```

### Animaciones y Transiciones

La app usa **animaciones sutiles** para mejorar la experiencia visual:

**Tipos de animaciones:**

1. **Fade In/Out** (entrada/salida)
   - Modales aparecen/desaparecen suavemente
   - Notificaciones toast se desvanecen

2. **Slide** (deslizamiento)
   - Menú lateral se desliza desde la izquierda
   - Tarjetas se deslizan al cambiar de sección

3. **Scale** (escala)
   - Botones crecen ligeramente al pasar el cursor (hover)
   - Iconos se agrandan al ser seleccionados

4. **Skeleton Loaders** (carga)
   - Rectángulos pulsantes mientras carga contenido
   - Feedback visual de que algo está pasando

**Preferencias de movimiento reducido:**
- Si tienes **"Reducir movimiento"** activado en tu sistema operativo, las animaciones se simplifican automáticamente
- Respeta la configuración de accesibilidad del usuario

---

## Consejos y Trucos

### Atajos de teclado

Aunque la app está optimizada para táctil, en ordenador puedes usar:

- **Escape (Esc)**: Cerrar modales y ventanas emergentes
- **Barra espaciadora**: Scroll rápido en guías largas
- **Tab**: Navegar entre elementos interactivos

### Tema oscuro

Protege tu vista en entornos con poca luz:

1. Click en el **icono de luna** (parte inferior del menú lateral)
2. El tema cambia instantáneamente
3. Tu preferencia se guarda automáticamente

**Beneficios del tema oscuro:**
- Menos fatiga visual en clases oscuras
- Ahorro de batería en pantallas OLED
- Mejor contraste en proyectores

### Instalar en iPad (PWA)

Convierte la web app en una app instalable en tu iPad:

**Pasos para instalar:**
1. **Abre Safari** en tu iPad (importante: debe ser Safari)
2. Accede a la URL de Jamf Assistant
3. Toca el botón **Compartir** (cuadrado con flecha hacia arriba)
4. Selecciona **"Añadir a pantalla de inicio"**
5. Personaliza el nombre si quieres
6. Toca **"Añadir"**

**Ventajas de instalar:**
- ✅ Icono en tu pantalla de inicio (acceso rápido)
- ✅ Se abre como una app nativa (sin barra de Safari)
- ✅ **Funciona offline**: Accede a guías sin internet
- ✅ Actualizaciones automáticas cuando hay conexión
- ✅ Experiencia más fluida y rápida

**Nota**: Solo funciona en Safari. Chrome en iPad no soporta instalación de PWAs.

---

## Privacidad y Seguridad

Tus datos están seguros:

- 🔒 **Almacenamiento local**: Todo se guarda solo en tu navegador
- 🔒 **Cifrado de API Key**: Protección AES-256-GCM
- 🔒 **Sin tracking**: No recopilamos datos de uso
- 🔒 **RGPD compliant**: Cumple con normativa europea

**Gestiona tus datos en "Mis Datos":**
- Ver qué datos tienes guardados
- Exportar tus preferencias
- Borrar todo de forma segura
- Configurar tu API Key

---

## Necesitas más ayuda

- 📧 **Contacta con IT del centro** para problemas técnicos avanzados
- 📖 **Documentación oficial**: Link en el pie del menú lateral
- 💬 **Usa el chatbot IA** para dudas sobre uso de Jamf y Apple

---

**Versión del manual**: 1.0.0
**Última actualización**: Diciembre 2024
**Creado para**: Docentes

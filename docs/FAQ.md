# Preguntas Frecuentes (FAQ)

Respuestas rápidas a las dudas más comunes sobre Jamf Assistant.

---

## General

### ¿Qué es Jamf Assistant?

Jamf Assistant es una aplicación web diseñada para ayudar a los docentes del Colegio Huerta Santa Ana a gestionar el ecosistema de dispositivos Apple. Incluye:
- Guías paso a paso para App Aula, Jamf School y Apple School Manager
- Chatbot con IA para resolver dudas en tiempo real
- Diagnósticos interactivos para solucionar problemas comunes
- Checklists para tareas recurrentes (inicio/fin de curso)

Es como tener un manual de soporte técnico siempre contigo, accesible desde cualquier dispositivo.

### ¿Necesito instalar algo?

No. Jamf Assistant funciona directamente en tu navegador web. Solo necesitas:
- ✅ Un navegador moderno (Safari, Chrome, Edge, Firefox)
- ✅ Conexión a internet (aunque puedes instalarlo como PWA para usar offline)

**Opcional**: Puedes instalarlo en tu iPad como una aplicación nativa siguiendo las instrucciones en el manual (ver sección "Instalar en iPad").

### ¿Funciona sin internet?

**Depende de cómo lo uses:**

- **Sin instalar (navegador normal)**: ❌ Necesitas internet siempre
- **Instalado como PWA en iPad**: ✅ Las guías y contenido básico funcionan offline
- **Chatbot IA**: ❌ Siempre requiere internet (consulta a Google Gemini)

Si instalas la app en tu iPad, podrás acceder a la mayoría del contenido sin conexión. El chatbot y la búsqueda web sí requieren internet.

### ¿Es gratis?

Sí, completamente gratis. Pero el chatbot con IA requiere una **API Key de Google** que TÚ debes obtener (también gratuita). Google ofrece:
- 1500 consultas al día sin costo
- 15 consultas por minuto

Para uso docente, este límite es más que suficiente.

### ¿Está disponible en otros idiomas?

Actualmente solo está en **español**. La documentación oficial de Jamf y Apple que el chatbot consulta puede estar en inglés, pero el chatbot te la traduce y explica en español.

---

## Chatbot IA

### ¿Qué es una API Key?

Una API Key es como una "llave digital" que te permite usar el servicio de inteligencia artificial de Google (Gemini). Es un código único que se ve así:

```
AIzaSyD1234567890abcdefghijklmnopqrstuvw
```

**Importante**: Esta llave es personal y debes mantenerla segura. No la compartas con nadie.

### ¿Es gratuito el chatbot?

Sí, pero con límites generosos:
- ✅ Google ofrece **1500 consultas al día** gratis
- ✅ Suficiente para docentes (aprox. 50-100 consultas/día típico)
- ⚠️ Si superas el límite, recibirás un mensaje de error

**Cálculo aproximado**: Si haces 10 preguntas al día, tienes para 5 meses de uso continuo.

### ¿Mis datos están seguros?

Sí. Tu API Key y datos personales están protegidos:

**Seguridad de API Key:**
- 🔒 **Cifrado AES-256-GCM**: Nivel bancario de seguridad
- 🔒 **Solo en tu navegador**: Nunca se envía a nuestros servidores
- 🔒 **No compartida**: Solo tú tienes acceso

**Datos del chat:**
- Las preguntas que haces al chatbot se envían a **Google Gemini** (su política de privacidad aplica)
- No guardamos historial de conversaciones en nuestros servidores
- Puedes borrar el historial local desde tu navegador

**Recomendación**: No incluyas datos personales de alumnos en tus preguntas al chatbot (nombres, DNI, etc.).

### ¿Por qué necesito mi propia API Key?

Por transparencia y control:

1. **Control de costos**: Cada usuario gestiona su propio límite gratuito
2. **Privacidad**: Tus consultas van directamente a Google, sin intermediarios
3. **Seguridad**: Nadie más puede usar tu cuota
4. **Sin dependencia**: No dependes de una API Key compartida que pueda agotarse

Es como tener tu propia cuenta de correo en lugar de compartir una contraseña con todos.

### ¿Dónde guardo mi API Key?

Hay 3 opciones al configurarla:

| Opción | Duración | Dónde se guarda |
|--------|----------|-----------------|
| **Solo sesión** | Hasta cerrar navegador | sessionStorage (temporal) |
| **24 horas** (predeterminado) | 1 día | localStorage (cifrado) |
| **Permanente** (anclada) | Indefinido | localStorage (cifrado) |

**Recomendación para docentes**: Usa "Permanente" en tu iPad personal para no tener que reconfigurarla.

### ¿Qué pasa si pierdo mi API Key?

No hay problema:
1. Ve a "Mis Datos" en el menú lateral
2. Click en "Configurar API Key"
3. Pega tu API Key de nuevo
4. O genera una nueva en [Google AI Studio](https://aistudio.google.com/apikey)

**Importante**: Si generas una nueva API Key, la anterior dejará de funcionar.

---

## Problemas Comunes

### El chatbot no responde

**Posibles causas y soluciones:**

**1. API Key no configurada**
- ❌ Error: "No se encontró API Key"
- ✅ Solución: Configura tu API Key siguiendo la guía `docs/API_KEY_SETUP.md`

**2. API Key incorrecta o expirada**
- ❌ Error: "API Key inválida"
- ✅ Solución: Verifica que copiaste la key completa (debe empezar con `AIza`)
- ✅ Genera una nueva en Google AI Studio si es necesaria

**3. Límite de cuota alcanzado**
- ❌ Error: "Quota exceeded"
- ✅ Solución: Espera 24 horas para que se renueve tu cuota gratuita
- ✅ O crea una nueva API Key en otra cuenta de Google

**4. Sin conexión a internet**
- ❌ Error: "Network error"
- ✅ Solución: Verifica tu conexión WiFi

**5. Servidor de Google caído (raro)**
- ❌ Error: "Service unavailable"
- ✅ Solución: Espera unos minutos y reintenta

### No puedo instalar en iPad

**Posibles causas:**

**1. No usas Safari**
- ❌ Chrome en iPad no soporta instalación de PWAs
- ✅ Usa Safari (navegador azul de Apple)

**2. No encuentras el botón "Añadir a pantalla de inicio"**
- ✅ Pasos:
  1. Abre la app en Safari
  2. Toca el icono de **Compartir** (cuadrado con flecha ↑)
  3. Desplázate en el menú hasta encontrar "Añadir a pantalla de inicio"
  4. Toca ahí

**3. El icono no aparece o está en blanco**
- ✅ Solución: Recarga la página con Cmd+R (o cierra y vuelve a abrir)
- ✅ Verifica que tengas conexión a internet al instalar

### La búsqueda no encuentra resultados

**Causas comunes:**

**1. Término de búsqueda muy específico o con errores**
- ❌ "ipad pro 2024 no enciende pantalla negro"
- ✅ Prueba términos más simples: "iPad no enciende"

**2. Buscas algo fuera del alcance de la app**
- ❌ "Cómo hacer una presentación en Keynote"
- ✅ La app solo cubre: Jamf School, App Aula, ASM, gestión de dispositivos

**3. La base de conocimientos no está cargada**
- ✅ Solución: Recarga la página (F5 o Cmd+R)
- ✅ Verifica conexión a internet

**Consejo**: Si no encuentras algo, prueba con el **chatbot IA** que tiene acceso a internet y documentación actualizada.

### El tema oscuro no se activa

**Soluciones:**

1. **Limpia la caché del navegador**:
   - Safari iPad: Ajustes > Safari > Borrar historial y datos
   - Chrome: Configuración > Privacidad > Borrar datos de navegación

2. **Verifica que tienes JavaScript activado**:
   - La app no funciona sin JavaScript

3. **Prueba en otro navegador** para descartar problemas específicos

### No puedo ver las guías (modal en blanco)

**Causas:**

1. **Bloqueador de anuncios activo**:
   - ✅ Desactiva extensiones como AdBlock en esta página
   - ✅ Añade la app a la lista blanca

2. **Modo de lectura activado en Safari**:
   - ✅ Desactiva el modo de lectura (icono de líneas en la barra de dirección)

3. **JavaScript deshabilitado**:
   - ✅ Habilita JavaScript en la configuración del navegador

### Mi iPad dice "No hay conexión segura" al acceder

**Causas:**

1. **Accedes por HTTP en lugar de HTTPS**:
   - ✅ Verifica que la URL empiece con `https://` (con la 's')
   - ✅ Contacta con IT si el centro no tiene certificado SSL

2. **Certificado SSL expirado o inválido**:
   - ✅ Contacta con IT del centro para renovar el certificado

3. **Fecha/hora incorrecta en el iPad**:
   - ✅ Verifica en Ajustes > General > Fecha y hora
   - ✅ Activa "Ajustar automáticamente"

---

## Privacidad y Datos

### ¿Qué datos se guardan en mi navegador?

Solo datos esenciales para el funcionamiento:

- ✅ **Tema elegido** (claro/oscuro)
- ✅ **API Key cifrada** (si configuraste el chatbot)
- ✅ **Progreso de checklists** (qué ítems marcaste)
- ✅ **Consentimiento de cookies** (tu elección en el banner inicial)

**NO guardamos**:
- ❌ Historial de búsquedas
- ❌ Conversaciones con el chatbot
- ❌ Datos personales de alumnos
- ❌ Contraseñas de Jamf o ASM

### ¿Cómo borro todos mis datos?

1. Ve al menú lateral > **Mis Datos**
2. Click en la tarjeta **"Borrar todos mis datos"**
3. Confirma la acción
4. Todos tus datos locales se eliminan permanentemente

**Qué se borra:**
- API Key cifrada
- Preferencias de tema
- Progreso de checklists
- Configuración de cookies

**Qué NO se borra:**
- La documentación de la app (se recarga automáticamente)

### ¿Puedo usar la app en varios dispositivos?

Sí, pero ten en cuenta:

- ✅ **Tus datos NO se sincronizan** entre dispositivos
- ✅ Debes configurar tu API Key **en cada dispositivo**
- ✅ Las checklists completadas en iPad no aparecen en tu Mac

**Esto es por diseño** para proteger tu privacidad (no usamos servidores).

### ¿Se comparte mi API Key con el centro?

**No**. Tu API Key:
- 🔒 Se guarda solo en tu navegador
- 🔒 Está cifrada con AES-256-GCM
- 🔒 Solo tú puedes descifrarla en ese navegador específico
- 🔒 Ni IT del centro ni desarrolladores tienen acceso

**Nadie puede ver tu API Key**, ni siquiera si tiene acceso físico a tu dispositivo (está cifrada).

---

## Técnicas y Configuración

### ¿Qué navegadores son compatibles?

**Totalmente compatibles:**
- ✅ Safari 14+ (iPad, iPhone, Mac)
- ✅ Chrome 90+ (Windows, Mac, Android)
- ✅ Edge 90+ (Windows, Mac)
- ✅ Firefox 88+ (Windows, Mac)

**Limitaciones:**
- ⚠️ Chrome en iPad: No permite instalación como PWA (usa Safari)
- ⚠️ Internet Explorer: No soportado (usa Edge)

### ¿Cómo actualizo la app?

**La app se actualiza sola** si está instalada como PWA:
1. Cierra la app completamente
2. Vuelve a abrirla
3. Si hay actualización, se descarga automáticamente

**Si usas navegador normal**:
- Recarga con Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)

### ¿Puedo usar la app en mi móvil?

Sí, pero está **optimizada para tablets y ordenadores**. En móviles:
- ✅ Funciona correctamente
- ⚠️ Interfaz adaptada (menú lateral se colapsa)
- ⚠️ Algunas guías largas pueden ser difíciles de leer

**Recomendación**: Usa iPad (ideal) o ordenador para mejor experiencia.

---

## Contacto y Soporte

### ¿Dónde reporto errores o sugiero mejoras?

Contacta con el **departamento de IT del Colegio Huerta Santa Ana**. Ellos canalizarán tu feedback al equipo de desarrollo.

**Información útil al reportar un error:**
- Dispositivo que usas (iPad, Mac, Windows)
- Navegador y versión (Safari 17, Chrome 120, etc.)
- Pasos para reproducir el problema
- Captura de pantalla si es posible

### ¿Hay videotutoriales?

Actualmente no, pero están en desarrollo. Mientras tanto:
- 📖 Lee el **Manual del Usuario** (este documento)
- 💬 Pregunta al **chatbot IA** ("¿Cómo uso la App Aula?")
- 📧 Contacta con IT para formación presencial

---

**Última actualización**: Diciembre 2024
**¿No encuentras tu pregunta?** Usa el chatbot IA o contacta con IT del centro.

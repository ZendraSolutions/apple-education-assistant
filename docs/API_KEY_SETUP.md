# Guía de Configuración de API Key

Guía paso a paso para obtener y configurar tu API Key de Google Gemini en Jamf Assistant.

---

## ¿Por qué necesito una API Key?

El chatbot de Jamf Assistant usa **Google Gemini**, un modelo de inteligencia artificial muy avanzado. Para usarlo, Google requiere que tengas tu propia "llave de acceso" (API Key) que:

- ✅ Es **100% gratuita** con límites generosos (1500 consultas/día)
- ✅ Te da **control total** sobre tu uso
- ✅ Protege tu **privacidad** (solo tú la usas)
- ✅ Se guarda **cifrada** en tu navegador (seguridad bancaria)

**No te preocupes**: Este proceso solo toma 5 minutos y es muy sencillo.

---

## Paso 1: Ir a Google AI Studio

1. **Abre tu navegador** (Safari, Chrome, Edge o Firefox)

2. **Visita la siguiente URL**:
   ```
   https://aistudio.google.com/apikey
   ```
   O busca en Google: "Google AI Studio API Key"

3. **Verás la página de Google AI Studio**
   - Si es tu primera vez, verás un botón azul "Get started"
   - Si ya tienes cuenta, verás directamente el panel de API Keys

**Captura de texto de lo que verás:**
```
┌─────────────────────────────────────────────┐
│  Google AI Studio                    [👤]   │
├─────────────────────────────────────────────┤
│                                             │
│  API Keys                                   │
│  Create and manage your API keys           │
│                                             │
│  [+ Create API Key]                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Paso 2: Crear cuenta Google (si no tienes)

**Si ya tienes una cuenta de Gmail, sáltate este paso.**

Si no tienes cuenta de Google:

1. Click en **"Crear cuenta"** o **"Sign up"**
2. Completa el formulario:
   - Nombre y apellidos
   - Dirección de correo deseada (ej: `tunombre@gmail.com`)
   - Contraseña segura
3. Verifica tu número de teléfono
4. Acepta los términos de servicio
5. ✅ Ya tienes cuenta

**Consejo**: Usa tu email personal, no el del colegio, para evitar problemas si cambias de centro.

---

## Paso 3: Generar API Key

Ahora viene la parte importante:

1. **Click en el botón azul "Create API Key"** (Crear API Key)

2. **Elige tu proyecto** (o crea uno nuevo):
   - Si es tu primera vez, click en **"Create API Key in new project"**
   - Dale un nombre como "Jamf Assistant" (opcional)

3. **Espera 5-10 segundos** mientras Google genera tu key

4. **¡Tu API Key está lista!**
   Verás algo así:

   ```
   ┌─────────────────────────────────────────────┐
   │  API Key created                            │
   ├─────────────────────────────────────────────┤
   │                                             │
   │  AIzaSyD1234567890abcdefghijklmnopqrstuvw  │
   │                                             │
   │  [📋 Copy]        [👁️ Show]      [🗑️ Delete]│
   └─────────────────────────────────────────────┘
   ```

**Importante**: No cierres esta ventana todavía. Necesitas copiar la key en el siguiente paso.

---

## Paso 4: Copiar la clave

1. **Click en el botón "Copy"** (📋 Copiar)
   - Aparecerá un mensaje: "API Key copied to clipboard"

2. **Alternativa**: Si no hay botón de copiar:
   - Selecciona toda la clave con el ratón
   - Presiona Ctrl+C (Windows) o Cmd+C (Mac)

3. **Verifica que copiaste bien**:
   - La clave debe empezar con `AIza`
   - Debe tener exactamente **39 caracteres**
   - Ejemplo válido: `AIzaSyD1234567890abcdefghijklmnopqrstuvw`

**Consejo**: Pégala temporalmente en el Bloc de notas para verificar que está completa.

---

## Paso 5: Pegar en Jamf Assistant

Ahora volvemos a Jamf Assistant:

1. **Abre Jamf Assistant** en otra pestaña (o ventana)

2. **Click en el icono del chatbot** (robot en la esquina inferior derecha)

3. **Click en el icono de configuración** (⚙️) en la cabecera del chat

4. **Se abrirá el modal de configuración**:

   ```
   ┌─────────────────────────────────────────────┐
   │  ⚙️ Configurar API de IA              [✕]   │
   ├─────────────────────────────────────────────┤
   │                                             │
   │  Para usar el asistente con IA, necesitas  │
   │  una API Key de Google Gemini (gratuita).  │
   │                                             │
   │  1️⃣ Ve a Google AI Studio                   │
   │  2️⃣ Crea una API Key (es gratis)            │
   │  3️⃣ Pégala aquí abajo:                      │
   │                                             │
   │  ┌──────────────────────────┐              │
   │  │ AIza...               🔒 │ [Guardar]    │
   │  └──────────────────────────┘              │
   │                                             │
   └─────────────────────────────────────────────┘
   ```

5. **Pega tu API Key** en el campo de texto:
   - Click en el campo (donde dice "AIza...")
   - Presiona Ctrl+V (Windows) o Cmd+V (Mac)

6. **Verás validación en tiempo real**:
   - ✅ Icono verde: "Formato válido (fortaleza: fuerte)"
   - ❌ Icono rojo: "Error: longitud incorrecta" o similar

---

## Paso 6: Guardar configuración

Ahora elige cómo quieres guardar tu API Key:

### Opción 1: Solo esta sesión (temporal)
- ✅ Marca el checkbox **"Usar solo en esta sesión"**
- ⏱️ Se borrará cuando cierres el navegador
- 💡 Ideal para ordenadores compartidos

### Opción 2: 24 horas (predeterminado)
- ⬜ No marques ningún checkbox
- ⏱️ Se guardará cifrada por 24 horas
- 💡 Equilibrio entre seguridad y comodidad

### Opción 3: Permanente (anclada)
- ✅ Marca el checkbox **"Anclar API Key"**
- ⏱️ Se guardará cifrada indefinidamente
- 💡 Ideal para tu iPad personal

**Recomendación**:
- **iPad personal del docente**: Permanente
- **Ordenador del aula compartido**: Solo sesión

Cuando hayas elegido, **click en "Guardar"**.

---

## Paso 7: Verificar que funciona

Ahora vamos a probar que todo está correcto:

1. **Espera el mensaje de confirmación**:
   ```
   ✅ API Key guardada correctamente (cifrada)
   ```

2. **El modal se cerrará automáticamente**

3. **Escribe una pregunta de prueba en el chatbot**:
   ```
   ¿Qué es Jamf School?
   ```

4. **Si todo funciona, verás**:
   - El chatbot muestra "Escribiendo..."
   - Aparece una respuesta en 3-5 segundos
   - ✅ ¡Funciona perfectamente!

5. **Si hay error, verás uno de estos mensajes**:
   - ❌ "API Key inválida" → Revisa que la copiaste completa
   - ❌ "Quota exceeded" → Esperaste menos de 24h desde la última vez
   - ❌ "Network error" → Verifica tu conexión a internet

---

## Tips de seguridad

### ¿Cómo se protege mi API Key?

Tu API Key está **ultra segura** gracias a:

1. **Cifrado AES-256-GCM**:
   - Mismo nivel de seguridad que los bancos
   - Nadie puede leerla en texto plano
   - Específica de tu navegador

2. **Almacenamiento local**:
   - Solo en tu navegador (localStorage cifrado)
   - Nunca se envía a servidores de Jamf Assistant
   - Solo va a Google cuando haces una pregunta

3. **Sin acceso externo**:
   - Ni IT del centro puede verla
   - Ni desarrolladores tienen acceso
   - Solo tú en ese navegador específico

### ¿Qué NO hacer con tu API Key?

- ❌ **No la compartas** con otros docentes (que cada uno obtenga la suya)
- ❌ **No la publiques** en emails, chats o foros
- ❌ **No la escribas** en papel o archivos sin cifrar
- ❌ **No la uses** en otros proyectos sin leer sus términos de seguridad

### ¿Qué SÍ puedes hacer?

- ✅ Usarla en múltiples dispositivos (generando una nueva en cada uno)
- ✅ Regenerarla si sospechas que alguien la vió
- ✅ Borrarla desde "Mis Datos" cuando quieras
- ✅ Tener varias API Keys en diferentes cuentas de Google

---

## Límites de uso gratuito

Google ofrece generosamente:

| Límite | Cantidad |
|--------|----------|
| **Consultas al día** | 1500 |
| **Consultas por minuto** | 15 |
| **Caracteres por consulta** | 32,000 |

**Traducción para docentes**:
- 1500 consultas/día = **50-100 consultas diarias** durante meses
- 15 consultas/minuto = Más que suficiente para uso normal
- 32,000 caracteres = Preguntas y respuestas muy largas permitidas

**Si superas el límite**:
- ⚠️ Aparecerá un mensaje: "Quota exceeded. Try again in 24 hours"
- ✅ Espera hasta el día siguiente (se renueva automáticamente)
- ✅ O crea otra API Key con otra cuenta de Google

**Consejo**: Es muy raro superar estos límites con uso normal.

---

## Qué hacer si no funciona

### Error: "La API Key debe comenzar con AIza"

**Causa**: Copiaste la key incorrectamente.

**Solución**:
1. Vuelve a Google AI Studio
2. Click en "Show API Key" (👁️)
3. Copia de nuevo asegurándote de seleccionar TODO el texto
4. Pega en Jamf Assistant

### Error: "Longitud incorrecta: X caracteres (debe ser 39)"

**Causa**: La key está incompleta o tiene espacios.

**Solución**:
1. Verifica que no haya espacios al principio o final
2. Cuenta los caracteres (deben ser exactamente 39)
3. Si está incompleta, genera una nueva key en Google

### Error: "API Key inválida o expirada"

**Causa**: La key fue borrada en Google AI Studio o nunca existió.

**Soluciones**:
1. Ve a Google AI Studio > API Keys
2. Verifica que tu key sigue ahí y está activa
3. Si fue borrada, genera una nueva
4. Si cambió, copia la nueva y pégala en Jamf Assistant

### Error: "Quota exceeded"

**Causa**: Superaste el límite de 1500 consultas/día.

**Soluciones**:
1. **Espera 24 horas** (el límite se renueva automáticamente)
2. **Crea otra API Key** con otra cuenta de Google
3. **Reduce uso**: Haz preguntas más específicas y directas

### Error: "Network error" o "Failed to fetch"

**Causa**: Problema de conexión a internet o firewall.

**Soluciones**:
1. **Verifica WiFi**: Asegúrate de tener internet
2. **Prueba otro navegador**: A veces es un problema de caché
3. **Firewall del colegio**: Contacta con IT para permitir `generativelanguage.googleapis.com`
4. **VPN activa**: Desactívala temporalmente y prueba

---

## Regenerar o borrar API Key

### ¿Cuándo regenerar?

Regenera tu API Key si:
- Sospechas que alguien la vio
- Compartiste pantalla y aparecía en el modal
- Quieres empezar de cero con los límites

**Cómo regenerar**:
1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Click en 🗑️ (Delete) junto a tu key antigua
3. Click en "+ Create API Key"
4. Copia la nueva key
5. Pégala en Jamf Assistant (configuración)

**Importante**: La key antigua dejará de funcionar inmediatamente.

### ¿Cómo borrar de Jamf Assistant?

Si quieres eliminar tu API Key de Jamf Assistant:

1. Ve al menú lateral > **Mis Datos**
2. Click en la tarjeta **"Borrar todos mis datos"**
3. Confirma la acción
4. ✅ Tu API Key (y todo lo demás) se borra permanentemente

O específicamente:
1. Click en el chatbot
2. Click en ⚙️ (configuración)
3. Borra el contenido del campo
4. Click en "Guardar"

---

## Preguntas frecuentes

### ¿Puedo usar la misma API Key en varios dispositivos?

Sí, pero **no es recomendable** por seguridad. Mejor:
- Genera una API Key diferente para cada dispositivo
- Así si pierdes el iPad, borras solo esa key
- Los límites de uso son por key, no por cuenta

### ¿Mi API Key expira?

No, las API Keys de Google **no expiran** a menos que:
- Tú la borres manualmente
- Cierres tu cuenta de Google
- Google detecte uso abusivo (muy raro)

En Jamf Assistant SÍ expira el **almacenamiento** (24h predeterminado), pero la key en sí sigue siendo válida.

### ¿Cuántas API Keys puedo tener?

Google permite **múltiples API Keys** en la misma cuenta. Puedes tener:
- Una para Jamf Assistant en tu iPad
- Una para Jamf Assistant en tu Mac
- Otras para proyectos personales

**Límites compartidos**: Todas las keys de la misma cuenta comparten la cuota de 1500 consultas/día.

### ¿Puedo compartir mi API Key con otros docentes?

**No recomendado** porque:
- ❌ Comparten tu cuota (1500 consultas/día entre todos)
- ❌ Si alguien abusa, te bloquean a ti
- ❌ No sabes quién la usó ni cuándo
- ❌ Riesgo de seguridad (puede filtrarse)

**Mejor opción**: Que cada docente obtenga su propia API Key (5 min y gratis).

---

## Contacto y soporte

Si después de seguir esta guía tienes problemas:

1. **Revisa la sección "Qué hacer si no funciona"** (arriba)
2. **Consulta el FAQ** en `docs/FAQ.md`
3. **Contacta con el departamento de IT**

**Información útil al pedir ayuda**:
- Captura de pantalla del error
- Mensaje exacto que aparece
- Navegador y dispositivo que usas
- Pasos que seguiste antes del error

---

## Recursos adicionales

- 📖 [Documentación oficial de Google Gemini](https://ai.google.dev/docs)
- 🔑 [Gestionar tus API Keys](https://aistudio.google.com/apikey)
- 📊 [Ver uso de tu cuota](https://aistudio.google.com/apikey) (mismo enlace)
- 🔒 [Política de privacidad de Google](https://policies.google.com/privacy)

---

**Última actualización**: Diciembre 2024
**Tiempo estimado**: 5-10 minutos
**Nivel de dificultad**: Fácil (no requiere conocimientos técnicos)

¡Ya estás listo para usar el chatbot con IA! 🎉

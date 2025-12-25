# Guía de Inicio Rápido - Jamf Assistant

**Para:** Docentes
**Tiempo de lectura:** 3 minutos
**Objetivo:** Empezar a usar Jamf Assistant en menos de 5 minutos

---

## ¿Qué es Jamf Assistant?

Tu asistente personal para gestionar iPads, Macs y la App Aula. Accede a guías paso a paso, soluciones de problemas y un chatbot con inteligencia artificial, todo en una sola aplicación web.

**No necesitas instalar nada** - funciona directamente en tu navegador (Safari recomendado).

---

## 🚀 Inicio Rápido en 3 Pasos

### 1️⃣ Abre la Aplicación

```
🌐 URL: [proporcionada por el centro]
📱 Navegador: Safari (iPad/Mac) o Chrome
```

**Primera vez:**
- Verás un banner de privacidad → Click en **"Aceptar todo"** (recomendado)
- Aparece un tour de bienvenida → Click en **"Comenzar tour"** o **"Saltar"**

### 2️⃣ Navega por las Secciones

**Menú lateral (izquierda):**
- 🏠 **Dashboard** → Inicio y accesos rápidos
- 🍎 **Ecosistema Apple** → Visión general
- 🎓 **App Aula** → Gestionar tu clase con iPads
- 📱 **iPads** → Guías para iPads de alumnos
- 💻 **Macs** → Guías para Macs de docentes
- 🔧 **Troubleshooting** → Solucionar problemas
- 📋 **Checklists** → Tareas paso a paso
- 🔒 **Mis Datos** → Privacidad y configuración

**Área principal (centro):**
- Barra de búsqueda arriba
- Tarjetas con guías y herramientas
- Contenido organizado por temas

### 3️⃣ Encuentra lo que Necesitas

**Opción A: Buscar** 🔍
1. Click en la barra de búsqueda (parte superior)
2. Escribe tu problema: "iPad no conecta WiFi"
3. Click en el resultado que aparece
4. Sigue las instrucciones

**Opción B: Explorar secciones** 📖
1. Click en una sección del menú (ej: "iPads")
2. Navega por las tarjetas de guías
3. Click en una guía para abrirla
4. Lee y sigue los pasos

**Opción C: Usar el chatbot** 🤖 (requiere configuración)
1. Click en el icono del robot (esquina inferior derecha)
2. Haz tu pregunta en lenguaje natural
3. El chatbot te responde con soluciones

---

## 📋 Tareas Comunes

### Resolver un Problema con un iPad

```
1. Click en "Troubleshooting" (menú lateral)
2. Selecciona el problema (ej: "iPad no enciende")
3. Responde las preguntas del diagnóstico
4. Sigue la solución recomendada
```

### Configurar App Aula por Primera Vez

```
1. Click en "App Aula y Jamf Teacher" (menú lateral)
2. Scroll hasta "Guías para App Aula"
3. Click en "Configuración inicial de App Aula"
4. Sigue los pasos numerados
```

### Preparar iPads para Inicio de Curso

```
1. Click en "Checklists" (menú lateral)
2. Click en "Inicio de curso - Preparación de iPads"
3. Marca cada ítem cuando lo completes ✅
4. Tu progreso se guarda automáticamente
```

### Buscar una Guía Específica

```
1. Click en la barra de búsqueda (arriba)
2. Escribe palabras clave (ej: "resetear iPad")
3. Click en el resultado relevante
4. Lee la guía completa en el modal
```

---

## 🤖 Configurar el Chatbot IA (Opcional)

El chatbot te ayuda con preguntas complejas usando inteligencia artificial de Google Gemini.

**Pasos resumidos:**

1. **Obtener API Key gratuita:**
   - Ve a: https://aistudio.google.com/apikey
   - Inicia sesión con tu cuenta de Google
   - Click en "Create API Key"
   - Copia la clave (empieza por "AIza...")

2. **Configurar en Jamf Assistant:**
   - Click en el icono del robot 🤖 (esquina inferior derecha)
   - Click en el icono de configuración ⚙️ (cabecera del chat)
   - Pega tu API Key en el campo
   - Click en "Guardar"
   - ✅ Listo! Ya puedes chatear

**Importante:**
- Tu API Key se guarda **cifrada** solo en tu navegador
- Es **gratuita** (1500 consultas/día - más que suficiente)
- Solo tú tienes acceso a ella
- Puedes eliminarla en cualquier momento desde "Mis Datos"

**Guía completa:** Ver `docs/API_KEY_SETUP.md`

---

## 💡 Consejos Útiles

### Tema Oscuro 🌙
- Click en el icono de luna (parte inferior del menú lateral)
- Ahorra batería y reduce fatiga visual

### Instalar en iPad 📲
1. Abre Safari en tu iPad
2. Toca el botón "Compartir" (cuadrado con flecha)
3. Selecciona "Añadir a pantalla de inicio"
4. Toca "Añadir"
5. Ya tienes un icono en tu pantalla de inicio!

**Ventajas:**
- ✅ Se abre como una app nativa
- ✅ Funciona sin conexión (guías cacheadas)
- ✅ Más rápida y fluida
- ✅ Sin barra de navegador de Safari

### Funciona Sin Internet 🔌
- El Service Worker cachea las páginas que visitas
- Puedes consultar guías previamente abiertas offline
- El chatbot IA requiere conexión (consulta APIs de Google)
- Indicador de conexión en la esquina superior te avisa del estado

---

## 📚 Recursos Adicionales

**Documentación completa:**
- 📖 **Manual del Usuario:** `docs/USER_GUIDE.md` (15 min lectura)
- ❓ **Preguntas Frecuentes:** `docs/FAQ.md` (soluciones rápidas)
- 🔑 **Configurar API Key:** `docs/API_KEY_SETUP.md` (5 min)
- ⚙️ **Documentación Técnica:** `docs/ARCHITECTURE.md` (desarrolladores)

**Dentro de la app:**
- Busca cualquier tema en la barra de búsqueda
- Usa el chatbot IA para preguntas complejas
- Explora las secciones del menú lateral

**Ayuda adicional:**
- 💬 Contacta con IT del centro para problemas técnicos
- 📧 Email: it@school.edu
- ☎️ Extensión: XXXX

---

## 🆘 Problemas Comunes

### "No puedo instalar en mi iPad"
- ✅ Usa **Safari** (no Chrome)
- ✅ Asegúrate de estar en HTTPS
- ✅ Sigue los pasos de "Instalar en iPad" arriba

### "El chatbot no responde"
1. Verifica que tienes API Key configurada (⚙️ en el chat)
2. Comprueba tu conexión a internet (indicador arriba)
3. Revisa que la API Key sea válida (empieza por "AIza")
4. Si falla, bórrala y configura una nueva

### "La búsqueda no encuentra nada"
- Intenta palabras clave diferentes (ej: "wifi" en vez de "conexión")
- Usa el chatbot IA como alternativa
- Explora las secciones del menú manualmente

### "Olvidé dónde estaba algo"
- Usa la **barra de búsqueda** (arriba)
- Consulta el **Dashboard** (inicio) para accesos rápidos
- Revisa el **índice de documentación:** `docs/INDEX.md`

---

## 🎯 Próximos Pasos

**Ya estás listo para usar Jamf Assistant!**

**Para principiantes:**
1. ✅ Explora el Dashboard (inicio)
2. ✅ Prueba una búsqueda simple
3. ✅ Abre una guía de iPads
4. ✅ Instala la app en tu iPad (opcional)

**Para usuarios avanzados:**
1. ✅ Configura el chatbot IA
2. ✅ Completa una checklist
3. ✅ Usa un diagnóstico de troubleshooting
4. ✅ Activa el tema oscuro

**Recuerda:**
- No hay forma de "romper" la app - explora con confianza
- Todos los datos se guardan solo en tu navegador (privacidad)
- Puedes borrar todo desde "Mis Datos" si lo necesitas
- El manual completo está en `docs/USER_GUIDE.md`

---

## 🔖 Referencia Rápida

### Atajos de Teclado
- **Escape (Esc):** Cerrar modales
- **Tab:** Navegar entre elementos
- **Enter:** Confirmar acciones

### Iconos Importantes
- 🔍 **Lupa:** Búsqueda
- 🤖 **Robot:** Chatbot IA
- ⚙️ **Engranaje:** Configuración
- 🌙 **Luna:** Tema oscuro
- 🔒 **Candado:** Mis Datos (privacidad)
- 📋 **Clipboard:** Checklists
- 🔧 **Llave inglesa:** Troubleshooting

### Notificaciones (Toasts)
- 🟢 **Verde:** Éxito (todo bien)
- 🔴 **Rojo:** Error (algo falló)
- 🟡 **Amarillo:** Advertencia
- 🔵 **Azul:** Información

### Estado de Conexión
- 🟢 **Verde:** Online (todo OK)
- 🟡 **Amarillo:** Conexión inestable
- 🔴 **Rojo:** Sin internet (modo offline)

---

**¿Tienes más preguntas?**
👉 Lee el **Manual del Usuario completo:** `docs/USER_GUIDE.md`
👉 Consulta las **FAQ:** `docs/FAQ.md`
👉 O contacta con **IT del centro**

---

**Versión:** 1.0.0
**Actualizado:** 25/12/2024
**Creado para:** Docentes

**¡Disfruta usando Jamf Assistant!** 🎉

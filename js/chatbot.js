/**
 * ASISTENTE ECOSISTEMA APPLE EDUCACIÓN - Chatbot Module v4
 * Sistema RAG centrado en ASM + Jamf School + App Aula
 * Flujo: Apple School Manager → Jamf School → Dispositivos
 */

class JamfChatbot {
    constructor() {
        this.loadApiKeySettings();
        this.isOpen = false;
        this.isProcessing = false;
        this.conversationHistory = [];

        // Documentación - se carga desde archivo externo
        this.jamfDocs = [];
        this.docsMetadata = {
            version: '1.0.0',
            lastUpdated: '2025-12-23',
            source: 'Manual'
        };

        this.init();
    }

    // ===============================
    // INITIALIZATION
    // ===============================

    async init() {
        await this.loadDocumentation();
        this.bindEvents();
        this.updateApiKeyUI();
        this.showDocsInfo();
    }

    async loadDocumentation() {
        try {
            const response = await fetch('data/docs.json');
            if (response.ok) {
                const data = await response.json();
                this.jamfDocs = data.articles || [];
                this.docsMetadata = {
                    version: data.version,
                    lastUpdated: data.lastUpdated,
                    source: data.source,
                    updateFrequency: data.updateFrequency
                };
                console.log(`[Docs] Documentación cargada: ${this.jamfDocs.length} artículos (v${data.version})`);
            } else {
                console.log('[WARN] No se pudo cargar docs.json, usando documentación embebida');
                this.jamfDocs = this.getEmbeddedDocs();
            }
        } catch (e) {
            console.log('[WARN] Error cargando documentación:', e);
            this.jamfDocs = this.getEmbeddedDocs();
        }
    }

    showDocsInfo() {
        const footer = document.createElement('div');
        footer.className = 'docs-info';
        footer.innerHTML = `<i class="ri-book-open-line"></i> Docs: ${this.docsMetadata.lastUpdated} • ${this.jamfDocs.length} artículos`;

        const panel = document.getElementById('chatbotPanel');
        if (panel && !panel.querySelector('.docs-info')) {
            panel.appendChild(footer);
        }
    }

    getEmbeddedDocs() {
        // Fallback completo si no se puede cargar el JSON (ej: CORS en file://)
        return [
            {
                id: 'ecosistema-apple',
                title: 'El Ecosistema Apple en Educación',
                category: 'Ecosistema',
                content: `El ecosistema educativo de Apple tiene 3 componentes principales:

1. APPLE SCHOOL MANAGER (ASM) - school.apple.com - ES EL CENTRO
   - Aquí se crean los usuarios (profesores y alumnos)
   - Aquí se crean las clases
   - Aquí se asignan los dispositivos al servidor MDM
   - Aquí se compran y asignan las apps (VPP integrado)

2. JAMF SCHOOL - Herramienta MDM
   - Se conecta a ASM y RECIBE los datos (sincronización)
   - Aplica configuraciones y restricciones a dispositivos
   - Distribuye apps a los iPads y Macs

3. DISPOSITIVOS + APP AULA
   - iPads supervisados para alumnado
   - Macs para profesorado
   - App Aula usa las clases de ASM

IMPORTANTE: Las cosas se CREAN en ASM, no en Jamf. Jamf solo las recibe.`,
                keywords: ['ecosistema', 'asm', 'apple school manager', 'jamf school', 'flujo', 'como funciona']
            },
            {
                id: 'enrollment-asm',
                title: 'Inscripción de Dispositivos desde ASM',
                category: 'Enrollment',
                content: `Los dispositivos se inscriben automáticamente porque están en Apple School Manager:

EN ASM (school.apple.com):
1. Los dispositivos comprados a Apple/reseller aparecen automáticamente
2. Ve a Dispositivos → busca por número de serie
3. Asigna el dispositivo a tu servidor MDM (Jamf School)

EN JAMF SCHOOL:
4. El dispositivo aparecerá en Dispositivos → Enrollment automático
5. Configura un PreStage Enrollment para definir qué configuración recibe

EN EL DISPOSITIVO:
6. Al encenderlo y conectar a WiFi, se inscribe solo
7. Aparece como "Gestionado" con las apps y restricciones configuradas`,
                keywords: ['enrollment', 'inscribir', 'asm', 'apple school manager', 'automatico', 'prestage', 'dispositivo nuevo']
            },
            {
                id: 'aula-app',
                title: 'App Aula (Apple Classroom) para Profesores',
                category: 'Aula',
                content: `La app Aula permite a los profesores gestionar la clase en tiempo real:

QUÉ PUEDE HACER UN PROFESOR:
- Ver las pantallas de todos los iPads de su clase
- Abrir una app en todos los iPads a la vez
- Bloquear los iPads durante un examen
- Silenciar dispositivos
- Enviar/recibir archivos con AirDrop

REQUISITOS PARA QUE FUNCIONE:
1. Las clases deben estar creadas en Apple School Manager (NO en Jamf)
2. Jamf School sincroniza las clases desde ASM
3. Bluetooth activado en todos los dispositivos
4. Misma red WiFi (sin "aislamiento de clientes")
5. iPads deben ser supervisados

SI NO FUNCIONA: Ver diagnóstico "Problemas con Aula"`,
                keywords: ['aula', 'classroom', 'apple classroom', 'profesor', 'ver pantallas', 'bloquear', 'clase']
            },
            {
                id: 'aula-troubleshoot',
                title: 'Problemas con App Aula',
                category: 'Aula',
                content: `Si el profesor no ve los dispositivos en Aula:

PASO 1 - VERIFICAR EN ASM (school.apple.com):
- ¿Existe la clase con el profesor asignado?
- ¿Los alumnos/iPads están en esa clase?

PASO 2 - VERIFICAR EN JAMF SCHOOL:
- ¿Se ha sincronizado la clase desde ASM?
- Ir a Usuarios → Clases → ¿Aparece la clase?

PASO 3 - VERIFICAR EN LOS DISPOSITIVOS:
- Bluetooth activado en TODOS (profesor + alumnos)
- Misma red WiFi (preguntar a IT si hay "client isolation")
- Reiniciar la app Aula en el iPad del profesor

PASO 4 - FORZAR SINCRONIZACIÓN:
- En Jamf School: seleccionar dispositivos → Send Blank Push
- Esperar 2-3 minutos y reiniciar Aula

TODAVÍA NO FUNCIONA:
- Reiniciar los iPads
- Verificar que los iPads son supervisados (Ajustes → General → Info)`,
                keywords: ['aula', 'problema', 'no ve', 'no aparece', 'classroom', 'troubleshooting', 'bluetooth', 'wifi']
            },
            {
                id: 'crear-clases',
                title: 'Crear Clases (se hace en ASM)',
                category: 'Clases',
                content: `Las clases se crean en Apple School Manager, NO en Jamf:

EN ASM (school.apple.com):
1. Ir a Clases → Crear clase
2. Nombre de la clase (ej: "3º ESO - Matemáticas")
3. Asignar profesor/es
4. Asignar alumnos (o importar desde tu sistema de gestión escolar)
5. Guardar

EN JAMF SCHOOL:
6. Ir a Configuración → Apple School Manager → Sincronizar
7. La clase aparecerá en Usuarios → Clases
8. Los dispositivos de los alumnos ya estarán asociados

EN APP AULA:
9. El profesor abre Aula y ve su clase automáticamente
10. Puede empezar a gestionar los iPads

NOTA: Si usas SFTP o API para importar datos, las clases también vienen de ASM.`,
                keywords: ['clase', 'crear clase', 'asm', 'profesor', 'alumnos', 'aula']
            },
            {
                id: 'apps-vpp',
                title: 'Instalar Apps (VPP desde ASM)',
                category: 'Apps',
                content: `Las apps se compran/asignan en ASM y se distribuyen desde Jamf:

PASO 1 - EN ASM (school.apple.com):
1. Ir a Apps y libros
2. Buscar la app que necesitas
3. Comprar licencias (muchas apps educativas son gratis)
4. Asignar a tu ubicación

PASO 2 - EN JAMF SCHOOL:
5. Ir a Apps → App Store → la app aparece automáticamente
6. Crear distribución: seleccionar la app → Distribute
7. Elegir a quién: grupo de dispositivos, clase, o todos
8. Modo: Automático (se instala sola) o Bajo demanda

PARA PROFESORES (con Jamf Teacher):
- El profesor puede instalar apps desde la app Jamf Teacher
- Solo ve apps marcadas como "Available in Teacher"
- Útil para instalar apps específicas durante una clase`,
                keywords: ['apps', 'vpp', 'instalar', 'distribuir', 'licencias', 'app store', 'asm']
            },
            {
                id: 'restricciones',
                title: 'Perfiles de Restricción',
                category: 'Restricciones',
                content: `Los perfiles de restricción se crean en Jamf School:

EN JAMF SCHOOL:
1. Ir a Perfiles → + Nuevo perfil
2. Tipo: iOS/iPadOS
3. Sección: Restricciones
4. Configurar según edad/curso:

PRIMARIA (más restrictivo):
- Sin Safari
- Sin App Store
- Sin cámara (opcional)
- Sin AirDrop
- Sin cambios de cuenta

ESO/BACHILLERATO (menos restrictivo):
- Safari con filtro de contenido
- App Store con restricción de edad (+12)
- Cámara permitida
- AirDrop solo para la clase

5. Asignar a Smart Group (ej: "iPads Primaria")
6. El perfil se aplica automáticamente

IMPORTANTE: Los iPads deben ser supervisados para que funcionen todas las restricciones.`,
                keywords: ['restricciones', 'perfil', 'bloquear', 'safari', 'seguridad', 'primaria', 'eso']
            },
            {
                id: 'activation-lock',
                title: 'Bloqueo de Activación',
                category: 'Seguridad',
                content: `Si un iPad pide Apple ID y contraseña al restaurarlo:

OPCIÓN 1 - CÓDIGO BYPASS (si está en Jamf):
1. En Jamf School: Dispositivos → buscar el iPad
2. Ir a Seguridad → Activation Lock Bypass Code
3. En el iPad: poner cualquier email + el código bypass como contraseña

OPCIÓN 2 - NO HAY CÓDIGO:
- Contactar a Apple con la factura original del dispositivo
- Apple puede desbloquearlo remotamente

PREVENCIÓN:
- En el PreStage Enrollment de Jamf, activar "Activation Lock Bypass"
- Así Jamf guarda el código automáticamente para todos los dispositivos nuevos`,
                keywords: ['bloqueo', 'activacion', 'activation lock', 'bypass', 'apple id', 'restaurar']
            },
            {
                id: 'smart-groups',
                title: 'Grupos Inteligentes (Smart Groups)',
                category: 'Administración',
                content: `Los Smart Groups organizan dispositivos automáticamente:

EN JAMF SCHOOL:
1. Ir a Dispositivos → Smart Groups → + Nuevo
2. Definir criterios, por ejemplo:
   - Modelo: iPad
   - Usuario contiene: "1ESO"
   - Esto crea grupo "iPads de 1º ESO" automáticamente

USOS COMUNES:
- "iPads Primaria" → para restricciones más fuertes
- "iPads sin actualizar" → para forzar actualización
- "Macs profesorado" → para apps de profesores
- "iPads de 3ºA" → para asignar apps de esa clase

Los dispositivos entran/salen del grupo automáticamente según cumplan los criterios.`,
                keywords: ['smart group', 'grupo', 'filtro', 'criterio', 'organizar']
            },
            {
                id: 'sincronizacion-asm',
                title: 'Sincronización ASM ↔ Jamf',
                category: 'Administración',
                content: `Jamf School se sincroniza con Apple School Manager:

QUÉ SE SINCRONIZA:
- Usuarios (profesores y alumnos)
- Clases
- Dispositivos asignados
- Apps y licencias VPP

CÓMO FORZAR SINCRONIZACIÓN:
1. Jamf School → Configuración → Apple School Manager
2. Click en "Sincronizar ahora"
3. Esperar unos minutos

SI ALGO NO APARECE EN JAMF:
1. Verificar que existe en ASM (school.apple.com)
2. Verificar que está asignado a tu ubicación/servidor
3. Forzar sincronización
4. Si sigue sin aparecer: contactar soporte Jamf

FRECUENCIA: Jamf sincroniza automáticamente cada pocas horas.`,
                keywords: ['sincronizar', 'asm', 'no aparece', 'jamf', 'conexion']
            }
        ];
    }

    // ===============================
    // API KEY MANAGEMENT
    // ===============================

    loadApiKeySettings() {
        const settings = JSON.parse(localStorage.getItem('jamf-api-settings') || '{}');
        this.apiKey = settings.key || '';
        this.isPinned = settings.pinned || false;
        this.expiryTime = settings.expiry || 0;

        if (!this.isPinned && this.expiryTime && Date.now() > this.expiryTime) {
            this.clearApiKey();
        }
    }

    saveApiKeySettings(key, pinned = false) {
        const expiry = pinned ? 0 : Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('jamf-api-settings', JSON.stringify({ key, pinned, expiry }));
        this.apiKey = key;
        this.isPinned = pinned;
        this.expiryTime = expiry;
    }

    clearApiKey() {
        localStorage.removeItem('jamf-api-settings');
        this.apiKey = '';
        this.isPinned = false;
        this.expiryTime = 0;
    }

    // ===============================
    // RAG: KEYWORD SEARCH
    // ===============================

    searchRelevantDocs(query, topK = 3) {
        const queryWords = query.toLowerCase().split(/\s+/);

        const results = this.jamfDocs.map(doc => {
            let score = 0;
            const allText = (doc.title + ' ' + doc.content + ' ' + (doc.keywords || []).join(' ')).toLowerCase();

            queryWords.forEach(word => {
                if (word.length < 3) return;
                if (allText.includes(word)) score++;
                if ((doc.keywords || []).some(k => k.includes(word))) score += 2;
                if (doc.title.toLowerCase().includes(word)) score += 3;
            });

            return { ...doc, score };
        }).filter(d => d.score > 0).sort((a, b) => b.score - a.score);

        return results.slice(0, topK);
    }

    // ===============================
    // EVENTS
    // ===============================

    bindEvents() {
        document.getElementById('chatbotFab')?.addEventListener('click', () => this.toggleChat());
        document.getElementById('chatbotClose')?.addEventListener('click', () => this.closeChat());
        document.getElementById('chatbotSettings')?.addEventListener('click', () => this.openApiModal());
        document.getElementById('chatbotSend')?.addEventListener('click', () => this.sendMessage());

        document.getElementById('chatbotInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isProcessing) this.sendMessage();
        });

        document.getElementById('apiModalClose')?.addEventListener('click', () => this.closeApiModal());
        document.getElementById('saveApiKey')?.addEventListener('click', () => this.saveApiKeyFromModal());

        document.getElementById('apiModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'apiModal') this.closeApiModal();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        document.getElementById('chatbotPanel').classList.toggle('active', this.isOpen);

        if (this.isOpen && !this.apiKey) {
            setTimeout(() => {
                if (!this.apiKey) {
                    this.addBotMessage('Para respuestas con IA, necesitas una API Key de Google Gemini (gratuita). Pulsa el icono de configuración para configurarla.\n\nDocumentación: v' + this.docsMetadata.version + ' (' + this.docsMetadata.lastUpdated + ')');
                }
            }, 500);
        }
    }

    closeChat() {
        this.isOpen = false;
        document.getElementById('chatbotPanel').classList.remove('active');
    }

    openApiModal() {
        document.getElementById('apiModal').classList.add('active');
        this.updateApiKeyUI();
    }

    closeApiModal() {
        document.getElementById('apiModal').classList.remove('active');
    }

    updateApiKeyUI() {
        const input = document.getElementById('apiKeyInput');
        const pinCheckbox = document.getElementById('pinApiKey');

        if (input && this.apiKey) input.value = this.apiKey;
        if (pinCheckbox) pinCheckbox.checked = this.isPinned;

        if (this.apiKey) {
            const expiryText = this.isPinned ? 'Guardada permanentemente' :
                `Expira en ${Math.round((this.expiryTime - Date.now()) / (1000 * 60 * 60))} horas`;
            this.updateApiStatus(`API Key configurada - ${expiryText}`, 'success');
        }
    }

    async saveApiKeyFromModal() {
        const input = document.getElementById('apiKeyInput');
        const pinCheckbox = document.getElementById('pinApiKey');
        const key = input.value.trim();
        const pinned = pinCheckbox?.checked || false;

        if (!key) {
            this.updateApiStatus('Introduce una API Key válida', 'error');
            return;
        }

        // Limpiar espacios invisibles y saltos de línea
        const cleanKey = key.replace(/[\s\n\r]/g, '');

        this.updateApiStatus('Verificando API Key...', '');

        const result = await this.testApiKey(cleanKey);

        if (result.valid) {
            this.saveApiKeySettings(cleanKey, pinned);
            const msg = pinned ? 'API Key guardada permanentemente' : 'API Key guardada (24 horas)';
            this.updateApiStatus(msg, 'success');
            setTimeout(() => this.closeApiModal(), 1500);
        } else {
            this.updateApiStatus(`${result.error}`, 'error');
        }
    }

    async testApiKey(key) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Responde solo: OK' }] }]
                })
            });

            if (response.ok) {
                return { valid: true };
            } else {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.error?.message || response.statusText;

                // Traducir errores comunes al español
                if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
                    return { valid: false, error: 'API Key inválida. Verifica que la copiaste sin espacios extra.' };
                }
                if (errorMsg.includes('QUOTA_EXCEEDED')) {
                    return { valid: false, error: 'Cuota excedida. Espera unos minutos o crea otra key.' };
                }
                if (errorMsg.includes('PERMISSION_DENIED')) {
                    return { valid: false, error: 'Permisos denegados. Activa la API en Google Cloud Console.' };
                }
                if (errorMsg.includes('not found') || errorMsg.includes('does not exist')) {
                    return { valid: false, error: 'Modelo no disponible. Intenta de nuevo más tarde.' };
                }
                if (response.status === 400) {
                    return { valid: false, error: 'API Key inválida o mal formada. Copia la key completa desde Google AI Studio.' };
                }

                // Mostrar error real para diagnóstico
                console.error('API Error:', errorMsg);
                return { valid: false, error: 'Error: ' + errorMsg.substring(0, 80) };
            }
        } catch (e) {
            if (e.message.includes('Failed to fetch')) {
                return { valid: false, error: 'Error de red. Verifica tu conexión a internet.' };
            }
            return { valid: false, error: 'Error de conexión: ' + e.message };
        }
    }

    updateApiStatus(message, type) {
        const status = document.getElementById('apiStatus');
        if (status) {
            status.textContent = message;
            status.className = 'api-status';
            if (type) status.classList.add(type);
        }
    }

    // ===============================
    // CHAT & RAG
    // ===============================

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();

        if (!message || this.isProcessing) return;

        input.value = '';
        this.addUserMessage(message);

        this.isProcessing = true;
        this.showTypingIndicator();

        try {
            const relevantDocs = this.searchRelevantDocs(message);

            let response;
            if (this.apiKey) {
                response = await this.callGeminiWithRAG(message, relevantDocs);
            } else {
                response = this.generateOfflineResponse(message, relevantDocs);
            }

            this.hideTypingIndicator();
            this.addBotMessage(response);

            if (relevantDocs.length > 0) {
                this.showSources(relevantDocs);
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addBotMessage('Error al procesar. ' + (error.message || 'Verifica tu conexión.'));
            console.error('Chat error:', error);
        }

        this.isProcessing = false;
    }

    async callGeminiWithRAG(userMessage, relevantDocs) {
        let context = '';
        if (relevantDocs.length > 0) {
            context = '\n\nDOCUMENTACIÓN OFICIAL DE JAMF:\n';
            relevantDocs.forEach((doc, i) => {
                context += `\n[${i + 1}] ${doc.title}\n${doc.content}\n`;
                if (doc.officialDocUrl) {
                    context += `Fuente: ${doc.officialDocUrl}\n`;
                }
            });
        }

        const systemPrompt = `Eres un asistente experto en el ecosistema educativo de Apple para un centro escolar.

ECOSISTEMA (orden de importancia):
1. APPLE SCHOOL MANAGER (ASM) - school.apple.com - ES EL CENTRO DE TODO
   - Aquí se crean usuarios (profesores, alumnos)
   - Aquí se crean las clases
   - Aquí se asignan dispositivos al servidor MDM
   - Aquí se compran y asignan apps (VPP integrado)

2. JAMF SCHOOL - Herramienta de gestión (MDM)
   - RECIBE usuarios y dispositivos desde ASM (sincronización)
   - Aplica perfiles de configuración y restricciones
   - Distribuye apps a los dispositivos
   - NO es donde se crean usuarios ni clases (eso es en ASM)

3. DISPOSITIVOS + APP AULA
   - iPads supervisados para alumnado
   - Macs para profesorado
   - App Aula (Apple Classroom) usa las clases creadas en ASM

FLUJO CORRECTO: ASM crea → Jamf sincroniza → Dispositivos reciben

INSTRUCCIONES:
1. Responde en español, con lenguaje accesible para profesores (no solo IT)
2. Usa la DOCUMENTACIÓN proporcionada como base
3. Siempre menciona si algo se hace en ASM o en Jamf School
4. Para problemas: primero verificar ASM, luego Jamf, luego dispositivo
5. Da rutas de menú exactas cuando sea posible
6. La app Aula es fundamental - prioriza soluciones relacionadas

IMPORTANTE: Si el usuario pregunta cómo crear algo (usuarios, clases, etc.),
recuerda que se crea en Apple School Manager, NO en Jamf.
${context}`;

        this.conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: systemPrompt }] },
                    { role: 'model', parts: [{ text: 'Entendido.' }] },
                    ...this.conversationHistory
                ],
                tools: [{ google_search: {} }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 1024 }
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error?.message || 'Error de API');
        }

        const data = await response.json();
        const botResponse = data.candidates[0].content.parts[0].text;

        this.conversationHistory.push({ role: 'model', parts: [{ text: botResponse }] });
        if (this.conversationHistory.length > 16) {
            this.conversationHistory = this.conversationHistory.slice(-16);
        }

        return botResponse;
    }

    generateOfflineResponse(message, relevantDocs) {
        if (relevantDocs.length > 0) {
            const doc = relevantDocs[0];
            let resp = `**${doc.title}**\n\n${doc.content}`;
            if (doc.officialDocUrl) {
                resp += `\n\n[Ver documentación oficial](${doc.officialDocUrl})`;
            }
            resp += '\n\nConfigura tu API Key para respuestas personalizadas.';
            return resp;
        }

        return `No encontré información sobre eso.\n\nPrueba con: enrollment, apps, classroom, teacher, restricciones, bloqueo, actualizaciones`;
    }

    showSources(docs) {
        const sourcesHtml = docs.slice(0, 2).map(doc =>
            `<span class="source-tag" title="${doc.title}"><i class="ri-file-text-line"></i> ${doc.category}</span>`
        ).join(' ');

        const container = document.getElementById('chatbotMessages');
        const sources = document.createElement('div');
        sources.className = 'chat-sources';
        sources.innerHTML = `<small>Fuentes: ${sourcesHtml}</small>`;
        container.appendChild(sources);
        this.scrollToBottom();
    }

    // ===============================
    // UI HELPERS
    // ===============================

    addUserMessage(text) {
        const container = document.getElementById('chatbotMessages');
        const msg = document.createElement('div');
        msg.className = 'chat-message user';
        msg.innerHTML = `<div class="message-avatar"><i class="ri-user-line"></i></div><div class="message-content"><p>${this.escapeHtml(text)}</p></div>`;
        container.appendChild(msg);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const container = document.getElementById('chatbotMessages');
        const msg = document.createElement('div');
        msg.className = 'chat-message bot';
        msg.innerHTML = `<div class="message-avatar"><i class="ri-robot-line"></i></div><div class="message-content">${this.formatMessage(text)}</div>`;
        container.appendChild(msg);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const container = document.getElementById('chatbotMessages');
        const indicator = document.createElement('div');
        indicator.className = 'chat-message bot';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `<div class="message-avatar"><i class="ri-robot-line"></i></div><div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div>`;
        container.appendChild(indicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        document.getElementById('typingIndicator')?.remove();
    }

    scrollToBottom() {
        const container = document.getElementById('chatbotMessages');
        if (container) container.scrollTop = container.scrollHeight;
    }

    formatMessage(text) {
        let html = this.escapeHtml(text);
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        html = html.replace(/^\d+\.\s/gm, '<br>• ');
        html = html.replace(/^-\s/gm, '<br>• ');
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        return '<p>' + html + '</p>';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.JamfChatbot = JamfChatbot;

/**
 * JAMF ASSISTANT - Chatbot Module v3
 * Con sistema RAG, carga externa de docs y mejor manejo de errores
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
                id: 'enrollment-abm',
                title: 'Enrollment Automático con Apple Business Manager',
                category: 'Enrollment',
                content: `Para inscribir dispositivos automáticamente en Jamf usando ABM:
1. Los dispositivos deben estar comprados a través de Apple o reseller autorizado
2. Accede a business.apple.com y verifica que el dispositivo aparece
3. Asigna el dispositivo a tu servidor MDM (Jamf)
4. En Jamf, configura el PreStage Enrollment
5. Cuando el dispositivo se encienda y conecte a internet, se inscribirá automáticamente`,
                keywords: ['enrollment', 'inscribir', 'abm', 'apple business manager', 'automatico', 'prestage']
            },
            {
                id: 'enrollment-manual',
                title: 'Enrollment Manual vía URL',
                category: 'Enrollment',
                content: `Para inscribir manualmente un Mac que no está en ABM:
1. Abre Safari en el Mac
2. Ve a: tudominio.jamfcloud.com/enroll
3. Inicia sesión con credenciales de Jamf
4. Descarga e instala el perfil de enrollment
5. El dispositivo aparecerá en Jamf como "Managed"`,
                keywords: ['enrollment', 'manual', 'url', 'mac', 'inscribir']
            },
            {
                id: 'apps-vpp',
                title: 'Distribución de Apps con VPP/ABM',
                category: 'Apps',
                content: `Para distribuir apps usando Volume Purchase Program:
1. Compra las apps en Apple Business Manager (Apps y Libros)
2. Asigna las licencias a tu ubicación
3. En Jamf: Apps → Mobile Device Apps → + Add
4. Busca la app y selecciona distribución
5. Define el Scope: All Devices o Smart Group
6. Guarda y las apps se instalarán`,
                keywords: ['apps', 'vpp', 'instalar', 'distribuir', 'licencias']
            },
            {
                id: 'apps-teacher',
                title: 'Jamf Teacher: Apps bajo demanda por profesores',
                category: 'Apps',
                content: `Para que los profesores instalen apps en iPads del alumnado:
1. En Jamf: Devices → Settings → Teacher Permissions → Activar permisos
2. Apps → [App] → Scope → Marca "Available in Teacher"
3. Configura clases en Users → Classes
4. El profesor usa Jamf Teacher app o portal web tudominio.jamfcloud.com/teacher
5. Puede instalar/desinstalar apps en iPads de su clase
Requisitos: iPads supervisados, apps en ABM, Jamf School`,
                keywords: ['teacher', 'profesor', 'instalar apps', 'jamf teacher', 'classroom']
            },
            {
                id: 'classroom-setup',
                title: 'Configuración de Apple Classroom',
                category: 'Classroom',
                content: `Para configurar Apple Classroom:
1. Crea clases en Jamf: Users → Classes → + New
2. Asigna profesor y alumnos/dispositivos
3. Instala Apple Classroom en dispositivo del profesor
4. Requisitos: iPads supervisados, Bluetooth activado, misma red WiFi
Permite: ver pantallas, abrir apps, bloquear dispositivos`,
                keywords: ['classroom', 'apple classroom', 'clase', 'profesor']
            },
            {
                id: 'classroom-troubleshoot',
                title: 'Problemas con Apple Classroom',
                category: 'Classroom',
                content: `Si el profesor no ve los dispositivos:
1. Verificar Bluetooth activado en todos
2. Verificar misma red WiFi (sin aislamiento de clientes)
3. Verificar clases en Jamf con profesor y alumnos asignados
4. Forzar sincronización: seleccionar dispositivos → Send Blank Push
5. Reiniciar dispositivos si persiste`,
                keywords: ['classroom', 'problema', 'no ve', 'troubleshooting', 'bluetooth']
            },
            {
                id: 'restrictions-profile',
                title: 'Perfiles de Restricción',
                category: 'Restricciones',
                content: `Para crear perfiles de restricción:
1. Configuration Profiles → + New → Mobile Device → Restrictions
2. Configurar según edad: Primaria (sin Safari/App Store), ESO (Safari con filtro)
3. Define el Scope (Smart Group por curso)
4. Guarda y se aplica automáticamente`,
                keywords: ['restricciones', 'perfil', 'bloquear', 'safari', 'seguridad']
            },
            {
                id: 'activation-lock',
                title: 'Bloqueo de Activación',
                category: 'Seguridad',
                content: `Para resolver bloqueo de activación:
1. Si está en Jamf: Devices → Mobile Devices → buscar → Security → Activation Lock Bypass Code
2. En pantalla de bloqueo: email cualquiera + código bypass como contraseña
3. Si NO hay código: contactar Apple con factura original
Prevención: Activar "Activation Lock Bypass" en PreStage Enrollment`,
                keywords: ['bloqueo', 'activacion', 'activation lock', 'bypass', 'apple id']
            },
            {
                id: 'self-service',
                title: 'Self Service para Macs',
                category: 'Macs',
                content: `Self Service permite a usuarios instalar software:
1. Policies → [Policy] → Self Service → Make Available
2. Añade apps, impresoras, scripts como opciones
3. Usuarios abren Self Service y ven opciones disponibles
4. Al hacer clic se ejecuta la política`,
                keywords: ['self service', 'mac', 'autoservicio', 'instalar']
            },
            {
                id: 'smart-groups',
                title: 'Smart Groups',
                category: 'Administración',
                content: `Smart Groups son grupos dinámicos por criterios:
1. Devices → Smart Device Groups → + New
2. Define criterios: modelo, OS, ubicación, usuario
3. Dispositivos que cumplan se añaden automáticamente
4. Úsalos para Scope de apps, perfiles, políticas
Ejemplos: "iPads 1º ESO", "iPads sin actualizar", "Macs profesorado"`,
                keywords: ['smart group', 'grupo', 'filtro', 'criterio']
            },
            {
                id: 'os-updates',
                title: 'Actualizaciones de Sistema',
                category: 'Mantenimiento',
                content: `Para gestionar actualizaciones iOS/macOS:
1. Jamf School: Devices → Actions → Update OS
2. Jamf Pro: Policies con "Software Updates"
3. Puedes forzar o dejar disponible para usuario
Buenas prácticas: probar en grupo piloto primero`,
                keywords: ['actualizar', 'update', 'ios', 'macos', 'sistema']
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

        const systemPrompt = `Eres un asistente experto en Jamf para entornos educativos.

INSTRUCCIONES:
1. Responde en español
2. Usa la DOCUMENTACIÓN proporcionada
3. Sé conciso pero completo
4. Usa listas numeradas
5. Da rutas de menú exactas

CONTEXTO:
- Jamf School/Pro para MDM
- iPads supervisados para alumnado
- Macs para profesorado
- Apple Classroom
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

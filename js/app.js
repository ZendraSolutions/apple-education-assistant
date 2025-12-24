/**
 * JAMF ASSISTANT - Main Application
 * Lógica principal de navegación y renderizado
 */

class JamfAssistant {
    constructor() {
        this.currentSection = 'dashboard';
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.bindNavigation();
        this.bindSearch();
        this.bindModal();
        this.bindMenuToggle();
        this.bindThemeToggle(); // New
        this.showUpdateInfo();
        this.renderSection('dashboard');
    }

    // Theme Management
    bindThemeToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        const icon = document.getElementById('themeIcon');

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        toggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(newTheme);
        });
    }

    updateThemeIcon(theme) {
        const icon = document.getElementById('themeIcon');
        icon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
    }

    showUpdateInfo() {
        const updateEl = document.getElementById('updateInfo');
        if (updateEl && KnowledgeBase._metadata) {
            const meta = KnowledgeBase._metadata;
            // Security: Sanitize metadata from knowledge base
            const version = DOMPurify.sanitize(meta.version);
            const lastUpdated = DOMPurify.sanitize(meta.lastUpdated);
            const articleCount = parseInt(meta.articleCount) || 0;
            updateEl.innerHTML = `
                <i class="ri-book-open-line update-icon"></i>
                <span class="update-text">v${version} • ${lastUpdated}<br>${articleCount} guías</span>
            `;
        }
    }

    // Navigation
    bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.navigateTo(section);
            });
        });
    }

    navigateTo(section) {
        // Update nav
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');

        // Close mobile menu
        document.getElementById('sidebar').classList.remove('active');

        this.currentSection = section;
        this.renderSection(section);
    }

    // Render sections
    renderSection(section) {
        const wrapper = document.getElementById('contentWrapper');

        switch (section) {
            case 'dashboard':
                wrapper.innerHTML = this.renderDashboard();
                break;
            case 'ecosistema':
                wrapper.innerHTML = this.renderEcosistema();
                break;
            case 'ipads':
                wrapper.innerHTML = this.renderIpads();
                break;
            case 'macs':
                wrapper.innerHTML = this.renderMacs();
                break;
            case 'aula':
            case 'classroom':
                wrapper.innerHTML = this.renderAula();
                break;
            case 'teacher':
                wrapper.innerHTML = this.renderTeacher();
                break;
            case 'troubleshooting':
                wrapper.innerHTML = this.renderTroubleshooting();
                break;
            case 'checklists':
                wrapper.innerHTML = this.renderChecklists();
                break;
            case 'mis-datos':
                wrapper.innerHTML = this.renderMisDatos();
                break;
        }

        this.bindSectionEvents();
    }

    renderDashboard() {
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Asistente Apple Education</h1>
                    <p class="section-subtitle">Gestión de iPads, Macs y App Aula para tu centro escolar</p>
                </div>

                <!-- Barra de acciones rápidas - Above the fold -->
                <div class="quick-actions-bar">
                    <button class="quick-action-btn" data-section="aula">
                        <i class="ri-group-line"></i> Problemas con Aula
                    </button>
                    <button class="quick-action-btn" data-diagnostic="aula-no-funciona">
                        <i class="ri-error-warning-line"></i> No veo alumnos
                    </button>
                    <button class="quick-action-btn" data-diagnostic="apps-not-installing">
                        <i class="ri-download-cloud-2-line"></i> Apps no instalan
                    </button>
                    <button class="quick-action-btn" data-section="ecosistema">
                        <i class="ri-flow-chart"></i> ¿Cómo funciona?
                    </button>
                </div>

                <!-- Secciones principales -->
                <div class="quick-stats">
                    <div class="stat-card" data-section="aula">
                        <div class="stat-icon classroom"><i class="ri-group-line"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">App Aula</span>
                            <span class="stat-value">Control de clase</span>
                        </div>
                    </div>
                    <div class="stat-card" data-section="ipads">
                        <div class="stat-icon ipads"><i class="ri-tablet-line"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">iPads Alumnado</span>
                            <span class="stat-value">Gestión y apps</span>
                        </div>
                    </div>
                    <div class="stat-card" data-section="macs">
                        <div class="stat-icon macs"><i class="ri-macbook-line"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">Macs Profesorado</span>
                            <span class="stat-value">Configuración</span>
                        </div>
                    </div>
                    <div class="stat-card" data-section="ecosistema">
                        <div class="stat-icon"><i class="ri-flow-chart"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">Ecosistema</span>
                            <span class="stat-value">ASM + Jamf</span>
                        </div>
                    </div>
                </div>

                <h2 class="content-title"><i class="ri-error-warning-line"></i> Solucionar Problemas</h2>
                <div class="action-cards">
                    <div class="action-card" data-diagnostic="aula-no-funciona">
                        <div class="action-icon"><i class="ri-graduation-cap-line"></i></div>
                        <h3>La app Aula no funciona</h3>
                        <p>No veo alumnos, pantallas en gris, no detecta iPads</p>
                    </div>
                    <div class="action-card" data-diagnostic="aula-funciones-avanzadas">
                        <div class="action-icon"><i class="ri-rocket-line"></i></div>
                        <h3>Funciones avanzadas de Aula</h3>
                        <p>AirDrop, AirPlay, restablecer contraseñas</p>
                    </div>
                    <div class="action-card" data-diagnostic="aula-remoto">
                        <div class="action-icon"><i class="ri-global-line"></i></div>
                        <h3>Clases remotas no funcionan</h3>
                        <p>Alumnos en casa no reciben invitación</p>
                    </div>
                    <div class="action-card" data-diagnostic="apps-not-installing">
                        <div class="action-icon"><i class="ri-download-cloud-2-line"></i></div>
                        <h3>Las apps no se instalan</h3>
                        <p>Diagnóstico guiado paso a paso</p>
                    </div>
                </div>

                <h2 class="content-title"><i class="ri-book-read-line"></i> Guías Rápidas</h2>
                <div class="action-cards">
                    <div class="action-card" data-guide="aula-setup">
                        <div class="action-icon"><i class="ri-building-line"></i></div>
                        <h3>Configurar App Aula</h3>
                        <p>Requisitos y pasos iniciales</p>
                    </div>
                    <div class="action-card" data-guide="aula-howto">
                        <div class="action-icon"><i class="ri-play-circle-line"></i></div>
                        <h3>Usar Aula en clase</h3>
                        <p>Ver pantallas, bloquear, abrir apps</p>
                    </div>
                    <div class="action-card" data-guide="teacher-setup">
                        <div class="action-icon"><i class="ri-install-line"></i></div>
                        <h3>Jamf Teacher</h3>
                        <p>Instalar apps como profesor</p>
                    </div>
                    <div class="action-card" data-guide="ipad-apps">
                        <div class="action-icon"><i class="ri-app-store-line"></i></div>
                        <h3>Distribuir Apps</h3>
                        <p>Instalación masiva desde Jamf</p>
                    </div>
                </div>
            </section>
        `;
    }

    renderIpads() {
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>iPads del Alumnado</h1>
                    <p class="section-subtitle">Gestión completa de tablets del centro</p>
                </div>

                <div class="guide-cards">
                    ${this.renderGuideCard('ipad-enrollment', KnowledgeBase.ipads.enrollment)}
                    ${this.renderGuideCard('ipad-apps', KnowledgeBase.ipads.apps)}
                    ${this.renderGuideCard('ipad-restrictions', KnowledgeBase.ipads.restrictions)}
                </div>
            </section>
        `;
    }

    renderMacs() {
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Macs del Profesorado</h1>
                    <p class="section-subtitle">Configuración y soporte para equipos docentes</p>
                </div>

                <div class="guide-cards">
                    ${this.renderGuideCard('mac-enrollment', KnowledgeBase.macs.enrollment)}
                    ${this.renderGuideCard('mac-policies', KnowledgeBase.macs.policies)}
                </div>
            </section>
        `;
    }

    renderEcosistema() {
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Ecosistema Apple Education</h1>
                    <p class="section-subtitle">Cómo funciona todo el sistema integrado</p>
                </div>

                <div class="info-box">
                    <div class="info-icon"><i class="ri-information-line"></i></div>
                    <div class="info-content">
                        <h4>El ecosistema educativo de Apple</h4>
                        <p>Tres piezas trabajando juntas: <strong>ASM</strong> (centro del sistema) → <strong>Jamf School</strong> (gestión) → <strong>App Aula</strong> (uso diario).</p>
                    </div>
                </div>

                <!-- Diagrama Visual del Ecosistema -->
                <h2 class="content-title"><i class="ri-organization-chart"></i> Diagrama del Ecosistema</h2>
                ${KnowledgeBase.diagrams.ecosystem.html}

                <!-- Flujo de App Aula -->
                <h2 class="content-title"><i class="ri-route-line"></i> ¿Cómo llega la clase a la App Aula?</h2>
                ${KnowledgeBase.diagrams.aulaFlow.html}

                <!-- Tarjetas resumen -->
                <h2 class="content-title"><i class="ri-layout-grid-line"></i> Componentes del Sistema</h2>
                <div class="guide-cards">
                    <div class="guide-card" data-guide="ecosistema-asm">
                        <div class="guide-header">
                            <span class="guide-icon"><i class="ri-cloud-line"></i></span>
                            <span class="guide-tag">Centro</span>
                        </div>
                        <h3>Apple School Manager</h3>
                        <p>Portal de Apple donde se crean usuarios, clases y se asignan dispositivos. Todo empieza aquí.</p>
                        <div class="guide-meta">
                            <span><i class="ri-link"></i> school.apple.com</span>
                        </div>
                    </div>

                    <div class="guide-card" data-guide="ecosistema-jamf">
                        <div class="guide-header">
                            <span class="guide-icon"><i class="ri-settings-3-line"></i></span>
                            <span class="guide-tag">Gestión</span>
                        </div>
                        <h3>Jamf School</h3>
                        <p>MDM que recibe datos de ASM. Aquí se configuran restricciones, se instalan apps y se organizan grupos.</p>
                        <div class="guide-meta">
                            <span><i class="ri-smartphone-line"></i> Configuración remota</span>
                        </div>
                    </div>

                    <div class="guide-card highlight-card" data-guide="aula-overview">
                        <div class="guide-header">
                            <span class="guide-icon"><i class="ri-group-line"></i></span>
                            <span class="guide-tag hot-tag">Uso diario</span>
                        </div>
                        <h3>App Aula</h3>
                        <p>App que usan los profesores para controlar iPads en clase: ver pantallas, abrir apps, bloquear dispositivos.</p>
                        <div class="guide-meta">
                            <span><i class="ri-eye-line"></i> Control en tiempo real</span>
                        </div>
                    </div>
                </div>

                <!-- Troubleshooting Order -->
                <h2 class="content-title"><i class="ri-bug-line"></i> Cuando algo no funciona</h2>
                ${KnowledgeBase.diagrams.troubleshootFlow.html}

                <h2 class="content-title"><i class="ri-question-line"></i> ¿Por qué esta estructura?</h2>
                <div class="action-cards">
                    <div class="action-card">
                        <div class="action-icon"><i class="ri-shield-check-line"></i></div>
                        <h3>Seguridad y privacidad</h3>
                        <p>Los dispositivos son propiedad del centro, con Apple IDs gestionados que protegen a los menores</p>
                    </div>
                    <div class="action-card">
                        <div class="action-icon"><i class="ri-refresh-line"></i></div>
                        <h3>Gestión automatizada</h3>
                        <p>Los cambios en Jamf se aplican automáticamente sin tocar los dispositivos físicamente</p>
                    </div>
                    <div class="action-card">
                        <div class="action-icon"><i class="ri-team-line"></i></div>
                        <h3>Control pedagógico</h3>
                        <p>Los profesores tienen autonomía para gestionar su aula sin depender de IT</p>
                    </div>
                </div>
            </section>
        `;
    }

    renderAula() {
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>App Aula (Apple Classroom)</h1>
                    <p class="section-subtitle">Control de aula para profesores - Herramienta de uso diario</p>
                </div>

                <div class="info-box">
                    <div class="info-icon"><i class="ri-lightbulb-line"></i></div>
                    <div class="info-content">
                        <h4>¿Qué es la App Aula?</h4>
                        <p>Es la herramienta principal que los profesores usan todos los días para controlar los iPads del alumnado. Permite ver pantallas, abrir apps, bloquear dispositivos y guiar la clase de forma interactiva.</p>
                    </div>
                </div>

                <div class="info-box" style="background: #fef3c7; border-color: #fbbf24;">
                    <div class="info-icon" style="color: #f59e0b;"><i class="ri-star-line"></i></div>
                    <div class="info-content">
                        <h4 style="color: #92400e;">Herramienta fundamental para profesores</h4>
                        <p style="color: #78350f;">Esta app se utiliza a diario en cada clase. Es importante que todos los profesores sepan usarla y que funcione correctamente.</p>
                    </div>
                </div>

                <h2 class="content-title"><i class="ri-book-read-line"></i> Guías Básicas</h2>
                <div class="guide-cards">
                    ${this.renderGuideCard('aula-overview', KnowledgeBase.aula.overview)}
                    ${this.renderGuideCard('aula-howto', KnowledgeBase.aula.howto)}
                    ${this.renderGuideCard('aula-setup', KnowledgeBase.aula.setup)}
                </div>

                <h2 class="content-title"><i class="ri-rocket-line"></i> Funciones Avanzadas</h2>
                <div class="guide-cards">
                    ${this.renderGuideCard('aula-advanced', KnowledgeBase.aula.advanced)}
                    ${this.renderGuideCard('aula-remotehybrid', KnowledgeBase.aula.remotehybrid)}
                    ${this.renderGuideCard('aula-sharedipad', KnowledgeBase.aula.sharedipad)}
                </div>

                <h2 class="content-title"><i class="ri-tools-line"></i> Solucionar Problemas</h2>
                <div class="guide-cards">
                    ${this.renderGuideCard('aula-troubleshoot', KnowledgeBase.aula.troubleshoot)}
                </div>
            </section>
        `;
    }

    renderTeacher() {
        const guide = KnowledgeBase.teacher.setup;
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Jamf Teacher</h1>
                    <p class="section-subtitle">Permite a profesores gestionar apps del alumnado</p>
                </div>

                ${guide.content}
            </section>
        `;
    }

    renderTroubleshooting() {
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Troubleshooting</h1>
                    <p class="section-subtitle">Diagnóstico guiado de problemas</p>
                </div>

                <div class="diagnostic-cards">
                    ${Object.entries(Diagnostics).map(([key, diag]) => `
                        <div class="diagnostic-card" data-diagnostic="${key}">
                            <div class="diagnostic-header">
                                <span class="diagnostic-icon">${diag.icon}</span>
                                <span class="diagnostic-severity high">Diagnóstico</span>
                            </div>
                            <h3>${diag.title}</h3>
                            <p>Sigue el asistente para encontrar la solución</p>
                            <button class="diagnostic-btn">Iniciar diagnóstico →</button>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    renderChecklists() {
        // Group checklists by category
        const categories = {};
        Object.entries(KnowledgeBase.checklists).forEach(([key, cl]) => {
            const cat = cl.category || 'General';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push({ key, ...cl });
        });

        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Checklists</h1>
                    <p class="section-subtitle">Listas de verificación para procesos comunes</p>
                </div>

                <div class="info-box">
                    <div class="info-icon"><i class="ri-checkbox-circle-line"></i></div>
                    <div class="info-content">
                        <h4>Progreso guardado localmente</h4>
                        <p>Tu progreso en cada checklist se guarda en tu navegador. Puedes cerrar y volver cuando quieras.</p>
                    </div>
                </div>

                ${Object.entries(categories).map(([category, items]) => `
                    <h2 class="content-title"><i class="${this.getCategoryIcon(category)}"></i> ${category}</h2>
                    <div class="checklist-cards">
                        ${items.map(cl => `
                            <div class="checklist-card" data-checklist="${cl.key}">
                                <div class="checklist-header">
                                    <span class="checklist-icon">${cl.icon}</span>
                                    <div class="checklist-badges">
                                        <span class="category-badge">${cl.category || 'General'}</span>
                                        ${cl.estimatedTime ? `<span class="time-badge"><i class="ri-time-line"></i> ${cl.estimatedTime}</span>` : ''}
                                    </div>
                                </div>
                                <h3>${cl.title}</h3>
                                <p class="checklist-count">${cl.items.length} tareas a completar</p>
                                <div class="checklist-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 0%"></div>
                                    </div>
                                    <span class="progress-text">0/${cl.items.length}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </section>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            'Dispositivos': 'ri-smartphone-line',
            'Procesos Anuales': 'ri-calendar-line',
            'Troubleshooting': 'ri-bug-line',
            'Mantenimiento IT': 'ri-tools-line',
            'Profesores': 'ri-user-line',
            'General': 'ri-checkbox-circle-line'
        };
        return icons[category] || 'ri-checkbox-circle-line';
    }

    renderMisDatos() {
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Gestión de Mis Datos</h1>
                    <p class="section-subtitle">Ejercita tus derechos ARCO sobre tus datos personales</p>
                </div>

                <div class="info-box">
                    <div class="info-icon"><i class="ri-shield-user-line"></i></div>
                    <div class="info-content">
                        <h4>Tus datos están seguros</h4>
                        <p>Toda tu información se almacena únicamente en este navegador (localStorage). No se envía a ningún servidor externo.</p>
                    </div>
                </div>

                <h2 class="content-title"><i class="ri-database-2-line"></i> Gestión de Datos</h2>
                <div class="action-cards">
                    <div class="action-card" id="viewDataCard">
                        <div class="action-icon"><i class="ri-eye-line"></i></div>
                        <h3>Ver mis datos</h3>
                        <p>Visualiza todos los datos almacenados en formato JSON</p>
                    </div>
                    <div class="action-card" id="exportDataCard">
                        <div class="action-icon"><i class="ri-download-2-line"></i></div>
                        <h3>Exportar mis datos</h3>
                        <p>Descarga todos tus datos en formato JSON</p>
                    </div>
                    <div class="action-card" id="deleteDataCard">
                        <div class="action-icon" style="color: var(--error);"><i class="ri-delete-bin-line"></i></div>
                        <h3>Eliminar todos mis datos</h3>
                        <p>Borra permanentemente todos los datos almacenados</p>
                    </div>
                    <div class="action-card" id="configApiCard">
                        <div class="action-icon"><i class="ri-settings-3-line"></i></div>
                        <h3>Configurar API Key</h3>
                        <p>Acceso rápido a la configuración del chatbot</p>
                    </div>
                </div>

                <h2 class="content-title"><i class="ri-information-line"></i> Datos Almacenados</h2>
                <div class="info-box">
                    <div class="info-icon"><i class="ri-list-check"></i></div>
                    <div class="info-content">
                        <h4>¿Qué datos guardamos?</h4>
                        <ul>
                            <li><strong>API Key:</strong> Tu clave de Google Gemini (cifrada)</li>
                            <li><strong>Tema:</strong> Preferencia de modo claro/oscuro</li>
                            <li><strong>Sidebar:</strong> Estado del menú lateral (expandido/colapsado)</li>
                            <li><strong>Progreso de Checklists:</strong> Tareas completadas en cada lista</li>
                        </ul>
                        <p style="margin-top: 10px; color: var(--text-muted); font-size: 14px;">
                            <i class="ri-lock-line"></i> Todos estos datos permanecen en tu dispositivo y nunca se comparten.
                        </p>
                    </div>
                </div>
            </section>
        `;
    }

    renderGuideCard(id, guide) {
        return `
            <div class="guide-card" data-guide="${id}">
                <div class="guide-header">
                    <span class="guide-icon">${guide.icon}</span>
                    <span class="guide-tag">${guide.tag}</span>
                </div>
                <h3>${guide.title}</h3>
                <p>${guide.steps ? `Guía paso a paso` : 'Ver detalles'}</p>
                <div class="guide-meta">
                    ${guide.time ? `<span><i class="ri-time-line"></i> ${guide.time}</span>` : ''}
                    ${guide.steps ? `<span><i class="ri-list-check-2"></i> ${guide.steps} pasos</span>` : ''}
                </div>
            </div>
        `;
    }

    // Section events
    bindSectionEvents() {
        // Stat cards navigation
        document.querySelectorAll('.stat-card[data-section]').forEach(card => {
            card.addEventListener('click', () => {
                this.navigateTo(card.dataset.section);
            });
        });

        // Quick action buttons (above the fold bar)
        document.querySelectorAll('.quick-action-btn[data-section]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.navigateTo(btn.dataset.section);
            });
        });

        document.querySelectorAll('.quick-action-btn[data-diagnostic]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.openDiagnostic(btn.dataset.diagnostic);
            });
        });

        // Guide cards
        document.querySelectorAll('[data-guide]').forEach(card => {
            card.addEventListener('click', () => {
                this.openGuide(card.dataset.guide);
            });
        });

        // Diagnostic cards
        document.querySelectorAll('[data-diagnostic]').forEach(card => {
            card.addEventListener('click', () => {
                this.openDiagnostic(card.dataset.diagnostic);
            });
        });

        // Checklist cards
        document.querySelectorAll('[data-checklist]').forEach(card => {
            card.addEventListener('click', () => {
                this.openChecklist(card.dataset.checklist);
            });
        });

        // Mis Datos section cards
        const viewDataCard = document.getElementById('viewDataCard');
        const exportDataCard = document.getElementById('exportDataCard');
        const deleteDataCard = document.getElementById('deleteDataCard');
        const configApiCard = document.getElementById('configApiCard');

        if (viewDataCard) {
            viewDataCard.addEventListener('click', () => this.viewMyData());
        }
        if (exportDataCard) {
            exportDataCard.addEventListener('click', () => this.exportMyData());
        }
        if (deleteDataCard) {
            deleteDataCard.addEventListener('click', () => this.deleteAllMyData());
        }
        if (configApiCard) {
            configApiCard.addEventListener('click', () => {
                // Open API modal (assuming it exists from chatbot functionality)
                document.getElementById('apiModal')?.classList.add('active');
            });
        }
    }

    // Open guide in modal
    openGuide(guideId) {
        let guide = null;

        // Find guide in knowledge base
        if (guideId.startsWith('ipad-')) {
            const key = guideId.replace('ipad-', '');
            guide = KnowledgeBase.ipads[key];
        } else if (guideId.startsWith('mac-')) {
            const key = guideId.replace('mac-', '');
            guide = KnowledgeBase.macs[key];
        } else if (guideId.startsWith('aula-')) {
            const key = guideId.replace('aula-', '');
            guide = KnowledgeBase.aula[key];
        } else if (guideId.startsWith('classroom-')) {
            // Legacy support - redirect to aula
            const key = guideId.replace('classroom-', '');
            guide = KnowledgeBase.aula[key];
        } else if (guideId === 'teacher-setup') {
            guide = KnowledgeBase.teacher.setup;
        }

        if (guide && guide.content) {
            this.showModal(guide.content);
        }
    }

    // Open diagnostic wizard
    openDiagnostic(diagId) {
        const diag = Diagnostics[diagId];
        if (!diag) return;

        this.currentDiagnostic = diag;
        this.currentStep = 0;
        this.renderDiagnosticStep();
    }

    renderDiagnosticStep() {
        const diag = this.currentDiagnostic;
        const step = diag.steps[this.currentStep];

        let html = `
            <h2>${diag.icon} ${diag.title}</h2>
            <div class="diagnostic-wizard">
                <div class="wizard-progress">
                    Paso ${this.currentStep + 1} de ${diag.steps.length}
                </div>
                <h3>${step.question}</h3>
                <div class="wizard-options">
                    ${step.options.map((opt, idx) => `
                        <button class="wizard-option" data-next="${opt.next !== undefined ? opt.next : ''}" data-solution="${opt.solution || ''}">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        this.showModal(html);

        // Bind options
        document.querySelectorAll('.wizard-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const next = btn.dataset.next;
                const solution = btn.dataset.solution;

                if (solution) {
                    this.showDiagnosticSolution(solution);
                } else if (next !== '') {
                    this.currentStep = parseInt(next);
                    this.renderDiagnosticStep();
                }
            });
        });
    }

    showDiagnosticSolution(solutionKey) {
        const solution = this.currentDiagnostic.solutions[solutionKey];
        let html = `
            <h2><i class="ri-lightbulb-flash-line"></i> Solución encontrada</h2>
            <div class="solution-box">
                <h3>${solution.title}</h3>
                ${solution.content}
            </div>
            <button class="diagnostic-btn" id="restartDiag" style="margin-top: 20px;">
                Volver a empezar
            </button>
        `;

        this.showModal(html);

        document.getElementById('restartDiag')?.addEventListener('click', () => {
            this.currentStep = 0;
            this.renderDiagnosticStep();
        });
    }

    // Open checklist
    openChecklist(checklistId) {
        const checklist = KnowledgeBase.checklists[checklistId];
        if (!checklist) return;

        // Load saved state from localStorage
        const savedState = JSON.parse(localStorage.getItem(`checklist-${checklistId}`) || '[]');

        let html = `
            <h2>${checklist.icon} ${checklist.title}</h2>
            <div class="checklist-items">
                ${checklist.items.map((item, idx) => `
                    <label class="checklist-item">
                        <input type="checkbox" data-idx="${idx}" ${savedState[idx] ? 'checked' : ''}>
                        <span>${item.text}</span>
                    </label>
                `).join('')}
            </div>
        `;

        this.showModal(html);

        // Bind checkboxes
        document.querySelectorAll('.checklist-item input').forEach(cb => {
            cb.addEventListener('change', () => {
                const idx = parseInt(cb.dataset.idx);
                savedState[idx] = cb.checked;
                localStorage.setItem(`checklist-${checklistId}`, JSON.stringify(savedState));
            });
        });
    }

    // Modal
    bindModal() {
        document.getElementById('modalClose').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('guideModal').addEventListener('click', (e) => {
            if (e.target.id === 'guideModal') {
                this.hideModal();
            }
        });
    }

    showModal(content) {
        // Security: Sanitize modal content (guides, diagnostics, checklists)
        document.getElementById('modalBody').innerHTML = DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'div', 'span', 'a', 'i', 'button', 'label', 'input'],
            ALLOWED_ATTR: ['class', 'href', 'target', 'data-idx', 'data-next', 'data-solution', 'id', 'type', 'checked', 'style', 'title']
        });
        document.getElementById('guideModal').classList.add('active');
    }

    hideModal() {
        document.getElementById('guideModal').classList.remove('active');
    }

    // Menu toggle
    bindMenuToggle() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const menuToggle = document.getElementById('menuToggle');
        const mainContent = document.querySelector('.main-content');

        // Restaurar estado del sidebar desde localStorage
        const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (sidebarCollapsed && window.innerWidth > 1024) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('sidebar-collapsed');
        }

        // Abrir/cerrar sidebar
        menuToggle.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                // Móvil/Tablet: mostrar overlay
                sidebar.classList.toggle('active');
                overlay.classList.toggle('active');
            } else {
                // Desktop: colapsar sidebar
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('sidebar-collapsed');
                localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
            }
        });

        // Cerrar al hacer clic en el overlay
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Cerrar sidebar al seleccionar una opción en móvil
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                }
            });
        });

        // Ajustar al cambiar tamaño de ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // Search
    bindSearch() {
        const input = document.getElementById('searchInput');
        const overlay = document.getElementById('searchOverlay');
        const results = document.getElementById('searchResults');

        input.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            const query = input.value.trim().toLowerCase();

            if (query.length < 2) {
                overlay.classList.remove('active');
                return;
            }

            this.searchTimeout = setTimeout(() => {
                const found = this.search(query);

                if (found.length === 0) {
                    // Security: Use textContent for user search query to prevent XSS
                    const noResults = document.createElement('div');
                    noResults.className = 'no-results';
                    noResults.textContent = `No se encontraron resultados para "${query}"`;
                    results.innerHTML = '';
                    results.appendChild(noResults);
                } else {
                    // Security: Sanitize search results from knowledge base
                    results.innerHTML = found.map(r => {
                        const safeType = DOMPurify.sanitize(r.type);
                        const safeId = DOMPurify.sanitize(r.id);
                        const safeIcon = DOMPurify.sanitize(r.icon);
                        const safeTitle = DOMPurify.sanitize(r.title);
                        const safeCategory = DOMPurify.sanitize(r.category);
                        return `
                        <div class="search-result-item" data-type="${safeType}" data-id="${safeId}">
                            <span class="search-result-icon">${safeIcon}</span>
                            <div class="search-result-content">
                                <h4>${safeTitle}</h4>
                                <p>${safeCategory}</p>
                            </div>
                        </div>
                    `;
                    }).join('');

                    // Bind result clicks
                    results.querySelectorAll('.search-result-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const type = item.dataset.type;
                            const id = item.dataset.id;
                            overlay.classList.remove('active');
                            input.value = '';

                            if (type === 'guide') {
                                this.openGuide(id);
                            } else if (type === 'diagnostic') {
                                this.openDiagnostic(id);
                            }
                        });
                    });
                }

                overlay.classList.add('active');
            }, 300);
        });

        input.addEventListener('blur', () => {
            setTimeout(() => overlay.classList.remove('active'), 200);
        });
    }

    search(query) {
        const results = [];

        // Search guides
        const searchInGuides = (guides, prefix, category) => {
            Object.entries(guides).forEach(([key, guide]) => {
                if (guide.title.toLowerCase().includes(query) ||
                    (guide.content && guide.content.toLowerCase().includes(query))) {
                    results.push({
                        type: 'guide',
                        id: `${prefix}-${key}`,
                        icon: guide.icon,
                        title: guide.title,
                        category: category
                    });
                }
            });
        };

        searchInGuides(KnowledgeBase.ipads, 'ipad', 'iPads');
        searchInGuides(KnowledgeBase.macs, 'mac', 'Macs');
        searchInGuides(KnowledgeBase.aula, 'aula', 'App Aula');

        // Search diagnostics
        Object.entries(Diagnostics).forEach(([key, diag]) => {
            if (diag.title.toLowerCase().includes(query)) {
                results.push({
                    type: 'diagnostic',
                    id: key,
                    icon: diag.icon,
                    title: diag.title,
                    category: 'Troubleshooting'
                });
            }
        });

        return results;
    }

    // ========================================
    // MIS DATOS - ARCO Functions
    // ========================================

    viewMyData() {
        // Collect all localStorage data
        const allData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const value = localStorage.getItem(key);
                // Try to parse JSON, otherwise store as string
                try {
                    allData[key] = JSON.parse(value);
                } catch {
                    allData[key] = value;
                }
            } catch (e) {
                allData[key] = '[Error al leer]';
            }
        }

        const dataCount = Object.keys(allData).length;
        const jsonFormatted = JSON.stringify(allData, null, 2);

        const html = `
            <h2><i class="ri-eye-line"></i> Mis Datos Almacenados</h2>
            <div class="info-box">
                <div class="info-icon"><i class="ri-database-2-line"></i></div>
                <div class="info-content">
                    <p><strong>${dataCount} elementos</strong> almacenados en localStorage</p>
                    <p style="color: var(--text-muted); font-size: 14px; margin-top: 8px;">
                        Estos datos solo existen en este navegador y no se han enviado a ningún servidor.
                    </p>
                </div>
            </div>

            <div class="code-block" style="background: var(--bg-input); border-radius: var(--radius-md); padding: 20px; margin: 20px 0; max-height: 500px; overflow-y: auto;">
                <pre style="margin: 0; font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; color: var(--text-primary);">${this.escapeHtml(jsonFormatted)}</pre>
            </div>

            <div class="info-box" style="background: var(--accent-bg); border-left-color: var(--accent-primary);">
                <div class="info-icon" style="color: var(--accent-primary);"><i class="ri-information-line"></i></div>
                <div class="info-content">
                    <p><strong>¿Qué significa esto?</strong></p>
                    <p style="font-size: 14px; margin-top: 8px;">Puedes exportar estos datos como archivo JSON o eliminarlos permanentemente usando las opciones de la sección "Mis Datos".</p>
                </div>
            </div>
        `;

        this.showModal(html);
    }

    exportMyData() {
        // Collect all localStorage data
        const allData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const value = localStorage.getItem(key);
                try {
                    allData[key] = JSON.parse(value);
                } catch {
                    allData[key] = value;
                }
            } catch (e) {
                allData[key] = '[Error al leer]';
            }
        }

        // Add metadata
        const exportData = {
            exportDate: new Date().toISOString(),
            application: 'Asistente Education',
            dataCount: Object.keys(allData).length,
            data: allData
        };

        // Create downloadable JSON file
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mis-datos-asistente-education-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show confirmation
        const html = `
            <h2><i class="ri-download-2-line"></i> Datos Exportados</h2>
            <div class="info-box" style="background: var(--accent-bg); border-left-color: var(--success);">
                <div class="info-icon" style="color: var(--success);"><i class="ri-checkbox-circle-line"></i></div>
                <div class="info-content">
                    <h4>Exportación completada</h4>
                    <p>Tus datos se han descargado en formato JSON.</p>
                    <p style="margin-top: 10px; font-size: 14px;"><strong>${Object.keys(allData).length} elementos</strong> exportados</p>
                </div>
            </div>

            <div class="info-box">
                <div class="info-icon"><i class="ri-shield-check-line"></i></div>
                <div class="info-content">
                    <h4>Seguridad de tus datos</h4>
                    <p>El archivo descargado contiene todos tus datos en formato JSON legible. Guárdalo en un lugar seguro si contiene información sensible como tu API Key.</p>
                </div>
            </div>
        `;

        this.showModal(html);
    }

    deleteAllMyData() {
        // Show confirmation modal
        const dataCount = localStorage.length;
        const html = `
            <h2><i class="ri-error-warning-line"></i> Confirmar Eliminación</h2>
            <div class="info-box" style="background: hsl(8, 45%, 95%); border-left-color: var(--error);">
                <div class="info-icon" style="color: var(--error);"><i class="ri-alert-line"></i></div>
                <div class="info-content">
                    <h4>Esta acción no se puede deshacer</h4>
                    <p>Se eliminarán permanentemente <strong>${dataCount} elementos</strong> de localStorage:</p>
                    <ul style="margin-top: 10px;">
                        <li>API Key de Google Gemini</li>
                        <li>Preferencias de tema</li>
                        <li>Estado del sidebar</li>
                        <li>Progreso de todas las checklists</li>
                    </ul>
                </div>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 20px;">
                <button class="diagnostic-btn" id="confirmDelete" style="background: var(--error);">
                    <i class="ri-delete-bin-line"></i> Sí, eliminar todos mis datos
                </button>
                <button class="diagnostic-btn" id="cancelDelete" style="background: var(--text-muted);">
                    Cancelar
                </button>
            </div>
        `;

        this.showModal(html);

        // Bind buttons
        document.getElementById('confirmDelete')?.addEventListener('click', () => {
            localStorage.clear();
            this.showDeleteSuccessModal();
        });

        document.getElementById('cancelDelete')?.addEventListener('click', () => {
            this.hideModal();
        });
    }

    showDeleteSuccessModal() {
        const html = `
            <h2><i class="ri-checkbox-circle-line"></i> Datos Eliminados</h2>
            <div class="info-box" style="background: var(--accent-bg); border-left-color: var(--success);">
                <div class="info-icon" style="color: var(--success);"><i class="ri-check-line"></i></div>
                <div class="info-content">
                    <h4>Todos tus datos han sido eliminados</h4>
                    <p>localStorage ha sido limpiado completamente. La página se recargará para aplicar los cambios.</p>
                </div>
            </div>
        `;

        this.showModal(html);

        // Reload page after 2 seconds
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new JamfAssistant();
    window.chatbot = new JamfChatbot();
});


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
            updateEl.innerHTML = `
                <i class="ri-book-open-line update-icon"></i>
                <span class="update-text">v${meta.version} • ${meta.lastUpdated}<br>${meta.articleCount} guías</span>
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
        }

        this.bindSectionEvents();
    }

    renderDashboard() {
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Dashboard</h1>
                    <p class="section-subtitle">Resumen de gestión y accesos rápidos</p>
                </div>

                <div class="quick-stats">
                    <div class="stat-card" data-section="aula">
                        <div class="stat-icon classroom"><i class="ri-group-line"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">App Aula</span>
                            <span class="stat-value">Herramienta principal</span>
                        </div>
                    </div>
                    <div class="stat-card" data-section="ipads">
                        <div class="stat-icon ipads"><i class="ri-tablet-line"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">iPads Alumnado</span>
                            <span class="stat-value">Gestión completa</span>
                        </div>
                    </div>
                    <div class="stat-card" data-section="macs">
                        <div class="stat-icon macs"><i class="ri-macbook-line"></i></div>
                        <div class="stat-info">
                            <span class="stat-label">Macs Profesorado</span>
                            <span class="stat-value">Configuración y soporte</span>
                        </div>
                    </div>
                </div>

                <h2 class="content-title"><i class="ri-rocket-line"></i> Acciones Frecuentes</h2>
                <div class="action-cards">
                    <div class="action-card" data-guide="classroom-setup">
                        <div class="action-icon"><i class="ri-building-line"></i></div>
                        <h3>Configurar App Aula</h3>
                        <p>Crear clases y asignar profesores</p>
                    </div>
                    <div class="action-card" data-guide="teacher-setup">
                        <div class="action-icon"><i class="ri-install-line"></i></div>
                        <h3>Instalar Apps desde Profesor</h3>
                        <p>Configurar Jamf Teacher para que docentes gestionen apps</p>
                    </div>
                    <div class="action-card" data-guide="ipad-apps">
                        <div class="action-icon"><i class="ri-app-store-line"></i></div>
                        <h3>Distribuir Apps a iPads</h3>
                        <p>Guía paso a paso para instalar aplicaciones</p>
                    </div>
                    <div class="action-card" data-guide="ipad-enrollment">
                        <div class="action-icon"><i class="ri-add-circle-line"></i></div>
                        <h3>Inscribir Dispositivos</h3>
                        <p>Enrollment en Jamf para iPads nuevos</p>
                    </div>
                </div>

                <h2 class="content-title"><i class="ri-error-warning-line"></i> Problemas Comunes</h2>
                <div class="action-cards">
                    <div class="action-card" data-diagnostic="aula-no-funciona">
                        <div class="action-icon"><i class="ri-graduation-cap-line"></i></div>
                        <h3>La app Aula no funciona</h3>
                        <p>No veo alumnos, pantallas en gris</p>
                    </div>
                    <div class="action-card" data-diagnostic="aula-funciones-avanzadas">
                        <div class="action-icon"><i class="ri-rocket-line"></i></div>
                        <h3>Funciones avanzadas de Aula</h3>
                        <p>AirDrop, AirPlay, resetear contraseñas</p>
                    </div>
                    <div class="action-card" data-diagnostic="aula-remoto">
                        <div class="action-icon"><i class="ri-global-line"></i></div>
                        <h3>Problemas con clases remotas</h3>
                        <p>Alumnos no reciben invitación</p>
                    </div>
                    <div class="action-card" data-diagnostic="apps-not-installing">
                        <div class="action-icon"><i class="ri-download-cloud-2-line"></i></div>
                        <h3>Las apps no se instalan</h3>
                        <p>Diagnóstico guiado paso a paso</p>
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
                        <p>Tres piezas trabajando juntas para gestionar los dispositivos del centro educativo.</p>
                    </div>
                </div>

                <div class="guide-cards">
                    <div class="guide-card">
                        <div class="guide-header">
                            <span class="guide-icon"><i class="ri-cloud-line"></i></span>
                            <span class="guide-tag">Paso 1</span>
                        </div>
                        <h3>Apple School Manager (ASM)</h3>
                        <p>Portal de Apple donde se registran todos los dispositivos del centro. Aquí se crean las cuentas de profesores y alumnos (Apple IDs gestionados).</p>
                        <div class="guide-meta">
                            <span><i class="ri-key-line"></i> Gestión de identidades</span>
                        </div>
                    </div>

                    <div class="guide-card">
                        <div class="guide-header">
                            <span class="guide-icon"><i class="ri-settings-3-line"></i></span>
                            <span class="guide-tag">Paso 2</span>
                        </div>
                        <h3>Jamf School (MDM)</h3>
                        <p>Sistema de gestión de dispositivos móviles. Conectado con ASM, permite configurar restricciones, instalar apps, crear perfiles y organizar los dispositivos por grupos.</p>
                        <div class="guide-meta">
                            <span><i class="ri-smartphone-line"></i> Configuración remota</span>
                        </div>
                    </div>

                    <div class="guide-card">
                        <div class="guide-header">
                            <span class="guide-icon"><i class="ri-group-line"></i></span>
                            <span class="guide-tag">Paso 3</span>
                        </div>
                        <h3>App Aula (Classroom)</h3>
                        <p>Aplicación que usan los profesores en sus Macs para controlar los iPads del alumnado durante la clase: ver pantallas, abrir apps, bloquear dispositivos y guiar actividades.</p>
                        <div class="guide-meta">
                            <span><i class="ri-eye-line"></i> Control en tiempo real</span>
                        </div>
                    </div>
                </div>

                <h2 class="content-title"><i class="ri-arrow-right-line"></i> Flujo de trabajo completo</h2>
                <div class="info-box" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div class="info-content">
                        <h4 style="color: white; margin-top: 0;">ASM → Jamf School → Dispositivos → App Aula</h4>
                        <ol style="margin: 15px 0 0 20px; line-height: 1.8;">
                            <li><strong>En ASM:</strong> Se registran los dispositivos y se crean las cuentas</li>
                            <li><strong>En Jamf School:</strong> Se configuran restricciones, apps y clases</li>
                            <li><strong>Los dispositivos:</strong> Reciben automáticamente la configuración</li>
                            <li><strong>En App Aula:</strong> Los profesores controlan la clase en tiempo real</li>
                        </ol>
                    </div>
                </div>

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
        return `
            <section class="content-section active">
                <div class="section-header">
                    <h1>Checklists</h1>
                    <p class="section-subtitle">Listas de verificación para procesos comunes</p>
                </div>

                <div class="checklist-cards">
                    ${Object.entries(KnowledgeBase.checklists).map(([key, cl]) => `
                        <div class="checklist-card" data-checklist="${key}">
                            <div class="checklist-header">
                                <span class="checklist-icon">${cl.icon}</span>
                                <h3>${cl.title}</h3>
                            </div>
                            <p>${cl.items.length} tareas a completar</p>
                            <div class="checklist-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 0%"></div>
                                </div>
                                <span class="progress-text">0/${cl.items.length} completado</span>
                            </div>
                        </div>
                    `).join('')}
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
        document.getElementById('modalBody').innerHTML = content;
        document.getElementById('guideModal').classList.add('active');
    }

    hideModal() {
        document.getElementById('guideModal').classList.remove('active');
    }

    // Menu toggle
    bindMenuToggle() {
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
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
                    results.innerHTML = `<div class="no-results">No se encontraron resultados para "${query}"</div>`;
                } else {
                    results.innerHTML = found.map(r => `
                        <div class="search-result-item" data-type="${r.type}" data-id="${r.id}">
                            <span class="search-result-icon">${r.icon}</span>
                            <div class="search-result-content">
                                <h4>${r.title}</h4>
                                <p>${r.category}</p>
                            </div>
                        </div>
                    `).join('');

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
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new JamfAssistant();
    window.chatbot = new JamfChatbot();
});


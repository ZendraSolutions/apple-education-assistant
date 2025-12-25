/**
 * JAMF ASSISTANT - Knowledge Base Diagrams
 * Diagramas visuales del ecosistema Apple Education
 *
 * @module KnowledgeDiagrams
 * @version 2.0.0
 * @lastUpdated 2025-12-24
 */

/**
 * @typedef {Object} Diagram
 * @property {string} title - Title of the diagram
 * @property {string} html - HTML content of the diagram
 */

/**
 * Ecosystem flow diagram
 * @type {Diagram}
 */
export const ecosystem = {
    title: 'Flujo del Ecosistema Apple Education',
    html: `
        <div class="ecosystem-diagram">
            <div class="diagram-tier tier-1">
                <div class="diagram-box box-asm">
                    <div class="box-icon"><i class="ri-cloud-line"></i></div>
                    <div class="box-title">Apple School Manager</div>
                    <div class="box-url">school.apple.com</div>
                    <div class="box-subtitle">ES EL CENTRO DE TODO</div>
                    <ul class="box-features">
                        <li><i class="ri-user-add-line"></i> Crear usuarios</li>
                        <li><i class="ri-group-line"></i> Crear clases</li>
                        <li><i class="ri-device-line"></i> Asignar dispositivos</li>
                        <li><i class="ri-apps-line"></i> Comprar apps (VPP)</li>
                    </ul>
                </div>
            </div>

            <div class="diagram-arrow">
                <i class="ri-arrow-down-line"></i>
                <span>sincroniza automaticamente</span>
            </div>

            <div class="diagram-tier tier-2">
                <div class="diagram-box box-jamf">
                    <div class="box-icon"><i class="ri-settings-3-line"></i></div>
                    <div class="box-title">Jamf School</div>
                    <div class="box-subtitle">MDM - Gestion de dispositivos</div>
                    <ul class="box-features">
                        <li><i class="ri-download-line"></i> Recibe usuarios desde ASM</li>
                        <li><i class="ri-shield-check-line"></i> Aplica restricciones</li>
                        <li><i class="ri-install-line"></i> Distribuye apps</li>
                        <li><i class="ri-pie-chart-line"></i> Monitoriza dispositivos</li>
                    </ul>
                </div>
            </div>

            <div class="diagram-arrow">
                <i class="ri-arrow-down-line"></i>
                <span>configura</span>
            </div>

            <div class="diagram-tier tier-3">
                <div class="diagram-devices">
                    <div class="diagram-box box-device">
                        <div class="box-icon"><i class="ri-tablet-line"></i></div>
                        <div class="box-title">iPads Alumnos</div>
                        <span class="badge">Supervisados</span>
                    </div>
                    <div class="diagram-box box-device">
                        <div class="box-icon"><i class="ri-macbook-line"></i></div>
                        <div class="box-title">Macs Profes</div>
                        <span class="badge">Gestionados</span>
                    </div>
                    <div class="diagram-box box-device box-aula">
                        <div class="box-icon"><i class="ri-group-line"></i></div>
                        <div class="box-title">App Aula</div>
                        <span class="badge highlight">Uso diario</span>
                    </div>
                </div>
            </div>
        </div>
    `
};

/**
 * Aula workflow diagram
 * @type {Diagram}
 */
export const aulaFlow = {
    title: 'Flujo de Funcionamiento de la App Aula',
    html: `
        <div class="flow-diagram">
            <div class="flow-step">
                <div class="step-number">1</div>
                <div class="step-content">
                    <div class="step-title">Clase creada en ASM</div>
                    <div class="step-desc">Admin crea la clase en school.apple.com con profesor y alumnos</div>
                </div>
            </div>
            <div class="flow-connector"><i class="ri-arrow-right-line"></i></div>
            <div class="flow-step">
                <div class="step-number">2</div>
                <div class="step-content">
                    <div class="step-title">Jamf sincroniza</div>
                    <div class="step-desc">La clase aparece en Jamf School automaticamente</div>
                </div>
            </div>
            <div class="flow-connector"><i class="ri-arrow-right-line"></i></div>
            <div class="flow-step">
                <div class="step-number">3</div>
                <div class="step-content">
                    <div class="step-title">Perfiles se aplican</div>
                    <div class="step-desc">iPads de alumnos reciben configuracion de Classroom</div>
                </div>
            </div>
            <div class="flow-connector"><i class="ri-arrow-right-line"></i></div>
            <div class="flow-step highlight">
                <div class="step-number">4</div>
                <div class="step-content">
                    <div class="step-title">Profesor abre Aula</div>
                    <div class="step-desc">Ve su clase y puede gestionar los iPads en tiempo real</div>
                </div>
            </div>
        </div>
    `
};

/**
 * Troubleshooting flow diagram
 * @type {Diagram}
 */
export const troubleshootFlow = {
    title: 'Orden de Verificacion cuando algo no funciona',
    html: `
        <div class="troubleshoot-diagram">
            <div class="ts-level">
                <div class="ts-box ts-asm">
                    <div class="ts-icon"><i class="ri-cloud-line"></i></div>
                    <div class="ts-title">1. Verificar en ASM</div>
                    <ul>
                        <li>Existe el usuario/clase?</li>
                        <li>Esta asignado correctamente?</li>
                        <li>El dispositivo esta vinculado?</li>
                    </ul>
                </div>
                <div class="ts-arrow"><i class="ri-arrow-down-line"></i> Si esta OK</div>
            </div>
            <div class="ts-level">
                <div class="ts-box ts-jamf">
                    <div class="ts-icon"><i class="ri-settings-3-line"></i></div>
                    <div class="ts-title">2. Verificar en Jamf School</div>
                    <ul>
                        <li>Se ha sincronizado desde ASM?</li>
                        <li>El perfil esta asignado?</li>
                        <li>El dispositivo esta "Managed"?</li>
                    </ul>
                </div>
                <div class="ts-arrow"><i class="ri-arrow-down-line"></i> Si esta OK</div>
            </div>
            <div class="ts-level">
                <div class="ts-box ts-device">
                    <div class="ts-icon"><i class="ri-tablet-line"></i></div>
                    <div class="ts-title">3. Verificar en el Dispositivo</div>
                    <ul>
                        <li>Bluetooth activado?</li>
                        <li>WiFi conectado?</li>
                        <li>App actualizada?</li>
                        <li>Reiniciar resuelve?</li>
                    </ul>
                </div>
            </div>
        </div>
    `
};

/**
 * Complete diagrams module as a combined object for backwards compatibility
 * @type {Object}
 */
export const diagrams = {
    ecosystem,
    aulaFlow,
    troubleshootFlow
};

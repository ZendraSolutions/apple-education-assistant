# Changelog - Jamf Assistant Documentation

Registro de actualizaciones automáticas de la documentación.

Este archivo se actualiza automáticamente cada mes cuando el sistema detecta cambios en la documentación oficial de Jamf.

---

## [2024-12-24] - Dashboard Homepage UX Redesign

### Resumen
Rediseño completo del dashboard de inicio para crear una experiencia más acogedora y funcional para profesores y coordinadores TIC.

### Nuevas Características

#### 1. Hero de Bienvenida
- Saludo dinámico según hora del día (Buenos días/tardes/noches)
- Mensaje motivacional personalizado
- Fecha actual en formato largo español
- Ilustración animada con gradiente azul corporativo

#### 2. Accesos Rápidos
Grid de 4 cards con acceso directo a:
- **ASM**: Gestión de identidades en Apple School Manager
- **Jamf School**: Administración de dispositivos
- **App Aula**: Control de clase en tiempo real
- **Chatbot IA**: Asistente inteligente con Google Gemini

Características visuales:
- Iconos con gradientes de color según función
- Animación de hover con elevación y borde superior
- Flecha indicadora que se desplaza al hover
- Responsive: 2 columnas en móvil

#### 3. Estado del Sistema
Mini cards con información actualizada:
- Última sincronización (mock)
- Dispositivos activos (mock: 124 iPads)
- Tareas pendientes (mock: 3 checklists)

#### 4. Tip del Día
Box informativo destacado con:
- Icono animado con efecto glow
- Consejo rotativo diario sobre el ecosistema Apple
- 7 consejos únicos que rotan automáticamente

#### 5. Acciones Frecuentes
Cards rápidos para las tareas más comunes:
- Troubleshooting de App Aula
- Diagnóstico de instalación de apps
- Acceso a checklists
- Guías de uso de App Aula

### Mejoras Técnicas
- Funciones auxiliares: `getGreeting()`, `getCurrentDate()`, `getDailyTip()`
- Sistema de rotación de tips basado en día del año
- Soporte completo para dark mode con ajustes específicos
- Eventos de navegación para quick-access-cards
- Integración con el panel de chatbot

### Estilos CSS
- 390+ líneas de CSS dedicadas al nuevo dashboard
- Animaciones sutiles: pulse, glow, hover effects
- Sistema de colores coherente con paleta corporativa
- Media queries para responsive design
- Gradientes personalizados por tipo de card

---

## [2025-12-23] - Initial Release

### Resumen
Versión inicial de la documentación del Jamf Assistant.

### Contenido
- 11 artículos de documentación cubriendo:
  - Enrollment (ABM y manual)
  - Distribución de Apps (VPP, Jamf Teacher)
  - Apple Classroom (configuración y troubleshooting)
  - Perfiles de restricción
  - Bloqueo de activación
  - Self Service para Macs
  - Smart Groups
  - Actualizaciones de sistema

---

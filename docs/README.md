# Documentación de Jamf Assistant

Bienvenido a la documentación de Jamf Assistant. Aquí encontrarás toda la información necesaria tanto para usuarios finales como para desarrolladores.

---

## Documentación para Usuarios (Docentes)

Si eres docente del Colegio Huerta Santa Ana, empieza aquí:

### 1. [Manual del Usuario](USER_GUIDE.md)
**Lectura esencial** - Guía completa de cómo usar Jamf Assistant.

**Contenido:**
- Introducción y primeros pasos
- Navegación básica
- Funcionalidades principales (Dashboard, búsqueda, guías, checklists)
- Chatbot con IA
- Consejos y trucos (tema oscuro, instalar en iPad)

**Duración de lectura:** ~15 minutos

---

### 2. [Preguntas Frecuentes (FAQ)](FAQ.md)
Respuestas rápidas a las dudas más comunes.

**Categorías:**
- General (qué es, instalación, funciona offline)
- Chatbot IA (API Key, seguridad, límites)
- Problemas comunes (chatbot no responde, instalación en iPad)
- Privacidad y datos

**Duración de lectura:** ~10 minutos (puedes ir directo a tu pregunta)

---

### 3. [Guía de Configuración de API Key](API_KEY_SETUP.md)
Paso a paso detallado para configurar el chatbot con IA.

**Contenido:**
- Crear cuenta en Google AI Studio
- Generar API Key gratuita
- Configurar en Jamf Assistant
- Tips de seguridad
- Solución de problemas

**Duración:** 5-10 minutos (proceso completo)

---

## Documentación Técnica (Desarrolladores)

Si eres desarrollador o IT, consulta:

### 1. [ARCHITECTURE.md](ARCHITECTURE.md)
Documentación técnica completa de la arquitectura del sistema.

**Contenido:**
- Principios SOLID
- Patrones de diseño (IoC, Registry, Chain of Responsibility)
- Estructura de módulos (Core, Features, Views, Chatbot, Patterns, Data, Utils, UI)
- Flujo de dependencias y datos
- Diagramas de arquitectura
- Guía de extensión

**Duración de lectura:** ~30 minutos (referencia completa)

---

### 2. [API.md](API.md)
Referencia completa de todas las APIs públicas.

**Contenido:**
- Core APIs (Container, EventBus, StateManager, ThemeManager, etc.)
- Pattern APIs (SectionRegistry, ValidatorChain)
- Feature APIs (SearchEngine, ChecklistManager, DiagnosticsManager, etc.)
- Chatbot APIs (ChatbotCore, ApiKeyManager, RAGEngine, etc.)
- View APIs (BaseView)
- UI APIs (ToastManager, ConnectionStatus)
- Eventos del sistema
- Definiciones de tipos

**Duración de lectura:** Documento de referencia (búsqueda por módulo)

---

### 3. [CONTRIBUTING.md](CONTRIBUTING.md)
Guía completa para contribuir al proyecto.

**Contenido:**
- Setup inicial del entorno
- Estructura del proyecto explicada
- Cómo añadir nueva sección/vista
- Cómo añadir nuevo servicio al container
- Cómo añadir nuevo validador
- Estándares de código JavaScript
- Estándares de JSDoc
- Proceso de Pull Request

**Duración de lectura:** ~20 minutos (guía paso a paso)

---

### 4. [JSDOC_AUDIT.md](JSDOC_AUDIT.md)
Reporte de auditoría de calidad de documentación JSDoc.

**Contenido:**
- Estadísticas de cobertura (100% alcanzado)
- Análisis por capas
- Mejores prácticas encontradas
- Comparación con estándares de la industria
- Recomendaciones de mejora

**Duración de lectura:** ~15 minutos (reporte ejecutivo)

---

## Rutas Rápidas por Perfil

### Soy docente y...

**...es mi primera vez con la app:**
1. Lee: [Manual del Usuario](USER_GUIDE.md) (sección "Primeros Pasos")
2. Configura: [API Key](API_KEY_SETUP.md) (para usar chatbot)
3. Explora: Abre la app y navega por el Dashboard

**...tengo un problema específico:**
1. Busca en: [FAQ](FAQ.md) (sección "Problemas Comunes")
2. Si no está ahí: Usa el chatbot IA
3. Último recurso: Contacta con IT del centro

**...quiero instalar en iPad:**
1. Lee: [Manual del Usuario](USER_GUIDE.md) > "Instalar en iPad (PWA)"
2. Pasos rápidos:
   - Abre Safari en iPad
   - Visita la URL de la app
   - Compartir > Añadir a pantalla de inicio

**...no funciona el chatbot:**
1. Verifica: [FAQ](FAQ.md) > "El chatbot no responde"
2. Reconfigura: [API Key Setup](API_KEY_SETUP.md) > "Qué hacer si no funciona"

---

### Soy desarrollador/IT y...

**...quiero entender la arquitectura:**
1. Lee: [ARCHITECTURE.md](ARCHITECTURE.md) completo
2. Revisa: Diagramas de arquitectura y flujo de datos
3. Explora: `/js/core/` (Container, EventBus, StateManager)

**...quiero añadir una funcionalidad:**
1. Lee: [CONTRIBUTING.md](CONTRIBUTING.md) > "How to Add Features"
2. Consulta: [API.md](API.md) para ver APIs similares
3. Sigue: Estándares de código y JSDoc en CONTRIBUTING.md
4. Revisa: Ejemplos en el código existente

**...necesito una referencia API:**
1. Busca en: [API.md](API.md) el módulo específico
2. Revisa: Ejemplos de uso documentados
3. Consulta: JSDoc inline en el código fuente

**...necesito hacer mantenimiento:**
1. Consulta: Logs del navegador (DevTools > Console)
2. Revisa: Service Worker para caché (`sw.js`)
3. Usa: Container debug mode (`createContainer({ debug: true })`)
4. Contacta: Equipo de desarrollo para cambios críticos

**...quiero contribuir código:**
1. Lee: [CONTRIBUTING.md](CONTRIBUTING.md) completo
2. Sigue: Proceso de Pull Request documentado
3. Asegúrate: JSDoc completo (ver [JSDOC_AUDIT.md](JSDOC_AUDIT.md))
4. Testing: Checklist de testing manual

---

## Recursos Externos

- [Documentación oficial de Jamf](https://learn.jamf.com)
- [Apple School Manager](https://school.apple.com)
- [Google Gemini API](https://ai.google.dev/docs)
- [Progressive Web Apps (MDN)](https://developer.mozilla.org/docs/Web/Progressive_web_apps)

---

## Estructura de la Carpeta `docs/`

```
docs/
├── README.md              ← Estás aquí (índice de documentación)
│
├── DOCUMENTACIÓN DE USUARIO (Docentes)
├── USER_GUIDE.md          ← Manual completo del usuario
├── FAQ.md                 ← Preguntas frecuentes
├── API_KEY_SETUP.md       ← Guía de configuración de API Key
│
└── DOCUMENTACIÓN TÉCNICA (Desarrolladores)
    ├── ARCHITECTURE.md    ← Arquitectura del sistema
    ├── API.md             ← Referencia de APIs públicas
    ├── CONTRIBUTING.md    ← Guía de contribución
    └── JSDOC_AUDIT.md     ← Reporte de calidad de documentación
```

---

## Contribuir a la Documentación

Si encuentras errores o quieres sugerir mejoras:

1. **Docentes**: Contacta con IT del Colegio Huerta Santa Ana
2. **Desarrolladores**: Abre un issue o pull request en el repositorio

---

## Changelog de Documentación

### v3.0.0 (Enero 2025)
- Documentación técnica completa añadida
- ARCHITECTURE.md con diagramas de arquitectura y flujo de datos
- API.md con referencia completa de todas las APIs (40+ módulos)
- CONTRIBUTING.md con guías paso a paso para contribuir
- JSDOC_AUDIT.md con reporte de cobertura 100%
- README actualizado con nuevas secciones técnicas

### v1.0.0 (Diciembre 2024)
- Creación inicial de documentación de usuario
- Manual del Usuario completo (USER_GUIDE.md)
- FAQ con 15+ preguntas organizadas (FAQ.md)
- Guía paso a paso de API Key (API_KEY_SETUP.md)
- README de navegación (este archivo)

---

**Última actualización**: Enero 2025
**Versión del proyecto**: 3.0.0
**Mantenido por**: Equipo de desarrollo de Jamf Assistant
**Dirigido a**: Docentes del Colegio Huerta Santa Ana y desarrolladores

---

## Métricas de Documentación

- **Cobertura JSDoc**: 100% (47/47 módulos)
- **Documentos técnicos**: 4 (ARCHITECTURE, API, CONTRIBUTING, JSDOC_AUDIT)
- **Documentos de usuario**: 3 (USER_GUIDE, FAQ, API_KEY_SETUP)
- **Total páginas**: ~150 páginas equivalentes
- **Ejemplos de código**: 100+ ejemplos funcionales
- **Diagramas**: 10+ diagramas ASCII y descripciones visuales

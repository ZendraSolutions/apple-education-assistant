# Jamf Assistant - Centro Escolar

Asistente de soporte técnico para gestión de dispositivos Apple en entornos educativos.

## 🚀 Características

- **Dashboard interactivo** con guías y diagnósticos
- **Chatbot con IA** (Gemini 2.5 Flash) con acceso a internet
- **Base de conocimiento** actualizada automáticamente
- **Diseño Organic Matte** optimizado para uso escolar

## 🌐 Demo

Visita: `https://[tu-usuario].github.io/jamf-assistant/`

## 🔧 Configuración

### API Key de Gemini
1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Crea una API Key gratuita
3. Pulsa ⚙️ en el chatbot y pégala

### Actualización automática de docs
La documentación se actualiza automáticamente el día 1 de cada mes mediante GitHub Actions.

## 📁 Estructura

```
├── index.html          # Página principal
├── css/styles.css      # Estilos Organic Matte
├── js/
│   ├── app.js          # Lógica principal
│   ├── chatbot.js      # Módulo del chatbot
│   ├── knowledge-base.js
│   └── diagnostics.js
├── data/
│   └── docs.json       # Documentación RAG
├── scripts/
│   └── update-docs.js  # Script de auto-actualización
└── .github/workflows/
    ├── deploy.yml      # Deploy a GitHub Pages
    └── auto-update-docs.yml
```

## 📝 Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para el historial de actualizaciones.

## 📄 Licencia

MIT

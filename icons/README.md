# PWA Icons

Este directorio contiene los iconos necesarios para la PWA (Progressive Web App).

## Iconos requeridos

Para una PWA completamente funcional en iPads, necesitas los siguientes iconos:

- `icon-72.png` (72x72)
- `icon-96.png` (96x96)
- `icon-128.png` (128x128)
- `icon-144.png` (144x144)
- `icon-152.png` (152x152)
- `icon-192.png` (192x192) - **Obligatorio para Android**
- `icon-384.png` (384x384)
- `icon-512.png` (512x512) - **Obligatorio para Android**
- `apple-touch-icon.png` (180x180) - **Obligatorio para iOS/iPadOS**
- `screenshot-wide.png` (1280x720) - Opcional: captura de pantalla panorámica
- `screenshot-narrow.png` (750x1334) - Opcional: captura de pantalla móvil

## Generación de iconos

### Opción 1: Usando herramientas online

1. **PWA Asset Generator** (Recomendado)
   - Ve a: https://www.pwabuilder.com/imageGenerator
   - Sube `icon-source.svg`
   - Descarga todos los tamaños generados

2. **RealFaviconGenerator**
   - Ve a: https://realfavicongenerator.net/
   - Sube `icon-source.svg`
   - Genera iconos para todas las plataformas

### Opción 2: Usando convert-svg-to-png.html

1. Abre `convert-svg-to-png.html` en tu navegador
2. El script convertirá automáticamente `icon-source.svg` a todos los tamaños PNG
3. Descarga cada icono haciendo clic en los botones

### Opción 3: Usando ImageMagick (línea de comandos)

```bash
# Instalar ImageMagick primero: https://imagemagick.org/

# Convertir a todos los tamaños
magick icon-source.svg -resize 72x72 icon-72.png
magick icon-source.svg -resize 96x96 icon-96.png
magick icon-source.svg -resize 128x128 icon-128.png
magick icon-source.svg -resize 144x144 icon-144.png
magick icon-source.svg -resize 152x152 icon-152.png
magick icon-source.svg -resize 192x192 icon-192.png
magick icon-source.svg -resize 384x384 icon-384.png
magick icon-source.svg -resize 512x512 icon-512.png
magick icon-source.svg -resize 180x180 apple-touch-icon.png
```

### Opción 4: Usando npm/npx

```bash
# Instalar svg-to-png globalmente
npm install -g svg-to-png-converter

# O usar directamente con npx
npx svg-to-png icon-source.svg --width 72 --height 72 --output icon-72.png
npx svg-to-png icon-source.svg --width 96 --height 96 --output icon-96.png
npx svg-to-png icon-source.svg --width 128 --height 128 --output icon-128.png
npx svg-to-png icon-source.svg --width 144 --height 144 --output icon-144.png
npx svg-to-png icon-source.svg --width 152 --height 152 --output icon-152.png
npx svg-to-png icon-source.svg --width 192 --height 192 --output icon-192.png
npx svg-to-png icon-source.svg --width 384 --height 384 --output icon-384.png
npx svg-to-png icon-source.svg --width 512 --height 512 --output icon-512.png
npx svg-to-png icon-source.svg --width 180 --height 180 --output apple-touch-icon.png
```

## Placeholder temporal

Mientras generas los iconos finales, puedes usar el SVG como fallback. Los navegadores modernos soportan SVG en el manifest, aunque se recomienda PNG para mejor compatibilidad.

## Capturas de pantalla (Screenshots)

Para una mejor experiencia en las tiendas de apps y en el instalador PWA:

1. **screenshot-wide.png** (1280x720): Captura panorámica del dashboard
2. **screenshot-narrow.png** (750x1334): Captura de la vista móvil

Puedes capturar estas pantallas directamente desde la app funcionando.

## Verificación

Una vez generados todos los iconos, verifica que:

1. Todos los archivos PNG existen en este directorio
2. Los tamaños son correctos (puedes verificar con `file icon-*.png` en Linux/Mac)
3. No hay errores en la consola del navegador al cargar la PWA
4. El icono aparece correctamente al agregar a pantalla de inicio en iPad

## Recursos adicionales

- [Web App Manifest - MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Icons Guide - web.dev](https://web.dev/add-manifest/#icons)
- [iOS Web App Icons - Apple](https://developer.apple.com/design/human-interface-guidelines/app-icons)

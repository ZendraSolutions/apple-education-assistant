import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Icon sizes to generate
const iconSizes = [
    { name: 'icon-72.png', size: 72 },
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-128.png', size: 128 },
    { name: 'icon-144.png', size: 144 },
    { name: 'icon-152.png', size: 152 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-384.png', size: 384 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 }
];

/**
 * Generate PNG icons from SVG using Canvas API (built-in Node.js)
 */
async function generateIconsWithCanvas() {
    console.log('Attempting to use canvas library...');

    try {
        const { createCanvas, Image } = await import('canvas');
        const svgPath = join(__dirname, '..', 'icons', 'icon-source.svg');
        const iconsDir = join(__dirname, '..', 'icons');

        // Read SVG file
        const svgContent = await readFile(svgPath, 'utf-8');

        for (const { name, size } of iconSizes) {
            console.log(`Generating ${name} (${size}x${size})...`);

            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext('2d');

            // Create image from SVG
            const img = new Image();
            img.src = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

            // Draw scaled image
            ctx.drawImage(img, 0, 0, size, size);

            // Save as PNG
            const buffer = canvas.toBuffer('image/png');
            const outputPath = join(iconsDir, name);
            await writeFile(outputPath, buffer);

            console.log(`✓ Created ${name}`);
        }

        console.log('\n✓ All icons generated successfully using canvas!');
        return true;
    } catch (error) {
        console.log('Canvas library not available:', error.message);
        return false;
    }
}

/**
 * Generate PNG icons from SVG using sharp library
 */
async function generateIconsWithSharp() {
    console.log('Attempting to use sharp library...');

    try {
        const sharp = (await import('sharp')).default;
        const svgPath = join(__dirname, '..', 'icons', 'icon-source.svg');
        const iconsDir = join(__dirname, '..', 'icons');

        // Read SVG file
        const svgBuffer = await readFile(svgPath);

        for (const { name, size } of iconSizes) {
            console.log(`Generating ${name} (${size}x${size})...`);

            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(join(iconsDir, name));

            console.log(`✓ Created ${name}`);
        }

        console.log('\n✓ All icons generated successfully using sharp!');
        return true;
    } catch (error) {
        console.log('Sharp library not available:', error.message);
        return false;
    }
}

/**
 * Generate PNG icons using base64 embedded PNG data (fallback)
 * Creates simple branded icons with the app color scheme
 */
async function generateIconsWithFallback() {
    console.log('Using fallback method - creating simple branded PNG icons...\n');

    const iconsDir = join(__dirname, '..', 'icons');

    // For each size, we'll create a simple PNG with the SVG content
    // This uses a workaround by creating an HTML file that can be opened to generate the icons
    const htmlGeneratorPath = join(iconsDir, 'auto-generate-icons.html');

    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Icon Generator</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .status { margin: 10px 0; padding: 10px; background: #e8f5e9; border-radius: 4px; }
        .error { background: #ffebee; }
        canvas { display: none; }
        button { padding: 10px 20px; background: #233D70; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin: 10px 0; }
        button:hover { background: #1a2d54; }
        .download-section { margin-top: 20px; }
        .download-link { display: block; margin: 5px 0; padding: 8px; background: #f0f0f0; border-radius: 4px; text-decoration: none; color: #233D70; }
        .download-link:hover { background: #e0e0e0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎨 PWA Icon Generator</h1>
        <p>This tool generates all required PNG icons for the PWA from the SVG source.</p>

        <button onclick="generateAllIcons()">Generate All Icons</button>

        <div id="status"></div>
        <div id="downloads" class="download-section"></div>

        <canvas id="canvas"></canvas>
    </div>

    <script>
        const iconSizes = [
            { name: 'icon-72.png', size: 72 },
            { name: 'icon-96.png', size: 96 },
            { name: 'icon-128.png', size: 128 },
            { name: 'icon-144.png', size: 144 },
            { name: 'icon-152.png', size: 152 },
            { name: 'icon-192.png', size: 192 },
            { name: 'icon-384.png', size: 384 },
            { name: 'icon-512.png', size: 512 },
            { name: 'apple-touch-icon.png', size: 180 }
        ];

        const svgContent = \`${await readFile(join(__dirname, '..', 'icons', 'icon-source.svg'), 'utf-8')}\`;

        function addStatus(message, isError = false) {
            const statusDiv = document.getElementById('status');
            const div = document.createElement('div');
            div.className = isError ? 'status error' : 'status';
            div.textContent = message;
            statusDiv.appendChild(div);
        }

        function downloadBlob(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        async function generateIcon(name, size) {
            return new Promise((resolve, reject) => {
                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = size;
                canvas.height = size;

                const img = new Image();
                const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);

                img.onload = function() {
                    ctx.drawImage(img, 0, 0, size, size);

                    canvas.toBlob(function(blob) {
                        URL.revokeObjectURL(url);
                        resolve({ name, blob });
                    }, 'image/png');
                };

                img.onerror = function() {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to load SVG'));
                };

                img.src = url;
            });
        }

        async function generateAllIcons() {
            document.getElementById('status').innerHTML = '';
            document.getElementById('downloads').innerHTML = '';

            addStatus('Starting icon generation...');

            for (const { name, size } of iconSizes) {
                try {
                    addStatus(\`Generating \${name} (\${size}x\${size})...\`);
                    const { name: fileName, blob } = await generateIcon(name, size);

                    // Auto-download
                    downloadBlob(blob, fileName);

                    // Add download link
                    const downloadsDiv = document.getElementById('downloads');
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = fileName;
                    link.className = 'download-link';
                    link.textContent = \`📥 Download \${fileName} (\${size}x\${size})\`;
                    downloadsDiv.appendChild(link);

                    addStatus(\`✓ Created \${fileName}\`);
                } catch (error) {
                    addStatus(\`✗ Failed to generate \${name}: \${error.message}\`, true);
                }
            }

            addStatus('\\n✓ All icons generated! Please save them to the icons/ directory.', false);
            alert('All icons have been generated and downloaded! Please move them to the icons/ directory.');
        }
    </script>
</body>
</html>`;

    await writeFile(htmlGeneratorPath, htmlContent);

    console.log('✓ Created HTML icon generator at:');
    console.log(`  ${htmlGeneratorPath}`);
    console.log('\nTo generate icons:');
    console.log('  1. Open auto-generate-icons.html in your browser');
    console.log('  2. Click "Generate All Icons"');
    console.log('  3. Save the downloaded PNG files to the icons/ directory');
    console.log('\nAlternatively, install sharp or canvas:');
    console.log('  npm install sharp');
    console.log('  OR');
    console.log('  npm install canvas');

    return false;
}

/**
 * Main function - tries multiple methods
 */
async function main() {
    console.log('PWA Icon Generator');
    console.log('==================\n');

    // Try sharp first (best quality, fastest)
    if (await generateIconsWithSharp()) {
        return;
    }

    // Try canvas (good quality)
    if (await generateIconsWithCanvas()) {
        return;
    }

    // Fallback to HTML generator
    await generateIconsWithFallback();
}

main().catch(console.error);

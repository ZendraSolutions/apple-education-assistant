import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate PWA screenshot placeholders
 * These are required for PWA installation prompts on some platforms
 */
async function generateScreenshots() {
    console.log('PWA Screenshot Generator');
    console.log('========================\n');

    const iconsDir = join(__dirname, '..', 'icons');

    // Define screenshot specifications
    const screenshots = [
        {
            name: 'screenshot-wide.png',
            width: 1280,
            height: 720,
            formFactor: 'wide'
        },
        {
            name: 'screenshot-narrow.png',
            width: 750,
            height: 1334,
            formFactor: 'narrow'
        }
    ];

    const brandColor = '#233D70';
    const accentColor = '#FF8C42';

    for (const { name, width, height, formFactor } of screenshots) {
        console.log(`Generating ${name} (${width}x${height})...`);

        // Create SVG content for screenshot
        const svgContent = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <!-- Background gradient -->
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${brandColor};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#1a2d54;stop-opacity:1" />
                    </linearGradient>
                </defs>

                <!-- Background -->
                <rect width="${width}" height="${height}" fill="url(#grad)"/>

                <!-- Decorative circles -->
                <circle cx="${width * 0.1}" cy="${height * 0.15}" r="${width * 0.08}" fill="${accentColor}" opacity="0.1"/>
                <circle cx="${width * 0.85}" cy="${height * 0.75}" r="${width * 0.12}" fill="${accentColor}" opacity="0.08"/>
                <circle cx="${width * 0.9}" cy="${height * 0.2}" r="${width * 0.06}" fill="white" opacity="0.05"/>

                <!-- App icon in center -->
                <rect x="${width/2 - 150}" y="${height/2 - 150}" width="300" height="300" rx="68" fill="${brandColor}" opacity="0.3"/>

                <!-- Graduation cap -->
                <path d="M ${width/2} ${height/2 - 100} L ${width/2 - 120} ${height/2 - 40} L ${width/2} ${height/2 + 20} L ${width/2 + 120} ${height/2 - 40} Z" fill="${accentColor}"/>

                <!-- Title -->
                <text x="${width/2}" y="${height * 0.75}"
                      font-family="Arial, sans-serif"
                      font-size="${formFactor === 'wide' ? '48' : '36'}"
                      font-weight="bold"
                      fill="white"
                      text-anchor="middle">
                    Jamf Assistant
                </text>

                <!-- Subtitle -->
                <text x="${width/2}" y="${height * 0.75 + (formFactor === 'wide' ? 50 : 40)}"
                      font-family="Arial, sans-serif"
                      font-size="${formFactor === 'wide' ? '24' : '18'}"
                      fill="white"
                      opacity="0.9"
                      text-anchor="middle">
                    Apple Education Assistant
                </text>

                <!-- Features indicators (dots) -->
                ${formFactor === 'wide' ? `
                <circle cx="${width/2 - 30}" cy="${height * 0.85}" r="8" fill="${accentColor}"/>
                <circle cx="${width/2}" cy="${height * 0.85}" r="8" fill="white" opacity="0.6"/>
                <circle cx="${width/2 + 30}" cy="${height * 0.85}" r="8" fill="white" opacity="0.6"/>
                ` : ''}
            </svg>
        `;

        // Generate PNG from SVG
        await sharp(Buffer.from(svgContent))
            .png()
            .toFile(join(iconsDir, name));

        console.log(`✓ Created ${name}`);
    }

    console.log('\n✓ All screenshots generated successfully!');
    console.log('\nNote: These are placeholder screenshots.');
    console.log('For production, replace with actual app screenshots by running:');
    console.log('  - Take screenshots of your app at 1280x720 (desktop) and 750x1334 (mobile)');
    console.log('  - Save them as screenshot-wide.png and screenshot-narrow.png in the icons/ directory');
}

generateScreenshots().catch(console.error);

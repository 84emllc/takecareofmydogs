/**
 * Generate PWA icons from SVG source
 * Run with: node scripts/generate-icons.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ICONS_DIR = path.join(__dirname, '..', 'assets', 'icons');
const SVG_SOURCE = path.join(ICONS_DIR, 'icon.svg');

// All required icon sizes for PWA
const SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

async function generateIcons() {
    console.log('Generating PWA icons from SVG...\n');

    // Read SVG file
    const svgBuffer = fs.readFileSync(SVG_SOURCE);

    for (const size of SIZES) {
        const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);

        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(outputPath);

        console.log(`Generated: icon-${size}x${size}.png`);
    }

    // Generate apple-touch-icon (180x180)
    const appleTouchPath = path.join(ICONS_DIR, 'apple-touch-icon.png');
    await sharp(svgBuffer)
        .resize(180, 180)
        .png()
        .toFile(appleTouchPath);
    console.log('Generated: apple-touch-icon.png');

    // Generate favicons
    const favicon32Path = path.join(ICONS_DIR, 'favicon-32x32.png');
    const favicon16Path = path.join(ICONS_DIR, 'favicon-16x16.png');

    await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(favicon32Path);
    console.log('Generated: favicon-32x32.png');

    await sharp(svgBuffer)
        .resize(16, 16)
        .png()
        .toFile(favicon16Path);
    console.log('Generated: favicon-16x16.png');

    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(err => {
    console.error('Error generating icons:', err);
    process.exit(1);
});

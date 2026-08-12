/**
 * Convert large PNG assets to WebP format for performance
 * 
 * Converts decorative/environmental PNG files to WebP while preserving:
 * - Transparency
 * - Visual quality (95% quality setting)
 * - Original dimensions
 * 
 * Does NOT convert:
 * - Builder Pass template (needs PNG for generation quality)
 * - SVG files (already optimal)
 * - Small files < 100KB (negligible savings)
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets', 'illustrations');

// Files to convert (exclude builder pass template and very small files)
const CONVERT_LIST = [
  'architecture/goan-window-frame.png',
  'decor/goa-lighthouse-poster.png',
  'travel/vintage-luggage-tag.png',
  'decor/fish-tile-art.png',
  'decor/esc-key.png',
  'nature/palm-tree-tall.png',
  'travel/vintage-camera.png',
  'travel/passport-template.png',
  'nature/palm-tree-short.png',
  'nature/ocean-waves.png',
  'nature/red-flower.png',
  'travel/paradise-postage-stamp.png',
  'props/beach-direction-sign.png',
  'nature/sun-handdrawn.png',
  'props/yellow-scooter.png',
  'travel/travel-keychain.png',
];

async function convertToWebP(relPath) {
  const pngPath = path.join(ASSETS_DIR, relPath);
  const webpPath = pngPath.replace(/\.png$/, '.webp');

  try {
    const pngStats = await fs.stat(pngPath);
    const pngSizeKB = Math.round(pngStats.size / 1024);

    // Convert to WebP with high quality
    await sharp(pngPath)
      .webp({ quality: 95, alphaQuality: 100 })
      .toFile(webpPath);

    const webpStats = await fs.stat(webpPath);
    const webpSizeKB = Math.round(webpStats.size / 1024);
    const savings = Math.round(((pngStats.size - webpStats.size) / pngStats.size) * 100);

    console.log(`✓ ${relPath}`);
    console.log(`  PNG: ${pngSizeKB} KB → WebP: ${webpSizeKB} KB (${savings}% smaller)`);
    
    return { pngSize: pngStats.size, webpSize: webpStats.size };
  } catch (error) {
    console.error(`✗ Failed to convert ${relPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Converting PNG assets to WebP...\n');

  let totalPngSize = 0;
  let totalWebpSize = 0;
  let successCount = 0;

  for (const file of CONVERT_LIST) {
    const result = await convertToWebP(file);
    if (result) {
      totalPngSize += result.pngSize;
      totalWebpSize += result.webpSize;
      successCount++;
    }
    console.log('');
  }

  const totalSavingsMB = ((totalPngSize - totalWebpSize) / (1024 * 1024)).toFixed(2);
  const totalSavingsPercent = Math.round(((totalPngSize - totalWebpSize) / totalPngSize) * 100);

  console.log('='.repeat(60));
  console.log(`Converted ${successCount}/${CONVERT_LIST.length} files`);
  console.log(`Total savings: ${totalSavingsMB} MB (${totalSavingsPercent}% reduction)`);
  console.log('='.repeat(60));
}

main().catch(console.error);

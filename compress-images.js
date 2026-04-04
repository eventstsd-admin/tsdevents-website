import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MAX_SIZE_KB = 150;
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;
const IMAGES_DIR = './src/app/images';

// Image file extensions to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Function to get file size in KB
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

// Function to compress image and create WebP version
async function compressImage(inputPath) {
  const originalSize = getFileSizeKB(inputPath);
  const ext = path.extname(inputPath).toLowerCase();
  const basename = path.basename(inputPath, ext);
  const dirname = path.dirname(inputPath);
  const webpPath = path.join(dirname, `${basename}.webp`);
  
  console.log(`\n🔄 Processing: ${path.basename(inputPath)} (${originalSize} KB)`);
  
  try {
    // Create WebP version (typically 70-80% smaller)
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(webpPath);
    
    const webpSize = getFileSizeKB(webpPath);
    console.log(`   ✅ WebP created: ${webpSize} KB (saves ${originalSize - webpSize} KB)`);
    
    // Optimize original image
    let finalSize = originalSize;
    
    if (ext === '.png') {
      await sharp(inputPath)
        .png({ compressionLevel: 9, progressive: true })
        .toFile(inputPath + '.tmp');
      fs.renameSync(inputPath + '.tmp', inputPath);
      finalSize = getFileSizeKB(inputPath);
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      await sharp(inputPath)
        .jpeg({ quality: 82, mozjpeg: true, progressive: true })
        .toFile(inputPath + '.tmp');
      fs.renameSync(inputPath + '.tmp', inputPath);
      finalSize = getFileSizeKB(inputPath);
    }
    
    const saved = originalSize - finalSize;
    if (saved > 0) {
      console.log(`   ✅ Original optimized: ${finalSize} KB (saved ${saved} KB)`);
    }
    
    return { originalSize, finalSize, webpSize, saved, webpPath };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { originalSize, finalSize: originalSize, saved: 0, error: error.message };
  }
}

// Function to find all images recursively
function findImages(dir) {
  const images = [];
  
  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (IMAGE_EXTENSIONS.includes(path.extname(item).toLowerCase())) {
        images.push(fullPath);
      }
    }
  }
  
  scanDir(dir);
  return images;
}

// Main compression function
async function compressAllImages() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║            🖼️  TSD Image Compression Tool                  ║
║          Optimize Images + Create WebP Versions             ║
╚════════════════════════════════════════════════════════════╝
  `);
  console.log(`📁 Scanning: ${IMAGES_DIR}`);
  console.log(`🎯 Target: ${MAX_SIZE_KB} KB max (original)\n`);

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
    return;
  }

  const images = findImages(IMAGES_DIR);
  
  if (images.length === 0) {
    console.log('ℹ️  No images found to compress.');
    return;
  }

  console.log(`Found ${images.length} images\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let totalWebpSize = 0;
  const results = [];

  for (const imagePath of images) {
    const result = await compressImage(imagePath);
    results.push(result);
    
    totalOriginalSize += result.originalSize;
    totalOptimizedSize += result.finalSize || result.originalSize;
    totalWebpSize += result.webpSize || 0;
  }

  // Summary
  const totalSaved = totalOriginalSize - totalOptimizedSize;
  const savedPercent = totalOriginalSize > 0 ? Math.round((totalSaved / totalOriginalSize) * 100) : 0;
  const totalBandwidthSavings = totalSaved + totalWebpSize;
  const bandwidthSavingsPercent = totalOriginalSize > 0 ? Math.round((totalBandwidthSavings / totalOriginalSize) * 100) : 0;

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                   📊 COMPRESSION SUMMARY                   ║
╚════════════════════════════════════════════════════════════╝

  Images processed: ${results.length}
  
  Original total:        ${totalOriginalSize} KB
  Optimized total:       ${totalOptimizedSize} KB (↓${savedPercent}%)
  WebP total:            ${totalWebpSize} KB
  
  Optimized savings:     ${totalSaved} KB
  Bandwidth savings*:    ${totalBandwidthSavings} KB (↓${bandwidthSavingsPercent}%)
  
  Avg optimized size:    ${Math.round(totalOptimizedSize / results.length)} KB
  Avg WebP size:         ${Math.round(totalWebpSize / results.length)} KB

  * Bandwidth savings = Optimized + WebP (modern browsers serve WebP)
  
╔════════════════════════════════════════════════════════════╗
║                  💡 IMPLEMENTATION TIPS                    ║
╚════════════════════════════════════════════════════════════╝

  To use WebP with fallback, update your <img> tags:
  
  <picture>
    <source srcSet="image.webp" type="image/webp" />
    <img src="image.jpg" alt="..." />
  </picture>
  
  Or use in CSS:
  background-image: url('image.webp');
  
  This will automatically serve WebP to modern browsers
  (Chrome, Firefox, Edge, Safari 14+) saving ~70-80% bandwidth!
`);
}

// Run the compression
compressAllImages().catch(console.error);
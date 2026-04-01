import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MAX_SIZE_KB = 200;
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;
const IMAGES_DIR = './src/app/images';

// Image file extensions to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Function to get file size in KB
function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024);
}

// Function to compress image
async function compressImage(inputPath, outputPath) {
  const originalSize = getFileSizeKB(inputPath);
  console.log(`\nProcessing: ${path.basename(inputPath)} (${originalSize} KB)`);
  
  if (originalSize <= MAX_SIZE_KB) {
    console.log(`✅ Already under ${MAX_SIZE_KB}KB - skipping`);
    return { originalSize, finalSize: originalSize, saved: 0 };
  }

  let quality = 85; // Start with high quality
  let finalSize = originalSize;
  let attempts = 0;
  const maxAttempts = 10;

  while (finalSize > MAX_SIZE_KB && attempts < maxAttempts && quality > 20) {
    try {
      const tempPath = outputPath + '.temp';
      
      await sharp(inputPath)
        .jpeg({ quality, mozjpeg: true }) // Use mozjpeg for better compression
        .png({ quality, compressionLevel: 9 })
        .webp({ quality })
        .toFile(tempPath);

      finalSize = getFileSizeKB(tempPath);
      
      if (finalSize <= MAX_SIZE_KB) {
        // Success! Replace original
        fs.renameSync(tempPath, outputPath);
        const saved = originalSize - finalSize;
        const savedPercent = Math.round((saved / originalSize) * 100);
        console.log(`✅ Compressed to ${finalSize} KB (saved ${saved} KB / ${savedPercent}%) at quality ${quality}`);
        return { originalSize, finalSize, saved };
      } else {
        // Try lower quality
        fs.unlinkSync(tempPath);
        quality -= 10;
        attempts++;
        console.log(`   Attempt ${attempts}: ${finalSize} KB at quality ${quality} - trying lower quality...`);
      }
    } catch (error) {
      console.error(`❌ Error compressing ${inputPath}:`, error.message);
      return { originalSize, finalSize: originalSize, saved: 0, error: error.message };
    }
  }

  if (finalSize > MAX_SIZE_KB) {
    console.log(`⚠️  Could not compress to under ${MAX_SIZE_KB} KB. Final size: ${finalSize} KB`);
  }

  return { originalSize, finalSize, saved: originalSize - finalSize };
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
  console.log(`🖼️  TSD Website Image Compression Tool`);
  console.log(`📁 Scanning directory: ${IMAGES_DIR}`);
  console.log(`🎯 Target size: ${MAX_SIZE_KB} KB max per image\n`);

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
    return;
  }

  const images = findImages(IMAGES_DIR);
  
  if (images.length === 0) {
    console.log('No images found to compress.');
    return;
  }

  console.log(`Found ${images.length} images to process:\n`);

  let totalOriginalSize = 0;
  let totalFinalSize = 0;
  let processedCount = 0;
  const results = [];

  for (const imagePath of images) {
    const result = await compressImage(imagePath, imagePath);
    results.push({ path: imagePath, ...result });
    
    totalOriginalSize += result.originalSize;
    totalFinalSize += result.finalSize;
    processedCount++;
  }

  // Summary
  const totalSaved = totalOriginalSize - totalFinalSize;
  const savedPercent = totalOriginalSize > 0 ? Math.round((totalSaved / totalOriginalSize) * 100) : 0;

  console.log(`\n📊 COMPRESSION SUMMARY`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Images processed: ${processedCount}`);
  console.log(`Total original size: ${totalOriginalSize} KB`);
  console.log(`Total final size: ${totalFinalSize} KB`);
  console.log(`Total saved: ${totalSaved} KB (${savedPercent}%)`);
  console.log(`Average size per image: ${Math.round(totalFinalSize / processedCount)} KB`);
  
  // Show any images still over limit
  const oversized = results.filter(r => r.finalSize > MAX_SIZE_KB);
  if (oversized.length > 0) {
    console.log(`\n⚠️  Images still over ${MAX_SIZE_KB} KB:`);
    oversized.forEach(img => {
      console.log(`   ${path.basename(img.path)}: ${img.finalSize} KB`);
    });
  } else {
    console.log(`\n✅ All images are now under ${MAX_SIZE_KB} KB!`);
  }
}

// Run the compression
compressAllImages().catch(console.error);
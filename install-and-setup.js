const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Installing Sharp library...');

try {
  // Install Sharp
  execSync('npm install sharp', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Sharp installed successfully!');
  
  // Check if images directory exists
  const imagesDir = './src/app/images';
  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Images directory not found: ${imagesDir}`);
    process.exit(1);
  }
  
  console.log('\n📂 Images directory found. Ready to compress!');
  console.log('Now run: node compress-images.js');
  
} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
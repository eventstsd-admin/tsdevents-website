import sharp from 'sharp';
import fs from 'fs';

const inputFile = 'src/app/images/Tsd logo.webp';
const outputFile = 'src/app/images/Tsd_logo_resized.webp';

sharp(inputFile)
  .resize(332, 160)
  .toFile(outputFile)
  .then(() => {
    fs.renameSync(outputFile, inputFile);
    console.log('Successfully resized the logo!');
  })
  .catch((err) => {
    console.error('Error resizing:', err);
  });

// update-data-files.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob'; // Changed to use named import

// Path to your new image
const NEW_IMAGE_PATH = '/data/image.jpg';

// Data files that might contain image references
const patterns = [
  'src/data/**/*.{js,ts,json}',
  'data/**/*.{js,ts,json}'
];

// Process all files with image references in data objects
const updateDataFiles = async () => {
  for (const pattern of patterns) {
    // Use the promisified version of glob directly
    const files = await glob(pattern);

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let hasChanged = false;

      // Look for image properties in objects
      const imageProps = [
        /(image|imageUrl|coverImage|icon):\s*['"]([^'"]+)\.(?:jpg|jpeg|png|gif|svg|webp)['"]/g
      ];

      imageProps.forEach(regex => {
        const originalContent = content;
        content = content.replace(regex, (match, prop) => {
          return `${prop}: "${NEW_IMAGE_PATH}"`;
        });
        
        if (originalContent !== content) {
          hasChanged = true;
        }
      });

      if (hasChanged) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated data file ${file}`);
      }
    }
  }
};

updateDataFiles().catch(error => {
  console.error('Error:', error);
});
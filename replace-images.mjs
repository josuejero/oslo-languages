// replace-images.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob'; // Changed to use named import

// Path to your new image
const NEW_IMAGE_PATH = '/data/image.jpg';

// File patterns to search
const patterns = [
  'src/**/*.{tsx,ts,jsx,js}',
  'public/**/*.{html,css}',
  '*.{json,md}'
];

// Image path regex patterns to match various image references
const imagePatterns = [
  /['"]\/images\/[^'"]+\.(?:jpg|jpeg|png|gif|svg|webp)['"]/g,        // "/images/path/image.jpg"
  /['"]\/testimonials\/[^'"]+\.(?:jpg|jpeg|png|gif|svg|webp)['"]/g,  // "/testimonials/image.jpg"
  /['"]\/api\/placeholder\/[^'"]+['"]/g,                            // "/api/placeholder/400/320"
  /imageUrl:?\s['"][^'"]+\.(?:jpg|jpeg|png|gif|svg|webp)['"]/g,     // imageUrl: "/path/image.jpg"
  /fallbackSrc:?\s['"][^'"]+\.(?:jpg|jpeg|png|gif|svg|webp)['"]/g,  // fallbackSrc: "/path/image.jpg"
  /icon:?\s['"][^'"]+\.(?:jpg|jpeg|png|gif|svg|webp)['"]/g,         // icon: "/path/image.jpg"
];

// Process files using Promise-based approach for better async handling
const processFiles = async () => {
  for (const pattern of patterns) {
    // Use the promisified version of glob
    const files = await glob(pattern);

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let hasChanged = false;

      imagePatterns.forEach(regex => {
        const originalContent = content;
        content = content.replace(regex, match => {
          // Keep the quotes and other surrounding syntax, just replace the path
          const quoteChar = match.charAt(0);
          if (quoteChar === "'" || quoteChar === '"') {
            return quoteChar + NEW_IMAGE_PATH + quoteChar;
          } else if (match.includes('imageUrl:')) {
            return 'imageUrl: "' + NEW_IMAGE_PATH + '"';
          } else if (match.includes('fallbackSrc:')) {
            return 'fallbackSrc: "' + NEW_IMAGE_PATH + '"';
          } else if (match.includes('icon:')) {
            return 'icon: "' + NEW_IMAGE_PATH + '"';
          }
          return match;
        });

        if (originalContent !== content) {
          hasChanged = true;
        }
      });

      if (hasChanged) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  }
};

processFiles().catch(error => {
  console.error('Error:', error);
});
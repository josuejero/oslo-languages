// update-imports.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob'; // Changed to use named import

// Path to your new image
const NEW_IMAGE_PATH = '/data/image.jpg';

// Files that might import images
const pattern = 'src/**/*.{tsx,ts,jsx,js}';

// Find and update import statements for images
const updateImports = async () => {
  // Use the promisified version of glob directly
  const files = await glob(pattern);

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanged = false;

    // Match import statements for images
    const importRegex = /import\s+(\w+)\s+from\s+['"].*\.(jpg|jpeg|png|gif|svg|webp)['"]/g;
    const originalContent = content;
    content = content.replace(importRegex, `import $1 from "${NEW_IMAGE_PATH}"`);
    
    if (originalContent !== content) {
      hasChanged = true;
    }

    if (hasChanged) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated imports in ${file}`);
    }
  }
};

updateImports().catch(error => {
  console.error('Error:', error);
});
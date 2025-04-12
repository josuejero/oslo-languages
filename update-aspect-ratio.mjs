// update-aspect-ratio.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob'; // Changed to use named import

// Files that likely contain OptimizedImage component
const pattern = 'src/**/*.{tsx,ts,jsx,js}';

// Promise-based approach to find and update aspect ratio properties
const updateAspectRatios = async () => {
  // Use the promisified version of glob directly
  const files = await glob(pattern);

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanged = false;

    // Update aspectRatio prop for OptimizedImage components
    const originalContent = content;
    content = content.replace(/aspectRatio=\{[^}]+\}/g, 'aspectRatio={1}');
    
    if (originalContent !== content) {
      hasChanged = true;
    }

    if (hasChanged) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated aspect ratio in ${file}`);
    }
  }
};

updateAspectRatios().catch(error => {
  console.error('Error:', error);
});
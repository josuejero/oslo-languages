// reverse-image-changes.mjs
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// The path we're looking to replace
const REPLACED_IMAGE_PATH = '/data/image.jpg';

// Context-based image mapping to restore paths based on surrounding code
const contextMappings = [
  // Course-related images
  { 
    pattern: /CourseCard.*?imageUrl:\s*["']\/data\/image\.jpg["']/s,
    replacement: '/images/default-course.jpg' 
  },
  // Language icons
  { 
    pattern: /icon:\s*["']\/data\/image\.jpg["'].*?Norwegian/s,
    replacement: '/images/icons/norwegian.png' 
  },
  { 
    pattern: /icon:\s*["']\/data\/image\.jpg["'].*?English/s,
    replacement: '/images/icons/english.png' 
  },
  { 
    pattern: /icon:\s*["']\/data\/image\.jpg["'].*?Spanish/s,
    replacement: '/images/icons/spanish.png' 
  },
  { 
    pattern: /icon:\s*["']\/data\/image\.jpg["'].*?Custom/s,
    replacement: '/images/icons/custom.png' 
  },
  // Blog images
  { 
    pattern: /BlogPost.*?imageUrl:\s*["']\/data\/image\.jpg["'].*?Norwegian/s,
    replacement: '/images/blog/pronunciation.jpg' 
  },
  { 
    pattern: /BlogPost.*?imageUrl:\s*["']\/data\/image\.jpg["'].*?English/s,
    replacement: '/images/blog/english-mistakes.jpg' 
  },
  { 
    pattern: /BlogPost.*?imageUrl:\s*["']\/data\/image\.jpg["'].*?Spanish/s,
    replacement: '/images/blog/spanish-influence.jpg' 
  },
  // Teacher images
  {
    pattern: /Teacher.*?image:\s*["']\/data\/image\.jpg["'].*?Norwegian/s,
    replacement: '/images/teachers/teacher1.jpg'
  },
  {
    pattern: /Teacher.*?image:\s*["']\/data\/image\.jpg["'].*?English/s,
    replacement: '/images/teachers/teacher2.jpg'
  },
  {
    pattern: /Teacher.*?image:\s*["']\/data\/image\.jpg["'].*?Spanish/s,
    replacement: '/images/teachers/teacher3.jpg'
  },
  // Testimonial images
  {
    pattern: /Testimonial.*?image:\s*["']\/data\/image\.jpg["'].*?Maria/s,
    replacement: '/testimonials/maria.jpg'
  },
  {
    pattern: /Testimonial.*?image:\s*["']\/data\/image\.jpg["'].*?Thomas/s,
    replacement: '/testimonials/thomas.jpg'
  },
  {
    pattern: /Testimonial.*?image:\s*["']\/data\/image\.jpg["'].*?Sofia/s,
    replacement: '/testimonials/sofia.jpg'
  },
  // Common images
  {
    pattern: /OptimizedImage.*?fallbackSrc:\s*["']\/data\/image\.jpg["']/s,
    replacement: '/images/placeholder.jpg'
  },
  {
    pattern: /coverImage:\s*["']\/data\/image\.jpg["']/s,
    replacement: '/images/about-cover.jpg'
  },
  {
    pattern: /logo\.png/s,
    replacement: '/images/logo.png'
  }
];

// File patterns to search - should match the ones from the original script
const patterns = [
  'src/**/*.{tsx,ts,jsx,js}',
  'public/**/*.{html,css}',
  '*.{json,md}',
  'src/data/**/*.{js,ts,json}',
  'data/**/*.{js,ts,json}'
];

// Main function to process files
const reverseImageChanges = async () => {
  console.log('Starting to reverse image path changes...');
  let totalUpdatedFiles = 0;
  let totalReplacements = 0;

  // Process each file pattern
  for (const pattern of patterns) {
    // Find all matching files
    const files = await glob(pattern);
    console.log(`Found ${files.length} files matching pattern: ${pattern}`);

    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      let hasChanged = false;
      let replacementsInFile = 0;

      // First pass: Apply context-based mappings
      for (const mapping of contextMappings) {
        // Use a function to remember what was matched
        const replacedContent = content.replace(mapping.pattern, (match) => {
          // Replace only the image path portion
          const newContent = match.replace(REPLACED_IMAGE_PATH, mapping.replacement);
          if (newContent !== match) {
            replacementsInFile++;
            hasChanged = true;
          }
          return newContent;
        });

        if (replacedContent !== content) {
          content = replacedContent;
        }
      }

      // Second pass: Generic replacements for any remaining instances
      const genericImageRegex = new RegExp(`["']${REPLACED_IMAGE_PATH}["']`, 'g');
      const originalContent = content;
      
      // Default generic replacement 
      content = content.replace(genericImageRegex, (match) => {
        // Use a default path for any unmatched cases
        replacementsInFile++;
        return match.replace(REPLACED_IMAGE_PATH, '/images/default-image.jpg');
      });

      if (originalContent !== content) {
        hasChanged = true;
      }

      // Update the file if changes were made
      if (hasChanged) {
        fs.writeFileSync(file, content, 'utf8');
        totalUpdatedFiles++;
        totalReplacements += replacementsInFile;
        console.log(`Updated ${file} (${replacementsInFile} replacements)`);
      }
    }
  }

  console.log(`\nReversal completed!`);
  console.log(`Total files updated: ${totalUpdatedFiles}`);
  console.log(`Total image paths restored: ${totalReplacements}`);
  console.log('\nNote: This script makes intelligent guesses about the original paths.');
  console.log('For a perfect restoration, using version control (git checkout) is recommended.');
};

// Run the script and handle errors
reverseImageChanges().catch(error => {
  console.error('Error during image path reversal:', error);
});
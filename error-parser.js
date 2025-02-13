#!/usr/bin/env node
import { writeFile, readFile, stat } from 'fs/promises';
import { createWriteStream } from 'fs';
import { join, extname, relative, resolve, dirname } from 'path';
import { spawnSync } from 'child_process';
import { createInterface } from 'readline';

const OUTPUT_FILE_PATH = 'error_analysis.txt';
const SEPARATOR = '='.repeat(80);

/**
 * Helper: Prompt the user for multiline input.
 * Type 'END' on a new line when finished.
 */
function getMultilineInput(promptText) {
  return new Promise((resolve, reject) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log(promptText);
    console.log("Enter 'END' on a new line when finished.");
    const lines = [];
    rl.on('line', (line) => {
      if (line.trim() === 'END') {
        rl.close();
      } else {
        lines.push(line);
      }
    });
    rl.on('close', () => resolve(lines.join('\n')));
    rl.on('error', reject);
  });
}

// Keep track of files already processed.
const processedFiles = new Set();

/**
 * Recursively process a file:
 * - Add its content to our list.
 * - Scan for import statements and process those files too.
 */
async function processFile(filePath) {
  if (processedFiles.has(filePath)) return;
  try {
    await stat(filePath);
  } catch {
    console.error(`Cannot find file: ${filePath}`);
    return;
  }
  processedFiles.add(filePath);
  let content;
  try {
    content = await readFile(filePath, 'utf-8');
  } catch (err) {
    console.error(`Error reading file ${filePath}: ${err.message}`);
    return;
  }
  // Regex to match import statements (both static and dynamic)
  const importRegex = /import\s+(?:[^'"]*from\s+)?['"]([^'"]+)['"]|import\(['"]([^'"]+)['"]\)/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1] || match[2];
    // Process relative imports and alias imports that start with "@/"
    if (importPath && (importPath.startsWith('.') ||
        importPath.startsWith('..') ||
        importPath.startsWith('@/'))) {
      let basePath = '';
      if (importPath.startsWith('@/')) {
        // Assuming "@" maps to the "src" directory in the project root.
        basePath = join(process.cwd(), 'src', importPath.slice(2));
      } else {
        basePath = resolve(dirname(filePath), importPath);
      }
      let candidatePaths = [];
      // If an extension is provided, try that; otherwise, try common extensions.
      if (extname(basePath)) {
        candidatePaths.push(basePath);
      } else {
        candidatePaths.push(basePath + '.ts', basePath + '.tsx', basePath + '.js', basePath + '.jsx');
        candidatePaths.push(join(basePath, 'index.ts'));
        candidatePaths.push(join(basePath, 'index.tsx'));
        candidatePaths.push(join(basePath, 'index.js'));
        candidatePaths.push(join(basePath, 'index.jsx'));
      }
      // Process the first candidate that exists.
      for (const candidate of candidatePaths) {
        try {
          await stat(candidate);
          await processFile(candidate);
          break; // stop after finding the first valid candidate
        } catch {
          // Try next candidate.
        }
      }
    }
  }
}

async function main() {
  // 1. Get the error log from the user.
  const errorLog = await getMultilineInput("Paste your error log output below:");

    // 2. Extract file paths from the error log using the primary pattern.
    let fileRegex = /^(.*\.(?:ts|tsx|js|jsx)):\d+:\d+/gm;
    const errorFiles = new Set();
    let match;
    while ((match = fileRegex.exec(errorLog)) !== null) {
      errorFiles.add(match[1]);
    }
    // First fallback: if no file paths were found, match lines starting with '> '.
    if (errorFiles.size === 0) {
      fileRegex = /^>\s*(\/?.*\.(?:ts|tsx|js|jsx))\s*$/gm;
      while ((match = fileRegex.exec(errorLog)) !== null) {
        errorFiles.add(match[1]);
      }
    }
    // Second fallback: if still no file paths found, match lines that look like absolute file paths.
    if (errorFiles.size === 0) {
      fileRegex = /^(\/.*\.(?:d\.ts|ts|tsx|js|jsx))$/gm;
      while ((match = fileRegex.exec(errorLog)) !== null) {
        errorFiles.add(match[1]);
      }
    }
  if (errorFiles.size === 0) {
    console.error("No file paths found in the error log.");
    process.exit(1);
  }
  console.log("Found error files:", Array.from(errorFiles));

  // 3. Process each error file and recursively process its imports.
  for (const file of errorFiles) {
    await processFile(file);
  }

  // 4. Create (or overwrite) the output file.
  await writeFile(OUTPUT_FILE_PATH, '');
  const outputStream = createWriteStream(OUTPUT_FILE_PATH, { flags: 'a' });

  // Write the error log.
  outputStream.write(`${SEPARATOR}\nError Log:\n${SEPARATOR}\n${errorLog}\n\n`);

  // 5. Append the project directory structure using the 'tree' command.
  let treeOutput = '';
  try {
    const treeArgs = ['-I', 'node_modules|.git'];
    const treeProc = spawnSync('tree', treeArgs, { encoding: 'utf-8' });
    treeOutput = treeProc.status === 0 ? treeProc.stdout : 'Error executing tree command';
  } catch {
    treeOutput = 'tree command not available';
  }
  outputStream.write(`${SEPARATOR}\nDirectory Structure:\n${SEPARATOR}\n${treeOutput}\n\n`);

  // 6. Append the contents of each processed file (including imports).
  for (const file of processedFiles) {
    let fileContent = '';
    try {
      fileContent = await readFile(file, 'utf-8');
    } catch (err) {
      fileContent = `Error reading file: ${err.message}`;
    }
    outputStream.write(`${SEPARATOR}\nFile: ${relative(process.cwd(), file)}\n${SEPARATOR}\n${fileContent}\n\n`);
  }

  // Finish writing.
  outputStream.end(() => {
    console.log(`Analysis complete. Output saved to '${OUTPUT_FILE_PATH}'.`);
  });
}

main().catch(err => {
  console.error(`An error occurred: ${err.message}`);
  process.exit(1);
});

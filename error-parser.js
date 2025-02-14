import { writeFile, stat, readFile, access } from 'fs/promises';
import { createWriteStream } from 'fs';
import { join, extname, relative, dirname } from 'path';
import { spawnSync } from 'child_process';
import { createInterface } from 'readline';
import clipboardy from 'clipboardy';

const OUTPUT_FILE_PATH = 'error_analysis.txt';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const SEPARATOR = '='.repeat(80);

// ─── Helper: Create an async multiline prompt ─────────────────────────────
function getMultilineInput(promptText) {
  return new Promise((resolve, reject) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log(promptText);
    console.log("Type 'END' on a new line to finish.");
    const lines = [];
    rl.on('line', (input) => {
      if (input.trim().toUpperCase() === 'END') {
        rl.close();
      } else {
        lines.push(input);
      }
    });
    rl.on('close', () => resolve(lines.join('\n')));
    rl.on('SIGINT', () => {
      console.error("\nInput interrupted by user.");
      process.exit(1);
    });
    rl.on('error', reject);
  });
}

// ─── Helper: Ask a single question ───────────────────────────────────────────
function askQuestion(query) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
    rl.on('SIGINT', () => {
      console.error("\nInput interrupted by user.");
      process.exit(1);
    });
  });
}

// ─── Helper: Check if a command is available ────────────────────────────────
function isCommandAvailable(cmd) {
  const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { encoding: 'utf-8' });
  return which.status === 0;
}

// ─── Updated Helper: Extract file paths from a text block using regex ──────
function extractFilePaths(text) {
  const regex = /(?:at\s+)?((?:\/|\.\/|[\w-]+\/)[\w\-.\\/]+(?:\.(?:tsx|jsx|json|html|css|ts|js)))(?::\d+:\d+)?/g;
  const matches = text.matchAll(regex);
  const paths = new Set();
  for (const match of matches) {
    if (match[1]) paths.add(match[1]);
  }
  return Array.from(paths);
}

// ─── New Helper: Extract import paths from file content ─────────────────────
function extractImportPaths(fileContent) {
  const importRegex = /import\s+(?:[\w*\s{},]*\s+from\s+)?['"]([^'"]+)['"]/g;
  const paths = new Set();
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    if (match[1]) {
      paths.add(match[1]);
    }
  }
  return Array.from(paths);
}

// ─── New Helper: Check if a file exists ──────────────────────────────────────
async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// ─── Updated Helper: Resolve an imported module from a given base directory ──
async function resolveModule(importPath, baseDir) {
  let resolvedPath = null;
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    resolvedPath = join(baseDir, importPath);
  } else if (importPath.startsWith('/')) {
    resolvedPath = join(process.cwd(), importPath);
  } else if (importPath.startsWith('@/')) {
    // Assume "@" maps to the "src" folder in the project root.
    resolvedPath = join(process.cwd(), 'src', importPath.slice(2));
  } else {
    // Not a local file we can resolve.
    return null;
  }
  
  // If the file exists as given, return it.
  if (await fileExists(resolvedPath)) {
    return resolvedPath;
  }
  
  // Try appending common extensions if the import doesn't have one.
  const extensions = ['.tsx', '.jsx', '.json', '.html', '.css', '.ts', '.js'];
  if (!extname(resolvedPath)) {
    for (const ext of extensions) {
      const filePathWithExt = resolvedPath + ext;
      if (await fileExists(filePathWithExt)) {
        return filePathWithExt;
      }
    }
  }
  
  // If the path is a directory, try to find an index file.
  try {
    const stats = await stat(resolvedPath);
    if (stats.isDirectory()) {
      for (const ext of extensions) {
        const indexFile = join(resolvedPath, 'index' + ext);
        if (await fileExists(indexFile)) {
          return indexFile;
        }
      }
    }
  } catch (err) {
    // Ignore errors
  }
  
  return null;
}

// ─── Top-Level: Recursive function to process a file and its local imports ─────────────────────────
async function processFile(filePath, processedFiles, outputStream) {
  try {
    const resolvedPath = filePath.startsWith('/') ? filePath : join(process.cwd(), filePath);
    const relativePath = relative(process.cwd(), resolvedPath);
    
    // Skip files that are in "node_modules" or "coverage" directories.
    if (relativePath.startsWith("node_modules") || relativePath.startsWith("coverage")) {
      console.log(`Skipping file in ignored directory: ${relativePath}`);
      return;
    }

    if (processedFiles.has(resolvedPath)) return;
    processedFiles.add(resolvedPath);

    const content = await readFile(resolvedPath, 'utf-8');
    const fileHeader = `\n${SEPARATOR}\nFile: ${relativePath}\n${SEPARATOR}\n\n`;
    outputStream.write(fileHeader + content + '\n');

    // Extract and process local import statements.
    const importPaths = extractImportPaths(content);
    for (const impPath of importPaths) {
      const moduleResolvedPath = await resolveModule(impPath, dirname(resolvedPath));
      if (moduleResolvedPath && !processedFiles.has(moduleResolvedPath)) {
        await processFile(moduleResolvedPath, processedFiles, outputStream);
      }
    }
  } catch (err) {
    console.error(`Cannot process file: ${filePath}`);
    outputStream.write(`Cannot process file: ${filePath}\n`);
  }
}

async function main() {
  try {
    // Overwrite (or create) the output file and open a write stream.
    await writeFile(OUTPUT_FILE_PATH, '');
    const outputStream = createWriteStream(OUTPUT_FILE_PATH, { flags: 'a' });

    // Get the error log / problem description from the user.
    const problemMessage = await getMultilineInput("Enter the problem with the code (paste the error log):");

    // Write the error message section.
    outputStream.write("ERROR MESSAGE:\n");
    outputStream.write(problemMessage + "\n\n");
    outputStream.write("Please analyze the project structure, errors, and code carefully:\n\n");

    // Extract error file paths.
    const errorFiles = extractFilePaths(problemMessage);
    outputStream.write("Found error files:\n" + JSON.stringify(errorFiles, null, 2) + "\n\n");

    // Get and write the directory structure before the extracted code.
    if (!isCommandAvailable('tree')) {
      throw new Error("Error: 'tree' command is not available. Please install it and try again.");
    }
    const treeArgs = ['-I', 'node_modules|coverage'];
    const treeProcess = spawnSync('tree', treeArgs, { encoding: 'utf-8' });
    if (treeProcess.error || treeProcess.status !== 0) {
      throw new Error(`Error executing 'tree' command: ${treeProcess.error ? treeProcess.error.message : `Exited with code ${treeProcess.status}`}`);
    }
    outputStream.write("DIRECTORY STRUCTURE:\n");
    outputStream.write(treeProcess.stdout + "\n");

    // Write a header for the extracted code.
    outputStream.write("EXTRACTED CODE:\n");

    // Use a set to avoid processing the same file twice.
    const processedFiles = new Set();

    // Process each error file (and its imports).
    for (const filePath of errorFiles) {
      await processFile(filePath, processedFiles, outputStream);
    }

    // Close the stream and check file size.
    await new Promise((resolve, reject) => {
      outputStream.end(resolve);
      outputStream.on('error', reject);
    });
    const { size: fileSize } = await stat(OUTPUT_FILE_PATH);
    const mbSize = (fileSize / (1024 * 1024)).toFixed(2);
    if (fileSize > MAX_FILE_SIZE) {
      console.warn(`Warning: The file '${OUTPUT_FILE_PATH}' exceeds 500 MB (${mbSize} MB).`);
      console.warn("Copying such a large amount of data to the clipboard may cause issues.");
      const userChoice = await askQuestion("Do you want to proceed with copying to clipboard? (y/N): ");
      if (userChoice.trim().toLowerCase() !== 'y') {
        console.log("Skipping copying to clipboard.");
        console.log(`All steps completed; '${OUTPUT_FILE_PATH}' has been updated.`);
        process.exit(0);
      } else {
        console.log("Proceeding to copy to clipboard. This may take some time.");
      }
    } else {
      console.log(`The file size of '${OUTPUT_FILE_PATH}' is ${mbSize} MB.`);
    }

    // Read the output file and copy its contents to the clipboard.
    const fileContent = await readFile(OUTPUT_FILE_PATH, 'utf-8');
    try {
      await clipboardy.write(fileContent);
      console.log(`All steps completed; '${OUTPUT_FILE_PATH}' has been updated.`);
      console.log("Its contents have been copied to the clipboard.");
    } catch (err) {
      console.error(`Error copying content to clipboard: ${err.message}`);
      console.log("Proceeding without copying to clipboard.");
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

main();

import { writeFile, stat, readFile, readdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { join, extname, relative } from 'path';
import { spawnSync } from 'child_process';
import { createInterface } from 'readline';
import clipboardy from 'clipboardy';

const OUTPUT_FILE_PATH = 'all_code.txt';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const SEPARATOR = '='.repeat(80);

// Helper: Create an async readline prompt for multiline input
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

// Helper: Ask a single question and resolve with user input
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

// Helper: Check if a command is available using spawnSync
function isCommandAvailable(cmd) {
  const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { encoding: 'utf-8' });
  return which.status === 0;
}

// Helper: Recursively traverse directories asynchronously and write file contents to the output stream
async function traverseDirectory(dir, excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputStream) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    console.error(`Error reading directory '${dir}': ${err.message}`);
    return;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excludeDirs.has(entry.name)) continue;
      await traverseDirectory(fullPath, excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputStream);
    } else if (entry.isFile()) {
      if (excludeFiles.has(entry.name)) continue;
      const ext = extname(entry.name);
      const isAllowed = allowedExtensions.has(ext) || allowedFilenames.has(entry.name);
      if (isAllowed) {
        try {
          const content = await readFile(fullPath, 'utf-8');
          const relativePath = relative('.', fullPath);
          const fileHeader = `\n${SEPARATOR}\nFile: ${relativePath}\n${SEPARATOR}\n\n`;
          outputStream.write(fileHeader + content + '\n');
        } catch (err) {
          console.error(`Error reading file '${fullPath}': ${err.message}`);
        }
      }
    }
  }
}

async function main() {
  try {
    // Overwrite (or create) the output file and create a write stream.
    await writeFile(OUTPUT_FILE_PATH, '');
    const outputStream = createWriteStream(OUTPUT_FILE_PATH, { flags: 'a' });

    // Get user input describing the problem.
    const problemMessage = await getMultilineInput("Enter the problem with the code:");
    outputStream.write(`${problemMessage}\n\nPlease analyze the project structure, errors, and code carefully:\n\n`);

    // Check for the 'tree' command.
    if (!isCommandAvailable('tree')) {
      throw new Error("Error: 'tree' command is not available. Please install it and try again.");
    }

    // Execute the tree command synchronously (its output is small) and write the result.
    const treeArgs = ['-I', '.next|node_modules|venv|.git|coverage'];
    const treeProcess = spawnSync('tree', treeArgs, { encoding: 'utf-8' });
    if (treeProcess.error || treeProcess.status !== 0) {
      throw new Error(`Error executing 'tree' command: ${treeProcess.error ? treeProcess.error.message : `Exited with code ${treeProcess.status}`}`);
    }
    outputStream.write(treeProcess.stdout + '\n');

    // Define filters based on the project structure.
    const excludeDirs = new Set(['node_modules', '.next', 'coverage']);
    const excludeFiles = new Set(['package-lock.json', 'problem.js', OUTPUT_FILE_PATH]);
    const allowedExtensions = new Set(['.md', '.mjs', '.ts', '.json', '.js', '.css', '.tsx', '.prisma']);
    const allowedFilenames = new Set(['Dockerfile', '.env', '.env.local']);

    // Recursively traverse the directory and write file contents.
    await traverseDirectory('.', excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputStream);

    // Close the write stream and wait until it finishes flushing.
    await new Promise((resolve, reject) => {
      outputStream.end(resolve);
      outputStream.on('error', reject);
    });

    // Check file size and warn if too large.
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

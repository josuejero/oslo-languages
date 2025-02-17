import { writeFile, access, stat, readFile } from 'fs/promises';
import { createWriteStream } from 'fs';
import { join, relative, dirname, extname } from 'path';
import { spawnSync } from 'child_process';
import { createInterface } from 'readline';
import clipboardy from 'clipboardy';

const OUTPUT_FILE_PATH = 'DebugDossier.txt';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB
const SEPARATOR = '='.repeat(80);

/**
 * Prompt the user for multiline input until they type "END" on a new line.
 */
function getMultilineInput(promptText) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    console.log(promptText);
    console.log("Type 'END' on a new line to finish.");
    let lines = [];
    rl.on('line', (input) => {
      if (input.trim().toUpperCase() === 'END') {
        rl.close();
      } else {
        lines.push(input);
      }
    });
    rl.on('close', () => resolve(lines.join('\n')));
  });
}

/**
 * Extract file paths from a block of text using a regex.
 */
function extractFilePaths(text) {
  const regex = /(?:at\s+)?((?:\/|\.\/|[\w-]+\/)[\w\-.\\/]+(?:\.(?:tsx|jsx|json|html|css|ts|js)))(?::\d+:\d+)?/g;
  const paths = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[1]) paths.add(match[1]);
  }
  return Array.from(paths);
}

/**
 * Check if a file exists.
 */
async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read and write the content of a file to the output stream.
 */
async function processFile(filePath, processedFiles, outputStream) {
  try {
    const resolvedPath = filePath.startsWith('/')
      ? filePath
      : join(process.cwd(), filePath);
    const relativePath = relative(process.cwd(), resolvedPath);
    if (processedFiles.has(resolvedPath)) return;
    processedFiles.add(resolvedPath);

    if (!(await fileExists(resolvedPath))) {
      outputStream.write(`\n${SEPARATOR}\nFile not found: ${relativePath}\n${SEPARATOR}\n`);
      return;
    }

    const content = await readFile(resolvedPath, 'utf-8');
    const header = `\n${SEPARATOR}\nFile: ${relativePath}\n${SEPARATOR}\n\n`;
    outputStream.write(header + content + '\n');
  } catch (err) {
    outputStream.write(`\nError processing file: ${filePath}\n`);
  }
}

/**
 * Check if a command (like "tree") is available on the system.
 */
function isCommandAvailable(cmd) {
  const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { encoding: 'utf-8' });
  return which.status === 0;
}

async function main() {
  try {
    // 1. Get the error message from the user.
    const errorMessage = await getMultilineInput("Paste the error message below:");

    // 2. Initialize (or overwrite) the output file.
    await writeFile(OUTPUT_FILE_PATH, '');
    const outputStream = createWriteStream(OUTPUT_FILE_PATH, { flags: 'a' });

    // 3. Write a header message at the top.
    outputStream.write(
      "If you would like to see the code from any of the files from the directory structure for more context on the issue, please let me know:\n\n"
    );

    // 4. Write the error message.
    outputStream.write("ERROR MESSAGE:\n");
    outputStream.write(errorMessage + "\n\n");

    // 5. Extract file paths from the error message.
    const errorFiles = extractFilePaths(errorMessage);
    outputStream.write("Found error files:\n" + JSON.stringify(errorFiles, null, 2) + "\n\n");

    // 6. Append the directory structure using the 'tree' command.
    if (!isCommandAvailable('tree')) {
      outputStream.write("Error: 'tree' command is not available. Please install it to view directory structure.\n");
    } else {
      const treeArgs = ['-I', 'node_modules|coverage'];
      const treeProcess = spawnSync('tree', treeArgs, { encoding: 'utf-8' });
      if (treeProcess.status === 0) {
        outputStream.write("DIRECTORY STRUCTURE:\n");
        outputStream.write(treeProcess.stdout + "\n");
      } else {
        outputStream.write("Error executing 'tree' command.\n");
      }
    }

    // 7. Append the code from each file mentioned in the error message.
    outputStream.write("EXTRACTED CODE:\n");
    const processedFiles = new Set();
    for (const filePath of errorFiles) {
      await processFile(filePath, processedFiles, outputStream);
    }

    // 8. Finalize the output.
    outputStream.end();

    // 9. Optionally copy the output file content to the clipboard (if not too large).
    const { size: fileSize } = await stat(OUTPUT_FILE_PATH);
    const mbSize = (fileSize / (1024 * 1024)).toFixed(2);
    console.log(`The output file '${OUTPUT_FILE_PATH}' is ${mbSize} MB.`);
    if (fileSize > MAX_FILE_SIZE) {
      console.warn("Warning: File size exceeds 500 MB. Skipping clipboard copy.");
    } else {
      const fileContent = await readFile(OUTPUT_FILE_PATH, 'utf-8');
      try {
        await clipboardy.write(fileContent);
        console.log("Output file contents have been copied to the clipboard.");
      } catch (err) {
        console.error("Error copying to clipboard:", err.message);
      }
    }

    console.log(`All steps completed. '${OUTPUT_FILE_PATH}' has been updated.`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();

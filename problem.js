// problem.js

import { writeFileSync, appendFileSync, statSync, readFileSync, readdirSync } from 'fs';
import { join, extname, relative } from 'path';
import { spawnSync } from 'child_process';
import { createInterface } from 'readline';
import clipboardy from 'clipboardy';

const outputFilePath = "all_code.txt";
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

console.debug("[DEBUG] Starting script execution.");
console.debug(`[DEBUG] Output file path set to: ${outputFilePath}`);
console.debug(`[DEBUG] Maximum allowed file size: ${MAX_FILE_SIZE} bytes`);

// Initialize the output file
try {
    console.debug("[DEBUG] Initializing output file...");
    writeFileSync(outputFilePath, '');
    console.debug(`[DEBUG] Successfully initialized '${outputFilePath}'.`);
} catch (e) {
    console.error(`[ERROR] Error initializing '${outputFilePath}': ${e.message}`);
    process.exit(1);
}

// Function to get multiline input from the user
function getMultilineInput(prompt) {
    console.debug("[DEBUG] getMultilineInput() called.");
    return new Promise((resolve, reject) => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log(prompt);
        console.log("Type 'END' on a new line to finish.");
        let lines = [];
        rl.on('line', (input) => {
            console.debug(`[DEBUG] Received line: ${input}`);
            if (input.trim().toUpperCase() === 'END') {
                console.debug("[DEBUG] 'END' detected, closing input stream.");
                rl.close();
            } else {
                lines.push(input);
            }
        });
        rl.on('close', () => {
            console.debug("[DEBUG] Input stream closed. Final collected input length:", lines.join('\n').length);
            resolve(lines.join('\n'));
        });
        rl.on('SIGINT', () => {
            console.error("\n[ERROR] Input interrupted by user.");
            process.exit(1);
        });
        rl.on('error', (err) => {
            console.error("[ERROR] Readline encountered an error:", err);
            reject(err);
        });
    });
}

async function main() {
    console.debug("[DEBUG] Entering main() function.");
    // Get the problem message from the user
    let problemMessage;
    try {
        console.debug("[DEBUG] Prompting user for problem message...");
        problemMessage = await getMultilineInput("Enter the problem with the code:");
        console.debug("[DEBUG] User input successfully received. Length:", problemMessage.length);
    } catch (e) {
        console.error(`[ERROR] Error during input: ${e.message}`);
        process.exit(1);
    }

    // Append the problem message and analysis prompt to the output file
    try {
        console.debug("[DEBUG] Appending problem message to output file...");
        appendFileSync(outputFilePath, `${problemMessage}\n\n`);
        appendFileSync(outputFilePath, "Please analyze the project structure, errors, and code carefully:\n\n");
        console.debug("[DEBUG] Successfully appended problem message and prompt.");
    } catch (e) {
        console.error(`[ERROR] Error writing to '${outputFilePath}': ${e.message}`);
        process.exit(1);
    }

    // Check if 'tree' command is available
    console.debug("[DEBUG] Checking if 'tree' command is available...");
    if (!isCommandAvailable('tree')) {
        console.error("[ERROR] 'tree' command is not available. Please install it and try again.");
        process.exit(1);
    }
    console.debug("[DEBUG] 'tree' command is available.");

    // Execute 'tree' command and append output to the file
    try {
        console.debug("[DEBUG] Running 'tree' command...");
        // Updated ignore pattern to include 'coverage'
        const treeArgs = ['-I', '.next|node_modules|venv|.git|coverage'];
        console.debug(`[DEBUG] 'tree' command arguments: ${treeArgs}`);
        const treeProcess = spawnSync('tree', treeArgs, { encoding: 'utf-8' });
        if (treeProcess.error) {
            console.error("[ERROR] Error from spawnSync while executing 'tree':", treeProcess.error);
            throw treeProcess.error;
        }
        if (treeProcess.status !== 0) {
            console.error(`[ERROR] 'tree' command exited with code ${treeProcess.status}`);
            throw new Error(`'tree' command exited with code ${treeProcess.status}`);
        }
        console.debug("[DEBUG] 'tree' command executed successfully.");
        appendFileSync(outputFilePath, treeProcess.stdout + '\n');
        console.debug("[DEBUG] 'tree' output appended to output file.");
    } catch (e) {
        console.error(`[ERROR] Error executing 'tree' command: ${e.message}`);
        process.exit(1);
    }

    // Define exclusions and allowed file types
    console.debug("[DEBUG] Defining exclusions and allowed file types.");
    const excludeDirs = new Set(["node_modules", "coverage", ".next", ".git"]);
    const excludeFiles = new Set(["package-lock.json", "problem.js", outputFilePath]);
    // Allowed extensions: md, ts, tsx, js, mjs, json, css
    const allowedExtensions = new Set([".md", ".ts", ".tsx", ".js", ".mjs", ".json", ".css"]);
    // Allow specific filenames if needed (e.g. Dockerfile)
    const allowedFilenames = new Set(["Dockerfile"]);

    // Traverse the directory and append file contents to the output file
    try {
        console.debug("[DEBUG] Starting directory traversal...");
        await traverseDirectory('.', excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath);
        console.debug("[DEBUG] Directory traversal completed.");
    } catch (e) {
        console.error(`[ERROR] Error during directory traversal: ${e.message}`);
        process.exit(1);
    }

    // Check the size of the output file
    let fileSize;
    try {
        console.debug("[DEBUG] Checking size of output file...");
        const stats = statSync(outputFilePath);
        fileSize = stats.size;
        console.debug(`[DEBUG] Output file size: ${fileSize} bytes.`);
    } catch (e) {
        console.error(`[ERROR] Error getting size of '${outputFilePath}': ${e.message}`);
        process.exit(1);
    }

    if (fileSize > MAX_FILE_SIZE) {
        const mbSize = (fileSize / (1024 * 1024)).toFixed(2);
        console.warn(`[WARN] The file '${outputFilePath}' exceeds 500 MB (${mbSize} MB).`);
        console.warn("[WARN] Copying such a large amount of data to the clipboard may cause issues.");
        const userChoice = await askQuestion("Do you want to proceed with copying to clipboard? (y/N): ");
        console.debug(`[DEBUG] User choice for clipboard copy: ${userChoice}`);
        if (userChoice.trim().toLowerCase() !== 'y') {
            console.log("[DEBUG] User opted to skip clipboard copy.");
            console.log(`All steps completed, '${outputFilePath}' has been updated.`);
            process.exit(0);
        } else {
            console.log("[DEBUG] Proceeding with clipboard copy despite large file size.");
        }
    } else {
        const mbSize = (fileSize / (1024 * 1024)).toFixed(2);
        console.log(`[DEBUG] The file size of '${outputFilePath}' is ${mbSize} MB.`);
    }

    // Read the output file content
    let fileContent;
    try {
        console.debug("[DEBUG] Reading content from output file...");
        fileContent = readFileSync(outputFilePath, 'utf-8');
        console.debug("[DEBUG] Successfully read content from output file.");
    } catch (e) {
        console.error(`[ERROR] Error reading from '${outputFilePath}': ${e.message}`);
        process.exit(1);
    }

    // Copy to clipboard
    try {
        console.debug("[DEBUG] Attempting to copy content to clipboard...");
        await clipboardy.write(fileContent);
        console.debug("[DEBUG] Content successfully copied to clipboard.");
    } catch (e) {
        console.error(`[ERROR] Error copying content to clipboard: ${e.message}`);
        console.log("Proceeding without copying to clipboard.");
    }

    console.log(`All steps completed, '${outputFilePath}' has been updated.`);
    console.log("Its contents have been copied to the clipboard.");
}

// Helper function to check if a command exists
function isCommandAvailable(cmd) {
    console.debug(`[DEBUG] Checking availability of command: ${cmd}`);
    const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { encoding: 'utf-8' });
    console.debug(`[DEBUG] Command check result for '${cmd}':`, which);
    return which.status === 0;
}

// Helper function to traverse directory
async function traverseDirectory(dir, excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath) {
    console.debug(`[DEBUG] Traversing directory: ${dir}`);
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        console.debug(`[DEBUG] Processing entry: ${fullPath}`);
        if (entry.isDirectory()) {
            if (excludeDirs.has(entry.name)) {
                console.debug(`[DEBUG] Skipping excluded directory: ${entry.name}`);
                continue;
            }
            await traverseDirectory(fullPath, excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath);
        } else if (entry.isFile()) {
            if (excludeFiles.has(entry.name)) {
                console.debug(`[DEBUG] Skipping excluded file: ${entry.name}`);
                continue;
            }
            let fileExt = extname(entry.name);
            // Special check for files ending with .d.ts
            if (entry.name.endsWith('.d.ts')) {
                fileExt = '.d.ts';
            }
            if (allowedExtensions.has(fileExt) || allowedFilenames.has(entry.name)) {
                console.debug(`[DEBUG] Reading allowed file: ${fullPath}`);
                try {
                    const content = readFileSync(fullPath, 'utf-8');
                    const relativePath = relative('.', fullPath);
                    const separator = '='.repeat(80);
                    const fileHeader = `\n${separator}\nFile: ${relativePath}\n${separator}\n\n`;
                    appendFileSync(outputFilePath, fileHeader);
                    appendFileSync(outputFilePath, content + '\n');
                    console.debug(`[DEBUG] Successfully appended file: ${relativePath}`);
                } catch (e) {
                    console.error(`[ERROR] Error reading file '${fullPath}': ${e.message}`);
                }
            } else {
                console.debug(`[DEBUG] Skipping file with disallowed extension: ${entry.name}`);
            }
        }
    }
}

// Helper function to ask a question and get user input
function askQuestion(query) {
    console.debug(`[DEBUG] askQuestion() called with query: ${query}`);
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(query, answer => {
            console.debug(`[DEBUG] Received answer: ${answer}`);
            rl.close();
            resolve(answer);
        });
        rl.on('SIGINT', () => {
            console.error("\n[ERROR] Input interrupted by user.");
            process.exit(1);
        });
    });
}

// Run the main function
main().catch(err => {
    console.error("[ERROR] Unhandled error in main():", err);
    process.exit(1);
});

// problem.js

import { writeFileSync, appendFileSync, statSync, readFileSync, readdirSync } from 'fs';
import { join, extname, relative } from 'path';
import { spawnSync } from 'child_process';
import { createInterface } from 'readline';
import clipboardy from 'clipboardy';

const outputFilePath = "all_code.txt";
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

// Initialize the output file
try {
    writeFileSync(outputFilePath, '');
} catch (e) {
    console.error(`Error initializing '${outputFilePath}': ${e.message}`);
    process.exit(1);
}

// Function to get multiline input from the user
function getMultilineInput(prompt) {
    return new Promise((resolve, reject) => {
        const rl = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log(prompt);
        console.log("Type 'END' on a new line to finish.");
        let lines = [];
        rl.on('line', (input) => {
            if (input.trim().toUpperCase() === 'END') {
                rl.close();
            } else {
                lines.push(input);
            }
        });
        rl.on('close', () => {
            resolve(lines.join('\n'));
        });
        rl.on('SIGINT', () => {
            console.error("\nInput interrupted by user.");
            process.exit(1);
        });
        rl.on('error', (err) => {
            reject(err);
        });
    });
}

async function main() {
    // Get the problem message from the user
    let problemMessage;
    try {
        problemMessage = await getMultilineInput("Enter the problem with the code:");
    } catch (e) {
        console.error(`Error during input: ${e.message}`);
        process.exit(1);
    }

    // Append the problem message and analysis prompt to the output file
    try {
        appendFileSync(outputFilePath, `${problemMessage}\n\n`);
        appendFileSync(outputFilePath, "Please analyze the project structure, errors, and code carefully:\n\n");
    } catch (e) {
        console.error(`Error writing to '${outputFilePath}': ${e.message}`);
        process.exit(1);
    }

    // Check if 'tree' command is available
    if (!isCommandAvailable('tree')) {
        console.error("Error: 'tree' command is not available. Please install it and try again.");
        process.exit(1);
    }

    // Execute 'tree' command and append output to the file
    try {
        // Updated ignore pattern to include 'coverage'
        const treeArgs = ['-I', '.next|node_modules|venv|.git|coverage'];
        const treeProcess = spawnSync('tree', treeArgs, { encoding: 'utf-8' });
        if (treeProcess.error) {
            throw treeProcess.error;
        }
        if (treeProcess.status !== 0) {
            throw new Error(`'tree' command exited with code ${treeProcess.status}`);
        }
        appendFileSync(outputFilePath, treeProcess.stdout + '\n');
    } catch (e) {
        console.error(`Error executing 'tree' command: ${e.message}`);
        process.exit(1);
    }

    // Define exclusions and allowed file types
    const excludeDirs = new Set(["node_modules", "coverage", ".next"]);
    const excludeFiles = new Set(["package-lock.json", "problem.js", outputFilePath]);
    // Allowed extensions: md, ts, tsx, js, mjs, json, css, tsbuildinfo
    const allowedExtensions = new Set([".md", ".ts", ".tsx", ".js", ".mjs", ".json", ".css"]);
    // Allow specific filenames if needed (e.g. Dockerfile)
    const allowedFilenames = new Set(["Dockerfile"]);

    // Traverse the directory and append file contents to the output file
    try {
        await traverseDirectory('.', excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath);
    } catch (e) {
        console.error(`Error during directory traversal: ${e.message}`);
        process.exit(1);
    }

    // Check the size of the output file
    let fileSize;
    try {
        const stats = statSync(outputFilePath);
        fileSize = stats.size;
    } catch (e) {
        console.error(`Error getting size of '${outputFilePath}': ${e.message}`);
        process.exit(1);
    }

    if (fileSize > MAX_FILE_SIZE) {
        const mbSize = (fileSize / (1024 * 1024)).toFixed(2);
        console.warn(`Warning: The file '${outputFilePath}' exceeds 500 MB (${mbSize} MB).`);
        console.warn("Copying such a large amount of data to the clipboard may cause issues.");
        const userChoice = await askQuestion("Do you want to proceed with copying to clipboard? (y/N): ");
        if (userChoice.trim().toLowerCase() !== 'y') {
            console.log("Skipping copying to clipboard.");
            console.log(`All steps completed, '${outputFilePath}' has been updated.`);
            process.exit(0);
        } else {
            console.log("Proceeding to copy to clipboard. This may take some time.");
        }
    } else {
        const mbSize = (fileSize / (1024 * 1024)).toFixed(2);
        console.log(`The file size of '${outputFilePath}' is ${mbSize} MB.`);
    }

    // Read the output file content
    let fileContent;
    try {
        fileContent = readFileSync(outputFilePath, 'utf-8');
    } catch (e) {
        console.error(`Error reading from '${outputFilePath}': ${e.message}`);
        process.exit(1);
    }

    // Copy to clipboard
    try {
        await clipboardy.write(fileContent);
    } catch (e) {
        console.error(`Error copying content to clipboard: ${e.message}`);
        console.log("Proceeding without copying to clipboard.");
    }

    console.log(`All steps completed, '${outputFilePath}' has been updated.`);
    console.log("Its contents have been copied to the clipboard.");
}

// Helper function to check if a command exists
function isCommandAvailable(cmd) {
    const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { encoding: 'utf-8' });
    return which.status === 0;
}

// Helper function to traverse directory
async function traverseDirectory(dir, excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            if (excludeDirs.has(entry.name)) continue;
            await traverseDirectory(fullPath, excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath);
        } else if (entry.isFile()) {
            if (excludeFiles.has(entry.name)) continue;
            let fileExt = extname(entry.name);
            // Special check for files ending with .d.ts
            if (entry.name.endsWith('.d.ts')) {
                fileExt = '.d.ts';
            }
            if (allowedExtensions.has(fileExt) || allowedFilenames.has(entry.name)) {
                try {
                    const content = readFileSync(fullPath, 'utf-8');
                    const relativePath = relative('.', fullPath);
                    const separator = '='.repeat(80);
                    const fileHeader = `\n${separator}\nFile: ${relativePath}\n${separator}\n\n`;
                    appendFileSync(outputFilePath, fileHeader);
                    appendFileSync(outputFilePath, content + '\n');
                } catch (e) {
                    console.error(`Error reading file '${fullPath}': ${e.message}`);
                }
            }
        }
    }
}

// Helper function to ask a question and get user input
function askQuestion(query) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(query, answer => {
            rl.close();
            resolve(answer);
        });
        rl.on('SIGINT', () => {
            console.error("\nInput interrupted by user.");
            process.exit(1);
        });
    });
}

// Run the main function
main();

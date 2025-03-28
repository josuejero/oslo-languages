#!/usr/bin/env node
"use strict";

// Import required modules from Node.js and external libraries
import { writeFileSync, appendFileSync, statSync, readFileSync, readdirSync } from 'fs';
import { join, extname, relative } from 'path';
import { spawnSync } from 'child_process';
import { createInterface } from 'readline';
import clipboardy from 'clipboardy';

// Define constants for output file path and maximum file size (500 MB)
const outputFilePath = "all_code.txt";
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

// Initialize the output file by clearing its contents
try {
    writeFileSync(outputFilePath, '');
} catch (e) {
    console.error(`Error initializing '${outputFilePath}': ${e.message}`);
    process.exit(1);
}

/**
 * Get multiline input from the user.
 * Displays a prompt and collects input until the user types 'END'.
 *
 * @param {string} prompt - The prompt message to display.
 * @returns {Promise<string>} A promise that resolves with the concatenated input lines.
 * @throws Will reject if an error occurs during input.
 */
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

/**
 * Prompts the user with a question and returns the input.
 *
 * @param {string} query - The question to ask.
 * @returns {Promise<string>} A promise that resolves with the user's answer.
 */
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
            // Handle SIGINT gracefully by logging the interruption and exiting
            console.error("\nInput interrupted by user.");
            process.exit(1);
        });
    });
}

/**
 * Checks if a command is available in the system's PATH.
 *
 * @param {string} cmd - The command to check.
 * @returns {boolean} True if the command is available, otherwise false.
 */
function isCommandAvailable(cmd) {
    const which = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], { encoding: 'utf-8' });
    return which.status === 0;
}

/**
 * Recursively traverses a directory and appends allowed file contents to the output file.
 *
 * @param {string} dir - The directory to traverse.
 * @param {Set<string>} excludeDirs - Set of directory names to exclude.
 * @param {Set<string>} excludeFiles - Set of file names to exclude.
 * @param {Set<string>} allowedExtensions - Set of allowed file extensions.
 * @param {Set<string>} allowedFilenames - Set of allowed file names.
 * @param {string} outputFilePath - Path to the output file.
 * @returns {Promise<void>}
 */
async function traverseDirectory(dir, excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath) {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (let entry of entries) {
        const fullPath = join(dir, entry.name);

        // Recursively traverse subdirectories, skipping excluded ones
        if (entry.isDirectory()) {
            if (excludeDirs.has(entry.name)) {
                continue;
            }
            await traverseDirectory(fullPath, excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath);
        } else if (entry.isFile()) {
            // Skip files that are in the exclusion list
            if (excludeFiles.has(entry.name)) {
                continue;
            }

            // Check if the file has an allowed extension or is an allowed filename
            const ext = extname(entry.name);
            const isAllowed = allowedExtensions.has(ext) || allowedFilenames.has(entry.name);

            if (isAllowed) {
                try {
                    const content = readFileSync(fullPath, 'utf-8');
                    const relativePath = relative('.', fullPath);

                    const separator = '='.repeat(80);
                    const fileHeader = `\n${separator}\nFile: ${relativePath}\n${separator}\n\n`;

                    // Append file header and content to the output file (ensuring file traceability)
                    appendFileSync(outputFilePath, fileHeader);
                    appendFileSync(outputFilePath, content);
                    appendFileSync(outputFilePath, '\n');
                } catch (e) {
                    console.error(`Error reading file '${fullPath}': ${e.message}`);
                }
            }
        }
    }
}

/**
 * Main execution function for processing user input and file operations.
 * Gathers problem details from the user, collects file structure information, and copies results to the clipboard.
 *
 * @async
 * @throws Will exit the process if a critical error occurs.
 */
async function main() {
    // Get the problem message from the user
    let problemMessage;
    try {
        problemMessage = await getMultilineInput("Enter the problem with the code:");
    } catch (e) {
        console.error(`Error during input: ${e.message}`);
        process.exit(1);
    }

    // Append the problem message and an analysis prompt to the output file
    try {
        appendFileSync(outputFilePath, `${problemMessage}\n\n`);
        appendFileSync(outputFilePath, "Please analyze the project structure, errors, and code carefully:\n\n");
    } catch (e) {
        console.error(`Error writing to '${outputFilePath}': ${e.message}`);
        process.exit(1);
    }

    // Check if 'tree' command is available in the environment
    if (!isCommandAvailable('tree')) {
        console.error("Error: 'tree' command is not available. Please install it and try again.");
        process.exit(1);
    }

    // Execute the 'tree' command to capture the project's directory structure
    try {
        const treeArgs = ['-I', '.next|node_modules|venv|.git'];
        const treeProcess = spawnSync('tree', treeArgs, { encoding: 'utf-8' });

        if (treeProcess.error) {
            throw treeProcess.error;
        }

        if (treeProcess.status !== 0) {
            throw new Error(`'tree' command exited with code ${treeProcess.status}`);
        }

        appendFileSync(outputFilePath, treeProcess.stdout);
        appendFileSync(outputFilePath, '\n');
    } catch (e) {
        console.error(`Error executing 'tree' command: ${e.message}`);
        process.exit(1);
    }

    // Define directories and files to exclude, as well as allowed file types
    const excludeDirs = new Set(["node_modules", "coverage", ".git", ".next"]);
    const excludeFiles = new Set(["package-lock.json", "problem.js", outputFilePath]);
    const allowedExtensions = new Set([".md", ".mjs", ".ts", ".json", ".js", ".css", ".tsx"]);
    const allowedFilenames = new Set(["Dockerfile"]);

    // Traverse the directory structure and append eligible file contents to the output file
    try {
        await traverseDirectory('.', excludeDirs, excludeFiles, allowedExtensions, allowedFilenames, outputFilePath);
    } catch (e) {
        console.error(`Error during directory traversal: ${e.message}`);
        process.exit(1);
    }

    // Check the size of the output file to ensure it is within acceptable limits
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
        // Prompt the user to confirm clipboard copying for large files
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

    // Read the entire content of the output file
    let fileContent;
    try {
        fileContent = readFileSync(outputFilePath, 'utf-8');
    } catch (e) {
        console.error(`Error reading from '${outputFilePath}': ${e.message}`);
        process.exit(1);
    }

    // Copy the output file content to the clipboard for user convenience
    try {
        await clipboardy.write(fileContent);
    } catch (e) {
        console.error(`Error copying content to clipboard: ${e.message}`);
        console.log("Proceeding without copying to clipboard.");
    }

    console.log(`All steps completed, '${outputFilePath}' has been updated.`);
    console.log("Its contents have been copied to the clipboard.");
}

// Execute the main function and handle any unexpected errors
main();

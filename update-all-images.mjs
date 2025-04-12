// update-all-images.mjs
import { spawn } from 'child_process';

console.log('Starting image replacement process...');

const scripts = [
  'node replace-images.mjs',
  'node update-aspect-ratio.mjs',
  'node update-imports.mjs',
  'node update-data-files.mjs'
];

const runScript = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command}`);
    
    const [cmd, ...args] = command.split(' ');
    const process = spawn(cmd, args, { stdio: 'inherit', shell: true });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      reject(err);
    });
  });
};

const runScriptsSequentially = async () => {
  try {
    for (const script of scripts) {
      await runScript(script);
    }
    console.log('All image replacements completed!');
  } catch (error) {
    console.error('Error executing scripts:', error);
  }
};

runScriptsSequentially();
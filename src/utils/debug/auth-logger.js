// src/utils/debug/auth-logger.js
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Log authentication-related events to console and file
 * Useful for debugging authentication issues
 * 
 * @param {string} message - The message to log
 * @param {Object} data - Additional data to log
 * @returns {Promise<void>}
 */
export async function logAuth(message, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message,
    ...data
  };
  
  // Log to console
  console.log(`[AUTH DEBUG] ${message}`, data);
  
  // Log to file
  try {
    // Use process.cwd() instead of __dirname to ensure compatibility
    const logDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logDir, { recursive: true });
    
    const logFile = path.join(logDir, 'auth-debug.log');
    const logText = `${timestamp} - ${message} - ${JSON.stringify(data)}\n`;
    
    await fs.appendFile(logFile, logText);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

// Default export for flexibility
export default { logAuth };
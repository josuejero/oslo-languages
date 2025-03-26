// src/utils/debug/auth-logger.js
import { promises as fs } from 'fs';
import * as path from 'path';


// Log to both console and file for persistence
async function logAuth(message, data = {}) {
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
    const logDir = path.join(process.cwd(), 'logs');
    await fs.mkdir(logDir, { recursive: true });
    
    const logFile = path.join(logDir, 'auth-debug.log');
    const logText = `${timestamp} - ${message} - ${JSON.stringify(data)}\n`;
    
    await fs.appendFile(logFile, logText);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
}

module.exports = { logAuth };
#!/usr/bin/env node
// scripts/fix-admin-password.js
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import readline from 'readline';
import bcrypt from 'bcryptjs';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function checkEnvironmentFiles() {
  console.log('\n=== Admin Password Configuration Check ===\n');
  
  const envFiles = ['.env', '.env.local'];
  const results = {
    '.env': { exists: false, hasEmail: false, hasHash: false },
    '.env.local': { exists: false, hasEmail: false, hasHash: false }
  };
  
  // Check each file
  for (const file of envFiles) {
    try {
      const content = await readFile(file, 'utf8');
      results[file].exists = true;
      
      // Check for admin email and password hash
      results[file].hasEmail = content.includes('ADMIN_EMAIL=');
      results[file].hasHash = content.includes('ADMIN_PASSWORD_HASH=');
      
      if (results[file].hasHash) {
        // Extract hash value
        const match = content.match(/ADMIN_PASSWORD_HASH=([^\n]*)/);
        if (match && match[1]) {
          results[file].hash = match[1];
          results[file].hashLength = match[1].length;
          results[file].isValidFormat = match[1].startsWith('$2a$') || match[1].startsWith('$2b$');
        }
      }
    } catch (error) {
      console.log(`Error reading ${file}: ${error.message}`);
    }
  }
  
  // Report findings
  console.log('Environment files status:');
  
  for (const [file, status] of Object.entries(results)) {
    console.log(`\n${file}:`);
    console.log(`  - Exists: ${status.exists ? 'Yes' : 'No'}`);
    if (status.exists) {
      console.log(`  - Has ADMIN_EMAIL: ${status.hasEmail ? 'Yes' : 'No'}`);
      console.log(`  - Has ADMIN_PASSWORD_HASH: ${status.hasHash ? 'Yes' : 'No'}`);
      if (status.hasHash) {
        console.log(`  - Hash Length: ${status.hashLength}`);
        console.log(`  - Valid BCrypt Format: ${status.isValidFormat ? 'Yes' : 'No'}`);
      }
    }
  }
  
  // Check for conflicts
  if (results['.env'].exists && results['.env.local'].exists) {
    if (results['.env'].hasHash && results['.env.local'].hasHash) {
      if (results['.env'].hash !== results['.env.local'].hash) {
        console.log('\n⚠️ WARNING: Different hash values in .env and .env.local');
        console.log('This can cause authentication issues as .env.local takes precedence.');
      }
    }
  }
  
  return results;
}

async function generateNewHash() {
  const password = await question('\nEnter new admin password: ');
  
  if (!password || password.length < 6) {
    console.log('Password must be at least 6 characters long.');
    return null;
  }
  
  console.log('\nGenerating strong BCrypt hash with 12 rounds...');
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  
  console.log(`\nHash generated: ${hash}`);
  return { password, hash };
}

async function updateEnvFile(file, hash) {
  try {
    let content = '';
    try {
      content = await readFile(file, 'utf8');
    } catch {
      // File doesn't exist, create it
      content = '';
    }
    
    // Check if ADMIN_PASSWORD_HASH already exists
    if (content.includes('ADMIN_PASSWORD_HASH=')) {
      // Replace existing hash
      content = content.replace(/ADMIN_PASSWORD_HASH=([^\n]*)/, `ADMIN_PASSWORD_HASH=${hash}`);
    } else {
      // Add new hash
      content += `\nADMIN_PASSWORD_HASH=${hash}`;
    }
    
    // Add ADMIN_EMAIL if not exists
    if (!content.includes('ADMIN_EMAIL=')) {
      const email = await question('Admin email not found. Enter admin email: ');
      content += `\nADMIN_EMAIL=${email}`;
    }
    
    await writeFile(file, content);
    console.log(`\n✅ Successfully updated ${file} with new hash.`);
    return true;
  } catch (error) {
    console.log(`\n❌ Error updating ${file}: ${error.message}`);
    return false;
  }
}

async function main() {
  try {
    console.log('\n📊 Checking current configuration...');
    const status = await checkEnvironmentFiles();
    
    const hashData = await generateNewHash();
    if (!hashData) {
      console.log('Hash generation failed. Exiting.');
      process.exit(1);
    }
    
    const { hash } = hashData;
    
    // Ask which file to update
    const fileChoice = await question('\nWhich file should be updated?\n1. .env\n2. .env.local\n3. Both\nChoice (1-3): ');
    
    if (fileChoice === '1' || fileChoice === '3') {
      await updateEnvFile('.env', hash);
    }
    
    if (fileChoice === '2' || fileChoice === '3') {
      await updateEnvFile('.env.local', hash);
    }
    
    console.log('\n🔐 Password update complete!');
    console.log('\nTry logging in with these credentials:');
    console.log(`- Email: ${process.env.ADMIN_EMAIL || 'Configured in .env file'}`);
    console.log(`- Password: ${hashData.password}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

main();
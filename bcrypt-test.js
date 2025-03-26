import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testBcrypt() {
  console.log('======= BCRYPT DEBUG TOOL =======');
  
  // Record all environment variables related to auth
  console.log('Environment variables:');
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- ADMIN_EMAIL exists:', !!process.env.ADMIN_EMAIL);
  console.log('- ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);
  
  // Test password
  const testPassword = 'admin123';
  console.log('\nTest password:', testPassword);
  
  // Get stored hash
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  console.log('Stored hash:', storedHash);
  console.log('Stored hash length:', storedHash?.length);
  
  // Generate a new hash to compare with stored hash
  const newHash = await bcrypt.hash(testPassword, 12);
  console.log('\nNew hash for same password:', newHash);
  console.log('New hash length:', newHash.length);
  
  // Try to compare password with stored hash
  console.log('\nBcrypt compare results:');
  try {
    const isMatch = await bcrypt.compare(testPassword, storedHash);
    console.log('- Password matches stored hash:', isMatch);
  } catch (err) {
    console.log('- Error comparing with stored hash:', err.message);
  }
  
  // Test a manually created known good hash
  const knownGoodHash = await bcrypt.hash('test123', 10);
  console.log('\nKnown good test:');
  console.log('- Test hash:', knownGoodHash);
  const knownGoodResult = await bcrypt.compare('test123', knownGoodHash);
  console.log('- Known good test result:', knownGoodResult);
  
  // Check hash format with regex
  const bcryptHashRegex = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
  console.log('\nHash format validation:');
  console.log('- Stored hash format valid:', bcryptHashRegex.test(storedHash));
  console.log('- New hash format valid:', bcryptHashRegex.test(newHash));
  
  // Check for hidden characters or encoding issues
  console.log('\nCharacter analysis of stored hash:');
  for (let i = 0; i < storedHash?.length; i++) {
    const char = storedHash.charAt(i);
    const code = storedHash.charCodeAt(i);
    if (code < 32 || code > 126) {
      console.log(`- Position ${i}: Character '${char}' has code ${code} (unusual)`);
    }
  }
  
  // Try reading the hash directly from .env.local file to check for encoding issues
  console.log('\nReading hash directly from .env.local:');
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const hashMatch = envFile.match(/ADMIN_PASSWORD_HASH=(.+)(\r?\n|$)/);
    if (hashMatch && hashMatch[1]) {
      const rawHash = hashMatch[1];
      console.log('- Raw hash from file:', rawHash);
      console.log('- Raw hash length:', rawHash.length);
      
      // Try comparing with raw hash from file
      const isRawMatch = await bcrypt.compare(testPassword, rawHash);
      console.log('- Password matches raw hash:', isRawMatch);
    } else {
      console.log('- Could not extract hash from .env.local');
    }
  } catch (err) {
    console.log('- Error reading .env.local:', err.message);
  }
  
  console.log('\n======= END DEBUG =======');
}

testBcrypt();
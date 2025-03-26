// test-auth.js
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testAuth() {
  console.log('\n=== AUTH SYSTEM DIAGNOSTICS ===\n');
  
  // Test environment variables
  console.log('Environment Variables:');
  console.log('- NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
  console.log('- ADMIN_EMAIL exists:', !!process.env.ADMIN_EMAIL);
  console.log('- ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!adminEmail || !storedHash) {
    console.error('\nERROR: Missing required environment variables');
    console.log('Please ensure ADMIN_EMAIL and ADMIN_PASSWORD_HASH are set in .env.local');
    return;
  }
  
  console.log('\nHash Analysis:');
  console.log('- Hash length:', storedHash.length);
  console.log('- Hash prefix:', storedHash.substring(0, 7));
  
  // Validate hash format
  const validHashPattern = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;
  const isValidFormat = validHashPattern.test(storedHash);
  console.log('- Valid bcrypt format:', isValidFormat);
  
  if (!isValidFormat) {
    console.error('\nERROR: Invalid hash format');
    console.log('The stored hash does not appear to be a valid bcrypt hash.');
    console.log('Create a new hash using: npx bcrypt-cli');
    return;
  }
  
  // Test with sample password
  const testPassword = 'admin123'; // Replace with your test password
  
  try {
    console.log('\nPassword Test:');
    const startTime = performance.now();
    const isValid = await bcrypt.compare(testPassword, storedHash);
    const endTime = performance.now();
    
    console.log(`- Test password (${testPassword.length} chars) matches stored hash:`, isValid);
    console.log('- Verification took:', (endTime - startTime).toFixed(2), 'ms');
    
    // Generate new hash for reference
    const newHash = await bcrypt.hash(testPassword, 12);
    console.log('- New hash for test password:', newHash);
    
    // Compare with new hash as a sanity check
    const validWithNewHash = await bcrypt.compare(testPassword, newHash);
    console.log('- Test password matches new hash:', validWithNewHash);
    
    if (!isValid && validWithNewHash) {
      console.log('\nDIAGNOSIS: The stored hash does not match the test password,');
      console.log('but bcrypt is working correctly. You may need to update your stored hash.');
      console.log('Recommendation: Create a new password hash with:');
      console.log('npx bcrypt-cli');
    }
  } catch (error) {
    console.error('\nERROR: Bcrypt comparison failed:', error.message);
  }
  
  console.log('\n=== END DIAGNOSTICS ===\n');
}

testAuth();
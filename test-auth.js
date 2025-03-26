// test-auth.js
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testAuth() {
  console.log('\n=== AUTH SYSTEM DIAGNOSTICS ===\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('- NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
  console.log('- ADMIN_EMAIL exists:', !!process.env.ADMIN_EMAIL);
  console.log('- ADMIN_PASSWORD_HASH exists:', !!process.env.ADMIN_PASSWORD_HASH);
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (!adminEmail || !storedHash) {
    console.error('\nERROR: Missing required environment variables');
    return;
  }
  
  // Test password validation
  const testPassword = 'admin123'; // Replace with your actual password
  
  try {
    console.log('\nPassword Test:');
    const isValid = await bcrypt.compare(testPassword, storedHash);
    console.log('- Password match result:', isValid);
    
    // Generate a new hash for comparison
    const newHash = await bcrypt.hash(testPassword, 12);
    console.log('- New hash for reference:', newHash);
  } catch (error) {
    console.error('\nERROR: Bcrypt comparison failed:', error.message);
  }
  
  console.log('\n=== END DIAGNOSTICS ===\n');
}

testAuth();
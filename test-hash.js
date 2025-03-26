
// test-hash.js
import bcrypt from 'bcryptjs';

async function testHash() {
  // The password we want to check
  const password = 'peruano1';
  
  // The hash from .env.local
  const hash = '$2a$12$oYH7QTGc1aqAHU31BhDSfOgO7lPzSpk7XBh/hENB6O9EMfgG3Yhnq';
  
  // Log the exact length and content to check for hidden characters
  console.log('Hash length:', hash.length);
  console.log('Hash characters:', [...hash].map(c => c.charCodeAt(0)));
  
  // Generate a new hash for this password
  const newHash = await bcrypt.hash(password, 12);
  console.log('New hash for same password:', newHash);
  
  // Compare the password with both hashes
  const isMatchOld = await bcrypt.compare(password, hash);
  const isMatchNew = await bcrypt.compare(password, newHash);
  
  console.log('Match with provided hash:', isMatchOld);
  console.log('Match with newly generated hash:', isMatchNew);
}

testHash();
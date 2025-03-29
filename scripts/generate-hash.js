#!/usr/bin/env node
import bcrypt from 'bcryptjs';

async function generateHash() {
  // Use "adminpassword" as the default or take from command line
  const password = process.argv[2] || "adminpassword";
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log('\nNew bcrypt hash for password:');
  console.log(hash);
  console.log('\nUpdate your .env file with this hash');
}

generateHash();

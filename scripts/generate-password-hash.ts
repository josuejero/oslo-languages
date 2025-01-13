// scripts/generate-password-hash.ts
import bcrypt from 'bcryptjs';

async function generateHash() {
    const password = process.argv[2];
    if (!password) {
        console.error('Please provide a password as an argument');
        process.exit(1);
    }

    const hash = await bcrypt.hash(password, 12);
    console.log('\nAdd this hash to your .env file as ADMIN_PASSWORD_HASH:\n');
    console.log(hash);
    console.log('\n');
}

generateHash();
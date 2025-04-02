// src/pages/api/admin/login.js
import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';
import { logger } from '@/utils/logger';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Simple validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    // Check admin credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const plainPassword = process.env.ADMIN_PASSWORD;

    // Check email
    if (email !== adminEmail) {
      logger.info('Login failed: invalid email', { attemptedEmail: email });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    let isValid = false;
    
    // For development, allow plain password comparison
    if (process.env.NODE_ENV === 'development' && plainPassword) {
      isValid = password === plainPassword;
    } else if (passwordHash) {
      // For production, use bcrypt
      isValid = await bcrypt.compare(password, passwordHash);
    }
    
    if (!isValid) {
      logger.info('Login failed: invalid password', { email });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate simple token (timestamp + random string)
    const token = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Set auth cookie
    const cookie = serialize('admin_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    res.setHeader('Set-Cookie', cookie);
    logger.info('Admin login successful', { email });
    
    return res.status(200).json({ success: true });
    
  } catch (error) {
    logger.error('Admin login error', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during login' 
    });
  }
}
// src/utils/__tests__/contact-api-test.ts
import { logger } from '../logger';

interface TestContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function testContactAPI(data: TestContactData) {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_BASE_URL;

    logger.info('Testing contact API with data:', { ...data, message: '[truncated]' });

    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    logger.info('Contact API response:', { 
      status: response.status,
      ok: response.ok,
      result 
    });

    return {
      success: response.ok,
      status: response.status,
      data: result
    };
  } catch (error) {
    logger.error('Contact API test failed:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}

// Example usage:
// await testContactAPI({
//   name: "Test User",
//   email: "test@example.com",
//   subject: "API Test",
//   message: "This is a test message"
// });
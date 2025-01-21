// src/app/api/__tests__/contact.test.ts
import { POST } from '../contact/route';
import { NextRequest } from 'next/server';

describe('Contact API', () => {
  it('validates input correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'invalid-email',
        message: ''
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors).toContain('Name is required');
    expect(data.errors).toContain('Invalid email address');
    expect(data.errors).toContain('Message is required');
  });
});
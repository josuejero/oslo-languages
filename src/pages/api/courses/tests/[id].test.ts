/**
 * @fileoverview Tests for the courses API endpoint.
 *
 * These tests cover typical cases (successful GET, PUT, DELETE),
 * edge cases (missing course, invalid ID), and unauthorized access.
 */

import { createMocks } from 'node-mocks-http';
import handler from '../[id]';
import { NextApiRequest, NextApiResponse } from 'next';

// Mock next-auth's getServerSession to control authentication behavior.
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from 'next-auth';

// Sample course data for testing.
const sampleCourse = {
  id: '1',
  title: 'Test Course',
  language: 'English',
  level: 'Beginner',
  schedule: 'Mondays',
  imageUrl: 'test-image.png',
  startDate: '2023-01-01',
  duration: '10 weeks',
  maxStudents: 20,
  price: 100,
  description: 'A test course description',
};

describe('Courses API Endpoint', () => {
  beforeEach(() => {
    // Reset global courses array before each test.
    globalThis.courses = [ { ...sampleCourse } ];
    jest.resetAllMocks();
  });

  test('GET: returns the course when a valid ID is provided', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: '1' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe('Test Course');
  });

  test('GET: returns 404 when course is not found', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: { id: 'non-existent' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(404);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Course not found');
  });

  test('PUT: returns 401 when user is not authenticated', async () => {
    // Simulate getServerSession returning null (unauthenticated)
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: { id: '1' },
      body: { title: 'Updated Title', language: 'English', level: 'Intermediate' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Unauthorized');
  });

  test('PUT: returns 400 when required fields are missing', async () => {
    // Simulate an authenticated admin user.
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: { id: '1' },
      // Omitting required fields such as language and level.
      body: { title: 'Updated Title' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Missing required fields');
  });

  test('PUT: successfully updates a course when authenticated as admin', async () => {
    // Simulate an authenticated admin user.
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    });

    const updatePayload = {
      title: 'Updated Course Title',
      language: 'English',
      level: 'Intermediate',
    };

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
      query: { id: '1' },
      body: updatePayload,
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.title).toBe(updatePayload.title);
    expect(data.level).toBe(updatePayload.level);
  });

  test('DELETE: returns 401 when user is not authenticated', async () => {
    // Simulate unauthenticated access.
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      query: { id: '1' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(401);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Unauthorized');
  });

  test('DELETE: successfully deletes a course when authenticated as admin', async () => {
    // Simulate an authenticated admin user.
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'DELETE',
      query: { id: '1' },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(204);
    // Verify that the course was removed from the global courses array.
    expect(globalThis.courses.length).toBe(0);
  });
});

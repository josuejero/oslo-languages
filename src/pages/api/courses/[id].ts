import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { Course } from '@/types';
import { logger } from '@/utils/logger';
import { authOptions } from '../auth/[...nextauth]'; // Import authOptions for proper session management

// Initialize the global courses array on globalThis.
// This replaces the previous "declare global { var courses: Course[]; }" to adhere to lint rules.
if (!globalThis.courses) {
  globalThis.courses = [];
}

/**
 * API handler for courses endpoint.
 * Supports GET, PUT, and DELETE methods for a course identified by its ID.
 *
 * @param {NextApiRequest} req - The incoming API request.
 * @param {NextApiResponse} res - The outgoing API response.
 * @returns {Promise<void | NextApiResponse>} The API response.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { id } = req.query;

    // Validate the course ID from the query parameters.
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // Route the request based on its HTTP method.
    switch (req.method) {
      case 'GET':
        return await getCourse(id, res);
      case 'PUT':
        return await updateCourse(id, req, res);
      case 'DELETE':
        return await deleteCourse(id, req, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    // Log any errors that occur during request handling.
    logger.error('Course API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      method: req.method,
      courseId: req.query.id,
    });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Retrieves a course by its ID.
 *
 * @param {string} id - The unique identifier of the course.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<NextApiResponse>} The response containing the course or an error message.
 */
async function getCourse(id: string, res: NextApiResponse) {
  // Find the course in the global courses array.
  const course = globalThis.courses.find((c: Course) => c.id === id);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  return res.status(200).json(course);
}

/**
 * Updates an existing course.
 *
 * @param {string} id - The unique identifier of the course.
 * @param {NextApiRequest} req - The API request containing update data.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<NextApiResponse>} The updated course data or an error message.
 */
async function updateCourse(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Retrieve the session using getServerSession with the required authOptions.
  const session = await getServerSession(req, res, authOptions);

  // Ensure the user is authenticated and authorized (admin check).
  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find the index of the course to update.
  const courseIndex = globalThis.courses.findIndex((c: Course) => c.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Merge existing course data with the new data from the request.
  const updatedCourse: Course = {
    ...globalThis.courses[courseIndex],
    ...req.body,
    id, // Ensure the course ID remains unchanged.
    updatedAt: new Date().toISOString(),
  };

  // Validate that required fields are present.
  if (!updatedCourse.title || !updatedCourse.language || !updatedCourse.level) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Update the course in the global courses array.
  globalThis.courses[courseIndex] = updatedCourse;

  logger.info('Course updated:', { courseId: id });
  return res.status(200).json(updatedCourse);
}

/**
 * Deletes a course by its ID.
 *
 * @param {string} id - The unique identifier of the course.
 * @param {NextApiRequest} req - The API request object.
 * @param {NextApiResponse} res - The API response object.
 * @returns {Promise<NextApiResponse>} The response indicating success or failure.
 */
async function deleteCourse(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Retrieve the session using getServerSession with the required authOptions.
  const session = await getServerSession(req, res, authOptions);

  // Ensure the user is authenticated and authorized (admin check).
  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Find the index of the course to delete.
  const courseIndex = globalThis.courses.findIndex((c: Course) => c.id === id);

  if (courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Remove the course from the global courses array.
  globalThis.courses.splice(courseIndex, 1);

  logger.info('Course deleted:', { courseId: id });
  return res.status(204).end();
}

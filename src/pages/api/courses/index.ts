import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { Course } from '@/types';
import { logger } from '@/utils/logger';
import { authOptions } from '../auth/[...nextauth]'; // Adjust the import path as needed


// In-memory storage for development
// In production, this would be replaced with a database
const courses: Course[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        return await getCourses(req, res);
      case 'POST':
        return await createCourse(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Courses API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      method: req.method
    });
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getCourses(req: NextApiRequest, res: NextApiResponse) {
  const { language, level, active } = req.query;
  
  let filteredCourses = [...courses];

  if (language) {
    filteredCourses = filteredCourses.filter(
      course => course.language.toLowerCase() === language.toString().toLowerCase()
    );
  }

  if (level) {
    filteredCourses = filteredCourses.filter(
      course => course.level === level
    );
  }

  if (active === 'true') {
    const now = new Date();
    filteredCourses = filteredCourses.filter(
      course => new Date(course.startDate) > now
    );
  }

  return res.status(200).json(filteredCourses);
}

async function createCourse(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  // Check if user is authenticated and is admin
  if (!session?.user || session.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const courseData = req.body;

  // Basic validation
  if (!courseData.title || !courseData.language || !courseData.level) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create new course
  const newCourse: Course = {
    id: crypto.randomUUID(),
    ...courseData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  courses.push(newCourse);
  
  logger.info('Course created:', { courseId: newCourse.id });
  return res.status(201).json(newCourse);
}
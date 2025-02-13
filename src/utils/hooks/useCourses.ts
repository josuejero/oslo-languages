import { useState, useCallback } from 'react';
import { Course } from '@/types';
import { logger } from '@/utils/logger';

interface UseCoursesOptions {
  initialCourses?: Course[];
}

interface CourseFilters {
  language?: string;
  level?: string;
  active?: boolean;
}

export function useCourses({ initialCourses = [] }: UseCoursesOptions = {}) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async (filters?: CourseFilters) => {
    setLoading(true);
    setError(null);

    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (filters?.language) params.append('language', filters.language);
      if (filters?.level) params.append('level', filters.level);
      if (filters?.active !== undefined) params.append('active', filters.active.toString());

      const response = await fetch(`/api/courses?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch courses');

      const data = await response.json();
      setCourses(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      logger.error('Failed to fetch courses:', { error: message });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourse = useCallback(async (id: string): Promise<Course | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch course');

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      logger.error('Failed to fetch course:', { error: message, courseId: id });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData: Partial<Course>): Promise<Course | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) throw new Error('Failed to create course');

      const newCourse = await response.json();
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      logger.error('Failed to create course:', { error: message });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (id: string, updates: Partial<Course>): Promise<Course | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update course');

      const updatedCourse = await response.json();
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
      return updatedCourse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      logger.error('Failed to update course:', { error: message, courseId: id });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete course');

      setCourses(prev => prev.filter(course => course.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      logger.error('Failed to delete course:', { error: message, courseId: id });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
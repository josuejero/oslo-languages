// src/components/widgets/__tests__/CourseList.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CourseList from '../CourseList';
import { Course } from '@/types';

describe('CourseList Component', () => {
  const sampleCourses: Course[] = [
    {
      id: '1',
      title: 'Course 1',
      language: 'English',
      level: 'A1',
      schedule: 'Morning',
      imageUrl: 'http://example.com/image1.jpg',
      startDate: new Date().toISOString(),
      duration: '6 weeks',
      maxStudents: 20,
      price: 10000,
      description: 'Sample description 1'
    },
    {
      id: '2',
      title: 'Course 2',
      language: 'Spanish',
      level: 'B1',
      schedule: 'Afternoon',
      imageUrl: 'http://example.com/image2.jpg',
      startDate: new Date().toISOString(),
      duration: '8 weeks',
      maxStudents: 15,
      price: 12000,
      description: 'Sample description 2'
    },
  ];

  it('renders the course titles and images correctly', () => {
    render(<CourseList courses={sampleCourses} title="Test Courses" />);
    // Verify that the course titles are rendered
    expect(screen.getByText('Course 1')).toBeInTheDocument();
    expect(screen.getByText('Course 2')).toBeInTheDocument();
    // Verify that each course link is present
    sampleCourses.forEach(course => {
      expect(screen.getByRole('link', { name: new RegExp(course.title) })).toBeInTheDocument();
    });
  });

  it('renders a message when no courses are available', () => {
    render(<CourseList courses={[]} title="Test Courses" />);
    expect(screen.getByText('No courses available at this time.')).toBeInTheDocument();
  });
});

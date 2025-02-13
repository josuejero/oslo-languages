// __tests__/data.test.ts
import { courses } from '@/data';
import { Course } from '@/types';

describe('Data Generation', () => {
  it('should generate courses with all required properties', () => {
    expect(courses).toBeInstanceOf(Array);
    courses.forEach((course: Course) => {
      expect(course).toHaveProperty('id');
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('imageUrl'); // Verify updated property name
      expect(course).toHaveProperty('schedule');
      expect(course).toHaveProperty('level');
      expect(course).toHaveProperty('language');
      expect(course).toHaveProperty('startDate');
      expect(course).toHaveProperty('duration');
      expect(course).toHaveProperty('maxStudents');
      expect(course).toHaveProperty('price');
      expect(course).toHaveProperty('description');
    });
  });
});

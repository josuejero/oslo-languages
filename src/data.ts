// src/data.ts

import { faker } from '@faker-js/faker';
import { Teacher, Course, Feature, Testimonial, Post, CourseDetail } from './types';

// Define valid image categories
type ImageCategory = 'business' | 'animals' | 'nature' | 'tech'; // Update as per faker's available categories

/**
 * Generates a consistent image URL based on the category and dimensions.
 *
 * @param {ImageCategory} category - The category of the image.
 * @param {number} width - Desired image width.
 * @param {number} height - Desired image height.
 * @returns {string} The generated image URL.
 */
function generateFakerImage(category: ImageCategory, width: number, height: number): string {
  // Using faker.image.url to generate an image URL with the provided dimensions
  return faker.image.url({ width, height });
}

// Generate fake teachers with consistent avatars
export const teachers: Teacher[] = Array.from({ length: 3 }).map(() => ({
  name: faker.person.fullName(),
  role: faker.person.jobTitle(),
  bio: faker.lorem.sentences(2),
  image: faker.image.avatar(), // Generates a consistent avatar URL
  languages: faker.helpers.arrayElements(['Norwegian', 'English', 'Swedish', 'Spanish', 'German'], 3),
}));

// Generate fake courses with business-related images and all required fields
export const courses: Course[] = Array.from({ length: 4 }).map(() => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  imageUrl: generateFakerImage('business', 800, 600), // Renamed from "image" to "imageUrl" to align with Course type
  schedule: faker.helpers.arrayElement(['Morning', 'Afternoon', 'Evening']),
  level: faker.helpers.arrayElement(['A1', 'A2', 'B1', 'B2', 'C1']),
  language: faker.helpers.arrayElement(['Norwegian', 'English', 'Spanish']),
  // Additional required fields for the Course type with placeholder values
  startDate: faker.date.future().toISOString(),
  duration: `${faker.number.int({ min: 4, max: 12 })} weeks`,
  maxStudents: faker.number.int({ min: 10, max: 30 }),
  price: faker.number.int({ min: 7000, max: 15000 }),
  description: faker.lorem.paragraph(),
}));

// Features remain static with icons generated via Faker
export const features: Feature[] = [
  {
    title: "Norwegian Courses",
    description: "From beginners to advanced levels - master Norwegian with our expert teachers",
    icon: faker.image.url({ width: 24, height: 24 }),
  },
  {
    title: "English Courses",
    description: "Business English, conversational English, and exam preparation courses",
    icon: faker.image.url({ width: 24, height: 24 }),
  },
  {
    title: "Spanish Courses", 
    description: "Learn Spanish for travel, work or personal enrichment",
    icon: faker.image.url({ width: 24, height: 24 }),
  },
  {
    title: "Online Learning",
    description: "Flexible online courses to fit your schedule",
    icon: faker.image.url({ width: 24, height: 24 }),
  },
];

// Generate fake testimonials with avatars and course references
export const testimonials: Testimonial[] = Array.from({ length: 3 }).map(() => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  role: faker.person.jobTitle(),
  image: faker.image.avatar(),
  course: faker.helpers.arrayElement(['Norwegian A1', 'Business English', 'Spanish B1']),
  text: faker.lorem.paragraph(),
  rating: faker.number.int({ min: 4, max: 5 })
}));

// Generate a fake post with a relevant image
export const post: Post = {
  title: faker.lorem.words(5),
  coverImage: generateFakerImage('business', 1200, 800),
  date: faker.date.past().toISOString(),
  author: {
    name: faker.person.fullName(),
    image: faker.image.avatar(),
    role: faker.person.jobTitle()
  }
};

// Generate fake course details
export const courseDetails: { [key: string]: CourseDetail } = {
  'norwegian-beginner': {
    title: 'Norwegian for Beginners (A1)',
    level: 'A1',
    duration: '10 weeks',
    schedule: faker.helpers.arrayElement(['Mon & Wed', 'Tue & Thu']) + ' 18:00-20:00',
    price: `NOK ${faker.number.int({ min: 7000, max: 10000 })}`,
    description: faker.lorem.paragraph(),
    image: generateFakerImage('business', 800, 600),
    syllabus: Array.from({ length: 6 }).map(() => faker.lorem.sentence()),
    includes: Array.from({ length: 5 }).map(() => faker.lorem.sentence()),
    upcomingDates: Array.from({ length: 3 }).map(() => {
      const startDate = faker.date.future();
      return faker.date.between({ from: startDate, to: new Date(startDate.getTime() + 8640000000) }).toLocaleDateString();
    })
  },
  // Additional courses can be added as needed
};

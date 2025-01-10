// src/data.ts

import { faker } from '@faker-js/faker';
import { Teacher, Course, Feature, Testimonial, Post, CourseDetail } from './types';

// Define valid image categories
type ImageCategory = 'business' | 'animals' | 'nature' | 'tech'; // Update as per faker's actual categories

// Helper function to generate consistent images by category
function generateFakerImage(category: ImageCategory, width: number, height: number): string {
  return faker.image.url({ width, height }); // Using faker.image.url instead
}

// Generate fake teachers with consistent avatars
export const teachers: Teacher[] = Array.from({ length: 3 }).map(() => ({
  name: faker.person.fullName(),
  role: faker.person.jobTitle(),
  bio: faker.lorem.sentences(2),
  image: faker.image.avatar(), // This generates a consistent avatar URL
  languages: faker.helpers.arrayElements(['Norwegian', 'English', 'Swedish', 'Spanish', 'German'], 3),
}));

// Generate fake courses with business-related images
export const courses: Course[] = Array.from({ length: 4 }).map(() => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  image: generateFakerImage('business', 800, 600),
  schedule: faker.helpers.arrayElement(['Morning', 'Afternoon', 'Evening']),
  level: faker.helpers.arrayElement(['A1', 'A2', 'B1', 'B2', 'C1']),
  language: faker.helpers.arrayElement(['Norwegian', 'English', 'Spanish'])
}));

// Features remain static but icons are now from Faker
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

// Generate fake testimonials with avatars
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
  // Add other courses as needed
};
/**
 * src/data.ts
 * @description Provides data for teachers, courses, features, testimonials, etc.
 *              We have removed Faker-based image references and replaced them
 *              with static paths to local images in /public.
 */

import { faker } from '@faker-js/faker';
import { Teacher, Course, Feature, Testimonial, Post, CourseDetail } from './types';

/** 
 * Arrays of local image paths. You must ensure these files actually exist
 * in your /public folder (e.g., /public/images/teachers/marta.jpg, etc.).
 */
const TEACHER_IMAGES = [
  '/images/teachers/marta.jpg',
  '/images/teachers/james.jpg',
  '/images/teachers/carmen.jpg',
];

const COURSE_IMAGES = [
  '/images/courses/course1.jpg',
  '/images/courses/course2.jpg',
  '/images/courses/course3.jpg',
  '/images/courses/course4.jpg',
];

const FEATURE_ICONS = [
  '/images/icons/norwegian.png',
  '/images/icons/english.png',
  '/images/icons/spanish.png',
  '/images/icons/online.png',
];

const TESTIMONIAL_IMAGES = [
  '/images/testimonials/maria.jpg',
  '/images/testimonials/thomas.jpg',
  '/images/testimonials/sofia.jpg',
];

/**
 * @function getOrFallback
 * A tiny helper that returns array[index] if in range;
 * otherwise returns "/images/placeholder.jpg".
 * 
 * @param paths array of string paths
 * @param index number
 */
function getOrFallback(paths: string[], index: number) {
  return paths[index] ?? '/images/placeholder.jpg';
}

/**
 * @constant teachers
 * Generates an array of Teacher objects. Image references are from TEACHER_IMAGES,
 * but all other fields (name, role, bio, languages) are random from Faker.
 */
export const teachers: Teacher[] = Array.from({ length: 3 }).map((_, i) => ({
  name: faker.person.fullName(),      // random full name
  role: faker.person.jobTitle(),      // random job title
  bio: faker.lorem.sentences(2),      // random short bio
  image: getOrFallback(TEACHER_IMAGES, i),
  languages: faker.helpers.arrayElements(
    ['Norwegian', 'English', 'Swedish', 'Spanish', 'German'],
    3
  ),
}));

/**
 * @constant courses
 * Generates an array of Course objects. Each has a stable local image reference
 * from COURSE_IMAGES, plus random textual data from Faker for placeholders.
 */
export const courses: Course[] = Array.from({ length: 4 }).map((_, i) => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  imageUrl: getOrFallback(COURSE_IMAGES, i),
  schedule: faker.helpers.arrayElement(['Morning', 'Afternoon', 'Evening']),
  level: faker.helpers.arrayElement(['A1', 'A2', 'B1', 'B2', 'C1']),
  language: faker.helpers.arrayElement(['Norwegian', 'English', 'Spanish']),
  startDate: faker.date.future().toISOString(),
  duration: `${faker.number.int({ min: 4, max: 12 })} weeks`,
  maxStudents: faker.number.int({ min: 10, max: 30 }),
  price: faker.number.int({ min: 7000, max: 15000 }),
  description: faker.lorem.paragraph(),
}));

/**
 * @constant features
 * An array of Feature objects referencing local icons, plus static text descriptions.
 * No random generation needed for text or icons here.
 */
export const features: Feature[] = [
  {
    title: 'Norwegian Courses',
    description: 'From beginners to advanced levels - master Norwegian with our expert teachers',
    icon: FEATURE_ICONS[0],
  },
  {
    title: 'English Courses',
    description: 'Business English, conversational English, and exam preparation courses',
    icon: FEATURE_ICONS[1],
  },
  {
    title: 'Spanish Courses',
    description: 'Learn Spanish for travel, work or personal enrichment',
    icon: FEATURE_ICONS[2],
  },
  {
    title: 'Online Learning',
    description: 'Flexible online courses to fit your schedule',
    icon: FEATURE_ICONS[3],
  },
];

/**
 * @constant testimonials
 * Generates an array of Testimonial objects with random text, but stable local images.
 */
export const testimonials: Testimonial[] = Array.from({ length: 3 }).map((_, i) => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  role: faker.person.jobTitle(),
  image: getOrFallback(TESTIMONIAL_IMAGES, i),
  course: faker.helpers.arrayElement(['Norwegian A1', 'Business English', 'Spanish B1']),
  text: faker.lorem.paragraph(),
  rating: faker.number.int({ min: 4, max: 5 }),
}));

/**
 * @constant post
 * A single Post object. We replaced the Faker-based image with a stable local path.
 * The rest of the fields remain Faker-generated for demonstration.
 */
export const post: Post = {
  title: faker.lorem.words(5),
  coverImage: '/images/blog/hello-world.jpg', // local image
  date: faker.date.past().toISOString(),
  author: {
    name: faker.person.fullName(),
    image: '/images/teachers/marta.jpg', // can be any local teacher image
    role: faker.person.jobTitle(),
  },
};

/**
 * @constant courseDetails
 * An example details object keyed by slug. The images are replaced by local paths, and
 * textual content is still randomly generated using Faker.
 */
export const courseDetails: { [key: string]: CourseDetail } = {
  'norwegian-beginner': {
    title: 'Norwegian for Beginners (A1)',
    level: 'A1',
    duration: '10 weeks',
    schedule: faker.helpers.arrayElement(['Mon & Wed', 'Tue & Thu']) + ' 18:00-20:00',
    price: `NOK ${faker.number.int({ min: 7000, max: 10000 })}`,
    description: faker.lorem.paragraph(),
    image: '/images/courses/norwegian-beginner.jpg', // local fallback
    syllabus: Array.from({ length: 6 }).map(() => faker.lorem.sentence()),
    includes: Array.from({ length: 5 }).map(() => faker.lorem.sentence()),
    upcomingDates: Array.from({ length: 3 }).map(() => {
      const startDate = faker.date.future();
      const endDate = new Date(startDate.getTime() + 86_400_000 * 100); // 100 days later
      return faker.date.between({ from: startDate, to: endDate }).toLocaleDateString();
    }),
  },
  // Additional course slugs can go here with local images, random text, etc.
};

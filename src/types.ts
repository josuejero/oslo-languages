// src/types.ts

export interface Teacher {
  name: string;
  role: string;
  bio: string;
  image: string;
  languages: string[];
}

export interface Course {
  schedule: string;
  level: string;
  language: string;
  id: string;
  title: string;
  image: string;
  // Add other course-related fields as needed
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  // Add other testimonial-related fields as needed
}

export interface Post {
  title: string;
  coverImage: string;
  date: string;     // Add this line
  author: Author;
}

export interface CourseDetail {
  title: string;
  level: string;    // Add this line
  duration: string;
  schedule: string;
  price: string;
  description: string;
  image: string;
  syllabus: string[];
  includes: string[];
  upcomingDates: string[];
}

export interface Author {
  name: string;
  image: string;
  role: string;
}
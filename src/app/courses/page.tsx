// src/app/courses/page.tsx
import type { Metadata } from "next";
import CoursesClient from "./client";

export const metadata: Metadata = {
  title: "Language Courses | Oslo Languages",
  description: "Explore our Norwegian, English, and Spanish courses for all proficiency levels.",
};

// This would typically come from a database or CMS
const allCourses = [
  {
    id: 1,
    title: "Norwegian for Beginners",
    level: "A1-A2",
    description: "Perfect for newcomers to Norway. Learn essential vocabulary and basic conversation.",
    language: "Norwegian",
    proficiency: "Beginner",
    slug: "norwegian-beginners",
    imageUrl: "/images/norwegian-beginners.jpg"
  },
  {
    id: 2,
    title: "Intermediate Norwegian",
    level: "B1-B2",
    description: "Expand your vocabulary and improve grammar for more complex conversations.",
    language: "Norwegian",
    proficiency: "Intermediate",
    slug: "norwegian-intermediate",
    imageUrl: "/images/norwegian-intermediate.jpg"
  },
  // Add more courses here
];

export default function Courses() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Our Language Courses</h1>
        <CoursesClient courses={allCourses} />
      </div>
    </section>
  );
}
// src/app/courses/page.tsx
import type { Metadata } from "next";
import CourseCard from "@/components/ui/CourseCard";

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
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Our Language Courses</h1>
          
          {/* Filtering UI would go here - can be implemented with client components */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Filter Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* These would be client components in production */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select className="w-full p-2 border rounded">
                  <option value="">All Languages</option>
                  <option value="Norwegian">Norwegian</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                <select className="w-full p-2 border rounded">
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Course Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCourses.map((course) => (
              <CourseCard 
                key={course.id}
                title={course.title}
                level={course.level}
                description={course.description}
                imageUrl={course.imageUrl}
                slug={course.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
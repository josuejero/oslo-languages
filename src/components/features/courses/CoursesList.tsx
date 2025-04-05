// src/app/courses/client.tsx
"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";

interface Course {
  id: number;
  title: string;
  level: string;
  description: string;
  language: string;
  proficiency: string;
  slug: string;
  imageUrl: string;
}

interface CoursesClientProps {
  courses: Course[];
}

export default function CoursesClient({ courses }: CoursesClientProps) {
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [filters, setFilters] = useState({
    language: "",
    proficiency: ""
  });
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const applyFilters = () => {
    let result = [...courses];
    
    if (filters.language) {
      result = result.filter(course => course.language === filters.language);
    }
    
    if (filters.proficiency) {
      result = result.filter(course => course.proficiency === filters.proficiency);
    }
    
    setFilteredCourses(result);
  };
  
  return (
    <>
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Filter Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              name="language"
              value={filters.language}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Languages</option>
              <option value="Norwegian">Norwegian</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
            <select
              name="proficiency"
              value={filters.proficiency}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard 
              key={course.id}
              title={course.title}
              level={course.level}
              description={course.description}
              imageUrl={course.imageUrl}
              slug={course.slug}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-lg text-gray-600">No courses match your filters. Please try different criteria.</p>
          </div>
        )}
      </div>
    </>
  );
}
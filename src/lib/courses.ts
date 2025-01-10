import { Course } from "@/types";

// src/lib/courses.ts
type CourseFilter = {
  language?: string;
  level?: string;
  schedule?: string;
};

export function filterCourses(courses: Course[], filters: CourseFilter) {
  return courses.filter(course => {
    if (filters.language && course.language !== filters.language) return false;
    if (filters.level && course.level !== filters.level) return false;
    if (filters.schedule && course.schedule !== filters.schedule) return false;
    return true;
  });
}
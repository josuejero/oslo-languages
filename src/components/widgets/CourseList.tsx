// src/components/widgets/CourseList.tsx
import { useRef } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Course } from '@/types';

interface Props {
  courses: Course[];
  title?: string;
}

export default function CourseList({ courses, title = 'Available Courses' }: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  // Handle keyboard navigation within the grid
  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>, index: number) => {
    const items = listRef.current?.querySelectorAll('li');
    if (!items) return;

    const GRID_COLS = 3; // Matches our grid-cols-3 class

    switch (event.key) {
      case 'ArrowRight':
        if (index < items.length - 1) {
          (items[index + 1].querySelector('a') as HTMLElement)?.focus();
        }
        break;
      case 'ArrowLeft':
        if (index > 0) {
          (items[index - 1].querySelector('a') as HTMLElement)?.focus();
        }
        break;
      case 'ArrowDown':
        if (index + GRID_COLS < items.length) {
          (items[index + GRID_COLS].querySelector('a') as HTMLElement)?.focus();
        }
        break;
      case 'ArrowUp':
        if (index - GRID_COLS >= 0) {
          (items[index - GRID_COLS].querySelector('a') as HTMLElement)?.focus();
        }
        break;
      case 'Home':
        (items[0].querySelector('a') as HTMLElement)?.focus();
        break;
      case 'End':
        (items[items.length - 1].querySelector('a') as HTMLElement)?.focus();
        break;
    }
  };

  return (
    <section aria-labelledby="courses-title">
      <h2 id="courses-title" className="sr-only">
        {title}
      </h2>

      <ul
        ref={listRef}
        role="list"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        aria-label={title}
      >
        {courses.map((course, index) => (
          <li
            key={course.id}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="relative"
          >
            <article
              className="h-full bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              aria-labelledby={`course-${course.id}-title`}
            >
              <Link
                href={`/courses/${course.id}`}
                className="block h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              >
                <div className="relative h-48">
                  <OptimizedImage
                    src={course.image}
                    alt=""  // Decorative image, meaning is conveyed through text
                    fill
                    className="object-cover"
                    aspectRatio={16/9}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    background="bg-gray-100"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      id={`course-${course.id}-title`}
                      className="text-xl font-bold text-gray-900"
                    >
                      {course.title}
                    </h3>
                    <span
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded"
                      aria-label={`Level ${course.level}`}
                    >
                      {course.level}
                    </span>
                  </div>

                  <dl className="space-y-1 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <dt className="sr-only">Language</dt>
                      <dd>{course.language}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="sr-only">Schedule</dt>
                      <dd>{course.schedule}</dd>
                    </div>
                  </dl>

                  <div
                    className="mt-4 text-blue-600 font-medium"
                    aria-hidden="true"
                  >
                    Learn more
                    <span className="sr-only">
                      about {course.title} ({course.language} - Level {course.level})
                    </span>
                    <span aria-hidden="true"> →</span>
                  </div>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>

      {courses.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No courses available at this time.
        </p>
      )}
    </section>
  );
}
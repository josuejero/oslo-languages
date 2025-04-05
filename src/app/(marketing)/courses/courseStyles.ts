// src/app/(marketing)/courses/courseStyles.ts
import { CourseColor } from './courseData';

export const colorMap: Record<CourseColor, any> = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-border-default',
    heading: 'text-text-primary',
    hover: 'hover:border-blue-300 hover:shadow-blue-100',
    level: 'bg-blue-100 text-blue-700',
    button: 'bg-action-primary hover:bg-action-primaryHover'
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    border: 'border-border-default',
    heading: 'text-text-primary',
    hover: 'hover:border-indigo-300 hover:shadow-indigo-100',
    level: 'bg-indigo-100 text-indigo-700',
    button: 'bg-indigo-600 hover:bg-indigo-700'
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-50 to-rose-100',
    border: 'border-border-default',
    heading: 'text-text-primary',
    hover: 'hover:border-rose-300 hover:shadow-rose-100',
    level: 'bg-rose-100 text-rose-700',
    button: 'bg-rose-600 hover:bg-rose-700'
  }
};

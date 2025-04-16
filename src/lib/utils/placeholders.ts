// src/lib/utils/placeholders.ts

export const DEFAULT_PLACEHOLDER = '/images/placeholder.png';

export const placeholders = {
  // By image category
  course: '/images/placeholder.png',
  teacher: '/images/placeholder.png',
  blog: '/images/placeholder.png',
  profile: '/images/placeholder.png',
  logo: '/images/placeholder.png',
  
  // Specific placeholders if needed
  hero: '/images/placeholder.png',
  testimonial: '/images/placeholder.png',
  map: '/images/placeholder.png',
};

// Helper function to get appropriate placeholder based on context
export function getPlaceholder(type?: keyof typeof placeholders): string {
  if (type && placeholders[type]) {
    return placeholders[type];
  }
  return DEFAULT_PLACEHOLDER;
}
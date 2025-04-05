export interface Course {
  id: number | string;
  title: string;
  level: string;
  description: string;
  language: string;
  proficiency: string;
  slug: string;
  imageUrl: string;
  schedule?: string;
  icon?: string;
  color?: string;
  accent?: string;
}

export interface CourseFilterOptions {
  language: string;
  proficiency: string;
}

export interface CourseCardProps {
  title: string;
  level: string;
  description: string;
  imageUrl?: string;
  slug: string;
  ctaText?: string;
  ctaPath?: string;
}

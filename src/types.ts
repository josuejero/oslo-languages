// src/types.ts

// ==================== Blog Types ====================
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  readingTime?: string;
  relatedPosts?: number[];
}

export interface BlogPostSummary extends Omit<BlogPost, 'content'> {
  // BlogPostSummary contains all BlogPost properties except content
}

// ==================== Course Types ====================
export interface Course {
  id: number;
  title: string;
  level: string;
  description: string;
  language: string;
  proficiency: string;
  slug: string;
  imageUrl: string;
}

export interface CourseFilterOptions {
  language: string;
  proficiency: string;
}

// ==================== Form Types ====================
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormState {
  isSubmitting: boolean;
  status: {
    type: 'success' | 'error' | null;
    message: string;
  } | null;
  errors: Partial<Record<keyof ContactFormData, string>>;
}

// ==================== API Response Types ====================
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// ==================== Admin Types ====================
export interface AdminPageContent {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

// ==================== Auth Types ====================
export interface AdminUser {
  username: string;
  authenticated: boolean;
}

// ==================== Component Prop Types ====================
// Common
export interface BaseComponentProps {
  className?: string;
}

// Button
export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
}

// Card
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

// Container
export type ContainerSize = 'default' | 'narrow' | 'wide';
export type ContainerPadding = 'none' | 'small' | 'default' | 'large';

export interface ContainerProps extends BaseComponentProps {
  size?: ContainerSize;
  padding?: ContainerPadding;
}

// Course Card Props
export interface CourseCardProps extends BaseComponentProps {
  title: string;
  level: string;
  description: string;
  imageUrl?: string;
  slug: string;
}

// Navigation
export interface NavigationLink {
  href: string;
  label: string;
}

// Layout
export interface LayoutProps {
  children: React.ReactNode;
}
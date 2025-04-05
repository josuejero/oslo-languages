// src/types/index.ts

// Export all types from individual modules
export * from './blog';
export * from './courses';
export * from './contact';

// Common types
export interface BaseComponentProps {
  className?: string;
}

// Container types for consistency
export type ContainerSize = 'default' | 'narrow' | 'wide' | 'full';
export type ContainerPadding = 'none' | 'small' | 'default' | 'large';

export interface ContainerProps {
  children: React.ReactNode;
  size?: ContainerSize;
  padding?: ContainerPadding;
  className?: string;
  as?: React.ElementType;
  id?: string;
}

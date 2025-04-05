export * from './blog';
export * from './courses';

// Common types
export interface BaseComponentProps {
  className?: string;
}

// Container types
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

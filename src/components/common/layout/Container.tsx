// src/components/common/layout/Container.tsx
import React, { ReactNode, ElementType } from 'react';

interface ContainerProps {
  children: ReactNode;
  containerSize?: 'default' | 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'small' | 'default' | 'large';
  className?: string;
  as?: ElementType;
  id?: string;
}

export default function Container({
  children,
  containerSize = 'default',
  padding = 'default',
  className = '',
  as: Component = 'div',
  id,
}: ContainerProps) {
  // Updated size classes to ensure full width
  const sizeClasses: Record<string, string> = {
    default: 'w-full max-w-6xl mx-auto',
    narrow: 'w-full max-w-4xl mx-auto',
    wide: 'w-full max-w-7xl mx-auto',
    full: 'w-full' // Ensures full width with no constraints
  };

  const paddingClasses: Record<string, string> = {
    none: 'px-0 py-0',
    small: 'px-4 py-4',
    default: 'px-4 py-8',
    large: 'px-4 py-12'
  };

  return (
    <Component 
      className={`${sizeClasses[containerSize]} ${paddingClasses[padding]} ${className}`}
      id={id}
    >
      {children}
    </Component>
  );
}
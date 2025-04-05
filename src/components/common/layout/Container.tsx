// Modify src/components/common/layout/Container.tsx
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
  const sizeClasses: Record<string, string> = {
    default: 'max-w-6xl mx-auto',
    narrow: 'max-w-4xl mx-auto',
    wide: 'max-w-7xl mx-auto',
    full: 'w-full'
  };

  const paddingClasses: Record<string, string> = {
    none: '',
    small: 'px-4 py-4',
    default: 'px-4 py-8',
    large: 'px-4 py-12'
  };

  return (
    <Component 
      className={`${className}`}
      id={id}
    >
      {children}
    </Component>
  );
}
// src/components/common/layout/Container.tsx
// Modify the existing Container component to support full-width backgrounds

import React, { ReactNode, ElementType } from 'react';

interface ContainerProps {
  children: ReactNode;
  size?: 'default' | 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'small' | 'default' | 'large';
  className?: string;
  as?: ElementType;
  id?: string;
  fullWidthBackground?: boolean; // New prop for full-width backgrounds
  backgroundColor?: string; // Optional background color
  containerSize?: 'normal' | 'wide' | 'full';
}

export default function Container({
  children,
  size = 'default',
  padding = 'default',
  className = '',
  as: Component = 'div',
  id,
  fullWidthBackground = false,
  backgroundColor
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

  // If fullWidthBackground is true, apply background to outer container
  // and content constraints to inner container
  if (fullWidthBackground) {
    return (
      <Component 
        className={`w-full ${backgroundColor || ''} ${className}`}
        id={id}
      >
        <div className={`${sizeClasses[size]} ${paddingClasses[padding]}`}>
          {children}
        </div>
      </Component>
    );
  }

  // Standard container with constrained width
  return (
    <Component 
      className={`${sizeClasses[size]} ${paddingClasses[padding]} ${className}`}
      id={id}
    >
      {children}
    </Component>
  );
}
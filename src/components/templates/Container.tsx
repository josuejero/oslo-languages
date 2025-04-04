// src/components/templates/Container.tsx
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  size?: 'default' | 'narrow' | 'wide';
  padding?: 'none' | 'small' | 'default' | 'large';
  className?: string;
}

export default function Container({ 
  children, 
  size = 'default', 
  padding = 'default',
  className = '' 
}: ContainerProps) {
  const sizeClasses = {
    default: 'container mx-auto',
    narrow: 'container mx-auto max-w-4xl',
    wide: 'container mx-auto max-w-7xl'
  };

  const paddingClasses = {
    none: '',
    small: 'px-4 py-4',
    default: 'px-4 py-8',
    large: 'px-4 py-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
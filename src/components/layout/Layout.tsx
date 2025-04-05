// src/components/layout/Layout.tsx
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'main';
  containerSize?: 'default' | 'narrow' | 'wide';
  padding?: 'none' | 'small' | 'default' | 'large';
}

const Layout = ({ 
  children, 
  className = '', 
  as: Component = 'div',
  containerSize = 'default',
  padding = 'default'
}: LayoutProps) => {
  const containerClasses = {
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
    <Component 
      className={`${containerClasses[containerSize]} ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Layout;
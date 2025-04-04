// src/components/layout/Layout.tsx
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  containerSize?: 'default' | 'narrow' | 'wide';
  padding?: 'none' | 'small' | 'default' | 'large';
}

export default function Layout({ 
  children, 
  className = '', 
  containerSize = 'default',
  padding = 'default'
}: LayoutProps) {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-grow">
        <div className={`${containerClasses[containerSize]} ${paddingClasses[padding]} ${className}`}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
// src/components/layout/PageContainer.tsx
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  narrowWidth?: boolean;
}

export default function PageContainer({ 
  children, 
  className = '', 
  narrowWidth = false 
}: PageContainerProps) {
  return (
    <div className={`container-page ${narrowWidth ? 'max-w-4xl mx-auto' : ''} ${className}`}>
      {children}
    </div>
  );
}
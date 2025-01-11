// src/components/layout/Section.tsx
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = '' }: SectionProps) {
  return (
    <section className={`container-section ${className}`}>
      {children}
    </section>
  );
}
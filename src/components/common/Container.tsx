import React, { ReactNode, ElementType } from 'react';

type ContainerSize = 'default' | 'narrow' | 'wide' | 'full';
type ContainerPadding = 'none' | 'small' | 'default' | 'large';

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  padding?: ContainerPadding;
  className?: string;
  as?: ElementType;  // Use ElementType instead of keyof JSX.IntrinsicElements
  id?: string;
}

/**
 * A flexible container component that handles consistent layout sizing
 * Used throughout the application for layout standardization
 */
export default function Container({
  children,
  size = 'default',
  padding = 'default',
  className = '',
  as: Component = 'div',
  id
}: ContainerProps) {
  const sizeClasses: Record<ContainerSize, string> = {
    default: 'container mx-auto max-w-6xl w-full',  // Add mx-auto, max-width and w-full
    narrow: 'container mx-auto max-w-4xl w-full',   // Add mx-auto, smaller max-width and w-full
    wide:   'container mx-auto max-w-7xl w-full',   // Add mx-auto, larger max-width and w-full
    full:   'w-full'
  };

  const paddingClasses: Record<ContainerPadding, string> = {
    none:    '',
    small:   'px-4 py-4',
    default: 'px-4 py-8',
    large:   'px-4 py-12'
  };

  const combinedClasses = `${sizeClasses[size]} ${paddingClasses[padding]} ${className}`;

  return (
    <Component className={combinedClasses} id={id}>
      {children}
    </Component>
  );
}

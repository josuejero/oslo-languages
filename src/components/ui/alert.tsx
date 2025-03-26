// src/components/ui/alert.tsx
import React from 'react';
import { CheckCircle, AlertCircle, InfoIcon, AlertTriangle } from 'lucide-react';

// Alert Component
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  className?: string;
  icon?: boolean;
}

export function Alert({ 
  children, 
  variant = 'default', 
  className = '',
  icon = true,
  ...props 
}: AlertProps) {
  // Configuration for different alert variants
  const variantStyles = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  };

  // Icon components for each variant
  const variantIcons = {
    default: InfoIcon,
    destructive: AlertCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: InfoIcon
  };

  const IconComponent = variantIcons[variant];

  return (
    <div
      role="alert"
      className={`p-4 rounded-lg border ${variantStyles[variant]} flex items-start animate-fadeIn ${className}`}
      {...props}
    >
      {icon && (
        <div className="flex-shrink-0 mr-3 mt-0.5">
          <IconComponent className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}

// Alert Title Component
interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function AlertTitle({ 
  children, 
  className = '', 
  ...props 
}: AlertTitleProps) {
  return (
    <h5
      className={`font-medium leading-none tracking-tight mb-2 ${className}`}
      {...props}
    >
      {children}
    </h5>
  );
}

// Alert Description Component
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export function AlertDescription({ 
  children, 
  className = '', 
  ...props 
}: AlertDescriptionProps) {
  return (
    <div
      className={`text-sm leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
// src/components/ui/alert.tsx
import * as React from 'react';

// Alert Component
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  className?: string;
}

export function Alert({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}: AlertProps) {

  const variantStyles = {
    default: 'bg-background-secondary text-text-primary',
    destructive: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-800', // add a style for warning
  };

  return (
    <div
      role="alert"
      className={`p-4 rounded-lg ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
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

// Alert Dialog Components
interface AlertDialogProps {
  open?: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export function AlertDialog({ 
  open = false, 
  children, 
  onClose 
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]">
        {children}
      </div>
    </div>
  );
}

// Alert Dialog Content Component
interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function AlertDialogContent({ 
  children, 
  className = '', 
  ...props 
}: AlertDialogContentProps) {
  return (
    <div
      className={`bg-background-primary p-6 rounded-lg shadow-lg max-w-md w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Alert Dialog Title Component
interface AlertDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

export function AlertDialogTitle({
  children,
  className = '',
  ...props
}: AlertDialogTitleProps) {
  return (
    <h2
      className={`text-lg font-semibold mb-4 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

// Alert Dialog Action Component
interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function AlertDialogAction({
  children,
  className = '',
  ...props
}: AlertDialogActionProps) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 font-medium rounded-md 
        bg-accent-primary text-white hover:bg-accent-primaryHover 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
// src/components/ui/form.tsx
import React, { forwardRef, useId } from 'react';

interface FormFieldProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  labelProps?: React.ComponentPropsWithoutRef<'label'>;
}

interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  error?: string;
  hint?: string;
}

interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, hint, required, children, labelProps, className = '', ...props }, ref) => {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    // Build aria-describedby value from existing ids
    const describedBy = [
      hint ? hintId : null,
      error ? errorId : null,
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={`space-y-1 ${className}`} {...props}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
          {...labelProps}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>

        {hint && (
          <div id={hintId} className="text-sm text-gray-500">
            {hint}
          </div>
        )}

        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return child;

          const childProps = {
            id,
            'aria-describedby': describedBy || undefined,
            'aria-invalid': error ? true : undefined,
            'aria-required': required || undefined,
          };

          return React.cloneElement(child, childProps);
        })}

        {error && (
          <div id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-2 border rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:text-gray-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error, options, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`
          w-full px-4 py-2 border rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:text-gray-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';
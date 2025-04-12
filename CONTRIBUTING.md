# Contributing to Oslo Languages Website

Thank you for your interest in contributing to the Oslo Languages Website project! This document provides guidelines and standards to help you contribute effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Process](#development-process)
3. [Coding Standards](#coding-standards)
4. [Pull Request Process](#pull-request-process)
5. [Issue Reporting](#issue-reporting)
6. [Code Review](#code-review)

## Getting Started

1. **Set up your development environment**
   - Node.js 18+ and npm
   - Git
   - VSCode (recommended) with:
     - ESLint extension
     - Prettier extension
     - Tailwind CSS IntelliSense

2. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/oslo-languages-website.git
   cd oslo-languages-website
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local` and fill in required variables

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Development Process

1. **Branch naming convention**
   - Feature: `feature/descriptive-feature-name`
   - Bug fix: `fix/issue-description`
   - Documentation: `docs/what-is-being-documented`
   - Refactoring: `refactor/what-is-being-refactored`

2. **Commit message format**
   Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
   ```
   <type>[optional scope]: <description>

   [optional body]

   [optional footer(s)]
   ```

   Common types include:
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation changes
   - `style`: Changes that don't affect code functionality (formatting, etc.)
   - `refactor`: Code changes that neither fix bugs nor add features
   - `test`: Adding or updating tests
   - `chore`: Changes to build process or tools

## Coding Standards

### General

- Use TypeScript for all files where possible
- Follow clean code principles: meaningful names, single responsibility, etc.
- Write self-documenting code with clear function and variable names
- Add comments only when necessary to explain "why" rather than "what"
- Keep functions small and focused on a single task
- Maximum line length: 100 characters

### TypeScript Standards

- Always use proper TypeScript types instead of `any`
- Create dedicated interfaces and types in the appropriate files
- Use type inference where it improves readability
- Prefer interfaces for object shapes and types for unions, primitives, etc.
- Use function overloading for complex type scenarios

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Avoid
const user: any = { id: '123', name: 'John' };
```

### React & Next.js Standards

- Use functional components with hooks
- Keep components small and focused
- Extract logic into custom hooks when it becomes complex
- Separate UI components from logic/data-fetching components
- Use the App Router pattern for Next.js pages
- Prefer server components where possible
- Use client components only when necessary (for interactivity, hooks, etc.)
- Properly handle loading and error states

```typescript
// Good
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### Tailwind CSS Standards

- Follow the utility-first workflow
- Create common component patterns for consistency
- Use meaningful class order:
  1. Layout (display, position)
  2. Box model (width, height, margin, padding)
  3. Visual (background, border, shadow)
  4. Typography (font, text)
  5. Misc (cursor, user-select)
- Extract complex utility combinations to components
- Use arbitrary values sparingly
- For dark mode, use the `dark:` variant consistently

```tsx
// Good class ordering
<div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md text-gray-800 hover:shadow-lg">
```

### API Development Standards

- Use RESTful conventions for API endpoints
- Implement proper error handling with appropriate status codes
- Validate all incoming data
- Use TypeScript interfaces to define request and response types
- Handle async operations properly with try/catch
- Return consistent JSON response structures

```typescript
// Good API handler
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = contactSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors.map(e => e.message).join(', ') },
        { status: 422 }
      );
    }
    
    // Process valid data
    // ...
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
```

### Folder Structure and File Naming

- Use kebab-case for file names: `contact-form.tsx`
- Follow the established project structure
- Place components in appropriate directories:
  - `components/common/` for shared UI components
  - `components/features/` for feature-specific components
  - `components/layout/` for layout components
- Group related files together
- Create dedicated types in `types/` directory or colocated with the component when specific

### Testing Standards

- Write tests for critical functionality
- Use Jest for unit testing
- Use React Testing Library for component testing
- Mock external dependencies
- Test edge cases and error handling
- Aim for meaningful coverage rather than percentage

### Accessibility Standards

- Use semantic HTML elements
- Include proper ARIA attributes when necessary
- Maintain keyboard navigation and focus management
- Ensure sufficient color contrast
- Support screen readers with alt text and aria-labels
- Test with assistive technologies

## Pull Request Process

1. Create a PR with a clear title and description
2. Link related issues
3. Ensure all CI checks pass
4. Request reviews from appropriate team members
5. Address review feedback
6. Squash commits when merging

## Issue Reporting

When reporting issues, please include:

1. Expected behavior
2. Actual behavior
3. Steps to reproduce
4. Screenshots if applicable
5. Browser/environment details
6. Any related error messages

## Code Review

During code reviews, focus on:

1. Code correctness and functionality
2. Adherence to coding standards
3. Performance considerations
4. Security implications
5. Maintainability and readability
6. Test coverage

---

By contributing to this project, you agree to follow these guidelines to ensure code quality and project maintainability.
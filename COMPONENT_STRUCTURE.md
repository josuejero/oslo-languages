# Component Structure Documentation

This document outlines the component architecture of the Oslo Languages Website, explaining the structure, patterns, and best practices for components.

## Component Organization

The project uses a structured approach to organizing components:

```
src/
├── components/
│   ├── common/            # Shared UI components
│   │   ├── animation/     # Animation components
│   │   ├── editor/        # Rich text editor components
│   │   ├── layout/        # Layout components 
│   │   └── media/         # Media-related components
│   ├── features/          # Feature-specific components
│   │   ├── admin/         # Admin dashboard components
│   │   ├── blog/          # Blog-related components
│   │   ├── contact/       # Contact form components
│   │   └── courses/       # Course-related components
│   └── layout/            # Global layout components (Header, Footer)
```

## Component Types

### Client Components vs. Server Components

The project uses Next.js 14's App Router, which supports both server and client components.

1. **Server Components** (default)
   - Render on the server
   - Cannot use hooks or browser APIs
   - Cannot use event handlers
   - Should be used for:
     - Fetching data
     - Accessing backend resources
     - Keeping sensitive information on the server
     - Large dependencies that should be kept server-side

2. **Client Components** (marked with `'use client'` directive)
   - Render on the client (browser)
   - Can use React hooks, browser APIs, and event handlers
   - Should be used for:
     - Interactivity and event handling
     - Effects and state
     - Browser-only APIs
     - Custom hooks

### Common Components (`/components/common`)

Reusable UI components that are not tied to specific features:

| Component | Description | Type | Props |
|-----------|-------------|------|-------|
| `Container` | Layout container with consistent spacing | Server | `children`, `size`, `padding`, `className`, `as`, `id` |
| `AnimateOnScroll` | Animates elements as they scroll into view | Client | `children`, `animation`, `delay`, `threshold`, `className` |
| `OptimizedImage` | Enhanced Image component with loading states | Client | `src`, `alt`, `fallbackSrc`, `lowQualityPlaceholder`, `aspectRatio`, `lazyBoundary`, etc. |
| `MarkdownEditor` | Text editor with markdown support | Client | `id`, `value`, `onChange`, `placeholder`, `autofocus`, `className` |

### Feature Components (`/components/features`)

Components specific to particular features:

#### Contact Form (`/components/features/contact`)

| Component | Description | Type | Props/Exports |
|-----------|-------------|------|-------|
| `ContactForm` | Main contact form component | Client | None |
| `useContactForm` | Custom hook for form state & validation | Hook | Returns `formData`, `errors`, `isSubmitting`, `status`, `handleChange`, `handleSubmit` |
| `validation.ts` | Form validation utilities | Utility | `validateForm` function |
| `types.ts` | TypeScript types for contact form | Types | `FormData`, `SubmissionStatus` interfaces |

#### Courses (`/components/features/courses`)

| Component | Description | Type | Props |
|-----------|-------------|------|-------|
| `CourseCard` | Card component for individual courses | Server/Client | `title`, `level`, `description`, `imageUrl`, `slug`, `ctaText`, `ctaPath` |
| `CoursesList` | List of courses with filtering | Client | `courses` |

#### Blog (`/components/features/blog`)

| Component | Description | Type | Props |
|-----------|-------------|------|-------|
| `BlogCard` | Card component for blog post previews | Server | `post` |
| `FeaturedPost` | Enhanced display for featured blog posts | Client | `post` |
| `SearchBar` | Search input for filtering blog posts | Client | None |
| `CategoryFilter` | Dropdown for filtering by category | Client | None |

#### Admin (`/components/features/admin`)

| Component | Description | Type | Props |
|-----------|-------------|------|-------|
| `PageEditor` | Content editor for static pages | Client | `pageId`, `initialContent`, `onSave` |
| `BlogPostEditor` | Editor for blog posts | Client | `post`, `onSave` |
| `Dashboard` | Admin dashboard overview | Client | None |

### Layout Components (`/components/layout`)

Global layout components used across multiple pages:

| Component | Description | Type | Props |
|-----------|-------------|------|-------|
| `Header` | Main navigation header | Server | None |
| `Footer` | Site footer with links and information | Server | None |
| `Navigation` | Navigation menu (desktop and mobile) | Client | None |

## Component Patterns

### Props and TypeScript

All components use TypeScript interfaces for props:

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export default function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false
}: ButtonProps) {
  // Component implementation
}
```

### Component Composition

Components use composition for flexibility:

```tsx
// Layout component that accepts children
export default function Card({ 
  title, 
  children, 
  className = "" 
}: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
      {children}
    </div>
  );
}

// Usage
<Card title="User Profile">
  <UserDetails user={user} />
  <UserActions />
</Card>
```

### Dynamic Component Loading

For performance, heavy components are loaded dynamically:

```tsx
// Dynamically import heavy components
const MarkdownEditor = dynamic(() => import('@/components/common/editor/MarkdownEditor'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: false
});
```

### Form Management

Form components use custom hooks for state management:

```tsx
// In the component
export default function ContactForm() {
  const {
    formData,
    errors,
    isSubmitting,
    status,
    handleChange,
    handleSubmit
  } = useContactForm();
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}

// In the custom hook (useContactForm.tsx)
export function useContactForm() {
  const [formData, setFormData] = useState<FormData>({...});
  const [errors, setErrors] = useState<{}>({});
  // ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation and submission logic
  };
  
  return {
    formData,
    errors,
    isSubmitting,
    status,
    handleChange,
    handleSubmit
  };
}
```

### Responsive Design Pattern

Components use Tailwind's responsive utilities consistently:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>
```

### Error and Loading States

Components explicitly handle loading and error states:

```tsx
export default function DataDisplay() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData()
      .then(result => setData(result))
      .catch(err => setError(err))
      .finally(() => setIsLoading(false));
  }, []);
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error.message} />;
  
  return <div>{/* Render data */}</div>;
}
```

## Styling Approach

The project uses Tailwind CSS with consistent patterns:

### Component-Specific Styling

```tsx
// Base styling for card components
const cardStyles = "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all";

// Variant styling
const cardVariants = {
  primary: "border-l-4 border-blue-500",
  secondary: "border-l-4 border-purple-500",
  outline: "border border-gray-200"
};

<div className={`${cardStyles} ${cardVariants[variant]}`}>
  {/* Card content */}
</div>
```

### Animation Patterns

```tsx
// Using the AnimateOnScroll component
<AnimateOnScroll animation="animate-fadeIn" delay={200}>
  <div className="bg-white p-6 rounded-lg">
    Content that animates in when visible
  </div>
</AnimateOnScroll>
```

## Best Practices

1. **Keep components focused**
   - Each component should do one thing well
   - Break complex components into smaller ones

2. **Use TypeScript properly**
   - Define interfaces for all props
   - Avoid using `any` type
   - Place shared types in dedicated files

3. **Optimize for performance**
   - Use dynamic imports for large components
   - Implement memoization where appropriate
   - Use proper keys in lists

4. **Ensure accessibility**
   - Use semantic HTML
   - Include ARIA attributes when needed
   - Ensure keyboard navigation
   - Test with screen readers

5. **Document complex components**
   - Add JSDoc comments for props and functions
   - Include examples for non-obvious usage

6. **Handle errors gracefully**
   - Always include error boundaries
   - Provide helpful error messages
   - Log errors for debugging

7. **Test components**
   - Write unit tests for logic
   - Add component tests for UI behavior
   - Test edge cases and accessibility
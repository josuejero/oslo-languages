// tailwind.config.ts
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

type AddVariantFn = (variantName: string, selectors: string[]) => void;

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /**
       * Custom color definitions mapped to CSS custom properties.
       * These tokens are used throughout the app for backgrounds, text, borders, and actions.
       */
      colors: {
        background: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
          tertiary: 'var(--color-background-tertiary)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          disabled: 'var(--color-text-disabled)',
          inverse: 'var(--color-text-inverse)',
        },
        border: {
          default: 'var(--color-border-default)',
          hover: 'var(--color-border-hover)',
          focus: 'var(--color-border-focus)',
        },
        action: {
          primary: 'var(--color-action-primary)',
          primaryHover: 'var(--color-action-primaryHover)',
          secondary: 'var(--color-action-secondary)',
          secondaryHover: 'var(--color-action-secondaryHover)',
          disabled: 'var(--color-action-disabled)',
        },
        status: {
          success: 'var(--color-status-success)',
          error: 'var(--color-status-error)',
          warning: 'var(--color-status-warning)',
          successText: 'var(--color-status-successText)',
          errorText: 'var(--color-status-errorText)',
          warningText: 'var(--color-status-warningText)',
        },
        focus: {
          ring: 'var(--color-focus-ring)',
          outline: 'var(--color-focus-outline)',
        },
      },
      /**
       * Extend the theme with additional properties:
       * - spacing: Add a larger spacing value (128) for use in layouts.
       * - screens: Introduce an extra-small (xs) breakpoint for very small devices.
       */
      spacing: {
        '128': '32rem',
      },
      screens: {
        xs: '480px',
      },
      /**
       * Extend ring and outline properties so we can use custom focus rings.
       */
      ringColor: {
        DEFAULT: 'var(--color-focus-ring)',
      },
      // Add this section for ring offset colors
      ringOffsetColor: {
        'background-primary': 'var(--color-background-primary)',
        'background-secondary': 'var(--color-background-secondary)',
        'background-tertiary': 'var(--color-background-tertiary)',
      },
      outline: {
        focus: '2px solid var(--color-focus-outline)',
      },
    },
  },
  plugins: [
    typography,
    /**
     * Adds a "focus-visible" variant so that elements styled with focus-visible classes
     * are only applied when appropriate for keyboard navigation.
     */
    function focusVisiblePlugin({ addVariant }: { addVariant: AddVariantFn }) {
      addVariant('focus-visible', ['&:focus-visible', '.focus-visible &']);
    },
  ],
};

export default config;
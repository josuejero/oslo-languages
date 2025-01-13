// tailwind.config.ts
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
      // Ensure proper contrast for focus rings
      ringColor: {
        DEFAULT: 'var(--color-focus-ring)',
      },
      // Add custom outline styles
      outline: {
        focus: '2px solid var(--color-focus-outline)',
      },
    },
  },
  plugins: [
    typography,
    // Add plugin for better focus-visible support
    function({ addVariant }: { addVariant: (name: string, definition: string[]) => void }) {
      addVariant('focus-visible', ['&:focus-visible', '.focus-visible &']);
    },
  ],
};

export default config;
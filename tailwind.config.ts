/**
 * @file tailwind.config.ts
 * @description Primary Tailwind CSS configuration file.
 *
 * This file defines the custom color palette and plugin settings for the project.
 * All color variables map to CSS custom properties (var(--color-...)), making it easy
 * to adjust or theme the application by changing values in a single place.
 */

import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  // Where Tailwind will look for class names
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /**
       * Custom color definitions mapped to CSS variables.
       * Usage example in a component: className="bg-background-primary text-text-primary"
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
       * Extend ring and outline properties so we can use custom focus rings.
       */
      ringColor: {
        DEFAULT: 'var(--color-focus-ring)', // Default ring color matches our custom property
      },
      outline: {
        focus: '2px solid var(--color-focus-outline)', // Standard 2px outline for focus states
      },
    },
  },
  plugins: [
    // The official typography plugin for improved prose styling
    typography,
    /**
     * Custom plugin for better :focus-visible support across the application.
     * Adds a new variant "focus-visible" for styling elements only when the user
     * is navigating via keyboard (or an accessibility device).
     */
    function ({ addVariant }: { addVariant: (name: string, definition: string[]) => void }) {
      addVariant('focus-visible', ['&:focus-visible', '.focus-visible &']);
    },
  ],
};

export default config;

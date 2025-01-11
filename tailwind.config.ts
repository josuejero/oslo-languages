// tailwind.config.ts
import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'bg-secondary': "var(--background-secondary)",
        'bg-tertiary': "var(--background-tertiary)",
        'text-primary': "var(--text-primary)",
        'text-secondary': "var(--text-secondary)",
        'accent-primary': "var(--accent-primary)",
        'accent-secondary': "var(--accent-secondary)",
      },
    },
  },
  plugins: [typography],
  // Add this section
  layer: {
    components: {
      // Layout containers
      '.container-page': 'container mx-auto px-4 py-12',
      '.container-section': 'container mx-auto px-4 py-8',
      
      // Card styles
      '.card': 'bg-bg-secondary rounded-lg shadow-lg hover:shadow-xl transition-shadow',
      '.card-content': 'p-6',
      
      // Common interactive elements
      '.btn': 'px-4 py-2 rounded-md transition-colors duration-200',
      '.btn-primary': 'bg-accent-primary text-white hover:bg-accent-secondary',
      '.btn-secondary': 'border border-accent-primary text-accent-primary hover:bg-bg-secondary',
    },
  },
};

export default config;
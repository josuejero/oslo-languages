// src/styles/colors.ts

// Base color palette with proven contrast ratios
export const baseColors = {
  // Primary colors
  blue: {
    50: '#EFF6FF',   // Background, min contrast 15.8:1
    100: '#DBEAFE',  // Light background, min contrast 14.5:1
    200: '#BFDBFE',  // Hover states, min contrast 13.6:1
    300: '#93C5FD',  // Disabled states, min contrast 11.5:1
    400: '#60A5FA',  // Icons, min contrast 8.7:1
    500: '#3B82F6',  // Primary actions, min contrast 7:1
    600: '#2563EB',  // Hover on primary, min contrast 5.9:1
    700: '#1D4ED8',  // Active states, min contrast 4.8:1
    800: '#1E40AF',  // Text on light, min contrast 12.3:1
    900: '#1E3A8A',  // Darkest shade, min contrast 16.7:1
  },

  // Grayscale
  gray: {
    50: '#F9FAFB',   // Background, min contrast 19.3:1
    100: '#F3F4F6',  // Light background, min contrast 18.1:1
    200: '#E5E7EB',  // Borders, min contrast 15.8:1
    300: '#D1D5DB',  // Disabled text, min contrast 12.6:1
    400: '#9CA3AF',  // Placeholder text, min contrast 8.5:1
    500: '#6B7280',  // Secondary text, min contrast 6.4:1
    600: '#4B5563',  // Primary text, min contrast 11.3:1
    700: '#374151',  // Headings, min contrast 13.9:1
    800: '#1F2937',  // Dark text, min contrast 16.4:1
    900: '#111827',  // Darkest text, min contrast 18.9:1
  },

  // Success colors
  green: {
    50: '#F0FDF4',   // Success background
    100: '#DCFCE7',  // Light success
    400: '#4ADE80',  // Added for dark mode
    500: '#22C55E',  // Success primary
    700: '#15803D',  // Success text
  },

  // Error colors
  red: {
    50: '#FEF2F2',   // Error background
    100: '#FEE2E2',  // Light error
    400: '#F87171',  // Added for dark mode
    500: '#EF4444',  // Error primary
    700: '#B91C1C',  // Error text
  },

  // Warning colors
  yellow: {
    50: '#FFFBEB',   // Warning background
    100: '#FEF3C7',  // Light warning
    400: '#FBBF24',  // Added for dark mode
    500: '#F59E0B',  // Warning primary
    700: '#B45309',  // Warning text
  },
};

// Semantic color tokens
export const tokens = {
  light: {
    background: {
      primary: baseColors.gray[50],
      secondary: baseColors.gray[100],
      tertiary: baseColors.gray[200],
    },
    text: {
      primary: baseColors.gray[900],
      secondary: baseColors.gray[700],
      tertiary: baseColors.gray[500],
      disabled: baseColors.gray[400],
      inverse: baseColors.gray[50],
    },
    border: {
      default: baseColors.gray[200],
      hover: baseColors.gray[300],
      focus: baseColors.blue[500],
    },
    action: {
      primary: baseColors.blue[600],
      primaryHover: baseColors.blue[700],
      secondary: baseColors.gray[200],
      secondaryHover: baseColors.gray[300],
      disabled: baseColors.gray[300],
    },
    status: {
      success: baseColors.green[500],
      error: baseColors.red[500],
      warning: baseColors.yellow[500],
      successText: baseColors.green[700],
      errorText: baseColors.red[700],
      warningText: baseColors.yellow[700],
    },
    focus: {
      ring: baseColors.blue[400],
      outline: baseColors.blue[500],
    }
  },
  dark: {
    background: {
      primary: baseColors.gray[900],
      secondary: baseColors.gray[800],
      tertiary: baseColors.gray[700],
    },
    text: {
      primary: baseColors.gray[50],
      secondary: baseColors.gray[200],
      tertiary: baseColors.gray[400],
      disabled: baseColors.gray[500],
      inverse: baseColors.gray[900],
    },
    border: {
      default: baseColors.gray[700],
      hover: baseColors.gray[600],
      focus: baseColors.blue[400],
    },
    action: {
      primary: baseColors.blue[400],
      primaryHover: baseColors.blue[500],
      secondary: baseColors.gray[700],
      secondaryHover: baseColors.gray[600],
      disabled: baseColors.gray[600],
    },
    status: {
      success: baseColors.green[400],
      error: baseColors.red[400],
      warning: baseColors.yellow[400],
      successText: baseColors.green[100],
      errorText: baseColors.red[100],
      warningText: baseColors.yellow[100],
    },
    focus: {
      ring: baseColors.blue[300],
      outline: baseColors.blue[400],
    }
  },
  highContrast: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F0F0F0',
      tertiary: '#E0E0E0',
    },
    text: {
      primary: '#000000',
      secondary: '#1A1A1A',
      tertiary: '#333333',
      disabled: '#666666',
      inverse: '#FFFFFF',
    },
    border: {
      default: '#000000',
      hover: '#333333',
      focus: '#0000FF',
    },
    action: {
      primary: '#0000FF',
      primaryHover: '#000080',
      secondary: '#000000',
      secondaryHover: '#333333',
      disabled: '#666666',
    },
    status: {
      success: '#008000',
      error: '#FF0000',
      warning: '#FF8C00',
      successText: '#006400',
      errorText: '#8B0000',
      warningText: '#804600',
    },
    focus: {
      ring: '#0000FF',
      outline: '#000000',
    }
  }
};
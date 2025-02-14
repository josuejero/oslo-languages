// src/types/jest.d.ts


import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveStyle(style: Record<string, any>): R;
      toBeDisabled(): R;
      toHaveTextContent(text: string | RegExp): R;
      toContainHTML(html: string): R;
    }
  }
}
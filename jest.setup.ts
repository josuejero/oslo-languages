// jest.setup.ts
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';


// Set up test environment
(window as any).IS_REACT_ACT_ENVIRONMENT = true;
(global as any).IS_REACT_ACT_ENVIRONMENT = true;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

import '@testing-library/jest-dom/extend-expect';


const mockModule = {
 error: console.error,
 warn: jest.fn(),
};

console.error = mockModule.error;
console.warn = mockModule.warn;

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
 readonly root: Element | null = null;
 readonly rootMargin: string = '';
 readonly thresholds: readonly number[] = [];
 disconnect = jest.fn();
 observe = jest.fn();
 takeRecords = jest.fn();
 unobserve = jest.fn();
 constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock navigation
jest.mock('next/navigation', () => ({
 useRouter() {
   return {
     push: jest.fn(),
     back: jest.fn(),
     forward: jest.fn(),
   };
 },
 usePathname: () => '/',
}));

jest.mock('next-auth', () => {
  return jest.fn();
});

// Mock icons
jest.mock('lucide-react', () => ({
 Twitter: () => null,
 Linkedin: () => null,
 Mail: () => null,
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
 value: {
   getItem: jest.fn(),
   setItem: jest.fn(),
   removeItem: jest.fn(),
 },
});

// Mock window methods
Object.defineProperty(window, 'matchMedia', {
 writable: true,
 value: jest.fn().mockImplementation(query => ({
   matches: false,
   media: query,
   onchange: null,
   addListener: jest.fn(),
   removeListener: jest.fn(),
 })),
});

Object.defineProperty(window, 'focus', {
 value: jest.fn(),
});

Object.defineProperty(HTMLElement.prototype, 'focus', {
 value: jest.fn(),
});



// Mock document head & meta tags
document.head.innerHTML = '<head></head>';

const addMetaTags = () => {
 document.head.innerHTML = `
   <meta property="og:title" content="Original Title">
   <meta property="og:description" content="Original description">
   <link rel="canonical" href="http://localhost/blog/test-post">
 `;
};

(global as any).addMetaTags = addMetaTags;
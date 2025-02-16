// src/components/widgets/__tests__/ContactForm.test.tsx
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from '../ContactForm';

class MockXMLHttpRequest {
  open = jest.fn();
  send = jest.fn();
  setRequestHeader = jest.fn();
  status = 200;
  onload: (() => void) | null = null; 
  onerror: (() => void) | null = null;
  upload = {
    onprogress: null
  };
}

declare global {
  interface Window {
    XMLHttpRequest: typeof MockXMLHttpRequest;
  }
}

beforeEach(() => {
  global.XMLHttpRequest = MockXMLHttpRequest as any;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ContactForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('renders form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('handles form submission error', async () => {
    // Mock fetch to simulate error
    global.fetch = jest.fn().mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to submit the form. Please try again later.' })
      })
    );
  
    render(<ContactForm />);
    
    await act(async () => {
      // Fill form with valid data
      fireEvent.change(screen.getByLabelText(/name/i), { 
        target: { value: 'Test User' } 
      });
      fireEvent.change(screen.getByLabelText(/email/i), { 
        target: { value: 'test@example.com' } 
      });
      fireEvent.change(screen.getByLabelText(/subject/i), { 
        target: { value: 'Test Subject' } 
      });
      fireEvent.change(screen.getByLabelText(/message/i), { 
        target: { value: 'Test message' } 
      });
  
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    });
  
    // Wait for error message to appear - using exact error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Failed to submit the form. Please try again later.'
      );
    });
  });
});
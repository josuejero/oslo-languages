// src/components/widgets/__tests__/ContactForm.test.tsx
import { render, screen, act, fireEvent } from '@testing-library/react';
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

describe('ContactForm', () => {
  it('renders form fields', async () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  }, 30000);

  it('handles form submission error', async () => {
    const mockXHR = new MockXMLHttpRequest();
    mockXHR.send.mockImplementation(function(this: any) {
      this.status = 500;
      this.onerror?.();
    });
    global.XMLHttpRequest = jest.fn(() => mockXHR) as any;

    render(<ContactForm />);
    const submitButton = screen.getByRole('button', { name: /send message/i });

    await act(async () => {
      fireEvent.click(submitButton);
      jest.runAllTimers();
    });

    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });
});
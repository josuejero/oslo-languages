// src/components/widgets/__tests__/ContactForm.test.tsx

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

interface MockXMLHttpRequest {
  open: jest.Mock;
  send: jest.Mock;
  setRequestHeader: jest.Mock;
  upload: { onprogress: jest.Mock };
  readyState: number;
  status: number;
  response: string;
  responseText: string;
  onload: ((this: XMLHttpRequest, ev: Event) => void) | null;
  onerror: ((this: XMLHttpRequest, ev: Event) => void) | null;
}

describe('ContactForm', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('saves form data to localStorage', async () => {
    jest.useFakeTimers();
    render(<ContactForm />);

    // Wait for form to be rendered
    await waitFor(() => {
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    // Get the name input field
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    
    // Type in name field synchronously
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    // Fast forward timers
    jest.advanceTimersByTime(1100);

    // Verify localStorage
    const savedData = JSON.parse(localStorage.getItem('contact_form_draft') || '{}');
    expect(savedData.name).toBe('John Doe');
  });

  it('handles submission error', async () => {
    // Setup XHR mock
    const xhrMockInstance: MockXMLHttpRequest = {
      open: jest.fn(),
      send: jest.fn().mockImplementation(function(this: MockXMLHttpRequest) {
        // Simulate network error
        setTimeout(() => {
          if (this.onerror) {
            this.onerror.call(this as unknown as XMLHttpRequest, new Event('error'));
            setImmediate(() => {
              // Let React process state updates
              act(() => {});
            });
          }
        }, 0);
      }),
      setRequestHeader: jest.fn(),
      upload: { onprogress: jest.fn() },
      readyState: 4,
      status: 500,
      response: '',
      responseText: '',
      onload: null,
      onerror: null
    };

    const xhrMock = jest.fn(() => xhrMockInstance);
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = xhrMock as unknown as typeof XMLHttpRequest;

    // Render form
    render(<ContactForm />);

    // Fill out form
    await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'John Doe');
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'john@example.com');
    await userEvent.type(screen.getByRole('textbox', { name: /subject/i }), 'Test');
    await userEvent.type(screen.getByRole('textbox', { name: /message/i }), 'Test message');

    // Submit form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /send message/i }));
    });

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/failed to submit the form/i)).toBeInTheDocument();
    });

    // Cleanup
    window.XMLHttpRequest = originalXHR;
  });

  it('renders all form fields', () => {
    render(<ContactForm />);

    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /subject/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });
});
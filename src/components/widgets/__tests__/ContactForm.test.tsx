// src/components/widgets/__tests__/ContactForm.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

interface XHRMock {
  open: jest.Mock;
  send: jest.Mock;
  setRequestHeader: jest.Mock;
  readyState: number;
  status: number;
  response: string;
  onload: jest.Mock;
  onerror: jest.Mock;
  upload: {
    onprogress: jest.Mock;
  };
}

// Mock the XMLHttpRequest
const xhrMockClass = (): XHRMock => ({
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  readyState: 4,
  status: 200,
  response: JSON.stringify({ success: true }),
  onload: jest.fn(),
  onerror: jest.fn(),
  upload: {
    onprogress: jest.fn()
  }
});

describe('ContactForm', () => {
  let xhrMock: XHRMock;

  beforeEach(() => {
    // Setup XHR mock
    xhrMock = xhrMockClass();
    (global.XMLHttpRequest as unknown) = jest.fn(() => xhrMock);
    
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it('renders all form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/subject is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/message is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    render(<ContactForm />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test Message');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    // Simulate successful XHR response
    const xhr = xhrMock;
    xhr.status = 200;
    xhr.response = JSON.stringify({ success: true });
    if (xhr.onload) xhr.onload();

    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument();
    });
  });

  it('handles submission error', async () => {
    render(<ContactForm />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test Message');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    // Simulate XHR error
    const xhr = xhrMock;
    xhr.status = 500;
    if (xhr.onerror) xhr.onerror(new Error('Network error'));

    await waitFor(() => {
      expect(screen.getByText(/failed to submit/i)).toBeInTheDocument();
    });
  });

  it('saves form data to localStorage', async () => {
    render(<ContactForm />);
    
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    
    await waitFor(() => {
      const savedData = JSON.parse(localStorage.getItem('contact_form_draft') || '{}');
      expect(savedData.name).toBe('John Doe');
    });
  });

  it('clears form and localStorage on successful submission', async () => {
    render(<ContactForm />);

    // Fill and submit form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test Message');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await userEvent.click(submitButton);

    // Simulate successful submission
    const xhr = xhrMock;
    xhr.status = 200;
    xhr.response = JSON.stringify({ success: true });
    if (xhr.onload) xhr.onload();

    await waitFor(() => {
      expect(localStorage.getItem('contact_form_draft')).toBeNull();
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
    });
  });
});
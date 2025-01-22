// 1. Mocks must be defined before imports
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

// Define an interface for child props
interface ChildProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  'aria-label'?: string;
  required?: boolean;
}

// Mocked Components
jest.mock('@/components/ui/form', () => ({
  FormField: ({
    label,
    children,
    required,
  }: {
    label: string;
    children: React.ReactElement<ChildProps>;
    required?: boolean;
  }) => (
    <div>
      <label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</label>
      {React.cloneElement(children, {
        id: label.toLowerCase().replace(/\s+/g, '-'),
        'aria-label': label,
        required,
      })}
    </div>
  ),
  Input: (props: any) => <input {...props} />,
  Textarea: (props: any) => <textarea {...props} />,
}));

// 3. Mock configurations

// Mock Class for XMLHttpRequest
class MockXMLHttpRequest implements Partial<XMLHttpRequest> {
  open = jest.fn();
  send = jest.fn();
  setRequestHeader = jest.fn();
  get readyState() { return 4; }
  get status() { return 200; }
  upload: XMLHttpRequestUpload = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    onabort: null,
    onerror: null,
    onload: null,
    onloadstart: null,
    onloadend: null,
    onprogress: null,
    ontimeout: null,
  };
  onload: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  onerror: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
}

// Assign the Mock to global.XMLHttpRequest
global.XMLHttpRequest = MockXMLHttpRequest as unknown as typeof XMLHttpRequest;

// LocalStorage Mock
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// Assign the Mock to window.localStorage
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 4. Test suite
describe('ContactForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('saves form data to localStorage', async () => {
    render(<ContactForm />);

    await act(async () => {
      const nameInput = screen.getByLabelText('Name');
      await userEvent.type(nameInput, 'John Doe');
      jest.advanceTimersByTime(1100);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'contact_form_draft',
      expect.stringContaining('John Doe')
    );
  });

  it('handles submission error', async () => {
    const errorMock = new MockXMLHttpRequest();
    errorMock.send.mockImplementation(function(this: any) {
      setTimeout(() => this.onerror?.(), 0);
    });

    (global.XMLHttpRequest as unknown as jest.Mock).mockImplementation(() => errorMock);

    render(<ContactForm />);

    await act(async () => {
      await userEvent.type(screen.getByLabelText('Name'), 'John');
      await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
      await userEvent.type(screen.getByLabelText('Subject'), 'Test');
      await userEvent.type(screen.getByLabelText('Message'), 'Test message');
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      jest.runAllTimers();
    });

    expect(screen.getByText(/failed to submit the form/i)).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<ContactForm />);

    const fields = [
      { label: 'Name', type: 'text' },
      { label: 'Email', type: 'email' },
      { label: 'Subject', type: 'text' },
      { label: 'Message', type: 'textarea' },
      { label: 'Attachments', type: 'file' },
    ];

    fields.forEach(({ label, type }) => {
      const labelElement = screen.getByText(label);
      expect(labelElement).toBeInTheDocument();
      const input = screen.getByLabelText(label);
      expect(input).toBeInTheDocument();
      if (type !== 'textarea') {
        expect(input).toHaveAttribute('type', type);
      }
    });
  });
});

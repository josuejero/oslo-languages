// src/components/courses/__tests__/CourseRegistration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import CourseRegistration from '../CourseRegistration';

const mockProps = {
  courseId: 'course1',
  sessionId: 'session1',
  courseName: 'Norwegian for Beginners',
  sessionDate: 'March 1, 2025',
  onSubmit: jest.fn().mockImplementation(() => Promise.resolve()),
};

// Extend Jest matchers
expect.extend({
  toHaveFormValues(form, expectedValues) {
    const formData = new FormData(form);
    const actualValues = Object.fromEntries(formData);
    const pass = this.equals(actualValues, expectedValues);

    return {
      pass,
      message: () => `Expected form to ${pass ? 'not ' : ''}have values ${this.utils.printExpected(expectedValues)}, got ${this.utils.printReceived(actualValues)}`,
    };
  },
});

describe('CourseRegistration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<CourseRegistration {...mockProps} />);

    // Fill out form
    await act(async () => {
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'invalid-email');
      await user.type(screen.getByLabelText(/Phone Number/i), '12345678');
    });

    // Submit form
    const submitButton = screen.getByRole('button');
    await act(async () => {
      await user.click(submitButton);
    });

    // Wait for validation errors to appear
    await waitFor(() => {
      const emailInput = screen.getByLabelText(/Email/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });

    // Check for proper error message
    await waitFor(() => {
      const errorMessages = screen.getAllByRole('alert');
      const emailError = errorMessages.find(error => 
        error.textContent?.toLowerCase().includes('email') &&
        error.textContent?.toLowerCase().includes('invalid')
      );
      expect(emailError).toBeTruthy();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<CourseRegistration {...mockProps} />);

    await act(async () => {
      // Fill form with valid data
      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/Phone Number/i), '12345678');

      // Submit form
      const submitButton = screen.getByRole('button');
      await user.click(submitButton);
    });

    // Wait for form submission
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '12345678'
        })
      );
    }, { timeout: 1000 });
  });

  it('shows success message after submission', async () => {
    render(<CourseRegistration {...mockProps} isSubmitted={true} />);
    expect(screen.getByText(/Registration Successful/i)).toBeInTheDocument();
  });

  it('shows the waitlist message for waitlist submissions', async () => {
    render(<CourseRegistration {...mockProps} isWaitlist={true} isSubmitted={true} />);
    expect(screen.getByText(/Added to Waitlist/i)).toBeInTheDocument();
  });
});
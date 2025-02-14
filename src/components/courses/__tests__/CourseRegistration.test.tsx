
// src/components/courses/__tests__/CourseRegistration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CourseRegistration from '../CourseRegistration';

const mockProps = {
  courseId: 'course1',
  sessionId: 'session1',
  courseName: 'Norwegian for Beginners',
  sessionDate: 'March 1, 2025',
  onSubmit: jest.fn()
};

describe('CourseRegistration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the registration form', () => {
    render(<CourseRegistration {...mockProps} />);
    
    expect(screen.getByText('Norwegian for Beginners')).toBeInTheDocument();
    expect(screen.getByText(/March 1, 2025/)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    render(<CourseRegistration {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /Complete Registration/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/First name is required/)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<CourseRegistration {...mockProps} />);
    
    const emailInput = screen.getByLabelText(/Email/);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    const submitButton = screen.getByRole('button', { name: /Complete Registration/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<CourseRegistration {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: '12345678' } });
    
    const submitButton = screen.getByRole('button', { name: /Complete Registration/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '12345678',
        languageLevel: '',
        specialRequirements: ''
      });
    });
  });

  it('shows success message after successful submission', async () => {
    render(<CourseRegistration {...mockProps} />);
    
    fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: '12345678' } });
    
    const submitButton = screen.getByRole('button', { name: /Complete Registration/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Registration Successful/)).toBeInTheDocument();
    });
  });

  it('shows error message when submission fails', async () => {
    const failedSubmit = jest.fn().mockRejectedValue(new Error('Registration failed'));
    render(<CourseRegistration {...mockProps} onSubmit={failedSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: '12345678' } });
    
    const submitButton = screen.getByRole('button', { name: /Complete Registration/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Registration failed/)).toBeInTheDocument();
    });
  });

  it('displays different text for waitlist registration', () => {
    render(<CourseRegistration {...mockProps} isWaitlist={true} />);
    
    expect(screen.getByRole('button')).toHaveTextContent('Join Waitlist');
  });

  it('shows correct success message for waitlist registration', async () => {
    render(<CourseRegistration {...mockProps} isWaitlist={true} />);
    
    fireEvent.change(screen.getByLabelText(/First Name/), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone/), { target: { value: '12345678' } });
    
    const submitButton = screen.getByRole('button', { name: /Join Waitlist/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Added to Waitlist/)).toBeInTheDocument();
      expect(screen.getByText(/We'll contact you when a spot becomes available./)).toBeInTheDocument();
    });
  });
});
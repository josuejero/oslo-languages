// src/app/admin/__tests__/login.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoginPage from '../login/page';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Admin Login Page', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null });
    
    render(<LoginPage />);
    
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'admin@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'admin@example.com',
        password: 'password123',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('should handle login failure', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: 'CredentialsSignin' });
    
    render(<LoginPage />);
    
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it('should handle unexpected errors', async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<LoginPage />);
    
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'admin@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    render(<LoginPage />);
    
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(signIn).not.toHaveBeenCalled();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInvalid();
      expect(screen.getByLabelText(/password/i)).toBeInvalid();
    });
  });

  it('should show loading state during login', async () => {
    (signIn as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<LoginPage />);
    
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'admin@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });

  it('should maintain accessibility during state changes', async () => {
    render(<LoginPage />);
    
    // Check initial accessibility
    expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'Admin login');
    
    // Error state accessibility
    (signIn as jest.Mock).mockResolvedValueOnce({ error: 'CredentialsSignin' });
    
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      const errorMessage = screen.getByText(/invalid email or password/i);
      expect(errorMessage).toHaveAttribute('role', 'alert');
    });
    
    // Loading state accessibility
    (signIn as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'admin@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    expect(screen.getByRole('button', { name: /signing in/i })).toHaveAttribute('aria-busy', 'true');
  });

  it('should prevent automated submissions', async () => {
    const mockPreventDefault = jest.fn();
    render(<LoginPage />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form, { preventDefault: mockPreventDefault });
    
    expect(mockPreventDefault).toHaveBeenCalled();
    expect(signIn).not.toHaveBeenCalled();
  });
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { authService } from '../services/mockService';

// Mock the authService
jest.mock('../services/mockService', () => ({
  authService: {
    login: jest.fn()
  }
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderLogin();
    
    // Check if all form elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const mockLoginResponse = {
      token: 'mock-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
    };

    authService.login.mockResolvedValueOnce(mockLoginResponse);

    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for the login service to be called
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('displays error message on failed login', async () => {
    const errorMessage = 'Invalid credentials';
    authService.login.mockRejectedValueOnce(new Error(errorMessage));

    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderLogin();

    // Submit the form without filling in fields
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Check for validation messages
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderLogin();

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Check for email validation message
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });
}); 
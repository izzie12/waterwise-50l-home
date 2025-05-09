import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { authService } from '../services/mockService';

// Mock the authService
jest.mock('../services/mockService', () => ({
  authService: {
    register: jest.fn()
  }
}));

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders registration form correctly', () => {
    renderRegister();
    
    // Check if all form elements are present
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const mockRegisterResponse = {
      token: 'mock-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
    };

    authService.register.mockResolvedValueOnce(mockRegisterResponse);

    renderRegister();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the register service to be called
    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('displays error message on failed registration', async () => {
    const errorMessage = 'Email already exists';
    authService.register.mockRejectedValueOnce(new Error(errorMessage));

    renderRegister();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderRegister();

    // Submit the form without filling in fields
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check for validation messages
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('validates password match', async () => {
    renderRegister();

    // Fill in the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password456' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check for password match validation message
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderRegister();

    // Enter invalid email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Check for email validation message
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });
}); 
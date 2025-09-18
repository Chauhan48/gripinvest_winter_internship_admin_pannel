import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Login from '../Login';
import { login } from '../../services/apiService';

// Mock the API service
jest.mock('../../services/apiService', () => ({
  login: jest.fn(),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockedLogin = login as jest.MockedFunction<typeof login>;

// Wrapper component for testing with required providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={createTheme()}>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
  });

  it('updates email field when user types', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('updates password field when user types', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput).toHaveValue('password123');
  });

  it('calls login API with correct credentials on form submission', async () => {
    mockedLogin.mockResolvedValue({ message: 'Login successful', error: null });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password_hash: 'password123'
      });
    });
  });

  it('navigates to dashboard on successful login', async () => {
    mockedLogin.mockResolvedValue({ message: 'Login successful', error: null });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('displays error message on failed login', async () => {
    mockedLogin.mockResolvedValue({ message: null, error: 'Invalid credentials' });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('closes error alert when close button is clicked', async () => {
    mockedLogin.mockResolvedValue({ message: null, error: 'Invalid credentials' });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
  });

  it('prevents form submission with empty fields', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitButton);

    // Form should not submit with empty fields due to required attribute
    expect(mockedLogin).not.toHaveBeenCalled();
  });

  it('handles form submission via form submit event', async () => {
    mockedLogin.mockResolvedValue({ message: 'Login successful', error: null });

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const form = screen.getByRole('form');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password_hash: 'password123'
      });
    });
  });

  it('shows password field with correct input type', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows email field with correct input type', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('has minimum length requirement for password', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput).toHaveAttribute('minLength', '6');
  });
});

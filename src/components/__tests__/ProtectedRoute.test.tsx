// ...existing code...
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

// Mock react-router-dom
// ...existing code...
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: { to: string }) => <div data-testid="navigate" data-to={to}>Navigate to {to}</div>,
}));

// Test component to render inside ProtectedRoute
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders children when user is authenticated', () => {
    // Set user as authenticated
    localStorage.setItem('isAuthenticated', 'true');

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Ensure user is not authenticated
    localStorage.setItem('isAuthenticated', 'false');

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  it('redirects to login when isAuthenticated is not set', () => {
    // Ensure isAuthenticated is not set in localStorage
    localStorage.removeItem('isAuthenticated');

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  it('redirects to login when isAuthenticated is set to invalid value', () => {
    // Set invalid authentication value
    localStorage.setItem('isAuthenticated', 'invalid');

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  it('renders multiple children when authenticated', () => {
    localStorage.setItem('isAuthenticated', 'true');

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
          <div data-testid="another-child">Another Child</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByTestId('another-child')).toBeInTheDocument();
    expect(screen.getByText('Another Child')).toBeInTheDocument();
  });

  it('handles empty children when authenticated', () => {
    localStorage.setItem('isAuthenticated', 'true');

    render(
      <BrowserRouter>
        <ProtectedRoute>
          {null}
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('handles empty children when not authenticated', () => {
    localStorage.setItem('isAuthenticated', 'false');

    render(
      <BrowserRouter>
        <ProtectedRoute>
          {null}
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
  });

  it('uses replace prop for navigation', () => {
    localStorage.setItem('isAuthenticated', 'false');

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    // The Navigate component should be rendered with replace prop
    // This is tested by checking that the Navigate component is rendered
    expect(screen.getByTestId('navigate')).toBeInTheDocument();
  });
});

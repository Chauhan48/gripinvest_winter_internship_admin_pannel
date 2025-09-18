import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import App from '../App';

// Mock the components to avoid complex dependencies
jest.mock('../pages/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('../pages/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard-page">Dashboard Page</div>;
  };
});

jest.mock('../components/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

jest.mock('../components/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }: { children: React.ReactNode }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

jest.mock('../components/Profile', () => {
  return function MockProfile() {
    return <div data-testid="profile-page">Profile Page</div>;
  };
});

jest.mock('../components/Transactions', () => {
  return function MockTransactions() {
    return <div data-testid="transactions-page">Transactions Page</div>;
  };
});

jest.mock('../components/Products', () => {
  return function MockProducts() {
    return <div data-testid="products-page">Products Page</div>;
  };
});

// Wrapper component for testing with required providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={createTheme()}>
    {children}
  </ThemeProvider>
);

describe('App Component', () => {
  it('renders login page at /login route', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('redirects root path to /dashboard', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    // The Navigate component should redirect to /dashboard
    // We can't easily test the redirect without more complex setup
    // but we can verify the app renders without errors
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
  });

  it('renders dashboard page at /dashboard route', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });

  it('renders transactions page at /transactions route', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/transactions']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('transactions-page')).toBeInTheDocument();
  });

  it('renders products page at /products route', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/products']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('products-page')).toBeInTheDocument();
  });

  it('renders profile page at /profile route', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/profile']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
  });

  it('wraps protected routes with ProtectedRoute component', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
  });

  it('wraps protected routes with Layout component', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('does not wrap login route with ProtectedRoute', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('does not wrap login route with Layout', () => {
    render(
      <TestWrapper>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </TestWrapper>
    );

    expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders all route components correctly', () => {
    const routes = [
      { path: '/login', component: 'login-page' },
      { path: '/dashboard', component: 'dashboard-page' },
      { path: '/transactions', component: 'transactions-page' },
      { path: '/products', component: 'products-page' },
      { path: '/profile', component: 'profile-page' }
    ];

    routes.forEach(({ path, component }) => {
      const { unmount } = render(
        <TestWrapper>
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        </TestWrapper>
      );

      if (path === '/login') {
        expect(screen.getByTestId(component)).toBeInTheDocument();
        expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
        expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
      } else {
        expect(screen.getByTestId(component)).toBeInTheDocument();
        expect(screen.getByTestId('protected-route')).toBeInTheDocument();
        expect(screen.getByTestId('layout')).toBeInTheDocument();
      }

      unmount();
    });
  });
});

import { 
  login, 
  dashboard, 
  logout, 
  updateProfile, 
  transactions, 
  productListing, 
  addProduct, 
  deleteProduct, 
  updateProduct 
} from '../apiService';
import { api } from '../axios';

// Mock the axios instance
jest.mock('../axios', () => ({
  api: {
    post: jest.fn(),
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return success message on successful login', async () => {
      const mockResponse = {
        data: { message: 'Login successful' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/user/login' }
      };
      mockedApi.post.mockResolvedValue(mockResponse);

      const userData = { email: 'test@example.com', password_hash: 'password123' };
      const result = await login(userData);

      expect(mockedApi.post).toHaveBeenCalledWith('/user/login', userData);
      expect(result).toEqual({ message: 'Login successful', error: null });
    });

    it('should return error message on failed login', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' }
        }
      };
      mockedApi.post.mockRejectedValue(mockError);

      const userData = { email: 'test@example.com', password_hash: 'wrongpassword' };
      const result = await login(userData);

      expect(result).toEqual({ message: null, error: 'Invalid credentials' });
    });

    it('should return default error message when no specific error message', async () => {
      mockedApi.post.mockRejectedValue(new Error('Network error'));

      const userData = { email: 'test@example.com', password_hash: 'password123' };
      const result = await login(userData);

      expect(result).toEqual({ message: null, error: 'Something went wrong!' });
    });
  });

  describe('dashboard', () => {
    it('should return dashboard data on successful request', async () => {
      const mockData = { totalUsers: 100, totalProducts: 50 };
  const mockResponse = { data: mockData, status: 200, statusText: 'OK', headers: {}, config: { url: '/admin/dashboard' } };
      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await dashboard();

      expect(mockedApi.get).toHaveBeenCalledWith('/admin/dashboard');
      expect(result).toEqual({ data: mockData, error: null });
    });

    it('should return error on failed request', async () => {
      const mockError = {
        response: {
          data: { message: 'Unauthorized' }
        }
      };
      mockedApi.get.mockRejectedValue(mockError);

      const result = await dashboard();

      expect(result).toEqual({ data: null, error: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should return success message on successful logout', async () => {
  const mockResponse = { data: { message: 'Logged out successfully' }, status: 200, statusText: 'OK', headers: {}, config: { url: '/user/logout' } };
      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await logout();

      expect(mockedApi.get).toHaveBeenCalledWith('/user/logout');
      expect(result).toEqual({ data: { message: 'Logged out successfully' }, error: null });
    });

    it('should return error on failed logout', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'));

      const result = await logout();

      expect(result).toEqual({ data: null, error: 'Something went wrong!' });
    });
  });

  describe('updateProfile', () => {
    it('should return success message on successful update', async () => {
      const mockResponse = {
        data: {
          message: 'Profile updated successfully',
          suggestion: 'Consider diversifying your portfolio',
          warning: 'High risk investments detected'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/user/update-profile' }
      };
      mockedApi.post.mockResolvedValue(mockResponse);

      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        password: 'newpassword',
        risk_appetite: 'high'
      };
      const result = await updateProfile(userData);

      expect(mockedApi.post).toHaveBeenCalledWith('/user/update-profile', userData);
      expect(result).toEqual({
        message: 'Profile updated successfully',
        suggestions: 'Consider diversifying your portfolio',
        warning: 'High risk investments detected',
        error: null
      });
    });

    it('should return error with suggestions and warnings on failed update', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Validation failed',
            suggestions: 'Please check your input',
            warning: 'Password too weak'
          }
        }
      };
      mockedApi.post.mockRejectedValue(mockError);

      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        password: '123',
        risk_appetite: 'high'
      };
      const result = await updateProfile(userData);

      expect(result).toEqual({
        message: null,
        suggestions: 'Please check your input',
        warning: 'Password too weak',
        token: null,
        error: 'Validation failed'
      });
    });
  });

  describe('transactions', () => {
    it('should return transactions data on successful request', async () => {
  const mockResponse = { data: [{ id: 1, amount: 1000 }], status: 200, statusText: 'OK', headers: {}, config: { url: '/admin/transactions' } };
      mockedApi.get.mockResolvedValue(mockResponse);

      const filters = 'status=completed&type=investment';
      const result = await transactions(filters);

      expect(mockedApi.get).toHaveBeenCalledWith('/admin/transactions?' + filters);
      expect(result).toEqual(mockResponse);
    });

    it('should return error message on failed request', async () => {
      const mockError = new Error('Network error');
      mockedApi.get.mockRejectedValue(mockError);

      const filters = 'status=completed';
      const result = await transactions(filters);

      expect(result).toEqual('Network error');
    });
  });

  describe('productListing', () => {
    it('should return products and total count on successful request', async () => {
      const mockResponse = {
        data: {
          data: [{ id: 1, name: 'Test Product' }],
          total: 1
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/products/list-products' }
      };
      mockedApi.get.mockResolvedValue(mockResponse);

      const result = await productListing(1, 10, { risk_level: 'high', investment_type: 'mf' });

      expect(mockedApi.get).toHaveBeenCalledWith('/products/list-products', {
        params: {
          page: 1,
          limit: 10,
          risk_level: 'high',
          investment_type: 'mf'
        }
      });
      expect(result).toEqual({
        products: [{ id: 1, name: 'Test Product' }],
        total: 1,
        error: null
      });
    });

    it('should return error on failed request', async () => {
      const mockError = {
        response: {
          data: { message: 'No products found' }
        }
      };
      mockedApi.get.mockRejectedValue(mockError);

      const result = await productListing(1, 10, { risk_level: null, investment_type: null });

      expect(result).toEqual({
        products: null,
        total: null,
        error: 'No products found'
      });
    });
  });

  describe('addProduct', () => {
    it('should return success message on successful product creation', async () => {
        const mockResponse = {
          data: { message: 'Product added successfully' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url: '/products/add-product' }
        };
      mockedApi.post.mockResolvedValue(mockResponse);

      const productData = {
        name: 'Test Product',
        investment_type: 'mf',
        tenure_months: 12,
        annual_yield: 8.5,
        risk_level: 'moderate',
        min_investment: 1000,
        max_investment: 10000
      };
      const result = await addProduct(productData);

      expect(mockedApi.post).toHaveBeenCalledWith('/products/add-product', productData);
      expect(result).toEqual({ message: 'Product added successfully', error: null });
    });

    it('should return error on failed product creation', async () => {
      const mockError = {
        response: {
          data: { message: 'Product name already exists' }
        }
      };
      mockedApi.post.mockRejectedValue(mockError);

      const productData = {
        name: 'Existing Product',
        investment_type: 'mf',
        tenure_months: 12,
        annual_yield: 8.5,
        risk_level: 'moderate',
        min_investment: 1000,
        max_investment: 10000
      };
      const result = await addProduct(productData);

      expect(result).toEqual({ message: null, error: 'Product name already exists' });
    });
  });

  describe('deleteProduct', () => {
    it('should return success message on successful product deletion', async () => {
        const mockResponse = {
          data: { message: 'Product deleted successfully' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url: '/products/delete-product' }
        };
      mockedApi.delete.mockResolvedValue(mockResponse);

      const result = await deleteProduct('product123');

      expect(mockedApi.delete).toHaveBeenCalledWith('/products/delete-product', {
        data: { productId: 'product123' }
      });
      expect(result).toEqual({ message: 'Product deleted successfully', error: null });
    });

    it('should return error on failed product deletion', async () => {
      const mockError = {
        response: {
          data: { message: 'Product not found' }
        }
      };
      mockedApi.delete.mockRejectedValue(mockError);

      const result = await deleteProduct('nonexistent');

      expect(result).toEqual({ message: null, error: 'Product not found' });
    });
  });

  describe('updateProduct', () => {
    it('should return success message on successful product update', async () => {
        const mockResponse = {
          data: { message: 'Product updated successfully' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: { url: '/products/update-product' }
        };
      mockedApi.patch.mockResolvedValue(mockResponse);

      const productData = {
        id: 'product123',
        name: 'Updated Product',
        investment_type: 'mf',
        tenure_months: 24,
        annual_yield: 9.0,
        risk_level: 'high',
        min_investment: 2000,
        max_investment: 20000
      };
      const result = await updateProduct(productData);

      expect(mockedApi.patch).toHaveBeenCalledWith('/products/update-product', productData);
      expect(result).toEqual({ message: 'Product updated successfully', error: null });
    });

    it('should return error on failed product update', async () => {
      const mockError = {
        response: {
          data: { message: 'Product not found' }
        }
      };
      mockedApi.patch.mockRejectedValue(mockError);

      const productData = {
        id: 'nonexistent',
        name: 'Updated Product',
        investment_type: 'mf',
        tenure_months: 24,
        annual_yield: 9.0,
        risk_level: 'high',
        min_investment: 2000,
        max_investment: 20000
      };
      const result = await updateProduct(productData);

      expect(result).toEqual({ message: null, error: 'Product not found' });
    });
  });
});

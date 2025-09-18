import { api } from "./axios";

export const login = async (userData: { email: string; password_hash: string }) => {
  try {
    const response = await api.post("/user/login", userData);
  return { message: (response.data as any).message, error: null };
  } catch (error: any) {
    let errorMsg = "Something went wrong!";
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message;
    }
    return { message: null, error: errorMsg };
  }
};

export const dashboard = async () => {
  try {
    const response = await api.get('/admin/dashboard');
  return { data: response.data as any, error: null };

  } catch (error: any) {
    let errorMsg = "Something went wrong!";
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message;
    }
    return { data: null, error: errorMsg };
  }
}

export const logout = async () => {
  try {
    const response = await api.get("/user/logout");
  return { data: response.data as any, error: null };
  } catch (error: any) {
    let errorMsg = "Something went wrong!";
    return { data: null, error: errorMsg };
  }
}

export const updateProfile = async (userData: { first_name: string, last_name: string, password: string, risk_appetite: string }) => {
  try {
    const response = await api.post('/user/update-profile', userData);
  return { message: (response.data as any).message, suggestions: (response.data as any).suggestion, warning: (response.data as any).warning, error: null };

  } catch (error: any) {
    let errorMsg = "Something went wrong!";
    let suggestions = null;
    let warning = null;
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        errorMsg = error.response.data.message;
      }
      if (error.response.data.suggestions || error.response.data.suggestion) {
        suggestions = error.response.data.suggestions || error.response.data.suggestion;
      }
      if (error.response.data.warning) {
        warning = error.response.data.warning;
      }
    }
    return { message: null, suggestions, warning, token: null, error: errorMsg };
  }
}

export const transactions = async (filters: any) => {
  try {
    const response = await api.get('/admin/transactions?' + filters);
    return response;
  } catch (error: any) {
    return error.message;
  }
}

export const productListing = async (
  page: number,
  limit: number,
  filters: { risk_level: string | null; investment_type: string | null }
) => {
  try {
    const params: Record<string, any> = { page, limit };

    if (filters.risk_level) {
      params.risk_level = filters.risk_level;
    }

    if (filters.investment_type) {
      params.investment_type = filters.investment_type;
    }

    const response = await api.get('/products/list-products', { params });

    return {
      products: (response.data as any).data,
      total: (response.data as any).total,
      error: null,
    };
  } catch (error: any) {
    let errorMsg = 'Something went wrong!';
    if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    }
    return { products: null, total: null, error: errorMsg };
  }
};


export const addProduct = async (
  productData: {
    name: string,
    investment_type: string,
    tenure_months: number,
    annual_yield: number,
    risk_level: string,
    min_investment: number,
    max_investment: number
  }
) => {
  try {
    const response = await api.post('/products/add-product', productData);
  return { message: (response.data as any).message, error: null };
  } catch (error: any) {
    let errorMsg = 'Something went wrong!';
    if (error.response && error.response.data && error.response.data.message) {

      errorMsg = error.response.data.message;
    }
    return { message: null, error: errorMsg };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const response = await api.delete<{message: string}>(`/products/delete-product/${productId}`);
    return { message: response.data.message, error: null };
  } catch (error: any) {
    let errorMsg = 'Something went wrong!';
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message;
    }
    return { message: null, error: errorMsg };
  }
}

  export const updateProduct = async (productData: {
    id: string,
    name: string,
    investment_type: string,
    tenure_months: number,
    annual_yield: number,
    risk_level: string,
    min_investment: number,
    max_investment: number
  }) => {
    try {
      const response = await api.patch<{message: string}>('/products/update-product', productData);
      return { message: response.data.message, error: null };
    } catch (error: any) {
      let errorMsg = 'Something went wrong!';
      if (error.response && error.response.data && error.response.data.message) {

        errorMsg = error.response.data.message;
      }
      return { message: null, error: errorMsg };
    }
  }
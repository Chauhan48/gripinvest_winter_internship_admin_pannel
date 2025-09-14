import {api} from "./axios";

export const login = async (userData: { email: string; password_hash: string }) => {
  try {
    const response = await api.post("/user/login", userData);
    return { message: response.data.message, error: null };
  } catch (error: any) {
    let errorMsg = "Something went wrong!";
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg = error.response.data.message;
    }
    return { message: null, error: errorMsg };
  }
};

export const dashboard = async () => {
  try{
    const response = await api.get('/admin/dashboard');
    return {data: response.data, error: null};

  }catch(error: any){
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
    return { data: response.data, error: null };
  } catch (error: any) {
    let errorMsg = "Something went wrong!";
    return { data: null, error: errorMsg };
  }
}

export const updateProfile = async (userData: { first_name: string, last_name: string, password: string, risk_appetite: string }) => {
  try {
    const response = await api.post('/user/update-profile', userData);
    return { message: response.data.message, suggestions: response.data.suggestion, warning: response.data.warning, error: null };

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
  try{
    const response = await api.get('/admin/transactions?' + filters);
    return response;
  }catch(error: any){
    return error.message;
  }
}
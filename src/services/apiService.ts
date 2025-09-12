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
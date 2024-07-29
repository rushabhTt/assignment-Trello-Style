import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export const signup = async (userData: UserData): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/signup",
      userData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const signin = async (
  credentials: Credentials
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      "/auth/signin",
      credentials
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

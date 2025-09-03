import api from "./axiosInstance";

const API_URL = "/api/auth";

export const registerAPI = (name: string, email: string, password: string) =>
  api.post(`${API_URL}/register`, { name, email, password });

export const sendOTPAPI = (name: string, email: string, password: string) =>
  api.post(`${API_URL}/send-otp`, { name, email, password });

export const verifyOTPAPI = (name: string, email: string, password: string, otp: string) =>
  api.post(`${API_URL}/verify-otp`, { name, email, password, otp });

export const loginAPI = (email: string, password: string) =>
  api.post(`${API_URL}/login`, { email, password });

export const getMeAPI = () => api.get(`${API_URL}/me`);
export const logoutAPI = () => api.post(`${API_URL}/logout`);

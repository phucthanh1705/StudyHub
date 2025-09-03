  import AsyncStorage from "@react-native-async-storage/async-storage";
  import {
    registerAPI,
    sendOTPAPI,
    verifyOTPAPI,
    loginAPI,
    getMeAPI,
    logoutAPI,
  } from "../api/auth.api";

  export const AuthService = {
    register: async (name: string, email: string, password: string) => {
      const res = await registerAPI(name, email, password);
      return res.data;
    },

    sendOTP: async (name: string, email: string, password: string) => {
      const res = await sendOTPAPI(name, email, password);
      return res.data;
    },

    verifyOTP: async (name: string, email: string, password: string, otp: string) => {
      const res = await verifyOTPAPI(name, email, password, otp);
      return res.data;
    },

    login: async (email: string, password: string) => {
      const res = await loginAPI(email, password);

      // Lưu token và role_id
      if (res.data.token) {
        await AsyncStorage.setItem("token", res.data.token);
        if (res.data.user?.role_id !== undefined) {
          await AsyncStorage.setItem("role_id", res.data.user.role_id.toString());
        }
      }
      console.log("res data", res.data);
      return res.data;
    },

    getMe: async () => {
      const res = await getMeAPI();
      return res.data;
    },

    logout: async () => {
      await logoutAPI(); 
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role_id");
    },

    getRole: async (): Promise<number | null> => {
      const role = await AsyncStorage.getItem("role_id");
      return role ? parseInt(role, 10) : null;
    },
  };

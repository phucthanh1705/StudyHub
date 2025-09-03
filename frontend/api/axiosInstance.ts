import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBaseURL } from "../src/utils/getBaseURL";
import { Alert } from "react-native"; 

const api = axios.create();

export const setupAxios = async () => {
  const baseURL = await getBaseURL();


  console.log("Base URL được sử dụng:", baseURL);
  api.defaults.baseURL = baseURL;

  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default api;

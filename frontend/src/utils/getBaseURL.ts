import Constants from "expo-constants";
import { Platform } from "react-native";

export const getBaseURL = (): string => {
  const isExpoGo = Constants.appOwnership === "expo";
  const isDev = __DEV__;

  if (isExpoGo && isDev && Platform.OS === "android") {
    // Trường hợp chạy bằng Expo Go + máy ảo
    const ip = Constants.expoConfig?.hostUri?.split(":")[0];
    console.log("Đang chạy bằng Expo Go → IP:", ip);
    return `http://${ip}:3000`;
  }

  if (isDev && Platform.OS === "android") {
    console.log("🧪 Máy ảo Android đang dùng 10.0.2.2");
    return "http://10.0.2.2:3000";
  }

  // Release build trên điện thoại thật
  console.log("Thiết bị thật → dùng IP LAN máy chủ");
  return "http://192.168.1.20:3000"; 
};

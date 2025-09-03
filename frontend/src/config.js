import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { NetworkInfo } from 'react-native-network-info';

let localIp = "10.0.2.2"; // mặc định cho emulator
const PORT = 3000;

// Nếu là app đã build (không phải Expo Go)
const isDevice = !__DEV__ || !Constants.expoConfig?.hostUri;

if (isDevice) {
  // Nếu là điện thoại thật: tự động lấy IP Gateway → gán lại localIp
  NetworkInfo.getGatewayIPAddress().then((gatewayIp) => {
    if (gatewayIp === "192.168.1.1" || gatewayIp === "10.0.0.1") {
      localIp = "192.168.1.20";
    } else {
      localIp = gatewayIp;
    }
  }).catch((error) => {
    console.log("Lỗi lấy IP Gateway:", error);
    localIp = "192.168.1.20"; 
  });
} else if (Constants.expoConfig?.hostUri) {
  // Nếu là Expo Go trên cùng Wi-Fi → lấy từ hostUri
  localIp = Constants.expoConfig.hostUri.split(":")[0];
} else {
  // Nếu không xác định được → dùng IP mặc định
  localIp = Platform.OS === "android" ? "10.0.2.2" : "localhost";
}

export const API_BASE_URL = `http://${localIp}:${PORT}`;
export const getPdfUrl = (relativePath) => `${API_BASE_URL}${relativePath}`;


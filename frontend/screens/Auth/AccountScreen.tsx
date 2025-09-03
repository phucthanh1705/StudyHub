import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../../services/auth.service";

// Import styles
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { searchStyles } from "../../constants/searchStyles";

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Kiểm tra token và lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AuthService.getMe();
        console.log("User data:", data);
        setUser(data);
      } catch (error: any) {
        console.log(
          "Lỗi lấy thông tin người dùng:",
          error.response?.data || error.message
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator size="large" color="#6C63FF" />
  //       <Text>Đang tải thông tin...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {/* Ảnh nền */}
      <ImageBackground
        source={require("../../assets/Auth/purple-bg.png")}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        {/* Nội dung bên trên ảnh */}
        <View style={styles.overlay}>
          {user ? (
            <>
              <Text style={[textStyles.bannerTitle, styles.title]}>
                Xin chào, {user.name}!
              </Text>
              <Text style={[textStyles.bannerSubtitle, styles.subtitle]}>
                Chào mừng bạn đã quay trở lại. Truy cập hồ sơ của bạn để xem chi
                tiết.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.loginButton]}
                  onPress={() => navigation.navigate("Profile", { user })}
                >
                  <Text style={styles.buttonTextLogin}>Đi đến Profile</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.subtitle}>
                Hãy đăng nhập hoặc tạo tài khoản để trải nghiệm đầy đủ tính
                năng.
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.loginButton]}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.buttonTextLogin}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.createButton]}
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={styles.buttonTextCreate}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: -280,
    backgroundColor: "transparent",
  },
  overlay: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#535353ff",
    textAlign: "left",
    marginVertical: 20,
    marginTop: 10,
    maxWidth: "80%",
    lineHeight: 24,
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  // Button Login
  loginButton: {
    backgroundColor: "#6C63FF",
  },
  // Button Create Account
  createButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6C63FF",
  },

  buttonTextLogin: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonTextCreate: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C63FF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  createButtonText: {
    color: "#6C63FF",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
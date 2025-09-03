import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";
import { AuthService } from "../../services/auth.service";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../src/contexts/AuthContext"; 
 

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const { setLoggedIn } = useContext(AuthContext);

  const navigation = useNavigation<NavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const res = await AuthService.login(email, password);
      if (!res?.token) throw new Error(res?.message || "Không nhận được token");

      await AsyncStorage.setItem("token", res.token);
      if (res.user) await AsyncStorage.setItem("me", JSON.stringify(res.user));

      setLoggedIn(true);        
      Alert.alert("Thành công", res?.message || "Đăng nhập thành công");
    } catch (error: any) {
      console.log("Login error:", error?.response?.data || error?.message || error);
      Alert.alert("Lỗi", error?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <ImageBackground
        source={require("../../assets/Auth/purple-bg.png")}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Sign in</Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="demo@email.com"
            style={[
              styles.input,
              focusedInput === "email" && styles.inputFocused,
            ]}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedInput("email")}
            onBlur={() => setFocusedInput("")}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View style={{ position: "relative" }}>
            <TextInput
              placeholder="Enter your password"
              style={[
                styles.input,
                focusedInput === "password" && styles.inputFocused,
              ]}
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput("")}
            />
            <TouchableOpacity
              accessibilityLabel="toggle-password"
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {/* Nút Login */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign up */}
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text
              style={styles.signUpText}
              onPress={() => navigation.navigate("Register")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    zIndex: 999,
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 20,
  },
  backIcon: {
    width: 42,
    height: 32,
    transform: [{ rotate: "180deg" }],
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
  label: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  inputFocused: {
    borderColor: "#6C63FF",
    borderWidth: 2,
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
  signUpText: {
    color: "#6C63FF",
    fontWeight: "bold",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
});
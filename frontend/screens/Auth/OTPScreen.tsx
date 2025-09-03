import React, { useState } from "react";
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
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AuthService } from "../../services/auth.service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

//assets
import { Images } from "../../constants/images/images";

type OTPRouteProp = RouteProp<RootStackParamList, "OTP">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OTPScreen() {
  const route = useRoute<OTPRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const { name, email, password } = route.params;
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<boolean>(false);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Thông báo", "Vui lòng nhập mã OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await AuthService.verifyOTP(name, email, password, otp);
      console.log("Verify OTP response:", res);

      Alert.alert("Thành công", res.message || "Xác thực OTP thành công");
      navigation.navigate("Login");
    } catch (error: any) {
      console.log("Verify OTP error:", error.response?.data || error.message);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Xác thực OTP thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Nút Back */}
      <TouchableOpacity
        accessibilityLabel="back-button"
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image source={Images.Common.back} style={styles.backIcon} />
      </TouchableOpacity>

      <ImageBackground
        source={require("../../assets/Auth/purple-bg.png")}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>OTP Verification</Text>
          <Text style={styles.subtitle}>
            Nhập mã OTP được gửi tới email: {email}
          </Text>

          <TextInput
            placeholder="Nhập mã OTP"
            style={[styles.input, focusedInput && styles.inputFocused]}
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
            onFocus={() => setFocusedInput(true)}
            onBlur={() => setFocusedInput(false)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Xác nhận</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Quay lại{" "}
            <Text
              style={styles.loginText}
              onPress={() => navigation.navigate("Login")}
            >
              Đăng nhập
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: -280,
    backgroundColor: "transparent",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 999,

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
    fontSize: 36,
    fontWeight: "bold",
    color: "#424242",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
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
  loginText: {
    color: "#6C63FF",
    fontWeight: "bold",
  },
});
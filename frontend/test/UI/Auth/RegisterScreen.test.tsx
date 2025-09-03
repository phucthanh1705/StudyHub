import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../../../screens/Auth/RegisterScreen";
import { Alert } from "react-native";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

const mockSendOTP = jest.fn();
jest.mock("../../../services/auth.service", () => ({
  AuthService: {
    sendOTP: (...args: any[]) => mockSendOTP(...args),
  },
}));

jest.spyOn(Alert, "alert");

describe("Kiểm thử màn hình RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Hiển thị đầy đủ các thành phần giao diện", () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);
    expect(getByText("Sign up")).toBeTruthy();
    expect(getByPlaceholderText("Nguyễn Văn A")).toBeTruthy();
    expect(getByPlaceholderText("demo@email.com")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    expect(getByText("Register")).toBeTruthy();
    expect(getByText("Sign in")).toBeTruthy();
  });

  it("Hiển thị cảnh báo nếu bấm Register mà chưa nhập đủ thông tin", () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText("Register"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Thông báo",
      "Vui lòng nhập đầy đủ tên, email và mật khẩu"
    );
  });

  it("Có thể bật/tắt hiển thị mật khẩu", () => {
    const { getByPlaceholderText, getByLabelText } = render(<RegisterScreen />);
    const passwordInput = getByPlaceholderText("Enter your password");
    const eyeButton = getByLabelText("toggle-password");

    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(eyeButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it("Gọi API gửi OTP với thông tin hợp lệ và điều hướng sang OTP", async () => {
    mockSendOTP.mockResolvedValueOnce({ message: "OTP đã được gửi tới email" });

    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    fireEvent.changeText(getByPlaceholderText("Nguyễn Văn A"), "Test User");
    fireEvent.changeText(getByPlaceholderText("demo@email.com"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "123456");

    fireEvent.press(getByText("Register"));

    await waitFor(() => {
      expect(mockSendOTP).toHaveBeenCalledWith("Test User", "test@example.com", "123456");
      expect(Alert.alert).toHaveBeenCalledWith(
        "Thông báo",
        "OTP đã được gửi tới email"
      );
      expect(mockNavigate).toHaveBeenCalledWith("OTP", {
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      });
    });
  });

  it("Chuyển sang màn hình Login khi bấm Sign in", () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText("Sign in"));
    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });

  it("Quay lại màn hình Main/Account khi bấm nút Back", () => {
    const { getByLabelText } = render(<RegisterScreen />);
    const backButton = getByLabelText("back-button");

    fireEvent.press(backButton);
    expect(mockNavigate).toHaveBeenCalledWith("Main", { screen: "Account" });
  });
});

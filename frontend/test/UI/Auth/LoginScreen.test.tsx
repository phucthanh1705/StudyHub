// test/UI/Auth/LoginScreen.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../../../screens/Auth/LoginScreen";
import { Alert } from "react-native";
import { AuthContext } from "../../../src/contexts/AuthContext"; // ⬅️ dùng context tách riêng

// Mock navigation: vẫn dùng cho test "Sign up"
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

// Mock AuthService.login
const mockLogin = jest.fn();
jest.mock("../../../services/auth.service", () => ({
  AuthService: { login: (...args: any[]) => mockLogin(...args) },
}));

// Mock Alert để dễ assert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

// Helper render kèm Provider
function renderWithAuth(
  ui: React.ReactNode,
  ctx = { isLoggedIn: false, setLoggedIn: jest.fn() }
) {
  return {
    ...render(
      <AuthContext.Provider value={ctx as any}>{ui}</AuthContext.Provider>
    ),
    ctx,
  };
}

describe("Kiểm thử màn hình LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Hiển thị đầy đủ các thành phần giao diện", () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(<LoginScreen />);
    expect(getByText("Sign in")).toBeTruthy();
    expect(getByPlaceholderText("demo@email.com")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Sign up")).toBeTruthy();
  });

  it("Hiển thị cảnh báo nếu bấm Login mà chưa nhập email/mật khẩu", () => {
    const { getByText } = renderWithAuth(<LoginScreen />);
    fireEvent.press(getByText("Login"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Thông báo",
      "Vui lòng nhập email và mật khẩu"
    );
  });

  it("Có thể bật/tắt hiển thị mật khẩu", () => {
    const { getByPlaceholderText, getByLabelText } = renderWithAuth(<LoginScreen />);
    const passwordInput = getByPlaceholderText("Enter your password");
    const eyeButton = getByLabelText("toggle-password");

    expect(passwordInput.props.secureTextEntry).toBe(true);
    fireEvent.press(eyeButton);
    expect(passwordInput.props.secureTextEntry).toBe(false);
  });

  it("Gọi API login với thông tin hợp lệ và setLoggedIn(true)", async () => {
    // ⬅️ Quan trọng: phải trả về token vì code kiểm tra res.token
    mockLogin.mockResolvedValueOnce({ token: "abc", message: "Đăng nhập thành công" });

    const { getByPlaceholderText, getByText, ctx } = renderWithAuth(<LoginScreen />, {
      isLoggedIn: false,
      setLoggedIn: jest.fn(),
    });

    fireEvent.changeText(getByPlaceholderText("demo@email.com"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Enter your password"), "123456");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "123456");
      expect(Alert.alert).toHaveBeenCalledWith("Thành công", "Đăng nhập thành công");
      expect(ctx.setLoggedIn).toHaveBeenCalledWith(true); // ⬅️ kiểm tra đúng flow mới
    });
  });

  it("Chuyển sang màn hình Đăng ký khi bấm Sign up", () => {
    const { getByText } = renderWithAuth(<LoginScreen />);
    fireEvent.press(getByText("Sign up"));
    expect(mockNavigate).toHaveBeenCalledWith("Register");
  });
});

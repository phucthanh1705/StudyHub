import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OTPScreen from "../../../screens/Auth/OTPScreen";
import { Alert } from "react-native";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: {
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    },
  }),
}));

const mockVerifyOTP = jest.fn();
jest.mock("../../../services/auth.service", () => ({
  AuthService: {
    verifyOTP: (...args: any[]) => mockVerifyOTP(...args),
  },
}));

jest.spyOn(Alert, "alert");

describe("Kiểm thử màn hình OTPScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Hiển thị đầy đủ các thành phần giao diện", () => {
    const { getByText, getByPlaceholderText } = render(<OTPScreen />);
    expect(getByText("OTP Verification")).toBeTruthy();
    expect(getByText(/Nhập mã OTP được gửi tới email/)).toBeTruthy();
    expect(getByPlaceholderText("Nhập mã OTP")).toBeTruthy();
    expect(getByText("Xác nhận")).toBeTruthy();
    expect(getByText("Đăng nhập")).toBeTruthy();
  });

  it("Hiển thị cảnh báo nếu bấm Xác nhận mà chưa nhập OTP", () => {
    const { getByText } = render(<OTPScreen />);
    fireEvent.press(getByText("Xác nhận"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Thông báo",
      "Vui lòng nhập mã OTP"
    );
  });

  it("Gọi API verifyOTP với OTP hợp lệ và điều hướng sang Login", async () => {
    mockVerifyOTP.mockResolvedValueOnce({ message: "Xác thực OTP thành công" });

    const { getByPlaceholderText, getByText } = render(<OTPScreen />);
    fireEvent.changeText(getByPlaceholderText("Nhập mã OTP"), "999999");
    fireEvent.press(getByText("Xác nhận"));

    await waitFor(() => {
      expect(mockVerifyOTP).toHaveBeenCalledWith(
        "Test User",
        "test@example.com",
        "123456",
        "999999"
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        "Thành công",
        "Xác thực OTP thành công"
      );
      expect(mockNavigate).toHaveBeenCalledWith("Login");
    });
  });

  it("Hiển thị lỗi khi verifyOTP thất bại", async () => {
    mockVerifyOTP.mockRejectedValueOnce({
      response: { data: { message: "OTP không đúng" } },
    });

    const { getByPlaceholderText, getByText } = render(<OTPScreen />);
    fireEvent.changeText(getByPlaceholderText("Nhập mã OTP"), "000000");
    fireEvent.press(getByText("Xác nhận"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "OTP không đúng");
    });
  });

  it("Chuyển sang màn hình Login khi bấm Đăng nhập", () => {
    const { getByText } = render(<OTPScreen />);
    fireEvent.press(getByText("Đăng nhập"));
    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });

  it("Quay lại màn hình trước khi bấm nút Back", () => {
    const { getByLabelText } = render(<OTPScreen />);
    const backButton = getByLabelText("back-button");
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});

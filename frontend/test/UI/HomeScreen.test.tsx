import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../../screens/HomeScreen";
import { AuthService } from "../../services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));
(useNavigation as jest.Mock).mockReturnValue({
  navigate: mockNavigate,
  addListener: jest.fn((event, cb) => cb()),
});

jest.mock("../../services/auth.service", () => ({
  AuthService: {
    getMe: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị trạng thái loading khi đang tải dữ liệu", () => {
    (AuthService.getMe as jest.Mock).mockImplementation(() => new Promise(() => {})); 
    render(<HomeScreen />);
    expect(screen.getByText("Đang tải StudyHub...")).toBeTruthy();
  });

  it("hiển thị lời chào khi user đã đăng nhập", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({
      user_id: 1,
      name: "Huỳnh Ngọc Tiến",
    });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    render(<HomeScreen />);
    expect(await screen.findByText(/Chào mừng trở lại, Huỳnh Ngọc Tiến!/)).toBeTruthy();
    expect(screen.getByText(/Tiếp tục hành trình học tập/)).toBeTruthy();
  });

  it("hiển thị nút đăng nhập khi chưa có user", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue(null);

    render(<HomeScreen />);
    expect(await screen.findByText("Đăng nhập")).toBeTruthy();
  });

  it("bấm nút đăng nhập sẽ navigate đến Login", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue(null);

    render(<HomeScreen />);
    const loginBtn = await screen.findByText("Đăng nhập");
    fireEvent.press(loginBtn);
    expect(mockNavigate).toHaveBeenCalledWith("Login");
  });

  it("bấm avatar sẽ navigate đến Profile", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({
      user_id: 1,
      name: "Huỳnh Ngọc Tiến",
    });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    render(<HomeScreen />);
    const avatar = await screen.findByTestId("home-avatar");
    fireEvent.press(avatar);
    expect(mockNavigate).toHaveBeenCalledWith("Profile", {
      user: { user_id: 1, name: "Huỳnh Ngọc Tiến" },
    });
  });

  it("hiển thị các số liệu thống kê", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue(null);

    render(<HomeScreen />);
    expect(await screen.findByText("50+")).toBeTruthy();
    expect(screen.getByText("Người dùng")).toBeTruthy();
    expect(screen.getByText("100+")).toBeTruthy();
    expect(screen.getByText("Khóa học")).toBeTruthy();
    expect(screen.getByText("95%")).toBeTruthy();
    expect(screen.getByText("Hài lòng")).toBeTruthy();
    expect(screen.getByText("24/7")).toBeTruthy();
    expect(screen.getByText("Hỗ trợ")).toBeTruthy();
  });

  it("hiển thị các tính năng nổi bật", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue(null);

    render(<HomeScreen />);
    expect(await screen.findByText("Quản lý khóa học")).toBeTruthy();
    expect(screen.getByText("Lịch học thông minh")).toBeTruthy();
    expect(screen.getByText("Bài tập & Tài liệu")).toBeTruthy();
    expect(screen.getByText("Theo dõi tiến độ")).toBeTruthy();
  });

  it("hiển thị footer StudyHub", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue(null);

    render(<HomeScreen />);
    expect(await screen.findByText("StudyHub")).toBeTruthy();
    expect(
      screen.getByText(/Nền tảng học tập thông minh/i)
    ).toBeTruthy();
    expect(screen.getByText(/© 2024 StudyHub/)).toBeTruthy();
  });
});

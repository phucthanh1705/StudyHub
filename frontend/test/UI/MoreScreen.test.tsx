import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import MoreScreen from "../../screens/MoreScreen";
import { useNavigation } from "@react-navigation/native";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));
(useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

describe("MoreScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị tiêu đề và mô tả banner", () => {
    render(<MoreScreen />);
    expect(screen.getByText("Dịch Vụ Quản Trị")).toBeTruthy();
    expect(
      screen.getByText("Quản lý toàn bộ chức năng dành cho Admin")
    ).toBeTruthy();
  });

  it("hiển thị đầy đủ 4 chức năng quản trị", () => {
    render(<MoreScreen />);
    expect(screen.getByText("Quản lý môn học")).toBeTruthy();
    expect(screen.getByText("Danh sách đăng ký")).toBeTruthy();
    expect(screen.getByText("Thời gian đăng ký")).toBeTruthy();
    expect(screen.getByText("Quản lý người dùng")).toBeTruthy();
  });

  it("gọi navigation.navigate('SubjectList') khi bấm Quản lý môn học", () => {
    render(<MoreScreen />);
    fireEvent.press(screen.getByText("Quản lý môn học"));
    expect(mockNavigate).toHaveBeenCalledWith("SubjectList");
  });

  it("gọi navigation.navigate('RegistrationList') khi bấm Danh sách đăng ký", () => {
    render(<MoreScreen />);
    fireEvent.press(screen.getByText("Danh sách đăng ký"));
    expect(mockNavigate).toHaveBeenCalledWith("RegistrationList");
  });

  it("gọi navigation.navigate('RegisterTime') khi bấm Thời gian đăng ký", () => {
    render(<MoreScreen />);
    fireEvent.press(screen.getByText("Thời gian đăng ký"));
    expect(mockNavigate).toHaveBeenCalledWith("RegisterTime");
  });

  it("gọi navigation.navigate('UserManagement') khi bấm Quản lý người dùng", () => {
    render(<MoreScreen />);
    fireEvent.press(screen.getByText("Quản lý người dùng"));
    expect(mockNavigate).toHaveBeenCalledWith("UserManagement");
  });

  it("hiển thị footer với thông điệp quản lý hệ thống", () => {
    render(<MoreScreen />);
    expect(
      screen.getByText("Hãy quản lý hệ thống một cách chuyên nghiệp!")
    ).toBeTruthy();
  });
});

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import AdminUserListScreen from "../../../screens/Timetable/AdminUserListScreen";
import { UserService } from "../../../services/user.service";

// Mock navigation
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate, // Dùng cùng biến mockNavigate
    addListener: jest.fn((_, cb) => {
      // Gọi callback sau khi render
      setTimeout(() => cb(), 0);
      return jest.fn(); // mock hàm unsubscribe
    }),
  }),
}));

// Mock service
jest.mock("../../../services/user.service");

describe("AdminUserListScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("hiển thị danh sách user sau khi fetch thành công", async () => {
    (UserService.getAll as jest.Mock).mockResolvedValue([
      { user_id: 1, name: "User A", role_id: 2 },
      { user_id: 2, name: "User B", role_id: 3 }
    ]);

    render(<AdminUserListScreen />);

    await waitFor(() => {
      expect(screen.getByText("User A")).toBeTruthy();
      expect(screen.getByText("Student")).toBeTruthy();
      expect(screen.getByText("User B")).toBeTruthy();
      expect(screen.getByText("Teacher")).toBeTruthy();
    });
  });

  it("hiển thị thông báo rỗng khi không có user nào", async () => {
    (UserService.getAll as jest.Mock).mockResolvedValue([]);

    render(<AdminUserListScreen />);

    await waitFor(() => {
    screen.debug();
      expect(screen.getByText("Không có người dùng nào!")).toBeTruthy();
    });
  });

  it("lọc danh sách khi tìm kiếm", async () => {
    (UserService.getAll as jest.Mock).mockResolvedValue([
      { user_id: 1, name: "Alice", role_id: 2 },
      { user_id: 2, name: "Bob", role_id: 3 }
    ]);

    render(<AdminUserListScreen />);

    await waitFor(() => screen.getByText("Alice"));

    // Nhập từ khóa tìm kiếm
    fireEvent.changeText(
      screen.getByPlaceholderText("Tìm kiếm người dùng..."),
      "Alice"
    );

    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.queryByText("Bob")).toBeNull();
  });

  it("bấm vào user điều hướng đến UserTimetable", async () => {
    (UserService.getAll as jest.Mock).mockResolvedValue([
      { user_id: 1, name: "User A", role_id: 2 }
    ]);

    render(<AdminUserListScreen />);

    await waitFor(() => expect(screen.getByText("User A")).toBeTruthy());

    fireEvent.press(screen.getByText("User A"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("UserTimetable", {
        userId: 1,
        userName: "User A"
      });
    });
  });
});

import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native";
import UserManagementScreen from "../../../screens/Auth/UserManagementScreen";
import { Alert } from "react-native";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

const mockGetAll = jest.fn();
jest.mock("../../../services/user.service", () => ({
  UserService: {
    getAll: (...args: any[]) => mockGetAll(...args),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.spyOn(Alert, "alert");

describe("Kiểm thử UserManagementScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Gọi fetchUsers và hiển thị danh sách người dùng", async () => {
    jest.setTimeout(15000);
  mockGetAll.mockResolvedValueOnce([
    { id: 1, name: "User 1", email: "u1@example.com", role: 3 },
  ]);

  const { getByText, getByLabelText, getAllByText } = render(<UserManagementScreen />);
  
  await waitFor(() => {
    screen.debug();
    expect(getByText("User 1")).toBeTruthy();
    expect(getByText("u1@example.com")).toBeTruthy();
    const roleElements = getAllByText("Role: student");
    expect(roleElements).toBeTruthy();
  });

  expect(getByLabelText("edit-user-1")).toBeTruthy();
  expect(getByLabelText("delete-user-1")).toBeTruthy();
});


  it("Hiển thị cảnh báo khi fetchUsers thất bại", async () => {
    mockGetAll.mockRejectedValueOnce(new Error("Không thể tải danh sách người dùng."));

    render(<UserManagementScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Lỗi",
        "Không thể tải danh sách người dùng."
      );
    });
  });

  it("Lọc danh sách khi tìm kiếm", async () => {
    mockGetAll.mockResolvedValueOnce([
      { id: 1, name: "Nguyen Van A", email: "a@example.com", role_name: "admin" },
      { id: 2, name: "Tran Van B", email: "b@example.com", role_name: "student" },
    ]);

    const { getByPlaceholderText, getByText, queryByText } = render(<UserManagementScreen />);
    await waitFor(() => {});

    const searchInput = getByPlaceholderText("Tìm kiếm người dùng...");
    fireEvent.changeText(searchInput, "Nguyen");

    expect(getByText("Nguyen Van A")).toBeTruthy();
    expect(queryByText("Tran Van B")).toBeNull();
  });

  it("Mở thêm user khi bấm nút thêm", async () => {
    mockGetAll.mockResolvedValueOnce([]);
    const { getByLabelText, getByText } = render(<UserManagementScreen />);
    await waitFor(() => {});

    fireEvent.press(getByLabelText("add-user-button"));
    expect(getByText(/Thêm User/i)).toBeTruthy();
  });

  it("Quay lại màn hình trước khi bấm Back", async () => {
    mockGetAll.mockResolvedValueOnce([]);
    const { getByLabelText } = render(<UserManagementScreen />);
    await waitFor(() => {});

    fireEvent.press(getByLabelText("back-button"));
    expect(mockGoBack).toHaveBeenCalled();
  });
});

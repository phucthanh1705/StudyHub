// __tests__/RegisterTimeScreen.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import RegisterTimeScreen from "../../../screens/Registration/RegisterTimeScreen";
import { RegisterCourseService } from "../../../services/registercourse.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
}));

// Mock images
jest.mock("../../../constants/images/images", () => ({
  Images: {
    TopBanner: { registerTime: 1 },
    Common: { nothing: 2 },
    More: { img6: 3 },
  },
}));

// Mock service
jest.mock("../../../services/registercourse.service");

describe("RegisterTimeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị danh sách thời gian đăng ký khi role = admin và có dữ liệu", async () => {
    const mockData = [
      {
        begin_register: "2025-07-31T00:00:00Z",
        end_register: "2025-08-01T00:00:00Z",
        due_date_start: "2025-08-02T00:00:00Z",
        due_date_end: "2025-08-22T00:00:00Z",
        year: 2025,
        semester: 1,
      },
      {
        begin_register: "2025-07-19T00:00:00Z",
        end_register: "2025-07-20T00:00:00Z",
        due_date_start: "2025-08-08T00:00:00Z",
        due_date_end: "2025-08-28T00:00:00Z",
        year: 2025,
        semester: 3,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("1");
    (RegisterCourseService.getAll as jest.Mock).mockResolvedValueOnce(mockData);

    render(<RegisterTimeScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Học kỳ 1 - 2025/)).toBeTruthy();
      expect(screen.getByText(/Bắt đầu: 2025-07-31/)).toBeTruthy();
      expect(screen.getByText(/Kết thúc: 2025-08-01/)).toBeTruthy();
      expect(
        screen.getByText(/Đóng học phí: 2025-08-02 - 2025-08-22/)
      ).toBeTruthy();

      expect(screen.getByText(/Học kỳ 3 - 2025/)).toBeTruthy();
      expect(screen.getByText(/Bắt đầu: 2025-07-19/)).toBeTruthy();
      expect(screen.getByText(/Kết thúc: 2025-07-20/)).toBeTruthy();
      expect(
        screen.getByText(/Đóng học phí: 2025-08-08 - 2025-08-28/)
      ).toBeTruthy();
    });

    expect(screen.getByText("Tiếp tục hành trình của bạn!")).toBeTruthy();
    expect(screen.getByText("Tổng số thời gian đăng ký: 2")).toBeTruthy();
  });

  it("hiển thị thông báo khi role = admin nhưng không có dữ liệu", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("1");
    (RegisterCourseService.getAll as jest.Mock).mockResolvedValueOnce([]);

    render(<RegisterTimeScreen />);

    await waitFor(() => {
      expect(screen.getByText("Chưa có thời gian đăng ký nào!")).toBeTruthy();
      const addButton = screen.getByLabelText("add-register-time-button");
      expect(addButton).toBeTruthy();
    });
  });
});

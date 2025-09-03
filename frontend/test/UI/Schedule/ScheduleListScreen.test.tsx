import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import ScheduleListScreen from "../../../screens/Schedule/ScheduleListScreen";
import { AuthService } from "../../../services/auth.service";
import { CourseScheduleService } from "../../../services/courseschedule.service";

// Mock navigation & route
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: { courseId: 123 },
  }),
  useIsFocused: () => true,
}));

// Mock images
jest.mock("../../../constants/images/images", () => ({
  Images: {
    TopBanner: { schedule: 1 },
    More: { img9: 2 },
  },
}));

// Mock services
jest.mock("../../../services/auth.service");
jest.mock("../../../services/courseschedule.service");

describe("ScheduleListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đủ dữ liệu khi role = admin", async () => {
    // Mock role admin
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });

    // Mock dữ liệu lịch học
    const mockSchedules = {
      data: [
        {
          schedule_id: 1,
          date: "2025-08-14T00:00:00Z",
          start_time: "07:30:00",
          end_time: "11:30:00",
          room: "online:123",
          note: "",
          course_id: 123,
          subject_name: "Lập trình",
        },
      ],
    };

    (CourseScheduleService.getAllAdmin as jest.Mock).mockResolvedValueOnce(
      mockSchedules
    );

    render(<ScheduleListScreen />);

    await waitFor(() => {
      // Tiêu đề
      expect(screen.getByText("Danh Sách Lịch Học")).toBeTruthy();
      expect(screen.getByText("Tổng số: 1 lịch học")).toBeTruthy();

      // Nội dung động
      expect(screen.getByText(/Ngày: 2025-08-14/)).toBeTruthy();
      expect(screen.getByText(/Giờ: 07:30:00 - 11:30:00/)).toBeTruthy();
      expect(screen.getByText(/Phòng: online:123/)).toBeTruthy();

      // Nút sửa và xóa cho admin
      expect(screen.getByText("Sửa")).toBeTruthy();
      expect(screen.getByText("Xóa")).toBeTruthy();
    });
  });

  it("hiển thị loading khi đang tải", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });
    (CourseScheduleService.getAllAdmin as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // pending promise để giữ trạng thái loading
    );

    render(<ScheduleListScreen />);

    expect(screen.getByText("Lịch học")).toBeTruthy();
    expect(screen.getByText("Quản lý lịch học")).toBeTruthy();
    expect(screen.getByText("Danh Sách Lịch Học")).toBeTruthy();
    expect(screen.getByText(/Tổng số:\s*0\s*lịch học/)).toBeTruthy();
    expect(
      screen.getByText(
        "Lịch trình rõ ràng – Học tập dễ dàng, thành công vững vàng"
      )
    ).toBeTruthy();
  });
});

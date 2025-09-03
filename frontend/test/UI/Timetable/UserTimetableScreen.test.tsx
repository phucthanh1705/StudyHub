// test/UI/Timetable/UserTimetableScreen.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import UserTimetableScreen from "../../../screens/Timetable/UserTimetableScreen";
import { AuthService } from "../../../services/auth.service";
import { CourseScheduleService } from "../../../services/courseschedule.service";

// Mock navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    addListener: jest.fn((_, cb) => {
      setTimeout(() => cb(), 0); // gọi listener async để giả lập event
      return jest.fn();
    }),
  }),
}));

// Mock services
jest.mock("../../../services/auth.service");
jest.mock("../../../services/courseschedule.service");

const today = new Date();
const todayStr = today.toISOString().split("T")[0] + "T00:00:00Z";

describe("UserTimetableScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị trạng thái loading khi đang tải dữ liệu", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({
      role_id: 2, // student
    });
    (CourseScheduleService.getByStudent as jest.Mock).mockResolvedValue([]);

    render(<UserTimetableScreen />);

    expect(screen.getByText("Đang tải thời khóa biểu...")).toBeTruthy();
  });

  it("hiển thị thời khoá biểu cho student", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({
      user_id: 123,
      name: "Test Student",
      email: "student@example.com",
      role_id: 2, // student
    });

    (CourseScheduleService.getByStudent as jest.Mock).mockResolvedValue({
      data: [
        {
          schedule_id: 1,
          date: todayStr,
          start_time: "07:30:00",
          end_time: "11:30:00",
          room: "online:123",
          note: "",
          course_name: "Math",
        },
      ],
    });

    render(<UserTimetableScreen />);

    await waitFor(() => {
      expect(screen.getByTestId("subject-name-1")).toBeTruthy();
      expect(screen.getByText(/07:30/)).toBeTruthy();
    });
  });

  it("hiển thị thời khoá biểu cho teacher", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({
      user_id: 321,
      name: "Test Teacher",
      email: "teacher@example.com",
      role_id: 3,
    });
    (CourseScheduleService.getByTeacher as jest.Mock).mockResolvedValue({
      data: [
        {
          schedule_id: 2,
          date: todayStr,
          start_time: "13:00:00",
          end_time: "15:00:00",
          room: "offline:201",
          note: "",
          course_name: "Physics",
        },
      ],
    });

    render(<UserTimetableScreen />);

    await waitFor(() => {
      expect(screen.getByTestId("subject-name-2")).toBeTruthy();
      expect(screen.getByText(/13:00/)).toBeTruthy();
    });
  });

  it("hiển thị thông báo khi không có lịch", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({
      role_id: 2,
    });
    (CourseScheduleService.getByStudent as jest.Mock).mockResolvedValue([]);

    render(<UserTimetableScreen />);

    await waitFor(() => {
      expect(screen.getByText("Tuần này không có lịch học.")).toBeTruthy();
    });
  });
  it("hiển thị đầy đủ các nút & text tĩnh trên giao diện", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({
      user_id: 321,
      name: "Test Teacher",
      email: "teacher@example.com",
      role_id: 3,
    });
    (CourseScheduleService.getByTeacher as jest.Mock).mockResolvedValue({
      data: [
        {
          schedule_id: 2,
          date: todayStr,
          start_time: "13:00:00",
          end_time: "15:00:00",
          room: "offline:201",
          note: "",
          course_name: "Physics",
        },
      ],
    });
    render(<UserTimetableScreen />);
    waitFor(() => {
      expect(screen.getByText(/THỜI KHÓA BIỂU/i)).toBeTruthy();
      expect(screen.getByText(/Quản lý thời khóa biểu/i)).toBeTruthy();
      expect(screen.getByText(/Thời Khóa Biểu/i)).toBeTruthy();

      // Các nút điều hướng tuần
      expect(screen.getByText(/Tuần trước/i)).toBeTruthy();
      expect(screen.getByText(/Tuần sau/i)).toBeTruthy();
    });
  });
});

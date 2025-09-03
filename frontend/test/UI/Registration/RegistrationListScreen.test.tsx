import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import RegistrationListScreen from "../../../screens/Registration/RegistrationListScreen";
import { RegisterCourseService } from "../../../services/registercourse.service";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock("../../../constants/images/images", () => ({
  Images: {
    TopBanner: { registration: 1 },
    Common: { nothing: 2 },
    More: { img8: 3 },
  },
}));

jest.mock("../../../services/registercourse.service");

describe("RegistrationListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị giao diện tĩnh khi không có dữ liệu", async () => {
    (RegisterCourseService.getAll as jest.Mock).mockResolvedValueOnce([]);

    render(<RegistrationListScreen />);

    await waitFor(() => {
      expect(screen.getByText("Đăng ký")).toBeTruthy();
      expect(screen.getByText("Quản lý danh sách đăng ký khóa học của bạn")).toBeTruthy();
      expect(screen.getByText("Không tìm thấy kết quả.")).toBeTruthy();
    });
  });

  it("hiển thị danh sách khi fetchRegisterCourses() trả dữ liệu mock", async () => {
    const mockData = [
      {
        register_id: 1,
        begin_register: "2025-08-01T00:00:00Z",
        end_register: "2025-08-10T00:00:00Z",
        due_date_start: "",
        due_date_end: "",
        tuition: 1000,
        status: "Đang mở",
        semester: 1,
        year: 2025,
        course_id: 1,
        user_id: 101,
        user_name: "Nguyễn Văn A",
        email: "a@example.com",
      },
    ];

    (RegisterCourseService.getAll as jest.Mock).mockResolvedValueOnce(mockData);

    render(<RegistrationListScreen />);

    await waitFor(() => {
      expect(screen.getByText("Đăng ký học kỳ 1/2025")).toBeTruthy();
      expect(screen.getByText("Người dùng: Nguyễn Văn A (a@example.com)")).toBeTruthy();
      expect(screen.getByText("Thời gian đăng ký: 2025-08-01 - 2025-08-10")).toBeTruthy();
      expect(screen.getByText("Trạng thái: Đang mở")).toBeTruthy();
    });
  });
});

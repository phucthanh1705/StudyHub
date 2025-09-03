// __tests__/RegisterCourseDetailScreen.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import RegisterCourseDetailScreen from "../../../screens/Registration/RegisterCourseDetailScreen";
import { RegisterCourseService } from "../../../services/registercourse.service";

// Mock navigation & route
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: { registerId: 1 }, // ID giả để fetchRegisterCourse()
  }),
}));

// Mock images
jest.mock("../../../constants/images/images", () => ({
  Images: {
    TopBanner: { registerTime: 1 },
    More: { img4: 2 },
  },
}));

// Mock service
jest.mock("../../../services/registercourse.service");

describe("RegisterCourseDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đầy đủ thông tin tĩnh và động khi có dữ liệu", async () => {
    const mockData = {
      user_name: "Trần Phúc Thành (SV)",
      email: "tranphucthanh170502@gmail.com",
      create_at: "2025-08-02T00:00:00Z",
      begin_register: "2025-07-19T00:00:00Z",
      end_register: "2025-07-20T00:00:00Z",
      due_date_start: "2025-07-31T00:00:00Z",
      due_date_end: "2025-08-28T00:00:00Z",
      semester: 3,
      year: 2025,
      tuition: 0,
      status: "đã thanh toán",
      courses: [{ subject_name: "Cơ sở lập trình", price: 4000000 }],
    };

    (RegisterCourseService.getById as jest.Mock).mockResolvedValueOnce(
      mockData
    );

    render(<RegisterCourseDetailScreen />);

    // Kiểm tra nhãn tĩnh
    await waitFor(() => {
      expect(screen.getByText("Người dùng:")).toBeTruthy();
      expect(screen.getByText("Thời gian tạo:")).toBeTruthy();
      expect(screen.getByText("Đăng ký:")).toBeTruthy();
      expect(screen.getByText("Đóng học phí:")).toBeTruthy();
      expect(screen.getByText("Học kỳ / Năm học:")).toBeTruthy();
      expect(screen.getByText("Học phí:")).toBeTruthy();
      expect(screen.getByText("Trạng thái:")).toBeTruthy();
      expect(screen.getByText("Danh sách môn học đã đăng ký:")).toBeTruthy();
    });

    // Kiểm tra dữ liệu động
    expect(
      screen.getByText(
        /Trần Phúc Thành \(SV\).*tranphucthanh170502@gmail\.com/i
      )
    ).toBeTruthy();
    expect(screen.getByText(/Thời gian tạo:.*2025-08-02/)).toBeTruthy();
    expect(screen.getByText(/Đăng ký:.*2025-07-19.*2025-07-20/)).toBeTruthy();

    expect(
      screen.getByText(/Đóng học phí:.*2025-07-31.*2025-08-28/)
    ).toBeTruthy();

    expect(screen.getByText(/Học kỳ \/ Năm học:.*3.*2025/)).toBeTruthy();

    expect(screen.getByText(/Học phí:.*0.*VNĐ/)).toBeTruthy();

    expect(screen.getByText(/Trạng thái:.*đã thanh toán/)).toBeTruthy();
    expect(screen.getByText("Cơ sở lập trình")).toBeTruthy();
    expect(screen.getByText("4.000.000 VNĐ")).toBeTruthy();
  });

  it("hiển thị thông báo khi không tìm thấy đăng ký", async () => {
    (RegisterCourseService.getById as jest.Mock).mockResolvedValueOnce(null);

    render(<RegisterCourseDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Không tìm thấy đăng ký học phần.")).toBeTruthy();
    });
  });
});

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import StudentCourseListScreen from "../../../screens/ClassMember/StudentCourseListScreen";
import { ClassMemberService } from "../../../services/classmember.service";
import { RegisterCourseService } from "../../../services/registercourse.service";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock("../../../services/classmember.service", () => ({
  ClassMemberService: {
    getAvailableCourses: jest.fn(),
    getByStatus: jest.fn(),
    getByStatusStrict: jest.fn(),
    addCourse: jest.fn(),
  },
}));

jest.mock("../../../services/registercourse.service", () => ({
  RegisterCourseService: {
    getMyRegisterCourse: jest.fn(),
  },
}));

describe("StudentCourseListScreen", () => {
  const mockCourses = [
    { course_id: 1, name: "Toán cao cấp", price: 1000000, status: "đang chờ xử lý" },
    { course_id: 2, name: "Lập trình Java", price: 2000000, status: "đã thanh toán" },
  ];

  const mockRegData = [
    {
      begin_register: "2025-08-01T00:00:00Z",
      end_register: "2025-08-31T00:00:00Z",
      due_date_start: "2025-08-10T00:00:00Z",
      due_date_end: "2025-08-20T00:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (RegisterCourseService.getMyRegisterCourse as jest.Mock).mockResolvedValue(mockRegData);
    (ClassMemberService.getAvailableCourses as jest.Mock).mockResolvedValue({
      data: mockCourses,
    });
    (ClassMemberService.addCourse as jest.Mock).mockResolvedValue({ message: "", data: {} });
  });

  it("hiển thị danh sách khóa học khi load thành công", async () => {
    render(<StudentCourseListScreen />);
    expect(await screen.findByText("Toán cao cấp")).toBeTruthy();
    expect(screen.getByText("Lập trình Java")).toBeTruthy();
  });

  it("lọc khóa học theo từ khóa tìm kiếm", async () => {
    render(<StudentCourseListScreen />);
    await waitFor(() => screen.getByText("Toán cao cấp"));

    const searchBox = screen.getByPlaceholderText(/Tìm kiếm khóa học/i);
    fireEvent.changeText(searchBox, "toán");

    expect(screen.getByText("Toán cao cấp")).toBeTruthy();
    expect(screen.queryByText("Lập trình Java")).toBeNull();
  });

  it("lọc theo trạng thái khi bấm nút filter", async () => {
    (ClassMemberService.getByStatus as jest.Mock).mockResolvedValue({ data: [mockCourses[0]] });
    render(<StudentCourseListScreen />);
    await waitFor(() => screen.getByText("Toán cao cấp"));

    fireEvent.press(screen.getByText("đang chờ xử lý"));
    await waitFor(() => {
      expect(ClassMemberService.getByStatus).toHaveBeenCalledWith("đang chờ xử lý");
    });
  });

  it("chọn và thêm khóa học vào giỏ", async () => {
    render(<StudentCourseListScreen />);
    await waitFor(() => screen.getByText("Toán cao cấp"));

    fireEvent.press(screen.getByText("Toán cao cấp"));
    fireEvent.press(screen.getByText("Thêm vào giỏ"));

    await waitFor(() => {
      expect(ClassMemberService.addCourse).toHaveBeenCalledWith(1);
    });
  });

  it("hiển thị màn hình rỗng khi không có khóa học", async () => {
    (ClassMemberService.getAvailableCourses as jest.Mock).mockResolvedValue({ data: [] });
    render(<StudentCourseListScreen />);
    await waitFor(() => screen.getByText(/Không có khóa học nào phù hợp/i));
  });
});

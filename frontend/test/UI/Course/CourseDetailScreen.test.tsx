import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import CourseDetailScreen from "../../../screens/Course/CourseDetailScreen";
import { AuthService } from "../../../services/auth.service";
import { CourseService } from "../../../services/course.service";
import { SubjectService } from "../../../services/subject.service";
import { Alert } from "react-native";

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
  useRoute: () => ({ params: { courseId: 1 } })
}));

// Mock services
jest.mock("../../../services/auth.service");
jest.mock("../../../services/course.service");
jest.mock("../../../services/subject.service");

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("CourseDetailScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đầy đủ thông tin khóa học và môn học", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (CourseService.getByIdAdmin as jest.Mock).mockResolvedValue({
      course_id: 1,
      subject_id: 10,
      subject_name: "Lập trình Node.js",
      semester: "1",
      year: 2025,
      price: 1000000,
      numofperiods: 12
    });
    (SubjectService.getById as jest.Mock).mockResolvedValue({
      subject_id: 10,
      name: "Node.js cơ bản",
      description: "Học lập trình Node.js từ cơ bản đến nâng cao"
    });

    render(<CourseDetailScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Chi Tiết Khóa Học")).toHaveLength(2);
      expect(screen.getByText("Tên khóa học: Lập trình Node.js")).toBeTruthy();
      expect(screen.getByText("Học kỳ: 1")).toBeTruthy();
      expect(screen.getByText("Năm: 2025")).toBeTruthy();
      expect(screen.getByText(/1\,000\,000\s+VNĐ/)).toBeTruthy(); 
      expect(screen.getByText("Số buổi: 12")).toBeTruthy();
      expect(screen.getByText("Môn học: Node.js cơ bản")).toBeTruthy();
      expect(screen.getByText(/Học lập trình Node\.js/)).toBeTruthy();
    });
  });

  it("bấm nút back gọi navigation.goBack", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    // ✅ Mock đầy đủ dữ liệu để tránh unmount
    (CourseService.getByIdAdmin as jest.Mock).mockResolvedValue({
      course_id: 1,
      subject_id: 10,
      subject_name: "Lập trình Node.js",
      semester: "1",
      year: 2025,
      price: 1000000,
      numofperiods: 12
    });
    (SubjectService.getById as jest.Mock).mockResolvedValue({
      subject_id: 10,
      name: "Node.js cơ bản",
      description: ""
    });

    render(<CourseDetailScreen />);

    await waitFor(() => screen.getByLabelText("back"));
    fireEvent.press(screen.getByLabelText("back"));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it("role = 3 hiển thị nút Danh Sách Sinh Viên", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 3 });
    (CourseService.getByIdTeacher as jest.Mock).mockResolvedValue({
      course_id: 1,
      subject_id: 10,
      subject_name: "Lập trình Node.js",
      semester: "1",
      year: 2025,
      price: 1000000,
      numofperiods: 12
    });
    (SubjectService.getById as jest.Mock).mockResolvedValue({
      subject_id: 10,
      name: "Node.js cơ bản",
      description: ""
    });

    render(<CourseDetailScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("goStudentList")).toBeTruthy();
    });
  });

  it("role != 3 không hiển thị nút Danh Sách Sinh Viên", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 2 });
    (CourseService.getByIdStudent as jest.Mock).mockResolvedValue({
      course_id: 1,
      subject_id: 10,
      subject_name: "Lập trình Node.js",
      semester: "1",
      year: 2025,
      price: 1000000,
      numofperiods: 12
    });
    (SubjectService.getById as jest.Mock).mockResolvedValue({
      subject_id: 10,
      name: "Node.js cơ bản",
      description: ""
    });

    render(<CourseDetailScreen />);

    await waitFor(() => {
      expect(screen.queryByLabelText("goStudentList")).toBeNull();
    });
  });

  it("API lỗi hiển thị Alert lỗi", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (CourseService.getByIdAdmin as jest.Mock).mockRejectedValue(new Error("Lỗi server"));

    render(<CourseDetailScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Lỗi server");
    });
  });
});

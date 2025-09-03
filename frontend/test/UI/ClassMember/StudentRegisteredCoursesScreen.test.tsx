import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import StudentRegisteredCoursesScreen from "../../../screens/ClassMember/StudentRegisteredCoursesScreen";
import { ClassMemberService } from "../../../services/classmember.service";
import { Alert } from "react-native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

jest.mock("../../../services/classmember.service", () => ({
  ClassMemberService: {
    getMyClassMembers: jest.fn(),
    saveRegisterCourses: jest.fn(),
    payTuition: jest.fn(),
    removeCourse: jest.fn(),
  },
}));

describe("StudentRegisteredCoursesScreen", () => {
  const mockCourses = [
    { course_id: 1, subject_name: "Tiếng Anh", price: 1000000, status: "đang chờ xử lý" },
    { course_id: 2, subject_name: "Node.js", price: 100000, status: "đang chờ xử lý" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (ClassMemberService.getMyClassMembers as jest.Mock).mockResolvedValue({ data: mockCourses });
    (ClassMemberService.saveRegisterCourses as jest.Mock).mockResolvedValue({ message: "Lưu giỏ thành công" });
    (ClassMemberService.payTuition as jest.Mock).mockResolvedValue({ message: "Đóng học phí thành công" });
    (ClassMemberService.removeCourse as jest.Mock).mockResolvedValue({ message: "Đã xóa môn học" });
  });

  it("hiển thị danh sách khóa học và tổng học phí", async () => {
    render(<StudentRegisteredCoursesScreen />);
    expect(await screen.findByText("Tiếng Anh")).toBeTruthy();
    const expectedPrice = (1000000 + 100000).toLocaleString(); 
    expect(screen.getByText(new RegExp(expectedPrice))).toBeTruthy();
  });

  it("hiển thị trạng thái đã thanh toán khi tất cả khóa học đã trả phí", async () => {
    (ClassMemberService.getMyClassMembers as jest.Mock).mockResolvedValue({
      data: mockCourses.map(c => ({ ...c, status: "đã thanh toán" })),
    });
    render(<StudentRegisteredCoursesScreen />);
    expect(await screen.findByText(/🎉 Bạn đã hoàn tất đóng học phí!/)).toBeTruthy();
  });

  it("gọi API saveRegisterCourses khi bấm 'Lưu giỏ'", async () => {
    render(<StudentRegisteredCoursesScreen />);
    await waitFor(() => screen.getByText("Lưu giỏ"));
    fireEvent.press(screen.getByText("Lưu giỏ"));
    await waitFor(() => {
      expect(ClassMemberService.saveRegisterCourses).toHaveBeenCalled();
    });
  });

  it("quét mã QR và cho phép đóng học phí", async () => {
    render(<StudentRegisteredCoursesScreen />);
    await waitFor(() => screen.getByText("Quét mã QR"));
    fireEvent.press(screen.getByText("Quét mã QR"));
    fireEvent.press(screen.getByText("Đóng học phí"));
    await waitFor(() => {
      expect(ClassMemberService.payTuition).toHaveBeenCalled();
    });
  });

  it("xóa môn học khỏi giỏ khi xác nhận", async () => {
    render(<StudentRegisteredCoursesScreen />);
    await waitFor(() => screen.getByText("Tiếng Anh"));
    await ClassMemberService.removeCourse(1);
    expect(ClassMemberService.removeCourse).toHaveBeenCalledWith(1);
  });

  it("hiển thị thông báo giỏ trống khi không có khóa học", async () => {
    (ClassMemberService.getMyClassMembers as jest.Mock).mockResolvedValue({ data: [] });
    render(<StudentRegisteredCoursesScreen />);
    await waitFor(() => {
      expect(screen.getByText(/Hãy hoàn tất đăng ký và thanh toán để bắt đầu học ngay!/)).toBeTruthy();
    });
  });
});

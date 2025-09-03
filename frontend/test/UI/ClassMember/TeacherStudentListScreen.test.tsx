import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import TeacherStudentListScreen from "../../../screens/ClassMember/TeacherStudentListScreen";
import { ClassMemberService } from "../../../services/classmember.service";
import { Alert } from "react-native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: () => ({ params: { courseId: 101 } }),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

jest.mock("../../../services/classmember.service", () => ({
  ClassMemberService: {
    getStudentsByCourse: jest.fn(),
  },
}));

describe("TeacherStudentListScreen", () => {
  const mockStudents = [
    {
      user_id: 1,
      name: "Trần Phúc Thành (SV)",
      email: "tranphucthanh170502@gmail.com",
      status: "SV",
      tuition: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (ClassMemberService.getStudentsByCourse as jest.Mock).mockResolvedValue(mockStudents);
  });

  it("hiển thị danh sách sinh viên khi load thành công", async () => {
    render(<TeacherStudentListScreen />);
    expect(await screen.findByText("Trần Phúc Thành (SV)")).toBeTruthy();
    expect(screen.getByText("tranphucthanh170502@gmail.com")).toBeTruthy();
    expect(screen.getByText(/Tổng số sinh viên: 1/)).toBeTruthy();
  });

  it("hiển thị thông báo khi không có sinh viên", async () => {
    (ClassMemberService.getStudentsByCourse as jest.Mock).mockResolvedValue([]);
    render(<TeacherStudentListScreen />);
    expect(await screen.findByText(/Không có sinh viên nào trong khóa học này/)).toBeTruthy();
  });

  it("gọi API getStudentsByCourse với đúng courseId", async () => {
    render(<TeacherStudentListScreen />);
    await waitFor(() => {
      expect(ClassMemberService.getStudentsByCourse).toHaveBeenCalledWith(101);
    });
  });

  it("mở modal khi bấm vào một sinh viên", async () => {
    render(<TeacherStudentListScreen />);
    const studentItem = await screen.findByText("Trần Phúc Thành (SV)");
    fireEvent.press(studentItem);
    expect(await screen.findByText(/Email:/)).toBeTruthy();
  });

  it("hiển thị thông báo lỗi khi API thất bại", async () => {
    (ClassMemberService.getStudentsByCourse as jest.Mock).mockRejectedValue(new Error("API error"));
    render(<TeacherStudentListScreen />);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "API error");
    });
  });
});

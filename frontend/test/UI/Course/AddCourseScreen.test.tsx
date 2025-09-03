import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import AddCourseScreen from "../../../screens/Course/AddCourseScreen";
import { UserService } from "../../../services/user.service";
import { SubjectService } from "../../../services/subject.service";
import { Alert } from "react-native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: jest.fn() })
}));

jest.mock("../../../services/user.service");
jest.mock("../../../services/subject.service");
jest.mock("../../../services/course.service");

describe("AddCourseScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đầy đủ các thành phần giao diện chính", async () => {
    (UserService.getAllTeachers as jest.Mock).mockResolvedValue([]);
    (SubjectService.getAll as jest.Mock).mockResolvedValue([]);

    render(<AddCourseScreen />);

   await waitFor(() => {
      expect(screen.getByText("Thêm khóa học khóa học mới")).toBeTruthy();

      expect(screen.getByTestId("subjectPicker")).toBeTruthy();
      expect(screen.getByTestId("teacherPicker")).toBeTruthy();

      expect(screen.getByPlaceholderText("VD: HK1")).toBeTruthy();
      expect(screen.getByPlaceholderText("VD: 2025")).toBeTruthy();
      expect(screen.getByPlaceholderText("VD: 1000000")).toBeTruthy();
      expect(screen.getByPlaceholderText("VD: 12")).toBeTruthy();

      expect(screen.getByText("Danh Sách Lịch Học")).toBeTruthy();
      expect(screen.getByText("Chọn Ngày Học")).toBeTruthy();
      expect(screen.getByText("Chọn Giờ Bắt Đầu")).toBeTruthy();
      expect(screen.getByText("Chọn Giờ Kết Thúc")).toBeTruthy();

      expect(screen.getByLabelText("addScheduleTable")).toBeTruthy();
      expect(screen.getByLabelText("addCourse")).toBeTruthy();
    });
  });

  it("hiển thị alert nếu thiếu dữ liệu khi tạo khóa học", async () => {
    (UserService.getAllTeachers as jest.Mock).mockResolvedValue([]);
    (SubjectService.getAll as jest.Mock).mockResolvedValue([]);
    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    render(<AddCourseScreen />);

    await waitFor(() => screen.getByText("Tạo Khóa Học"));
    fireEvent.press(screen.getByText("Tạo Khóa Học"));

    expect(alertSpy).toHaveBeenCalled();
  });
});

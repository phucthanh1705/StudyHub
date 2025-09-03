import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import EditCourseScreen from "../../../screens/Course/EditCourseScreen";
import { CourseService } from "../../../services/course.service";
import { Alert } from "react-native";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: { id: 1 } }),
}));

jest.mock("../../../services/course.service");

describe("EditCourseScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đầy đủ các thành phần giao diện chính sau khi fetchCourse()", async () => {
    (CourseService.getByIdAdmin as jest.Mock).mockResolvedValue({
      subject_id: 5,
      semester: "1",
      year: 2025,
      price: 1000000,
      numofperiods: 12,
    });

    render(<EditCourseScreen />);

    await waitFor(() => {
      expect(screen.getAllByText("Sửa Khóa Học")).toHaveLength(2);
      expect(
        screen.getByText("Chỉnh sửa thông tin khóa học của bạn")
      ).toBeTruthy();

      expect(screen.getByDisplayValue("5")).toBeTruthy();
      expect(screen.getByDisplayValue("1")).toBeTruthy();
      expect(screen.getByDisplayValue("2025")).toBeTruthy();
      expect(screen.getByDisplayValue("1000000")).toBeTruthy();
      expect(screen.getByDisplayValue("12")).toBeTruthy();

      expect(screen.getByLabelText("saveCourse")).toBeTruthy();
    });
  });

  it("hiển thị alert nếu thiếu dữ liệu khi bấm Lưu", async () => {
    (CourseService.getByIdAdmin as jest.Mock).mockResolvedValue({
      subject_id: "",
      semester: "",
      year: "",
      price: "",
      numofperiods: "",
    });

    const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

    render(<EditCourseScreen />);

    await waitFor(() => screen.getByLabelText("saveCourse"));

    fireEvent.press(screen.getByLabelText("saveCourse"));

    expect(alertSpy).toHaveBeenCalledWith(
      "Lỗi",
      "Vui lòng nhập đầy đủ thông tin."
    );
  });
  it("kiểm tra nút go back", async () => {
    (CourseService.getByIdAdmin as jest.Mock).mockResolvedValue({
      subject_id: 5,
      semester: "1",
      year: 2025,
      price: 1000000,
      numofperiods: 12,
    });

    render(<EditCourseScreen />);

    await waitFor(() => screen.getByLabelText("back"));
    fireEvent.press(screen.getByLabelText("back"));

    expect(mockGoBack).toHaveBeenCalled();
  });

  it("nhập đúng thông tin và sửa thành công", async () => {
    (CourseService.getByIdAdmin as jest.Mock).mockResolvedValue({
      subject_id: 5,
      semester: "1",
      year: 2025,
      price: 1000000,
      numofperiods: 12,
    });
    (CourseService.update as jest.Mock).mockResolvedValue({ success: true });

    render(<EditCourseScreen />);

    await waitFor(() => screen.getByLabelText("saveCourse"));

    fireEvent.changeText(screen.getByPlaceholderText("Mã môn học"), "6");
    fireEvent.changeText(screen.getByPlaceholderText("VD: HK1"), "HK2");
    fireEvent.changeText(screen.getByPlaceholderText("VD: 2025"), "2026");
    fireEvent.changeText(screen.getByPlaceholderText("VD: 1000000"), "2000000");
    fireEvent.changeText(screen.getByPlaceholderText("VD: 12"), "15");

    fireEvent.press(screen.getByLabelText("saveCourse"));

    await waitFor(() => {
      expect(CourseService.update).toHaveBeenCalledWith(1, {
        subject_id: 6,
        semester: "HK2",
        year: 2026,
        price: 2000000,
        numofperiods: 15,
      });
    });
  });
});

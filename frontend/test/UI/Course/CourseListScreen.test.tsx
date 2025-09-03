// test/UI/Course/CourseListScreen.test.tsx
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import CourseListScreen from "../../../../frontend/screens/Course/CourseListScreen";
import { AuthService } from "../../../../frontend/services/auth.service";
import { CourseService } from "../../../../frontend/services/course.service";

// Mock AuthService.getMe
jest.mock("../../../../frontend/services/auth.service", () => ({
  AuthService: {
    getMe: jest.fn(),
  },
}));

// Mock CourseService.getCoursesForStudent
jest.mock("../../../../frontend/services/course.service", () => ({
  CourseService: {
    getCoursesForStudent: jest.fn(),
  },
}));

describe("CourseListScreen - Bỏ qua login", () => {
  it("Hiển thị dữ liệu ở tab Đang học mà không cần đăng nhập", async () => {
    // 1️⃣ Mock trả về user giả
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({
      user_id: 1,
      name: "Test User",
      role_id: 2,
    });

    (CourseService.getCoursesForStudent as jest.Mock).mockResolvedValueOnce({
      completed: [
        {
          course_id: 101,
          subject_name: "Cơ sở lập trình",
          semester: "HK3",
          year: 2025,
          price: 4500000,
        },
      ],
      current: [
        {
          course_id: 1,
          subject_name: "Toán cao cấp",
          semester: "HK3",
          year: 2025,
          price: 4000000,
        },
      ],
      notStarted: [
        {
          course_id: 103,
          subject_name: "Công nghệ phần mềm",
          semester: "HK3",
          year: 2025,
          price: 4000000,
        },
      ],
    });

    render(
      <NavigationContainer>
        <CourseListScreen />
      </NavigationContainer>
    );

    const dangHocBtn = await waitFor(() => screen.getByText("Đang học"), {
      timeout: 3000,
    });
    fireEvent.press(dangHocBtn);

    await waitFor(() => {
      expect(screen.getByText("Toán cao cấp")).toBeTruthy();
      expect(screen.getByText(/4.000.000 VNĐ/)).toBeTruthy();
    });

    const btnDaHoc = screen.getByText("Đã học");
    fireEvent.press(btnDaHoc);
    await waitFor(() => {
      expect(screen.getByText("Cơ sở lập trình")).toBeTruthy();
    });

    const btnChuaHoc = screen.getByText("Chưa học");
    fireEvent.press(btnChuaHoc);
    await waitFor(() => {
      expect(screen.getByText("Công nghệ phần mềm")).toBeTruthy();
    });
  });

  it("Hiển thị 'Chưa có khóa học nào!' khi không đăng nhập", async () => {
    // Giả lập AuthService.getMe trả về lỗi (người dùng chưa đăng nhập)
    (AuthService.getMe as jest.Mock).mockRejectedValueOnce(
      new Error("Not logged in")
    );

    (CourseService.getCoursesForStudent as jest.Mock).mockResolvedValueOnce({
      completed: [],
      current: [],
      notStarted: [],
    });

    render(
      <NavigationContainer>
        <CourseListScreen />
      </NavigationContainer>
    );

    // Kiểm tra text hiển thị "Chưa có khóa học nào!"
    const noCourseText = await screen.findByText("Chưa có khóa học nào!");
    expect(noCourseText).toBeTruthy();
  });
});

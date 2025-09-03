import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import LessonListScreen from "../../../screens/Lesson/LessonListScreen";
import { AuthService } from "../../../services/auth.service";
import { LessonService } from "../../../services/lesson.service";
import { Alert } from "react-native";

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
  useRoute: () => ({ params: { courseId: 1 } }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue("mock-token"),
}));

jest.mock("../../../services/auth.service", () => ({
  AuthService: { getMe: jest.fn() },
}));
jest.mock("../../../services/lesson.service", () => ({
  LessonService: {
    getAllLessons: jest.fn(),
    getLessonsByStudent: jest.fn(),
    deleteLesson: jest.fn(),
  },
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("LessonListScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị loading khi đang tải", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (LessonService.getAllLessons as jest.Mock).mockResolvedValue([]);

    render(<LessonListScreen />);
    expect(screen.getByText("Đang tải danh sách bài học...")).toBeTruthy();

    await waitFor(() => {
      expect(LessonService.getAllLessons).toHaveBeenCalledWith(1);
    });
  });

  it("hiển thị danh sách bài học cho Admin", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (LessonService.getAllLessons as jest.Mock).mockResolvedValue([
      { lesson_id: 101, title: "Lesson 1", content: "Content 1" },
    ]);

    render(<LessonListScreen />);

    await waitFor(() => {
      expect(screen.getByText("Lesson 1")).toBeTruthy();
      expect(screen.getByLabelText("editLesson")).toBeTruthy();
      expect(screen.getByLabelText("deleteLesson")).toBeTruthy();
    });
  });

  it("hiển thị danh sách bài học cho Teacher", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 3 });
    (LessonService.getAllLessons as jest.Mock).mockResolvedValue([
      { lesson_id: 201, title: "Lesson T", content: "Content T" },
    ]);

    render(<LessonListScreen />);

    await waitFor(() => {
      expect(screen.getByText("Lesson T")).toBeTruthy();
      expect(screen.getByLabelText("editLesson")).toBeTruthy();
      expect(screen.getByLabelText("deleteLesson")).toBeTruthy();
    });
  });

  it("hiển thị danh sách bài học cho Student", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 2 });
    (LessonService.getLessonsByStudent as jest.Mock).mockResolvedValue([
      { lesson_id: 301, title: "Lesson S", content: "Content S" },
    ]);

    render(<LessonListScreen />);

    await waitFor(() => {
      expect(screen.getByText("Lesson S")).toBeTruthy();
      expect(screen.queryByLabelText("editLesson")).toBeNull();
      expect(screen.queryByLabelText("deleteLesson")).toBeNull();
    });
  });

  it("xử lý khi xoá bài học", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (LessonService.getAllLessons as jest.Mock).mockResolvedValue([
      { lesson_id: 101, title: "Lesson X", content: "Content X" },
    ]);
    (LessonService.deleteLesson as jest.Mock).mockResolvedValue({});

    render(<LessonListScreen />);

    await waitFor(() => {
      expect(screen.getByText("Lesson X")).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText("deleteLesson"));
    const deleteCallback = (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress;
    await deleteCallback();

    expect(LessonService.deleteLesson).toHaveBeenCalledWith(101);
  });

  it("bấm nút back gọi navigation.goBack", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (LessonService.getAllLessons as jest.Mock).mockResolvedValue([]);

    render(<LessonListScreen />);

    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("back"));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});

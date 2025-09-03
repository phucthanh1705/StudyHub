import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import AddLessonScreen from "../../../screens/Lesson/AddLessonScreen";
import { LessonService } from "../../../services/lesson.service";
import { AuthService } from "../../../services/auth.service";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

// Mock navigation + route
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: { courseId: 99 } }),
}));

// Mock service
jest.mock("../../../services/lesson.service", () => ({
  LessonService: { createLesson: jest.fn() },
}));
jest.mock("../../../services/auth.service", () => ({
  AuthService: { getMe: jest.fn() },
}));

// Mock DocumentPicker
jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("AddLessonScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gọi fetchRole khi load màn hình và set đúng roleId", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });
    render(<AddLessonScreen />);
    await waitFor(() => {
      expect(AuthService.getMe).toHaveBeenCalled();
    });
  });

  it("bấm nút back → gọi navigation.goBack", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });
    render(<AddLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("back"));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it("bấm Chọn file PDF → chọn thành công", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "uri.pdf", name: "test.pdf", mimeType: "application/pdf" }],
    });
    render(<AddLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("pickPDFFile"));
    });
    await waitFor(() => {
      expect(screen.getByText(/Đã chọn: test.pdf/)).toBeTruthy();
    });
  });

  it("bấm Chọn file PDF → cancel", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({ canceled: true });
    render(<AddLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("pickPDFFile"));
    });
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Thông báo", "Bạn đã hủy chọn file PDF.");
    });
  });

  it("bấm Thêm bài học khi role không phải admin/teacher", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 2 }); // student
    render(<AddLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("addLesson"));
      expect(Alert.alert).toHaveBeenCalledWith("Thông báo", "Bạn không có quyền thêm bài học.");
    });
  });

  it("bấm Thêm bài học khi thiếu tiêu đề hoặc nội dung", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });
    render(<AddLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("addLesson"));
      expect(Alert.alert).toHaveBeenCalledWith("Thông báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung.");
    });
  });

  it("bấm Thêm bài học khi chưa chọn file PDF", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });
    render(<AddLessonScreen />);
    await waitFor(() => {
      fireEvent.changeText(screen.getByPlaceholderText("Tiêu đề bài học"), "Tiêu đề");
      fireEvent.changeText(screen.getByPlaceholderText("Nội dung chi tiết"), "Nội dung");
      fireEvent.press(screen.getByLabelText("addLesson"));
      expect(Alert.alert).toHaveBeenCalledWith("Thông báo", "Vui lòng chọn file PDF cho bài học.");
    });
  });

  it("bấm Thêm bài học hợp lệ → gọi API và Alert thành công", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });
    (LessonService.createLesson as jest.Mock).mockResolvedValueOnce({ title: "Tiêu đề" });
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "uri.pdf", name: "test.pdf", mimeType: "application/pdf" }],
    });

    render(<AddLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("pickPDFFile"));
    });
    await waitFor(() => {
      fireEvent.changeText(screen.getByPlaceholderText("Tiêu đề bài học"), "Tiêu đề");
      fireEvent.changeText(screen.getByPlaceholderText("Nội dung chi tiết"), "Nội dung");
      fireEvent.press(screen.getByLabelText("addLesson"));
    });
    await waitFor(() => {
      expect(LessonService.createLesson).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith("Thành công", expect.any(String));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it("API tạo bài học lỗi → Alert lỗi", async () => {
  // Mock role là admin để qua bước kiểm tra quyền
  (AuthService.getMe as jest.Mock).mockResolvedValueOnce({ role_id: 1 });

  // Mock file PDF đã chọn
  (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({
    canceled: false,
    assets: [{ uri: "uri.pdf", name: "test.pdf", mimeType: "application/pdf" }],
  });

  // Mock API lỗi
  (LessonService.createLesson as jest.Mock).mockRejectedValueOnce(new Error("Lỗi tạo"));

  render(<AddLessonScreen />);

  // Chọn file PDF
  await waitFor(() => {
    fireEvent.press(screen.getByLabelText("pickPDFFile"));
  });

  // Nhập tiêu đề + nội dung
  await waitFor(() => {
    fireEvent.changeText(screen.getByPlaceholderText("Tiêu đề bài học"), "Tiêu đề");
    fireEvent.changeText(screen.getByPlaceholderText("Nội dung chi tiết"), "Nội dung");
  });

  // Bấm Thêm bài học
  await waitFor(() => {
    fireEvent.press(screen.getByLabelText("addLesson"));
  });

  // Kiểm tra Alert lỗi được gọi
  await waitFor(() => {
    expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Lỗi tạo");
  });
});

});

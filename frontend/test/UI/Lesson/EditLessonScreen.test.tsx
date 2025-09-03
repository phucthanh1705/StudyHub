import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import EditLessonScreen from "../../../screens/Lesson/EditLessonScreen";
import { LessonService } from "../../../services/lesson.service";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: { lessonId: 1 } }),
}));

jest.mock("../../../services/lesson.service", () => ({
  LessonService: {
    getLessonById: jest.fn(),
    updateLesson: jest.fn(),
  },
}));

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("EditLessonScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị loading khi đang tải dữ liệu", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({});
    render(<EditLessonScreen />);
    expect(screen.getByText("Đang tải dữ liệu bài học...")).toBeTruthy();
  });

  it("hiển thị dữ liệu khi fetchLesson thành công", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      title: "Bài 1",
      content: "Nội dung bài 1",
      file: "file.pdf",
    });

    render(<EditLessonScreen />);
    await waitFor(() => {
      expect(screen.getByDisplayValue("Bài 1")).toBeTruthy();
      expect(screen.getByDisplayValue("Nội dung bài 1")).toBeTruthy();
      expect(screen.getByText("file.pdf")).toBeTruthy();
    });
  });

  it("fetchLesson lỗi hiện Alert và gọi goBack", async () => {
    (LessonService.getLessonById as jest.Mock).mockRejectedValueOnce(new Error("Lỗi server"));
    render(<EditLessonScreen />);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Lỗi server");
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it("bấm nút back gọi navigation.goBack", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({});
    render(<EditLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("back"));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it("bấm nút Chọn file PDF mới set state file mới", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({});
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: "uri.pdf", name: "newfile.pdf", mimeType: "application/pdf" }],
    });

    render(<EditLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("pickPDFFile"));
    });

    await waitFor(() => {
      expect(screen.getByText(/Đã chọn: newfile.pdf/)).toBeTruthy();
    });
  });

  it("bấm Cập nhật bài học khi thiếu tiêu đề hoặc nội dung Alert cảnh báo", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      title: "",
      content: "",
      file: "",
    });

    render(<EditLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("updateLesson"));
      expect(Alert.alert).toHaveBeenCalledWith("Thông báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung.");
    });
  });

  it("cập nhật bài học hợp lệ gọi API + Alert thành công + goBack", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      title: "Bài 1",
      content: "Nội dung",
      file: "file.pdf",
    });
    (LessonService.updateLesson as jest.Mock).mockResolvedValueOnce({});
    
    render(<EditLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("updateLesson"));
    });

    await waitFor(() => {
      expect(LessonService.updateLesson).toHaveBeenCalledWith(1, {
        title: "Bài 1",
        content: "Nội dung",
        file: undefined,
      });
      expect(Alert.alert).toHaveBeenCalledWith("Thành công", "Cập nhật bài học thành công.");
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it("API update lỗi hiện Alert lỗi", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      title: "Bài 1",
      content: "Nội dung",
      file: "file.pdf",
    });
    (LessonService.updateLesson as jest.Mock).mockRejectedValueOnce(new Error("Lỗi update"));

    render(<EditLessonScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("updateLesson"));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Lỗi update");
    });
  });
});

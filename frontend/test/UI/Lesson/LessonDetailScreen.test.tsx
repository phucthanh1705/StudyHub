import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react-native";
import LessonDetailScreen from "../../../screens/Lesson/LessonDetailScreen";
import { LessonService } from "../../../services/lesson.service";
import { Alert, Linking } from "react-native";

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
  useRoute: () => ({ params: { lessonId: 1 } }),
}));

jest.mock("../../../services/lesson.service", () => ({
  LessonService: { getLessonById: jest.fn() },
}));

jest.mock("../../../src/config", () => ({
  getPdfUrl: (file: string) => `http://mock-server/${file}`,
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});
jest.spyOn(Linking, "openURL").mockResolvedValue(undefined as any);

describe("LessonDetailScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị loading khi đang tải dữ liệu", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({});
    render(<LessonDetailScreen />);
    expect(screen.getByText("Đang tải bài học...")).toBeTruthy();
  });

  it("hiển thị thông tin khi fetchLesson thành công", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      lesson_id: 1,
      title: "Bài học 1",
      content: "Nội dung bài học",
      file_pdf: "file.pdf",
    });

    render(<LessonDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Bài học 1")).toBeTruthy();
      expect(screen.getByText("Nội dung bài học")).toBeTruthy();
      expect(screen.getByLabelText("openPDFFile")).toBeTruthy();
      expect(screen.getByLabelText("openAssignmentList")).toBeTruthy();
    });
  });

  it("hiển thị thông báo khi không tìm thấy bài học", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce(null);
    render(<LessonDetailScreen />);

    await waitFor(() => {
      expect(
        screen.getByText("Chưa có nội dung cho bài học này.")
      ).toBeTruthy();
    });
  });

  it("bấm nút back gọi navigation.goBack", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      lesson_id: 1,
      title: "Bài học",
    });
    render(<LessonDetailScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("back"));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it("bấm nút mở file PDF gọi Linking.openURL", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      lesson_id: 1,
      title: "Bài học PDF",
      file_pdf: "file.pdf",
    });

    render(<LessonDetailScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("openPDFFile"));
      expect(Linking.openURL).toHaveBeenCalledWith(
        "http://mock-server/file.pdf"
      );
    });
  });

  it("không có file PDF hiện Alert lỗi khi bấm nút", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      lesson_id: 1,
      title: "Bài học không PDF",
      file_pdf: null,
    });

    render(<LessonDetailScreen />);

    await waitFor(() => {
      const pdfButton = screen.queryByLabelText("openPDFFile");
      expect(pdfButton).toBeNull();
      expect(
        screen.getByText("Chưa có nội dung cho bài học này.")
      ).toBeTruthy();
    });
  });

  it("bấm nút Xem bài tập điều hướng sang AssignmentList", async () => {
    (LessonService.getLessonById as jest.Mock).mockResolvedValueOnce({
      lesson_id: 1,
      title: "Bài học",
    });

    render(<LessonDetailScreen />);
    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("openAssignmentList"));
      expect(mockNavigate).toHaveBeenCalledWith("AssignmentList", {
        lessonId: 1,
      });
    });
  });

  it("fetchLesson lỗi hiện Alert và gọi goBack", async () => {
    (LessonService.getLessonById as jest.Mock).mockRejectedValueOnce(
      new Error("Lỗi server")
    );
    render(<LessonDetailScreen />);
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Lỗi server");
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});

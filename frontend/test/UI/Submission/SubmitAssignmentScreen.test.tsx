import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import SubmitAssignmentScreen from "../../../screens/Submission/SubmitAssignmentScreen";
import { Alert } from "react-native";
import { SubmissionService } from "../../../services/submission.service";

// Mock navigation + route
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({
    params: {
      assignment: {
        assignment_id: 1,
        title: "Bai tap 1",
      },
    },
  }),
}));

// Mock service
jest.mock("../../../services/submission.service", () => ({
  SubmissionService: {
    createSubmission: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("SubmitAssignmentScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đầy đủ thông tin ban đầu", () => {
    render(<SubmitAssignmentScreen />);
    expect(screen.getByText("Bài tập: Bai tap 1")).toBeTruthy();
    expect(screen.getByPlaceholderText("Nhập nội dung bài làm...")).toBeTruthy();
    expect(screen.getByPlaceholderText("Link bài làm (Google Drive)...")).toBeTruthy();
    expect(screen.getByText("Nộp bài")).toBeTruthy();
    expect(screen.getByText("Hãy hoàn thành bài tập đúng hạn!")).toBeTruthy();
  });

  it("bấm nút back → gọi navigation.goBack", () => {
    render(<SubmitAssignmentScreen />);
    fireEvent.press(screen.getByLabelText("back"));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("bấm nộp khi chưa nhập gì hiện Alert thông báo", () => {
    render(<SubmitAssignmentScreen />);
    fireEvent.press(screen.getByLabelText("submissionAssignment"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Thông báo",
      "Vui lòng nhập nội dung bài làm hoặc link Google Drive!"
    );
  });

  it("bấm nộp khi nhập dữ liệu hợp lệ gọi API + Alert thành công + goBack", async () => {
    (SubmissionService.createSubmission as jest.Mock).mockResolvedValueOnce({});
    render(<SubmitAssignmentScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Nhập nội dung bài làm..."), "Nội dung bài");
    fireEvent.changeText(screen.getByPlaceholderText("Link bài làm (Google Drive)..."), "http://drive.com");

    fireEvent.press(screen.getByLabelText("submissionAssignment"));

    await waitFor(() => {
      expect(SubmissionService.createSubmission).toHaveBeenCalledWith({
        assignment_id: 1,
        content: "Nội dung bài",
        drive_link: "http://drive.com",
      });
      expect(Alert.alert).toHaveBeenCalledWith("Thành công", "Đã nộp bài cho Bai tap 1");
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it("API lỗi hiện Alert lỗi", async () => {
    (SubmissionService.createSubmission as jest.Mock).mockRejectedValueOnce(new Error("Lỗi server"));
    render(<SubmitAssignmentScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Nhập nội dung bài làm..."), "Nội dung bài");
    fireEvent.press(screen.getByLabelText("submissionAssignment"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Lỗi server");
    });
  });
});

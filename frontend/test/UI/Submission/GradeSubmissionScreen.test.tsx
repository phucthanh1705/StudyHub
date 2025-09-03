import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import GradeSubmissionScreen from "../../../screens/Submission/GradeSubmissionScreen";
import { Alert } from "react-native";
import { SubmissionService } from "../../../services/submission.service";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({
    params: {
      submission: {
        submission_id: 1,
        studentName: "Nguyen Student",
        score: 10,
        feedback: "Good job",
      },
    },
  }),
}));

jest.mock("../../../services/submission.service", () => ({
  SubmissionService: {
    gradeSubmission: jest.fn(),
  },
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("GradeSubmissionScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đầy đủ thông tin ban đầu", () => {
    render(<GradeSubmissionScreen />);
    expect(screen.getByPlaceholderText("Nhập điểm (0 - 10)")).toBeTruthy();
    expect(screen.getByPlaceholderText("Nhận xét")).toBeTruthy();
    expect(screen.getByText("Lưu điểm")).toBeTruthy();
    expect(screen.getByText("Hãy đánh giá công bằng và khách quan!")).toBeTruthy();
  });

  it("bấm nút back gọi navigation.goBack", () => {
    render(<GradeSubmissionScreen />);
    fireEvent.press(screen.getByLabelText("back"));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("bấm lưu khi chưa nhập điểm hiển thị Alert lỗi", () => {
    render(<GradeSubmissionScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("Nhập điểm (0 - 10)"), "");
    fireEvent.press(screen.getByLabelText("saveGrade"));
    expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Vui lòng nhập điểm!");
  });

  it("nhập điểm không hợp lệ hiển thị Alert lỗi", () => {
    render(<GradeSubmissionScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("Nhập điểm (0 - 10)"), "20");
    fireEvent.press(screen.getByLabelText("saveGrade"));
    expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Điểm phải nằm trong khoảng 0 - 10.");
  });

  it("nhập điểm hợp lệ gọi API + Alert thành công + goBack", async () => {
    (SubmissionService.gradeSubmission as jest.Mock).mockResolvedValueOnce({});
    render(<GradeSubmissionScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Nhập điểm (0 - 10)"), "9");
    fireEvent.changeText(screen.getByPlaceholderText("Nhận xét"), "Good job");

    fireEvent.press(screen.getByLabelText("saveGrade"));

    await waitFor(() => {
      expect(SubmissionService.gradeSubmission).toHaveBeenCalledWith(1, {
        score: 9,
        feedback: "Good job",
      });
      expect(Alert.alert).toHaveBeenCalledWith(
        "Thành công",
        expect.stringContaining("Đã chấm điểm cho HS: Nguyen Student")
      );
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it("API lỗi hiển thị Alert lỗi", async () => {
    (SubmissionService.gradeSubmission as jest.Mock).mockRejectedValueOnce(new Error("Lỗi server"));
    render(<GradeSubmissionScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Nhập điểm (0 - 10)"), "8");
    fireEvent.press(screen.getByLabelText("saveGrade"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Lỗi", "Lỗi server");
    });
  });
});

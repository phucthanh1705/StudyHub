import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import SubmissionDetailScreen from "../../../screens/Submission/SubmissionDetailScreen";
import { Alert, Linking } from "react-native";

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack, navigate: mockNavigate }),
  useRoute: () => ({
    params: {
      submission: {
        student_name: "Nguyen Student",
        submitted_at: "2025-08-04T11:10:18.000Z",
        score: 10,
        feedback: "Tốt",
        content: "Bai tap1",
        drive_link: "http://example.com",
      },
    },
  }),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});
jest.spyOn(Linking, "openURL").mockResolvedValue(undefined as any);

describe("SubmissionDetailScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đầy đủ thông tin bài nộp", () => {
    render(<SubmissionDetailScreen />);

    expect(screen.getByText("Tên học sinh: Nguyen Student")).toBeTruthy();

    const expectedSubmittedAt = `Nộp lúc: ${new Date("2025-08-04T11:10:18.000Z").toLocaleDateString()} ${new Date(
      "2025-08-04T11:10:18.000Z"
    ).toLocaleTimeString()}`;
    expect(screen.getByText(expectedSubmittedAt)).toBeTruthy();

    expect(screen.getByText("Điểm: 10")).toBeTruthy();
    expect(screen.getByText("Đánh giá: Tốt")).toBeTruthy();
    expect(screen.getByText("Nội dung bài làm:")).toBeTruthy();
    expect(screen.getByText("Bai tap1")).toBeTruthy();
    expect(screen.getByText("Link bài nộp (Google Drive)")).toBeTruthy();
    expect(screen.getByText("Chấm điểm")).toBeTruthy();
    expect(
      screen.getByText("Đánh giá bài làm để hỗ trợ sinh viên tốt hơn!")
    ).toBeTruthy();
  });

  it("bấm nút back gọi navigation.goBack", () => {
    render(<SubmissionDetailScreen />);
    fireEvent.press(screen.getByLabelText("back"));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("bấm vào link Google Drive gọi Linking.openURL", () => {
    render(<SubmissionDetailScreen />);
    fireEvent.press(screen.getByText("Link bài nộp (Google Drive)"));
    expect(Linking.openURL).toHaveBeenCalledWith("http://example.com");
  });

  it("bấm nút 'Chấm điểm' điều hướng sang GradeSubmissionScreen", () => {
    render(<SubmissionDetailScreen />);
    fireEvent.press(screen.getByLabelText("goGradeSubmission"));
    expect(mockNavigate).toHaveBeenCalledWith("GradeSubmissionScreen", {
      submission: expect.any(Object),
    });
  });
});

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import SubmittedAssignmentsScreen from "../../../screens/Submission/SubmittedAssignmentsScreen";
import { SubmissionService } from "../../../services/submission.service";

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
}));

jest.mock("../../../services/submission.service");

describe("SubmittedAssignmentsScreen UI", () => {
  const mockData = [
    {
      submission_id: 1,
      assignment_title: "Bai tap 1",
      submitted_at: "2025-08-04T11:10:18.000Z",
      score: 10,
      feedback: "Good job",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị trạng thái loading khi đang tải dữ liệu", async () => {
    (SubmissionService.getSubmissionsByUser as jest.Mock).mockResolvedValueOnce(mockData);

    render(<SubmittedAssignmentsScreen />);
    expect(screen.getByText("Đang tải danh sách bài đã nộp...")).toBeTruthy();
    await waitFor(() => expect(SubmissionService.getSubmissionsByUser).toHaveBeenCalled());
  });

  it("hiển thị danh sách bài nộp khi có dữ liệu đầy đủ", async () => {
  (SubmissionService.getSubmissionsByUser as jest.Mock).mockResolvedValueOnce(mockData);

  render(<SubmittedAssignmentsScreen />);

  const submittedAtText = `Nộp lúc: ${new Date(mockData[0].submitted_at).toLocaleDateString()} ${new Date(mockData[0].submitted_at).toLocaleTimeString()}`;

  await waitFor(() => {
    expect(screen.getByText("Bai tap 1")).toBeTruthy();
    expect(screen.getByText(submittedAtText)).toBeTruthy();
    expect(screen.getByText("Điểm: 10")).toBeTruthy();
  });
});


  it("hiển thị trạng thái trống khi không có bài nộp", async () => {
    (SubmissionService.getSubmissionsByUser as jest.Mock).mockResolvedValueOnce([]);

    render(<SubmittedAssignmentsScreen />);
    await waitFor(() => {
      expect(screen.getByText("Bạn chưa nộp bài tập nào.")).toBeTruthy();
    });
  });

  it("xử lý lỗi khi tải dữ liệu thất bại", async () => {
    const mockError = new Error("Không thể tải danh sách bài nộp.");
    (SubmissionService.getSubmissionsByUser as jest.Mock).mockRejectedValueOnce(mockError);

    render(<SubmittedAssignmentsScreen />);
    await waitFor(() => {
      expect(screen.getByText("Bạn chưa nộp bài tập nào.")).toBeTruthy();
    });
  });

  it("bấm nút back → gọi navigation.goBack", async () => {
  (SubmissionService.getSubmissionsByUser as jest.Mock).mockResolvedValueOnce(mockData);

  render(<SubmittedAssignmentsScreen />);

  await waitFor(() => {
    fireEvent.press(screen.getByLabelText("back"));
    expect(mockGoBack).toHaveBeenCalled();
  });
});


});

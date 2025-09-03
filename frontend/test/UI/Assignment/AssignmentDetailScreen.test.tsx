// test/UI/AssignmentDetailScreen.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import AssignmentDetailScreen from "../../../screens/Assignment/AssignmentDetailScreen";
import { AuthService } from "../../../services/auth.service";
import { AssignmentService } from "../../../services/assignment.service";
import { SubmissionService } from "../../../services/submission.service";

// Mock navigation & route
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({
    params: {
      assignment: { assignment_id: 1, title: "Bài tập A" },
    },
  }),
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
}));

// Mock services
jest.mock("../../../services/auth.service", () => ({
  AuthService: { getMe: jest.fn() },
}));
jest.mock("../../../services/assignment.service", () => ({
  AssignmentService: { getAssignmentById: jest.fn() },
}));
jest.mock("../../../services/submission.service", () => ({
  SubmissionService: { getSubmissionsByAssignment: jest.fn() },
}));

describe("AssignmentDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị trạng thái loading ban đầu", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 2 });
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({});
    (SubmissionService.getSubmissionsByAssignment as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<AssignmentDetailScreen />);
    expect(getByText("Đang tải dữ liệu...")).toBeTruthy();

    await waitFor(() => {
      expect(AuthService.getMe).toHaveBeenCalled();
    });
  });

  it("role = 2 (student) → hiển thị nút Nộp bài tập", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 2 });
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({
      title: "Bài tập 1",
      description: "Mô tả",
      due_date_start: "2025-08-01",
      due_date_end: "2025-08-10",
      status: "đang mở",
    });
    (SubmissionService.getSubmissionsByAssignment as jest.Mock).mockResolvedValue([]);

    render(<AssignmentDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Nộp bài tập")).toBeTruthy();
    });
  });

  it("role ≠ 2 (teacher/admin) → hiển thị danh sách bài nộp", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({
      title: "Bài tập 2",
      description: "Mô tả",
      due_date_start: "2025-08-01",
      due_date_end: "2025-08-10",
      status: "đang mở",
    });
    (SubmissionService.getSubmissionsByAssignment as jest.Mock).mockResolvedValue([
      {
        submission_id: 101,
        content: "Bài nộp 1",
        submitted_at: "2025-08-03",
        score: 10,
      },
    ]);

    render(<AssignmentDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Bài nộp 1")).toBeTruthy();
      expect(screen.getByText(/Điểm: 10/)).toBeTruthy();
    });
  });

  it("nhấn nút back → gọi navigation.goBack()", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 2 });
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({});
    (SubmissionService.getSubmissionsByAssignment as jest.Mock).mockResolvedValue([]);

    render(<AssignmentDetailScreen />);

    await waitFor(() => {
      const backBtn = screen.getByLabelText("back");
      fireEvent.press(backBtn);
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});

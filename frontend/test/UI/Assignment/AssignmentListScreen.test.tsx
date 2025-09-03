// test/UI/AssignmentListScreen.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import AssignmentListScreen from "../../../screens/Assignment/AssignmentListScreen";
import { AuthService } from "../../../services/auth.service";
import { AssignmentService } from "../../../services/assignment.service";
import { Alert } from "react-native";

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useRoute: () => ({ params: { lessonId: 999 } }),
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
    addListener: (_: string, cb: any) => {
      cb();
      return jest.fn();
    },
  }),
}));

jest.mock("../../../services/auth.service", () => ({
  AuthService: { getMe: jest.fn() },
}));

jest.mock("../../../services/assignment.service", () => ({
  AssignmentService: {
    getAssignmentsByLesson: jest.fn(),
    deleteAssignment: jest.fn(),
  },
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("AssignmentListScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị loading ban đầu", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (AssignmentService.getAssignmentsByLesson as jest.Mock).mockResolvedValue([]);

    render(<AssignmentListScreen />);
    expect(screen.getByText("Đang tải danh sách bài tập...")).toBeTruthy();
    await waitFor(() => {
      expect(AuthService.getMe).toHaveBeenCalled();
      expect(AssignmentService.getAssignmentsByLesson).toHaveBeenCalledWith(999);
    });
  });

  it("hiển thị danh sách bài tập khi fetch thành công", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (AssignmentService.getAssignmentsByLesson as jest.Mock).mockResolvedValue([
      { assignment_id: 1, title: "BÀI TẬP 1", due_date_end: "2025-08-09", status: "đã giao" },
    ]);

    render(<AssignmentListScreen />);

    await waitFor(() => {
      expect(screen.getByText("BÀI TẬP 1")).toBeTruthy();
      expect(screen.getByText(/đã giao/)).toBeTruthy();
    });
  });

  it("role admin/teacher → hiển thị nút thêm bài tập", async () => {
  (AuthService.getMe as jest.Mock).mockResolvedValue({
    id: 123,
    full_name: "Admin A",
    email: "a@example.com",
    role_id: 3, // 1 = admin
  });
    (AssignmentService.getAssignmentsByLesson as jest.Mock).mockResolvedValue([]);

    render(<AssignmentListScreen />);

    // await waitFor(() => {
    //   expect(screen.getByLabelText("addAssignment")).toBeTruthy();
    // });
    const addBtn = await screen.findByLabelText("addAssignment");
    expect(addBtn).toBeTruthy();
  });

  it("role student → hiển thị nút xem bài đã nộp", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 2 });
    (AssignmentService.getAssignmentsByLesson as jest.Mock).mockResolvedValue([]);

    render(<AssignmentListScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText("goSubmittedList")).toBeTruthy();
    });
  });

  it("nhấn vào một assignment → điều hướng đến AssignmentDetail", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (AssignmentService.getAssignmentsByLesson as jest.Mock).mockResolvedValue([
      { assignment_id: 1, title: "Bài Tập Test", due_date_end: "2025-08-09", status: "đã giao" },
    ]);

    render(<AssignmentListScreen />);

    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("goAssignmentDetail"));
      expect(mockNavigate).toHaveBeenCalledWith("AssignmentDetail", {
        assignment: expect.objectContaining({ assignment_id: 1 }),
      });
    });
  });

  it("nhấn nút back → gọi navigation.goBack", async () => {
    (AuthService.getMe as jest.Mock).mockResolvedValue({ role_id: 1 });
    (AssignmentService.getAssignmentsByLesson as jest.Mock).mockResolvedValue([]);

    render(<AssignmentListScreen />);

    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("back"));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});

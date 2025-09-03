// test/UI/EditAssignmentScreen.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react-native";
import EditAssignmentScreen from "../../../screens/Assignment/EditAssignmentScreen";
import { AssignmentService } from "../../../services/assignment.service";
import { Alert } from "react-native";

// Mock navigation & route
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: { assignmentId: 123 } }),
}));

// Mock AssignmentService
jest.mock("../../../services/assignment.service", () => ({
  AssignmentService: {
    getAssignmentById: jest.fn(),
    updateAssignment: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("EditAssignmentScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị trạng thái loading ban đầu", async () => {
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({
      title: "Bài tập 1",
      description: "Mô tả",
      due_date_start: "2025-08-04",
      due_date_end: "2025-08-09",
      link_drive: "drive",
    });

    render(<EditAssignmentScreen />);
    expect(screen.getByText("Đang tải dữ liệu...")).toBeTruthy();

    await waitFor(() => {
      expect(AssignmentService.getAssignmentById).toHaveBeenCalledWith(123);
    });
  });

  it("fetchAssignment thành công → hiển thị dữ liệu đúng", async () => {
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({
      title: "Bài tập 1",
      description: "Mô tả bài tập",
      due_date_start: "2025-08-04",
      due_date_end: "2025-08-09",
      link_drive: "drive",
    });

    render(<EditAssignmentScreen />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Bài tập 1")).toBeTruthy();
      expect(screen.getByDisplayValue("Mô tả bài tập")).toBeTruthy();
      expect(screen.getByDisplayValue("drive")).toBeTruthy();
    });
  });

  it("nhấn Lưu thay đổi khi thiếu thông tin → hiện Alert", async () => {
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({
      title: "",
      description: "",
      due_date_start: "2025-08-04",
      due_date_end: "2025-08-09",
      link_drive: "",
    });

    render(<EditAssignmentScreen />);

    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("saveEditAssignment"));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Thông báo",
        "Vui lòng nhập đầy đủ thông tin!"
      );
    });
  });

  it("nhấn Lưu thay đổi khi đủ thông tin → gọi updateAssignment", async () => {
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({
      title: "Bài tập 1",
      description: "Mô tả bài tập",
      due_date_start: "2025-08-04",
      due_date_end: "2025-08-09",
      link_drive: "drive",
    });

    (AssignmentService.updateAssignment as jest.Mock).mockResolvedValue({});

    render(<EditAssignmentScreen />);

    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("saveEditAssignment"));
      expect(AssignmentService.updateAssignment).toHaveBeenCalledWith(
        123,
        expect.objectContaining({
          title: "Bài tập 1",
          description: "Mô tả bài tập",
          link_drive: "drive",
        })
      );
    });
  });

  it("nhấn nút back → gọi navigation.goBack", async () => {
    (AssignmentService.getAssignmentById as jest.Mock).mockResolvedValue({
      title: "Bài tập 1",
      description: "Mô tả",
      due_date_start: "2025-08-04",
      due_date_end: "2025-08-09",
      link_drive: "drive",
    });

    render(<EditAssignmentScreen />);

    await waitFor(() => {
      fireEvent.press(screen.getByLabelText("back"));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});

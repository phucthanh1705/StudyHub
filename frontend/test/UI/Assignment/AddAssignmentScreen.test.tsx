import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import AddAssignmentScreen from "../../../screens/Assignment/AddAssignmentScreen";
import { AssignmentService } from "../../../services/assignment.service";
import { Alert } from "react-native";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: () => ({ params: { lessonId: 3 } }),
}));

jest.mock("../../../services/assignment.service", () => ({
  AssignmentService: {
    createAssignment: jest.fn(),
  },
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("AddAssignmentScreen UI", () => {
  it("hiển thị đầy đủ các thành phần UI chính", () => {
    render(<AddAssignmentScreen />);

    expect(screen.getByText("Thêm Bài Tập")).toBeTruthy();
    expect(screen.getByText("Thêm bài tập cho Lesson 3")).toBeTruthy();
    expect(screen.getByPlaceholderText("Tiêu đề bài tập")).toBeTruthy();
    expect(screen.getByPlaceholderText("Mô tả bài tập")).toBeTruthy();
    expect(screen.getByText(/Ngày bắt đầu:/)).toBeTruthy();
    expect(screen.getByText(/Hạn nộp:/)).toBeTruthy();
    expect(screen.getByPlaceholderText("Link bài tập (Google Drive)")).toBeTruthy();
    expect(screen.getByLabelText("addAssignment")).toBeTruthy(); 
  });

  it("hiển thị cảnh báo nếu nhấn Thêm bài tập khi chưa nhập đủ thông tin", () => {
    render(<AddAssignmentScreen />);

    const addButton = screen.getByLabelText("addAssignment");
    fireEvent.press(addButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Thông báo",
      "Vui lòng nhập đầy đủ thông tin!"
    );
  });

  it("gửi dữ liệu khi nhập đầy đủ thông tin và nhấn Thêm bài tập", async () => {
    const createMock = AssignmentService.createAssignment as jest.Mock;
    createMock.mockResolvedValueOnce({});

    render(<AddAssignmentScreen />);

    fireEvent.changeText(screen.getByPlaceholderText("Tiêu đề bài tập"), "Bài tập 1");
    fireEvent.changeText(screen.getByPlaceholderText("Mô tả bài tập"), "Mô tả chi tiết");
    fireEvent.changeText(
      screen.getByPlaceholderText("Link bài tập (Google Drive)"),
      "https://drive.google.com"
    );

    fireEvent.press(screen.getByLabelText("addAssignment"));

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
    });
  });
});

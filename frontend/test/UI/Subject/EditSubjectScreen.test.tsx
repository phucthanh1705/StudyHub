import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import EditSubjectScreen from "../../../screens/Subject/EditSubjectScreen";
import { SubjectService } from "../../../services/subject.service";

// Mock navigation
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: { id: 1 },
    }),
  };
});

// Mock service
jest.mock("../../../services/subject.service", () => ({
  SubjectService: {
    getById: jest.fn(),
    update: jest.fn(),
  },
}));

describe("EditSubjectScreen UI", () => {
  const mockSubject = {
    subject_id: 1,
    name: "Toán cao cấp",
    description: "Học về tập hợp và logic",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Hiển thị đầy đủ các thành phần giao diện", async () => {
    (SubjectService.getById as jest.Mock).mockResolvedValue(mockSubject);

    render(<EditSubjectScreen />);

    // Chờ dữ liệu load xong
    await waitFor(() => {
      expect(screen.getByText("Sửa Môn Học")).toBeTruthy();
    });

    // Kiểm tra label
    expect(screen.getByText("Tên môn học")).toBeTruthy();
    expect(screen.getByText("Mô tả môn học")).toBeTruthy();

    // Kiểm tra placeholder
    expect(screen.getByPlaceholderText("Tên môn học")).toBeTruthy();
    expect(screen.getByPlaceholderText("Mô tả môn học")).toBeTruthy();

    // Kiểm tra giá trị đã load sẵn
    expect(screen.getByDisplayValue("Toán cao cấp")).toBeTruthy();
    expect(screen.getByDisplayValue("Học về tập hợp và logic")).toBeTruthy();

    // Nút lưu
    expect(screen.getByText("Lưu")).toBeTruthy();
  });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import SubjectListScreen from "../../../screens/Subject/SubjectListScreen";
import { SubjectService } from "../../../services/subject.service";

// Mock navigation
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      goBack: jest.fn(),
      navigate: jest.fn(),
      addListener: (_event: string, callback: () => void) => {
        callback(); // Gọi luôn để fetchSubjects chạy
        return jest.fn();
      },
    }),
  };
});

// Mock API
jest.mock("../../../services/subject.service", () => ({
  SubjectService: {
    getAll: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("SubjectListScreen UI & Data", () => {
  const mockSubjects = [
    {
      subject_id: 1,
      name: "Toán cao cấp",
      description: "Học về tập hợp và logic",
      created_at: "2025-08-01T00:00:00Z",
    },
    {
      subject_id: 2,
      name: "Lập trình di động",
      description: "Học lập trình bằng Flutter và React Native",
      created_at: "2025-08-01T00:00:00Z",
    },
    {
      subject_id: 3,
      name: "Công nghệ phần mềm",
      description: "Học về lập trình và thiết kế phần mềm",
      created_at: "2025-08-01T00:00:00Z",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Hiển thị đúng các phần tử giao diện", async () => {
    (SubjectService.getAll as jest.Mock).mockResolvedValue(mockSubjects); 

    render(<SubjectListScreen />);

    await waitFor(() => {
      expect(screen.getByText("Môn học")).toBeTruthy();
    });

    expect(screen.getByText(/Danh sách môn học/i)).toBeTruthy();
    const searchInput = await screen.findByPlaceholderText(/Tìm kiếm môn học.../i);
    expect(searchInput).toBeTruthy();
    expect(await screen.findByLabelText(`addSubject`)).toBeTruthy();
  });

  it("Hiển thị danh sách môn học từ API mock", async () => {
    (SubjectService.getAll as jest.Mock).mockResolvedValue(mockSubjects);

    render(<SubjectListScreen />);

    await waitFor(() => {
      expect(screen.getByText("Toán cao cấp")).toBeTruthy();
      expect(screen.getByText("Lập trình di động")).toBeTruthy();
      expect(screen.getByText("Công nghệ phần mềm")).toBeTruthy();
    });
    await waitFor(() => {
      expect(screen.getByText(/Học về tập hợp và logic/i)).toBeTruthy();
      expect(screen.getByText(/Flutter/i)).toBeTruthy();
      expect(screen.getByText(/thiết kế phần mềm/i)).toBeTruthy();
    });
  });
  it("Hiển thị nút Sửa và Xóa cho mỗi môn học", async () => {
  (SubjectService.getAll as jest.Mock).mockResolvedValue(mockSubjects);

  render(<SubjectListScreen />);

  await screen.findByLabelText(`edit-${mockSubjects[0].subject_id}`);

  for (const subject of mockSubjects) {
    expect(await screen.findByLabelText(`edit-${subject.subject_id}`)).toBeTruthy();
    expect(await screen.findByLabelText(`delete-${subject.subject_id}`)).toBeTruthy();
  }
});


});

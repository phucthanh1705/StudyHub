import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import SubmittedAssignmentDetailScreen from "../../../screens/Submission/SubmittedAssignmentDetailScreen";
import { Alert, Linking } from "react-native";

jest.mock("react-native-vector-icons/Ionicons", () => "Icon");

const mockGoBack = jest.fn();
const mockUseRoute = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => mockUseRoute(),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});
jest.spyOn(Linking, "openURL").mockResolvedValue(undefined as any);

describe("SubmittedAssignmentDetailScreen UI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({
      params: {
        submission: {
          submission_id: 1,
          assignment_title: "Bai tap 1",
          submitted_at: "2025-08-04T11:10:18.000Z",
          score: 10,
          feedback: "Tốt",
          content: "",
          drive_link: "http://example.com",
        },
      },
    });
  });

  it("hiển thị đầy đủ thông tin khi có submission", () => {
    render(<SubmittedAssignmentDetailScreen />);
    expect(screen.getByText("Bai tap 1")).toBeTruthy();
    const expectedSubmittedAt = `Nộp lúc: ${new Date("2025-08-04T11:10:18.000Z").toLocaleDateString()} ${new Date("2025-08-04T11:10:18.000Z").toLocaleTimeString()}`;
    expect(screen.getByText(expectedSubmittedAt)).toBeTruthy();
    expect(screen.getByText("Điểm: 10")).toBeTruthy();
    expect(screen.getByText("Đánh giá: Tốt")).toBeTruthy();
    expect(screen.getByText("Không có nội dung")).toBeTruthy();
    expect(
      screen.getByText("Hãy xem kỹ đánh giá để cải thiện bài làm của bạn!")
    ).toBeTruthy();
  });

  it("bấm nút back gọi navigation.goBack", () => {
    render(<SubmittedAssignmentDetailScreen />);
    fireEvent.press(screen.getByLabelText("back"));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it("bấm link Google Drive gọi Linking.openURL", () => {
    render(<SubmittedAssignmentDetailScreen />);
    fireEvent.press(screen.getByText("Mở bài nộp trên Google Drive"));
    expect(Linking.openURL).toHaveBeenCalledWith("http://example.com");
  });
});

describe("SubmittedAssignmentDetailScreen khi không có dữ liệu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoute.mockReturnValue({
      params: {},
    });
  });

  it("hiển thị thông báo khi không có submission", () => {
    render(<SubmittedAssignmentDetailScreen />);
    expect(screen.getByText("Không có thông tin bài nộp.")).toBeTruthy();
  });
});

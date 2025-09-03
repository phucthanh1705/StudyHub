import React from "react";
import { render, screen } from "@testing-library/react-native";
import AddSubjectScreen from "../../../screens/Subject/AddSubjectScreen";

// Mock navigation
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({
      goBack: jest.fn(),
    }),
  };
});

// Mock service
jest.mock("../../../services/subject.service", () => ({
  SubjectService: {
    create: jest.fn(),
  },
}));

describe("AddSubjectScreen UI", () => {
  it("Hiển thị đầy đủ các thành phần giao diện", () => {
    render(<AddSubjectScreen />);

    expect(screen.getByText("Thêm Môn Học")).toBeTruthy();

    expect(screen.getByText("Tên môn học")).toBeTruthy();
    expect(screen.getByText("Mô tả môn học")).toBeTruthy();

    expect(screen.getByPlaceholderText("Tên môn học")).toBeTruthy();
    expect(screen.getByPlaceholderText("Mô tả môn học")).toBeTruthy();

    expect(screen.getByText("Tạo môn học")).toBeTruthy();
  });
});

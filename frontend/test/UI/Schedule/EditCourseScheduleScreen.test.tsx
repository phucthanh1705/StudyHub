import React from "react";
import { render, screen } from "@testing-library/react-native";
import EditCourseScheduleScreen from "../../../screens/Schedule/EditCourseScheduleScreen";

jest.mock("../../../services/courseschedule.service", () => ({
  CourseScheduleService: {
    getByIdAdmin: jest.fn().mockResolvedValue({
      data: {
        schedule_id: 1,
        date: "2025-08-14T00:00:00Z",
        start_time: "07:30:00",
        end_time: "11:30:00",
        room: "online:123",
        note: "",
        course_id: 101,
      },
    }),
    update: jest.fn(),
  },
}));

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => ({ goBack: jest.fn() }),
    useRoute: () => ({
      params: { courseId: 101, scheduleId: 1 },
    }),
  };
});

describe("EditCourseScheduleScreen UI", () => {
  it("hiển thị đủ các ô nhập dữ liệu", async () => {
    render(<EditCourseScheduleScreen />);

    expect(await screen.findByText("2025-08-14")).toBeTruthy(); 
    expect(screen.getByText("07:30:00")).toBeTruthy(); 
    expect(screen.getByText("11:30:00")).toBeTruthy(); 

    expect(screen.getByDisplayValue("online:123")).toBeTruthy(); 
    expect(screen.getByDisplayValue("")).toBeTruthy(); 

    expect(screen.getByText("Lưu Lịch Này")).toBeTruthy();
  });
});

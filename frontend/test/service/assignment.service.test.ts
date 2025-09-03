import { AssignmentService } from "../../services/assignment.service";
import * as AssignmentAPI from "../../api/assignment.api";

jest.mock("../../api/assignment.api", () => ({
  getAssignmentsByLesson: jest.fn(),
  getAssignmentById: jest.fn(),
  createAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  deleteAssignment: jest.fn(),
}));

describe("Kiểm thử AssignmentService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============== GET ASSIGNMENTS BY LESSON ===============
  describe("getAssignmentsByLesson", () => {
    it("Trả về danh sách bài tập khi thành công", async () => {
      (AssignmentAPI.getAssignmentsByLesson as jest.Mock).mockResolvedValueOnce({
        data: [{ assignment_id: 1 }],
      });
      const result = await AssignmentService.getAssignmentsByLesson(1);
      expect(AssignmentAPI.getAssignmentsByLesson).toHaveBeenCalledWith(1);
      expect(result).toEqual([{ assignment_id: 1 }]);
    });

    it("Báo lỗi API thất bại", async () => {
      (AssignmentAPI.getAssignmentsByLesson as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy danh sách bài tập."));
      await expect(AssignmentService.getAssignmentsByLesson(1)).rejects.toThrow("Không thể lấy danh sách bài tập.");
    });
  });

  // =============== GET ASSIGNMENT BY ID ===============
  describe("getAssignmentById", () => {
    it("Trả về chi tiết bài tập khi thành công", async () => {
      (AssignmentAPI.getAssignmentById as jest.Mock).mockResolvedValueOnce({ data: { assignment_id: 2 } });
      const result = await AssignmentService.getAssignmentById(2);
      expect(AssignmentAPI.getAssignmentById).toHaveBeenCalledWith(2);
      expect(result).toEqual({ assignment_id: 2 });
    });

    it("Báo lỗi API thất bại", async () => {
      (AssignmentAPI.getAssignmentById as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy chi tiết bài tập."));
      await expect(AssignmentService.getAssignmentById(2)).rejects.toThrow("Không thể lấy chi tiết bài tập.");
    });
  });

  // =============== CREATE ASSIGNMENT ===============
  describe("createAssignment", () => {
    const newAssignment = {
      lesson_id: 1,
      title: "Bài tập mới",
      description: "Mô tả",
      due_date_start: "2025-08-01",
      due_date_end: "2025-08-10",
      link_drive: "http://drive.google.com",
    };

    it("Tạo bài tập thành công", async () => {
      (AssignmentAPI.createAssignment as jest.Mock).mockResolvedValueOnce({ data: { assignment_id: 3 } });
      const result = await AssignmentService.createAssignment(newAssignment);
      expect(AssignmentAPI.createAssignment).toHaveBeenCalledWith(newAssignment);
      expect(result).toEqual({ assignment_id: 3 });
    });

    it("Báo lỗi khi tạo thất bại", async () => {
      (AssignmentAPI.createAssignment as jest.Mock).mockRejectedValueOnce(new Error("Không thể tạo bài tập."));
      await expect(AssignmentService.createAssignment(newAssignment)).rejects.toThrow("Không thể tạo bài tập.");
    });
  });

  // =============== UPDATE ASSIGNMENT ===============
  describe("updateAssignment", () => {
    const updateData = { title: "Bài tập update", status: "done" };

    it("Cập nhật bài tập thành công", async () => {
      (AssignmentAPI.updateAssignment as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await AssignmentService.updateAssignment(4, updateData);
      expect(AssignmentAPI.updateAssignment).toHaveBeenCalledWith(4, updateData);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi cập nhật thất bại", async () => {
      (AssignmentAPI.updateAssignment as jest.Mock).mockRejectedValueOnce(new Error("Không thể cập nhật bài tập."));
      await expect(AssignmentService.updateAssignment(4, updateData)).rejects.toThrow("Không thể cập nhật bài tập.");
    });
  });

  // =============== DELETE ASSIGNMENT ===============
  describe("deleteAssignment", () => {
    it("Xóa bài tập thành công", async () => {
      (AssignmentAPI.deleteAssignment as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await AssignmentService.deleteAssignment(5);
      expect(AssignmentAPI.deleteAssignment).toHaveBeenCalledWith(5);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi xóa thất bại", async () => {
      (AssignmentAPI.deleteAssignment as jest.Mock).mockRejectedValueOnce(new Error("Không thể xóa bài tập."));
      await expect(AssignmentService.deleteAssignment(5)).rejects.toThrow("Không thể xóa bài tập.");
    });
  });
});
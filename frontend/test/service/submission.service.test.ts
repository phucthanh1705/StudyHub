import { SubmissionService } from "../../services/submission.service";
import * as SubmissionAPI from "../../api/submission.api";

jest.mock("../../api/submission.api", () => ({
  getSubmissionsByAssignment: jest.fn(),
  getSubmissionById: jest.fn(),
  createSubmission: jest.fn(),
  updateSubmission: jest.fn(),
  deleteSubmission: jest.fn(),
  gradeSubmission: jest.fn(),
  getSubmissionsByUser: jest.fn(),
}));

describe("Kiểm thử SubmissionService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============== GET SUBMISSIONS BY ASSIGNMENT ===============
  describe("getSubmissionsByAssignment", () => {
    it("Trả về danh sách bài nộp theo assignment", async () => {
      (SubmissionAPI.getSubmissionsByAssignment as jest.Mock).mockResolvedValueOnce({
        data: [{ submission_id: 1 }],
      });
      const result = await SubmissionService.getSubmissionsByAssignment(1);
      expect(SubmissionAPI.getSubmissionsByAssignment).toHaveBeenCalledWith(1);
      expect(result).toEqual([{ submission_id: 1 }]);
    });

    it("Báo lỗi API thất bại", async () => {
      (SubmissionAPI.getSubmissionsByAssignment as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy danh sách bài nộp."));
      await expect(SubmissionService.getSubmissionsByAssignment(1)).rejects.toThrow("Không thể lấy danh sách bài nộp.");
    });
  });

  // =============== GET SUBMISSION BY ID ===============
  describe("getSubmissionById", () => {
    it("Trả về chi tiết bài nộp", async () => {
      (SubmissionAPI.getSubmissionById as jest.Mock).mockResolvedValueOnce({
        data: { submission_id: 2 },
      });
      const result = await SubmissionService.getSubmissionById(2);
      expect(SubmissionAPI.getSubmissionById).toHaveBeenCalledWith(2);
      expect(result).toEqual({ submission_id: 2 });
    });

    it("Báo lỗi API thất bại", async () => {
      (SubmissionAPI.getSubmissionById as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy chi tiết bài nộp."));
      await expect(SubmissionService.getSubmissionById(2)).rejects.toThrow("Không thể lấy chi tiết bài nộp.");
    });
  });

  // =============== CREATE SUBMISSION ===============
  describe("createSubmission", () => {
    const newSubmission = {
      assignment_id: 1,
      content: "Nội dung bài nộp",
      drive_link: "http://drive.google.com",
    };

    it("Tạo bài nộp thành công", async () => {
      (SubmissionAPI.createSubmission as jest.Mock).mockResolvedValueOnce({ data: { submission_id: 3 } });
      const result = await SubmissionService.createSubmission(newSubmission);
      expect(SubmissionAPI.createSubmission).toHaveBeenCalledWith(newSubmission);
      expect(result).toEqual({ submission_id: 3 });
    });

    it("Báo lỗi tạo thất bại", async () => {
      (SubmissionAPI.createSubmission as jest.Mock).mockRejectedValueOnce(new Error("Không thể nộp bài."));
      await expect(SubmissionService.createSubmission(newSubmission)).rejects.toThrow("Không thể nộp bài.");
    });
  });

  // =============== UPDATE SUBMISSION ===============
  describe("updateSubmission", () => {
    const updateData = { content: "Update content", drive_link: "http://drive.com" };

    it("Cập nhật bài nộp thành công", async () => {
      (SubmissionAPI.updateSubmission as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await SubmissionService.updateSubmission(4, updateData);
      expect(SubmissionAPI.updateSubmission).toHaveBeenCalledWith(4, updateData);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi cập nhật thất bại", async () => {
      (SubmissionAPI.updateSubmission as jest.Mock).mockRejectedValueOnce(new Error("Không thể cập nhật bài nộp."));
      await expect(SubmissionService.updateSubmission(4, updateData)).rejects.toThrow("Không thể cập nhật bài nộp.");
    });
  });

  // =============== DELETE SUBMISSION ===============
  describe("deleteSubmission", () => {
    it("Xóa bài nộp thành công", async () => {
      (SubmissionAPI.deleteSubmission as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await SubmissionService.deleteSubmission(5);
      expect(SubmissionAPI.deleteSubmission).toHaveBeenCalledWith(5);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi xóa thất bại", async () => {
      (SubmissionAPI.deleteSubmission as jest.Mock).mockRejectedValueOnce(new Error("Không thể xóa bài nộp."));
      await expect(SubmissionService.deleteSubmission(5)).rejects.toThrow("Không thể xóa bài nộp.");
    });
  });

  // =============== GRADE SUBMISSION ===============
  describe("gradeSubmission", () => {
    const gradeData = { score: 9, feedback: "Tốt" };

    it("Chấm điểm bài nộp thành công", async () => {
      (SubmissionAPI.gradeSubmission as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await SubmissionService.gradeSubmission(6, gradeData);
      expect(SubmissionAPI.gradeSubmission).toHaveBeenCalledWith(6, gradeData);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi chấm điểm thất bại", async () => {
      (SubmissionAPI.gradeSubmission as jest.Mock).mockRejectedValueOnce(new Error("Không thể chấm điểm bài nộp."));
      await expect(SubmissionService.gradeSubmission(6, gradeData)).rejects.toThrow("Không thể chấm điểm bài nộp.");
    });
  });

  // =============== GET SUBMISSIONS BY USER ===============
  describe("getSubmissionsByUser", () => {
    it("Trả về danh sách bài nộp của user", async () => {
      (SubmissionAPI.getSubmissionsByUser as jest.Mock).mockResolvedValueOnce({ data: [{ submission_id: 7 }] });
      const result = await SubmissionService.getSubmissionsByUser();
      expect(SubmissionAPI.getSubmissionsByUser).toHaveBeenCalled();
      expect(result).toEqual([{ submission_id: 7 }]);
    });

    it("Trả về mảng rỗng nếu message tồn tại", async () => {
      (SubmissionAPI.getSubmissionsByUser as jest.Mock).mockResolvedValueOnce({ data: { message: "Không có bài nộp" } });
      const result = await SubmissionService.getSubmissionsByUser();
      expect(result).toEqual([]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (SubmissionAPI.getSubmissionsByUser as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy danh sách bài nộp của sinh viên."));
      await expect(SubmissionService.getSubmissionsByUser()).rejects.toThrow("Không thể lấy danh sách bài nộp của sinh viên.");
    });
  });
});

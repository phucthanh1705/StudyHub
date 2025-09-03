import { LessonService } from "../../services/lesson.service";
import * as LessonAPI from "../../api/lesson.api";

jest.mock("../../api/lesson.api", () => ({
  getAllLessons: jest.fn(),
  getLessonsByStudent: jest.fn(),
  getLessonById: jest.fn(),
  createLesson: jest.fn(),
  updateLesson: jest.fn(),
  deleteLesson: jest.fn(),
}));

describe("Kiểm thử LessonService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============== GET ALL LESSONS ===============
  describe("getAllLessons", () => {
    it("Trả về danh sách bài học thành công", async () => {
      (LessonAPI.getAllLessons as jest.Mock).mockResolvedValueOnce({ data: [{ lesson_id: 1 }] });
      const result = await LessonService.getAllLessons(1);
      expect(LessonAPI.getAllLessons).toHaveBeenCalledWith(1);
      expect(result).toEqual([{ lesson_id: 1 }]);
    });

    it("Báo lỗi API thất bại", async () => {
      (LessonAPI.getAllLessons as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy danh sách bài học."));
      await expect(LessonService.getAllLessons(1)).rejects.toThrow("Không thể lấy danh sách bài học.");
    });
  });

  // =============== GET LESSONS BY STUDENT ===============
  describe("getLessonsByStudent", () => {
    it("Trả về danh sách bài học của sinh viên", async () => {
      (LessonAPI.getLessonsByStudent as jest.Mock).mockResolvedValueOnce({
        data: [{ lesson_id: 2 }],
      });
      const result = await LessonService.getLessonsByStudent();
      expect(LessonAPI.getLessonsByStudent).toHaveBeenCalled();
      expect(result).toEqual([{ lesson_id: 2 }]);
    });

    it("Báo lỗi API thất bại", async () => {
      (LessonAPI.getLessonsByStudent as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy bài học cho sinh viên."));
      await expect(LessonService.getLessonsByStudent()).rejects.toThrow("Không thể lấy bài học cho sinh viên.");
    });
  });

  // =============== GET LESSON BY ID ===============
  describe("getLessonById", () => {
    it("Trả về chi tiết bài học", async () => {
      (LessonAPI.getLessonById as jest.Mock).mockResolvedValueOnce({ data: { lesson_id: 3 } });
      const result = await LessonService.getLessonById(3);
      expect(LessonAPI.getLessonById).toHaveBeenCalledWith(3);
      expect(result).toEqual({ lesson_id: 3 });
    });

    it("Báo lỗi API thất bại", async () => {
      (LessonAPI.getLessonById as jest.Mock).mockRejectedValueOnce(new Error("Không thể lấy chi tiết bài học."));
      await expect(LessonService.getLessonById(3)).rejects.toThrow("Không thể lấy chi tiết bài học.");
    });
  });

  // =============== CREATE LESSON ===============
  describe("createLesson", () => {
    it("Tạo bài học mới thành công", async () => {
      const newLesson = { title: "Test", content: "Content", course_id: 1 };
      (LessonAPI.createLesson as jest.Mock).mockResolvedValueOnce({ data: { lesson_id: 4 } });
      const result = await LessonService.createLesson(newLesson);
      expect(LessonAPI.createLesson).toHaveBeenCalled();
      expect(result).toEqual({ lesson_id: 4 });
    });

    it("Báo lỗi tạo thất bại", async () => {
      (LessonAPI.createLesson as jest.Mock).mockRejectedValueOnce(new Error("Không thể tạo bài học."));
      await expect(
        LessonService.createLesson({ title: "Test", content: "Content", course_id: 1 })
      ).rejects.toThrow("Không thể tạo bài học.");
    });
  });

  // =============== UPDATE LESSON ===============
  describe("updateLesson", () => {
    it("Cập nhật bài học thành công", async () => {
      const data = { title: "Updated", content: "Updated content" };
      (LessonAPI.updateLesson as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await LessonService.updateLesson(5, data);
      expect(LessonAPI.updateLesson).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi cập nhật thất bại", async () => {
      (LessonAPI.updateLesson as jest.Mock).mockRejectedValueOnce(new Error("Không thể cập nhật bài học."));
      await expect(
        LessonService.updateLesson(5, { title: "Updated", content: "Updated content" })
      ).rejects.toThrow("Không thể cập nhật bài học.");
    });
  });

  // =============== DELETE LESSON ===============
  describe("deleteLesson", () => {
    it("Xóa bài học thành công", async () => {
      (LessonAPI.deleteLesson as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await LessonService.deleteLesson(6);
      expect(LessonAPI.deleteLesson).toHaveBeenCalledWith(6);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi xóa thất bại", async () => {
      (LessonAPI.deleteLesson as jest.Mock).mockRejectedValueOnce(new Error("Không thể xoá bài học."));
      await expect(LessonService.deleteLesson(6)).rejects.toThrow("Không thể xoá bài học.");
    });
  });
});

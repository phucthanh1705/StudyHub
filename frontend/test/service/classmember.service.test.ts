import { ClassMemberService } from "../../services/classmember.service";
import { ClassMemberAPI } from "../../api/classmember.api";

jest.mock("../../api/classmember.api", () => ({
  ClassMemberAPI: {
    getAvailableCourses: jest.fn(),
    getMyClassMembers: jest.fn(),
    getByStatus: jest.fn(),
    addCourse: jest.fn(),
    removeCourse: jest.fn(),
    saveRegisterCourses: jest.fn(),
    payTuition: jest.fn(),
    getAllClassMembers: jest.fn(),
    getPaidList: jest.fn(),
    getStudentsByCourse: jest.fn(),
    getByStatusStrict: jest.fn(),
  },
}));

describe("Kiểm thử ClassMemberService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAvailableCourses", () => {
    it("Trả về danh sách khóa học khả dụng khi thành công", async () => {
      (ClassMemberAPI.getAvailableCourses as jest.Mock).mockResolvedValueOnce({
        data: { message: "OK", data: [{ course_id: 1 }] },
      });
      const result = await ClassMemberService.getAvailableCourses();
      expect(ClassMemberAPI.getAvailableCourses).toHaveBeenCalled();
      expect(result).toEqual({ message: "OK", data: [{ course_id: 1 }] });
    });

    it("Báo lỗi khi API thất bại", async () => {
      (ClassMemberAPI.getAvailableCourses as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể tải danh sách khóa học.")
      );
      await expect(ClassMemberService.getAvailableCourses()).rejects.toThrow(
        "Không thể tải danh sách khóa học."
      );
    });
  });

  describe("getMyClassMembers", () => {
    it("Trả về danh sách môn học của tôi", async () => {
      (ClassMemberAPI.getMyClassMembers as jest.Mock).mockResolvedValueOnce({
        data: [{ course_id: 2 }],
      });
      const result = await ClassMemberService.getMyClassMembers();
      expect(result).toEqual([{ course_id: 2 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (ClassMemberAPI.getMyClassMembers as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể tải giỏ môn học.")
      );
      await expect(ClassMemberService.getMyClassMembers()).rejects.toThrow(
        "Không thể tải giỏ môn học."
      );
    });
  });

  describe("getByStatus", () => {
    it("Trả về danh sách theo trạng thái", async () => {
      (ClassMemberAPI.getByStatus as jest.Mock).mockResolvedValueOnce({
        data: [{ course_id: 3 }],
      });
      const result = await ClassMemberService.getByStatus("paid");
      expect(ClassMemberAPI.getByStatus).toHaveBeenCalledWith("paid");
      expect(result).toEqual([{ course_id: 3 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (ClassMemberAPI.getByStatus as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể lọc môn học.")
      );
      await expect(ClassMemberService.getByStatus("paid")).rejects.toThrow(
        "Không thể lọc môn học."
      );
    });
  });

  describe("addCourse", () => {
    it("Thêm môn học thành công", async () => {
      (ClassMemberAPI.addCourse as jest.Mock).mockResolvedValueOnce({
        data: { success: true },
      });
      const result = await ClassMemberService.addCourse(10);
      expect(ClassMemberAPI.addCourse).toHaveBeenCalledWith(10);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi thêm thất bại", async () => {
      (ClassMemberAPI.addCourse as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể thêm môn học.")
      );
      await expect(ClassMemberService.addCourse(10)).rejects.toThrow(
        "Không thể thêm môn học."
      );
    });
  });

  describe("removeCourse", () => {
    it("Xóa môn học thành công", async () => {
      (ClassMemberAPI.removeCourse as jest.Mock).mockResolvedValueOnce({
        data: { success: true },
      });
      const result = await ClassMemberService.removeCourse(11);
      expect(ClassMemberAPI.removeCourse).toHaveBeenCalledWith(11);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi xóa thất bại", async () => {
      (ClassMemberAPI.removeCourse as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể xóa môn học.")
      );
      await expect(ClassMemberService.removeCourse(11)).rejects.toThrow(
        "Không thể xóa môn học."
      );
    });
  });

  describe("saveRegisterCourses", () => {
    it("Lưu môn học thành công", async () => {
      (ClassMemberAPI.saveRegisterCourses as jest.Mock).mockResolvedValueOnce({
        data: { success: true },
      });
      const result = await ClassMemberService.saveRegisterCourses();
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi lưu thất bại", async () => {
      (ClassMemberAPI.saveRegisterCourses as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể lưu giỏ môn học.")
      );
      await expect(ClassMemberService.saveRegisterCourses()).rejects.toThrow(
        "Không thể lưu giỏ môn học."
      );
    });
  });

  describe("payTuition", () => {
    it("Thanh toán thành công", async () => {
      (ClassMemberAPI.payTuition as jest.Mock).mockResolvedValueOnce({
        data: { success: true },
      });
      const result = await ClassMemberService.payTuition();
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi thanh toán thất bại", async () => {
      (ClassMemberAPI.payTuition as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể đóng học phí.")
      );
      await expect(ClassMemberService.payTuition()).rejects.toThrow(
        "Không thể đóng học phí."
      );
    });
  });

  describe("getAllClassMembers", () => {
    it("Trả về danh sách tất cả class members", async () => {
      (ClassMemberAPI.getAllClassMembers as jest.Mock).mockResolvedValueOnce({
        data: [{ register_id: 1 }],
      });
      const result = await ClassMemberService.getAllClassMembers();
      expect(result).toEqual([{ register_id: 1 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (ClassMemberAPI.getAllClassMembers as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể tải giỏ môn học admin.")
      );
      await expect(ClassMemberService.getAllClassMembers()).rejects.toThrow(
        "Không thể tải giỏ môn học admin."
      );
    });
  });

  describe("getPaidList", () => {
    it("Trả về danh sách đã thanh toán", async () => {
      (ClassMemberAPI.getPaidList as jest.Mock).mockResolvedValueOnce({
        data: { data: [{ register_id: 2 }] },
      });
      const result = await ClassMemberService.getPaidList();
      expect(result).toEqual([{ register_id: 2 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (ClassMemberAPI.getPaidList as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể tải danh sách đã thanh toán.")
      );
      await expect(ClassMemberService.getPaidList()).rejects.toThrow(
        "Không thể tải danh sách đã thanh toán."
      );
    });
  });
  describe("getStudentsByCourse", () => {
    it("Trả về danh sách sinh viên của khóa học khi thành công", async () => {
      const mockData = [{ student_id: 1, name: "Nguyễn Văn A" }];
      (ClassMemberAPI.getStudentsByCourse as jest.Mock).mockResolvedValueOnce({
        data: { data: mockData },
      });

      const result = await ClassMemberService.getStudentsByCourse(101);
      expect(ClassMemberAPI.getStudentsByCourse).toHaveBeenCalledWith(101);
      expect(result).toEqual(mockData);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (ClassMemberAPI.getStudentsByCourse as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể tải danh sách sinh viên của khóa học")
      );

      await expect(ClassMemberService.getStudentsByCourse(101)).rejects.toThrow(
        "Không thể tải danh sách sinh viên của khóa học"
      );
    });
  });
  describe("getByStatusStrict", () => {
    it("Trả về danh sách theo trạng thái (strict) khi thành công", async () => {
      const mockData = [{ course_id: 5 }];
      (ClassMemberAPI.getByStatusStrict as jest.Mock).mockResolvedValueOnce({
        data: mockData,
      });

      const result = await ClassMemberService.getByStatusStrict("active");
      expect(ClassMemberAPI.getByStatusStrict).toHaveBeenCalledWith("active");
      expect(result).toEqual(mockData);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (ClassMemberAPI.getByStatusStrict as jest.Mock).mockRejectedValueOnce(
        new Error("Không thể lọc môn học (strict).")
      );

      await expect(
        ClassMemberService.getByStatusStrict("active")
      ).rejects.toThrow("Không thể lọc môn học (strict).");
    });
  });
});

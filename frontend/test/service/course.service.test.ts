import { CourseService } from "../../services/course.service";
import {
  getAllCoursesAdminApi,
  getCourseByIdAdminApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  getAllCoursesStudentApi,
  getCourseByIdStudentApi,
  getCoursesForStudentApi,
  getMyAssignedCoursesApi,
  getCourseByIdTeacherApi,
} from "../../api/course.api";

jest.mock("../../api/course.api", () => ({
  getAllCoursesAdminApi: jest.fn(),
  getCourseByIdAdminApi: jest.fn(),
  createCourseApi: jest.fn(),
  updateCourseApi: jest.fn(),
  deleteCourseApi: jest.fn(),
  getAllCoursesStudentApi: jest.fn(),
  getCourseByIdStudentApi: jest.fn(),
  getCoursesForStudentApi: jest.fn(),
  getMyAssignedCoursesApi: jest.fn(),
  getCourseByIdTeacherApi: jest.fn(),
}));

describe("Kiểm thử CourseService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============== ADMIN ===============
  describe("getAllAdmin", () => {
    it("Trả về danh sách khóa học (Admin) thành công", async () => {
      (getAllCoursesAdminApi as jest.Mock).mockResolvedValueOnce({ data: [{ course_id: 1 }] });
      const result = await CourseService.getAllAdmin();
      expect(getAllCoursesAdminApi).toHaveBeenCalled();
      expect(result).toEqual([{ course_id: 1 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getAllCoursesAdminApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy danh sách khóa học (Admin) thất bại"));
      await expect(CourseService.getAllAdmin()).rejects.toThrow("Lấy danh sách khóa học (Admin) thất bại");
    });
  });

  describe("getByIdAdmin", () => {
    it("Trả về chi tiết khóa học (Admin) thành công", async () => {
      (getCourseByIdAdminApi as jest.Mock).mockResolvedValueOnce({ data: { course_id: 1 } });
      const result = await CourseService.getByIdAdmin(1);
      expect(getCourseByIdAdminApi).toHaveBeenCalledWith(1);
      expect(result).toEqual({ course_id: 1 });
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getCourseByIdAdminApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy chi tiết khóa học (Admin) thất bại"));
      await expect(CourseService.getByIdAdmin(1)).rejects.toThrow("Lấy chi tiết khóa học (Admin) thất bại");
    });
  });

  describe("create", () => {
    it("Tạo khóa học mới thành công", async () => {
      const data = { subject_id: 1, year: 2025 };
      (createCourseApi as jest.Mock).mockResolvedValueOnce({ data: { course_id: 10, ...data } });
      const result = await CourseService.create(data);
      expect(createCourseApi).toHaveBeenCalledWith(data);
      expect(result).toEqual({ course_id: 10, ...data });
    });

    it("Báo lỗi khi tạo thất bại", async () => {
      (createCourseApi as jest.Mock).mockRejectedValueOnce(new Error("Tạo khóa học thất bại"));
      await expect(CourseService.create({ subject_id: 1 })).rejects.toThrow("Tạo khóa học thất bại");
    });
  });

  describe("update", () => {
    it("Cập nhật khóa học thành công", async () => {
      const updateData = { year: 2026 };
      (updateCourseApi as jest.Mock).mockResolvedValueOnce({ data: { course_id: 1, ...updateData } });
      const result = await CourseService.update(1, updateData);
      expect(updateCourseApi).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual({ course_id: 1, ...updateData });
    });

    it("Báo lỗi khi cập nhật thất bại", async () => {
      (updateCourseApi as jest.Mock).mockRejectedValueOnce(new Error("Cập nhật khóa học thất bại"));
      await expect(CourseService.update(1, {})).rejects.toThrow("Cập nhật khóa học thất bại");
    });
  });

  describe("delete", () => {
    it("xóa khóa học thành công", async () => {
      (deleteCourseApi as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await CourseService.delete(1);
      expect(deleteCourseApi).toHaveBeenCalledWith(1);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi xóa thất bại", async () => {
      (deleteCourseApi as jest.Mock).mockRejectedValueOnce(new Error("Xóa khóa học thất bại"));
      await expect(CourseService.delete(1)).rejects.toThrow("Xóa khóa học thất bại");
    });
  });

  // =============== STUDENT ===============
  describe("getAllStudent", () => {
    it("Trả về danh sách khóa học (Student)", async () => {
      (getAllCoursesStudentApi as jest.Mock).mockResolvedValueOnce({ data: [{ course_id: 2 }] });
      const result = await CourseService.getAllStudent();
      expect(getAllCoursesStudentApi).toHaveBeenCalled();
      expect(result).toEqual([{ course_id: 2 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getAllCoursesStudentApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy danh sách khóa học (Student) thất bại"));
      await expect(CourseService.getAllStudent()).rejects.toThrow("Lấy danh sách khóa học (Student) thất bại");
    });
  });

  describe("getByIdStudent", () => {
    it("Trả về chi tiết khóa học (Student)", async () => {
      (getCourseByIdStudentApi as jest.Mock).mockResolvedValueOnce({ data: { course_id: 3 } });
      const result = await CourseService.getByIdStudent(3);
      expect(getCourseByIdStudentApi).toHaveBeenCalledWith(3);
      expect(result).toEqual({ course_id: 3 });
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getCourseByIdStudentApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy chi tiết khóa học (Student) thất bại"));
      await expect(CourseService.getByIdStudent(3)).rejects.toThrow("Lấy chi tiết khóa học (Student) thất bại");
    });
  });

  describe("getCoursesForStudent", () => {
    it("Trả về danh sách khóa học dành cho student", async () => {
      (getCoursesForStudentApi as jest.Mock).mockResolvedValueOnce({ data: [{ course_id: 4 }] });
      const result = await CourseService.getCoursesForStudent();
      expect(getCoursesForStudentApi).toHaveBeenCalled();
      expect(result).toEqual([{ course_id: 4 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getCoursesForStudentApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy danh sách khóa học (Student) thất bại"));
      await expect(CourseService.getCoursesForStudent()).rejects.toThrow("Lấy danh sách khóa học (Student) thất bại");
    });
  });

  // =============== TEACHER ===============
  describe("getMyCoursesTeacher", () => {
    it("Trả về danh sách khóa học của giáo viên", async () => {
      (getMyAssignedCoursesApi as jest.Mock).mockResolvedValueOnce({ data: [{ course_id: 5 }] });
      const result = await CourseService.getMyCoursesTeacher();
      expect(getMyAssignedCoursesApi).toHaveBeenCalled();
      expect(result).toEqual([{ course_id: 5 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getMyAssignedCoursesApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy danh sách khóa học (Teacher) thất bại"));
      await expect(CourseService.getMyCoursesTeacher()).rejects.toThrow("Lấy danh sách khóa học (Teacher) thất bại");
    });
  });

  describe("getByIdTeacher", () => {
    it("Trả về chi tiết khóa học của giáo viên", async () => {
      (getCourseByIdTeacherApi as jest.Mock).mockResolvedValueOnce({ data: { course_id: 6 } });
      const result = await CourseService.getByIdTeacher(6);
      expect(getCourseByIdTeacherApi).toHaveBeenCalledWith(6);
      expect(result).toEqual({ course_id: 6 });
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getCourseByIdTeacherApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy chi tiết khóa học (Teacher) thất bại"));
      await expect(CourseService.getByIdTeacher(6)).rejects.toThrow("Lấy chi tiết khóa học (Teacher) thất bại");
    });
  });
});

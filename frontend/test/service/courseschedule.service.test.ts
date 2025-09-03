import { CourseScheduleService } from "../../services/courseschedule.service";
import {
  getAllCourseSchedulesAdminApi,
  getCourseScheduleByIdAdminApi,
  updateCourseScheduleApi,
  deleteCourseScheduleApi,
  getCourseSchedulesByTeacherApi,
  getCourseSchedulesByStudentOneCourseApi,
  getSchedulesByStudentApi,
} from "../../api/courseschedule.api";

jest.mock("../../api/courseschedule.api", () => ({
  getAllCourseSchedulesAdminApi: jest.fn(),
  getCourseScheduleByIdAdminApi: jest.fn(),
  updateCourseScheduleApi: jest.fn(),
  deleteCourseScheduleApi: jest.fn(),
  getCourseSchedulesByTeacherApi: jest.fn(),
  getCourseSchedulesByStudentOneCourseApi: jest.fn(),
  getSchedulesByStudentApi: jest.fn(),
}));

describe("Kiểm thử CourseScheduleService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =============== ADMIN ===============
  describe("getAllAdmin", () => {
    it("Trả về danh sách lịch học (Admin) thành công", async () => {
      (getAllCourseSchedulesAdminApi as jest.Mock).mockResolvedValueOnce({ data: [{ schedule_id: 1 }] });
      const result = await CourseScheduleService.getAllAdmin();
      expect(getAllCourseSchedulesAdminApi).toHaveBeenCalled();
      expect(result).toEqual([{ schedule_id: 1 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getAllCourseSchedulesAdminApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy danh sách lịch học (Admin) thất bại"));
      await expect(CourseScheduleService.getAllAdmin()).rejects.toThrow("Lấy danh sách lịch học (Admin) thất bại");
    });
  });

  describe("getByIdAdmin", () => {
    it("Trả về chi tiết lịch học (Admin) thành công", async () => {
      (getCourseScheduleByIdAdminApi as jest.Mock).mockResolvedValueOnce({ data: { schedule_id: 2 } });
      const result = await CourseScheduleService.getByIdAdmin(2);
      expect(getCourseScheduleByIdAdminApi).toHaveBeenCalledWith(2);
      expect(result).toEqual({ schedule_id: 2 });
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getCourseScheduleByIdAdminApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy chi tiết lịch học (Admin) thất bại"));
      await expect(CourseScheduleService.getByIdAdmin(2)).rejects.toThrow("Lấy chi tiết lịch học (Admin) thất bại");
    });
  });

  describe("update", () => {
    it("Cập nhật lịch học thành công", async () => {
      const data = { room: "A101" };
      (updateCourseScheduleApi as jest.Mock).mockResolvedValueOnce({ data: { schedule_id: 3, ...data } });
      const result = await CourseScheduleService.update(3, data);
      expect(updateCourseScheduleApi).toHaveBeenCalledWith(3, data);
      expect(result).toEqual({ schedule_id: 3, ...data });
    });

    it("Báo lỗi khi cập nhật thất bại", async () => {
      (updateCourseScheduleApi as jest.Mock).mockRejectedValueOnce(new Error("Cập nhật lịch học thất bại"));
      await expect(CourseScheduleService.update(3, {})).rejects.toThrow("Cập nhật lịch học thất bại");
    });
  });

  describe("delete", () => {
    it("Xóa lịch học thành công", async () => {
      (deleteCourseScheduleApi as jest.Mock).mockResolvedValueOnce({ data: { success: true } });
      const result = await CourseScheduleService.delete(4);
      expect(deleteCourseScheduleApi).toHaveBeenCalledWith(4);
      expect(result).toEqual({ success: true });
    });

    it("Báo lỗi khi xóa thất bại", async () => {
      (deleteCourseScheduleApi as jest.Mock).mockRejectedValueOnce(new Error("Xoá lịch học thất bại"));
      await expect(CourseScheduleService.delete(4)).rejects.toThrow("Xoá lịch học thất bại");
    });
  });

  // =============== TEACHER ===============
  describe("getByTeacher", () => {
    it("Trả về danh sách lịch dạy của giáo viên", async () => {
      (getCourseSchedulesByTeacherApi as jest.Mock).mockResolvedValueOnce({ data: [{ schedule_id: 5 }] });
      const result = await CourseScheduleService.getByTeacher();
      expect(getCourseSchedulesByTeacherApi).toHaveBeenCalled();
      expect(result).toEqual([{ schedule_id: 5 }]);
    });

    it("Báo lỗi API thất bại", async () => {
      (getCourseSchedulesByTeacherApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy lịch dạy (Teacher) thất bại"));
      await expect(CourseScheduleService.getByTeacher()).rejects.toThrow("Lấy lịch dạy (Teacher) thất bại");
    });
  });

  // =============== STUDENT ===============
  describe("getByStudent", () => {
    it("Trả về danh sách lịch học của sinh viên", async () => {
      (getSchedulesByStudentApi as jest.Mock).mockResolvedValueOnce({ data: [{ schedule_id: 6 }] });
      const result = await CourseScheduleService.getByStudent(10);
      expect(getSchedulesByStudentApi).toHaveBeenCalledWith(10);
      expect(result).toEqual([{ schedule_id: 6 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getSchedulesByStudentApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy lịch học (Student) thất bại"));
      await expect(CourseScheduleService.getByStudent(10)).rejects.toThrow("Lấy lịch học (Student) thất bại");
    });
  });

  describe("getByStudentOneCourse", () => {
    it("Trả về lịch học của một môn học cho sinh viên", async () => {
      (getCourseSchedulesByStudentOneCourseApi as jest.Mock).mockResolvedValueOnce({
        data: [{ schedule_id: 7 }],
      });
      const result = await CourseScheduleService.getByStudentOneCourse(1, 10);
      expect(getCourseSchedulesByStudentOneCourseApi).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual([{ schedule_id: 7 }]);
    });

    it("Báo lỗi khi API thất bại", async () => {
      (getCourseSchedulesByStudentOneCourseApi as jest.Mock).mockRejectedValueOnce(new Error("Lấy lịch học 1 môn của sinh viên thất bại"));
      await expect(CourseScheduleService.getByStudentOneCourse(1, 10)).rejects.toThrow("Lấy lịch học 1 môn của sinh viên thất bại");
    });
  });
});

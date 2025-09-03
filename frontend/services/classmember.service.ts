import { ClassMemberAPI } from "../api/classmember.api";

export const ClassMemberService = {
  // Lấy lên những môn chưa học để đăng ký ở giỏ hàng
  async getAvailableCourses() {
    try {
      const res = await ClassMemberAPI.getAvailableCourses();
      // Trả về cả message và data
      return {
        message: res.data?.message || "",
        data: res.data?.data || res.data || [],
      };
    } catch (err: any) {
      console.error("[ClassMemberService] Error getAvailableCourses:", err);
      throw new Error(
        err.response?.data?.error || "Không thể tải danh sách khóa học."
      );
    }
  },

  async getMyClassMembers() {
    try {
      const res = await ClassMemberAPI.getMyClassMembers();
      return res.data;
    } catch (err: any) {
      console.error("[ClassMemberService] getMyClassMembers:", err);
      throw new Error(
        err.response?.data?.error || "Không thể tải giỏ môn học."
      );
    }
  },

  async getByStatus(status: string) {
    try {
      const res = await ClassMemberAPI.getByStatus(status);
      return res.data;
    } catch (err: any) {
      console.error("[ClassMemberService] getByStatus:", err);
      throw new Error(err.response?.data?.error || "Không thể lọc môn học.");
    }
  },

  async addCourse(course_id: number) {
    try {
      const res = await ClassMemberAPI.addCourse(course_id);
      return res.data;
    } catch (err: any) {
      console.error("[ClassMemberService] addCourse:", err);
      throw new Error(err.response?.data?.error || "Không thể thêm môn học.");
    }
  },

  async removeCourse(course_id: number) {
    try {
      const res = await ClassMemberAPI.removeCourse(course_id);
      return res.data;
    } catch (err: any) {
      console.error("[ClassMemberService] removeCourse:", err);
      throw new Error(err.response?.data?.error || "Không thể xóa môn học.");
    }
  },

  async saveRegisterCourses() {
    try {
      const res = await ClassMemberAPI.saveRegisterCourses();
      return res.data;
    } catch (err: any) {
      console.error("[ClassMemberService] saveRegisterCourses:", err);
      throw new Error(
        err.response?.data?.error || "Không thể lưu giỏ môn học."
      );
    }
  },

  async payTuition() {
    try {
      const res = await ClassMemberAPI.payTuition();
      return res.data;
    } catch (err: any) {
      console.error("[ClassMemberService] payTuition:", err);
      throw new Error(err.response?.data?.error || "Không thể đóng học phí.");
    }
  },

  async getAllClassMembers() {
    try {
      const res = await ClassMemberAPI.getAllClassMembers();
      return res.data;
    } catch (err: any) {
      console.error("[ClassMemberService] getAllClassMembers:", err);
      throw new Error(
        err.response?.data?.error || "Không thể tải giỏ môn học admin."
      );
    }
  },

  async getPaidList() {
    try {
      const res = await ClassMemberAPI.getPaidList();
      return res.data.data;
    } catch (err: any) {
      console.error("[ClassMemberService] Error getPaidList:", err);
      throw new Error("Không thể tải danh sách đã thanh toán.");
    }
  },

  async getStudentsByCourse(courseId: number) {
    try {
      const res = await ClassMemberAPI.getStudentsByCourse(courseId);
      return res.data.data;
    } catch (err: any) {
      console.error("[ClassMemberService] Error getStudentsByCourse:", err);
      throw new Error("Không thể tải danh sách sinh viên của khóa học");
    }
  },
  async getByStatusStrict(status: string) {
    try {
      const res = await ClassMemberAPI.getByStatusStrict(status);
      return res.data;
    } catch (err: any) {
      console.error("[ClassMemberService] getByStatusStrict:", err);
      throw new Error(
        err.response?.data?.error || "Không thể lọc môn học (strict)."
      );
    }
  },
};

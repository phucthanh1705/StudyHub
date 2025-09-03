import { RegisterCourseAPI } from "../api/registercourse.api";

export const RegisterCourseService = {
  // Admin: Tạo đăng ký học phần cho toàn bộ user
  async createForAll(data: {
    begin_register: string;
    end_register: string;
    year: number;
    semester: number;
  }) {
    try {
      const res = await RegisterCourseAPI.createForAll(data);
      return res.data;
    } catch (err: any) {
      console.error("[RegisterCourseService] Error createForAll:", err);
      throw new Error(err.response?.data?.error || "Không thể tạo đăng ký học phần.");
    }
  },

  // Admin: Lấy danh sách tất cả bản ghi
  async getAll() {
    try {
      const res = await RegisterCourseAPI.getAll();
      return res?.data || [];
    } catch (err: any) {
      console.error("[RegisterCourseService] Error getAll:", err);
      throw new Error(err.response?.data?.error || "Không thể lấy danh sách đăng ký học phần.");
    }
  },

  // Admin: Cập nhật thời gian đăng ký
  async updateRegisterTime(data: {
  begin: string;
  end: string;
  newBegin: string;
  newEnd: string;
}) {
  console.log("[SERVICE] Dữ liệu chuẩn bị gửi:", data);
  try {
    const res = await RegisterCourseAPI.updateRegisterTime(data);
    return res.data;
  } catch (err: any) {
    console.error("[SERVICE] Lỗi updateRegisterTime:", err);
    throw new Error(err.response?.data?.error || "Không thể cập nhật thời gian.");
  }
},

  // Sinh viên: Lấy thông tin đăng ký của chính mình
  async getMyRegisterCourse() {
    try {
      const res = await RegisterCourseAPI.getMyRegisterCourse();
      return res.data;
    } catch (err: any) {
      console.error("[RegisterCourseService] Error getMyRegisterCourse:", err);
      throw new Error(err.response?.data?.error || "Không thể lấy thông tin đăng ký.");
    }
  },

  // Lấy chi tiết đăng ký học phần theo ID
  async getById(id: number) {
    try {
      const res = await RegisterCourseAPI.getById(id);
      return res.data;
    } catch (err: any) {
      console.error("[RegisterCourseService] Error getById:", err);
      throw new Error(err.response?.data?.error || "Không thể lấy chi tiết đăng ký học phần.");
    }
  },

};

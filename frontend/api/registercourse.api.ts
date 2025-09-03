import api from "./axiosInstance";

const API_URL = "/api/registercourse";

export const RegisterCourseAPI = {
  // Admin: Tạo đăng ký học phần cho toàn bộ user
  createForAll: (data: {
    begin_register: string;
    end_register: string;
    year: number;
    semester: number;
  }) => {
    console.log("[API] POST", API_URL, data);
    return api.post(API_URL, data);
  },

  // Admin: Lấy danh sách tất cả bản ghi
  getAll: () => {
    console.log("[API] GET", API_URL);
    return api.get(API_URL);
  },

  // Admin: Cập nhật thời gian đăng ký
  updateRegisterTime: (data: {
    begin: string;
    end: string;
    newBegin: string;
    newEnd: string;
  }) => {
    console.log("[API] PUT", `${API_URL}/update-time`, data);
    console.log("[API BODY]", JSON.stringify(data, null, 2));
    return api.put(`${API_URL}/update-time`, data);
  },

  // Sinh viên: Lấy thông tin đăng ký của chính mình
  getMyRegisterCourse: () => {
    console.log("[API] GET", `${API_URL}/me`);
    return api.get(`${API_URL}/me`);
  },

  // Lấy chi tiết 1 đăng ký học phần theo ID
  getById: (id: number) => {
    console.log("[API] GET", `${API_URL}/${id}`);
    return api.get(`${API_URL}/${id}`);
  },

};

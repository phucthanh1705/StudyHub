import api from "./axiosInstance";

const API_URL = "/api/classmember";
const COURSE_URL = "/api/course/student/all-courses";

export const ClassMemberAPI = {
  // Lấy danh sách khóa học trong giỏ của sinh viên
  getMyClassMembers: () => {
    console.log("[API] GET", API_URL);
    return api.get(API_URL);
  },

  // Lọc giỏ môn học theo trạng thái
  getByStatus: (status: string) => {
    console.log("[API] GET", `${API_URL}/filter?status=${status}`);
    return api.get(`${API_URL}/filter?status=${status}`);
  },

  // Thêm môn học vào giỏ
  addCourse: (course_id: number) => {
    console.log("[API] POST", API_URL, { course_id });
    return api.post(API_URL, { course_id });
  },

  // Xóa môn học khỏi giỏ
  removeCourse: (course_id: number) => {
    console.log("[API] DELETE", API_URL, { data: { course_id } });
    return api.delete(API_URL, { data: { course_id } });
  },

  // Lưu giỏ môn học
  saveRegisterCourses: () => {
    console.log("[API] POST", `${API_URL}/save`);
    return api.post(`${API_URL}/save`);
  },

  // Đóng học phí
  payTuition: () => {
    console.log("[API] POST", `${API_URL}/pay`);
    return api.post(`${API_URL}/pay`);
  },

  // Admin: lấy tất cả giỏ môn học
  getAllClassMembers: () => {
    console.log("[API] GET", `${API_URL}/admin/all`);
    return api.get(`${API_URL}/admin/all`);
  },

  // Lấy danh sách những môn chưa học để đăng ký ở giỏ hàng
  getAvailableCourses: () => {
    console.log("[API] GET", COURSE_URL);
    return api.get(COURSE_URL);
  },

  // Lấy danh sách đã thanh toán
  getPaidList: () => {
    console.log("[API] GET", `${API_URL}/paid`);
    return api.get(`${API_URL}/paid`);
  },

  getStudentsByCourse: (courseId: number) => {
    console.log("[API] GET", `${API_URL}/teacher/${courseId}/students`);
    return api.get(`${API_URL}/teacher/${courseId}/students`);
  },
  getByStatusStrict: (status: string) => {
    console.log("[API] GET", `${API_URL}/filter-strict?status=${status}`);
    return api.get(`${API_URL}/filter-strict?status=${status}`);
  },
};

import api from "./axiosInstance";

// URL cho Course
const API_URL = "/api/course";

// Admin
// Lấy tất cả khóa học (Admin)
export const getAllCoursesAdminApi = async() => {
  return await api.get(`${API_URL}/admin/all`);
};

// Lấy chi tiết khóa học (Admin)
export const getCourseByIdAdminApi = (id: number) => {
  return api.get(`${API_URL}/admin/${id}`);
};

// Tạo mới khóa học (Admin)
export const createCourseApi = (data: any) => {
  return api.post(API_URL, data);
};

// Cập nhật khóa học (Admin)
export const updateCourseApi = (id: number, data: any) => {
  return api.put(`${API_URL}/${id}`, data);
};

// Xóa khóa học (Admin)
export const deleteCourseApi = (id: number) => {
  return api.delete(`${API_URL}/${id}`);
};

// Sinh viên
// Lấy tất cả khóa học (Student)
export const getAllCoursesStudentApi = () => {
  return api.get(`${API_URL}/student/all`);
};

// Lấy chi tiết khóa học (Student)
export const getCourseByIdStudentApi = (id: number) => {
  return api.get(`${API_URL}/student/${id}`);
};

// Lấy khóa học cho Student theo 3 điều kiện (mới)
export const getCoursesForStudentApi = async() => {
  return await api.get(`${API_URL}/student/courses`);
};

// Giảng viên
// Lấy các khóa học được phân công (Giảng viên)
export const getMyAssignedCoursesApi = () => {
  return api.get(`${API_URL}/teacher/my-courses`);
};

// Lấy chi tiết khóa học được dạy (Giảng viên)
export const getCourseByIdTeacherApi = (id: number) => {
  return api.get(`${API_URL}/teacher/course/${id}`);
};

import api from "./axiosInstance";

// Đường dẫn API của backend
const API_URL = "/api/subjects";

// Gọi API tạo môn học (Admin)
export const createSubjectApi = (data: any) => {
  return api.post(API_URL, data);
};

// Lấy tất cả môn học (Admin)
export const getAllSubjectsApi = () => {
  return api.get(API_URL);
};

// Lấy chi tiết môn học (Admin, Sinh viên, Giảng viên)
export const getSubjectByIdApi = (id: number) => {
  return api.get(`${API_URL}/${id}`);
};

// Cập nhật môn học (Admin)
export const updateSubjectApi = (id: number, data: any) => {
  return api.put(`${API_URL}/${id}`, data);
};

// Xóa môn học (Admin)
export const deleteSubjectApi = (id: number) => {
  return api.delete(`${API_URL}/${id}`);
};

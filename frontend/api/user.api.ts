import api from "./axiosInstance";

const API_URL = "/api/users";

// Lấy tất cả người dùng (Admin)
export const getAllUsersApi = () => {
  return api.get(API_URL);
};

// Lấy người dùng theo ID
export const getUserByIdApi = (id: number) => {
  return api.get(`${API_URL}/${id}`);
};

// Tạo người dùng mới (Admin)
export const createUserApi = (data: any) => {
  return api.post(API_URL, data);
};

// Cập nhật người dùng
export const updateUserApi = (id: number, data: any) => {
  return api.put(`${API_URL}/${id}`, data);
};

// Xóa người dùng
export const deleteUserApi = (id: number) => {
  return api.delete(`${API_URL}/${id}`);
};

// Lấy danh sách giảng viên (Admin)
export const getAllTeachersApi = () => {
  return api.get(`${API_URL}/teachers`);
};

// Lấy role của user theo user_id
export const getRoleByUserIdApi = (userId: number) => {
  console.log("[API] GET", `${API_URL}/${userId}/role`);
  return api.get(`${API_URL}/${userId}/role`);
};

import {
  getAllUsersApi,
  getUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getAllTeachersApi,
  getRoleByUserIdApi
} from "../api/user.api";

export const UserService = {
  // Lấy tất cả người dùng
  getAll: async () => {
    try {
      const response = await getAllUsersApi();
      return response.data;
    } catch (error: any) {
      console.log("Error getAll:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy danh sách người dùng thất bại");
    }
  },

  // Lấy người dùng theo ID
  getById: async (id: number) => {
    try {
      const response = await getUserByIdApi(id);
      return response.data;
    } catch (error: any) {
      console.log("Error getById:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy thông tin người dùng thất bại");
    }
  },

  // Tạo người dùng mới
  create: async (data: any) => {
    try {
      const response = await createUserApi(data);
      return response.data;
    } catch (error: any) {
      console.log("Error create:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Tạo người dùng thất bại");
    }
  },

  // Cập nhật người dùng
  update: async (id: number, data: any) => {
    try {
      const response = await updateUserApi(id, data);
      return response.data;
    } catch (error: any) {
      console.log("Error update:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Cập nhật người dùng thất bại");
    }
  },

  // Xóa người dùng
  delete: async (id: number) => {
    try {
      const response = await deleteUserApi(id);
      return response.data;
    } catch (error: any) {
      console.log("Error delete:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Xóa người dùng thất bại");
    }
  },

  // Lấy danh sách giảng viên
  getAllTeachers: async () => {
    try {
      const response = await getAllTeachersApi();
      return response.data?.data || response.data;
    } catch (error: any) {
      console.log("Error getAllTeachers:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy danh sách giảng viên thất bại");
    }
  },

  // Lấy role của user theo user_id
  getRoleByUserId: async (userId: number) => {
    try {
      const response = await getRoleByUserIdApi(userId);
      return response.data; // { role: "teacher" hoặc "student" }
    } catch (error: any) {
      console.log("Error getRoleByUserId:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy role người dùng thất bại");
    }
  },
};

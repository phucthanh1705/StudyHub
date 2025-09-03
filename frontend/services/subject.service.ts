import {
  createSubjectApi,
  getAllSubjectsApi,
  getSubjectByIdApi,
  updateSubjectApi,
  deleteSubjectApi,
} from "../api/subject.api";

export const SubjectService = {
  create: async (data: any) => {
    try {
      const response = await createSubjectApi(data);
      return response.data;
    } catch (error: any) {
      //console.log("Error create subject:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Tạo môn học thất bại");
    }
  },

  getAll: async () => {
    try {
      const response = await getAllSubjectsApi();
      return response.data;
    } catch (error: any) {
      //console.log("Error fetching subjects:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy danh sách môn học thất bại");
    }
  },

  getById: async (id: number) => {
    try {
      const response = await getSubjectByIdApi(id);
      return response.data;
    } catch (error: any) {
      //console.log("Error get subject by id:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy thông tin môn học thất bại");
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await updateSubjectApi(id, data);
      return response.data;
    } catch (error: any) {
      //console.log("Error update subject:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Cập nhật môn học thất bại");
    }
  },

  delete: async (id: number) => {
    try {
      const response = await deleteSubjectApi(id);
      return response.data;
    } catch (error: any) {
      //console.log("Error delete subject:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Xóa môn học thất bại");
    }
  },
};

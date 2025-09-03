import api from "./axiosInstance";

const API_URL = "/api/assignment";

// Lấy tất cả assignment của một lesson
export const getAssignmentsByLesson = (lessonId: number) => {
  console.log(`[API] GET ${API_URL}/lesson/${lessonId}`);
  return api.get(`${API_URL}/lesson/${lessonId}`);
};

// Lấy chi tiết assignment theo ID
export const getAssignmentById = (id: number) => {
  console.log(`[API] GET ${API_URL}/${id}`);
  return api.get(`${API_URL}/${id}`);
};

// Thêm assignment
export const createAssignment = (data: {
  lesson_id: number;
  title: string;
  description?: string;
  due_date_start: string;
  due_date_end: string;
  link_drive?: string;
}) => {
  console.log("[API] POST", API_URL, data);
  return api.post(API_URL, data);
};

// Cập nhật assignment
export const updateAssignment = (
  id: number,
  data: {
    title?: string;
    description?: string;
    due_date_start?: string;
    due_date_end?: string;
    link_drive?: string;
    status?: string;
  }
) => {
  console.log(`[API] PUT ${API_URL}/${id}`, data);
  return api.put(`${API_URL}/${id}`, data);
};

// Xóa assignment
export const deleteAssignment = (id: number) => {
  console.log(`[API] DELETE ${API_URL}/${id}`);
  return api.delete(`${API_URL}/${id}`);
};
